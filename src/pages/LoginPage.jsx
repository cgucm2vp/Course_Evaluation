import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
                        <h1 className="login-title">課程評鑑查詢系統</h1>
                        <p className="login-subtitle">探索最真實的課程評價</p>
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
                    <p>© 2026 課程評鑑查詢系統</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
