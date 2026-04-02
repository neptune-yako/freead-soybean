# 管理中台 API 对接手册 (Admin API Reference)

所有管理相关接口的基础路径前缀为：`/api/admin`

---

## 1. 认证模块 (Authentication)

### 1.1 管理员登录

- **路径**: `/api/admin/auth/login`
- **方法**: `POST`
- **说明**: 输入账号密码，换取 JWT 权限令牌。

### 1.2 获取当前管理员信息

- **路径**: `/api/admin/auth/me`
- **方法**: `GET`
- **说明**: 获取当前登录管理员的详细资料。

---

## 2. 管理员账户管理 (Admin User Management)

### 2.1 列表：分页获取管理员

- **路径**: `/api/admin/`
- **方法**: `GET`
- **参数 (Query):** `page`, `size`

### 2.2 增加：创建新管理员

- **路径**: `/api/admin/`
- **方法**: `POST`
- **请求体**: `username`, `password`, `full_name`, `is_active`

### 2.3 修改：资料更新或重置密码

- **路径**: `/api/admin/{admin_id}`
- **方法**: `PATCH`

### 2.4 删除：逻辑下线账号

- **路径**: `/api/admin/{admin_id}`
- **方法**: `DELETE`
- **说明**: 禁止管理员删除“自己”。

---

## 3. 前端开发建议 (TS 类型)

```typescript
interface AdminProfile {
  id: number;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

interface AdminCreate {
  username: string;
  password?: string;
  full_name: string;
}
```
