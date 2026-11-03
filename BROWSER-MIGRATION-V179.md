# Superseded checkpoint: V32.180 browser release is now published

Read CURRENT-V32-180-RESUME.md and deploy/browser-v180-release.json. Historical failures below remain as evidence and do not replace the newer release record. Native originals remain preserved; renderer / loading limits are still disclosed.

---

# 浏览器迁移 V32.179：原版保留，候选版未发布

用户允许迁移为浏览器版本，条件是不明显降低质感、不损失完整交互。这个条件尚未全部通过，不能将候选版合入原版或发布为完整成品。

原版 UE 工程和 app 源码未修改。原版优化已经保存在 main 的 e17e93bf7406976aebc8b2f88e737e753c2fd323；Netlify记录在 e479fef。候选版位于独立 worktree `cinematic-ai-archive-browser`，分支 `deploy/netlify-browser-v179`，不是第二个仓库。

## 已实现和验证

- 桌面9个机位、海湾6个机位的原版1920×1080光照/昼夜采样，配合同一真实浏览器几何和深度遮挡；活动影片和物件仍由原交互代码控制。
- 捕获时核对真实 native scene、已应用的相机位置与目标，避免把旧帧误存为当前场景。错误场景的旧采样已隔离，不作为资产使用。
- 预先上传派生纹理到GPU并编译着色器，避免拖动时才上传。原模型、原始纹理及工程资产不覆盖、不减面、不降分辨率。
- 桌面五张碟片、三本书、电视近看/返回、窗外/物件近看摄像机通过局部运行检查。碟片的内容切换改为到达后发生。手机实际弹出流程未完成回归，不能将调用近看摄像机当作手机功能通过。
- 采样使用静态 Python http.server 8050；桌面和海湾均无本机UE HTTP请求，nativeController=false。无采样的页面异常/着色器错误/HTTP错误。
- 桌面6秒影片样本181帧、0掉帧，RAF中位6.9ms、P95 13.8ms、最大20.8ms（首次回归样本）。后续结果见本地 `room-regression.json`，不能承诺所有机器恒定或全站零卡顿。
- 海湾局部运行约55–93FPS（RTX4060 / D3D11，本机短样本），±15度环顾、小屋日夜切换可运行，不作为画质通过结论。
- 30张光照图以WebP无损封装，61,721,781字节降至29,653,216字节。每张解码RGBA逐字节核对相等；没有缩图、有损压缩或重绘。`assets/browser-v179/packing-verification.json` 保存像素SHA256。

## 尚未达到的质量条件

海湾仍有海天衔接、树叶轮廓、船帆阴影和动态反射差异；桌面部分偏轴视角有投影接缝，日历纸张和移动物件受光仍与原版存在差别。投影光照是验证方法，不代表已完成与UE相同的实时渲染。水面投影含静态反射成分，不能称全部反射均为实时。

完整主站/作品子页/手机/跨页面的浏览器模式统一、脱离原生服务的整站检查及大影片公网传输均未完成。只手工加 renderer=web 的两个局部页面不是完整部署。

## 本地查看

- 原版： http://127.0.0.1:8031/v31.html?v=32.178
- 画质对照： http://127.0.0.1:8050/.verify/v32-179/visual-review.html
- 桌面候选： http://127.0.0.1:8050/directory.html?renderer=web&nativeLightfield=1&v=179
- 海湾候选： http://127.0.0.1:8050/mythology.html?renderer=web&nativeLightfield=1&v=179

这些是电脑本地预览，电脑关机不可访问。Netlify完整公网部署仍未完成。原Netlify不完整draft未晋升；自动Git构建已停止，避免源代码推送触发不完整发布。预算为全年总计20元，未购买任何资源，停止其他平台部署。

## 继续时

先读原项目 `CURRENT-V32-179-RESUME.md`、候选 `.verify/v32-179/*-result.json`、`room-regression.json` 和此记录。不要重做原艺术/安装引擎/恢复隔离CLI/盲重传3GB包。不要继续把每个深度/纹理微调当作画质通过；先解决明确可见差异、再做单个局部回归。质量未通过前禁止自动发布。

构建：`node scripts/build-v161-ui.mjs` 和 `node scripts/build-v165.mjs`。作者采样与验证脚本在 `scripts/browser-v179`，仅用于本地原生参考采样；Node/UE服务不得成为最终浏览器访问依赖。原始媒体仍按既有约定不入代码仓库。
