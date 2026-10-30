import fs from'node:fs/promises';
let page=await fs.readFile('physical-universe.html','utf8');page=page.replaceAll('physical-universe-v102','physical-universe-v103').replaceAll('32.102','32.103').replaceAll('四幅','八幅');
page=page.replace('连续光标穿过画面，接触、施压、释放与回弹形成镜头之间的联系。','文字和主物处于共同的视觉中心，强调色跟随对应材质；连续光标穿过画面，接触、施压、释放与回弹形成镜头之间的联系。');
page=page.replace('VISUAL悬挂字形在其中短暂出现1.4秒，最后由声音海报进入深色英文结尾。','长短镜头围绕鼓点交替，图形先被看清，再进入下一次受力；VISUAL悬挂字形在其中短暂出现1.4秒，最后由声音海报进入深色英文结尾。');
await fs.writeFile('physical-universe.html',page);
let ring=await fs.readFile('v31-works-ring.js','utf8');const lines=ring.split('\n');const row=lines.findIndex(s=>s.includes('["让画面发生"'));if(row<0)throw Error('Promo work entry missing');lines[row]=lines[row].replace('physical-universe-v102','physical-universe-v103').replace('32.102','32.103');await fs.writeFile('v31-works-ring.js',lines.join('\n'));
console.log('Only promotional project and its work entry integrated');
