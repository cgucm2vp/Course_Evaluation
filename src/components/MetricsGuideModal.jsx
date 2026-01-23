import './MetricsGuideModal.css';

function MetricsGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="關閉說明">×</button>

                <h3 className="modal-title">📌 評鑑標準說明</h3>

                <div className="metrics-list">
                    <div className="metric-item">
                        <h4 className="metric-name cooling">❄️ 涼度 (1~5)</h4>
                        <p className="metric-desc">
                            考慮需要付出的時間、心力。付出越多，涼度越低分。
                            <span className="metric-note">（分數越高代表越輕鬆）</span>
                        </p>
                    </div>

                    <div className="metric-item">
                        <h4 className="metric-name sweetness">🍭 甜度 (1~5)</h4>
                        <p className="metric-desc">
                            僅考慮成績給分，與成績直接相關。
                        </p>
                        <div className="table-container">
                            <table className="rating-table">
                                <thead>
                                    <tr>
                                        <th>甜度評分</th>
                                        <th>成績區間</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="score-badge sweetness">5</span></td>
                                        <td>95 ~ 100 分</td>
                                    </tr>
                                    <tr>
                                        <td><span className="score-badge sweetness">4</span></td>
                                        <td>90 ~ 95 分</td>
                                    </tr>
                                    <tr>
                                        <td><span className="score-badge sweetness">3</span></td>
                                        <td>85 ~ 90 分</td>
                                    </tr>
                                    <tr>
                                        <td><span className="score-badge sweetness">2</span></td>
                                        <td>80 ~ 85 分</td>
                                    </tr>
                                    <tr>
                                        <td><span className="score-badge sweetness">1</span></td>
                                        <td>&lt; 80 分</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="metric-item">
                        <h4 className="metric-name richness">📚 有料程度 (1~5)</h4>
                        <p className="metric-desc">
                            考慮上課內容是否充實、是否有學到東西。
                            <span className="metric-note">（分數越高代表內容越豐富，反之則可能不知道教授在做什麼）</span>
                        </p>
                    </div>

                    <div className="metric-item">
                        <h4 className="metric-name">💬 修課指引 / 課程評價</h4>
                        <p className="metric-desc">
                            學長姐們的經驗談，可能受個人生活經驗及情感所影響，僅供參考。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MetricsGuideModal;
