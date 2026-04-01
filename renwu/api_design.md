# 前后端 API 交互结构讨论与设计

经过对 SoybeanAdmin 项目结构的分析，以下是关于 HTTP 请求工具类及业务 API 接口存放位置的讨论与建议方案。

---

## 1. HTTP 请求工具类 (Request Utils)

在本项目中，底层的 HTTP 请求逻辑（基于 Axios 的二次封装）应保持高度内聚，处理通用的拦截、错误提示及 Token 管理。

- **存放位置**：`src/service/request/`
- **核心文件说明**：
  - `index.ts`: **入口文件**。定义了 `request` 实例以及 `get`, `post`, `put`, `delete` 等标准方法。在这里你可以调整请求的 `baseURL` 逻辑。
  - `shared.ts`: 共享逻辑，例如状态码映射、错误处理函数等。
  - **业务逻辑修改点**：
    - 如果你需要将请求拦截器中对“成功”的判定从 `0000` 改为 `200`（根据后端规范），应在 `src/service/request` 的拦截器代码中进行全局调整。

---

## 2. 业务 API 接口 (Business APIs)

业务接口应按照功能模块进行拆分，避免所有接口堆积在一个文件里，提高可测试性与维护性。

- **存放位置**：`src/service/api/`
- **模块化建议**：
  - `auth.ts`: 存放登录、注销、Token 刷新等授权相关接口。
  - `system.ts`: 存放菜单、用户管理、架构配置等系统级接口。
  - **新增业务模块**：例如你的看板业务，可以新建 `dashboard.ts`：
    - 路径：`src/service/api/dashboard.ts`
    - 内容示例：

    ```typescript
    import { request } from '../request';

    /** 获取统计大盘数据 */
    export function fetchQuotaStats() {
      return request.get<Api.Dashboard.QuotaStats>('/quota/stats');
    }
    ```

---

## 3. 类型定义 (Typings)

为了保持 TypeScript 的严谨性（杜绝 `any`），所有的 API 入参和出参类型应有明确定义。

- **存放位置**：`src/typings/api/`
- **建议**：
  - 在这里建立与 API 模块对应的类型声明文件（如 `dashboard.d.ts`），并挂载在全局 `Api` 命名空间下。这样在编写 UI 组件时，可以直接通过类型推导获得后端字段提示。

---

## 4. 总结与行动建议

| 类别                | 推荐存放路径                   | 现有示例                  |
| :------------------ | :----------------------------- | :------------------------ |
| **请求实例/拦截器** | `src/service/request/index.ts` | 项目已内置                |
| **通用请求 Hook**   | `src/service/api/shared.ts`    | -                         |
| **业务模块接口**    | `src/service/api/[module].ts`  | `src/service/api/auth.ts` |
| **API TS 类型**     | `src/typings/api/`             | `src/typings/api.d.ts`    |

**接下来你可以：**

1.  首先在 `src/service/request/index.ts` 中检查拦截器逻辑，确保其能正确解析后端返回的 `code: 200` 为成功状态。
2.  在 `src/service/api/` 下为你即将开发的看板功能创建一个新文件。
