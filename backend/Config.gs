/**
 * 配置檔案
 * 維護者可以在這裡更改 Google Sheets 的 ID 和其他設定
 */

// ==================== Google Sheets 設定 ====================
// 請將以下 ID 替換為你的 Google Sheets ID
// Google Sheets ID 可以從網址中取得：https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
const CONFIG = {
  // Google Sheets ID（請替換成你的）
  SPREADSHEET_ID: '請替換成你的 Google Sheets ID',
  
  // Sheet 名稱（必須與你的 Google Sheets 中的分頁名稱一致）
  SHEETS: {
    ACCOUNTS: '帳號密碼',
    COURSES: '評鑑資料庫',
    COURSE_DATABASE: '課程資料庫',
    VIEW_LOGS: '瀏覽記錄'  // 用於追蹤熱門課程，如果不存在會自動建立
  },
  
  // CORS 設定（允許的前端網域）
  ALLOWED_ORIGINS: [
    '*'  // 開發時允許所有來源，正式環境建議改為你的 GitHub Pages 網址
    // 'https://yourusername.github.io'
  ],
  
  // 搜尋設定
  SEARCH: {
    MIN_SIMILARITY: 0.4,  // 模糊搜尋的最低相似度（0-1）
    MAX_RESULTS: 50       // 最多回傳幾筆搜尋結果
  },
  
  // 推薦設定
  RECOMMENDATION: {
    HOT_COURSES_COUNT: 5,    // 熱門課程推薦數量
    RANDOM_COURSES_COUNT: 3  // 隨機推薦數量
  }
};

/**
 * 取得 Spreadsheet 物件
 */
function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } catch (e) {
    throw new Error('無法開啟 Google Sheets，請檢查 SPREADSHEET_ID 是否正確，以及是否有存取權限');
  }
}

/**
 * 取得指定的 Sheet
 */
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  // 如果 Sheet 不存在，自動建立（僅限瀏覽記錄）
  if (!sheet && sheetName === CONFIG.SHEETS.VIEW_LOGS) {
    sheet = ss.insertSheet(sheetName);
    // 建立標題列
    sheet.appendRow(['課程名稱', '授課教師', '瀏覽時間', '瀏覽次數']);
  }
  
  if (!sheet) {
    throw new Error(`找不到名為 "${sheetName}" 的分頁，請檢查 Google Sheets 設定`);
  }
  
  return sheet;
}
