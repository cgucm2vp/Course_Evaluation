/**
 * 前端配置檔
 * 維護者可以在這裡更改 Google Apps Script API URL
 */

const config = {
    // Google Apps Script Web App URL
    // 請將此 URL 替換為你部署的 Google Apps Script Web App URL
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbxNC8HguH0RymRYwZ1j2I41lrACm0xTTkDDMC9cemd_66iTv6GeN0r4kCb5SBqGm3IEyg/exec',

    // 應用程式設定
    APP_NAME: '課程評鑑查詢系統',

    // 本地儲存鍵名
    STORAGE_KEYS: {
        USER: 'course_eval_user',
        TOKEN: 'course_eval_token'
    }
};

export default config;
