// 根域 301 到 www（2026-08-31）：localStorage 按源隔离，boboai.tech 与 www.boboai.tech
// 双源各自登录会串账号态（「已登录却显示未登录」的根因之一）。
// 试过 public/_redirects 的 host 级规则——带 Functions 的 Pages 项目上不生效，改在这里做。
// 其余请求原样 next()：静态资源照常、/api/dl 反代不受影响。
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "boboai.tech") {
    url.hostname = "www.boboai.tech";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
