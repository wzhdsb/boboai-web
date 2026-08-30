# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指引。

## 项目是什么

BOBO AI 助理（安卓端 AI 助理 App）的官方网站。基于 Astro 的静态多页站点——客户端零 JS、无 UI 框架、无跟踪脚本。全站文案为简体中文（`lang="zh-CN"`）。视觉为浅色 Bento 网格风格（暖白底 + 流动极光），设计配方沉淀在 `.claude/skills/web-style-recipes/SKILL.md`；`docs/style-previews/` 是定稿前的风格稿存档（含本地画廊 `server.cjs`，端口 4322）。

## 常用命令

```bash
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 静态产物输出到 dist/
npm run preview  # 本地预览构建产物

# APK 直链文件（public/apk/ 已 gitignore，换机或发新版后重新拉取，可加 ghfast.top/ 前缀加速）
curl -sL -C - -o public/apk/bobo-v1.7.0.apk \
  "https://github.com/wzhdsb/mobile-ai-assistant-releases/releases/download/v1.7.0/MobileAIAssistant-v1.7.0.apk"

# 部署（Cloudflare Pages，项目名 boboai-web，自定义域 boboai.tech / www.boboai.tech）
npm run build && npx wrangler pages deploy dist --project-name boboai-web
```

没有测试，也没有配置 lint。

## 结构

- `src/config.ts`——**全站共享常量**：`VERSION` / `VCODE` / `APK`（由版本号派生）/ `GITHUB`（备用渠道）/ `MIRROR` / `SITE` / `LIC`（账号后端，dev 指本地 wrangler），以及网页版一组 `DAEMON*`。各页面 import 使用，禁止在标记里硬编码版本号。
- `src/layouts/Layout.astro`——HTML 外壳 + 全局样式：设计令牌（`:root` CSS 变量：`--bg/--s1~3`、文字三档 `--ink-1/2/3`、蓝族主色 `--blue` 族、六格辅助色 `--violet/--orange/--gold/--magenta`、语义 `--red/--green`）、`.btn`/`.cell`/`.eyebrow` 等全局类、内联 SVG 雪碧图。新增颜色应复用或扩展这些令牌，不要硬编码十六进制值。
- `src/components/`——共享组件：`Nav.astro`（`variant: "home" | "sub"`；`ctaLabel` 传空串隐藏右侧按钮；登录态是运行时渐进增强——组件尾部内联脚本读本机 `bobo_token`+`bobo_email`，右上角换成「首字母头像 + 邮箱」胶囊链到 `/account/`，无 JS/未登录维持登录按钮）、`Footer.astro`、`Aurora.astro`（流动极光背景层，`strength: "full" | "soft"`）。
- `src/pages/`——四个页面：
  - `index.astro` 主页：hero、功能 Bento 拼贴、三档等级（订阅按钮 → `/pricing/`）、下载模块（官网直链大按钮 + 构建期生成的真二维码〔`qrcode` 包，frontmatter 出 SVG，指向 `SITE+APK`〕+ 安装指引 + GitHub 降级进「其他下载方式」）
  - `pricing.astro` 订阅页：1月/3月/1年/终身周期切换 + 三档价格联动 + 差价升级说明
  - `login.astro` 登录/注册：邮箱+密码 v1（fetch `LIC` 的 `/auth/login`/`/auth/register`，成功 token 存 localStorage 跳 `/account/`；登录↔注册 tab 仍是 CSS radio）
  - `account.astro` 用户中心：未登录出引导卡；登录后左栏导航 + 账户信息/订阅状态（剩余天数进度条，按名下生效授权取到期最晚的一条）/激活码绑定（`/auth/bind`）与记录——数据全部来自 `/auth/me`
  - `admin.astro` 管理台（站长自用，不进导航/页脚，`noindex` 不进搜索引擎）：密钥门 → POST `LIC` 的 `/admin/users`（Bearer `ADMIN_KEY`）拉注册用户+名下激活码+汇总卡，本地按邮箱筛选；密钥存 localStorage（key `bobo_admin`，与用户会话 `bobo_token` 分开）

页面内容数据驱动：frontmatter 数组（主页 `features`/`tiers`/`faqs`/`stats`，订阅页 `CYCLES`/`TIERS`/`PRICES` 等）+ map 渲染。改文案改数组，不动标记。

交互全部零 JS：折叠用原生 `<details>`，切换用 CSS radio + 兄弟选择器（登录 tab、周期×价格联动）。新增交互先想纯 CSS 方案。

**零 JS 约定的两处豁免**：
- `src/pages/app.astro`（2026-08-30，网页版本地大脑页）：fetch 用户本机 daemon（`config.ts` 的 `DAEMON`）拉自选行情并 10s 轮询，页面隐藏时暂停。产品形态决定的（数据在用户机器上，静态站拿不到）。
- `src/pages/login.astro` 与 `src/pages/account.astro`（2026-08-31，账号两页）：表单提交/数据拉取要连自有后端 `lic.boboai.tech`（license-server，`config.ts` 的 `LIC`），纯 CSS 做不了。token 存 localStorage（key `bobo_token`）。`admin.astro` 管理台同属此类（连 `/admin/users`，密钥 key `bobo_admin`）。

除以上四页外继续零 JS；`Nav.astro` 尾部另有一段全站内联微脚本做登录态展示（读 localStorage 换头像胶囊，纯渐进增强，无 JS 时站点完整可用）。新增页面想带脚本，要么连用户本机资源、要么像账号页一样是「连自有后端的表单/数据页」，其余不批。

**发新版本流程**：改 `src/config.ts`（VERSION/VCODE）→ 按上面 curl 命令拉新 APK（文件名随版本变）→ pricing 价格如有调整同步 `PRICES`。

**已知占位**（待后端/定价就绪替换）：订阅页全部价格与折扣角标、账号体系的手机号+短信通道（`users` 表已留扩展位，等 ICP 备案确认后接短信服务商）。账号后端就是 App 的订阅后端 license-server（`lic.boboai.tech`，仓库在 `../license-server`，契约见其 `API.md`）：邮箱+密码注册登录、会话 token、激活码绑定到账号已实现（2026-08-31，本地验证通过），`/admin/generate` 发码后用户可自助在用户中心绑码。线上库要先跑 `schema.sql` + 给 licenses 补列的 ALTER 迁移再部署。
