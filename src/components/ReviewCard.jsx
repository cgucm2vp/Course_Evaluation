import { useState } from 'react';
import './ReviewCard.css';

function ReviewCard({ review }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const text = review.review || '無評價內容';
    const isLongText = text.length > 100;

    const displayText = isExpanded ? text : (isLongText ? text.slice(0, 100) + '...' : text);

    return (
        <div className={`review-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="review-header">
                <div className="review-meta">
                    <span className="review-year">📅 {review.semester || review.year}</span>
                    <div className="review-scores">
                        <span className="score-badge sweetness">🍭 {review.sweetness}</span>
                        <span className="score-badge coolness">❄️ {review.coolness}</span>
                        <span className="score-badge richness">📚 {review.richness}</span>
                    </div>

                </div>
            </div>

            <div className="review-content">
                <h4 className="review-title">修課心得與建議</h4>
                <p className="review-text">{displayText}</p>

                {isLongText && (
                    <button
                        className="read-more-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '收起內容 ▲' : '閱讀更多 ▼'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ReviewCard;
