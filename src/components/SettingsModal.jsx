import { useState } from 'react';
import api from '../services/api';
import config from '../config';
import MessageBox from './MessageBox';

function SettingsModal({ isOpen, onClose, username }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        recoveryEmail: ''
    });
    const [loading, setLoading] = useState(false);
    const [showCur, setShowCur] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [msgBox, setMsgBox] = useState({ isOpen: false, type: 'info', message: '' });

    if (!isOpen) return null;

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            recoveryEmail: ''
        });
        setShowCur(false);
        setShowNew(false);
        setShowConf(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword) {
            // 密碼規範：英數混合、8位以上
            const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
            if (!pwdRegex.test(formData.newPassword)) {
                setMsgBox({ isOpen: true, type: 'error', message: '新密碼必須包含英文字母與數字，且長度至少 8 位' });
                return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setMsgBox({ isOpen: true, type: 'error', message: '兩次新密碼輸入不一致' });
                return;
            }
        }

        setLoading(true);
        const result = await api.updateProfile({
            username,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            recoveryEmail: formData.recoveryEmail
        });

        if (result.success) {
            // 如果更改了密碼，強制登出 (sessionStorage)
            if (result.passwordChanged) {
                sessionStorage.removeItem(config.STORAGE_KEYS.USER);
                setMsgBox({
                    isOpen: true,
                    type: 'success',
                    message: result.message + '，密碼已變更，請重新登入',
                    onClose: () => window.location.reload()
                });
            } else {
                setMsgBox({
                    isOpen: true,
                    type: 'success',
                    message: result.message,
                    onClose: () => handleClose()
                });
            }
        } else {
            setMsgBox({ isOpen: true, type: 'error', message: result.message });
        }
        setLoading(false);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content fade-in" style={{ maxWidth: '400px', overflowY: 'auto', maxHeight: '90vh' }}>
                <div className="modal-header">
                    <h3>帳戶設定</h3>
                    <button className="close-btn" onClick={handleClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">目前的密碼 (必填以驗證身分)</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showCur ? "text" : "password"}
                                className="input"
                                required
                                value={formData.currentPassword}
                                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                placeholder="請輸入目前密碼"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowCur(!showCur)}
                                tabIndex="-1"
                            >
                                {showCur ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />

                    <div className="form-group">
                        <label className="form-label">新密碼 (若不變更請留空)</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showNew ? "text" : "password"}
                                className="input"
                                value={formData.newPassword}
                                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                placeholder="英數混合，至少 8 位"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowNew(!showNew)}
                                tabIndex="-1"
                            >
                                {showNew ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">確認新密碼</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConf ? "text" : "password"}
                                className="input"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="再次輸入新密碼"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConf(!showConf)}
                                tabIndex="-1"
                            >
                                {showConf ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">備援電子郵件 (用於忘記密碼)</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="例如：abc@example.com"
                            value={formData.recoveryEmail}
                            onChange={e => setFormData({ ...formData, recoveryEmail: e.target.value })}
                        />
                    </div>



                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                        {loading ? '更新中...' : '儲存變更'}
                    </button>
                </form>
            </div>

            <MessageBox
                isOpen={msgBox.isOpen}
                type={msgBox.type}
                message={msgBox.message}
                onClose={() => {
                    if (msgBox.onClose) msgBox.onClose();
                    setMsgBox({ ...msgBox, isOpen: false });
                }}
            />
        </div>
    );
}

export default SettingsModal;
