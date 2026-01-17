import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import CourseDetailPage from './pages/CourseDetailPage';

function App() {
    return (
        <BrowserRouter basename="/Course_Evaluation">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/course/:courseName/:teacher" element={<CourseDetailPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
