/**
 * 前端配置檔
 * 維護者可以在這裡更改 Google Apps Script API URL
 */

const config = {
    // Google Apps Script Web App URL
    // 從環境變數讀取 (GitHub Secrets / .env)
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
    // 應用程式設定
    APP_NAME: '課程指引與評鑑查詢系統',
    USER_MANUAL_URL: 'https://drive.google.com/file/d/11T9S86_JS3n88dR2USaaBruRIYofrn7e/view?usp=sharing', // 請在此處替換為實際的操作手冊下載連結

    STORAGE_KEYS: {
        USER: 'course_eval_user',
        TOKEN: 'course_eval_token',
        REMEMBERED_ACCOUNT: 'course_eval_remembered'
    }
};

export default config;
