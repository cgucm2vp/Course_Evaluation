import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SubmitPage from './pages/SubmitPage';
import ResourcesPage from './pages/ResourcesPage';
import MidnightAssistant from './components/MidnightAssistant';
import SpecialEasterEggs from './components/SpecialEasterEggs';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/course/:courseName/:teacher" element={<CourseDetailPage />} />
                <Route path="/submit" element={<SubmitPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <MidnightAssistant />
            <SpecialEasterEggs />
        </HashRouter>
    );
}

export default App;
