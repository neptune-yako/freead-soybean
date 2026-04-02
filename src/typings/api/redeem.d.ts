declare namespace Api {
  /** 兑换码管理模块 */
  namespace Redeem {
    /** 兑换码数据项 */
    interface RedeemCode {
      id: number;
      code_string: string;
      plan_id: number;
      /** 套餐显示名称 */
      plan_name: string;
      valid_from: string;
      valid_until: string;
      /** 最大可用次数 (0为不限) */
      max_uses: number;
      /** 已兑换次数 */
      current_uses: number;
      is_active: boolean;
    }

    /** 列表查询参数 */
    interface CodeSearchParams {
      skip?: number;
      limit?: number;
      is_active?: boolean;
      plan_id?: number;
    }

    /** 创建/更新兑换码请求 */
    interface CodeRequest {
      code_string: string;
      plan_id: number;
      valid_from?: string;
      valid_until: string;
      max_uses?: number;
      is_active?: boolean;
    }

    /** 兑换流水记录 */
    interface RedeemRecord {
      id: number;
      user_id: number;
      code_id: number;
      code_string: string;
      redeemed_at: string;
    }

    /** 流水查询参数 */
    interface RecordSearchParams {
      skip?: number;
      limit?: number;
      user_id?: number;
      code_id?: number;
    }
  }
}
