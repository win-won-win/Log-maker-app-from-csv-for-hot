export interface DailyData {
  id?: string;
  user_id: string;
  date: string;
  service_type: string;
  start_time: string;
  end_time: string;
  staff_name: string;
  service_content: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRecord {
  id?: string;
  user_id: string;
  date: string;
  service_type: string;
  start_time: string;
  end_time: string;
  staff_name: string;
  service_content: string;
  notes?: string;
  print_datetime?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  kana_name?: string;
  birth_date?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  care_level?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id: string;
  name: string;
  kana_name?: string;
  position?: string;
  phone?: string;
  email?: string;
  hire_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MonthlyData {
  user_id: string;
  year: number;
  month: number;
  records: DailyData[];
  total_hours: number;
  total_days: number;
}

export interface PrintData {
  user: User;
  records: ServiceRecord[];
  month: number;
  year: number;
  total_hours: number;
  total_days: number;
}

export interface HealthBaseline {
  id?: string;
  user_id: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  pulse?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  notes?: string;
  measured_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  default_duration?: number;
  color?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Schedule {
  id?: string;
  user_id: string;
  staff_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BulkPrintRequest {
  user_ids: string[];
  year: number;
  month: number;
  include_notes: boolean;
  format: 'pdf' | 'html';
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ImportResult {
  success: boolean;
  imported_count: number;
  error_count: number;
  errors: ValidationError[];
  warnings: string[];
}

export interface TimeSlotRecord {
  id?: string;
  user_id: string;
  user_name?: string;
  user_code?: string;
  date: string;
  hour: number;
  service_type: string;
  start_time: string;
  end_time: string;
  staff_name: string;
  service_content: string;
  notes?: string;
  pattern_id?: string;
  pattern_name?: string;
  is_pattern_assigned?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TimeSlot {
  hour: number;
  time_label?: string;
  records: TimeSlotRecord[];
  total_records: number;
  total_duration: number;
  assigned_records?: number;
  unassigned_records?: number;
  status?: 'complete' | 'partial' | 'empty';
}

export interface DailyDataDetail {
  date: string;
  user_id: string;
  day_of_week?: number;
  time_slots: TimeSlot[];
  total_records: number;
  total_duration: number;
  unique_staff: string[];
  service_types: string[];
  assigned_records?: number;
  unassigned_records?: number;
  completion_rate?: number;
  users?: string[];
  staff?: string[];
  patterns_used?: string[];
  status?: 'complete' | 'partial' | 'empty';
}

export interface DailyDataStats {
  date?: string;
  total_records: number;
  total_duration: number;
  unique_users: number;
  unique_staff: number;
  assigned_records?: number;
  unassigned_records?: number;
  completion_rate?: number;
  unique_patterns?: number;
  service_type_distribution: { [key: string]: number };
  pattern_distribution: { pattern_id: string; pattern_name: string; count: number }[];
  hourly_distribution: { hour: number; count: number }[];
  peak_hour: number;
  average_duration: number;
}

export interface PatternLinkingCandidate {
  record_id: string;
  pattern_id: string;
  pattern_name: string;
  confidence_score: number;
  matching_criteria: string[];
}

export interface PatternLinkingResult {
  record_id: string;
  pattern_id: string;
  success: boolean;
  error?: string;
  error_message?: string;
}

export interface BulkPatternLinking {
  user_id?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
  service_types?: string[];
  auto_link_threshold: number;
  dry_run: boolean;
}

export interface BulkOperationResult {
  total_processed: number;
  successful: number;
  failed: number;
  results: PatternLinkingResult[];
  errors: string[];
}

export interface UnlinkedDataAnalysis {
  total_unlinked: number;
  by_service_type: { [key: string]: number };
  by_staff: { [key: string]: number };
  by_date_range: { [key: string]: number };
  suggestions: PatternLinkingCandidate[];
  analysis?: UnlinkedDataAnalysis;
}

export interface DailyDataFilter {
  user_id?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
  service_types?: string[];
  staff_names?: string[];
  pattern_linked?: boolean;
  time_range?: {
    start_hour: number;
    end_hour: number;
  };
  status?: 'all' | 'assigned' | 'unassigned';
}

export interface DailyDataManagementConfig {
  auto_pattern_linking: boolean;
  pattern_confidence_threshold: number;
  bulk_operation_batch_size: number;
  enable_data_validation: boolean;
  default_time_slot_duration: number;
  show_advanced_filters: boolean;
  display?: {
    show_confidence_scores: boolean;
    highlight_unlinked: boolean;
  };
}