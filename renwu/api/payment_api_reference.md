# 财务与订单管理模块 API 对接手册 (Payment API)

本模块包含财务营收统计以及订单异常处理功能。

基础路径前缀: `/api/admin/payment`

---

## 1. 营收统计与趋势 (Revenue Statistics)

所有接口均需在 Header 中携带 `Authorization: Bearer <token>`。

### 1.1 获取营收趋势数据 (图表专用)

- **路径**: `/trends` (完整路径: `/api/admin/payment/trends`)
- **方法**: `GET`
- **参数 (Query):**
  - `days`: 回溯天数 (默认 7)。传 30 为一月，传 0 为拉取所有历史快照。

**成功响应 (data: List):**
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `date` | `string` | 统计日期 (YYYY-MM-DD)，可直接作为 ECharts 的 X 轴 |
| `total_amount_fen` | `number` | **当期总收入（单位：分）**，前端绘图时建议 / 100 转换为元 |
| `paid_order_count` | `number` | 成交订单量 |

---

### 1.2 手动触发财务日结 (运维)

- **路径**: `/persist`
- **方法**: `POST`
- **说明**: 立即根据当前订单表，快照一份最新的财务统计记录到数据库中。常用于补录数据或上线初期的测试。

---

## 2. 订单异常处理 (Order Recovery)

仅受信任的高级管理员可调用此类接口。

### 2.1 人工强制补单 (Manual Grant)

- **路径**: `/orders/manual-grant`
- **方法**: `POST`
- **说明**: 用于处理“用户已付款但由于微信回调失败，系统未发放权益”的特殊情况。调用后会强制根据单号发放会员。

**请求体 (JSON Body):**
| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `order_id` | `string` | 是 | 系统内部订单号 |
| `remark` | `string` | 是 | 补单备注（如：用户投诉补发） |

---

### 2.2 异常订单归档 (Archive)

- **路径**: `/orders/archive`
- **方法**: `POST`
- **说明**: 强制将长时间处于“待支付”或“状态异常”的订单标记为已失效/已归档，不再统计其流水。

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 每日营收快照 */
interface PaymentDailyStat {
  date: string;
  total_amount_fen: number;
  paid_order_count: number;
}

/** 补单请求 */
interface ManualGrantRequest {
  order_id: string;
  remark: string;
}
```
