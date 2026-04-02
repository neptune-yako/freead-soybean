declare namespace Api {
  /** 财务与订单模块 */
  namespace Payment {
    /** 每日营收快照 */
    interface DailyStat {
      /** 统计日期 (YYYY-MM-DD) */
      date: string;
      /** 当期总收入（单位：分） */
      total_amount_fen: number;
      /** 成交订单量 */
      paid_order_count: number;
    }

    /** 营收趋势聚合响应 */
    interface TrendResponse {
      /** 周期内总营收（累加值，单位：分） */
      total_revenue_fen: number;
      /** 周期内总成交笔数（累加值） */
      total_order_count: number;
      /** 每日走势明细列表 */
      items: DailyStat[];
    }

    /** 营收查询参数 */
    interface TrendSearchParams {
      /** 回溯天数 (默认 7) */
      days?: number;
    }

    /** 补单请求 */
    interface ManualGrantRequest {
      /** 外部交易号 (微信单号/商户单号) */
      out_trade_no: string;
      /** 补单备注 */
      remark?: string;
      /** 强制覆盖的目标等级 (如 pro) */
      override_tier_code?: string;
      /** 强制覆盖的天数 */
      override_plan_days?: number;
    }
  }
}
