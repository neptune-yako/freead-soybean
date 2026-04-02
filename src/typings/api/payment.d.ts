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

    /** 营收查询参数 */
    interface TrendSearchParams {
      /** 回溯天数 (默认 7) */
      days?: number;
    }

    /** 补单请求 */
    interface ManualGrantRequest {
      /** 系统内部订单号 */
      order_id: string;
      /** 补单备注 */
      remark: string;
    }
  }
}
