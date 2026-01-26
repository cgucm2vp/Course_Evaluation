import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReportModal from './ReportModal';
import './Footer.css';

function Footer() {
    const location = useLocation();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // 如果在提交頁面，不顯示「填寫評鑑」連結
    const isSubmitPage = location.pathname.includes('/submit');

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p className="copyright">© 長庚中醫系學會所有</p>
                <div className="footer-links">
                    {!isSubmitPage && <Link to="/submit" className="footer-link-item">填寫評鑑</Link>}
                    <button
                        className="report-link-btn"
                        onClick={() => setIsReportModalOpen(true)}
                    >
                        系統異常回報
                    </button>
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
