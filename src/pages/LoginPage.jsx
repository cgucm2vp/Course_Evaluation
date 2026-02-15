import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import ReportModal from '../components/ReportModal';
import MessageBox from '../components/MessageBox';
import PromptModal from '../components/PromptModal';
import { useAppConfig } from '../ConfigContext';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [msgBox, setMsgBox] = useState({ isOpen: false, type: 'info', message: '' });
    const [promptBox, setPromptBox] = useState({ isOpen: false, title: '', message: '' });
    const { appConfig } = useAppConfig();
    const navigate = useNavigate();

    // 初始化：檢查是否有已儲存的使用者或記住的帳號
    useEffect(() => {
        const checkAuth = async () => {
            const savedUser = sessionStorage.getItem(config.STORAGE_KEYS.USER);
            if (savedUser) {
                navigate('/search');
                return;
            }

            const remembered = localStorage.getItem(config.STORAGE_KEYS.REMEMBERED_ACCOUNT);
            if (remembered) {
                try {
                    const { u, p } = JSON.parse(remembered);
                    setUsername(u);
                    setPassword(p);
                    setRememberMe(true);
                } catch (e) {
                    localStorage.removeItem(config.STORAGE_KEYS.REMEMBERED_ACCOUNT);
                }
            }
        };
        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await api.login(username, password);

        if (result.success && result.data) {
            // 儲存目前登入狀態至 sessionStorage (關閉視窗即失效)
            sessionStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(result.data));

            // 處理「記住我」 (僅儲存帳密，不維持登入態)
            if (rememberMe) {
                localStorage.setItem(config.STORAGE_KEYS.REMEMBERED_ACCOUNT, JSON.stringify({ u: username, p: password }));
            } else {
                localStorage.removeItem(config.STORAGE_KEYS.REMEMBERED_ACCOUNT);
            }

            navigate('/search');
        } else {
            setMsgBox({ isOpen: true, type: 'error', message: result.message || '登入失敗' });
        }

        setLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!username) {
            setPromptBox({
                isOpen: true,
                title: '重設密碼',
                message: '請輸入您的帳號以重設密碼：'
            });
            return;
        }
        executeForgotPassword(username);
    };

    const executeForgotPassword = async (targetUsername) => {
        if (!targetUsername) return;
        setPromptBox({ ...promptBox, isOpen: false });
        setIsForgotLoading(true);
        const result = await api.forgotPassword(targetUsername);
        if (result.success) {
            setMsgBox({ isOpen: true, type: 'success', message: result.message });
        } else {
            setMsgBox({ isOpen: true, type: 'error', message: result.message });
        }
        setIsForgotLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card fade-in">
                    <div className="login-header">
                        <h1 className="login-title">課程指引與評鑑查詢系統</h1>
                        <p className="login-subtitle">收錄CM117至CM121的真實課程評價</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">帳號</label>
                            <input
                                id="username"
                                type="text"
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="請輸入帳號"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">密碼</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="請輸入密碼"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-helper">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>記住我</span>
                            </label>
                            <button
                                type="button"
                                className="forgot-password-link"
                                onClick={handleForgotPassword}
                                disabled={loading || isForgotLoading}
                            >
                                {isForgotLoading ? '處理中...' : '忘記密碼？'}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                        >
                            {loading ? '登入中...' : '登入'}
                        </button>
                    </form>
                </div>

                <div className="login-footer">
                    <button
                        className="guest-submit-btn"
                        onClick={() => navigate('/submit')}
                    >
                        💡 省略登入流程：快速填寫課程評鑑
                    </button>
                    <a
                        href={appConfig.USER_MANUAL_URL || '#'}
                        target={appConfig.USER_MANUAL_URL ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`login-manual-link ${!appConfig.USER_MANUAL_URL ? 'is-loading' : ''}`}
                        onClick={(e) => {
                            if (!appConfig.USER_MANUAL_URL) {
                                e.preventDefault();
                                setMsgBox({ isOpen: true, type: 'info', message: '操作手冊連結讀取中，請稍候...' });
                            }
                        }}
                    >
                        📖 下載操作手冊
                    </a>
                    <div className="footer-bottom-row">
                        <p>© 長庚中醫系學會所有</p>
                        <button
                            className="login-report-btn-inline"
                            onClick={() => setIsReportOpen(true)}
                        >
                            系統異常回報
                        </button>
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
            />

            <MessageBox
                isOpen={msgBox.isOpen}
                type={msgBox.type}
                message={msgBox.message}
                onClose={() => setMsgBox({ ...msgBox, isOpen: false })}
            />

            <PromptModal
                isOpen={promptBox.isOpen}
                title={promptBox.title}
                message={promptBox.message}
                placeholder="請輸入帳號"
                onConfirm={(val) => executeForgotPassword(val)}
                onClose={() => setPromptBox({ ...promptBox, isOpen: false })}
            />
        </div>
    );
}

export default LoginPage;
