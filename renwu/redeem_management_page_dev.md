# 兑换码管理 (Redeem Code Management) 开发文档

本项目将开发一个全功能的兑换码管理后台，用于生成、下发及审计激活码。该模块是系统营收与用户拉新的核心工具。

## 1. 业务需求分析 (Business Requirements)

### 1.1 核心功能
*   **兑换码列表**：展示激活码字符串、关联套餐（Plan）、有效期、使用量（已兑换/最大限制）及状态。
*   **激活码创建**：支持自定义或生成随机码，指派会员套餐，设置生效与失效时间。
*   **状态控制**：一键启用/禁用激活码。
*   **审计流水**：记录哪个用户在什么时间兑换了哪枚激活码。
*   **系统维护**：支持一键清理所有已过期的无效码。

### 1.2 权限控制
*   建议仅限 `super_admin` 或拥有权限的 `operator` 访问。

## 2. 页面设计 (UI/UX)

### 2.1 布局方案
采用“标签页 (Tabs)”结构，隔离“兑换码管理”与“兑换流水记录”：
- **Tab 1: 兑换码清单**
    - 顶部：搜索栏（套餐筛选、状态筛选）、操作区（新增、批量过期清理）。
    - 中部：数据表格（NDataTable）。
    - 底部：分页组件。
- **Tab 2: 兑换记录 (Audit)**
    - 列表展示用户 ID、兑换时间、对应激活码。

### 2.2 核心组件
- `NTabs`: 切换管理与审计。
- `NDataTable`: 远程加载列表。
- `NDatePicker`: 选取有效期区间。
- `NSelect`: 关联会员套餐 (Plan)。

## 3. 接口集成 (API)

基于 [redeem.ts](file:///d:/data/xianYu/freead-soybean/soybean-admin/src/service/api/redeem.ts)：
- `fetchGetRedeemCodes`: 列表查询。
- `fetchCreateRedeemCode`: 弹窗提交。
- `fetchUpdateRedeemCode`: 修改规则。
- `fetchGetRedeemRecords`: 审计查询。
- `fetchInvalidateExpiredCodes`: 批量操作。

---

## 4. 详细开发步骤 (Step-by-step Development)

### Step 1: 基础框架搭建 (Infrastructure)
- [ ] 创建 `src/views/management/redeem/index.vue`。
- [ ] 在 `src/locales/langs/` 中补充兑换码相关字段。
- [ ] 注册路由权限：`meta.roles: ['super_admin', 'operator']`。

### Step 2: 逻辑 Hook 封装 (Hooks & Logic)
- [ ] 编写 `modules/use-redeem-table.ts`：
    - 封装激活码列表查询 (`fetchGetRedeemCodes`)。
    - 封装审计流水查询 (`fetchGetRedeemRecords`)。
    - 处理分页对象与 `transform` 适配。

### Step 3: 响应式列表渲染 (UI List)
- [ ] 实现标签页切换逻辑。
- [ ] 构建“兑换码管理”表格：
    - 展示进度条（`NProgress`）直观显示已用额度。
    - 状态列集成快捷启用开关。
- [ ] 构建“兑换流水”表格。

### Step 4: 操作弹窗开发 (Forms & Modals)
- [ ] 创建 `modules/redeem-operate-modal.vue`：
    - 支持随机生成兑换码字符逻辑。
    - 日期范围选择器限制 `valid_from` 与 `valid_until`。

### Step 5: 全局功能与交互增强 (Security & UX)
- [ ] 实现“清理过期码”二次确认及进度提示。
- [ ] 页面操作栏集成刷新、列设置。
- [ ] 为兑换码增加“复制到剪贴板”快捷方式。
