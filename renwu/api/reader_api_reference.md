# 阅读器配置模块 API 对接手册 (Reader Config API Reference)

所有管理与查询阅读器配置相关的接口基础路径为：`/api/admin/reader`

---

## 1. 客户端逻辑 (Client/Page Usage)

### 1.1 分组拉取：按组名获取配置清单

- **路径**: `/api/admin/reader/configs/{group_name}`
- **方法**: `GET`
- **备注**: 客户端请求时携带 `only_visible=true` 参数。

---

## 2. 管理中台逻辑 (Admin CRUD Management)

### 2.1 列表：分页查询配置项

- **路径**: `/api/admin/reader/configs`
- **方法**: `GET`
- **参数**: `skip`, `limit` (默认 0, 20)

### 2.2 增加：创建新的配置

- **路径**: `/api/admin/reader/configs`
- **方法**: `POST`

### 2.3 修改：更新现有配置信息

- **路径**: `/api/admin/reader/configs/{config_id}`
- **方法**: `PATCH`

### 2.4 删除：逻辑移除配置

- **路径**: `/api/admin/reader/configs/{config_id}`
- **方法**: `DELETE`

---

## 3. 前端消费核心逻辑 (Parsed Value)

- **核心字段**: `parsed_value`
- **说明**: 该字段由后端根据 `value_type` 自动转换类型。若 type 为 `json`，则 `parsed_value` 已解析为 JS 对象，无需再次 `JSON.parse`。
