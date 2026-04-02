declare namespace Api {
  /** 配额统计与监控模块 */
  namespace Quota {
    /** 全站配额快照 (今日或历史) */
    interface GlobalQuotaStat {
      /** 统计日期 (YYYY-MM-DD) */
      date: string;
      /** 今日全站 OCR / 图片识别总次数 */
      total_daily_upload_count: number;
      /** 今日全站累计消耗 Token 总数 */
      total_tokens_count: number;
      /** 今日活跃用户总数 (DAU) */
      total_active_users: number;
    }

    /** 全站配额趋势聚合响应 */
    interface QuotaTrendResponse {
      /** 期间内累计全站上传总数 */
      period_total_upload: number;
      /** 期间内累计全站消耗 Token 总数 */
      period_total_tokens: number;
      /** 期间内累计全站活跃人次 (DAU 之和) */
      period_total_active_users: number;
      /** 每日详细消耗快照列表 */
      items: GlobalQuotaStat[];
    }

    /** 趋势查询条件 */
    interface TrendSearchParams {
      /** 回溯天数 (默认 7) */
      days?: number;
    }

    /** 用户配额审计详情 */
    interface UserQuotaDetail {
      user_id: number;
      /** 当前等级 (如 free, pro) */
      tier_code: string;
      /** 详细权益配置 */
      quota_config: any;
      /** 今日消耗明细 (Map 结构) */
      daily_usage: Record<string, number>;
    }
  }
}
