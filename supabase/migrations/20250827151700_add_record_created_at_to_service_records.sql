-- service_recordsテーブルにrecord_created_atカラムを追加
ALTER TABLE public.service_records 
ADD COLUMN IF NOT EXISTS record_created_at TIMESTAMP WITH TIME ZONE;

-- 既存のレコードにはcreated_atの値をコピー
UPDATE public.service_records 
SET record_created_at = created_at 
WHERE record_created_at IS NULL;