import { adminRequest } from '../request';

/**
 * 登录
 *
 * @param username 用户名
 * @param password 密码
 */
export function fetchLogin(username: string, password: string) {
  return adminRequest<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  });
}

/** 获取用户信息 */
export function fetchGetUserInfo() {
  return adminRequest<Api.Auth.UserInfo>({ url: '/auth/me' });
}

/**
 * 刷新 Token
 *
 * @param refreshToken 刷新令牌
 */
export function fetchRefreshToken(refreshToken: string) {
  return adminRequest<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * 返回自定义后端错误
 *
 * @param code 错误码
 * @param msg 错误消息
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return adminRequest({ url: '/auth/error', params: { code, msg } });
}
