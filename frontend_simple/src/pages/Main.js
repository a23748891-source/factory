import React from 'react';
import { useRecording } from '../contexts/RecordingContext';
import './Main.css';

// A동 1층만 모니터링
const ZONES = [
  { id: 1, name: 'A동 1층', area: '프레스 구역' },
];

function Main() {
  const { 
    isRecording, 
    recordingTime, 
    recordedAudioUrl, 
    recordedFileName,
    zones,
    startRecording, 
    stopRecording, 
    downloadRecording 
  } = useRecording();

  return (
    <div className="main-container">
      <div className="hero-section">
        <h1 className="hero-title">공장 안전 모니터링 시스템</h1>
        <p className="hero-subtitle">
          실시간으로 공장 내 소음과 비상 상황을 감지합니다
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">A동 1층</div>
            <div className="stat-label">모니터링 구역</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {zones[0]?.status === 'safe' ? '🟢' : '🔴'}
            </div>
            <div className="stat-label">
              {zones[0]?.status === 'safe' ? '정상' : '위험 감지'}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {zones[0]?.status === 'alert' ? '⚠️' : '✅'}
            </div>
            <div className="stat-label">현재 상태</div>
          </div>
        </div>
      </div>

      {/* 녹음 컨트롤 섹션 */}
      <div className="recording-section">
        <div className="recording-controls">
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <span className="record-icon">⏹️</span>
                <span>녹음 중지</span>
              </>
            ) : (
              <>
                <span className="record-icon">🔴</span>
                <span>녹음 시작</span>
              </>
            )}
          </button>
          
          {isRecording && (
            <div className="recording-status">
              <span className="recording-indicator">●</span>
              <span className="recording-time">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
              <span className="recording-text">녹음 중...</span>
            </div>
          )}

          {recordedAudioUrl && !isRecording && (
            <div className="recording-result">
              <span className="recording-success">✅ 녹음 완료</span>
              <button className="download-button" onClick={downloadRecording}>
                📥 다운로드 ({recordedFileName})
              </button>
            </div>
          )}
        </div>
        <p className="recording-info">
          {isRecording 
            ? '녹음 중입니다. AI가 실시간으로 위험 소리를 감지합니다. 다른 페이지로 이동해도 녹음은 계속됩니다.'
            : '녹음 버튼을 눌러 오디오를 녹음하고 AI 분석을 시작하세요.'}
        </p>
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
                  {zone.status === 'alert' ? (
                    <div className="danger-light">🔴</div>
                  ) : (
                    <div className="safe-light">🟢</div>
                  )}
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

      {/* 사용 방법 섹션 */}
      <div className="usage-section">
        <h2 className="section-title">사용 방법</h2>
        <div className="usage-steps">
          <div className="usage-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>녹음 시작</h3>
              <p>위의 "녹음 시작" 버튼을 클릭하여 오디오 녹음을 시작합니다.</p>
            </div>
          </div>
          <div className="usage-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>AI 분석</h3>
              <p>녹음 중 AI가 3초마다 오디오를 분석하여 위험 소리를 감지합니다.</p>
            </div>
          </div>
          <div className="usage-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>위험 감지</h3>
              <p>위험 소리가 감지되면 A동 1층이 빨간색으로 표시되고 이벤트가 생성됩니다.</p>
            </div>
          </div>
          <div className="usage-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>녹음 중지 및 저장</h3>
              <p>녹음이 완료되면 상단 네비게이션 바의 "녹음 중지" 버튼을 클릭하거나, 홈 화면의 "녹음 중지" 버튼을 클릭하고, 다운로드 버튼으로 파일을 저장할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>🎤 녹음 기반 AI 분석</h3>
          <p>
            녹음 버튼을 눌러 오디오를 녹음하고 AI가 위험 소리를 실시간으로 감지합니다.
            녹음된 파일은 자동으로 저장됩니다.
          </p>
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
