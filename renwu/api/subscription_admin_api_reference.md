# 订阅记录管理模块 API 对接手册 (Subscription Management)

本模块用于在管理中台查看所有用户的会员订阅/订购流水记录，支持按用户、等级、状态进行多维度追踪。

基础路径前缀: `/api/v1/admin/subscription`  
所有接口均需在 Header 中携带 `Authorization: Bearer <token>` (管理员 Token)。

---

## 1. 接口定义 (Endpoints)

### 1.1 获取订阅分页列表
- **路径**: `/list`
- **方法**: `GET`
- **说明**: 检索系统全量订阅流水，默认按创建时间倒序。
- **查询参数 (Query):**
  | 字段名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `page` | `number` | 否 | 页码，默认 1 |
  | `size` | `number` | 否 | 每页数量，默认 20 |
  | `user_id` | `number` | 否 | 按用户 ID 精确筛选 |
  | `tier_code` | `string` | 否 | 会员等级代码 (如 `pro`, `free`) |
  | `status` | `string` | 否 | 状态: `active` (有效), `expired` (已过期), `cancelled` (已取消) |

---

## 2. 核心数据结构 (Data Models)

### A. 订阅管理对象 (SubscriptionAdminDTO)
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | `number` | 记录 ID |
| `user_id` | `number` | 关联用户 ID |
| `tier_code` | `string` | 等级代码 |
| `start_time` | `string(datetime)` | 生效起始时间 |
| `expire_time` | `string(datetime)` | 到期时间 |
| `status` | `string` | 状态流水状态 |
| `created_at` | `string(datetime)` | 记录创建时间 (订购/领取时间) |

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 订阅状态类型 */
type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

/** 订阅列表查询参数 */
interface SubscriptionListFilter {
  page?: number;
  size?: number;
  user_id?: number;
  tier_code?: string;
  status?: SubscriptionStatus;
}

/** 订阅管理列表项 */
interface SubscriptionAdminInfo {
  id: number;
  user_id: number;
  tier_code: string;
  start_time: string;
  expire_time: string;
  status: SubscriptionStatus;
  created_at: string;
}
```
