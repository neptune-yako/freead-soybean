# 问卷反馈管理 (Feedback & Survey) 开发文档

本模块用于监控全站用户问卷的提交情况，通过可视化图表展示各题目的选项分布，并提供原始提交明细的查询。

## 1. 业务逻辑分析 (Business Analysis)

### 1.1 数据维度
*   **概览数据 (Overview)**：展示全站累计提交总数和今日新增数。
*   **聚合统计 (Stats)**：后端已对每道题目（`QuestionStats`）进行了预计算，包含选项的计数值和百分比，适合直接驱动图表。
*   **提交记录 (Records)**：包含用户信息及 `form_payload` (JSON 格式)。

### 1.2 关键挑战
*   **动态数据渲染**：`form_payload` 存储的是用户的原始回答，需要将其转换成人类可读的详情列表。
*   **图表自适应**：统计数据可能包含多道题目，需动态生成多个 ECharts 实例。

## 2. 页面设计 (UI/UX Design)

### 2.1 布局方案
路径：`src/views/management/feedback/index.vue`
采用 **双标签页 (Tabs)** 结构：

#### Tab 1: 运营概览 (Dashboard)
*   **统计卡片**: 顶部展示累计提交总数与今日新增。
*   **聚合图表**: 使用 `NGrid` (预计 3 列) 展示题目分布。
    *   每道题一个 `NCard`。
    *   使用 **饼图 (Pie Chart)** 或 **环形图** 展示选项占比。

#### Tab 2: 提交明细 (Records)
*   **数据表格**: 展示 ID、用户、提交时间。
*   **详情窗口**: 点击操作项，通过 `Drawer` 或 `Modal` 展示该次提交的全部 `form_payload` 内容。

### 2.2 核心组件
*   `VChart`: 基于 `vue-echarts` 的统计可视化。
*   `NDescriptions`: 用于美化动态 JSON 的 key-value 展示。
*   `NTabs`: 模块化逻辑隔离。

## 3. 接口集成 (API Integration)

基于 `feedback.ts`:
*   `fetchGetFeedbackOverview`: 获取顶部指标。
*   `fetchGetFeedbackStats`: 获取题目统计（用于循环生成图表）。
*   `fetchGetFeedbackRecords`: [分页] 获取原始提交记录。

---

## 4. 详细开发步骤 (Step-by-step Development)

### Step 1: 基础设施配置 (Infrastructure)
- [ ] 增加多语言词条（概览、趋势、题目分布、查看答卷等）。
- [ ] 注册路由：`management_feedback`。
- [ ] 配置权限：`['super_admin', 'operator']`。

### Step 2: 运营看板开发 (Charts & Overview)
- [x] 实现指标卡展示逻辑。
- [x] 集成 ECharts，实现自适应网格图表布局及票数展示。

### Step 3: 答卷明细开发 (Detail Records)
- [x] 编写 `modules/use-feedback-table.ts` 实现表格逻辑。
- [x] 实现 `form_payload` 动态键值对的展示组件。

### Step 4: 综合测试 (Testing)
- [x] 验证多题型下的图表溢出处理与响应式适配。
- [x] 验证不同主题下单票数 Tooltip 文字的清晰度。
