// /version.json —— App 内「检查更新」的官网首选源（2026-09-12）：
// 构建期从 config.ts 生成，与站内下载按钮同源，发版只改 config.ts 不会漂移。
// App 侧契约（AppUpdater）：version 带 v 前缀（同 GitHub tag 口径）、apk 是站内相对路径、
// size 字节数（进度条总量用，网络侧 content-length 兜底）。App 拿不到本文件时降级 GitHub Releases。

import { VERSION, VCODE, APK } from "../config";
import fs from "node:fs";
import path from "node:path";

export const GET = () => {
  // size/date 读 APK 实体（public/apk 已 gitignore，本地没拉时置 0/空串——App 用 content-length 兜底）
  let size = 0;
  let date = "";
  try {
    const st = fs.statSync(path.join(process.cwd(), "public", APK.replace(/^\//, "")));
    size = st.size;
    date = st.mtime.toISOString().slice(0, 10);
  } catch { /* 本地没拉 APK（换机/CI）：照样出 version，下载才 404 */ }
  const body = JSON.stringify({ version: VERSION, vcode: VCODE, apk: APK, size, date });
  return new Response(body, { headers: { "content-type": "application/json" } });
};
