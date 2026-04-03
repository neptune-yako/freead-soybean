# 普通用户管理模块 API 对接手册 (Client User Management)

本模块负责管理小程序端的注册用户，支持搜索、分页以及手动同步会员状态。

基础路径前缀: `/api/v1/admin/user`  
所有接口均需在 Header 中携带 `Authorization: Bearer <token>` (管理员 Token)。

---

## 1. 接口定义 (Endpoints)

### 1.1 获取用户分页列表
- **路径**: `/list`
- **方法**: `GET`
- **说明**: 检索所有普通用户，支持按昵称或会员等级筛选。
- **查询参数 (Query):**
  | 字段名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `page` | `number` | 否 | 页码，默认 1 |
  | `size` | `number` | 否 | 每页数量，默认 20 |
  | `nickname` | `string` | 否 | 用户昵称 (模糊匹配) |
  | `member_level` | `string` | 否 | 会员等级: `free`, `pro`, `primeAI` |

---

### 1.2 获取用户详情
- **路径**: `/{user_id}`
- **方法**: `GET`
- **说明**: 获取指定用户的完整基础资料。
- **路径参数:**
  | 参数名 | 类型 | 说明 |
  | :--- | :--- | :--- |
  | `user_id` | `number` | 用户物理 ID |

---

### 1.3 手动刷新会员状态
- **路径**: `/{user_id}/refresh-membership`
- **方法**: `POST`
- **说明**: 强制触发该用户的会员权益重算逻辑。当发现用户权益与实际订阅不符，或管理员手动干预流水后，可调用此接口同步 `member_expire_at` 缓存字段。
- **路径参数:**
  | 参数名 | 类型 | 说明 |
  | :--- | :--- | :--- |
  | `user_id` | `number` | 用户物理 ID |

---

## 2. 核心数据结构 (Data Models)

### A. 用户管理对象 (UserAdminDTO)
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | `number` | 用户 ID |
| `openid` | `string` | 微信唯一标识 |
| `nickname` | `string` | 昵称 |
| `avatar_url` | `string` | 头像地址 |
| `member_level` | `enum` | 会员等级: `free`, `pro`, `primeAI` |
| `member_expire_at` | `string(datetime)` | **会员到期时间** (ISO格式，如 `2024-12-31T23:59:59`) |
| `created_at` | `string(datetime)` | 注册时间 |

---

## 3. 前端 TypeScript 定义建议

```typescript
/** 会员等级枚举 */
type MemberLevel = 'free' | 'pro' | 'primeAI';

/** 用户列表查询参数 */
interface UserListFilter {
  page?: number;
  size?: number;
  nickname?: string;
  member_level?: MemberLevel;
}

/** 用户管理详情视图 */
interface UserAdminInfo {
  id: number;
  openid: string;
  nickname: string | null;
  avatar_url: string | null;
  member_level: MemberLevel;
  member_expire_at: string | null; // ISO Date String
  created_at: string;
}
```
