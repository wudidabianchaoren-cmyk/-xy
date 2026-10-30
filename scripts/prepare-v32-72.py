from pathlib import Path
import json, shutil, hashlib, os
P=Path(__file__).resolve().parents[1]
Q=P/'.verify/v32-72'; Q.mkdir(parents=True,exist_ok=True)
backup=P/'.verify/v32-72-before'
files=['v31.html','v31-final.css','v31-motion.js','v31-sand-story.js','src/home-world.ts','src/home-details.ts','src/home-forest.ts','src/home-surfaces.ts','src/native-v17.ts','src/odyssey-scene.ts','src/odyssey-story.ts','src/life-purpose.ts','src/loading-study.ts','motion/loading-study-v2/opening.js','motion/loading-study-v2/preview.html','motion/life-purpose-v1/life-film.js','motion/life-purpose-v1/export.cjs']
for f in files:
    dst=backup/f
    if not dst.exists():
        dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(P/f,dst)
protected=['blender/reference-architecture-v16/architecture-v16.blend','blender/reference-architecture-v16/architecture-world.glb','blender/reference-architecture-v16/world-track.json','assets/life-purpose/v32-70/mix-with-music.wav','assets/life-purpose/v32-70/mix-no-music.wav','v23.js','v23.css']
protected += [str(f.relative_to(P)).replace('\\','/') for f in (P/'assets/sand-story').glob('*') if f.is_file()]
proof=[{'path':f,'sha256':hashlib.sha256((P/f).read_bytes()).hexdigest()} for f in protected if (P/f).is_file()]
(Q/'protected-before.json').write_text(json.dumps(proof,indent=2),encoding='utf8')
state={'version':'V32.72','base':'V32.71','completeLocal':False,'eArchiveUpdated':False,'requests':['Four official tools installation and account status','20 second opening with more images/text, curve retiming and optical transitions','Native Blender V18 curated courtyard, dark warm lighting, smaller clustered forest, six new camera framings','Complete volumetric particle envelope, generated reference, retain other six particles','Slightly larger painting entry light','Taut textured linen sails, remove artificial cave/arch, native reclining distant Polyphemus following National Gallery description','Code cinema title and meaningful description, repair chair structure, retain film timing and audio','All regression checks and new independent E archive with SHA256']}
(Q/'work-state.json').write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf8')
(Q/'account-status.json').write_text(json.dumps({'elevenLabsEnvironmentKeyPresent':bool(os.getenv('ELEVENLABS_API_KEY')),'captionsEnvironmentKeyPresent':bool(os.getenv('CAPTIONS_API_KEY')),'oldChatAccountConnectionsNotVerified':True},indent=2),encoding='utf8')
print('V32.71 source backup and V32.72 scope saved; account key presence checked without exposing keys.')
