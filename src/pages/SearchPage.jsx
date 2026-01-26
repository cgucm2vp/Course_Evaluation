import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import CourseCard from '../components/CourseCard';
import MetricsGuideModal from '../components/MetricsGuideModal';
import DisclaimerModal from '../components/DisclaimerModal';
import Footer from '../components/Footer';
import './SearchPage.css';

function SearchPage() {
    const [user, setUser] = useState(null);
    const [filters, setFilters] = useState({
        keyword: '',
        teacher: '',
        year: '',
        category: '',
        subcategory: ''
    });
    const [results, setResults] = useState([]);
    const [hotCourses, setHotCourses] = useState([]);
    const [courseMapping, setCourseMapping] = useState({});
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [useDropdown, setUseDropdown] = useState(true);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 檢查登入狀態
        const userData = localStorage.getItem(config.STORAGE_KEYS.USER);
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(userData));

        // 檢查是否已確認過保密聲明
        const hasConfirmed = sessionStorage.getItem('hasConfirmedDisclaimer');
        if (!hasConfirmed) {
            setShowDisclaimer(true);
        }

        // 載入熱門課程與課程選單
        loadHotCourses();
        loadCourseMapping();
    }, [navigate]);

    const handleDisclaimerConfirm = () => {
        sessionStorage.setItem('hasConfirmedDisclaimer', 'true');
        setShowDisclaimer(false);
    };

    const loadHotCourses = async () => {
        const result = await api.getHotCourses();
        if (result.success) {
            setHotCourses(result.data || []);
        }
    };

    const loadCourseMapping = async () => {
        const result = await api.getCourseMapping();
        if (result.success) {
            setCourseMapping(result.data || {});
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        // 如果母分類與課程名稱都選了，就不進行合併
        const searchParams = { ...filters };
        if (filters.category && filters.keyword) {
            searchParams.shouldMerge = false;
        }

        // 判斷是否為精確匹配：如果是下拉模式則為精確匹配
        const hasSubcategories = filters.category && courseMapping[filters.category]?.sub && Object.keys(courseMapping[filters.category].sub).length > 0;
        const isSubcategoryPicked = !!filters.subcategory;

        let isDropdown = false;
        if (!filters.category) {
            isDropdown = false;
        } else if (hasSubcategories && !isSubcategoryPicked) {
            isDropdown = useDropdown;
        } else {
            isDropdown = true;
        }

        searchParams.isExact = isDropdown;

        const result = await api.searchCourses(searchParams);

        if (result.success) {
            setResults(result.data || []);
        } else {
            alert(result.message || '搜尋失敗');
        }

        setLoading(false);
    };

    const handleRandomRecommend = async () => {
        setLoading(true);
        const result = await api.getRandomCourses();

        if (result.success) {
            setResults(result.data || []);
            setSearched(true);
        } else {
            alert(result.message || '取得隨機推薦失敗');
        }

        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem(config.STORAGE_KEYS.USER);
        sessionStorage.removeItem('hasConfirmedDisclaimer');
        navigate('/');
    };

    const handleCourseClick = (course) => {
        let url = `/course/${encodeURIComponent(course.name)}/${encodeURIComponent(course.teacher)}`;
        if (course.year) {
            url += `?year=${encodeURIComponent(course.year)}`;
        }
        navigate(url);
    };

    // 取得當前可選課程清單
    const getAvailableCourses = () => {
        const parent = courseMapping[filters.category];
        if (!parent) return [];

        let list = [];
        if (filters.subcategory) {
            // 如果選了子分類
            list = parent.sub[filters.subcategory] || [];
        } else {
            // 如果沒選子分類（或該母分類沒子分類），顯示所有
            list = [...parent.direct];
            Object.values(parent.sub).forEach(subList => {
                list.push(...subList);
            });
        }

        // 去重並按名稱排序
        const uniqueItems = {};
        list.forEach(item => {
            if (!uniqueItems[item.name]) {
                uniqueItems[item.name] = item;
            }
        });

        return Object.values(uniqueItems).sort((a, b) => a.name.localeCompare(b.name));
    };

    const availableCourses = getAvailableCourses();

    return (
        <div className="search-page">
            <header className="search-header">
                <div className="container">
                    <div className="header-content">
                        <h1 className="header-title">課程指引與評鑑查詢系統</h1>
                        <div className="header-actions">
                            <span className="user-name">歡迎，{user?.name}</span>
                            <button onClick={handleLogout} className="btn btn-ghost">登出</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="search-main">
                <div className="container">
                    {/* 搜尋表單 */}
                    <div className="search-section fade-in">
                        <form onSubmit={handleSearch} className="search-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">課程母分類</label>
                                    <select
                                        className="input"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value, subcategory: '', keyword: '' })}
                                    >
                                        <option value="">全部分類</option>
                                        {Object.keys(courseMapping).map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {courseMapping[filters.category]?.sub && Object.keys(courseMapping[filters.category].sub).length > 0 && (
                                    <div className="form-group slide-in">
                                        <label className="form-label">課程子分類</label>
                                        <select
                                            className="input"
                                            value={filters.subcategory}
                                            onChange={(e) => setFilters({ ...filters, subcategory: e.target.value, keyword: '' })}
                                        >
                                            <option value="">全部子分類</option>
                                            {Object.keys(courseMapping[filters.category].sub).map((sub, index) => (
                                                <option key={index} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="form-group">
                                    <div className="label-with-mode">
                                        <label className="form-label">課程名稱</label>
                                        {filters.category && courseMapping[filters.category]?.sub && Object.keys(courseMapping[filters.category].sub).length > 0 && !filters.subcategory && (
                                            <button
                                                type="button"
                                                className="mode-toggle-btn"
                                                onClick={() => {
                                                    setUseDropdown(!useDropdown);
                                                    setFilters({ ...filters, keyword: '' });
                                                }}
                                            >
                                                {useDropdown ? '⌨️ 手動輸入' : '🖱️ 下拉選單'}
                                            </button>
                                        )}
                                    </div>
                                    {((!filters.category) || (filters.category && courseMapping[filters.category]?.sub && Object.keys(courseMapping[filters.category].sub).length > 0 && !filters.subcategory && !useDropdown)) ? (
                                        <input
                                            type="text"
                                            className="input"
                                            value={filters.keyword}
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                            placeholder="輸入關鍵字"
                                        />
                                    ) : (
                                        <select
                                            className="input"
                                            value={filters.keyword}
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                        >
                                            <option value="">選擇課程</option>
                                            {availableCourses.map((course, index) => (
                                                <option key={index} value={course.name}>
                                                    {course.name} ({course.count})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">授課教師</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={filters.teacher}
                                        onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
                                        placeholder="輸入教師姓名"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">修課年分</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={filters.year}
                                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                        placeholder="例如：114-2"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? '搜尋中...' : '搜尋課程'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRandomRecommend}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    隨機推薦
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 評鑑引導 CTA */}
                    <div className="search-eval-cta fade-in">
                        <div className="cta-content">
                            <span className="cta-text">📢 發現沒被記錄的課程？或是想更新心得？</span>
                            <button
                                onClick={() => navigate('/submit')}
                                className="btn btn-primary cta-btn"
                            >
                                ✍️ 分享我的評鑑
                            </button>
                        </div>
                    </div>

                    {/* 評分說明按鈕 */}
                    <div className="metrics-guide-container fade-in">
                        <button
                            className="guide-btn"
                            onClick={() => setShowGuideModal(true)}
                            aria-label="查看評鑑標準說明"
                        >
                            ℹ️ 評鑑標準與指標說明
                        </button>
                    </div>

                    {/* 熱門課程推薦 */}
                    {!searched && hotCourses.length > 0 && (
                        <div className="hot-section fade-in">
                            <h2 className="section-title">🔥 熱門課程</h2>
                            <div className="course-grid">
                                {hotCourses.map((course, index) => (
                                    <CourseCard
                                        key={index}
                                        course={course}
                                        onClick={() => handleCourseClick(course)}
                                        showViewCount={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 搜尋結果 */}
                    {searched && (
                        <div className="results-section fade-in">
                            <h2 className="section-title">
                                搜尋結果 <span className="result-count">({results.length} 筆)</span>
                            </h2>
                            {results.length > 0 ? (
                                <div className="course-grid">
                                    {results.map((course, index) => (
                                        <CourseCard
                                            key={index}
                                            course={course}
                                            onClick={() => handleCourseClick(course)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>找不到符合條件的課程</p>
                                    <p className="empty-hint">試試調整搜尋條件或使用隨機推薦</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <MetricsGuideModal
                isOpen={showGuideModal}
                onClose={() => setShowGuideModal(false)}
            />

            <DisclaimerModal
                isOpen={showDisclaimer}
                onConfirm={handleDisclaimerConfirm}
            />

            <Footer />
        </div>
    );
}

export default SearchPage;
