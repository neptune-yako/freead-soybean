# 会员等级模块 API 对接手册 (Membership Tier API)

本模块负责定义系统中不同的会员等级（如：免费版、专业版、企业版）及其关联的权益配额。

基础路径前缀: `/api/admin/membership`

---

## 1. 接口列表 (Endpoint List)

所有接口均需在 Header 中携带 `Authorization: Bearer <token>`。

### 1.1 获取所有会员等级清单

- **路径**: `/tiers` (完整路径: `/api/admin/membership/tiers`)
- **方法**: `GET`
- **说明**: 用于列表展示或在创建“会员套餐”时作为下拉选择项。

### 1.2 获取等级详情

- **路径**: `/tiers/{tier_id}`
- **方法**: `GET`
- **说明**: 返回指定等级的详细配置。

### 1.3 创建新会员等级

- **路径**: `/tiers`
- **方法**: `POST`
- **请求体 (JSON Body)**: 参考下方的 `MemberTierCreate`。

### 1.4 更新会员等级配置

- **路径**: `/tiers/{tier_id}`
- **方法**: `PATCH`

### 1.5 删除会员等级

- **路径**: `/tiers/{tier_id}`
- **方法**: `DELETE`
- **说明**: 物理删除（若该等级下已有存量会员，后端可能抛出外键约束错误）。

---

## 2. 核心数据结构 (Data Models)

### A. 会员等级对象 (MemberTier)

| 字段名             | 类型         | 说明                                       |
| :----------------- | :----------- | :----------------------------------------- |
| `tier_code`        | `string`     | 内部代码，如 `free`, `pro`, `prime`        |
| `name`             | `string`     | 展示名称，如 `黄金会员`                    |
| `is_default`       | `boolean`    | 是否为新用户注册后的默认等级               |
| `weight`           | `number`     | 等级权重（用于判断等级高低，数字越大越高） |
| **`quota_config`** | **`object`** | **核心：权益配额 JSON 配置 (见下表)**      |

### B. 配额配置结构 (quota_config)

这是存储在 `quota_config` 字段中的 JSON 对象示例：

```json
{
  "max_words_count": 20000, // 单次最大排版字数
  "daily_tokens_limit": 25000, // 每日 Token 使用上限
  "daily_upload_count": 10, // 每日 OCR/上传次数
  "max_file_size_mb": 2, // 单个文件最大 MB
  "bookshelf_capacity": 100, // 永久书架容量
  "bookshelf_enabled": true // 是否允许使用书架功能
}
```

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 配额详细配置 */
interface QuotaConfig {
  max_words_count: number;
  daily_tokens_limit: number;
  daily_upload_count: number;
  max_file_size_mb: number;
  bookshelf_capacity: number;
  bookshelf_enabled: boolean;
}

/** 会员等级详情数据 */
interface MemberTier {
  id: number;
  tier_code: string;
  name: string;
  quota_config: QuotaConfig;
  is_default: boolean;
  weight: number;
  remark?: string;
  created_at: string;
}
```
