import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__section">
                    <h3 className="footer__title">Контакты</h3>
                    <div className="footer__contact-item">
                        <i className="fas fa-envelope"></i>
                        <a href="mailto:giyesidinov.i.i@edu.mirea.ru">giyesidinov.i.i@edu.mirea.ru</a>
                    </div>
                    <div className="footer__contact-item">
                        <i className="fas fa-location-dot"></i>
                        <span>Где-то между РТУ МИРЭА и домом</span>
                    </div>
                </div>

                <div className="footer__section">
                    <h3 className="footer__title">Мессенджеры</h3>
                    <div className="footer__social">
                        <a href="https://t.me/SMiLECE0" target="_blank" rel="noopener noreferrer" title="Telegram">
                            <i className="fab fa-telegram"></i>
                        </a>
                        <a href="https://github.com/is200406moil" target="_blank" rel="noopener noreferrer" title="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </div>

                <div className="footer__section">
                    <h3 className="footer__title">Режим работы</h3>
                    <div className="footer__schedule">
                        <p>24/7, но это не точно</p>
                        <p className="footer__schedule-note">*Перерыв на сон и пары</p>
                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <p>© 2025 Attendance. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer; 