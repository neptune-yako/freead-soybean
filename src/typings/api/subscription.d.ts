declare namespace Api {
  namespace Subscription {
    /** 订阅状态类型 */
    type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

    /** 订阅列表查询参数 */
    interface SubscriptionListFilter {
      /** 页码 */
      page?: number;
      /** 每页数量 */
      size?: number;
      /** 按用户 ID 精确筛选 */
      user_id?: number;
      /** 会员等级代码 (如 pro, free) */
      tier_code?: string;
      /** 状态筛选 */
      status?: SubscriptionStatus;
    }

    /** 订阅管理详情/列表项 (SubscriptionAdminDTO) */
    interface SubscriptionAdminInfo {
      /** 记录 ID */
      id: number;
      /** 关联用户 ID */
      user_id: number;
      /** 等级代码 */
      tier_code: string;
      /** 生效起始时间 (ISO 格式) */
      start_time: string;
      /** 到期时间 (ISO 格式) */
      expire_time: string;
      /** 订阅状态 */
      status: SubscriptionStatus;
      /** 记录创建时间 (订购/领取时间) */
      created_at: string;
    }

    /** 订阅分页列表数据结构 */
    interface SubscriptionPaginationData {
      items: SubscriptionAdminInfo[];
      total: number;
      page: number;
      size: number;
    }
  }
}
