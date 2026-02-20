# Docker 自动 seed 设计（仅在 users 为空时）

## 背景与问题
当前 Docker 部署在第一次启动时数据库为空，登录会提示“用户名或密码错误”。需要在容器启动时自动写入 `smoke_*` 测试账号与邀请码，以便开箱即用。

## 目标
- Docker 启动时，如果 `users` 表为空，则自动 seed `smoke_*` 账号与邀请码。
- 不影响非 Docker 运行模式（本地开发、非容器启动）。
- 支持关闭自动 seed；支持覆盖默认密码哈希与用户名/邀请码。
- 失败即退出，避免“服务可用但账号不存在”的假成功。

## 非目标
- 不改动业务登录逻辑或账号体系。
- 不引入外部依赖或迁移框架变更。
- 不在非 Docker 环境自动 seed。

## 方案选择
采用 **Docker 专用入口脚本**：
- 在 `apps/ecs/scripts/start-standalone.mjs` 中增加 Docker 检测与 seed 逻辑。
- 新增脚本 `seed-smoke-users-if-empty.mjs`，仅在 `users` 为空时写入数据。
- 由 Dockerfile 的 `CMD` 继续调用 `node apps/ecs/server.js`，但前置 seed 在 start 脚本完成。

**理由**：只影响 Docker，行为可控；不侵入业务启动路径。

## 设计细节

### 触发条件
- 判断当前是否运行在 Docker：检测 `/.dockerenv` 或 `/proc/1/cgroup`（出现 `docker`/`containerd` 关键字）。
- 仅当 `AUTO_SEED_SMOKE_USERS` 不是 `0`/`false` 且 `users` 记录数为 0 时执行 seed。

### 数据写入
- 使用 `better-sqlite3` 直接写入 `/app/data/course.db`。
- 默认账户：
  - `smoke_teacher` / `SmokePass123!`
  - `smoke_student` / `SmokePass123!`
  - `smoke_admin` / `SmokePass123!`
  - `smoke_registered` / `SmokePass123!`
- 默认邀请码：`SMOKE2026`
- 密码哈希可由 `SMOKE_PASSWORD_HASH` 覆盖（便于生产环境统一）。
- 账户名与邀请码可由环境变量覆盖（如 `SMOKE_TEACHER_USERNAME`、`SMOKE_INVITE_CODE`）。
- 已存在用户则执行更新（upsert），确保密码/角色一致。

### 失败策略
- 迁移失败或 seed 失败：退出进程（退出码 1）。
- 若 `users` 不为空：记录日志并跳过。

## 配置项
- `AUTO_SEED_SMOKE_USERS=0|false`：禁用自动 seed。
- `SMOKE_PASSWORD_HASH`：覆盖默认密码哈希。
- `SMOKE_*_USERNAME` / `SMOKE_*_PASSWORD` / `SMOKE_INVITE_CODE`：覆盖默认值。

## 测试策略
- 旧数据卷：启动后应提示“skip seed”。
- 新数据卷：首次启动后可使用 `smoke_admin / SmokePass123!` 登录。
- 关闭开关：`AUTO_SEED_SMOKE_USERS=0` 时不 seed。

## 风险与回滚
- 风险：误触发导致覆盖本地数据。
- 缓解：仅 Docker 环境 + 仅 `users` 为空时触发 + 可配置关闭。
- 回滚：移除 start 脚本中的 seed 调用即可。
