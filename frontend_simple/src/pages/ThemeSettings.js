import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeSettings.css';

function ThemeSettings() {
  const { theme, colorScheme, toggleTheme, changeColorScheme } = useTheme();

  const colorSchemes = [
    { id: 'purple', name: '보라색', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'blue', name: '파란색', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'green', name: '초록색', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 'orange', name: '주황색', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { id: 'red', name: '빨간색', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' },
    { id: 'teal', name: '청록색', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
  ];

  return (
    <div className="theme-settings-container">
      <div className="theme-settings-header">
        <h1>테마 설정</h1>
        <p className="theme-settings-subtitle">화면 테마와 색상을 변경할 수 있습니다</p>
      </div>

      <div className="theme-settings-content">
        {/* 다크모드 설정 */}
        <div className="theme-section">
          <div className="section-header">
            <h2>다크 모드</h2>
          </div>
          <div className="theme-option">
            <div className="theme-option-info">
              <span className="theme-option-label">다크 모드</span>
              <span className="theme-option-desc">
                {theme === 'dark' ? '다크 모드가 활성화되어 있습니다' : '라이트 모드가 활성화되어 있습니다'}
              </span>
            </div>
            <label className="toggle-switch large">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="theme-preview">
            <div className={`preview-card ${theme}`}>
              <div className="preview-header">
                <div className="preview-dot"></div>
                <div className="preview-dot"></div>
                <div className="preview-dot"></div>
              </div>
              <div className="preview-content">
                <div className="preview-line short"></div>
                <div className="preview-line"></div>
                <div className="preview-line medium"></div>
              </div>
            </div>
            <p className="preview-label">{theme === 'dark' ? '다크 모드' : '라이트 모드'}</p>
          </div>
        </div>

        {/* 색상 테마 설정 */}
        <div className="theme-section">
          <div className="section-header">
            <h2>색상 테마</h2>
          </div>
          <div className="color-schemes-grid">
            {colorSchemes.map(scheme => (
              <div
                key={scheme.id}
                className={`color-scheme-card ${colorScheme === scheme.id ? 'active' : ''}`}
                onClick={() => changeColorScheme(scheme.id)}
              >
                <div
                  className="color-scheme-preview"
                  style={{ background: scheme.gradient }}
                ></div>
                <div className="color-scheme-name">{scheme.name}</div>
                {colorScheme === scheme.id && (
                  <div className="color-scheme-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSettings;

