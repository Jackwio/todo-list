const STORAGE_KEY = "kanban-todo-list-v1";
const STATUSES = ["todo", "doing", "done"];

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const descriptionInput = document.querySelector("#task-description");
const clearButton = document.querySelector("#clear-storage");
const template = document.querySelector("#task-card-template");
const dropzones = [...document.querySelectorAll(".dropzone")];
const countBadges = [...document.querySelectorAll("[data-count-for]")];

let tasks = loadTasks();
let draggedTaskId = null;

renderBoard();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    titleInput.focus();
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    timeline: createTimeline("todo")
  });

  persistTasks();
  renderBoard();
  form.reset();
  titleInput.focus();
});

clearButton.addEventListener("click", () => {
  if (!window.confirm("確定要清除所有任務嗎？")) {
    return;
  }

  tasks = [];
  persistTasks();
  renderBoard();
});

dropzones.forEach((zone) => {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("drag-over");

    if (!draggedTaskId) {
      return;
    }

    const targetStatus = zone.dataset.status;
    const afterElement = getDragAfterElement(zone, event.clientY);
    const sourceIndex = tasks.findIndex((task) => task.id === draggedTaskId);

    if (sourceIndex === -1 || !targetStatus) {
      return;
    }

    const [movedTask] = tasks.splice(sourceIndex, 1);
    applyStatusChange(movedTask, targetStatus);

    const siblings = tasks.filter((task) => task.status === targetStatus);
    const insertAt = afterElement
      ? siblings.findIndex((task) => task.id === afterElement.dataset.taskId)
      : siblings.length;

    const absoluteIndex = findAbsoluteInsertIndex(targetStatus, insertAt);
    tasks.splice(absoluteIndex, 0, movedTask);

    persistTasks();
    renderBoard();
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const card = button.closest("[data-task-id]");
  const taskId = card?.dataset.taskId;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  if (button.dataset.action === "delete") {
    tasks = tasks.filter((item) => item.id !== taskId);
    persistTasks();
    renderBoard();
    return;
  }

  if (button.dataset.action === "edit") {
    const nextTitle = window.prompt("編輯任務標題", task.title);
    if (nextTitle === null) {
      return;
    }

    const trimmedTitle = nextTitle.trim();
    if (!trimmedTitle) {
      window.alert("任務標題不能是空的。");
      return;
    }

    const nextDescription = window.prompt("編輯任務內容", task.description);
    if (nextDescription === null) {
      return;
    }

    task.title = trimmedTitle;
    task.description = nextDescription.trim();
    persistTasks();
    renderBoard();
  }
});

function renderBoard() {
  dropzones.forEach((zone) => {
    const status = zone.dataset.status;
    const items = tasks.filter((task) => task.status === status);

    zone.replaceChildren(...items.map(createTaskCard));
    zone.classList.toggle("empty", items.length === 0);
  });

  countBadges.forEach((badge) => {
    const status = badge.dataset.countFor;
    badge.textContent = String(tasks.filter((task) => task.status === status).length);
  });
}

function createTaskCard(task) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".task-card");
  const title = fragment.querySelector(".task-title");
  const description = fragment.querySelector(".task-description");
  const timeline = fragment.querySelector(".task-timeline");

  card.dataset.taskId = task.id;
  title.textContent = task.title;
  description.textContent = task.description || "沒有補充內容";
  timeline.replaceChildren(...createTimelineNodes(task.timeline));

  card.addEventListener("dragstart", () => {
    draggedTaskId = task.id;
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    draggedTaskId = null;
    card.classList.remove("dragging");
  });

  return card;
}

function loadTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultTasks();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return defaultTasks();
    }

    return parsed
      .filter((task) => task && typeof task === "object" && STATUSES.includes(task.status))
      .map((task) => ({
        id: String(task.id),
        title: String(task.title ?? "").trim(),
        description: String(task.description ?? "").trim(),
        status: task.status,
        createdAt: task.createdAt || new Date().toISOString(),
        timeline: normalizeTimeline(task)
      }))
      .filter((task) => task.title);
  } catch {
    return defaultTasks();
  }
}

function persistTasks() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function defaultTasks() {
  return [];
}

function formatDate(isoString) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoString));
}

function getDragAfterElement(container, y) {
  const draggableCards = [...container.querySelectorAll(".task-card:not(.dragging)")];

  return draggableCards.reduce((closest, card) => {
    const box = card.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: card };
    }

    return closest;
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

function findAbsoluteInsertIndex(status, positionInStatus) {
  if (positionInStatus <= 0) {
    const firstIndex = tasks.findIndex((task) => task.status === status);
    return firstIndex === -1 ? tasks.length : firstIndex;
  }

  let seen = 0;
  for (let index = 0; index < tasks.length; index += 1) {
    if (tasks[index].status !== status) {
      continue;
    }

    if (seen === positionInStatus) {
      return index;
    }

    seen += 1;
  }

  return tasks.length;
}

function createTimeline(status) {
  const now = new Date().toISOString();
  return {
    startedAt: now,
    doingAt: status === "doing" || status === "done" ? now : null,
    doneAt: status === "done" ? now : null
  };
}

function normalizeTimeline(task) {
  const createdAt = task.createdAt || new Date().toISOString();
  const existingTimeline = task.timeline && typeof task.timeline === "object" ? task.timeline : {};

  return {
    startedAt: existingTimeline.startedAt || task.startedAt || createdAt,
    doingAt: existingTimeline.doingAt || task.doingAt || null,
    doneAt: existingTimeline.doneAt || task.doneAt || null
  };
}

function applyStatusChange(task, nextStatus) {
  if (task.status === nextStatus) {
    return;
  }

  task.status = nextStatus;
  task.timeline = normalizeTimeline(task);

  if (nextStatus === "doing" && !task.timeline.doingAt) {
    task.timeline.doingAt = new Date().toISOString();
  }

  if (nextStatus === "done") {
    if (!task.timeline.doneAt) {
      task.timeline.doneAt = new Date().toISOString();
    }
  }
}

function createTimelineNodes(timeline) {
  const entries = [
    { label: "開始", value: timeline?.startedAt },
    { label: "移到 Doing", value: timeline?.doingAt },
    { label: "移到 Done", value: timeline?.doneAt }
  ].filter((entry) => entry.value);

  return entries.map((entry) => {
    const row = document.createElement("div");
    const label = document.createElement("span");
    const value = document.createElement("time");

    row.className = "task-timeline-item";
    label.className = "task-timeline-label";
    label.textContent = `${entry.label}:`;
    value.dateTime = entry.value;
    value.textContent = formatDate(entry.value);

    row.append(label, value);
    return row;
  });
}
