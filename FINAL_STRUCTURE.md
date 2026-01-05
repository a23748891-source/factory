# 최종 프로젝트 정리

## 현재 상태

✅ **유지할 것:**
- `backend/` - Spring Boot 백엔드 (Java + MySQL + JWT)
- `frontend_simple/` - React 프론트엔드 (로그인/회원가입)
- `README.md` - 프로젝트 소개
- `SIMPLE_README.md` - 상세 가이드

❌ **삭제할 것:**
- `frontend/` - 중복된 프론트엔드

## 수동 삭제 필요

다음 폴더를 Windows 탐색기에서 삭제해주세요:

### frontend/ 폴더
```
경로: C:\Users\a2374\Downloads\factory_complete\frontend
이유: frontend_simple로 대체됨
```

또는 PowerShell에서:
```powershell
Remove-Item -Recurse -Force "C:\Users\a2374\Downloads\factory_complete\frontend"
```

## 삭제 후 최종 구조

```
factory_complete/
│
├── backend/              ✅ Spring Boot 백엔드
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── frontend_simple/      ✅ React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Home.js
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.js
│   ├── package.json
│   └── README.md
│
├── README.md             ✅ 간단한 설명
├── SIMPLE_README.md      ✅ 상세 가이드
└── .gitignore            ✅ Git 설정
```

## 실행 방법

### 1. 백엔드 (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
→ http://localhost:8080

### 2. 프론트엔드 (React)
```bash
cd frontend_simple
npm install
npm start
```
→ http://localhost:3000

## 데이터베이스

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

---

**이제 프로젝트가 매우 간단하고 깔끔합니다! 🎉**

필요한 것만 남았습니다:
- ✅ 백엔드 1개 (Spring Boot)
- ✅ 프론트엔드 1개 (React)
- ✅ 로그인/회원가입 기능만

