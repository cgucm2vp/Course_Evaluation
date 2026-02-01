import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import CourseCard from '../components/CourseCard';
import MetricsGuideModal from '../components/MetricsGuideModal';
import DisclaimerModal from '../components/DisclaimerModal';
import Footer from '../components/Footer';
import SettingsModal from '../components/SettingsModal';
import MessageBox from '../components/MessageBox';
import LegendaryEffect from '../components/LegendaryEffect';
import './SearchPage.css';

function SearchPage() {
    const [user, setUser] = useState(null);
    const [rememberFilters, setRememberFilters] = useState(localStorage.getItem('remember_search_filters') === 'true');
    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem('saved_search_filters');
        const shouldRemember = localStorage.getItem('remember_search_filters') === 'true';
        if (shouldRemember && saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved filters:", e);
            }
        }
        return {
            keyword: '',
            teacher: '',
            year: '',
            category: '',
            subcategory: ''
        };
    });
    const [results, setResults] = useState(() => {
        const saved = localStorage.getItem('saved_search_results');
        const shouldRemember = localStorage.getItem('remember_search_filters') === 'true';
        return (shouldRemember && saved) ? JSON.parse(saved) : [];
    });
    const [searched, setSearched] = useState(() => {
        const shouldRemember = localStorage.getItem('remember_search_filters') === 'true';
        return shouldRemember && localStorage.getItem('saved_search_status') === 'true';
    });
    const [hotCourses, setHotCourses] = useState([]);
    const [hotLoading, setHotLoading] = useState(false);
    const [courseMapping, setCourseMapping] = useState({});
    const [loading, setLoading] = useState(false);
    const [isRandomLoading, setIsRandomLoading] = useState(false);
    const [useDropdown, setUseDropdown] = useState(true);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [showLegendary, setShowLegendary] = useState(null); // 存儲目前觸發的醫師資料
    const [activeEasterEggTheme, setActiveEasterEggTheme] = useState(null);
    const [msgBox, setMsgBox] = useState({ isOpen: false, type: 'info', message: '' });
    const [showSettings, setShowSettings] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 檢查登入狀態 (改用 sessionStorage)
        const userData = sessionStorage.getItem(config.STORAGE_KEYS.USER);
        if (!userData) {
            console.warn("No user data found in sessionStorage, redirecting to login.");
            navigate('/');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            if (!parsedUser) throw new Error("Parsed user is null");
            setUser(parsedUser);
            console.log("Logged in user:", parsedUser);
        } catch (err) {
            console.error("Auth state corruption:", err, "Data:", userData);
            sessionStorage.removeItem(config.STORAGE_KEYS.USER);
            navigate('/');
            return;
        }

        // 檢查是否已確認過保密聲明
        const hasConfirmed = sessionStorage.getItem('hasConfirmedDisclaimer');
        if (!hasConfirmed) {
            setShowDisclaimer(true);
        }

        // 載入熱門課程與課程選單
        loadHotCourses();
        loadCourseMapping();
    }, [navigate]);

    // 儲存偏好設定
    useEffect(() => {
        localStorage.setItem('remember_search_filters', rememberFilters);
        if (rememberFilters) {
            localStorage.setItem('saved_search_filters', JSON.stringify(filters));
            localStorage.setItem('saved_search_results', JSON.stringify(results));
            localStorage.setItem('saved_search_status', searched);
        } else {
            localStorage.removeItem('saved_search_filters');
            localStorage.removeItem('saved_search_results');
            localStorage.removeItem('saved_search_status');
        }
    }, [filters, rememberFilters, results, searched]);

    const handleDisclaimerConfirm = () => {
        sessionStorage.setItem('hasConfirmedDisclaimer', 'true');
        setShowDisclaimer(false);
    };


    const loadHotCourses = async () => {
        setHotLoading(true);
        const result = await api.getHotCourses();
        if (result.success) {
            setHotCourses(result.data || []);
        }
        setHotLoading(false);
    };


    const loadCourseMapping = async () => {
        const result = await api.getCourseMapping();
        if (result.success) {
            setCourseMapping(result.data || {});
        }
    };

    // 將巢狀的課程映射展平，方便搜尋建議使用
    const flattenedCourses = useMemo(() => {
        const flat = [];
        Object.entries(courseMapping).forEach(([catName, catData]) => {
            // 處理直接隸屬於母分類的課程
            if (catData.direct) {
                catData.direct.forEach(course => {
                    flat.push({ name: course.name, category: catName, subcategory: '' });
                });
            }
            // 處理子分類下的課程
            if (catData.sub) {
                Object.entries(catData.sub).forEach(([subName, subCourses]) => {
                    subCourses.forEach(course => {
                        flat.push({ name: course.name, category: catName, subcategory: subName });
                    });
                });
            }
        });
        return flat;
    }, [courseMapping]);

    // 處理點擊外部關閉建議清單
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeywordChange = (value) => {
        setFilters({ ...filters, keyword: value });

        if (value.trim().length >= 1) {
            const filtered = flattenedCourses.filter(c =>
                c.name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 8); // 最多顯示 8 個建議
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (course) => {
        setFilters({
            ...filters,
            keyword: course.name,
            category: course.category,
            subcategory: course.subcategory
        });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        // 彩蛋 3：傳奇人物搜尋
        const doctors = {
            '華佗': { title: '神醫', dialog: '診脈看你有醫緣，是在找我嗎？記得要把這張符收好。', seal: 'PASS' },
            '李時珍': { title: '醫聖', dialog: '《本草綱目》記載：好學之人必有善報。你是在找尋智慧嗎？', seal: 'PASS' },
            '扁鵲': { title: '醫祖', dialog: '良藥苦口利於病，忠言逆耳利於行。我在這裡守護你的學業。', seal: 'PASS' },
            '張仲景': { title: '醫聖', dialog: '固護元氣，本學期必當心想事成！', seal: 'PASS' },
            '孫思邈': { title: '藥王', dialog: '大醫精誠，看你求學心切，且受我一帖必過方！', seal: 'PASS' }
        };

        const keyword = filters.keyword + filters.teacher;
        const matched = Object.keys(doctors).find(name => keyword.includes(name));

        if (matched) {
            setActiveEasterEggTheme('traditional');
            setShowLegendary({ ...doctors[matched], name: matched });
        } else if (filters.keyword === '算命') {
            window.dispatchEvent(new CustomEvent('trigger-easter-egg', { detail: { type: 'fortune' } }));
            setActiveEasterEggTheme(null);
            setShowLegendary(null);
        } else if (filters.keyword === '魔法') {
            window.dispatchEvent(new CustomEvent('trigger-easter-egg', { detail: { type: 'magic' } }));
            setActiveEasterEggTheme(null);
            setShowLegendary(null);
        } else {
            setActiveEasterEggTheme(null);
            setShowLegendary(null);
        }

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
            setMsgBox({ isOpen: true, type: 'error', message: result.message || '搜尋失敗' });
        }

        setLoading(false);
    };

    const handleRandomRecommend = async () => {
        setLoading(true);
        setIsRandomLoading(true);
        setSearched(true); // 立即設為 true，以便顯示載入動畫

        // 依照目前選擇的分類進行隨機推薦
        const randomParams = {
            category: filters.category,
            subcategory: filters.subcategory
        };
        const result = await api.getRandomCourses(randomParams);

        if (result.success) {
            setResults(result.data || []);
        } else {
            setMsgBox({ isOpen: true, type: 'error', message: result.message || '取得隨機推薦失敗' });
        }

        setLoading(false);
        setIsRandomLoading(false);
    };



    const handleLogout = () => {
        sessionStorage.removeItem(config.STORAGE_KEYS.USER);
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
        <div className={`search-page ${activeEasterEggTheme ? `theme-${activeEasterEggTheme}` : ''}`}>
            <header className="search-header">
                <div className="container">
                    <div className="header-top">
                        <h1 className="header-title">修課指引與評鑑查詢系統</h1>
                        <button className="mobile-menu-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                            {showMobileMenu ? '✕ 關閉選單' : '☰ 展開更多功能'}
                        </button>
                        <div className={`user-controls ${showMobileMenu ? 'mobile-show' : ''}`}>
                            <span className="user-name"><span className="welcome-text">歡迎，</span>{user?.name}</span>
                            <button onClick={() => { navigate('/submit', { state: { from: location.pathname } }); setShowMobileMenu(false); }} className="btn btn-ghost">填寫評鑑</button>
                            <button onClick={() => { navigate('/resources'); setShowMobileMenu(false); }} className="btn btn-ghost">相關連結與下載</button>
                            <button onClick={() => { setShowSettings(true); setShowMobileMenu(false); }} className="btn btn-ghost">帳戶設定</button>
                            <button onClick={handleLogout} className="btn btn-ghost logout-btn">登出</button>
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
                                        {filters.category && (
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
                                    {(!useDropdown || !filters.category) ? (
                                        <div className="keyword-input-wrapper" ref={suggestionRef}>
                                            <input
                                                type="text"
                                                className="input"
                                                value={filters.keyword}
                                                onChange={(e) => handleKeywordChange(e.target.value)}
                                                onFocus={() => filters.keyword.trim().length >= 1 && setShowSuggestions(true)}
                                                placeholder="請輸入課程名稱"
                                            />
                                            {showSuggestions && suggestions.length > 0 && (
                                                <ul className="search-suggestions">
                                                    {suggestions.map((course, idx) => (
                                                        <li
                                                            key={idx}
                                                            onClick={() => handleSuggestionClick(course)}
                                                            className="suggestion-item"
                                                        >
                                                            <span className="suggestion-name">{course.name}</span>
                                                            <span className="suggestion-path">
                                                                {course.category} {course.subcategory && `> ${course.subcategory}`}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
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

                            <div className="form-options">
                                <label className="remember-filters-label">
                                    <input
                                        type="checkbox"
                                        className="remember-checkbox"
                                        checked={rememberFilters}
                                        onChange={(e) => setRememberFilters(e.target.checked)}
                                    />
                                    <span>記住搜尋分類</span>
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading && !isRandomLoading ? '搜尋中...' : '搜尋課程'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRandomRecommend}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    {isRandomLoading ? '推薦中...' : '隨機推薦'}
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
                    {!searched && (
                        <div className="hot-section fade-in">
                            <h2 className="section-title">🔥 熱門課程</h2>
                            {hotLoading ? (
                                <div className="loading-state">
                                    <div className="loader"></div>
                                    <p>🔍 正在載入熱門課程...</p>
                                </div>
                            ) : hotCourses.length > 0 ? (
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
                            ) : (
                                <div className="empty-state">
                                    <p>目前暫無熱門課程資料</p>
                                </div>
                            )}
                        </div>
                    )}


                    {/* 搜尋結果 */}
                    {searched && (
                        <div className="results-section fade-in">
                            <h2 className="section-title">
                                搜尋結果 <span className="result-count">({loading ? '...' : results.length} 筆)</span>
                            </h2>
                            {loading ? (
                                <div className="loading-state">
                                    <div className="loader"></div>
                                    <p>{isRandomLoading ? '🎲 正在隨機推薦課程，請稍候...' : '🔍 資料查詢中，請稍候...'}</p>
                                </div>
                            ) : results.length > 0 ? (
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

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                username={user?.username}
            />

            <MessageBox
                isOpen={msgBox.isOpen}
                type={msgBox.type}
                message={msgBox.message}
                onClose={() => setMsgBox({ ...msgBox, isOpen: false })}
            />

            <LegendaryEffect
                doctor={showLegendary}
                onClose={() => setShowLegendary(null)}
            />

            <Footer />
        </div>
    );
}

export default SearchPage;
