declare namespace Api {
  namespace Order {
    /** 
     * 订单状态 
     * - pending: 待支付
     * - paid: 已支付
     * - failed: 支付失败
     * - closed: 已关闭/已取消
     * - refunded: 已退款
     * - pending_error_recovery: 异常待恢复
     */
    type OrderStatus = 'pending' | 'paid' | 'failed' | 'closed' | 'refunded' | 'pending_error_recovery';

    /** 订单列表查询参数 */
    interface OrderListFilter {
      /** 页码 */
      page?: number;
      /** 每页数量 */
      size?: number;
      /** 业务订单号 (ULID) */
      order_id?: string;
      /** 用户 ID */
      user_id?: number;
      /** 订单状态 */
      status?: OrderStatus;
    }

    /** 订单列表基础模型 (AdminOrderDTO) */
    interface AdminOrderInfo {
      /** 业务订单号 */
      id: string;
      /** 用户 ID */
      user_id: number;
      /** 套餐名称 */
      plan_name: string;
      /** 支付金额 (单位：分) */
      amount_fen: number;
      /** 状态码 */
      status: OrderStatus;
      /** 微信支付单号 */
      transaction_id: string | null;
      /** 下单时间 */
      created_at: string;
      /** 支付成功时间 */
      paid_at: string | null;
    }

    /** 订单审计详情 (AdminOrderDetailDTO) */
    interface AdminOrderDetail extends AdminOrderInfo {
      /** 发起支付的 IP */
      client_ip: string | null;
      /** 微信回调原始 JSON 报文 */
      notify_raw_data: Record<string, any> | null;
    }

    /** 订单分页列表数据结构 */
    interface OrderPaginationData {
      items: AdminOrderInfo[];
      total: number;
      page: number;
      size: number;
    }
  }
}
