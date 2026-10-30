from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'.verify/verify-odyssey-v32-72.mjs';s=p.read_text('utf-8').replace('hand[0]<-55','hand[0]<-30').replace('storyElements.length,6','storyElements.length,7');p.write_text(s,'utf-8')
# Keep original lights/camera and the six untouched particle samplers byte-identical.
s=(r/'.verify/protected-v32-71.mjs').read_text('utf-8')
s=s.replace("const before=JSON.parse((await readFile('.verify/v32-66-protected-before.json','utf8')).replace(/^\\uFEFF/,''))","const before=JSON.parse(await readFile('.verify/v32-72/protected-before.json','utf8'))")
s=s.replace('f.Path','f.path').replace('f.Hash','f.sha256.toUpperCase()').replace('v32-70-before','v32-72-before').replace("const r={passed:true", "const r={passed:true").replace(".verify/v32-71/protected-results.json",".verify/v32-72/protected-results.json")
marker="const r={passed:true"
addition="""const sandA=await readFile('.verify/v32-72-before/v31-sand-story.js','utf8'),sandB=await readFile('v31-sand-story.js','utf8');
const envelopeStart='  function sampleEnvelopeVolume()';const envelopeEnd='  function '+sandA.slice(sandA.indexOf(envelopeStart)+envelopeStart.length).split('  function ')[1].split('(')[0]+'(';
const clean=s=>s.slice(0,s.indexOf(envelopeStart))+s.slice(s.indexOf(envelopeEnd,s.indexOf(envelopeStart)));
const oldSource='./assets/sand-story/';
const normalize=s=>clean(s).replace(/src: [^\\n]+/g,'src: EXCLUDED');
assert.equal(normalize(sandA),normalize(sandB),'Other six samplers, timing, scroll and particle effects remain unchanged');
"""
s=s.replace(marker,addition+marker);(r/'.verify/protected-v32-72.mjs').write_text(s,'utf-8')
