# 用户反馈与问卷模块 API 对接手册 (Feedback API)

本模块负责收集并分析用户在客户端提交的调研问卷与建议。

基础路径前缀: `/api/admin/feedback`

---

## 1. 运营大盘接口 (Operations Dashboard)

所有接口均需在 Header 中携带 `Authorization: Bearer <token>`。

### 1.1 问卷运营概览 (指标卡片)
- **路径**: `/overview` (完整路径: `/api/admin/feedback/overview`)
- **方法**: `GET`
- **说明**: 用于展示工作台顶部的指标卡片（总计、今日新增、本周新增）。

**成功响应 (data: Object):**
- `total_submissions`: 累计总条数。
- `today_submissions`: 今日新增数。
- `latest_records`: 最近 5 条记录的预览列表。

---

### 1.2 问卷选项聚合统计 (图表专用)
- **路径**: `/stats`
- **方法**: `GET`
- **说明**: 核心接口。后端自动对所有问卷题目的选项进行计数和百分比计算，**直接对接饼图/柱状图**。

**数据结构示例 (stats 数组):**
```json
{
  "question_key": "q1_channel",
  "title": "您是通过什么渠道了解到我们的？",
  "options": [
    { "label": "微信搜索", "count": 120, "percentage": 45.5 },
    { "label": "朋友推荐", "count": 80, "percentage": 30.2 }
  ]
}
```

---

## 2. 记录查询接口 (Records Management)

### 2.1 获取全量问卷提交记录
- **路径**: `/records`
- **方法**: `GET`
- **参数 (Query):** `skip`, `limit` (默认 0, 50)。

**响应关键字段:**
- `user_nickname`: 用户昵称（已自动拼装）。
- `form_payload`: **原始问卷数据 (JSON 对象)**，包含所有题目的 Key-Value。

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 选项统计项 (饼图数据源) */
interface OptionStats {
  label: string;
  count: number;
  percentage: number;
}

/** 题目聚合统计 */
interface QuestionStats {
  question_key: string;
  title: string;
  options: OptionStats[];
}

/** 全量统计响应 */
interface FeedbackStatsResponse {
  total_count: number;
  stats: QuestionStats[];
}
```

---

## 4. 数据可视化接入建议 (Data Analysis Guide)

为了在管理中台提供直观的分析能力，建议按以下逻辑对接接口：

### 4.1 使用 `/overview` 构建状态看板
- **适用组件**: **统计卡片 (Statistic Cards)**
- **映射逻辑**:
  - `total_submissions` -> **累计反馈总数** (大标题)
  - `today_submissions` -> **今日新增** (左侧小标题/趋势项项)
  - `latest_records` -> **实时动态列表** (看板下方的简易列表)

### 4.2 使用 `/stats` 构建分析图表 (ECharts)
- **适用组件**: **饼图 (Pie Chart)** / **柱状图 (Bar Chart)**
- **映射逻辑**:
  - `label` -> **类目轴 (X-Axis)** / **图例 (Legend)**
  - `percentage` -> **占比/数值 (Value)**
  - `count` -> **提示框 (Tooltip)** 中的原始人数
- **代码示例 (Echarts)**:
  ```javascript
  const option = {
    title: { text: item.title }, // Q1: 了解渠道
    series: [{
      type: 'pie',
      data: item.options.map(opt => ({
        name: opt.label, // 微信搜索
        value: opt.percentage // 45.5
      }))
    }]
  };
  ```

> [!TIP]
> **设计建议：**
> 建议在“问卷分析”页面通过遍历 `stats` 数组，为每一条题目动态渲染对应的图表组件，从而实现全自动的问卷画像分析。
