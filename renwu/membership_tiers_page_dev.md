# 会员等级管理 (Membership Tiers) 开发文档

本模块用于定义系统中不同的会员档次（如：Free, Pro, PrimeAI），并为每个档次配置详细的权益配额（Quota Config）。通过该模块，管理员可以灵活调整不同等级用户的权益上限。

## 1. 业务逻辑分析 (Business Logic)

### 1.1 核心实体 (MemberTier)
基于 `Api.Membership.MemberTier`：
*   **tier_code**: 内部唯一代码（如 `free`, `pro`, `primeAI`），后端以此判断用户权限。
*   **name**: 展示名称（如 `尊享会员`）。
*   **quota_config**: **核心权益配置对象**，涵盖字数限制、Token 额度、文件大小及书架容量等。
*   **is_default**: 系统默认等级。新注册用户将自动关联该等级。
*   **weight**: 等级权重。数字越大表示等级越高。

### 1.2 权益配额 (QuotaConfig)
包含以下关键字段，表单需支持增量更新：
*   `max_words_count`: 单次排版字数限制。
*   `daily_tokens_limit`: 每日 Token 消耗上限。
*   `daily_upload_count`: 每日 OCR 或上传任务次数。
*   `max_file_size_mb`: 单个文件上传大小限制 (MB)。
*   `bookshelf_capacity`: 永久书架存储书籍上限。

## 2. 页面设计 (UI/UX Design)

### 2.1 布局方案
路径：`src/views/management/membership/tiers/index.vue`
*   **顶部**: 简单的页面标题及“新增等级”、“刷新”按钮。由于等级数据量较小，通常无需复杂搜索，直接列出全集。
*   **数据表格**: `NDataTable` 远程加载。
    *   展示 `name` 和 `tier_code`。
    *   展示 `weight`（通过 `NTag` 或 `NNumberAnimation`）。
    *   `is_default` 设置：通过 `NSwitch` 展示（建议在此禁用快速修改，在弹窗中修改）。
    *   `quota_config` 内容摘要：使用 `Tooltip` 或收纳式 `Tag` 展示。

### 2.2 核心组件
*   `NDataTable`: 用于列表渲染。
*   `NModal` + `NForm`: 处理等级的新增与编辑。由于配额配置较多，建议采用两列布局。
*   `NPopconfirm`: 删除高危操作确认。

## 3. 接口集成 (API Integration)

基于 [membership.ts](file:///d:/data/xianYu/freead-soybean/soybean-admin/src/service/api/membership.ts)：
*   `fetchGetMembershipTiers`: **GET** `/membership/tiers` (全量查询)。
*   `fetchCreateMembershipTier`: **POST** `/membership/tiers` (创建)。
*   `fetchUpdateMembershipTier`: **PATCH** `/membership/tiers/{id}` (局部更新)。
*   `fetchDeleteMembershipTier`: **DELETE** `/membership/tiers/{id}` (物理删除)。

---

## 4. 详细开发步骤 (Step-by-step Development)

### Step 1: 基础设施配置 (Infrastructure)
- [x] 在 `src/locales/langs/` 中补充翻译字典。
- [x] 在静态路由生成器中注册：`management_membership_tiers` (含父级菜单 `management_membership`)。
- [x] 配置访问权限：`['super_admin', 'operator']` (运营与管理员均可访问)。

### Step 2: 逻辑 Hook 封装 (Hooks & Logic)
- [x] 编写 `modules/use-tier-table.ts`：
    *   处理 `fetchGetMembershipTiers` 数据绑定。
    *   实现删除逻辑的二次确认封装。
    *   封装权重渲染逻辑。

### Step 3: 响应式列表渲染 (UI List)
- [x] 构建 `tiers/index.vue` 主页面。
    *   实现 `NDataTable` 的基础渲染。
    *   为 `quota_config` 编写格内结构化展示组件 (已集成于 Hook)。

### Step 4: 配置详情弹窗 (Tier Modal)
- [x] 构建 `modules/tier-operate-modal.vue`。
    *   嵌套对象 `quota_config` 的表单初始化与重置逻辑。
    *   基于 NaiveUI 规则进行数值范围校验。
    *   处理 `Update` 时的 Partial 提交与深度拷贝。

### Step 5: 优化与自测 (Optimization)
- [ ] 验证默认等级冲突逻辑（手动检查多个等级是否可能被设为 default）。
- [ ] 验证物理删除等级后的联动影响说明。
