import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import DataVisualization from '../components/DataVisualization';
import ReviewCard from '../components/ReviewCard';
import './CourseDetailPage.css';

function CourseDetailPage() {
    const { courseName, teacher } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadCourseDetail();
        // 記錄瀏覽
        api.recordView(decodeURIComponent(courseName), decodeURIComponent(teacher));
    }, [courseName, teacher]);

    const loadCourseDetail = async () => {
        setLoading(true);
        const result = await api.getCourseDetail(
            decodeURIComponent(courseName),
            decodeURIComponent(teacher)
        );

        if (result.success) {
            const data = result.data;
            setCourseData(data);

            // 處理跳轉定位：從 URL 獲取指定年份
            const queryParams = new URLSearchParams(location.search);
            const targetYear = queryParams.get('year');

            if (targetYear && data.reviews) {
                const index = data.reviews.findIndex(r => r.year.toString() === targetYear);
                if (index !== -1) {
                    setCurrentReviewIndex(index);
                }
            }
        } else {
            alert(result.message || '取得課程詳情失敗');
            navigate('/search');
        }

        setLoading(false);
    };

    const handlePrevReview = () => {
        setCurrentReviewIndex((prev) =>
            prev > 0 ? prev - 1 : courseData.reviews.length - 1
        );
    };

    const handleNextReview = () => {
        setCurrentReviewIndex((prev) =>
            prev < courseData.reviews.length - 1 ? prev + 1 : 0
        );
    };

    if (loading) {
        return (
            <div className="course-detail-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>載入中...</p>
                </div>
            </div>
        );
    }

    if (!courseData) {
        return null;
    }

    return (
        <div className="course-detail-page">
            <header className="detail-header">
                <div className="container">
                    <button onClick={() => navigate('/search')} className="btn btn-ghost back-btn">
                        ← 返回搜尋
                    </button>

                    <div className="course-header-info">
                        <h1 className="course-title">{courseData.course.name}</h1>
                        <div className="course-meta">
                            <span className="meta-item">👨‍🏫 {courseData.course.teacher}</span>
                            <span className="meta-item">📚 {courseData.course.category} / {courseData.course.subcategory}</span>
                            <span className="meta-item">📊 樣本數：{courseData.stats.sampleCount}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="detail-main">
                <div className="container">
                    {/* 數據可視化區塊 */}
                    <section className="stats-section fade-in">
                        <h2 className="section-title">📈 數據分析</h2>
                        <DataVisualization stats={courseData.stats} />
                    </section>

                    {/* 評價卡片區塊 */}
                    <section className="reviews-section fade-in">
                        <div className="reviews-header">
                            <h2 className="section-title">💬 修課心得</h2>
                            <div className="review-counter">
                                {currentReviewIndex + 1} / {courseData.reviews.length}
                            </div>
                        </div>

                        <div className="reviews-carousel">
                            <button
                                onClick={handlePrevReview}
                                className="carousel-btn carousel-btn-prev"
                                aria-label="上一則評價"
                            >
                                ‹
                            </button>

                            <div className="reviews-container">
                                <ReviewCard review={courseData.reviews[currentReviewIndex]} />
                            </div>

                            <button
                                onClick={handleNextReview}
                                className="carousel-btn carousel-btn-next"
                                aria-label="下一則評價"
                            >
                                ›
                            </button>
                        </div>

                        {/* 指示器 */}
                        <div className="carousel-indicators">
                            {courseData.reviews.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentReviewIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentReviewIndex(index)}
                                    aria-label={`查看第 ${index + 1} 則評價`}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default CourseDetailPage;
