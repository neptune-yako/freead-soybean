# 用户反馈问卷数据映射手册 (Feedback Form Mapping)

后端对问卷提交实行 **“数字枚举 + 联动校验”** 的严格策略。前端在构建 `form_payload` 时必须遵循以下映射关系。

---

## 1. 提交接口概要
- **接口路径**: `/api/user/feedback/` (具体以路由配置为准)
- **请求方法**: `POST`
- **数据结构**: 
  ```json
  { "form_payload": { ...核心数据 } }
  ```

---

## 2. 字段映射详情

### Q1: 了解渠道 (单选)
- **Key**: `q1_channel` (Number)
- **选项映射**:
  - `1`: 小红书
  - `2`: 朋友推荐
  - `3`: 搜索引擎
  - `4`: 微信群
  - `5`: 线下媒体
  - `99`: 其他 (若选此项，必须填写 `q1_channel_other`)
- **补充文本 Key**: `q1_channel_other` (String)

### Q2: 确诊情况 (单选)
- **Key**: `q2_diagnosis` (Number)
- **选项映射**:
  - `1`: 无
  - `2`: ADHD (多动症)
  - `3`: Dyslexia (阅读障碍)
  - `4`: 双重确诊
  - `5`: 不允许/不确定

### Q3: 阅读困难程度 (单选)
- **Key**: `q3_difficulty` (Number)
- **选项映射**: `1`(无), `2`(轻度), `3`(中度), `4`(重度), `5`(不确定)

### Q4: 阅读需求量 (单选)
- **Key**: `q4_demand` (Number)
- **选项映射**:
  - `1`: 较大 (工作/研究需求)
  - `2`: 一般 (兴趣阅读)
  - `3`: 较少 (刷手机娱乐)

### Q5: 常读文章类型 (多选)
- **Key**: `q5_content_types` (Array of Number)
- **选项映射**: `1`(短文), `2`(中长文), `3`(论文), `4`(小说), `99`(其他)
- **补充文本 Key**: `q5_content_types_other`

### Q6: 主要阅读场景 (多选)
- **Key**: `q6_scenes` (Array of Number)
- **选项映射**: `1`(工作学术), `2`(社交媒体), `3`(电子书), `4`(产品说明), `5`(教科书), `6`(公文), `7`(新闻), `8`(纸质书), `99`(其他)
- **补充文本 Key**: `q6_scenes_other`

### Q7: 期望平台 (多选)
- **Key**: `q7_platforms` (Array of Number)
- **选项映射**: `1`(iOS), `2`(Android), `3`(浏览器插件), `4`(Office插件), `99`(其他)
- **补充文本 Key**: `q7_platforms_other`

### Q8: 个性化建议 (主观)
- **Key**: `q8_features` (String, max 1000 chars)

---

## 3. 重要校验逻辑 (必须遵守)

> [!CAUTION]
> **联动校验策略：**
> 如果在 `q1`, `q5`, `q6`, `q7` 中选择了值为 **`99` (其他)** 的选项，则对应的 `_other` 文本字段 **不能为空**，否则后端会抛出 `422 Validation Error`。

---

## 4. 前端 TypeScript 定义建议

```typescript
interface FeedbackPayload {
  q1_channel: number;
  q1_channel_other?: string;
  q2_diagnosis: number;
  q3_difficulty: number;
  q4_demand: number;
  q5_content_types: number[];
  q5_content_types_other?: string;
  q6_scenes: number[];
  q6_scenes_other?: string;
  q7_platforms: number[];
  q7_platforms_other?: string;
  q8_features?: string;
}

interface SubmitFeedbackRequest {
  form_payload: FeedbackPayload;
}
```
