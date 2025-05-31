import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage';
import JournalPage from './pages/JournalPage/JournalPage';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Footer from './components/Footer/Footer';
import { getData, setData } from './utils/localUtils';
import { User } from './types';
import { mockSchedule } from './mockData';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
    const user = getData<User | null>('currentUser', null);
    return user ? children : <Navigate to="/login" />;
};

const App = () => {
    useEffect(() => {
        // Инициализируем расписание, если его еще нет
        if (!getData('schedule', null)) {
            setData('schedule', mockSchedule);
        }
    }, []);

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="app">
                <div className="app-content">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/journal" element={<RequireAuth><JournalPage /></RequireAuth>} />
                        <Route path="/schedule" element={<RequireAuth><SchedulePage /></RequireAuth>} />
                        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
