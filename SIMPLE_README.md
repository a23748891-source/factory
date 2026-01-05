# 간단한 로그인/회원가입 시스템

## 프로젝트 구조

```
factory_complete/
├── backend/                 # Spring Boot 백엔드 (기존)
└── frontend_simple/         # React 프론트엔드 (새로 개발)
```

## 데이터베이스 설정

### MySQL

```sql
CREATE DATABASE factory;

USE factory;

CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);
```

## 백엔드 (Spring Boot)

기존 `backend/` 폴더의 Spring Boot 프로젝트를 사용합니다.

**필요한 API:**
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인 (JWT 토큰 반환)
- `GET /auth/me` - 현재 사용자 정보 (JWT 인증 필요)

백엔드는 `http://localhost:8080`에서 실행되어야 합니다.

## 프론트엔드 (React)

### 설치 및 실행

```bash
cd frontend_simple

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 주요 파일

```
frontend_simple/
├── src/
│   ├── App.js              # 메인 앱
│   ├── api.js              # API 클라이언트
│   ├── components/
│   │   └── PrivateRoute.js # 인증 라우트
│   └── pages/
│       ├── Login.js        # 로그인 페이지
│       ├── Register.js     # 회원가입 페이지
│       └── Home.js         # 홈 페이지
└── package.json
```

## 기능

### 1. 회원가입 (`/register`)
- 아이디, 이름, 이메일, 비밀번호, 역할 입력
- 유효성 검사
- 백엔드로 POST 요청

### 2. 로그인 (`/login`)
- 아이디, 비밀번호 입력
- JWT 토큰을 localStorage에 저장
- 홈 페이지로 이동

### 3. 홈 페이지 (`/home`)
- 로그인한 사용자만 접근 가능
- 사용자 정보 표시
- 로그아웃 기능

## API 통신

### 회원가입

**요청:**
```json
POST /auth/register
{
  "user_id": "testuser",
  "password": "password123",
  "name": "홍길동",
  "email": "test@example.com",
  "role": "user"
}
```

### 로그인

**요청:**
```json
POST /auth/login
{
  "user_id": "testuser",
  "password": "password123"
}
```

**응답:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "testuser",
    "name": "홍길동",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### 사용자 정보 조회

**요청:**
```
GET /auth/me
Authorization: Bearer {token}
```

**응답:**
```json
{
  "user_id": "testuser",
  "name": "홍길동",
  "email": "test@example.com",
  "role": "user"
}
```

## 주요 특징

- ✅ JWT 토큰 기반 인증
- ✅ localStorage에 토큰 저장
- ✅ Axios 인터셉터로 자동 토큰 추가
- ✅ 401 에러 시 자동 로그아웃
- ✅ 보호된 라우트 (PrivateRoute)
- ✅ 반응형 디자인
- ✅ 현대적인 UI

## 개발 순서

1. **백엔드 API 먼저 개발**
   - Spring Boot에서 위의 3개 API 구현
   - JWT 토큰 발급 및 검증
   - MySQL 연동

2. **프론트엔드 개발**
   - 이미 완성되어 있음
   - 필요시 UI 커스터마이징

3. **테스트**
   - 회원가입 → 로그인 → 홈 페이지 이동 확인

## 트러블슈팅

### CORS 오류
백엔드에서 CORS 설정 필요:

```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("*");
            }
        };
    }
}
```

### 포트 충돌
- 백엔드: 8080번 포트 확인
- 프론트엔드: 3000번 포트 확인

---

**간단하고 깔끔한 인증 시스템입니다! 🎉**

