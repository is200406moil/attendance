import React, { useState } from 'react';
import './ProfilePage.css';
import { User } from '../../types';
import Header from "../../components/Header/Header";

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(() => {
        const data = localStorage.getItem('currentUser');
        return data ? JSON.parse(data) : null;
    });

    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = () => {
        if (!user) return;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: User) =>
            u.login === user.login ? { ...u, password: newPassword } : u
        );

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify({ ...user, password: newPassword }));
        setUser({ ...user, password: newPassword });
        setNewPassword('');
        setMessage('Пароль изменён');
    };

    if (!user) return <div className="profile__container">Пользователь не найден</div>;

    return (
        <>
            <Header/>
            <div className="profile__background">
                <div className="profile__square profile__square--top-left"></div>
                <div className="profile__square profile__square--top-right"></div>
                <div className="profile__square profile__square--bottom-right"></div>
                <div className="profile__square profile__square--bottom-left"></div>

                <div className="profile__container">
                    {user.role === 'student' && <h2 className="profile__title">Информация о студенте</h2>}
                    {user.role === 'teacher' && <h2 className="profile__title">Информация о преподавателе</h2>}
                    <div className="profile__info"><strong>Логин:</strong> {user.login}</div>
                    <div className="profile__info"><strong>ФИО:</strong> {user.fullName}</div>
                    {user.role === 'student' && <div className="profile__info"><strong>Группа:</strong> {user.group}</div>}
                    {user.role === 'teacher' && (
                        <div className="profile__info">
                            <strong>Предметы:</strong> {user.subjects.join(', ')}
                        </div>
                    )}
                    <div className="profile__change">
                        <input
                            className="profile__input"
                            placeholder="Новый пароль"
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <button className="profile__button" onClick={handleChangePassword}>Изменить пароль</button>
                        {message && <div className="profile__message">{message}</div>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
