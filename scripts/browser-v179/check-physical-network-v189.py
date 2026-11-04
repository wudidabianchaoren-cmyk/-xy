"""Read-only per-socket interface diagnostics; never changes system networking."""
import socket,ssl,json,time,concurrent.futures,urllib.request
from pathlib import Path
out=Path('.verify/v32-189');out.mkdir(exist_ok=True)
targets={'xy-crg.pages.dev':['172.66.47.145','172.66.44.111']}
try:
 with urllib.request.urlopen('https://dns.alidns.com/resolve?name=www.baidu.com&type=A',timeout=15)as r:d=json.load(r)
 targets['www.baidu.com']=[x['data']for x in d['Answer']if x['type']==1][:1]
except Exception as e:print(type(e).__name__)
def probe(host,ip):
 start=time.monotonic();record={'host':host,'ip':ip,'physicalInterface':17,'networkChange':False};s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.settimeout(12)
 try:
  s.setsockopt(socket.IPPROTO_IP,31,socket.htonl(17));s.bind(('192.168.137.246',0));record['phase']='tcp';s.connect((ip,443));record['tcpSeconds']=time.monotonic()-start;record['local']=s.getsockname();record['phase']='tls';s=ssl.create_default_context().wrap_socket(s,server_hostname=host);record['tlsSeconds']=time.monotonic()-start;record['phase']='http';s.sendall(('HEAD / HTTP/1.1\r\nHost: '+host+'\r\nConnection: close\r\n\r\n').encode());record['response']=s.recv(2048).decode('latin-1').split('\r\n')[0]
 except Exception as e:record['error']=type(e).__name__+': '+str(e)
 finally:s.close();record['seconds']=round(time.monotonic()-start,2)
 return record
with concurrent.futures.ThreadPoolExecutor(max_workers=3)as pool:r=list(pool.map(lambda t:probe(*t),[(h,ip)for h,ips in targets.items()for ip in ips]))
(out/'physical-network.json').write_text(json.dumps(r,indent=2),encoding='utf-8');print(json.dumps(r))
