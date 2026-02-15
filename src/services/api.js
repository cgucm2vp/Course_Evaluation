import axios from 'axios';
import config from '../config';

// 建立統一的 axios 實例
const instance = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 15000 // 稍微增加超時時間到 15 秒以應對 GAS 延遲
});

// 診斷資訊：確保部署後的 API URL 有被讀取到
console.log(`API Service initialized. BaseURL length: ${config.API_BASE_URL ? config.API_BASE_URL.length : 0}`);

// 簡易快取：全域設定只需要抓一次
let _configPromise = null;

// 檢查 API URL 是否存在
const checkConfig = () => {
    if (!config.API_BASE_URL) {
        console.error('CRITICAL ERROR: API_BASE_URL is missing in config.js');
        return false;
    }
    return true;
};

const api = {
    /**
     * 登入
     */
    login: async (username, password) => {
        if (!checkConfig()) return { success: false, message: '系統配置錯誤，請聯絡管理員' };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'login',
                    username,
                    password
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (login):', error.response || error);
            return { success: false, message: '網路錯誤，請稍後再試' };
        }
    },

    /**
     * 搜尋課程
     */
    searchCourses: async (filters) => {
        if (!checkConfig()) return { success: false, message: '系統配置錯誤' };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'search',
                    ...filters
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (searchCourses):', error.response || error);
            return { success: false, message: '搜尋失敗，請稍後再試' };
        }
    },

    /**
     * 取得課程詳情
     */
    getCourseDetail: async (courseName, teacher) => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'getCourseDetail',
                    courseName,
                    teacher
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (getCourseDetail):', error.response || error);
            return { success: false, message: '取得課程詳情失敗' };
        }
    },

    /**
     * 取得熱門課程
     */
    getHotCourses: async () => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'getHotCourses'
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (getHotCourses):', error.response || error);
            return { success: false, message: '取得熱門課程失敗' };
        }
    },

    /**
     * 取得隨機課程
     */
    getRandomCourses: async (filters = {}) => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'getRandomCourses',
                    ...filters
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (getRandomCourses):', error.response || error);
            return { success: false, message: '取得隨機課程失敗' };
        }
    },

    /**
     * 忘記密碼
     */
    forgotPassword: async (username) => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'forgotPassword',
                    username
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (forgotPassword):', error.response || error);
            return { success: false, message: '請求失敗，請聯絡管理員' };
        }
    },

    /**
     * 更新個人資料
     */
    updateProfile: async (data) => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'updateProfile',
                    ...data
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (updateProfile):', error.response || error);
            return { success: false, message: '更新失敗' };
        }
    },

    /**
     * 記錄課程瀏覽
     */
    recordView: async (courseName, teacher) => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'recordView',
                    courseName,
                    teacher
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (recordView):', error.response || error);
            return { success: false };
        }
    },

    /**
     * 取得課程映射清單
     */
    getCourseMapping: async () => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'getCourseMapping'
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (getCourseMapping):', error.response || error);
            return { success: false, message: '取得選單失敗' };
        }
    },

    /**
     * 異常回報
     */
    reportIssue: async (content) => {
        if (!checkConfig()) return { success: false };
        try {
            const userStr = localStorage.getItem(config.STORAGE_KEYS.USER);
            const user = userStr ? JSON.parse(userStr) : null;
            const reporter = user ? (user.name || user.username) : 'Anonymous';
            const deviceInfo = navigator.userAgent;

            const response = await instance.get('', {
                params: {
                    action: 'reportIssue',
                    reporter,
                    content,
                    deviceInfo
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (reportIssue):', error.response || error);
            return { success: false, message: '回報失敗，請稍後再試' };
        }
    },

    /**
     * 提交課程評鑑
     */
    submitEvaluation: async (evaluationData) => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'submitEvaluation',
                    ...evaluationData
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (submitEvaluation):', error.response || error);
            return { success: false, message: '提交失敗，請稍後再試' };
        }
    },

    /**
     * 檢索教師
     */
    lookupTeachers: async (semester, courseName) => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'getTeacherLookup',
                    semester,
                    courseName
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (lookupTeachers):', error.response || error);
            return { success: false, message: '檢索教師失敗' };
        }
    },

    /**
     * 獲取動態資源 (相關連結與檔案下載)
     */
    fetchResources: async () => {
        if (!checkConfig()) return { success: false };
        try {
            const response = await instance.get('', {
                params: {
                    action: 'getResources'
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error (fetchResources):', error.response || error);
            return { success: false, message: '獲取資源失敗，請檢查網路連線' };
        }
    },

    /**
     * 獲取全域應用程式設定 (APP_CONFIG)
     */
    fetchAppConfig: async () => {
        if (!checkConfig()) return null;
        if (_configPromise) return _configPromise;

        _configPromise = (async () => {
            try {
                const response = await instance.get('', {
                    params: { action: 'getAppConfig' }
                });
                if (response.data && response.data.success) {
                    return response.data.data;
                }
                return null;
            } catch (error) {
                console.error('API Error (fetchAppConfig):', error.response || error);
                _configPromise = null;
                return null;
            }
        })();

        return _configPromise;
    }
};

export default api;
