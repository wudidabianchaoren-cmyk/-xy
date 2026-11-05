# 自有域名交付 V32.190

固定入口：https://vvainex.click/ ，兼容入口：https://www.vvainex.click/ 。现有 Cloudflare Pages 项目 xy 承载完整浏览器版本；无需本机作为服务器。原工程和媒体保留。没有开通任何付费套餐。

域名仍在阿里云管理，DNS已委派给 Cloudflare 免费服务。@、www 的 CNAME 均为 xy-crg.pages.dev，代理开启；两项域名验证及 HTTPS 已激活。后续发布仍更新同一个 xy 项目，这两个域名无需反复重新绑定。源码同步到既有 GitHub -xy 的浏览器分支；原 main 仅续接记录。自动 Git 构建保持关闭。

正式发布288ece0f-d0be-4db9-b167-049bff1bd200。54项发布文件哈希一致；正式域名正常浏览器12步完整点击、6段作品影片中点/持续播放和返回流程通过，指定JS/console/HTTP/native错误0。摄影28张图和手记交互本地通过。并不等于无任何bug或所有电脑完全流畅。

本机实体Wi-Fi直连 HTTPS首页200约1.1秒；最终国内4点和海外2点HTTP检查全通过。直接走实体Wi-Fi的完整浏览流程仍在电影美学20秒就绪检查处超时，不能声称全站已通过无VPN性能验收。正常浏览器冷首页约73秒（含36秒原有影片），神话约67秒；速度目标仍未达到。全部失败/限制保留在CURRENT与deploy记录。

重建：python scripts/browser-v179/build-release-v190.py，完成后再stage-cloudflare-v190.py、cloudflare-hashes-v190.mjs；禁止并发读尚未完成的manifest。正式上传仅使用.verify/v32-190/cloudflare/site，官方Wrangler pages deploy，project-name xy，branch main。先检查缺失哈希，增量上传，不重复传3.8GiB。源艺术目录/junction只读。官方文档：https://developers.cloudflare.com/pages/configuration/custom-domains/ 和 https://developers.cloudflare.com/web-analytics/get-started/ 。
