import fs from'node:fs/promises';import assert from'node:assert/strict';
const notes=await fs.readFile('CURRENT-V32-107-RESUME.md','utf8');
for(const file of['AGENTS.md','../AGENTS.md']){const old=await fs.readFile(file,'utf8');assert(old.startsWith('# 脑海宇宙 V32.106'));await fs.writeFile(file,notes+'\n---\n以下为历史记录，不覆盖V32.107。\n\n'+old)}
