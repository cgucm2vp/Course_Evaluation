import React, { useState, useEffect } from 'react';
import './MessageBox.css'; // 共用 MessageBox 的背景樣式

function PromptModal({ isOpen, title, message, placeholder, onConfirm, onClose }) {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) setInputValue('');
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(inputValue);
    };

    return (
        <div className="message-box-backdrop">
            <div className="message-box-card fade-in" style={{ borderTopColor: 'var(--color-primary)' }}>
                <div className="message-box-icon">❓</div>
                <div className="message-box-content" style={{ width: '100%' }}>
                    <h3 className="message-box-title">{title || '請輸入'}</h3>
                    <p className="message-box-text">{message}</p>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <input
                            type="text"
                            className="input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={placeholder}
                            autoFocus
                            required
                            style={{ marginBottom: '1.5rem' }}
                        />
                        <div className="message-box-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary btn-info" style={{ flex: 1 }}>
                                確定
                            </button>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PromptModal;
