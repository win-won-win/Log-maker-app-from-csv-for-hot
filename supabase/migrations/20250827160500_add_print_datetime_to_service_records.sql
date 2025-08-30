-- Add print_datetime column to service_records table (if not exists)
ALTER TABLE service_records
ADD COLUMN IF NOT EXISTS print_datetime TIMESTAMPTZ NULL;

-- Add record_created_at column to service_records table
ALTER TABLE service_records
ADD COLUMN IF NOT EXISTS record_created_at TIMESTAMPTZ NULL;

-- Add comments to the columns
COMMENT ON COLUMN service_records.print_datetime IS '印刷日時 - 印刷ボタンが押された時刻を記録';
COMMENT ON COLUMN service_records.record_created_at IS '記録作成日時 - サービス記録が作成された時刻';

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_service_records_print_datetime ON service_records(print_datetime);
CREATE INDEX IF NOT EXISTS idx_service_records_record_created_at ON service_records(record_created_at);

-- 既存のレコードにはcreated_atの値をコピー
UPDATE service_records
SET record_created_at = created_at
WHERE record_created_at IS NULL;