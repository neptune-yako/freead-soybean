# 兑换码管理模块 API 对接手册 (Redeem API)

本模块负责激活码（Redeem Code）的生成、配置以及用户兑换流水的审计。

基础路径前缀: `/api/admin/redeem`

---

## 1. 兑换码配置 (Redeem Code Config)

所有接口均需在 Header 中携带 `Authorization: Bearer <token>`。

### 1.1 手动创建兑换码

- **路径**: `/codes` (完整路径: `/api/admin/redeem/codes`)
- **方法**: `POST`
- **说明**: 管理员手动指定一个字符串（如 `PRO_NY_2026`）并关联会员套餐。

**请求体 (JSON Body):**
| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `code_string` | `string` | 是 | 激活码文本 (4-32 位) |
| `plan_id` | `number` | 是 | 关联的会员套餐 ID |
| `valid_from` | `datetime` | 否 | 开始生效时间 |
| `valid_until` | `datetime` | 是 | **失效时间 (过期后无法兑换)** |
| `max_uses` | `number` | 否 | **最大可用次数 (0 为不限)** |
| `is_active` | `boolean` | 否 | 是否启用 (默认为 true) |

---

### 1.2 查询兑换码清单

- **路径**: `/codes`
- **方法**: `GET`
- **参数 (Query):**
  - `skip` / `limit`: 分页。
  - `is_active` (boolean): 按启用状态筛选。
  - `plan_id` (number): 按套餐 ID 筛选。

**响应关键字段 (data: List):**

- `current_uses`: 该激活码当前已成功兑换的次数。
- `plan_name`: 关联套餐的显示名称。

---

### 1.3 更新兑换码规则

- **路径**: `/codes/{code_id}`
- **方法**: `PATCH`
- **说明**: 支持局部修改有效期、剩余次数或禁用该码。

---

## 2. 审计与运维 (Audit & Maintenance)

### 2.1 获取全量兑换记录 (流水)

- **路径**: `/records`
- **方法**: `GET`
- **说明**: 谁在什么时候兑换了哪个激活码。支持按 `user_id` 或 `code_id` 过滤。

### 2.2 批量清除过期码 (系统扫描)

- **路径**: `/operations/invalidate-expired`
- **方法**: `POST`
- **说明**: 强制将所有当前时间已过 `valid_until` 的激活码标记为禁用。返回处理成功的数量。

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 兑换码数据项 */
interface RedeemCode {
  id: number;
  code_string: string;
  plan_id: number;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  plan_name: string;
}

/** 兑换流水记录 */
interface RedeemRecord {
  id: number;
  user_id: number;
  code_id: number;
  code_string: string;
  redeemed_at: string;
}
```
