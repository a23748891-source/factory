-- notifications 테이블의 'read' 컬럼을 'is_read'로 변경
-- MySQL 예약어 문제 해결

-- 기존 테이블이 있는 경우 컬럼명 변경
ALTER TABLE notifications CHANGE COLUMN `read` is_read BOOLEAN NOT NULL DEFAULT FALSE;

-- 인덱스 재생성
DROP INDEX IF EXISTS idx_read ON notifications;
CREATE INDEX idx_read ON notifications(is_read);

