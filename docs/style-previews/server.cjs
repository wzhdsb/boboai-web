// 风格预览本地服务器：在 docs/style-previews 目录下运行 node server.js
// 然后浏览器访问 http://localhost:4322/ （Ctrl+C 停止）
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4322;
const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found: " + urlPath);
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log("风格预览服务已启动: http://localhost:" + PORT + "/");
});
