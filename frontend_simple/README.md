# 공장 관리 시스템 - 프론트엔드

간단한 로그인/회원가입 시스템

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

앱이 `http://localhost:3000`에서 실행됩니다.

## 기능

- 회원가입
- 로그인
- JWT 토큰 인증
- 보호된 홈 페이지

## API 엔드포인트 (백엔드)

백엔드는 `http://localhost:8080`에서 실행되어야 합니다.

- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/me` - 현재 사용자 정보

## 페이지

- `/login` - 로그인 페이지
- `/register` - 회원가입 페이지
- `/home` - 홈 (로그인 필요)

