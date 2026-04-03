# 订单记录管理模块 API 对接手册 (Order Management)

本模块用于在管理中台监控系统所有支付流水，支持详尽的财务审计与技术排错。

基础路径前缀: `/api/v1/admin/order`  
所有接口均需在 Header 中携带 `Authorization: Bearer <token>` (管理员 Token)。

---

## 1. 接口定义 (Endpoints)

### 1.1 获取订单分页列表
- **路径**: `/list`
- **方法**: `GET`
- **说明**: 检索系统全量支付订单。
- **查询参数 (Query):**
  | 字段名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `page` | `number` | 否 | 页码，默认 1 |
  | `size` | `number` | 否 | 每页数量，默认 20 |
  | `order_id` | `string` | 否 | 业务订单号 (ULID) |
  | `user_id` | `number` | 否 | 用户 ID |
  | `status` | `enum` | 否 | 状态: `pending`, `paid`, `failed`, `closed`, `refunded` 等 |

---

### 1.2 获取订单技术详情
- **路径**: `/{order_id}`
- **方法**: `GET`
- **说明**: 获取订单的完整镜像，包含微信回调原始报文，用于排查订单未到账等异常。
- **路径参数:**
  | 参数名 | 类型 | 说明 |
  | :--- | :--- | :--- |
  | `order_id` | `string` | 业务订单号 (ULID) |

---

## 2. 核心数据结构 (Data Models)

### A. 订单基础模型 (AdminOrderDTO)
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | `string` | 业务订单号 |
| `user_id` | `number` | 用户 ID |
| `plan_name` | `string` | 套餐名称 |
| `amount_fen` | `number` | **支付金额 (分)** |
| `status` | `string` | 状态码 |
| `transaction_id` | `string` | 微信支付单号 |
| `created_at` | `string(datetime)` | 下单时间 |
| `paid_at` | `string(datetime)` | 支付成功时间 |

### B. 订单审计详情 (AdminOrderDetailDTO)
*继承自 AdminOrderDTO，额外包含：*
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `client_ip` | `string` | 发起支付的 IP |
| `notify_raw_data` | `object` | **微信回调原始 JSON 报文** |

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 订单状态 */
type OrderStatus = 'pending' | 'paid' | 'failed' | 'closed' | 'refunded' | 'pending_error_recovery';

/** 订单列表项 */
interface AdminOrderInfo {
  id: string;
  user_id: number;
  plan_name: string;
  amount_fen: number;
  status: OrderStatus;
  transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
}

/** 订单审计详情 */
interface AdminOrderDetail extends AdminOrderInfo {
  client_ip: string | null;
  notify_raw_data: Record<string, any> | null;
}
```
