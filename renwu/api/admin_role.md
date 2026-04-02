# 管理员角色分级 (RBAC) 前后端接入说明

为了支持更精细的权限控制（如：超级管理员 vs 普通运营），后端已在 `admin` 领域集成了 `role_code` 体系。

---

## 1. 认证令牌变更 (JWT Payload)

登录成功后返回的 `access_token` 中现在包含 **`role_code`** 声明。

**解码后的示例 Payload:**
```json
{
  "sub": "admin_user",
  "user_id": 1,
  "role": "admin",          // [保持兼容] 旧版权限标识
  "role_code": "super_admin" // [新增] 用于对接 Soybean Admin 的权限标识
}
```

> [!TIP]
> **前端适配建议：**
> 在 Soybean Admin 的 `src/store/modules/auth` 中，获取到用户资料后，直接将 `role_code` 映射到前端路由 meta 信息的 `roles` 数组中。

---

## 2. 接口响应与请求变更 (API Changes)

### 2.1 获取管理员资料 (Profile)
- **接口**: `GET /api/admin/auth/me`
- **新增字段**:
  - `role_code`: `string` —— 标识该用户的原始角色码。

### 2.2 管理员账户操作 (CRUD)
- **新增管理员**: `POST /api/admin/`
  - 请求体可传 `role_code`: `string` (可选，默认为 `operator`)。
- **修改管理员**: `PATCH /api/admin/{id}`
  - 支持修改角色的 `role_code`。

---

## 3. 标准角色定义预览 (Implementation Progress)

目前后端系统主要识别以下角色：

| 标识符 (`role_code`) | 角色名称 | 权限预估 |
| :--- | :--- | :--- |
| `super_admin` | **超级管理员** | 拥有财务补单、账号管理、系统运维的所有权限。 |
| `operator` | **普通运营** | 查看大盘统计、配置阅读器样式、处理用户反馈。 |

---

## 4. 前端类型定义 (TypeScript)

```typescript
/** 管理员角色枚举 */
type AdminRole = 'super_admin' | 'operator';

interface AdminProfile {
  id: number;
  username: string;
  role_code: AdminRole; // 新增核心字段
  is_active: boolean;
  // ... 其他现有字段
}
```
