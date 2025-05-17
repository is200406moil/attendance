import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <div className="not-found__content">
                <div className="not-found__code">404</div>
                <h1 className="not-found__title">Страница не найдена</h1>
                <p className="not-found__description">
                    Возможно, страница была удалена или её никогда не существовало
                </p>
                <div className="not-found__actions">
                    <button 
                        className="not-found__button not-found__button--primary"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Вернуться назад
                    </button>
                    <button 
                        className="not-found__button"
                        onClick={() => navigate('/')}
                    >
                        <i className="fas fa-home"></i>
                        На главную
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage; 