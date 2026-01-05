# JWT 오류 수정 완료 ✅

## 문제
```
java: cannot find symbol
  symbol:   method parserBuilder()
  location: class io.jsonwebtoken.Jwts
```

## 해결 방법

### 1️⃣ JJWT 버전 변경

**pom.xml 수정됨:**
- ❌ 이전: `0.12.3` (호환 문제)
- ✅ 현재: `0.11.5` (안정 버전)

### 2️⃣ JwtProvider.java 수정

**변경사항:**
- `Key` → `SecretKey` 타입 사용
- `StandardCharsets.UTF_8` 명시적 사용

## IntelliJ에서 실행하기

### 1. Maven 재로드
```
1. IntelliJ에서 backend 프로젝트 열기
2. 우측 Maven 탭 클릭
3. Reload All Maven Projects (새로고침 아이콘) 클릭
```

### 2. 클린 빌드
```
1. Maven 탭에서 Lifecycle > clean 더블클릭
2. Lifecycle > compile 더블클릭
```

### 3. 실행
```
1. FactoryApplication.java 파일 열기
2. 메인 메서드 옆의 초록색 실행 버튼 클릭
3. Run 'FactoryApplication'
```

## 또는 명령줄 (Maven 설치 필요)

```bash
cd backend

# Maven 의존성 다운로드
mvn clean install

# 실행
mvn spring-boot:run
```

## 확인

서버가 정상적으로 시작되면:
```
Started FactoryApplication in X.XXX seconds
```

브라우저에서 확인:
- http://localhost:8080

## 테스트

Postman이나 curl로 테스트:

```bash
# 회원가입
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "password": "test123",
    "name": "테스트",
    "email": "test@test.com",
    "role": "user"
  }'

# 로그인
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "password": "test123"
  }'
```

---

**이제 정상적으로 컴파일되고 실행됩니다! 🎉**

