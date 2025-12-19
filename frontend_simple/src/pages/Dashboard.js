import React, { useState, useEffect } from 'react';
import { getMicrophoneStatus, getMicrophoneSettings, getSystemInfo, getAvailableAudioDevices } from '../api';
import './Dashboard.css';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    microphone: {
      status: 'active',
      inputLevel: 45,
      device: 'Default Microphone'
    },
    speaker: {
      status: 'active',
      outputLevel: 32,
      device: 'Default Speaker'
    },
    ai: {
      status: 'running',
      lastProcessed: new Date().toLocaleTimeString('ko-KR'),
      processingRate: '98.5%'
    },
    pc: {
      cpu: 45.2,
      memory: 62.8,
      disk: 38.5,
      uptime: '2일 14시간 32분',
      osName: '',
      osVersion: '',
      processorCount: 0,
      totalMemory: 0,
      usedMemory: 0,
      freeMemory: 0
    }
  });

  // 초기 데이터 로드
  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    try {
      // 환경설정에서 저장된 마이크 설정 가져오기
      const micSettings = await getMicrophoneSettings();
      
      // 마이크 상태 가져오기
      const micStatus = await getMicrophoneStatus();
      
      // 실제 PC 시스템 정보 가져오기
      const systemInfo = await getSystemInfo();
      
      // 오디오 장치 목록 가져오기 (장치 이름을 찾기 위해)
      const audioDevices = await getAvailableAudioDevices();
      
      // 환경설정에서 선택한 마이크 장치의 실제 이름 찾기
      let micDeviceName = 'Default Microphone';
      if (micSettings && micSettings.inputDevice) {
        if (audioDevices && audioDevices.inputDevices) {
          const selectedDevice = audioDevices.inputDevices.find(
            device => device.id === micSettings.inputDevice
          );
          if (selectedDevice) {
            micDeviceName = selectedDevice.name;
          } else if (micSettings.inputDevice === 'default') {
            micDeviceName = 'Default Microphone';
          } else {
            micDeviceName = micSettings.inputDevice;
          }
        } else {
          micDeviceName = micSettings.inputDevice === 'default' 
            ? 'Default Microphone' 
            : micSettings.inputDevice;
        }
      }
      
      // 환경설정에서 선택한 스피커 장치의 실제 이름 찾기
      let speakerDeviceName = 'Default Speaker';
      if (micSettings && micSettings.outputDevice) {
        if (audioDevices && audioDevices.outputDevices) {
          const selectedDevice = audioDevices.outputDevices.find(
            device => device.id === micSettings.outputDevice
          );
          if (selectedDevice) {
            speakerDeviceName = selectedDevice.name;
          } else if (micSettings.outputDevice === 'default') {
            speakerDeviceName = 'Default Speaker';
          } else {
            speakerDeviceName = micSettings.outputDevice;
          }
        } else {
          speakerDeviceName = micSettings.outputDevice === 'default' 
            ? 'Default Speaker' 
            : micSettings.outputDevice;
        }
      }
      
      if (micSettings) {
        // 환경설정의 값으로 마이크와 스피커 상태 설정
        setSystemStatus(prev => ({
          ...prev,
          microphone: {
            status: micSettings.enabled ? 'active' : 'inactive',
            inputLevel: micSettings.inputVolume || 0,
            device: micDeviceName
          },
          speaker: {
            status: micSettings.enabled ? 'active' : 'inactive',
            outputLevel: micSettings.outputVolume || 0,
            device: speakerDeviceName
          }
        }));
      } else if (micStatus) {
        // 설정이 없으면 상태 API에서 가져온 값 사용
        setSystemStatus(prev => ({
          ...prev,
          microphone: {
            status: micStatus.status,
            inputLevel: micStatus.inputLevel,
            device: micStatus.device
          },
          speaker: {
            status: micStatus.status,
            outputLevel: micStatus.outputLevel || 0,
            device: 'Default Speaker'
          }
        }));
      }
      
      // 실제 PC 시스템 정보 설정
      if (systemInfo) {
        setSystemStatus(prev => ({
          ...prev,
          pc: {
            cpu: systemInfo.cpuUsage || 0,
            memory: systemInfo.memoryUsage || 0,
            disk: systemInfo.diskUsage || 0,
            uptime: systemInfo.uptime || '0일 0시간 0분',
            osName: systemInfo.osName || '',
            osVersion: systemInfo.osVersion || '',
            processorCount: systemInfo.processorCount || 0,
            totalMemory: systemInfo.totalMemory || 0,
            usedMemory: systemInfo.usedMemory || 0,
            freeMemory: systemInfo.freeMemory || 0
          }
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('시스템 상태 로드 실패:', error);
      setLoading(false);
    }
  };

  // 실시간 상태 업데이트
  useEffect(() => {
    if (loading) return;
    
    const interval = setInterval(() => {
      // 환경설정에서 마이크 설정 가져오기 (설정이 변경되었을 수 있으므로 주기적으로 갱신)
      Promise.all([
        getMicrophoneSettings(),
        getAvailableAudioDevices()
      ]).then(([micSettings, audioDevices]) => {
        if (micSettings) {
          // 환경설정에서 선택한 마이크 장치의 실제 이름 찾기
          let micDeviceName = 'Default Microphone';
          if (micSettings.inputDevice) {
            if (audioDevices && audioDevices.inputDevices) {
              const selectedDevice = audioDevices.inputDevices.find(
                device => device.id === micSettings.inputDevice
              );
              if (selectedDevice) {
                micDeviceName = selectedDevice.name;
              } else if (micSettings.inputDevice === 'default') {
                micDeviceName = 'Default Microphone';
              } else {
                micDeviceName = micSettings.inputDevice;
              }
            } else {
              micDeviceName = micSettings.inputDevice === 'default' 
                ? 'Default Microphone' 
                : micSettings.inputDevice;
            }
          }
          
          // 환경설정에서 선택한 스피커 장치의 실제 이름 찾기
          let speakerDeviceName = 'Default Speaker';
          if (micSettings.outputDevice) {
            if (audioDevices && audioDevices.outputDevices) {
              const selectedDevice = audioDevices.outputDevices.find(
                device => device.id === micSettings.outputDevice
              );
              if (selectedDevice) {
                speakerDeviceName = selectedDevice.name;
              } else if (micSettings.outputDevice === 'default') {
                speakerDeviceName = 'Default Speaker';
              } else {
                speakerDeviceName = micSettings.outputDevice;
              }
            } else {
              speakerDeviceName = micSettings.outputDevice === 'default' 
                ? 'Default Speaker' 
                : micSettings.outputDevice;
            }
          }
          
          setSystemStatus(prev => ({
            ...prev,
            microphone: {
              status: micSettings.enabled ? 'active' : 'inactive',
              inputLevel: micSettings.inputVolume || 0,
              device: micDeviceName
            },
            speaker: {
              status: micSettings.enabled ? 'active' : 'inactive',
              outputLevel: micSettings.outputVolume || 0,
              device: speakerDeviceName
            }
          }));
        }
      }).catch(error => {
        console.error('마이크 설정 조회 실패:', error);
      });
      
      // AI 정보는 시뮬레이션
      setSystemStatus(prev => ({
        ...prev,
        ai: {
          ...prev.ai,
          lastProcessed: new Date().toLocaleTimeString('ko-KR'),
          processingRate: (95 + Math.random() * 5).toFixed(1) + '%'
        }
      }));
      
      // 실제 PC 시스템 정보 업데이트
      getSystemInfo().then(systemInfo => {
        if (systemInfo) {
          setSystemStatus(prev => ({
            ...prev,
            pc: {
              cpu: systemInfo.cpuUsage || 0,
              memory: systemInfo.memoryUsage || 0,
              disk: systemInfo.diskUsage || 0,
              uptime: systemInfo.uptime || prev.pc.uptime,
              osName: systemInfo.osName || prev.pc.osName,
              osVersion: systemInfo.osVersion || prev.pc.osVersion,
              processorCount: systemInfo.processorCount || prev.pc.processorCount,
              totalMemory: systemInfo.totalMemory || prev.pc.totalMemory,
              usedMemory: systemInfo.usedMemory || prev.pc.usedMemory,
              freeMemory: systemInfo.freeMemory || prev.pc.freeMemory
            }
          }));
        }
      }).catch(error => {
        console.error('시스템 정보 조회 실패:', error);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>실시간 시스템 모니터링</h1>
        <p className="dashboard-subtitle">시스템 상태를 실시간으로 확인하세요</p>
      </div>

      <div className="dashboard-grid">
        {/* 마이크 입력 상태 카드 */}
        <div className="status-card microphone-card">
          <div className="card-header">
            <h2>🎤 마이크 입력</h2>
            <span className={`status-badge ${systemStatus.microphone.status}`}>
              {systemStatus.microphone.status === 'active' ? '활성' : '비활성'}
            </span>
          </div>
          
          <div className="card-content">
            <div className="device-info">
              <span className="device-label">장치:</span>
              <span className="device-name">{systemStatus.microphone.device}</span>
            </div>

            <div className="level-meter">
              <div className="level-item">
                <div className="level-label">입력 레벨</div>
                <div className="level-bar-container">
                  <div 
                    className="level-bar input-bar"
                    style={{ width: `${systemStatus.microphone.inputLevel}%` }}
                  ></div>
                  <span className="level-value">{systemStatus.microphone.inputLevel}%</span>
                </div>
              </div>
            </div>

            <div className="status-indicator">
              <div className={`indicator-dot ${systemStatus.microphone.status}`}></div>
              <span>마이크 {systemStatus.microphone.status === 'active' ? '정상 작동 중' : '중지됨'}</span>
            </div>
          </div>
        </div>

        {/* 스피커 출력 상태 카드 */}
        <div className="status-card speaker-card">
          <div className="card-header">
            <h2>🔊 스피커 출력</h2>
            <span className={`status-badge ${systemStatus.speaker.status}`}>
              {systemStatus.speaker.status === 'active' ? '활성' : '비활성'}
            </span>
          </div>
          
          <div className="card-content">
            <div className="device-info">
              <span className="device-label">장치:</span>
              <span className="device-name">{systemStatus.speaker.device}</span>
            </div>

            <div className="level-meter">
              <div className="level-item">
                <div className="level-label">출력 레벨</div>
                <div className="level-bar-container">
                  <div 
                    className="level-bar output-bar"
                    style={{ width: `${systemStatus.speaker.outputLevel}%` }}
                  ></div>
                  <span className="level-value">{systemStatus.speaker.outputLevel}%</span>
                </div>
              </div>
            </div>

            <div className="status-indicator">
              <div className={`indicator-dot ${systemStatus.speaker.status}`}></div>
              <span>스피커 {systemStatus.speaker.status === 'active' ? '정상 작동 중' : '중지됨'}</span>
            </div>
          </div>
        </div>

        {/* AI 작동 상태 카드 */}
        <div className="status-card ai-card">
          <div className="card-header">
            <h2>🤖 AI 처리 상태</h2>
            <span className={`status-badge ${systemStatus.ai.status}`}>
              {systemStatus.ai.status === 'running' ? '실행 중' : '중지됨'}
            </span>
          </div>
          
          <div className="card-content">
            <div className="ai-metrics">
              <div className="metric-item">
                <div className="metric-label">처리 성공률</div>
                <div className="metric-value large">{systemStatus.ai.processingRate}</div>
              </div>
              
              <div className="metric-item">
                <div className="metric-label">마지막 처리 시간</div>
                <div className="metric-value">{systemStatus.ai.lastProcessed}</div>
              </div>
            </div>

            <div className="status-indicator">
              <div className={`indicator-dot ${systemStatus.ai.status}`}></div>
              <span>AI 엔진 {systemStatus.ai.status === 'running' ? '정상 작동 중' : '중지됨'}</span>
            </div>
          </div>
        </div>

        {/* PC 제원 정보 카드 */}
        <div className="status-card pc-card">
          <div className="card-header">
            <h2>💻 PC 시스템 정보</h2>
            <span className="status-badge active">정상</span>
          </div>
          
          <div className="card-content">
            <div className="pc-metrics">
              <div className="metric-row">
                <div className="metric-label">CPU 사용률</div>
                <div className="metric-bar-container">
                  <div 
                    className="metric-bar cpu-bar"
                    style={{ width: `${systemStatus.pc.cpu}%` }}
                  ></div>
                  <span className="metric-percentage">{systemStatus.pc.cpu}%</span>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-label">메모리 사용률</div>
                <div className="metric-bar-container">
                  <div 
                    className="metric-bar memory-bar"
                    style={{ width: `${systemStatus.pc.memory}%` }}
                  ></div>
                  <span className="metric-percentage">{systemStatus.pc.memory}%</span>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-label">디스크 사용률</div>
                <div className="metric-bar-container">
                  <div 
                    className="metric-bar disk-bar"
                    style={{ width: `${systemStatus.pc.disk}%` }}
                  ></div>
                  <span className="metric-percentage">{systemStatus.pc.disk}%</span>
                </div>
              </div>

              <div className="uptime-info">
                <span className="uptime-label">시스템 가동 시간:</span>
                <span className="uptime-value">{systemStatus.pc.uptime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="info-section">
        <div className="info-card">
          <h3>📊 실시간 모니터링</h3>
          <p>모든 시스템 상태는 2초마다 자동으로 업데이트됩니다</p>
        </div>
        <div className="info-card">
          <h3>⚙️ 설정 변경</h3>
          <p>환경설정 페이지에서 마이크 및 시스템 설정을 변경할 수 있습니다</p>
        </div>
        <div className="info-card">
          <h3>🔔 알림</h3>
          <p>시스템 이상 발생 시 즉시 알림을 받을 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

