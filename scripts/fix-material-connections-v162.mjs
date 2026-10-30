import fs from'node:fs/promises';
for(const p of ['scripts/ue_polish_v162.py','scripts/ue_room_build_v162.py','scripts/ue_island_build_v162.py']){const s=await fs.readFile(p,'utf8');await fs.writeFile(p,s.replaceAll("mask,'Input'","mask,''"));}console.log('UE ComponentMask uses its first input; broken named connection removed');
