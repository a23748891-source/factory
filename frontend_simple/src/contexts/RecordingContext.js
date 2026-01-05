import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { analyzeAudio } from '../api';

const RecordingContext = createContext();

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error('useRecording must be used within RecordingProvider');
  }
  return context;
};

export const RecordingProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [recordedFileName, setRecordedFileName] = useState(null);
  const [zones, setZones] = useState([
    { id: 1, name: 'A동 1층', area: '프레스 구역', status: 'safe', lastDetection: null }
  ]);

  // Ref들을 전역으로 관리
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const monitoringIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // 녹음 시간 업데이트
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopRecording();
      stopAudioMonitoring();
    };
  }, []);

  // 오디오 모니터링 중지
  const stopAudioMonitoring = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      // 마이크 접근
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      streamRef.current = stream;

      // 오디오 컨텍스트 생성
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // 오디오 분석 노드 생성
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      microphoneRef.current = microphone;

      // MediaRecorder로 녹음 시작
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // 녹음 완료 시 파일 생성
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        
        // 파일명 생성 (날짜/시간 포함)
        const now = new Date();
        const fileName = `recording_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.webm`;
        setRecordedFileName(fileName);
      };

      // 녹음 시작
      mediaRecorder.start(1000); // 1초마다 데이터 수집
      setIsRecording(true);
      setRecordedAudioUrl(null);
      setRecordedFileName(null);

      // AI 분석 시작 (3초마다)
      startAudioAnalysis();

      console.log('✅ 녹음 시작');
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  // 오디오 분석 시작
  const startAudioAnalysis = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }

    monitoringIntervalRef.current = setInterval(async () => {
      if (!analyserRef.current || !audioContextRef.current) return;

      try {
        // 오디오 데이터 수집 (시간 도메인 데이터 사용)
        const bufferLength = analyserRef.current.fftSize;
        const timeData = new Float32Array(bufferLength);
        analyserRef.current.getFloatTimeDomainData(timeData);
        
        // Float32Array를 List로 변환
        const audioData = [];
        for (let i = 0; i < timeData.length; i++) {
          audioData.push(timeData[i]);
        }
        
        // 모델 입력 크기에 맞게 조정 (128 * 63 * 1 = 8064)
        const targetSize = 128 * 63 * 1;
        
        // 데이터 크기 조정
        if (audioData.length > targetSize) {
          const step = audioData.length / targetSize;
          const resampled = [];
          for (let i = 0; i < targetSize; i++) {
            const index = Math.floor(i * step);
            resampled.push(audioData[index] || 0);
          }
          audioData.splice(0, audioData.length, ...resampled);
        } else {
          while (audioData.length < targetSize) {
            audioData.push(0.0);
          }
        }

        // AI 분석 요청
        const result = await analyzeAudio(audioData, 16000, 1000);

        if (result.success) {
          // A동 1층 상태 업데이트
          setZones(prevZones =>
            prevZones.map(zone => ({
              ...zone,
              status: result.isDangerous ? 'alert' : 'safe',
              lastDetection: result.isDangerous 
                ? new Date().toLocaleTimeString('ko-KR')
                : zone.lastDetection,
            }))
          );
        }
      } catch (err) {
        console.error('오디오 분석 실패:', err);
      }
    }, 3000); // 3초마다 분석
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    stopAudioMonitoring();
    setIsRecording(false);
    console.log('⏹️ 녹음 중지');
  };

  // 녹음 파일 다운로드
  const downloadRecording = () => {
    if (recordedAudioUrl && recordedFileName) {
      const a = document.createElement('a');
      a.href = recordedAudioUrl;
      a.download = recordedFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const value = {
    isRecording,
    recordingTime,
    recordedAudioUrl,
    recordedFileName,
    zones,
    startRecording,
    stopRecording,
    downloadRecording,
  };

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  );
};

