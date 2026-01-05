# 공장 관리 시스템 - 로그인/회원가입

간단한 로그인 및 회원가입 시스템입니다.

## 프로젝트 구조

```
factory_complete/
├── backend/           # Spring Boot 백엔드 (Java)
└── frontend_simple/   # React 프론트엔드
```

## 데이터베이스 설정 (MySQL)

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

`backend/` 폴더의 Spring Boot 프로젝트 사용

**필요한 API:**
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인 (JWT 토큰 반환)
- `GET /auth/me` - 사용자 정보 조회

포트: `http://localhost:8080`

## 프론트엔드 (React)

```bash
cd frontend_simple
npm install
npm start
```

포트: `http://localhost:3000`

### 페이지
- `/login` - 로그인
- `/register` - 회원가입  
- `/home` - 홈 (로그인 필요)

## 기능

✅ JWT 토큰 인증  
✅ 회원가입  
✅ 로그인  
✅ 사용자 정보 표시  
✅ 로그아웃

---

자세한 내용은 **SIMPLE_README.md**를 참조하세요.
