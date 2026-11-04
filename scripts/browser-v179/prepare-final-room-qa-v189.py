from pathlib import Path
p=Path('scripts/browser-v179/verify-room-v189.mjs');s=p.read_text(encoding='utf-8');s=s.replace("page.goto('http://127.0.0.1:8056/__room_extended__?performanceAudit=1')","page.goto(origin+'/__room_extended__?performanceAudit=1')");p.write_text(s,encoding='utf-8')
