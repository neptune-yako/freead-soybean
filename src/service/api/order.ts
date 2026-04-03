import { adminRequest } from '../request';

/**
 * 获取订单分页列表
 *
 * @param params 搜索与分页参数
 */
export function fetchGetOrderList(params?: Api.Order.OrderListFilter) {
  return adminRequest<Api.Order.OrderPaginationData>({
    url: '/order/list',
    method: 'get',
    params
  });
}

/**
 * 获取订单技术详情 (审计专用)
 *
 * @description 包含微信回调原始报文等详细信息，用于故障排查
 * @param order_id 业务订单号 (ULID)
 */
export function fetchGetOrderDetail(order_id: string) {
  return adminRequest<Api.Order.AdminOrderDetail>({
    url: `/order/${order_id}`,
    method: 'get'
  });
}
