# 데이터베이스 설정 가이드

## 데이터베이스 생성

### 1. MySQL 접속
```bash
mysql -u root -p
```

### 2. 데이터베이스 생성
```sql
CREATE DATABASE IF NOT EXISTS factory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE factory;
```

### 3. 스키마 실행
```bash
# 방법 1: MySQL 클라이언트에서 직접 실행
mysql -u root -p factory < src/main/resources/schema.sql

# 방법 2: MySQL 클라이언트 내에서
source src/main/resources/schema.sql;
```

## 자동 테이블 생성 (JPA)

현재 `application.yml`에서 `ddl-auto: update`로 설정되어 있어서, 
Spring Boot 애플리케이션을 실행하면 자동으로 테이블이 생성됩니다.

### 설정 확인
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # create, update, validate, none
```

- `create`: 시작 시 모든 테이블 삭제 후 재생성 (개발용)
- `update`: 기존 테이블 유지, 변경사항만 반영 (권장)
- `validate`: 스키마 검증만 수행
- `none`: 자동 생성 비활성화

## 테이블 구조

### 1. users (사용자)
- `user_id`: 사용자 ID (PK)
- `password`: 암호화된 비밀번호
- `name`: 이름
- `email`: 이메일 (UNIQUE)
- `role`: 역할 (user, admin)

### 2. notifications (알림)
- `id`: 알림 ID (PK, AUTO_INCREMENT)
- `user_id`: 사용자 ID (FK)
- `type`: 알림 유형 (emergency, noise, voice, system)
- `title`: 제목
- `message`: 메시지
- `priority`: 우선순위 (high, medium, low)
- `read`: 읽음 여부
- `created_at`: 생성 시간

### 3. events (이벤트 로그)
- `id`: 이벤트 ID (PK, AUTO_INCREMENT)
- `zone`: 구역 (예: A동 1층)
- `area`: 세부 구역 (예: 프레스 구역)
- `type`: 이벤트 유형 (emergency, noise, voice)
- `message`: 메시지
- `severity`: 심각도 (high, medium, low)
- `audio_file_path`: 오디오 파일 경로 (선택사항)
- `created_at`: 생성 시간

### 4. notification_settings (알림 설정)
- `id`: 설정 ID (PK, AUTO_INCREMENT)
- `user_id`: 사용자 ID (FK, UNIQUE)
- `emergency_enabled`: 비상 상황 알림 활성화
- `emergency_sound_enabled`: 비상 상황 경고 소리 활성화
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

### 5. microphone_settings (마이크 설정)
- `id`: 설정 ID (PK, AUTO_INCREMENT)
- `user_id`: 사용자 ID (FK)
- `enabled`: 마이크 활성화 여부
- `mode`: 모드 (always, scheduled)
- `schedule_start`: 스케줄 시작 시간 (HH:mm)
- `schedule_end`: 스케줄 종료 시간 (HH:mm)
- `input_device`: 입력 장치
- `output_device`: 출력 장치
- `input_volume`: 입력 볼륨 (0-100)
- `output_volume`: 출력 볼륨 (0-100)
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

## 샘플 데이터 삽입 (선택사항)

```bash
mysql -u root -p factory < src/main/resources/data.sql
```

**주의**: `data.sql`의 비밀번호는 예시입니다. 실제 사용 시에는 
Spring Security의 PasswordEncoder로 해시화된 비밀번호를 사용해야 합니다.

## 인덱스

모든 테이블에 적절한 인덱스가 설정되어 있습니다:
- 외래키 컬럼
- 자주 조회되는 컬럼 (created_at, type, priority 등)
- 검색에 사용되는 컬럼

## 백업 및 복원

### 백업
```bash
mysqldump -u root -p factory > factory_backup.sql
```

### 복원
```bash
mysql -u root -p factory < factory_backup.sql
```

## 문제 해결

### 테이블이 생성되지 않는 경우
1. MySQL 서버가 실행 중인지 확인
2. `application.yml`의 데이터베이스 연결 정보 확인
3. 데이터베이스가 존재하는지 확인
4. 사용자 권한 확인

### 외래키 제약 조건 오류
- `ON DELETE CASCADE`로 설정되어 있어서, 사용자 삭제 시 관련 데이터도 함께 삭제됩니다.
- 필요시 `ON DELETE SET NULL` 또는 `ON DELETE RESTRICT`로 변경 가능합니다.

