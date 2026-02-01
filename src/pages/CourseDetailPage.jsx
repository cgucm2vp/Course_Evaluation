import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import DataVisualization from '../components/DataVisualization';
import ReviewCard from '../components/ReviewCard';
import MetricsGuideModal from '../components/MetricsGuideModal';
import SettingsModal from '../components/SettingsModal';
import Footer from '../components/Footer';
import { useRef } from 'react';
import './CourseDetailPage.css';

function CourseDetailPage() {
    const { courseName, teacher } = useParams();
    const [user, setUser] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 彩蛋：追蹤評論切換速度
    const lastSwitchTime = useRef(Date.now());
    const switchCount = useRef(0);

    useEffect(() => {
        const userData = sessionStorage.getItem(config.STORAGE_KEYS.USER);
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            // 未登入不可查看詳情，導向登入頁面
            navigate('/');
            return;
        }

        loadCourseDetail();
        // 記錄瀏覽
        api.recordView(decodeURIComponent(courseName), decodeURIComponent(teacher));

        // 彩蛋：追蹤獨特課程瀏覽量
        const courseId = `${courseName}-${teacher}`;
        const viewedCourses = JSON.parse(sessionStorage.getItem('viewed_unique_courses') || '[]');
        if (!viewedCourses.includes(courseId)) {
            const newList = [...viewedCourses, courseId];
            sessionStorage.setItem('viewed_unique_courses', JSON.stringify(newList));
            if (newList.length === 10) {
                window.dispatchEvent(new CustomEvent('trigger-easter-egg', { detail: { type: 'achievement' } }));
            }
        }
    }, [courseName, teacher, navigate]);

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

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const handleSwitchLogic = () => {
        const now = Date.now();
        if (now - lastSwitchTime.current < 1000) {
            switchCount.current += 1;
            if (switchCount.current >= 5) {
                window.dispatchEvent(new CustomEvent('trigger-easter-egg', { detail: { type: 'speed' } }));
                switchCount.current = 0; // 重置
            }
        } else {
            switchCount.current = 1;
        }
        lastSwitchTime.current = now;
    };

    const handlePrevReview = () => {
        handleSwitchLogic();
        setCurrentReviewIndex((prev) =>
            prev > 0 ? prev - 1 : courseData.reviews.length - 1
        );
    };

    const handleNextReview = () => {
        handleSwitchLogic();
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
            <div className="detail-simple-header">
                <div className="container">
                    <button onClick={() => navigate('/search')} className="detail-back-btn" title="返回搜尋頁面">
                        ← 返回
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
            </div>

            <main className="detail-main">
                <div className="container">
                    {/* 數據可視化區塊 */}
                    <section className="stats-section fade-in">
                        <div className="section-header-with-action">
                            <h2 className="section-title">📈 數據分析</h2>
                            <button
                                className="info-btn"
                                onClick={() => setShowGuideModal(true)}
                                aria-label="查看評鑑標準說明"
                            >
                                ℹ️ 評鑑標準說明
                            </button>
                        </div>
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

                        {/* 評價引導按鈕 */}
                        <div className="detail-eval-cta-container">
                            <button
                                className="btn btn-primary eval-cta-btn"
                                onClick={() => navigate('/submit', {
                                    state: {
                                        from: location.pathname,
                                        courseName: courseData.course.name,
                                        teacher: courseData.course.teacher,
                                        category: courseData.course.category,
                                        subcategory: courseData.course.subcategory
                                    }
                                })}
                            >
                                ✍️ 我也想為此門課程評鑑
                            </button>
                            <p className="eval-cta-hint">分享你的修課心得，幫助更多人！</p>
                        </div>
                    </section>
                </div>
            </main>

            <MetricsGuideModal
                isOpen={showGuideModal}
                onClose={() => setShowGuideModal(false)}
            />

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                username={user?.username}
            />

            <Footer />
        </div>
    );
}

export default CourseDetailPage;
