"""Disconnect only the replaced legacy people; retain hull, deck, oars and sails."""
import struct,json,re
from pathlib import Path
P=Path(__file__).resolve().parents[1];b=(P/'assets/odyssey/refit-v144/armed-ship.glb').read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);removed={i for i,x in enumerate(j['nodes']) if re.match(r'Crew\d\d__',x.get('name',''))}
for sc in j['scenes']:sc['nodes']=[i for i in sc.get('nodes',[]) if i not in removed]
for node in j['nodes']:
 if 'children'in node:node['children']=[i for i in node['children']if i not in removed]
s=json.dumps(j,separators=(',',':')).encode();s+=b' '*((-len(s))%4);tail=b[20+n:];out=struct.pack('<III',0x46546c67,2,20+len(s)+len(tail))+struct.pack('<II',len(s),0x4e4f534a)+s+tail
(P/'assets/odyssey/refit-v146/vessel-unpruned.glb').write_bytes(out);print('Disconnected legacy crew parts',len(removed))
