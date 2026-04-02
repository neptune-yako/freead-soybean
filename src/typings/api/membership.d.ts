declare namespace Api {
  /** 会员等级模块 */
  namespace Membership {
    /** 权益配额配置 (quota_config) */
    interface QuotaConfig {
      /** 单次最大排版字数 */
      max_words_count: number;
      /** 每日 Token 使用上限 */
      daily_tokens_limit: number;
      /** 每日 OCR/上传次数 */
      daily_upload_count: number;
      /** 单个文件最大 MB */
      max_file_size_mb: number;
      /** 永久书架容量 */
      bookshelf_capacity: number;
      /** 是否允许使用书架功能 */
      bookshelf_enabled: boolean;
      /** 预留扩展字段 */
      [key: string]: any;
    }

    /** 会员等级详情数据 */
    interface MemberTier {
      id: number;
      /** 内部代码，如 free, pro, prime */
      tier_code: string;
      /** 展示名称，如 黄金会员 */
      name: string;
      /** 权益配额 JSON 配置 */
      quota_config: QuotaConfig;
      /** 是否为新用户注册后的默认等级 */
      is_default: boolean;
      /** 等级权重（数字越大代表等级越高） */
      weight: number;
      /** 备注 */
      remark?: string;
      /** 创建时间 */
      created_at: string;
    }

    /** 创建会员等级 */
    interface TierCreate {
      tier_code: string;
      name: string;
      quota_config: QuotaConfig;
      is_default?: boolean;
      weight: number;
      remark?: string;
    }

    /** 更新会员等级 (支持局部更新) */
    interface TierUpdate {
      tier_code?: string;
      name?: string;
      quota_config?: Partial<QuotaConfig>;
      is_default?: boolean;
      weight?: number;
      remark?: string;
    }

    /** 会员套餐详情数据 */
    interface MembershipPlan {
      id: number;
      /** 关联的会员等级 ID */
      tier_id: number;
      /** 后端视图已通过关联查询自动带出等级代码 */
      tier_code: string;
      /** 销售名称（如：30 天专业版月卡） */
      name: string;
      /** 价格（单位：分，100 = 1.00 元） */
      price_cents: number;
      /** 有天数（如 30, 365） */
      duration_days: number;
      /** 是否上架可见 */
      is_active: boolean;
      /** 排序权重 */
      sort_order: number;
      /** 创建时间 */
      created_at: string;
      /** 更新时间 */
      updated_at: string;
    }

    /** 套餐搜索参数 */
    interface PlanSearchParams {
      /** 是否仅查询上架中的套餐 */
      only_active?: boolean;
    }

    /** 创建/更新套餐请求 */
    interface PlanRequest {
      tier_id: number;
      name: string;
      price_cents: number;
      duration_days: number;
      is_active?: boolean;
      sort_order?: number;
    }

    /** 手动发放订阅请求 */
    interface ManualSubscriptionCreate {
      user_id: number;
      tier_code: 'pro' | 'primeAI';
      days: number;
    }

    /** 订阅详情数据 (SubscriptionDTO) */
    interface SubscriptionInfo {
      id: number;
      /** 用户唯一 ID */
      user_id: number;
      /** 当前生效等级代码 */
      tier_code: string;
      /** 会员生效开始时间 */
      start_time: string;
      /** 会员到期时间 */
      expire_time: string;
      /** 状态 (active/expired) */
      status: 'active' | 'expired';
    }
  }
}
