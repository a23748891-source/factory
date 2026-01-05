import React, { useState, useEffect } from 'react';
import { getModelInfo, predictML } from '../api';
import './AIPrediction.css';

function AIPrediction() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState('');
  const [inputFile, setInputFile] = useState(null);

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await getModelInfo();
      
      // 응답 구조 확인 (data 필드가 있는 경우)
      if (info.data) {
        setModelInfo(info.data);
      } else {
        setModelInfo(info);
      }
      
      console.log('✅ AI 모델 연동 성공!', info);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || '알 수 없는 오류';
      setError('모델 정보를 불러올 수 없습니다: ' + errorMsg);
      console.error('❌ AI 모델 연동 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setInputFile(file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        // CSV나 텍스트 파일인 경우 파싱
        if (file.name.endsWith('.csv')) {
          const lines = text.split('\n');
          const data = [];
          lines.forEach(line => {
            const values = line.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            data.push(...values);
          });
          setInputData(data.join(', '));
        } else if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            setInputData(json.join(', '));
          } else if (json.data && Array.isArray(json.data)) {
            setInputData(json.data.join(', '));
          }
        } else {
          // 일반 텍스트 파일
          const values = text.split(/[\s,]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
          setInputData(values.join(', '));
        }
      } catch (err) {
        setError('파일을 읽을 수 없습니다: ' + err.message);
      }
    };
    
    reader.readAsText(file);
  };

  const handlePredict = async () => {
    try {
      setPredicting(true);
      setError(null);
      setPrediction(null);

      // 입력 데이터를 배열로 변환
      const dataArray = inputData
        .split(',')
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

      if (dataArray.length === 0) {
        setError('입력 데이터가 없습니다.');
        setPredicting(false);
        return;
      }

      // 모델 입력 형식에 맞게 변환 (128, 63, 1) = 8064개 값
      const expectedSize = 128 * 63 * 1; // 8064
      
      if (dataArray.length !== expectedSize) {
        console.warn(`입력 데이터 크기가 예상과 다릅니다. 예상: ${expectedSize}, 실제: ${dataArray.length}`);
        // 부족한 경우 0으로 채우거나, 초과하는 경우 자르기
        if (dataArray.length < expectedSize) {
          while (dataArray.length < expectedSize) {
            dataArray.push(0);
          }
        } else {
          dataArray.splice(expectedSize);
        }
      }

      const result = await predictML(dataArray);
      
      if (result.success) {
        setPrediction(result);
      } else {
        setError(result.error || '예측 실패');
      }
    } catch (err) {
      setError('예측 중 오류 발생: ' + (err.response?.data?.error || err.message));
    } finally {
      setPredicting(false);
    }
  };

  const generateSampleData = () => {
    // 샘플 데이터 생성 (128 * 63 * 1 = 8064개)
    const sampleData = Array.from({ length: 128 * 63 * 1 }, () => 
      (Math.random() * 2 - 1).toFixed(4)
    );
    setInputData(sampleData.join(', '));
  };

  if (loading) {
    return (
      <div className="ai-prediction-container">
        <div className="loading">모델 정보 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="ai-prediction-container">
      <div className="ai-prediction-header">
        <h1>🤖 AI 모델 예측</h1>
        <p className="subtitle">학습된 AI 모델을 사용하여 예측을 수행합니다</p>
      </div>

      {/* 모델 정보 카드 */}
      {modelInfo && (
        <div className="model-info-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>모델 정보</h2>
            <span style={{ 
              background: '#4caf50', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              ✅ 연동 완료
            </span>
          </div>
          <div className="model-info-grid">
            <div className="info-item">
              <span className="info-label">입력 Shape:</span>
              <span className="info-value">
                {modelInfo.input_shape ? JSON.stringify(modelInfo.input_shape) : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">출력 Shape:</span>
              <span className="info-value">
                {modelInfo.output_shape ? JSON.stringify(modelInfo.output_shape) : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">레이어 수:</span>
              <span className="info-value">{modelInfo.layers_count || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">파라미터 수:</span>
              <span className="info-value">
                {modelInfo.total_params ? modelInfo.total_params.toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 입력 섹션 */}
      <div className="input-section">
        <h2>입력 데이터</h2>
        
        <div className="input-controls">
          <div className="file-upload-area">
            <label className="file-upload-label">
              <input
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="file-input"
              />
              <span className="file-upload-button">📁 파일 업로드</span>
            </label>
            <span className="file-info">
              {inputFile ? inputFile.name : 'CSV, JSON, TXT 파일 지원'}
            </span>
          </div>

          <button 
            className="sample-data-button"
            onClick={generateSampleData}
          >
            🎲 샘플 데이터 생성
          </button>
        </div>

        <div className="input-data-area">
          <label className="input-label">
            데이터 입력 (쉼표로 구분된 숫자):
            <span className="data-count">
              {inputData ? inputData.split(',').length : 0}개 값
            </span>
          </label>
          <textarea
            className="input-textarea"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="예: 0.1, 0.2, 0.3, ... (총 8064개 값 필요)"
            rows={6}
          />
          <div className="input-hint">
            💡 모델 입력 형식: (128, 63, 1) = 8,064개의 숫자 값이 필요합니다
          </div>
        </div>

        <button
          className="predict-button"
          onClick={handlePredict}
          disabled={predicting || !inputData.trim()}
        >
          {predicting ? '예측 중...' : '🔮 예측 실행'}
        </button>
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* 예측 결과 */}
      {prediction && (
        <div className="prediction-result">
          <h2>예측 결과</h2>
          
          <div className="result-content">
            <div className="result-item">
              <span className="result-label">성공:</span>
              <span className={`result-value ${prediction.success ? 'success' : 'error'}`}>
                {prediction.success ? '✅ 예측 완료' : '❌ 실패'}
              </span>
            </div>

            {prediction.prediction && (
              <div className="result-item">
                <span className="result-label">예측값:</span>
                <div className="prediction-values">
                  {Array.isArray(prediction.prediction[0]) ? (
                    // 2D 배열인 경우
                    prediction.prediction.map((row, idx) => (
                      <div key={idx} className="prediction-row">
                        <span className="row-label">결과 {idx + 1}:</span>
                        <span className="row-values">
                          {row.map((val, i) => (
                            <span key={i} className="value-badge">
                              {val.toFixed(4)}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))
                  ) : (
                    // 1D 배열인 경우
                    <div className="prediction-values">
                      {prediction.prediction.map((val, idx) => (
                        <span key={idx} className="value-badge">
                          클래스 {idx}: {val.toFixed(4)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {prediction.output_shape && (
              <div className="result-item">
                <span className="result-label">출력 Shape:</span>
                <span className="result-value">
                  {JSON.stringify(prediction.output_shape)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIPrediction;

