# 前后端联调与 API 冒烟手册

> 目标：让前后端联调可以直接开工，并提供一键冒烟验证主流程。

## 1. 联调前准备

1. 初始化数据库迁移：

```bash
npm run db:push
```

2. 准备冒烟账户与邀请码（可重复执行）：

```bash
npm run smoke:seed
```

3. 启动服务：

```bash
NEXTAUTH_SECRET=dev-smoke-secret NEXTAUTH_URL=http://127.0.0.1:3000 npm run dev
```

## 2. 冒烟脚本

## 2.1 一键执行

```bash
npm run smoke:all
```

发布后最小回归可直接执行：

```bash
npm run verify:release
```

默认目标为 `http://127.0.0.1:38080`，可通过 `RELEASE_VERIFY_BASE_URL` 覆盖。

默认会执行：

1. `npm run smoke:seed`
2. `node scripts/smoke-api.mjs`
3. `node scripts/smoke-auth-rate-limit.mjs`

## 2.2 脚本覆盖的业务链路

1. 未登录直访 `/reading-legacy/index.html` 被重定向（受控入口验证）
2. 登录（teacher/student/registered）
3. registered 使用邀请码升级 student
4. teacher 创建课堂并开始
5. teacher 开启/关闭全员禁言
6. student 连接 SSE、举手
7. teacher 发言计时 start/stop
8. teacher 发起投票，student 投票，teacher 关闭投票
9. student 提交作业（multipart + 附件），teacher 批阅
10. student 提交课堂反馈
11. teacher 查询反馈列表并导出 CSV
12. student 发帖与评论，teacher 执行治理（hide comment）
13. teacher 查询治理日志
14. teacher 踢出学员，被踢学员后续举手应返回 403
15. teacher 结束课堂
16. 同一测试 IP 连续 21 次错误登录，第 21 次返回 `429`
17. admin 查询用户、更新角色、创建并作废邀请码
18. admin 查询并保存系统设置（注册开关、站点公告）

## 2.3 可配置环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `SMOKE_BASE_URL` | `http://127.0.0.1:3000` | 目标服务地址 |
| `SMOKE_TEACHER_USERNAME` | `smoke_teacher` | 冒烟教师账号 |
| `SMOKE_TEACHER_PASSWORD` | `SmokePass123!` | 冒烟教师密码 |
| `SMOKE_ADMIN_USERNAME` | `smoke_admin` | 冒烟管理员账号 |
| `SMOKE_ADMIN_PASSWORD` | `SmokePass123!` | 冒烟管理员密码 |
| `SMOKE_STUDENT_USERNAME` | `smoke_student` | 冒烟学员账号 |
| `SMOKE_STUDENT_PASSWORD` | `SmokePass123!` | 冒烟学员密码 |
| `SMOKE_REGISTERED_USERNAME` | `smoke_registered` | 冒烟待升级账号 |
| `SMOKE_REGISTERED_PASSWORD` | `SmokePass123!` | 冒烟待升级密码 |
| `SMOKE_INVITE_CODE` | `SMOKE2026` | 冒烟邀请码 |
| `SMOKE_ALLOW_NON_LOCAL` | `false` | 默认仅允许对本地地址执行冒烟；设为 `true` 才允许非本地目标 |

## 2.4 Playwright E2E（页面级联调）

> API 冒烟通过只说明接口主流程可用，不代表页面交互一定正确。E2E 负责补齐页面级验证。

1. 先构建：

```bash
npm run build
```

2. 执行稳定用例（认证 + 建课）：

```bash
npm run test:e2e:auth
```

3. 执行实时互动用例（建课 -> 开始课堂 -> 举手 -> 点名 -> 停止）：

```bash
npm run test:e2e:realtime
```

4. 全量执行：

```bash
npm run test:e2e
```

5. 执行核心回归套件（桌面 + 移动）：

```bash
npm run test:e2e:core
```

6. 直接对线上环境执行核心回归（默认 `https://tongxy.xyz`）：

```bash
npm run test:e2e:prod
```

如果需要对其他环境执行，使用：

```bash
E2E_BASE_URL=https://your-domain.com \
  npx playwright test tests/e2e/platform-regression.spec.ts \
  --project=chromium --project=mobile-chromium --reporter=line
```

说明：

1. `auth-create.spec.ts` 是稳定回归用例，适合每次提交必跑。
2. `interact-realtime.spec.ts` 涉及 SSE 实时链路，已加入回退逻辑（短超时失败后 reload 再校验），建议在 CI 保留重试。
3. `platform-regression.spec.ts` 覆盖登录、主题切换、移动端菜单滚动锁、阅读书籍运行时加载（全书）。
4. 当指定 `E2E_BASE_URL` 时，Playwright 不会启动本地 `webServer`，且默认以单 worker 串行执行，避免线上登录限流干扰。
5. 测试前会自动执行 `smoke:seed` 保证账户与邀请码存在（仅本地目标）。

---

## 3. 前端联调关键信息

## 3.1 统一鉴权约束

1. API 全部依赖 NextAuth 会话 Cookie（HttpOnly）。
2. `/api/interact/*`、`/api/assignments*`、`/api/discussion*`、`/api/feedbacks` 都需要登录。
3. 角色要求：
- `student+`：学习区、互动区、作业、讨论。
- `teacher/admin`：课堂控制、作业批阅、治理操作。

## 3.2 错误响应格式

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "无权限访问"
  }
}
```

前端约定处理：

1. `401`：跳转 `/login`
2. `403`：显示无权限提示
3. `422`：显示状态冲突提示（例如课堂已结束）
4. `500`：显示通用错误并提供重试
5. `429`：显示“尝试次数过多，请稍后再试”，并短时禁用登录按钮

---

## 4. 互动接口联调（FE-B4）

## 4.1 查询课堂列表

- `GET /api/interact/sessions?status=active`

成功：

```json
{
  "success": true,
  "sessions": [
    {
      "id": 1,
      "title": "第一次课",
      "status": "active",
      "createdBy": 2,
      "createdAt": "2026-02-15 06:00:00",
      "endedAt": null
    }
  ]
}
```

## 4.2 创建课堂（teacher/admin）

- `POST /api/interact/sessions`

```json
{
  "title": "第一次课 - 议事规则基础"
}
```

成功：`201` 返回课堂对象。

## 4.3 课堂状态切换

- `PATCH /api/interact/sessions/{id}/status`

```json
{
  "status": "active"
}
```

状态仅支持：`active` / `ended`。

## 4.4 举手

- `POST /api/interact/sessions/{id}/hand`

```json
{
  "action": "raise"
}
```

`action` 支持：`raise` / `cancel`。

## 4.5 计时

- `POST /api/interact/sessions/{id}/timer`

```json
{
  "action": "start",
  "speakerId": 3,
  "durationSec": 120
}
```

```json
{
  "action": "stop"
}
```

## 4.6 投票

创建：

- `POST /api/interact/sessions/{id}/vote`

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
  "selected": [1]
}
```

关闭：

```json
{
  "action": "close",
  "pollId": 1
}
```

## 4.7 踢人与全员禁言（teacher/admin）

踢出学员：

- `POST /api/interact/sessions/{id}/kick`

```json
{
  "userId": 3,
  "reason": "课堂纪律违规（可选）"
}
```

全员禁言：

- `POST /api/interact/sessions/{id}/mute`

```json
{
  "globalMute": true
}
```

---

## 5. SSE 事件联调（FE-B4 核心）

连接：

- `GET /api/interact/sessions/{id}/stream`
- Header: `Accept: text/event-stream`

服务端事件：

1. `connected`
2. `snapshot`
3. `session_updated`
4. `hand_raised`
5. `hand_cancelled`
6. `hand_picked`
7. `hand_dismissed`
8. `timer_started`
9. `timer_stopped`
10. `vote_started`
11. `vote_updated`
12. `vote_result`
13. `heartbeat`

前端建议：

1. EventSource 断开时自动重连。
2. 每次收到 `snapshot` 全量覆盖本地状态。
3. 增量事件用于动画和提示，不作为唯一状态源。

---

## 6. 作业/反馈/讨论联调（FE-B5）

## 6.1 作业列表与提交

1. `GET /api/assignments`
2. `POST /api/assignments`

JSON 提交：

```json
{
  "lessonId": "rules-1",
  "content": "我的复盘"
}
```

Multipart 提交：

- 字段：`lessonId`、`content`、`file`
- 文件限制：10MB，`pdf/docx/doc/jpg/png`

## 6.2 作业批阅（teacher/admin）

- `PATCH /api/assignments/{id}/review`

```json
{
  "status": "reviewed"
}
```

## 6.2.1 作业附件下载

1. `GET /api/assignments/{id}/file`
2. 学员仅可下载自己的附件，教师/管理员可下载任意学员附件

## 6.3 反馈

- `POST /api/feedbacks`

```json
{
  "classSessionId": 1,
  "rating": 5,
  "content": "课堂节奏很好"
}
```

## 6.4 讨论区

1. `GET /api/discussion/posts`
2. `POST /api/discussion/posts`
3. `GET /api/discussion/comments?postId=12`
4. `POST /api/discussion/comments`

---

## 7. 管理治理联调（FE-B6）

- `POST /api/admin/moderation/actions`

```json
{
  "targetType": "comment",
  "targetId": 22,
  "action": "hide",
  "reason": "与课堂无关"
}
```

管理设置：

1. `GET /api/admin/settings`
2. `PATCH /api/admin/settings`

规则：

1. `targetType=post/comment` 仅支持 `hide/delete`
2. `targetType=user` 仅支持 `block/unblock`
3. 所有治理动作写入 `moderation_logs`

---

## 8. 前端联调验收清单

1. `registered -> invite -> student` 链路可走通。
2. 互动课堂完整链路可走通（举手、计时、投票、结束课堂）。
3. SSE 断线重连后能够恢复状态。
4. 作业、反馈、讨论、治理均可闭环。
5. 错误态（401/403/422/500）均有 UI 提示。
6. `npm run test:e2e:auth` 持续通过。
7. `npm run test:e2e:realtime` 本地可通过，CI 允许重试。
