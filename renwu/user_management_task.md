# 普通用户管理界面开发任务清单 (User Management Task List)

本文件记录“普通用户管理”功能模块的前端开发进度。经过确认，用户头像仅在微信小程序侧存储，管理后台不显示头像。

## 1. 核心组件开发
- [x] **搜索过滤组件** (`modules/user-search.vue`)
    - [x] 实现昵称 (`nickname`) 输入框搜索。
    - [x] 实现会员等级 (`member_level`) 下拉选择（需包含：全部、free、pro、primeAI）。
    - [x] 实现查询与重置按钮逻辑。
- [x] **表格逻辑封装** (`modules/use-user-table.ts`)
    - [x] 对接 `fetchGetUserList` 接口实现分页加载。
    - [x] 定义表格列结构：
        - [x] ID 与 昵称 展示。
        - [x] OpenID 展示（支持点击复制或适当省略）。
        - [x] 会员等级标签 (`NTag`)，适配不同等级颜色。
        - [x] 会员过期时间格式化。
        - [x] 注册时间格式化。
    - [x] 实现操作列功能：
        - [x] “刷新会员”：调用 `fetchRefreshUserMembership` 并弹出成功提示。
- [x] **主体页面装配** (`index.vue`)
    - [x] 使用 `NCard` 容器包裹。
    - [x] 组合 `user-search` 与 `NDataTable`。
    - [x] 适配全屏高度与响应式间距。

---

## 2. 逐步开发计划 (Step-by-Step Development Plan)

### Step 1: 编写数据驱动逻辑 (`modules/use-user-table.ts`) [DONE]
### Step 2: 编写搜索过滤 UI (`modules/user-search.vue`) [DONE]
### Step 3: 整体页面装配与集成 (`index.vue`) [DONE]
### Step 4: 路由注册与联调验证 [DONE]
- [x] 在 `elegant-router` 自动生成。
- [x] 在 `zh-cn.ts` / `en-us.ts` 注册名称。
- [x] 在 `router/routes/index.ts` 注册权限与图标。
