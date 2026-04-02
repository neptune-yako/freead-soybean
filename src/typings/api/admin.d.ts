declare namespace Api {
  /** 管理员模块 */
  namespace Admin {
    /** 管理员角色枚举 */
    type AdminRole = 'super_admin' | 'operator';

    /** 管理员简况 */
    interface AdminProfile {
      id: number;
      username: string;
      full_name: string;
      role_code: AdminRole;
      is_active: boolean;
      created_at: string;
    }

    /** 管理员搜索参数 */
    interface AdminSearchParams {
      page?: number;
      size?: number;
      username?: string;
      full_name?: string;
    }

    /** 创建管理员 */
    interface AdminCreate {
      username: string;
      password: string;
      full_name: string;
      role_code?: AdminRole;
      is_active?: boolean;
    }

    /** 更新管理员 */
    interface AdminUpdate {
      password?: string;
      full_name?: string;
      role_code?: AdminRole;
      is_active?: boolean;
    }

    /** 分页包装器 */
    interface PaginationData<T> {
      items: T[];
      total: number;
      page: number;
      size: number;
    }
  }
}
