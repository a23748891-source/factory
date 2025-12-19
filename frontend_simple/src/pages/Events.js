import React, { useState, useEffect } from 'react';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    zone: 'all',
    type: 'all',
    dateRange: 'today',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  // 더미 데이터 생성
  useEffect(() => {
    const dummyEvents = [
      {
        id: 1,
        zone: 'A동 1층',
        area: '프레스 구역',
        type: 'emergency',
        typeLabel: '비상 상황',
        message: '높은 소음 감지',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        severity: 'high',
        audioFile: null
      },
      {
        id: 2,
        zone: 'B동 2층',
        area: '포장 구역',
        type: 'noise',
        typeLabel: '소음 감지',
        message: '정상 범위 초과 소음',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        severity: 'medium',
        audioFile: null
      },
      {
        id: 3,
        zone: 'C동 1층',
        area: '품질 검사 구역',
        type: 'voice',
        typeLabel: '음성 인식',
        message: '음성 패턴 감지',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        severity: 'low',
        audioFile: null
      },
      {
        id: 4,
        zone: 'A동 2층',
        area: '사출 성형 구역',
        type: 'emergency',
        typeLabel: '비상 상황',
        message: '이상 소음 감지',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        severity: 'high',
        audioFile: null
      },
      {
        id: 5,
        zone: 'B동 1층',
        area: '조립 구역',
        type: 'noise',
        typeLabel: '소음 감지',
        message: '소음 레벨 증가',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        severity: 'medium',
        audioFile: null
      }
    ];

    setEvents(dummyEvents);
    setFilteredEvents(dummyEvents);
    setStats({
      total: dummyEvents.length,
      today: dummyEvents.filter(e => {
        const eventDate = new Date(e.timestamp);
        const today = new Date();
        return eventDate.toDateString() === today.toDateString();
      }).length,
      thisWeek: dummyEvents.length,
      thisMonth: dummyEvents.length
    });
    setLoading(false);
  }, []);

  // 필터 적용
  useEffect(() => {
    let filtered = [...events];

    // 구역 필터
    if (filters.zone !== 'all') {
      filtered = filtered.filter(e => e.zone === filters.zone);
    }

    // 유형 필터
    if (filters.type !== 'all') {
      filtered = filtered.filter(e => e.type === filters.type);
    }

    // 날짜 필터
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.timestamp);
        switch (filters.dateRange) {
          case 'today':
            return eventDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return eventDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return eventDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // 검색 필터
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e =>
        e.zone.toLowerCase().includes(searchLower) ||
        e.area.toLowerCase().includes(searchLower) ||
        e.message.toLowerCase().includes(searchLower) ||
        e.typeLabel.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  }, [filters, events]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return date.toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>이벤트 로그</h1>
        <p className="events-subtitle">감지된 모든 이벤트를 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">전체 이벤트</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.today}</div>
            <div className="stat-label">오늘</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisWeek}</div>
            <div className="stat-label">이번 주</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗓️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisMonth}</div>
            <div className="stat-label">이번 달</div>
          </div>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="filters-section">
        <div className="filter-group">
          <label>구역</label>
          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="filter-select"
          >
            <option value="all">전체</option>
            <option value="A동 1층">A동 1층</option>
            <option value="A동 2층">A동 2층</option>
            <option value="B동 1층">B동 1층</option>
            <option value="B동 2층">B동 2층</option>
            <option value="C동 1층">C동 1층</option>
            <option value="C동 2층">C동 2층</option>
          </select>
        </div>

        <div className="filter-group">
          <label>유형</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-select"
          >
            <option value="all">전체</option>
            <option value="emergency">비상 상황</option>
            <option value="noise">소음 감지</option>
            <option value="voice">음성 인식</option>
          </select>
        </div>

        <div className="filter-group">
          <label>기간</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">전체</option>
            <option value="today">오늘</option>
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label>검색</label>
          <input
            type="text"
            placeholder="구역, 메시지 검색..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-search"
          />
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>조건에 맞는 이벤트가 없습니다</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className={`event-card ${getSeverityClass(event.severity)}`}>
              <div className="event-header">
                <div className="event-type-badge">
                  <span className={`type-icon ${event.type}`}>
                    {event.type === 'emergency' ? '🚨' : event.type === 'noise' ? '🔊' : '🎤'}
                  </span>
                  <span className="type-label">{event.typeLabel}</span>
                </div>
                <div className="event-time">{formatDate(event.timestamp)}</div>
              </div>

              <div className="event-body">
                <div className="event-zone">
                  <strong>{event.zone}</strong> - {event.area}
                </div>
                <div className="event-message">{event.message}</div>
              </div>

              <div className="event-footer">
                <div className={`severity-badge ${event.severity}`}>
                  {event.severity === 'high' ? '높음' : event.severity === 'medium' ? '보통' : '낮음'}
                </div>
                {event.audioFile && (
                  <button className="audio-button">🔊 재생</button>
                )}
                <button className="detail-button">상세보기</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Events;

