from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import argparse,re,os
parser=argparse.ArgumentParser();parser.add_argument('--directory',required=True);parser.add_argument('--port',type=int,default=8054);args=parser.parse_args();root=Path(args.directory).resolve();assert root.is_dir()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):self.byte_range=None;super().__init__(*a,directory=str(root),**kw)
 def log_message(self,*a):pass
 def send_head(self):
  path=Path(self.translate_path(self.path));value=self.headers.get('Range')
  if not value or not path.is_file():return super().send_head()
  match=re.fullmatch(r'bytes=(\d*)-(\d*)',value)
  if not match:return super().send_head()
  length=path.stat().st_size;start=int(match[1])if match[1]else max(0,length-int(match[2]));end=min(length-1,int(match[2]))if match[1]and match[2]else length-1
  if start>=length or start>end:self.send_response(416);self.send_header('Content-Range',f'bytes */{length}');self.end_headers();return None
  f=path.open('rb');f.seek(start);self.byte_range=(start,end);self.send_response(206);self.send_header('Content-Type',self.guess_type(str(path)));self.send_header('Accept-Ranges','bytes');self.send_header('Content-Range',f'bytes {start}-{end}/{length}');self.send_header('Content-Length',str(end-start+1));self.end_headers();return f
 def copyfile(self,source,outputfile):
  if not self.byte_range:return super().copyfile(source,outputfile)
  remaining=self.byte_range[1]-self.byte_range[0]+1
  while remaining:
   block=source.read(min(262144,remaining))
   if not block:break
   try:outputfile.write(block)
   except(BrokenPipeError,ConnectionResetError):break
   remaining-=len(block)
class Server(ThreadingHTTPServer):request_queue_size=128
print(f'Range preview 127.0.0.1:{args.port} / {root}',flush=True);Server(('127.0.0.1',args.port),Handler).serve_forever()
