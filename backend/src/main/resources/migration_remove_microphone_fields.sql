-- 마이크 설정 테이블에서 불필요한 필드 제거 마이그레이션
-- 실행 전 백업 권장

-- enabled, mode, schedule_start, schedule_end 컬럼 제거
ALTER TABLE microphone_settings 
    DROP COLUMN IF EXISTS enabled,
    DROP COLUMN IF EXISTS mode,
    DROP COLUMN IF EXISTS schedule_start,
    DROP COLUMN IF EXISTS schedule_end;

