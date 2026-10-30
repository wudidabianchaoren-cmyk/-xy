from pathlib import Path
P=Path(__file__).resolve().parents[1]
s=(P/'.verify/export-v72-input.ts').read_text(encoding='utf8').replace("posture:'reclining'","posture:'grounded'").replace('Reclining cliff figure with raised left knee, bent supporting arm and continuous CC0 anatomy','Grounded upright posture, lowered arms and two supported straight legs')
(P/'.verify/export-v73-input.ts').write_text(s,encoding='utf8')
s=(P/'.verify/export-v72-input.mjs').read_text(encoding='utf8').replace('export-v72-input','export-v73-input').replace('reference-architecture-v18','reference-architecture-v19').replace('V32.72','V32.73').replace('V18','V19')
(P/'.verify/export-v73-input.mjs').write_text(s,encoding='utf8')
