import React from 'react';
import './SuccessModal.css';

function SuccessModal({ isOpen, onAddNext, onReturn }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content success-modal fade-in">
                <div className="success-icon">✅</div>
                <h2>提交成功！</h2>
                <p className="success-message">感謝您的慷慨分享，您的評鑑將在管理員審核後正式發佈，為學弟妹指引方向。</p>

                <div className="success-actions">
                    <button className="btn btn-primary" onClick={onAddNext}>
                        再寫一則評鑑
                    </button>
                    <button className="btn btn-outline" onClick={onReturn}>
                        返回回首頁
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuccessModal;
