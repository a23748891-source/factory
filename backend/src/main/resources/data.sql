-- Factory System Sample Data
-- 주의: 프로덕션 환경에서는 이 파일을 사용하지 마세요!

-- 기본 관리자 계정 (비밀번호: admin123)
-- 실제 사용 시 비밀번호를 해시화하여 저장해야 합니다.
INSERT IGNORE INTO users (user_id, password, name, email, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', '관리자', 'admin@factory.com', 'admin'),
('user1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', '사용자1', 'user1@factory.com', 'user'),
('user2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', '사용자2', 'user2@factory.com', 'user');

-- 알림 설정 초기화 (모든 사용자)
INSERT IGNORE INTO notification_settings (user_id, emergency_enabled, emergency_sound_enabled) VALUES
('admin', TRUE, TRUE),
('user1', TRUE, TRUE),
('user2', TRUE, TRUE);

-- 샘플 이벤트 데이터 (선택사항)
-- INSERT INTO events (zone, area, type, message, severity) VALUES
-- ('A동 1층', '프레스 구역', 'emergency', '위험 소리 감지 (클래스: 1, 확률: 85.5%)', 'high'),
-- ('B동 2층', '용접 구역', 'noise', '소음 수준 초과 감지', 'medium'),
-- ('C동 3층', '조립 구역', 'voice', '음성 인식 이벤트', 'low');

