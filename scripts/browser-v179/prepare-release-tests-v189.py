from pathlib import Path
root=Path.cwd()
src=root/'scripts/browser-v179/check-cloudflare-browser-hashes-v188.mjs';s=src.read_text(encoding='utf-8').replace('modules-v187','modules-v189').replace('.verify/v32-188/site/','.verify/v32-189/cloudflare/site/').replace('.verify/v32-188/browser-hashes','.verify/v32-189/browser-hashes')
s=s.replace("'assets/native-v171/room.jpg',","'assets/native-v171/room.jpg','assets/browser-v189/room-atlas/on.webp','assets/browser-v189/room-atlas/off.webp','assets/browser-v189/room-atlas/layout.json',")
# The separate browser proxy flag is retained only as a transport comparison,
# never labelled real VPN-off: the Mihomo TUN remains active.
(src.with_name('check-cloudflare-browser-hashes-v189.mjs')).write_text(s,encoding='utf-8')
