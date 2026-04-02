# Quota 统计页面开发规划 (留档)

## 1. 业务目标
实现全局配额（Quota）消耗的仪表盘。与 Payment 模块保持一致的 UI 风格，提供直观的消耗分析。

## 2. API 依赖
- **GET** `/api/admin/quota/trends` -> `fetchGetQuotaTrends`
  - 参数：`day: number` (7 或 30)
  - 返回：`QuotaTrendResponse` (包含 dates, words, tokens, total_words, total_tokens)
- **POST** `/api/admin/quota/persist` -> `fetchTriggerQuotaPersist`
  - 作用：手动快照当前额度消耗状态，刷新对账单。

## 3. UI 布局详细规划
### A. Dashboard Header (数据概览卡片)
- **指标卡 1 (Total Words)**：展示所选周期内的全局字数处理总量。
- **指标卡 2 (Total Tokens)**：展示对应的 LLM Token 消耗。
- **操作按钮 (Persist)**：置于右侧，用于手动触发快照。

### B. Charting Section (趋势可视化)
- **多维度 ECharts**：
  - **左 Y 轴**：Words (处理字数)，建议使用面积图展示。
  - **右 Y 轴**：Tokens (消耗量)，建议点/线展示。
- **动态联动**：集成 7天/30天 切换 Tab 按钮。

## 4. 实施里程碑
- **Step 1: Infrastructure**
  - 创建 `src/views/management/quota` 目录。
  - 在 `src/locales/langs/zh-cn.ts` 及 `en-us.ts` 中补全单词与 Token 的国际化词条。
- **Step 2: Business Hook (`use-quota-trends.ts`)**
  - 使用 `usePaymentTrends` 相似的解构逻辑，封装数据请求与周期刷新。
- **Step 3: Component (`quota-trend-chart.vue`)**
  - 继承 `PaymentTrendChart` 的 `grid` 和 `legend` 布局优化（`bottom: 60`）。
- **Step 4: Page Assembly (`index.vue`)**
  - 完成最终页面拼装。

## 5. 校验标准
- 图表 X 轴标签不与图例重叠。
- I18n 类型推导 100% 闭合。
- 手动持久化后，趋势数据能够拉取最新快照。
