# 공장 안전 모니터링 시스템 - 프로젝트 요약

## 📋 프로젝트 구조

### 3-Tier 아키텍처
```
┌─────────────────┐
│  React Frontend │  (포트: 3000)
│   (프론트엔드)   │
└────────┬────────┘
         │ HTTP/REST API
┌────────▼────────┐
│ Spring Boot     │  (포트: 8080)
│   (백엔드)      │
└────────┬────────┘
         │ HTTP/REST API
┌────────▼────────┐
│ Python Flask    │  (포트: 5000)
│  ML Service     │
└─────────────────┘
```

---

## 🗄️ 데이터베이스 구조 (MySQL)

### 테이블 목록
1. **users** - 사용자 정보
   - user_id (PK), password, name, email, role

2. **notifications** - 알림
   - id (PK), user_id (FK), type, title, message, priority, is_read, created_at

3. **events** - 이벤트 로그
   - id (PK), zone, area, type, message, severity, audio_file_path, created_at

4. **notification_settings** - 알림 설정
   - id (PK), user_id (FK, UNIQUE), emergency_enabled, emergency_sound_enabled

5. **microphone_settings** - 마이크 설정
   - id (PK), user_id (FK), enabled, mode, schedule_start, schedule_end, input_device, output_device, input_volume, output_volume

---

## 🔧 백엔드 (Java Spring Boot)

### 포트: 8080

### 주요 설정
- **데이터베이스**: MySQL (localhost:3306/factory)
- **인증**: JWT (24시간 유효)
- **ML 서비스 URL**: http://localhost:5000

### API 엔드포인트

#### 1. 인증 (AuthController)
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/me` - 현재 사용자 정보
- `PUT /auth/me` - 사용자 정보 수정

#### 2. AI/ML (MLController)
- `GET /api/ml/model/info` - 모델 정보 조회
- `POST /api/ml/predict` - AI 예측 수행

#### 3. 오디오 분석 (AudioAnalysisController)
- `POST /api/audio/analyze` - 오디오 데이터 분석
  - 위험 소리 감지 시 자동으로 이벤트 및 알림 생성

#### 4. 마이크 설정 (MicrophoneController)
- `GET /microphone/settings` - 마이크 설정 조회
- `POST /microphone/settings` - 마이크 설정 저장
- `GET /microphone/status` - 마이크 상태 조회
- `GET /microphone/devices` - 오디오 장치 목록

#### 5. 이벤트 (EventController)
- `GET /api/events` - 이벤트 목록 조회 (필터링 지원)
- `GET /api/events/stats` - 이벤트 통계

#### 6. 알림 (NotificationController)
- `GET /api/notifications` - 알림 목록 조회
- `GET /api/notifications/unread-count` - 읽지 않은 알림 개수
- `PUT /api/notifications/{id}/read` - 알림 읽음 처리
- `PUT /api/notifications/read-all` - 모든 알림 읽음 처리
- `DELETE /api/notifications/{id}` - 알림 삭제

#### 7. 알림 설정 (NotificationSettingsController)
- `GET /notification-settings` - 알림 설정 조회
- `PUT /notification-settings` - 알림 설정 저장
  - emergency_enabled: 비상 상황 알림 받기
  - emergency_sound_enabled: 비상 상황 경고 소리

#### 8. 관리자 (AdminController)
- `GET /api/admin/users` - 모든 사용자 조회
- `PUT /api/admin/users/{userId}/role` - 사용자 역할 변경
- `DELETE /api/admin/users/{userId}` - 사용자 삭제

#### 9. 시스템 정보 (SystemInfoController)
- `GET /system/info` - PC 시스템 정보 (CPU, 메모리, 디스크 등)

---

## 🎨 프론트엔드 (React)

### 포트: 3000

### 페이지 목록

#### 1. **Main.js** - 메인 페이지 (홈)
   - 실시간 구역별 상태 모니터링
   - A동 1층: 마이크를 통한 실시간 AI 분석
   - 위험 감지 시 빨간색 경고 표시
   - 마이크 설정에 따라 자동 활성화/비활성화

#### 2. **AIPrediction.js** - AI 예측 페이지
   - 모델 정보 표시 (입력/출력 shape, 레이어 수 등)
   - 수동 예측 테스트
   - 샘플 데이터 생성 기능
   - 파일 업로드 지원 (CSV, JSON, TXT)

#### 3. **AudioMonitoring.js** - 오디오 모니터링 페이지
   - 실시간 오디오 시각화
   - 오디오 분석 결과 표시

#### 4. **Events.js** - 이벤트 로그 페이지
   - 이벤트 목록 조회
   - 필터링 (구역, 유형, 심각도, 기간)
   - 이벤트 통계 표시
   - 5초마다 자동 새로고침

#### 5. **Notifications.js** - 알림 페이지
   - 알림 목록 조회
   - 읽음/읽지 않음 필터링
   - 알림 읽음 처리, 삭제
   - 알림 설정:
     - 비상 상황 알림 받기
     - 비상 상황 경고 소리 재생
   - 3초마다 자동 새로고침
   - 비상 알림 감지 시 자동 경고 소리 재생

#### 6. **Settings.js** - 환경설정 페이지
   - 마이크 설정:
     - 활성화/비활성화 (즉시 반영)
     - 작동 모드 (상시/스케줄)
     - 입력/출력 장치 선택
     - 볼륨 조절
   - 이벤트 처리 설정
   - 저장 설정
   - 시스템 설정

#### 7. **Admin.js** - 관리자 페이지
   - 사용자 목록 조회
   - 사용자 역할 변경 (user/admin)
   - 사용자 삭제
   - 구역 관리

#### 8. **Search.js** - 검색 페이지
   - 이벤트 검색
   - 구역 검색

#### 9. **Dashboard.js** - 대시보드
   - 시스템 상태 모니터링
   - 마이크 상태 표시

#### 10. **Login.js / Register.js** - 인증 페이지
   - 로그인
   - 회원가입

#### 11. **Profile.js** - 프로필 페이지
   - 사용자 정보 조회/수정

---

## 🤖 Python ML 서비스 (Flask)

### 포트: 5000

### 주요 기능
- **모델 파일**: `ml_service/models/final_model.h5`
- **입력 Shape**: (None, 128, 63, 1) = 8064개 값
- **출력 Shape**: (None, 7) = 7개 클래스 확률

### API 엔드포인트
- `GET /api/health` - 서버 상태 확인
- `GET /api/model/info` - 모델 정보 조회
- `POST /api/predict` - 예측 수행
  - 요청: `{"data": [1.0, 2.0, ...]}`
  - 응답: `{"success": true, "prediction": [...], "input_shape": [...], "output_shape": [...]}`

### 주요 특징
- 모델 자동 로드 (첫 호출 시)
- 입력 데이터 검증 (NaN, Inf 체크)
- 예측 결과 정제 (None 값 제거)
- 에러 처리 및 로깅

---

## 🔄 주요 기능 흐름

### 1. 실시간 오디오 모니터링 (A동 1층)

```
[브라우저 마이크]
    ↓ (Web Audio API)
[Main.js]
    ↓ (3초마다)
[오디오 데이터 수집]
    ↓ (POST /api/audio/analyze)
[AudioAnalysisService]
    ↓ (오디오 데이터 변환)
[MLService]
    ↓ (POST http://localhost:5000/api/predict)
[Python ML Service]
    ↓ (AI 예측)
[예측 결과 반환]
    ↓
[위험 감지?]
    ├─ Yes → 이벤트 생성 + 알림 생성 + 빨간색 경고 표시
    └─ No → 정상 상태 유지
```

### 2. 알림 시스템

```
[위험 감지]
    ↓
[EventService.createEvent()]
    ↓
[NotificationService.createNotification()]
    ├─ 사용자별 알림 설정 확인
    ├─ emergency_enabled = true → 알림 생성
    └─ emergency_sound_enabled = true → 경고 소리 재생
```

### 3. 마이크 제어

```
[Settings.js]
    ↓ (마이크 끄기)
[POST /microphone/settings]
    ↓ (저장)
[Main.js]
    ↓ (5초마다 설정 확인)
[getMicrophoneSettings()]
    ↓ (enabled = false)
[stopAudioMonitoring()]
    ├─ 스트림 중지
    ├─ 오디오 컨텍스트 종료
    └─ 분석 인터벌 정리
```

---

## 🔐 보안 설정

### JWT 인증
- **Secret Key**: `application.yml`에 설정
- **만료 시간**: 24시간
- **필터**: `JwtAuthenticationFilter` - 모든 요청에 JWT 검증

### CORS 설정
- 허용 Origin: `http://localhost:3000`
- 허용 메서드: GET, POST, PUT, DELETE, OPTIONS

---

## 📊 데이터 흐름

### 위험 소리 감지 시
1. 프론트엔드: 마이크에서 오디오 데이터 수집
2. 백엔드: 오디오 데이터를 모델 입력 형식으로 변환
3. Python ML: AI 모델로 예측 수행
4. 백엔드: 예측 결과 분석
5. 위험 감지 시:
   - `events` 테이블에 이벤트 저장
   - 모든 사용자에게 알림 생성 (`notifications` 테이블)
   - 프론트엔드에 빨간색 경고 표시
   - 알림 설정이 활성화된 사용자에게 경고 소리 재생

---

## 🎯 주요 기능 요약

### ✅ 구현 완료

1. **사용자 인증**
   - 회원가입, 로그인, JWT 토큰 기반 인증

2. **실시간 오디오 모니터링**
   - A동 1층 실시간 AI 분석
   - 위험 감지 시 자동 경고

3. **마이크 제어**
   - 환경설정에서 마이크 활성화/비활성화
   - 실시간 반영 (5초마다 확인)

4. **이벤트 로그**
   - 위험 감지 이벤트 자동 기록
   - 필터링 및 통계 기능

5. **알림 시스템**
   - 비상 상황 알림
   - 경고 소리 재생
   - 읽음 처리, 삭제 기능

6. **관리자 기능**
   - 사용자 관리
   - 역할 변경

7. **AI 모델 연동**
   - Python ML 서비스와 통신
   - 실시간 예측 수행

---

## 🚀 실행 방법

### 1. 데이터베이스 설정
```bash
mysql -u root -p
CREATE DATABASE factory;
USE factory;
source backend/src/main/resources/schema.sql;
```

### 2. Python ML 서비스 실행
```bash
cd ml_service
# 가상환경 활성화 (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# 또는 CMD
venv\Scripts\activate.bat

# 서비스 실행
python app.py
```

### 3. 백엔드 실행
```bash
cd backend
mvn spring-boot:run
```

### 4. 프론트엔드 실행
```bash
cd frontend_simple
npm start
```

---

## 📝 설정 파일 위치

- **백엔드 설정**: `backend/src/main/resources/application.yml`
- **프론트엔드 API**: `frontend_simple/src/api.js`
- **Python ML 서비스**: `ml_service/app.py`
- **데이터베이스 스키마**: `backend/src/main/resources/schema.sql`

---

## 🔍 확인 방법

### AI 모델 연동 확인
1. `http://localhost:3000/ai-prediction` 접속
2. 모델 정보가 표시되면 연동 성공
3. 샘플 데이터로 예측 테스트

### 실시간 모니터링 확인
1. `http://localhost:3000` 접속
2. 환경설정에서 마이크 활성화
3. A동 1층 상태 확인
4. 브라우저 콘솔(F12)에서 "✅ AI 분석 성공" 메시지 확인

---

## ⚙️ 주요 설정값

- **백엔드 포트**: 8080
- **프론트엔드 포트**: 3000
- **Python ML 포트**: 5000
- **데이터베이스**: MySQL (localhost:3306/factory)
- **JWT 만료 시간**: 24시간
- **오디오 분석 주기**: 3초
- **마이크 설정 확인 주기**: 5초
- **알림 새로고침 주기**: 3초
- **이벤트 새로고침 주기**: 5초

---

## 🎨 UI/UX 특징

- 다크/라이트 테마 지원
- 반응형 디자인
- 실시간 업데이트
- 직관적인 상태 표시 (빨간색 경고, 초록색 안전)
- 부드러운 애니메이션 효과

---

이 프로젝트는 **공장 내 소음과 비상 상황을 실시간으로 감지하고 알림을 제공하는 안전 모니터링 시스템**입니다.

