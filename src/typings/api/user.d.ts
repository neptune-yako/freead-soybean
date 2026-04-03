declare namespace Api {
  namespace User {
    /** 会员等级枚举 */
    type MemberLevel = 'free' | 'vip' | 'svip';

    /** 用户列表查询参数 */
    interface UserListFilter {
      /** 页码 */
      page?: number;
      /** 每页数量 */
      size?: number;
      /** 用户昵称 (模糊匹配) */
      nickname?: string;
      /** 会员等级 */
      member_level?: MemberLevel;
    }

    /** 用户管理详情视图 (UserAdminDTO) */
    interface UserAdminInfo {
      /** 用户 ID */
      id: number;
      /** 微信唯一标识 */
      openid: string;
      /** 昵称 */
      nickname: string | null;
      /** 头像地址 */
      avatar_url: string | null;
      /** 会员等级 */
      member_level: MemberLevel;
      /** 会员到期时间 (ISO 格式) */
      member_expire_at: string | null;
      /** 注册时间 */
      created_at: string;
    }

    /** 用户分页列表数据结构 */
    interface UserPaginationData {
      items: UserAdminInfo[];
      total: number;
      page: number;
      size: number;
    }
  }
}
