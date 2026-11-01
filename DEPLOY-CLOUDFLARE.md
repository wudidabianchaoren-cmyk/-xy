# Cloudflare Pages 发布检查与接入步骤

## 当前结论

适合作为作品集网页前端，不适合作为整个实时 UE 网站的唯一运行环境。当前未部署，未得到可验证的 pages.dev 地址。

现有串流实现独立运行还缺：GPU 服务账号/服务器、HTTPS 后端地址、素材服务地址、WebRTC 公网 ICE/TURN 配置、访客会话隔离与多人测试。当前本机单视口会被不同访客争用，不能当作多人生产服务。不能用指向本机的 Tunnel 来满足个人电脑关机后仍能访问。

另在独立测试副本验证 SimplyStream 的 UE 5.8 浏览器 WebGPU 方案，目标是在访客设备上渲染。此候选方案尚未完成本工程的浏览器画质和全部交互验证；不能用它的项目管理页填作 `UE_BACKEND_ORIGIN`。若验证通过，应新增真实浏览器运行模式和对应部署检查，再接入 Pages。当前只使用已授权的免费兼容测试，不购买 GPU、套餐或额外构建次数。

Pages 单文件上限是25 MiB。当前作品《中秋之夜》约210.2 MiB、《乡土归途》约54.8 MiB、《潮湿东南亚》约205.2 MiB；需要独立素材服务，不删除、不降低这些影片来凑上线。函数转发采用流式响应与 Range 请求，素材仍需独立服务托管，并产生服务端带宽和请求消耗。

## 当前仓库对应的配置

| 设置 | 填写 |
| --- | --- |
| GitHub 仓库 | `Wudidabianchaoren-cmyk/-xy` |
| 生产分支 | `main` |
| 框架预设 | `None` |
| 根目录 | 留空，使用仓库根目录 |
| 构建命令 | `node scripts/build-pages.mjs` |
| 输出目录 | `public` |
| `NODE_VERSION` | `22` |
| `SKIP_DEPENDENCY_INSTALL` | `true` |
| `UE_BACKEND_ORIGIN` | 独立 GPU 服务的真实 HTTPS Origin，例如 `https://render.你的域名`；尚未获得，不能用本机地址或示例代填 |
| `ASSET_ORIGIN` | 独立素材服务的真实 HTTPS Origin；尚未获得 |
| `PORTFOLIO_DEPLOY_READY` | 暂不设置；完成后端、媒体、访客隔离和上线检查后，才设置为 `1` |

不要填 `npm run build`，旧脚本会访问本机 E 盘。正式脚本只用 Node 内置模块复制已编译网页；默认检查独立服务配置及发布状态，未准备好会明确构建失败，阻止缺少功能的网站被发布。

## 一步一步连接

1. 先在 GitHub 仓库的 Code 页面确认有源码文件、`scripts/build-pages.mjs` 和 `functions/[[path]].js`，并核对最新提交。仓库创建不等于上传完成。
2. 登录 Cloudflare，进入 **Workers & Pages → Create application → Pages → Import an existing Git repository**。界面文字随语言可能显示为“连接 Git”。
3. 选择 GitHub，按提示授权 **Cloudflare Workers & Pages** 应用，仅选择这个仓库即可。
4. 选择 `Wudidabianchaoren-cmyk/-xy`，点击 **Begin setup**。
5. 按上表填写分支、框架、根目录、构建命令和输出目录；这一步可以先核对，缺少真实服务地址时先不要执行正式部署。
6. 独立 GPU、素材、ICE/TURN 与访客隔离准备好之后，填写对应环境变量和发布状态，再选择 **Save and Deploy**。
7. 构建成功后，复制 Cloudflare 实际返回的 `https://项目名.pages.dev` 地址。先用免费域名验证，不必购买或绑定自定义域名；不要根据仓库名猜网址。
8. 从公网检查首页、开场影片、资源 Range、桌面实操/五作品切换、神话加载/前后/左右环顾，以及两位访客独立操作。必须在个人电脑关闭本地服务时仍能使用，才符合本次要求。
9. 全部通过后再考虑 Custom domains。后续修改推送到 `main` 会触发新版本，访客只看网站，不获得代码编辑权。

## 官方依据

- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/routing/
