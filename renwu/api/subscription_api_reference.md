# 用户订阅管理模块 API 对接手册 (Subscription API)

本模块负责用户与会员身份的绑定关系，支持后台手动干预与系统运维操作。

基础路径前缀: `/api/admin/membership`

---

## 1. 运维与干预接口 (Operations & Intervention)

所有接口均需在 Header 中携带 `Authorization: Bearer <token>`。

### 1.1 手动强制发放订阅 (补发/赠送)

- **路径**: `/subscriptions` (完整路径: `/api/admin/membership/subscriptions`)
- **方法**: `POST`
- **说明**: 绕过支付流程，直接为指定用户增加会员时长。常用于处理支付失败后的手动补偿或活动赠送。

**请求体 (JSON Body):**
| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `user_id` | `number` | 是 | 目标用户 ID |
| `tier_code` | `enum` | 是 | 权益级别: `pro`, `primeAI` |
| `days` | `number` | 是 | 赠送/增加的天数 (如 30) |

---

### 1.2 手动触发过期降级 (系统同步)

- **路径**: `/subscriptions/downgrade`
- **方法**: `POST`
- **说明**: 强制启动后台 Worker 扫描全库。将所有 `expire_time` 已过的活跃订阅标记为过期，并根据业务规则降级（如降回 `free`）。

**特殊逻辑:**

- **并发保护**: 该接口集成了 Redis 分布式锁，若任务已在运行，返回 `429 Too Many Requests`。
- **异步执行**: 接口会立即返回“启动成功”，具体扫描逻辑在后台线程执行。

---

## 2. 核心数据结构 (Data Models)

### A. 订阅信息对象 (SubscriptionDTO)

| 字段名        | 类型       | 说明                  |
| :------------ | :--------- | :-------------------- |
| `id`          | `number`   | 记录 ID               |
| `user_id`     | `number`   | 用户唯一 ID           |
| `tier_code`   | `string`   | 当前生效等级代码      |
| `start_time`  | `datetime` | 会员生效开始时间      |
| `expire_time` | `datetime` | 会员到期时间          |
| `status`      | `string`   | 状态 (active/expired) |

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 手动发放订阅请求 */
interface ManualSubscriptionCreate {
  user_id: number;
  tier_code: 'pro' | 'primeAI';
  days: number;
}

/** 订阅详情 */
interface SubscriptionInfo {
  id: number;
  user_id: number;
  tier_code: string;
  start_time: string;
  expire_time: string;
  status: 'active' | 'expired';
}
```
