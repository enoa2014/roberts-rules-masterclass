# Gemini 3 Pro 前端交接包

> 用途：把前端任务清晰交给 Gemini 3 Pro，减少反复沟通。
> 适用范围：仅前端页面、组件、交互与 API 对接；不修改后端业务规则。

## 1. 前端任务边界

- 负责：UI 页面、组件拆分、交互、响应式适配、前端校验、错误提示、前端状态管理。
- 不负责：数据库 schema、核心业务事务、鉴权规则设计、部署脚本。
- 所有接口以 `docs/04-API合同.md` 为准。

---

## 2. 页面交付清单

## 2.1 公开页

1. `/` 首页
2. `/course` 课程总览
3. `/about` 关于与报名
4. `/faq` FAQ
5. `/login` 登录
6. `/register` 注册

## 2.2 资格与学习页

1. `/invite` 邀请码页
2. `/rules` 与 `/rules/[slug]`
3. `/reading`（嵌入容器页）
4. `/tools` 与 `/tools/[slug]`
5. `/resources`

## 2.3 互动与课后

1. `/interact`
2. `/interact/[sessionId]`
3. `/homework`
4. `/homework/submit/[lessonId]`
5. `/discussion`

## 2.4 管理页

1. `/admin`
2. `/admin/users`
3. `/admin/invites`
4. `/admin/sessions`
5. `/admin/assignments`
6. `/admin/moderation`

---

## 3. 组件级交付要求

| 组件 | 最低要求 |
|------|---------|
| 登录表单 | 用户名密码校验、错误提示、loading 状态 |
| 邀请码输入卡 | 成功/失败反馈、重试入口 |
| 课堂控制面板 | 开始/结束课堂、发起投票、计时控制 |
| 举手队列 | 入队顺序、本人状态标识、刷新后恢复 |
| 投票组件 | 单选/多选、重复提交覆盖提示 |
| 作业提交表单 | 文本、附件、提交状态 |
| 留言列表 | 发帖、评论、分页或懒加载 |
| 治理操作条 | 隐藏/删除/封禁按钮 + 二次确认 |

---

## 4. UI/UX 约束

1. 以移动端优先（微信内浏览）设计。
2. 页面必须在 375px 和 1440px 下可用。
3. 统一错误反馈文案，不直接暴露原始错误栈。
4. 受限页面要有“未获得资格”引导态。
5. 禁止把权限判断只放在前端，前端仅做体验层提示。

---

## 5. API 对接规范

1. 请求失败统一处理：401 跳登录、403 显示无权限、429 显示重试倒计时。
2. 提交类操作默认防重复点击（按钮 loading + 禁用）。
3. SSE 断开自动重连，并在重连后主动拉一次状态快照。
4. 统一请求封装：`request.ts` + `api/*` 模块化。

---

## 6. 代码组织建议

```text
app/
components/
  auth/
  invite/
  interact/
  homework/
  discussion/
  admin/
lib/
  api/
  hooks/
  types/
  utils/
styles/
```

---

## 7. 交付格式要求（给 Gemini）

每次提交必须包含：

1. 变更文件列表。
2. 页面截图（桌面 + 手机）。
3. 与 API 合同对应关系说明（调用了哪些接口）。
4. 可复现的手工测试步骤。
5. 已知问题与未完成项。

---

## 8. 分批交付计划（建议）

| 批次 | 页面范围 | 依赖 |
|------|---------|------|
| FE-B1 | `/login` `/register` `/invite` | 认证 API |
| FE-B2 | `/` `/course` `/about` `/faq` | 无 |
| FE-B3 | `/rules` `/tools` `/resources` `/reading` | 内容数据与阅读嵌入 |
| FE-B4 | `/interact` `/interact/[sessionId]` | 互动 API + SSE |
| FE-B5 | `/homework` `/discussion` | 作业/反馈/讨论 API |
| FE-B6 | `/admin/*` | 管理 API |

---

## 9. 可直接给 Gemini 3 Pro 的提示词模板

## 9.1 单批次页面实现模板

```text
你是高级前端工程师。请在 Next.js 15 App Router 项目中实现以下页面：
- 批次：FE-Bx
- 页面：<列出路由>

硬性约束：
1) 严格遵循 docs/02-信息架构与路由权限清单.md
2) API 仅按 docs/04-API合同.md 对接
3) 移动端优先，兼容 375px 与 1440px
4) 所有提交按钮需防重复点击
5) 输出变更文件列表、关键代码、手工测试步骤

请先给出文件结构，再给出代码。
```

## 9.2 互动页面实现模板

```text
请实现 /interact 与 /interact/[sessionId] 页面：
- 教师端：开始/结束课堂、点名发言、计时控制、发起/关闭投票
- 学员端：举手、投票、实时状态查看
- 使用 EventSource 对接 SSE，断线自动重连
- 按 docs/05-课堂互动状态机.md 实现状态映射

输出：
1) 组件拆分图
2) 关键状态管理代码
3) 关键异常处理代码
4) 手工测试清单
```

## 9.3 管理页面实现模板

```text
请实现 /admin/* 页面：
- users/invites/sessions/assignments/moderation
- 权限不足时做前端提示并回退
- 操作按钮都需要二次确认（删除/封禁）

请输出：
- 完整页面代码
- API 调用封装
- 角色场景测试步骤（teacher vs admin）
```

---

## 10. 验收标准（Gemini 交付）

1. 页面可运行，无阻断错误。
2. 与 API 合同字段一致，无私自改字段。
3. 关键交互有 loading/empty/error 状态。
4. 关键流程可按 `docs/07-测试计划与用例.md` 复现通过。
5. 提交内容可被 Codex 直接合并并联调。
