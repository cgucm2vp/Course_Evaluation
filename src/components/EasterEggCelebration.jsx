import React, { useEffect, useState } from 'react';
import './EasterEggCelebration.css';

const EasterEggCelebration = ({ isOpen, onClose }) => {
    const [phase, setPhase] = useState('entering'); // entering, displaying, exiting

    useEffect(() => {
        if (isOpen) {
            setPhase('entering');
            const timer = setTimeout(() => setPhase('displaying'), 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`ee-overlay ${phase}`}>
            <div className="ee-confetti-container">
                {[...Array(50)].map((_, i) => (
                    <div key={i} className="ee-confetti-piece" style={{
                        '--i': i,
                        '--speed': `${2 + Math.random() * 2}s`,
                        '--delay': `${Math.random() * 2}s`,
                        '--left': `${Math.random() * 100}%`,
                        '--color': i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#800000' : '#228b22'
                    }} />
                ))}
            </div>

            <div className="ee-scroll-container">
                <div className="ee-scroll-scroll">
                    <div className="ee-scroll-content">
                        <div className="ee-title">📜 五連開泰</div>
                        <div className="ee-subtitle">恭喜達成連鎖評價！</div>
                        <div className="ee-achievement">
                            <span className="ee-badge">稱號解鎖</span>
                            <h2>神農傳人</h2>
                            <p>您已嘗試百草，醫術修為 +99！</p>
                        </div>
                        <button className="ee-close-btn" onClick={() => setPhase('exiting')}>
                            領取稱號並繼續
                        </button>
                    </div>
                </div>
            </div>

            {phase === 'exiting' && (
                <div className="ee-exit-guard" onAnimationEnd={onClose} />
            )}
        </div>
    );
};

export default EasterEggCelebration;
