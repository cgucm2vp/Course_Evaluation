import React, { useState, useEffect } from 'react';
import './MidnightAssistant.css';

const DOCTORS = [
    { name: '華佗', msg: '別熬了，診脈看你氣血已嚴重不足，快躺下！', icon: '👨‍⚕️' },
    { name: '李時珍', msg: '肝為將軍之官，熬夜傷肝，《本草綱目》沒寫熬夜能養生。', icon: '📜' },
    { name: '扁鵲', msg: '疾在骨髓時，我也救不了你。快去睡覺！', icon: '🧪' },
    { name: '張仲景', msg: '傷寒雜病論教你固護元氣，元氣皆從睡眠中來。', icon: '📖' }
];

const MidnightAssistant = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [showBubble, setShowBubble] = useState(!localStorage.getItem('midnight_bubble_dismissed'));
    const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(!!localStorage.getItem('midnight_egg_viewed'));

    useEffect(() => {
        const checkTime = () => {
            if (isPermanentlyHidden) {
                setIsVisible(false);
                return;
            }
            const hour = new Date().getHours();
            // 深夜時間：凌晨 1 點到 5 點
            const isNight = hour >= 1 && hour < 5;
            setIsVisible(isNight);
            if (isNight && !currentDoctor) {
                setCurrentDoctor(DOCTORS[Math.floor(Math.random() * DOCTORS.length)]);
            }
        };
        checkTime();
        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, [currentDoctor, isPermanentlyHidden]);

    const handleToggle = () => {
        if (!isExpanded) {
            if (showBubble) {
                setShowBubble(false);
                localStorage.setItem('midnight_bubble_dismissed', 'true');
            }
            // 點擊展開後，標記為已看過，下次不再顯示
            localStorage.setItem('midnight_egg_viewed', 'true');
            // 我們不立即 setIsVisible(false)，而是讓這次展開流程跑完，
            // 但下次 checkTime 時就會生效，或者使用者關閉後生效。
        }
        setIsExpanded(!isExpanded);
    };

    if (!isVisible) return null;

    return (
        <div className={`midnight-assistant ${isExpanded ? 'expanded' : ''}`}>
            {showBubble && !isExpanded && (
                <div className="midnight-comic-bubble">
                    熬夜中？醫師有話說...
                    <div className="bubble-arrow"></div>
                </div>
            )}

            <div className={`assistant-circle ${isExpanded ? 'active' : ''}`} onClick={handleToggle}>
                <span className="assistant-pot-emoji">🍵</span>
            </div>

            {isExpanded && (
                <div className="assistant-overlay fade-in">
                    <div className="assistant-parchment slide-up">
                        <div className="parchment-close" onClick={() => setIsExpanded(false)}>✕</div>
                        <div className="dr-portrait-mini">
                            <span className="dr-emoji-large">{currentDoctor?.icon || '👨‍⚕️'}</span>
                        </div>
                        <h3 className="dr-name-title">【{currentDoctor?.name}】</h3>
                        <p className="dr-message-content">「{currentDoctor?.msg}」</p>
                        <button className="dr-stamp" onClick={() => setIsExpanded(false)}>謹遵醫囑</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MidnightAssistant;
