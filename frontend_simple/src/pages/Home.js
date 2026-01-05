import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../api';
import './Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="welcome-box">
          <h1>환영합니다! 👋</h1>
          {user && (
            <div className="user-info">
              <div className="info-item">
                <span className="label">아이디:</span>
                <span className="value">{user.user_id}</span>
              </div>
              <div className="info-item">
                <span className="label">이름:</span>
                <span className="value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="label">이메일:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="label">역할:</span>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

