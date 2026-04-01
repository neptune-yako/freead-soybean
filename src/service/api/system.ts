import { request } from '../request';

/**
 * 后端活跃状态检查
 * 对应接口: /api/health
 */
export function fetchHealthCheck() {
  return request<string>({ url: '/health' });
}
