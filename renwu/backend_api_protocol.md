# 前后端通讯协议规范 (Backend API Protocol)

## 1. 通用响应结构 (Standard Result)

后端所有 API 接口均遵循统一的 `Result[T]` 封装结构。前端在 `service/request` 拦截器中应根据此结构进行隐式解包。

```json
{
  "code": 200,      // 业务状态码 (200 表示成功，非 200 表示异常)
  "data": T,        // 业务核心数据 (任意 JSON 类型或 null)
  "msg": "success"  // 提示信息 (成功为 "success" 或自定义，失败为错误详情)
}
```

### 成功示例 (Simple Success)

```json
{
  "code": 200,
  "data": true,
  "msg": "操作已成功"
}
```

---

## 2. 复杂数据模型 (Complex Data)

### A. 字典/对象 (Object)

以财务趋势接口为例：

```json
{
  "code": 200,
  "data": {
    "date": "2026-04-01",
    "total_amount_fen": 12800,
    "paid_order_count": 10
  },
  "msg": "success"
}
```

### B. 列表与分页 (Pagination)

后端分页接口统一返回 `PaginationData` 结构，包含 `items` (数据数组)、`total` (总数)、`page` (当前页码) 和 `size` (页尺寸)。

```json
{
  "code": 200,
  "data": {
    "items": [
      { "id": "ORDER_001", "amount": 100 },
      { "id": "ORDER_002", "amount": 200 }
    ],
    "total": 150,
    "page": 1,
    "size": 10
  },
  "msg": "success"
}
```

---

## 3. 异常处理规范 (Error Handling)

当 `code !== 200` 时，前端拦截器应截获异常并触发 **Naive UI** 的全局提示。

| 常见错误码 | 含义                      | 建议前端行为                       |
| :--------- | :------------------------ | :--------------------------------- |
| **401**    | 未登录 / Token 过期       | 清理缓存，跳转至 `/login` 页面     |
| **403**    | 权限不足 (非管理员)       | 弹出警告，限制操作权限             |
| **400**    | 参数校验失败              | 局部 Form 报错或全局 Message 提醒  |
| **500**    | 后端逻辑奔溃 / 数据库异常 | 弹出“服务器繁忙”提示，引导重新加载 |

---

## 4. 前端 Axios / Soybean 解包建议

基于 SoybeanAdmin 的架构，建议在 `src/service/request/index.ts` 的 `transformBackendResponse` 中进行如下处理：

1.  **自动解包**：若 `code === 200`，直接返回 `res.data` 给调用侧。
2.  **错误捕获**：若 `code !== 200`，将 `msg` 作为错误文本抛出，由统一错误处理器（`showErrorMessage`）展示。
3.  **类型闭环**：利用 TypeScript 的泛型 `Result<T>` 确保 `data` 的类型提示在解包后依然精准。

> [!IMPORTANT]
> **业务层准则**：
> 严禁在具体的 `.vue` 页面中编写 `if (res.code === 200)`。只要 `await` 成功拿到的值，必定是 `T` 类型的业务数据。
