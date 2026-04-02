# Payment 财务监控模块开发任务书 (Operations & Monitoring)

本模块专注于全站营收数据的实时监控与财务快照管理。

---

## 1. 功能定义 (Feature Definition)

### 1.1 核心大盘 (Dashboard)
- **指标卡 (Statistic Cards)**:
  - **周期内总营收**: 展示回溯天数内的累加金额（元）。
  - **周期内总订单**: 展示回溯天数内的成交笔数。
- **趋势分析 (Revenue Trend)**:
  - 使用 ECharts 渲染每日营收与订单量的双轴折线图。
  - 支持回溯天数切换（7天 / 30天）。

### 1.2 运维操作 (Operations)
- **手动结算 (Trigger Persist)**:
  - 按钮触发 `POST /api/admin/payment/persist`。
  - 弹出二次确认，提示“是否立即生成最新的财务快照？”。
  - 操作成功后自动刷新图表数据。

### 1.3 移除项 (Excluded)
- ❌ 暂不实现异常订单强制补单 (Manual Grant)。
- ❌ 暂不实现异常订单归档 (Archive)。

---

## 2. API 映射逻辑 (API Mapping)

| UI 元素 | 对应 API 字段 | 说明 |
| :--- | :--- | :--- |
| **总营收卡片** | `data.total_revenue_fen` | 需 `/ 100` 转换为元 |
| **总订单卡片** | `data.total_order_count` | 笔数 |
| **趋势 X 轴** | `data.items[].date` | YYYY-MM-DD |
| **趋势 Y1 (金额)** | `data.items[].total_amount_fen` | 纵轴显示“金额 (元)” |
| **趋势 Y2 (订单)** | `data.items[].paid_order_count` | 纵轴显示“笔数” |

---

## 3. 开发步骤 (Implementation Steps)

### Step 1: 基础设施 (Infrastructure) [预计 10min]
- [ ] 注册路由：`management_payment`。
- [ ] 权限配置：仅 `super_admin` 可见。
- [ ] 国际化补全：`zh-cn.ts` / `en-us.ts` (Payment 相关名词)。

### Step 2: 数据逻辑封装 (Logic Hook) [预计 15min]
- [ ] 编写 `modules/use-payment-trends.ts`:
  - 封装 `fetchGetRevenueTrends` 调用逻辑。
  - 处理 `days` 响应式参数切换。
  - 对金额进行 `fenToYuan` 的单位转换。

### Step 3: 图表组件开发 (Component) [预计 20min]
- [ ] 编写 `modules/payment-trend-chart.vue`:
  - 使用 `useEcharts` 渲染双轴图。
  - 适配暗黑模式配色。

### Step 4: 页面总装 (Page Assembly) [预计 15min]
- [ ] 编写 `index.vue`:
  - 布局统计卡片。
  - 挂载图表组件。
  - 实现“手动结算”按钮交互。

### Step 5: 测试与优化 (Testing) [预计 10min]
- [ ] 验证 7/30 天数据切换是否准确。
- [ ] 验证手动结算后的数据联动刷新。

---

## 4. UI 视觉设计建议
- **配色**: 营收使用主色 (Primary)，订单量使用警告色 (Success/Warning)。
- **交互**: 点击“手动结算”按钮时增加 Loading 状态，防止重复提交。
