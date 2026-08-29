# boboai-web — BOBO AI 助理官网

BOBO（Mobile AI Assistant，安卓端 AI 助理）的官方主页，托管在 Cloudflare Pages，
自定义域 `boboai.tech` / `www.boboai.tech`。

## 技术

- [Astro](https://astro.build/)（内容优先静态框架，零 JS 运行时）+ 原生 CSS
- 无 UI 框架、无跟踪脚本

## 开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物 dist/
```

## 部署

```bash
npm run build
npx wrangler pages deploy dist --project-name boboai-web
```
