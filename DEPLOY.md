# Docker 打包与阿里云 ECS 部署准备（Next.js + SQLite）

本项目已改为 **生产多阶段 Docker 打包**（`next build` + `next start`）。
目标是：

1. 镜像只包含运行所需内容（不带 tests/docs/node_modules 源码树等无关文件）。
2. 运行时数据（`data/uploads/logs`）通过卷挂载持久化。
3. 可以直接用于下一步阿里云 ECS 部署。

## 1. 打包策略（已落地）

### 1.1 运行镜像仅保留必要文件
- `Dockerfile` 使用 4 阶段：
  - `deps`：安装依赖
  - `builder`：执行 `next build`
  - `prod-deps`：仅安装生产依赖（`npm ci --omit=dev`）
  - `runner`：仅复制：
    - `.next`
    - `public`
    - `package.json`
    - 生产依赖 `node_modules`
- 启动命令：`npm run start`
- 运行用户：`nextjs`（非 root）

### 1.2 构建上下文剔除无关文件
`.dockerignore` 已排除以下内容（示例）：
- `.git`、`.next`、`node_modules`
- `docs`、`archive`、`res`
- `tests`、`playwright-report`、`test-results`
- `data`、`logs`、`uploads`（避免本地数据被打进镜像）
- 本地说明与临时文件（`TEST_ACCOUNTS.local.md` 等）

### 1.3 Compose 使用持久化卷
`docker-compose.yml` 已改为命名卷：
- `yiqidu_data:/app/data`
- `yiqidu_uploads:/app/uploads`
- `yiqidu_logs:/app/logs`

不再绑定宿主机源码目录，避免把“网站运行无关文件”带入运行环境。

### 1.4 启动自动迁移（SQLite）
- 应用启动时会自动执行 `drizzle/` 目录下的迁移（一次性、幂等）。
- 这可避免新机器/新卷首次启动时出现“缺表导致登录失败”等问题。
- 如需临时关闭（一般不建议），可设置：

```env
SKIP_DB_MIGRATIONS=1
```

## 2. 必备环境变量

建议使用 `.env.production`（不要提交到仓库）：

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-long-random-secret
DATABASE_URL=file:/app/data/course.db
AUTH_RATE_LIMIT_TRUST_PROXY_HEADERS=1
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
NODE_ENV=production
PORT=3000
```

`AUTH_RATE_LIMIT_TRUST_PROXY_HEADERS=1` 仅建议在服务运行于受控反向代理（Nginx/SLB/Ingress）之后时开启，用于让登录限流按真实客户端 IP 生效。

可选短信变量（如需）：

```env
ALI_SMS_ACCESS_KEY=
ALI_SMS_ACCESS_SECRET=
ALI_SMS_SIGN_NAME=
ALI_SMS_TEMPLATE_CODE=
```

## 3. 本地验证（部署前）

### 3.1 构建镜像

```bash
docker build -t yiqidu-learning-platform:latest .
```

### 3.2 启动容器（推荐 compose）

```bash
docker compose up -d
```

### 3.3 健康检查

```bash
curl -fsS http://127.0.0.1:3000/api/health
```

### 3.4 查看镜像体积

```bash
docker images | grep yiqidu-learning-platform
```

## 4. 阿里云 ECS 部署建议

推荐流程：**本地构建 -> 推送 ACR -> ECS 拉取运行**

### 4.1 推送到阿里云 ACR（示例）

```bash
# 登录 ACR（按你控制台给出的地址）
docker login --username=<your-username> <your-registry>

# 打 tag
docker tag yiqidu-learning-platform:latest <your-registry>/yiqidu/yiqidu-learning-platform:latest

# 推送
docker push <your-registry>/yiqidu/yiqidu-learning-platform:latest
```

### 4.2 ECS 上拉取并运行（示例）

```bash
docker pull <your-registry>/yiqidu/yiqidu-learning-platform:latest

docker run -d \
  --name yiqidu-app \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file /opt/yiqidu/.env.production \
  -v yiqidu_data:/app/data \
  -v yiqidu_uploads:/app/uploads \
  -v yiqidu_logs:/app/logs \
  <your-registry>/yiqidu/yiqidu-learning-platform:latest
```

推荐在生产环境将容器端口仅绑定到宿主机回环地址（`127.0.0.1`），由 Nginx/SLB 统一对外暴露，避免应用容器被公网直连时伪造代理头。

## 5. 运行期注意事项

1. 若使用 SQLite，建议单机部署（或明确主从策略），避免多实例并发写同一文件库。
2. 生产应通过 Nginx/SLB 提供 HTTPS，`NEXTAUTH_URL` 必须是最终外网域名。
3. 升级镜像前先备份卷数据（至少 `yiqidu_data` 和 `yiqidu_uploads`）。

## 6. 本次 Docker 化涉及文件

- `Dockerfile`：生产多阶段最小镜像
- `.dockerignore`：构建上下文瘦身
- `docker-compose.yml`：命名卷与运行方式
