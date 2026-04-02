declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      access_token: string;
      token_type: string;
      refreshToken: string; // 后续可能扩展的功能
    }

    interface UserInfo {
      id: number;
      username: string;
      full_name: string;
      role_code: string;
      roles: string[];
      buttons: string[];
      is_active: boolean;
      created_at: string;
    }
  }
}
