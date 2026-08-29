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

- `src/config.ts`——**全站共享常量**：`VERSION` / `VCODE` / `APK`（由版本号派生）/ `GITHUB`（备用渠道）/ `MIRROR` / `SHA256`。各页面 import 使用，禁止在标记里硬编码版本号。
- `src/layouts/Layout.astro`——HTML 外壳 + 全局样式：设计令牌（`:root` CSS 变量：`--bg/--s1~3`、文字三档 `--ink-1/2/3`、蓝族主色 `--blue` 族、六格辅助色 `--violet/--orange/--gold/--magenta`、语义 `--red/--green`）、`.btn`/`.cell`/`.eyebrow` 等全局类、内联 SVG 雪碧图。新增颜色应复用或扩展这些令牌，不要硬编码十六进制值。
- `src/components/`——共享组件：`Nav.astro`（`variant: "home" | "sub"`；可选 `avatar` prop 显示登录态头像）、`Footer.astro`、`Aurora.astro`（流动极光背景层，`strength: "full" | "soft"`）。
- `src/pages/`——四个页面：
  - `index.astro` 主页：hero、功能 Bento 拼贴、三档等级（订阅按钮 → `/pricing/`）、下载模块（官网直链大按钮 + 二维码 + SHA256 折叠 + 安装指引 + GitHub 降级进「其他下载方式」）
  - `pricing.astro` 订阅页：1月/3月/1年/终身周期切换 + 三档价格联动 + 差价升级说明
  - `login.astro` 登录/注册：登录↔注册、短信↔邮箱双组 radio tab
  - `account.astro` 用户中心：左栏导航 + 账户信息/订阅状态（剩余天数进度条）/激活码记录

页面内容数据驱动：frontmatter 数组（主页 `features`/`tiers`/`faqs`/`stats`，订阅页 `CYCLES`/`TIERS`/`PRICES` 等）+ map 渲染。改文案改数组，不动标记。

交互全部零 JS：折叠用原生 `<details>`，切换用 CSS radio + 兄弟选择器（登录 tab、周期×价格联动）。新增交互先想纯 CSS 方案。

**发新版本流程**：改 `src/config.ts`（VERSION/VCODE/SHA256）→ 按上面 curl 命令拉新 APK（文件名随版本变）→ pricing 价格如有调整同步 `PRICES`。

**已知占位**（代码内有 TODO 注释，待后端/定价就绪替换）：订阅页全部价格与折扣角标、用户中心用户/订阅/订单数据、登录表单接口与协议链接、主页二维码图案（现为手绘占位，正式版换指向 `APK` 直链的真码）。App 侧订阅后端在 `lic.boboai.tech`，网站账号体系后续对接。
