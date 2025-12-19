import React, { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // 더미 데이터 로드
    const dummyUsers = [
      { id: 1, user_id: 'admin', name: '관리자', email: 'admin@example.com', role: 'admin' },
      { id: 2, user_id: 'user1', name: '홍길동', email: 'user1@example.com', role: 'user' },
      { id: 3, user_id: 'user2', name: '김철수', email: 'user2@example.com', role: 'user' }
    ];

    const dummyZones = [
      { id: 1, name: 'A동 1층', area: '프레스 구역', status: 'active', microphone: '마이크 1' },
      { id: 2, name: 'A동 2층', area: '사출 성형 구역', status: 'active', microphone: '마이크 2' },
      { id: 3, name: 'B동 1층', area: '조립 구역', status: 'inactive', microphone: '마이크 3' }
    ];

    setUsers(dummyUsers);
    setZones(dummyZones);
  }, []);

  const handleDeleteUser = (id) => {
    if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleToggleZone = (id) => {
    setZones(prev =>
      prev.map(zone =>
        zone.id === id
          ? { ...zone, status: zone.status === 'active' ? 'inactive' : 'active' }
          : zone
      )
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>관리자 페이지</h1>
        <p className="admin-subtitle">시스템을 관리하고 설정을 변경할 수 있습니다</p>
      </div>

      <div className="admin-content">
        {/* 탭 메뉴 */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 사용자 관리
          </button>
          <button
            className={`tab-button ${activeTab === 'zones' ? 'active' : ''}`}
            onClick={() => setActiveTab('zones')}
          >
            🏭 구역 관리
          </button>
          <button
            className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            ⚙️ 시스템 설정
          </button>
        </div>

        {/* 사용자 관리 */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>사용자 관리</h2>
              <button className="add-button">+ 사용자 추가</button>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>역할</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.user_id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn">수정</button>
                          {user.role !== 'admin' && (
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 구역 관리 */}
        {activeTab === 'zones' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>구역 관리</h2>
              <button className="add-button">+ 구역 추가</button>
            </div>
            <div className="zones-grid">
              {zones.map(zone => (
                <div key={zone.id} className="zone-admin-card">
                  <div className="zone-admin-header">
                    <h3>{zone.name}</h3>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={zone.status === 'active'}
                        onChange={() => handleToggleZone(zone.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="zone-admin-info">
                    <div className="info-row">
                      <span className="info-label">구역:</span>
                      <span className="info-value">{zone.area}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">마이크:</span>
                      <span className="info-value">{zone.microphone}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">상태:</span>
                      <span className={`status-badge ${zone.status}`}>
                        {zone.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                  <div className="zone-admin-actions">
                    <button className="edit-btn">수정</button>
                    <button className="delete-btn">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 시스템 설정 */}
        {activeTab === 'system' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>시스템 설정</h2>
            </div>
            <div className="system-settings">
              <div className="setting-group">
                <h3>데이터베이스</h3>
                <div className="setting-item">
                  <span>백업 주기</span>
                  <select className="setting-select">
                    <option>매일</option>
                    <option>매주</option>
                    <option>매월</option>
                  </select>
                </div>
                <div className="setting-item">
                  <span>로그 보관 기간</span>
                  <select className="setting-select">
                    <option>30일</option>
                    <option>90일</option>
                    <option>1년</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h3>보안</h3>
                <div className="setting-item">
                  <span>세션 타임아웃 (분)</span>
                  <input type="number" className="setting-input" defaultValue="30" />
                </div>
                <div className="setting-item">
                  <span>비밀번호 최소 길이</span>
                  <input type="number" className="setting-input" defaultValue="6" />
                </div>
              </div>

              <div className="setting-group">
                <h3>알림</h3>
                <div className="setting-item">
                  <span>이메일 알림 활성화</span>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <span>SMS 알림 활성화</span>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-actions">
                <button className="save-button">설정 저장</button>
                <button className="reset-button">기본값으로 초기화</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;

