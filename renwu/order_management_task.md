# 订单记录管理界面开发任务清单 (Order Management Task List)

本文件记录“订单记录管理”功能模块的前端开发进度。该模块侧重于财务流水监控与技术审计分析。

## 1. 核心组件开发
- [x] **搜索过滤组件** (`modules/order-search.vue`) [DONE]
    - [x] 实现业务订单号 (`order_id`) 精确搜索。
    - [x] 实现用户 ID (`user_id`) 搜索。
    - [x] 实现订单状态 (`status`) 下拉筛选（Pending, Paid, Failed, Refunded 等）。
    - [x] 实现查询与重置按钮逻辑。
- [x] **表格逻辑封装** (`modules/use-order-table.ts`) [DONE]
    - [x] 对接 `fetchGetOrderList` 接口实现分页加载。
    - [x] 定义表格列结构：
        - [x] 订单 ID (ULID) 及其复制功能。
        - [x] 用户 ID (对应跳转链接或标识)。
        - [x] 套餐名称 (`plan_name`)。
        - [x] **支付金额实现**：将 `amount_fen` 转换为“元”并保留两位小数。
        - [x] 订单状态标签 (`NTag`)，适配不同业务状态颜色。
        - [x] 微信支付单号 (`transaction_id`) 展示。
        - [x] 下单时间与支付时间格式化。
    - [x] 实现操作列功能：
        - [x] “查看详情”：触发技术审计模态框。
- [x] **审计详情模态框** (`modules/order-detail-modal.vue`) [DONE]
    - [x] 对接 `fetchGetOrderDetail` 获取原始报文。
    - [x] 使用 `NCode` 或 `JSON 查看器` 展示 `notify_raw_data` 原始回调数据。
    - [x] 展示发起支付的 `client_ip`。
- [x] **主体页面装配** (`index.vue`) [DONE]
    - [x] 使用 `NCard` 容器包裹。
    - [x] 组合 `order-search` 与 `NDataTable`。

---

## 2. 逐步开发计划 (Step-by-Step Development Plan)

### Step 1: 编写数据驱动逻辑 (`modules/use-order-table.ts`) [DONE]
### Step 2: 实现审计详情模态框 (`modules/order-detail-modal.vue`) [DONE]
### Step 3: 编写搜索过滤 UI (`modules/order-search.vue`) [DONE]
### Step 4: 整体页面装配、路由注册与验证 [DONE]
- [x] 注册 `management_order` 权限并验证菜单图标 (`mdi:cash-register`)。
