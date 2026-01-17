import './ReviewCard.css';

function ReviewCard({ review }) {
    return (
        <div className="review-card">
            <div className="review-header">
                <div className="review-meta">
                    <span className="review-year">📅 {review.year}</span>
                    <div className="review-scores">
                        <span className="score-badge sweetness">🍭 {review.sweetness}</span>
                        <span className="score-badge coolness">❄️ {review.coolness}</span>
                        <span className="score-badge richness">📚 {review.richness}</span>
                    </div>
                </div>
            </div>

            <div className="review-content">
                <h4 className="review-title">修課心得與建議</h4>
                <p className="review-text">{review.review || '無評價內容'}</p>
            </div>
        </div>
    );
}

export default ReviewCard;
