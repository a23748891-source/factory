import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getMicrophoneSettings, 
  saveMicrophoneSettings, 
  getAvailableAudioDevices,
  getNotificationSettings,
  updateNotificationSettings
} from '../api';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    microphone: {
      inputDevice: 'default',
      outputDevice: 'default',
      inputVolume: 75,
      outputVolume: 80
    },
    storage: {
      enabled: true,
      retentionDays: 30,
      maxStorageGB: 10,
      autoCleanup: true
    },
    system: {
      autoStart: true,
      startOnBoot: true,
      backgroundMode: true
    }
  });

  const [saved, setSaved] = useState(false);
  const [audioDevices, setAudioDevices] = useState({
    inputDevices: [],
    outputDevices: []
  });
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyEnabled: true,
    emergencySoundEnabled: true
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    // 설정 로드 및 장치 목록 로드
    loadSettings();
    loadAudioDevices();
    loadNotificationSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await getMicrophoneSettings();
      if (loadedSettings) {
        setSettings(prev => ({
          ...prev,
          microphone: {
            inputDevice: loadedSettings.inputDevice ?? prev.microphone.inputDevice,
            outputDevice: loadedSettings.outputDevice ?? prev.microphone.outputDevice,
            inputVolume: loadedSettings.inputVolume ?? prev.microphone.inputVolume,
            outputVolume: loadedSettings.outputVolume ?? prev.microphone.outputVolume
          }
        }));
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  };

  const loadAudioDevices = async () => {
    try {
      setLoadingDevices(true);
      const devices = await getAvailableAudioDevices();
      if (devices) {
        const inputDevices = devices.inputDevices || [];
        const outputDevices = devices.outputDevices || [];
        
        setAudioDevices({
          inputDevices: inputDevices.length > 0 ? inputDevices : [
            { id: 'default', name: 'Default Microphone', description: 'Default input device' }
          ],
          outputDevices: outputDevices.length > 0 ? outputDevices : [
            { id: 'default', name: 'Default Speaker', description: 'Default output device' }
          ]
        });
      }
      setLoadingDevices(false);
    } catch (error) {
      console.error('오디오 장치 목록 로드 실패:', error);
      // 에러 발생 시 기본 장치만 표시
      setAudioDevices({
        inputDevices: [{ id: 'default', name: 'Default Microphone', description: 'Default input device' }],
        outputDevices: [{ id: 'default', name: 'Default Speaker', description: 'Default output device' }]
      });
      setLoadingDevices(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveMicrophoneSettings({
        inputDevice: settings.microphone.inputDevice,
        outputDevice: settings.microphone.outputDevice,
        inputVolume: settings.microphone.inputVolume,
        outputVolume: settings.microphone.outputVolume
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const settingsData = await getNotificationSettings();
      setNotificationSettings({
        emergencyEnabled: settingsData.emergencyEnabled ?? true,
        emergencySoundEnabled: settingsData.emergencySoundEnabled ?? true
      });
    } catch (error) {
      console.error('알림 설정 로드 실패:', error);
    }
  };

  const handleNotificationSettingsChange = async (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value };
    
    // 비상 알림이 비활성화되면 경고 소리도 자동으로 비활성화
    if (key === 'emergencyEnabled' && !value) {
      newSettings.emergencySoundEnabled = false;
    }
    
    setNotificationSettings(newSettings);
    setSavingNotifications(true);
    
    try {
      await updateNotificationSettings(newSettings);
    } catch (error) {
      console.error('알림 설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
      // 실패 시 원래 값으로 복구
      setNotificationSettings(notificationSettings);
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>환경 설정</h1>
        <p className="settings-subtitle">시스템 설정을 관리하세요</p>
      </div>

      <div className="settings-content">
        {/* 마이크 설정 */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🎤 마이크 입출력 설정</h2>
            <button 
              onClick={loadAudioDevices} 
              className="refresh-devices-btn"
              title="장치 목록 새로고침"
            >
              🔄 새로고침
            </button>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-label">
                <span>입력 장치 (마이크)</span>
                <span className="setting-desc">사용할 마이크 장치를 선택하세요</span>
              </div>
              {loadingDevices ? (
                <div className="loading-text">장치 목록 로딩 중...</div>
              ) : (
                <select
                  value={settings.microphone.inputDevice || 'default'}
                  onChange={(e) => handleChange('microphone', 'inputDevice', e.target.value)}
                  className="select-input"
                >
                  {audioDevices.inputDevices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>출력 장치 (스피커)</span>
                <span className="setting-desc">사용할 스피커 장치를 선택하세요</span>
              </div>
              {loadingDevices ? (
                <div className="loading-text">장치 목록 로딩 중...</div>
              ) : (
                <select
                  value={settings.microphone.outputDevice || 'default'}
                  onChange={(e) => handleChange('microphone', 'outputDevice', e.target.value)}
                  className="select-input"
                >
                  {audioDevices.outputDevices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>입력 볼륨</span>
                <span className="setting-desc">마이크 입력 볼륨 조절</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.microphone.inputVolume}
                  onChange={(e) => handleChange('microphone', 'inputVolume', parseInt(e.target.value))}
                  className="volume-slider"
                />
                <span className="slider-value">{settings.microphone.inputVolume}%</span>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>출력 볼륨</span>
                <span className="setting-desc">스피커 출력 볼륨 조절</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.microphone.outputVolume}
                  onChange={(e) => handleChange('microphone', 'outputVolume', parseInt(e.target.value))}
                  className="volume-slider"
                />
                <span className="slider-value">{settings.microphone.outputVolume}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 설정 */}
        <div className="settings-section">
          <div className="section-header">
            <h2>💾 음성 파일 저장 설정</h2>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-label">
                <span>자동 저장 활성화</span>
                <span className="setting-desc">음성 파일 자동 저장 기능</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.storage.enabled}
                  onChange={(e) => handleChange('storage', 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>저장 기간 (일)</span>
                <span className="setting-desc">음성 파일을 보관할 기간</span>
              </div>
              <div className="number-input-container">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.storage.retentionDays}
                  onChange={(e) => handleChange('storage', 'retentionDays', parseInt(e.target.value))}
                  className="number-input"
                />
                <span className="input-unit">일</span>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>최대 저장 용량 (GB)</span>
                <span className="setting-desc">최대 저장 가능한 용량</span>
              </div>
              <div className="number-input-container">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.storage.maxStorageGB}
                  onChange={(e) => handleChange('storage', 'maxStorageGB', parseInt(e.target.value))}
                  className="number-input"
                />
                <span className="input-unit">GB</span>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>자동 정리</span>
                <span className="setting-desc">기간 초과 파일 자동 삭제</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.storage.autoCleanup}
                  onChange={(e) => handleChange('storage', 'autoCleanup', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🔔 알림 설정</h2>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-label">
                <span>비상 상황 알림 받기</span>
                <span className="setting-desc">비상 상황 발생 시 알림을 받습니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.emergencyEnabled}
                  onChange={(e) => handleNotificationSettingsChange('emergencyEnabled', e.target.checked)}
                  disabled={savingNotifications}
                />
                <span className="toggle-slider"></span>
              </label>
              {savingNotifications && <span className="saving-indicator">저장 중...</span>}
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>비상상황 발생 시 경고 소리 재생</span>
                <span className="setting-desc">비상 상황 발생 시 경고 소리를 재생합니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.emergencySoundEnabled && notificationSettings.emergencyEnabled}
                  onChange={(e) => handleNotificationSettingsChange('emergencySoundEnabled', e.target.checked)}
                  disabled={savingNotifications || !notificationSettings.emergencyEnabled}
                />
                <span className="toggle-slider"></span>
              </label>
              {savingNotifications && <span className="saving-indicator">저장 중...</span>}
            </div>
          </div>
        </div>

        {/* 시스템 설정 */}
        <div className="settings-section">
          <div className="section-header">
            <h2>⚙️ 시스템 설정</h2>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-label">
                <span>서버 재부팅 시 자동 실행</span>
                <span className="setting-desc">시스템 재부팅 후 자동으로 서비스를 시작합니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.system.startOnBoot}
                  onChange={(e) => handleChange('system', 'startOnBoot', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>자동 시작</span>
                <span className="setting-desc">애플리케이션 실행 시 자동으로 서비스를 시작합니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.system.autoStart}
                  onChange={(e) => handleChange('system', 'autoStart', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span>백그라운드 모드</span>
                <span className="setting-desc">창을 닫아도 백그라운드에서 계속 실행</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.system.backgroundMode}
                  onChange={(e) => handleChange('system', 'backgroundMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="settings-actions">
          <button onClick={handleSave} className="save-button">
            {saved ? '✓ 저장 완료' : '설정 저장'}
          </button>
          <button onClick={() => navigate('/')} className="cancel-button">
            취소
          </button>
        </div>

        {/* 추가 설정 링크 */}
        <div className="additional-settings">
          <div className="profile-link-section">
            <button onClick={() => navigate('/profile')} className="profile-link-button">
              👤 개인정보
            </button>
            <p className="profile-link-desc">회원 정보를 확인하고 수정할 수 있습니다</p>
          </div>

          <div className="profile-link-section">
            <button onClick={() => navigate('/theme')} className="profile-link-button">
              🎨 테마 설정
            </button>
            <p className="profile-link-desc">다크모드 및 색상 테마를 변경할 수 있습니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

