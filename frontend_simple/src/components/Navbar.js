import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../api';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // 더미 데이터

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // 로그인 페이지나 회원가입 페이지에서는 네비게이션 바를 보여주지 않음
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          🏭 공장 안전 모니터링
        </div>

        {token && (
          <div className="navbar-search">
            <SearchBar />
          </div>
        )}

        <div className="navbar-menu">
          {token ? (
            <>
              <button onClick={() => navigate('/')} className="nav-btn">
                홈
              </button>
              <button onClick={() => navigate('/dashboard')} className="nav-btn">
                대시보드
              </button>
              <button onClick={() => navigate('/events')} className="nav-btn">
                이벤트
              </button>
              <button 
                onClick={() => navigate('/notifications')} 
                className="nav-btn notification-btn"
              >
                알림
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </button>
              <button onClick={() => navigate('/settings')} className="nav-btn">
                환경설정
              </button>
              {isAdmin && (
                <button onClick={() => navigate('/admin')} className="nav-btn admin-btn">
                  관리자
                </button>
              )}
              <ThemeToggle />
              <button onClick={handleLogout} className="nav-btn nav-btn-outline">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="nav-btn nav-btn-outline">
                로그인
              </button>
              <button onClick={() => navigate('/register')} className="nav-btn">
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

