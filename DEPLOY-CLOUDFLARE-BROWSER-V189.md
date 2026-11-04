# V189 delivery

Build `python scripts/browser-v179/build-release-v189.py`, then `python scripts/browser-v179/stage-cloudflare-v189.py`. New stage is `.verify/v32-189/cloudflare/site`; root local stage `.verify/v32-189/site`. Never deploy raw repository root. Preserve all older immutable namespaces for cached visitors.

Hash `node scripts/browser-v179/cloudflare-hashes-v189.mjs`, upload missing only `python scripts/browser-v179/cloudflare-upload-v189.py`. Credentials stay in official ignored Wrangler config. Optional per-process `CF_UPLOAD_PROXY=http://127.0.0.1:9674` uses already configured proxy without changing system settings. If OAuth401, official Wrangler whoami refreshes existing authorization; don't repeatedly open login.

Official Wrangler4.157.0 executable: `C:/Users/HP/AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js`. From staged Cloudflare directory run `node <wrangler> pages deploy . --project-name xy --branch repair-v189 --commit-hash <application SHA> --commit-dirty=true`, verify preview, then same command branchmain. Production Git builds remain disabled. Account0424e885f532f4b1ade3fe9216ddc64c.

QA: existing `verify-public-flow-v186.mjs` with ORIGIN/OUTPUT/FRESH/SEEK/DEPTH/FILM_SAMPLE environment variables, `verify-room-v189.mjs`, `check-edits-v189.mjs`, `inspect-v189.mjs` with VISUAL_ORIGIN/OUTPUT. True physical network probe is `check-physical-network-v189.py`; inspect current interface/IP before rerun (diagnostic addresses currently WLAN17/192.168.137.246). Merely disabling browser proxy does not bypass Mihomo TUN. Never label that test true VPN-off.

Current release status and remaining limits: CURRENT-V32-189-RESUME.md. Full desktop native/source app untouched; no paid resource/domain bought. Existing short URL https://xy-crg.pages.dev/ retained. Network access requirement remains separate and unverified/failed on this physical route; no zero-stutter or worldwide guarantee.
