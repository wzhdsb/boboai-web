// ===== 全站共享常量：发新版本只改这里（各页面 import 使用，禁止在标记里硬编码版本号） =====

export const VERSION = "v1.7.0";
export const VCODE = 18;

// 全站下载按钮统一用这一个直链（文件在 public/apk/，已 gitignore，见 CLAUDE.md 获取命令）
export const APK = `/apk/bobo-${VERSION}.apk`;

// 仅下载模块折叠区的备用渠道用
export const GITHUB =
  "https://github.com/wzhdsb/mobile-ai-assistant-releases/releases/latest";

// 国内镜像前缀（App「检查更新 → ⚙ 配置」里填写）
export const MIRROR = "https://ghfast.top/";

// bobo-v1.7.0.apk（17444474 字节）的真实 SHA256；发新版后随 APK 一并更新
// 计算：sha256sum public/apk/bobo-v1.7.0.apk
export const SHA256 =
  "db263918db9ec1a8ed57f04a724624af6bc7689e17122a7c172888568c695901";
