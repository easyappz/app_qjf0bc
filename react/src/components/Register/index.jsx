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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await registerUser(formData.username, formData.password);
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: ['Произошла ошибка при регистрации. Попробуйте позже.'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (field) => {
    if (errors[field] && Array.isArray(errors[field])) {
      return errors[field][0];
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
              {errors.general[0]}
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
              className={getErrorMessage('username') ? 'error' : ''}
              placeholder="Введите имя пользователя"
              minLength={3}
              maxLength={150}
              required
            />
            {getErrorMessage('username') && (
              <span className="error-message">{getErrorMessage('username')}</span>
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
              className={getErrorMessage('password') ? 'error' : ''}
              placeholder="Введите пароль"
              minLength={8}
              required
            />
            {getErrorMessage('password') && (
              <span className="error-message">{getErrorMessage('password')}</span>
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
