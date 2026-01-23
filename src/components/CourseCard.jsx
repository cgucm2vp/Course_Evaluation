import './CourseCard.css';

function CourseCard({ course, onClick, showViewCount = false }) {
    return (
        <div className="course-card" onClick={onClick}>
            <div className="course-card-header">
                <h3 className="course-name">
                    {course.name}
                    {course.reviewCount > 0 && <span className="review-stat-count">({course.reviewCount})</span>}
                </h3>
                {showViewCount && course.viewCount && (
                    <span className="view-count">👁 {course.viewCount}</span>
                )}
            </div>

            <div className="course-info">
                <div className="info-item">
                    <span className="info-label">教師</span>
                    <span className="info-value">{course.teacher}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">分類</span>
                    <span className="info-value">{course.category} / {course.subcategory}</span>
                </div>

                {course.year && (
                    <div className="info-item">
                        <span className="info-label">年分</span>
                        <span className="info-value">{course.year}</span>
                    </div>
                )}
            </div>

            <div className="course-card-footer">
                <span className="view-detail">查看詳情 →</span>
            </div>
        </div>
    );
}

export default CourseCard;
