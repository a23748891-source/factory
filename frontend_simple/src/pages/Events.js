import React, { useState, useEffect } from 'react';
import { getEvents, getEventStats } from '../api';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    zone: 'all',
    type: 'all',
    dateRange: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  // 이벤트 로드
  useEffect(() => {
    loadEvents();
    loadStats();
    
    // 5초마다 새로고침
    const interval = setInterval(() => {
      loadEvents();
      loadStats();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await getEvents({
        zone: filters.zone !== 'all' ? filters.zone : undefined,
        type: filters.type !== 'all' ? filters.type : undefined,
        dateRange: filters.dateRange !== 'all' ? filters.dateRange : undefined
      });
      
      // timestamp를 ISO 문자열로 변환
      const formattedEvents = eventsData.map(event => ({
        ...event,
        timestamp: event.timestamp || new Date().toISOString()
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('이벤트 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getEventStats();
      setStats(statsData);
    } catch (error) {
      console.error('통계 로드 실패:', error);
    }
  };

  // 필터 변경 시 이벤트 다시 로드
  useEffect(() => {
    loadEvents();
  }, [filters.zone, filters.type, filters.dateRange]);

  // 검색 필터 적용
  useEffect(() => {
    let filtered = [...events];

    // 검색 필터
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e =>
        (e.zone && e.zone.toLowerCase().includes(searchLower)) ||
        (e.area && e.area.toLowerCase().includes(searchLower)) ||
        (e.message && e.message.toLowerCase().includes(searchLower)) ||
        (e.typeLabel && e.typeLabel.toLowerCase().includes(searchLower))
      );
    }

    setFilteredEvents(filtered);
  }, [filters.search, events]);

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
        <p className="events-subtitle">
          시스템에 저장된 모든 위험 감지 이벤트를 확인하세요
          <br />
          <span style={{ fontSize: '0.9em', color: '#666', fontWeight: 'normal' }}>
            모든 사용자가 동일한 전체 이벤트 로그를 확인할 수 있습니다
          </span>
        </p>
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
            <option value="scream">비명 감지</option>
            <option value="help">도움 요청</option>
            <option value="emergency">비상상황</option>
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
                    {event.type === 'emergency' ? '🚨' : '✅'}
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
                {event.audioFilePath && (
                  <button className="audio-button">🔊 재생</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Events;

