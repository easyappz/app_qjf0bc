import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfilePartial } from '../../api/profile';
import { getAuthToken, removeAuthToken } from '../../api/auth';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
      setFormData({
        email: data.email || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        removeAuthToken();
        navigate('/login');
      } else {
        setError('Ошибка загрузки профиля');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        email: profile.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      });
      setUpdateError(null);
      setUpdateSuccess(false);
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const updatedData = await updateProfilePartial(formData);
      setProfile(updatedData);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        setUpdateError(errorMessages || 'Ошибка обновления профиля');
      } else {
        setUpdateError('Ошибка обновления профиля');
      }
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Профиль пользователя</h1>
          <button className="logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        {updateSuccess && (
          <div className="success-message">
            Профиль успешно обновлен!
          </div>
        )}

        {updateError && (
          <div className="error-message">
            {updateError}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-info-section">
            <h2>Информация</h2>
            <div className="info-item">
              <span className="info-label">Имя пользователя:</span>
              <span className="info-value">{profile?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Дата регистрации:</span>
              <span className="info-value">{formatDate(profile?.created_at)}</span>
            </div>
          </div>

          <div className="profile-edit-section">
            <div className="section-header">
              <h2>Редактируемые данные</h2>
              {!isEditing && (
                <button className="edit-button" onClick={handleEditToggle}>
                  Редактировать
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-display">
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile?.email || 'Не указан'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Имя:</span>
                  <span className="info-value">{profile?.first_name || 'Не указано'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Фамилия:</span>
                  <span className="info-value">{profile?.last_name || 'Не указана'}</span>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Введите email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="first_name">Имя:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Введите имя"
                    maxLength={150}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Фамилия:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Введите фамилию"
                    maxLength={150}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Сохранить
                  </button>
                  <button type="button" className="cancel-button" onClick={handleEditToggle}>
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
