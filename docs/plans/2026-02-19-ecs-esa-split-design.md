# ECS/ESA 双版本改造设计（同仓分目录/子应用）

## Goal
在同一仓库内同时维护两套产物：
- ECS 完整版：保留全部动态功能与 API。
- ESA 裁减版：保留纯静态展示与阅读相关页面，不依赖后端运行时。

## Approach
采用方案 2A：单仓分目录/子应用（`apps/ecs` + `apps/esa`），通过 `packages/*` 共享 UI 与内容。

## Repository Structure
- `apps/ecs/`：完整 Next.js 应用（现有 `app/`、`components/`、`lib/` 迁入）
- `apps/esa/`：静态展示应用（裁剪路由）
- `packages/ui/`：共享 UI 组件与样式（主题系统 + globals）
- `packages/content/`：共享文案、导航与静态配置

## Toolchain
- 采用 **npm workspaces**，保持当前 `package-lock.json`，不迁移 pnpm。
- 暂不引入 Turborepo/Nx，先用 npm scripts 编排构建。
- 统一 `tsconfig.base.json`，各 app 继承并修复 `@/` 路径别名指向各自 `src/`。

## ECS Version
- 构建：`next build` + `next start`
- 部署：继续使用 Docker/ECS（维持当前链路）
- 路由/功能：保留现有全部能力

## ESA Version
### 保留路由
- 展示页：`/`、`/course`、`/about`、`/faq`、`/rules`、`/resources`、`/tools`
- 阅读页：`/reading`、`/read`
- 静态站：`public/reading-legacy/**`

### 移除/禁用
- `login/register/invite/profile`
- `admin/*`
- `interact*`
- `homework`
- `discussion`
- `style-lab`（开发/风格实验页，ESA 不保留）
- 所有 `/api/*`

### 数据来源
- 纯静态文案（`packages/content`）
- 静态 JSON（`packages/content` 或 `apps/esa/public/data`）

### 构建
- `apps/esa` 启用静态导出：`output: "export"`
- 产物目录作为 ESA Pages 部署目录（配置 `esa.jsonc` 或控制台）

## Navigation & Access
- ESA 不提供裁剪功能入口
- 被裁剪路由无需重定向，直接 404

## Shared Component Adaptation
- `components/providers.tsx`：拆分为 `ProvidersEcs`（含 `SessionProvider`）与 `ProvidersEsa`（纯客户端，无 next-auth 依赖）。
- `components/site-nav.tsx`：拆分为 `SiteNavEcs`（含 `useSession`/`signOut`）与 `SiteNavEsa`（静态导航，仅保留 ESA 路由）。
- `components/interact/*`：仅保留在 ECS（ESA 直接移除）。

## Route Groups
- `(independent)` 路由组（`/read`）需要在 `apps/esa` 中保留独立 `layout.tsx`。
- ESA 版的 `layout.tsx` 必须使用 `ProvidersEsa`，禁止引入 `SessionProvider`。

## Styles & Themes
- `app/globals.css` 与主题 CSS（festival/mint/charcoal/copper）迁入 `packages/ui`，由两端 app 统一 import。
- `ThemeProvider`/`ThemeSelector` 作为共享组件保留在 `packages/ui`。
- `public/theme-init.js` 归属主题系统，需同步到 `apps/esa/public/`。

## Reading Assets
- `public/reading-legacy/**` 需同步到 `apps/esa/public/reading-legacy`
- 使用构建前脚本或复制流程保持一致

## Static Export Compatibility
- ESA 不保留 `reading/[...slug]`（当前实现依赖 `redirect()`，与 `output: \"export\"` 不兼容）。
- `/read` 需改为静态页面或客户端重定向到 `/reading`。

## Data Directory
- 根目录 `data/` 为 ECS 运行期数据库与备份目录，不纳入 `packages/content` 或 ESA 产物。

## ESA CI/CD
- ESA Pages 使用 GitHub 构建：Root Dir 指向 `apps/esa`，产物目录为 `out/`。
- ECS 继续使用现有 CI（lint/build/smoke/e2e）。
- 同仓双流水线：ECS 走 GitHub Actions，ESA 走 ESA Pages 集成。

## Testing & Acceptance
- ECS：维持现有 `lint/build/smoke/e2e` 流程
- ESA：
  - 静态构建成功
  - 以上保留路由可访问
  - 被裁剪路由 404
  - `public/reading-legacy/**` 静态可访问

## Risks & Mitigations
- 共享组件必须去除任何服务端依赖（NextAuth/headers/cookies），通过 ECS/ESA 版本拆分解决
- ESA 构建失败应阻断裁剪版发布
- 共享文案与导航通过 `packages/content` 统一，避免版本漂移
