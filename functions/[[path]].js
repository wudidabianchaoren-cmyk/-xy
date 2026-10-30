// Only the public portfolio routes are forwarded. Source, maintenance and
// authoring endpoints are never exposed by this Pages function.
export async function onRequest(context){
 const request=context.request,url=new URL(request.url),pathname=url.pathname;
 const runtime=pathname.startsWith('/_runtime/');
 const stream=pathname==='/ue'||pathname.startsWith('/ue/');
 const asset=['/assets/','/blender/','/motion/'].some(p=>pathname.startsWith(p));
 if(!runtime&&!stream&&!asset)return context.next();
 if(runtime&&!['/_runtime/status','/_runtime/ensure','/_runtime/refresh'].includes(pathname))return new Response('Not found',{status:404});
 if(asset&&!['GET','HEAD'].includes(request.method)||!asset&&!['GET','HEAD','POST','OPTIONS'].includes(request.method))return new Response('Method not allowed',{status:405});
 const origin=asset?context.env.ASSET_ORIGIN:context.env.UE_BACKEND_ORIGIN;
 let upstream;try{upstream=new URL(origin)}catch{}
 if(!upstream||upstream.protocol!=='https:'||upstream.username||upstream.password)return new Response('The independent portfolio service is not configured.',{status:503,headers:{'Cache-Control':'no-store'}});
 if(!asset&&Number(request.headers.get('content-length')||0)>16384)return new Response('Request too large',{status:413});
 upstream.pathname=pathname;upstream.search=url.search;
 const headers=new Headers(request.headers);headers.delete('cookie');headers.delete('authorization');headers.delete('host');
 // Keep the original Pages Origin for the GPU host's exact CORS allowlist.
 const response=await fetch(new Request(upstream,request),{headers,redirect:'manual'});
 if(response.status===101)return response;
 const outgoing=new Headers(response.headers);outgoing.delete('set-cookie');
 if(!asset)outgoing.set('Cache-Control','no-store');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers:outgoing});
}
