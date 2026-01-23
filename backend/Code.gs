/**
 * 課程評鑑查詢系統 - Google Apps Script 後端
 * 提供 RESTful API 給前端使用
 */

/**
 * 處理 GET 請求
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * 處理 POST 請求
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * 統一處理請求
 */
function handleRequest(e) {
  try {
    // 解析參數
    const params = e.parameter || {};
    const action = params.action || '';
    
    // 路由處理
    let result;
    switch (action) {
      case 'login':
        result = handleLogin(params);
        break;
      case 'search':
        result = handleSearch(params);
        break;
      case 'getCourseDetail':
        result = handleGetCourseDetail(params);
        break;
      case 'getHotCourses':
        result = handleGetHotCourses(params);
        break;
      case 'getRandomCourses':
        result = handleGetRandomCourses(params);
        break;
      case 'recordView':
        result = handleRecordView(params);
        break;
      case 'getCourseMapping':
        result = handleGetCourseMapping();
        break;
      default:
        result = { success: false, message: '未知的操作：' + action };
    }
    
    return createResponse(result);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createResponse({ 
      success: false, 
      message: '伺服器錯誤：' + error.toString() 
    });
  }
}

/**
 * 建立 JSON 回應（含 CORS 標頭）
 */
function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // 設定 CORS 標頭
  return output;
}

/**
 * 處理登入
 */
function handleLogin(params) {
  const username = params.username || '';
  const password = params.password || '';
  
  if (!username || !password) {
    return { success: false, message: '請輸入帳號和密碼' };
  }
  
  const sheet = getSheet(CONFIG.SHEETS.ACCOUNTS);
  const data = sheet.getDataRange().getValues();
  
  // 跳過標題列
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const [accountUsername, accountPassword, name] = row;
    
    if (accountUsername === username && accountPassword === password) {
      return {
        success: true,
        message: '登入成功',
        data: {
          username: username,
          name: name
        }
      };
    }
  }
  
  return { success: false, message: '帳號或密碼錯誤' };
}

/**
 * 處理課程搜尋
 */
function handleSearch(params) {
  const keyword = params.keyword || '';
  const teacher = params.teacher || '';
  const year = params.year || '';
  const category = params.category || '';
  const subcategory = params.subcategory || '';
  const isExact = params.isExact === 'true' || params.isExact === true;
  const shouldMerge = params.shouldMerge !== 'false'; // 預設為合併，除非明確指定 'false'
  
  const sheet = getSheet(CONFIG.SHEETS.COURSES);
  const data = sheet.getDataRange().getValues();
  
  let results = [];
  let resultsMap = new Map();
  
  // 跳過標題列
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const course = {
      rowIndex: i + 1,
      category: row[0],
      subcategory: row[1],
      name: row[2],
      teacher: row[3],
      year: row[4],
      sweetness: row[5],
      coolness: row[6],
      richness: row[7],
      review: row[8]
    };
    
    // 篩選條件
    let match = true;
    
    if (keyword) {
      if (isExact) {
        if (course.name !== keyword) match = false;
      } else {
        if (!fuzzyMatch(course.name, keyword)) match = false;
      }
    }
    
    if (teacher && !fuzzyMatch(course.teacher, teacher)) match = false;
    if (year && course.year.toString() !== year) match = false;
    if (category && course.category !== category) match = false;
    if (subcategory && course.subcategory !== subcategory) match = false;
    if (match) {
      if (shouldMerge) {
        const uniqueKey = `${course.name}|${course.teacher}`;
        if (!resultsMap.has(uniqueKey)) {
          course.years = [course.year];
          course.reviewCount = 1;
          resultsMap.set(uniqueKey, course);
        } else {
          const existing = resultsMap.get(uniqueKey);
          if (!existing.years.includes(course.year)) {
            existing.years.push(course.year);
          }
          existing.reviewCount++;
        }
      } else {
        results.push(course);
      }
      
      // 限制結果數量（去重後的課程數）
      const currentCount = shouldMerge ? resultsMap.size : results.length;
      if (currentCount >= CONFIG.SEARCH.MAX_RESULTS) {
        break;
      }
    }
  }
  
  const finalResults = shouldMerge ? 
    Array.from(resultsMap.values()).map(c => {
      c.year = formatYearRange(c.years);
      delete c.years;
      return c;
    }) : 
    results;

  // 最終結果整體排序
  finalResults.sort((a, b) => compareYears(a.year, b.year));
  
  return {
    success: true,
    data: finalResults,
    count: finalResults.length
  };
}

/**
 * 年份排序專用器：數字大者在前，帶“-”者墊後
 */
function compareYears(yearA, yearB) {
  // 處理區間格式或是單一年份，取最晚的年份作為排序基準
  const sA = yearA.toString().split('~').pop().trim();
  const sB = yearB.toString().split('~').pop().trim();

  // 1. 把單獨的 "-" 字串排在最後
  if (sA === '-' && sB === '-') return 0;
  if (sA === '-') return 1;
  if (sB === '-') return -1;

  const parse = (s) => {
    const isHyphenated = s.includes('-');
    const parts = s.split('-');
    const base = parseFloat(parts[0]) || 0;
    // 如果沒有分學期 (只有 XXX)，子學期權重設為 9 (降序排在 -2 之前)
    const sub = isHyphenated ? (parseFloat(parts[1]) || 0) : 9;
    return { base, sub };
  };

  const a = parse(sA);
  const b = parse(sB);

  // 2. 比較 XXX 部分 (數字大者在前)
  if (a.base !== b.base) {
    return b.base - a.base;
  }

  // 3. 同樣 XXX 時比學期 (數字大者在前，9 > 2 > 1)
  return b.sub - a.sub;
}

/**
 * 格式化年份區間（例如：111 ~ 114-2）
 */
function formatYearRange(years) {
  if (!years || years.length === 0) return '';
  if (years.length === 1) return years[0].toString();
  
  const parseYear = (y) => {
    const s = y.toString();
    const parts = s.split('-');
    const base = parseFloat(parts[0]);
    const sub = parts[1] ? parseFloat(parts[1]) / 10 : 0;
    return base + sub;
  };
  
  const sorted = [...years].sort((a, b) => parseYear(a) - parseYear(b));
  
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  if (min === max) return min.toString();
  return `${min} ~ ${max}`;
}

/**
 * 取得課程映射關係（供前端動態選單使用）
 */
function handleGetCourseMapping() {
  try {
    const dbSheet = getSheet(CONFIG.SHEETS.COURSE_DATABASE);
    const dbData = dbSheet.getDataRange().getValues();
    
    // 預先計算評價資料庫中的每門課筆數
    const evalSheet = getSheet(CONFIG.SHEETS.COURSES);
    const evalData = evalSheet.getDataRange().getValues();
    const countMap = {};
    for (let j = 1; j < evalData.length; j++) {
      const cName = evalData[j][2] ? evalData[j][2].toString().trim() : '';
      if (cName) {
        countMap[cName] = (countMap[cName] || 0) + 1;
      }
    }

    // 結構：{ "母分類": { "direct": [], "sub": { "子分類": [] } } }
    const mapping = {};
    
    for (let i = 1; i < dbData.length; i++) {
      const [parent, sub, course] = dbData[i];
      if (!parent || !course) continue;
      
      const parentName = parent.toString().trim();
      const subName = sub ? sub.toString().trim() : '';
      const courseName = course.toString().trim();
      const count = countMap[courseName] || 0;
      const courseWithCount = { name: courseName, count: count };
      
      if (!mapping[parentName]) {
        mapping[parentName] = { direct: [], sub: {} };
      }
      
      if (subName) {
        if (!mapping[parentName].sub[subName]) {
          mapping[parentName].sub[subName] = [];
        }
        // 避免重複加入同名課程物件
        if (!mapping[parentName].sub[subName].some(c => c.name === courseName)) {
          mapping[parentName].sub[subName].push(courseWithCount);
        }
      } else {
        if (!mapping[parentName].direct.some(c => c.name === courseName)) {
          mapping[parentName].direct.push(courseWithCount);
        }
      }
    }
    
    return { success: true, data: mapping };
  } catch (e) {
    return { success: false, message: '讀取課程清單失敗：' + e.toString() };
  }
}

/**
 * 模糊匹配函數（使用簡單的字串包含和相似度計算）
 */
function fuzzyMatch(text, query) {
  if (!text || !query) return false;
  
  text = text.toString().toLowerCase();
  query = query.toString().toLowerCase();
  
  // 如果直接包含，回傳 true
  if (text.includes(query)) {
    return true;
  }
  
  // 計算相似度
  const similarity = calculateSimilarity(text, query);
  return similarity >= CONFIG.SEARCH.MIN_SIMILARITY;
}

/**
 * 計算兩個字串的相似度（使用 Levenshtein 距離）
 */
function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];
  
  // 初始化矩陣
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // 計算編輯距離
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // 刪除
        matrix[i][j - 1] + 1,      // 插入
        matrix[i - 1][j - 1] + cost // 替換
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  
  return 1 - (distance / maxLen);
}

/**
 * 取得課程詳情
 */
function handleGetCourseDetail(params) {
  const courseName = params.courseName || '';
  const teacher = params.teacher || '';
  
  if (!courseName || !teacher) {
    return { success: false, message: '缺少課程名稱或教師名稱' };
  }
  
  const sheet = getSheet(CONFIG.SHEETS.COURSES);
  const data = sheet.getDataRange().getValues();
  
  let reviews = [];
  let stats = {
    sweetness: [],
    coolness: [],
    richness: []
  };
  
  // 收集所有符合的評價
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[2] === courseName && row[3] === teacher) {
      reviews.push({
        category: row[0],
        subcategory: row[1],
        name: row[2],
        teacher: row[3],
        year: row[4],
        sweetness: row[5],
        coolness: row[6],
        richness: row[7],
        review: row[8]
      });
      
      // 收集數據用於統計
      if (typeof row[5] === 'number') stats.sweetness.push(row[5]);
      if (typeof row[6] === 'number') stats.coolness.push(row[6]);
      if (typeof row[7] === 'number') stats.richness.push(row[7]);
    }
  }
  
  if (reviews.length === 0) {
    return { success: false, message: '找不到該課程' };
  }
  
  reviews.sort((a, b) => compareYears(a.year, b.year));
  
  // 計算平均值與樣本數
  const avgStats = {
    sweetness: average(stats.sweetness),
    sweetnessCount: stats.sweetness.length,
    coolness: average(stats.coolness),
    coolnessCount: stats.coolness.length,
    richness: average(stats.richness),
    richnessCount: stats.richness.length,
    sampleCount: reviews.length
  };
  
  return {
    success: true,
    data: {
      course: {
        name: courseName,
        teacher: teacher,
        category: reviews[0].category,
        subcategory: reviews[0].subcategory
      },
      stats: avgStats,
      reviews: reviews
    }
  };
}

/**
 * 計算平均值
 */
function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * 取得熱門課程
 */
function handleGetHotCourses(params) {
  try {
    const logSheet = getSheet(CONFIG.SHEETS.VIEW_LOGS);
    const logData = logSheet.getDataRange().getValues();
    
    if (logData.length <= 1) {
      return { success: true, data: [] };
    }
    
    // 統計瀏覽量
    const viewCounts = {};
    for (let i = 1; i < logData.length; i++) {
      const [courseName, teacher, , count] = logData[i];
      const key = `${courseName}|${teacher}`;
      viewCounts[key] = (viewCounts[key] || 0) + (count || 1);
    }
    
    const sorted = Object.entries(viewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, CONFIG.RECOMMENDATION.HOT_COURSES_COUNT);
    
    // 預先準備評價統計
    const evalSheet = getSheet(CONFIG.SHEETS.COURSES);
    const evalData = evalSheet.getDataRange().getValues();
    const statsMap = {};
    
    for (let j = 1; j < evalData.length; j++) {
      const row = evalData[j];
      const key = `${row[2]}|${row[3]}`;
      if (!statsMap[key]) {
        statsMap[key] = {
          category: row[0],
          subcategory: row[1],
          years: [row[4]],
          reviewCount: 1
        };
      } else {
        if (!statsMap[key].years.includes(row[4])) {
          statsMap[key].years.push(row[4]);
        }
        statsMap[key].reviewCount++;
      }
    }

    const courses = [];
    for (const [key, count] of sorted) {
      const [courseName, teacher] = key.split('|');
      const stats = statsMap[key];
      if (stats) {
        courses.push({
          name: courseName,
          teacher: teacher,
          category: stats.category,
          subcategory: stats.subcategory,
          year: formatYearRange(stats.years),
          reviewCount: stats.reviewCount,
          viewCount: count
        });
      }
    }
    
    return { success: true, data: courses };
  } catch (e) {
    return { success: true, data: [] };
  }
}

/**
 * 取得隨機課程
 */
function handleGetRandomCourses(params) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.COURSES);
    const data = sheet.getDataRange().getValues();
    
    const courseMap = {};
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const key = `${row[2]}|${row[3]}`;
      if (!courseMap[key]) {
        courseMap[key] = {
          category: row[0],
          subcategory: row[1],
          name: row[2],
          teacher: row[3],
          years: [row[4]],
          reviewCount: 1
        };
      } else {
        if (!courseMap[key].years.includes(row[4])) {
          courseMap[key].years.push(row[4]);
        }
        courseMap[key].reviewCount++;
      }
    }
    
    const courses = Object.values(courseMap);
    const randomCourses = [];
    const count = Math.min(CONFIG.RECOMMENDATION.RANDOM_COURSES_COUNT, courses.length);
    const indices = new Set();
    
    while (indices.size < count) {
      const index = Math.floor(Math.random() * courses.length);
      indices.add(index);
    }
    
    indices.forEach(index => {
      const c = courses[index];
      c.year = formatYearRange(c.years);
      delete c.years;
      randomCourses.push(c);
    });
    
    return { success: true, data: randomCourses };
  } catch (e) {
    return { success: false, message: '取得隨機課程失敗：' + e.toString() };
  }
}

/**
 * 記錄課程瀏覽
 */
function handleRecordView(params) {
  const courseName = params.courseName || '';
  const teacher = params.teacher || '';
  
  if (!courseName || !teacher) {
    return { success: false, message: '缺少課程名稱或教師名稱' };
  }
  
  try {
    const sheet = getSheet(CONFIG.SHEETS.VIEW_LOGS);
    const data = sheet.getDataRange().getValues();
    
    // 查找是否已有記錄
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === courseName && data[i][1] === teacher) {
        // 更新瀏覽次數和時間
        const currentCount = data[i][3] || 0;
        sheet.getRange(i + 1, 3).setValue(new Date()); // 更新時間
        sheet.getRange(i + 1, 4).setValue(currentCount + 1); // 增加次數
        found = true;
        break;
      }
    }
    
    // 如果沒有記錄，新增一筆
    if (!found) {
      sheet.appendRow([courseName, teacher, new Date(), 1]);
    }
    
    return { success: true, message: '記錄成功' };
  } catch (e) {
    return { success: false, message: '記錄失敗：' + e.toString() };
  }
}

/**
 * 取得課程基本資訊（輔助函數）
 */
function getCourseInfo(courseName, teacher) {
  const sheet = getSheet(CONFIG.SHEETS.COURSES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[2] === courseName && row[3] === teacher) {
      return {
        category: row[0],
        subcategory: row[1],
        name: row[2],
        teacher: row[3]
      };
    }
  }
  
  return null;
}
