# 订阅流水管理界面开发任务清单 (Subscription Management Task List)

本文件记录“订阅流水管理”功能模块的前端开发进度。该模块主要用于追踪用户的会员权益变更历史。

## 1. 核心组件开发
- [x] **搜索过滤组件** (`modules/subscription-search.vue`) [DONE]
    - [x] 实现用户 ID (`user_id`) 精确查询指标。
    - [x] 实现会员等级 (`tier_code`) 筛选（free, vip, svip）。
    - [x] 实现订阅状态 (`status`) 筛选（Active, Expired, Cancelled）。
    - [x] 实现包含正确“重置”逻辑与“首页回归”逻辑的查询。
- [x] **表格逻辑封装** (`modules/use-subscription-table.ts`) [DONE]
    - [x] 对接 `fetchGetSubscriptionList` 接口实现分页加载。
    - [x] 定义表格列结构：
        - [x] ID。
        - [x] 用户 ID (`user_id`)。
        - [x] 等级代码 (`tier_code`)：映射为 [普通用户, 专业版, 尊享版] 标签。
        - [x] 生效时间 (`start_time`)：格式化为 YYYY-MM-DD HH:mm:ss。
        - [x] 到期时间 (`expire_time`)：格式化为 YYYY-MM-DD HH:mm:ss。
        - [x] 状态 (`status`)：映射为多色标签（Active-成功, Expired-默认, Cancelled-错误）。
        - [x] 创建时间 (`created_at`)：格式化展示。
    - [x] 编写 `resetQueryParams` 与 `getDataByPage(1)` 逻辑。
- [x] **主体页面装配** (`index.vue`) [DONE]
    - [x] 使用 `NCard` 容器包裹。
    - [x] 组合 `subscription-search` 与 `NDataTable`。

---

## 2. 逐步开发计划 (Step-by-Step Development Plan)

### Step 1: 编写数据驱动逻辑 (`modules/use-subscription-table.ts`) [DONE]
### Step 2: 编写搜索过滤 UI (`modules/subscription-search.vue`) [DONE]
### Step 3: 整体页面装配与联调 [DONE]
- 完成 `index.vue` 的组合，并进行全量功能验证。
