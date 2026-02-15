# API 合同

> 前缀：`/api`
> 鉴权：JWT Session（HttpOnly Cookie）
> 数据格式：JSON
> 日期格式：ISO 8601

## 1. 通用约定

### 1.1 错误码

| HTTP | code | 说明 |
|------|------|------|
| 400 | `INVALID_INPUT` | 参数不合法 |
| 401 | `UNAUTHORIZED` | 未登录 |
| 403 | `FORBIDDEN` | 无权限 |
| 404 | `NOT_FOUND` | 资源不存在 |
| 409 | `CONFLICT` | 资源冲突 |
| 422 | `STATE_INVALID` | 状态不允许该操作 |
| 429 | `RATE_LIMITED` | 频率超限 |
| 500 | `INTERNAL_ERROR` | 服务异常 |

通用错误响应：

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "参数错误"
  }
}
```

---

## 2. 认证（首发）

### POST `/api/auth/register`

- 鉴权：无
- 密码策略：8~72 位，且至少包含 3 类字符（大写字母/小写字母/数字/符号）

请求：

```json
{
  "username": "zhangsan",
  "password": "MyP@ssw0rd",
  "nickname": "张三"
}
```

响应 `201`：

```json
{
  "success": true,
  "user": {
    "id": 2,
    "username": "zhangsan",
    "role": "registered"
  }
}
```

错误：`INVALID_INPUT`、`CONFLICT`、`FORBIDDEN`（注册开关关闭）

### POST `/api/auth/[...nextauth]`

- 鉴权：无
- 用途：用户名密码登录（由 NextAuth credentials provider 处理）
- 防刷：同一 IP 在 1 小时窗口内错误登录超过 20 次后，返回 `429 RATE_LIMITED`

---

## 3. 邀请码

### POST `/api/invite/verify`

- 鉴权：`registered`

请求：

```json
{
  "code": "YIQIDU2026"
}
```

响应 `200`：

```json
{
  "success": true,
  "newRole": "student",
  "message": "恭喜！您的资格已升级"
}
```

错误：

- `CODE_INVALID`
- `CODE_EXPIRED`
- `CODE_EXHAUSTED`
- `ALREADY_STUDENT`
- `RATE_LIMITED`

一致性要求：单事务完成校验、核销、角色升级。

---

## 4. 课堂互动

### POST `/api/interact/sessions`

- 鉴权：`teacher/admin`
- 作用：创建课堂

请求：

```json
{ "title": "第一次课 - 议事规则基础" }
```

响应 `201`：

```json
{ "id": 1, "title": "第一次课 - 议事规则基础", "status": "pending" }
```

### PATCH `/api/interact/sessions/{id}/status`

- 鉴权：`teacher/admin`（创建者或管理者）
- 允许状态：`active`、`ended`

请求：

```json
{ "status": "active" }
```

### GET `/api/interact/sessions/{id}/stream`

- 鉴权：`student+`
- 协议：SSE

事件：`session_updated`、`hand_raised`、`hand_cancelled`、`hand_picked`、`hand_dismissed`、`timer_started`、`timer_stopped`、`timer_timeout`、`vote_started`、`vote_updated`、`vote_result`、`heartbeat`

### POST `/api/interact/sessions/{id}/hand`

- 鉴权：`student+`
- 请求：`{"action":"raise"}` / `{"action":"cancel"}`
- 幂等：重复 `raise` 不重复入队

### POST `/api/interact/sessions/{id}/timer`

- 鉴权：`teacher/admin`
- 请求（兼容字段）：

```json
{ "action": "start", "speakerId": 3, "durationSec": 120 }
```

说明：

- `action` 可取 `start` / `stop`
- `start` 支持 `speakerId`（推荐）或 `userId`（兼容）
- `start` 支持 `durationSec`（推荐）或 `duration`（兼容）

### POST `/api/interact/sessions/{id}/vote`

- 鉴权：`teacher/admin`（create/close），`student+`（cast）

创建：

```json
{
  "action": "create",
  "question": "是否通过修正案？",
  "options": ["赞成", "反对", "弃权"],
  "multiple": false,
  "anonymous": true
}
```

投票：

```json
{
  "action": "cast",
  "pollId": 1,
  "selected": [2]
}
```

说明：

- `selected` 传入 **optionId** 列表（非文案）。

关闭：

```json
{ "action": "close", "pollId": 1 }
```

### POST `/api/interact/sessions/{id}/kick`

- 鉴权：`teacher/admin`
- 作用：将用户移出当前课堂（并同步清理其举手/计时状态）

请求：

```json
{ "userId": 12, "reason": "课堂纪律违规（可选）" }
```

### POST `/api/interact/sessions/{id}/mute`

- 鉴权：`teacher/admin`
- 作用：设置课堂全员禁言开关

请求：

```json
{ "globalMute": true }
```

---

## 5. 作业与反馈

### GET `/api/assignments`

- 鉴权：`student+`
- 返回当前用户作业列表

### POST `/api/assignments`

- 鉴权：`student+`
- 格式：`multipart/form-data`（含附件时）或 `application/json`（纯文本时）
- 附件限制：单文件最大 **10MB**，仅允许 `pdf / docx / doc / jpg / png`

请求：

```json
{
  "lessonId": "rules-1",
  "content": "我的复盘...",
  "file": "(可选附件)"
}
```

### PATCH `/api/assignments/{id}/review`

- 鉴权：`teacher/admin`
- 请求：`{"status":"reviewed"}`

### GET `/api/assignments/{id}/file`

- 鉴权：`student+`
- 作用：下载作业附件
- 权限：学员仅可下载自己的附件；`teacher/admin` 可下载任意学员附件

### POST `/api/feedbacks`

- 鉴权：`student+`

请求：

```json
{
  "classSessionId": 1,
  "rating": 5,
  "content": "课堂节奏很好"
}
```

### GET `/api/feedbacks`

- 鉴权：`teacher/admin`
- 作用：查看反馈列表，支持 CSV 导出

查询参数：

- `classSessionId`（可选）
- `limit`（可选，默认 300，最大 2000）
- `format`（可选，`json`/`csv`，默认 `json`）

---

## 6. 留言讨论与治理

### GET `/api/discussion/posts`

- 鉴权：`student+`
- 返回可见帖子

### POST `/api/discussion/posts`

- 鉴权：`student+`

请求：

```json
{ "title": "关于动议流程", "content": "我有个问题..." }
```

### POST `/api/discussion/comments`

- 鉴权：`student+`

请求：

```json
{ "postId": 12, "content": "我的看法是..." }
```

### POST `/api/admin/moderation/actions`

- 鉴权：`teacher/admin`
- 用途：事后治理（隐藏/删除/封禁）

请求：

```json
{
  "targetType": "comment",
  "targetId": 22,
  "action": "hide",
  "reason": "与课堂无关"
}
```

### GET `/api/admin/moderation/logs`

- 鉴权：`teacher/admin`
- 用途：查询治理日志

查询参数：

- `targetType`（可选）：`post|comment|user`
- `action`（可选）：`hide|delete|block|unblock`
- `limit`（可选，默认 200，最大 1000）

---

## 7. 健康检查

### GET `/api/admin/users`

- 鉴权：`admin`
- 用途：查询用户列表（可选按角色筛选）

查询参数：

- `role`（可选）：`registered|student|teacher|admin|blocked`

### PATCH `/api/admin/users/{id}/role`

- 鉴权：`admin`
- 用途：更新用户角色

请求：

```json
{ "role": "teacher" }
```

### GET `/api/admin/invites`

- 鉴权：`admin`
- 用途：查询邀请码列表

查询参数：

- `status`（可选）：`active|expired|exhausted`

### POST `/api/admin/invites`

- 鉴权：`admin`
- 用途：创建邀请码

请求：

```json
{
  "targetRole": "student",
  "maxUses": 30,
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

### DELETE `/api/admin/invites/{id}`

- 鉴权：`admin`
- 用途：作废邀请码（立即过期）

### GET `/api/admin/settings`

- 鉴权：`admin`
- 用途：查询系统设置（注册开关、公告）

### PATCH `/api/admin/settings`

- 鉴权：`admin`
- 用途：更新系统设置

请求：

```json
{
  "registrationEnabled": true,
  "siteAnnouncement": "本周课堂安排已更新"
}
```

### GET `/api/settings`

- 鉴权：无
- 用途：前台读取公开系统设置（例如注册页公告与注册开关）

---

## 8. 健康检查

### GET `/api/health`

响应 `200`：

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-15T03:00:00.000Z"
}
```

---

## 9. MVP+1（短信相关 API）

- `POST /api/sms/send`
- `POST /api/sms/verify`

> 以上接口仅在短信能力启用后生效，不属于首发强依赖。
