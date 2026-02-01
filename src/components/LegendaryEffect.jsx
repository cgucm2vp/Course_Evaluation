import React, { useState, useEffect } from 'react';
import './LegendaryEffect.css';

const LegendaryEffect = ({ doctor, onClose }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (doctor) {
            setIsActive(true);
            const timer = setTimeout(() => {
                setIsActive(false);
                if (onClose) onClose();
            }, 5000); // 5秒後消失
            return () => clearTimeout(timer);
        }
    }, [doctor, onClose]);

    if (!doctor || !isActive) return null;

    // 根據醫師名稱對應圖片
    const getImagePath = (name) => {
        const mapping = {
            '華佗': 'huatuo.png',
            '李時珍': 'lishizhen.png',
            '扁鵲': 'bianque.png',
            '張仲景': 'zhangzhongjing.png',
            '孫思邈': 'sunsimiao.png'
        };
        const fileName = mapping[name] || 'huatuo.png';
        // 使用 Vite 推薦的動態資源引入方式
        return new URL(`../assets/legends/${fileName}`, import.meta.url).href;
    };

    return (
        <div className="legendary-fullscreen-overlay">
            <div className="legendary-light-rays"></div>
            <div className="legendary-particles"></div>

            <div className="legendary-content slide-up">
                <div className="legendary-portrait-frame">
                    <img
                        src={getImagePath(doctor.name)}
                        alt={doctor.name}
                        className="legendary-portrait-img"
                        onError={(e) => {
                            e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + doctor.name;
                            e.target.classList.add('fallback-avatar');
                        }}
                    />
                    <div className="legendary-name-tag">{doctor.title} · {doctor.name}</div>
                </div>

                <div className="legendary-dialog-box zoom-in">
                    <div className="legendary-dr-callout">你在找我嗎？</div>
                    <p className="legendary-dr-text">「{doctor.dialog}」</p>
                    <div className="legendary-seal">{doctor.seal}</div>
                </div>
            </div>

            <button className="legendary-skip-btn" onClick={() => setIsActive(false)}>✕ 跳過</button>
        </div>
    );
};

export default LegendaryEffect;
