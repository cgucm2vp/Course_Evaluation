import React from 'react';
import './ReviewGuideModal.css';

function ReviewGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content guide-modal" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>📝 撰寫指引說明</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>
                <div className="modal-body">
                    <section className="guide-section">
                        <h3>如何撰寫評鑑內容？</h3>
                        <p>為了幫助學弟妹更理解課程，建議參考以下方向：</p>
                        <ul className="guide-list">
                            <li><strong>格式：</strong> 不拘 (列點或小文章皆可，方便理解即可)。</li>
                            <li><strong>課程名稱：</strong> 若選擇「其他」，請務必於內容詳述正確課程名稱。</li>
                            <li><strong>授課教師：</strong> 若現任老師與修課時不同，請特別註記說明。</li>
                            <li><strong>評分指標：</strong> 建議填寫「評分機制」及「加分模式」。</li>
                            <li><strong>助教資訊：</strong> 如有助教可填寫「助教姓名」(有時評分權在助教身上)。</li>
                            <li><strong>課堂細節：</strong> 老師的「個人喜好」(如：喜歡發問) 或「未來規劃」(如：退休、改模式)。</li>
                            <li><strong>特殊屬性：</strong> 如有「全英授課」或「須具備特殊能力」請特別註記。</li>
                            <li><strong>心得鼓勵：</strong> 其他任何想寫的內容，或給學弟妹的鼓勵。</li>
                        </ul>
                    </section>

                    <section className="guide-section warning-box">
                        <h3>⚠️ 注意事項</h3>
                        <p>請避免人身攻擊、使用不雅文字或散佈虛假傳聞。管理員審核時若發現違反社群守則之內容將不予發佈。</p>
                    </section>
                </div>
                <footer className="modal-footer">
                    <button className="btn-confirm" onClick={onClose}>我了解了</button>
                </footer>
            </div>
        </div>
    );
}

export default ReviewGuideModal;
