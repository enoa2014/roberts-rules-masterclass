# 全站文案重写 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 全站（ECS + ESA）文案重写为面向教师/家长培训的温和稳健口径，清除敏感表达并保持一致性。

**Architecture:** 以“敏感词清单 + 分层重写”为主线，先改共享组件与核心页面，再覆盖课程与剩余页面，最终通过全局扫描与构建验证。

**Tech Stack:** Next.js 16、React 19、TypeScript、npm workspaces

---

### Task 1: 建立敏感词扫描基线

**Files:**
- Modify: （无）

**Step 1: 写出“失败用例”扫描（预期应命中）**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆|公民参与" apps packages
```
Expected: 有多处命中（当前文案包含敏感词）。

**Step 2: 记录命中范围**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆|公民参与" apps packages | tee /tmp/copy-rewrite-baseline.txt
```
Expected: 生成基线清单 `/tmp/copy-rewrite-baseline.txt`。

**Step 3: 无实现（仅基线）**

**Step 4: 无验证**

**Step 5: 无提交**

---

### Task 2: 更新共享组件与全局文案（UI/导航/页脚）

**Files:**
- Modify: `packages/ui/site-footer.tsx`
- Modify: `packages/content/navigation.ts`（如有需要）
- Modify: `packages/ui/site-nav-ecs.tsx`
- Modify: `packages/ui/site-nav-esa.tsx`

**Step 1: 写出失败用例（应命中）**

Run:
```bash
rg -n "公民|公民素养|民主|for democracy|盛典|节庆" packages/ui packages/content
```
Expected: 命中页脚文案与部分导航词。

**Step 2: 运行验证（应失败）**

Expected: 仍有敏感词命中。

**Step 3: 最小实现（文案替换）**

在 `packages/ui/site-footer.tsx` 中替换关键文案：

```tsx
// 旧：推广罗伯特议事规则，帮助青少年提升公共议事能力与公民素养...
// 新：
<p className="text-blue-100 leading-relaxed max-w-md">
  面向教师与家长的规则化沟通培训，帮助提升课堂表达、协作与共识形成能力。
  通过系统课程与模拟练习，让课堂讨论更有序、反馈更可执行。
</p>

// 旧：培养具备议事能力的公民，推动民主参与文化的发展
// 新：
<p className="text-sm text-blue-100 leading-relaxed">
  支持教师与家长建立清晰沟通规则，提升课堂协作与家校配合效果。
</p>

// 旧：Made with ... for democracy
// 新：
<span className="font-mono text-xs">for learning</span>
```

如需统一导航口径，在 `packages/content/navigation.ts` 与 `packages/ui/site-nav-ecs.tsx` / `packages/ui/site-nav-esa.tsx` 中确保说明聚焦“课堂沟通/协作/培训”。

**Step 4: 运行验证（应通过）**

Run:
```bash
rg -n "公民|公民素养|民主|for democracy|盛典|节庆" packages/ui packages/content
```
Expected: 无命中。

**Step 5: 提交**

```bash
git add packages/ui/site-footer.tsx packages/ui/site-nav-ecs.tsx packages/ui/site-nav-esa.tsx packages/content/navigation.ts
git commit -m "copy: refresh shared navigation and footer copy"
```

---

### Task 3: 重写首页文案（ECS）

**Files:**
- Modify: `apps/ecs/components/pages/home-page-content.tsx`

**Step 1: 写出失败用例（应命中）**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆" apps/ecs/components/pages/home-page-content.tsx
```
Expected: 命中多处文本。

**Step 2: 运行验证（应失败）**

Expected: 仍有敏感词命中。

**Step 3: 最小实现（替换关键段落）**

建议按以下原则替换（保持结构不变，替换文案）：

**英雄区（示例）**
- “成为行动公民/激活公民力量/精准公民参与/沉淀公民表达力”
  → “成为高效沟通者/提升协作意识/提升课堂参与/沉淀表达能力”
- “掌握公共议事规则 / 提升公民核心素养”
  → “掌握议事规则 / 提升课堂沟通与协作素养”

**副标题（示例）**
- “加入这场公民议事的盛大节庆…成为积极参与的行动公民”
  → “加入面向教师与家长的规则培训…将课堂表达与协作落地”

**特色功能区（示例）**
- “节庆/盛典/公民”相关描述
  → “课程体系/学习活动/课堂协作训练/家校沟通支持”

**学习路径（示例）**
- “行动公民/公民议事节庆”
  → “课堂协作训练/规则表达进阶”

**CTA 区域（示例）**
- “加入节庆/公民”相关句
  → “加入课程/加入训练/加入共学”

**可直接替换的示例文案：**
```tsx
// 示例：英雄区副标题（默认主题）
<>
  从理论学习到课堂演练，全方位掌握罗伯特议事规则。
  <br className="hidden md:block" />
  面向教师与家长的系统培训，支持更清晰的表达与协作。
</>
```

**Step 4: 运行验证（应通过）**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆" apps/ecs/components/pages/home-page-content.tsx
```
Expected: 无命中。

**Step 5: 提交**

```bash
git add apps/ecs/components/pages/home-page-content.tsx
git commit -m "copy: rewrite ecs home page copy"
```

---

### Task 4: 同步首页文案（ESA）

**Files:**
- Modify: `apps/esa/components/pages/home-page-content.tsx`

**Step 1: 写出失败用例（应命中）**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆" apps/esa/components/pages/home-page-content.tsx
```
Expected: 命中多处文本。

**Step 2: 运行验证（应失败）**

Expected: 仍有敏感词命中。

**Step 3: 最小实现（与 ECS 文案对齐）**

将 `apps/ecs/components/pages/home-page-content.tsx` 中已替换的新文案完整同步到 ESA 版本，确保两个版本一致。

**Step 4: 运行验证（应通过）**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆" apps/esa/components/pages/home-page-content.tsx
```
Expected: 无命中。

**Step 5: 提交**

```bash
git add apps/esa/components/pages/home-page-content.tsx
git commit -m "copy: align esa home page copy"
```

---

### Task 5: 重写课程页文案（ECS + ESA）

**Files:**
- Modify: `apps/ecs/components/pages/course-page-content.tsx`
- Modify: `apps/esa/components/pages/course-page-content.tsx`

**Step 1: 写出失败用例（应命中）**

Run:
```bash
rg -n "公民|公民参与|行动公民|节庆" apps/ecs/components/pages/course-page-content.tsx apps/esa/components/pages/course-page-content.tsx
```
Expected: 命中多处文本（含课程名与描述）。

**Step 2: 运行验证（应失败）**

Expected: 仍有敏感词命中。

**Step 3: 最小实现（替换关键段落与课程名）**

替换示例（两端一致）：

- “与数百名节庆参与者一同成长为行动公民”
  → “与更多教师与家长共同成长，强化课堂沟通能力”
- “激发公民参与热情/提升公民参与效率”
  → “提升课堂协作意识/提升课堂协作效率”
- 课程名：
  - “公民参与实践” → “课堂协作实践”
  - 课程描述相应改为课堂协作/家校沟通场景

**Step 4: 运行验证（应通过）**

Run:
```bash
rg -n "公民|公民参与|行动公民|节庆" apps/ecs/components/pages/course-page-content.tsx apps/esa/components/pages/course-page-content.tsx
```
Expected: 无命中。

**Step 5: 提交**

```bash
git add apps/ecs/components/pages/course-page-content.tsx apps/esa/components/pages/course-page-content.tsx
git commit -m "copy: rewrite course page copy for ecs and esa"
```

---

### Task 6: 覆盖剩余页面与元信息

**Files:**
- Modify: `apps/ecs/app/**/page.tsx`
- Modify: `apps/esa/app/**/page.tsx`
- Modify: 其他命中敏感词的组件或配置文件

**Step 1: 写出失败用例（应命中）**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆" apps/ecs apps/esa packages
```
Expected: 仍有命中。

**Step 2: 运行验证（应失败）**

Expected: 仍有敏感词命中。

**Step 3: 最小实现（逐页替换）**

逐页调整，统一为“教师/家长培训”“课堂沟通与协作”“规则化表达”口径。
重点检查页面元信息（`title`/`description`）与页面标题/副标题。

**Step 4: 运行验证（应通过）**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆" apps/ecs apps/esa packages
```
Expected: 无命中。

**Step 5: 提交**

```bash
git add apps/ecs apps/esa packages
git commit -m "copy: complete sitewide copy rewrite"
```

---

### Task 7: 构建验证与交付提交

**Files:**
- Modify: （无）

**Step 1: 写出失败用例（构建前不执行）**

**Step 2: 运行验证（构建）**

Run:
```bash
npm --workspace apps/ecs run build
npm --workspace apps/esa run build
```
Expected: 均为 PASS。

**Step 3: 无实现**

**Step 4: 再次全局敏感词扫描**

Run:
```bash
rg -n "公民|公民素养|民主|行动公民|议事盛典|节庆" apps/ecs apps/esa packages
```
Expected: 无命中。

**Step 5: 提交**

```bash
git status -sb
git commit -m "chore: verify copy rewrite build" || true
```
