import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import CourseCard from '../components/CourseCard';
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
    const navigate = useNavigate();

    useEffect(() => {
        // 檢查登入狀態
        const userData = localStorage.getItem(config.STORAGE_KEYS.USER);
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(userData));

        // 載入熱門課程與課程選單
        loadHotCourses();
        loadCourseMapping();
    }, [navigate]);

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
        navigate('/');
    };

    const handleCourseClick = (course) => {
        navigate(`/course/${encodeURIComponent(course.name)}/${encodeURIComponent(course.teacher)}`);
    };

    // 取得當前可選課程清單
    const getAvailableCourses = () => {
        const parent = courseMapping[filters.category];
        if (!parent) return [];

        if (filters.subcategory) {
            // 如果選了子分類
            return parent.sub[filters.subcategory] || [];
        } else {
            // 如果沒選子分類（或該母分類沒子分類），顯示所有（或是 direct 的）
            // 這裡建議顯示該母分類下「所有」課程或是僅 direct 課程
            // 依照使用者邏輯，若是大一課程沒子分類，則顯示該母分類下的課程
            const allCoursesInParent = [...parent.direct];
            // 若有子分類則把子分類課程也塞進去，讓使用者即使沒選子分類也能在母分類看到全部
            Object.values(parent.sub).forEach(subList => {
                allCoursesInParent.push(...subList);
            });
            return Array.from(new Set(allCoursesInParent)).sort();
        }
    };

    const availableCourses = getAvailableCourses();

    return (
        <div className="search-page">
            <header className="search-header">
                <div className="container">
                    <div className="header-content">
                        <h1 className="header-title">課程評鑑查詢</h1>
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
                                    <label className="form-label">課程名稱</label>
                                    {filters.category ? (
                                        <select
                                            className="input"
                                            value={filters.keyword}
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                        >
                                            <option value="">選擇課程</option>
                                            {availableCourses.map((name, index) => (
                                                <option key={index} value={name}>{name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="input"
                                            value={filters.keyword}
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                            placeholder="輸入關鍵字"
                                        />
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
                                        placeholder="例如：2023"
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
        </div>
    );
}

export default SearchPage;
