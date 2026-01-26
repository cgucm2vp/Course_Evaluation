/**
 * 前端配置檔
 * 維護者可以在這裡更改 Google Apps Script API URL
 */

const config = {
    // Google Apps Script Web App URL
    // 請將此 URL 替換為你部署的 Google Apps Script Web App URL
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbzXmd5wMDUV4sAK80fN_pxhkFNG1hdN44Boz87NXg9yKmcrMK4y4IS-RAoYeGscFb-6gA/exec',
    // 應用程式設定
    APP_NAME: '課程評鑑查詢系統',

    // 本地儲存鍵名
    STORAGE_KEYS: {
        USER: 'course_eval_user',
        TOKEN: 'course_eval_token'
    }
};

export default config;
