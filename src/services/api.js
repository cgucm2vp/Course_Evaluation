import axios from 'axios';
import config from '../config';

/**
 * API 服務層
 * 封裝所有與後端的通訊
 */

const api = {
    /**
     * 登入
     */
    login: async (username, password) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'login',
                    username,
                    password
                }
            });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: '網路錯誤，請稍後再試' };
        }
    },

    /**
     * 搜尋課程
     */
    searchCourses: async (filters) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'search',
                    ...filters
                }
            });
            return response.data;
        } catch (error) {
            console.error('Search error:', error);
            return { success: false, message: '搜尋失敗，請稍後再試' };
        }
    },

    /**
     * 取得課程詳情
     */
    getCourseDetail: async (courseName, teacher) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'getCourseDetail',
                    courseName,
                    teacher
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get course detail error:', error);
            return { success: false, message: '取得課程詳情失敗' };
        }
    },

    /**
     * 取得熱門課程
     */
    getHotCourses: async () => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'getHotCourses'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get hot courses error:', error);
            return { success: false, message: '取得熱門課程失敗' };
        }
    },

    /**
     * 取得隨機課程
     */
    getRandomCourses: async (filters = {}) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'getRandomCourses',
                    ...filters
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get random courses error:', error);
            return { success: false, message: '取得隨機課程失敗' };
        }
    },

    /**
     * 忘記密碼
     */
    forgotPassword: async (username) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'forgotPassword',
                    username
                }
            });
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            return { success: false, message: '請求失敗，請聯絡管理員' };
        }
    },

    /**
     * 更新個人資料
     */
    updateProfile: async (data) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'updateProfile',
                    ...data
                }
            });
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, message: '更新失敗' };
        }
    },

    /**
     * 記錄課程瀏覽
     */
    recordView: async (courseName, teacher) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'recordView',
                    courseName,
                    teacher
                }
            });
            return response.data;
        } catch (error) {
            console.error('Record view error:', error);
            // 記錄失敗不影響使用者體驗，靜默處理
            return { success: false };
        }
    },

    /**
     * 取得課程映射清單
     */
    getCourseMapping: async () => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'getCourseMapping'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get course mapping error:', error);
            return { success: false, message: '取得選單失敗' };
        }
    },
    /**
     * 異常回報
     */
    reportIssue: async (content) => {
        try {
            // 取得當前登入使用者資訊
            const userStr = localStorage.getItem(config.STORAGE_KEYS.USER);
            const user = userStr ? JSON.parse(userStr) : null;
            const reporter = user ? (user.name || user.username) : 'Anonymous';
            const deviceInfo = navigator.userAgent;

            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'reportIssue',
                    reporter,
                    content,
                    deviceInfo
                }
            });
            return response.data;
        } catch (error) {
            console.error('Report issue error:', error);
            return { success: false, message: '回報失敗，請稍後再試' };
        }
    },

    /**
     * 提交課程評鑑
     */
    submitEvaluation: async (evaluationData) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'submitEvaluation',
                    ...evaluationData
                }
            });
            return response.data;
        } catch (error) {
            console.error('Submit evaluation error:', error);
            return { success: false, message: '提交失敗，請稍後再試' };
        }
    },

    /**
     * 檢索教師
     */
    lookupTeachers: async (semester, courseName) => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'getTeacherLookup',
                    semester,
                    courseName
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lookup teachers error:', error);
            return { success: false, message: '檢索教師失敗' };
        }
    }
};
export default api;
