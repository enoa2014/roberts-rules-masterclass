# ECS/ESA 拆分（单仓多应用）实施计划

> **给 Claude：** 必须使用 superpowers:executing-plans 子技能按计划执行。

**目标：** 将当前项目拆分为 `apps/ecs`（完整版）与 `apps/esa`（静态裁剪版），并通过共享包复用 UI/内容，同时保证 ECS 可部署、ESA 可静态导出。

**架构：** 采用 npm workspaces 的单仓结构：`apps/*` 为应用，`packages/*` 为共享层。ECS 保持 Next.js 服务端能力；ESA 使用 `output: "export"` 仅保留静态路由与阅读资源。

**技术栈：** Next.js 16、React 19、npm workspaces、Tailwind、Drizzle、Playwright（ECS）。

---

### 任务 1: 工作区脚手架与校验脚本

**涉及文件：**
- 新增： `scripts/verify-workspaces.mjs`
- 修改： `package.json`
- 新增： `apps/ecs/package.json`
- 新增： `apps/esa/package.json`
- 新增： `packages/ui/package.json`
- 新增： `packages/content/package.json`
- 新增： `tsconfig.base.json`

**步骤 1： 写一个会失败的测试**

```js
// scripts/verify-workspaces.mjs
import fs from "node:fs";
import path from "node:path";

const required = [
  "apps/ecs/package.json",
  "apps/esa/package.json",
  "packages/ui/package.json",
  "packages/content/package.json",
  "tsconfig.base.json",
];

const missing = required.filter((p) => !fs.existsSync(path.join(process.cwd(), p)));
if (missing.length > 0) {
  console.error("Missing workspace files:\n" + missing.join("\n"));
  process.exit(1);
}
console.log("Workspace scaffolding OK");
```

**步骤 2： 运行测试确保失败**

运行： `node scripts/verify-workspaces.mjs`
预期： FAIL（提示缺失文件）。

**步骤 3： 最小实现**

```json
// package.json (root)
{
  "name": "yiqidu-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:ecs": "npm --workspace apps/ecs run dev",
    "build:ecs": "npm --workspace apps/ecs run build",
    "start:ecs": "npm --workspace apps/ecs run start",
    "lint:ecs": "npm --workspace apps/ecs run lint",
    "build:esa": "npm --workspace apps/esa run build",
    "verify:workspaces": "node scripts/verify-workspaces.mjs"
  }
}
```

```json
// apps/ecs/package.json
{
  "name": "yiqidu-ecs",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@yiqidu/content": "*",
    "@yiqidu/ui": "*",
    "@tailwindcss/postcss": "^4.1.18",
    "bcryptjs": "^3.0.3",
    "better-sqlite3": "^12.6.2",
    "drizzle-orm": "^0.45.1",
    "lucide-react": "^0.564.0",
    "next": "16.1.6",
    "next-auth": "^4.24.13",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@playwright/test": "^1.58.2",
    "@types/better-sqlite3": "^7.6.13",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.24",
    "drizzle-kit": "^0.31.9",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "^5"
  }
}
```

```json
// apps/esa/package.json
{
  "name": "yiqidu-esa",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "@yiqidu/content": "*",
    "@yiqidu/ui": "*",
    "lucide-react": "^0.564.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.24",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "^5"
  }
}
```

```json
// packages/ui/package.json
{
  "name": "@yiqidu/ui",
  "private": true,
  "main": "index.ts",
  "types": "index.ts",
  "dependencies": {
    "lucide-react": "^0.564.0"
  },
  "peerDependencies": {
    "next": ">=16",
    "react": ">=19",
    "react-dom": ">=19"
  }
}
```

```json
// packages/content/package.json
{
  "name": "@yiqidu/content",
  "private": true,
  "main": "index.ts",
  "types": "index.ts"
}
```

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "baseUrl": "."
  }
}
```

**步骤 4： 运行测试确保通过**

运行： `node scripts/verify-workspaces.mjs`
预期： PASS（输出 `Workspace scaffolding OK`）。

**步骤 5：提交**

```bash
git add scripts/verify-workspaces.mjs package.json apps/ packages/ tsconfig.base.json
git commit -m "chore: add workspace scaffolding"  # 仅在用户允许提交时执行
```

---

### 任务 2: 将 ECS 应用迁入 `apps/ecs`

**涉及文件：**
- 移动： `app/`, `components/`, `lib/`, `styles/`, `public/`, `proxy.ts`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.js`, `drizzle/`, `drizzle.config.ts`, `scripts/`, `tests/`, `types/`, `playwright.config.ts`, `eslint.config.mjs`
- 修改： 根目录 `.gitignore` 路径（如有需要）
- 新增/修改： `apps/ecs/tsconfig.json`

**步骤 1： 写一个会失败的测试**

```bash
npm --workspace apps/ecs run build
```
预期： FAIL（`apps/ecs` 未包含应用）。

**步骤 2： 运行测试确保失败**

运行： `npm --workspace apps/ecs run build`
预期： FAIL.

**步骤 3： 最小实现**

- 将上述 ECS 目录与配置迁入 `apps/ecs/`。
- 调整 `apps/ecs/tailwind.config.js` 的 `content` 扫描路径，确保包含共享 UI：

```js
// apps/ecs/tailwind.config.js（仅展示 content）
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
],
```

- `apps/ecs/postcss.config.mjs` 保持现有内容，仅移动路径。
- 新建 `apps/ecs/tsconfig.json`：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

**步骤 4： 运行测试确保通过**

运行： `npm --workspace apps/ecs run build`
预期： PASS.

**步骤 5：提交**

```bash
git add apps/ecs .gitignore
git commit -m "refactor: move ecs app into apps/ecs"  # 仅在用户允许提交时执行
```

---

### 任务 3: 抽取共享 UI 包

**涉及文件：**
- 新增： `packages/ui/index.ts`
- 移动： `components/theme-provider.tsx`, `components/theme-selector.tsx`, `components/site-nav.tsx`, `components/site-footer.tsx`, `components/page-shell.tsx`, `styles/*.css`, `app/globals.css`
- 修改：ECS 导入路径改为 `@yiqidu/ui`

**步骤 1： 写一个会失败的测试**

```bash
node -e "require('fs').accessSync('packages/ui/index.ts')"
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： `node -e "require('fs').accessSync('packages/ui/index.ts')"`
预期： FAIL.

**步骤 3： 最小实现**

```ts
// packages/ui/index.ts
export * from "./theme-provider";
export * from "./theme-selector";
export * from "./site-nav";
export * from "./site-footer";
export * from "./page-shell";
import "./globals.css";
```

- 将文件迁移到 `packages/ui/` 并将 ECS 的导入从 `@/components/...` 改为 `@yiqidu/ui`。

**步骤 4： 运行测试确保通过**

运行： `node -e "require('fs').accessSync('packages/ui/index.ts')"`
预期： PASS.
运行： `npm --workspace apps/ecs run build`
预期： PASS.

**步骤 5：提交**

```bash
git add packages/ui apps/ecs
git commit -m "refactor: extract shared ui package"  # 仅在用户允许提交时执行
```

---

### 任务 4: Providers / SiteNav 拆分 ECS 与 ESA 版本

**涉及文件：**
- 修改： `packages/ui/providers.tsx`, `packages/ui/site-nav.tsx`
- 新增： `packages/ui/providers-ecs.tsx`, `packages/ui/providers-esa.tsx`
- 新增： `packages/ui/site-nav-ecs.tsx`, `packages/ui/site-nav-esa.tsx`

**步骤 1： 写一个会失败的测试**

```bash
node -e "require('fs').accessSync('packages/ui/providers-esa.tsx')"
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： `node -e "require('fs').accessSync('packages/ui/providers-esa.tsx')"`
预期： FAIL.

**步骤 3： 最小实现**

```tsx
// packages/ui/providers-ecs.tsx
"use client";
import { SessionProvider } from "next-auth/react";
export function ProvidersEcs({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

```tsx
// packages/ui/providers-esa.tsx
"use client";
export function ProvidersEsa({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- 以 `packages/ui/site-nav.tsx` 为基础复制为 `site-nav-esa.tsx`，并按以下规则裁剪：
- 移除 `useSession` / `signOut` 及相关状态与回调
- 移除登录/注册/用户菜单项
- 保留移动端汉堡菜单、滚动变色效果、深色模式样式、`ThemeSelector`、品牌区样式与结构
- 仅保留 ESA 路由链接（`/`, `/course`, `/rules`, `/reading`, `/tools`, `/resources`, `/about`, `/faq`）

**步骤 4： 运行测试确保通过**

运行： `node -e "require('fs').accessSync('packages/ui/providers-esa.tsx')"`
预期： PASS.
运行： `npm --workspace apps/ecs run build`
预期： PASS.

**步骤 5：提交**

```bash
git add packages/ui
git commit -m "refactor: split ecs/esa providers and nav"  # 仅在用户允许提交时执行
```

---

### 任务 5: 建立 ESA 应用骨架（静态导出）

**涉及文件：**
- 新增： `apps/esa/next.config.ts`
- 新增： `apps/esa/tsconfig.json`
- 新增： `apps/esa/tailwind.config.js`
- 新增： `apps/esa/postcss.config.mjs`
- 新增： `apps/esa/app/layout.tsx`
- 新增： `apps/esa/app/(independent)/layout.tsx`

**步骤 1： 写一个会失败的测试**

```bash
npm --workspace apps/esa run build
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： `npm --workspace apps/esa run build`
预期： FAIL.

**步骤 3： 最小实现**

```ts
// apps/esa/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }
};

export default nextConfig;
```

```json
// apps/esa/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

```js
// apps/esa/tailwind.config.js（基于 ECS 版本，仅调整 content，其余配置保持一致）
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
],
```

```js
// apps/esa/postcss.config.mjs（与 ECS 保持一致）
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

```tsx
// apps/esa/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { ProvidersEsa, ThemeProvider, SiteNavEsa, SiteFooter } from "@yiqidu/ui";

export const metadata: Metadata = {
  title: "议起读学习平台",
  description: "议事规则学习与阅读探索平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ThemeProvider>
          <ProvidersEsa>
            <SiteNavEsa />
            <main className="pt-20">{children}</main>
            <SiteFooter />
          </ProvidersEsa>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```tsx
// apps/esa/app/(independent)/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { ProvidersEsa, ThemeProvider } from "@yiqidu/ui";

export const metadata: Metadata = {
  title: "Reading Garden | 阅读花园 - 议起读学习平台",
  description: "沉浸式阅读体验，深度探索文学作品的内涵与价值。",
};

export default function IndependentLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className="font-serif">
        <ThemeProvider>
          <ProvidersEsa>
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20">
              {children}
            </main>
          </ProvidersEsa>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**步骤 4： 运行测试确保通过**

运行： `npm --workspace apps/esa run build`
预期： PASS（静态导出成功）。

**步骤 5：提交**

```bash
git add apps/esa
git commit -m "feat: add esa app skeleton"  # 仅在用户允许提交时执行
```

---

### 任务 6: 添加 ESA 静态路由

**涉及文件：**
- 新增： `apps/esa/app/page.tsx`
- 新增： `apps/esa/app/course/page.tsx`
- 新增： `apps/esa/app/about/page.tsx`
- 新增： `apps/esa/app/faq/page.tsx`
- 新增： `apps/esa/app/rules/page.tsx`
- 新增： `apps/esa/app/resources/page.tsx`
- 新增： `apps/esa/app/tools/page.tsx`
- 新增： `apps/esa/app/reading/page.tsx`
- 新增： `apps/esa/app/(independent)/read/page.tsx`

**步骤 1： 写一个会失败的测试**

```bash
node -e "require('fs').accessSync('apps/esa/app/course/page.tsx')"
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： `node -e "require('fs').accessSync('apps/esa/app/course/page.tsx')"`
预期： FAIL.

**步骤 3： 最小实现**

- 从 ECS 复制页面到 ESA（仅静态展示，不依赖 API）：
- `apps/ecs/app/(main)/page.tsx` -> `apps/esa/app/page.tsx`
- `apps/ecs/app/(main)/course/page.tsx` -> `apps/esa/app/course/page.tsx`
- `apps/ecs/app/(main)/about/page.tsx` -> `apps/esa/app/about/page.tsx`
- `apps/ecs/app/(main)/faq/page.tsx` -> `apps/esa/app/faq/page.tsx`
- `apps/ecs/app/(main)/rules/page.tsx` -> `apps/esa/app/rules/page.tsx`
- `apps/ecs/app/(main)/resources/page.tsx` -> `apps/esa/app/resources/page.tsx`
- `apps/ecs/app/(main)/tools/page.tsx` -> `apps/esa/app/tools/page.tsx`
- `apps/ecs/app/(main)/reading/page.tsx` -> `apps/esa/app/reading/page.tsx`
- `apps/ecs/app/(independent)/read/page.tsx` -> `apps/esa/app/(independent)/read/page.tsx`
- 不创建 `apps/esa/app/reading/[...slug]`（ESA 移除通配路由）。
- 统一修正导入路径（按需逐个调整）：
- 将 `@/components/*` 改为 `@yiqidu/ui`
- 清理 `@/lib/*`、`@/data/*` 等服务端依赖（ESA 不允许）

**步骤 4： 运行测试确保通过**

运行： `node -e "require('fs').accessSync('apps/esa/app/course/page.tsx')"`
预期： PASS.
运行： `npm --workspace apps/esa run build`
预期： PASS（静态导出成功）。

**步骤 5：提交**

```bash
git add apps/esa/app
git commit -m "feat: add esa static routes"  # 仅在用户允许提交时执行
```

---

### 任务 7: 将 `/read` 改为静态客户端跳转

**涉及文件：**
- 修改： `apps/esa/app/(independent)/read/page.tsx`

**步骤 1： 写一个会失败的测试**

```bash
node -e "const fs=require('fs');const f='apps/esa/app/(independent)/read/page.tsx';const s=fs.readFileSync(f,'utf8');if(!s.includes('useEffect')){console.error('missing');process.exit(1);}"
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： 同上
预期： FAIL.

**步骤 3： 最小实现**

```tsx
// apps/esa/app/(independent)/read/page.tsx
"use client";
import { useEffect } from "react";

export default function ReadRedirectPage() {
  useEffect(() => {
    window.location.replace("/reading");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      正在跳转到阅读花园...
    </div>
  );
}
```

**步骤 4： 运行测试确保通过**

运行： 同上
预期： PASS.

**步骤 5：提交**

```bash
git add apps/esa/app/(independent)/read/page.tsx
git commit -m "chore: make read redirect static"  # 仅在用户允许提交时执行
```

---

### 任务 8: 同步 `reading-legacy` 与 `theme-init.js` 到 ESA

**涉及文件：**
- 新增： `scripts/sync-esa-assets.mjs`
- 修改： `apps/esa/package.json`

**步骤 1： 写一个会失败的测试**

```bash
node scripts/sync-esa-assets.mjs
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： `node scripts/sync-esa-assets.mjs`
预期： FAIL.

**步骤 3： 最小实现**

```js
// scripts/sync-esa-assets.mjs
import fs from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), "apps", "ecs", "public", "reading-legacy");
const dst = path.join(process.cwd(), "apps", "esa", "public", "reading-legacy");
const themeInitSrc = path.join(process.cwd(), "apps", "ecs", "public", "theme-init.js");
const themeInitDst = path.join(process.cwd(), "apps", "esa", "public", "theme-init.js");

if (!fs.existsSync(src)) {
  console.error(`[sync] source missing: ${src}`);
  process.exit(1);
}

fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });

function copyDir(from, to) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const dstPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(dstPath, { recursive: true });
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

copyDir(src, dst);
if (fs.existsSync(themeInitSrc)) {
  fs.copyFileSync(themeInitSrc, themeInitDst);
}
console.log("[sync] esa assets copied");
```

```json
// apps/esa/package.json (add build hook)
{
  "scripts": {
    "build": "node ../../scripts/sync-esa-assets.mjs && next build"
  }
}
```

**步骤 4： 运行测试确保通过**

运行： `node scripts/sync-esa-assets.mjs`
预期： PASS（输出 `[sync] esa assets copied`）。

**步骤 5：提交**

```bash
git add scripts/sync-esa-assets.mjs apps/esa/package.json
git commit -m "chore: sync esa assets into esa"  # 仅在用户允许提交时执行
```

---

### 任务 9: 调整 Docker/CI 指向 ECS 工作区

**涉及文件：**
- 修改： `Dockerfile`
- 修改： `docker-compose.yml`
- 修改： `.github/workflows/ci.yml`

**步骤 1： 写一个会失败的测试**

```bash
npm --workspace apps/ecs run build
```
预期： 在 CI/Docker 场景失败（路径仍指向根目录）。

**步骤 2： 运行测试确保失败**

运行： `npm --workspace apps/ecs run build`
预期： FAIL（如果 Docker/CI 未更新）。

**步骤 3： 最小实现**

- Dockerfile 参考改写（示例，按实际产物路径微调）：

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/ecs/package.json ./apps/ecs/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/content/package.json ./packages/content/package.json
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm --workspace apps/ecs run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/ecs/.next/standalone ./
COPY --from=builder /app/apps/ecs/.next/static ./.next/static
COPY --from=builder /app/apps/ecs/public ./public
COPY --from=builder /app/apps/ecs/drizzle ./drizzle
EXPOSE 3000
CMD ["node", "apps/ecs/server.js"]
```

- docker-compose 仍以仓库根为 `context`，确保能访问 `packages/*`。
- 构建后在 `apps/ecs/.next/standalone` 内核对 `server.js` 真实路径，必要时将 `CMD ["node", "apps/ecs/server.js"]` 调整为 `CMD ["node", "server.js"]` 或相应路径。
- CI 命令逐项替换为 workspace 版本（示例）：
- `npm run lint` → `npm --workspace apps/ecs run lint`
- `npm run build` → `npm --workspace apps/ecs run build`
- `npm run db:generate` → `npm --workspace apps/ecs run db:generate`
- `npm run db:push` → `npm --workspace apps/ecs run db:push`
- `npm run start` → `npm --workspace apps/ecs run start`
- `npm run smoke:all` → `npm --workspace apps/ecs run smoke:all`
- `npm run test:e2e:auth` → `npm --workspace apps/ecs run test:e2e:auth`
- `npm run test:e2e:realtime` → `npm --workspace apps/ecs run test:e2e:realtime`
- `npm run test:e2e:core` → `npm --workspace apps/ecs run test:e2e:core`

**步骤 4： 运行测试确保通过**

运行： `npm --workspace apps/ecs run build`
预期： PASS.

**步骤 5：提交**

```bash
git add Dockerfile docker-compose.yml .github/workflows/ci.yml
git commit -m "chore: point ecs build to workspace"  # 仅在用户允许提交时执行
```

---

### 任务 10: 更新文档（双版本构建说明）

**涉及文件：**
- 修改： `README.md`
- 修改： `docs/08-部署与运维手册.md`

**步骤 1： 写一个会失败的测试**

```bash
rg -n "build:esa|apps/esa" README.md docs/08-部署与运维手册.md
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： `rg -n "build:esa|apps/esa" README.md docs/08-部署与运维手册.md`
预期： FAIL.

**步骤 3： 最小实现**

- ECS 命令：`npm run dev:ecs`、`npm run build:ecs`、`npm run start:ecs`。
- ESA 命令：`npm run build:esa`，ESA Pages 根目录 = `apps/esa`，输出 `out/`。

**步骤 4： 运行测试确保通过**

运行： `rg -n "build:esa|apps/esa" README.md docs/08-部署与运维手册.md`
预期： PASS.

**步骤 5：提交**

```bash
git add README.md docs/08-部署与运维手册.md
git commit -m "docs: add ecs/esa build workflow"  # 仅在用户允许提交时执行
```

---

### 任务 11: ESA 静态导出验证

**涉及文件：**
- 无（仅验证）

**步骤 1： 写一个会失败的测试**

```bash
npm --workspace apps/esa run build
```
预期： 若 ESA 页面仍依赖运行时，将失败。

**步骤 2： 运行测试确保失败**

运行： `npm --workspace apps/esa run build`
预期： 若失败，回到前述任务修复。

**步骤 3： 最小实现**

- 修复 ESA 页面中的动态依赖（如仅服务端 API）。

**步骤 4： 运行测试确保通过**

运行： `npm --workspace apps/esa run build`
预期： PASS，产出 `apps/esa/out`。

**步骤 5：提交**

```bash
git add apps/esa
git commit -m "chore: ensure esa static export"  # 仅在用户允许提交时执行
```

---

### 任务 12: 初始化 `packages/content`（导航与文案）

**涉及文件：**
- 新增： `packages/content/index.ts`
- 新增： `packages/content/navigation.ts`
- 修改： `packages/ui/site-nav-ecs.tsx`
- 修改： `packages/ui/site-nav-esa.tsx`

**步骤 1： 写一个会失败的测试**

```bash
node -e "require('fs').accessSync('packages/content/navigation.ts')"
```
预期： FAIL.

**步骤 2： 运行测试确保失败**

运行： `node -e "require('fs').accessSync('packages/content/navigation.ts')"`
预期： FAIL.

**步骤 3： 最小实现**

```ts
// packages/content/navigation.ts
export const navLinksCore = [
  { label: "课程总览", href: "/course" },
  { label: "学习中心", href: "/rules" },
  { label: "阅读探究", href: "/reading" },
  { label: "工具库", href: "/tools" },
  { label: "资源中心", href: "/resources" },
  { label: "关于与报名", href: "/about" },
  { label: "FAQ", href: "/faq" },
];
```

```ts
// packages/content/index.ts
export * from "./navigation";
```

- `site-nav-esa.tsx` 与 `site-nav-ecs.tsx` 统一从 `@yiqidu/content` 读取 `navLinksCore`，只在 ECS 侧额外拼接登录/注册/用户相关菜单。

**步骤 4： 运行测试确保通过**

运行： `node -e "require('fs').accessSync('packages/content/navigation.ts')"`
预期： PASS.

**步骤 5：提交**

```bash
git add packages/content packages/ui
git commit -m "refactor: centralize nav links in content package"  # 仅在用户允许提交时执行
```
