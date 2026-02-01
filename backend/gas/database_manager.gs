/************************************************
 * 模組一：系統配置與顏色對照表
 ************************************************/
const PUBLIC_SHEET = "資料庫操作說明與導覽";
const PROTECTED_SHEETS = [
  "課程評鑑回覆", "評鑑資料庫", "課程資料庫", "學期課程授課教師對照表", 
  "資料庫帳號密碼設定", "SystemReports", "課程分類參考表", "帳號密碼", "瀏覽記錄"
];

const CHILD_COLOR_MAP = { 
  "藝術與人文思維": "#F3C6C6", "公民與社會探究": "#D98989", "人文藝術": "#FAE3D0", 
  "社會科學": "#F6D2B6", "自然科學": "#EFB98C", "運算思維": "#E3A06A", "跨域學習與實踐": "#CC8448" 
};

const MOTHER_COLOR_MAP = { 
  "核心通識課程": "#e8a5a5", "多元通識課程": "#f2c6a0", 
  "中醫系所規定之大一專業課程": "#f4e1a1", "中醫系所規定之大一非專業課程 (含必選修)": "#dce8b2", 
  "中醫系所規定之大二中醫專業課程": "#bfd8c2", "中醫系所規定之大二西醫專業課程": "#b6ddd8", 
  "中醫系所規定之大二非專業課程": "#b8e0e6", "醫學人文課程 (七選一)": "#bfd6f2", 
  "中醫系所開設之選修課程": "#c7ccf5", "其他系所課程": "#cfc4e8", 
  "體育室及軍訓教育組課程": "#d9c2e9", "AIMD相關課程": "#e6c7de", 
  "醫學院榮譽學程相關課程": "#e3c4c4" 
};

/************************************************
 * 模組二：核心事件攔截器 (onEdit)
 ************************************************/
function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  const name = sheet.getName();
  const row = e.range.getRow();
  const col = e.range.getColumn();
  const val = e.range.getValue();

  if (name === "SystemReports") {
    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setFontColor(val === true ? "#CCCCCC" : "#000000");
  }

  if (name === "課程評鑑回覆") {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const mCol = headers.indexOf("母分類") + 1;
    const cCol = headers.indexOf("子分類") + 1;
    const nCol = headers.indexOf("課程名稱") + 1;
    const appCol = headers.indexOf("核准並移動") + 1;

    if (col === appCol) {
      handleApprovalMove(e);
    } else if ([mCol, cCol].includes(col)) {
      // 編輯時，若已核准則不動作
      if (sheet.getRange(row, appCol).getValue() !== true) {
        handleReplySheetEdit(sheet, row, mCol, cCol, nCol);
      }
    }
  }

  if (name === "評鑑資料庫") {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const mCol = headers.indexOf("課程母分類") + 1;
    const cCol = headers.indexOf("課程子分類") + 1;
    const nCol = headers.indexOf("課程名稱") + 1;
    if (col === cCol) sheet.getRange(row, col).setFontColor(CHILD_COLOR_MAP[val] || "#000000");
    if ([mCol, cCol].includes(col)) updateEvaluationDBDropdowns(sheet, row, mCol, cCol, nCol);
  }

  if (name === "課程資料庫") {
    if (col === 1) updateCourseDBDropdowns(sheet, row, 1, 2); 
    if (col === 2) sheet.getRange(row, col).setFontColor(CHILD_COLOR_MAP[val] || "#000000");
  }

  if (name === PUBLIC_SHEET && ["AF11","AF15"].includes(e.range.getA1Notation())) {
  handlePlaceholder(sheet, e.range.getA1Notation());
}
}



/************************************************
 * 模組三：按鈕核心功能修正
 ************************************************/

/** 1. 接收最新資料 (僅針對未核准資料進行套色與選單) */
function processLatestData() {
  resetProgress();
  setProgress(1, 100);
  
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("課程評鑑回覆");
  if(!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const mCol = headers.indexOf("母分類") + 1;
  const cCol = headers.indexOf("子分類") + 1;
  const nCol = headers.indexOf("課程名稱") + 1;
  const appCol = headers.indexOf("核准並移動") + 1;

  for (let r = 2; r <= data.length; r++) {
    // 檢查「核准並移動」是否勾選
    if (data[r-1][appCol-1] !== true) {
      handleReplySheetEdit(sheet, r, mCol, cCol, nCol);
    }
    if (r % 10 === 0) setProgress(r, data.length);
  }
  setProgress(100, 100);
}

/** 2. 檢查課程與教師 (修正紅底標記邏輯) */
function checkReplySheet() {
  resetProgress();
  setProgress(1, 100);

  const ss = SpreadsheetApp.getActive();
  const replySheet = ss.getSheetByName("課程評鑑回覆");
  const courseDBRows = ss.getSheetByName("課程資料庫").getDataRange().getValues();
  const teacherDBRows = ss.getSheetByName("學期課程授課教師對照表").getDataRange().getValues();
  
  if(!replySheet) return;
  const data = replySheet.getDataRange().getValues();
  const headers = data[0];
  const mIdx = headers.indexOf("母分類");
  const cIdx = headers.indexOf("子分類");
  const nIdx = headers.indexOf("課程名稱");
  const tIdx = headers.indexOf("授課教師");
  const appIdx = headers.indexOf("核准並移動");

  // 預處理資料庫以提升效能
  const dbMap = {};
  courseDBRows.forEach(row => { dbMap[row[2]] = { m: row[0], c: row[1] }; });

  for (let r = 2; r <= data.length; r++) {
    // 排除已勾選核准的列
    if (data[r-1][appIdx] === true) continue;

    const rowRng = replySheet.getRange(r, 1, 1, headers.length);
    const mCell = replySheet.getRange(r, mIdx + 1);
    const cCell = replySheet.getRange(r, cIdx + 1);
    const nCell = replySheet.getRange(r, nIdx + 1);
    const tCell = replySheet.getRange(r, tIdx + 1);

    // 先清除所有底色
    rowRng.setBackground(null);

    const rowVal = data[r-1];
    const curM = rowVal[mIdx];
    const curC = rowVal[cIdx];
    const curN = rowVal[nIdx];
    const curT = rowVal[tIdx];

    const dbEntry = dbMap[curN];

    if (!dbEntry) {
      // 階段一：未收錄 -> 母、子、名稱標紅
      [mCell, cCell, nCell].forEach(c => c.setBackground("#FF0000").setFontColor("#FFFFFF"));
    } else {
      // 階段二：檢查分類正確性
      if (dbEntry.m !== curM) {
        // 母分類錯誤 -> 標紅母分類 (不論子分類)
        mCell.setBackground("#FF0000").setFontColor("#FFFFFF");
      } else if (dbEntry.c !== curC) {
        // 母對但子錯 -> 標紅子分類
        cCell.setBackground("#FF0000").setFontColor("#FFFFFF");
      }
      
      // 階段三：檢查教師對應
      const tMatch = teacherDBRows.some(row => row[1] === curN && row[2] === curT);
      if (!tMatch) tCell.setBackground("#FFF2CC"); // 教師錯誤維持淡黃色提醒
    }

    if (r % 5 === 0) setProgress(r, data.length);
  }
  setProgress(100, 100);
}

/************************************************
 * 模組四：基礎連動與輔助工具 (維持不變)
 ************************************************/

function setValidation(range, options) {
  const cleanOptions = [...new Set(options)].filter(opt => opt && opt.toString().trim() !== "");
  if (cleanOptions.length > 0) {
    range.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(cleanOptions, true).build());
  } else { range.clearDataValidations(); }
}

function updateCourseDBDropdowns(sheet, r, mCol, cCol) {
  const mVal = sheet.getRange(r, mCol).getValue();
  const refSheet = SpreadsheetApp.getActive().getSheetByName("課程分類參考表");
  if (!refSheet) return;
  const refData = refSheet.getDataRange().getValues();
  let currentMother = "";
  const processedRef = refData.map(row => {
    if (row[0] && row[0].toString().trim() !== "") currentMother = row[0];
    return [currentMother, row[1]];
  });
  const cOptions = processedRef.filter(row => row[0] === mVal).map(row => row[1]);
  setValidation(sheet.getRange(r, cCol), cOptions);
}

function updateEvaluationDBDropdowns(sheet, r, mCol, cCol, nCol) {
  const mVal = sheet.getRange(r, mCol).getValue();
  const cVal = sheet.getRange(r, cCol).getValue();
  const masterData = SpreadsheetApp.getActive().getSheetByName("課程資料庫").getDataRange().getValues();
  const cOptions = masterData.filter(row => row[0] === mVal).map(row => row[1]);
  setValidation(sheet.getRange(r, cCol), cOptions);
  const nOptions = masterData.filter(row => row[0] === mVal && (cVal ? row[1] === cVal : true)).map(row => row[2]);
  setValidation(sheet.getRange(r, nCol), nOptions);
}

function handleReplySheetEdit(sheet, row, mCol, cCol, nCol) {
  const mVal = sheet.getRange(row, mCol).getValue();
  const cVal = sheet.getRange(row, cCol).getValue();
  sheet.getRange(row, mCol).setFontColor(MOTHER_COLOR_MAP[mVal] || "#000000");
  sheet.getRange(row, cCol).setFontColor(CHILD_COLOR_MAP[cVal] || "#000000");
  updateEvaluationDBDropdowns(sheet, row, mCol, cCol, nCol);
}

/************************************************
 * 模組五：權限、鎖定與遷移 (其餘代碼整合)
 ************************************************/
function onOpen() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ui = SpreadsheetApp.getUi(); // 確保取得 UI

    // 建立選單，只保留「顯示工具面板」
    ui.createMenu('管理工具')
      .addItem('顯示工具面板', 'showSidebarWithAuthCheck')
      .addToUi();

    // 清除登入相關暫存
    PropertiesService.getUserProperties().deleteAllProperties();
    CacheService.getUserCache().remove('isAuthorized');

    // 鎖定受保護工作表
    lockSystem(ss);

    // 初始化 placeholder（安全判斷）
    try {
      const navSheet = ss.getSheetByName(PUBLIC_SHEET);
      if (navSheet) resetPlaceholders(navSheet);
    } catch (e) {
      Logger.log("初始化 placeholder 失敗：" + e);
    }

  } catch (err) {
    Logger.log("onOpen 執行錯誤：" + err);
  }
}

function lockSystem(ss) { PROTECTED_SHEETS.forEach(name => { const s = ss.getSheetByName(name); if (s) try { s.hideSheet(); } catch(e) {} }); }
function unlockSystem(ss) { PROTECTED_SHEETS.forEach(name => { const s = ss.getSheetByName(name); if (s) s.showSheet(); }); }

function resetProgress() { CacheService.getUserCache().remove("task_progress"); SpreadsheetApp.flush(); }
function setProgress(c, t) { CacheService.getUserCache().put("task_progress", Math.round((c/t)*100).toString(), 60); }
function getTaskProgress() { const p = CacheService.getUserCache().get("task_progress"); return p ? parseInt(p) : 0; }

function handleApprovalMove(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const approved = e.range.getValue();
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground(approved ? "#E6F4EA" : null).setFontColor(approved ? "#999999" : "#000000");
  moveToEvalDatabase(row, approved);
}

function moveToEvalDatabase(row, approved) {
  const ss = SpreadsheetApp.getActive();
  const reply = ss.getSheetByName("課程評鑑回覆");
  const db = ss.getSheetByName("評鑑資料庫");
  if(!db || !reply) return;
  const headers = reply.getRange(1, 1, 1, reply.getLastColumn()).getValues()[0];
  const dbHeaders = db.getRange(1, 1, 1, db.getLastColumn()).getValues()[0];
  const rowData = reply.getRange(row, 1, 1, reply.getLastColumn()).getValues()[0];
  const data = {}; headers.forEach((h, i) => data[h] = rowData[i]);
  const idCol = headers.indexOf("評鑑ID") + 1;
  if(!reply.getRange(row, idCol).getValue()) reply.getRange(row, idCol).setValue(Utilities.getUuid());
  const id = reply.getRange(row, idCol).getValue();
  const dbData = db.getDataRange().getValues();
  const idIdx = dbHeaders.indexOf("評鑑ID");
  let foundRow = -1;
  for(let i=1; i<dbData.length; i++){ if(dbData[i][idIdx] === id){ foundRow = i+1; break; } }
  if(approved && foundRow === -1){
    const newRow = Array(dbHeaders.length).fill("");
    newRow[dbHeaders.indexOf("課程母分類")] = data["母分類"];
    newRow[dbHeaders.indexOf("課程子分類")] = data["子分類"];
    newRow[dbHeaders.indexOf("課程名稱")] = data["課程名稱"];
    newRow[dbHeaders.indexOf("授課教師")] = data["授課教師"];
    newRow[dbHeaders.indexOf("修課時間")] = data["學年"];
    newRow[dbHeaders.indexOf("評價與修課指引")] = data["心得"];
    newRow[idIdx] = id;
    db.appendRow(newRow);
    const lastR = db.getLastRow();
    db.getRange(lastR, dbHeaders.indexOf("課程子分類") + 1).setFontColor(CHILD_COLOR_MAP[data["子分類"]] || "#000000");
    updateEvaluationDBDropdowns(db, lastR, dbHeaders.indexOf("課程母分類")+1, dbHeaders.indexOf("課程子分類")+1, dbHeaders.indexOf("課程名稱")+1);
  } else if(!approved && foundRow !== -1) { db.deleteRow(foundRow); }
}

function manualLogin() {
  const ACCOUNT_ENTRY = "AF11";
  const PASSWORD_ENTRY = "AF15";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const navSheet = ss.getSheetByName(PUBLIC_SHEET);
  const u = navSheet.getRange(ACCOUNT_ENTRY).getValue();
  const p = navSheet.getRange(PASSWORD_ENTRY).getValue();
  const dbSheet = ss.getSheetByName("資料庫帳號密碼設定");
  const data = dbSheet.getDataRange().getValues();
  
  let success = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === u && String(data[i][1]) === String(p)) {
      success = true; 
      break; 
    }
  }

  if (success) {
    unlockSystem(ss);
    PropertiesService.getUserProperties().setProperty('isAuthorized', 'true');
    SpreadsheetApp.getUi().alert("✅ 登入成功！");
  } else {
    SpreadsheetApp.getUi().alert("❌ 帳密錯誤。");
  }

  // 無論成功或失敗，重置 placeholder
  resetPlaceholders(navSheet);
}



function setPlaceholders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const navSheet = ss.getSheetByName(PUBLIC_SHEET);

  const placeholders = {
    "AF11": "請輸入帳號",
    "AF15": "請輸入密碼"
  };

  for (let key in placeholders) {
    const cell = navSheet.getRange(key);
    const val = cell.getValue();
    if (!val || val === placeholders[key]) { 
      cell.setValue(placeholders[key]).setFontColor("#999999"); // 只填空值或原本是 placeholder
    }
  }
}

function handlePlaceholder(sheet, cellA1) {
  const placeholders = {
    "AF11": "請輸入帳號",
    "AF15": "請輸入密碼"
  };
  if (!placeholders[cellA1]) return;

  const cell = sheet.getRange(cellA1);
  const val = cell.getValue();

  if (!val || val === placeholders[cellA1]) {
    cell.setValue(placeholders[cellA1]).setFontColor("#999999"); // 空值或原 placeholder → 灰色
  } else {
    cell.setFontColor("#000000"); // 使用者輸入 → 黑色
  }
}


function resetPlaceholders(sheet) {
  const placeholders = {
    "AF11": "請輸入帳號",
    "AF15": "請輸入密碼"
  };

  for (let key in placeholders) {
    const cell = sheet.getRange(key);
    cell.setValue(placeholders[key]).setFontColor("#999999");
  }
}

/** 手動登出：清除權限並隱藏所有工作表 */
function logout() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. 刪除所有權限暫存
  PropertiesService.getUserProperties().deleteAllProperties();
  CacheService.getUserCache().remove('isAuthorized');
  
  // 2. 執行鎖定邏輯 (隱藏工作表)
  lockSystem(ss);
  
  // 3. 通知使用者
  SpreadsheetApp.getUi().alert("🔒 系統已安全鎖定並登出。");
}

function showSidebar() { if (PropertiesService.getUserProperties().getProperty('isAuthorized') !== 'true') return; const html = HtmlService.createHtmlOutputFromFile('Sidebar').setTitle("控制面板").setWidth(300); SpreadsheetApp.getUi().showSidebar(html); }
function checkCurrentAuth() { return PropertiesService.getUserProperties().getProperty('isAuthorized') === 'true'; }

function showSidebarWithAuthCheck() {
  const ui = SpreadsheetApp.getUi(); // 正確取得 UI
  if (PropertiesService.getUserProperties().getProperty('isAuthorized') !== 'true') {
    ui.alert("⚠️ 請先登入後再使用工具面板！");
    return;
  }
  showSidebar(); // 原本的 Sidebar
}

