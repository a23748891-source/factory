import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({
    events: [],
    zones: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    
    // 더미 검색 결과
    const dummyEvents = [
      {
        id: 1,
        type: 'event',
        title: '비상 상황 감지',
        description: 'A동 1층 프레스 구역에서 높은 소음이 감지되었습니다',
        zone: 'A동 1층',
        timestamp: new Date().toISOString()
      }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const dummyZones = [
      { id: 1, name: 'A동 1층', area: '프레스 구역', status: 'safe' },
      { id: 2, name: 'A동 2층', area: '사출 성형 구역', status: 'safe' }
    ].filter(zone =>
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTimeout(() => {
      setResults({
        events: dummyEvents,
        zones: dummyZones
      });
      setLoading(false);
    }, 500);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('ko-KR');
  };

  if (!query) {
    return (
      <div className="search-container">
        <div className="search-empty">
          <h1>검색</h1>
          <p>검색어를 입력하세요</p>
        </div>
      </div>
    );
  }

  const totalResults = results.events.length + results.zones.length;

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>검색 결과</h1>
        <p className="search-query">"{query}"에 대한 검색 결과: {totalResults}개</p>
      </div>

      {loading ? (
        <div className="search-loading">검색 중...</div>
      ) : (
        <div className="search-results">
          {/* 이벤트 결과 */}
          {results.events.length > 0 && (
            <div className="result-section">
              <h2>이벤트 ({results.events.length})</h2>
              <div className="result-list">
                {results.events.map(event => (
                  <div key={event.id} className="result-card">
                    <div className="result-icon">🚨</div>
                    <div className="result-content">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="result-meta">
                        <span>{event.zone}</span>
                        <span>{formatDate(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 구역 결과 */}
          {results.zones.length > 0 && (
            <div className="result-section">
              <h2>구역 ({results.zones.length})</h2>
              <div className="result-list">
                {results.zones.map(zone => (
                  <div key={zone.id} className="result-card">
                    <div className="result-icon">🏭</div>
                    <div className="result-content">
                      <h3>{zone.name}</h3>
                      <p>{zone.area}</p>
                      <div className="result-meta">
                        <span className={`status-badge ${zone.status}`}>
                          {zone.status === 'safe' ? '안전' : '경고'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="no-results">
              <p>검색 결과가 없습니다</p>
              <p className="no-results-hint">다른 검색어를 시도해보세요</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;

