import { createContext, useContext, useState, useEffect } from 'react';
import api from './services/api';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
    // 優先從 localStorage 讀取快取設定，解決登入前「冷啟動」連結失效問題
    const getInitialConfig = () => {
        const cached = localStorage.getItem('app_dynamic_config');
        if (cached) {
            try {
                return JSON.parse(cached);
            } catch (e) {
                console.error('Failed to parse cached config', e);
            }
        }
        return {
            USER_MANUAL_URL: import.meta.env.VITE_USER_MANUAL_URL || '',
            CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL || ''
        };
    };

    const [configData, setConfigData] = useState(getInitialConfig);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const data = await api.fetchAppConfig();
                if (data) {
                    // 僅合併非空值的設定，避免覆蓋掉預設(Fallback)值
                    const filteredData = {};
                    Object.keys(data).forEach(key => {
                        if (data[key]) {
                            filteredData[key] = data[key];
                        }
                    });
                    const newConfig = { ...configData, ...filteredData };
                    setConfigData(newConfig);
                    // 寫入快取
                    localStorage.setItem('app_dynamic_config', JSON.stringify(newConfig));
                }
            } catch (error) {
                console.error('Failed to load app config:', error);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ appConfig: configData, loading }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useAppConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useAppConfig must be used within a ConfigProvider');
    }
    return context;
}
