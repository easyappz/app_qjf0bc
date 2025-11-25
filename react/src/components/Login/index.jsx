import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await loginUser(formData.username, formData.password);
      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.error) {
          setError(errorData.error);
        } else if (errorData.username || errorData.password) {
          if (errorData.username) {
            setError(Array.isArray(errorData.username) ? errorData.username[0] : errorData.username);
          } else if (errorData.password) {
            setError(Array.isArray(errorData.password) ? errorData.password[0] : errorData.password);
          }
        } else {
          setError('Неверное имя пользователя или пароль');
        }
      } else {
        setError('Произошла ошибка при входе. Попробуйте позже.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" data-easytag="id1-react/src/components/Login/index.jsx">
      <div className="login-card">
        <div className="login-header">
          <h1>Вход</h1>
          <p>Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message general-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={error ? 'input-error' : ''}
              placeholder="Введите имя пользователя"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={error ? 'input-error' : ''}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Нет аккаунта?{' '}
            <button 
              type="button"
              onClick={() => navigate('/register')} 
              className="link-button"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
