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

// 网页版（/app）连的本机 daemon 地址。当前直连 127.0.0.1（Chrome 对回环地址的混合内容
// 有豁免）；daemon 签好证书上 443 后切 https://local.boboai.tech（DNS 已指 127.0.0.1）
export const DAEMON = "http://127.0.0.1:48080";

// 本地大脑安装包：存 GitHub Releases（Pages 免费档单文件 25MB 上限装不下）。
// 网页主链路走同源反代 /api/dl/（functions/api/dl，流式透传 + 进度条数据源）；
// ghfast 镜像只做折叠区备用——该域名被 Chrome Safe Browsing 整域标红（误报）。
const DAEMON_VER = "0.2.3";
const DAEMON_ASSET =
  `https://github.com/wzhdsb/mobile-ai-assistant-releases/releases/download/daemon-v${DAEMON_VER}/`;
// 一键安装器：网页卡片用同源反代（下载进度条），直链与镜像留作折叠区备用
export const DAEMON_SETUP_DL = `/api/dl/daemon-v${DAEMON_VER}/boboai-setup-${DAEMON_VER}.exe`;
export const DAEMON_SETUP_MIRROR = `https://ghfast.top/${DAEMON_ASSET}boboai-setup-${DAEMON_VER}.exe`;
export const DAEMON_SETUP_GITHUB = `${DAEMON_ASSET}boboai-setup-${DAEMON_VER}.exe`;
// 手动 zip（高级备用）：解压到任意目录双击 exe
export const DAEMON_ZIP_MIRROR = `https://ghfast.top/${DAEMON_ASSET}boboai-daemon-windows-x64.zip`;
export const DAEMON_ZIP_GITHUB = `${DAEMON_ASSET}boboai-daemon-windows-x64.zip`;
