import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Footer from '../components/Footer';
import SettingsModal from '../components/SettingsModal';
import MessageBox from '../components/MessageBox';
import ReportModal from '../components/ReportModal';
import './ResourcesPage.css';

function ResourcesPage() {
    const [user, setUser] = useState(null);
    const [msgBox, setMsgBox] = useState({ isOpen: false, type: 'info', message: '', actionLabel: '', onAction: null, hideConfirm: false });
    const [reportModal, setReportModal] = useState({ isOpen: false, initialContent: '' });
    const [showSettings, setShowSettings] = useState(false);

    // 懸浮報修助理狀態
    const [activeAssistant, setActiveAssistant] = useState(null);
    const [assistantTimer, setAssistantTimer] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = sessionStorage.getItem(config.STORAGE_KEYS.USER);
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(userData));
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    // 處理失效連結的共用邏輯 (針對明確為 # 或預留的連結)
    const handleInvalidLink = (title, url) => {
        const prefill = `【連結失效回報】\n資源名稱：${title}\n原始網址：${url || '無'}\n問題描述：點擊後找不到內容或連結已失效。`;

        setMsgBox({
            isOpen: true,
            type: 'warning',
            message: `資源「${title}」目前無效或連結已失效，請點選下方按鈕進行異常回報。`,
            actionLabel: '🚨 系統異常回報',
            hideConfirm: true,
            onAction: () => {
                setMsgBox(prev => ({ ...prev, isOpen: false }));
                setReportModal({ isOpen: true, initialContent: prefill });
            },
            onClose: () => setMsgBox(prev => ({ ...prev, isOpen: false })),
            onCancel: () => setMsgBox(prev => ({ ...prev, isOpen: false }))
        });
    };

    // 前往資源的統一入口 (跳轉後輔助偵測助理)
    const handleAccessResource = (title, url, isDownload = false) => {
        // 如果網址明顯無效，直接攔截報修
        if (!url || url === '#' || url === '' || url.includes('placeholder')) {
            handleInvalidLink(title, url);
            return;
        }

        // 1. 立即跳轉，不耽誤使用者
        window.open(url, '_blank');

        // 2. 顯示懸浮報修助理 (因為瀏覽器安全政策 CORS 限制，前端無法偵測外部網站是否為 404 或死連結)
        // 故改用「追蹤提醒」模式，確保使用者如果看到 404 後切換回來，報修按鈕就在手邊。
        setActiveAssistant({ title, url });

        // 3. 設定自動消失 (20秒後)
        if (assistantTimer) clearTimeout(assistantTimer);
        const timer = setTimeout(() => {
            setActiveAssistant(null);
        }, 20000);
        setAssistantTimer(timer);
    };

    const handleAssistantReport = () => {
        if (!activeAssistant) return;
        const prefill = `【疑似失效連結回報】\n資源名稱：${activeAssistant.title}\n目標網址：${activeAssistant.url}\n問題描述：點擊後顯示 404 或連線失敗。`;
        setReportModal({ isOpen: true, initialContent: prefill });
        setActiveAssistant(null);
    };

    // 1. 相關連結區塊
    const leftGroups = config.QUICK_LINKS.GROUPS.filter(g => g.side === 'left');
    const rightGroups = config.QUICK_LINKS.GROUPS.filter(g => g.side === 'right');

    const [expandedGroups, setExpandedGroups] = useState({});
    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const renderLinkGroup = (group) => {
        const isExpanded = expandedGroups[group.id] || false;
        return (
            <div key={group.id} className={`link-group ${isExpanded ? 'is-expanded' : ''}`}>
                <div className="group-header" onClick={() => toggleGroup(group.id)} style={{ cursor: 'pointer' }}>
                    <div className="group-header-left">
                        <span className="group-dot"></span>
                        <h4 className="group-label">
                            {group.text} <span className="item-count">({group.links.length})</span>
                        </h4>
                    </div>
                    <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
                </div>
                <div className="links-items">
                    {group.links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="quick-link"
                            onClick={(e) => {
                                e.preventDefault(); // 攔截跳轉，改由 handleAccessResource 處理
                                handleAccessResource(link.name, link.url);
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        );
    };

    // 2. 檔案櫃區塊
    const FILES_PER_PAGE = 5;
    const [cabinetPages, setCabinetPages] = useState(
        config.FILE_CABINET.reduce((acc, _, idx) => ({ ...acc, [idx]: 1 }), {})
    );

    const handlePageChange = (cabinetIdx, direction) => {
        setCabinetPages(prev => ({ ...prev, [cabinetIdx]: prev[cabinetIdx] + direction }));
    };

    const [expandedCabinets, setExpandedCabinets] = useState({});
    const toggleCabinet = (idx) => {
        setExpandedCabinets(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div className="resources-page">
            <header className="resources-header">
                <div className="container">
                    <button onClick={() => navigate('/search')} className="back-btn-pill">返回</button>
                    <div className="header-content">
                        <h1 className="header-title">相關連結與檔案下載</h1>
                    </div>
                </div>
            </header>

            <main className="resources-main container">
                {/* 1. 常用相關連結 */}
                <section className="section fade-in">
                    <div className="section-header-vertical">
                        <h2 className="section-title">🔗 常用相關連結</h2>
                    </div>
                    <div className="links-vertical-list">
                        <div className="links-vertical-group">
                            <div className="links-group-container">
                                <div className="banner banner-left" style={{ backgroundColor: config.QUICK_LINKS.BANNER_LEFT.color }}>
                                    <h3>{config.QUICK_LINKS.BANNER_LEFT.title}</h3>
                                </div>
                                <div className="links-group-content">
                                    {leftGroups.map(group => renderLinkGroup(group))}
                                </div>
                            </div>
                        </div>
                        <div className="links-vertical-group">
                            <div className="links-group-container">
                                <div className="banner banner-right" style={{ backgroundColor: config.QUICK_LINKS.BANNER_RIGHT.color }}>
                                    <h3>{config.QUICK_LINKS.BANNER_RIGHT.title}</h3>
                                </div>
                                <div className="links-group-content">
                                    {rightGroups.map(group => renderLinkGroup(group))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 文件下載檔案櫃 */}
                <section className="section fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="section-header-vertical">
                        <h2 className="section-title">📂 文件下載檔案櫃</h2>
                        <p className="section-subtitle">（僅供參考，實際請依官網公告為主）</p>
                    </div>
                    <div className="cabinet-vertical-list">
                        {config.FILE_CABINET.map((cabinet, idx) => {
                            const currentPage = cabinetPages[idx] || 1;
                            const totalPages = Math.ceil(cabinet.files.length / FILES_PER_PAGE);
                            const startIndex = (currentPage - 1) * FILES_PER_PAGE;
                            const currentFiles = cabinet.files.slice(startIndex, startIndex + FILES_PER_PAGE);
                            const isExpanded = expandedCabinets[idx] || false;

                            return (
                                <div key={idx} className={`cabinet-card ${isExpanded ? 'is-expanded' : ''}`}>
                                    <div className="cabinet-category" onClick={() => toggleCabinet(idx)}>
                                        <span>{cabinet.category} <span className="item-count">({cabinet.files.length})</span></span>
                                        <span className="cabinet-expand-icon">{isExpanded ? '−' : '+'}</span>
                                    </div>
                                    <div className="cabinet-content">
                                        <div className="file-list">
                                            {currentFiles.map(file => (
                                                <div key={file.id} className="file-item">
                                                    <div className="file-info">
                                                        <span className="file-icon">
                                                            {file.type === 'PDF' ? '📕' :
                                                                file.type === 'DOCX' ? '📘' :
                                                                    file.type === 'FILE' ? '📂' :
                                                                        file.type === 'VIDEO' ? '🎬' :
                                                                            file.type === 'LINK' ? '🌐' :
                                                                                file.type === 'EGG' ? '🥚' : '📗'}
                                                        </span>
                                                        <div className="file-meta">
                                                            <span className="file-name">{file.name}</span>
                                                            <span className="file-size">{file.size}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleAccessResource(file.name, file.url, true)} className="download-btn" title="下載檔案">
                                                        📥
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="cabinet-pagination">
                                                <div className="pagination-controls">
                                                    <button className="page-btn" onClick={() => handlePageChange(idx, -1)} disabled={currentPage === 1}>← 上一頁</button>
                                                    <span className="page-info">{currentPage} / {totalPages}</span>
                                                    <button className="page-btn" onClick={() => handlePageChange(idx, 1)} disabled={currentPage === totalPages}>下一頁 →</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            <MessageBox
                isOpen={msgBox.isOpen}
                type={msgBox.type}
                message={msgBox.message}
                actionLabel={msgBox.actionLabel}
                hideConfirm={msgBox.hideConfirm}
                onAction={msgBox.onAction}
                onClose={msgBox.onClose}
                onCancel={msgBox.onCancel || (() => setMsgBox(prev => ({ ...prev, isOpen: false })))}
            />

            <ReportModal
                isOpen={reportModal.isOpen}
                initialContent={reportModal.initialContent}
                onClose={() => setReportModal({ isOpen: false, initialContent: '' })}
            />

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                username={user?.username}
            />

            {/* 懸浮報修小幫手 (助理模式) */}
            {activeAssistant && (
                <div className="link-assistant-toast fade-in">
                    <div className="assistant-content">
                        <span className="assistant-icon">🚀</span>
                        <div className="assistant-text">
                            <p>剛開的資源正常嗎？</p>
                            <span>「{activeAssistant.title}」</span>
                        </div>
                    </div>
                    <div className="assistant-actions">
                        <button className="assistant-btn report" onClick={handleAssistantReport}>
                            連結失效報修
                        </button>
                        <button className="assistant-btn close" onClick={() => setActiveAssistant(null)}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default ResourcesPage;
