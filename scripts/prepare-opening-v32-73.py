from pathlib import Path
import shutil
P=Path(__file__).resolve().parents[1];folder=P/'motion/remotion-v32-73';folder.mkdir(parents=True,exist_ok=True)
shutil.copytree(P/'motion/remotion-v32-72',folder,dirs_exist_ok=True)
f=folder/'src/index.tsx';s=f.read_text(encoding='utf8').replace('../../loading-study-v3/opening.js','../../loading-study-v4/opening.js').replace("'#080908'","'#030403'");f.write_text(s,encoding='utf8')
f=P/'scripts/render-opening-v32-72.mjs';s=f.read_text(encoding='utf8').replace("const folder='motion/remotion-v32-72'","const folder='motion/remotion-v32-73'").replace('opening-poster-v32-72','opening-poster-v32-73').replace("'.verify/v32-72/opening-","'.verify/v32-73/opening-").replace('loading-study-v32-72.mp4','loading-study-v32-73.mp4').replace('motion/loading-study-v3/opening.js','motion/loading-study-v4/opening.js').replace('beats:19,images:15','chapters:5,continuousHumanEvolution:true,blackBackground:true').replace("[['look',52],['negative',209],['mechanism',329],['recurse',424],['title',583]]","[['trace',52],['evolution',164],['perception',308],['worldmaking',441],['title',583]]")
(P/'scripts/render-opening-v32-73.mjs').write_text(s,encoding='utf8')
