from pathlib import Path
from PIL import Image,ImageOps
import json,hashlib
r=Path(__file__).resolve().parents[1];a=r/'assets/works/humid-southeast-asia';a.mkdir(parents=True,exist_ok=True)
inventory=json.loads((r/'.verify/v32-135/image-inventory.json').read_text(encoding='utf-8'))
selection=[(0,'临河小镇','河流、绿植与低层民居构成越南临河小镇的环境设定'),(2,'绿荫老街','热带绿荫下的老街与临河民居'),(5,'临河庭院','河岸庭院、热带绿植与老屋前的环境空间'),(1,'穿堂的绿光','绿色百叶窗与室内透入的柔光'),(15,'叶上积雨','芭蕉叶上的雨水与热带植物细节'),(12,'河面的呼吸','河面、远岸与丰茂的热带植被'),(10,'通向水的石阶','潮湿的石阶向河面延伸'),(17,'铁皮屋顶之后','铁皮屋顶、河流与远处小镇'),(16,'街巷的去向','街边排水口与相连的水道'),(52,'留下的塑料','旧河岸与水边停留的塑料废弃物')]
frames=[]
for i,(index,title,alt) in enumerate(selection,1):
 record=inventory[index];source=Path(record['file']);im=ImageOps.exif_transpose(Image.open(source)).convert('RGB');file=f'frame-{i:02}.webp';im.save(a/file,'WEBP',quality=95,method=6)
 frames.append({'image':file,'title':title,'alt':alt,'width':im.width,'height':im.height,'fit':'contain','sourceFile':str(source),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sha256':hashlib.sha256((a/file).read_bytes()).hexdigest(),'selection':'environment; no human subject'})
 if i==1:
  cover=im.copy();cover.thumbnail((1600,1000));cover.save(a/'cover.webp','WEBP',quality=94,method=6);im.save(a/'poster.webp','WEBP',quality=94,method=6)
manifest={'title':'潮湿东南亚','english':'HUMID SOUTHEAST ASIA','setting':'越南','theme':'环保公益片；塑料袋贯穿线索','film':None,'filmStatus':'剪辑中','frames':frames,'gallerySelection':list(range(len(frames)))}
(a/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Selected',len(frames),'environment images, original dimensions retained; no fabricated video.')
