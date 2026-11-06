import socket,ssl,time,json,struct,concurrent.futures,urllib.request
from pathlib import Path
out=Path('.verify/v32-196');out.mkdir(parents=True,exist_ok=True)
opener=urllib.request.build_opener(urllib.request.ProxyHandler({'https':'http://127.0.0.1:9674'}))
hosts=['vvainex.click','xy-crg.pages.dev','www.baidu.com'];answers={}
for host in hosts:
 try:
  with opener.open('https://dns.alidns.com/resolve?name='+host+'&type=A',timeout=8)as r:body=json.load(r)
  answers[host]=[v['data']for v in body.get('Answer',[])if v['type']==1][:2]
 except Exception as e:answers[host]=[]
def probe(item):
 host,ip=item;start=time.monotonic();s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.settimeout(10);row={'host':host,'ip':ip,'interface':17,'source':'10.49.64.1','proxy':False,'certificateVerified':True,'phase':'tcp'}
 try:
  s.setsockopt(socket.IPPROTO_IP,31,socket.htonl(17));s.bind(('10.49.64.1',0));s.connect((ip,443));row['tcpSeconds']=round(time.monotonic()-start,3);row['phase']='tls';s=ssl.create_default_context().wrap_socket(s,server_hostname=host);row['tlsSeconds']=round(time.monotonic()-start,3);row['phase']='http';s.sendall(('GET / HTTP/1.1\r\nHost: '+host+'\r\nConnection: close\r\nRange: bytes=0-1023\r\n\r\n').encode());data=s.recv(16384);row['response']=data.split(b'\r\n')[0].decode('latin1');row['phase']='complete'
 except Exception as e:row['error']=str(e)
 finally:s.close();row['seconds']=round(time.monotonic()-start,3)
 return row
with concurrent.futures.ThreadPoolExecutor(max_workers=5)as pool:rows=list(pool.map(probe,[(h,ip)for h,ips in answers.items()for ip in ips]))
record={'dateUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'dnsAnswersViaExistingProxyOnly':answers,'actualConnectionsBoundPhysicalWLAN':True,'systemNetworkChanged':False,'productionChanged':False,'probes':rows}
(out/'direct-network.json').write_text(json.dumps(record,indent=2),encoding='utf-8');print(json.dumps(record))
