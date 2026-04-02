# 管理员管理页面开发文档 (Admin Management Page Dev Doc)

本页面主要用于“超级管理员”对系统后台账号进行增删改查（CRUD）操作，包括基础资料管理与密码重置。

## 1. 目标与范围 (Objective & Scope)

- **功能**: 管理员列表展示、姓名/账号搜索、新增管理员、修改管理员资料、修改管理员角色、重置/修改密码、逻辑删除。
- **目标用户**: 仅限 `role_code` 为 `super_admin` 的账户访问。
- **技术栈**: Vue 3 (Setup), Naive UI, Pinia, elegant-router.

---

## 2. 页面设计 (UI/UX)

### 2.1 布局结构
- **顶部搜索栏**: 包含“用户名”、“姓名”输入框，以及“查询”和“重置”按钮。
- **操作栏**: 包含“新增”按钮。
- **数据表格**: 展示 ID、用户名、姓名、角色、状态、创建时间及操作列。
- **弹窗表单**: 用于新增/编辑管理员，包含即时校验逻辑。

### 2.2 核心组件
- 使用 `NCard` 作为容器。
- 使用 `NDataTable` 处理分页与列表。
- 使用 `NModal` + `NForm` 处理新增与编辑。

---

## 3. 接口集成 (API Integration)

基于 [admin.ts](file:///d:/data/xianYu/freead-soybean/soybean-admin/src/service/api/admin.ts) 中的以下接口：
- `fetchGetAdminList`: 分页获取列表。
- `fetchCreateAdmin`: 提交新账号信息。
- `fetchUpdateAdmin`: 部分更新资料或角色。
- `fetchDeleteAdmin`: 手动触发逻辑删除。

---

## 4. 路由与权限 (Routing & Permission)

- **路径**: `/management/admin`
- **组件**: `src/views/management/admin/index.vue`
- **权限校验**:
  - 路由 `meta.roles` 必须包含 `['super_admin']`。
  - 权限通过 `router.beforeEach` 守卫进行拦截，未授权用户将被重定向至 403 页面。

---

## 5. 开发路线图 (Roadmap)

1. **路由注册**: 创建视图文件，并在 `customRoutes` 中配置 `super_admin` 权限。 [x]
2. **列表实现**: 完成基础 Table 渲染与分页查询。 [x]
3. **编辑功能**: 实现新增/修改弹窗。 [x]
4. **安全加固**: 增加删除确认提醒，防止误操作。 [x]

---

## 6. 详细开发步骤 (Development Steps)

### Step 6: 权限校验 (Permissions)
- [x] 验证 `elegant-router` 自动生成的路由信息。
- [x] 在 `src/router/routes/index.ts` 中递归注入 `meta: { roles: ['super_admin'] }`。
