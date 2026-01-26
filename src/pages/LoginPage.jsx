import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import ReportModal from '../components/ReportModal';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await api.login(username, password);

        if (result.success) {
            // 儲存使用者資訊
            localStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(result.data));
            // 導向搜尋頁面
            navigate('/search');
        } else {
            setError(result.message || '登入失敗');
        }

        setLoading(false);
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
                            <input
                                id="password"
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="請輸入密碼"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

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
                        💡 省略登入流程：快速前往填寫課程評鑑
                    </button>
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
        </div>
    );
}

export default LoginPage;
