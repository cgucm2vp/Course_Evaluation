import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import config from '../config';
import MetricsGuideModal from '../components/MetricsGuideModal';
import ReviewGuideModal from '../components/ReviewGuideModal';
import SuccessModal from '../components/SuccessModal';
import Footer from '../components/Footer';
import './SubmitPage.css';

function SubmitPage() {
    console.log("SubmitPage attempts to render");
    const navigate = useNavigate();
    const location = useLocation();
    const [mapping, setMapping] = useState({});



    const DEFAULT_YEAR = "114";
    const DEFAULT_TERM = "2";

    const initialFormData = {
        year: `${DEFAULT_YEAR}-${DEFAULT_TERM}`,
        category: '',
        subcategory: '',
        courseName: '',
        teacher: '',
        sweetness: null,
        coolness: null,
        richness: null,
        review: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', content: '' });
    const [teacherSuggestions, setTeacherSuggestions] = useState([]);
    const [lookupStatus, setLookupStatus] = useState(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isReviewGuideOpen, setIsReviewGuideOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [conflict, setConflict] = useState(null);
    const [isManualTeacher, setIsManualTeacher] = useState(false);
    const [errors, setErrors] = useState({});

    // 處理傳入的自動填充狀態
    useEffect(() => {
        if (location.state) {
            const { category, subcategory, courseName } = location.state;
            setFormData(prev => ({
                ...prev,
                category: category || prev.category,
                subcategory: subcategory || prev.subcategory,
                courseName: courseName || prev.courseName,
                teacher: '' // 故意不填，引導使用者查詢
            }));

            // 跳轉後自動捲動至課程名稱區塊
            setTimeout(() => {
                courseNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [location.state]);

    const [agree1, setAgree1] = useState(false);
    const [agree2, setAgree2] = useState(false);

    // 將自定義填寫狀態移到狀態宣告之後
    // (已在上方宣告，此處只需確認順序)

    // 安全分割邏輯：確保 parts 存在
    const semArray = useMemo(() => {
        const y = (formData.year || `${DEFAULT_YEAR}-${DEFAULT_TERM}`).toString();
        const parts = y.split('-');
        return [parts[0] || DEFAULT_YEAR, parts[1] || DEFAULT_TERM];
    }, [formData.year]);

    const courseNameRef = useRef(null);
    const teacherRef = useRef(null);
    const metricsRef = useRef(null);

    useEffect(() => {
        const fetchMapping = async () => {
            try {
                const result = await api.getCourseMapping();
                if (result && result.success) setMapping(result.data || {});
            } catch (err) {
                console.error("Fetch mapping crash:", err);
            }
        };
        fetchMapping();
    }, []);

    const allCourses = useMemo(() => {
        const list = [];
        if (!mapping || typeof mapping !== 'object') return list;
        try {
            Object.entries(mapping).forEach(([parent, data]) => {
                if (data && Array.isArray(data.direct)) {
                    data.direct.forEach(c => { if (c && c.name) list.push({ name: c.name, parent, sub: '' }); });
                }
                if (data && data.sub && typeof data.sub === 'object') {
                    Object.entries(data.sub).forEach(([sub, courses]) => {
                        if (Array.isArray(courses)) {
                            courses.forEach(c => { if (c && c.name) list.push({ name: c.name, parent, sub }); });
                        }
                    });
                }
            });
        } catch (e) { console.error("allCourses compute error", e); }
        return list;
    }, [mapping]);

    const handleTeacherLookup = async () => {
        const { year, courseName } = formData;
        if (!year || !courseName) {
            setErrors(prev => ({ ...prev, courseName: true }));
            courseNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setLookupLoading(true);
        setMsg({ type: '', content: '' });
        setIsManualTeacher(false);
        setErrors(prev => ({ ...prev, teacher: false }));

        try {
            const result = await api.lookupTeachers(year, courseName);
            setLookupLoading(false);
            if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
                setTeacherSuggestions(result.data);
                if (result.data.length === 1) {
                    setFormData(prev => ({ ...prev, teacher: result.data[0] }));
                    setLookupStatus('single');
                } else {
                    setFormData(prev => ({ ...prev, teacher: '' }));
                    setLookupStatus('multiple');
                }
            } else {
                setLookupStatus('none');
                setIsManualTeacher(true);
            }
        } catch (err) {
            setLookupLoading(false);
            setLookupStatus('none');
            setIsManualTeacher(true);
        }
    };

    const handleCourseNameChange = (val) => {
        setFormData(prev => ({ ...prev, courseName: val }));
        setErrors(prev => ({ ...prev, courseName: false }));

        if (allCourses && (val || '').trim().length > 1) {
            const match = allCourses.find(c => c.name === (val || '').trim());
            if (match) {
                setFormData(prev => ({
                    ...prev,
                    category: match.parent || '',
                    subcategory: match.sub || ''
                }));
            }
        }
        setTeacherSuggestions([]);
        setLookupStatus(null);
        setIsManualTeacher(false);
    };

    const handleTeacherSelectChange = (val) => {
        if (val === "__MANUAL__") {
            setIsManualTeacher(true);
            setFormData(prev => ({ ...prev, teacher: '' }));
        } else {
            setIsManualTeacher(false);
            setFormData(prev => ({ ...prev, teacher: val }));
            if (val) setLookupStatus('confirmed');
        }
        setErrors(prev => ({ ...prev, teacher: false }));
    };

    const updateSemester = (y, t) => {
        setFormData(prev => ({ ...prev, year: `${y}-${t}` }));
        setTeacherSuggestions([]);
        setLookupStatus(null);
        setIsManualTeacher(false);
    };

    const checkCourseConflict = () => {
        const val = (formData.courseName || '').trim();
        if (!val || !allCourses) return;

        const matches = allCourses.filter(c => c.name === val);
        const currentCat = formData.category;

        if (matches.length === 0) {
            if (currentCat && currentCat !== '其他') {
                setConflict({
                    type: 'NOT_FOUND',
                    message: `系統在「${currentCat}」中找不到此課程。若確認名稱與分類正確請按確認，或將其歸為「其他」。`
                });
            }
            return;
        }

        const isMatchCurrent = matches.some(m => m.parent === currentCat);
        if (!isMatchCurrent && currentCat && currentCat !== '其他') {
            setConflict({
                type: 'MISMATCH',
                matches: matches,
                message: `系統發現「${val}」屬於「${matches[0].parent}」分類，與您目前選擇的「${currentCat}」不符。請問要執行哪項操作？`
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.courseName || !formData.courseName.trim()) newErrors.courseName = true;
        if (!formData.teacher || !formData.teacher.trim()) newErrors.teacher = true;
        if (formData.sweetness === null || formData.coolness === null || formData.richness === null) {
            newErrors.metrics = true;
        }
        if (!agree1 || !agree2) newErrors.agree = true;

        setErrors(newErrors);
        if (newErrors.courseName) courseNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (newErrors.teacher) teacherRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (newErrors.metrics) metricsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const result = await api.submitEvaluation(formData);
            if (result && result.success) setIsSuccessOpen(true);
            else setMsg({ type: 'error', content: result?.message || '提交失敗' });
        } catch (err) {
            setMsg({ type: 'error', content: '服務暫時異常' });
        }
        setLoading(false);
    };

    const handleAddNext = () => {
        setFormData(initialFormData);
        setLookupStatus(null);
        setIsManualTeacher(false);
        setIsSuccessOpen(false);
        setErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReturn = () => {
        const userData = localStorage.getItem(config.STORAGE_KEYS.USER);
        if (userData) navigate('/search');
        else navigate('/');
    };

    const handleReturnToCourse = () => {
        if (location.state?.courseName && location.state?.teacher) {
            const encodedName = encodeURIComponent(location.state.courseName);
            const encodedTeacher = encodeURIComponent(location.state.teacher);
            navigate(`/course/${encodedName}/${encodedTeacher}`);
        } else {
            handleReturn();
        }
    };

    const filteredCourses = useMemo(() => {
        if (!formData.category || formData.category === '其他' || !mapping) return allCourses;
        const catData = mapping[formData.category];
        if (!catData) return [];
        if (formData.subcategory && catData.sub) return catData.sub[formData.subcategory] || [];

        let all = [];
        if (catData.direct && Array.isArray(catData.direct)) all = [...all, ...catData.direct];
        if (catData.sub && typeof catData.sub === 'object') {
            Object.values(catData.sub).forEach(subList => {
                if (Array.isArray(subList)) all = [...all, ...subList];
            });
        }
        return all;
    }, [mapping, formData.category, formData.subcategory, allCourses]);

    // 防止渲染崩潰的映射遍歷預檢
    const categoryOptions = useMemo(() => {
        if (!mapping || typeof mapping !== 'object') return [];
        return Object.keys(mapping);
    }, [mapping]);

    const subCategoryOptions = useMemo(() => {
        const cat = formData.category;
        if (!cat || cat === '其他' || !mapping || !mapping[cat] || !mapping[cat].sub) return [];
        return Object.keys(mapping[cat].sub);
    }, [mapping, formData.category]);

    return (
        <div className="submit-page">
            <header className="submit-header">
                <button className="submit-back-btn" onClick={() => navigate(-1)}>← 返回上一頁</button>
                <h1>課程評鑑撰寫</h1>
                <p className="subtitle">傳承修課經驗，成為彼此學習路上的引導者</p>
            </header>

            <main className="submit-container">
                {msg.content && <div className={`alert alert-${msg.type}`}>{msg.content}</div>}

                <form className="submit-form" onSubmit={handleSubmit}>
                    <section className="form-section">
                        <h3>1. 課程分類</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>母分類</label>
                                <select
                                    value={formData.category || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '', courseName: '' }))}
                                >
                                    <option value="">請選擇課程分類</option>
                                    {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="其他">其他</option>
                                </select>
                            </div>
                            {subCategoryOptions.length > 0 && (
                                <div className="form-group">
                                    <label>子分類</label>
                                    <select
                                        value={formData.subcategory || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value, courseName: '' }))}
                                    >
                                        <option value="">所有子分類</option>
                                        {subCategoryOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="form-section" ref={courseNameRef}>
                        <h3>2. 課程名稱 <span className="required">*</span></h3>
                        <div className={`form-group ${errors.courseName ? 'has-error' : ''}`}>
                            <input
                                type="text"
                                list="courses-data-list"
                                value={formData.courseName || ''}
                                onChange={(e) => handleCourseNameChange(e.target.value)}
                                onBlur={checkCourseConflict}
                                placeholder={formData.category && formData.category !== '其他' ? `在此分類下輸入課程名稱...` : "輸入名稱 (選取現有課程將自動帶入分類)"}
                                className={errors.courseName ? 'error-ring' : ''}
                            />
                            {errors.courseName && <span className="error-text">⚠️ 此為必填項目，請輸入或選擇課程</span>}
                            <datalist id="courses-data-list">
                                {Array.isArray(filteredCourses) && filteredCourses.map((c, i) => <option key={i} value={c?.name || ''} />)}
                            </datalist>
                        </div>
                    </section>

                    {conflict && (
                        <div className="conflict-dialog slide-in border-accent">
                            <div className="conflict-header">
                                <span className="icon">🔍</span>
                                <h4>分類自動建議</h4>
                            </div>
                            <p>{conflict.message}</p>
                            <div className="dialog-btns">
                                {conflict.type === 'MISMATCH' ? (
                                    <>
                                        {Array.isArray(conflict.matches) && conflict.matches.map((m, i) => (
                                            <button key={i} type="button" onClick={() => {
                                                setFormData(prev => ({ ...prev, category: m.parent, subcategory: m.sub }));
                                                setConflict(null);
                                            }}>更正為「{m.parent}」</button>
                                        ))}
                                        <button type="button" className="btn-secondary" onClick={() => setConflict(null)}>保留原分類</button>
                                        <button type="button" className="btn-secondary" onClick={() => {
                                            setFormData(prev => ({ ...prev, category: '其他', subcategory: '' }));
                                            setConflict(null);
                                        }}>歸為「其他」</button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => setConflict(null)}>確認正確</button>
                                        <button type="button" className="btn-secondary" onClick={() => {
                                            setFormData(prev => ({ ...prev, category: '其他', subcategory: '' }));
                                            setConflict(null);
                                        }}>歸為「其他」</button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <section className="form-section">
                        <h3>3. 修課資訊</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>修課學年 <span className="required">*</span></label>
                                <div className="semester-wheel-picker">
                                    <input
                                        type="number"
                                        value={semArray[0]}
                                        onChange={(e) => updateSemester(e.target.value, semArray[1])}
                                        className="year-input"
                                    />
                                    <span className="divider">-</span>
                                    <select
                                        value={semArray[1]}
                                        onChange={(e) => updateSemester(semArray[0], e.target.value)}
                                        className="term-select"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                    <button type="button" className="reset-sem-btn" onClick={() => updateSemester(DEFAULT_YEAR, DEFAULT_TERM)}>重設</button>
                                </div>
                            </div>

                            <div className="form-group" ref={teacherRef}>
                                <div className="label-with-hint compact">
                                    <label>授課教師 <span className="required">*</span></label>
                                    <div className="status-badges">
                                        {lookupStatus === 'single' && <span className="status-badge success">✅ 已尋獲</span>}
                                        {lookupStatus === 'confirmed' && <span className="status-badge success">✅ 已選取</span>}
                                        {lookupStatus === 'multiple' && <span className="status-badge info">💡 有多位</span>}
                                        {lookupStatus === 'none' && <span className="status-badge warning">⚠️ 無資料</span>}
                                    </div>
                                </div>
                                <div className={`teacher-lookup-row ${errors.teacher ? 'has-error' : ''}`}>
                                    {lookupStatus === 'multiple' && !isManualTeacher ? (
                                        <select
                                            className={`teacher-input select-mode ${errors.teacher ? 'error-ring' : ''}`}
                                            value={formData.teacher}
                                            onChange={(e) => handleTeacherSelectChange(e.target.value)}
                                        >
                                            <option value="">請選擇老師...</option>
                                            {Array.isArray(teacherSuggestions) && teacherSuggestions.map((t, i) => <option key={i} value={t}>{t}</option>)}
                                            <option value="__MANUAL__">以上皆非 (自行輸入)</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData.teacher || ''}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, teacher: e.target.value }));
                                                setErrors(prev => ({ ...prev, teacher: false }));
                                            }}
                                            placeholder={isManualTeacher ? "請自行輸入教師姓名" : "點擊右側查詢或自行輸入"}
                                            className={`teacher-input ${errors.teacher ? 'error-ring' : ''}`}
                                        />
                                    )}
                                    <button
                                        type="button"
                                        className={`lookup-btn ${lookupLoading ? 'loading' : ''}`}
                                        onClick={handleTeacherLookup}
                                        disabled={lookupLoading}
                                    >
                                        {lookupLoading ? '...' : '查詢教師'}
                                    </button>
                                </div>
                                {errors.teacher && <span className="error-text">⚠️ 請輸入、查詢或選擇授課教師</span>}
                            </div>
                        </div>
                    </section>

                    <section className="form-section" ref={metricsRef}>
                        <div className="section-title-standard">
                            <h3>4. 評量指標 <span className="required">*</span></h3>
                            <button type="button" className="help-link-block" onClick={() => setIsGuideOpen(true)}>ℹ️ 查看指標標準說明 (甜度/涼度維度對照)</button>
                        </div>
                        <div className={`metrics-grid ${errors.metrics ? 'metrics-error-border' : ''}`}>
                            {[
                                { key: 'sweetness', label: '🍭甜度', info: '僅考慮成績給分，分數對照表請點選上方按鈕查看。' },
                                { key: 'coolness', label: '❄️涼度', info: '考慮需要付出的時間、心力，付出越多涼度越低分。' },
                                { key: 'richness', label: '📚有料程度', info: '考慮上課內容是否有學到東西，高分代表課程紮實。' }
                            ].map(metric => (
                                <div className="metric-item highlightable" key={metric.key}>
                                    <div className="metric-label"><span>{metric.label}</span></div>
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <span
                                                key={v}
                                                className={`star-icon ${formData[metric.key] >= v ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, [metric.key]: v }));
                                                    setErrors(prev => ({ ...prev, metrics: false }));
                                                }}
                                            >★</span>
                                        ))}
                                    </div>
                                    <small className="metric-detail-hint">{metric.info}</small>
                                </div>
                            ))}
                        </div>
                        {errors.metrics && <div className="error-center"><span className="error-text">⚠️ 請完成所有指標評分</span></div>}
                    </section>

                    <section className="form-section">
                        <div className="section-title-with-guide">
                            <h3>5. 評鑑與修課指引</h3>
                            <button
                                type="button"
                                className="emoji-guide-btn"
                                onClick={() => setIsReviewGuideOpen(true)}
                            >
                                ⓘ
                            </button>
                        </div>
                        <div className="form-group">
                            <textarea
                                value={formData.review || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                                placeholder="請分享修課心得、考試方式、其他課程資訊或給學弟妹的建議... (選填)"
                                rows="8"
                            />
                        </div>
                    </section>

                    <div className="submit-footer-centered">
                        <div className="terms-container">
                            <label className="term-checkbox-label">
                                <input type="checkbox" checked={agree1} onChange={e => setAgree1(e.target.checked)} />
                                <span>我同意將匿名蒐集之修課心得無償授權予長庚中醫系學會用於促進會員福祉之任意用途 <span className="required">*</span></span>
                            </label>
                            <label className="term-checkbox-label">
                                <input type="checkbox" checked={agree2} onChange={e => setAgree2(e.target.checked)} />
                                <span>我願意將修課心得提供給長庚中醫系學會會員及未來入學之學弟妹作為修課參考 <span className="required">*</span></span>
                            </label>
                            {errors.agree && <p className="error-text centered">⚠️ 請勾選上述必填條款以繼續</p>}
                        </div>

                        <div className="submit-notice-centered">
                            <p className="notice">感謝您的寶貴回饋與傳承！送出後由管理員審核，確認內容符合規定後正式發佈。</p>
                        </div>
                        <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? '正在發送...' : '確認並送出評鑑'}
                        </button>
                    </div>
                </form>
            </main>

            {isGuideOpen && <MetricsGuideModal
                isOpen={true}
                onClose={() => setIsGuideOpen(false)}
            />}

            {isReviewGuideOpen && <ReviewGuideModal
                isOpen={true}
                onClose={() => setIsReviewGuideOpen(false)}
            />}

            {isSuccessOpen && <SuccessModal
                isOpen={true}
                onAddNext={handleAddNext}
                onReturn={handleReturn}
                targetCourse={location.state?.courseName}
                onReturnToCourse={handleReturnToCourse}
            />}
            <Footer />
        </div>
    );
}

export default SubmitPage;
