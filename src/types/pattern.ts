export interface WeeklyPattern {
  id?: string;
  name: string;
  description?: string;
  user_id: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  days: PatternDay[];
}

export interface PatternDay {
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  time_slots: PatternTimeSlot[];
}

export interface PatternTimeSlot {
  start_time: string;
  end_time: string;
  service_type: string;
  staff_name?: string;
  service_content?: string;
  notes?: string;
}

export interface PatternTemplate {
  id?: string;
  name: string;
  description?: string;
  category: string;
  is_public: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  pattern_data: WeeklyPattern;
}

export interface PatternApplication {
  id?: string;
  pattern_id: string;
  user_id: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'completed';
  applied_by?: string;
  applied_at?: string;
  notes?: string;
}

export interface PatternMatch {
  pattern_id: string;
  pattern_name: string;
  confidence_score: number;
  matching_criteria: string[];
  suggested_modifications?: string[];
}

export interface PatternAnalysis {
  user_id: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  total_records: number;
  pattern_matches: PatternMatch[];
  unmatched_records: number;
  recommendations: string[];
}

export interface PatternValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PatternStatistics {
  pattern_id: string;
  pattern_name: string;
  usage_count: number;
  success_rate: number;
  average_confidence: number;
  last_used: string;
  users_count: number;
}

export interface PatternConflict {
  pattern_id: string;
  conflicting_pattern_id: string;
  conflict_type: 'time_overlap' | 'resource_conflict' | 'logical_conflict';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PatternOptimization {
  pattern_id: string;
  optimization_type: 'time_efficiency' | 'resource_allocation' | 'service_quality';
  current_score: number;
  optimized_score: number;
  suggestions: string[];
  estimated_improvement: string;
}

export interface ServicePattern {
  id?: string;
  name: string;
  pattern_name?: string;
  description?: string;
  user_id: string;
  service_type: string;
  default_duration: number;
  default_staff?: string;
  default_content?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  time_slots: ServiceTimeSlot[];
  pattern_details?: any;
}

export interface ServiceTimeSlot {
  start_time: string;
  end_time: string;
  day_of_week?: number;
  frequency?: 'daily' | 'weekly' | 'monthly';
  notes?: string;
}

export interface PatternDetails {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  usage_count: number;
  success_rate: number;
  last_used?: string;
  time_slots: PatternTimeSlot[];
  statistics?: PatternStatistics;
  conflicts?: PatternConflict[];
  excretion?: {
    toilet_assistance?: boolean;
    diaper_change?: boolean;
    pad_change?: boolean;
  };
  meal?: {
    full_assistance?: boolean;
    completion_status?: string;
    water_intake?: number;
  };
  body_care?: {
    full_body_bath?: boolean;
    body_wipe?: string;
    hair_wash?: boolean;
    oral_care?: boolean;
  };
  medication?: {
    medication_assistance?: boolean;
  };
  life_support?: {
    cleaning?: {
      room_cleaning?: boolean;
    };
    laundry?: {
      washing_drying?: boolean;
    };
    cooking?: {
      general_cooking?: boolean;
    };
  };
}

export interface UserTimePattern {
  id?: string;
  user_id: string;
  user_name?: string;
  pattern_id?: string;
  pattern_name: string;
  description?: string;
  time_slots: UserTimeSlot[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  pattern_details?: any;
}

export interface UserTimeSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  service_type: string;
  staff_name?: string;
  service_content?: string;
  notes?: string;
}