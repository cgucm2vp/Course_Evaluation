import './DisclaimerModal.css';

function DisclaimerModal({ isOpen, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content disclaimer-content">
                <div className="disclaimer-header">
                    <span className="warning-icon">⚠️</span>
                    <h3 className="modal-title disclaimer-title">重要保密聲明</h3>
                </div>

                <div className="disclaimer-message">
                    <p>本網站內容嚴禁外流予非長庚中醫系學會成員。</p>
                    <p className="highlight-text">請確認知悉此事項並遵守相關規定。</p>
                </div>

                <button
                    className="btn btn-primary confirm-btn"
                    onClick={onConfirm}
                >
                    我已知悉並同意遵守
                </button>
            </div>
        </div>
    );
}

export default DisclaimerModal;
