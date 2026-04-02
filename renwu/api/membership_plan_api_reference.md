# 会员套餐模块 API 对接手册 (Membership Plan API)

本模块负责管理可供用户订阅的商品列表（套餐）。每个套餐都关联一个 **会员等级 (Tier ID)**。

基础路径前缀: `/api/admin/membership`

---

## 1. 接口列表 (Endpoint List)

所有接口均需在 Header 中携带 `Authorization: Bearer <token>`。

### 1.1 获取会员套餐清单

- **路径**: `/plans` (完整路径: `/api/admin/membership/plans`)
- **方法**: `GET`
- **参数 (Query):**
  - `only_active` (boolean): 是否仅查询上架中的套餐 (默认 `true`)。

### 1.2 获取单个套餐详情

- **路径**: `/plans/{plan_id}`
- **方法**: `GET`

### 1.3 创建订阅套餐

- **路径**: `/plans`
- **方法**: `POST`
- **说明**: 创建一个可购买的新商品。

### 1.4 更新套餐配置

- **路径**: `/plans/{plan_id}`
- **方法**: `PATCH`
- **说明**: 支持局部更新价格、名称、上架状态或时长。

### 1.5 删除订阅套餐

- **路径**: `/plans/{plan_id}`
- **方法**: `DELETE`

---

## 2. 核心数据结构 (Data Models)

### A. 会员套餐对象 (MembershipPlan)

| 字段名          | 类型      | 说明                                |
| :-------------- | :-------- | :---------------------------------- |
| `name`          | `string`  | 销售名称（如：30 天专业版月卡）     |
| `tier_id`       | `number`  | **关联的会员等级 ID**               |
| `price_cents`   | `number`  | **价格（单位：分，100 = 1.00 元）** |
| `duration_days` | `number`  | **有效天数（如 30, 365）**          |
| `is_active`     | `boolean` | 是否上架可见                        |
| `sort_order`    | `number`  | 排序权重（用于前端排序展示）        |

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 会员套餐详情数据 */
interface MembershipPlan {
  id: number;
  tier_id: number;
  tier_code: string; // 后端视图已通过关联查询自动带出等级代码
  name: string;
  price_cents: number; // 务必注意单位为分
  duration_days: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** 创建/更新请求 */
interface MembershipPlanRequest {
  tier_id: number;
  name: string;
  price_cents: number;
  duration_days: number;
  is_active?: boolean;
}
```
