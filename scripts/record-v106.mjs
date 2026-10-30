import fs from'node:fs/promises';import assert from'node:assert/strict';
const current=await fs.readFile('CURRENT-V32-106-RESUME.md','utf8');
for(const file of['AGENTS.md','../AGENTS.md','MYTHOLOGY-VISUAL-NEXT-SESSION.md']){const old=await fs.readFile(file,'utf8');assert(old.startsWith('# 脑海宇宙 / CURRENT V32.105'));await fs.writeFile(file,current+'\n---\n以下为历史记录，不覆盖 V32.106。\n\n'+old);}
