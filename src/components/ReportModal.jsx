import { useState } from 'react';
import api from '../services/api';
import './ReportModal.css';

function ReportModal({ isOpen, onClose }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        if (!content.trim()) {
            setErrorMsg('請輸入問題描述');
            setLoading(false);
            return;
        }

        const result = await api.reportIssue(content);

        if (result.success) {
            setSuccessMsg('我們已經收到您的回饋或通報，我們會盡速修復並更新，感謝您！');
            setContent('');
            // 3秒後自動關閉
            setTimeout(() => {
                onClose();
                setSuccessMsg('');
            }, 3000);
        } else {
            setErrorMsg(result.message || '回報失敗，請稍後再試');
        }

        setLoading(false);
    };

    return (
        <div className="report-modal-backdrop" onClick={onClose}>
            <div className="report-modal-content" onClick={e => e.stopPropagation()}>
                <button className="report-close-btn" onClick={onClose}>×</button>

                <h3 className="report-modal-title">🚨 異常回報</h3>

                {successMsg ? (
                    <div className="report-success-message">
                        <div className="success-icon">✅</div>
                        <p>{successMsg}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">問題描述</label>
                            <textarea
                                className="report-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="請詳細描述您遇到的問題..."
                                rows="5"
                                disabled={loading}
                            />
                        </div>

                        {errorMsg && <div className="report-error-message">{errorMsg}</div>}

                        <div className="report-actions">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={onClose}
                                disabled={loading}
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? '傳送中...' : '送出回報'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ReportModal;
