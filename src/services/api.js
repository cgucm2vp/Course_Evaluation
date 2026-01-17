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
    getRandomCourses: async () => {
        try {
            const response = await axios.get(config.API_BASE_URL, {
                params: {
                    action: 'getRandomCourses'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get random courses error:', error);
            return { success: false, message: '取得隨機課程失敗' };
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
    }
};

export default api;
