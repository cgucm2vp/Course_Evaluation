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

## 📚 學涯資源中心維護
 
 學涯資源中心的所有內容（連結與檔案）均由 `src/config.js` 統一管理。
 
 ### 1. 維護常用相關連結
 
 編輯 `src/config.js` 中的 `QUICK_LINKS` 物件：
 
 - **修改標題**：更改 `BANNER_LEFT.title` 或 `BANNER_RIGHT.title`。
 - **修改分類與連結**：在 `GROUPS` 陣列中尋找對應的 `id`，更新 `text` (分類名稱) 或 `links` 陣列中的 `name` 與 `url`。
 
 ```javascript
 GROUPS: [
   {
     id: 1,
     text: '校內系統',
     links: [
       { name: '校園入口網', url: '...' },
       // ...
     ]
   },
   // ...
 ]
 ```
 
 ### 2. 維護文件下載檔案櫃
 
 編輯 `src/config.js` 中的 `FILE_CABINET` 陣列：
 
 - **新增分類**：在陣列中新增一個物件，包含 `category` 和 `files`。
 - **新增/修改檔案**：在 `files` 陣列中更新檔案屬性：
   - `id`: 唯一的 ID
   - `name`: 顯示的檔案名稱
   - `type`: 'PDF', 'DOCX', 'LINK', 'VIDEO', 'WEB', 'EGG' (EGG 為彩蛋)。
   - `size`: 顯示的檔案大小 (如 '1.2 MB')
   - `url`: 檔案的下載連結 (建議使用 Google Drive 共享連結)
 
 ```javascript
 {
   category: '教學文件',
   files: [
     { id: 1, name: '選課手冊', type: 'PDF', size: '2.5 MB', url: '...' },
     // ...
   ]
 }
 ```
 
 **注意**：檔案櫃目前設計為垂直排列，且每個分類分頁顯示 5 個檔案（超過 5 個會自動出現「上頁/下頁」按鈕）。
 
 ---
 
 ## 🎡 彩蛋系統維護
 
 系統目前內建數個互動彩蛋，維護方式如下：
 
 ### 1. 搜尋「傳奇醫學教師」
 當使用者在搜尋頁面的「關鍵字」或「老師姓名」輸入特定人名時，會觸發傳統風格的彩蛋對話框。
 
 - **程式碼位置**：`src/pages/SearchPage.jsx` 中的 `handleSearch` 函式。
 - **如何新增**：在 `doctors` 物件中新增 key 值（老師姓名）及其對應的 `title` (稱號), `dialog` (對話內容)。
 - **顯示邏輯**：系統會自動根據 `activeEasterEggTheme` 切換佈局與樣式，UI 元件定義在 `SearchPage.jsx` 的底部 `LegendaryDisplay` 區塊。
 
 ### 2. 深夜醫師提醒 (Midnight Assistant)
 在凌晨 1 點至 5 點間，頁面右下角會出現「熬夜提醒」。
 
 - **邏輯控制**：`src/components/MidnightAssistant.jsx`。
 - **顯示規則**：採用「看過即消失」策略。使用者點擊展開醫生訊息後，系統會在 `localStorage` 寫入 `midnight_egg_viewed`，此後將不再顯示。
 
 ### 3. 進階全螢幕彩蛋 (Special Easter Eggs)
 本系統擁有一套全螢幕特效彩蛋，由 `src/components/SpecialEasterEggs.jsx` 統一管理。
 
 - **觸發方式**：各分頁透過 `window.dispatchEvent(new CustomEvent('trigger-easter-egg', { detail: { type: '類別' } }))` 來進行全域觸發。
 
 | 分類 | 觸發條件 | 維護建議 |
 |------|----------|----------|
 | `fortune` (算命) | 搜尋關鍵字「算命」 | 可在 `SpecialEasterEggs.jsx` 中的 `FORTUNES` 陣列修改籤詩內容。 |
 | `magic` (魔法) | 搜尋關鍵字「魔法」 | 樣式定義在 `SpecialEasterEggs.css` 的 `.magic-circle` 相關區塊。 |
 | `achievement` (學富五車) | 累計瀏覽 10 個不同課程 | 追蹤邏輯在 `CourseDetailPage.jsx` 的 `useEffect` 中。 |
 | `speed` (點太快) | 1 秒內切換 5 次評論 | 防灌水/惡作劇提醒，邏輯在 `CourseDetailPage.jsx` 的 `handleSwitchLogic`。 |
 
 ### 4. 持續提交獎勵
 在提交評價頁面，若使用者在同一 Session 內連續成功提交 5 筆評價，會觸發特殊慶祝動畫。
 
 - **程式碼位置**：`src/pages/SubmitPage.jsx`。
 
 ### 4. 傳奇人物彩蛋圖片維護 (Legendary Portraits)
當使用者在搜尋頁面搜尋特定名醫（如「華佗」）時，會觸發全螢幕特效。

- **圖片存放位置**：`src/assets/legends/`
- **修改對應關係**：編輯 `src/components/LegendaryEffect.jsx` 中的 `mapping` 物件。
- **新增人物步驟**：
  1. 將 `.png` 檔案放入 `src/assets/legends/`（建議使用透明背景的圖片）。
  2. 在 `src/pages/SearchPage.jsx` 的 `doctors` 列表新增人物名稱與對白。
  3. 在 `src/components/LegendaryEffect.jsx` 的 `mapping` 中加入 `名稱: '檔名.png'`。

---
 
 ## 📧 修改系統信件內容 (Email Templates)
 系統發送的信件（如：重設密碼、修改備援信箱、異常回報通知）邏輯皆集中在 `backend/Code.gs` 中。
 
 ### 1. 定義位置
 請在 `Code.gs` 中搜尋 `MailApp.sendEmail`，主要分佈在以下函數：
 
 - **重設密碼信件**：`handleForgotPassword` 函數內。
   - 變數 `subject` 為主旨。
   - 變數 `body` 為內容。
 - **備援信箱設定通知**：`handleUpdateProfile` 函數內。
 - **管理員異常回報通知**：`handleReportIssue` 函數內。
 
 ### 2. 修改範例
 若要修改重設密碼的信件內容，請找到以下區塊並編輯字串：
 ```javascript
 const subject = `[課程評鑑系統] 密碼重設通知`;
 const body = `${realName} (${username}) 您好：\n\n您的帳號密碼已成功重設...\n\n新密碼為：${newPassword}...`;
 ```
 > [!TIP]
 > `\n` 代表換行。您可以自由編輯內容，但請確保變數（如 `${newPassword}`）保留在原位，以免使用者收不到新密碼。
 
 ### 3. 套用變更
 修改完 `Code.gs` 後，必須：
 1. 點擊 Google Apps Script 編輯器右上角的 **「部署」 (Deploy)**。
 2. 選擇 **「管理部署」 (Manage deployments)**。
 3. 編輯當前版本或建立新版本以套用。
 
 ---

## 🚀 GitHub 部署與版本更新 (Development & Deployment)
本專案使用 GitHub Actions 進行自動化部署，每次推送程式碼至 GitHub 後，系統會自動建置並發布到 GitHub Pages。

### 1. 更新版本號碼
在發布重大更動或維護後，建議更新專案版本號以便追蹤。
- **檔案位置**：`package.json`。
- **修改欄位**：`version`（建議格式為 `YYYYMMDD.次數v`，例如 `20260201.1v`）。

### 2. 推送更新至 GitHub
請在終端機執行以下指令：
```bash
# 1. 將所有更改加入暫存區
git add .

# 2. 提交更改，描述您做了什麼
git commit -m "更新搜尋建議功能與排版優化"

# 3. 推送到 GitHub
git push origin main
```

### 3. 查看部署狀態
- 推送後，前往您的 GitHub Repo 頁面，點擊上方分頁中的 **「Actions」**。
- 您會看到最新的部署流程正在運行（黃色小圈圈）。
- 當圖示變為綠色勾勾時，代表網頁已完成更新。

### 4. 404 錯誤導回登入頁 (404 Redirect)
本專案已在 `public/404.html` 設定了自動轉址邏輯。如果使用者輸入了不含 `#` 的錯誤網址（例如 `.../submit` 而非 `.../#/submit`），GitHub Pages 會自動觸發此檔案並將其導向回系統首頁（登入頁）。

## 💻 新環境開發設定 (Developer Setup)
如果您需要更換電腦進行開發，或將專案移交給下一任管理員，請參考以下步驟。

### 1. 必備環境安裝
在開始之前，請確保電腦已安裝以下軟體：
- **[Node.js](https://nodejs.org/)**: 建議安裝 LTS 版本。
- **[Git](https://git-scm.com/)**: 用於與 GitHub 同步。
- **[VS Code](https://code.visualstudio.com/)**: 建議使用的編輯器。

### 2. 取得專案原始碼
在新電腦的終端機執行：
```bash
git clone https://github.com/cgucm2vp/Course_Evaluation.git
cd Course_Evaluation
```

### 3. 安裝套件
進入專案資料夾後，安裝必要的依賴套件：
```bash
npm install
```

### 4. 設定環境變數 (.env)
由於 `.env` 檔案包含 API 網址且不會上傳到 GitHub，您必須**手動建立**它：
1. 在專案根目錄建立一個名為 `.env` 的檔案。
2. 輸入以下內容（請替換為實際的 API URL）：
   ```env
   VITE_API_BASE_URL=https://script.google.com/macros/s/您的_API_ID/exec
   ```

### 5. 使用 AI 助理協助 (Antigravity)
本專案高度建議搭配 **Antigravity** (AI 助理) 進行維護。
- **如何運作**：在支援 Antigravity 的環境下開啟此資料夾，助理會自動讀取此 `MAINTENANCE.md` 與專案結構。
- **如何交接**：您可以直接告訴助理：「請閱讀維護文件並幫我完成某項任務」，它能協助您處理從資料庫更換到 UI 調整的所有細節。

### 6. 啟動開發伺服器
執行以下指令即可在瀏覽器預覽網頁：
```bash
npm run dev
```

---

最後更新：2026-02-01
