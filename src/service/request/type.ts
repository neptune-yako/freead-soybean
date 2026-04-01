export interface RequestInstanceState {
  /** 刷新 Token 的 Promise */
  refreshTokenPromise: Promise<boolean> | null;
  /** 请求错误消息栈 */
  errMsgStack: string[];
  [key: string]: unknown;
}
