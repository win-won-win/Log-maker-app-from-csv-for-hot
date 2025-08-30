-- csv_service_recordsテーブルにrecord_created_atとprint_datetimeカラムを追加
ALTER TABLE public.csv_service_records 
ADD COLUMN IF NOT EXISTS record_created_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.csv_service_records 
ADD COLUMN IF NOT EXISTS print_datetime TIMESTAMP WITH TIME ZONE;

-- コメントを追加
COMMENT ON COLUMN csv_service_records.record_created_at IS '記録作成日時 - サービス記録が作成された時刻';
COMMENT ON COLUMN csv_service_records.print_datetime IS '印刷日時 - 印刷ボタンが押された時刻を記録';

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_csv_service_records_record_created_at ON csv_service_records(record_created_at);
CREATE INDEX IF NOT EXISTS idx_csv_service_records_print_datetime ON csv_service_records(print_datetime);

-- 既存のレコードにはcreated_atの値をコピー
UPDATE csv_service_records 
SET record_created_at = created_at 
WHERE record_created_at IS NULL;