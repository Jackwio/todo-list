# 📋 Kanban To Do List

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Static Badge](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E)
![No Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen)

## 簡介

**Kanban To Do List** 是一個輕量級、無後端的任務管理應用，採用經典的看板（Kanban）工作流模式。所有資料完全儲存在瀏覽器的 `localStorage` 中，無需伺服器，開箱即用。

本專案解決了開發者和團隊成員快速管理日常任務的需求，提供直觀的拖拽介面與持久化儲存能力。

---

## ✨ 核心功能

- 🎯 **三欄看板工作流** — 任務自動分類為「To Do」、「Doing」、「Done」三個狀態
- 🖱️ **拖拽式操作** — 拖移卡片在三個欄位間流動，直觀管理任務狀態
- 💾 **瀏覽器本地儲存** — 所有資料儲存在 `localStorage`，刷新不遺失，隱私優先
- ✏️ **快速編輯與刪除** — 支援修改任務內容，一鍵移除不需要的任務
- 📊 **實時計數統計** — 各欄位任務數量即時顯示，掌握進度概況
- 🎨 **專業簡約設計** — 現代化 UI，支援任意解析度，提供優秀的使用體驗
- 📱 **響應式佈局** — 完美適配桌面、平板與行動裝置

---

## 🚀 快速開始

### 環境需求

- 現代瀏覽器（Chrome、Firefox、Safari、Edge 等）
- 不需要安裝任何依賴或開發工具

### 使用方式

1. **開啟應用**
   ```bash
   # 直接在瀏覽器中開啟 index.html
   open index.html
   ```
   或雙擊 `index.html` 檔案即可。

2. **新增任務**
   - 在頁面上方的表單輸入「任務標題」（必填）和「任務內容」（選填）
   - 點擊「新增任務」按鈕，任務自動出現在「To Do」欄位

3. **管理任務狀態**
   - 拖動任務卡片到其他欄位：
     - **To Do** — 待處理的任務
     - **Doing** — 進行中的任務
     - **Done** — 已完成的任務

4. **編輯與刪除**
   - 點擊任務卡片上的「編輯」按鈕修改內容
   - 點擊「刪除」按鈕移除任務

5. **清除全部資料**
   - 點擊「清除全部資料」按鈕（會有確認提示）

---

## 🏗️ 專案架構

### 目錄結構

```
todo-list/
├── index.html          # HTML 主頁面結構
├── app.js              # JavaScript 應用邏輯核心
├── styles.css          # CSS 樣式設定
├── LICENSE             # MIT 授權條款
└── README.md           # 本檔案
```

### 核心設計邏輯

**資料流向：**

```
使用者操作 → DOM 事件監聽 → 狀態更新 → 持久化至 localStorage → 視圖重新渲染
```

**關鍵設計決策：**

1. **Local-First 架構**
   - 所有狀態儲存在瀏覽器 `localStorage`，實現隱私保護與即時可用
   - 無網路依賴，純客戶端運作

2. **事件驅動的互動**
   - 使用原生 DOM 事件（`submit`、`dragover`、`drop`、`click`）
   - 避免外部框架依賴，保持核心精簡

3. **任務卡片管理**
   - 每個任務包含：唯一 ID、標題、描述、狀態、建立時間、時間軸資料
   - 支援任意順序排列與狀態轉換

4. **拖拽系統**
   - 實現 HTML5 Drag & Drop API
   - 自動計算目標位置，支援任意順序插入

### 檔案說明

| 檔案 | 功能 |
|------|------|
| `index.html` | 定義頁面結構與表單、看板欄位、任務卡片樣板 |
| `app.js` | 核心邏輯：任務管理、拖拽處理、localStorage 持久化、DOM 更新 |
| `styles.css` | 現代化樣式：漸層背景、玻璃態效果、網格佈局、深色/淺色配色 |

---

## 🛠️ 技術規範

### 開發工具與依賴

- **語言**
  - HTML 5
  - CSS 3（含 Grid、Flexbox、Custom Properties）
  - JavaScript ES6+（原生，無框架）

- **瀏覽器 API**
  - `localStorage` — 本地持久化儲存
  - `Fetch API` — 備用資料通信（未來擴展用）
  - `Drag & Drop API` — 任務卡片拖拽
  - `crypto.randomUUID()` — 任務唯一識別
  - `Template Element` — 動態卡片渲染

- **無外部依賴**
  - 零 npm 依賴，無需構建工具
  - 直接在瀏覽器運行

### 功能模組

| 模組 | 職責 |
|------|------|
| 表單提交 | 驗證輸入、建立任務、更新 DOM |
| 拖拽系統 | 監聽拖拽事件、計算插入位置、更新任務狀態 |
| 事件委派 | 統一處理編輯、刪除等操作 |
| 儲存層 | `localStorage` 讀寫與資料序列化 |
| 渲染引擎 | 使用樣板克隆動態生成 DOM |

---

## 📝 貢獻指南

我們歡迎社群的貢獻！如果你想改進此專案，請遵循以下步驟：

1. **Fork 本儲存庫**
2. **建立功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **提交變更**
   ```bash
   git commit -m "feat: 新增功能描述"
   ```
4. **推送至 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **提交 Pull Request**
   - 描述你的變更與動機
   - 確保程式碼風格一致

### 貢獻方向

- 🎨 UI/UX 改進
- 🐛 Bug 修復
- ⚡ 性能優化
- 📖 文件完善
- 🌍 多語言支援

---

## 📄 授權

本專案採用 **MIT License** 授權。詳見 [LICENSE](LICENSE) 檔案。

你可以自由使用、修改和分發本軟體，唯需保留原始著作權聲明。

```
MIT License

Copyright (c) 2026 Jackwio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 🙋 其他資訊

- **作者** — Jackwio
- **版本** — 1.0.0
- **狀態** — 正在開發中
- **最後更新** — 2026 年

有任何問題或建議？歡迎提交 Issue 或 Discussion！
