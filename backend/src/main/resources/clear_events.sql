-- 이벤트 로그 초기화 스크립트
-- 주의: 이 스크립트는 모든 이벤트 데이터를 삭제합니다!

-- 이벤트 테이블의 모든 데이터 삭제
DELETE FROM events;

-- AUTO_INCREMENT 값 초기화 (선택사항)
ALTER TABLE events AUTO_INCREMENT = 1;

-- 확인 메시지
SELECT '이벤트 로그가 초기화되었습니다.' AS message;

