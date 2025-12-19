import React, { useState, useEffect } from 'react';
import './Main.css';

// 더미 데이터 - 공장 구역
const ZONES = [
  { id: 1, name: 'A동 1층', area: '프레스 구역' },
  { id: 2, name: 'A동 2층', area: '사출 성형 구역' },
  { id: 3, name: 'B동 1층', area: '조립 구역' },
  { id: 4, name: 'B동 2층', area: '포장 구역' },
  { id: 5, name: 'C동 1층', area: '품질 검사 구역' },
  { id: 6, name: 'C동 2층', area: '창고' },
];

function Main() {
  const [zones, setZones] = useState(
    ZONES.map(zone => ({ ...zone, status: 'safe', lastDetection: null }))
  );

  // 데모용: 랜덤으로 경고 상태 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      const randomZoneId = Math.floor(Math.random() * ZONES.length) + 1;
      const shouldAlert = Math.random() > 0.8; // 20% 확률로 경고

      if (shouldAlert) {
        setZones(prevZones =>
          prevZones.map(zone =>
            zone.id === randomZoneId
              ? {
                  ...zone,
                  status: 'alert',
                  lastDetection: new Date().toLocaleTimeString('ko-KR'),
                }
              : zone
          )
        );

        // 3초 후 다시 안전 상태로
        setTimeout(() => {
          setZones(prevZones =>
            prevZones.map(zone =>
              zone.id === randomZoneId ? { ...zone, status: 'safe' } : zone
            )
          );
        }, 3000);
      }
    }, 5000); // 5초마다 체크

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-container">
      <div className="hero-section">
        <h1 className="hero-title">공장 안전 모니터링 시스템</h1>
        <p className="hero-subtitle">
          실시간으로 공장 내 소음과 비상 상황을 감지합니다
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">{zones.length}</div>
            <div className="stat-label">모니터링 구역</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {zones.filter(z => z.status === 'safe').length}
            </div>
            <div className="stat-label">안전 구역</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {zones.filter(z => z.status === 'alert').length}
            </div>
            <div className="stat-label">경고 구역</div>
          </div>
        </div>
      </div>

      <div className="zones-section">
        <h2 className="section-title">구역별 상태</h2>
        <div className="zones-grid">
          {zones.map(zone => (
            <div
              key={zone.id}
              className={`zone-card ${zone.status === 'alert' ? 'zone-alert' : 'zone-safe'}`}
            >
              <div className="zone-header">
                <div className="zone-name">{zone.name}</div>
                <div className={`status-indicator ${zone.status}`}>
                  {zone.status === 'alert' ? '🔴' : '🟢'}
                </div>
              </div>
              <div className="zone-area">{zone.area}</div>
              <div className="zone-status">
                {zone.status === 'alert' ? (
                  <div className="alert-message">
                    <strong>⚠️ 경고!</strong>
                    <div>이상 음성 감지</div>
                    {zone.lastDetection && (
                      <div className="detection-time">{zone.lastDetection}</div>
                    )}
                  </div>
                ) : (
                  <div className="safe-message">정상</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>🎤 실시간 음성 감지</h3>
          <p>각 구역의 마이크를 통해 24시간 모니터링</p>
        </div>
        <div className="info-card">
          <h3>🚨 즉시 알림</h3>
          <p>비상 상황 발생 시 실시간 알림 전송</p>
        </div>
        <div className="info-card">
          <h3>📊 데이터 분석</h3>
          <p>감지 이력 및 통계 분석 제공</p>
        </div>
      </div>
    </div>
  );
}

export default Main;

