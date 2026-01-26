# 📚 課程指引與評鑑查詢系統 (Course Evaluation System)
**版本：20260126.3v**

本系統是專為長庚中醫系打造的課程經驗傳承平台，採用 React 前端、Google Apps Script (GAS) 後端與 Google Sheets 資料庫的輕量化架構。

---

## ✨ 核心功能
- � **穿透式存取**：支援免登入直接撰寫評鑑，極大化經驗蒐集效率。
- 🔍 **智慧課程檢索**：支援模糊搜尋、類別篩選與熱門課程推薦。
- 📊 **多維度視覺化**：透過甜度、涼度、紮實度雷達圖，一眼看穿課程本質。
- ✍️ **動態評鑑流程**：智慧連動課程與教師資料，提供防呆檢查與撰寫指引。
- �️ **管理審核機制**：後端具備自動驗證與一鍵發佈功能，確保內容品質。

---

## 🏗️ 技術架構與模組

### 前端 (Frontend)
- **框架**：React 18 + Vite
- **圖表**：Recharts (SVG 數據可视化)
- **部署**：GitHub Pages + Actions 自動自動化部署

### 後端 (Backend / Database)
- **核心**：Google Apps Script (RESTful API)
- **儲存**：Google Sheets (關聯式資料管理)
- **自動化工具**：
    - **Python Crawler**：自動抓取校務系統最新課程資訊。
    - **Python Builder**：自動建置符合系統規範的資料庫結構。
    - **GAS Manager**：處理即時資料驗證、顏色標記與審核轉移邏輯。

---

## 📁 專案目錄結構

```text
Course_Evaluation/
├── src/                    # 前端原始碼
│   ├── components/         # 共用組件 (成功彈窗、撰寫指引等)
│   ├── pages/              # 頁面邏輯 (搜尋、詳情、提交評鑑)
│   └── services/           # API 對接服務
├── backend/                # 後端資產
│   ├── Code.gs             # API 主體程式碼
│   ├── Config.gs           # API 私密配置
│   ├── gas/                # 資料庫管理工具 (GAS 版)
│   │   └── database_manager.gs
│   └── scripts/            # 自動化維護腳本 (Python 版)
│       ├── data_crawler.py   # 自動抓取課程資料
│       └── sheets_builder.py # 自動建立試算表模板
├── public/                 # 靜態資源
└── USER_MANUAL.md          # 使用者操作手冊 (可編輯)
```

---

## �快速啟動與維護流程

### 1. 資料初始化
維護者應優先使用 `backend/scripts/sheets_builder.py` 建立本地 Excel 模板，並匯入至 Google Sheets 中。

### 2. 資料更新
每學期初，執行 `backend/scripts/data_crawler.py` 抓取最新學期的課程清單，並更新至「課程資料庫」分頁。

### 3. API 部署
將 `backend/Code.gs` 與 `Config.gs` 貼入 Google Apps Script 專案並「部署為網頁應用程式」，將產生的 URL 更新至 `src/config.js`。

### 4. 內容審核
進入 Google Sheet 的「課程評鑑回覆」分頁，確認心得內容後勾選「核准並移動」，GAS 將自動完成資料轉移。

---

## �️ 維護指南與開發建議
詳情請參閱各目錄下的 README：
- [後端與自動化腳本說明](./backend/README.md)
- [使用者詳細操作指南](./USER_MANUAL.md)

---

© 2026 長庚中醫系學會所有
