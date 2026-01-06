import axios from 'axios';

// SSL 지원: 프로덕션 환경에서는 HTTPS 사용
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? 'https://localhost:8443' : 'http://localhost:8080');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 회원가입
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// 로그인
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// 로그아웃
export const logout = () => {
  localStorage.removeItem('token');
};

// 현재 사용자 정보
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// 사용자 정보 수정
export const updateUser = async (userData) => {
  const response = await api.put('/auth/me', userData);
  return response.data;
};

// 설정 관련 API
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const saveSettings = async (settings) => {
  const response = await api.post('/settings', settings);
  return response.data;
};

// 마이크 설정 관련 API
export const getMicrophoneSettings = async () => {
  const response = await api.get('/microphone/settings');
  return response.data;
};

export const saveMicrophoneSettings = async (settings) => {
  const response = await api.post('/microphone/settings', settings);
  return response.data;
};

// 마이크 상태 조회 (실시간)
export const getMicrophoneStatus = async () => {
  const response = await api.get('/microphone/status');
  return response.data;
};

// 사용 가능한 오디오 장치 목록 조회
export const getAvailableAudioDevices = async () => {
  const response = await api.get('/microphone/devices');
  return response.data;
};

// 시스템 상태 조회 (향후 구현)
export const getSystemStatus = async () => {
  const response = await api.get('/system/status');
  return response.data;
};

// PC 제원 정보 조회
export const getSystemInfo = async () => {
  const response = await api.get('/system/info');
  return response.data;
};


// 오디오 분석 API
export const analyzeAudio = async (audioData, sampleRate = 16000, duration = 1000) => {
  const response = await api.post('/api/audio/analyze', {
    audioData,
    sampleRate,
    duration
  });
  return response.data;
};

// 이벤트 API
export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.zone) params.append('zone', filters.zone);
  if (filters.type) params.append('type', filters.type);
  if (filters.severity) params.append('severity', filters.severity);
  if (filters.dateRange) params.append('dateRange', filters.dateRange);
  
  const response = await api.get(`/api/events?${params.toString()}`);
  return response.data;
};

export const getEventStats = async () => {
  const response = await api.get('/api/events/stats');
  return response.data;
};

// 알림 API
export const getNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const getUnreadNotificationCount = async () => {
  const response = await api.get('/api/notifications/unread-count');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/api/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/api/notifications/${id}`);
  return response.data;
};

// 관리자 API
export const getAllUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/admin/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/api/admin/users/${userId}/role`, { role });
  return response.data;
};

// 알림 설정 API
export const getNotificationSettings = async () => {
  const response = await api.get('/notification-settings');
  return response.data;
};

export const updateNotificationSettings = async (settings) => {
  const response = await api.put('/notification-settings', settings);
  return response.data;
};

// 저장 설정 API
export const getStorageSettings = async () => {
  const response = await api.get('/storage/settings');
  return response.data;
};

export const saveStorageSettings = async (settings) => {
  const response = await api.post('/storage/settings', settings);
  return response.data;
};

// 오디오 파일 저장 API
export const saveAudioFile = async (audioData, fileName) => {
  const response = await api.post('/api/audio-files/save', {
    audioData: audioData,
    fileName: fileName
  });
  return response.data;
};

export default api;

