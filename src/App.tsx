import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import JournalPage from './pages/JournalPage/JournalPage';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { getData } from './utils/localUtils';
import { User } from './types';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
    const user = getData<User | null>('currentUser', null);
    return user ? children : <Navigate to="/" />;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/journal" element={<RequireAuth><JournalPage /></RequireAuth>} />
                <Route path="/schedule" element={<RequireAuth><SchedulePage /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            </Routes>
        </Router>
    );
};

export default App;
