# 백엔드 정리 완료 ✅

## 삭제된 파일 (불필요한 파일)

### Controller
- ❌ `ApiController.java` - 삭제됨
- ❌ `GlobalExceptionHandler.java` - 삭제됨
- ✅ `AuthController.java` - **유지** (로그인/회원가입 API)

### Model/DTO
- ❌ `model/AuthDtos.java` - 삭제됨
- ❌ `model/EventDto.java` - 삭제됨
- ❌ `model/SettingsDto.java` - 삭제됨
- ✅ `dto/SignupRequest.java` - **유지**
- ✅ `dto/LoginRequest.java` - **유지**
- ✅ `dto/LoginResponse.java` - **유지**
- ✅ `dto/UserResponse.java` - **유지**
- ✅ `dto/ErrorResponse.java` - **유지**

### Security
- ❌ `security/JwtAuthFilter.java` - 삭제됨 (중복)
- ❌ `security/JwtService.java` - 삭제됨 (중복)
- ❌ `security/SecurityConfig.java` - 삭제됨 (중복)
- ❌ `security/JwtProvider.java` - 삭제됨 (중복)
- ✅ `config/JwtProvider.java` - **유지**
- ✅ `config/JwtAuthenticationFilter.java` - **유지**
- ✅ `config/SecurityConfig.java` - **유지**

### Service
- ❌ `service/EventStore.java` - 삭제됨
- ❌ `service/SettingsStore.java` - 삭제됨
- ❌ `service/UserStore.java` - 삭제됨
- ✅ `service/AuthService.java` - **유지** (인증 로직)

### Entity
- ❌ `domain/User.java` - 삭제됨 (중복)
- ✅ `entity/User.java` - **유지** (사용자 엔티티)

## 최종 파일 구조

```
backend/src/main/java/com/factory/
├── FactoryApplication.java         ✅ 메인 클래스
├── config/
│   ├── JwtProvider.java           ✅ JWT 토큰 생성/검증
│   ├── JwtAuthenticationFilter.java ✅ JWT 필터
│   └── SecurityConfig.java        ✅ Spring Security 설정
├── controller/
│   └── AuthController.java        ✅ 인증 API
├── service/
│   └── AuthService.java           ✅ 인증 서비스
├── repository/
│   └── UserRepository.java        ✅ DB 접근
├── entity/
│   └── User.java                  ✅ 사용자 엔티티
└── dto/
    ├── SignupRequest.java         ✅ 회원가입 요청
    ├── LoginRequest.java          ✅ 로그인 요청
    ├── LoginResponse.java         ✅ 로그인 응답
    ├── UserResponse.java          ✅ 사용자 응답
    └── ErrorResponse.java         ✅ 에러 응답
```

## 수동으로 삭제할 빈 폴더

다음 빈 폴더들은 수동으로 삭제해주세요:

```
backend/src/main/java/com/factory/domain/
backend/src/main/java/com/factory/model/
backend/src/main/java/com/factory/security/
```

**Windows에서:**
```
파일 탐색기에서 해당 폴더들을 선택하고 Delete 키를 누르세요.
```

## 정리 결과

### Before (이전)
- 파일 수: 20개 이상
- 불필요한 중복 파일 많음
- 복잡한 구조

### After (현재)
- 파일 수: 11개
- 로그인/회원가입/JWT만 있음
- 깔끔한 구조

## API 엔드포인트 (변경 없음)

✅ `POST /auth/register` - 회원가입  
✅ `POST /auth/login` - 로그인  
✅ `GET /auth/me` - 사용자 정보  

---

**백엔드가 훨씬 깔끔해졌습니다! 🎉**

필요한 파일만 남았고, 로그인/회원가입 기능은 정상 작동합니다.

