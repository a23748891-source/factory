import React, { useState, useEffect } from 'react';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sound: true,
    emergency: true,
    noise: true,
    voice: false
  });

  // 더미 알림 데이터
  useEffect(() => {
    const dummyNotifications = [
      {
        id: 1,
        type: 'emergency',
        title: '비상 상황 감지',
        message: 'A동 1층 프레스 구역에서 높은 소음이 감지되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'noise',
        title: '소음 감지',
        message: 'B동 2층 포장 구역에서 정상 범위를 초과한 소음이 감지되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'voice',
        title: '음성 인식',
        message: 'C동 1층 품질 검사 구역에서 음성 패턴이 감지되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'emergency',
        title: '비상 상황 감지',
        message: 'A동 2층 사출 성형 구역에서 이상 소음이 감지되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        read: true,
        priority: 'high'
      },
      {
        id: 5,
        type: 'system',
        title: '시스템 알림',
        message: '마이크 설정이 변경되었습니다',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        priority: 'low'
      }
    ];

    setNotifications(dummyNotifications);
    setUnreadCount(dummyNotifications.filter(n => !n.read).length);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const handleDelete = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return date.toLocaleString('ko-KR');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emergency':
        return '🚨';
      case 'noise':
        return '🔊';
      case 'voice':
        return '🎤';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div>
          <h1>알림 센터</h1>
          <p className="notifications-subtitle">
            {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="mark-all-read-btn">
            모두 읽음 처리
          </button>
        )}
      </div>

      <div className="notifications-content">
        {/* 알림 목록 */}
        <div className="notifications-section">
          <div className="section-header">
            <h2>알림 목록</h2>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                전체 ({notifications.length})
              </button>
              <button
                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                읽지 않음 ({unreadCount})
              </button>
              <button
                className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                onClick={() => setFilter('read')}
              >
                읽음 ({notifications.filter(n => n.read).length})
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="no-notifications">
                <p>알림이 없습니다</p>
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-card ${!notif.read ? 'unread' : ''} ${getPriorityClass(notif.priority)}`}
                >
                  <div className="notification-icon">
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header-row">
                      <h3 className="notification-title">{notif.title}</h3>
                      {!notif.read && <span className="unread-dot"></span>}
                    </div>
                    <p className="notification-message">{notif.message}</p>
                    <div className="notification-footer">
                      <span className="notification-time">{formatDate(notif.timestamp)}</span>
                      <div className="notification-actions">
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="action-btn read-btn"
                          >
                            읽음
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="action-btn delete-btn"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="settings-section">
          <div className="section-header">
            <h2>알림 설정</h2>
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-label">
                <span>이메일 알림</span>
                <span className="setting-desc">이메일로 알림을 받습니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>푸시 알림</span>
                <span className="setting-desc">브라우저 푸시 알림을 받습니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={(e) => setSettings(prev => ({ ...prev, push: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>소리 알림</span>
                <span className="setting-desc">알림 발생 시 소리를 재생합니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.sound}
                  onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-divider"></div>

            <div className="setting-item">
              <div className="setting-label">
                <span>비상 상황 알림</span>
                <span className="setting-desc">비상 상황 발생 시 알림을 받습니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emergency}
                  onChange={(e) => setSettings(prev => ({ ...prev, emergency: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>소음 감지 알림</span>
                <span className="setting-desc">소음 감지 시 알림을 받습니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.noise}
                  onChange={(e) => setSettings(prev => ({ ...prev, noise: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>음성 인식 알림</span>
                <span className="setting-desc">음성 인식 시 알림을 받습니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.voice}
                  onChange={(e) => setSettings(prev => ({ ...prev, voice: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;

