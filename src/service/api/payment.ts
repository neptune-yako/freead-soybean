import { adminRequest } from '../request';

/**
 * 获取营收趋势数据 (图表专用)
 *
 * @param params 查询参数 (days)
 */
export function fetchGetRevenueTrends(params?: Api.Payment.TrendSearchParams) {
  return adminRequest<Api.Payment.DailyStat[]>({
    url: '/payment/trends',
    method: 'get',
    params
  });
}

/**
 * 手动触发财务日结 (快照持久化)
 *
 * @description 立即根据当前订单表快照一份最新的财务统计记录
 */
export function fetchTriggerRevenuePersist() {
  return adminRequest<boolean>({
    url: '/payment/persist',
    method: 'post'
  });
}

/**
 * 人工强制补单 (Manual Grant)
 *
 * @param data 补单参数 (order_id, remark)
 */
export function fetchManualGrantOrder(data: Api.Payment.ManualGrantRequest) {
  return adminRequest<boolean>({
    url: '/payment/orders/manual-grant',
    method: 'post',
    data
  });
}

/**
 * 异常订单归档 (Archive)
 *
 * @description 强制将待支付或状态异常的订单标记为已失效
 */
export function fetchArchiveOrders() {
  return adminRequest<boolean>({
    url: '/payment/orders/archive',
    method: 'post'
  });
}
