import React from 'react';
import './SuccessModal.css';

function SuccessModal({ isOpen, onAddNext, onReturn, targetCourse, onReturnToCourse }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content success-modal fade-in">
                <div className="success-icon">✅</div>
                <h2>提交成功！</h2>
                <p className="success-message">感謝您的慷慨分享，您的評鑑將在管理員審核後正式發佈，為學弟妹指引方向。</p>

                <div className="success-actions">
                    <button className="btn btn-primary btn-full" onClick={onAddNext}>
                        再寫一則評鑑
                    </button>

                    {targetCourse && (
                        <button className="btn btn-secondary btn-full" onClick={onReturnToCourse}>
                            回到 {targetCourse}
                        </button>
                    )}

                    <button className="btn btn-outline btn-full" onClick={onReturn}>
                        返回首頁
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuccessModal;
