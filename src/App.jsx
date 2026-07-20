import React, { useState, useEffect } from 'react';
import './index.css';
import './MigrationNotice.css';

export default function App() {
  // 從 Vite 環境變數讀取 GitHub Repo Secret 傳入的新網址（完全不硬編碼在原始碼中）
  const newSiteUrl = import.meta.env.VITE_NEW_SITE_URL || import.meta.env.VITE_SITE_URL || '';

  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // 若有設定新網址且未暫停倒數，則進行倒數計時
    if (!newSiteUrl || isPaused) return;

    if (countdown <= 0) {
      window.location.replace(newSiteUrl);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, newSiteUrl]);

  const handleManualRedirect = () => {
    if (newSiteUrl) {
      window.location.href = newSiteUrl;
    }
  };

  return (
    <div className="migration-container">
      <div className="migration-card card fade-in">
        {/* 印章標籤 / 傳統硃砂風格 */}
        <div className="stamp-badge">
          <span className="stamp-text">網站搬遷公告</span>
        </div>

        <h1 className="migration-title">課程指引與評鑑查詢系統</h1>
        <p className="migration-subtitle">網址更新通知</p>

        <div className="divider-line"></div>

        <div className="migration-body">
          <p>
            本網址已停止更新，請前往新版網站，以取得最新資訊。
          </p>
          <p className="secondary-note">
            因應本會組織單位及權責調整，原隸屬於常務副會長之網頁程式碼，已委由網管部管理，故網址亦隨之變更。造成不便，敬請見諒。
          </p>
        </div>

        {newSiteUrl && (
          <div className="countdown-box">
            <div className="countdown-timer">
              <span className="timer-icon">⏳</span>
              <span>
                系統將於 <strong className="countdown-number">{countdown}</strong> 秒後自動跳轉
              </span>
            </div>
            <button
              className="pause-btn"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "恢復自動跳轉" : "暫停自動跳轉"}
            >
              {isPaused ? "▶ 恢復跳轉" : "⏸ 暫停倒數"}
            </button>
          </div>
        )}

        <div className="action-area">
          <button
            className="btn btn-primary btn-lg redirect-btn"
            onClick={handleManualRedirect}
            disabled={!newSiteUrl}
          >
            <span>前往新版網站</span>
            <svg
              className="arrow-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        <div className="migration-footer">
          <p>長庚大學中醫學會 © Course Evaluation System</p>
        </div>
      </div>
    </div>
  );
}
