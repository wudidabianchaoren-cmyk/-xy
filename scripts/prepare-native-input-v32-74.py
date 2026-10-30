from pathlib import Path
P=Path(__file__).resolve().parents[1]
for suffix in ['ts','mjs']:
 s=(P/f'.verify/export-v73-input.{suffix}').read_text(encoding='utf8').replace('export-v73-input','export-v74-input').replace('reference-architecture-v19','reference-architecture-v20').replace('V32.73','V32.74').replace('V19','V20')
 (P/f'.verify/export-v74-input.{suffix}').write_text(s,encoding='utf8')
