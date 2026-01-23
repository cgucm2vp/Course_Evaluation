import { useState } from 'react';
import ReportModal from './ReportModal';
import './Footer.css';

function Footer() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p className="copyright">© 長庚中醫系學會所有</p>
                <button
                    className="report-link-btn"
                    onClick={() => setIsReportModalOpen(true)}
                >
                    系統異常回報
                </button>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </footer>
    );
}

export default Footer;
