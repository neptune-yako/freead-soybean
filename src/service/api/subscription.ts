import { adminRequest } from '../request';

/**
 * 获取订阅记录分页列表
 *
 * @param params 搜索与分页参数
 */
export function fetchGetSubscriptionList(params?: Api.Subscription.SubscriptionListFilter) {
  return adminRequest<Api.Subscription.SubscriptionPaginationData>({
    url: '/v1/subscription/list',
    method: 'get',
    params
  });
}
