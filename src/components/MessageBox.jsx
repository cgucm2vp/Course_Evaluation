import React from 'react';
import './MessageBox.css';

/**
 * MessageBox 組件 - 取代原生 alert
 * @param {Object} props
 * @param {string} props.type - 'success', 'error', 'warning', 'info'
 * @param {string} props.message - 提示內容
 * @param {Function} props.onClose - 關閉回調
 * @param {string} props.actionLabel - (可選) 操作按鈕文字
 * @param {Function} props.onAction - (可選) 操作按鈕回調
 * @param {boolean} props.hideConfirm - (可選) 是否隱藏預設確定按鈕
 * @param {Function} props.onCancel - (可選) 點擊 X 或背景的回調，若無則預設使用 onClose
 */
function MessageBox({ isOpen, type = 'info', message, onClose, actionLabel, onAction, hideConfirm = false, onCancel }) {
    if (!isOpen) return null;

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'success': return '成功';
            case 'error': return '錯誤';
            case 'warning': return '警告';
            default: return '提示';
        }
    };

    return (
        <div className="message-box-backdrop" onClick={handleCancel}>
            <div className={`message-box-card fade-in border-${type}`} onClick={e => e.stopPropagation()}>
                <button className="message-box-close-btn" onClick={handleCancel} aria-label="關閉視窗">×</button>
                <div className="message-box-icon">{getIcon()}</div>
                <div className="message-box-content">
                    <h3 className={`message-box-title text-${type}`}>{getTitle()}</h3>
                    <p className="message-box-text">{message}</p>
                </div>
                <div className="message-box-actions">
                    {onAction && actionLabel && (
                        <button className="btn btn-secondary" onClick={onAction}>
                            {actionLabel}
                        </button>
                    )}
                    {!hideConfirm && (
                        <button className={`btn btn-primary btn-${type}`} onClick={onClose}>
                            確定
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessageBox;
