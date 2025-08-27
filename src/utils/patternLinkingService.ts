import { supabase } from '../lib/supabase';
import {
  PatternLinkingCandidate,
  PatternLinkingResult,
  BulkPatternLinking,
  BulkOperationResult,
  UnlinkedDataAnalysis
} from '../types/dailyData';
import { ServicePattern } from '../types/pattern';

export class PatternLinkingService {
  // パターン紐付け候補を取得
  async getPatternLinkingCandidates(recordId: string): Promise<PatternLinkingCandidate[]> {
    try {
      // サンプルデータを返す（実際の実装では機械学習やルールベースの判定を行う）
      return [
        {
          record_id: recordId,
          pattern_id: 'pattern-1',
          pattern_name: '身体介護パターンA',
          confidence_score: 0.85,
          matching_criteria: ['時間帯一致', 'サービス種別一致', 'スタッフ一致']
        },
        {
          record_id: recordId,
          pattern_id: 'pattern-2',
          pattern_name: '生活援助パターンB',
          confidence_score: 0.72,
          matching_criteria: ['時間帯一致', 'サービス種別一致']
        }
      ];
    } catch (error) {
      console.error('パターン紐付け候補取得エラー:', error);
      return [];
    }
  }

  // パターンを記録に紐付け
  async linkPatternToRecord(recordId: string, patternId: string): Promise<PatternLinkingResult> {
    try {
      const { error } = await supabase
        .from('service_records')
        .update({ 
          pattern_id: patternId,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId);

      if (error) throw error;

      return {
        record_id: recordId,
        pattern_id: patternId,
        success: true
      };
    } catch (error) {
      console.error('パターン紐付けエラー:', error);
      return {
        record_id: recordId,
        pattern_id: patternId,
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー'
      };
    }
  }

  // パターンの紐付けを解除
  async unlinkPatternFromRecord(recordId: string): Promise<PatternLinkingResult> {
    try {
      const { error } = await supabase
        .from('service_records')
        .update({ 
          pattern_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId);

      if (error) throw error;

      return {
        record_id: recordId,
        pattern_id: '',
        success: true
      };
    } catch (error) {
      console.error('パターン紐付け解除エラー:', error);
      return {
        record_id: recordId,
        pattern_id: '',
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー'
      };
    }
  }

  // 一括パターン紐付け
  async bulkLinkPatterns(config: BulkPatternLinking): Promise<BulkOperationResult> {
    try {
      let query = supabase.from('service_records').select('*');

      // フィルター条件を適用
      if (config.user_id) {
        query = query.eq('user_id', config.user_id);
      }

      if (config.date_range) {
        query = query
          .gte('date', config.date_range.start_date)
          .lte('date', config.date_range.end_date);
      }

      if (config.service_types && config.service_types.length > 0) {
        query = query.in('service_type', config.service_types);
      }

      // パターンが未紐付けの記録のみ
      query = query.is('pattern_id', null);

      const { data: records, error } = await query;
      if (error) throw error;

      const results: PatternLinkingResult[] = [];
      const errors: string[] = [];

      for (const record of records || []) {
        try {
          const candidates = await this.getPatternLinkingCandidates(record.id);
          const bestCandidate = candidates.find(c => c.confidence_score >= config.auto_link_threshold);

          if (bestCandidate && !config.dry_run) {
            const result = await this.linkPatternToRecord(record.id, bestCandidate.pattern_id);
            results.push(result);
          } else if (bestCandidate) {
            // ドライランの場合
            results.push({
              record_id: record.id,
              pattern_id: bestCandidate.pattern_id,
              success: true
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '不明なエラー';
          errors.push(`記録ID ${record.id}: ${errorMessage}`);
          results.push({
            record_id: record.id,
            pattern_id: '',
            success: false,
            error: errorMessage
          });
        }
      }

      return {
        total_processed: records?.length || 0,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
        errors
      };
    } catch (error) {
      console.error('一括パターン紐付けエラー:', error);
      return {
        total_processed: 0,
        successful: 0,
        failed: 0,
        results: [],
        errors: [error instanceof Error ? error.message : '不明なエラー']
      };
    }
  }

  // 未紐付けデータの分析
  async analyzeUnlinkedData(userId?: string): Promise<UnlinkedDataAnalysis> {
    try {
      let query = supabase
        .from('service_records')
        .select('*')
        .is('pattern_id', null);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: unlinkedRecords, error } = await query;
      if (error) throw error;

      const analysis: UnlinkedDataAnalysis = {
        total_unlinked: unlinkedRecords?.length || 0,
        by_service_type: {},
        by_staff: {},
        by_date_range: {},
        suggestions: []
      };

      // サービス種別別の集計
      unlinkedRecords?.forEach(record => {
        analysis.by_service_type[record.service_type] = 
          (analysis.by_service_type[record.service_type] || 0) + 1;
        
        analysis.by_staff[record.staff_name] = 
          (analysis.by_staff[record.staff_name] || 0) + 1;

        // 月別の集計
        const month = record.date.substring(0, 7); // YYYY-MM
        analysis.by_date_range[month] = 
          (analysis.by_date_range[month] || 0) + 1;
      });

      // 紐付け候補の提案を生成
      for (const record of unlinkedRecords?.slice(0, 10) || []) {
        const candidates = await this.getPatternLinkingCandidates(record.id);
        analysis.suggestions.push(...candidates);
      }

      return analysis;
    } catch (error) {
      console.error('未紐付けデータ分析エラー:', error);
      return {
        total_unlinked: 0,
        by_service_type: {},
        by_staff: {},
        by_date_range: {},
        suggestions: []
      };
    }
  }

  // パターンマッチングのルール評価
  private evaluatePatternMatch(record: any, pattern: ServicePattern): number {
    let score = 0;
    const maxScore = 100;

    // 時間帯の一致度（30点）
    if (this.isTimeMatch(record.start_time, pattern.time_slots)) {
      score += 30;
    }

    // サービス種別の一致度（25点）
    if (record.service_type === pattern.service_type) {
      score += 25;
    }

    // スタッフの一致度（20点）
    if (record.staff_name === pattern.default_staff) {
      score += 20;
    }

    // サービス内容の類似度（15点）
    if (this.isContentSimilar(record.service_content, pattern.default_content)) {
      score += 15;
    }

    // 曜日の一致度（10点）
    if (this.isDayOfWeekMatch(record.date, pattern.time_slots)) {
      score += 10;
    }

    return score / maxScore;
  }

  private isTimeMatch(recordTime: string, timeSlots: any[]): boolean {
    // 時間帯マッチングのロジック
    return timeSlots.some(slot => {
      const recordHour = parseInt(recordTime.split(':')[0]);
      const slotStartHour = parseInt(slot.start_time.split(':')[0]);
      const slotEndHour = parseInt(slot.end_time.split(':')[0]);
      return recordHour >= slotStartHour && recordHour < slotEndHour;
    });
  }

  private isContentSimilar(content1?: string, content2?: string): boolean {
    if (!content1 || !content2) return false;
    // 簡単な類似度判定（実際にはより高度なアルゴリズムを使用）
    const words1 = content1.split(/\s+/);
    const words2 = content2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length) > 0.3;
  }

  private isDayOfWeekMatch(date: string, timeSlots: any[]): boolean {
    const dayOfWeek = new Date(date).getDay();
    return timeSlots.some(slot => slot.day_of_week === dayOfWeek);
  }

  // 設定を取得
  getConfig() {
    return {
      auto_pattern_linking: true,
      pattern_confidence_threshold: 0.7,
      bulk_operation_batch_size: 100,
      enable_data_validation: true,
      default_time_slot_duration: 60,
      show_advanced_filters: false,
      display: {
        show_confidence_scores: true,
        highlight_unlinked: true
      }
    };
  }

  // パターンを記録に紐付け（レガシーメソッド名）
  async linkPattern(recordId: string, patternId: string, method: string = 'manual'): Promise<PatternLinkingResult> {
    return this.linkPatternToRecord(recordId, patternId);
  }

  // パターンの紐付けを解除（レガシーメソッド名）
  async unlinkPattern(recordId: string): Promise<PatternLinkingResult> {
    return this.unlinkPatternFromRecord(recordId);
  }

  // 自動パターン紐付け（レガシーメソッド名）
  async autoLinkPatterns(records: any[]): Promise<BulkOperationResult> {
    const config: BulkPatternLinking = {
      auto_link_threshold: 0.7,
      dry_run: false
    };
    return this.bulkLinkPatterns(config);
  }

  // パターン候補を取得（レガシーメソッド名）
  async getPatternCandidates(record: any): Promise<PatternLinkingCandidate[]> {
    return this.getPatternLinkingCandidates(record.id);
  }
}

export const patternLinkingService = new PatternLinkingService();