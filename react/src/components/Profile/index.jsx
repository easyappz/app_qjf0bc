import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api/profile';
import { getAuthToken, logoutUser } from '../../api/auth';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
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
      setUsername(data.username || '');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logoutUser();
        navigate('/login');
      } else {
        setError('Ошибка загрузки профиля');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setUsername(profile.username || '');
      setUpdateError(null);
      setUpdateSuccess(false);
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    if (!username.trim()) {
      setUpdateError('Имя пользователя не может быть пустым');
      return;
    }

    try {
      const updatedData = await updateProfile(username);
      setProfile(updatedData);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return messages.join(', ');
              }
              return messages;
            })
            .join('; ');
          setUpdateError(errorMessages || 'Ошибка обновления профиля');
        } else {
          setUpdateError('Ошибка обновления профиля');
        }
      } else {
        setUpdateError('Ошибка обновления профиля');
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
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
              <span className="info-label">ID:</span>
              <span className="info-value">{profile?.id}</span>
            </div>
          </div>

          <div className="profile-edit-section">
            <div className="section-header">
              <h2>Имя пользователя</h2>
              {!isEditing && (
                <button className="edit-button" onClick={handleEditToggle}>
                  Редактировать
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-display">
                <div className="info-item">
                  <span className="info-label">Имя пользователя:</span>
                  <span className="info-value">{profile?.username}</span>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Имя пользователя:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Введите имя пользователя"
                    required
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
