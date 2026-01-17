# 維護者指南

本文件提供系統維護者所需的資訊，包括如何更換資料來源、調整設定等。

## 📊 更換 Google Sheets 資料庫

### 方法一：更換整個 Google Sheets

1. **準備新的 Google Sheets**
   - 確保新的 Sheets 包含相同的分頁結構
   - 分頁名稱必須一致：「帳號密碼」、「評鑑資料庫」

2. **取得新的 Spreadsheet ID**
   - 開啟新的 Google Sheets
   - 從網址列複製 ID：`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

3. **更新後端配置**
   - 開啟 Google Apps Script 專案
   - 編輯 `Config.gs` 檔案
   - 將 `SPREADSHEET_ID` 替換為新的 ID：
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: '新的_SPREADSHEET_ID',
     // ...其他設定
   };
   ```

4. **重新部署**
   - 在 Apps Script 編輯器中
   - 點擊「部署」>「管理部署作業」
   - 點擊現有部署旁的「編輯」圖示
   - 選擇「新版本」
   - 點擊「部署」

5. **測試**
   - 使用瀏覽器測試 API 是否正常運作
   - 登入前端確認資料正確載入

### 方法二：僅更新資料內容

如果只是要更新資料內容而不更換整個 Sheets：
1. 直接在現有的 Google Sheets 中編輯資料
2. 無需重新部署，變更會立即生效

## 🔧 調整系統設定

### 搜尋相關設定

編輯 `backend/Config.gs`：

```javascript
SEARCH: {
  MIN_SIMILARITY: 0.4,  // 模糊搜尋最低相似度（0-1）
  MAX_RESULTS: 50       // 最多回傳結果數量
}
```

**MIN_SIMILARITY 說明**：
- 值越高，搜尋越嚴格（需要更相似才會匹配）
- 值越低，搜尋越寬鬆（較不相似也會匹配）
- 建議範圍：0.3 - 0.6

### 推薦功能設定

編輯 `backend/Config.gs`：

```javascript
RECOMMENDATION: {
  HOT_COURSES_COUNT: 5,    // 熱門課程推薦數量
  RANDOM_COURSES_COUNT: 3  // 隨機推薦數量
}
```

### CORS 設定

如果需要限制前端存取來源，編輯 `backend/Config.gs`：

```javascript
ALLOWED_ORIGINS: [
  'https://yourusername.github.io'  // 替換為你的 GitHub Pages 網址
]
```

## 📋 資料欄位說明

### 帳號密碼分頁

| 欄位 | 說明 | 必填 | 範例 |
|------|------|------|------|
| 帳號 | 登入帳號 | ✓ | user1 |
| 密碼 | 登入密碼 | ✓ | pass123 |
| 姓名 | 使用者姓名 | ✓ | 張三 |

### 評鑑資料庫分頁

| 欄位 | 說明 | 必填 | 範例 |
|------|------|------|------|
| 課程母分類 | 課程大分類 | ✓ | 通識 |
| 課程子分類 | 課程小分類 | ✓ | 人文 |
| 課程名稱 | 完整課程名稱 | ✓ | 哲學概論 |
| 授課教師 | 教師姓名 | ✓ | 王老師 |
| 修課時間 | 修課年分 | ✓ | 2023 |
| 甜度 | 評分 (0-10) | ✓ | 8 |
| 涼度 | 評分 (0-10) | ✓ | 7 |
| 有料程度 | 評分 (0-10) | ✓ | 9 |
| 評價與修課指引 | 文字評價 | ✓ | 很棒的課程... |

**重要**：
- 甜度、涼度、有料程度必須是數字（0-10）
- 修課時間建議使用年分格式（如：2023）
- 同一門課程（相同課程名稱+教師）可以有多筆評價

### 瀏覽記錄分頁（自動管理）

此分頁由系統自動建立和管理，無需手動編輯。

| 欄位 | 說明 |
|------|------|
| 課程名稱 | 被瀏覽的課程 |
| 授課教師 | 課程教師 |
| 瀏覽時間 | 最後瀏覽時間 |
| 瀏覽次數 | 累計瀏覽次數 |

## 🔄 更新前端配置

### 更換 API URL

如果重新部署了 Google Apps Script 並獲得新的 URL：

1. 編輯 `src/config.js`
2. 更新 `API_BASE_URL`：
```javascript
const config = {
  API_BASE_URL: 'https://script.google.com/macros/s/新的_DEPLOYMENT_ID/exec',
  // ...
};
```
3. 重新建置和部署前端

### 更換 GitHub Pages 路徑

如果更改了 GitHub repo 名稱：

1. 編輯 `vite.config.js`
2. 更新 `base` 路徑：
```javascript
export default defineConfig({
  base: '/新的_REPO_名稱/',
  // ...
})
```
3. 編輯 `src/App.jsx`
4. 更新 `basename`：
```javascript
<BrowserRouter basename="/新的_REPO_名稱">
```
5. 重新建置和部署

## 🐛 常見問題排解

### 問題：前端無法連接後端

**可能原因**：
1. API URL 設定錯誤
2. Google Apps Script 部署權限設定錯誤

**解決方法**：
1. 檢查 `src/config.js` 中的 `API_BASE_URL` 是否正確
2. 確認 Apps Script 部署時「具有存取權的使用者」設為「任何人」
3. 開啟瀏覽器開發者工具查看網路請求錯誤訊息

### 問題：搜尋結果不準確

**解決方法**：
1. 調整 `Config.gs` 中的 `MIN_SIMILARITY` 值
2. 檢查 Google Sheets 資料是否有拼字錯誤

### 問題：熱門課程不顯示

**可能原因**：
1. 尚未有任何瀏覽記錄
2. 「瀏覽記錄」分頁權限問題

**解決方法**：
1. 瀏覽幾個課程詳情頁面以建立記錄
2. 確認 Apps Script 有權限寫入 Sheets

### 問題：GitHub Pages 部署失敗

**解決方法**：
1. 檢查 GitHub Actions 日誌
2. 確認 repo 設定中 Pages 來源設為「GitHub Actions」
3. 確認 `package.json` 中的依賴版本正確

## 📦 備份與還原

### 備份資料

1. **Google Sheets 備份**：
   - 檔案 > 建立副本
   - 或使用 Google Takeout 匯出

2. **程式碼備份**：
   - 定期推送到 GitHub
   - 建立 Git tags 標記重要版本

### 還原資料

1. 從備份的 Google Sheets 複製資料
2. 或使用「更換 Google Sheets」流程

## 🔐 安全性建議

1. **密碼加密**：
   - 目前密碼為明文儲存
   - 如需更高安全性，建議實作 SHA-256 雜湊

2. **存取控制**：
   - 限制 Google Sheets 的編輯權限
   - 僅授權必要人員存取 Apps Script

3. **API 限制**：
   - 在 `Config.gs` 中設定 `ALLOWED_ORIGINS` 限制來源
   - 監控 Apps Script 的使用配額

## 📞 技術支援

如遇到無法解決的問題：
1. 查看 Google Apps Script 的執行日誌
2. 檢查瀏覽器開發者工具的 Console 和 Network
3. 參考 `backend/README.md` 和主 `README.md`

---

最後更新：2026-01-17
