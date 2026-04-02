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
  - `days`: 回溯天数 (默认 7)。传 30 为一月。

> [!IMPORTANT]
> **破坏性变更 (Breaking Change)：**
> 该接口响应已从 `Array` 升级为 `Object`。前端解析明细时请使用 `data.items`。

**响应示例 (JSON):**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "total_revenue_fen": 15600,
    "total_order_count": 12,
    "items": [
      { "date": "2024-03-01", "total_amount_fen": 5000, "paid_order_count": 4 },
      { "date": "2024-03-02", "total_amount_fen": 0, "paid_order_count": 0 }
    ]
  }
}
```

**数据字典 (data 对象):**
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `total_revenue_fen` | `number` | **周期内总营收（累加值，单位：分）** |
| `total_order_count` | `number` | **周期内总成交笔数（累加值）** |
| `items` | `Array` | 每日走势明细列表（后端已自动补全缺失日期，值为 0） |

---

### 1.2 手动触发财务日结 (运维)
- **路径**: `/persist`
- **方法**: `POST`
- **说明**: 立即根据当前订单表，快照一份最新的财务统计记录到数据库中。

---

## 2. 订单异常处理 (Order Recovery)

仅受信任的高级管理员可调用此类接口。

### 2.1 人工强制补单 (Manual Grant)
- **路径**: `/orders/manual-grant`
- **方法**: `POST`
- **说明**: 强制根据单号发放会员。支持手动覆盖原定权益。

**请求体 (JSON Body):**
| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `out_trade_no` | `string` | 是 | 微信支付单号 / 商户单号 |
| `remark` | `string` | 否 | 补单备注 |
| `override_tier_code` | `string` | 否 | 强制覆盖的目标等级 (如 pro) |
| `override_plan_days` | `number` | 否 | 强制覆盖的天数 |

---

### 2.2 异常订单归档 (Archive)
- **路径**: `/orders/archive`
- **方法**: `POST`
- **参数**: `out_trade_no`, `reason`

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 每日营收快照 */
interface PaymentDailyStat {
  date: string;
  total_amount_fen: number;
  paid_order_count: number;
}

/** 营收趋势聚合响应 */
interface PaymentTrendResponse {
  total_revenue_fen: number;
  total_order_count: number;
  items: PaymentDailyStat[];
}

/** 补单请求 */
interface ManualGrantRequest {
  out_trade_no: string;
  remark?: string;
  override_tier_code?: string;
  override_plan_days?: number;
}
```
