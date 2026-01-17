# 課程評鑑查詢系統

一個使用 React + Google Apps Script + Google Sheets 建立的課程評鑑查詢系統，提供直覺的介面讓使用者搜尋和瀏覽課程評價。

## ✨ 功能特色

- 🔐 **登入系統** - 安全的帳號密碼驗證
- 🔍 **智慧搜尋** - 支援模糊搜尋，多條件篩選（課程名稱、教師、年分、分類）
- 📊 **數據可視化** - 長條圖和雷達圖展示課程評分（甜度、涼度、有料程度）
- 💬 **評價展示** - 卡片式滑動瀏覽修課心得
- 🔥 **熱門推薦** - 基於瀏覽次數的熱門課程推薦
- 🎲 **隨機推薦** - 探索隨機課程
- 📱 **響應式設計** - 支援桌面和行動裝置
- 🎨 **現代化 UI** - 漸層、動畫、深色模式支援

## 🏗️ 技術架構

### 前端
- **框架**: React 18 + Vite
- **路由**: React Router v6
- **圖表**: Recharts
- **HTTP 客戶端**: Axios
- **樣式**: Vanilla CSS（含 CSS 變數和現代化設計系統）

### 後端
- **平台**: Google Apps Script
- **資料庫**: Google Sheets
- **API**: RESTful API

### 部署
- **前端**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📋 環境需求

- Node.js 18+ 和 npm
- Google 帳號（用於 Google Sheets 和 Apps Script）
- Git

## 🚀 快速開始

### 1. 設定 Google Sheets

建立一個 Google Sheets，包含以下分頁：

#### 「帳號密碼」分頁
| 帳號 | 密碼 | 姓名 |
|------|------|------|
| user1 | pass1 | 張三 |

#### 「評鑑資料庫」分頁
| 課程母分類 | 課程子分類 | 課程名稱 | 授課教師 | 修課時間 | 甜度 | 涼度 | 有料程度 | 評價與修課指引 |
|-----------|-----------|---------|---------|---------|------|------|----------|---------------|
| 通識 | 人文 | 哲學概論 | 王老師 | 2023 | 8 | 7 | 9 | 很棒的課程... |

**注意**：「瀏覽記錄」分頁會自動建立，無需手動新增。

### 2. 部署 Google Apps Script

1. 前往 [Google Apps Script](https://script.google.com/)
2. 建立新專案
3. 複製 `backend/Config.gs` 和 `backend/Code.gs` 的內容到專案中
4. 在 `Config.gs` 中設定你的 Google Sheets ID
5. 部署為 Web App（執行身分：我，存取權限：任何人）
6. 複製部署的 Web App URL

詳細步驟請參考 [`backend/README.md`](backend/README.md)

### 3. 設定前端

1. Clone 此專案：
```bash
git clone <your-repo-url>
cd Course_Evaluation
```

2. 安裝依賴：
```bash
npm install
```

3. 設定 API URL：
編輯 `src/config.js`，將 `API_BASE_URL` 替換為你的 Google Apps Script Web App URL

4. 設定 GitHub Pages 路徑：
編輯 `vite.config.js`，將 `base` 設定為你的 GitHub repo 名稱（例如：`/Course_Evaluation/`）

### 4. 本地開發

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173`

### 5. 部署到 GitHub Pages

1. 推送程式碼到 GitHub：
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. 在 GitHub repo 設定中：
   - 前往 Settings > Pages
   - Source 選擇 "GitHub Actions"

3. GitHub Actions 會自動建置和部署

4. 訪問 `https://<your-username>.github.io/Course_Evaluation/`

## 📁 專案結構

```
Course_Evaluation/
├── backend/                  # Google Apps Script 後端
│   ├── Code.gs              # 主要 API 程式碼
│   ├── Config.gs            # 配置檔案
│   └── README.md            # 後端設定說明
├── src/                     # React 前端原始碼
│   ├── components/          # React 組件
│   │   ├── CourseCard.jsx   # 課程卡片
│   │   ├── DataVisualization.jsx  # 數據可視化
│   │   └── ReviewCard.jsx   # 評價卡片
│   ├── pages/               # 頁面組件
│   │   ├── LoginPage.jsx    # 登入頁面
│   │   ├── SearchPage.jsx   # 搜尋頁面
│   │   └── CourseDetailPage.jsx  # 課程詳情頁面
│   ├── services/            # 服務層
│   │   └── api.js           # API 呼叫封裝
│   ├── config.js            # 前端配置
│   ├── App.jsx              # 主應用程式
│   ├── main.jsx             # 應用程式入口
│   └── index.css            # 全域樣式
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml           # 自動部署設定
├── package.json             # 專案依賴
├── vite.config.js           # Vite 配置
└── README.md                # 本檔案
```

## 🔧 維護指南

### 更換 Google Sheets

1. 編輯 `backend/Config.gs` 中的 `SPREADSHEET_ID`
2. 重新部署 Google Apps Script

詳細說明請參考 [`MAINTENANCE.md`](MAINTENANCE.md)

### 調整搜尋參數

在 `backend/Config.gs` 中可調整：
- `MIN_SIMILARITY` - 模糊搜尋相似度閾值（0-1）
- `MAX_RESULTS` - 最多回傳結果數量

### 調整推薦數量

在 `backend/Config.gs` 中可調整：
- `HOT_COURSES_COUNT` - 熱門課程推薦數量
- `RANDOM_COURSES_COUNT` - 隨機推薦數量

## 🎨 自訂樣式

全域樣式定義在 `src/index.css`，使用 CSS 變數系統，可輕鬆調整：
- 色彩主題
- 間距系統
- 圓角大小
- 動畫速度

## 📝 API 文件

詳細 API 說明請參考 [`backend/README.md`](backend/README.md)

## ⚠️ 注意事項

- 密碼目前以明文儲存在 Google Sheets 中，建議僅用於內部或小規模使用
- Google Apps Script 有每日配額限制，請參考 [Google Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)
- 建議定期備份 Google Sheets 資料

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

© 2026 課程評鑑查詢系統
