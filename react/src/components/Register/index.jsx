import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await registerUser(formData.username, formData.password);
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Произошла ошибка при регистрации. Попробуйте позже.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (field) => {
    if (errors[field]) {
      if (Array.isArray(errors[field])) {
        return errors[field][0];
      }
      return errors[field];
    }
    return null;
  };

  return (
    <div className="register-container" data-easytag="id1-react/src/components/Register/index.jsx">
      <div className="register-card">
        <div className="register-header">
          <h1>Регистрация</h1>
          <p>Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
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
              className={getErrorMessage('username') ? 'input-error' : ''}
              placeholder="Введите имя пользователя"
              disabled={isLoading}
            />
            {getErrorMessage('username') && (
              <span className="error-text">{getErrorMessage('username')}</span>
            )}
            <span className="field-hint">От 3 до 150 символов</span>
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={getErrorMessage('password') ? 'input-error' : ''}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
            {getErrorMessage('password') && (
              <span className="error-text">{getErrorMessage('password')}</span>
            )}
            <span className="field-hint">Минимум 8 символов</span>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Уже есть аккаунт?{' '}
            <button 
              type="button"
              onClick={() => navigate('/login')} 
              className="link-button"
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
