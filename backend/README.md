# Google Apps Script 後端設定說明

## 概述
這個資料夾包含課程評鑑系統的後端程式碼，使用 Google Apps Script 實作。

## 檔案說明
- `Code.gs` - 主要程式碼，包含所有 API 端點
- `Config.gs` - 配置檔案，包含 Google Sheets ID 等設定

## 設定步驟

### 1. 建立 Google Apps Script 專案
1. 前往 [Google Apps Script](https://script.google.com/)
2. 點擊「新專案」
3. 將專案命名為「課程評鑑系統API」

### 2. 複製程式碼
1. **建立 Config.gs**：
   - 在 Apps Script 編輯器中，點擊「檔案」>「新增」>「指令碼」
   - 將新檔案命名為 `Config`
   - 將本資料夾中的 `Config.gs` 內容完整複製到這個檔案中

2. **編輯 Code.gs**：
   - 刪除預設 `Code.gs` 的內容
   - 將本資料夾中的 `Code.gs` 內容完整複製進去

**重要**：這兩個檔案必須分開，不要合併在一起！

### 3. 設定 Google Sheets ID
1. 開啟你的 Google Sheets
2. 從網址列複製 Spreadsheet ID
   - 網址格式：`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. 在 `Config.gs` 中，將 `SPREADSHEET_ID` 替換成你的 ID

### 4. 確認 Google Sheets 結構
確保你的 Google Sheets 包含以下分頁：

#### 「帳號密碼」分頁
| 帳號 | 密碼 | 姓名 |
|------|------|------|
| user1 | pass1 | 張三 |

#### 「評鑑資料庫」分頁
| 課程母分類 | 課程子分類 | 課程名稱 | 授課教師 | 修課時間 | 甜度 | 涼度 | 有料程度 | 評價與修課指引 |
|-----------|-----------|---------|---------|---------|------|------|----------|---------------|
| 通識 | 人文 | 哲學概論 | 王老師 | 2023 | 8 | 7 | 9 | 很棒的課程... |

#### 「瀏覽記錄」分頁（選填，系統會自動建立）
此分頁用於追蹤熱門課程，系統會自動建立和管理。

### 5. 部署為 Web App
1. 在 Apps Script 編輯器中，點擊右上角「部署」>「新增部署作業」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - **說明**：課程評鑑系統 API v1
   - **執行身分**：我
   - **具有存取權的使用者**：任何人（重要！前端才能呼叫）
4. 點擊「部署」
5. 複製「網頁應用程式 URL」（類似 `https://script.google.com/macros/s/.../exec`）
6. 將此 URL 填入前端的 `src/config.js` 中

### 6. 測試 API
使用瀏覽器或 Postman 測試 API：

**測試登入：**
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=login&username=user1&password=pass1
```

**測試搜尋：**
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=search&keyword=哲學
```

## API 端點說明

### 1. 登入
- **action**: `login`
- **參數**: `username`, `password`
- **回傳**: `{ success: true/false, data: { username, name } }`

### 2. 搜尋課程
- **action**: `search`
- **參數**: `keyword`, `teacher`, `year`, `category`, `subcategory`（皆為選填）
- **回傳**: `{ success: true, data: [...courses], count: number }`

### 3. 取得課程詳情
- **action**: `getCourseDetail`
- **參數**: `courseName`, `teacher`
- **回傳**: `{ success: true, data: { course, stats, reviews } }`

### 4. 取得熱門課程
- **action**: `getHotCourses`
- **回傳**: `{ success: true, data: [...courses] }`

### 5. 取得隨機課程
- **action**: `getRandomCourses`
- **回傳**: `{ success: true, data: [...courses] }`

### 6. 記錄瀏覽
- **action**: `recordView`
- **參數**: `courseName`, `teacher`
- **回傳**: `{ success: true }`

## 維護說明

### 更換 Google Sheets
只需修改 `Config.gs` 中的 `SPREADSHEET_ID`，然後重新部署即可。

### 調整搜尋參數
在 `Config.gs` 中可以調整：
- `MIN_SIMILARITY` - 模糊搜尋的最低相似度（預設 0.4）
- `MAX_RESULTS` - 最多回傳幾筆結果（預設 50）

### 調整推薦數量
在 `Config.gs` 中可以調整：
- `HOT_COURSES_COUNT` - 熱門課程推薦數量（預設 5）
- `RANDOM_COURSES_COUNT` - 隨機推薦數量（預設 3）

## 常見問題

### Q: 前端無法呼叫 API
A: 確認部署時「具有存取權的使用者」設為「任何人」

### Q: 找不到 Google Sheets
A: 檢查 `SPREADSHEET_ID` 是否正確，以及 Apps Script 執行帳號是否有存取權限

### Q: 搜尋結果不準確
A: 可以調整 `Config.gs` 中的 `MIN_SIMILARITY` 值（0-1 之間）

## 安全性提醒
- 目前密碼是明文儲存在 Google Sheets 中
- 建議僅用於內部或小規模使用
- 如需更高安全性，建議實作密碼雜湊加密
