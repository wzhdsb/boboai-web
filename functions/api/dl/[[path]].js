// GET /api/dl/daemon-v0.2.3/boboai-setup-0.2.3.exe
//   → https://github.com/wzhdsb/mobile-ai-assistant-releases/releases/download/daemon-v0.2.3/boboai-setup-0.2.3.exe
//
// 为什么要有这层：GitHub 资产域不给跨源 CORS 头，网页 fetch 拿不到 ReadableStream，
// 就做不了安装卡片上的真进度条。同源反代后流式透传，下载多少字节页面知道多少。
// 走 Cloudflare 边缘，国内比 GitHub 直连稳。白名单只放行本仓 release 资产，防被当公共代理。
export async function onRequestGet(context) {
  const parts = context.params.path ?? [];
  const tail = (Array.isArray(parts) ? parts.join("/") : parts);
  // 白名单：daemon-v<版本>/boboai-setup-<版本>.exe 或 boboai-daemon-windows-x64.zip
  if (!/^daemon-v[0-9.]+\/boboai-(setup-[0-9.]+\.exe|daemon-windows-x64\.zip)$/.test(tail)) {
    return new Response("Not Found", { status: 404 });
  }
  const upstream = await fetch(
    `https://github.com/wzhdsb/mobile-ai-assistant-releases/releases/download/${tail}`,
    { redirect: "follow" }
  );
  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream Error", { status: 502 });
  }
  const h = new Headers();
  const len = upstream.headers.get("content-length");
  if (len) h.set("content-length", len);
  h.set("content-type", "application/octet-stream");
  h.set("content-disposition", `attachment; filename="${tail.split("/").pop()}"`);
  h.set("cache-control", "public, max-age=3600");
  return new Response(upstream.body, { status: 200, headers: h });
}
