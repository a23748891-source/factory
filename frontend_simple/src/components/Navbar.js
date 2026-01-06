import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getCurrentUser, 
  getUnreadNotificationCount,
  getNotifications,
  markNotificationAsRead,
  deleteNotification
} from '../api';
import { useRecording } from '../contexts/RecordingContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const { isRecording, recordingTime, stopRecording } = useRecording();
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    if (token) {
      loadUser();
      loadUnreadCount();
      loadNotifications();
      
      // 5초마다 읽지 않은 알림 개수 및 알림 목록 업데이트
      const interval = setInterval(() => {
        loadUnreadCount();
        if (showNotificationDropdown) {
          loadNotifications();
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [token, showNotificationDropdown]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    if (showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationDropdown]);

  const loadUnreadCount = async () => {
    try {
      const data = await getUnreadNotificationCount();
      setUnreadNotifications(data.count || 0);
    } catch (error) {
      console.error('읽지 않은 알림 개수 로드 실패:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationsData = await getNotifications();
      const formattedNotifications = notificationsData.map(notif => ({
        ...notif,
        timestamp: notif.timestamp || new Date().toISOString()
      }));
      setNotifications(formattedNotifications.slice(0, 10)); // 최근 10개만 표시
    } catch (error) {
      console.error('알림 로드 실패:', error);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadNotifications(prev => Math.max(0, prev - 1));
      }
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return date.toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
              {isRecording && (
                <button 
                  onClick={stopRecording} 
                  className="nav-btn recording-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                >
                  ⏹️ 녹음 중지 ({Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')})
                </button>
              )}
              <button onClick={() => navigate('/')} className="nav-btn">
                홈
              </button>
              <button onClick={() => navigate('/events')} className="nav-btn">
                이벤트
              </button>
              <div className="notification-dropdown-container" ref={notificationDropdownRef}>
                <button 
                  onClick={() => {
                    setShowNotificationDropdown(!showNotificationDropdown);
                    if (!showNotificationDropdown) {
                      loadNotifications();
                    }
                  }}
                  className="nav-btn notification-btn"
                >
                  🔔
                  {unreadNotifications > 0 && (
                    <span className="notification-badge">{unreadNotifications}</span>
                  )}
                </button>
                {showNotificationDropdown && (
                  <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                      <h3>알림</h3>
                      {unreadNotifications > 0 && (
                        <span className="unread-count">{unreadNotifications}개 읽지 않음</span>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">알림이 없습니다</div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notif.id)}
                          >
                            <div className="notification-content">
                              <div className="notification-title">{notif.title}</div>
                              <div className="notification-message">{notif.message}</div>
                              <div className="notification-time">{formatDate(notif.timestamp)}</div>
                            </div>
                            <button
                              className="notification-delete-btn"
                              onClick={(e) => handleDeleteNotification(notif.id, e)}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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

