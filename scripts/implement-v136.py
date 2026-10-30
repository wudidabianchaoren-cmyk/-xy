from pathlib import Path
import json,shutil

p=Path(__file__).resolve().parents[1]
check=p/'.verify/v32-136';before=check/'before';before.mkdir(parents=True,exist_ok=True)
for name in ['v31.html','directory.html','v31-hobby.js','src/directory-v135/room.ts']:
    target=before/name;target.parent.mkdir(parents=True,exist_ok=True)
    if not target.exists():shutil.copy2(p/name,target)
dest=p/'src/directory-v136'
if not dest.exists():shutil.copytree(p/'src/directory-v135',dest)
kids=json.loads((p/'assets/hobby-kid-v132/collection.json').read_text(encoding='utf-8'))['items']
data=[dict(en='Kaito Kid / '+str(k['id']).zfill(2),cn=k['title'],note='怪盗基德图像收藏 · '+('图形元素' if k['group']=='elements' else '人物与场景'),english='A personal image collection: Kaito Kid, graphic composition and visual references.',thumb=k['thumb'],src=k['src'],width=k['width'],height=k['height'],kid=True) for k in kids]
s=(p/'v31-hobby.js').read_text(encoding='utf-8')
s=s.replace('  const angles = [-90, -61, -30, 0, 29, 61, 90, 120, 151, 181, 210, 240];','  items.push(...'+json.dumps(data,ensure_ascii=False,separators=(',',':'))+');\n  const angles = items.map((_,i)=>-90+i*360/items.length);')
s=s.replace('node.style.backgroundSize="cover"','node.style.backgroundSize=items[index]?.kid?"contain":"cover"')
s=s.replace('items.forEach((_,i)=>{images[i]=`./assets/hobby-tiles-v32-67/${i}.jpg`;});','items.forEach((item,i)=>{images[i]=item.thumb||`./assets/hobby-tiles-v32-67/${i}.jpg`;});\n    $("hobbyOrbitTotal").textContent=String(items.length).padStart(2,"0");')
start=s.index('    let sheetReady;');end=s.index('    page.querySelectorAll("[data-hobby-sprite]")',start)
s=s[:start]+'''    const textureLoads=new Map();
    function ensureSpriteTextures(indices){
      const loader=new THREE.TextureLoader();
      return Promise.all(indices.map(i=>{
        if(!textureLoads.has(i))textureLoads.set(i,loader.loadAsync(items[i].thumb||`./assets/hobby-tiles-v32-67/${i}.png`).then(t=>{t.colorSpace=THREE.SRGBColorSpace;textures[i]=t;}).catch(e=>{textureLoads.delete(i);throw e;}));
        return textureLoads.get(i);
      }));
    }
'''+s[end:]
s=s.replace('const [width,height]=sizes[index%sizes.length];','const [width,height]=items[itemIndex].kid?[64,64*items[itemIndex].height/items[itemIndex].width]:sizes[index%sizes.length];')
s=s.replace('card.type="button";card.className="hobby-orbit-card";','card.type="button";card.className="hobby-orbit-card";card.dataset.collection=items[itemIndex].kid?"kid":"original";')
s=s.replace('sprite(image,index%items.length);','sprite(image,Math.floor(index*items.length/scatter.length)%items.length);')
s=s.replace('index/angles.length*Math.PI*2','index/scatter.length*Math.PI*2').replace('(angles.length-1)/2','(scatter.length-1)/2')
s=s.replace('      try{await ensureSpriteTextures();}catch(e){}','      // Entry uses the existing small DOM thumbnails; cabinet textures load only on selection.')
s=s.replace('if(!posterTextures[index]){const map=textures[index].clone();map.repeat.set(.34,1);map.offset.set(.33,0);map.needsUpdate=true;posterTextures[index]=map;}','''if(!posterTextures[index]){
        if(items[index].kid){
          const canvas=document.createElement('canvas');canvas.width=512;canvas.height=1600;
          const ctx=canvas.getContext('2d');ctx.fillStyle='#f7f6f2';ctx.fillRect(0,0,512,1600);
          const image=textures[index].image,ratio=image.width/image.height,w=480,h=w/ratio;
          ctx.drawImage(image,16,(1600-h)/2,w,h);
          const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;posterTextures[index]=map;
        }else{const map=textures[index].clone();map.repeat.set(.34,1);map.offset.set(.33,0);map.needsUpdate=true;posterTextures[index]=map;}
      }''')
s=s.replace('        await ensureSpriteTextures();buildScene();','        const nextCollection=Array.from({length:CASE_COUNT},(_,i)=>(index+i-MID_SLOT+items.length)%items.length);\n        await ensureSpriteTextures(nextCollection);buildScene();')
s=s.replace('collection=Array.from({length:CASE_COUNT},(_,i)=>(index+i-MID_SLOT+items.length)%items.length);','collection=nextCollection;')
s=s.replace('sprite($("hobbyDetailImage"),itemIndex);','sprite($("hobbyDetailImage"),itemIndex);if(item.src)$("hobbyDetailImage").style.backgroundImage=`url("${item.src}")`;\n      const format=$("hobbyInspector").querySelector(".hobby-archive-copy dd:nth-of-type(3)");if(format)format.textContent=item.kid?`${item.width} × ${item.height}`:"Square / 1:1";')
# Existing listeners, transforms, cabinet geometry and original story layout stay intact.
(p/'v31-hobby-v136.js').write_text(s,encoding='utf-8')
for name in ['v31.html','directory.html']:
    file=p/name;s=file.read_text(encoding='utf-8')
    s=s.replace('scene-dist/directory-v135/app','scene-dist/directory-v136/app').replace('app.js?v=32.135','app.js?v=32.136').replace('app.css?v=32.135','app.css?v=32.136')
    s=s.replace('./v31-hobby.js?v=32.68','./v31-hobby-v136.js?v=32.136')
    import re
    s=re.sub(r'<link\b[^>]*href="\./hobby-kid-v132\.css[^"\n]*"[^>]*>','',s)
    s=re.sub(r'<script\b[^>]*src="\./hobby-kid-v132\.js[^"\n]*"[^>]*></script>','',s)
    file.write_text(s,encoding='utf-8')
room=dest/'room.ts';s=room.read_text(encoding='utf-8')
old="fragmentShader:'varying vec2 tex;uniform float level;void main(){vec2 q=abs(tex-.5)-vec2(.486,.480);float edge=length(max(q,0.))+min(max(q.x,q.y),0.);float glow=exp(-pow(edge/.0065,2.))*.24*level;gl_FragColor=vec4(.92,.73,.40,glow);}'"
new="fragmentShader:'varying vec2 tex;uniform float level;void main(){vec2 p=abs(tex-.5),c=vec2(.55/.61,.38/.44)*.5;vec2 q=p-c;float edge=length(max(q,0.))+min(max(q.x,q.y),0.);float d=length(q);float rim=exp(-pow(edge/.008,2.))*.065;float corners=.22*exp(-pow(d/.035,2.))+.085*exp(-pow(d/.085,2.));float light=min(.305,rim+corners)*level;gl_FragColor=vec4(.96,.79,.48,light);}'"
assert old in s;s=s.replace(old,new).replace('PlaneGeometry(.566,.396)','PlaneGeometry(.61,.44)').replace('halo.position.y+=.0005','halo.position.y+=.004')
s=s.replace('camera.localToWorld(vec(0,-.025,-distance))','camera.localToWorld(vec(0,0,-distance))')
s=s.replace('camera.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-.025,.035,-.015)))','camera.quaternion.clone()')
s=s.replace("if(k>.95&&!reduced)paperMesh.position.y+=Math.sin(elapsed*.8)*.0015;",'')
s=s.replace("haloMat.uniforms.level.value=1;glow.visible=false;","haloMat.uniforms.level.value=1;status.journalLight={visible:halo.visible,peakAlpha:.305,corners:4};status.paperFacingCamera=1-Math.abs(note.quaternion.dot(camera.quaternion));glow.visible=false;")
room.write_text(s,encoding='utf-8')
app=dest/'app.tsx';app.write_text(app.read_text(encoding='utf-8').replace('version:135','version:136'),encoding='utf-8')
print('V136 original orbit integrated: 9 existing + 19 Kid images; removed separate gallery. Journal corrected.')
