from pathlib import Path
import shutil,json,hashlib
P=Path(__file__).resolve().parents[1];Q=P/'.verify/v32-73';Q.mkdir(parents=True,exist_ok=True)
files=['v31.html','v31-final.css','v31-motion.js','v31-sand-story.js','src/home-world.ts','src/home-surfaces.ts','src/home-forest.ts','src/native-v18.ts','src/odyssey-scene.ts','src/odyssey-story.ts','src/odyssey-atmosphere.ts','src/life-purpose.ts','src/scene-loader.ts']
for name in files:
 t=P/'.verify/v32-73-before'/name;t.parent.mkdir(parents=True,exist_ok=True)
 if not t.exists():shutil.copy2(P/name,t)
protected=['v23.js','v23.css','blender/reference-architecture-v16/world-track.json','blender/reference-architecture-v14/camera-track.json','assets/life-purpose/v32-72/life-purpose-with-music.mp4','assets/life-purpose/v32-72/life-purpose-no-music.mp4']
protected += [str(f.relative_to(P)).replace('\\','/') for f in (P/'blender/reference-architecture-v18').glob('*') if f.is_file()]
(Q/'protected-before.json').write_text(json.dumps({f:hashlib.sha256((P/f).read_bytes()).hexdigest() for f in protected},indent=2),encoding='utf8')
(Q/'work-state.json').write_text(json.dumps({'version':'V32.73','base':'V32.72','completeLocal':False,'eArchiveUpdated':False,'scope':['20s continuous human evolution opening on black with variable rhythm and short loading line','Native Blender MCP and coordinated home material/light/depth improvement','Volumetric envelope and recovered rain/ripple effect','Revised giant, island and distant continental atmosphere','Five process cards expand/rotate/retract','New considered portfolio epilogue']},indent=2),encoding='utf8')
print('V32.73 baseline and protected hashes saved.')
