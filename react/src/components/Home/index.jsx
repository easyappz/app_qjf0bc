import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export const Home = () => {
  return (
    <div className="home-container" data-easytag="id1-react/src/components/Home/index.jsx">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">Добро пожаловать!</h1>
          <p className="home-subtitle">
            Это современное веб-приложение на React и Django
          </p>
        </div>

        <div className="home-actions">
          <Link to="/register" className="home-button home-button-primary">
            Регистрация
          </Link>
          <Link to="/login" className="home-button home-button-secondary">
            Вход
          </Link>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Быстрый старт</h3>
            <p>Зарегистрируйтесь и начните использовать приложение прямо сейчас</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Безопасность</h3>
            <p>Ваши данные надежно защищены современными технологиями</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Высокая производительность</h3>
            <p>Оптимизированное приложение для лучшего опыта использования</p>
          </div>
        </div>
      </div>
    </div>
  );
};
