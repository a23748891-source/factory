-- 이벤트 로그와 알림 로그 초기화
-- 주의: 이 스크립트는 모든 이벤트와 알림 데이터를 삭제합니다!

-- Safe update mode 우회를 위해 WHERE 절 추가
-- 이벤트 테이블의 모든 데이터 삭제
DELETE FROM events WHERE id > 0;

-- 알림 테이블의 모든 데이터 삭제
DELETE FROM notifications WHERE id > 0;

-- AUTO_INCREMENT 값 초기화 (선택사항)
ALTER TABLE events AUTO_INCREMENT = 1;
ALTER TABLE notifications AUTO_INCREMENT = 1;

-- 확인
SELECT '이벤트와 알림 로그가 초기화되었습니다.' AS message;

