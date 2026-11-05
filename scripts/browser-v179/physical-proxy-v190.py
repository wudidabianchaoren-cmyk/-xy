"""Loopback-only diagnostic CONNECT transport, bound to the physical WLAN.
No system networking changes, no TLS interception, no browser credentials read.
IP addresses are the independently queried current DNS answers, diagnostics only.
"""
import socket,socketserver,select,json
targets={'static.cloudflareinsights.com':['104.16.79.73','104.16.80.73'],'vvainex.click':['172.67.138.27','104.21.81.43'],'www.vvainex.click':['172.67.138.27','104.21.81.43']}
class Handler(socketserver.BaseRequestHandler):
 def handle(self):
  upstream=None
  try:
   self.request.settimeout(20);header=b''
   while b'\r\n\r\n'not in header and len(header)<16384:header+=self.request.recv(4096)
   method,address,_=header.split(b'\r\n',1)[0].decode('ascii').split(' ',2);host,port=address.rsplit(':',1)
   if method!='CONNECT'or host not in targets or port!='443':self.request.sendall(b'HTTP/1.1 403 Forbidden\r\n\r\n');return
   for ip in targets[host]:
    try:
     upstream=socket.socket(socket.AF_INET,socket.SOCK_STREAM);upstream.settimeout(12);upstream.setsockopt(socket.IPPROTO_IP,31,socket.htonl(17));upstream.bind(('192.168.137.246',0));upstream.connect((ip,443));break
    except OSError:
     upstream.close();upstream=None
   if upstream is None:self.request.sendall(b'HTTP/1.1 502 Bad Gateway\r\n\r\n');return
   self.request.sendall(b'HTTP/1.1 200 Connection Established\r\n\r\n');self.request.settimeout(None);upstream.settimeout(None)
   while True:
    ready,_,_=select.select([self.request,upstream],[],[],60)
    if not ready:return
    for source in ready:
     data=source.recv(65536)
     if not data:return
     (upstream if source is self.request else self.request).sendall(data)
  except (OSError,ValueError):pass
  finally:
   if upstream:upstream.close()
class Server(socketserver.ThreadingTCPServer):allow_reuse_address=True;daemon_threads=True
with Server(('127.0.0.1',8060),Handler)as server:
 print(json.dumps({'ready':True,'loopbackPort':8060,'physicalInterface':17,'TLSInterception':False,'systemNetworkChanged':False}),flush=True);server.serve_forever()
