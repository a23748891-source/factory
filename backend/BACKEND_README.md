# Spring Boot 백엔드

## 설정

### 1. MySQL 데이터베이스 생성

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

### 2. application.yml 수정

`src/main/resources/application.yml` 파일에서 MySQL 비밀번호 변경:

```yaml
spring:
  datasource:
    username: root
    password: your_password  # 여기를 본인의 MySQL 비밀번호로 변경
```

### 3. JWT Secret Key 변경 (프로덕션)

```yaml
jwt:
  secret: your-super-secret-key-change-this  # 프로덕션에서는 반드시 변경
```

## 실행

### IntelliJ에서 실행
1. `backend` 폴더를 IntelliJ에서 열기
2. `FactoryApplication.java` 파일 찾기
3. Run 버튼 클릭

### 명령줄에서 실행

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

서버는 `http://localhost:8080`에서 실행됩니다.

## API 엔드포인트

### 회원가입
```http
POST /auth/register
Content-Type: application/json

{
  "user_id": "testuser",
  "password": "password123",
  "name": "홍길동",
  "email": "test@example.com",
  "role": "user"
}
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

### 로그인
```http
POST /auth/login
Content-Type: application/json

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

### 현재 사용자 정보
```http
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

## 프로젝트 구조

```
backend/
├── src/
│   └── main/
│       ├── java/com/factory/
│       │   ├── FactoryApplication.java     # 메인 클래스
│       │   ├── config/
│       │   │   ├── SecurityConfig.java     # Spring Security 설정
│       │   │   ├── JwtProvider.java        # JWT 토큰 생성/검증
│       │   │   └── JwtAuthenticationFilter.java  # JWT 필터
│       │   ├── controller/
│       │   │   └── AuthController.java     # 인증 API
│       │   ├── service/
│       │   │   └── AuthService.java        # 비즈니스 로직
│       │   ├── repository/
│       │   │   └── UserRepository.java     # DB 접근
│       │   ├── entity/
│       │   │   └── User.java               # 사용자 엔티티
│       │   └── dto/
│       │       ├── SignupRequest.java
│       │       ├── LoginRequest.java
│       │       ├── LoginResponse.java
│       │       ├── UserResponse.java
│       │       └── ErrorResponse.java
│       └── resources/
│           └── application.yml             # 설정 파일
└── pom.xml                                 # Maven 의존성
```

## 기술 스택

- **Spring Boot 3.2.0**
- **Spring Security** (인증/권한)
- **Spring Data JPA** (ORM)
- **MySQL 8.0+**
- **JWT (jjwt 0.12.3)**
- **Lombok** (보일러플레이트 코드 제거)
- **BCrypt** (비밀번호 해싱)

## 보안 기능

✅ JWT 토큰 기반 인증  
✅ BCrypt 비밀번호 해싱  
✅ CORS 설정  
✅ Stateless 세션  
✅ 중복 가입 방지  

## 테스트

Postman이나 curl로 API 테스트:

```bash
# 회원가입
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"user_id":"testuser","password":"password123","name":"홍길동","email":"test@example.com","role":"user"}'

# 로그인
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_id":"testuser","password":"password123"}'

# 사용자 정보 (토큰 필요)
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 트러블슈팅

### MySQL 연결 오류
- MySQL이 실행 중인지 확인
- `application.yml`의 username/password 확인
- 데이터베이스 `factory`가 생성되었는지 확인

### JWT 토큰 오류
- 토큰이 만료되었을 수 있음 (24시간)
- `jwt.secret`이 충분히 긴지 확인 (최소 256비트)

### CORS 오류
- `SecurityConfig.java`에서 프론트엔드 URL 확인
- 기본값: `http://localhost:3000`

