import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import config from '../config';
import { useAppConfig } from '../ConfigContext';
import ReportModal from './ReportModal';
import './Footer.css';

function Footer() {
    const location = useLocation();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const { appConfig } = useAppConfig();

    // 如果在提交頁面，不顯示「填寫評鑑」連結
    const isSubmitPage = location.pathname.includes('/submit');

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-center">
                    <a href={appConfig.USER_MANUAL_URL} target="_blank" rel="noopener noreferrer" className="footer-action-btn secondary">
                        📖 下載操作手冊
                    </a>
                    {!isSubmitPage && (
                        <Link to="/submit" className="footer-action-btn primary">
                            ✍️ 填寫評鑑
                        </Link>
                    )}
                    <button
                        className="footer-action-btn secondary"
                        onClick={() => setIsReportModalOpen(true)}
                    >
                        🚩 問題回報
                    </button>
                </div>
                <div className="footer-right">
                    <span className="footer-contact">管理員聯繫方式：{appConfig.CONTACT_EMAIL}</span>
                    <p className="footer-copyright">© 長庚中醫系學會所有</p>
                </div>
            </div>




            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </footer>
    );
}

export default Footer;
