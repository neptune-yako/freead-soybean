import { adminRequest } from '../request';

/**
 * 今日配额消耗实时统计 (实时大数)
 *
 * @description 从 Redis 实时获取今日截止到目前的统计数据
 */
export function fetchGetTodayQuotaStats() {
  return adminRequest<Api.Quota.GlobalQuotaStat>({
    url: '/quota/stats',
    method: 'get'
  });
}

/**
 * 全站配额消耗历史趋势 (图表专用)
 *
 * @param params 分页/回溯参数 (days)
 */
export function fetchGetQuotaTrends(params?: Api.Quota.TrendSearchParams) {
  return adminRequest<Api.Quota.QuotaTrendResponse>({
    url: '/quota/trends',
    method: 'get',
    params
  });
}

/**
 * 查阅指定用户的今日配额详情 (审计专用)
 *
 * @param user_id 用户ID
 */
export function fetchGetUserQuotaDetail(user_id: number) {
  return adminRequest<Api.Quota.UserQuotaDetail>({
    url: `/quota/users/${user_id}`,
    method: 'get'
  });
}
