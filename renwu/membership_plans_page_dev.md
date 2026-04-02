# 会员套餐管理 (Membership Plans) 开发文档

本模块用于管理向用户销售的订阅产品。每个套餐都关联一个特定的“会员等级”，并定义了价格和有效期。

## 1. 业务逻辑分析 (Business Logic)

### 1.1 核心实体 (MembershipPlan)
基于 `Api.Membership.MembershipPlan`：
*   **tier_id**: 关联的会员等级 ID。
*   **name**: 销售名称（如：专业版月卡、AI 尊享年卡）。
*   **price_cents**: **核心字段**。价格以“分”为单位存储（100 = 1.00 元）。前端展示需进行单位转换。
*   **duration_days**: 套餐有效期天数（如 30, 90, 365）。
*   **is_active**: 上架开关。控制用户端可见性。
*   **sort_order**: 排序权重。

### 1.2 外部关联
*   **会员等级映射**: 需要调用 `fetchGetMembershipTiers` 获取等级列表，以便在表单中关联。

## 2. 页面设计 (UI/UX Design)

### 2.1 布局方案
路径：`src/views/management/membership/plans/index.vue`
*   **顶部**: 标题及“新增套餐”按钮。
*   **数据表格**:
    *   展示套餐名称及关联等级。
    *   **价格渲染**: 格式化为人民币符号 + 两位小数。
    *   **状态切换**: 使用 `NSwitch` 展示上架状态。
*   **表单弹窗**:
    *   下拉选择关联等级。
    *   数字输入框处理价格（分转元）和天数。

## 3. 接口集成 (API Integration)

基于 `membership.ts`：
*   `fetchGetMembershipPlans`: **GET** `/membership/plans`
*   `fetchCreateMembershipPlan`: **POST** `/membership/plans`
*   `fetchUpdateMembershipPlan`: **PATCH** `/membership/plans/{id}`
*   `fetchDeleteMembershipPlan`: **DELETE** `/membership/plans/{id}`

---

## 4. 详细开发步骤 (Step-by-step Development)

### Step 1: 基础设施配置 (Infrastructure)
- [x] 在 `src/locales/langs/` 中补充套餐管理翻译。
- [x] 注册路由：`management_membership_plans`。
- [x] 配置权限：`['super_admin', 'operator']`。

### Step 2: 逻辑 Hook 封装 (Hooks & Logic)
- [x] 编写 `modules/use-plan-table.ts`：
    *   处理数据加载与价格格式化 (分转元 ✨)。
    *   封装上架状态切换逻辑。

### Step 3: 响应式列表渲染 (UI List)
- [x] 构建 `plans/index.vue` 主页面及 `NDataTable`。

### Step 4: 套餐操作弹窗 (Plan Modal)
- [ ] 构建 `modules/plan-operate-modal.vue`。
    *   集成 `fetchGetMembershipTiers` 的选项加载。
    *   处理“分”与“元”之间的数值转换逻辑。

### Step 5: 优化与自测 (Optimization)
- [ ] 验证价格精度问题（确保不出现浮点数计算误差）。
- [ ] 验证关联等级后的套餐生效逻辑。
