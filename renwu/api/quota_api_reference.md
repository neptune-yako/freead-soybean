# 配额统计与监控模块 API 对接手册 (Quota API)

本模块负责全站及单用户的资源消耗（OCR、Token、DAU）统计。

基础路径前缀: `/api/admin/quota`

---

## 1. 全站大盘接口 (Global Dashboard)

所有接口均需在 Header 中携带 `Authorization: Bearer <token>`。

### 1.1 今日配额消耗实时统计 (实时大数)
- **路径**: `/stats` (完整路径: `/api/admin/quota/stats`)
- **方法**: `GET`
- **说明**: 从 Redis 实时获取今日截止到目前的统计数据。

**成功响应 (data: Object):**
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `date` | `string` | 今日日期 (YYYY-MM-DD) |
| `total_daily_upload_count` | `number` | **今日全站 OCR / 图片识别总次数** |
| `total_tokens_count` | `number` | **今日全站累计消耗 Token 总数** |
| `total_active_users` | `number` | **今日产生活效消耗的用户总数 (DAU)** |

---

### 1.2 全站配额消耗历史趋势 (图表专用)
- **路径**: `/trends` (完整路径: `/api/admin/quota/trends`)
- **方法**: `GET`
- **参数 (Query):**
  - `days`: 回溯天数 (默认 7)。传 15 或 30。

> [!IMPORTANT]
> **破坏性变更 (Breaking Change)：**
> 该接口响应已从 `Array` 升级为 `Object`。前端解析明细时请使用 `data.items`。

**响应示例 (JSON):**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "period_total_upload": 1250,
    "period_total_tokens": 450000,
    "period_total_active_users": 3500,
    "items": [
      { "date": "2024-03-01", "total_daily_upload_count": 80, "total_tokens_count": 30000, "total_active_users": 200 },
      { "date": "2024-03-02", "total_daily_upload_count": 0, "total_tokens_count": 0, "total_active_users": 0 }
    ]
  }
}
```

**数据字典 (data 对象):**
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `period_total_upload` | `number` | **期间内累计全站上传总数** |
| `period_total_tokens` | `number` | **期间内累计全站消耗 Token 总数** |
| `period_total_active_users` | `number` | **期间内累计全站活跃人次 (DAU 之和)** |
| `items` | `Array` | 每日详细消耗快照列表（已自动补全缺失日期，值为 0） |

---

## 2. 详细审计接口 (User Audit)

### 2.1 查阅指定用户的今日配额详情
- **路径**: `/users/{user_id}`
- **方法**: `GET`
- **说明**: 运维专用。查看具体某个用户的当前等级、权益配置以及今日详细消耗量。

**成功响应 (data: Object):**
- `user_id`: 用户 ID
- `tier_code`: 当前等级 (如 `free`, `pro`)
- `quota_config`: 详细权益配置 JSON
- `daily_usage`: 今日消耗明细 (Map 结构)，如 `{"ocr": 5, "tokens": 1200}`

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 全站配额快照 (今日或历史) */
interface GlobalQuotaStat {
  date: string;
  total_daily_upload_count: number;
  total_tokens_count: number;
  total_active_users: number;
}

/** 全站配额趋势聚合响应 */
interface QuotaTrendResponse {
  period_total_upload: number;
  period_total_tokens: number;
  period_total_active_users: number;
  items: GlobalQuotaStat[];
}

/** 用户配额审计详情 */
interface AdminQuotaDetail {
  user_id: number;
  tier_code: string;
  quota_config: any;
  daily_usage: Record<string, number>;
}
```
