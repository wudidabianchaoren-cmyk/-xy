from pathlib import Path
import re,shutil
p=Path(__file__).resolve().parents[1];out=p/'.verify/v32-158';(out/'before').mkdir(parents=True,exist_ok=True)
for f in ['v31.html','src/home-designed-intro.jsx','src/home-world-v146.ts','src/reading-book-v155.ts','v31-motion-v144.js']:
 q=out/'before'/f;q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p/f,q)
s=Path('F:/codex吴翔宇/attachments/a442b43c-8875-455a-b1ba-b445a762bdea/已粘贴的文本.txt').read_text(encoding='utf-8')
component=s.split('### Full Component Source',1)[1].split('```jsx',1)[1].split('```',1)[0].strip()
css=s.split('### Component CSS',1)[1].split('```css',1)[1].split('```',1)[0].strip()
d=p/'src/thought-line-v158';d.mkdir(exist_ok=True)
(d/'ThoughtLine.jsx').write_text(component,encoding='utf-8');(d/'ThoughtLine.css').write_text(css,encoding='utf-8')
# Keep an upright cinema volume; the camera can show the cabinet's thickness without tilting the book.
q=p/'src/reading-book-v155.ts';s=q.read_text(encoding='utf-8').replace('opened?tiltY:-.035','opened?tiltY:0');q.write_text(s,encoding='utf-8')
