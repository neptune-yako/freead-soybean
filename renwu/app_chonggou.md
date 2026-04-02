# Role
你是一个精通 Vue 3, Vite 和 TypeScript 的高级前端架构师，深度理解 Soybean Admin 开源项目的前端工程化最佳实践。

# Context
当前项目中存在一个过于庞大的全局声明文件 `src/typings/app.d.ts`（约 700+ 行），所有的全局命名空间（Theme, Global, I18n, Service）都被强耦合在一起。这导致了极高的 Git 协作冲突风险，且代码可读性不断下降。

# Goal
运用 TypeScript 的“声明合并（Declaration Merging）”特性，将现有的单一庞大声明文件按领域横向拆解为 4 个独立职责的 `.d.ts` 文件。拆分后的文件需统一存放在 `src/typings/app/` 文件夹下。

### 📂 目标目录结构
```text
src/typings/
  ├── app/
  │   ├── theme.d.ts   (包含 App.Theme 命名空间)
  │   ├── global.d.ts  (包含 App.Global 命名空间)
  │   ├── i18n.d.ts    (包含 App.I18n 命名空间)
  │   └── service.d.ts (包含 App.Service 命名空间)
  └── ... (其他原有 .d.ts)
```

# Execution Steps & Rules

### 1. 领域拆分规则
- **`src/typings/app/theme.d.ts`**: 提取 `App.Theme` 下的所有内容（ColorPaletteNumber, ThemeSetting 等）。
- **`src/typings/app/global.d.ts`**: 提取 `App.Global` 下的所有内容（Menu, Tab, FormRule 等）。
- **`src/typings/app/i18n.d.ts`**: 提取 `App.I18n` 下的所有内容（Schema, I18nKey, $T 等）。
- **`src/typings/app/service.d.ts`**: 提取 `App.Service` 下的所有内容（Response, ServiceConfig 等）。

### 2. 关键约束 (Strict Constraints)
- **绝对不要改变原有的业务字段和层级结构**，确保拆分前后全局调用的类型推导 100% 一致。
- **声明合并写法**：每一个拆分出的文件都必须以外层 `declare namespace App { ... }` 作为包裹。
- **保留引用依赖**：确保所有的内联类型导入（如 `import('vue').VNode`）完整迁移，不得遗漏。
- **环境清理**：**⚠️ 重要：** 拆分完成后，必须物理删除原有的 `src/typings/app.d.ts` 以防止类型冲突。

### 3. 环境与验证
- 修改完成后，需确类型推导在 `.vue` 文件中依然正常提示。
- 建议重启 Vite 开发服务器以强制刷新 TS Server 缓存。

# Output Format
请使用 Markdown 代码块分别输出这 4 个文件的完整 TS 代码，文件之间请用分隔线隔开，并标明物理路径。

---

# Execution Workflow (Step-by-Step)

### 第 1 步：环境准备
- 在终端执行命令创建目标存放目录：`mkdir -p src/typings/app`
- 确保 IDE（如 VS Code）处于正常运行状态，以便实时监测类型纠错。

### 第 2 步：创建并注入新声明文件
- 按照上述代码块，依次创建：
  - `src/typings/app/theme.d.ts`
  - `src/typings/app/global.d.ts`
  - `src/typings/app/i18n.d.ts`
  - `src/typings/app/service.d.ts`
- **注意：** 此时由于 `src/typings/app.d.ts` 依然存在，IDE 可能会报“重复定义”错误，这是正常现象。

### 第 3 步：物理删除旧文件
- 确认新文件内容无误后，删除原有庞大文件：`rm src/typings/app.d.ts`
- **此时重复定义报错应立即消失。**

### 第 4 步：全量类型验证 (Smoke Test)
- 运行命名：`pnpm typecheck`
- 随机打开一个业务页面（如 `src/views/home/index.vue`），检查 `App.Theme` 等类型是否能正常跳转。

### 第 5 步：环境重启
- 终止当前的 `pnpm dev` 进程。
- 清除可能存在的缓存并重启：`pnpm dev`