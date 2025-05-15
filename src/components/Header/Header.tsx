import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('currentUser');
        setShowLogoutModal(false);
        navigate('/');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleOutsideClick = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [menuOpen]);

    return (
        <>
            <header className="header">
                <div className="header__title">Attendance</div>
                <div className="header__menu-desktop">
                    <button
                        className={`header__button ${isActive('/journal') ? 'active' : ''}`}
                        onClick={() => navigate('/journal')}
                    >
                        Журнал
                    </button>
                    <button
                        className={`header__button ${isActive('/schedule') ? 'active' : ''}`}
                        onClick={() => navigate('/schedule')}
                    >
                        Расписание
                    </button>
                    <button
                        className={`header__button ${isActive('/profile') ? 'active' : ''}`}
                        onClick={() => navigate('/profile')}
                    >
                        Профиль
                    </button>
                    <button className="header__button logout" onClick={handleLogout}>
                        Выход
                    </button>
                </div>

                {!menuOpen && <button className="header__burger" onClick={() => setMenuOpen(true)}>
                    ☰
                </button>}
            </header>

            {menuOpen && <div className="header__overlay"></div>}

            <div className={`header__mobile-menu ${menuOpen ? 'open' : ''}`} ref={menuRef}>
                <button onClick={() => { navigate('/journal'); setMenuOpen(false); }} className={isActive('/journal') ? 'active' : ''}>
                    Журнал
                </button>
                <button onClick={() => { navigate('/schedule'); setMenuOpen(false); }} className={isActive('/schedule') ? 'active' : ''}>
                    Расписание
                </button>
                <button onClick={() => { navigate('/profile'); setMenuOpen(false); }} className={isActive('/profile') ? 'active' : ''}>
                    Профиль
                </button>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="logout">
                    Выход
                </button>
            </div>

            {showLogoutModal && (
                <div className="modal">
                    <div className="modal__content">
                        <p>Вы действительно хотите выйти?</p>
                        <div className="modal__actions">
                            <button className={"header__button"} onClick={confirmLogout}>Да</button>
                            <button className={"header__button"} onClick={cancelLogout}>Нет</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
