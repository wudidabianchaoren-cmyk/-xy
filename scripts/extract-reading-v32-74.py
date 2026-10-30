from pathlib import Path
import pymupdf,json,hashlib,shutil
P=Path(__file__).resolve().parents[1];H=P/'assets/reading/cinema-aesthetics';H.mkdir(parents=True,exist_ok=True)
source=Path('C:/Users/HP/Desktop/电影美学书籍的完成.pdf');doc=pymupdf.open(source);pages=[]
for i,page in enumerate(doc):
 pix=page.get_pixmap(matrix=pymupdf.Matrix(2.4,2.4),alpha=False)
 filename=f'page-{i+1:03d}.jpg';pix.save(H/filename,jpg_quality=94)
 pages.append({'number':i+1,'image':filename,'width':pix.width,'height':pix.height,'text':page.get_text(),'sha256':hashlib.sha256((H/filename).read_bytes()).hexdigest()})
shutil.copy2(source,H/'original.pdf')
data={'title':'电影美学','sourceFile':source.name,'pageCount':len(doc),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'pages':pages,'preservedOriginalLayout':True,'allPagesIncluded':len(pages)==len(doc)}
(H/'manifest.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
print(f'Preserved all {len(pages)} PDF pages at 2.4x; original included')
