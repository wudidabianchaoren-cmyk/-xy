import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='E:/Brain-Universe-assets/V32-63/calendar';await mkdir(root,{recursive:true});
const url='https://upload.wikimedia.org/wikipedia/commons/1/1f/Kalend%C3%A1%C5%99n%C3%AD_deska_%28origin%C3%A1l_ulo%C5%BEen%C3%BD_v_muzeu_hlavn%C3%ADho_m%C4%9Bsta_Prahy%29.jpg';
const r=await fetch(url,{headers:{'User-Agent':'BrainUniverse-Portfolio/1.0 (local art study)'},signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error('Reference download '+r.status);
const data=Buffer.from(await r.arrayBuffer());await writeFile(root+'/manes-original.jpg',data);
await writeFile(root+'/SOURCE.json',JSON.stringify({url,author:'Ltosnar',artwork:'Josef Manes, calendar plate, 1865',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',page:'https://commons.wikimedia.org/wiki/File:Kalendářní_deska_(originál_uložený_v_muzeu_hlavního_města_Prahy).jpg',changes:'Original photograph retained. Calendar surface UV remapping in 3D; photo-derived material and rendering remain attributed CC BY-SA 4.0.',sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length},null,2));
console.log('Calendar photograph saved only E: '+data.length);
