import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { getData, setData } from '../../utils/localUtils';
import { User, Role } from '../../types';

const LoginPage: React.FC = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<Role>('student');
    const [group, setGroup] = useState('');
    const [subjects, setSubjects] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        const users = getData<User[]>('users', []);
        const user = users.find(u => u.login === login && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            navigate('/journal');
        } else {
            setError('Неверный логин или пароль');
        }
    };

    const handleRegister = () => {
        const users = getData<User[]>('users', []);
        if (users.some(u => u.login === login)) {
            setError('Пользователь с таким логином уже существует');
            return;
        }

        const id = Date.now();
        let newUser: User;

        if (role === 'student') {
            newUser = { id, login, password, fullName, role, group };
        }
        else {
            const subjectArray = subjects.split(',').map(s => s.trim());
            newUser = { id, login, password, fullName, role, subjects: subjectArray };
        }

        const updatedUsers = [...users, newUser];
        setData('users', updatedUsers);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        navigate('/journal');
    };

    return (
        <div className="auth">
            <div className="auth__switch">
                <button
                    className={`auth__tab ${isLoginMode ? 'auth__tab--active' : ''}`}
                    onClick={() => setIsLoginMode(true)}
                >
                    Log In
                </button>
                <button
                    className={`auth__tab ${!isLoginMode ? 'auth__tab--active' : ''}`}
                    onClick={() => setIsLoginMode(false)}
                >
                    Sign Up
                </button>
            </div>

            <div className="auth__panel">
                <div
                    className="auth__slider"
                    style={{ transform: isLoginMode ? 'translateX(0)' : 'translateX(-50%)' }}
                >
                    <div className="auth__form auth__form--login">
                        <h1 className={"auth_title"}>Вход</h1>
                        <input
                            className="auth__input"
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                        />
                        <input
                            className="auth__input"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button className="auth__button" onClick={handleLogin}>Войти</button>
                        {error && <div className="auth__error">{error}</div>}
                    </div>

                    <div className="auth__form auth__form--register">
                        <h1 className={"auth_title"}>Регистрация</h1>
                        <input
                            className="auth__input"
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                        />
                        <input
                            className="auth__input"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <input
                            className="auth__input"
                            type="text"
                            placeholder="ФИО"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />

                        <div className="auth__role-switch">
                            <button
                                className={`auth__role-button ${role === 'student' ? 'auth__role-button--active' : ''}`}
                                onClick={() => setRole('student')}
                            >
                                Студент
                            </button>
                            <button
                                className={`auth__role-button ${role === 'teacher' ? 'auth__role-button--active' : ''}`}
                                onClick={() => setRole('teacher')}
                            >
                                Преподаватель
                            </button>
                        </div>

                        <div className="auth__role__panel">
                            <div
                                className="auth__role__slider"
                                style={{ transform: role === 'student' ? 'translateY(0)' : 'translateY(-100%)' }}
                            >
                                <input
                                    className="auth__input"
                                    type="text"
                                    placeholder="Группа"
                                    value={group}
                                    onChange={e => setGroup(e.target.value)}
                                />
                                <input
                                    className="auth__input"
                                    type="text"
                                    placeholder="Предметы (через запятую)"
                                    value={subjects}
                                    onChange={e => setSubjects(e.target.value)}
                                />
                            </div>
                        </div>


                        <button className="auth__button" onClick={handleRegister}>Зарегистрироваться</button>
                        {error && <div className="auth__error">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
