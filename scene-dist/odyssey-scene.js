var Y0=Object.defineProperty;var cc=(r,e)=>()=>(r&&(e=r(r=0)),e);var Z0=(r,e)=>{for(var t in e)Y0(r,t,{get:e[t],enumerable:!0})};function oi(){let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(In[r&255]+In[r>>8&255]+In[r>>16&255]+In[r>>24&255]+"-"+In[e&255]+In[e>>8&255]+"-"+In[e>>16&15|64]+In[e>>24&255]+"-"+In[t&63|128]+In[t>>8&255]+"-"+In[t>>16&255]+In[t>>24&255]+In[n&255]+In[n>>8&255]+In[n>>16&255]+In[n>>24&255]).toLowerCase()}function mt(r,e,t){return Math.max(e,Math.min(t,r))}function df(r,e){return(r%e+e)%e}function j0(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function K0(r,e,t){return r!==e?(t-r)/(e-r):0}function Qo(r,e,t){return(1-t)*r+t*e}function J0(r,e,t,n){return Qo(r,e,1-Math.exp(-t*n))}function Q0(r,e=1){return e-Math.abs(df(r,e*2)-e)}function $0(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function ex(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function tx(r,e){return r+Math.floor(Math.random()*(e-r+1))}function nx(r,e){return r+Math.random()*(e-r)}function ix(r){return r*(.5-Math.random())}function rx(r){r!==void 0&&(Qd=r);let e=Qd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function sx(r){return r*Jo}function ox(r){return r*os}function ax(r){return(r&r-1)===0&&r!==0}function cx(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function lx(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function ux(r,e,t,n,i){let s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),f=o((e-n)/2),d=s((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":r.set(a*h,c*u,c*f,a*l);break;case"YZY":r.set(c*f,a*h,c*u,a*l);break;case"ZXZ":r.set(c*u,c*f,a*h,a*l);break;case"XZX":r.set(a*h,c*g,c*d,a*l);break;case"YXY":r.set(c*d,a*h,c*g,a*l);break;case"ZYZ":r.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function gi(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Wt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}function pf(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function js(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function bm(){let r=js("canvas");return r.style.display="block",r}function Ks(r){r in ep||(ep[r]=!0,console.warn(r))}function Am(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function hx(){let r={enabled:!0,workingColorSpace:Xt,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Ft&&(i.r=rr(i.r),i.g=rr(i.g),i.b=rr(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Ft&&(i.r=Ys(i.r),i.g=Ys(i.g),i.b=Ys(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===mr?na:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Ks("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Ks("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Xt]:{primaries:e,whitePoint:n,transfer:na,toXYZ:tp,fromXYZ:np,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:e,whitePoint:n,transfer:Ft,toXYZ:tp,fromXYZ:np,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}}),r}function rr(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ys(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}function oh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Gc.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function ch(r,e,t,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){Yr.fromArray(r,s);let a=i.x*Math.abs(Yr.x)+i.y*Math.abs(Yr.y)+i.z*Math.abs(Yr.z),c=e.dot(Yr),l=t.dot(Yr),h=n.dot(Yr);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}function Eh(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}function Mx(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let c=0;c<256;++c){let l=c-127;l<-27?(n[c]=0,n[c|256]=32768,i[c]=24,i[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,i[c]=-l-1,i[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,i[c]=13,i[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,i[c]=24,i[c|256]=24):(n[c]=31744,n[c|256]=64512,i[c]=13,i[c|256]=13)}let s=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)o[c]=c<<23;o[31]=1199570944,o[32]=2147483648;for(let c=33;c<63;++c)o[c]=2147483648+(c-32<<23);o[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(a[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:o,offsetTable:a}}function Sx(r){Math.abs(r)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),r=mt(r,-65504,65504),ir.floatView[0]=r;let e=ir.uint32View[0],t=e>>23&511;return ir.baseTable[t]+((e&8388607)>>ir.shiftTable[t])}function wx(r){let e=r>>10;return ir.uint32View[0]=ir.mantissaTable[ir.offsetTable[e]+(r&1023)]+ir.exponentTable[e],ir.floatView[0]}function Ax(r,e,t,n,i,s,o,a){let c;if(e.side===Mn?c=n.intersectTriangle(o,s,i,!0,a):c=n.intersectTriangle(i,s,o,e.side===An,a),c===null)return null;Sc.copy(a),Sc.applyMatrix4(r.matrixWorld);let l=t.ray.origin.distanceTo(Sc);return l<t.near||l>t.far?null:{distance:l,point:Sc.clone(),object:r}}function wc(r,e,t,n,i,s,o,a,c,l){r.getVertexPosition(a,yc),r.getVertexPosition(c,_c),r.getVertexPosition(l,Ec);let h=Ax(r,e,t,n,yc,_c,Ec,dp);if(h){let u=new R;Nn.getBarycoord(dp,yc,_c,Ec,u),i&&(h.uv=Nn.getInterpolatedAttribute(i,a,c,l,u,new de)),s&&(h.uv1=Nn.getInterpolatedAttribute(s,a,c,l,u,new de)),o&&(h.normal=Nn.getInterpolatedAttribute(o,a,c,l,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new R,materialIndex:0};Nn.getNormal(yc,_c,Ec,f.normal),h.face=f,h.barycoord=u}return h}function vs(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Hn(r){let e={};for(let t=0;t<r.length;t++){let n=vs(r[t]);for(let i in n)e[i]=n[i]}return e}function Rx(r){let e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function mf(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Tt.workingColorSpace}function Ah(r,e){return r-e}function Fx(r,e){return r.z-e.z}function Ox(r,e){return e.z-r.z}function Gx(r,e,t=0){let n=e.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==e.array.constructor){let i=r.count;for(let s=0;s<i;s++)for(let o=0;o<n;o++)e.setComponent(s+t,o,r.getComponent(s,o))}else e.array.set(r.array,t*n);e.needsUpdate=!0}function Jr(r,e){if(r.constructor!==e.constructor){let t=Math.min(r.length,e.length);for(let n=0;n<t;n++)e[n]=r[n]}else{let t=Math.min(r.length,e.length);e.set(new r.constructor(r.buffer,0,t))}}function Pc(r,e,t,n,i,s,o){let a=r.geometry.attributes.position;if(jc.fromBufferAttribute(a,i),Kc.fromBufferAttribute(a,s),t.distanceSqToSegment(jc,Kc,Ch,Ap)>n)return;Ch.applyMatrix4(r.matrixWorld);let l=e.ray.origin.distanceTo(Ch);if(!(l<e.near||l>e.far))return{distance:l,point:Ap.clone().applyMatrix4(r.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:r}}function Pp(r,e,t,n,i,s,o){let a=zh.distanceSqToPoint(r);if(a<t){let c=new R;zh.closestPointToPoint(r,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}function gf(){let r=0,e=0,t=0,n=0;function i(s,o,a,c){r=s,e=a,t=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){i(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,h,u){let f=(o-s)/l-(a-s)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,d*=h,i(o,a,f,d)},calc:function(s){let o=s*s,a=o*s;return r+e*s+t*o+n*a}}}function Lp(r,e,t,n,i){let s=(n-e)*.5,o=(i-t)*.5,a=r*r,c=r*a;return(2*t-2*n+s+o)*c+(-3*t+3*n-2*s-o)*a+s*r+t}function Wx(r,e){let t=1-r;return t*t*e}function Xx(r,e){return 2*(1-r)*r*e}function qx(r,e){return r*r*e}function $o(r,e,t,n){return Wx(r,e)+Xx(r,t)+qx(r,n)}function Yx(r,e){let t=1-r;return t*t*t*e}function Zx(r,e){let t=1-r;return 3*t*t*r*e}function jx(r,e){return 3*(1-r)*r*r*e}function Kx(r,e){return r*r*r*e}function ea(r,e,t,n,i){return Yx(r,e)+Zx(r,t)+jx(r,n)+Kx(r,i)}function Jx(r,e,t=2){let n=e&&e.length,i=n?e[0]*t:r.length,s=Cm(r,0,i,t,!0),o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(n&&(s=nv(r,e,s,t)),r.length>80*t){a=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=t;f<i;f+=t){let d=r[f],g=r[f+1];d<a&&(a=d),g<c&&(c=g),d>h&&(h=d),g>u&&(u=g)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return ya(s,o,t,a,c,l,0),o}function Cm(r,e,t,n,i){let s;if(i===dv(r,e,t,n)>0)for(let o=e;o<t;o+=n)s=Dp(o/n|0,r[o],r[o+1],s);else for(let o=t-n;o>=e;o-=n)s=Dp(o/n|0,r[o],r[o+1],s);return s&&so(s,s.next)&&(Ea(s),s=s.next),s}function cs(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(so(t,t.next)||rn(t.prev,t,t.next)===0)){if(Ea(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ya(r,e,t,n,i,s,o){if(!r)return;!o&&s&&av(r,n,i,s);let a=r;for(;r.prev!==r.next;){let c=r.prev,l=r.next;if(s?$x(r,n,i,s):Qx(r)){e.push(c.i,r.i,l.i),Ea(r),r=l.next,a=l.next;continue}if(r=l,r===a){o?o===1?(r=ev(cs(r),e),ya(r,e,t,n,i,s,2)):o===2&&tv(r,e,t,n,i,s):ya(cs(r),e,t,n,i,s,1);break}}}function Qx(r){let e=r.prev,t=r,n=r.next;if(rn(e,t,n)>=0)return!1;let i=e.x,s=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=Math.min(i,s,o),u=Math.min(a,c,l),f=Math.max(i,s,o),d=Math.max(a,c,l),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Ko(i,a,s,c,o,l,g.x,g.y)&&rn(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function $x(r,e,t,n){let i=r.prev,s=r,o=r.next;if(rn(i,s,o)>=0)return!1;let a=i.x,c=s.x,l=o.x,h=i.y,u=s.y,f=o.y,d=Math.min(a,c,l),g=Math.min(h,u,f),E=Math.max(a,c,l),m=Math.max(h,u,f),p=kh(d,g,e,t,n),M=kh(E,m,e,t,n),x=r.prevZ,v=r.nextZ;for(;x&&x.z>=p&&v&&v.z<=M;){if(x.x>=d&&x.x<=E&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Ko(a,h,c,u,l,f,x.x,x.y)&&rn(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=d&&v.x<=E&&v.y>=g&&v.y<=m&&v!==i&&v!==o&&Ko(a,h,c,u,l,f,v.x,v.y)&&rn(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=d&&x.x<=E&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Ko(a,h,c,u,l,f,x.x,x.y)&&rn(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=M;){if(v.x>=d&&v.x<=E&&v.y>=g&&v.y<=m&&v!==i&&v!==o&&Ko(a,h,c,u,l,f,v.x,v.y)&&rn(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function ev(r,e){let t=r;do{let n=t.prev,i=t.next.next;!so(n,i)&&Pm(n,t,t.next,i)&&_a(n,i)&&_a(i,n)&&(e.push(n.i,t.i,i.i),Ea(t),Ea(t.next),t=r=i),t=t.next}while(t!==r);return cs(t)}function tv(r,e,t,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&uv(o,a)){let c=Lm(o,a);o=cs(o,o.next),c=cs(c,c.next),ya(o,e,t,n,i,s,0),ya(c,e,t,n,i,s,0);return}a=a.next}o=o.next}while(o!==r)}function nv(r,e,t,n){let i=[];for(let s=0,o=e.length;s<o;s++){let a=e[s]*n,c=s<o-1?e[s+1]*n:r.length,l=Cm(r,a,c,n,!1);l===l.next&&(l.steiner=!0),i.push(lv(l))}i.sort(iv);for(let s=0;s<i.length;s++)t=rv(i[s],t);return t}function iv(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){let n=(r.next.y-r.y)/(r.next.x-r.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function rv(r,e){let t=sv(r,e);if(!t)return e;let n=Lm(t,r);return cs(n,n.next),cs(t,t.next)}function sv(r,e){let t=e,n=r.x,i=r.y,s=-1/0,o;if(so(r,t))return t;do{if(so(r,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>s&&(s=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,c=o.x,l=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Im(i<l?n:s,i,c,l,i<l?s:n,i,t.x,t.y)){let u=Math.abs(i-t.y)/(n-t.x);_a(t,r)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&ov(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function ov(r,e){return rn(r.prev,r,e.prev)<0&&rn(e.next,r,r.next)<0}function av(r,e,t,n){let i=r;do i.z===0&&(i.z=kh(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,cv(i)}function cv(r){let e,t=1;do{let n=r,i;r=null;let s=null;for(e=0;n;){e++;let o=n,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,c--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=o}s.nextZ=null,t*=2}while(e>1);return r}function kh(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function lv(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Im(r,e,t,n,i,s,o,a){return(i-o)*(e-a)>=(r-o)*(s-a)&&(r-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(i-o)*(n-a)}function Ko(r,e,t,n,i,s,o,a){return!(r===o&&e===a)&&Im(r,e,t,n,i,s,o,a)}function uv(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!hv(r,e)&&(_a(r,e)&&_a(e,r)&&fv(r,e)&&(rn(r.prev,r,e.prev)||rn(r,e.prev,e))||so(r,e)&&rn(r.prev,r,r.next)>0&&rn(e.prev,e,e.next)>0)}function rn(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function so(r,e){return r.x===e.x&&r.y===e.y}function Pm(r,e,t,n){let i=Bc(rn(r,e,t)),s=Bc(rn(r,e,n)),o=Bc(rn(t,n,r)),a=Bc(rn(t,n,e));return!!(i!==s&&o!==a||i===0&&Uc(r,t,e)||s===0&&Uc(r,n,e)||o===0&&Uc(t,r,n)||a===0&&Uc(t,e,n))}function Uc(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Bc(r){return r>0?1:r<0?-1:0}function hv(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&Pm(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function _a(r,e){return rn(r.prev,r,r.next)<0?rn(r,e,r.next)>=0&&rn(r,r.prev,e)>=0:rn(r,e,r.prev)<0||rn(r,r.next,e)<0}function fv(r,e){let t=r,n=!1,i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Lm(r,e){let t=Vh(r.i,r.x,r.y),n=Vh(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Dp(r,e,t,n){let i=Vh(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ea(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Vh(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function dv(r,e,t,n){let i=0;for(let s=e,o=t-n;s<t;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}function Np(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Up(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}function mv(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){let s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}function Hc(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function gv(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function xv(r){function e(i,s){return r[i]-r[s]}let t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Bp(r,e,t){let n=r.length,i=new r.constructor(n);for(let s=0,o=0;o!==n;++s){let a=t[s]*e;for(let c=0;c!==e;++c)i[o++]=r[a+c]}return i}function Dm(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push(...o)),s=r[i++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=r[i++];while(s!==void 0)}function vv(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Hi;case"vector":case"vector2":case"vector3":case"vector4":return Oi;case"color":return Ta;case"quaternion":return Fi;case"bool":case"boolean":return ar;case"string":return cr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function yv(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=vv(r.type);if(r.times===void 0){let t=[],n=[];Dm(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}function kp(r,e){return r.distance-e.distance}function jh(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let o=0,a=s.length;o<a;o++)jh(s[o],e,t,!0)}}function yf(r,e,t,n){let i=Pv(n);switch(t){case af:return r*e;case wi:return r*e/i.components*i.byteLength;case Da:return r*e/i.components*i.byteLength;case pr:return r*e*2/i.components*i.byteLength;case Ll:return r*e*2/i.components*i.byteLength;case cf:return r*e*3/i.components*i.byteLength;case ln:return r*e*4/i.components*i.byteLength;case Dl:return r*e*4/i.components*i.byteLength;case Na:case Ua:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Ba:case Ha:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ul:case Hl:return Math.max(r,16)*Math.max(e,8)/4;case Nl:case Bl:return Math.max(r,8)*Math.max(e,8)/2;case Fl:case Ol:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case zl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case kl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Vl:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Gl:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Xl:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case ql:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Zl:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case jl:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Kl:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Jl:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Ql:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case $l:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case eu:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case tu:case nu:case iu:return Math.ceil(r/4)*Math.ceil(e/4)*16;case ru:case su:return Math.ceil(r/4)*Math.ceil(e/4)*8;case ou:case au:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Pv(r){switch(r){case Si:case nf:return{byteLength:1,components:1};case uo:case rf:case qt:return{byteLength:2,components:1};case Il:case Pl:return{byteLength:2,components:4};case dr:case Cl:case cn:return{byteLength:4,components:1};case sf:case of:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}var Gp,Kh,Wp,Jh,dl,zi,An,Mn,Mt,Mi,ns,Pa,Qh,$h,Xp,br,qp,Yp,Zp,jp,Kp,Jp,Qp,$p,zc,kc,em,tm,nm,im,rm,sm,om,am,cm,pl,ml,gl,is,xl,vl,yl,_l,ef,lm,um,fr,El,Ml,Sl,wl,Tl,ao,bl,Hh,hm,tf,ms,gs,co,Al,La,hn,ri,Ar,gn,Rl,xs,Vt,lo,ci,Si,nf,rf,uo,Cl,dr,cn,qt,Il,Pl,ho,sf,of,af,cf,ln,Zs,fo,wi,Da,pr,Ll,Dl,Na,Ua,Ba,Ha,Nl,Ul,Bl,Hl,Fl,Ol,zl,kl,Vl,Gl,Wl,Xl,ql,Yl,Zl,jl,Kl,Jl,Ql,$l,eu,tu,nu,iu,ru,su,ou,au,fm,dm,pm,rs,ss,Oc,$r,es,ta,cu,mm,lf,Fa,po,gm,xm,uf,vm,mr,bt,Xt,na,Ft,Qr,Fh,ym,_m,Em,hf,Mm,Sm,wm,Tm,Vc,lu,ff,si,ia,Li,In,Qd,Jo,os,_t,de,$t,R,rh,$d,yt,sh,ep,tp,np,Tt,Ps,Gc,fx,Js,dx,ah,en,At,Wc,sn,ra,Xc,ht,Ji,di,lc,Ls,Ds,Ns,_r,Er,qr,ko,uc,hc,Yr,px,Vo,lh,mn,Qi,uh,fc,Mr,hh,dc,fh,Di,ke,Us,pi,mx,gx,Sr,pc,Jn,ip,rp,xi,Qs,xx,sp,Bs,$i,mc,Go,vx,yx,op,ap,cp,lp,_x,Hs,dh,Ct,mi,er,ph,tr,Fs,Os,up,mh,gh,xh,vh,yh,_h,Nn,Rm,wr,gc,Ve,Pn,Ex,Yn,_n,ir,vi,pn,xc,Tx,Rt,sa,oa,Ke,bx,ii,Mh,zs,Qn,Wo,bn,gt,hp,Zr,vc,fp,yc,_c,Ec,Sh,Mc,dp,Sc,_e,xn,Fn,Cx,Ix,Nt,aa,Tr,pp,mp,an,ks,Vs,qc,ca,Yc,Dt,Px,$s,la,eo,zn,to,gp,xp,vp,Lx,yp,Tc,wh,_p,Th,En,sr,$n,Ep,Dx,ua,Rr,Gs,Mp,bc,Sp,Nx,Xo,qo,ot,bh,Ux,Bx,Dn,jr,Hx,Ac,Cr,Ci,Ii,Zc,Oh,qn,zx,wp,kx,Rc,Kr,Yo,Tp,Vx,Rh,Ln,Cc,ha,no,jc,Kc,bp,Zo,Ic,Ch,Ap,Ni,Rp,Cp,Ui,Ir,io,Ip,zh,Lc,Dc,yi,fa,Pr,da,vn,Lr,Jc,ei,ro,Qc,Nc,Ih,Ph,Lh,Zn,pa,$c,ma,el,ga,xa,va,tl,nl,as,Dr,Gh,ts,ls,pv,Nr,Ma,Bi,Un,Ur,_i,Sa,Xe,Jt,il,rl,or,sl,wa,ol,jn,ar,Ta,Hi,al,Fi,cr,Oi,us,Pi,cl,Nm,Ei,nr,Wh,hs,Ws,ll,fs,tn,ds,lr,Dh,Hp,Fp,ba,Xh,oo,Op,jo,Nh,qh,ps,ur,Yh,ai,hr,Uh,Aa,ul,Ra,hl,xf,_v,vf,Ev,Mv,Sv,wv,Tv,bv,Av,Zh,Ht,fl,Rv,Ca,zp,Bn,Ia,Vp,Fc,Xs,qs,Bh,Cv,Iv,kn,_f=cc(()=>{Gp=0,Kh=1,Wp=2,Jh=1,dl=2,zi=3,An=0,Mn=1,Mt=2,Mi=0,ns=1,Pa=2,Qh=3,$h=4,Xp=5,br=100,qp=101,Yp=102,Zp=103,jp=104,Kp=200,Jp=201,Qp=202,$p=203,zc=204,kc=205,em=206,tm=207,nm=208,im=209,rm=210,sm=211,om=212,am=213,cm=214,pl=0,ml=1,gl=2,is=3,xl=4,vl=5,yl=6,_l=7,ef=0,lm=1,um=2,fr=0,El=1,Ml=2,Sl=3,wl=4,Tl=5,ao=6,bl=7,Hh="attached",hm="detached",tf=300,ms=301,gs=302,co=303,Al=304,La=306,hn=1e3,ri=1001,Ar=1002,gn=1003,Rl=1004,xs=1005,Vt=1006,lo=1007,ci=1008,Si=1009,nf=1010,rf=1011,uo=1012,Cl=1013,dr=1014,cn=1015,qt=1016,Il=1017,Pl=1018,ho=1020,sf=35902,of=35899,af=1021,cf=1022,ln=1023,Zs=1026,fo=1027,wi=1028,Da=1029,pr=1030,Ll=1031,Dl=1033,Na=33776,Ua=33777,Ba=33778,Ha=33779,Nl=35840,Ul=35841,Bl=35842,Hl=35843,Fl=36196,Ol=37492,zl=37496,kl=37808,Vl=37809,Gl=37810,Wl=37811,Xl=37812,ql=37813,Yl=37814,Zl=37815,jl=37816,Kl=37817,Jl=37818,Ql=37819,$l=37820,eu=37821,tu=36492,nu=36494,iu=36495,ru=36283,su=36284,ou=36285,au=36286,fm=2200,dm=2201,pm=2202,rs=2300,ss=2301,Oc=2302,$r=2400,es=2401,ta=2402,cu=2500,mm=2501,lf=0,Fa=1,po=2,gm=3200,xm=3201,uf=0,vm=1,mr="",bt="srgb",Xt="srgb-linear",na="linear",Ft="srgb",Qr=7680,Fh=519,ym=512,_m=513,Em=514,hf=515,Mm=516,Sm=517,wm=518,Tm=519,Vc=35044,lu=35048,ff="300 es",si=2e3,ia=2001,Li=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}},In=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qd=1234567,Jo=Math.PI/180,os=180/Math.PI;_t={DEG2RAD:Jo,RAD2DEG:os,generateUUID:oi,clamp:mt,euclideanModulo:df,mapLinear:j0,inverseLerp:K0,lerp:Qo,damp:J0,pingpong:Q0,smoothstep:$0,smootherstep:ex,randInt:tx,randFloat:nx,randFloatSpread:ix,seededRandom:rx,degToRad:sx,radToDeg:ox,isPowerOfTwo:ax,ceilPowerOfTwo:cx,floorPowerOfTwo:lx,setQuaternionFromProperEuler:ux,normalize:Wt,denormalize:gi},de=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(mt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(mt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},$t=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],f=s[o+0],d=s[o+1],g=s[o+2],E=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=E;return}if(u!==E||c!==f||l!==d||h!==g){let m=1-a,p=c*f+l*d+h*g+u*E,M=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){let S=Math.sqrt(x),A=Math.atan2(S,p*M);m=Math.sin(m*A)/S,a=Math.sin(a*A)/S}let v=a*M;if(c=c*m+f*v,l=l*m+d*v,h=h*m+g*v,u=u*m+E*v,m===1-a){let S=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=S,l*=S,h*=S,u*=S}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,o){let a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=s[o],f=s[o+1],d=s[o+2],g=s[o+3];return e[t]=a*g+h*u+c*d-l*f,e[t+1]=c*g+h*f+l*u-a*d,e[t+2]=l*g+h*d+a*f-c*u,e[t+3]=h*g-a*u-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(s/2),f=c(n/2),d=c(i/2),g=c(s/2);switch(o){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(s-l)*d,this._z=(o-i)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(s+l)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(s-l)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(c+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(s+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(mt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+i*l-s*c,this._y=i*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,s=this._z,o=this._w,a=o*e._w+n*e._x+i*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;let c=1-a*a;if(c<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*s+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=s*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class r{constructor(e=0,t=0,n=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion($d.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion($d.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*i-a*n),h=2*(a*t-s*i),u=2*(s*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-s*u,this.z=i+c*u+s*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this.z=mt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this.z=mt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(mt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=i*c-s*a,this.y=s*o-n*c,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return rh.copy(this).projectOnVector(e),this.sub(rh)}reflect(e){return this.sub(rh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(mt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},rh=new R,$d=new $t,yt=class r{constructor(e,t,n,i,s,o,a,c,l){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,c,l)}set(e,t,n,i,s,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],E=i[0],m=i[3],p=i[6],M=i[1],x=i[4],v=i[7],S=i[2],A=i[5],C=i[8];return s[0]=o*E+a*M+c*S,s[3]=o*m+a*x+c*A,s[6]=o*p+a*v+c*C,s[1]=l*E+h*M+u*S,s[4]=l*m+h*x+u*A,s[7]=l*p+h*v+u*C,s[2]=f*E+d*M+g*S,s[5]=f*m+d*x+g*A,s[8]=f*p+d*v+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*s*h+n*a*c+i*s*l-i*o*c}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,f=a*c-h*s,d=l*s-o*c,g=t*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let E=1/g;return e[0]=u*E,e[1]=(i*l-h*n)*E,e[2]=(a*n-i*o)*E,e[3]=f*E,e[4]=(h*t-i*c)*E,e[5]=(i*s-a*t)*E,e[6]=d*E,e[7]=(n*c-l*t)*E,e[8]=(o*t-n*s)*E,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,a){let c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-i*l,i*c,-i*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(sh.makeScale(e,t)),this}rotate(e){return this.premultiply(sh.makeRotation(-e)),this}translate(e,t){return this.premultiply(sh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},sh=new yt;ep={};tp=new yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),np=new yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Tt=hx();Gc=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ps===void 0&&(Ps=js("canvas")),Ps.width=e.width,Ps.height=e.height;let i=Ps.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ps}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=js("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=rr(s[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(rr(t[n]/255)*255):t[n]=rr(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},fx=0,Js=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fx++}),this.uuid=oi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(oh(i[o].image)):s.push(oh(i[o]))}else s=oh(i);n.url=s}return t||(e.images[this.uuid]=n),n}};dx=0,ah=new R,en=class r extends Li{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=ri,i=ri,s=Vt,o=ci,a=ln,c=Si,l=r.DEFAULT_ANISOTROPY,h=mr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dx++}),this.uuid=oi(),this.name="",this.source=new Js(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ah).x}get height(){return this.source.getSize(ah).y}get depth(){return this.source.getSize(ah).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==tf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case hn:e.x=e.x-Math.floor(e.x);break;case ri:e.x=e.x<0?0:1;break;case Ar:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case hn:e.y=e.y-Math.floor(e.y);break;case ri:e.y=e.y<0?0:1;break;case Ar:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=tf;en.DEFAULT_ANISOTROPY=1;At=class r{constructor(e=0,t=0,n=0,i=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,c=e.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],E=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-E)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+E)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(l+1)/2,v=(d+1)/2,S=(p+1)/2,A=(h+f)/4,C=(u+E)/4,I=(g+m)/4;return x>v&&x>S?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=A/n,s=C/n):v>S?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=A/i,s=I/i):S<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(S),n=C/s,i=I/s),this.set(n,i,s,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-E)*(u-E)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-E)/M,this.z=(f-h)/M,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this.z=mt(this.z,e.z,t.z),this.w=mt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this.z=mt(this.z,e,t),this.w=mt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(mt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Wc=class extends Li{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t);let i={width:e,height:t,depth:n.depth},s=new en(i);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Vt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Js(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},sn=class extends Wc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ra=class extends en{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=gn,this.minFilter=gn,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Xc=class extends en{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=gn,this.minFilter=gn,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ht=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(di.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(di.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=di.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,di):di.fromBufferAttribute(s,o),di.applyMatrix4(e.matrixWorld),this.expandByPoint(di);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),lc.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),lc.copy(n.boundingBox)),lc.applyMatrix4(e.matrixWorld),this.union(lc)}let i=e.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,di),di.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ko),uc.subVectors(this.max,ko),Ls.subVectors(e.a,ko),Ds.subVectors(e.b,ko),Ns.subVectors(e.c,ko),_r.subVectors(Ds,Ls),Er.subVectors(Ns,Ds),qr.subVectors(Ls,Ns);let t=[0,-_r.z,_r.y,0,-Er.z,Er.y,0,-qr.z,qr.y,_r.z,0,-_r.x,Er.z,0,-Er.x,qr.z,0,-qr.x,-_r.y,_r.x,0,-Er.y,Er.x,0,-qr.y,qr.x,0];return!ch(t,Ls,Ds,Ns,uc)||(t=[1,0,0,0,1,0,0,0,1],!ch(t,Ls,Ds,Ns,uc))?!1:(hc.crossVectors(_r,Er),t=[hc.x,hc.y,hc.z],ch(t,Ls,Ds,Ns,uc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,di).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(di).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ji[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ji[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ji[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ji[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ji[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ji[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ji[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ji[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ji),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ji=[new R,new R,new R,new R,new R,new R,new R,new R],di=new R,lc=new ht,Ls=new R,Ds=new R,Ns=new R,_r=new R,Er=new R,qr=new R,ko=new R,uc=new R,hc=new R,Yr=new R;px=new ht,Vo=new R,lh=new R,mn=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):px.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vo.subVectors(e,this.center);let t=Vo.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Vo,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(lh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vo.copy(e.center).add(lh)),this.expandByPoint(Vo.copy(e.center).sub(lh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Qi=new R,uh=new R,fc=new R,Mr=new R,hh=new R,dc=new R,fh=new R,Di=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Qi.copy(this.origin).addScaledVector(this.direction,t),Qi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){uh.copy(e).add(t).multiplyScalar(.5),fc.copy(t).sub(e).normalize(),Mr.copy(this.origin).sub(uh);let s=e.distanceTo(t)*.5,o=-this.direction.dot(fc),a=Mr.dot(this.direction),c=-Mr.dot(fc),l=Mr.lengthSq(),h=Math.abs(1-o*o),u,f,d,g;if(h>0)if(u=o*c-a,f=o*a-c,g=s*h,u>=0)if(f>=-g)if(f<=g){let E=1/h;u*=E,f*=E,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=s,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-s,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-o*s+a)),f=u>0?-s:Math.min(Math.max(-s,-c),s),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-s,-c),s),d=f*(f+2*c)+l):(u=Math.max(0,-(o*s+a)),f=u>0?s:Math.min(Math.max(-s,-c),s),d=-u*u+f*(f+2*c)+l);else f=o>0?-s:s,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(uh).addScaledVector(fc,f),d}intersectSphere(e,t){Qi.subVectors(e.center,this.origin);let n=Qi.dot(this.direction),i=Qi.dot(Qi)-n*n,s=e.radius*e.radius;if(i>s)return null;let o=Math.sqrt(s-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,i=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,i=(e.min.x-f.x)*l),h>=0?(s=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Qi)!==null}intersectTriangle(e,t,n,i,s){hh.subVectors(t,e),dc.subVectors(n,e),fh.crossVectors(hh,dc);let o=this.direction.dot(fh),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Mr.subVectors(this.origin,e);let c=a*this.direction.dot(dc.crossVectors(Mr,dc));if(c<0)return null;let l=a*this.direction.dot(hh.cross(Mr));if(l<0||c+l>o)return null;let h=-a*Mr.dot(fh);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ke=class r{constructor(e,t,n,i,s,o,a,c,l,h,u,f,d,g,E,m){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,c,l,h,u,f,d,g,E,m)}set(e,t,n,i,s,o,a,c,l,h,u,f,d,g,E,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=E,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Us.setFromMatrixColumn(e,0).length(),s=1/Us.setFromMatrixColumn(e,1).length(),o=1/Us.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let f=o*h,d=o*u,g=a*h,E=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=d+g*l,t[5]=f-E*l,t[9]=-a*c,t[2]=E-f*l,t[6]=g+d*l,t[10]=o*c}else if(e.order==="YXZ"){let f=c*h,d=c*u,g=l*h,E=l*u;t[0]=f+E*a,t[4]=g*a-d,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-g,t[6]=E+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*h,d=c*u,g=l*h,E=l*u;t[0]=f-E*a,t[4]=-o*u,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*h,t[9]=E-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*h,d=o*u,g=a*h,E=a*u;t[0]=c*h,t[4]=g*l-d,t[8]=f*l+E,t[1]=c*u,t[5]=E*l+f,t[9]=d*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,d=o*l,g=a*c,E=a*l;t[0]=c*h,t[4]=E-f*u,t[8]=g*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=d*u+g,t[10]=f-E*u}else if(e.order==="XZY"){let f=o*c,d=o*l,g=a*c,E=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=f*u+E,t[5]=o*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=a*h,t[10]=E*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(mx,e,gx)}lookAt(e,t,n){let i=this.elements;return Jn.subVectors(e,t),Jn.lengthSq()===0&&(Jn.z=1),Jn.normalize(),Sr.crossVectors(n,Jn),Sr.lengthSq()===0&&(Math.abs(n.z)===1?Jn.x+=1e-4:Jn.z+=1e-4,Jn.normalize(),Sr.crossVectors(n,Jn)),Sr.normalize(),pc.crossVectors(Jn,Sr),i[0]=Sr.x,i[4]=pc.x,i[8]=Jn.x,i[1]=Sr.y,i[5]=pc.y,i[9]=Jn.y,i[2]=Sr.z,i[6]=pc.z,i[10]=Jn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],E=n[6],m=n[10],p=n[14],M=n[3],x=n[7],v=n[11],S=n[15],A=i[0],C=i[4],I=i[8],w=i[12],_=i[1],b=i[5],P=i[9],U=i[13],N=i[2],H=i[6],V=i[10],Z=i[14],X=i[3],z=i[7],Y=i[11],J=i[15];return s[0]=o*A+a*_+c*N+l*X,s[4]=o*C+a*b+c*H+l*z,s[8]=o*I+a*P+c*V+l*Y,s[12]=o*w+a*U+c*Z+l*J,s[1]=h*A+u*_+f*N+d*X,s[5]=h*C+u*b+f*H+d*z,s[9]=h*I+u*P+f*V+d*Y,s[13]=h*w+u*U+f*Z+d*J,s[2]=g*A+E*_+m*N+p*X,s[6]=g*C+E*b+m*H+p*z,s[10]=g*I+E*P+m*V+p*Y,s[14]=g*w+E*U+m*Z+p*J,s[3]=M*A+x*_+v*N+S*X,s[7]=M*C+x*b+v*H+S*z,s[11]=M*I+x*P+v*V+S*Y,s[15]=M*w+x*U+v*Z+S*J,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],E=e[7],m=e[11],p=e[15];return g*(+s*c*u-i*l*u-s*a*f+n*l*f+i*a*d-n*c*d)+E*(+t*c*d-t*l*f+s*o*f-i*o*d+i*l*h-s*c*h)+m*(+t*l*u-t*a*d-s*o*u+n*o*d+s*a*h-n*l*h)+p*(-i*a*h-t*c*u+t*a*f+i*o*u-n*o*f+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],E=e[13],m=e[14],p=e[15],M=u*m*l-E*f*l+E*c*d-a*m*d-u*c*p+a*f*p,x=g*f*l-h*m*l-g*c*d+o*m*d+h*c*p-o*f*p,v=h*E*l-g*u*l+g*a*d-o*E*d-h*a*p+o*u*p,S=g*u*c-h*E*c-g*a*f+o*E*f+h*a*m-o*u*m,A=t*M+n*x+i*v+s*S;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/A;return e[0]=M*C,e[1]=(E*f*s-u*m*s-E*i*d+n*m*d+u*i*p-n*f*p)*C,e[2]=(a*m*s-E*c*s+E*i*l-n*m*l-a*i*p+n*c*p)*C,e[3]=(u*c*s-a*f*s-u*i*l+n*f*l+a*i*d-n*c*d)*C,e[4]=x*C,e[5]=(h*m*s-g*f*s+g*i*d-t*m*d-h*i*p+t*f*p)*C,e[6]=(g*c*s-o*m*s-g*i*l+t*m*l+o*i*p-t*c*p)*C,e[7]=(o*f*s-h*c*s+h*i*l-t*f*l-o*i*d+t*c*d)*C,e[8]=v*C,e[9]=(g*u*s-h*E*s-g*n*d+t*E*d+h*n*p-t*u*p)*C,e[10]=(o*E*s-g*a*s+g*n*l-t*E*l-o*n*p+t*a*p)*C,e[11]=(h*a*s-o*u*s-h*n*l+t*u*l+o*n*d-t*a*d)*C,e[12]=S*C,e[13]=(h*E*i-g*u*i+g*n*f-t*E*f-h*n*m+t*u*m)*C,e[14]=(g*a*i-o*E*i-g*n*c+t*E*c+o*n*m-t*a*m)*C,e[15]=(o*u*i-h*a*i+h*n*c-t*u*c-o*n*f+t*a*f)*C,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,a=e.y,c=e.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,h=o+o,u=a+a,f=s*l,d=s*h,g=s*u,E=o*h,m=o*u,p=a*u,M=c*l,x=c*h,v=c*u,S=n.x,A=n.y,C=n.z;return i[0]=(1-(E+p))*S,i[1]=(d+v)*S,i[2]=(g-x)*S,i[3]=0,i[4]=(d-v)*A,i[5]=(1-(f+p))*A,i[6]=(m+M)*A,i[7]=0,i[8]=(g+x)*C,i[9]=(m-M)*C,i[10]=(1-(f+E))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,s=Us.set(i[0],i[1],i[2]).length(),o=Us.set(i[4],i[5],i[6]).length(),a=Us.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],pi.copy(this);let l=1/s,h=1/o,u=1/a;return pi.elements[0]*=l,pi.elements[1]*=l,pi.elements[2]*=l,pi.elements[4]*=h,pi.elements[5]*=h,pi.elements[6]*=h,pi.elements[8]*=u,pi.elements[9]*=u,pi.elements[10]*=u,t.setFromRotationMatrix(pi),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,o,a=si,c=!1){let l=this.elements,h=2*s/(t-e),u=2*s/(n-i),f=(t+e)/(t-e),d=(n+i)/(n-i),g,E;if(c)g=s/(o-s),E=o*s/(o-s);else if(a===si)g=-(o+s)/(o-s),E=-2*o*s/(o-s);else if(a===ia)g=-o/(o-s),E=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=E,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,o,a=si,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-i),f=-(t+e)/(t-e),d=-(n+i)/(n-i),g,E;if(c)g=1/(o-s),E=o/(o-s);else if(a===si)g=-2/(o-s),E=-(o+s)/(o-s);else if(a===ia)g=-1/(o-s),E=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=g,l[14]=E,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Us=new R,pi=new ke,mx=new R(0,0,0),gx=new R(1,1,1),Sr=new R,pc=new R,Jn=new R,ip=new ke,rp=new $t,xi=class r{constructor(e=0,t=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(mt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-mt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(mt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-mt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(mt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-mt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ip.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ip,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return rp.setFromEuler(this),this.setFromQuaternion(rp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};xi.DEFAULT_ORDER="XYZ";Qs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},xx=0,sp=new R,Bs=new $t,$i=new ke,mc=new R,Go=new R,vx=new R,yx=new $t,op=new R(1,0,0),ap=new R(0,1,0),cp=new R(0,0,1),lp={type:"added"},_x={type:"removed"},Hs={type:"childadded",child:null},dh={type:"childremoved",child:null},Ct=class r extends Li{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xx++}),this.uuid=oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new R,t=new xi,n=new $t,i=new R(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ke},normalMatrix:{value:new yt}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Bs.setFromAxisAngle(e,t),this.quaternion.multiply(Bs),this}rotateOnWorldAxis(e,t){return Bs.setFromAxisAngle(e,t),this.quaternion.premultiply(Bs),this}rotateX(e){return this.rotateOnAxis(op,e)}rotateY(e){return this.rotateOnAxis(ap,e)}rotateZ(e){return this.rotateOnAxis(cp,e)}translateOnAxis(e,t){return sp.copy(e).applyQuaternion(this.quaternion),this.position.add(sp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(op,e)}translateY(e){return this.translateOnAxis(ap,e)}translateZ(e){return this.translateOnAxis(cp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($i.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?mc.copy(e):mc.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Go.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$i.lookAt(Go,mc,this.up):$i.lookAt(mc,Go,this.up),this.quaternion.setFromRotationMatrix($i),i&&($i.extractRotation(i.matrixWorld),Bs.setFromRotationMatrix($i),this.quaternion.premultiply(Bs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lp),Hs.child=e,this.dispatchEvent(Hs),Hs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_x),dh.child=e,this.dispatchEvent(dh),dh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$i.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$i.multiply(e.parent.matrixWorld)),e.applyMatrix4($i),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lp),Hs.child=e,this.dispatchEvent(Hs),Hs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Go,e,vx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Go,yx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];s(e.shapes,u)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(s(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};Ct.DEFAULT_UP=new R(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;mi=new R,er=new R,ph=new R,tr=new R,Fs=new R,Os=new R,up=new R,mh=new R,gh=new R,xh=new R,vh=new At,yh=new At,_h=new At,Nn=class r{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),mi.subVectors(e,t),i.cross(mi);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){mi.subVectors(i,t),er.subVectors(n,t),ph.subVectors(e,t);let o=mi.dot(mi),a=mi.dot(er),c=mi.dot(ph),l=er.dot(er),h=er.dot(ph),u=o*l-a*a;if(u===0)return s.set(0,0,0),null;let f=1/u,d=(l*c-a*h)*f,g=(o*h-a*c)*f;return s.set(1-d-g,g,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,tr)===null?!1:tr.x>=0&&tr.y>=0&&tr.x+tr.y<=1}static getInterpolation(e,t,n,i,s,o,a,c){return this.getBarycoord(e,t,n,i,tr)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,tr.x),c.addScaledVector(o,tr.y),c.addScaledVector(a,tr.z),c)}static getInterpolatedAttribute(e,t,n,i,s,o){return vh.setScalar(0),yh.setScalar(0),_h.setScalar(0),vh.fromBufferAttribute(e,t),yh.fromBufferAttribute(e,n),_h.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(vh,s.x),o.addScaledVector(yh,s.y),o.addScaledVector(_h,s.z),o}static isFrontFacing(e,t,n,i){return mi.subVectors(n,t),er.subVectors(e,t),mi.cross(er).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mi.subVectors(this.c,this.b),er.subVectors(this.a,this.b),mi.cross(er).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return r.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,o,a;Fs.subVectors(i,n),Os.subVectors(s,n),mh.subVectors(e,n);let c=Fs.dot(mh),l=Os.dot(mh);if(c<=0&&l<=0)return t.copy(n);gh.subVectors(e,i);let h=Fs.dot(gh),u=Os.dot(gh);if(h>=0&&u<=h)return t.copy(i);let f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Fs,o);xh.subVectors(e,s);let d=Fs.dot(xh),g=Os.dot(xh);if(g>=0&&d<=g)return t.copy(s);let E=d*l-c*g;if(E<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Os,a);let m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return up.subVectors(s,i),a=(u-h)/(u-h+(d-g)),t.copy(i).addScaledVector(up,a);let p=1/(m+E+f);return o=E*p,a=f*p,t.copy(n).addScaledVector(Fs,o).addScaledVector(Os,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Rm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wr={h:0,s:0,l:0},gc={h:0,s:0,l:0};Ve=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Tt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Tt.workingColorSpace){if(e=df(e,1),t=mt(t,0,1),n=mt(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=Eh(o,s,e+1/3),this.g=Eh(o,s,e),this.b=Eh(o,s,e-1/3)}return Tt.colorSpaceToWorking(this,i),this}setStyle(e,t=bt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){let n=Rm[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=rr(e.r),this.g=rr(e.g),this.b=rr(e.b),this}copyLinearToSRGB(e){return this.r=Ys(e.r),this.g=Ys(e.g),this.b=Ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return Tt.workingToColorSpace(Pn.copy(this),e),Math.round(mt(Pn.r*255,0,255))*65536+Math.round(mt(Pn.g*255,0,255))*256+Math.round(mt(Pn.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Tt.workingColorSpace){Tt.workingToColorSpace(Pn.copy(this),t);let n=Pn.r,i=Pn.g,s=Pn.b,o=Math.max(n,i,s),a=Math.min(n,i,s),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-s)/u+(i<s?6:0);break;case i:c=(s-n)/u+2;break;case s:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Tt.workingColorSpace){return Tt.workingToColorSpace(Pn.copy(this),t),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=bt){Tt.workingToColorSpace(Pn.copy(this),e);let t=Pn.r,n=Pn.g,i=Pn.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(wr),this.setHSL(wr.h+e,wr.s+t,wr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(wr),e.getHSL(gc);let n=Qo(wr.h,gc.h,t),i=Qo(wr.s,gc.s,t),s=Qo(wr.l,gc.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pn=new Ve;Ve.NAMES=Rm;Ex=0,Yn=class extends Li{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ex++}),this.uuid=oi(),this.name="",this.type="Material",this.blending=ns,this.side=An,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zc,this.blendDst=kc,this.blendEquation=br,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qr,this.stencilZFail=Qr,this.stencilZPass=Qr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ns&&(n.blending=this.blending),this.side!==An&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==zc&&(n.blendSrc=this.blendSrc),this.blendDst!==kc&&(n.blendDst=this.blendDst),this.blendEquation!==br&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==is&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Qr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Qr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let o=[];for(let a in s){let c=s[a];delete c.metadata,o.push(c)}return o}if(t){let s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},_n=class extends Yn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.combine=ef,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ir=Mx();vi=class{static toHalfFloat(e){return Sx(e)}static fromHalfFloat(e){return wx(e)}},pn=new R,xc=new de,Tx=0,Rt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tx++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Vc,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xc.fromBufferAttribute(this,t),xc.applyMatrix3(e),this.setXY(t,xc.x,xc.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)pn.fromBufferAttribute(this,t),pn.applyMatrix3(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)pn.fromBufferAttribute(this,t),pn.applyMatrix4(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pn.fromBufferAttribute(this,t),pn.applyNormalMatrix(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pn.fromBufferAttribute(this,t),pn.transformDirection(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=gi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array),i=Wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array),i=Wt(i,this.array),s=Wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Vc&&(e.usage=this.usage),e}},sa=class extends Rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}},oa=class extends Rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Ke=class extends Rt{constructor(e,t,n){super(new Float32Array(e),t,n)}},bx=0,ii=new ke,Mh=new Ct,zs=new R,Qn=new ht,Wo=new ht,bn=new R,gt=class r extends Li{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bx++}),this.uuid=oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(pf(e)?oa:sa)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new yt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ii.makeRotationFromQuaternion(e),this.applyMatrix4(ii),this}rotateX(e){return ii.makeRotationX(e),this.applyMatrix4(ii),this}rotateY(e){return ii.makeRotationY(e),this.applyMatrix4(ii),this}rotateZ(e){return ii.makeRotationZ(e),this.applyMatrix4(ii),this}translate(e,t,n){return ii.makeTranslation(e,t,n),this.applyMatrix4(ii),this}scale(e,t,n){return ii.makeScale(e,t,n),this.applyMatrix4(ii),this}lookAt(e){return Mh.lookAt(e),Mh.updateMatrix(),this.applyMatrix4(Mh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ke(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ht);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];Qn.setFromBufferAttribute(s),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,Qn.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,Qn.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(Qn.min),this.boundingBox.expandByPoint(Qn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){let n=this.boundingSphere.center;if(Qn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Wo.setFromBufferAttribute(a),this.morphTargetsRelative?(bn.addVectors(Qn.min,Wo.min),Qn.expandByPoint(bn),bn.addVectors(Qn.max,Wo.max),Qn.expandByPoint(bn)):(Qn.expandByPoint(Wo.min),Qn.expandByPoint(Wo.max))}Qn.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)bn.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(bn));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)bn.fromBufferAttribute(a,l),c&&(zs.fromBufferAttribute(e,l),bn.add(zs)),i=Math.max(i,n.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Rt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let I=0;I<n.count;I++)a[I]=new R,c[I]=new R;let l=new R,h=new R,u=new R,f=new de,d=new de,g=new de,E=new R,m=new R;function p(I,w,_){l.fromBufferAttribute(n,I),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,_),f.fromBufferAttribute(s,I),d.fromBufferAttribute(s,w),g.fromBufferAttribute(s,_),h.sub(l),u.sub(l),d.sub(f),g.sub(f);let b=1/(d.x*g.y-g.x*d.y);isFinite(b)&&(E.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(b),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(b),a[I].add(E),a[w].add(E),a[_].add(E),c[I].add(m),c[w].add(m),c[_].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let I=0,w=M.length;I<w;++I){let _=M[I],b=_.start,P=_.count;for(let U=b,N=b+P;U<N;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let x=new R,v=new R,S=new R,A=new R;function C(I){S.fromBufferAttribute(i,I),A.copy(S);let w=a[I];x.copy(w),x.sub(S.multiplyScalar(S.dot(w))).normalize(),v.crossVectors(A,w);let b=v.dot(c[I])<0?-1:1;o.setXYZW(I,x.x,x.y,x.z,b)}for(let I=0,w=M.length;I<w;++I){let _=M[I],b=_.start,P=_.count;for(let U=b,N=b+P;U<N;U+=3)C(e.getX(U+0)),C(e.getX(U+1)),C(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let i=new R,s=new R,o=new R,a=new R,c=new R,l=new R,h=new R,u=new R;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),E=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,E),o.fromBufferAttribute(t,m),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,E),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(E,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bn.fromBufferAttribute(e,t),bn.normalize(),e.setXYZ(t,bn.x,bn.y,bn.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h),d=0,g=0;for(let E=0,m=c.length;E<m;E++){a.isInterleavedBufferAttribute?d=c[E]*a.data.stride+a.offset:d=c[E]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new Rt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=e(c,n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let c=[],l=s[a];for(let h=0,u=l.length;h<u;h++){let f=l[h],d=e(f,n);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let i={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){let d=l[u];h.push(d.toJSON(e.data))}h.length>0&&(i[c]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(t))}let s=e.morphAttributes;for(let l in s){let h=[],u=s[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},hp=new ke,Zr=new Di,vc=new mn,fp=new R,yc=new R,_c=new R,Ec=new R,Sh=new R,Mc=new R,dp=new R,Sc=new R,_e=class extends Ct{constructor(e=new gt,t=new _n){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){Mc.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let h=a[c],u=s[c];h!==0&&(Sh.fromBufferAttribute(u,e),o?Mc.addScaledVector(Sh,h):Mc.addScaledVector(Sh.sub(t),h))}t.add(Mc)}return t}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vc.copy(n.boundingSphere),vc.applyMatrix4(s),Zr.copy(e.ray).recast(e.near),!(vc.containsPoint(Zr.origin)===!1&&(Zr.intersectSphere(vc,fp)===null||Zr.origin.distanceToSquared(fp)>(e.far-e.near)**2))&&(hp.copy(s).invert(),Zr.copy(e.ray).applyMatrix4(hp),!(n.boundingBox!==null&&Zr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Zr)))}_computeIntersections(e,t,n){let i,s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,E=f.length;g<E;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),x=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let v=M,S=x;v<S;v+=3){let A=a.getX(v),C=a.getX(v+1),I=a.getX(v+2);i=wc(this,p,e,n,l,h,u,A,C,I),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,d.start),E=Math.min(a.count,d.start+d.count);for(let m=g,p=E;m<p;m+=3){let M=a.getX(m),x=a.getX(m+1),v=a.getX(m+2);i=wc(this,o,e,n,l,h,u,M,x,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,E=f.length;g<E;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),x=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let v=M,S=x;v<S;v+=3){let A=v,C=v+1,I=v+2;i=wc(this,p,e,n,l,h,u,A,C,I),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,d.start),E=Math.min(c.count,d.start+d.count);for(let m=g,p=E;m<p;m+=3){let M=m,x=m+1,v=m+2;i=wc(this,o,e,n,l,h,u,M,x,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};xn=class r extends gt{constructor(e=1,t=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};let a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);let c=[],l=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(c),this.setAttribute("position",new Ke(l,3)),this.setAttribute("normal",new Ke(h,3)),this.setAttribute("uv",new Ke(u,2));function g(E,m,p,M,x,v,S,A,C,I,w){let _=v/C,b=S/I,P=v/2,U=S/2,N=A/2,H=C+1,V=I+1,Z=0,X=0,z=new R;for(let Y=0;Y<V;Y++){let J=Y*b-U;for(let ne=0;ne<H;ne++){let ae=ne*_-P;z[E]=ae*M,z[m]=J*x,z[p]=N,l.push(z.x,z.y,z.z),z[E]=0,z[m]=0,z[p]=A>0?1:-1,h.push(z.x,z.y,z.z),u.push(ne/C),u.push(1-Y/I),Z+=1}}for(let Y=0;Y<I;Y++)for(let J=0;J<C;J++){let ne=f+J+H*Y,ae=f+J+H*(Y+1),Ue=f+(J+1)+H*(Y+1),xe=f+(J+1)+H*Y;c.push(ne,ae,xe),c.push(ae,Ue,xe),X+=6}a.addGroup(d,X,w),d+=X,f+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};Fn={clone:vs,merge:Hn},Cx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ix=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Nt=class extends Yn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cx,this.fragmentShader=Ix,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=vs(e.uniforms),this.uniformsGroups=Rx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},aa=class extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Tr=new R,pp=new de,mp=new de,an=class extends aa{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=os*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Jo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return os*2*Math.atan(Math.tan(Jo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Tr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Tr.x,Tr.y).multiplyScalar(-e/Tr.z),Tr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Tr.x,Tr.y).multiplyScalar(-e/Tr.z)}getViewSize(e,t){return this.getViewBounds(e,pp,mp),t.subVectors(mp,pp)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Jo*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*i/c,t-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ks=-90,Vs=1,qc=class extends Ct{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new an(ks,Vs,e,t);i.layers=this.layers,this.add(i);let s=new an(ks,Vs,e,t);s.layers=this.layers,this.add(s);let o=new an(ks,Vs,e,t);o.layers=this.layers,this.add(o);let a=new an(ks,Vs,e,t);a.layers=this.layers,this.add(a);let c=new an(ks,Vs,e,t);c.layers=this.layers,this.add(c);let l=new an(ks,Vs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,o,a,c]=t;for(let l of t)this.remove(l);if(e===si)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ia)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,c,l,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let E=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,l),n.texture.generateMipmaps=E,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},ca=class extends en{constructor(e=[],t=ms,n,i,s,o,a,c,l,h){super(e,t,n,i,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Yc=class extends sn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ca(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new xn(5,5,5),s=new Nt({name:"CubemapFromEquirect",uniforms:vs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Mn,blending:Mi});s.uniforms.tEquirect.value=t;let o=new _e(i,s),a=t.minFilter;return t.minFilter===ci&&(t.minFilter=Vt),new qc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(s)}},Dt=class extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}},Px={type:"move"},$s=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let E of e.hand.values()){let m=t.getJointPose(E,n),p=this._getHandJoint(l,E);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Px)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Dt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},la=class extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xi,this.environmentIntensity=1,this.environmentRotation=new xi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},eo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Vc,this.updateRanges=[],this.version=0,this.uuid=oi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=oi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=oi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},zn=new R,to=class r{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)zn.fromBufferAttribute(this,t),zn.applyMatrix4(e),this.setXYZ(t,zn.x,zn.y,zn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zn.fromBufferAttribute(this,t),zn.applyNormalMatrix(e),this.setXYZ(t,zn.x,zn.y,zn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zn.fromBufferAttribute(this,t),zn.transformDirection(e),this.setXYZ(t,zn.x,zn.y,zn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=gi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Wt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=gi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=gi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=gi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=gi(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array),i=Wt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array),i=Wt(i,this.array),s=Wt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Rt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},gp=new R,xp=new At,vp=new At,Lx=new R,yp=new ke,Tc=new R,wh=new mn,_p=new ke,Th=new Di,En=class extends _e{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Hh,this.bindMatrix=new ke,this.bindMatrixInverse=new ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ht),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Tc),this.boundingBox.expandByPoint(Tc)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new mn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Tc),this.boundingSphere.expandByPoint(Tc)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wh.copy(this.boundingSphere),wh.applyMatrix4(i),e.ray.intersectsSphere(wh)!==!1&&(_p.copy(i).invert(),Th.copy(e.ray).applyMatrix4(_p),!(this.boundingBox!==null&&Th.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Th)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new At,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Hh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===hm?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;xp.fromBufferAttribute(i.attributes.skinIndex,e),vp.fromBufferAttribute(i.attributes.skinWeight,e),gp.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){let o=vp.getComponent(s);if(o!==0){let a=xp.getComponent(s);yp.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Lx.copy(gp).applyMatrix4(yp),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},sr=class extends Ct{constructor(){super(),this.isBone=!0,this.type="Bone"}},$n=class extends en{constructor(e=null,t=1,n=1,i,s,o,a,c,l=gn,h=gn,u,f){super(null,o,a,c,l,h,i,s,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ep=new ke,Dx=new ke,ua=class r{constructor(e=[],t=[]){this.uuid=oi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,o=e.length;s<o;s++){let a=e[s]?e[s].matrixWorld:Dx;Ep.multiplyMatrices(a,t[s]),Ep.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new $n(t,e,e,ln,cn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new sr),this.bones.push(o),this.boneInverses.push(new ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let o=t[i];e.bones.push(o.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},Rr=class extends Rt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Gs=new ke,Mp=new ke,bc=[],Sp=new ht,Nx=new ke,Xo=new _e,qo=new mn,ot=class extends _e{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Rr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Nx)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ht),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Gs),Sp.copy(e.boundingBox).applyMatrix4(Gs),this.boundingBox.union(Sp)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new mn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Gs),qo.copy(e.boundingSphere).applyMatrix4(Gs),this.boundingSphere.union(qo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Xo.geometry=this.geometry,Xo.material=this.material,Xo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qo.copy(this.boundingSphere),qo.applyMatrix4(n),e.ray.intersectsSphere(qo)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Gs),Mp.multiplyMatrices(n,Gs),Xo.matrixWorld=Mp,Xo.raycast(e,bc);for(let o=0,a=bc.length;o<a;o++){let c=bc[o];c.instanceId=s,c.object=this,t.push(c)}bc.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Rr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new $n(new Float32Array(i*this.count),i,this.count,wi,cn));let s=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=i*e;s[c]=a,s.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},bh=new R,Ux=new R,Bx=new yt,Dn=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=bh.subVectors(n,t).cross(Ux.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(bh),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Bx.getNormalMatrix(e),i=this.coplanarPoint(bh).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},jr=new mn,Hx=new de(.5,.5),Ac=new R,Cr=class{constructor(e=new Dn,t=new Dn,n=new Dn,i=new Dn,s=new Dn,o=new Dn){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=si,n=!1){let i=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],h=s[4],u=s[5],f=s[6],d=s[7],g=s[8],E=s[9],m=s[10],p=s[11],M=s[12],x=s[13],v=s[14],S=s[15];if(i[0].setComponents(l-o,d-h,p-g,S-M).normalize(),i[1].setComponents(l+o,d+h,p+g,S+M).normalize(),i[2].setComponents(l+a,d+u,p+E,S+x).normalize(),i[3].setComponents(l-a,d-u,p-E,S-x).normalize(),n)i[4].setComponents(c,f,m,v).normalize(),i[5].setComponents(l-c,d-f,p-m,S-v).normalize();else if(i[4].setComponents(l-c,d-f,p-m,S-v).normalize(),t===si)i[5].setComponents(l+c,d+f,p+m,S+v).normalize();else if(t===ia)i[5].setComponents(c,f,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),jr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),jr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(jr)}intersectsSprite(e){jr.center.set(0,0,0);let t=Hx.distanceTo(e.center);return jr.radius=.7071067811865476+t,jr.applyMatrix4(e.matrixWorld),this.intersectsSphere(jr)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Ac.x=i.normal.x>0?e.max.x:e.min.x,Ac.y=i.normal.y>0?e.max.y:e.min.y,Ac.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ac)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ci=new ke,Ii=new Cr,Zc=class r{constructor(){this.coordinateSystem=si}intersectsObject(e,t){if(!t.isArrayCamera||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(Ci.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Ii.setFromProjectionMatrix(Ci,i.coordinateSystem,i.reversedDepth),Ii.intersectsObject(e))return!0}return!1}intersectsSprite(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(Ci.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Ii.setFromProjectionMatrix(Ci,i.coordinateSystem,i.reversedDepth),Ii.intersectsSprite(e))return!0}return!1}intersectsSphere(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(Ci.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Ii.setFromProjectionMatrix(Ci,i.coordinateSystem,i.reversedDepth),Ii.intersectsSphere(e))return!0}return!1}intersectsBox(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(Ci.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Ii.setFromProjectionMatrix(Ci,i.coordinateSystem,i.reversedDepth),Ii.intersectsBox(e))return!0}return!1}containsPoint(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(Ci.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Ii.setFromProjectionMatrix(Ci,i.coordinateSystem,i.reversedDepth),Ii.containsPoint(e))return!0}return!1}clone(){return new r}};Oh=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,o=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let a=s[this.index];o.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}},qn=new ke,zx=new Ve(1,1,1),wp=new Cr,kx=new Zc,Rc=new ht,Kr=new mn,Yo=new R,Tp=new R,Vx=new R,Rh=new Oh,Ln=new _e,Cc=[];ha=class extends _e{constructor(e,t,n=t*2,i){super(new gt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),n=new $n(t,e,e,ln,cn);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),n=new $n(t,e,e,Da,dr);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),n=new $n(t,e,e,ln,cn);n.colorSpace=Tt.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in e.attributes){let o=e.getAttribute(s),{array:a,itemSize:c,normalized:l}=o,h=new a.constructor(n*c),u=new Rt(h,c,l);t.setAttribute(s,u)}if(e.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new Rt(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ht);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,qn),this.getBoundingBoxAt(s,Rc).applyMatrix4(qn),e.union(Rc)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,qn),this.getBoundingSphereAt(s,Kr).applyMatrix4(qn),e.union(Kr)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Ah),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let s=this._matricesTexture;qn.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;let o=this._colorsTexture;return o&&(zx.toArray(o.image.data,i*4),o.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let o=e.getIndex();if(o!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?o.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let c;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Ah),c=this._availableGeometryIds.shift(),s[c]=i):(c=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(c,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,c}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),o=t.getIndex(),a=this._geometryInfo[e];if(i&&o.count>a.reservedIndexCount||t.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let c=a.vertexStart,l=a.reservedVertexCount;a.vertexCount=t.getAttribute("position").count;for(let h in n.attributes){let u=t.getAttribute(h),f=n.getAttribute(h);Gx(u,f,c);let d=u.itemSize;for(let g=u.count,E=l;g<E;g++){let m=c+g;for(let p=0;p<d;p++)f.setComponent(m,p,0)}f.needsUpdate=!0,f.addUpdateRange(c*d,l*d)}if(i){let h=a.indexStart,u=a.reservedIndexCount;a.indexCount=t.getIndex().count;for(let f=0;f<o.count;f++)s.setX(h+f,c+o.getX(f));for(let f=o.count,d=u;f<d;f++)s.setX(h+f,c);s.needsUpdate=!0,s.addUpdateRange(h,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,t.boundingBox!==null&&(a.boundingBox=t.boundingBox.clone()),a.boundingSphere=null,t.boundingSphere!==null&&(a.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,i=n.map((o,a)=>a).sort((o,a)=>n[o].vertexStart-n[a].vertexStart),s=this.geometry;for(let o=0,a=n.length;o<a;o++){let c=i[o],l=n[c];if(l.active!==!1){if(s.index!==null){if(l.indexStart!==t){let{indexStart:h,vertexStart:u,reservedIndexCount:f}=l,d=s.index,g=d.array,E=e-u;for(let m=h;m<h+f;m++)g[m]=g[m]+E;d.array.copyWithin(t,h,h+f),d.addUpdateRange(t,f),l.indexStart=t}t+=l.reservedIndexCount}if(l.vertexStart!==e){let{vertexStart:h,reservedVertexCount:u}=l,f=s.attributes;for(let d in f){let g=f[d],{array:E,itemSize:m}=g;E.copyWithin(e*m,h*m,(h+u)*m),g.addUpdateRange(e*m,u*m)}l.vertexStart=e}e+=l.reservedVertexCount,l.start=s.index?l.indexStart:l.vertexStart,this._nextIndexStart=s.index?l.indexStart+l.reservedIndexCount:0,this._nextVertexStart=l.vertexStart+l.reservedVertexCount}}return this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){let s=new ht,o=n.index,a=n.attributes.position;for(let c=i.start,l=i.start+i.count;c<l;c++){let h=c;o&&(h=o.getX(h)),s.expandByPoint(Yo.fromBufferAttribute(a,h))}i.boundingBox=s}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){let s=new mn;this.getBoundingBoxAt(e,Rc),Rc.getCenter(s.center);let o=n.index,a=n.attributes.position,c=0;for(let l=i.start,h=i.start+i.count;l<h;l++){let u=l;o&&(u=o.getX(u)),Yo.fromBufferAttribute(a,u),c=Math.max(c,s.center.distanceToSquared(Yo))}s.radius=Math.sqrt(c),i.boundingSphere=s}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(Ah);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let i=new Int32Array(e),s=new Int32Array(e);Jr(this._multiDrawCounts,i),Jr(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=e;let o=this._indirectTexture,a=this._matricesTexture,c=this._colorsTexture;o.dispose(),this._initIndirectTexture(),Jr(o.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),Jr(a.image.data,this._matricesTexture.image.data),c&&(c.dispose(),this._initColorsTexture(),Jr(c.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>e)throw new Error(`BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(c=>c.indexStart+c.reservedIndexCount))>t)throw new Error(`BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let s=this.geometry;s.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new gt,this._initializeGeometry(s));let o=this.geometry;s.index&&Jr(s.index.array,o.index.array);for(let a in s.attributes)Jr(s.attributes[a].array,o.attributes[a].array)}raycast(e,t){let n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,o=this.geometry;Ln.material=this.material,Ln.geometry.index=o.index,Ln.geometry.attributes=o.attributes,Ln.geometry.boundingBox===null&&(Ln.geometry.boundingBox=new ht),Ln.geometry.boundingSphere===null&&(Ln.geometry.boundingSphere=new mn);for(let a=0,c=n.length;a<c;a++){if(!n[a].visible||!n[a].active)continue;let l=n[a].geometryIndex,h=i[l];Ln.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(a,Ln.matrixWorld).premultiply(s),this.getBoundingBoxAt(l,Ln.geometry.boundingBox),this.getBoundingSphereAt(l,Ln.geometry.boundingSphere),Ln.raycast(e,Cc);for(let u=0,f=Cc.length;u<f;u++){let d=Cc[u];d.object=this,d.batchId=a,t.push(d)}Cc.length=0}Ln.material=null,Ln.geometry.index=null,Ln.geometry.attributes={},Ln.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let o=i.getIndex(),a=o===null?1:o.array.BYTES_PER_ELEMENT,c=this._instanceInfo,l=this._multiDrawStarts,h=this._multiDrawCounts,u=this._geometryInfo,f=this.perObjectFrustumCulled,d=this._indirectTexture,g=d.image.data,E=n.isArrayCamera?kx:wp;f&&!n.isArrayCamera&&(qn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),wp.setFromProjectionMatrix(qn,n.coordinateSystem,n.reversedDepth));let m=0;if(this.sortObjects){qn.copy(this.matrixWorld).invert(),Yo.setFromMatrixPosition(n.matrixWorld).applyMatrix4(qn),Tp.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(qn);for(let x=0,v=c.length;x<v;x++)if(c[x].visible&&c[x].active){let S=c[x].geometryIndex;this.getMatrixAt(x,qn),this.getBoundingSphereAt(S,Kr).applyMatrix4(qn);let A=!1;if(f&&(A=!E.intersectsSphere(Kr,n)),!A){let C=u[S],I=Vx.subVectors(Kr.center,Yo).dot(Tp);Rh.push(C.start,C.count,I,x)}}let p=Rh.list,M=this.customSort;M===null?p.sort(s.transparent?Ox:Fx):M.call(this,p,n);for(let x=0,v=p.length;x<v;x++){let S=p[x];l[m]=S.start*a,h[m]=S.count,g[m]=S.index,m++}Rh.reset()}else for(let p=0,M=c.length;p<M;p++)if(c[p].visible&&c[p].active){let x=c[p].geometryIndex,v=!1;if(f&&(this.getMatrixAt(p,qn),this.getBoundingSphereAt(x,Kr).applyMatrix4(qn),v=!E.intersectsSphere(Kr,n)),!v){let S=u[x];l[m]=S.start*a,h[m]=S.count,g[m]=p,m++}}d.needsUpdate=!0,this._multiDrawCount=m,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,o){this.onBeforeRender(e,null,i,s,o)}},no=class extends Yn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},jc=new R,Kc=new R,bp=new ke,Zo=new Di,Ic=new mn,Ch=new R,Ap=new R,Ni=class extends Ct{constructor(e=new gt,t=new no){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)jc.fromBufferAttribute(t,i-1),Kc.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=jc.distanceTo(Kc);e.setAttribute("lineDistance",new Ke(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ic.copy(n.boundingSphere),Ic.applyMatrix4(i),Ic.radius+=s,e.ray.intersectsSphere(Ic)===!1)return;bp.copy(i).invert(),Zo.copy(e.ray).applyMatrix4(bp);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let E=d,m=g-1;E<m;E+=l){let p=h.getX(E),M=h.getX(E+1),x=Pc(this,e,Zo,c,p,M,E);x&&t.push(x)}if(this.isLineLoop){let E=h.getX(g-1),m=h.getX(d),p=Pc(this,e,Zo,c,E,m,g-1);p&&t.push(p)}}else{let d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let E=d,m=g-1;E<m;E+=l){let p=Pc(this,e,Zo,c,E,E+1,E);p&&t.push(p)}if(this.isLineLoop){let E=Pc(this,e,Zo,c,g-1,d,g-1);E&&t.push(E)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};Rp=new R,Cp=new R,Ui=class extends Ni{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Rp.fromBufferAttribute(t,i),Cp.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Rp.distanceTo(Cp);e.setAttribute("lineDistance",new Ke(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ir=class extends Ni{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},io=class extends Yn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ve(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ip=new ke,zh=new Di,Lc=new mn,Dc=new R,yi=class extends Ct{constructor(e=new gt,t=new io){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Lc.copy(n.boundingSphere),Lc.applyMatrix4(i),Lc.radius+=s,e.ray.intersectsSphere(Lc)===!1)return;Ip.copy(i).invert(),zh.copy(e.ray).applyMatrix4(Ip);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=f,E=d;g<E;g++){let m=l.getX(g);Dc.fromBufferAttribute(u,m),Pp(Dc,m,c,i,e,t,this)}}else{let f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,E=d;g<E;g++)Dc.fromBufferAttribute(u,g),Pp(Dc,g,c,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};fa=class extends en{constructor(e,t,n,i,s,o,a,c,l){super(e,t,n,i,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Pr=class extends en{constructor(e,t,n=dr,i,s,o,a=gn,c=gn,l,h=Zs,u=1){if(h!==Zs&&h!==fo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,i,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Js(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},da=class extends en{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},vn=class r extends gt{constructor(e=1,t=1,n=1,i=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};let l=this;i=Math.floor(i),s=Math.floor(s);let h=[],u=[],f=[],d=[],g=0,E=[],m=n/2,p=0;M(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Ke(u,3)),this.setAttribute("normal",new Ke(f,3)),this.setAttribute("uv",new Ke(d,2));function M(){let v=new R,S=new R,A=0,C=(t-e)/n;for(let I=0;I<=s;I++){let w=[],_=I/s,b=_*(t-e)+e;for(let P=0;P<=i;P++){let U=P/i,N=U*c+a,H=Math.sin(N),V=Math.cos(N);S.x=b*H,S.y=-_*n+m,S.z=b*V,u.push(S.x,S.y,S.z),v.set(H,C,V).normalize(),f.push(v.x,v.y,v.z),d.push(U,1-_),w.push(g++)}E.push(w)}for(let I=0;I<i;I++)for(let w=0;w<s;w++){let _=E[w][I],b=E[w+1][I],P=E[w+1][I+1],U=E[w][I+1];(e>0||w!==0)&&(h.push(_,b,U),A+=3),(t>0||w!==s-1)&&(h.push(b,P,U),A+=3)}l.addGroup(p,A,0),p+=A}function x(v){let S=g,A=new de,C=new R,I=0,w=v===!0?e:t,_=v===!0?1:-1;for(let P=1;P<=i;P++)u.push(0,m*_,0),f.push(0,_,0),d.push(.5,.5),g++;let b=g;for(let P=0;P<=i;P++){let N=P/i*c+a,H=Math.cos(N),V=Math.sin(N);C.x=w*V,C.y=m*_,C.z=w*H,u.push(C.x,C.y,C.z),f.push(0,_,0),A.x=H*.5+.5,A.y=V*.5*_+.5,d.push(A.x,A.y),g++}for(let P=0;P<i;P++){let U=S+P,N=b+P;v===!0?h.push(N,N+1,U):h.push(N+1,N,U),I+=3}l.addGroup(p,I,v===!0?1:2),p+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Lr=class r extends vn{constructor(e=1,t=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Jc=class r extends gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let s=[],o=[];a(i),l(n),h(),this.setAttribute("position",new Ke(s,3)),this.setAttribute("normal",new Ke(s.slice(),3)),this.setAttribute("uv",new Ke(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let x=new R,v=new R,S=new R;for(let A=0;A<t.length;A+=3)d(t[A+0],x),d(t[A+1],v),d(t[A+2],S),c(x,v,S,M)}function c(M,x,v,S){let A=S+1,C=[];for(let I=0;I<=A;I++){C[I]=[];let w=M.clone().lerp(v,I/A),_=x.clone().lerp(v,I/A),b=A-I;for(let P=0;P<=b;P++)P===0&&I===A?C[I][P]=w:C[I][P]=w.clone().lerp(_,P/b)}for(let I=0;I<A;I++)for(let w=0;w<2*(A-I)-1;w++){let _=Math.floor(w/2);w%2===0?(f(C[I][_+1]),f(C[I+1][_]),f(C[I][_])):(f(C[I][_+1]),f(C[I+1][_+1]),f(C[I+1][_]))}}function l(M){let x=new R;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(M),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){let M=new R;for(let x=0;x<s.length;x+=3){M.x=s[x+0],M.y=s[x+1],M.z=s[x+2];let v=m(M)/2/Math.PI+.5,S=p(M)/Math.PI+.5;o.push(v,1-S)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){let x=o[M+0],v=o[M+2],S=o[M+4],A=Math.max(x,v,S),C=Math.min(x,v,S);A>.9&&C<.1&&(x<.2&&(o[M+0]+=1),v<.2&&(o[M+2]+=1),S<.2&&(o[M+4]+=1))}}function f(M){s.push(M.x,M.y,M.z)}function d(M,x){let v=M*3;x.x=e[v+0],x.y=e[v+1],x.z=e[v+2]}function g(){let M=new R,x=new R,v=new R,S=new R,A=new de,C=new de,I=new de;for(let w=0,_=0;w<s.length;w+=9,_+=6){M.set(s[w+0],s[w+1],s[w+2]),x.set(s[w+3],s[w+4],s[w+5]),v.set(s[w+6],s[w+7],s[w+8]),A.set(o[_+0],o[_+1]),C.set(o[_+2],o[_+3]),I.set(o[_+4],o[_+5]),S.copy(M).add(x).add(v).divideScalar(3);let b=m(S);E(A,_+0,M,b),E(C,_+2,x,b),E(I,_+4,v,b)}}function E(M,x,v,S){S<0&&M.x===1&&(o[x]=M.x-1),v.x===0&&v.z===0&&(o[x]=S/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},ei=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),i=0,s=n.length,o;t?o=t:o=e*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(s-1);let h=n[i],f=n[i+1]-h,d=(o-h)/f;return(i+d)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);let o=this.getPoint(i),a=this.getPoint(s),c=t||(o.isVector2?new de:new R);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new R,i=[],s=[],o=[],a=new R,c=new ke;for(let d=0;d<=e;d++){let g=d/e;i[d]=this.getTangentAt(g,new R)}s[0]=new R,o[0]=new R;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let d=1;d<=e;d++){if(s[d]=s[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(mt(i[d-1].dot(i[d]),-1,1));s[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(i[d],s[d])}if(t===!0){let d=Math.acos(mt(s[0].dot(s[e]),-1,1));d/=e,i[0].dot(a.crossVectors(s[0],s[e]))>0&&(d=-d);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(i[g],d*g)),o[g].crossVectors(i[g],s[g])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ro=class extends ei{constructor(e=0,t=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new de){let n=t,i=Math.PI*2,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);let a=this.aStartAngle+e*s,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Qc=class extends ro{constructor(e,t,n,i,s,o){super(e,t,n,n,i,s,o),this.isArcCurve=!0,this.type="ArcCurve"}};Nc=new R,Ih=new gf,Ph=new gf,Lh=new gf,Zn=class extends ei{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new R){let n=t,i=this.points,s=i.length,o=(s-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%s]:(Nc.subVectors(i[0],i[1]).add(i[0]),l=Nc);let u=i[a%s],f=i[(a+1)%s];if(this.closed||a+2<s?h=i[(a+2)%s]:(Nc.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=Nc),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),d),E=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);E<1e-4&&(E=1),g<1e-4&&(g=E),m<1e-4&&(m=E),Ih.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,E,m),Ph.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,E,m),Lh.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,E,m)}else this.curveType==="catmullrom"&&(Ih.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),Ph.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),Lh.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(Ih.calc(c),Ph.calc(c),Lh.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new R().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};pa=class extends ei{constructor(e=new de,t=new de,n=new de,i=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new de){let n=t,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(ea(e,i.x,s.x,o.x,a.x),ea(e,i.y,s.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},$c=class extends ei{constructor(e=new R,t=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new R){let n=t,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(ea(e,i.x,s.x,o.x,a.x),ea(e,i.y,s.y,o.y,a.y),ea(e,i.z,s.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ma=class extends ei{constructor(e=new de,t=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new de){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new de){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},el=class extends ei{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ga=class extends ei{constructor(e=new de,t=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new de){let n=t,i=this.v0,s=this.v1,o=this.v2;return n.set($o(e,i.x,s.x,o.x),$o(e,i.y,s.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},xa=class extends ei{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,i=this.v0,s=this.v1,o=this.v2;return n.set($o(e,i.x,s.x,o.x),$o(e,i.y,s.y,o.y),$o(e,i.z,s.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},va=class extends ei{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new de){let n=t,i=this.points,s=(i.length-1)*e,o=Math.floor(s),a=s-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Lp(a,c.x,l.x,h.x,u.x),Lp(a,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new de().fromArray(i))}return this}},tl=Object.freeze({__proto__:null,ArcCurve:Qc,CatmullRomCurve3:Zn,CubicBezierCurve:pa,CubicBezierCurve3:$c,EllipseCurve:ro,LineCurve:ma,LineCurve3:el,QuadraticBezierCurve:ga,QuadraticBezierCurve3:xa,SplineCurve:va}),nl=class extends ei{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new tl[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let o=i[s]-n,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,s=this.curves;i<s.length;i++){let o=s[i],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new tl[i.type]().fromJSON(i))}return this}},as=class extends nl{constructor(e){super(),this.type="Path",this.currentPoint=new de,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ma(this.currentPoint.clone(),new de(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let s=new ga(this.currentPoint.clone(),new de(e,t),new de(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,o){let a=new pa(this.currentPoint.clone(),new de(e,t),new de(n,i),new de(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new va(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,i,s,o),this}absarc(e,t,n,i,s,o){return this.absellipse(e,t,n,n,i,s,o),this}ellipse(e,t,n,i,s,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,i,s,o,a,c),this}absellipse(e,t,n,i,s,o,a,c){let l=new ro(e,t,n,i,s,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Dr=class extends as{constructor(e){super(e),this.uuid=oi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new as().fromJSON(i))}return this}};Gh=class{static triangulate(e,t,n=2){return Jx(e,t,n)}},ts=class r{static area(e){let t=e.length,n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let n=[],i=[],s=[];Np(e),Up(n,e);let o=e.length;t.forEach(Np);for(let c=0;c<t.length;c++)i.push(o),o+=t[c].length,Up(n,t[c]);let a=Gh.triangulate(n,i);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}};ls=class r extends gt{constructor(e=new Dr([new de(.5,.5),new de(-.5,.5),new de(-.5,-.5),new de(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],s=[];for(let a=0,c=e.length;a<c;a++){let l=e[a];o(l)}this.setAttribute("position",new Ke(i,3)),this.setAttribute("uv",new Ke(s,2)),this.computeVertexNormals();function o(a){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,E=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:pv,x,v=!1,S,A,C,I;p&&(x=p.getSpacedPoints(h),v=!0,f=!1,S=p.computeFrenetFrames(h,!1),A=new R,C=new R,I=new R),f||(m=0,d=0,g=0,E=0);let w=a.extractPoints(l),_=w.shape,b=w.holes;if(!ts.isClockWise(_)){_=_.reverse();for(let ve=0,fe=b.length;ve<fe;ve++){let ge=b[ve];ts.isClockWise(ge)&&(b[ve]=ge.reverse())}}function U(ve){let ge=10000000000000001e-36,pe=ve[0];for(let Te=1;Te<=ve.length;Te++){let be=Te%ve.length,Le=ve[be],dt=Le.x-pe.x,lt=Le.y-pe.y,k=dt*dt+lt*lt,D=Math.max(Math.abs(Le.x),Math.abs(Le.y),Math.abs(pe.x),Math.abs(pe.y)),te=ge*D*D;if(k<=te){ve.splice(be,1),Te--;continue}pe=Le}}U(_),b.forEach(U);let N=b.length,H=_;for(let ve=0;ve<N;ve++){let fe=b[ve];_=_.concat(fe)}function V(ve,fe,ge){return fe||console.error("THREE.ExtrudeGeometry: vec does not exist"),ve.clone().addScaledVector(fe,ge)}let Z=_.length;function X(ve,fe,ge){let pe,Te,be,Le=ve.x-fe.x,dt=ve.y-fe.y,lt=ge.x-ve.x,k=ge.y-ve.y,D=Le*Le+dt*dt,te=Le*k-dt*lt;if(Math.abs(te)>Number.EPSILON){let le=Math.sqrt(D),we=Math.sqrt(lt*lt+k*k),ce=fe.x-dt/le,Qe=fe.y+Le/le,Be=ge.x-k/we,je=ge.y+lt/we,Ze=((Be-ce)*k-(je-Qe)*lt)/(Le*k-dt*lt);pe=ce+Le*Ze-ve.x,Te=Qe+dt*Ze-ve.y;let Ce=pe*pe+Te*Te;if(Ce<=2)return new de(pe,Te);be=Math.sqrt(Ce/2)}else{let le=!1;Le>Number.EPSILON?lt>Number.EPSILON&&(le=!0):Le<-Number.EPSILON?lt<-Number.EPSILON&&(le=!0):Math.sign(dt)===Math.sign(k)&&(le=!0),le?(pe=-dt,Te=Le,be=Math.sqrt(D)):(pe=Le,Te=dt,be=Math.sqrt(D/2))}return new de(pe/be,Te/be)}let z=[];for(let ve=0,fe=H.length,ge=fe-1,pe=ve+1;ve<fe;ve++,ge++,pe++)ge===fe&&(ge=0),pe===fe&&(pe=0),z[ve]=X(H[ve],H[ge],H[pe]);let Y=[],J,ne=z.concat();for(let ve=0,fe=N;ve<fe;ve++){let ge=b[ve];J=[];for(let pe=0,Te=ge.length,be=Te-1,Le=pe+1;pe<Te;pe++,be++,Le++)be===Te&&(be=0),Le===Te&&(Le=0),J[pe]=X(ge[pe],ge[be],ge[Le]);Y.push(J),ne=ne.concat(J)}let ae;if(m===0)ae=ts.triangulateShape(H,b);else{let ve=[],fe=[];for(let ge=0;ge<m;ge++){let pe=ge/m,Te=d*Math.cos(pe*Math.PI/2),be=g*Math.sin(pe*Math.PI/2)+E;for(let Le=0,dt=H.length;Le<dt;Le++){let lt=V(H[Le],z[Le],be);He(lt.x,lt.y,-Te),pe===0&&ve.push(lt)}for(let Le=0,dt=N;Le<dt;Le++){let lt=b[Le];J=Y[Le];let k=[];for(let D=0,te=lt.length;D<te;D++){let le=V(lt[D],J[D],be);He(le.x,le.y,-Te),pe===0&&k.push(le)}pe===0&&fe.push(k)}}ae=ts.triangulateShape(ve,fe)}let Ue=ae.length,xe=g+E;for(let ve=0;ve<Z;ve++){let fe=f?V(_[ve],ne[ve],xe):_[ve];v?(C.copy(S.normals[0]).multiplyScalar(fe.x),A.copy(S.binormals[0]).multiplyScalar(fe.y),I.copy(x[0]).add(C).add(A),He(I.x,I.y,I.z)):He(fe.x,fe.y,0)}for(let ve=1;ve<=h;ve++)for(let fe=0;fe<Z;fe++){let ge=f?V(_[fe],ne[fe],xe):_[fe];v?(C.copy(S.normals[ve]).multiplyScalar(ge.x),A.copy(S.binormals[ve]).multiplyScalar(ge.y),I.copy(x[ve]).add(C).add(A),He(I.x,I.y,I.z)):He(ge.x,ge.y,u/h*ve)}for(let ve=m-1;ve>=0;ve--){let fe=ve/m,ge=d*Math.cos(fe*Math.PI/2),pe=g*Math.sin(fe*Math.PI/2)+E;for(let Te=0,be=H.length;Te<be;Te++){let Le=V(H[Te],z[Te],pe);He(Le.x,Le.y,u+ge)}for(let Te=0,be=b.length;Te<be;Te++){let Le=b[Te];J=Y[Te];for(let dt=0,lt=Le.length;dt<lt;dt++){let k=V(Le[dt],J[dt],pe);v?He(k.x,k.y+x[h-1].y,x[h-1].x+ge):He(k.x,k.y,u+ge)}}}j(),re();function j(){let ve=i.length/3;if(f){let fe=0,ge=Z*fe;for(let pe=0;pe<Ue;pe++){let Te=ae[pe];Ie(Te[2]+ge,Te[1]+ge,Te[0]+ge)}fe=h+m*2,ge=Z*fe;for(let pe=0;pe<Ue;pe++){let Te=ae[pe];Ie(Te[0]+ge,Te[1]+ge,Te[2]+ge)}}else{for(let fe=0;fe<Ue;fe++){let ge=ae[fe];Ie(ge[2],ge[1],ge[0])}for(let fe=0;fe<Ue;fe++){let ge=ae[fe];Ie(ge[0]+Z*h,ge[1]+Z*h,ge[2]+Z*h)}}n.addGroup(ve,i.length/3-ve,0)}function re(){let ve=i.length/3,fe=0;Se(H,fe),fe+=H.length;for(let ge=0,pe=b.length;ge<pe;ge++){let Te=b[ge];Se(Te,fe),fe+=Te.length}n.addGroup(ve,i.length/3-ve,1)}function Se(ve,fe){let ge=ve.length;for(;--ge>=0;){let pe=ge,Te=ge-1;Te<0&&(Te=ve.length-1);for(let be=0,Le=h+m*2;be<Le;be++){let dt=Z*be,lt=Z*(be+1),k=fe+pe+dt,D=fe+Te+dt,te=fe+Te+lt,le=fe+pe+lt;nt(k,D,te,le)}}}function He(ve,fe,ge){c.push(ve),c.push(fe),c.push(ge)}function Ie(ve,fe,ge){rt(ve),rt(fe),rt(ge);let pe=i.length/3,Te=M.generateTopUV(n,i,pe-3,pe-2,pe-1);W(Te[0]),W(Te[1]),W(Te[2])}function nt(ve,fe,ge,pe){rt(ve),rt(fe),rt(pe),rt(fe),rt(ge),rt(pe);let Te=i.length/3,be=M.generateSideWallUV(n,i,Te-6,Te-3,Te-2,Te-1);W(be[0]),W(be[1]),W(be[3]),W(be[1]),W(be[2]),W(be[3])}function rt(ve){i.push(c[ve*3+0]),i.push(c[ve*3+1]),i.push(c[ve*3+2])}function W(ve){s.push(ve.x),s.push(ve.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return mv(t,n,e)}static fromJSON(e,t){let n=[];for(let s=0,o=e.shapes.length;s<o;s++){let a=t[e.shapes[s]];n.push(a)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new tl[i.type]().fromJSON(i)),new r(n,e.options)}},pv={generateTopUV:function(r,e,t,n,i){let s=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[i*3],h=e[i*3+1];return[new de(s,o),new de(a,c),new de(l,h)]},generateSideWallUV:function(r,e,t,n,i,s){let o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[i*3],d=e[i*3+1],g=e[i*3+2],E=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new de(o,1-c),new de(l,1-u),new de(f,1-g),new de(E,1-p)]:[new de(a,1-c),new de(h,1-u),new de(d,1-g),new de(m,1-p)]}};Nr=class r extends Jc{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Ma=class r extends gt{constructor(e=[new de(0,-.5),new de(.5,0),new de(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=mt(i,0,Math.PI*2);let s=[],o=[],a=[],c=[],l=[],h=1/t,u=new R,f=new de,d=new R,g=new R,E=new R,m=0,p=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,d.x=p*1,d.y=-m,d.z=p*0,E.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case e.length-1:c.push(E.x,E.y,E.z);break;default:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=E.x,d.y+=E.y,d.z+=E.z,d.normalize(),c.push(d.x,d.y,d.z),E.copy(g)}for(let M=0;M<=t;M++){let x=n+M*h*i,v=Math.sin(x),S=Math.cos(x);for(let A=0;A<=e.length-1;A++){u.x=e[A].x*v,u.y=e[A].y,u.z=e[A].x*S,o.push(u.x,u.y,u.z),f.x=M/t,f.y=A/(e.length-1),a.push(f.x,f.y);let C=c[3*A+0]*v,I=c[3*A+1],w=c[3*A+0]*S;l.push(C,I,w)}}for(let M=0;M<t;M++)for(let x=0;x<e.length-1;x++){let v=x+M*e.length,S=v,A=v+e.length,C=v+e.length+1,I=v+1;s.push(S,A,I),s.push(C,I,A)}this.setIndex(s),this.setAttribute("position",new Ke(o,3)),this.setAttribute("uv",new Ke(a,2)),this.setAttribute("normal",new Ke(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},Bi=class r extends gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,o=t/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=e/a,f=t/c,d=[],g=[],E=[],m=[];for(let p=0;p<h;p++){let M=p*f-o;for(let x=0;x<l;x++){let v=x*u-s;g.push(v,-M,0),E.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<a;M++){let x=M+l*p,v=M+l*(p+1),S=M+1+l*(p+1),A=M+1+l*p;d.push(x,v,A),d.push(v,S,A)}this.setIndex(d),this.setAttribute("position",new Ke(g,3)),this.setAttribute("normal",new Ke(E,3)),this.setAttribute("uv",new Ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Un=class r extends gt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new R,f=new R,d=[],g=[],E=[],m=[];for(let p=0;p<=n;p++){let M=[],x=p/n,v=0;p===0&&o===0?v=.5/t:p===n&&c===Math.PI&&(v=-.5/t);for(let S=0;S<=t;S++){let A=S/t;u.x=-e*Math.cos(i+A*s)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(i+A*s)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),E.push(f.x,f.y,f.z),m.push(A+v,1-x),M.push(l++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){let x=h[p][M+1],v=h[p][M],S=h[p+1][M],A=h[p+1][M+1];(p!==0||o>0)&&d.push(x,v,A),(p!==n-1||c<Math.PI)&&d.push(v,S,A)}this.setIndex(d),this.setAttribute("position",new Ke(g,3)),this.setAttribute("normal",new Ke(E,3)),this.setAttribute("uv",new Ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Ur=class r extends gt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],c=[],l=[],h=new R,u=new R,f=new R;for(let d=0;d<=n;d++)for(let g=0;g<=i;g++){let E=g/i*s,m=d/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(E),u.y=(e+t*Math.cos(m))*Math.sin(E),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(E),h.y=e*Math.sin(E),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/i),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=i;g++){let E=(i+1)*d+g-1,m=(i+1)*(d-1)+g-1,p=(i+1)*(d-1)+g,M=(i+1)*d+g;o.push(E,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new Ke(a,3)),this.setAttribute("normal",new Ke(c,3)),this.setAttribute("uv",new Ke(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},_i=class r extends gt{constructor(e=new xa(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),t=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:s};let o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new R,c=new R,l=new de,h=new R,u=[],f=[],d=[],g=[];E(),this.setIndex(g),this.setAttribute("position",new Ke(u,3)),this.setAttribute("normal",new Ke(f,3)),this.setAttribute("uv",new Ke(d,2));function E(){for(let x=0;x<t;x++)m(x);m(s===!1?t:0),M(),p()}function m(x){h=e.getPointAt(x/t,h);let v=o.normals[x],S=o.binormals[x];for(let A=0;A<=i;A++){let C=A/i*Math.PI*2,I=Math.sin(C),w=-Math.cos(C);c.x=w*v.x+I*S.x,c.y=w*v.y+I*S.y,c.z=w*v.z+I*S.z,c.normalize(),f.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,u.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=t;x++)for(let v=1;v<=i;v++){let S=(i+1)*(x-1)+(v-1),A=(i+1)*x+(v-1),C=(i+1)*x+v,I=(i+1)*(x-1)+v;g.push(S,A,I),g.push(A,C,I)}}function M(){for(let x=0;x<=t;x++)for(let v=0;v<=i;v++)l.x=x/t,l.y=v/i,d.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new tl[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Sa=class extends Nt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Xe=class extends Yn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=uf,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Jt=class extends Xe{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new de(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return mt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ve(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ve(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ve(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},il=class extends Yn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},rl=class extends Yn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};or=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=s,s=t[--n-1],e>=s)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let o=0;o!==i;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},sl=class extends or{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:$r,endingEnd:$r}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,o=e+1,a=i[s],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case es:s=e,a=2*t-n;break;case ta:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case es:o=e,c=2*n-t;break;case ta:o=1,c=n+i[1]-i[0];break;default:o=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(i-t),E=g*g,m=E*g,p=-f*m+2*f*E-f*g,M=(1+f)*m+(-1.5-2*f)*E+(-.5+f)*g+1,x=(-1-d)*m+(1.5+d)*E+.5*g,v=d*m-d*E;for(let S=0;S!==a;++S)s[S]=p*o[h+S]+M*o[l+S]+x*o[c+S]+v*o[u+S];return s}},wa=class extends or{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==a;++f)s[f]=o[l+f]*u+o[c+f]*h;return s}},ol=class extends or{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},jn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Hc(t,this.TimeBufferType),this.values=Hc(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Hc(e.times,Array),values:Hc(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ol(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new wa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new sl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case rs:t=this.InterpolantFactoryMethodDiscrete;break;case ss:t=this.InterpolantFactoryMethodLinear;break;case Oc:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return rs;case this.InterpolantFactoryMethodLinear:return ss;case this.InterpolantFactoryMethodSmooth:return Oc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,s=0,o=i-1;for(;s!==i&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(i!==void 0&&gv(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Oc,s=e.length-1,o=1;for(let a=1;a<s;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(i)c=!0;else{let u=a*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){let E=t[u+g];if(E!==t[f+g]||E!==t[d+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};jn.prototype.ValueTypeName="";jn.prototype.TimeBufferType=Float32Array;jn.prototype.ValueBufferType=Float32Array;jn.prototype.DefaultInterpolation=ss;ar=class extends jn{constructor(e,t,n){super(e,t,n)}};ar.prototype.ValueTypeName="bool";ar.prototype.ValueBufferType=Array;ar.prototype.DefaultInterpolation=rs;ar.prototype.InterpolantFactoryMethodLinear=void 0;ar.prototype.InterpolantFactoryMethodSmooth=void 0;Ta=class extends jn{constructor(e,t,n,i){super(e,t,n,i)}};Ta.prototype.ValueTypeName="color";Hi=class extends jn{constructor(e,t,n,i){super(e,t,n,i)}};Hi.prototype.ValueTypeName="number";al=class extends or{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(i-t),l=e*a;for(let h=l+a;l!==h;l+=4)$t.slerpFlat(s,0,o,l-a,o,l,c);return s}},Fi=class extends jn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new al(this.times,this.values,this.getValueSize(),e)}};Fi.prototype.ValueTypeName="quaternion";Fi.prototype.InterpolantFactoryMethodSmooth=void 0;cr=class extends jn{constructor(e,t,n){super(e,t,n)}};cr.prototype.ValueTypeName="string";cr.prototype.ValueBufferType=Array;cr.prototype.DefaultInterpolation=rs;cr.prototype.InterpolantFactoryMethodLinear=void 0;cr.prototype.InterpolantFactoryMethodSmooth=void 0;Oi=class extends jn{constructor(e,t,n,i){super(e,t,n,i)}};Oi.prototype.ValueTypeName="vector";us=class{constructor(e="",t=-1,n=[],i=cu){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=oi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(yv(n[o]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,o=n.length;s!==o;++s)t.push(jn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,o=[];for(let a=0;a<s;a++){let c=[],l=[];c.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);let h=xv(c);c=Bp(c,1,h),l=Bp(l,1,h),!i&&c[0]===0&&(c.push(s),l.push(l[0])),o.push(new Hi(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){let l=e[a],h=l.name.match(s);if(h&&h.length>1){let u=h[1],f=i[u];f||(i[u]=f=[]),f.push(l)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,f,d,g,E){if(d.length!==0){let m=[],p=[];Dm(d,m,p,g),m.length!==0&&E.push(new u(f,m,p))}},i=[],s=e.name||"default",o=e.fps||30,a=e.blendMode,c=e.length||-1,l=e.hierarchy||[];for(let u=0;u<l.length;u++){let f=l[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){let d={},g;for(g=0;g<f.length;g++)if(f[g].morphTargets)for(let E=0;E<f[g].morphTargets.length;E++)d[f[g].morphTargets[E]]=-1;for(let E in d){let m=[],p=[];for(let M=0;M!==f[g].morphTargets.length;++M){let x=f[g];m.push(x.time),p.push(x.morphTarget===E?1:0)}i.push(new Hi(".morphTargetInfluence["+E+"]",m,p))}c=d.length*o}else{let d=".bones["+t[u].name+"]";n(Oi,d+".position",f,"pos",i),n(Fi,d+".quaternion",f,"rot",i),n(Oi,d+".scale",f,"scl",i)}}return i.length===0?null:new this(s,c,i,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};Pi={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},cl=class{constructor(e,t,n){let i=this,s=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){let d=l[u],g=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Nm=new cl,Ei=class{constructor(e){this.manager=e!==void 0?e:Nm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ei.DEFAULT_MATERIAL_NAME="__DEFAULT";nr={},Wh=class extends Error{constructor(e,t){super(e),this.response=t}},hs=class extends Ei{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=Pi.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(nr[e]!==void 0){nr[e].push({onLoad:t,onProgress:n,onError:i});return}nr[e]=[],nr[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=nr[e],u=l.body.getReader(),f=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0,E=0,m=new ReadableStream({start(p){M();function M(){u.read().then(({done:x,value:v})=>{if(x)p.close();else{E+=v.byteLength;let S=new ProgressEvent("progress",{lengthComputable:g,loaded:E,total:d});for(let A=0,C=h.length;A<C;A++){let I=h[A];I.onProgress&&I.onProgress(S)}p.enqueue(v),M()}},x=>{p.error(x)})}}});return new Response(m)}else throw new Wh(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a==="")return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return l.arrayBuffer().then(g=>d.decode(g))}}}).then(l=>{Pi.add(`file:${e}`,l);let h=nr[e];delete nr[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onLoad&&d.onLoad(l)}}).catch(l=>{let h=nr[e];if(h===void 0)throw this.manager.itemError(e),l;delete nr[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Ws=new WeakMap,ll=class extends Ei{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=Pi.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);else{let u=Ws.get(o);u===void 0&&(u=[],Ws.set(o,u)),u.push({onLoad:t,onError:i})}return o}let a=js("img");function c(){h(),t&&t(this);let u=Ws.get(this)||[];for(let f=0;f<u.length;f++){let d=u[f];d.onLoad&&d.onLoad(this)}Ws.delete(this),s.manager.itemEnd(e)}function l(u){h(),i&&i(u),Pi.remove(`image:${e}`);let f=Ws.get(this)||[];for(let d=0;d<f.length;d++){let g=f[d];g.onError&&g.onError(u)}Ws.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Pi.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}},fs=class extends Ei{constructor(e){super(e)}load(e,t,n,i){let s=this,o=new $n,a=new hs(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(s.withCredentials),a.load(e,function(c){let l;try{l=s.parse(c)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}l.image!==void 0?o.image=l.image:l.data!==void 0&&(o.image.width=l.width,o.image.height=l.height,o.image.data=l.data),o.wrapS=l.wrapS!==void 0?l.wrapS:ri,o.wrapT=l.wrapT!==void 0?l.wrapT:ri,o.magFilter=l.magFilter!==void 0?l.magFilter:Vt,o.minFilter=l.minFilter!==void 0?l.minFilter:Vt,o.anisotropy=l.anisotropy!==void 0?l.anisotropy:1,l.colorSpace!==void 0&&(o.colorSpace=l.colorSpace),l.flipY!==void 0&&(o.flipY=l.flipY),l.format!==void 0&&(o.format=l.format),l.type!==void 0&&(o.type=l.type),l.mipmaps!==void 0&&(o.mipmaps=l.mipmaps,o.minFilter=ci),l.mipmapCount===1&&(o.minFilter=Vt),l.generateMipmaps!==void 0&&(o.generateMipmaps=l.generateMipmaps),o.needsUpdate=!0,t&&t(o,l)},n,i),o}},tn=class extends Ei{constructor(e){super(e)}load(e,t,n,i){let s=new en,o=new ll(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},ds=class extends Ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},lr=class extends ds{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ve(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Dh=new ke,Hp=new R,Fp=new R,ba=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.mapType=Si,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cr,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Hp.setFromMatrixPosition(e.matrixWorld),t.position.copy(Hp),Fp.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fp),t.updateMatrixWorld(),Dh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dh,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Dh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Xh=class extends ba{constructor(){super(new an(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=os*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},oo=class extends ds{constructor(e,t,n=0,i=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new Xh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Op=new ke,jo=new R,Nh=new R,qh=class extends ba{constructor(){super(new an(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new de(4,2),this._viewportCount=6,this._viewports=[new At(2,1,1,1),new At(0,1,1,1),new At(3,1,1,1),new At(1,1,1,1),new At(3,0,1,1),new At(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),jo.setFromMatrixPosition(e.matrixWorld),n.position.copy(jo),Nh.copy(n.position),Nh.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Nh),n.updateMatrixWorld(),i.makeTranslation(-jo.x,-jo.y,-jo.z),Op.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Op,n.coordinateSystem,n.reversedDepth)}},ps=class extends ds{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new qh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},ur=class extends aa{constructor(e=-1,t=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,o=n+e,a=i+t,c=i-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Yh=class extends ba{constructor(){super(new ur(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ai=class extends ds{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new Yh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},hr=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Uh=new WeakMap,Aa=class extends Ei{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=Pi.get(`image-bitmap:${e}`);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(l=>{if(Uh.has(o)===!0)i&&i(Uh.get(o)),s.manager.itemError(e),s.manager.itemEnd(e);else return t&&t(l),s.manager.itemEnd(e),l});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){return Pi.add(`image-bitmap:${e}`,l),t&&t(l),s.manager.itemEnd(e),l}).catch(function(l){i&&i(l),Uh.set(c,l),Pi.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Pi.add(`image-bitmap:${e}`,c),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},ul=class extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ra=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},hl=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,o;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[s+a]=n[a];o=t}else{o+=t;let a=t/o;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let c=t*this._origIndex;this._mixBufferRegion(n,i,c,1-s,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let c=t,l=t+t;c!==l;++c)if(n[c]!==n[c+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,o=i;s!==o;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let o=0;o!==s;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){$t.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let o=this._workIndex*s;$t.multiplyQuaternionsFlat(e,o,e,t,e,n),$t.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,s){let o=1-i;for(let a=0;a!==s;++a){let c=t+a;e[c]=e[c]*o+e[n+a]*i}}_lerpAdditive(e,t,n,i,s){for(let o=0;o!==s;++o){let a=t+o;e[a]=e[a]+e[n+o]*i}}},xf="\\[\\]\\.:\\/",_v=new RegExp("["+xf+"]","g"),vf="[^"+xf+"]",Ev="[^"+xf.replace("\\.","")+"]",Mv=/((?:WC+[\/:])*)/.source.replace("WC",vf),Sv=/(WCOD+)?/.source.replace("WCOD",Ev),wv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",vf),Tv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",vf),bv=new RegExp("^"+Mv+Sv+wv+Tv+"$"),Av=["material","materials","bones","map"],Zh=class{constructor(e,t,n){let i=n||Ht.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ht=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(_v,"")}static parseTrackName(e){let t=bv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);Av.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[i];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ht.Composite=Zh;Ht.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ht.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ht.prototype.GetterByBindingType=[Ht.prototype._getValue_direct,Ht.prototype._getValue_array,Ht.prototype._getValue_arrayElement,Ht.prototype._getValue_toArray];Ht.prototype.SetterByBindingTypeAndVersioning=[[Ht.prototype._setValue_direct,Ht.prototype._setValue_direct_setNeedsUpdate,Ht.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ht.prototype._setValue_array,Ht.prototype._setValue_array_setNeedsUpdate,Ht.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ht.prototype._setValue_arrayElement,Ht.prototype._setValue_arrayElement_setNeedsUpdate,Ht.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ht.prototype._setValue_fromArray,Ht.prototype._setValue_fromArray_setNeedsUpdate,Ht.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];fl=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,o=s.length,a=new Array(o),c={endingStart:$r,endingEnd:$r};for(let l=0;l!==o;++l){let h=s[l].createInterpolant(null);a[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=dm,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,o=s/i,a=i/s;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let c=a.parameterPositions,l=a.sampleValues;return c[0]=s,c[1]=s+n,l[0]=e/o,l[1]=t/o,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let c=(e-s)*n;c<0||n===0?t=0:(this._startTime=null,t=n*c)}t*=this._updateTimeScale(e);let o=this._updateTime(t),a=this._updateWeight(e);if(a>0){let c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case mm:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulateAdditive(a);break;case cu:default:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,o=n===pm;if(e===0)return s===-1?i:o&&(s&1)===1?t-i:i;if(n===fm){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,s+=Math.abs(a);let c=this.repetitions-s;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(c===1){let l=e<0;this._setEndings(l,!l,o)}else this._setEndings(!1,!1,o);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=es,i.endingEnd=es):(e?i.endingStart=this.zeroSlopeAtStart?es:$r:i.endingStart=ta,t?i.endingEnd=this.zeroSlopeAtEnd?es:$r:i.endingEnd=ta)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,c=o.sampleValues;return a[0]=s,c[0]=t,a[1]=s+e,c[1]=n,this}},Rv=new Float32Array(1),Ca=class extends Li{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,o=e._propertyBindings,a=e._interpolants,c=n.uuid,l=this._bindingsByRootAndName,h=l[c];h===void 0&&(h={},l[c]=h);for(let u=0;u!==s;++u){let f=i[u],d=f.name,g=h[d];if(g!==void 0)++g.referenceCount,o[u]=g;else{if(g=o[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,c,d));continue}let E=t&&t._propertyBindings[u].binding.parsedPath;g=new hl(Ht.create(n,d,E),f.ValueTypeName,f.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,c,d),o[u]=g}a[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,o=s[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=o;else{let a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,o=this._actionsByClip,a=o[s],c=a.knownActions,l=c[c.length-1],h=e._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),e._byClipCacheIndex=null;let u=a.actionByRoot,f=(e._localRoot||this._root).uuid;delete u[f],c.length===0&&delete o[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,o=this._bindingsByRootAndName,a=o[i],c=t[t.length-1],l=e._cacheIndex;c._cacheIndex=l,t[l]=c,t.pop(),delete a[s],Object.keys(a).length===0&&delete o[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new wa(new Float32Array(2),new Float32Array(2),1,Rv),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,o=typeof e=="string"?us.findByName(i,e):e,a=o!==null?o.uuid:e,c=this._actionsByClip[a],l=null;if(n===void 0&&(o!==null?n=o.blendMode:n=cu),c!==void 0){let u=c.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;l=c.knownActions[0],o===null&&(o=l._clip)}if(o===null)return null;let h=new fl(this,o,t,n);return this._bindAction(h,l),this._addInactiveAction(h,a,s),h}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?us.findByName(n,e):e,o=s?s.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),o=this._accuIndex^=1;for(let l=0;l!==n;++l)t[l]._update(i,e,s,o);let a=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)a[l].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let o=s.knownActions;for(let a=0,c=o.length;a!==c;++a){let l=o[a];this._deactivateAction(l);let h=l._cacheIndex,u=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(l)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,c=a[t];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let o in s){let a=s[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}},zp=new ke,Bn=class{constructor(e,t,n=0,i=1/0){this.ray=new Di(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Qs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return zp.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zp),this}intersectObject(e,t=!0,n=[]){return jh(e,this,n,t),n.sort(kp),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)jh(e[i],this,n,t);return n.sort(kp),n}};Ia=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=mt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(mt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},Vp=new R,Fc=new R,Xs=new R,qs=new R,Bh=new R,Cv=new R,Iv=new R,kn=class{constructor(e=new R,t=new R){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Vp.subVectors(e,this.start),Fc.subVectors(this.end,this.start);let n=Fc.dot(Fc),s=Fc.dot(Vp)/n;return t&&(s=mt(s,0,1)),s}closestPointToPoint(e,t,n){let i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(e,t=Cv,n=Iv){let i=10000000000000001e-32,s,o,a=this.start,c=e.start,l=this.end,h=e.end;Xs.subVectors(l,a),qs.subVectors(h,c),Bh.subVectors(a,c);let u=Xs.dot(Xs),f=qs.dot(qs),d=qs.dot(Bh);if(u<=i&&f<=i)return t.copy(a),n.copy(c),t.sub(n),t.dot(t);if(u<=i)s=0,o=d/f,o=mt(o,0,1);else{let g=Xs.dot(Bh);if(f<=i)o=0,s=mt(-g/u,0,1);else{let E=Xs.dot(qs),m=u*f-E*E;m!==0?s=mt((E*d-g*f)/m,0,1):s=0,o=(E*s+d)/f,o<0?(o=0,s=mt(-g/u,0,1)):o>1&&(o=1,s=mt((E-g)/u,0,1))}}return t.copy(a).add(Xs.multiplyScalar(s)),n.copy(c).add(qs.multiplyScalar(o)),t.sub(n),t.dot(t)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180")});function rg(){let r=null,e=!1,t=null,n=null;function i(s,o){t(s,o),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Lv(r){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,u=l.byteLength,f=r.createBuffer();r.bindBuffer(c,f),r.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=r.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=r.SHORT;else if(l instanceof Uint32Array)d=r.UNSIGNED_INT;else if(l instanceof Int32Array)d=r.INT;else if(l instanceof Int8Array)d=r.BYTE;else if(l instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(r.bindBuffer(l,a),u.length===0)r.bufferSubData(l,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){let g=u[f],E=u[d];E.start<=g.start+g.count+1?g.count=Math.max(g.count,E.start+E.count-g.start):(++f,u[f]=E)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){let E=u[d];r.bufferSubData(l,E.start*h.BYTES_PER_ELEMENT,h,E.start,E.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(r.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:s,update:o}}function dE(r,e,t,n,i,s,o){let a=new Ve(0),c=s===!0?0:1,l,h,u=null,f=0,d=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function E(x){let v=!1,S=g(x);S===null?p(a,c):S&&S.isColor&&(p(S,1),v=!0);let A=r.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(x,v){let S=g(v);S&&(S.isCubeTexture||S.mapping===La)?(h===void 0&&(h=new _e(new xn(1,1,1),new Nt({name:"BackgroundCubeMaterial",uniforms:vs(ki.backgroundCube.uniforms),vertexShader:ki.backgroundCube.vertexShader,fragmentShader:ki.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ys.copy(v.backgroundRotation),ys.x*=-1,ys.y*=-1,ys.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ys.y*=-1,ys.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(fE.makeRotationFromEuler(ys)),h.material.toneMapped=Tt.getTransfer(S.colorSpace)!==Ft,(u!==S||f!==S.version||d!==r.toneMapping)&&(h.material.needsUpdate=!0,u=S,f=S.version,d=r.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new _e(new Bi(2,2),new Nt({name:"BackgroundMaterial",uniforms:vs(ki.background.uniforms),vertexShader:ki.background.vertexShader,fragmentShader:ki.background.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=Tt.getTransfer(S.colorSpace)!==Ft,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||f!==S.version||d!==r.toneMapping)&&(l.material.needsUpdate=!0,u=S,f=S.version,d=r.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,v){x.getRGB(uu,mf(r)),n.buffers.color.setClear(uu.r,uu.g,uu.b,v,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),c=v,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(a,c)},render:E,addToRenderList:m,dispose:M}}function pE(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null),s=i,o=!1;function a(_,b,P,U,N){let H=!1,V=u(U,P,b);s!==V&&(s=V,l(s.object)),H=d(_,U,P,N),H&&g(_,U,P,N),N!==null&&e.update(N,r.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,v(_,b,P,U),N!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function c(){return r.createVertexArray()}function l(_){return r.bindVertexArray(_)}function h(_){return r.deleteVertexArray(_)}function u(_,b,P){let U=P.wireframe===!0,N=n[_.id];N===void 0&&(N={},n[_.id]=N);let H=N[b.id];H===void 0&&(H={},N[b.id]=H);let V=H[U];return V===void 0&&(V=f(c()),H[U]=V),V}function f(_){let b=[],P=[],U=[];for(let N=0;N<t;N++)b[N]=0,P[N]=0,U[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:P,attributeDivisors:U,object:_,attributes:{},index:null}}function d(_,b,P,U){let N=s.attributes,H=b.attributes,V=0,Z=P.getAttributes();for(let X in Z)if(Z[X].location>=0){let Y=N[X],J=H[X];if(J===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(J=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(J=_.instanceColor)),Y===void 0||Y.attribute!==J||J&&Y.data!==J.data)return!0;V++}return s.attributesNum!==V||s.index!==U}function g(_,b,P,U){let N={},H=b.attributes,V=0,Z=P.getAttributes();for(let X in Z)if(Z[X].location>=0){let Y=H[X];Y===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(Y=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(Y=_.instanceColor));let J={};J.attribute=Y,Y&&Y.data&&(J.data=Y.data),N[X]=J,V++}s.attributes=N,s.attributesNum=V,s.index=U}function E(){let _=s.newAttributes;for(let b=0,P=_.length;b<P;b++)_[b]=0}function m(_){p(_,0)}function p(_,b){let P=s.newAttributes,U=s.enabledAttributes,N=s.attributeDivisors;P[_]=1,U[_]===0&&(r.enableVertexAttribArray(_),U[_]=1),N[_]!==b&&(r.vertexAttribDivisor(_,b),N[_]=b)}function M(){let _=s.newAttributes,b=s.enabledAttributes;for(let P=0,U=b.length;P<U;P++)b[P]!==_[P]&&(r.disableVertexAttribArray(P),b[P]=0)}function x(_,b,P,U,N,H,V){V===!0?r.vertexAttribIPointer(_,b,P,N,H):r.vertexAttribPointer(_,b,P,U,N,H)}function v(_,b,P,U){E();let N=U.attributes,H=P.getAttributes(),V=b.defaultAttributeValues;for(let Z in H){let X=H[Z];if(X.location>=0){let z=N[Z];if(z===void 0&&(Z==="instanceMatrix"&&_.instanceMatrix&&(z=_.instanceMatrix),Z==="instanceColor"&&_.instanceColor&&(z=_.instanceColor)),z!==void 0){let Y=z.normalized,J=z.itemSize,ne=e.get(z);if(ne===void 0)continue;let ae=ne.buffer,Ue=ne.type,xe=ne.bytesPerElement,j=Ue===r.INT||Ue===r.UNSIGNED_INT||z.gpuType===Cl;if(z.isInterleavedBufferAttribute){let re=z.data,Se=re.stride,He=z.offset;if(re.isInstancedInterleavedBuffer){for(let Ie=0;Ie<X.locationSize;Ie++)p(X.location+Ie,re.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Ie=0;Ie<X.locationSize;Ie++)m(X.location+Ie);r.bindBuffer(r.ARRAY_BUFFER,ae);for(let Ie=0;Ie<X.locationSize;Ie++)x(X.location+Ie,J/X.locationSize,Ue,Y,Se*xe,(He+J/X.locationSize*Ie)*xe,j)}else{if(z.isInstancedBufferAttribute){for(let re=0;re<X.locationSize;re++)p(X.location+re,z.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let re=0;re<X.locationSize;re++)m(X.location+re);r.bindBuffer(r.ARRAY_BUFFER,ae);for(let re=0;re<X.locationSize;re++)x(X.location+re,J/X.locationSize,Ue,Y,J*xe,J/X.locationSize*re*xe,j)}}else if(V!==void 0){let Y=V[Z];if(Y!==void 0)switch(Y.length){case 2:r.vertexAttrib2fv(X.location,Y);break;case 3:r.vertexAttrib3fv(X.location,Y);break;case 4:r.vertexAttrib4fv(X.location,Y);break;default:r.vertexAttrib1fv(X.location,Y)}}}}M()}function S(){I();for(let _ in n){let b=n[_];for(let P in b){let U=b[P];for(let N in U)h(U[N].object),delete U[N];delete b[P]}delete n[_]}}function A(_){if(n[_.id]===void 0)return;let b=n[_.id];for(let P in b){let U=b[P];for(let N in U)h(U[N].object),delete U[N];delete b[P]}delete n[_.id]}function C(_){for(let b in n){let P=n[b];if(P[_.id]===void 0)continue;let U=P[_.id];for(let N in U)h(U[N].object),delete U[N];delete P[_.id]}}function I(){w(),o=!0,s!==i&&(s=i,l(s.object))}function w(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:I,resetDefaultState:w,dispose:S,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:E,enableAttribute:m,disableUnusedAttributes:M}}function mE(r,e,t){let n;function i(l){n=l}function s(l,h){r.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(r.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];t.update(d,n,1)}function c(l,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)o(l[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let E=0;E<u;E++)g+=h[E]*f[E];t.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function gE(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(C){return!(C!==ln&&n.convert(C)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let I=C===qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Si&&n.convert(C)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==cn&&!I)}function c(C){if(C==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),M=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),x=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),S=g>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:E,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:S,maxSamples:A}}function xE(r){let e=this,t=null,n=0,i=!1,s=!1,o=new Dn,a=new yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,E=u.clipIntersection,m=u.clipShadows,p=r.get(u);if(!i||g===null||g.length===0||s&&!m)s?h(null):l();else{let M=s?0:n,x=M*4,v=p.clippingState||null;c.value=v,v=h(g,f,x,d);for(let S=0;S!==x;++S)v[S]=t[S];p.clippingState=v,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){let E=u!==null?u.length:0,m=null;if(E!==0){if(m=c.value,g!==!0||m===null){let p=d+E*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=d;x!==E;++x,v+=4)o.copy(u[x]).applyMatrix4(M,a),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,m}}function vE(r){let e=new WeakMap;function t(o,a){return a===co?o.mapping=ms:a===Al&&(o.mapping=gs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===co||a===Al)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Yc(c.height);return l.fromEquirectangularTexture(r,o),e.set(o,l),o.addEventListener("dispose",i),t(l.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}function _E(r){let e=[],t=[],n=[],i=r,s=r-go+1+Um.length;for(let o=0;o<s;o++){let a=Math.pow(2,i);t.push(a);let c=1/a;o>r-go?c=Um[o-r+go-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,E=3,m=2,p=1,M=new Float32Array(E*g*d),x=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let A=0;A<d;A++){let C=A%3*2/3-1,I=A>2?0:-1,w=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];M.set(w,E*g*A),x.set(f,m*g*A);let _=[A,A,A,A,A,A];v.set(_,p*g*A)}let S=new gt;S.setAttribute("position",new Rt(M,E)),S.setAttribute("uv",new Rt(x,m)),S.setAttribute("faceIndex",new Rt(v,p)),e.push(S),i>go&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Fm(r,e,t){let n=new sn(r,e,t);return n.texture.mapping=La,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function hu(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function EE(r,e,t){let n=new Float32Array(Ms),i=new R(0,1,0);return new Nt({name:"SphericalGaussianBlur",defines:{n:Ms,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Uf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Om(){return new Nt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Uf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function zm(){return new Nt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Uf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Uf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ME(r){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===co||c===Al,h=c===ms||c===gs;if(l||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new vo(r)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return l&&d&&d.height>0||h&&d&&i(d)?(t===null&&(t=new vo(r)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function i(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){let c=a.target;c.removeEventListener("dispose",s);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function SE(r){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Ks("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function wE(r,e,t,n){let i={},s=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete i[f.id];let d=s.get(f);d&&(e.remove(d),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let d in f)e.update(f[d],r.ARRAY_BUFFER)}function l(u){let f=[],d=u.index,g=u.attributes.position,E=0;if(d!==null){let M=d.array;E=d.version;for(let x=0,v=M.length;x<v;x+=3){let S=M[x+0],A=M[x+1],C=M[x+2];f.push(S,A,A,C,C,S)}}else if(g!==void 0){let M=g.array;E=g.version;for(let x=0,v=M.length/3-1;x<v;x+=3){let S=x+0,A=x+1,C=x+2;f.push(S,A,A,C,C,S)}}else return;let m=new(pf(f)?oa:sa)(f,1);m.version=E;let p=s.get(u);p&&e.remove(p),s.set(u,m)}function h(u){let f=s.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return s.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function TE(r,e,t){let n;function i(f){n=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function c(f,d){r.drawElements(n,d,s,f*o),t.update(d,n,1)}function l(f,d,g){g!==0&&(r.drawElementsInstanced(n,d,s,f*o,g),t.update(d,n,g))}function h(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,n,1)}function u(f,d,g,E){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/o,d[p],E[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,s,f,0,E,0,g);let p=0;for(let M=0;M<g;M++)p+=d[M]*E[M];t.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function bE(r){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case r.TRIANGLES:t.triangles+=a*(s/3);break;case r.LINES:t.lines+=a*(s/2);break;case r.LINE_STRIP:t.lines+=a*(s-1);break;case r.LINE_LOOP:t.lines+=a*s;break;case r.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function AE(r,e,t){let n=new WeakMap,i=new At;function s(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let w=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,E=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],x=0;d===!0&&(x=1),g===!0&&(x=2),E===!0&&(x=3);let v=a.attributes.position.count*x,S=1;v>e.maxTextureSize&&(S=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let A=new Float32Array(v*S*4*u),C=new ra(A,v,S,u);C.type=cn,C.needsUpdate=!0;let I=x*4;for(let _=0;_<u;_++){let b=m[_],P=p[_],U=M[_],N=v*S*4*_;for(let H=0;H<b.count;H++){let V=H*I;d===!0&&(i.fromBufferAttribute(b,H),A[N+V+0]=i.x,A[N+V+1]=i.y,A[N+V+2]=i.z,A[N+V+3]=0),g===!0&&(i.fromBufferAttribute(P,H),A[N+V+4]=i.x,A[N+V+5]=i.y,A[N+V+6]=i.z,A[N+V+7]=0),E===!0&&(i.fromBufferAttribute(U,H),A[N+V+8]=i.x,A[N+V+9]=i.y,A[N+V+10]=i.z,A[N+V+11]=U.itemSize===4?i.w:1)}}f={count:u,texture:C,size:new de(v,S)},n.set(a,f),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(r,"morphTexture",o.morphTexture,t);else{let d=0;for(let E=0;E<l.length;E++)d+=l[E];let g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(r,"morphTargetBaseInfluence",g),c.getUniforms().setValue(r,"morphTargetInfluences",l)}c.getUniforms().setValue(r,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function RE(r,e,t,n){let i=new WeakMap;function s(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function o(){i=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}function _o(r,e,t){let n=r[0];if(n<=0||n>0)return r;let i=e*t,s=Vm[i];if(s===void 0&&(s=new Float32Array(i),Vm[i]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,r[o].toArray(s,a)}return s}function Sn(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function wn(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function pu(r,e){let t=Gm[e];t===void 0&&(t=new Int32Array(e),Gm[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function CE(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function IE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Sn(t,e))return;r.uniform2fv(this.addr,e),wn(t,e)}}function PE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Sn(t,e))return;r.uniform3fv(this.addr,e),wn(t,e)}}function LE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Sn(t,e))return;r.uniform4fv(this.addr,e),wn(t,e)}}function DE(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Sn(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),wn(t,e)}else{if(Sn(t,n))return;qm.set(n),r.uniformMatrix2fv(this.addr,!1,qm),wn(t,n)}}function NE(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Sn(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),wn(t,e)}else{if(Sn(t,n))return;Xm.set(n),r.uniformMatrix3fv(this.addr,!1,Xm),wn(t,n)}}function UE(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Sn(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),wn(t,e)}else{if(Sn(t,n))return;Wm.set(n),r.uniformMatrix4fv(this.addr,!1,Wm),wn(t,n)}}function BE(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function HE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Sn(t,e))return;r.uniform2iv(this.addr,e),wn(t,e)}}function FE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Sn(t,e))return;r.uniform3iv(this.addr,e),wn(t,e)}}function OE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Sn(t,e))return;r.uniform4iv(this.addr,e),wn(t,e)}}function zE(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function kE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Sn(t,e))return;r.uniform2uiv(this.addr,e),wn(t,e)}}function VE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Sn(t,e))return;r.uniform3uiv(this.addr,e),wn(t,e)}}function GE(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Sn(t,e))return;r.uniform4uiv(this.addr,e),wn(t,e)}}function WE(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(km.compareFunction=hf,s=km):s=sg,t.setTexture2D(e||s,i)}function XE(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||ag,i)}function qE(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||cg,i)}function YE(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||og,i)}function ZE(r){switch(r){case 5126:return CE;case 35664:return IE;case 35665:return PE;case 35666:return LE;case 35674:return DE;case 35675:return NE;case 35676:return UE;case 5124:case 35670:return BE;case 35667:case 35671:return HE;case 35668:case 35672:return FE;case 35669:case 35673:return OE;case 5125:return zE;case 36294:return kE;case 36295:return VE;case 36296:return GE;case 35678:case 36198:case 36298:case 36306:case 35682:return WE;case 35679:case 36299:case 36307:return XE;case 35680:case 36300:case 36308:case 36293:return qE;case 36289:case 36303:case 36311:case 36292:return YE}}function jE(r,e){r.uniform1fv(this.addr,e)}function KE(r,e){let t=_o(e,this.size,2);r.uniform2fv(this.addr,t)}function JE(r,e){let t=_o(e,this.size,3);r.uniform3fv(this.addr,t)}function QE(r,e){let t=_o(e,this.size,4);r.uniform4fv(this.addr,t)}function $E(r,e){let t=_o(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function eM(r,e){let t=_o(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function tM(r,e){let t=_o(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function nM(r,e){r.uniform1iv(this.addr,e)}function iM(r,e){r.uniform2iv(this.addr,e)}function rM(r,e){r.uniform3iv(this.addr,e)}function sM(r,e){r.uniform4iv(this.addr,e)}function oM(r,e){r.uniform1uiv(this.addr,e)}function aM(r,e){r.uniform2uiv(this.addr,e)}function cM(r,e){r.uniform3uiv(this.addr,e)}function lM(r,e){r.uniform4uiv(this.addr,e)}function uM(r,e,t){let n=this.cache,i=e.length,s=pu(t,i);Sn(n,s)||(r.uniform1iv(this.addr,s),wn(n,s));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||sg,s[o])}function hM(r,e,t){let n=this.cache,i=e.length,s=pu(t,i);Sn(n,s)||(r.uniform1iv(this.addr,s),wn(n,s));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||ag,s[o])}function fM(r,e,t){let n=this.cache,i=e.length,s=pu(t,i);Sn(n,s)||(r.uniform1iv(this.addr,s),wn(n,s));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||cg,s[o])}function dM(r,e,t){let n=this.cache,i=e.length,s=pu(t,i);Sn(n,s)||(r.uniform1iv(this.addr,s),wn(n,s));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||og,s[o])}function pM(r){switch(r){case 5126:return jE;case 35664:return KE;case 35665:return JE;case 35666:return QE;case 35674:return $E;case 35675:return eM;case 35676:return tM;case 5124:case 35670:return nM;case 35667:case 35671:return iM;case 35668:case 35672:return rM;case 35669:case 35673:return sM;case 5125:return oM;case 36294:return aM;case 36295:return cM;case 36296:return lM;case 35678:case 36198:case 36298:case 36306:case 35682:return uM;case 35679:case 36299:case 36307:return hM;case 35680:case 36300:case 36308:case 36293:return fM;case 36289:case 36303:case 36311:case 36292:return dM}}function Ym(r,e){r.seq.push(e),r.map[e.id]=e}function mM(r,e,t){let n=r.name,i=n.length;for(bf.lastIndex=0;;){let s=bf.exec(n),o=bf.lastIndex,a=s[1],c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){Ym(t,l===void 0?new Af(a,r,e):new Rf(a,r,e));break}else{let u=t.map[a];u===void 0&&(u=new Cf(a),Ym(t,u)),t=u}}}function Zm(r,e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}function vM(r,e){let t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=i;o<s;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function yM(r){Tt._getMatrix(jm,Tt.workingColorSpace,r);let e=`mat3( ${jm.elements.map(t=>t.toFixed(4))} )`;switch(Tt.getTransfer(r)){case na:return[e,"LinearTransferOETF"];case Ft:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Km(r,e,t){let n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+vM(r.getShaderSource(e),a)}else return s}function _M(r,e){let t=yM(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function EM(r,e){let t;switch(e){case El:t="Linear";break;case Ml:t="Reinhard";break;case Sl:t="Cineon";break;case wl:t="ACESFilmic";break;case ao:t="AgX";break;case bl:t="Neutral";break;case Tl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function MM(){Tt.getLuminanceCoefficients(fu);let r=fu.x.toFixed(4),e=fu.y.toFixed(4),t=fu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function SM(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Oa).join(`
`)}function wM(r){let e=[];for(let t in r){let n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function TM(r,e){let t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=r.getActiveAttrib(e,i),o=s.name,a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:r.getAttribLocation(e,o),locationSize:a}}return t}function Oa(r){return r!==""}function Jm(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Qm(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function If(r){return r.replace(bM,RM)}function RM(r,e){let t=Et[e];if(t===void 0){let n=AM.get(e);if(n!==void 0)t=Et[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return If(t)}function $m(r){return r.replace(CM,IM)}function IM(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function eg(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function PM(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Jh?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===dl?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===zi&&(e="SHADOWMAP_TYPE_VSM"),e}function LM(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case ms:case gs:e="ENVMAP_TYPE_CUBE";break;case La:e="ENVMAP_TYPE_CUBE_UV";break}return e}function DM(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case gs:e="ENVMAP_MODE_REFRACTION";break}return e}function NM(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case ef:e="ENVMAP_BLENDING_MULTIPLY";break;case lm:e="ENVMAP_BLENDING_MIX";break;case um:e="ENVMAP_BLENDING_ADD";break}return e}function UM(r){let e=r.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function BM(r,e,t,n){let i=r.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,c=PM(t),l=LM(t),h=DM(t),u=NM(t),f=UM(t),d=SM(t),g=wM(s),E=i.createProgram(),m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Oa).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Oa).join(`
`),p.length>0&&(p+=`
`)):(m=[eg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Oa).join(`
`),p=[eg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==fr?"#define TONE_MAPPING":"",t.toneMapping!==fr?Et.tonemapping_pars_fragment:"",t.toneMapping!==fr?EM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Et.colorspace_pars_fragment,_M("linearToOutputTexel",t.outputColorSpace),MM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Oa).join(`
`)),o=If(o),o=Jm(o,t),o=Qm(o,t),a=If(a),a=Jm(a,t),a=Qm(a,t),o=$m(o),a=$m(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===ff?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ff?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let x=M+m+o,v=M+p+a,S=Zm(i,i.VERTEX_SHADER,x),A=Zm(i,i.FRAGMENT_SHADER,v);i.attachShader(E,S),i.attachShader(E,A),t.index0AttributeName!==void 0?i.bindAttribLocation(E,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(E,0,"position"),i.linkProgram(E);function C(b){if(r.debug.checkShaderErrors){let P=i.getProgramInfoLog(E)||"",U=i.getShaderInfoLog(S)||"",N=i.getShaderInfoLog(A)||"",H=P.trim(),V=U.trim(),Z=N.trim(),X=!0,z=!0;if(i.getProgramParameter(E,i.LINK_STATUS)===!1)if(X=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,E,S,A);else{let Y=Km(i,S,"vertex"),J=Km(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(E,i.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+H+`
`+Y+`
`+J)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(V===""||Z==="")&&(z=!1);z&&(b.diagnostics={runnable:X,programLog:H,vertexShader:{log:V,prefix:m},fragmentShader:{log:Z,prefix:p}})}i.deleteShader(S),i.deleteShader(A),I=new xo(i,E),w=TM(i,E)}let I;this.getUniforms=function(){return I===void 0&&C(this),I};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=i.getProgramParameter(E,gM)),_},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(E),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=xM++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=S,this.fragmentShader=A,this}function FM(r,e,t,n,i,s,o){let a=new Qs,c=new Pf,l=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures,d=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(w){return l.add(w),w===0?"uv":`uv${w}`}function m(w,_,b,P,U){let N=P.fog,H=U.geometry,V=w.isMeshStandardMaterial?P.environment:null,Z=(w.isMeshStandardMaterial?t:e).get(w.envMap||V),X=Z&&Z.mapping===La?Z.image.height:null,z=g[w.type];w.precision!==null&&(d=i.getMaxPrecision(w.precision),d!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",d,"instead."));let Y=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,J=Y!==void 0?Y.length:0,ne=0;H.morphAttributes.position!==void 0&&(ne=1),H.morphAttributes.normal!==void 0&&(ne=2),H.morphAttributes.color!==void 0&&(ne=3);let ae,Ue,xe,j;if(z){let Lt=ki[z];ae=Lt.vertexShader,Ue=Lt.fragmentShader}else ae=w.vertexShader,Ue=w.fragmentShader,c.update(w),xe=c.getVertexShaderID(w),j=c.getFragmentShaderID(w);let re=r.getRenderTarget(),Se=r.state.buffers.depth.getReversed(),He=U.isInstancedMesh===!0,Ie=U.isBatchedMesh===!0,nt=!!w.map,rt=!!w.matcap,W=!!Z,ve=!!w.aoMap,fe=!!w.lightMap,ge=!!w.bumpMap,pe=!!w.normalMap,Te=!!w.displacementMap,be=!!w.emissiveMap,Le=!!w.metalnessMap,dt=!!w.roughnessMap,lt=w.anisotropy>0,k=w.clearcoat>0,D=w.dispersion>0,te=w.iridescence>0,le=w.sheen>0,we=w.transmission>0,ce=lt&&!!w.anisotropyMap,Qe=k&&!!w.clearcoatMap,Be=k&&!!w.clearcoatNormalMap,je=k&&!!w.clearcoatRoughnessMap,Ze=te&&!!w.iridescenceMap,Ce=te&&!!w.iridescenceThicknessMap,ye=le&&!!w.sheenColorMap,$e=le&&!!w.sheenRoughnessMap,et=!!w.specularMap,Oe=!!w.specularColorMap,Je=!!w.specularIntensityMap,q=we&&!!w.transmissionMap,De=we&&!!w.thicknessMap,oe=!!w.gradientMap,qe=!!w.alphaMap,Pe=w.alphaTest>0,Me=!!w.alphaHash,it=!!w.extensions,xt=fr;w.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(xt=r.toneMapping);let Pt={shaderID:z,shaderType:w.type,shaderName:w.name,vertexShader:ae,fragmentShader:Ue,defines:w.defines,customVertexShaderID:xe,customFragmentShaderID:j,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:d,batching:Ie,batchingColor:Ie&&U._colorsTexture!==null,instancing:He,instancingColor:He&&U.instanceColor!==null,instancingMorph:He&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:re===null?r.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Xt,alphaToCoverage:!!w.alphaToCoverage,map:nt,matcap:rt,envMap:W,envMapMode:W&&Z.mapping,envMapCubeUVHeight:X,aoMap:ve,lightMap:fe,bumpMap:ge,normalMap:pe,displacementMap:f&&Te,emissiveMap:be,normalMapObjectSpace:pe&&w.normalMapType===vm,normalMapTangentSpace:pe&&w.normalMapType===uf,metalnessMap:Le,roughnessMap:dt,anisotropy:lt,anisotropyMap:ce,clearcoat:k,clearcoatMap:Qe,clearcoatNormalMap:Be,clearcoatRoughnessMap:je,dispersion:D,iridescence:te,iridescenceMap:Ze,iridescenceThicknessMap:Ce,sheen:le,sheenColorMap:ye,sheenRoughnessMap:$e,specularMap:et,specularColorMap:Oe,specularIntensityMap:Je,transmission:we,transmissionMap:q,thicknessMap:De,gradientMap:oe,opaque:w.transparent===!1&&w.blending===ns&&w.alphaToCoverage===!1,alphaMap:qe,alphaTest:Pe,alphaHash:Me,combine:w.combine,mapUv:nt&&E(w.map.channel),aoMapUv:ve&&E(w.aoMap.channel),lightMapUv:fe&&E(w.lightMap.channel),bumpMapUv:ge&&E(w.bumpMap.channel),normalMapUv:pe&&E(w.normalMap.channel),displacementMapUv:Te&&E(w.displacementMap.channel),emissiveMapUv:be&&E(w.emissiveMap.channel),metalnessMapUv:Le&&E(w.metalnessMap.channel),roughnessMapUv:dt&&E(w.roughnessMap.channel),anisotropyMapUv:ce&&E(w.anisotropyMap.channel),clearcoatMapUv:Qe&&E(w.clearcoatMap.channel),clearcoatNormalMapUv:Be&&E(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:je&&E(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ze&&E(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&E(w.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&E(w.sheenColorMap.channel),sheenRoughnessMapUv:$e&&E(w.sheenRoughnessMap.channel),specularMapUv:et&&E(w.specularMap.channel),specularColorMapUv:Oe&&E(w.specularColorMap.channel),specularIntensityMapUv:Je&&E(w.specularIntensityMap.channel),transmissionMapUv:q&&E(w.transmissionMap.channel),thicknessMapUv:De&&E(w.thicknessMap.channel),alphaMapUv:qe&&E(w.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(pe||lt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!H.attributes.uv&&(nt||qe),fog:!!N,useFog:w.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:U.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:ne,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:r.shadowMap.enabled&&b.length>0,shadowMapType:r.shadowMap.type,toneMapping:xt,decodeVideoTexture:nt&&w.map.isVideoTexture===!0&&Tt.getTransfer(w.map.colorSpace)===Ft,decodeVideoTextureEmissive:be&&w.emissiveMap.isVideoTexture===!0&&Tt.getTransfer(w.emissiveMap.colorSpace)===Ft,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Mt,flipSided:w.side===Mn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:it&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(it&&w.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Pt.vertexUv1s=l.has(1),Pt.vertexUv2s=l.has(2),Pt.vertexUv3s=l.has(3),l.clear(),Pt}function p(w){let _=[];if(w.shaderID?_.push(w.shaderID):(_.push(w.customVertexShaderID),_.push(w.customFragmentShaderID)),w.defines!==void 0)for(let b in w.defines)_.push(b),_.push(w.defines[b]);return w.isRawShaderMaterial===!1&&(M(_,w),x(_,w),_.push(r.outputColorSpace)),_.push(w.customProgramCacheKey),_.join()}function M(w,_){w.push(_.precision),w.push(_.outputColorSpace),w.push(_.envMapMode),w.push(_.envMapCubeUVHeight),w.push(_.mapUv),w.push(_.alphaMapUv),w.push(_.lightMapUv),w.push(_.aoMapUv),w.push(_.bumpMapUv),w.push(_.normalMapUv),w.push(_.displacementMapUv),w.push(_.emissiveMapUv),w.push(_.metalnessMapUv),w.push(_.roughnessMapUv),w.push(_.anisotropyMapUv),w.push(_.clearcoatMapUv),w.push(_.clearcoatNormalMapUv),w.push(_.clearcoatRoughnessMapUv),w.push(_.iridescenceMapUv),w.push(_.iridescenceThicknessMapUv),w.push(_.sheenColorMapUv),w.push(_.sheenRoughnessMapUv),w.push(_.specularMapUv),w.push(_.specularColorMapUv),w.push(_.specularIntensityMapUv),w.push(_.transmissionMapUv),w.push(_.thicknessMapUv),w.push(_.combine),w.push(_.fogExp2),w.push(_.sizeAttenuation),w.push(_.morphTargetsCount),w.push(_.morphAttributeCount),w.push(_.numDirLights),w.push(_.numPointLights),w.push(_.numSpotLights),w.push(_.numSpotLightMaps),w.push(_.numHemiLights),w.push(_.numRectAreaLights),w.push(_.numDirLightShadows),w.push(_.numPointLightShadows),w.push(_.numSpotLightShadows),w.push(_.numSpotLightShadowsWithMaps),w.push(_.numLightProbes),w.push(_.shadowMapType),w.push(_.toneMapping),w.push(_.numClippingPlanes),w.push(_.numClipIntersection),w.push(_.depthPacking)}function x(w,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),_.gradientMap&&a.enable(22),w.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reversedDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),w.push(a.mask)}function v(w){let _=g[w.type],b;if(_){let P=ki[_];b=Fn.clone(P.uniforms)}else b=w.uniforms;return b}function S(w,_){let b;for(let P=0,U=h.length;P<U;P++){let N=h[P];if(N.cacheKey===_){b=N,++b.usedTimes;break}}return b===void 0&&(b=new BM(r,_,w,s),h.push(b)),b}function A(w){if(--w.usedTimes===0){let _=h.indexOf(w);h[_]=h[h.length-1],h.pop(),w.destroy()}}function C(w){c.remove(w)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:S,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:I}}function OM(){let r=new WeakMap;function e(o){return r.has(o)}function t(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,c){r.get(o)[a]=c}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function zM(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function tg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function ng(){let r=[],e=0,t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function o(u,f,d,g,E,m){let p=r[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:E,group:m},r[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=E,p.group=m),e++,p}function a(u,f,d,g,E,m){let p=o(u,f,d,g,E,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):t.push(p)}function c(u,f,d,g,E,m){let p=o(u,f,d,g,E,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):t.unshift(p)}function l(u,f){t.length>1&&t.sort(u||zM),n.length>1&&n.sort(f||tg),i.length>1&&i.sort(f||tg)}function h(){for(let u=e,f=r.length;u<f;u++){let d=r[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:a,unshift:c,finish:h,sort:l}}function kM(){let r=new WeakMap;function e(n,i){let s=r.get(n),o;return s===void 0?(o=new ng,r.set(n,[o])):i>=s.length?(o=new ng,s.push(o)):o=s[i],o}function t(){r=new WeakMap}return{get:e,dispose:t}}function VM(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Ve};break;case"SpotLight":t={position:new R,direction:new R,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":t={color:new Ve,position:new R,halfWidth:new R,halfHeight:new R};break}return r[e.id]=t,t}}}function GM(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}function XM(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function qM(r){let e=new VM,t=GM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);let i=new R,s=new ke,o=new ke;function a(l){let h=0,u=0,f=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let d=0,g=0,E=0,m=0,p=0,M=0,x=0,v=0,S=0,A=0,C=0;l.sort(XM);for(let w=0,_=l.length;w<_;w++){let b=l[w],P=b.color,U=b.intensity,N=b.distance,H=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)h+=P.r*U,u+=P.g*U,f+=P.b*U;else if(b.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(b.sh.coefficients[V],U);C++}else if(b.isDirectionalLight){let V=e.get(b);if(V.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){let Z=b.shadow,X=t.get(b);X.shadowIntensity=Z.intensity,X.shadowBias=Z.bias,X.shadowNormalBias=Z.normalBias,X.shadowRadius=Z.radius,X.shadowMapSize=Z.mapSize,n.directionalShadow[d]=X,n.directionalShadowMap[d]=H,n.directionalShadowMatrix[d]=b.shadow.matrix,M++}n.directional[d]=V,d++}else if(b.isSpotLight){let V=e.get(b);V.position.setFromMatrixPosition(b.matrixWorld),V.color.copy(P).multiplyScalar(U),V.distance=N,V.coneCos=Math.cos(b.angle),V.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),V.decay=b.decay,n.spot[E]=V;let Z=b.shadow;if(b.map&&(n.spotLightMap[S]=b.map,S++,Z.updateMatrices(b),b.castShadow&&A++),n.spotLightMatrix[E]=Z.matrix,b.castShadow){let X=t.get(b);X.shadowIntensity=Z.intensity,X.shadowBias=Z.bias,X.shadowNormalBias=Z.normalBias,X.shadowRadius=Z.radius,X.shadowMapSize=Z.mapSize,n.spotShadow[E]=X,n.spotShadowMap[E]=H,v++}E++}else if(b.isRectAreaLight){let V=e.get(b);V.color.copy(P).multiplyScalar(U),V.halfWidth.set(b.width*.5,0,0),V.halfHeight.set(0,b.height*.5,0),n.rectArea[m]=V,m++}else if(b.isPointLight){let V=e.get(b);if(V.color.copy(b.color).multiplyScalar(b.intensity),V.distance=b.distance,V.decay=b.decay,b.castShadow){let Z=b.shadow,X=t.get(b);X.shadowIntensity=Z.intensity,X.shadowBias=Z.bias,X.shadowNormalBias=Z.normalBias,X.shadowRadius=Z.radius,X.shadowMapSize=Z.mapSize,X.shadowCameraNear=Z.camera.near,X.shadowCameraFar=Z.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=b.shadow.matrix,x++}n.point[g]=V,g++}else if(b.isHemisphereLight){let V=e.get(b);V.skyColor.copy(b.color).multiplyScalar(U),V.groundColor.copy(b.groundColor).multiplyScalar(U),n.hemi[p]=V,p++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ge.LTC_FLOAT_1,n.rectAreaLTC2=Ge.LTC_FLOAT_2):(n.rectAreaLTC1=Ge.LTC_HALF_1,n.rectAreaLTC2=Ge.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let I=n.hash;(I.directionalLength!==d||I.pointLength!==g||I.spotLength!==E||I.rectAreaLength!==m||I.hemiLength!==p||I.numDirectionalShadows!==M||I.numPointShadows!==x||I.numSpotShadows!==v||I.numSpotMaps!==S||I.numLightProbes!==C)&&(n.directional.length=d,n.spot.length=E,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=v+S-A,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,I.directionalLength=d,I.pointLength=g,I.spotLength=E,I.rectAreaLength=m,I.hemiLength=p,I.numDirectionalShadows=M,I.numPointShadows=x,I.numSpotShadows=v,I.numSpotMaps=S,I.numLightProbes=C,n.version=WM++)}function c(l,h){let u=0,f=0,d=0,g=0,E=0,m=h.matrixWorldInverse;for(let p=0,M=l.length;p<M;p++){let x=l[p];if(x.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(x.isSpotLight){let v=n.spot[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),d++}else if(x.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){let v=n.point[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){let v=n.hemi[E];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),E++}}}return{setup:a,setupView:c,state:n}}function ig(r){let e=new qM(r),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function YM(r){let e=new WeakMap;function t(i,s=0){let o=e.get(i),a;return o===void 0?(a=new ig(r),e.set(i,[a])):s>=o.length?(a=new ig(r),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function KM(r,e,t){let n=new Cr,i=new de,s=new de,o=new At,a=new il({depthPacking:xm}),c=new rl,l={},h=t.maxTextureSize,u={[An]:Mn,[Mn]:An,[Mt]:Mt},f=new Nt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:ZM,fragmentShader:jM}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new gt;g.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let E=new _e(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Jh;let p=this.type;this.render=function(A,C,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let w=r.getRenderTarget(),_=r.getActiveCubeFace(),b=r.getActiveMipmapLevel(),P=r.state;P.setBlending(Mi),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let U=p!==zi&&this.type===zi,N=p===zi&&this.type!==zi;for(let H=0,V=A.length;H<V;H++){let Z=A[H],X=Z.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);let z=X.getFrameExtents();if(i.multiply(z),s.copy(X.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/z.x),i.x=s.x*z.x,X.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/z.y),i.y=s.y*z.y,X.mapSize.y=s.y)),X.map===null||U===!0||N===!0){let J=this.type!==zi?{minFilter:gn,magFilter:gn}:{};X.map!==null&&X.map.dispose(),X.map=new sn(i.x,i.y,J),X.map.texture.name=Z.name+".shadowMap",X.camera.updateProjectionMatrix()}r.setRenderTarget(X.map),r.clear();let Y=X.getViewportCount();for(let J=0;J<Y;J++){let ne=X.getViewport(J);o.set(s.x*ne.x,s.y*ne.y,s.x*ne.z,s.y*ne.w),P.viewport(o),X.updateMatrices(Z,J),n=X.getFrustum(),v(C,I,X.camera,Z,this.type)}X.isPointLightShadow!==!0&&this.type===zi&&M(X,I),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,r.setRenderTarget(w,_,b)};function M(A,C){let I=e.update(E);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new sn(i.x,i.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(C,null,I,f,E,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(C,null,I,d,E,null)}function x(A,C,I,w){let _=null,b=I.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(b!==void 0)_=b;else if(_=I.isPointLight===!0?c:a,r.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let P=_.uuid,U=C.uuid,N=l[P];N===void 0&&(N={},l[P]=N);let H=N[U];H===void 0&&(H=_.clone(),N[U]=H,C.addEventListener("dispose",S)),_=H}if(_.visible=C.visible,_.wireframe=C.wireframe,w===zi?_.side=C.shadowSide!==null?C.shadowSide:C.side:_.side=C.shadowSide!==null?C.shadowSide:u[C.side],_.alphaMap=C.alphaMap,_.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,_.map=C.map,_.clipShadows=C.clipShadows,_.clippingPlanes=C.clippingPlanes,_.clipIntersection=C.clipIntersection,_.displacementMap=C.displacementMap,_.displacementScale=C.displacementScale,_.displacementBias=C.displacementBias,_.wireframeLinewidth=C.wireframeLinewidth,_.linewidth=C.linewidth,I.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let P=r.properties.get(_);P.light=I}return _}function v(A,C,I,w,_){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&_===zi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,A.matrixWorld);let U=e.update(A),N=A.material;if(Array.isArray(N)){let H=U.groups;for(let V=0,Z=H.length;V<Z;V++){let X=H[V],z=N[X.materialIndex];if(z&&z.visible){let Y=x(A,z,w,_);A.onBeforeShadow(r,A,C,I,U,Y,X),r.renderBufferDirect(I,null,U,Y,A,X),A.onAfterShadow(r,A,C,I,U,Y,X)}}}else if(N.visible){let H=x(A,N,w,_);A.onBeforeShadow(r,A,C,I,U,H,null),r.renderBufferDirect(I,null,U,H,A,null),A.onAfterShadow(r,A,C,I,U,H,null)}}let P=A.children;for(let U=0,N=P.length;U<N;U++)v(P[U],C,I,w,_)}function S(A){A.target.removeEventListener("dispose",S);for(let I in l){let w=l[I],_=A.target.uuid;_ in w&&(w[_].dispose(),delete w[_])}}}function QM(r,e){function t(){let q=!1,De=new At,oe=null,qe=new At(0,0,0,0);return{setMask:function(Pe){oe!==Pe&&!q&&(r.colorMask(Pe,Pe,Pe,Pe),oe=Pe)},setLocked:function(Pe){q=Pe},setClear:function(Pe,Me,it,xt,Pt){Pt===!0&&(Pe*=xt,Me*=xt,it*=xt),De.set(Pe,Me,it,xt),qe.equals(De)===!1&&(r.clearColor(Pe,Me,it,xt),qe.copy(De))},reset:function(){q=!1,oe=null,qe.set(-1,0,0,0)}}}function n(){let q=!1,De=!1,oe=null,qe=null,Pe=null;return{setReversed:function(Me){if(De!==Me){let it=e.get("EXT_clip_control");Me?it.clipControlEXT(it.LOWER_LEFT_EXT,it.ZERO_TO_ONE_EXT):it.clipControlEXT(it.LOWER_LEFT_EXT,it.NEGATIVE_ONE_TO_ONE_EXT),De=Me;let xt=Pe;Pe=null,this.setClear(xt)}},getReversed:function(){return De},setTest:function(Me){Me?re(r.DEPTH_TEST):Se(r.DEPTH_TEST)},setMask:function(Me){oe!==Me&&!q&&(r.depthMask(Me),oe=Me)},setFunc:function(Me){if(De&&(Me=JM[Me]),qe!==Me){switch(Me){case pl:r.depthFunc(r.NEVER);break;case ml:r.depthFunc(r.ALWAYS);break;case gl:r.depthFunc(r.LESS);break;case is:r.depthFunc(r.LEQUAL);break;case xl:r.depthFunc(r.EQUAL);break;case vl:r.depthFunc(r.GEQUAL);break;case yl:r.depthFunc(r.GREATER);break;case _l:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}qe=Me}},setLocked:function(Me){q=Me},setClear:function(Me){Pe!==Me&&(De&&(Me=1-Me),r.clearDepth(Me),Pe=Me)},reset:function(){q=!1,oe=null,qe=null,Pe=null,De=!1}}}function i(){let q=!1,De=null,oe=null,qe=null,Pe=null,Me=null,it=null,xt=null,Pt=null;return{setTest:function(Lt){q||(Lt?re(r.STENCIL_TEST):Se(r.STENCIL_TEST))},setMask:function(Lt){De!==Lt&&!q&&(r.stencilMask(Lt),De=Lt)},setFunc:function(Lt,fn,Tn){(oe!==Lt||qe!==fn||Pe!==Tn)&&(r.stencilFunc(Lt,fn,Tn),oe=Lt,qe=fn,Pe=Tn)},setOp:function(Lt,fn,Tn){(Me!==Lt||it!==fn||xt!==Tn)&&(r.stencilOp(Lt,fn,Tn),Me=Lt,it=fn,xt=Tn)},setLocked:function(Lt){q=Lt},setClear:function(Lt){Pt!==Lt&&(r.clearStencil(Lt),Pt=Lt)},reset:function(){q=!1,De=null,oe=null,qe=null,Pe=null,Me=null,it=null,xt=null,Pt=null}}}let s=new t,o=new n,a=new i,c=new WeakMap,l=new WeakMap,h={},u={},f=new WeakMap,d=[],g=null,E=!1,m=null,p=null,M=null,x=null,v=null,S=null,A=null,C=new Ve(0,0,0),I=0,w=!1,_=null,b=null,P=null,U=null,N=null,H=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,Z=0,X=r.getParameter(r.VERSION);X.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(X)[1]),V=Z>=1):X.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),V=Z>=2);let z=null,Y={},J=r.getParameter(r.SCISSOR_BOX),ne=r.getParameter(r.VIEWPORT),ae=new At().fromArray(J),Ue=new At().fromArray(ne);function xe(q,De,oe,qe){let Pe=new Uint8Array(4),Me=r.createTexture();r.bindTexture(q,Me),r.texParameteri(q,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(q,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let it=0;it<oe;it++)q===r.TEXTURE_3D||q===r.TEXTURE_2D_ARRAY?r.texImage3D(De,0,r.RGBA,1,1,qe,0,r.RGBA,r.UNSIGNED_BYTE,Pe):r.texImage2D(De+it,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Pe);return Me}let j={};j[r.TEXTURE_2D]=xe(r.TEXTURE_2D,r.TEXTURE_2D,1),j[r.TEXTURE_CUBE_MAP]=xe(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[r.TEXTURE_2D_ARRAY]=xe(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),j[r.TEXTURE_3D]=xe(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),re(r.DEPTH_TEST),o.setFunc(is),ge(!1),pe(Kh),re(r.CULL_FACE),ve(Mi);function re(q){h[q]!==!0&&(r.enable(q),h[q]=!0)}function Se(q){h[q]!==!1&&(r.disable(q),h[q]=!1)}function He(q,De){return u[q]!==De?(r.bindFramebuffer(q,De),u[q]=De,q===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=De),q===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=De),!0):!1}function Ie(q,De){let oe=d,qe=!1;if(q){oe=f.get(De),oe===void 0&&(oe=[],f.set(De,oe));let Pe=q.textures;if(oe.length!==Pe.length||oe[0]!==r.COLOR_ATTACHMENT0){for(let Me=0,it=Pe.length;Me<it;Me++)oe[Me]=r.COLOR_ATTACHMENT0+Me;oe.length=Pe.length,qe=!0}}else oe[0]!==r.BACK&&(oe[0]=r.BACK,qe=!0);qe&&r.drawBuffers(oe)}function nt(q){return g!==q?(r.useProgram(q),g=q,!0):!1}let rt={[br]:r.FUNC_ADD,[qp]:r.FUNC_SUBTRACT,[Yp]:r.FUNC_REVERSE_SUBTRACT};rt[Zp]=r.MIN,rt[jp]=r.MAX;let W={[Kp]:r.ZERO,[Jp]:r.ONE,[Qp]:r.SRC_COLOR,[zc]:r.SRC_ALPHA,[rm]:r.SRC_ALPHA_SATURATE,[nm]:r.DST_COLOR,[em]:r.DST_ALPHA,[$p]:r.ONE_MINUS_SRC_COLOR,[kc]:r.ONE_MINUS_SRC_ALPHA,[im]:r.ONE_MINUS_DST_COLOR,[tm]:r.ONE_MINUS_DST_ALPHA,[sm]:r.CONSTANT_COLOR,[om]:r.ONE_MINUS_CONSTANT_COLOR,[am]:r.CONSTANT_ALPHA,[cm]:r.ONE_MINUS_CONSTANT_ALPHA};function ve(q,De,oe,qe,Pe,Me,it,xt,Pt,Lt){if(q===Mi){E===!0&&(Se(r.BLEND),E=!1);return}if(E===!1&&(re(r.BLEND),E=!0),q!==Xp){if(q!==m||Lt!==w){if((p!==br||v!==br)&&(r.blendEquation(r.FUNC_ADD),p=br,v=br),Lt)switch(q){case ns:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Pa:r.blendFunc(r.ONE,r.ONE);break;case Qh:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case $h:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}else switch(q){case ns:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Pa:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Qh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $h:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}M=null,x=null,S=null,A=null,C.set(0,0,0),I=0,m=q,w=Lt}return}Pe=Pe||De,Me=Me||oe,it=it||qe,(De!==p||Pe!==v)&&(r.blendEquationSeparate(rt[De],rt[Pe]),p=De,v=Pe),(oe!==M||qe!==x||Me!==S||it!==A)&&(r.blendFuncSeparate(W[oe],W[qe],W[Me],W[it]),M=oe,x=qe,S=Me,A=it),(xt.equals(C)===!1||Pt!==I)&&(r.blendColor(xt.r,xt.g,xt.b,Pt),C.copy(xt),I=Pt),m=q,w=!1}function fe(q,De){q.side===Mt?Se(r.CULL_FACE):re(r.CULL_FACE);let oe=q.side===Mn;De&&(oe=!oe),ge(oe),q.blending===ns&&q.transparent===!1?ve(Mi):ve(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),o.setFunc(q.depthFunc),o.setTest(q.depthTest),o.setMask(q.depthWrite),s.setMask(q.colorWrite);let qe=q.stencilWrite;a.setTest(qe),qe&&(a.setMask(q.stencilWriteMask),a.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),a.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),be(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?re(r.SAMPLE_ALPHA_TO_COVERAGE):Se(r.SAMPLE_ALPHA_TO_COVERAGE)}function ge(q){_!==q&&(q?r.frontFace(r.CW):r.frontFace(r.CCW),_=q)}function pe(q){q!==Gp?(re(r.CULL_FACE),q!==b&&(q===Kh?r.cullFace(r.BACK):q===Wp?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Se(r.CULL_FACE),b=q}function Te(q){q!==P&&(V&&r.lineWidth(q),P=q)}function be(q,De,oe){q?(re(r.POLYGON_OFFSET_FILL),(U!==De||N!==oe)&&(r.polygonOffset(De,oe),U=De,N=oe)):Se(r.POLYGON_OFFSET_FILL)}function Le(q){q?re(r.SCISSOR_TEST):Se(r.SCISSOR_TEST)}function dt(q){q===void 0&&(q=r.TEXTURE0+H-1),z!==q&&(r.activeTexture(q),z=q)}function lt(q,De,oe){oe===void 0&&(z===null?oe=r.TEXTURE0+H-1:oe=z);let qe=Y[oe];qe===void 0&&(qe={type:void 0,texture:void 0},Y[oe]=qe),(qe.type!==q||qe.texture!==De)&&(z!==oe&&(r.activeTexture(oe),z=oe),r.bindTexture(q,De||j[q]),qe.type=q,qe.texture=De)}function k(){let q=Y[z];q!==void 0&&q.type!==void 0&&(r.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function D(){try{r.compressedTexImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function te(){try{r.compressedTexImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function le(){try{r.texSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function we(){try{r.texSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ce(){try{r.compressedTexSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Qe(){try{r.compressedTexSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Be(){try{r.texStorage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function je(){try{r.texStorage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ze(){try{r.texImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ce(){try{r.texImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ye(q){ae.equals(q)===!1&&(r.scissor(q.x,q.y,q.z,q.w),ae.copy(q))}function $e(q){Ue.equals(q)===!1&&(r.viewport(q.x,q.y,q.z,q.w),Ue.copy(q))}function et(q,De){let oe=l.get(De);oe===void 0&&(oe=new WeakMap,l.set(De,oe));let qe=oe.get(q);qe===void 0&&(qe=r.getUniformBlockIndex(De,q.name),oe.set(q,qe))}function Oe(q,De){let qe=l.get(De).get(q);c.get(De)!==qe&&(r.uniformBlockBinding(De,qe,q.__bindingPointIndex),c.set(De,qe))}function Je(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},z=null,Y={},u={},f=new WeakMap,d=[],g=null,E=!1,m=null,p=null,M=null,x=null,v=null,S=null,A=null,C=new Ve(0,0,0),I=0,w=!1,_=null,b=null,P=null,U=null,N=null,ae.set(0,0,r.canvas.width,r.canvas.height),Ue.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:re,disable:Se,bindFramebuffer:He,drawBuffers:Ie,useProgram:nt,setBlending:ve,setMaterial:fe,setFlipSided:ge,setCullFace:pe,setLineWidth:Te,setPolygonOffset:be,setScissorTest:Le,activeTexture:dt,bindTexture:lt,unbindTexture:k,compressedTexImage2D:D,compressedTexImage3D:te,texImage2D:Ze,texImage3D:Ce,updateUBOMapping:et,uniformBlockBinding:Oe,texStorage2D:Be,texStorage3D:je,texSubImage2D:le,texSubImage3D:we,compressedTexSubImage2D:ce,compressedTexSubImage3D:Qe,scissor:ye,viewport:$e,reset:Je}}function $M(r,e,t,n,i,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new de,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(k,D){return d?new OffscreenCanvas(k,D):js("canvas")}function E(k,D,te){let le=1,we=lt(k);if((we.width>te||we.height>te)&&(le=te/Math.max(we.width,we.height)),le<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){let ce=Math.floor(le*we.width),Qe=Math.floor(le*we.height);u===void 0&&(u=g(ce,Qe));let Be=D?g(ce,Qe):u;return Be.width=ce,Be.height=Qe,Be.getContext("2d").drawImage(k,0,0,ce,Qe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+we.width+"x"+we.height+") to ("+ce+"x"+Qe+")."),Be}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+we.width+"x"+we.height+")."),k;return k}function m(k){return k.generateMipmaps}function p(k){r.generateMipmap(k)}function M(k){return k.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?r.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(k,D,te,le,we=!1){if(k!==null){if(r[k]!==void 0)return r[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let ce=D;if(D===r.RED&&(te===r.FLOAT&&(ce=r.R32F),te===r.HALF_FLOAT&&(ce=r.R16F),te===r.UNSIGNED_BYTE&&(ce=r.R8)),D===r.RED_INTEGER&&(te===r.UNSIGNED_BYTE&&(ce=r.R8UI),te===r.UNSIGNED_SHORT&&(ce=r.R16UI),te===r.UNSIGNED_INT&&(ce=r.R32UI),te===r.BYTE&&(ce=r.R8I),te===r.SHORT&&(ce=r.R16I),te===r.INT&&(ce=r.R32I)),D===r.RG&&(te===r.FLOAT&&(ce=r.RG32F),te===r.HALF_FLOAT&&(ce=r.RG16F),te===r.UNSIGNED_BYTE&&(ce=r.RG8)),D===r.RG_INTEGER&&(te===r.UNSIGNED_BYTE&&(ce=r.RG8UI),te===r.UNSIGNED_SHORT&&(ce=r.RG16UI),te===r.UNSIGNED_INT&&(ce=r.RG32UI),te===r.BYTE&&(ce=r.RG8I),te===r.SHORT&&(ce=r.RG16I),te===r.INT&&(ce=r.RG32I)),D===r.RGB_INTEGER&&(te===r.UNSIGNED_BYTE&&(ce=r.RGB8UI),te===r.UNSIGNED_SHORT&&(ce=r.RGB16UI),te===r.UNSIGNED_INT&&(ce=r.RGB32UI),te===r.BYTE&&(ce=r.RGB8I),te===r.SHORT&&(ce=r.RGB16I),te===r.INT&&(ce=r.RGB32I)),D===r.RGBA_INTEGER&&(te===r.UNSIGNED_BYTE&&(ce=r.RGBA8UI),te===r.UNSIGNED_SHORT&&(ce=r.RGBA16UI),te===r.UNSIGNED_INT&&(ce=r.RGBA32UI),te===r.BYTE&&(ce=r.RGBA8I),te===r.SHORT&&(ce=r.RGBA16I),te===r.INT&&(ce=r.RGBA32I)),D===r.RGB&&(te===r.UNSIGNED_INT_5_9_9_9_REV&&(ce=r.RGB9_E5),te===r.UNSIGNED_INT_10F_11F_11F_REV&&(ce=r.R11F_G11F_B10F)),D===r.RGBA){let Qe=we?na:Tt.getTransfer(le);te===r.FLOAT&&(ce=r.RGBA32F),te===r.HALF_FLOAT&&(ce=r.RGBA16F),te===r.UNSIGNED_BYTE&&(ce=Qe===Ft?r.SRGB8_ALPHA8:r.RGBA8),te===r.UNSIGNED_SHORT_4_4_4_4&&(ce=r.RGBA4),te===r.UNSIGNED_SHORT_5_5_5_1&&(ce=r.RGB5_A1)}return(ce===r.R16F||ce===r.R32F||ce===r.RG16F||ce===r.RG32F||ce===r.RGBA16F||ce===r.RGBA32F)&&e.get("EXT_color_buffer_float"),ce}function v(k,D){let te;return k?D===null||D===dr||D===ho?te=r.DEPTH24_STENCIL8:D===cn?te=r.DEPTH32F_STENCIL8:D===uo&&(te=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):D===null||D===dr||D===ho?te=r.DEPTH_COMPONENT24:D===cn?te=r.DEPTH_COMPONENT32F:D===uo&&(te=r.DEPTH_COMPONENT16),te}function S(k,D){return m(k)===!0||k.isFramebufferTexture&&k.minFilter!==gn&&k.minFilter!==Vt?Math.log2(Math.max(D.width,D.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?D.mipmaps.length:1}function A(k){let D=k.target;D.removeEventListener("dispose",A),I(D),D.isVideoTexture&&h.delete(D)}function C(k){let D=k.target;D.removeEventListener("dispose",C),_(D)}function I(k){let D=n.get(k);if(D.__webglInit===void 0)return;let te=k.source,le=f.get(te);if(le){let we=le[D.__cacheKey];we.usedTimes--,we.usedTimes===0&&w(k),Object.keys(le).length===0&&f.delete(te)}n.remove(k)}function w(k){let D=n.get(k);r.deleteTexture(D.__webglTexture);let te=k.source,le=f.get(te);delete le[D.__cacheKey],o.memory.textures--}function _(k){let D=n.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),n.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(D.__webglFramebuffer[le]))for(let we=0;we<D.__webglFramebuffer[le].length;we++)r.deleteFramebuffer(D.__webglFramebuffer[le][we]);else r.deleteFramebuffer(D.__webglFramebuffer[le]);D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer[le])}else{if(Array.isArray(D.__webglFramebuffer))for(let le=0;le<D.__webglFramebuffer.length;le++)r.deleteFramebuffer(D.__webglFramebuffer[le]);else r.deleteFramebuffer(D.__webglFramebuffer);if(D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer),D.__webglMultisampledFramebuffer&&r.deleteFramebuffer(D.__webglMultisampledFramebuffer),D.__webglColorRenderbuffer)for(let le=0;le<D.__webglColorRenderbuffer.length;le++)D.__webglColorRenderbuffer[le]&&r.deleteRenderbuffer(D.__webglColorRenderbuffer[le]);D.__webglDepthRenderbuffer&&r.deleteRenderbuffer(D.__webglDepthRenderbuffer)}let te=k.textures;for(let le=0,we=te.length;le<we;le++){let ce=n.get(te[le]);ce.__webglTexture&&(r.deleteTexture(ce.__webglTexture),o.memory.textures--),n.remove(te[le])}n.remove(k)}let b=0;function P(){b=0}function U(){let k=b;return k>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+i.maxTextures),b+=1,k}function N(k){let D=[];return D.push(k.wrapS),D.push(k.wrapT),D.push(k.wrapR||0),D.push(k.magFilter),D.push(k.minFilter),D.push(k.anisotropy),D.push(k.internalFormat),D.push(k.format),D.push(k.type),D.push(k.generateMipmaps),D.push(k.premultiplyAlpha),D.push(k.flipY),D.push(k.unpackAlignment),D.push(k.colorSpace),D.join()}function H(k,D){let te=n.get(k);if(k.isVideoTexture&&Le(k),k.isRenderTargetTexture===!1&&k.isExternalTexture!==!0&&k.version>0&&te.__version!==k.version){let le=k.image;if(le===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(te,k,D);return}}else k.isExternalTexture&&(te.__webglTexture=k.sourceTexture?k.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,te.__webglTexture,r.TEXTURE0+D)}function V(k,D){let te=n.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&te.__version!==k.version){j(te,k,D);return}t.bindTexture(r.TEXTURE_2D_ARRAY,te.__webglTexture,r.TEXTURE0+D)}function Z(k,D){let te=n.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&te.__version!==k.version){j(te,k,D);return}t.bindTexture(r.TEXTURE_3D,te.__webglTexture,r.TEXTURE0+D)}function X(k,D){let te=n.get(k);if(k.version>0&&te.__version!==k.version){re(te,k,D);return}t.bindTexture(r.TEXTURE_CUBE_MAP,te.__webglTexture,r.TEXTURE0+D)}let z={[hn]:r.REPEAT,[ri]:r.CLAMP_TO_EDGE,[Ar]:r.MIRRORED_REPEAT},Y={[gn]:r.NEAREST,[Rl]:r.NEAREST_MIPMAP_NEAREST,[xs]:r.NEAREST_MIPMAP_LINEAR,[Vt]:r.LINEAR,[lo]:r.LINEAR_MIPMAP_NEAREST,[ci]:r.LINEAR_MIPMAP_LINEAR},J={[ym]:r.NEVER,[Tm]:r.ALWAYS,[_m]:r.LESS,[hf]:r.LEQUAL,[Em]:r.EQUAL,[wm]:r.GEQUAL,[Mm]:r.GREATER,[Sm]:r.NOTEQUAL};function ne(k,D){if(D.type===cn&&e.has("OES_texture_float_linear")===!1&&(D.magFilter===Vt||D.magFilter===lo||D.magFilter===xs||D.magFilter===ci||D.minFilter===Vt||D.minFilter===lo||D.minFilter===xs||D.minFilter===ci)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(k,r.TEXTURE_WRAP_S,z[D.wrapS]),r.texParameteri(k,r.TEXTURE_WRAP_T,z[D.wrapT]),(k===r.TEXTURE_3D||k===r.TEXTURE_2D_ARRAY)&&r.texParameteri(k,r.TEXTURE_WRAP_R,z[D.wrapR]),r.texParameteri(k,r.TEXTURE_MAG_FILTER,Y[D.magFilter]),r.texParameteri(k,r.TEXTURE_MIN_FILTER,Y[D.minFilter]),D.compareFunction&&(r.texParameteri(k,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(k,r.TEXTURE_COMPARE_FUNC,J[D.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(D.magFilter===gn||D.minFilter!==xs&&D.minFilter!==ci||D.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(D.anisotropy>1||n.get(D).__currentAnisotropy){let te=e.get("EXT_texture_filter_anisotropic");r.texParameterf(k,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(D.anisotropy,i.getMaxAnisotropy())),n.get(D).__currentAnisotropy=D.anisotropy}}}function ae(k,D){let te=!1;k.__webglInit===void 0&&(k.__webglInit=!0,D.addEventListener("dispose",A));let le=D.source,we=f.get(le);we===void 0&&(we={},f.set(le,we));let ce=N(D);if(ce!==k.__cacheKey){we[ce]===void 0&&(we[ce]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,te=!0),we[ce].usedTimes++;let Qe=we[k.__cacheKey];Qe!==void 0&&(we[k.__cacheKey].usedTimes--,Qe.usedTimes===0&&w(D)),k.__cacheKey=ce,k.__webglTexture=we[ce].texture}return te}function Ue(k,D,te){return Math.floor(Math.floor(k/te)/D)}function xe(k,D,te,le){let ce=k.updateRanges;if(ce.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,D.width,D.height,te,le,D.data);else{ce.sort((Ce,ye)=>Ce.start-ye.start);let Qe=0;for(let Ce=1;Ce<ce.length;Ce++){let ye=ce[Qe],$e=ce[Ce],et=ye.start+ye.count,Oe=Ue($e.start,D.width,4),Je=Ue(ye.start,D.width,4);$e.start<=et+1&&Oe===Je&&Ue($e.start+$e.count-1,D.width,4)===Oe?ye.count=Math.max(ye.count,$e.start+$e.count-ye.start):(++Qe,ce[Qe]=$e)}ce.length=Qe+1;let Be=r.getParameter(r.UNPACK_ROW_LENGTH),je=r.getParameter(r.UNPACK_SKIP_PIXELS),Ze=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,D.width);for(let Ce=0,ye=ce.length;Ce<ye;Ce++){let $e=ce[Ce],et=Math.floor($e.start/4),Oe=Math.ceil($e.count/4),Je=et%D.width,q=Math.floor(et/D.width),De=Oe,oe=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,Je),r.pixelStorei(r.UNPACK_SKIP_ROWS,q),t.texSubImage2D(r.TEXTURE_2D,0,Je,q,De,oe,te,le,D.data)}k.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,Be),r.pixelStorei(r.UNPACK_SKIP_PIXELS,je),r.pixelStorei(r.UNPACK_SKIP_ROWS,Ze)}}function j(k,D,te){let le=r.TEXTURE_2D;(D.isDataArrayTexture||D.isCompressedArrayTexture)&&(le=r.TEXTURE_2D_ARRAY),D.isData3DTexture&&(le=r.TEXTURE_3D);let we=ae(k,D),ce=D.source;t.bindTexture(le,k.__webglTexture,r.TEXTURE0+te);let Qe=n.get(ce);if(ce.version!==Qe.__version||we===!0){t.activeTexture(r.TEXTURE0+te);let Be=Tt.getPrimaries(Tt.workingColorSpace),je=D.colorSpace===mr?null:Tt.getPrimaries(D.colorSpace),Ze=D.colorSpace===mr||Be===je?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,D.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,D.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ze);let Ce=E(D.image,!1,i.maxTextureSize);Ce=dt(D,Ce);let ye=s.convert(D.format,D.colorSpace),$e=s.convert(D.type),et=x(D.internalFormat,ye,$e,D.colorSpace,D.isVideoTexture);ne(le,D);let Oe,Je=D.mipmaps,q=D.isVideoTexture!==!0,De=Qe.__version===void 0||we===!0,oe=ce.dataReady,qe=S(D,Ce);if(D.isDepthTexture)et=v(D.format===fo,D.type),De&&(q?t.texStorage2D(r.TEXTURE_2D,1,et,Ce.width,Ce.height):t.texImage2D(r.TEXTURE_2D,0,et,Ce.width,Ce.height,0,ye,$e,null));else if(D.isDataTexture)if(Je.length>0){q&&De&&t.texStorage2D(r.TEXTURE_2D,qe,et,Je[0].width,Je[0].height);for(let Pe=0,Me=Je.length;Pe<Me;Pe++)Oe=Je[Pe],q?oe&&t.texSubImage2D(r.TEXTURE_2D,Pe,0,0,Oe.width,Oe.height,ye,$e,Oe.data):t.texImage2D(r.TEXTURE_2D,Pe,et,Oe.width,Oe.height,0,ye,$e,Oe.data);D.generateMipmaps=!1}else q?(De&&t.texStorage2D(r.TEXTURE_2D,qe,et,Ce.width,Ce.height),oe&&xe(D,Ce,ye,$e)):t.texImage2D(r.TEXTURE_2D,0,et,Ce.width,Ce.height,0,ye,$e,Ce.data);else if(D.isCompressedTexture)if(D.isCompressedArrayTexture){q&&De&&t.texStorage3D(r.TEXTURE_2D_ARRAY,qe,et,Je[0].width,Je[0].height,Ce.depth);for(let Pe=0,Me=Je.length;Pe<Me;Pe++)if(Oe=Je[Pe],D.format!==ln)if(ye!==null)if(q){if(oe)if(D.layerUpdates.size>0){let it=yf(Oe.width,Oe.height,D.format,D.type);for(let xt of D.layerUpdates){let Pt=Oe.data.subarray(xt*it/Oe.data.BYTES_PER_ELEMENT,(xt+1)*it/Oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Pe,0,0,xt,Oe.width,Oe.height,1,ye,Pt)}D.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Pe,0,0,0,Oe.width,Oe.height,Ce.depth,ye,Oe.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Pe,et,Oe.width,Oe.height,Ce.depth,0,Oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else q?oe&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,Pe,0,0,0,Oe.width,Oe.height,Ce.depth,ye,$e,Oe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,Pe,et,Oe.width,Oe.height,Ce.depth,0,ye,$e,Oe.data)}else{q&&De&&t.texStorage2D(r.TEXTURE_2D,qe,et,Je[0].width,Je[0].height);for(let Pe=0,Me=Je.length;Pe<Me;Pe++)Oe=Je[Pe],D.format!==ln?ye!==null?q?oe&&t.compressedTexSubImage2D(r.TEXTURE_2D,Pe,0,0,Oe.width,Oe.height,ye,Oe.data):t.compressedTexImage2D(r.TEXTURE_2D,Pe,et,Oe.width,Oe.height,0,Oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):q?oe&&t.texSubImage2D(r.TEXTURE_2D,Pe,0,0,Oe.width,Oe.height,ye,$e,Oe.data):t.texImage2D(r.TEXTURE_2D,Pe,et,Oe.width,Oe.height,0,ye,$e,Oe.data)}else if(D.isDataArrayTexture)if(q){if(De&&t.texStorage3D(r.TEXTURE_2D_ARRAY,qe,et,Ce.width,Ce.height,Ce.depth),oe)if(D.layerUpdates.size>0){let Pe=yf(Ce.width,Ce.height,D.format,D.type);for(let Me of D.layerUpdates){let it=Ce.data.subarray(Me*Pe/Ce.data.BYTES_PER_ELEMENT,(Me+1)*Pe/Ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Me,Ce.width,Ce.height,1,ye,$e,it)}D.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Ce.width,Ce.height,Ce.depth,ye,$e,Ce.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,et,Ce.width,Ce.height,Ce.depth,0,ye,$e,Ce.data);else if(D.isData3DTexture)q?(De&&t.texStorage3D(r.TEXTURE_3D,qe,et,Ce.width,Ce.height,Ce.depth),oe&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Ce.width,Ce.height,Ce.depth,ye,$e,Ce.data)):t.texImage3D(r.TEXTURE_3D,0,et,Ce.width,Ce.height,Ce.depth,0,ye,$e,Ce.data);else if(D.isFramebufferTexture){if(De)if(q)t.texStorage2D(r.TEXTURE_2D,qe,et,Ce.width,Ce.height);else{let Pe=Ce.width,Me=Ce.height;for(let it=0;it<qe;it++)t.texImage2D(r.TEXTURE_2D,it,et,Pe,Me,0,ye,$e,null),Pe>>=1,Me>>=1}}else if(Je.length>0){if(q&&De){let Pe=lt(Je[0]);t.texStorage2D(r.TEXTURE_2D,qe,et,Pe.width,Pe.height)}for(let Pe=0,Me=Je.length;Pe<Me;Pe++)Oe=Je[Pe],q?oe&&t.texSubImage2D(r.TEXTURE_2D,Pe,0,0,ye,$e,Oe):t.texImage2D(r.TEXTURE_2D,Pe,et,ye,$e,Oe);D.generateMipmaps=!1}else if(q){if(De){let Pe=lt(Ce);t.texStorage2D(r.TEXTURE_2D,qe,et,Pe.width,Pe.height)}oe&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ye,$e,Ce)}else t.texImage2D(r.TEXTURE_2D,0,et,ye,$e,Ce);m(D)&&p(le),Qe.__version=ce.version,D.onUpdate&&D.onUpdate(D)}k.__version=D.version}function re(k,D,te){if(D.image.length!==6)return;let le=ae(k,D),we=D.source;t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+te);let ce=n.get(we);if(we.version!==ce.__version||le===!0){t.activeTexture(r.TEXTURE0+te);let Qe=Tt.getPrimaries(Tt.workingColorSpace),Be=D.colorSpace===mr?null:Tt.getPrimaries(D.colorSpace),je=D.colorSpace===mr||Qe===Be?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,D.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,D.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let Ze=D.isCompressedTexture||D.image[0].isCompressedTexture,Ce=D.image[0]&&D.image[0].isDataTexture,ye=[];for(let Me=0;Me<6;Me++)!Ze&&!Ce?ye[Me]=E(D.image[Me],!0,i.maxCubemapSize):ye[Me]=Ce?D.image[Me].image:D.image[Me],ye[Me]=dt(D,ye[Me]);let $e=ye[0],et=s.convert(D.format,D.colorSpace),Oe=s.convert(D.type),Je=x(D.internalFormat,et,Oe,D.colorSpace),q=D.isVideoTexture!==!0,De=ce.__version===void 0||le===!0,oe=we.dataReady,qe=S(D,$e);ne(r.TEXTURE_CUBE_MAP,D);let Pe;if(Ze){q&&De&&t.texStorage2D(r.TEXTURE_CUBE_MAP,qe,Je,$e.width,$e.height);for(let Me=0;Me<6;Me++){Pe=ye[Me].mipmaps;for(let it=0;it<Pe.length;it++){let xt=Pe[it];D.format!==ln?et!==null?q?oe&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it,0,0,xt.width,xt.height,et,xt.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it,Je,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):q?oe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it,0,0,xt.width,xt.height,et,Oe,xt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it,Je,xt.width,xt.height,0,et,Oe,xt.data)}}}else{if(Pe=D.mipmaps,q&&De){Pe.length>0&&qe++;let Me=lt(ye[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,qe,Je,Me.width,Me.height)}for(let Me=0;Me<6;Me++)if(Ce){q?oe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,0,0,ye[Me].width,ye[Me].height,et,Oe,ye[Me].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,Je,ye[Me].width,ye[Me].height,0,et,Oe,ye[Me].data);for(let it=0;it<Pe.length;it++){let Pt=Pe[it].image[Me].image;q?oe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it+1,0,0,Pt.width,Pt.height,et,Oe,Pt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it+1,Je,Pt.width,Pt.height,0,et,Oe,Pt.data)}}else{q?oe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,0,0,et,Oe,ye[Me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,Je,et,Oe,ye[Me]);for(let it=0;it<Pe.length;it++){let xt=Pe[it];q?oe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it+1,0,0,et,Oe,xt.image[Me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Me,it+1,Je,et,Oe,xt.image[Me])}}}m(D)&&p(r.TEXTURE_CUBE_MAP),ce.__version=we.version,D.onUpdate&&D.onUpdate(D)}k.__version=D.version}function Se(k,D,te,le,we,ce){let Qe=s.convert(te.format,te.colorSpace),Be=s.convert(te.type),je=x(te.internalFormat,Qe,Be,te.colorSpace),Ze=n.get(D),Ce=n.get(te);if(Ce.__renderTarget=D,!Ze.__hasExternalTextures){let ye=Math.max(1,D.width>>ce),$e=Math.max(1,D.height>>ce);we===r.TEXTURE_3D||we===r.TEXTURE_2D_ARRAY?t.texImage3D(we,ce,je,ye,$e,D.depth,0,Qe,Be,null):t.texImage2D(we,ce,je,ye,$e,0,Qe,Be,null)}t.bindFramebuffer(r.FRAMEBUFFER,k),be(D)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,le,we,Ce.__webglTexture,0,Te(D)):(we===r.TEXTURE_2D||we>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&we<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,le,we,Ce.__webglTexture,ce),t.bindFramebuffer(r.FRAMEBUFFER,null)}function He(k,D,te){if(r.bindRenderbuffer(r.RENDERBUFFER,k),D.depthBuffer){let le=D.depthTexture,we=le&&le.isDepthTexture?le.type:null,ce=v(D.stencilBuffer,we),Qe=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Be=Te(D);be(D)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Be,ce,D.width,D.height):te?r.renderbufferStorageMultisample(r.RENDERBUFFER,Be,ce,D.width,D.height):r.renderbufferStorage(r.RENDERBUFFER,ce,D.width,D.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Qe,r.RENDERBUFFER,k)}else{let le=D.textures;for(let we=0;we<le.length;we++){let ce=le[we],Qe=s.convert(ce.format,ce.colorSpace),Be=s.convert(ce.type),je=x(ce.internalFormat,Qe,Be,ce.colorSpace),Ze=Te(D);te&&be(D)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ze,je,D.width,D.height):be(D)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ze,je,D.width,D.height):r.renderbufferStorage(r.RENDERBUFFER,je,D.width,D.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ie(k,D){if(D&&D.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,k),!(D.depthTexture&&D.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let le=n.get(D.depthTexture);le.__renderTarget=D,(!le.__webglTexture||D.depthTexture.image.width!==D.width||D.depthTexture.image.height!==D.height)&&(D.depthTexture.image.width=D.width,D.depthTexture.image.height=D.height,D.depthTexture.needsUpdate=!0),H(D.depthTexture,0);let we=le.__webglTexture,ce=Te(D);if(D.depthTexture.format===Zs)be(D)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,we,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,we,0);else if(D.depthTexture.format===fo)be(D)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,we,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,we,0);else throw new Error("Unknown depthTexture format")}function nt(k){let D=n.get(k),te=k.isWebGLCubeRenderTarget===!0;if(D.__boundDepthTexture!==k.depthTexture){let le=k.depthTexture;if(D.__depthDisposeCallback&&D.__depthDisposeCallback(),le){let we=()=>{delete D.__boundDepthTexture,delete D.__depthDisposeCallback,le.removeEventListener("dispose",we)};le.addEventListener("dispose",we),D.__depthDisposeCallback=we}D.__boundDepthTexture=le}if(k.depthTexture&&!D.__autoAllocateDepthBuffer){if(te)throw new Error("target.depthTexture not supported in Cube render targets");let le=k.texture.mipmaps;le&&le.length>0?Ie(D.__webglFramebuffer[0],k):Ie(D.__webglFramebuffer,k)}else if(te){D.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(r.FRAMEBUFFER,D.__webglFramebuffer[le]),D.__webglDepthbuffer[le]===void 0)D.__webglDepthbuffer[le]=r.createRenderbuffer(),He(D.__webglDepthbuffer[le],k,!1);else{let we=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=D.__webglDepthbuffer[le];r.bindRenderbuffer(r.RENDERBUFFER,ce),r.framebufferRenderbuffer(r.FRAMEBUFFER,we,r.RENDERBUFFER,ce)}}else{let le=k.texture.mipmaps;if(le&&le.length>0?t.bindFramebuffer(r.FRAMEBUFFER,D.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,D.__webglFramebuffer),D.__webglDepthbuffer===void 0)D.__webglDepthbuffer=r.createRenderbuffer(),He(D.__webglDepthbuffer,k,!1);else{let we=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=D.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ce),r.framebufferRenderbuffer(r.FRAMEBUFFER,we,r.RENDERBUFFER,ce)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function rt(k,D,te){let le=n.get(k);D!==void 0&&Se(le.__webglFramebuffer,k,k.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),te!==void 0&&nt(k)}function W(k){let D=k.texture,te=n.get(k),le=n.get(D);k.addEventListener("dispose",C);let we=k.textures,ce=k.isWebGLCubeRenderTarget===!0,Qe=we.length>1;if(Qe||(le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture()),le.__version=D.version,o.memory.textures++),ce){te.__webglFramebuffer=[];for(let Be=0;Be<6;Be++)if(D.mipmaps&&D.mipmaps.length>0){te.__webglFramebuffer[Be]=[];for(let je=0;je<D.mipmaps.length;je++)te.__webglFramebuffer[Be][je]=r.createFramebuffer()}else te.__webglFramebuffer[Be]=r.createFramebuffer()}else{if(D.mipmaps&&D.mipmaps.length>0){te.__webglFramebuffer=[];for(let Be=0;Be<D.mipmaps.length;Be++)te.__webglFramebuffer[Be]=r.createFramebuffer()}else te.__webglFramebuffer=r.createFramebuffer();if(Qe)for(let Be=0,je=we.length;Be<je;Be++){let Ze=n.get(we[Be]);Ze.__webglTexture===void 0&&(Ze.__webglTexture=r.createTexture(),o.memory.textures++)}if(k.samples>0&&be(k)===!1){te.__webglMultisampledFramebuffer=r.createFramebuffer(),te.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,te.__webglMultisampledFramebuffer);for(let Be=0;Be<we.length;Be++){let je=we[Be];te.__webglColorRenderbuffer[Be]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,te.__webglColorRenderbuffer[Be]);let Ze=s.convert(je.format,je.colorSpace),Ce=s.convert(je.type),ye=x(je.internalFormat,Ze,Ce,je.colorSpace,k.isXRRenderTarget===!0),$e=Te(k);r.renderbufferStorageMultisample(r.RENDERBUFFER,$e,ye,k.width,k.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Be,r.RENDERBUFFER,te.__webglColorRenderbuffer[Be])}r.bindRenderbuffer(r.RENDERBUFFER,null),k.depthBuffer&&(te.__webglDepthRenderbuffer=r.createRenderbuffer(),He(te.__webglDepthRenderbuffer,k,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ce){t.bindTexture(r.TEXTURE_CUBE_MAP,le.__webglTexture),ne(r.TEXTURE_CUBE_MAP,D);for(let Be=0;Be<6;Be++)if(D.mipmaps&&D.mipmaps.length>0)for(let je=0;je<D.mipmaps.length;je++)Se(te.__webglFramebuffer[Be][je],k,D,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Be,je);else Se(te.__webglFramebuffer[Be],k,D,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Be,0);m(D)&&p(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Qe){for(let Be=0,je=we.length;Be<je;Be++){let Ze=we[Be],Ce=n.get(Ze),ye=r.TEXTURE_2D;(k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(ye=k.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ye,Ce.__webglTexture),ne(ye,Ze),Se(te.__webglFramebuffer,k,Ze,r.COLOR_ATTACHMENT0+Be,ye,0),m(Ze)&&p(ye)}t.unbindTexture()}else{let Be=r.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(Be=k.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Be,le.__webglTexture),ne(Be,D),D.mipmaps&&D.mipmaps.length>0)for(let je=0;je<D.mipmaps.length;je++)Se(te.__webglFramebuffer[je],k,D,r.COLOR_ATTACHMENT0,Be,je);else Se(te.__webglFramebuffer,k,D,r.COLOR_ATTACHMENT0,Be,0);m(D)&&p(Be),t.unbindTexture()}k.depthBuffer&&nt(k)}function ve(k){let D=k.textures;for(let te=0,le=D.length;te<le;te++){let we=D[te];if(m(we)){let ce=M(k),Qe=n.get(we).__webglTexture;t.bindTexture(ce,Qe),p(ce),t.unbindTexture()}}}let fe=[],ge=[];function pe(k){if(k.samples>0){if(be(k)===!1){let D=k.textures,te=k.width,le=k.height,we=r.COLOR_BUFFER_BIT,ce=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Qe=n.get(k),Be=D.length>1;if(Be)for(let Ze=0;Ze<D.length;Ze++)t.bindFramebuffer(r.FRAMEBUFFER,Qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ze,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ze,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Qe.__webglMultisampledFramebuffer);let je=k.texture.mipmaps;je&&je.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer);for(let Ze=0;Ze<D.length;Ze++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(we|=r.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(we|=r.STENCIL_BUFFER_BIT)),Be){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Qe.__webglColorRenderbuffer[Ze]);let Ce=n.get(D[Ze]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ce,0)}r.blitFramebuffer(0,0,te,le,0,0,te,le,we,r.NEAREST),c===!0&&(fe.length=0,ge.length=0,fe.push(r.COLOR_ATTACHMENT0+Ze),k.depthBuffer&&k.resolveDepthBuffer===!1&&(fe.push(ce),ge.push(ce),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,ge)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,fe))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Be)for(let Ze=0;Ze<D.length;Ze++){t.bindFramebuffer(r.FRAMEBUFFER,Qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ze,r.RENDERBUFFER,Qe.__webglColorRenderbuffer[Ze]);let Ce=n.get(D[Ze]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ze,r.TEXTURE_2D,Ce,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Qe.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&c){let D=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[D])}}}function Te(k){return Math.min(i.maxSamples,k.samples)}function be(k){let D=n.get(k);return k.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&D.__useRenderToTexture!==!1}function Le(k){let D=o.render.frame;h.get(k)!==D&&(h.set(k,D),k.update())}function dt(k,D){let te=k.colorSpace,le=k.format,we=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||te!==Xt&&te!==mr&&(Tt.getTransfer(te)===Ft?(le!==ln||we!==Si)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",te)),D}function lt(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(l.width=k.naturalWidth||k.width,l.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(l.width=k.displayWidth,l.height=k.displayHeight):(l.width=k.width,l.height=k.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=P,this.setTexture2D=H,this.setTexture2DArray=V,this.setTexture3D=Z,this.setTextureCube=X,this.rebindTextures=rt,this.setupRenderTarget=W,this.updateRenderTargetMipmap=ve,this.updateMultisampleRenderTarget=pe,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=be}function e1(r,e){function t(n,i=mr){let s,o=Tt.getTransfer(i);if(n===Si)return r.UNSIGNED_BYTE;if(n===Il)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Pl)return r.UNSIGNED_SHORT_5_5_5_1;if(n===sf)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===of)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===nf)return r.BYTE;if(n===rf)return r.SHORT;if(n===uo)return r.UNSIGNED_SHORT;if(n===Cl)return r.INT;if(n===dr)return r.UNSIGNED_INT;if(n===cn)return r.FLOAT;if(n===qt)return r.HALF_FLOAT;if(n===af)return r.ALPHA;if(n===cf)return r.RGB;if(n===ln)return r.RGBA;if(n===Zs)return r.DEPTH_COMPONENT;if(n===fo)return r.DEPTH_STENCIL;if(n===wi)return r.RED;if(n===Da)return r.RED_INTEGER;if(n===pr)return r.RG;if(n===Ll)return r.RG_INTEGER;if(n===Dl)return r.RGBA_INTEGER;if(n===Na||n===Ua||n===Ba||n===Ha)if(o===Ft)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Na)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ua)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ba)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ha)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Na)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ua)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ba)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ha)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Nl||n===Ul||n===Bl||n===Hl)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Nl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ul)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Bl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Hl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fl||n===Ol||n===zl)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Fl||n===Ol)return o===Ft?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===zl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kl||n===Vl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===Zl||n===jl||n===Kl||n===Jl||n===Ql||n===$l||n===eu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===kl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Vl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Gl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ql)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Yl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Zl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Kl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ql)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===$l)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===eu)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===tu||n===nu||n===iu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===tu)return o===Ft?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===iu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ru||n===su||n===ou||n===au)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===ru)return s.COMPRESSED_RED_RGTC1_EXT;if(n===su)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ou)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===au)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ho?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}function r1(r,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,mf(r)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,M,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),E(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,M,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Mn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Mn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=e.get(p),x=M.envMap,v=M.envMapRotation;x&&(m.envMap.value=x,_s.copy(v),_s.x*=-1,_s.y*=-1,_s.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(_s.y*=-1,_s.z*=-1),m.envMapRotation.value.setFromMatrix4(i1.makeRotationFromEuler(_s)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,M,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Mn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function E(m,p){let M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function s1(r,e,t,n){let i={},s={},o=[],a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,x){let v=x.program;n.uniformBlockBinding(M,v)}function l(M,x){let v=i[M.id];v===void 0&&(g(M),v=h(M),i[M.id]=v,M.addEventListener("dispose",m));let S=x.program;n.updateUBOMapping(M,S);let A=e.render.frame;s[M.id]!==A&&(f(M),s[M.id]=A)}function h(M){let x=u();M.__bindingPointIndex=x;let v=r.createBuffer(),S=M.__size,A=M.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,S,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,x,v),v}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){let x=i[M.id],v=M.uniforms,S=M.__cache;r.bindBuffer(r.UNIFORM_BUFFER,x);for(let A=0,C=v.length;A<C;A++){let I=Array.isArray(v[A])?v[A]:[v[A]];for(let w=0,_=I.length;w<_;w++){let b=I[w];if(d(b,A,w,S)===!0){let P=b.__offset,U=Array.isArray(b.value)?b.value:[b.value],N=0;for(let H=0;H<U.length;H++){let V=U[H],Z=E(V);typeof V=="number"||typeof V=="boolean"?(b.__data[0]=V,r.bufferSubData(r.UNIFORM_BUFFER,P+N,b.__data)):V.isMatrix3?(b.__data[0]=V.elements[0],b.__data[1]=V.elements[1],b.__data[2]=V.elements[2],b.__data[3]=0,b.__data[4]=V.elements[3],b.__data[5]=V.elements[4],b.__data[6]=V.elements[5],b.__data[7]=0,b.__data[8]=V.elements[6],b.__data[9]=V.elements[7],b.__data[10]=V.elements[8],b.__data[11]=0):(V.toArray(b.__data,N),N+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,P,b.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function d(M,x,v,S){let A=M.value,C=x+"_"+v;if(S[C]===void 0)return typeof A=="number"||typeof A=="boolean"?S[C]=A:S[C]=A.clone(),!0;{let I=S[C];if(typeof A=="number"||typeof A=="boolean"){if(I!==A)return S[C]=A,!0}else if(I.equals(A)===!1)return I.copy(A),!0}return!1}function g(M){let x=M.uniforms,v=0,S=16;for(let C=0,I=x.length;C<I;C++){let w=Array.isArray(x[C])?x[C]:[x[C]];for(let _=0,b=w.length;_<b;_++){let P=w[_],U=Array.isArray(P.value)?P.value:[P.value];for(let N=0,H=U.length;N<H;N++){let V=U[N],Z=E(V),X=v%S,z=X%Z.boundary,Y=X+z;v+=z,Y!==0&&S-Y<Z.storage&&(v+=S-Y),P.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=v,v+=Z.storage}}}let A=v%S;return A>0&&(v+=S-A),M.__size=v,M.__cache={},this}function E(M){let x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){let x=M.target;x.removeEventListener("dispose",m);let v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),r.deleteBuffer(i[x.id]),delete i[x.id],delete s[x.id]}function p(){for(let M in i)r.deleteBuffer(i[M]);o=[],i={},s={}}return{bind:c,update:l,dispose:p}}var Dv,Nv,Uv,Bv,Hv,Fv,Ov,zv,kv,Vv,Gv,Wv,Xv,qv,Yv,Zv,jv,Kv,Jv,Qv,$v,ey,ty,ny,iy,ry,sy,oy,ay,cy,ly,uy,hy,fy,dy,py,my,gy,xy,vy,yy,_y,Ey,My,Sy,wy,Ty,by,Ay,Ry,Cy,Iy,Py,Ly,Dy,Ny,Uy,By,Hy,Fy,Oy,zy,ky,Vy,Gy,Wy,Xy,qy,Yy,Zy,jy,Ky,Jy,Qy,$y,e_,t_,n_,i_,r_,s_,o_,a_,c_,l_,u_,h_,f_,d_,p_,m_,g_,x_,v_,y_,__,E_,M_,S_,w_,T_,b_,A_,R_,C_,I_,P_,L_,D_,N_,U_,B_,H_,F_,O_,z_,k_,V_,G_,W_,X_,q_,Y_,Z_,j_,K_,J_,Q_,$_,eE,tE,nE,iE,rE,sE,oE,aE,cE,lE,uE,hE,Et,Ge,ki,uu,ys,fE,go,Um,Ms,Ef,Bm,Mf,Sf,wf,Tf,Es,mo,Hm,yE,vo,sg,km,og,ag,cg,Vm,Gm,Wm,Xm,qm,Af,Rf,Cf,bf,xo,gM,xM,jm,fu,bM,AM,CM,HM,Pf,Lf,WM,ZM,jM,JM,t1,n1,Df,Nf,_s,i1,du,at=cc(()=>{_f();_f();Dv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Nv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Uv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Bv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Fv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ov=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,zv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Vv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,qv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Yv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Zv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,jv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Kv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Qv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$v=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ey=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ty=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ny=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,iy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ry=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,sy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,oy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ay=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ly="gl_FragColor = linearToOutputTexel( gl_FragColor );",uy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,hy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,fy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,dy=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,py=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,my=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,gy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_y=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ey=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,My=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Sy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ty=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,by=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ay=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ry=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Iy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Py=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ly=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Dy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ny=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Uy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,By=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Oy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ky=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Vy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Yy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,jy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ky=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Jy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Qy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$y=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,t_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,n_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,i_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,r_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,s_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,o_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,a_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,c_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,l_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,u_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,h_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,f_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,d_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,p_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,m_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,g_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,x_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,v_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,y_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,__=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,E_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,M_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,S_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,w_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,T_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,b_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,A_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,R_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,C_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,I_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,P_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,L_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,D_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,U_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,H_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,O_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,z_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,k_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,V_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,G_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,X_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,q_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Y_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,j_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,J_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Q_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,eE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,iE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,aE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,uE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Et={alphahash_fragment:Dv,alphahash_pars_fragment:Nv,alphamap_fragment:Uv,alphamap_pars_fragment:Bv,alphatest_fragment:Hv,alphatest_pars_fragment:Fv,aomap_fragment:Ov,aomap_pars_fragment:zv,batching_pars_vertex:kv,batching_vertex:Vv,begin_vertex:Gv,beginnormal_vertex:Wv,bsdfs:Xv,iridescence_fragment:qv,bumpmap_pars_fragment:Yv,clipping_planes_fragment:Zv,clipping_planes_pars_fragment:jv,clipping_planes_pars_vertex:Kv,clipping_planes_vertex:Jv,color_fragment:Qv,color_pars_fragment:$v,color_pars_vertex:ey,color_vertex:ty,common:ny,cube_uv_reflection_fragment:iy,defaultnormal_vertex:ry,displacementmap_pars_vertex:sy,displacementmap_vertex:oy,emissivemap_fragment:ay,emissivemap_pars_fragment:cy,colorspace_fragment:ly,colorspace_pars_fragment:uy,envmap_fragment:hy,envmap_common_pars_fragment:fy,envmap_pars_fragment:dy,envmap_pars_vertex:py,envmap_physical_pars_fragment:Ty,envmap_vertex:my,fog_vertex:gy,fog_pars_vertex:xy,fog_fragment:vy,fog_pars_fragment:yy,gradientmap_pars_fragment:_y,lightmap_pars_fragment:Ey,lights_lambert_fragment:My,lights_lambert_pars_fragment:Sy,lights_pars_begin:wy,lights_toon_fragment:by,lights_toon_pars_fragment:Ay,lights_phong_fragment:Ry,lights_phong_pars_fragment:Cy,lights_physical_fragment:Iy,lights_physical_pars_fragment:Py,lights_fragment_begin:Ly,lights_fragment_maps:Dy,lights_fragment_end:Ny,logdepthbuf_fragment:Uy,logdepthbuf_pars_fragment:By,logdepthbuf_pars_vertex:Hy,logdepthbuf_vertex:Fy,map_fragment:Oy,map_pars_fragment:zy,map_particle_fragment:ky,map_particle_pars_fragment:Vy,metalnessmap_fragment:Gy,metalnessmap_pars_fragment:Wy,morphinstance_vertex:Xy,morphcolor_vertex:qy,morphnormal_vertex:Yy,morphtarget_pars_vertex:Zy,morphtarget_vertex:jy,normal_fragment_begin:Ky,normal_fragment_maps:Jy,normal_pars_fragment:Qy,normal_pars_vertex:$y,normal_vertex:e_,normalmap_pars_fragment:t_,clearcoat_normal_fragment_begin:n_,clearcoat_normal_fragment_maps:i_,clearcoat_pars_fragment:r_,iridescence_pars_fragment:s_,opaque_fragment:o_,packing:a_,premultiplied_alpha_fragment:c_,project_vertex:l_,dithering_fragment:u_,dithering_pars_fragment:h_,roughnessmap_fragment:f_,roughnessmap_pars_fragment:d_,shadowmap_pars_fragment:p_,shadowmap_pars_vertex:m_,shadowmap_vertex:g_,shadowmask_pars_fragment:x_,skinbase_vertex:v_,skinning_pars_vertex:y_,skinning_vertex:__,skinnormal_vertex:E_,specularmap_fragment:M_,specularmap_pars_fragment:S_,tonemapping_fragment:w_,tonemapping_pars_fragment:T_,transmission_fragment:b_,transmission_pars_fragment:A_,uv_pars_fragment:R_,uv_pars_vertex:C_,uv_vertex:I_,worldpos_vertex:P_,background_vert:L_,background_frag:D_,backgroundCube_vert:N_,backgroundCube_frag:U_,cube_vert:B_,cube_frag:H_,depth_vert:F_,depth_frag:O_,distanceRGBA_vert:z_,distanceRGBA_frag:k_,equirect_vert:V_,equirect_frag:G_,linedashed_vert:W_,linedashed_frag:X_,meshbasic_vert:q_,meshbasic_frag:Y_,meshlambert_vert:Z_,meshlambert_frag:j_,meshmatcap_vert:K_,meshmatcap_frag:J_,meshnormal_vert:Q_,meshnormal_frag:$_,meshphong_vert:eE,meshphong_frag:tE,meshphysical_vert:nE,meshphysical_frag:iE,meshtoon_vert:rE,meshtoon_frag:sE,points_vert:oE,points_frag:aE,shadow_vert:cE,shadow_frag:lE,sprite_vert:uE,sprite_frag:hE},Ge={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new yt}},envmap:{envMap:{value:null},envMapRotation:{value:new yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new yt},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0},uvTransform:{value:new yt}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}}},ki={basic:{uniforms:Hn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.fog]),vertexShader:Et.meshbasic_vert,fragmentShader:Et.meshbasic_frag},lambert:{uniforms:Hn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new Ve(0)}}]),vertexShader:Et.meshlambert_vert,fragmentShader:Et.meshlambert_frag},phong:{uniforms:Hn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30}}]),vertexShader:Et.meshphong_vert,fragmentShader:Et.meshphong_frag},standard:{uniforms:Hn([Ge.common,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.roughnessmap,Ge.metalnessmap,Ge.fog,Ge.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Et.meshphysical_vert,fragmentShader:Et.meshphysical_frag},toon:{uniforms:Hn([Ge.common,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.gradientmap,Ge.fog,Ge.lights,{emissive:{value:new Ve(0)}}]),vertexShader:Et.meshtoon_vert,fragmentShader:Et.meshtoon_frag},matcap:{uniforms:Hn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,{matcap:{value:null}}]),vertexShader:Et.meshmatcap_vert,fragmentShader:Et.meshmatcap_frag},points:{uniforms:Hn([Ge.points,Ge.fog]),vertexShader:Et.points_vert,fragmentShader:Et.points_frag},dashed:{uniforms:Hn([Ge.common,Ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Et.linedashed_vert,fragmentShader:Et.linedashed_frag},depth:{uniforms:Hn([Ge.common,Ge.displacementmap]),vertexShader:Et.depth_vert,fragmentShader:Et.depth_frag},normal:{uniforms:Hn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,{opacity:{value:1}}]),vertexShader:Et.meshnormal_vert,fragmentShader:Et.meshnormal_frag},sprite:{uniforms:Hn([Ge.sprite,Ge.fog]),vertexShader:Et.sprite_vert,fragmentShader:Et.sprite_frag},background:{uniforms:{uvTransform:{value:new yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Et.background_vert,fragmentShader:Et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new yt}},vertexShader:Et.backgroundCube_vert,fragmentShader:Et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Et.cube_vert,fragmentShader:Et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Et.equirect_vert,fragmentShader:Et.equirect_frag},distanceRGBA:{uniforms:Hn([Ge.common,Ge.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Et.distanceRGBA_vert,fragmentShader:Et.distanceRGBA_frag},shadow:{uniforms:Hn([Ge.lights,Ge.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:Et.shadow_vert,fragmentShader:Et.shadow_frag}};ki.physical={uniforms:Hn([ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new yt},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new yt},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new yt},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new yt},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new yt},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new yt}}]),vertexShader:Et.meshphysical_vert,fragmentShader:Et.meshphysical_frag};uu={r:0,b:0,g:0},ys=new xi,fE=new ke;go=4,Um=[.125,.215,.35,.446,.526,.582],Ms=20,Ef=new ur,Bm=new Ve,Mf=null,Sf=0,wf=0,Tf=!1,Es=(1+Math.sqrt(5))/2,mo=1/Es,Hm=[new R(-Es,mo,0),new R(Es,mo,0),new R(-mo,0,Es),new R(mo,0,Es),new R(0,Es,-mo),new R(0,Es,mo),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],yE=new R,vo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,s={}){let{size:o=256,position:a=yE}=s;Mf=this._renderer.getRenderTarget(),Sf=this._renderer.getActiveCubeFace(),wf=this._renderer.getActiveMipmapLevel(),Tf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Om(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Mf,Sf,wf),this._renderer.xr.enabled=Tf,e.scissorTest=!1,hu(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ms||e.mapping===gs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Mf=this._renderer.getRenderTarget(),Sf=this._renderer.getActiveCubeFace(),wf=this._renderer.getActiveMipmapLevel(),Tf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Vt,minFilter:Vt,generateMipmaps:!1,type:qt,format:ln,colorSpace:Xt,depthBuffer:!1},i=Fm(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fm(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_E(s)),this._blurMaterial=EE(s,e,t)}return i}_compileMaterial(e){let t=new _e(this._lodPlanes[0],e);this._renderer.compile(t,Ef)}_sceneToCubeUV(e,t,n,i,s){let c=new an(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Bm),u.toneMapping=fr,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));let E=new _n({name:"PMREM.Background",side:Mn,depthWrite:!1,depthTest:!1}),m=new _e(new xn,E),p=!1,M=e.background;M?M.isColor&&(E.color.copy(M),e.background=null,p=!0):(E.color.copy(Bm),p=!0);for(let x=0;x<6;x++){let v=x%3;v===0?(c.up.set(0,l[x],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[x],s.y,s.z)):v===1?(c.up.set(0,0,l[x]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[x],s.z)):(c.up.set(0,l[x],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[x]));let S=this._cubeSize;hu(i,v*S,x>2?S:0,S,S),u.setRenderTarget(i),p&&u.render(m,c),u.render(e,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===ms||e.mapping===gs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=zm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Om());let s=i?this._cubemapMaterial:this._equirectMaterial,o=new _e(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;let c=this._cubeSize;hu(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Ef)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let s=1;s<i;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Hm[(i-s-1)%Hm.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,i,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",s),this._halfBlur(o,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new _e(this._lodPlanes[i],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*Ms-1),E=s/g,m=isFinite(s)?1+Math.floor(h*E):Ms;m>Ms&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ms}`);let p=[],M=0;for(let C=0;C<Ms;++C){let I=C/E,w=Math.exp(-I*I/2);p.push(w),C===0?M+=w:C<m&&(M+=2*w)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:x}=this;f.dTheta.value=g,f.mipInt.value=x-n;let v=this._sizeLods[i],S=3*v*(i>x-go?i-x+go:0),A=4*(this._cubeSize-v);hu(t,S,A,3*v,2*v),c.setRenderTarget(t),c.render(u,Ef)}};sg=new en,km=new Pr(1,1),og=new ra,ag=new Xc,cg=new ca,Vm=[],Gm=[],Wm=new Float32Array(16),Xm=new Float32Array(9),qm=new Float32Array(4);Af=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ZE(t.type)}},Rf=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=pM(t.type)}},Cf=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,o=i.length;s!==o;++s){let a=i[s];a.setValue(e,t[a.id],n)}}},bf=/(\w+)(\])?(\[|\.)?/g;xo=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let s=e.getActiveUniform(t,i),o=e.getUniformLocation(t,s.name);mM(s,o,this)}}setValue(e,t,n,i){let s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,o=t.length;s!==o;++s){let a=t[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let o=e[i];o.id in t&&n.push(o)}return n}};gM=37297,xM=0;jm=new yt;fu=new R;bM=/^[ \t]*#include +<([\w\d./]+)>/gm;AM=new Map;CM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;HM=0,Pf=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Lf(e),t.set(e,n)),n}},Lf=class{constructor(e){this.id=HM++,this.code=e,this.usedTimes=0}};WM=0;ZM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;JM={[pl]:ml,[gl]:yl,[xl]:_l,[is]:vl,[ml]:pl,[yl]:gl,[_l]:xl,[vl]:is};t1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,n1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Df=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new da(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Nt({vertexShader:t1,fragmentShader:n1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _e(new Bi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nf=class extends Li{constructor(e,t){super();let n=this,i=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null,E=typeof XRWebGLBinding<"u",m=new Df,p={},M=t.getContextAttributes(),x=null,v=null,S=[],A=[],C=new de,I=null,w=new an;w.viewport=new At;let _=new an;_.viewport=new At;let b=[w,_],P=new ul,U=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let re=S[j];return re===void 0&&(re=new $s,S[j]=re),re.getTargetRaySpace()},this.getControllerGrip=function(j){let re=S[j];return re===void 0&&(re=new $s,S[j]=re),re.getGripSpace()},this.getHand=function(j){let re=S[j];return re===void 0&&(re=new $s,S[j]=re),re.getHandSpace()};function H(j){let re=A.indexOf(j.inputSource);if(re===-1)return;let Se=S[re];Se!==void 0&&(Se.update(j.inputSource,j.frame,l||o),Se.dispatchEvent({type:j.type,data:j.inputSource}))}function V(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",Z);for(let j=0;j<S.length;j++){let re=A[j];re!==null&&(A[j]=null,S[j].disconnect(re))}U=null,N=null,m.reset();for(let j in p)delete p[j];e.setRenderTarget(x),d=null,f=null,u=null,i=null,v=null,xe.stop(),n.isPresenting=!1,e.setPixelRatio(I),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&E&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(x=e.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",V),i.addEventListener("inputsourceschange",Z),M.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(C),E&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,He=null,Ie=null;M.depth&&(Ie=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=M.stencil?fo:Zs,He=M.stencil?ho:dr);let nt={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:s};u=this.getBinding(),f=u.createProjectionLayer(nt),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new sn(f.textureWidth,f.textureHeight,{format:ln,type:Si,depthTexture:new Pr(f.textureWidth,f.textureHeight,He,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let Se={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,t,Se),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new sn(d.framebufferWidth,d.framebufferHeight,{format:ln,type:Si,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),xe.setContext(i),xe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(j){for(let re=0;re<j.removed.length;re++){let Se=j.removed[re],He=A.indexOf(Se);He>=0&&(A[He]=null,S[He].disconnect(Se))}for(let re=0;re<j.added.length;re++){let Se=j.added[re],He=A.indexOf(Se);if(He===-1){for(let nt=0;nt<S.length;nt++)if(nt>=A.length){A.push(Se),He=nt;break}else if(A[nt]===null){A[nt]=Se,He=nt;break}if(He===-1)break}let Ie=S[He];Ie&&Ie.connect(Se)}}let X=new R,z=new R;function Y(j,re,Se){X.setFromMatrixPosition(re.matrixWorld),z.setFromMatrixPosition(Se.matrixWorld);let He=X.distanceTo(z),Ie=re.projectionMatrix.elements,nt=Se.projectionMatrix.elements,rt=Ie[14]/(Ie[10]-1),W=Ie[14]/(Ie[10]+1),ve=(Ie[9]+1)/Ie[5],fe=(Ie[9]-1)/Ie[5],ge=(Ie[8]-1)/Ie[0],pe=(nt[8]+1)/nt[0],Te=rt*ge,be=rt*pe,Le=He/(-ge+pe),dt=Le*-ge;if(re.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(dt),j.translateZ(Le),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ie[10]===-1)j.projectionMatrix.copy(re.projectionMatrix),j.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{let lt=rt+Le,k=W+Le,D=Te-dt,te=be+(He-dt),le=ve*W/k*lt,we=fe*W/k*lt;j.projectionMatrix.makePerspective(D,te,le,we,lt,k),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function J(j,re){re===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(re.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;let re=j.near,Se=j.far;m.texture!==null&&(m.depthNear>0&&(re=m.depthNear),m.depthFar>0&&(Se=m.depthFar)),P.near=_.near=w.near=re,P.far=_.far=w.far=Se,(U!==P.near||N!==P.far)&&(i.updateRenderState({depthNear:P.near,depthFar:P.far}),U=P.near,N=P.far),P.layers.mask=j.layers.mask|6,w.layers.mask=P.layers.mask&3,_.layers.mask=P.layers.mask&5;let He=j.parent,Ie=P.cameras;J(P,He);for(let nt=0;nt<Ie.length;nt++)J(Ie[nt],He);Ie.length===2?Y(P,w,_):P.projectionMatrix.copy(w.projectionMatrix),ne(j,P,He)};function ne(j,re,Se){Se===null?j.matrix.copy(re.matrixWorld):(j.matrix.copy(Se.matrixWorld),j.matrix.invert(),j.matrix.multiply(re.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(re.projectionMatrix),j.projectionMatrixInverse.copy(re.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=os*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(P)},this.getCameraTexture=function(j){return p[j]};let ae=null;function Ue(j,re){if(h=re.getViewerPose(l||o),g=re,h!==null){let Se=h.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let He=!1;Se.length!==P.cameras.length&&(P.cameras.length=0,He=!0);for(let W=0;W<Se.length;W++){let ve=Se[W],fe=null;if(d!==null)fe=d.getViewport(ve);else{let pe=u.getViewSubImage(f,ve);fe=pe.viewport,W===0&&(e.setRenderTargetTextures(v,pe.colorTexture,pe.depthStencilTexture),e.setRenderTarget(v))}let ge=b[W];ge===void 0&&(ge=new an,ge.layers.enable(W),ge.viewport=new At,b[W]=ge),ge.matrix.fromArray(ve.transform.matrix),ge.matrix.decompose(ge.position,ge.quaternion,ge.scale),ge.projectionMatrix.fromArray(ve.projectionMatrix),ge.projectionMatrixInverse.copy(ge.projectionMatrix).invert(),ge.viewport.set(fe.x,fe.y,fe.width,fe.height),W===0&&(P.matrix.copy(ge.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),He===!0&&P.cameras.push(ge)}let Ie=i.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&E){u=n.getBinding();let W=u.getDepthInformation(Se[0]);W&&W.isValid&&W.texture&&m.init(W,i.renderState)}if(Ie&&Ie.includes("camera-access")&&E){e.state.unbindTexture(),u=n.getBinding();for(let W=0;W<Se.length;W++){let ve=Se[W].camera;if(ve){let fe=p[ve];fe||(fe=new da,p[ve]=fe);let ge=u.getCameraImage(ve);fe.sourceTexture=ge}}}}for(let Se=0;Se<S.length;Se++){let He=A[Se],Ie=S[Se];He!==null&&Ie!==void 0&&Ie.update(He,re,l||o)}ae&&ae(j,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),g=null}let xe=new rg;xe.setAnimationLoop(Ue),this.setAnimationLoop=function(j){ae=j},this.dispose=function(){}}},_s=new xi,i1=new ke;du=class{constructor(e={}){let{canvas:t=bm(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let g=new Uint32Array(4),E=new Int32Array(4),m=null,p=null,M=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,S=!1;this._outputColorSpace=bt;let A=0,C=0,I=null,w=-1,_=null,b=new At,P=new At,U=null,N=new Ve(0),H=0,V=t.width,Z=t.height,X=1,z=null,Y=null,J=new At(0,0,V,Z),ne=new At(0,0,V,Z),ae=!1,Ue=new Cr,xe=!1,j=!1,re=new ke,Se=new R,He=new At,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},nt=!1;function rt(){return I===null?X:1}let W=n;function ve(y,L){return t.getContext(y,L)}try{let y={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",oe,!1),t.addEventListener("webglcontextrestored",qe,!1),t.addEventListener("webglcontextcreationerror",Pe,!1),W===null){let L="webgl2";if(W=ve(L,y),W===null)throw ve(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let fe,ge,pe,Te,be,Le,dt,lt,k,D,te,le,we,ce,Qe,Be,je,Ze,Ce,ye,$e,et,Oe,Je;function q(){fe=new SE(W),fe.init(),et=new e1(W,fe),ge=new gE(W,fe,e,et),pe=new QM(W,fe),ge.reversedDepthBuffer&&f&&pe.buffers.depth.setReversed(!0),Te=new bE(W),be=new OM,Le=new $M(W,fe,pe,be,ge,et,Te),dt=new vE(v),lt=new ME(v),k=new Lv(W),Oe=new pE(W,k),D=new wE(W,k,Te,Oe),te=new RE(W,D,k,Te),Ce=new AE(W,ge,Le),Be=new xE(be),le=new FM(v,dt,lt,fe,ge,Oe,Be),we=new r1(v,be),ce=new kM,Qe=new YM(fe),Ze=new dE(v,dt,lt,pe,te,d,c),je=new KM(v,te,ge),Je=new s1(W,Te,ge,pe),ye=new mE(W,fe,Te),$e=new TE(W,fe,Te),Te.programs=le.programs,v.capabilities=ge,v.extensions=fe,v.properties=be,v.renderLists=ce,v.shadowMap=je,v.state=pe,v.info=Te}q();let De=new Nf(v,W);this.xr=De,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){let y=fe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=fe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(y){y!==void 0&&(X=y,this.setSize(V,Z,!1))},this.getSize=function(y){return y.set(V,Z)},this.setSize=function(y,L,B=!0){if(De.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=y,Z=L,t.width=Math.floor(y*X),t.height=Math.floor(L*X),B===!0&&(t.style.width=y+"px",t.style.height=L+"px"),this.setViewport(0,0,y,L)},this.getDrawingBufferSize=function(y){return y.set(V*X,Z*X).floor()},this.setDrawingBufferSize=function(y,L,B){V=y,Z=L,X=B,t.width=Math.floor(y*B),t.height=Math.floor(L*B),this.setViewport(0,0,y,L)},this.getCurrentViewport=function(y){return y.copy(b)},this.getViewport=function(y){return y.copy(J)},this.setViewport=function(y,L,B,F){y.isVector4?J.set(y.x,y.y,y.z,y.w):J.set(y,L,B,F),pe.viewport(b.copy(J).multiplyScalar(X).round())},this.getScissor=function(y){return y.copy(ne)},this.setScissor=function(y,L,B,F){y.isVector4?ne.set(y.x,y.y,y.z,y.w):ne.set(y,L,B,F),pe.scissor(P.copy(ne).multiplyScalar(X).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(y){pe.setScissorTest(ae=y)},this.setOpaqueSort=function(y){z=y},this.setTransparentSort=function(y){Y=y},this.getClearColor=function(y){return y.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(y=!0,L=!0,B=!0){let F=0;if(y){let G=!1;if(I!==null){let O=I.texture.format;G=O===Dl||O===Ll||O===Da}if(G){let O=I.texture.type,Q=O===Si||O===dr||O===uo||O===ho||O===Il||O===Pl,ee=Ze.getClearColor(),K=Ze.getClearAlpha(),se=ee.r,me=ee.g,ue=ee.b;Q?(g[0]=se,g[1]=me,g[2]=ue,g[3]=K,W.clearBufferuiv(W.COLOR,0,g)):(E[0]=se,E[1]=me,E[2]=ue,E[3]=K,W.clearBufferiv(W.COLOR,0,E))}else F|=W.COLOR_BUFFER_BIT}L&&(F|=W.DEPTH_BUFFER_BIT),B&&(F|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",oe,!1),t.removeEventListener("webglcontextrestored",qe,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),Ze.dispose(),ce.dispose(),Qe.dispose(),be.dispose(),dt.dispose(),lt.dispose(),te.dispose(),Oe.dispose(),Je.dispose(),le.dispose(),De.dispose(),De.removeEventListener("sessionstart",Tn),De.removeEventListener("sessionend",Cs),nn.stop()};function oe(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function qe(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;let y=Te.autoReset,L=je.enabled,B=je.autoUpdate,F=je.needsUpdate,G=je.type;q(),Te.autoReset=y,je.enabled=L,je.autoUpdate=B,je.needsUpdate=F,je.type=G}function Pe(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Me(y){let L=y.target;L.removeEventListener("dispose",Me),it(L)}function it(y){xt(y),be.remove(y)}function xt(y){let L=be.get(y).programs;L!==void 0&&(L.forEach(function(B){le.releaseProgram(B)}),y.isShaderMaterial&&le.releaseShaderCache(y))}this.renderBufferDirect=function(y,L,B,F,G,O){L===null&&(L=Ie);let Q=G.isMesh&&G.matrixWorld.determinant()<0,ee=Ne(y,L,B,F,G);pe.setMaterial(F,Q);let K=B.index,se=1;if(F.wireframe===!0){if(K=D.getWireframeAttribute(B),K===void 0)return;se=2}let me=B.drawRange,ue=B.attributes.position,Ee=me.start*se,ze=(me.start+me.count)*se;O!==null&&(Ee=Math.max(Ee,O.start*se),ze=Math.min(ze,(O.start+O.count)*se)),K!==null?(Ee=Math.max(Ee,0),ze=Math.min(ze,K.count)):ue!=null&&(Ee=Math.max(Ee,0),ze=Math.min(ze,ue.count));let $=ze-Ee;if($<0||$===1/0)return;Oe.setup(G,F,ee,B,K);let he,Re=ye;if(K!==null&&(he=k.get(K),Re=$e,Re.setIndex(he)),G.isMesh)F.wireframe===!0?(pe.setLineWidth(F.wireframeLinewidth*rt()),Re.setMode(W.LINES)):Re.setMode(W.TRIANGLES);else if(G.isLine){let Ae=F.linewidth;Ae===void 0&&(Ae=1),pe.setLineWidth(Ae*rt()),G.isLineSegments?Re.setMode(W.LINES):G.isLineLoop?Re.setMode(W.LINE_LOOP):Re.setMode(W.LINE_STRIP)}else G.isPoints?Re.setMode(W.POINTS):G.isSprite&&Re.setMode(W.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Ks("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Re.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(fe.get("WEBGL_multi_draw"))Re.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Ae=G._multiDrawStarts,We=G._multiDrawCounts,tt=G._multiDrawCount,ut=K?k.get(K).bytesPerElement:1,st=be.get(F).currentProgram.getUniforms();for(let St=0;St<tt;St++)st.setValue(W,"_gl_DrawID",St),Re.render(Ae[St]/ut,We[St])}else if(G.isInstancedMesh)Re.renderInstances(Ee,$,G.count);else if(B.isInstancedBufferGeometry){let Ae=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,We=Math.min(B.instanceCount,Ae);Re.renderInstances(Ee,$,We)}else Re.render(Ee,$)};function Pt(y,L,B){y.transparent===!0&&y.side===Mt&&y.forceSinglePass===!1?(y.side=Mn,y.needsUpdate=!0,Ki(y,L,B),y.side=An,y.needsUpdate=!0,Ki(y,L,B),y.side=Mt):Ki(y,L,B)}this.compile=function(y,L,B=null){B===null&&(B=y),p=Qe.get(B),p.init(L),x.push(p),B.traverseVisible(function(G){G.isLight&&G.layers.test(L.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),y!==B&&y.traverseVisible(function(G){G.isLight&&G.layers.test(L.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights();let F=new Set;return y.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let O=G.material;if(O)if(Array.isArray(O))for(let Q=0;Q<O.length;Q++){let ee=O[Q];Pt(ee,B,G),F.add(ee)}else Pt(O,B,G),F.add(O)}),p=x.pop(),F},this.compileAsync=function(y,L,B=null){let F=this.compile(y,L,B);return new Promise(G=>{function O(){if(F.forEach(function(Q){be.get(Q).currentProgram.isReady()&&F.delete(Q)}),F.size===0){G(y);return}setTimeout(O,10)}fe.get("KHR_parallel_shader_compile")!==null?O():setTimeout(O,10)})};let Lt=null;function fn(y){Lt&&Lt(y)}function Tn(){nn.stop()}function Cs(){nn.start()}let nn=new rg;nn.setAnimationLoop(fn),typeof self<"u"&&nn.setContext(self),this.setAnimationLoop=function(y){Lt=y,De.setAnimationLoop(y),y===null?nn.stop():nn.start()},De.addEventListener("sessionstart",Tn),De.addEventListener("sessionend",Cs),this.render=function(y,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),De.enabled===!0&&De.isPresenting===!0&&(De.cameraAutoUpdate===!0&&De.updateCamera(L),L=De.getCamera()),y.isScene===!0&&y.onBeforeRender(v,y,L,I),p=Qe.get(y,x.length),p.init(L),x.push(p),re.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Ue.setFromProjectionMatrix(re,si,L.reversedDepth),j=this.localClippingEnabled,xe=Be.init(this.clippingPlanes,j),m=ce.get(y,M.length),m.init(),M.push(m),De.enabled===!0&&De.isPresenting===!0){let O=v.xr.getDepthSensingMesh();O!==null&&qi(O,L,-1/0,v.sortObjects)}qi(y,L,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(z,Y),nt=De.enabled===!1||De.isPresenting===!1||De.hasDepthSensing()===!1,nt&&Ze.addToRenderList(m,y),this.info.render.frame++,xe===!0&&Be.beginShadows();let B=p.state.shadowsArray;je.render(B,y,L),xe===!0&&Be.endShadows(),this.info.autoReset===!0&&this.info.reset();let F=m.opaque,G=m.transmissive;if(p.setupLights(),L.isArrayCamera){let O=L.cameras;if(G.length>0)for(let Q=0,ee=O.length;Q<ee;Q++){let K=O[Q];Zi(F,G,y,K)}nt&&Ze.render(y);for(let Q=0,ee=O.length;Q<ee;Q++){let K=O[Q];Yi(m,y,K,K.viewport)}}else G.length>0&&Zi(F,G,y,L),nt&&Ze.render(y),Yi(m,y,L);I!==null&&C===0&&(Le.updateMultisampleRenderTarget(I),Le.updateRenderTargetMipmap(I)),y.isScene===!0&&y.onAfterRender(v,y,L),Oe.resetDefaultState(),w=-1,_=null,x.pop(),x.length>0?(p=x[x.length-1],xe===!0&&Be.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function qi(y,L,B,F){if(y.visible===!1)return;if(y.layers.test(L.layers)){if(y.isGroup)B=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(L);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Ue.intersectsSprite(y)){F&&He.setFromMatrixPosition(y.matrixWorld).applyMatrix4(re);let Q=te.update(y),ee=y.material;ee.visible&&m.push(y,Q,ee,B,He.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Ue.intersectsObject(y))){let Q=te.update(y),ee=y.material;if(F&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),He.copy(y.boundingSphere.center)):(Q.boundingSphere===null&&Q.computeBoundingSphere(),He.copy(Q.boundingSphere.center)),He.applyMatrix4(y.matrixWorld).applyMatrix4(re)),Array.isArray(ee)){let K=Q.groups;for(let se=0,me=K.length;se<me;se++){let ue=K[se],Ee=ee[ue.materialIndex];Ee&&Ee.visible&&m.push(y,Q,Ee,B,He.z,ue)}}else ee.visible&&m.push(y,Q,ee,B,He.z,null)}}let O=y.children;for(let Q=0,ee=O.length;Q<ee;Q++)qi(O[Q],L,B,F)}function Yi(y,L,B,F){let G=y.opaque,O=y.transmissive,Q=y.transparent;p.setupLightsView(B),xe===!0&&Be.setGlobalState(v.clippingPlanes,B),F&&pe.viewport(b.copy(F)),G.length>0&&ji(G,L,B),O.length>0&&ji(O,L,B),Q.length>0&&ji(Q,L,B),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function Zi(y,L,B,F){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[F.id]===void 0&&(p.state.transmissionRenderTarget[F.id]=new sn(1,1,{generateMipmaps:!0,type:fe.has("EXT_color_buffer_half_float")||fe.has("EXT_color_buffer_float")?qt:Si,minFilter:ci,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Tt.workingColorSpace}));let O=p.state.transmissionRenderTarget[F.id],Q=F.viewport||b;O.setSize(Q.z*v.transmissionResolutionScale,Q.w*v.transmissionResolutionScale);let ee=v.getRenderTarget(),K=v.getActiveCubeFace(),se=v.getActiveMipmapLevel();v.setRenderTarget(O),v.getClearColor(N),H=v.getClearAlpha(),H<1&&v.setClearColor(16777215,.5),v.clear(),nt&&Ze.render(B);let me=v.toneMapping;v.toneMapping=fr;let ue=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),p.setupLightsView(F),xe===!0&&Be.setGlobalState(v.clippingPlanes,F),ji(y,B,F),Le.updateMultisampleRenderTarget(O),Le.updateRenderTargetMipmap(O),fe.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let ze=0,$=L.length;ze<$;ze++){let he=L[ze],Re=he.object,Ae=he.geometry,We=he.material,tt=he.group;if(We.side===Mt&&Re.layers.test(F.layers)){let ut=We.side;We.side=Mn,We.needsUpdate=!0,Xr(Re,B,F,Ae,We,tt),We.side=ut,We.needsUpdate=!0,Ee=!0}}Ee===!0&&(Le.updateMultisampleRenderTarget(O),Le.updateRenderTargetMipmap(O))}v.setRenderTarget(ee,K,se),v.setClearColor(N,H),ue!==void 0&&(F.viewport=ue),v.toneMapping=me}function ji(y,L,B){let F=L.isScene===!0?L.overrideMaterial:null;for(let G=0,O=y.length;G<O;G++){let Q=y[G],ee=Q.object,K=Q.geometry,se=Q.group,me=Q.material;me.allowOverride===!0&&F!==null&&(me=F),ee.layers.test(B.layers)&&Xr(ee,L,B,K,me,se)}}function Xr(y,L,B,F,G,O){y.onBeforeRender(v,L,B,F,G,O),y.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),G.onBeforeRender(v,L,B,F,y,O),G.transparent===!0&&G.side===Mt&&G.forceSinglePass===!1?(G.side=Mn,G.needsUpdate=!0,v.renderBufferDirect(B,L,F,G,y,O),G.side=An,G.needsUpdate=!0,v.renderBufferDirect(B,L,F,G,y,O),G.side=Mt):v.renderBufferDirect(B,L,F,G,y,O),y.onAfterRender(v,L,B,F,G,O)}function Ki(y,L,B){L.isScene!==!0&&(L=Ie);let F=be.get(y),G=p.state.lights,O=p.state.shadowsArray,Q=G.state.version,ee=le.getParameters(y,G.state,O,L,B),K=le.getProgramCacheKey(ee),se=F.programs;F.environment=y.isMeshStandardMaterial?L.environment:null,F.fog=L.fog,F.envMap=(y.isMeshStandardMaterial?lt:dt).get(y.envMap||F.environment),F.envMapRotation=F.environment!==null&&y.envMap===null?L.environmentRotation:y.envMapRotation,se===void 0&&(y.addEventListener("dispose",Me),se=new Map,F.programs=se);let me=se.get(K);if(me!==void 0){if(F.currentProgram===me&&F.lightsStateVersion===Q)return ie(y,ee),me}else ee.uniforms=le.getUniforms(y),y.onBeforeCompile(ee,v),me=le.acquireProgram(ee,K),se.set(K,me),F.uniforms=ee.uniforms;let ue=F.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(ue.clippingPlanes=Be.uniform),ie(y,ee),F.needsLights=ft(y),F.lightsStateVersion=Q,F.needsLights&&(ue.ambientLightColor.value=G.state.ambient,ue.lightProbe.value=G.state.probe,ue.directionalLights.value=G.state.directional,ue.directionalLightShadows.value=G.state.directionalShadow,ue.spotLights.value=G.state.spot,ue.spotLightShadows.value=G.state.spotShadow,ue.rectAreaLights.value=G.state.rectArea,ue.ltc_1.value=G.state.rectAreaLTC1,ue.ltc_2.value=G.state.rectAreaLTC2,ue.pointLights.value=G.state.point,ue.pointLightShadows.value=G.state.pointShadow,ue.hemisphereLights.value=G.state.hemi,ue.directionalShadowMap.value=G.state.directionalShadowMap,ue.directionalShadowMatrix.value=G.state.directionalShadowMatrix,ue.spotShadowMap.value=G.state.spotShadowMap,ue.spotLightMatrix.value=G.state.spotLightMatrix,ue.spotLightMap.value=G.state.spotLightMap,ue.pointShadowMap.value=G.state.pointShadowMap,ue.pointShadowMatrix.value=G.state.pointShadowMatrix),F.currentProgram=me,F.uniformsList=null,me}function Is(y){if(y.uniformsList===null){let L=y.currentProgram.getUniforms();y.uniformsList=xo.seqWithValue(L.seq,y.uniforms)}return y.uniformsList}function ie(y,L){let B=be.get(y);B.outputColorSpace=L.outputColorSpace,B.batching=L.batching,B.batchingColor=L.batchingColor,B.instancing=L.instancing,B.instancingColor=L.instancingColor,B.instancingMorph=L.instancingMorph,B.skinning=L.skinning,B.morphTargets=L.morphTargets,B.morphNormals=L.morphNormals,B.morphColors=L.morphColors,B.morphTargetsCount=L.morphTargetsCount,B.numClippingPlanes=L.numClippingPlanes,B.numIntersection=L.numClipIntersection,B.vertexAlphas=L.vertexAlphas,B.vertexTangents=L.vertexTangents,B.toneMapping=L.toneMapping}function Ne(y,L,B,F,G){L.isScene!==!0&&(L=Ie),Le.resetTextureUnits();let O=L.fog,Q=F.isMeshStandardMaterial?L.environment:null,ee=I===null?v.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Xt,K=(F.isMeshStandardMaterial?lt:dt).get(F.envMap||Q),se=F.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,me=!!B.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),ue=!!B.morphAttributes.position,Ee=!!B.morphAttributes.normal,ze=!!B.morphAttributes.color,$=fr;F.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&($=v.toneMapping);let he=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Re=he!==void 0?he.length:0,Ae=be.get(F),We=p.state.lights;if(xe===!0&&(j===!0||y!==_)){let Qt=y===_&&F.id===w;Be.setState(F,y,Qt)}let tt=!1;F.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==We.state.version||Ae.outputColorSpace!==ee||G.isBatchedMesh&&Ae.batching===!1||!G.isBatchedMesh&&Ae.batching===!0||G.isBatchedMesh&&Ae.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ae.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ae.instancing===!1||!G.isInstancedMesh&&Ae.instancing===!0||G.isSkinnedMesh&&Ae.skinning===!1||!G.isSkinnedMesh&&Ae.skinning===!0||G.isInstancedMesh&&Ae.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ae.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ae.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ae.instancingMorph===!1&&G.morphTexture!==null||Ae.envMap!==K||F.fog===!0&&Ae.fog!==O||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==Be.numPlanes||Ae.numIntersection!==Be.numIntersection)||Ae.vertexAlphas!==se||Ae.vertexTangents!==me||Ae.morphTargets!==ue||Ae.morphNormals!==Ee||Ae.morphColors!==ze||Ae.toneMapping!==$||Ae.morphTargetsCount!==Re)&&(tt=!0):(tt=!0,Ae.__version=F.version);let ut=Ae.currentProgram;tt===!0&&(ut=Ki(F,L,G));let st=!1,St=!1,Zt=!1,pt=ut.getUniforms(),vt=Ae.uniforms;if(pe.useProgram(ut.program)&&(st=!0,St=!0,Zt=!0),F.id!==w&&(w=F.id,St=!0),st||_!==y){pe.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),pt.setValue(W,"projectionMatrix",y.projectionMatrix),pt.setValue(W,"viewMatrix",y.matrixWorldInverse);let dn=pt.map.cameraPosition;dn!==void 0&&dn.setValue(W,Se.setFromMatrixPosition(y.matrixWorld)),ge.logarithmicDepthBuffer&&pt.setValue(W,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&pt.setValue(W,"isOrthographic",y.isOrthographicCamera===!0),_!==y&&(_=y,St=!0,Zt=!0)}if(G.isSkinnedMesh){pt.setOptional(W,G,"bindMatrix"),pt.setOptional(W,G,"bindMatrixInverse");let Qt=G.skeleton;Qt&&(Qt.boneTexture===null&&Qt.computeBoneTexture(),pt.setValue(W,"boneTexture",Qt.boneTexture,Le))}G.isBatchedMesh&&(pt.setOptional(W,G,"batchingTexture"),pt.setValue(W,"batchingTexture",G._matricesTexture,Le),pt.setOptional(W,G,"batchingIdTexture"),pt.setValue(W,"batchingIdTexture",G._indirectTexture,Le),pt.setOptional(W,G,"batchingColorTexture"),G._colorsTexture!==null&&pt.setValue(W,"batchingColorTexture",G._colorsTexture,Le));let wt=B.morphAttributes;if((wt.position!==void 0||wt.normal!==void 0||wt.color!==void 0)&&Ce.update(G,B,ut),(St||Ae.receiveShadow!==G.receiveShadow)&&(Ae.receiveShadow=G.receiveShadow,pt.setValue(W,"receiveShadow",G.receiveShadow)),F.isMeshGouraudMaterial&&F.envMap!==null&&(vt.envMap.value=K,vt.flipEnvMap.value=K.isCubeTexture&&K.isRenderTargetTexture===!1?-1:1),F.isMeshStandardMaterial&&F.envMap===null&&L.environment!==null&&(vt.envMapIntensity.value=L.environmentIntensity),St&&(pt.setValue(W,"toneMappingExposure",v.toneMappingExposure),Ae.needsLights&&Fe(vt,Zt),O&&F.fog===!0&&we.refreshFogUniforms(vt,O),we.refreshMaterialUniforms(vt,F,X,Z,p.state.transmissionRenderTarget[y.id]),xo.upload(W,Is(Ae),vt,Le)),F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(xo.upload(W,Is(Ae),vt,Le),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&pt.setValue(W,"center",G.center),pt.setValue(W,"modelViewMatrix",G.modelViewMatrix),pt.setValue(W,"normalMatrix",G.normalMatrix),pt.setValue(W,"modelMatrix",G.matrixWorld),F.isShaderMaterial||F.isRawShaderMaterial){let Qt=F.uniformsGroups;for(let dn=0,Xn=Qt.length;dn<Xn;dn++){let ni=Qt[dn];Je.update(ni,ut),Je.bind(ni,ut)}}return ut}function Fe(y,L){y.ambientLightColor.needsUpdate=L,y.lightProbe.needsUpdate=L,y.directionalLights.needsUpdate=L,y.directionalLightShadows.needsUpdate=L,y.pointLights.needsUpdate=L,y.pointLightShadows.needsUpdate=L,y.spotLights.needsUpdate=L,y.spotLightShadows.needsUpdate=L,y.rectAreaLights.needsUpdate=L,y.hemisphereLights.needsUpdate=L}function ft(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(y,L,B){let F=be.get(y);F.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,F.__autoAllocateDepthBuffer===!1&&(F.__useRenderToTexture=!1),be.get(y.texture).__webglTexture=L,be.get(y.depthTexture).__webglTexture=F.__autoAllocateDepthBuffer?void 0:B,F.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,L){let B=be.get(y);B.__webglFramebuffer=L,B.__useDefaultFramebuffer=L===void 0};let ct=W.createFramebuffer();this.setRenderTarget=function(y,L=0,B=0){I=y,A=L,C=B;let F=!0,G=null,O=!1,Q=!1;if(y){let K=be.get(y);if(K.__useDefaultFramebuffer!==void 0)pe.bindFramebuffer(W.FRAMEBUFFER,null),F=!1;else if(K.__webglFramebuffer===void 0)Le.setupRenderTarget(y);else if(K.__hasExternalTextures)Le.rebindTextures(y,be.get(y.texture).__webglTexture,be.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let ue=y.depthTexture;if(K.__boundDepthTexture!==ue){if(ue!==null&&be.has(ue)&&(y.width!==ue.image.width||y.height!==ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Le.setupDepthRenderbuffer(y)}}let se=y.texture;(se.isData3DTexture||se.isDataArrayTexture||se.isCompressedArrayTexture)&&(Q=!0);let me=be.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(me[L])?G=me[L][B]:G=me[L],O=!0):y.samples>0&&Le.useMultisampledRTT(y)===!1?G=be.get(y).__webglMultisampledFramebuffer:Array.isArray(me)?G=me[B]:G=me,b.copy(y.viewport),P.copy(y.scissor),U=y.scissorTest}else b.copy(J).multiplyScalar(X).floor(),P.copy(ne).multiplyScalar(X).floor(),U=ae;if(B!==0&&(G=ct),pe.bindFramebuffer(W.FRAMEBUFFER,G)&&F&&pe.drawBuffers(y,G),pe.viewport(b),pe.scissor(P),pe.setScissorTest(U),O){let K=be.get(y.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+L,K.__webglTexture,B)}else if(Q){let K=L;for(let se=0;se<y.textures.length;se++){let me=be.get(y.textures[se]);W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0+se,me.__webglTexture,B,K)}}else if(y!==null&&B!==0){let K=be.get(y.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,K.__webglTexture,B)}w=-1},this.readRenderTargetPixels=function(y,L,B,F,G,O,Q,ee=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let K=be.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Q!==void 0&&(K=K[Q]),K){pe.bindFramebuffer(W.FRAMEBUFFER,K);try{let se=y.textures[ee],me=se.format,ue=se.type;if(!ge.textureFormatReadable(me)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ge.textureTypeReadable(ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=y.width-F&&B>=0&&B<=y.height-G&&(y.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+ee),W.readPixels(L,B,F,G,et.convert(me),et.convert(ue),O))}finally{let se=I!==null?be.get(I).__webglFramebuffer:null;pe.bindFramebuffer(W.FRAMEBUFFER,se)}}},this.readRenderTargetPixelsAsync=async function(y,L,B,F,G,O,Q,ee=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let K=be.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Q!==void 0&&(K=K[Q]),K)if(L>=0&&L<=y.width-F&&B>=0&&B<=y.height-G){pe.bindFramebuffer(W.FRAMEBUFFER,K);let se=y.textures[ee],me=se.format,ue=se.type;if(!ge.textureFormatReadable(me))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ge.textureTypeReadable(ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ee=W.createBuffer();W.bindBuffer(W.PIXEL_PACK_BUFFER,Ee),W.bufferData(W.PIXEL_PACK_BUFFER,O.byteLength,W.STREAM_READ),y.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+ee),W.readPixels(L,B,F,G,et.convert(me),et.convert(ue),0);let ze=I!==null?be.get(I).__webglFramebuffer:null;pe.bindFramebuffer(W.FRAMEBUFFER,ze);let $=W.fenceSync(W.SYNC_GPU_COMMANDS_COMPLETE,0);return W.flush(),await Am(W,$,4),W.bindBuffer(W.PIXEL_PACK_BUFFER,Ee),W.getBufferSubData(W.PIXEL_PACK_BUFFER,0,O),W.deleteBuffer(Ee),W.deleteSync($),O}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,L=null,B=0){let F=Math.pow(2,-B),G=Math.floor(y.image.width*F),O=Math.floor(y.image.height*F),Q=L!==null?L.x:0,ee=L!==null?L.y:0;Le.setTexture2D(y,0),W.copyTexSubImage2D(W.TEXTURE_2D,B,0,0,Q,ee,G,O),pe.unbindTexture()};let Ye=W.createFramebuffer(),T=W.createFramebuffer();this.copyTextureToTexture=function(y,L,B=null,F=null,G=0,O=null){O===null&&(G!==0?(Ks("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),O=G,G=0):O=0);let Q,ee,K,se,me,ue,Ee,ze,$,he=y.isCompressedTexture?y.mipmaps[O]:y.image;if(B!==null)Q=B.max.x-B.min.x,ee=B.max.y-B.min.y,K=B.isBox3?B.max.z-B.min.z:1,se=B.min.x,me=B.min.y,ue=B.isBox3?B.min.z:0;else{let wt=Math.pow(2,-G);Q=Math.floor(he.width*wt),ee=Math.floor(he.height*wt),y.isDataArrayTexture?K=he.depth:y.isData3DTexture?K=Math.floor(he.depth*wt):K=1,se=0,me=0,ue=0}F!==null?(Ee=F.x,ze=F.y,$=F.z):(Ee=0,ze=0,$=0);let Re=et.convert(L.format),Ae=et.convert(L.type),We;L.isData3DTexture?(Le.setTexture3D(L,0),We=W.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(Le.setTexture2DArray(L,0),We=W.TEXTURE_2D_ARRAY):(Le.setTexture2D(L,0),We=W.TEXTURE_2D),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,L.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,L.unpackAlignment);let tt=W.getParameter(W.UNPACK_ROW_LENGTH),ut=W.getParameter(W.UNPACK_IMAGE_HEIGHT),st=W.getParameter(W.UNPACK_SKIP_PIXELS),St=W.getParameter(W.UNPACK_SKIP_ROWS),Zt=W.getParameter(W.UNPACK_SKIP_IMAGES);W.pixelStorei(W.UNPACK_ROW_LENGTH,he.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,he.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,se),W.pixelStorei(W.UNPACK_SKIP_ROWS,me),W.pixelStorei(W.UNPACK_SKIP_IMAGES,ue);let pt=y.isDataArrayTexture||y.isData3DTexture,vt=L.isDataArrayTexture||L.isData3DTexture;if(y.isDepthTexture){let wt=be.get(y),Qt=be.get(L),dn=be.get(wt.__renderTarget),Xn=be.get(Qt.__renderTarget);pe.bindFramebuffer(W.READ_FRAMEBUFFER,dn.__webglFramebuffer),pe.bindFramebuffer(W.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let ni=0;ni<K;ni++)pt&&(W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,be.get(y).__webglTexture,G,ue+ni),W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,be.get(L).__webglTexture,O,$+ni)),W.blitFramebuffer(se,me,Q,ee,Ee,ze,Q,ee,W.DEPTH_BUFFER_BIT,W.NEAREST);pe.bindFramebuffer(W.READ_FRAMEBUFFER,null),pe.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else if(G!==0||y.isRenderTargetTexture||be.has(y)){let wt=be.get(y),Qt=be.get(L);pe.bindFramebuffer(W.READ_FRAMEBUFFER,Ye),pe.bindFramebuffer(W.DRAW_FRAMEBUFFER,T);for(let dn=0;dn<K;dn++)pt?W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,wt.__webglTexture,G,ue+dn):W.framebufferTexture2D(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,wt.__webglTexture,G),vt?W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,Qt.__webglTexture,O,$+dn):W.framebufferTexture2D(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,Qt.__webglTexture,O),G!==0?W.blitFramebuffer(se,me,Q,ee,Ee,ze,Q,ee,W.COLOR_BUFFER_BIT,W.NEAREST):vt?W.copyTexSubImage3D(We,O,Ee,ze,$+dn,se,me,Q,ee):W.copyTexSubImage2D(We,O,Ee,ze,se,me,Q,ee);pe.bindFramebuffer(W.READ_FRAMEBUFFER,null),pe.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else vt?y.isDataTexture||y.isData3DTexture?W.texSubImage3D(We,O,Ee,ze,$,Q,ee,K,Re,Ae,he.data):L.isCompressedArrayTexture?W.compressedTexSubImage3D(We,O,Ee,ze,$,Q,ee,K,Re,he.data):W.texSubImage3D(We,O,Ee,ze,$,Q,ee,K,Re,Ae,he):y.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,O,Ee,ze,Q,ee,Re,Ae,he.data):y.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,O,Ee,ze,he.width,he.height,Re,he.data):W.texSubImage2D(W.TEXTURE_2D,O,Ee,ze,Q,ee,Re,Ae,he);W.pixelStorei(W.UNPACK_ROW_LENGTH,tt),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,ut),W.pixelStorei(W.UNPACK_SKIP_PIXELS,st),W.pixelStorei(W.UNPACK_SKIP_ROWS,St),W.pixelStorei(W.UNPACK_SKIP_IMAGES,Zt),O===0&&L.generateMipmaps&&W.generateMipmap(We),pe.unbindTexture()},this.initRenderTarget=function(y){be.get(y).__webglFramebuffer===void 0&&Le.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Le.setTextureCube(y,0):y.isData3DTexture?Le.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Le.setTexture2DArray(y,0):Le.setTexture2D(y,0),pe.unbindTexture()},this.resetState=function(){A=0,C=0,I=null,pe.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Tt._getUnpackColorSpace()}}});function Ti(r,e=!1){let t=r[0].index!==null,n=new Set(Object.keys(r[0].attributes)),i=new Set(Object.keys(r[0].morphAttributes)),s={},o={},a=r[0].morphTargetsRelative,c=new gt,l=0;for(let h=0;h<r.length;++h){let u=r[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;s[d]===void 0&&(s[d]=[]),s[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(t){let h=0,u=[];for(let f=0;f<r.length;++f){let d=r[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=r[f].attributes.position.count}c.setIndex(u)}for(let h in s){let u=ug(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let E=0;E<o[h].length;++E)d.push(o[h][E][f]);let g=ug(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function ug(r){let e,t,n,i=-1,s=0;for(let l=0;l<r.length;++l){let h=r[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*t}let o=new e(s),a=new Rt(o,t,n),c=0;for(let l=0;l<r.length;++l){let h=r[l];if(h.isInterleavedBufferAttribute){let u=c/t;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<t;g++){let E=h.getComponent(f,g);a.setComponent(f+u,g,E)}}else o.set(h.array,c);c+=h.count*t}return i!==void 0&&(a.gpuType=i),a}function Bf(r,e){if(e===lf)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===po||e===Fa){let t=r.getIndex();if(t===null){let o=[],a=r.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);r.setIndex(o),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}let n=t.count-2,i=[];if(e===po)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}var Ss=cc(()=>{at()});var gg={};Z0(gg,{GLTFLoader:()=>Kn});function o1(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function l1(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Xe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:An})),r.DefaultMaterial}function ws(r,e,t){for(let n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Vi(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function u1(r,e,t){let n=!1,i=!1,s=!1;for(let l=0,h=e.length;l<h;l++){let u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);let o=[],a=[],c=[];for(let l=0,h=e.length;l<h;l++){let u=e[l];if(n){let f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;o.push(f)}if(i){let f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;a.push(f)}if(s){let f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;c.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let h=l[0],u=l[1],f=l[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=f),r.morphTargetsRelative=!0,r})}function h1(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function f1(r){let e,t=r.extensions&&r.extensions[It.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Of(t.attributes):e=r.indices+":"+Of(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+Of(r.targets[n]);return e}function Of(r){let e="",t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function ud(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function d1(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function m1(r,e,t){let n=e.attributes,i=new ht;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(i.set(new R(c[0],c[1],c[2]),new R(l[0],l[1],l[2])),a.normalized){let h=ud(Eo[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let a=new R,c=new R;for(let l=0,h=s.length;l<h;l++){let u=s[l];if(u.POSITION!==void 0){let f=t.json.accessors[u.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){let E=ud(Eo[f.componentType]);c.multiplyScalar(E)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}r.boundingBox=i;let o=new mn;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=o}function pg(r,e,t){let n=e.attributes,i=[];function s(o,a){return t.getDependency("accessor",o).then(function(c){r.setAttribute(a,c)})}for(let o in n){let a=ld[o]||o.toLowerCase();a in r.attributes||i.push(s(n[o],a))}if(e.indices!==void 0&&!r.index){let o=t.getDependency("accessor",e.indices).then(function(a){r.setIndex(a)});i.push(o)}return Tt.workingColorSpace!==Xt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Tt.workingColorSpace}" not supported.`),Vi(r,e),m1(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?u1(r,e.targets,t):r})}var Kn,It,zf,kf,Vf,Gf,Wf,Xf,qf,Yf,Zf,jf,Kf,Jf,Qf,$f,ed,td,nd,id,mg,za,hg,rd,sd,od,ad,vu,a1,cd,li,Eo,fg,dg,Hf,ld,Br,c1,Ff,p1,hd,Ts=cc(()=>{at();Ss();Kn=class extends Ei{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Gf(t)}),this.register(function(t){return new Wf(t)}),this.register(function(t){return new $f(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new qf(t)}),this.register(function(t){return new Yf(t)}),this.register(function(t){return new Zf(t)}),this.register(function(t){return new jf(t)}),this.register(function(t){return new Vf(t)}),this.register(function(t){return new Kf(t)}),this.register(function(t){return new Xf(t)}),this.register(function(t){return new Qf(t)}),this.register(function(t){return new Jf(t)}),this.register(function(t){return new zf(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new id(t)})}load(e,t,n,i){let s=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=hr.extractUrlBase(e);o=hr.resolveURL(l,this.path)}else o=hr.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){i?i(l):console.error(l),s.manager.itemError(e),s.manager.itemEnd(e)},c=new hs(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{s.parse(l,o,function(h){t(h),s.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,o={},a={},c=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===mg){try{o[It.KHR_BINARY_GLTF]=new rd(e)}catch(u){i&&i(u);return}s=JSON.parse(o[It.KHR_BINARY_GLTF].content)}else s=JSON.parse(c.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new hd(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){let u=s.extensionsUsed[h],f=s.extensionsRequired||[];switch(u){case It.KHR_MATERIALS_UNLIT:o[u]=new kf;break;case It.KHR_DRACO_MESH_COMPRESSION:o[u]=new sd(s,this.dracoLoader);break;case It.KHR_TEXTURE_TRANSFORM:o[u]=new od;break;case It.KHR_MESH_QUANTIZATION:o[u]=new ad;break;default:f.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};It={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},zf=class{constructor(e){this.parser=e,this.name=It.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,c=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],l,h=new Ve(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Xt);let u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new ai(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new ps(h),l.distance=u;break;case"spot":l=new oo(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),Vi(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}},kf=class{constructor(){this.name=It.KHR_MATERIALS_UNLIT}getMaterialType(){return _n}extendParams(e,t,n){let i=[];e.color=new Ve(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Xt),e.opacity=o[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,bt))}return Promise.all(i)}},Vf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}},Gf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new de(a,a)}return Promise.all(s)}},Wf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}},Xf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}},qf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[];t.sheenColor=new Ve(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Xt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,bt)),o.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}},Yf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}},Zf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new Ve().setRGB(a[0],a[1],a[2],Xt),Promise.all(s)}},jf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}},Kf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new Ve().setRGB(a[0],a[1],a[2],Xt),o.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,bt)),Promise.all(s)}},Jf=class{constructor(e){this.parser=e,this.name=It.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}},Qf=class{constructor(e){this.parser=e,this.name=It.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Jt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}},$f=class{constructor(e){this.parser=e,this.name=It.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}},ed=class{constructor(e){this.parser=e,this.name=It.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},td=class{constructor(e){this.parser=e,this.name=It.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},nd=class{constructor(e){this.name=It.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){let c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,f=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,f,i.mode,i.filter).then(function(d){return d.buffer}):o.ready.then(function(){let d=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(d),h,u,f,i.mode,i.filter),d})})}else return null}},id=class{constructor(e){this.name=It.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let l of i.primitives)if(l.mode!==li.TRIANGLES&&l.mode!==li.TRIANGLE_STRIP&&l.mode!==li.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{let h=l.pop(),u=h.isGroup?h.children:[h],f=l[0].count,d=[];for(let g of u){let E=new ke,m=new R,p=new $t,M=new R(1,1,1),x=new ot(g.geometry,g.material,f);for(let v=0;v<f;v++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,v),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,v),c.SCALE&&M.fromBufferAttribute(c.SCALE,v),x.setMatrixAt(v,E.compose(m,p,M));for(let v in c)if(v==="_COLOR_0"){let S=c[v];x.instanceColor=new Rr(S.array,S.itemSize,S.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,c[v]);Ct.prototype.copy.call(x,g),this.parser.assignFinalMaterial(x),d.push(x)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}},mg="glTF",za=12,hg={JSON:1313821514,BIN:5130562},rd=class{constructor(e){this.name=It.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,za),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==mg)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-za,s=new DataView(e,za),o=0;for(;o<i;){let a=s.getUint32(o,!0);o+=4;let c=s.getUint32(o,!0);if(o+=4,c===hg.JSON){let l=new Uint8Array(e,za+o,a);this.content=n.decode(l)}else if(c===hg.BIN){let l=za+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},sd=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=It.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(let h in o){let u=ld[h]||h.toLowerCase();a[u]=o[h]}for(let h in e.attributes){let u=ld[h]||h.toLowerCase();if(o[h]!==void 0){let f=n.accessors[e.attributes[h]],d=Eo[f.componentType];l[u]=d.name,c[u]=f.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,f){i.decodeDracoFile(h,function(d){for(let g in d.attributes){let E=d.attributes[g],m=c[g];m!==void 0&&(E.normalized=m)}u(d)},a,l,Xt,f)})})}},od=class{constructor(){this.name=It.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},ad=class{constructor(){this.name=It.KHR_MESH_QUANTIZATION}},vu=class extends or{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=i-t,u=(n-t)/h,f=u*u,d=f*u,g=e*l,E=g-l,m=-2*d+3*f,p=d-f,M=1-m,x=p-f+u;for(let v=0;v!==a;v++){let S=o[E+v+a],A=o[E+v+c]*h,C=o[g+v+a],I=o[g+v]*h;s[v]=M*S+x*A+m*C+p*I}return s}},a1=new $t,cd=class extends vu{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return a1.fromArray(s).normalize().toArray(s),s}},li={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Eo={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},fg={9728:gn,9729:Vt,9984:Rl,9985:lo,9986:xs,9987:ci},dg={33071:ri,33648:Ar,10497:hn},Hf={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},ld={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Br={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},c1={CUBICSPLINE:void 0,LINEAR:ss,STEP:rs},Ff={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};p1=new ke,hd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new o1,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&o<98?this.textureLoader=new tn(this.options.manager):this.textureLoader=new Aa(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new hs(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return ws(s,a,i),Vi(a,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let o=t[i].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,h]of o.children.entries())s(h,a.children[l])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[It.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,o){n.load(hr.resolveURL(t.uri,i.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=Hf[i.type],a=Eo[i.componentType],c=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new Rt(l,o,c))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(o){let a=o[0],c=Hf[i.type],l=Eo[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0,E,m;if(d&&d!==u){let p=Math.floor(f/d),M="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count,x=t.cache.get(M);x||(E=new l(a,p*d,i.count*d/h),x=new eo(E,d/h),t.cache.add(M,x)),m=new to(x,c,f%d/h,g)}else a===null?E=new l(i.count*c):E=new l(a,f,i.count*c),m=new Rt(E,c,g);if(i.sparse!==void 0){let p=Hf.SCALAR,M=Eo[i.sparse.indices.componentType],x=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,S=new M(o[1],x,i.sparse.count*p),A=new l(o[2],v,i.sparse.count*c);a!==null&&(m=new Rt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,I=S.length;C<I;C++){let w=S[C];if(m.setX(w,A[C*c]),c>=2&&m.setY(w,A[C*c+1]),c>=3&&m.setZ(w,A[C*c+2]),c>=4&&m.setW(w,A[C*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s],a=this.textureLoader;if(o.uri){let c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){let i=this,s=this.json,o=s.textures[e],a=s.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let f=(s.samplers||{})[o.sampler]||{};return h.magFilter=fg[f.magFilter]||Vt,h.minFilter=fg[f.minFilter]||ci,h.wrapS=dg[f.wrapS]||hn,h.wrapT=dg[f.wrapT]||hn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==gn&&h.minFilter!==Vt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=i.images[e],a=self.URL||self.webkitURL,c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;let f=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(f),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(c).then(function(u){return new Promise(function(f,d){let g=f;t.isImageBitmapLoader===!0&&(g=function(E){let m=new en(E);m.needsUpdate=!0,f(m)}),t.load(hr.resolveURL(u,s.path),g,void 0,d)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),Vi(u,o),u.userData.mimeType=o.mimeType||d1(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[It.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[It.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=s.associations.get(o);o=s.extensions[It.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,c)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new io,Yn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new no,Yn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(i||s||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),s&&(c.vertexColors=!0),o&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return Xe}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],o,a={},c=s.extensions||{},l=[];if(c[It.KHR_MATERIALS_UNLIT]){let u=i[It.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,s,t))}else{let u=s.pbrMetallicRoughness||{};if(a.color=new Ve(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let f=u.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],Xt),a.opacity=f[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",u.baseColorTexture,bt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=Mt);let h=s.alphaMode||Ff.OPAQUE;if(h===Ff.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Ff.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==_n&&(l.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new de(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;a.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&o!==_n&&(l.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==_n){let u=s.emissiveFactor;a.emissive=new Ve().setRGB(u[0],u[1],u[2],Xt)}return s.emissiveTexture!==void 0&&o!==_n&&l.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,bt)),Promise.all(l).then(function(){let u=new o(a);return s.name&&(u.name=s.name),Vi(u,s),t.associations.set(u,{materials:e}),s.extensions&&ws(i,u,s),u})}createUniqueName(e){let t=Ht.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[It.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return pg(c,a,t)})}let o=[];for(let a=0,c=e.length;a<c;a++){let l=e[a],h=f1(l),u=i[h];if(u)o.push(u.promise);else{let f;l.extensions&&l.extensions[It.KHR_DRACO_MESH_COMPRESSION]?f=s(l):f=pg(new gt,l,t),i[h]={primitive:l,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],o=s.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let h=o[c].material===void 0?l1(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){let l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let d=0,g=h.length;d<g;d++){let E=h[d],m=o[d],p,M=l[d];if(m.mode===li.TRIANGLES||m.mode===li.TRIANGLE_STRIP||m.mode===li.TRIANGLE_FAN||m.mode===void 0)p=s.isSkinnedMesh===!0?new En(E,M):new _e(E,M),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===li.TRIANGLE_STRIP?p.geometry=Bf(p.geometry,Fa):m.mode===li.TRIANGLE_FAN&&(p.geometry=Bf(p.geometry,po));else if(m.mode===li.LINES)p=new Ui(E,M);else if(m.mode===li.LINE_STRIP)p=new Ni(E,M);else if(m.mode===li.LINE_LOOP)p=new Ir(E,M);else if(m.mode===li.POINTS)p=new yi(E,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&h1(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),Vi(p,s),m.extensions&&ws(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let d=0,g=u.length;d<g;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return s.extensions&&ws(i,u[0],s),u[0];let f=new Dt;s.extensions&&ws(i,f,s),t.associations.set(f,{meshes:e});for(let d=0,g=u.length;d<g;d++)f.add(u[d]);return f})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new an(_t.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new ur(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Vi(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),o=i,a=[],c=[];for(let l=0,h=o.length;l<h;l++){let u=o[l];if(u){a.push(u);let f=new ke;s!==null&&f.fromArray(s.array,l*16),c.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new ua(a,c)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,o=[],a=[],c=[],l=[],h=[];for(let u=0,f=i.channels.length;u<f;u++){let d=i.channels[u],g=i.samplers[d.sampler],E=d.target,m=E.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,M=i.parameters!==void 0?i.parameters[g.output]:g.output;E.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",M)),l.push(g),h.push(E))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){let f=u[0],d=u[1],g=u[2],E=u[3],m=u[4],p=[];for(let x=0,v=f.length;x<v;x++){let S=f[x],A=d[x],C=g[x],I=E[x],w=m[x];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let _=n._createAnimationTracks(S,A,C,I,w);if(_)for(let b=0;b<_.length;b++)p.push(_[b])}let M=new us(s,void 0,p);return Vi(M,i),M})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let o=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=i.weights.length;c<l;c++)a.morphTargetInfluences[c]=i.weights[c]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),o=[],a=i.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));let c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(o),c]).then(function(l){let h=l[0],u=l[1],f=l[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,p1)});for(let d=0,g=u.length;d<g;d++)h.add(u[d]);return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],o=s.name?i.createUniqueName(s.name):"",a=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),s.camera!==void 0&&a.push(i.getDependency("camera",s.camera).then(function(l){return i._getNodeRef(i.cameraCache,s.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let h;if(s.isBone===!0?h=new sr:l.length>1?h=new Dt:l.length===1?h=l[0]:h=new Ct,h!==l[0])for(let u=0,f=l.length;u<f;u++)h.add(l[u]);if(s.name&&(h.userData.name=s.name,h.name=o),Vi(h,s),s.extensions&&ws(n,h,s),s.matrix!==void 0){let u=new ke;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new Dt;n.name&&(s.name=i.createUniqueName(n.name)),Vi(s,n),n.extensions&&ws(t,s,n);let o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(i.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++)s.add(c[h]);let l=h=>{let u=new Map;for(let[f,d]of i.associations)(f instanceof Yn||f instanceof en)&&u.set(f,d);return h.traverse(f=>{let d=i.associations.get(f);d!=null&&u.set(f,d)}),u};return i.associations=l(s),s})}_createAnimationTracks(e,t,n,i,s){let o=[],a=e.name?e.name:e.uuid,c=[];Br[s.path]===Br.weights?e.traverse(function(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}):c.push(a);let l;switch(Br[s.path]){case Br.weights:l=Hi;break;case Br.rotation:l=Fi;break;case Br.translation:case Br.scale:l=Oi;break;default:switch(n.itemSize){case 1:l=Hi;break;case 2:case 3:default:l=Oi;break}break}let h=i.interpolation!==void 0?c1[i.interpolation]:ss,u=this._getArrayFromAccessor(n);for(let f=0,d=c.length;f<d;f++){let g=new l(c[f]+"."+Br[s.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ud(t.constructor),i=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Fi?cd:vu;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});at();at();var mu=class extends _e{constructor(e,t={}){super(e),this.isWater=!0;let n=this,i=t.textureWidth!==void 0?t.textureWidth:512,s=t.textureHeight!==void 0?t.textureHeight:512,o=t.clipBias!==void 0?t.clipBias:0,a=t.alpha!==void 0?t.alpha:1,c=t.time!==void 0?t.time:0,l=t.waterNormals!==void 0?t.waterNormals:null,h=t.sunDirection!==void 0?t.sunDirection:new R(.70707,.70707,0),u=new Ve(t.sunColor!==void 0?t.sunColor:16777215),f=new Ve(t.waterColor!==void 0?t.waterColor:8355711),d=t.eye!==void 0?t.eye:new R(0,0,0),g=t.distortionScale!==void 0?t.distortionScale:20,E=t.side!==void 0?t.side:An,m=t.fog!==void 0?t.fog:!1,p=new Dn,M=new R,x=new R,v=new R,S=new ke,A=new R(0,0,-1),C=new At,I=new R,w=new R,_=new At,b=new ke,P=new an,U=new sn(i,s),N={name:"MirrorShader",uniforms:Fn.merge([Ge.fog,Ge.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new ke},sunColor:{value:new Ve(8355711)},sunDirection:{value:new R(.70707,.70707,0)},eye:{value:new R},waterColor:{value:new Ve(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <fog_fragment>	
				}`},H=new Nt({name:N.name,uniforms:Fn.clone(N.uniforms),vertexShader:N.vertexShader,fragmentShader:N.fragmentShader,lights:!0,side:E,fog:m});H.uniforms.mirrorSampler.value=U.texture,H.uniforms.textureMatrix.value=b,H.uniforms.alpha.value=a,H.uniforms.time.value=c,H.uniforms.normalSampler.value=l,H.uniforms.sunColor.value=u,H.uniforms.waterColor.value=f,H.uniforms.sunDirection.value=h,H.uniforms.distortionScale.value=g,H.uniforms.eye.value=d,n.material=H,n.onBeforeRender=function(V,Z,X){if(x.setFromMatrixPosition(n.matrixWorld),v.setFromMatrixPosition(X.matrixWorld),S.extractRotation(n.matrixWorld),M.set(0,0,1),M.applyMatrix4(S),I.subVectors(x,v),I.dot(M)>0)return;I.reflect(M).negate(),I.add(x),S.extractRotation(X.matrixWorld),A.set(0,0,-1),A.applyMatrix4(S),A.add(v),w.subVectors(x,A),w.reflect(M).negate(),w.add(x),P.position.copy(I),P.up.set(0,1,0),P.up.applyMatrix4(S),P.up.reflect(M),P.lookAt(w),P.far=X.far,P.updateMatrixWorld(),P.projectionMatrix.copy(X.projectionMatrix),b.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),b.multiply(P.projectionMatrix),b.multiply(P.matrixWorldInverse),p.setFromNormalAndCoplanarPoint(M,x),p.applyMatrix4(P.matrixWorldInverse),C.set(p.normal.x,p.normal.y,p.normal.z,p.constant);let z=P.projectionMatrix;_.x=(Math.sign(C.x)+z.elements[8])/z.elements[0],_.y=(Math.sign(C.y)+z.elements[9])/z.elements[5],_.z=-1,_.w=(1+z.elements[10])/z.elements[14],C.multiplyScalar(2/C.dot(_)),z.elements[2]=C.x,z.elements[6]=C.y,z.elements[10]=C.z+1-o,z.elements[14]=C.w,d.setFromMatrixPosition(X.matrixWorld);let Y=V.getRenderTarget(),J=V.xr.enabled,ne=V.shadowMap.autoUpdate;n.visible=!1,V.xr.enabled=!1,V.shadowMap.autoUpdate=!1,V.setRenderTarget(U),V.state.buffers.depth.setMask(!0),V.autoClear===!1&&V.clear(),V.render(Z,P),n.visible=!0,V.xr.enabled=J,V.shadowMap.autoUpdate=ne,V.setRenderTarget(Y);let ae=X.viewport;ae!==void 0&&V.state.viewport(ae)}}};at();var gu=class extends fs{constructor(e){super(e),this.type=qt}parse(e){let o=function(I,w){switch(I){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(w||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(w||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(w||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(w||""))}},u=function(I,w,_){w=w||1024;let P=I.pos,U=-1,N=0,H="",V=String.fromCharCode.apply(null,new Uint16Array(I.subarray(P,P+128)));for(;0>(U=V.indexOf(`
`))&&N<w&&P<I.byteLength;)H+=V,N+=V.length,P+=128,V+=String.fromCharCode.apply(null,new Uint16Array(I.subarray(P,P+128)));return-1<U?(_!==!1&&(I.pos+=N+U+1),H+V.slice(0,U)):!1},f=function(I){let w=/^#\?(\S+)/,_=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,b=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,P=/^\s*FORMAT=(\S+)\s*$/,U=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,N={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},H,V;for((I.pos>=I.byteLength||!(H=u(I)))&&o(1,"no header found"),(V=H.match(w))||o(3,"bad initial token"),N.valid|=1,N.programtype=V[1],N.string+=H+`
`;H=u(I),H!==!1;){if(N.string+=H+`
`,H.charAt(0)==="#"){N.comments+=H+`
`;continue}if((V=H.match(_))&&(N.gamma=parseFloat(V[1])),(V=H.match(b))&&(N.exposure=parseFloat(V[1])),(V=H.match(P))&&(N.valid|=2,N.format=V[1]),(V=H.match(U))&&(N.valid|=4,N.height=parseInt(V[1],10),N.width=parseInt(V[2],10)),N.valid&2&&N.valid&4)break}return N.valid&2||o(3,"missing format specifier"),N.valid&4||o(3,"missing image size specifier"),N},d=function(I,w,_){let b=w;if(b<8||b>32767||I[0]!==2||I[1]!==2||I[2]&128)return new Uint8Array(I);b!==(I[2]<<8|I[3])&&o(3,"wrong scanline width");let P=new Uint8Array(4*w*_);P.length||o(4,"unable to allocate buffer space");let U=0,N=0,H=4*b,V=new Uint8Array(4),Z=new Uint8Array(H),X=_;for(;X>0&&N<I.byteLength;){N+4>I.byteLength&&o(1),V[0]=I[N++],V[1]=I[N++],V[2]=I[N++],V[3]=I[N++],(V[0]!=2||V[1]!=2||(V[2]<<8|V[3])!=b)&&o(3,"bad rgbe scanline format");let z=0,Y;for(;z<H&&N<I.byteLength;){Y=I[N++];let ne=Y>128;if(ne&&(Y-=128),(Y===0||z+Y>H)&&o(3,"bad scanline data"),ne){let ae=I[N++];for(let Ue=0;Ue<Y;Ue++)Z[z++]=ae}else Z.set(I.subarray(N,N+Y),z),z+=Y,N+=Y}let J=b;for(let ne=0;ne<J;ne++){let ae=0;P[U]=Z[ne+ae],ae+=b,P[U+1]=Z[ne+ae],ae+=b,P[U+2]=Z[ne+ae],ae+=b,P[U+3]=Z[ne+ae],U+=4}X--}return P},g=function(I,w,_,b){let P=I[w+3],U=Math.pow(2,P-128)/255;_[b+0]=I[w+0]*U,_[b+1]=I[w+1]*U,_[b+2]=I[w+2]*U,_[b+3]=1},E=function(I,w,_,b){let P=I[w+3],U=Math.pow(2,P-128)/255;_[b+0]=vi.toHalfFloat(Math.min(I[w+0]*U,65504)),_[b+1]=vi.toHalfFloat(Math.min(I[w+1]*U,65504)),_[b+2]=vi.toHalfFloat(Math.min(I[w+2]*U,65504)),_[b+3]=vi.toHalfFloat(1)},m=new Uint8Array(e);m.pos=0;let p=f(m),M=p.width,x=p.height,v=d(m.subarray(m.pos),M,x),S,A,C;switch(this.type){case cn:C=v.length/4;let I=new Float32Array(C*4);for(let _=0;_<C;_++)g(v,_*4,I,_*4);S=I,A=cn;break;case qt:C=v.length/4;let w=new Uint16Array(C*4);for(let _=0;_<C;_++)E(v,_*4,w,_*4);S=w,A=qt;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:M,height:x,data:S,header:p.string,gamma:p.gamma,exposure:p.exposure,type:A}}setDataType(e){return this.type=e,this}load(e,t,n,i){function s(o,a){switch(o.type){case cn:case qt:o.colorSpace=Xt,o.minFilter=Vt,o.magFilter=Vt,o.generateMipmaps=!1,o.flipY=!0;break}t&&t(o,a)}return super.load(e,s,n,i)}};var xu=class extends gu{constructor(e){console.warn("RGBELoader has been deprecated. Please use HDRLoader instead."),super(e)}};at();function lg(r,e){let t=new R,n={start:new Set,end:new Set,change:new Set},i=null,s=!1,o=!1,a=0,c=0,l=0,h=0,u=0,f=0,d=0,g=0,E=1,m=new R,p=new R,M=new Ia,x=e.style.touchAction;e.style.touchAction="none";let v=N=>n[N].forEach(H=>H()),S={enabled:!0,enableRotate:!0},A={version:118,deadZone:8,radiansPerPixel:24e-5,dragging:!1,acceptedDrags:0,ignoredClicks:0,completedDrags:0,cancelled:0,yaw:0,pitch:0,maximumYaw:.18,maximumPitch:.12,damping:!1,pointer:null};function C(N=!1){if(i===null)return;let H=i,V=o;i=null,s=!1,o=!1,A.dragging=!1,A.pointer=null,N&&A.cancelled++,V?(A.completedDrags++,v("end")):A.ignoredClicks++;try{e.hasPointerCapture(H)&&e.releasePointerCapture(H)}catch{}}function I(N){if(!(!S.enabled||!S.enableRotate||i!==null||!N.isPrimary||N.button!==0)){i=N.pointerId,A.pointer=i,s=!0,o=!1,a=l=N.clientX,c=h=N.clientY,u=f=0;try{e.setPointerCapture(N.pointerId)}catch{}}}function w(N){if(i!==N.pointerId||!s||!S.enabled)return;if(N.pointerType==="mouse"&&N.buttons===0){C(!0);return}if(!o){let X=N.clientX-a,z=N.clientY-c,Y=Math.hypot(X,z);if(Y<=A.deadZone)return;l=a+X/Y*A.deadZone,h=c+z/Y*A.deadZone,m.copy(t),p.copy(r.position).sub(m),M.setFromVector3(p),E=Math.max(.001,M.radius),d=M.theta,g=M.phi,o=!0,A.dragging=!0,A.acceptedDrags++,v("start")}let H=_t.clamp(N.clientX-l,-24,24),V=_t.clamp(N.clientY-h,-24,24);l=N.clientX,h=N.clientY,u=_t.clamp(u-H*A.radiansPerPixel,-A.maximumYaw,A.maximumYaw),f=_t.clamp(f-V*2e-4,-A.maximumPitch,A.maximumPitch);let Z=Math.acos(_t.clamp((3.5-m.y)/E,-1,1));M.set(E,_t.clamp(g+f,.35,Math.min(1.75,Z)),d+u),p.setFromSpherical(M),r.position.copy(m).add(p),t.copy(m),r.lookAt(t),A.yaw=u,A.pitch=f,v("change"),N.cancelable&&N.preventDefault()}function _(N){N.pointerId===i&&C(!1)}function b(N){N.pointerId===i&&C(!0)}function P(){C(!0)}function U(){document.hidden&&C(!0)}return e.addEventListener("pointerdown",I),e.addEventListener("pointermove",w,{passive:!1}),window.addEventListener("pointerup",_,!0),window.addEventListener("pointercancel",b,!0),e.addEventListener("lostpointercapture",b),window.addEventListener("blur",P),document.addEventListener("visibilitychange",U),{target:t,debug:A,get enabled(){return S.enabled},set enabled(N){S.enabled=N,N||C(!0)},get enableRotate(){return S.enableRotate},set enableRotate(N){S.enableRotate=N,N||C(!0)},get dragging(){return o},addEventListener(N,H){n[N].add(H)},removeEventListener(N,H){n[N].delete(H)},update(){return r.lookAt(t),!1},resetInteraction(){C(!0),u=f=0,A.yaw=A.pitch=0},dispose(){C(!0),e.style.touchAction=x,e.removeEventListener("pointerdown",I),e.removeEventListener("pointermove",w),window.removeEventListener("pointerup",_,!0),window.removeEventListener("pointercancel",b,!0),e.removeEventListener("lostpointercapture",b),window.removeEventListener("blur",P),document.removeEventListener("visibilitychange",U),Object.values(n).forEach(N=>N.clear())}}}Ts();at();var Mo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};at();at();var Vn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},g1=new ur(-1,1,1,-1,0,1),fd=class extends gt{constructor(){super(),this.setAttribute("position",new Ke([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ke([0,2,0,0,2,0],2))}},x1=new fd,Gi=class{constructor(e){this._mesh=new _e(x1,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,g1)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var So=class extends Vn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Nt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Fn.clone(e.uniforms),this.material=new Nt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Gi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var ka=class extends Vn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let i=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}},yu=class extends Vn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var _u=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new de);this._width=n.width,this._height=n.height,t=new sn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:qt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new So(Mo),this.copyPass.material.blending=Mi,this.clock=new Ra}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let i=0,s=this.passes.length;i<s;i++){let o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ka!==void 0&&(o instanceof ka?n=!0:o instanceof yu&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new de);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};at();var Eu=class extends Vn{constructor(e,t,n=null,i=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ve}render(e,t,n){let i=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}};at();at();var xg={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ve(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var wo=class r extends Vn{constructor(e,t=1,n,i){super(),this.strength=t,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new de(e.x,e.y):new de(256,256),this.clearColor=new Ve(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new sn(s,o,{type:qt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new sn(s,o,{type:qt});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let f=new sn(s,o,{type:qt});f.texture.name="UnrealBloomPass.v"+h,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),o=Math.round(o/2)}let a=xg;this.highPassUniforms=Fn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Nt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new de(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Fn.clone(Mo.uniforms),this.blendMaterial=new Nt({uniforms:this.copyUniforms,vertexShader:Mo.vertexShader,fragmentShader:Mo.fragmentShader,blending:Pa,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ve,this._oldClearAlpha=1,this._basic=new _n,this._fsQuad=new Gi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,i),this.renderTargetsVertical[s].setSize(n,i),this.separableBlurMaterials[s].uniforms.invSize.value=new de(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=r.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=r.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Nt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new de(.5,.5)},direction:{value:new de(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new Nt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};wo.BlurDirectionX=new de(1,0);wo.BlurDirectionY=new de(0,1);at();var Va={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Mu=class extends Vn{constructor(){super(),this.uniforms=Fn.clone(Va.uniforms),this.material=new Sa({name:Va.name,uniforms:this.uniforms,vertexShader:Va.vertexShader,fragmentShader:Va.fragmentShader}),this._fsQuad=new Gi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Tt.getTransfer(this._outputColorSpace)===Ft&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===El?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ml?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Sl?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===wl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ao?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===bl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Tl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};at();at();var Ga={name:"SMAAEdgesShader",defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new de(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},Wa={name:"SMAAWeightsShader",defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new de(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},Su={name:"SMAABlendShader",uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new de(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`};var wu=class extends Vn{constructor(){super(),this._edgesRT=new sn(1,1,{depthBuffer:!1,type:qt}),this._edgesRT.texture.name="SMAAPass.edges",this._weightsRT=new sn(1,1,{depthBuffer:!1,type:qt}),this._weightsRT.texture.name="SMAAPass.weights";let e=this,t=new Image;t.src=this._getAreaTexture(),t.onload=function(){e._areaTexture.needsUpdate=!0},this._areaTexture=new en,this._areaTexture.name="SMAAPass.area",this._areaTexture.image=t,this._areaTexture.minFilter=Vt,this._areaTexture.generateMipmaps=!1,this._areaTexture.flipY=!1;let n=new Image;n.src=this._getSearchTexture(),n.onload=function(){e._searchTexture.needsUpdate=!0},this._searchTexture=new en,this._searchTexture.name="SMAAPass.search",this._searchTexture.image=n,this._searchTexture.magFilter=gn,this._searchTexture.minFilter=gn,this._searchTexture.generateMipmaps=!1,this._searchTexture.flipY=!1,this._uniformsEdges=Fn.clone(Ga.uniforms),this._materialEdges=new Nt({defines:Object.assign({},Ga.defines),uniforms:this._uniformsEdges,vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader}),this._uniformsWeights=Fn.clone(Wa.uniforms),this._uniformsWeights.tDiffuse.value=this._edgesRT.texture,this._uniformsWeights.tArea.value=this._areaTexture,this._uniformsWeights.tSearch.value=this._searchTexture,this._materialWeights=new Nt({defines:Object.assign({},Wa.defines),uniforms:this._uniformsWeights,vertexShader:Wa.vertexShader,fragmentShader:Wa.fragmentShader}),this._uniformsBlend=Fn.clone(Su.uniforms),this._uniformsBlend.tDiffuse.value=this._weightsRT.texture,this._materialBlend=new Nt({uniforms:this._uniformsBlend,vertexShader:Su.vertexShader,fragmentShader:Su.fragmentShader}),this._fsQuad=new Gi(null)}render(e,t,n){this._uniformsEdges.tDiffuse.value=n.texture,this._fsQuad.material=this._materialEdges,e.setRenderTarget(this._edgesRT),this.clear&&e.clear(),this._fsQuad.render(e),this._fsQuad.material=this._materialWeights,e.setRenderTarget(this._weightsRT),this.clear&&e.clear(),this._fsQuad.render(e),this._uniformsBlend.tColor.value=n.texture,this._fsQuad.material=this._materialBlend,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._fsQuad.render(e))}setSize(e,t){this._edgesRT.setSize(e,t),this._weightsRT.setSize(e,t),this._materialEdges.uniforms.resolution.value.set(1/e,1/t),this._materialWeights.uniforms.resolution.value.set(1/e,1/t),this._materialBlend.uniforms.resolution.value.set(1/e,1/t)}dispose(){this._edgesRT.dispose(),this._weightsRT.dispose(),this._areaTexture.dispose(),this._searchTexture.dispose(),this._materialEdges.dispose(),this._materialWeights.dispose(),this._materialBlend.dispose(),this._fsQuad.dispose()}_getAreaTexture(){return"data:image/png;base64,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"}_getSearchTexture(){return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="}};function Tu(r){let e=new Map,t=new Map,n=r.clone();return vg(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,o=e.get(i),a=o.skeleton.bones;s.skeleton=o.skeleton.clone(),s.bindMatrix.copy(o.bindMatrix),s.skeleton.bones=a.map(function(c){return t.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function vg(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)vg(r.children[n],e.children[n],t)}Ss();at();at();function yg(r){let t=[1100,3400,6100];for(let n=0;n<3;n++){let i=[],s=[],o=[];for(let x=0;x<=96;x++)for(let v=0;v<=768;v++){let S=-13e3+26e3*v/768,A=-t[n]+170*Math.sin(S*.0015+n)+85*Math.sin(S*.0048)+28*Math.sin(S*.012),C=x/96*6100,I=A-C,w=210+235*Math.pow(.5+.5*Math.sin(S*.0011+n*.8),1.6)+100*Math.sin(S*.0022+I*6e-4)**2,_=130*Math.sin(S*.004+I*.0018)**2+55*Math.sin(S*.008-I*.0031)**2,b=1-Math.exp(-C/580),P=.68+.32*Math.sin(C*.0021+S*.0014+n)**2,U=.2*Math.exp(-Math.pow(Math.sin(S*.0019+C*7e-4)*3.5,2)),N=-12+b*(w+_)*P*(1-U)*(1+n*.4);i.push(S,N,I);let H=new Ve(n===0?4279607:n===1?5792595:7503989);if(H.multiplyScalar(.8+.28*b+.12*Math.sin(S*.002+I*.001)),s.push(H.r,H.g,H.b),v<768&&x<96){let V=x*769+v,Z=V+768+1;o.push(V,V+1,Z,V+1,Z+1,Z)}}let h=[];for(let x=0;x<=768;x++)h.push(x);for(let x=1;x<=96;x++)h.push(x*769+768);for(let x=767;x>=0;x--)h.push(96*769+x);for(let x=95;x>0;x--)h.push(x*769);let u=i.length/3;for(let x of h)i.push(i[x*3],-70,i[x*3+2]),s.push(s[x*3]*.65,s[x*3+1]*.65,s[x*3+2]*.65);for(let x=0;x<h.length;x++){let v=(x+1)%h.length;o.push(h[x],u+x,h[v],h[v],u+x,u+v)}let f=i.length/3;i.push(0,-70,-t[n]-6100/2),s.push(.08,.1,.07);for(let x=0;x<h.length;x++)o.push(f,u+(x+1)%h.length,u+x);let d=new gt;d.setAttribute("position",new Ke(i,3)),d.setAttribute("color",new Ke(s,3)),d.setIndex(o),d.computeVertexNormals();let g=d.getAttribute("normal"),E=d.getAttribute("position"),m=d.getAttribute("color");for(let x=0;x<u;x++){let v=g.getX(x),S=g.getY(x),A=g.getZ(x),C=E.getX(x),I=E.getY(x),w=E.getZ(x),_=.46+.4*Math.max(0,S)+.24*Math.max(0,v*.62+S*.55+A*.56),b=.9+.1*Math.sin(C*.007+w*.004)*Math.sin(C*.003-w*.008),P=_t.smoothstep(I,210+n*100,490+n*150)*(1-_t.smoothstep(S,.72,.96))*.42;m.setXYZ(x,(m.getX(x)*(1-P)+.29*P)*_*b,(m.getY(x)*(1-P)+.27*P)*_*b,(m.getZ(x)*(1-P)+.21*P)*_*b)}let p=new Xe({vertexColors:!0,roughness:.98,envMapIntensity:.025,emissive:16777215,emissiveIntensity:.085});p.onBeforeCompile=x=>{x.fragmentShader=x.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
#ifdef USE_COLOR
 totalEmissiveRadiance*=vColor;
#endif`)},p.customProgramCacheKey=()=>"continental-sky-bounce-v32-75";let M=new _e(d,p);M.name="Closed continent "+n+" / rounded ridges, valleys, shoreline and submerged sides",r.add(M)}return{width:26e3,distances:t,closedVolumes:!0}}function _g(r){let e=new Dt;e.name="Continuous distant continental shelf / three atmospheric distances",r.add(e);let t=yg(e),n=731829,i=()=>(n=Math.imul(n,1664525)+1013904223|0,(n>>>0)/4294967296),s=Float32Array.from({length:1200*3},(g,E)=>E%3===0?(i()-.5)*240:E%3===1?i()*65:-180+i()*210),o=new gt;o.setAttribute("position",new Rt(s,3));let a={value:0},c=new Nt({transparent:!0,depthWrite:!1,uniforms:{time:a},vertexShader:"uniform float time;varying float alpha;void main(){vec3 p=position;p.x+=sin(time*.08+p.z*.014)*2.;p.y=mod(p.y+time*.12,65.);vec4 view=modelViewMatrix*vec4(p,1.);alpha=.13*(1.-smoothstep(25.,70.,p.y));gl_PointSize=clamp(75./max(1.,-view.z),.6,2.2);gl_Position=projectionMatrix*view;}",fragmentShader:"varying float alpha;void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(.69,.70,.59,alpha*(1.-smoothstep(.12,.5,r)));}"}),l=new yi(o,c);l.name="Depth tested sparse sea aerosols",r.add(l);let h=[];for(let g=0;g<320;g++){let E=(i()-.5)*200,m=i()*64,p=-155+i()*180;h.push(E,m,p,E+.02,m-.23,p)}let u=new gt;u.setAttribute("position",new Ke(h,3));let f=new Nt({transparent:!0,depthWrite:!1,uniforms:{time:a},vertexShader:"uniform float time;void main(){vec3 p=position;p.y=mod(p.y-time*5.5+10000.,65.);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}",fragmentShader:"void main(){gl_FragColor=vec4(.55,.63,.62,.075);}"}),d=new Ui(u,f);return d.name="Sparse fine rain through three-dimensional air",r.add(d),{continentalWidth:t.width,distances:t.distances,closedVolumes:t.closedVolumes,rainDrops:320,aerosols:1200,update:g=>{a.value=g}}}at();var bu=class extends So{constructor(t){let n=new Uint8Array(36992),i=1829,s=Uint8Array.from({length:32**3},()=>(i=Math.imul(i,1664525)+1013904223|0,i>>>24));for(let a=0;a<32;a++)for(let c=-1;c<=32;c++)for(let l=-1;l<=32;l++){let h=(l+32)%32,u=(c+32)%32;n[(Math.floor(a/8)*34+c+1)*272+a%8*34+l+1]=s[a*1024+u*32+h]}let o=new $n(n,272,136,wi);o.minFilter=o.magFilter=Vt,o.generateMipmaps=!1,o.needsUpdate=!0;super({uniforms:{tDiffuse:{value:null},depthMap:{value:null},resolution:{value:new de},noiseField:{value:o},inverseProjection:{value:new ke},cameraWorld:{value:new ke},eye:{value:new R},time:{value:0}},vertexShader:"varying vec2 uvScreen;void main(){uvScreen=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`uniform sampler2D tDiffuse,depthMap,noiseField;uniform mat4 inverseProjection,cameraWorld;uniform vec3 eye;uniform vec2 resolution;uniform float time;varying vec2 uvScreen;
      vec3 depthPoint(vec2 uv){float d=texture2D(depthMap,uv).x;vec4 v=inverseProjection*vec4(uv*2.-1.,d*2.-1.,1.);v/=v.w;return(cameraWorld*v).xyz;}
      float noise(vec3 p){p=mod(p,32.);float z=floor(p.z),next=mod(z+1.,32.);
      vec2 a=(vec2(mod(z,8.),floor(z/8.))*34.+p.xy+1.5)/vec2(272.,136.);
      vec2 b=(vec2(mod(next,8.),floor(next/8.))*34.+p.xy+1.5)/vec2(272.,136.);
      return mix(texture2D(noiseField,a).r,texture2D(noiseField,b).r,fract(p.z));}
      void main(){vec4 image=texture2D(tDiffuse,uvScreen);float depth=texture2D(depthMap,uvScreen).x;
      vec4 p=inverseProjection*vec4(uvScreen*2.-1.,depth*2.-1.,1.);p/=p.w;p=cameraWorld*p;
      vec3 direction=normalize(p.xyz-eye);float totalDistance=length(p.xyz-eye),reach=min(totalDistance,1800.),stepSize=reach/24.;float transmission=1.;vec3 scatter=vec3(0.);
      // Keep low sea banks dense; clear higher continental slopes enough to reveal their own relief.
      float continental=smoothstep(700.,1200.,totalDistance)*smoothstep(20.,110.,p.y)*(1.-step(.999998,depth));
      float sunFacing=max(dot(direction,normalize(vec3(-45.,35.,-160.))),0.);
      float sun=pow(sunFacing,12.);
      // Local materials need readable illumination; distant sea banks retain the original fog.
      float nearLand=smoothstep(.35,3.2,p.y)*(1.-smoothstep(180.,520.,totalDistance))*(1.-step(.999998,depth));
      for(int j=0;j<24;j++){float distance=(float(j)+.5)*stepSize;vec3 world=eye+direction*distance;
      float cloud=noise(world*vec3(.020,.072,.027)+vec3(time*.009,0.,0.))*.65+noise(world*.061)*.35;
      float bankHeight=6.0+3.2*sin(world.x*.019+time*.045)+2.0*sin(world.z*.013-time*.035);
      float lowBank=exp(-pow((world.y-bankHeight)*.095,2.));
      float density=(.0026*exp(-max(world.y,0.)*.027)+.0065*lowBank)*smoothstep(16.,80.,distance)*(.28+cloud*1.12);
      density*=mix(1.,.66,continental);
      density*=mix(1.,.09,nearLand);
      vec3 fog=mix(vec3(.035,.063,.060),vec3(.94,.42,.078),sun*(.42+cloud*.58));
      fog+=vec3(.061,.035,.010)*pow(sunFacing,4.)*lowBank;
      float absorb=1.-exp(-density*stepSize);scatter+=transmission*absorb*fog;transmission*=1.-absorb;}
      // Stable depth-aware contact occlusion. Never darken the sky or distant horizon.
      vec3 surfaceNormal=normalize(cross(dFdx(p.xyz),dFdy(p.xyz)));if(dot(surfaceNormal,eye-p.xyz)<0.)surfaceNormal=-surfaceNormal;
      float contact=0.;float radiusPixels=clamp(resolution.y*.8/max(4.,totalDistance),3.,20.);
      for(int k=0;k<8;k++){float angle=(float(k)+.375)*2.399963;vec2 sampleUv=uvScreen+vec2(cos(angle),sin(angle))*radiusPixels/resolution;
       vec3 delta=depthPoint(clamp(sampleUv,vec2(.001),vec2(.999)))-p.xyz;float dist=length(delta);
       contact+=max(0.,dot(surfaceNormal,delta)/max(dist,.001)-.09)*(1.-smoothstep(.15,2.4,dist));}
      float occlusion=1.-.48*contact/8.*(1.-step(.9999,depth))*(1.-smoothstep(200.,430.,totalDistance));
      vec3 color=image.rgb*occlusion*transmission+scatter;
      float farSea=smoothstep(135.,390.,totalDistance)*exp(-abs(direction.y)*4.);
      vec3 horizonHaze=mix(vec3(.062,.087,.077),vec3(.54,.275,.085),pow(sunFacing,4.));
      float land=smoothstep(1.,24.,p.y);float aerial=1.-exp(-max(0.,totalDistance-300.)*.00065);
      color=mix(color,horizonHaze,max(farSea*mix(.50,.20,land),aerial*mix(.84,.62,land)));
      float distantHorizon=(1.-smoothstep(.002,.07,abs(direction.y)))*smoothstep(160.,350.,totalDistance);
      color=mix(color,horizonHaze,distantHorizon*(1.-land)*.85);
      // Grade in scene-linear space; OutputPass applies AgX and the display transform once.
      color=mix(color,image.rgb*occlusion,nearLand*.80);
      float luminance=dot(color,vec3(.2126,.7152,.0722));
      float highlight=smoothstep(.12,.85,luminance);
      color*=mix(vec3(.94,1.015,1.035),vec3(1.055,1.,.91),highlight);
      color=.18*pow(max(color/.18,vec3(.00001)),vec3(1.075));
      color=mix(vec3(dot(color,vec3(.2126,.7152,.0722))),color,1.025);
      color=max(color,vec3(0.));
      // A mild optical falloff frames the scene; distant geometry is hidden by depth haze above.
      vec2 frame=uvScreen*2.-1.;float vignette=1.-.17*smoothstep(.35,1.32,length(frame));
      gl_FragColor=vec4(color*vignette,image.a);}`});this.view=t}render(t,n,i,s,o){this.uniforms.depthMap.value=i.depthTexture,this.uniforms.resolution.value.set(i.width,i.height),this.uniforms.inverseProjection.value.copy(this.view.projectionMatrixInverse),this.uniforms.cameraWorld.value.copy(this.view.matrixWorld),this.uniforms.eye.value.copy(this.view.position),super.render(t,n,i,s,o)}};at();function Eg(r){let e=[],t=new Xe({color:2371116,roughness:.86,side:Mt}),n=new Xe({color:9870225,roughness:.9}),i=new Un(1,12,8);for(let s=0;s<11;s++){let o=new Dt;o.name="Travelling articulated seabird",r.add(o);let a=new _e(i,n);a.scale.set(.14,.13,.39),o.add(a);let c=new _e(i,n);c.position.set(0,.12,-.35),c.scale.set(.1,.1,.13),o.add(c);let l=new _e(new Lr(.035,.19,6),t);l.rotation.x=-Math.PI/2,l.position.set(0,.1,-.51),o.add(l);let h=[],u=[];for(let E of[-1,1]){let m=new Dt;o.add(m),h.push(m);let p=new gt;p.setAttribute("position",new Ke([0,.025,-.17,E*.52,.055,-.2,E*.98,.015,.03,E*.66,0,.23,0,0,.19],3)),p.setIndex([0,1,3,1,2,3,0,3,4]),p.computeVertexNormals(),m.add(new _e(p,t));let M=new Dt;M.position.set(E*.9,0,.04),m.add(M),u.push(M);let x=new gt;x.setAttribute("position",new Ke([0,0,-.06,E*.55,.015,.08,E*.68,0,.2,E*.42,0,.32,-E*.22,0,.18],3)),x.setIndex([0,1,4,1,2,3,1,3,4]),x.computeVertexNormals(),M.add(new _e(x,t))}let f=new _e(new Lr(.19,.31,3),t);f.rotation.x=Math.PI/2,f.position.z=.43,o.add(f);let d=s>=8;o.scale.setScalar((d?.94:.72)+s%3*.12);let g=d?new R(-40+(s-8)*5,32+(s-8)*1.8,-91-(s-8)*6):new R(-12+s*1.8,12+s%4*2.4,-15-s*3.4);e.push({root:o,wings:h,tips:u,origin:g,phase:s*.81,radius:d?18:18+s%4*3})}return Au(e,0),e}function Au(r,e){for(let t of r){let n=e*(.23+.015*Math.sin(t.phase))+t.phase,i=.23+.015*Math.sin(t.phase),s=t.radius*.72;t.root.position.set(t.origin.x+Math.sin(n)*t.radius,t.origin.y+1.1*Math.sin(n*2)+.16*Math.sin(e*6+t.phase),t.origin.z+Math.cos(n)*s);let o=Math.cos(n)*t.radius*i,a=-Math.sin(n)*s*i;t.root.rotation.set(.07*Math.cos(n*2),Math.atan2(-o,-a),-.2*Math.sin(n));let c=.16+.84*_t.smoothstep(.5+.5*Math.sin(e*.47+t.phase),.16,.48),l=e*(6.4+.35*Math.sin(t.phase))+t.phase;t.wings.forEach((h,u)=>{let f=u===0?-1:1;h.rotation.z=f*(.12+.83*Math.sin(l)*c),t.tips[u].rotation.z=f*.32*Math.sin(l-.65)*c})}}function v1(r,e,t){let n=new Xe({map:r,normalMap:e,roughnessMap:t,roughness:.98,color:9144440,envMapIntensity:.18});return n.onBeforeCompile=i=>{i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
      varying vec3 vRockPosition;varying vec3 vRockNormal;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
      vRockPosition=(modelMatrix*vec4(transformed,1.)).xyz;
      vRockNormal=inverseTransformDirection(transformedNormal,viewMatrix);`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vRockPosition;varying vec3 vRockNormal;
      vec3 rockWeights(){vec3 w=pow(abs(normalize(vRockNormal)),vec3(4.));return w/max(dot(w,vec3(1.)),.0001);}
      vec4 rockSample(sampler2D surface){vec3 p=vRockPosition*.38,w=rockWeights();
        return texture2D(surface,p.yz)*w.x+texture2D(surface,p.xz)*w.y+texture2D(surface,p.xy)*w.z;}`).replace("#include <map_fragment>",`diffuseColor*=rockSample(map);
        float mineral=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(mineral*.86,mineral*.98,mineral*.93),.48);
        float wet=1.-smoothstep(1.,9.,vRockPosition.y);diffuseColor.rgb*=1.-wet*.27;`).replace("#include <roughnessmap_fragment>",`float roughnessFactor=.82+.16*rockSample(roughnessMap).g;
        roughnessFactor=max(roughnessFactor,.68);`).replace("#include <normal_fragment_maps>",`vec3 pRock=vRockPosition*.38,wRock=rockWeights(),sRock=sign(vRockNormal);
        vec3 nx=texture2D(normalMap,pRock.yz).xyz*2.-1.;
        vec3 ny=texture2D(normalMap,pRock.xz).xyz*2.-1.;
        vec3 nz=texture2D(normalMap,pRock.xy).xyz*2.-1.;
        vec3 rockyNormal=normalize(vec3(nx.z*sRock.x,nx.x*.65,nx.y*.65)*wRock.x+
          vec3(ny.x*.65,ny.z*sRock.y,ny.y*.65)*wRock.y+vec3(nz.x*.65,nz.y*.65,nz.z*sRock.z)*wRock.z);
        normal=normalize(mix(normal,mat3(viewMatrix)*rockyNormal,.62));`)},n.customProgramCacheKey=()=>"weathered-triplanar-rock-v32-67",n}function Mg(r,e,t){let n=v1(r,e,t);n.color.set(11578528);let i=n.onBeforeCompile;return n.onBeforeCompile=(s,o)=>{i(s,o),s.fragmentShader=s.fragmentShader.replace("float wet=1.-smoothstep(1.,9.,vRockPosition.y);diffuseColor.rgb*=1.-wet*.27;","float wet=1.-smoothstep(.2,2.4,vRockPosition.y);diffuseColor.rgb*=1.-wet*.35;").replace("roughnessFactor=max(roughnessFactor,.68);","float tidalWet=1.-smoothstep(.2,2.4,vRockPosition.y);roughnessFactor=mix(.32,max(roughnessFactor,.78),1.-tidalWet);").replace("mat3(viewMatrix)*rockyNormal,.62","mat3(viewMatrix)*rockyNormal,.42")},n.customProgramCacheKey=()=>"fractured-coastal-grain-v32-67",n}function Sg(r,e,t,n,i){r.traverse(s=>{if(!(s instanceof _e))return;s.castShadow=!0,s.receiveShadow=!0;let o=a=>{if(!(a instanceof Xe))return a;let c=a.clone();if(/woven tunic|travelling mantle/.test(c.name)){let l=/mantle/.test(c.name);c.color.set(l?9318438:12167822),c.map=e,c.normalMap=t,c.roughnessMap=n,c.normalScale.set(.48,.48),c.roughness=.92,c instanceof Jt&&(c.sheen=.24,c.sheenColor.set(11115397),c.sheenRoughness=.85),/hem|mantle/.test(s.name)&&(c.onBeforeCompile=u=>{u.uniforms.clothTime=i,u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
uniform float clothTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
              float freeHem=1.-smoothstep(.38,1.38,position.y);
              transformed.z+=sin(position.x*19.+clothTime*2.1)*freeHem*.018;
              transformed.x+=sin(position.y*8.-clothTime*1.4)*freeHem*.008;`)},c.customProgramCacheKey=()=>"odyssey-rigged-cloth-v32-64")}else/^Human\.(body|nipple|lips|fingernails|toenails|ears)$/.test(c.name)?(c.transparent=!1,c.depthWrite=!0,c.alphaTest=0,c.roughness=.62,c.color.set(14534061),c instanceof Jt&&(c.clearcoat=0,c.clearcoatRoughness=1)):/^Human\./.test(c.name)&&(c.alphaTest=.35,c.depthWrite=!0,c.roughness=.83);return c};s.material=Array.isArray(s.material)?s.material.map(o):o(s.material)})}at();Ss();at();var Ru=r=>r-Math.floor(r),Hr=(r,e,t)=>Ru(Math.sin(r*127.1+e*311.7+t*74.7)*43758.5453);function dd(r,e,t){let n=Math.floor(r),i=Math.floor(e),s=Math.floor(t),o=Ru(r),a=Ru(e),c=Ru(t);o=o*o*(3-2*o),a=a*a*(3-2*a),c=c*c*(3-2*c);let l=_t.lerp;return l(l(l(Hr(n,i,s),Hr(n+1,i,s),o),l(Hr(n,i+1,s),Hr(n+1,i+1,s),o),a),l(l(Hr(n,i,s+1),Hr(n+1,i,s+1),o),l(Hr(n,i+1,s+1),Hr(n+1,i+1,s+1),o),a),c)}function Fr(r=1,e=0){let t=new Un(r,48,32),n=t.attributes.position;for(let i=0;i<n.count;i++){let s=n.getX(i)/r,o=n.getY(i)/r,a=n.getZ(i)/r,c=r*(1+(dd(s*2.2+e,o*2.2,a*2.2)-.5)*.43+(dd(s*6.1,o*6.1+e,a*6.1)-.5)*.13+(dd(s*17,o*17,a*17+e)-.5)*.035);n.setXYZ(i,s*c,o*c,a*c)}return t.computeVertexNormals(),t}var y1=new Un(1,18,12),bg=new vn(1,1,1,8),Gn=new Ct;function Wi(r,e,t,n,i=[1,1,1],s="Solid narrative detail"){let o=new _e(e,t);return o.position.fromArray(n),o.scale.fromArray(i),o.castShadow=o.receiveShadow=!0,o.name=s,r.add(o),o}function Cu(r,e,t,n,i){return Wi(r,y1,e,t,n,i)}function Ag(r,e,t,n,i,s){let o=n.clone().sub(t),a=Wi(r,bg,e,t.clone().add(n).multiplyScalar(.5).toArray(),[i,o.length(),i],s);return a.quaternion.setFromUnitVectors(new R(0,1,0),o.normalize()),a}function Rg(r){let e=new Map;for(let t of[...r.children])if(t instanceof _e&&!Array.isArray(t.material)&&!(t instanceof ot)&&!(t instanceof En)){let n=e.get(t.material)??[];n.push(t),e.set(t.material,n)}for(let[t,n]of e){if(n.length<2)continue;let i=n.map(o=>(o.updateMatrix(),(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrix))),s=Ti(i);if(!s)throw Error("Story geometry batch failed");n.forEach(o=>r.remove(o)),i.forEach(o=>o.dispose()),Wi(r,s,t,[0,0,0],[1,1,1],"Batched narrative sculpture and equipment")}}function wg(r,e,t,n,i,s,o){Cu(r,s,[e,t+.52*i,n],[.54*i,.4*i,.26*i],"Sheep fleece"),Cu(r,o,[e-.49*i,t+.63*i,n],[.2*i,.24*i,.14*i],"Sheep face");for(let a of[-.32,.29])for(let c of[-1,1])Ag(r,o,new R(e+a*i,t+.35*i,n+c*.16*i),new R(e+a*i,t+.025,n+c*.16*i),.035*i,"Sheep leg");for(let a of[-1,1])Cu(r,s,[e-.48*i,t+.82*i,n+a*.18*i],[.1*i,.045*i,.085*i],"Sheep folded ear")}function Xa(r,e,t,n=0,i=0){let s=Tu(r),o=new Map;s.traverse(u=>{u instanceof sr&&o.set(u.name,u),/torch|wick/i.test(u.name)&&(u.visible=!1)});let a=(u,f,d)=>{let g=o.get(Ht.sanitizeNodeName(u)),E=o.get(Ht.sanitizeNodeName(f));if(!g||!E||!g.parent)throw Error("Sailor pose joint missing: "+u);s.updateMatrixWorld(!0);let m=E.getWorldPosition(new R).sub(g.getWorldPosition(new R)).normalize(),p=new $t().setFromUnitVectors(m,d.normalize()),M=g.getWorldQuaternion(new $t),x=g.parent.getWorldQuaternion(new $t);g.quaternion.copy(x.invert()).multiply(p).multiply(M)};if(a("upperarm01.R","lowerarm01.R",new R(t?.45:-.34,-.7,.35)),a("lowerarm01.R","wrist.R",new R(.12,-.25,.7)),a("upperarm01.L","lowerarm01.L",new R(-.25,-.74,.33)),a("lowerarm01.L","wrist.L",new R(-.12,-.43,.5)),n)for(let u of["L","R"])a(`upperleg01.${u}`,`lowerleg01.${u}`,new R(u==="L"?-.16:.16,-.045,.98)),a(`lowerleg01.${u}`,`foot.${u}`,new R(0,-.99,.04)),a(`upperarm01.${u}`,`lowerarm01.${u}`,new R(-n*.7,-.38,.23+i*.55)),a(`lowerarm01.${u}`,`wrist.${u}`,new R(-n*.72,-.19,.43+i*.7));let c=o.get("head");c&&c.rotateY(t?-.3:.7),s.updateMatrixWorld(!0),s.traverse(u=>{u instanceof En&&u.skeleton.update()});let l=new Dt,h=new Map;return s.traverse(u=>{if(!(u instanceof _e)||!u.visible)return;for(let m=u.parent;m&&m!==s;m=m.parent)if(!m.visible)return;let f=u.geometry.clone(),d=f.attributes.position;if(u instanceof En){for(let m=0;m<d.count;m++){let p=new R().fromBufferAttribute(d,m);u.applyBoneTransform(m,p),d.setXYZ(m,p.x,p.y,p.z)}f.deleteAttribute("skinIndex"),f.deleteAttribute("skinWeight"),f.computeVertexNormals()}f.applyMatrix4(u.matrixWorld);let g=m=>{if(h.has(m))return h.get(m);let p=m.clone();return p instanceof Xe&&(p.roughness=.91,/tunic|linen|hem/.test(p.name)&&(p.map=e,p.color.set(t?11706497:13813677),p.roughness=.94),/mantle/.test(p.name)&&(p.map=e,p.color.set(t?7423799:9059373),p.roughness=.98),/leather/.test(p.name)&&(p.color.set(5058592),p.roughness=.83),/^Human\.(body|nipple|lips|fingernails|toenails|ears)/.test(p.name)?(p.transparent=!1,p.depthWrite=!0,p.alphaTest=0,p.color.set(12953734),p.roughness=.81):/^Human\./.test(p.name)&&(p.alphaTest=.35,p.depthWrite=!0),p instanceof Jt&&(p.transmission=0,p.clearcoat=0)),h.set(m,p),p},E=new _e(f,Array.isArray(u.material)?u.material.map(g):g(u.material));E.castShadow=E.receiveShadow=!0,l.add(E)}),l}var Tg=new WeakMap;function _1(r,e,t){let n=Tg.get(r);if(n||(n=new Map,Tg.set(r,n)),n.has(t))return n.get(t);let i=Xa(r,e,!1,t,0),s=Xa(r,e,!1,t,.85),o=Xa(r,e,!1,t,-.85),a=i.children.filter(c=>c instanceof _e);return a.forEach((c,l)=>{let h=s.children[l],u=o.children[l];c.geometry.morphAttributes.position=[h.geometry.attributes.position.clone(),u.geometry.attributes.position.clone()],c.geometry.morphAttributes.normal=[h.geometry.attributes.normal.clone(),u.geometry.attributes.normal.clone()],c.updateMorphTargets()}),n.set(t,a),a}function Cg(r,e,t,n,i,s=0){let o=new Dt;r.add(o);let a=new Xe({color:2695452,roughness:.94}),c=new Xe({color:12499105,roughness:1}),l=[];for(let p=0;p<6;p++)for(let M of[-1,1]){let x=-3.65+p*1.36,v=M*.95;l.push({x,side:M,phase:i+p*(.1+s*.025)+(s?M*.13:0),build:s?.94+(p+s*2)%4*.025:1})}let h=new Xe({color:8802615,roughness:.93});for(let p=0;p<(s===2?2:s===3?8:5);p++){let M=-5.25+p%2*.47,x=-.53+Math.floor(p/2)*.43,v=[new de(.04,0),new de(.22,.16),new de(.25,.4),new de(.14,.59),new de(.1,.64),new de(.115,.68)];Wi(o,new Ma(v,20),h,[M,.35,x],[1,1,1],"Storage amphora");for(let S of[-1,1])Wi(o,new Ur(.1,.022,6,16,Math.PI),h,[M+S*.14,.88,x],[1,1,1],"Amphora loop handle").rotation.z=S*Math.PI/2}if(s<2&&(wg(o,5.04,.35,-.52,.78,c,a),wg(o,5.1,.35,.41,.72,c,a)),s===3)for(let p=0;p<3;p++)Wi(o,new vn(.31,.34,.64,12),e,[5.2,.67,-.8+p*.8],[1,1,1],"Provision barrels");let u=Xa(n,t,!0);u.name="Stern helmsman operating paired steering oars",u.position.set(6.65,1.95,.2),u.rotation.y=-Math.PI/2,r.add(u);let f=Xa(n,t,!1);if(f.name=s?"Escort lookout watching the coast":"Companion looking back to warn Ulysses",f.position.set(-6.02,1.71,s===2?-.9:1.28),f.rotation.y=s?[-.3,.35,-1.2,.65][s]:2,r.add(f),s>0)for(let p of[f,u])p.traverse(M=>{if(M instanceof _e){let x=v=>{let S=v.clone();return S instanceof Xe&&(/tunic|linen|mantle/.test(S.name)&&S.color.set([16777215,10127200,7636860,10185043][s]),/^Human\.body/.test(S.name)&&S.color.multiplyScalar(.83+s*.035)),S};M.material=Array.isArray(M.material)?M.material.map(x):x(M.material)}});for(let p of[-1,1]){let M=new R(7.05,2.44,p*.4),x=new R(8.15,-.45,p*2.7);Ag(o,e,M,x,.063,"Stern steering sweep"),Wi(o,new xn(.31,1.35,.085),e,x.toArray()).quaternion.setFromUnitVectors(new R(0,1,0),x.clone().sub(M).normalize())}Rg(o);let d=[];for(let p of[-1,1]){let M=l.map((x,v)=>x.side===p?v:-1).filter(x=>x>=0);for(let x of _1(n,t,p)){let v=new ot(x.geometry,x.material,M.length);if(v.name="Anatomical seated sailor / linen tunic, wool mantle, leather belt and shoes",v.frustumCulled=!1,v.castShadow=v.receiveShadow=!0,v.instanceMatrix.setUsage(lu),s>0){let A=C=>{let I=C.clone();return I instanceof Xe&&/mantle/.test(I.name)&&I.color.set([16777215,7955266,5466468,8409926][s]),I};v.material=Array.isArray(x.material)?x.material.map(A):A(x.material)}let S=Array.isArray(x.material)?x.material[0]:x.material;/tunic|linen|hem/.test(S.name)&&M.forEach((A,C)=>v.setColorAt(C,new Ve([13616299,10586984,11576717,9203799][(A+s)%4]))),r.add(v),d.push({mesh:v,rows:M,pose:x})}}let g=new ot(bg,e,l.length),E=new ot(new xn(.31,1,.065),e,l.length);for(let p of[g,E])p.instanceMatrix.setUsage(lu),p.castShadow=p.receiveShadow=!0,p.frustumCulled=!1,r.add(p);let m={rowers:l,people:l.length+2,figures:d,shafts:g,blades:E};return pd(m,0),m}function E1(r,e,t,n,i){let s=n.clone().sub(t);Gn.position.copy(t).add(n).multiplyScalar(.5),Gn.quaternion.setFromUnitVectors(new R(0,1,0),s.clone().normalize()),Gn.scale.set(i,s.length(),i),Gn.updateMatrix(),r.setMatrixAt(e,Gn.matrix)}function pd(r,e){r.rowers.forEach((t,n)=>{let i=e*1.35+t.phase,s=Math.sin(i)*.58,o=.2*Math.cos(i),a=new R(t.x+s,1.07,t.side*1.57),c=new R(t.x-s*2.45,.12+o,t.side*5.18);E1(r.shafts,n,a,c,.044),Gn.position.copy(c),Gn.quaternion.setFromUnitVectors(new R(0,1,0),c.clone().sub(a).normalize()),Gn.scale.set(1,1,1),Gn.updateMatrix(),r.blades.setMatrixAt(n,Gn.matrix)});for(let t of r.figures)t.rows.forEach((n,i)=>{let s=r.rowers[n],o=Math.sin(e*1.35+s.phase);Gn.position.set(s.x,.07,s.side*.95),Gn.rotation.set(0,Math.PI/2,-.055*o),Gn.scale.set(s.build,s.build,1),Gn.updateMatrix(),t.mesh.setMatrixAt(i,Gn.matrix),t.pose.morphTargetInfluences[0]=Math.max(0,o),t.pose.morphTargetInfluences[1]=Math.max(0,-o),t.mesh.setMorphAt(i,t.pose)}),t.mesh.instanceMatrix.needsUpdate=!0,t.mesh.morphTexture&&(t.mesh.morphTexture.needsUpdate=!0);for(let t of[r.shafts,r.blades])t.instanceMatrix.needsUpdate=!0}function Ig(r,e,t,n){return{footprint:new At(e.position.x,e.position.z,t*e.scale.x,n*e.scale.z),heading:new de(1,0)}}function Pg(r,e,t){r.footprint.x=e.position.x,r.footprint.y=e.position.z,r.heading.set(Math.cos(e.rotation.y),-Math.sin(e.rotation.y))}function Lg(r,e,t,n,i,s){let o=new Dt;o.name="Polyphemus island / cave, flock and discarded stake",r.add(o);let a=new Xe({color:1120016,roughness:1}),c=new Xe({color:10460037,roughness:1}),l=new Xe({color:2630938,roughness:.94}),h=s.root;if(h.updateMatrixWorld(!0),!h.userData.nativeHeldRock){let E=new _e(Fr(.062,8),e);E.scale.set(1.12,.9,1.1),E.castShadow=E.receiveShadow=!0,E.name="Weathered stone gripped above the island",s.heldRockAnchor.add(E)}if(!h.userData.nativeFootReef){let E=Fr(1,31);Wi(o,E,e,[-49,-.15,-111],[17,5.5,12],"Continuous island terrace beneath both Cyclops feet")}for(let[E,m,p]of[[-31,-59,3.7],[-13,-72,2.9],[39,-94,2.5]]){let M=Fr(1,E*.41);Wi(o,M,e,[E,.6,m],[p,p*.8,p*1.2],"Fractured hurled rock in the escape channel")}Rg(o);let u=new Dt;u.name="Turner flying fish near the escaping bow",r.add(u);let f=new Xe({color:8558731,metalness:.22,roughness:.46}),d=new Xe({color:9280904,roughness:.77,side:Mt}),g=[];for(let E=0;E<7;E++){let m=new Dt;u.add(m),Cu(m,f,[0,0,0],[.31,.055,.069],"Flying fish body");for(let p of[-1,1]){let M=new gt;M.setAttribute("position",new Ke([-.06,0,p*.02,-.19,.015,p*.37,.09,.012,p*.11],3)),M.computeVertexNormals(),Wi(m,M,d,[0,0,0])}g.push({root:m,phase:E*.8})}return{labels:["open galley rowing wells and visible crews","amphorae and rescued sheep","paired stern steering sweeps","natural eroded island shelf and flock","upright Polyphemus on a continuous island","fractured rocks in the escape channel","Turner flying fish"],giantPose:()=>({body:h.position.toArray(),hand:h.localToWorld(s.rightHand.clone()).toArray()}),update:E=>{g.forEach((m,p)=>{let M=E*.45+m.phase;m.root.position.set(-19+Math.sin(M)*2.7-p*.5,.3+Math.max(0,Math.sin(M*1.7))*1.2,7+p*.62),m.root.rotation.set(0,.24,-.2*Math.cos(M*1.7))})}}}at();Ts();at();at();function Dg(r,e,t,n){let i=78041,s=()=>(i=Math.imul(i,1664525)+1013904223|0,(i>>>0)/4294967296),o=new Nr(1,1),a=o.getAttribute("position");for(let ae=0;ae<a.count;ae++){let Ue=a.getX(ae),xe=a.getY(ae),j=a.getZ(ae),re=1+.055*Math.sin(Ue*12+j*9)*Math.cos(xe*13);a.setXYZ(ae,Ue*re,xe*re,j*re)}let c=[],l=[],h=[];for(let ae=0;ae<90;ae++){let Ue=s()*Math.PI*2,xe=s()*2-1,j=Math.sqrt(1-xe*xe),re=new R(Math.cos(Ue)*j,xe,Math.sin(Ue)*j).multiplyScalar(.35+s()*.58),Se=new R(-Math.sin(Ue),0,Math.cos(Ue)).multiplyScalar(.15+s()*.06),He=new R().crossVectors(re,Se).normalize().multiplyScalar(.1),Ie=[re.clone().sub(Se).sub(He),re.clone().sub(Se).add(He),re.clone().add(Se).add(He),re.clone().add(Se).sub(He)],nt=[[0,0],[0,1],[1,1],[1,0]];for(let rt of[0,1,2,0,2,3]){let W=Ie[rt];c.push(W.x,W.y,W.z),l.push(re.x,re.y,re.z),h.push(...nt[rt])}}o.setAttribute("position",new Ke(c,3)),o.setAttribute("normal",new Ke(l,3)),o.setAttribute("uv",new Ke(h,2));let u=document.createElement("canvas");u.width=128,u.height=96;let f=u.getContext("2d"),d=f.createLinearGradient(15,48,112,48);d.addColorStop(0,"#738057"),d.addColorStop(.45,"#abb886"),d.addColorStop(1,"#5b7245"),f.fillStyle=d,f.beginPath(),f.moveTo(5,48),f.bezierCurveTo(38,8,90,5,123,48),f.bezierCurveTo(90,92,38,88,5,48),f.fill(),f.strokeStyle="#dae0a97a",f.lineWidth=1,f.beginPath(),f.moveTo(7,48),f.lineTo(121,48),f.stroke();for(let ae=28;ae<110;ae+=14)f.beginPath(),f.moveTo(ae-8,48),f.lineTo(ae+10,24),f.moveTo(ae-8,48),f.lineTo(ae+10,72),f.stroke();let g=new fa(u);g.colorSpace=bt,g.anisotropy=4;let E=ae=>{let Ue=new Xe({map:g,alphaTest:.4,alphaToCoverage:!0,color:ae,roughness:.95,envMapIntensity:.16,side:Mt});return Ue.onBeforeCompile=xe=>{xe.vertexShader=xe.vertexShader.replace("#include <common>",`#include <common>
varying vec3 canopyPosition;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
canopyPosition=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;`),xe.fragmentShader=xe.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 canopyPosition;`).replace("#include <map_fragment>",`#include <map_fragment>
float leafGrain=.5+.5*sin(canopyPosition.x*31.+sin(canopyPosition.z*19.))*sin(canopyPosition.y*34.+canopyPosition.z*23.);float grainFade=1.-smoothstep(.07,.35,length(fwidth(canopyPosition)));diffuseColor.rgb*=.82+.12*mix(.5,leafGrain,grainFade);`)},Ue.customProgramCacheKey=()=>"dense-leaf-canopy-v83",Ue},m=new ot(o,E(4675381),1e4),p=new ot(o,E(5400386),5e3),M=new ot(o,E(3360042),2e3),x=new tn().load("./assets/odyssey/wood_planks/wood_planks_diff_1k.jpg");x.colorSpace=bt,x.wrapS=x.wrapT=hn,x.repeat.set(2,5),x.anisotropy=4;let v=new ot(new vn(.14,.28,1,8),new Xe({map:x,color:6444607,roughness:.95}),2600),S=new ot(new vn(.08,.15,1,5),v.material,7800),A=0,C=new _n({colorWrite:!1,depthWrite:!1}),I=new ot(new Nr(1,0),C,2600);I.name="Internal simplified forest shadow volumes";let w=0,_=0,b=0,P=0,U=0,N=0,H=0,V=new Bn,Z=new R(0,-1,0),X=new Ct,z=new gt;for(let ae of["position","normal","uv"]){let Ue=o.getAttribute(ae);z.setAttribute(ae,new Rt(Ue.array.slice(0,108*Ue.itemSize),Ue.itemSize))}let Y=new ot(z,E(6385989),7800),J=0,ne=3.6;for(let ae=-n.x*.45;ae<n.x*.45;ae+=ne)for(let Ue=-n.z*.45;Ue<n.z*.45;Ue+=ne){if(w>=2600)continue;let xe=t.x+ae+(s()-.5)*ne*.75,j=t.z+Ue+(s()-.5)*ne*.75;if(Math.hypot(xe+70,j+129)<9||j>-114&&Math.abs(xe+72)<9||j>-155&&Math.abs(xe+103.6)<7)continue;V.set(new R(xe,95,j),Z);let re=V.intersectObjects(e,!1)[0];if(!re?.face||re.point.y<5.5||re.point.y>39||re.face.normal.y<.47)continue;let Se=re.point.y,He=s(),Ie=He<.62?0:He<.9?1:2,nt=Ie===2?13+s()*5:Ie===1?11+s()*5:9+s()*5;for(let W=0;W<3;W++)X.position.set(xe+(s()-.5)*3,Se+.4+s()*.5,j+(s()-.5)*3),X.rotation.set(0,s()*6.28,0),X.scale.set(1.2+s(),.6+s()*.7,1.2+s()),X.updateMatrix(),Y.setMatrixAt(J++,X.matrix);X.position.set(xe,Se+nt*.29,j),X.rotation.set((s()-.5)*.1,s()*6.28,(s()-.5)*.1),X.scale.set(1.05+s()*.7,nt*.58,1.05+s()*.7),X.updateMatrix(),v.setMatrixAt(w++,X.matrix),X.position.set(xe,Se+nt*.75,j),X.scale.set(Ie===2?1.2:4,Ie===2?4:2.8,Ie===2?1.2:4),X.updateMatrix(),I.setMatrixAt(w-1,X.matrix),Ie===0?U++:Ie===1?N++:H++;let rt=Ie===0?m:Ie===1?p:M;for(let W=0;W<(Ie===2?3:4);W++){let ve=W*2.4+s(),fe=Ie===2?.15:1.5+s();if(X.position.set(xe+Math.cos(ve)*fe,Se+nt*(Ie===2?.45+W*.18:.65+s()*.16),j+Math.sin(ve)*fe),W<3&&Ie!==2){let Te=X.position.clone(),be=new R(xe,Se+nt*.48,j);X.position.copy(be).add(Te).multiplyScalar(.5),X.quaternion.setFromUnitVectors(new R(0,1,0),Te.clone().sub(be).normalize()),X.scale.set(1.6,Te.distanceTo(be),1.6),X.updateMatrix(),S.setMatrixAt(A++,X.matrix),X.position.copy(Te)}X.rotation.set((s()-.5)*.12,ve,(s()-.5)*.12);let ge=Ie===2?1.5+s()*.4:3.8+s()*1.4;X.scale.set(ge,Ie===2?3.6:Ie===1?1.7+s()*.7:3+s()*.8,ge*(.85+s()*.2)),X.updateMatrix();let pe=Ie===0?_++:Ie===1?b++:P++;rt.setMatrixAt(pe,X.matrix),rt.setColorAt(pe,new Ve().setRGB(.72+s()*.25,.75+s()*.25,.64+s()*.25))}}m.count=_,p.count=b,M.count=P,v.count=w,Y.count=J,Y.name="Grounded forest understory and leaf litter",Y.receiveShadow=!0,Y.computeBoundingSphere(),r.add(Y),S.count=A,S.castShadow=!1,S.receiveShadow=!0,S.computeBoundingSphere(),r.add(S),I.count=w,I.castShadow=!0,I.computeBoundingSphere(),r.add(I);for(let ae of[m,p,M,v])ae.castShadow=ae===v,ae.receiveShadow=!0,ae.computeBoundingSphere(),r.add(ae);return m.name="Dense evergreen oak crown masses",p.name="Mixed umbrella pine crown masses",M.name="Tall cypress canopy spires",v.name="Mixed forest grounded trunks",{additionalWoodlandTrees:w,woodlandLeafClusters:_+b+P,treeTypes:{evergreenOak:U,umbrellaPine:N,cypress:H},canopySpacing:ne}}function Ng(r,e,t){e.updateWorldMatrix(!0,!0);let n=[];e.traverse(U=>{U instanceof _e&&/V21.*solid.*inhabited/i.test(U.name+" "+U.parent?.name)&&n.push(U)});let i=new ht().setFromObject(e),s=i.getCenter(new R),o=i.getSize(new R),a=new Dt;a.name="Coastal habitats / saline littoral, dry maquis, cypress and exposed upper limestone",r.add(a);let c=[],l=[];for(let U=0;U<44;U++){let N=U*2.399,H=.18+.72*Math.sqrt(U%17/17),V=.38*Math.sin(U*1.71),Z=Math.cos(N)*H,X=Math.sin(N)*H*.72,z=.1+.035*(U%3),Y=c.length/3;c.push(Z-z,V,X,Z,V+.07,X-.07,Z+z,V,X,Z,V-.04,X+.07),l.push(Y,Y+1,Y+2,Y,Y+2,Y+3)}let h=new gt;h.setAttribute("position",new Ke(c,3)),h.setIndex(l),h.computeVertexNormals();let u=new ot(h,new Xe({color:12042141,roughness:.96,side:Mt}),3e3),f=new ot(new Lr(1,1,9,5),new Xe({color:4609081,roughness:.95}),100),d=0,g=new ot(new vn(.7,1,1,5),new Xe({color:5259564,roughness:.93}),180),E=54711,m=0,p=0,M=()=>(E=Math.imul(E,1664525)+1013904223|0,(E>>>0)/4294967296),x=new Ct,v=new Bn,S=new R(0,-1,0),A={coastalLowGrowth:0,dryScrub:0,cypress:0,retainedOliveWoodland:!0};for(let U=0;U<510;U++){let N=s.x+(M()-.5)*o.x*.82,H=s.z+(M()-.5)*o.z*.82;v.set(new R(N,90,H),S);let V=v.intersectObjects(n,!1)[0];if(!V||V.point.y<.7||V.point.y>28||V.face&&V.face.normal.y<.65)continue;let Z=V.point.y;if(Z>5&&Math.sin(N*.041+Math.sin(H*.027))*Math.cos(H*.043)<-.38)continue;let X=Z>11&&Z<21&&M()>.88,z=X?2.5+M()*1.2:Z<5?.22+M()*.25:.65+M()*.6;if(X?A.cypress++:Z<5?A.coastalLowGrowth++:A.dryScrub++,X&&(x.position.set(N,Z+z*.45,H),x.rotation.set(0,0,0),x.scale.set(.14,z*.9,.14),x.updateMatrix(),g.setMatrixAt(p++,x.matrix)),X){x.position.set(N,Z+z*.55,H),x.rotation.set(0,M()*6.28,0),x.scale.set(.33+M()*.12,z,.33+M()*.12),x.updateMatrix(),f.setMatrixAt(d++,x.matrix);continue}let Y=5;for(let J=0;J<Y;J++){let ne=X?.65+M()*.2:z*(.65+M()*.35);x.position.set(N+(X?0:(M()-.5)*z),Z+z*.5,H+(X?0:(M()-.5)*z)),x.rotation.set(X?0:.12*M(),M()*6.28,X?0:.14*M()),x.scale.set(ne,X?z/.84:z*1.3,ne),x.updateMatrix(),u.setMatrixAt(m,x.matrix),u.setColorAt(m++,new Ve(X?4019244:Z<5?9016163:6846788))}}u.count=m,g.count=p,f.count=d,f.castShadow=f.receiveShadow=!0,u.receiveShadow=!0,g.castShadow=g.receiveShadow=!0,u.computeBoundingSphere(),g.computeBoundingSphere(),f.computeBoundingSphere(),a.add(u,g,f);let C=new Nr(1,2),I=C.getAttribute("position");for(let U=0;U<I.count;U++){let N=I.getX(U),H=I.getY(U),V=I.getZ(U),Z=.88+.1*Math.sin(N*9+V*7)+.06*Math.sin(H*13);I.setXYZ(U,N*Z,H*Z*.58,V*Z)}C.computeVertexNormals();let w=t.clone();w.color.setRGB(.53,.46,.34),w.roughness=.88,w.envMapIntensity=.1;let _=new ot(C,w,240),b=0;for(let U=0;U<870&&b<240;U++){let N=s.x+(M()-.5)*o.x*.9,H=s.z+(M()-.5)*o.z*.9;v.set(new R(N,90,H),S);let V=v.intersectObjects(n,!1)[0];if(!V||!V.face||V.point.y<1||V.point.y>21||V.face.normal.y>.92&&V.point.y>6)continue;let Z=1.8+M()*3.6;x.position.copy(V.point).add(new R(0,-Z*.18,0)),x.rotation.set(.12*(M()-.5),M()*Math.PI*2,.1*(M()-.5)),x.scale.set(Z*(1+M()),Z,Z*(.8+M()*.4)),x.updateMatrix(),_.setMatrixAt(b++,x.matrix)}_.count=b,_.castShadow=_.receiveShadow=!0,_.computeBoundingSphere(),_.name="Naturally exposed limestone outcrops on coastal slopes",a.add(_),Object.assign(A,{coastalOutcrops:b});let P=Dg(a,n,s,o);return Object.assign(A,P,{coastalZones:["wet littoral stone","pebble and sand coves","fractured rock slopes","closed mixed woodland","exposed cave and ridges"]}),{species:A,root:a}}at();function Iu(r){let e=new Xe({color:16777215,roughness:.91,envMapIntensity:.16});return e.name="Continuous limestone, weathered soil, sand and sparse maquis / metre-scale triplanar PBR",e.onBeforeCompile=t=>{t.uniforms.landPhoto={value:r.map},t.uniforms.landNormal={value:r.normalMap},t.uniforms.landRough={value:r.roughnessMap},t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
varying vec3 landPosition,landNormalWorld;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
landPosition=(modelMatrix*vec4(transformed,1.)).xyz;landNormalWorld=normalize(mat3(modelMatrix)*objectNormal);`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
   varying vec3 landPosition,landNormalWorld;uniform sampler2D landPhoto,landNormal,landRough;
   vec3 landSample(sampler2D map,vec3 p,vec3 w){return texture2D(map,p.yz*.16).rgb*w.x+texture2D(map,p.xz*.16).rgb*w.y+texture2D(map,p.xy*.16).rgb*w.z;}`).replace("#include <map_fragment>",`vec3 weights=pow(abs(normalize(landNormalWorld)),vec3(5.));weights/=max(.001,weights.x+weights.y+weights.z);
    vec3 photo=landSample(landPhoto,landPosition,weights);float mineral=dot(photo,vec3(.3,.5,.2));
    float fine=texture2D(landPhoto,landPosition.xz*.10).g;mineral=mix(mineral,fine,.12);
    float bedding=.96+.04*sin(landPosition.y*2.2+landPosition.x*.013+landPosition.z*.018);
    float shade=sin(landPosition.x*.18+sin(landPosition.z*.11))*sin(landPosition.z*.17);
    float coastHeight=landPosition.y+shade*.65;
    float sand=(1.-smoothstep(.7,5.2,coastHeight))*smoothstep(.48,.88,landNormalWorld.y);
    float scrub=smoothstep(3.2,6.8,coastHeight)* (1.-smoothstep(19.,26.,landPosition.y-shade))*smoothstep(.55,.84,landNormalWorld.y);
    vec3 stonePigment=mix(vec3(1.),photo/max(.10,mineral),.55);
    float weathering=.5+.5*sin(landPosition.x*.047+sin(landPosition.z*.039))*sin(landPosition.y*.23+landPosition.z*.052);
    vec3 limestone=mix(vec3(.21,.165,.112),vec3(.31,.265,.18),weathering)*(.42+mineral*1.45)*bedding*stonePigment;
    vec3 drySoil=vec3(.055,.072,.024)*(.70+mineral*.50+shade*.045);
    float sandGrain=texture2D(landRough,landPosition.xz*1.7).g;
    float sediment=.5+.5*sin(landPosition.x*.32+landPosition.z*.19+sin(landPosition.z*.09)*3.);
    vec3 beach=mix(vec3(.40,.28,.125),vec3(.55,.405,.205),sediment*.55)*(.79+sandGrain*.21+mineral*.16);
    diffuseColor.rgb=mix(mix(limestone,drySoil,scrub*.96),beach,sand);
    float tidalWet=1.-smoothstep(.15,1.8,coastHeight);diffuseColor.rgb*=1.-tidalWet*.42;
    float coastPebble=smoothstep(.035,.12,abs(sin(landPosition.x*1.7)*sin(landPosition.z*1.9)));
    diffuseColor.rgb*=1.-(1.-coastPebble)*sand*.12;
    float crack=1.-smoothstep(.06,.19,mineral);diffuseColor.rgb*=1.-crack*.24*(1.-sand);`).replace("#include <normal_fragment_maps>",`vec3 nX=texture2D(landNormal,landPosition.yz*.16).xyz*2.-1.;
    vec3 nY=texture2D(landNormal,landPosition.xz*.16).xyz*2.-1.;
    vec3 nZ=texture2D(landNormal,landPosition.xy*.16).xyz*2.-1.;vec3 signs=sign(landNormalWorld);
    vec3 mappedNormal=normalize(vec3(nX.z*signs.x,nX.x*.60,nX.y*.60)*weights.x+vec3(nY.x*.60,nY.z*signs.y,nY.y*.60)*weights.y+vec3(nZ.x*.60,nZ.y*.60,nZ.z*signs.z)*weights.z);
    normal=normalize(mix(normal,mat3(viewMatrix)*mappedNormal,(1.-sand)*.58));
    float relief=mix(mineral*.12+bedding*.055,sandGrain*.026,sand);vec3 q0=dFdx(-vViewPosition),q1=dFdy(-vViewPosition);
    vec3 r1=cross(q1,normal),r2=cross(normal,q0);float determinant=dot(q0,r1);
    normal=normalize(abs(determinant)*normal-sign(determinant)*(dFdx(relief)*r1+dFdy(relief)*r2));`).replace("#include <roughnessmap_fragment>","float photoRough=landSample(landRough,landPosition,weights).g;float roughnessFactor=mix(.27,.70+photoRough*.23,smoothstep(.15,1.8,coastHeight));roughnessFactor=mix(roughnessFactor,.97,clamp(sand*.85+scrub*.45,0.,1.));")},e.customProgramCacheKey=()=>"continuous-coastal-habitats-v32-83",e}at();function Ug(r){r.updateWorldMatrix(!0,!0);let e=new ht().setFromObject(r),t=e.getCenter(new R),n=0;r.traverse(s=>{if(!(s instanceof _e)||!/V21.*solid.*inhabited/i.test(s.name+" "+s.parent?.name))return;s.geometry=s.geometry.clone();let o=s.geometry.getAttribute("position"),a=new R,c=s.matrixWorld.clone().invert();for(let l=0;l<o.count;l++){a.fromBufferAttribute(o,l).applyMatrix4(s.matrixWorld);let h=a.x-t.x,u=a.z-t.z,f=_t.smoothstep(a.y,8,18),d=11.4*Math.exp(-(((h+48)/64)**2)-((u+25)/30)**2),g=9.8*Math.exp(-(((h-57)/44)**2)-((u+6)/36)**2),E=-6.6*Math.exp(-((h/29)**2)-((u+5)/47)**2),m=.55*Math.sin(h*.13+u*.07)*Math.sin(u*.19);a.y+=f*(d+g+E+m),a.applyMatrix4(c),o.setXYZ(l,a.x,a.y,a.z),n++}o.needsUpdate=!0,s.geometry.computeVertexNormals(),s.geometry.computeBoundingBox(),s.geometry.computeBoundingSphere()}),r.updateWorldMatrix(!0,!0);let i=new ht().setFromObject(r);return{vertices:n,width:i.max.x-i.min.x,depth:i.max.z-i.min.z,height:i.max.y-i.min.y}}at();function Bg(r){let e=null;r.traverse(s=>{if(s instanceof _e)for(let o of Array.isArray(s.material)?s.material:[s.material])o instanceof Xe&&o.name==="Human.body.001"&&o.map&&(e=o.map)});let t=new Xe({map:e,color:10918538,roughness:.72,envMapIntensity:.24});t.name="V32.78 / weathered bare skin with pores, creases and uneven pigmentation",t.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
varying vec3 giantPosition;`).replace("#include <begin_vertex>",`#include <begin_vertex>
giantPosition=position;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
   varying vec3 giantPosition;
   float gn(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
   float gnoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(gn(i),gn(i+vec3(1,0,0)),f.x),mix(gn(i+vec3(0,1,0)),gn(i+vec3(1,1,0)),f.x),f.y),mix(mix(gn(i+vec3(0,0,1)),gn(i+vec3(1,0,1)),f.x),mix(gn(i+vec3(0,1,1)),gn(i+vec3(1,1,1)),f.x),f.y),f.z);}`).replace("#include <map_fragment>",`#include <map_fragment>
    float patches=gnoise(giantPosition*36.);float pores=gnoise(giantPosition*580.);
    float crease=pow(.5+.5*sin(giantPosition.y*520.+gnoise(giantPosition*80.)*9.),12.);
    float face=smoothstep(1.45,1.56,giantPosition.y);
    diffuseColor.rgb*=.77+patches*.31;diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.73,.65,.59),crease*face*.18);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
    float heightDetail=(pores-.5)*.0015+crease*face*.003;
    vec3 q0=dFdx(-vViewPosition),q1=dFdy(-vViewPosition),r1=cross(q1,normal),r2=cross(normal,q0);float det=dot(q0,r1);
    normal=normalize(abs(det)*normal-sign(det)*(dFdx(heightDetail)*r1+dFdy(heightDetail)*r2));`).replace("#include <roughnessmap_fragment>","float roughnessFactor=clamp(.61+patches*.22+pores*.08,.60,.91);")},t.customProgramCacheKey=()=>"weathered-bare-cyclops-v32-78";let n=0,i=0;return r.traverse(s=>{if(!(s instanceof _e))return;let o=Array.isArray(s.material)?s.material:[s.material];if(o.some(a=>/tunic|mantle|belt|Human.short01/i.test(a.name))){s.visible=!1,n++;return}for(let a of o)a instanceof Xe&&a.name==="Material_6"&&(a.color.set(9799278),a.roughness=.46);o.some(a=>/shepherd skin/i.test(a.name))&&(s.material=t,s.receiveShadow=!0,i++)}),{removedGarmentAndHairMeshes:n,bodyMeshes:i,skin:t,clothing:!1,surface:"Uneven earthy skin, fine pores and facial creases; no outfit or held object"}}at();at();var To=Math.pow(2,-24),qa=Symbol("SKIP_GENERATION"),Pu={strategy:0,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[qa]:!1};function jt(r,e,t){return t.min.x=e[r],t.min.y=e[r+1],t.min.z=e[r+2],t.max.x=e[r+3],t.max.y=e[r+4],t.max.z=e[r+5],t}function Ya(r){let e=-1,t=-1/0;for(let n=0;n<3;n++){let i=r[n+3]-r[n];i>t&&(t=i,e=n)}return e}function md(r,e){e.set(r)}function gd(r,e,t){let n,i;for(let s=0;s<3;s++){let o=s+3;n=r[s],i=e[s],t[s]=n<i?n:i,n=r[o],i=e[o],t[o]=n>i?n:i}}function Za(r,e,t){for(let n=0;n<3;n++){let i=e[r+2*n],s=e[r+2*n+1],o=i-s,a=i+s;o<t[n]&&(t[n]=o),a>t[n+3]&&(t[n+3]=a)}}function bo(r){let e=r[3]-r[0],t=r[4]-r[1],n=r[5]-r[2];return 2*(e*t+t*n+n*e)}function Ut(r,e){return e[r+15]===65535}function Gt(r,e){return e[r+6]}function Yt(r,e){return e[r+14]}function Ot(r){return r+8}function zt(r,e){let t=e[r+6];return r+t*8}function Ao(r,e){return e[r+7]}function Lu(r,e,t,n,i){let s=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0,u=1/0,f=1/0,d=1/0,g=-1/0,E=-1/0,m=-1/0,p=r.offset||0;for(let M=(e-p)*6,x=(e+t-p)*6;M<x;M+=6){let v=r[M+0],S=r[M+1],A=v-S,C=v+S;A<s&&(s=A),C>c&&(c=C),v<u&&(u=v),v>g&&(g=v);let I=r[M+2],w=r[M+3],_=I-w,b=I+w;_<o&&(o=_),b>l&&(l=b),I<f&&(f=I),I>E&&(E=I);let P=r[M+4],U=r[M+5],N=P-U,H=P+U;N<a&&(a=N),H>h&&(h=H),P<d&&(d=P),P>m&&(m=P)}n[0]=s,n[1]=o,n[2]=a,n[3]=c,n[4]=l,n[5]=h,i[0]=u,i[1]=f,i[2]=d,i[3]=g,i[4]=E,i[5]=m}var gr=32,T1=(r,e)=>r.candidate-e.candidate,Or=new Array(gr).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),Du=new Float32Array(6);function Fg(r,e,t,n,i,s){let o=-1,a=0;if(s===0)o=Ya(e),o!==-1&&(a=(e[o]+e[o+3])/2);else if(s===1)o=Ya(r),o!==-1&&(a=b1(t,n,i,o));else if(s===2){let c=bo(r),l=1.25*i,h=t.offset||0,u=(n-h)*6,f=(n+i-h)*6;for(let d=0;d<3;d++){let g=e[d],p=(e[d+3]-g)/gr;if(i<gr/4){let M=[...Or];M.length=i;let x=0;for(let S=u;S<f;S+=6,x++){let A=M[x];A.candidate=t[S+2*d],A.count=0;let{bounds:C,leftCacheBounds:I,rightCacheBounds:w}=A;for(let _=0;_<3;_++)w[_]=1/0,w[_+3]=-1/0,I[_]=1/0,I[_+3]=-1/0,C[_]=1/0,C[_+3]=-1/0;Za(S,t,C)}M.sort(T1);let v=i;for(let S=0;S<v;S++){let A=M[S];for(;S+1<v&&M[S+1].candidate===A.candidate;)M.splice(S+1,1),v--}for(let S=u;S<f;S+=6){let A=t[S+2*d];for(let C=0;C<v;C++){let I=M[C];A>=I.candidate?Za(S,t,I.rightCacheBounds):(Za(S,t,I.leftCacheBounds),I.count++)}}for(let S=0;S<v;S++){let A=M[S],C=A.count,I=i-A.count,w=A.leftCacheBounds,_=A.rightCacheBounds,b=0;C!==0&&(b=bo(w)/c);let P=0;I!==0&&(P=bo(_)/c);let U=1+1.25*(b*C+P*I);U<l&&(o=d,l=U,a=A.candidate)}}else{for(let v=0;v<gr;v++){let S=Or[v];S.count=0,S.candidate=g+p+v*p;let A=S.bounds;for(let C=0;C<3;C++)A[C]=1/0,A[C+3]=-1/0}for(let v=u;v<f;v+=6){let C=~~((t[v+2*d]-g)/p);C>=gr&&(C=gr-1);let I=Or[C];I.count++,Za(v,t,I.bounds)}let M=Or[gr-1];md(M.bounds,M.rightCacheBounds);for(let v=gr-2;v>=0;v--){let S=Or[v],A=Or[v+1];gd(S.bounds,A.rightCacheBounds,S.rightCacheBounds)}let x=0;for(let v=0;v<gr-1;v++){let S=Or[v],A=S.count,C=S.bounds,w=Or[v+1].rightCacheBounds;A!==0&&(x===0?md(C,Du):gd(C,Du,Du)),x+=A;let _=0,b=0;x!==0&&(_=bo(Du)/c);let P=i-x;P!==0&&(b=bo(w)/c);let U=1+1.25*(_*x+b*P);U<l&&(o=d,l=U,a=S.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${s} used.`);return{axis:o,pos:a}}function b1(r,e,t,n){let i=0,s=r.offset;for(let o=e,a=e+t;o<a;o++)i+=r[(o-s)*6+n*2];return i/t}var Ro=class{constructor(){this.boundingData=new Float32Array(6)}};function Og(r,e,t,n,i,s){let o=n,a=n+i-1,c=s.pos,l=s.axis*2,h=t.offset||0;for(;;){for(;o<=a&&t[(o-h)*6+l]<c;)o++;for(;o<=a&&t[(a-h)*6+l]>=c;)a--;if(o<a){for(let u=0;u<e;u++){let f=r[o*e+u];r[o*e+u]=r[a*e+u],r[a*e+u]=f}for(let u=0;u<6;u++){let f=o-h,d=a-h,g=t[f*6+u];t[f*6+u]=t[d*6+u],t[d*6+u]=g}o++,a--}else return o}}var zg,Nu,xd,kg,A1=Math.pow(2,32);function Uu(r){return"count"in r?1:1+Uu(r.left)+Uu(r.right)}function Vg(r,e,t){return zg=new Float32Array(t),Nu=new Uint32Array(t),xd=new Uint16Array(t),kg=new Uint8Array(t),vd(r,e)}function vd(r,e){let t=r/4,n=r/2,i="count"in e,s=e.boundingData;for(let o=0;o<6;o++)zg[t+o]=s[o];if(i)return e.buffer?(kg.set(new Uint8Array(e.buffer),r),r+e.buffer.byteLength):(Nu[t+6]=e.offset,xd[n+14]=e.count,xd[n+15]=65535,r+32);{let{left:o,right:a,splitAxis:c}=e,l=r+32,h=vd(l,o),u=r/32,d=h/32-u;if(d>A1)throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");return Nu[t+6]=d,Nu[t+7]=c,vd(h,a)}}function R1(r,e,t,n,i,s){let{maxDepth:o,verbose:a,targetLeafSize:c,_strictLeafSize:l=1/0,strategy:h,onProgress:u}=i,f=r.primitiveBuffer,d=r.primitiveBufferStride,g=new Float32Array(6),E=!1,m=new Ro;return Lu(e,t,n,m.boundingData,g),M(m,t,n,g),m;function p(x){u&&u((x-s.offset)/s.count)}function M(x,v,S,A=null,C=0){!E&&C>=o&&(E=!0,a&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));let I=S>l;if(S<=c&&!I||C>=o)return p(v+S),x.offset=v,x.count=S,x;let w=Fg(x.boundingData,A,e,v,S,h),_=w.axis===-1?-1:Og(f,d,e,v,S,w);if(w.axis===-1||_===v||_===v+S){if(!I)return p(v+S),x.offset=v,x.count=S,x;w.axis=Math.max(0,Ya(x.boundingData)),_=v+Math.max(1,Math.floor(S/2))}x.splitAxis=w.axis;let b=new Ro,P=v,U=_-v;x.left=b,Lu(e,P,U,b.boundingData,g),M(b,P,U,g,C+1);let N=new Ro,H=_,V=S-U;return x.right=N,Lu(e,H,V,N.boundingData,g),M(N,H,V,g,C+1),x}}function Gg(r,e){let t=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=r.getRootRanges(e.range),i=n[0],s=n[n.length-1],o={offset:i.offset,count:s.offset+s.count-i.offset},a=new Float32Array(6*o.count);a.offset=o.offset,r.computePrimitiveBounds(o.offset,o.count,a),r._roots=n.map(c=>{let l=R1(r,a,c.offset,c.count,e,o),h=Uu(l),u=new t(32*h);return Vg(0,l,u),u})}at();var zr=class{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){let e=this._primitives;return e.length===0?this._getNewPrimitive():e.pop()}releasePrimitive(e){this._primitives.push(e)}};var yd=class{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;let e=[],t=null;this.setBuffer=n=>{t&&e.push(t),t=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0&&this.setBuffer(e.pop())}}},Bt=new yd;var kr,Io,Co=[],Bu=new zr(()=>new ht);function Wg(r,e,t,n,i,s){kr=Bu.getPrimitive(),Io=Bu.getPrimitive(),Co.push(kr,Io),Bt.setBuffer(r._roots[e]);let o=_d(0,r.geometry,t,n,i,s);Bt.clearBuffer(),Bu.releasePrimitive(kr),Bu.releasePrimitive(Io),Co.pop(),Co.pop();let a=Co.length;return a>0&&(Io=Co[a-1],kr=Co[a-2]),o}function _d(r,e,t,n,i=null,s=0,o=0){let{float32Array:a,uint16Array:c,uint32Array:l}=Bt,h=r*2;if(Ut(h,c)){let f=Gt(r,l),d=Yt(h,c);return jt(r,a,kr),n(f,d,!1,o,s+r/8,kr)}else{let _=function(P){let{uint16Array:U,uint32Array:N}=Bt,H=P*2;for(;!Ut(H,U);)P=Ot(P),H=P*2;return Gt(P,N)},b=function(P){let{uint16Array:U,uint32Array:N}=Bt,H=P*2;for(;!Ut(H,U);)P=zt(P,N),H=P*2;return Gt(P,N)+Yt(H,U)},f=Ot(r),d=zt(r,l),g=f,E=d,m,p,M,x;if(i&&(M=kr,x=Io,jt(g,a,M),jt(E,a,x),m=i(M),p=i(x),p<m)){g=d,E=f;let P=m;m=p,p=P,M=x}M||(M=kr,jt(g,a,M));let v=Ut(g*2,c),S=t(M,v,m,o+1,s+g/8),A;if(S===2){let P=_(g),N=b(g)-P;A=n(P,N,!0,o+1,s+g/8,M)}else A=S&&_d(g,e,t,n,i,s,o+1);if(A)return!0;x=Io,jt(E,a,x);let C=Ut(E*2,c),I=t(x,C,p,o+1,s+E/8),w;if(I===2){let P=_(E),N=b(E)-P;w=n(P,N,!0,o+1,s+E/8,x)}else w=I&&_d(E,e,t,n,i,s,o+1);return!!w}}at();var ja=new Bt.constructor,Hu=new Bt.constructor,Vr=new zr(()=>new ht),Po=new ht,Lo=new ht,Md=new ht,Sd=new ht,wd=!1;function Xg(r,e,t,n){if(wd)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");wd=!0;let i=r._roots,s=e._roots,o,a=0,c=0,l=new ke().copy(t).invert();for(let h=0,u=i.length;h<u;h++){ja.setBuffer(i[h]),c=0;let f=Vr.getPrimitive();jt(0,ja.float32Array,f),f.applyMatrix4(l);for(let d=0,g=s.length;d<g&&(Hu.setBuffer(s[d]),o=bi(0,0,t,l,n,a,c,0,0,f),Hu.clearBuffer(),c+=s[d].byteLength/32,!o);d++);if(Vr.releasePrimitive(f),ja.clearBuffer(),a+=i[h].byteLength/32,o)break}return wd=!1,o}function bi(r,e,t,n,i,s=0,o=0,a=0,c=0,l=null,h=!1){let u,f;h?(u=Hu,f=ja):(u=ja,f=Hu);let d=u.float32Array,g=u.uint32Array,E=u.uint16Array,m=f.float32Array,p=f.uint32Array,M=f.uint16Array,x=r*2,v=e*2,S=Ut(x,E),A=Ut(v,M),C=!1;if(A&&S)h?C=i(Gt(e,p),Yt(e*2,M),Gt(r,g),Yt(r*2,E),c,o+e/8,a,s+r/8):C=i(Gt(r,g),Yt(r*2,E),Gt(e,p),Yt(e*2,M),a,s+r/8,c,o+e/8);else if(A){let I=Vr.getPrimitive();jt(e,m,I),I.applyMatrix4(t);let w=Ot(r),_=zt(r,g);jt(w,d,Po),jt(_,d,Lo);let b=I.intersectsBox(Po),P=I.intersectsBox(Lo);C=b&&bi(e,w,n,t,i,o,s,c,a+1,I,!h)||P&&bi(e,_,n,t,i,o,s,c,a+1,I,!h),Vr.releasePrimitive(I)}else{let I=Ot(e),w=zt(e,p);jt(I,m,Md),jt(w,m,Sd);let _=l.intersectsBox(Md),b=l.intersectsBox(Sd);if(_&&b)C=bi(r,I,t,n,i,s,o,a,c+1,l,h)||bi(r,w,t,n,i,s,o,a,c+1,l,h);else if(_)if(S)C=bi(r,I,t,n,i,s,o,a,c+1,l,h);else{let P=Vr.getPrimitive();P.copy(Md).applyMatrix4(t);let U=Ot(r),N=zt(r,g);jt(U,d,Po),jt(N,d,Lo);let H=P.intersectsBox(Po),V=P.intersectsBox(Lo);C=H&&bi(I,U,n,t,i,o,s,c,a+1,P,!h)||V&&bi(I,N,n,t,i,o,s,c,a+1,P,!h),Vr.releasePrimitive(P)}else if(b)if(S)C=bi(r,w,t,n,i,s,o,a,c+1,l,h);else{let P=Vr.getPrimitive();P.copy(Sd).applyMatrix4(t);let U=Ot(r),N=zt(r,g);jt(U,d,Po),jt(N,d,Lo);let H=P.intersectsBox(Po),V=P.intersectsBox(Lo);C=H&&bi(w,U,n,t,i,o,s,c,a+1,P,!h)||V&&bi(w,N,n,t,i,o,s,c,a+1,P,!h),Vr.releasePrimitive(P)}}return C}var Fu=new class{constructor(){let r=null,e=null,t=null,n=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(s,o)=>{if(n)throw new Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");this.root=o,this.buffer=r=s._roots[o],this.uint16Array=t=new Uint16Array(r),this.uint32Array=e=new Uint32Array(r)},this.reset=()=>{this.root=null,this.buffer=r=null,this.uint16Array=t=null,this.uint32Array=e=null},this.getRangeStart=s=>{let o=s*2;for(;!Ut(o,t);)s=Ot(s),o=s*2;return Gt(s,e)},this.getRangeEnd=s=>{let o=s*2;for(;!Ut(o,t);)s=zt(s,e),o=s*2;return Gt(s,e)+Yt(o,t)};let i=(s,o,a)=>{let c=o*2,l=Ut(c,t);if(!s(a,l,o)&&!l){let u=Ot(o),f=zt(o,e);i(s,u,a+1),i(s,f,a+1)}};this.traverseBuffer=s=>{if(n)throw new Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");n=!0;try{i(s,0,0)}finally{n=!1}},this.traverse=s=>{this.traverseBuffer((o,a,c)=>{if(a){let l=c*2,h=e[c+6],u=t[l+14];return s(o,a,new Float32Array(r,c*4,6),h,u)}else{let l=Ao(c,e);return s(o,a,new Float32Array(r,c*4,6),l)}})}}};var qg=new ht,Do=new Float32Array(6),Ou=class{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(e){e={...Pu,...e},"maxLeafSize"in e&&(console.warn('BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.'),e={...e,targetLeafSize:e.maxLeafSize}),Gg(this,e)}getRootRanges(){throw new Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw new Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(e,t,n,i){let s=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0;for(let u=e,f=e+t;u<f;u++){this.writePrimitiveBounds(u,Do,0);let[d,g,E,m,p,M]=Do;d<s&&(s=d),m>c&&(c=m),g<o&&(o=g),p>l&&(l=p),E<a&&(a=E),M>h&&(h=M)}return n[i+0]=s,n[i+1]=o,n[i+2]=a,n[i+3]=c,n[i+4]=l,n[i+5]=h,n}computePrimitiveBounds(e,t,n){let i=n.offset||0;for(let s=e,o=e+t;s<o;s++){this.writePrimitiveBounds(s,Do,0);let[a,c,l,h,u,f]=Do,d=(a+h)/2,g=(c+u)/2,E=(l+f)/2,m=(h-a)/2,p=(u-c)/2,M=(f-l)/2,x=(s-i)*6;n[x+0]=d,n[x+1]=m+(Math.abs(d)+m)*To,n[x+2]=g,n[x+3]=p+(Math.abs(g)+p)*To,n[x+4]=E,n[x+5]=M+(Math.abs(E)+M)*To}return n}shiftPrimitiveOffsets(e){let t=this._indirectBuffer;if(t)for(let n=0,i=t.length;n<i;n++)t[n]+=e;else{let n=this._roots;for(let i=0;i<n.length;i++){let s=n[i],o=new Uint32Array(s),a=new Uint16Array(s),c=s.byteLength/32;for(let l=0;l<c;l++){let h=8*l,u=2*h;Ut(u,a)&&(o[h+6]+=e)}}}}traverse(e,t=0){Fu.setBVH(this,t),Fu.traverse(e),Fu.reset()}refit(){let e=this._roots;for(let t=0,n=e.length;t<n;t++){let i=e[t],s=new Uint32Array(i),o=new Uint16Array(i),a=new Float32Array(i),c=i.byteLength/32;for(let l=c-1;l>=0;l--){let h=l*8,u=h*2;if(Ut(u,o)){let d=Gt(h,s),g=Yt(u,o);this.writePrimitiveRangeBounds(d,g,Do,0),a.set(Do,h)}else{let d=Ot(h),g=zt(h,s);for(let E=0;E<3;E++){let m=a[d+E],p=a[d+E+3],M=a[g+E],x=a[g+E+3];a[h+E]=m<M?m:M,a[h+E+3]=p>x?p:x}}}}}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach(n=>{jt(0,new Float32Array(n),qg),e.union(qg)}),e}shapecast(e){let{boundsTraverseOrder:t,intersectsBounds:n,intersectsRange:i,intersectsPrimitive:s,scratchPrimitive:o,iterate:a}=e;if(i&&s){let u=i;i=(f,d,g,E,m)=>u(f,d,g,E,m)?!0:a(f,d,this,s,g,E,o)}else i||(s?i=(u,f,d,g)=>a(u,f,this,s,d,g,o):i=(u,f,d)=>d);let c=!1,l=0,h=this._roots;for(let u=0,f=h.length;u<f;u++){let d=h[u];if(c=Wg(this,u,n,i,t,l),c)break;l+=d.byteLength/32}return c}bvhcast(e,t,n){let{intersectsRanges:i}=n;return Xg(this,e,t,i)}};at();function Yg(){return typeof SharedArrayBuffer<"u"}at();function Td(r){return r.index?r.index.count:r.attributes.position.count}function Gr(r){return Td(r)/3}function I1(r,e=ArrayBuffer){return r>65535?new Uint32Array(new e(4*r)):new Uint16Array(new e(2*r))}function Zg(r,e){if(!r.index){let t=r.attributes.position.count,n=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,i=I1(t,n);r.setIndex(new Rt(i,1));for(let s=0;s<t;s++)i[s]=s}}function P1(r,e,t){let n=Td(r)/t,i=e||r.drawRange,s=i.start/t,o=(i.start+i.count)/t,a=Math.max(0,s),c=Math.min(n,o)-a;return{offset:Math.floor(a),count:Math.floor(c)}}function L1(r,e){return r.groups.map(t=>({offset:t.start/e,count:t.count/e}))}function bd(r,e,t){let n=P1(r,e,t),i=L1(r,t);if(!i.length)return[n];let s=[],o=n.offset,a=n.offset+n.count,c=Td(r)/t,l=[];for(let f of i){let{offset:d,count:g}=f,E=d,m=isFinite(g)?g:c-d,p=d+m;E<a&&p>o&&(l.push({pos:Math.max(o,E),isStart:!0}),l.push({pos:Math.min(a,p),isStart:!1}))}l.sort((f,d)=>f.pos!==d.pos?f.pos-d.pos:f.type==="end"?-1:1);let h=0,u=null;for(let f of l){let d=f.pos;h!==0&&d!==u&&s.push({offset:u,count:d-u}),h+=f.isStart?1:-1,u=d}return s}function D1(r,e){let t=r[r.length-1],n=t.offset+t.count>2**16,i=r.reduce((l,h)=>l+h.count,0),s=n?4:2,o=e?new SharedArrayBuffer(i*s):new ArrayBuffer(i*s),a=n?new Uint32Array(o):new Uint16Array(o),c=0;for(let l=0;l<r.length;l++){let{offset:h,count:u}=r[l];for(let f=0;f<u;f++)a[c+f]=h+f;c+=u}return a}var zu=class extends Ou{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(e){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(e){}constructor(e,t={}){if(e.isBufferGeometry){if(e.index&&e.index.isInterleavedBufferAttribute)throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("BVH: Only BufferGeometries are supported.");if(t.useSharedArrayBuffer&&!Yg())throw new Error("BVH: SharedArrayBuffer is not available.");super(),this.geometry=e,this.resolvePrimitiveIndex=t.indirect?n=>this._indirectBuffer[n]:n=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,t={...Pu,...t},t[qa]||this.init(t)}init(e){let{geometry:t,primitiveStride:n}=this;if(e.indirect){let i=bd(t,e.range,n),s=D1(i,e.useSharedArrayBuffer);this._indirectBuffer=s}else Zg(t,e);super.init(e),!t.boundingBox&&e.setBoundingBox&&(t.boundingBox=this.getBoundingBox(new ht))}getRootRanges(e){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:bd(this.geometry,e,this.primitiveStride)}raycastObject3D(){throw new Error("BVH: raycastObject3D() not implemented")}};at();at();at();var ti=class{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let n=1/0,i=-1/0;for(let s=0,o=e.length;s<o;s++){let c=e[s][t];n=c<n?c:n,i=c>i?c:i}this.min=n,this.max=i}setFromPoints(e,t){let n=1/0,i=-1/0;for(let s=0,o=t.length;s<o;s++){let a=t[s],c=e.dot(a);n=c<n?c:n,i=c>i?c:i}this.min=n,this.max=i}isSeparated(e){return this.min>e.max||e.min>this.max}};ti.prototype.setFromBox=(function(){let r=new R;return function(t,n){let i=n.min,s=n.max,o=1/0,a=-1/0;for(let c=0;c<=1;c++)for(let l=0;l<=1;l++)for(let h=0;h<=1;h++){r.x=i.x*c+s.x*(1-c),r.y=i.y*l+s.y*(1-l),r.z=i.z*h+s.z*(1-h);let u=t.dot(r);o=Math.min(u,o),a=Math.max(u,a)}this.min=o,this.max=a}})();at();at();var N1=(function(){let r=new R,e=new R,t=new R;return function(i,s,o){let a=i.start,c=r,l=s.start,h=e;t.subVectors(a,l),r.subVectors(i.end,i.start),e.subVectors(s.end,s.start);let u=t.dot(h),f=h.dot(c),d=h.dot(h),g=t.dot(c),m=c.dot(c)*d-f*f,p,M;m!==0?p=(u*f-g*d)/m:p=0,M=(u+p*f)/d,o.x=p,o.y=M}})(),Ka=(function(){let r=new de,e=new R,t=new R;return function(i,s,o,a){N1(i,s,r);let c=r.x,l=r.y;if(c>=0&&c<=1&&l>=0&&l<=1){i.at(c,o),s.at(l,a);return}else if(c>=0&&c<=1){l<0?s.at(0,a):s.at(1,a),i.closestPointToPoint(a,!0,o);return}else if(l>=0&&l<=1){c<0?i.at(0,o):i.at(1,o),s.closestPointToPoint(o,!0,a);return}else{let h;c<0?h=i.start:h=i.end;let u;l<0?u=s.start:u=s.end;let f=e,d=t;if(i.closestPointToPoint(u,!0,e),s.closestPointToPoint(h,!0,t),f.distanceToSquared(u)<=d.distanceToSquared(h)){o.copy(f),a.copy(u);return}else{o.copy(h),a.copy(d);return}}}})(),jg=(function(){let r=new R,e=new R,t=new Dn,n=new kn;return function(s,o){let{radius:a,center:c}=s,{a:l,b:h,c:u}=o;if(n.start=l,n.end=h,n.closestPointToPoint(c,!0,r).distanceTo(c)<=a||(n.start=l,n.end=u,n.closestPointToPoint(c,!0,r).distanceTo(c)<=a)||(n.start=h,n.end=u,n.closestPointToPoint(c,!0,r).distanceTo(c)<=a))return!0;let E=o.getPlane(t);if(Math.abs(E.distanceToPoint(c))<=a){let p=E.projectPoint(c,e);if(o.containsPoint(p))return!0}return!1}})();var U1=["x","y","z"],xr=1e-15,Kg=xr*xr;function ui(r){return Math.abs(r)<xr}var Rn=class extends Nn{constructor(...e){super(...e),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new R),this.satBounds=new Array(4).fill().map(()=>new ti),this.points=[this.a,this.b,this.c],this.plane=new Dn,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new kn,this.needsUpdate=!0}intersectsSphere(e){return jg(e,this)}update(){let e=this.a,t=this.b,n=this.c,i=this.points,s=this.satAxes,o=this.satBounds,a=s[0],c=o[0];this.getNormal(a),c.setFromPoints(a,i);let l=s[1],h=o[1];l.subVectors(e,t),h.setFromPoints(l,i);let u=s[2],f=o[2];u.subVectors(t,n),f.setFromPoints(u,i);let d=s[3],g=o[3];d.subVectors(n,e),g.setFromPoints(d,i);let E=l.length(),m=u.length(),p=d.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,E<xr?m<xr||p<xr?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(n)):m<xr?p<xr?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(e)):p<xr&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(t)),this.plane.setFromNormalAndCoplanarPoint(a,e),this.needsUpdate=!1}};Rn.prototype.closestPointToSegment=(function(){let r=new R,e=new R,t=new kn;return function(i,s=null,o=null){let{start:a,end:c}=i,l=this.points,h,u=1/0;for(let f=0;f<3;f++){let d=(f+1)%3;t.start.copy(l[f]),t.end.copy(l[d]),Ka(t,i,r,e),h=r.distanceToSquared(e),h<u&&(u=h,s&&s.copy(r),o&&o.copy(e))}return this.closestPointToPoint(a,r),h=a.distanceToSquared(r),h<u&&(u=h,s&&s.copy(r),o&&o.copy(a)),this.closestPointToPoint(c,r),h=c.distanceToSquared(r),h<u&&(u=h,s&&s.copy(r),o&&o.copy(c)),Math.sqrt(u)}})();Rn.prototype.intersectsTriangle=(function(){let r=new Rn,e=new ti,t=new ti,n=new R,i=new R,s=new R,o=new R,a=new kn,c=new kn,l=new R,h=new de,u=new de;function f(x,v,S,A){let C=n;!x.isDegenerateIntoPoint&&!x.isDegenerateIntoSegment?C.copy(x.plane.normal):C.copy(v.plane.normal);let I=x.satBounds,w=x.satAxes;for(let P=1;P<4;P++){let U=I[P],N=w[P];if(e.setFromPoints(N,v.points),U.isSeparated(e)||(o.copy(C).cross(N),e.setFromPoints(o,x.points),t.setFromPoints(o,v.points),e.isSeparated(t)))return!1}let _=v.satBounds,b=v.satAxes;for(let P=1;P<4;P++){let U=_[P],N=b[P];if(e.setFromPoints(N,x.points),U.isSeparated(e)||(o.crossVectors(C,N),e.setFromPoints(o,x.points),t.setFromPoints(o,v.points),e.isSeparated(t)))return!1}return S&&(A||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),S.start.set(0,0,0),S.end.set(0,0,0)),!0}function d(x,v,S,A,C,I,w,_,b,P,U){let N=w/(w-_);P.x=A+(C-A)*N,U.start.subVectors(v,x).multiplyScalar(N).add(x),N=w/(w-b),P.y=A+(I-A)*N,U.end.subVectors(S,x).multiplyScalar(N).add(x)}function g(x,v,S,A,C,I,w,_,b,P,U){if(C>0)d(x.c,x.a,x.b,A,v,S,b,w,_,P,U);else if(I>0)d(x.b,x.a,x.c,S,v,A,_,w,b,P,U);else if(_*b>0||w!=0)d(x.a,x.b,x.c,v,S,A,w,_,b,P,U);else if(_!=0)d(x.b,x.a,x.c,S,v,A,_,w,b,P,U);else if(b!=0)d(x.c,x.a,x.b,A,v,S,b,w,_,P,U);else return!0;return!1}function E(x,v,S,A){let C=v.degenerateSegment,I=x.plane.distanceToPoint(C.start),w=x.plane.distanceToPoint(C.end);return ui(I)?ui(w)?f(x,v,S,A):(S&&(S.start.copy(C.start),S.end.copy(C.start)),x.containsPoint(C.start)):ui(w)?(S&&(S.start.copy(C.end),S.end.copy(C.end)),x.containsPoint(C.end)):x.plane.intersectLine(C,n)!=null?(S&&(S.start.copy(n),S.end.copy(n)),x.containsPoint(n)):!1}function m(x,v,S){let A=v.a;return ui(x.plane.distanceToPoint(A))&&x.containsPoint(A)?(S&&(S.start.copy(A),S.end.copy(A)),!0):!1}function p(x,v,S){let A=x.degenerateSegment,C=v.a;return A.closestPointToPoint(C,!0,n),C.distanceToSquared(n)<Kg?(S&&(S.start.copy(C),S.end.copy(C)),!0):!1}function M(x,v,S,A){if(x.isDegenerateIntoSegment)if(v.isDegenerateIntoSegment){let C=x.degenerateSegment,I=v.degenerateSegment,w=i,_=s;C.delta(w),I.delta(_);let b=n.subVectors(I.start,C.start),P=w.x*_.y-w.y*_.x;if(ui(P))return!1;let U=(b.x*_.y-b.y*_.x)/P,N=-(w.x*b.y-w.y*b.x)/P;if(U<0||U>1||N<0||N>1)return!1;let H=C.start.z+w.z*U,V=I.start.z+_.z*N;return ui(H-V)?(S&&(S.start.copy(C.start).addScaledVector(w,U),S.end.copy(C.start).addScaledVector(w,U)),!0):!1}else return v.isDegenerateIntoPoint?p(x,v,S):E(v,x,S,A);else{if(x.isDegenerateIntoPoint)return v.isDegenerateIntoPoint?v.a.distanceToSquared(x.a)<Kg?(S&&(S.start.copy(x.a),S.end.copy(x.a)),!0):!1:v.isDegenerateIntoSegment?p(v,x,S):m(v,x,S);if(v.isDegenerateIntoPoint)return m(x,v,S);if(v.isDegenerateIntoSegment)return E(x,v,S,A)}}return function(v,S=null,A=!1){this.needsUpdate&&this.update(),v.isExtendedTriangle?v.needsUpdate&&v.update():(r.copy(v),r.update(),v=r);let C=M(this,v,S,A);if(C!==void 0)return C;let I=this.plane,w=v.plane,_=w.distanceToPoint(this.a),b=w.distanceToPoint(this.b),P=w.distanceToPoint(this.c);ui(_)&&(_=0),ui(b)&&(b=0),ui(P)&&(P=0);let U=_*b,N=_*P;if(U>0&&N>0)return!1;let H=I.distanceToPoint(v.a),V=I.distanceToPoint(v.b),Z=I.distanceToPoint(v.c);ui(H)&&(H=0),ui(V)&&(V=0),ui(Z)&&(Z=0);let X=H*V,z=H*Z;if(X>0&&z>0)return!1;i.copy(I.normal),s.copy(w.normal);let Y=i.cross(s),J=0,ne=Math.abs(Y.x),ae=Math.abs(Y.y);ae>ne&&(ne=ae,J=1),Math.abs(Y.z)>ne&&(J=2);let xe=U1[J],j=this.a[xe],re=this.b[xe],Se=this.c[xe],He=v.a[xe],Ie=v.b[xe],nt=v.c[xe];if(g(this,j,re,Se,U,N,_,b,P,h,a))return f(this,v,S,A);if(g(v,He,Ie,nt,X,z,H,V,Z,u,c))return f(this,v,S,A);if(h.y<h.x){let rt=h.y;h.y=h.x,h.x=rt,l.copy(a.start),a.start.copy(a.end),a.end.copy(l)}if(u.y<u.x){let rt=u.y;u.y=u.x,u.x=rt,l.copy(c.start),c.start.copy(c.end),c.end.copy(l)}return h.y<u.x||u.y<h.x?!1:(S&&(u.x>h.x?S.start.copy(c.start):S.start.copy(a.start),u.y<h.y?S.end.copy(c.end):S.end.copy(a.end)),!0)}})();Rn.prototype.distanceToPoint=(function(){let r=new R;return function(t){return this.closestPointToPoint(t,r),t.distanceTo(r)}})();Rn.prototype.distanceToTriangle=(function(){let r=new R,e=new R,t=["a","b","c"],n=new kn,i=new kn;return function(o,a=null,c=null){let l=a||c?n:null;if(this.intersectsTriangle(o,l,!0))return(a||c)&&(a&&l.getCenter(a),c&&l.getCenter(c)),0;let h=1/0;for(let u=0;u<3;u++){let f,d=t[u],g=o[d];this.closestPointToPoint(g,r),f=g.distanceToSquared(r),f<h&&(h=f,a&&a.copy(r),c&&c.copy(g));let E=this[d];o.closestPointToPoint(E,r),f=E.distanceToSquared(r),f<h&&(h=f,a&&a.copy(E),c&&c.copy(r))}for(let u=0;u<3;u++){let f=t[u],d=t[(u+1)%3];n.set(this[f],this[d]);for(let g=0;g<3;g++){let E=t[g],m=t[(g+1)%3];i.set(o[E],o[m]),Ka(n,i,r,e);let p=r.distanceToSquared(e);p<h&&(h=p,a&&a.copy(r),c&&c.copy(e))}}return Math.sqrt(h)}})();var un=class{constructor(e,t,n){this.isOrientedBox=!0,this.min=new R,this.max=new R,this.matrix=new ke,this.invMatrix=new ke,this.points=new Array(8).fill().map(()=>new R),this.satAxes=new Array(3).fill().map(()=>new R),this.satBounds=new Array(3).fill().map(()=>new ti),this.alignedSatBounds=new Array(3).fill().map(()=>new ti),this.needsUpdate=!1,e&&this.min.copy(e),t&&this.max.copy(t),n&&this.matrix.copy(n)}set(e,t,n){this.min.copy(e),this.max.copy(t),this.matrix.copy(n),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}};un.prototype.update=(function(){return function(){let e=this.matrix,t=this.min,n=this.max,i=this.points;for(let l=0;l<=1;l++)for(let h=0;h<=1;h++)for(let u=0;u<=1;u++){let f=1*l|2*h|4*u,d=i[f];d.x=l?n.x:t.x,d.y=h?n.y:t.y,d.z=u?n.z:t.z,d.applyMatrix4(e)}let s=this.satBounds,o=this.satAxes,a=i[0];for(let l=0;l<3;l++){let h=o[l],u=s[l],f=1<<l,d=i[f];h.subVectors(a,d),u.setFromPoints(h,i)}let c=this.alignedSatBounds;c[0].setFromPointsField(i,"x"),c[1].setFromPointsField(i,"y"),c[2].setFromPointsField(i,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();un.prototype.intersectsBox=(function(){let r=new ti;return function(t){this.needsUpdate&&this.update();let n=t.min,i=t.max,s=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(r.min=n.x,r.max=i.x,a[0].isSeparated(r)||(r.min=n.y,r.max=i.y,a[1].isSeparated(r))||(r.min=n.z,r.max=i.z,a[2].isSeparated(r)))return!1;for(let c=0;c<3;c++){let l=o[c],h=s[c];if(r.setFromBox(l,t),h.isSeparated(r))return!1}return!0}})();un.prototype.intersectsTriangle=(function(){let r=new Rn,e=new Array(3),t=new ti,n=new ti,i=new R;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(r.copy(o),r.update(),o=r);let a=this.satBounds,c=this.satAxes;e[0]=o.a,e[1]=o.b,e[2]=o.c;for(let f=0;f<3;f++){let d=a[f],g=c[f];if(t.setFromPoints(g,e),d.isSeparated(t))return!1}let l=o.satBounds,h=o.satAxes,u=this.points;for(let f=0;f<3;f++){let d=l[f],g=h[f];if(t.setFromPoints(g,u),d.isSeparated(t))return!1}for(let f=0;f<3;f++){let d=c[f];for(let g=0;g<4;g++){let E=h[g];if(i.crossVectors(d,E),t.setFromPoints(i,e),n.setFromPoints(i,u),t.isSeparated(n))return!1}}return!0}})();un.prototype.closestPointToPoint=(function(){return function(e,t){return this.needsUpdate&&this.update(),t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),t}})();un.prototype.distanceToPoint=(function(){let r=new R;return function(t){return this.closestPointToPoint(t,r),t.distanceTo(r)}})();un.prototype.distanceToBox=(function(){let r=["x","y","z"],e=new Array(12).fill().map(()=>new kn),t=new Array(12).fill().map(()=>new kn),n=new R,i=new R;return function(o,a=0,c=null,l=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(c||l)&&(o.getCenter(i),this.closestPointToPoint(i,n),o.closestPointToPoint(n,i),c&&c.copy(n),l&&l.copy(i)),0;let h=a*a,u=o.min,f=o.max,d=this.points,g=1/0;for(let m=0;m<8;m++){let p=d[m];i.copy(p).clamp(u,f);let M=p.distanceToSquared(i);if(M<g&&(g=M,c&&c.copy(p),l&&l.copy(i),M<h))return Math.sqrt(M)}let E=0;for(let m=0;m<3;m++)for(let p=0;p<=1;p++)for(let M=0;M<=1;M++){let x=(m+1)%3,v=(m+2)%3,S=p<<x|M<<v,A=1<<m|p<<x|M<<v,C=d[S],I=d[A];e[E].set(C,I);let _=r[m],b=r[x],P=r[v],U=t[E],N=U.start,H=U.end;N[_]=u[_],N[b]=p?u[b]:f[b],N[P]=M?u[P]:f[b],H[_]=f[_],H[b]=p?u[b]:f[b],H[P]=M?u[P]:f[b],E++}for(let m=0;m<=1;m++)for(let p=0;p<=1;p++)for(let M=0;M<=1;M++){i.x=m?f.x:u.x,i.y=p?f.y:u.y,i.z=M?f.z:u.z,this.closestPointToPoint(i,n);let x=i.distanceToSquared(n);if(x<g&&(g=x,c&&c.copy(n),l&&l.copy(i),x<h))return Math.sqrt(x)}for(let m=0;m<12;m++){let p=e[m];for(let M=0;M<12;M++){let x=t[M];Ka(p,x,n,i);let v=n.distanceToSquared(i);if(v<g&&(g=v,c&&c.copy(n),l&&l.copy(i),v<h))return Math.sqrt(v)}}return Math.sqrt(g)}})();var Ad=class extends zr{constructor(){super(()=>new Rn)}},Wn=new Ad;at();var Ja=new R,Rd=new R;function Jg(r,e,t={},n=0,i=1/0){let s=n*n,o=i*i,a=1/0,c=null;if(r.shapecast({boundsTraverseOrder:h=>(Ja.copy(e).clamp(h.min,h.max),Ja.distanceToSquared(e)),intersectsBounds:(h,u,f)=>f<a&&f<o,intersectsTriangle:(h,u)=>{h.closestPointToPoint(e,Ja);let f=e.distanceToSquared(Ja);return f<a&&(Rd.copy(Ja),a=f,c=u),f<s}}),a===1/0)return null;let l=Math.sqrt(a);return t.point?t.point.copy(Rd):t.point=Rd.clone(),t.distance=l,t.faceIndex=c,t}at();var ku=parseInt("180")>=169,B1=parseInt("180")<=161,bs=new R,As=new R,Rs=new R,Vu=new de,Gu=new de,Wu=new de,Qg=new R,$g=new R,e0=new R,Qa=new R;function H1(r,e,t,n,i,s,o,a){let c;if(s===Mn?c=r.intersectTriangle(n,t,e,!0,i):c=r.intersectTriangle(e,t,n,s!==Mt,i),c===null)return null;let l=r.origin.distanceTo(i);return l<o||l>a?null:{distance:l,point:i.clone()}}function t0(r,e,t,n,i,s,o,a,c,l,h){bs.fromBufferAttribute(e,s),As.fromBufferAttribute(e,o),Rs.fromBufferAttribute(e,a);let u=H1(r,bs,As,Rs,Qa,c,l,h);if(u){if(n){Vu.fromBufferAttribute(n,s),Gu.fromBufferAttribute(n,o),Wu.fromBufferAttribute(n,a),u.uv=new de;let d=Nn.getInterpolation(Qa,bs,As,Rs,Vu,Gu,Wu,u.uv);ku||(u.uv=d)}if(i){Vu.fromBufferAttribute(i,s),Gu.fromBufferAttribute(i,o),Wu.fromBufferAttribute(i,a),u.uv1=new de;let d=Nn.getInterpolation(Qa,bs,As,Rs,Vu,Gu,Wu,u.uv1);ku||(u.uv1=d),B1&&(u.uv2=u.uv1)}if(t){Qg.fromBufferAttribute(t,s),$g.fromBufferAttribute(t,o),e0.fromBufferAttribute(t,a),u.normal=new R;let d=Nn.getInterpolation(Qa,bs,As,Rs,Qg,$g,e0,u.normal);u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1),ku||(u.normal=d)}let f={a:s,b:o,c:a,normal:new R,materialIndex:0};if(Nn.getNormal(bs,As,Rs,f.normal),u.face=f,u.faceIndex=s,ku){let d=new R;Nn.getBarycoord(Qa,bs,As,Rs,d),u.barycoord=d}}return u}function n0(r){return r&&r.isMaterial?r.side:r}function No(r,e,t,n,i,s,o){let a=n*3,c=a+0,l=a+1,h=a+2,{index:u,groups:f}=r;r.index&&(c=u.getX(c),l=u.getX(l),h=u.getX(h));let{position:d,normal:g,uv:E,uv1:m}=r.attributes;if(Array.isArray(e)){let p=n*3;for(let M=0,x=f.length;M<x;M++){let{start:v,count:S,materialIndex:A}=f[M];if(p>=v&&p<v+S){let C=n0(e[A]),I=t0(t,d,g,E,m,c,l,h,C,s,o);if(I)if(I.faceIndex=n,I.face.materialIndex=A,i)i.push(I);else return I}}}else{let p=n0(e),M=t0(t,d,g,E,m,c,l,h,p,s,o);if(M)if(M.faceIndex=n,M.face.materialIndex=0,i)i.push(M);else return M}return null}function Kt(r,e,t,n){let i=r.a,s=r.b,o=r.c,a=e,c=e+1,l=e+2;t&&(a=t.getX(a),c=t.getX(c),l=t.getX(l)),i.x=n.getX(a),i.y=n.getY(a),i.z=n.getZ(a),s.x=n.getX(c),s.y=n.getY(c),s.z=n.getZ(c),o.x=n.getX(l),o.y=n.getY(l),o.z=n.getZ(l)}function i0(r,e,t,n,i,s,o,a){let{geometry:c,_indirectBuffer:l}=r;for(let h=n,u=n+i;h<u;h++)No(c,e,t,h,s,o,a)}function r0(r,e,t,n,i,s,o){let{geometry:a,_indirectBuffer:c}=r,l=1/0,h=null;for(let u=n,f=n+i;u<f;u++){let d;d=No(a,e,t,u,null,s,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function s0(r,e,t,n,i,s,o){let{geometry:a}=t,{index:c}=a,l=a.attributes.position;for(let h=r,u=e+r;h<u;h++){let f;if(f=h,Kt(o,f*3,c,l),o.needsUpdate=!0,n(o,f,i,s))return!0}return!1}function o0(r,e=null){e&&Array.isArray(e)&&(e=new Set(e));let t=r.geometry,n=t.index?t.index.array:null,i=t.attributes.position,s,o,a,c,l=0,h=r._roots;for(let f=0,d=h.length;f<d;f++)s=h[f],o=new Uint32Array(s),a=new Uint16Array(s),c=new Float32Array(s),u(0,l),l+=s.byteLength;function u(f,d,g=!1){let E=f*2;if(Ut(E,a)){let m=Gt(f,o),p=Yt(E,a),M=1/0,x=1/0,v=1/0,S=-1/0,A=-1/0,C=-1/0;for(let I=3*m,w=3*(m+p);I<w;I++){let _=n[I],b=i.getX(_),P=i.getY(_),U=i.getZ(_);b<M&&(M=b),b>S&&(S=b),P<x&&(x=P),P>A&&(A=P),U<v&&(v=U),U>C&&(C=U)}return c[f+0]!==M||c[f+1]!==x||c[f+2]!==v||c[f+3]!==S||c[f+4]!==A||c[f+5]!==C?(c[f+0]=M,c[f+1]=x,c[f+2]=v,c[f+3]=S,c[f+4]=A,c[f+5]=C,!0):!1}else{let m=Ot(f),p=zt(f,o),M=g,x=!1,v=!1;if(e){if(!M){let _=m/8+d/32,b=p/8+d/32;x=e.has(_),v=e.has(b),M=!x&&!v}}else x=!0,v=!0;let S=M||x,A=M||v,C=!1;S&&(C=u(m,d,M));let I=!1;A&&(I=u(p,d,M));let w=C||I;if(w)for(let _=0;_<3;_++){let b=m+_,P=p+_,U=c[b],N=c[b+3],H=c[P],V=c[P+3];c[f+_]=U<H?U:H,c[f+_+3]=N>V?N:V}return w}}}function hi(r,e,t,n,i){let s,o,a,c,l,h,u=1/t.direction.x,f=1/t.direction.y,d=1/t.direction.z,g=t.origin.x,E=t.origin.y,m=t.origin.z,p=e[r],M=e[r+3],x=e[r+1],v=e[r+3+1],S=e[r+2],A=e[r+3+2];return u>=0?(s=(p-g)*u,o=(M-g)*u):(s=(M-g)*u,o=(p-g)*u),f>=0?(a=(x-E)*f,c=(v-E)*f):(a=(v-E)*f,c=(x-E)*f),s>c||a>o||((a>s||isNaN(s))&&(s=a),(c<o||isNaN(o))&&(o=c),d>=0?(l=(S-m)*d,h=(A-m)*d):(l=(A-m)*d,h=(S-m)*d),s>h||l>o)?!1:((l>s||s!==s)&&(s=l),(h<o||o!==o)&&(o=h),s<=i&&o>=n)}function a0(r,e,t,n,i,s,o,a){let{geometry:c,_indirectBuffer:l}=r;for(let h=n,u=n+i;h<u;h++){let f=l?l[h]:h;No(c,e,t,f,s,o,a)}}function c0(r,e,t,n,i,s,o){let{geometry:a,_indirectBuffer:c}=r,l=1/0,h=null;for(let u=n,f=n+i;u<f;u++){let d;d=No(a,e,t,c?c[u]:u,null,s,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function l0(r,e,t,n,i,s,o){let{geometry:a}=t,{index:c}=a,l=a.attributes.position;for(let h=r,u=e+r;h<u;h++){let f;if(f=t.resolveTriangleIndex(h),Kt(o,f*3,c,l),o.needsUpdate=!0,n(o,f,i,s))return!0}return!1}function u0(r,e,t,n,i,s,o){Bt.setBuffer(r._roots[e]),Cd(0,r,t,n,i,s,o),Bt.clearBuffer()}function Cd(r,e,t,n,i,s,o){let{float32Array:a,uint16Array:c,uint32Array:l}=Bt,h=r*2;if(Ut(h,c)){let f=Gt(r,l),d=Yt(h,c);i0(e,t,n,f,d,i,s,o)}else{let f=Ot(r);hi(f,a,n,s,o)&&Cd(f,e,t,n,i,s,o);let d=zt(r,l);hi(d,a,n,s,o)&&Cd(d,e,t,n,i,s,o)}}var F1=["x","y","z"];function h0(r,e,t,n,i,s){Bt.setBuffer(r._roots[e]);let o=Id(0,r,t,n,i,s);return Bt.clearBuffer(),o}function Id(r,e,t,n,i,s){let{float32Array:o,uint16Array:a,uint32Array:c}=Bt,l=r*2;if(Ut(l,a)){let u=Gt(r,c),f=Yt(l,a);return r0(e,t,n,u,f,i,s)}else{let u=Ao(r,c),f=F1[u],g=n.direction[f]>=0,E,m;g?(E=Ot(r),m=zt(r,c)):(E=zt(r,c),m=Ot(r));let M=hi(E,o,n,i,s)?Id(E,e,t,n,i,s):null;if(M){let S=M.point[f];if(g?S<=o[m+u]:S>=o[m+u+3])return M}let v=hi(m,o,n,i,s)?Id(m,e,t,n,i,s):null;return M&&v?M.distance<=v.distance?M:v:M||v||null}}at();var Xu=new ht,Uo=new Rn,Bo=new Rn,$a=new ke,f0=new un,qu=new un;function d0(r,e,t,n){Bt.setBuffer(r._roots[e]);let i=Pd(0,r,t,n);return Bt.clearBuffer(),i}function Pd(r,e,t,n,i=null){let{float32Array:s,uint16Array:o,uint32Array:a}=Bt,c=r*2;if(i===null&&(t.boundingBox||t.computeBoundingBox(),f0.set(t.boundingBox.min,t.boundingBox.max,n),i=f0),Ut(c,o)){let h=e.geometry,u=h.index,f=h.attributes.position,d=t.index,g=t.attributes.position,E=Gt(r,a),m=Yt(c,o);if($a.copy(n).invert(),t.boundsTree)return jt(r,s,qu),qu.matrix.copy($a),qu.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:M=>qu.intersectsBox(M),intersectsTriangle:M=>{M.a.applyMatrix4(n),M.b.applyMatrix4(n),M.c.applyMatrix4(n),M.needsUpdate=!0;for(let x=E*3,v=(m+E)*3;x<v;x+=3)if(Kt(Bo,x,u,f),Bo.needsUpdate=!0,M.intersectsTriangle(Bo))return!0;return!1}});{let p=Gr(t);for(let M=E*3,x=(m+E)*3;M<x;M+=3){Kt(Uo,M,u,f),Uo.a.applyMatrix4($a),Uo.b.applyMatrix4($a),Uo.c.applyMatrix4($a),Uo.needsUpdate=!0;for(let v=0,S=p*3;v<S;v+=3)if(Kt(Bo,v,d,g),Bo.needsUpdate=!0,Uo.intersectsTriangle(Bo))return!0}}}else{let h=Ot(r),u=zt(r,a);return jt(h,s,Xu),!!(i.intersectsBox(Xu)&&Pd(h,e,t,n,i)||(jt(u,s,Xu),i.intersectsBox(Xu)&&Pd(u,e,t,n,i)))}}at();var Yu=new ke,Ld=new un,ec=new un,O1=new R,z1=new R,k1=new R,V1=new R;function p0(r,e,t,n={},i={},s=0,o=1/0){e.boundingBox||e.computeBoundingBox(),Ld.set(e.boundingBox.min,e.boundingBox.max,t),Ld.needsUpdate=!0;let a=r.geometry,c=a.attributes.position,l=a.index,h=e.attributes.position,u=e.index,f=Wn.getPrimitive(),d=Wn.getPrimitive(),g=O1,E=z1,m=null,p=null;i&&(m=k1,p=V1);let M=1/0,x=null,v=null;return Yu.copy(t).invert(),ec.matrix.copy(Yu),r.shapecast({boundsTraverseOrder:S=>Ld.distanceToBox(S),intersectsBounds:(S,A,C)=>C<M&&C<o?(A&&(ec.min.copy(S.min),ec.max.copy(S.max),ec.needsUpdate=!0),!0):!1,intersectsRange:(S,A)=>{if(e.boundsTree)return e.boundsTree.shapecast({boundsTraverseOrder:I=>ec.distanceToBox(I),intersectsBounds:(I,w,_)=>_<M&&_<o,intersectsRange:(I,w)=>{for(let _=I,b=I+w;_<b;_++){Kt(d,3*_,u,h),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let P=S,U=S+A;P<U;P++){Kt(f,3*P,l,c),f.needsUpdate=!0;let N=f.distanceToTriangle(d,g,m);if(N<M&&(E.copy(g),p&&p.copy(m),M=N,x=P,v=_),N<s)return!0}}}});{let C=Gr(e);for(let I=0,w=C;I<w;I++){Kt(d,3*I,u,h),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let _=S,b=S+A;_<b;_++){Kt(f,3*_,l,c),f.needsUpdate=!0;let P=f.distanceToTriangle(d,g,m);if(P<M&&(E.copy(g),p&&p.copy(m),M=P,x=_,v=I),P<s)return!0}}}}}),Wn.releasePrimitive(f),Wn.releasePrimitive(d),M===1/0?null:(n.point?n.point.copy(E):n.point=E.clone(),n.distance=M,n.faceIndex=x,i&&(i.point?i.point.copy(p):i.point=p.clone(),i.point.applyMatrix4(Yu),E.applyMatrix4(Yu),i.distance=E.sub(i.point).length(),i.faceIndex=v),n)}function m0(r,e=null){e&&Array.isArray(e)&&(e=new Set(e));let t=r.geometry,n=t.index?t.index.array:null,i=t.attributes.position,s,o,a,c,l=0,h=r._roots;for(let f=0,d=h.length;f<d;f++)s=h[f],o=new Uint32Array(s),a=new Uint16Array(s),c=new Float32Array(s),u(0,l),l+=s.byteLength;function u(f,d,g=!1){let E=f*2;if(Ut(E,a)){let m=Gt(f,o),p=Yt(E,a),M=1/0,x=1/0,v=1/0,S=-1/0,A=-1/0,C=-1/0;for(let I=m,w=m+p;I<w;I++){let _=3*r.resolveTriangleIndex(I);for(let b=0;b<3;b++){let P=_+b;P=n?n[P]:P;let U=i.getX(P),N=i.getY(P),H=i.getZ(P);U<M&&(M=U),U>S&&(S=U),N<x&&(x=N),N>A&&(A=N),H<v&&(v=H),H>C&&(C=H)}}return c[f+0]!==M||c[f+1]!==x||c[f+2]!==v||c[f+3]!==S||c[f+4]!==A||c[f+5]!==C?(c[f+0]=M,c[f+1]=x,c[f+2]=v,c[f+3]=S,c[f+4]=A,c[f+5]=C,!0):!1}else{let m=Ot(f),p=zt(f,o),M=g,x=!1,v=!1;if(e){if(!M){let _=m/8+d/32,b=p/8+d/32;x=e.has(_),v=e.has(b),M=!x&&!v}}else x=!0,v=!0;let S=M||x,A=M||v,C=!1;S&&(C=u(m,d,M));let I=!1;A&&(I=u(p,d,M));let w=C||I;if(w)for(let _=0;_<3;_++){let b=m+_,P=p+_,U=c[b],N=c[b+3],H=c[P],V=c[P+3];c[f+_]=U<H?U:H,c[f+_+3]=N>V?N:V}return w}}}function g0(r,e,t,n,i,s,o){Bt.setBuffer(r._roots[e]),Dd(0,r,t,n,i,s,o),Bt.clearBuffer()}function Dd(r,e,t,n,i,s,o){let{float32Array:a,uint16Array:c,uint32Array:l}=Bt,h=r*2;if(Ut(h,c)){let f=Gt(r,l),d=Yt(h,c);a0(e,t,n,f,d,i,s,o)}else{let f=Ot(r);hi(f,a,n,s,o)&&Dd(f,e,t,n,i,s,o);let d=zt(r,l);hi(d,a,n,s,o)&&Dd(d,e,t,n,i,s,o)}}var G1=["x","y","z"];function x0(r,e,t,n,i,s){Bt.setBuffer(r._roots[e]);let o=Nd(0,r,t,n,i,s);return Bt.clearBuffer(),o}function Nd(r,e,t,n,i,s){let{float32Array:o,uint16Array:a,uint32Array:c}=Bt,l=r*2;if(Ut(l,a)){let u=Gt(r,c),f=Yt(l,a);return c0(e,t,n,u,f,i,s)}else{let u=Ao(r,c),f=G1[u],g=n.direction[f]>=0,E,m;g?(E=Ot(r),m=zt(r,c)):(E=zt(r,c),m=Ot(r));let M=hi(E,o,n,i,s)?Nd(E,e,t,n,i,s):null;if(M){let S=M.point[f];if(g?S<=o[m+u]:S>=o[m+u+3])return M}let v=hi(m,o,n,i,s)?Nd(m,e,t,n,i,s):null;return M&&v?M.distance<=v.distance?M:v:M||v||null}}at();var Zu=new ht,Ho=new Rn,Fo=new Rn,tc=new ke,v0=new un,ju=new un;function y0(r,e,t,n){Bt.setBuffer(r._roots[e]);let i=Ud(0,r,t,n);return Bt.clearBuffer(),i}function Ud(r,e,t,n,i=null){let{float32Array:s,uint16Array:o,uint32Array:a}=Bt,c=r*2;if(i===null&&(t.boundingBox||t.computeBoundingBox(),v0.set(t.boundingBox.min,t.boundingBox.max,n),i=v0),Ut(c,o)){let h=e.geometry,u=h.index,f=h.attributes.position,d=t.index,g=t.attributes.position,E=Gt(r,a),m=Yt(c,o);if(tc.copy(n).invert(),t.boundsTree)return jt(r,s,ju),ju.matrix.copy(tc),ju.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:M=>ju.intersectsBox(M),intersectsTriangle:M=>{M.a.applyMatrix4(n),M.b.applyMatrix4(n),M.c.applyMatrix4(n),M.needsUpdate=!0;for(let x=E,v=m+E;x<v;x++)if(Kt(Fo,3*e.resolveTriangleIndex(x),u,f),Fo.needsUpdate=!0,M.intersectsTriangle(Fo))return!0;return!1}});{let p=Gr(t);for(let M=E,x=m+E;M<x;M++){let v=e.resolveTriangleIndex(M);Kt(Ho,3*v,u,f),Ho.a.applyMatrix4(tc),Ho.b.applyMatrix4(tc),Ho.c.applyMatrix4(tc),Ho.needsUpdate=!0;for(let S=0,A=p*3;S<A;S+=3)if(Kt(Fo,S,d,g),Fo.needsUpdate=!0,Ho.intersectsTriangle(Fo))return!0}}}else{let h=Ot(r),u=zt(r,a);return jt(h,s,Zu),!!(i.intersectsBox(Zu)&&Ud(h,e,t,n,i)||(jt(u,s,Zu),i.intersectsBox(Zu)&&Ud(u,e,t,n,i)))}}at();var Ku=new ke,Bd=new un,nc=new un,W1=new R,X1=new R,q1=new R,Y1=new R;function _0(r,e,t,n={},i={},s=0,o=1/0){e.boundingBox||e.computeBoundingBox(),Bd.set(e.boundingBox.min,e.boundingBox.max,t),Bd.needsUpdate=!0;let a=r.geometry,c=a.attributes.position,l=a.index,h=e.attributes.position,u=e.index,f=Wn.getPrimitive(),d=Wn.getPrimitive(),g=W1,E=X1,m=null,p=null;i&&(m=q1,p=Y1);let M=1/0,x=null,v=null;return Ku.copy(t).invert(),nc.matrix.copy(Ku),r.shapecast({boundsTraverseOrder:S=>Bd.distanceToBox(S),intersectsBounds:(S,A,C)=>C<M&&C<o?(A&&(nc.min.copy(S.min),nc.max.copy(S.max),nc.needsUpdate=!0),!0):!1,intersectsRange:(S,A)=>{if(e.boundsTree){let C=e.boundsTree;return C.shapecast({boundsTraverseOrder:I=>nc.distanceToBox(I),intersectsBounds:(I,w,_)=>_<M&&_<o,intersectsRange:(I,w)=>{for(let _=I,b=I+w;_<b;_++){let P=C.resolveTriangleIndex(_);Kt(d,3*P,u,h),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let U=S,N=S+A;U<N;U++){let H=r.resolveTriangleIndex(U);Kt(f,3*H,l,c),f.needsUpdate=!0;let V=f.distanceToTriangle(d,g,m);if(V<M&&(E.copy(g),p&&p.copy(m),M=V,x=U,v=_),V<s)return!0}}}})}else{let C=Gr(e);for(let I=0,w=C;I<w;I++){Kt(d,3*I,u,h),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let _=S,b=S+A;_<b;_++){let P=r.resolveTriangleIndex(_);Kt(f,3*P,l,c),f.needsUpdate=!0;let U=f.distanceToTriangle(d,g,m);if(U<M&&(E.copy(g),p&&p.copy(m),M=U,x=_,v=I),U<s)return!0}}}}}),Wn.releasePrimitive(f),Wn.releasePrimitive(d),M===1/0?null:(n.point?n.point.copy(E):n.point=E.clone(),n.distance=M,n.faceIndex=x,i&&(i.point?i.point.copy(p):i.point=p.clone(),i.point.applyMatrix4(Ku),E.applyMatrix4(Ku),i.distance=E.sub(i.point).length(),i.faceIndex=v),n)}function Hd(r,e,t){return r===null?null:(r.point.applyMatrix4(e.matrixWorld),r.distance=r.point.distanceTo(t.ray.origin),r.object=e,r)}var Ju=new un,Qu=new Di,E0=new R,M0=new ke,S0=new R,Fd=["getX","getY","getZ"],Xi=class r extends zu{static serialize(e,t={}){t={cloneBuffers:!0,...t};let n=e.geometry,i=e._roots,s=e._indirectBuffer,o=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};return t.cloneBuffers?(a.roots=i.map(c=>c.slice()),a.index=o?o.array.slice():null,a.indirectBuffer=s?s.slice():null):(a.roots=i,a.index=o?o.array:null,a.indirectBuffer=s),a}static deserialize(e,t,n={}){n={setIndex:!0,indirect:!!e.indirectBuffer,...n};let{index:i,roots:s,indirectBuffer:o}=e;e.version||(console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),c(s));let a=new r(t,{...n,[qa]:!0});if(a._roots=s,a._indirectBuffer=o||null,n.setIndex){let l=t.getIndex();if(l===null){let h=new Rt(e.index,1,!1);t.setIndex(h)}else l.array!==i&&(l.array.set(i),l.needsUpdate=!0)}return a;function c(l){for(let h=0;h<l.length;h++){let u=l[h],f=new Uint32Array(u),d=new Uint16Array(u);for(let g=0,E=u.byteLength/32;g<E;g++){let m=8*g,p=2*m;Ut(p,d)||(f[m+6]=f[m+6]/8-g)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(e,t={}){t.maxLeafTris&&(console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.'),t={...t,targetLeafSize:t.maxLeafTris}),super(e,t)}shiftTriangleOffsets(e){return super.shiftPrimitiveOffsets(e)}writePrimitiveBounds(e,t,n){let i=this.geometry,s=this._indirectBuffer,o=i.attributes.position,a=i.index?i.index.array:null,l=(s?s[e]:e)*3,h=l+0,u=l+1,f=l+2;a&&(h=a[h],u=a[u],f=a[f]);for(let d=0;d<3;d++){let g=o[Fd[d]](h),E=o[Fd[d]](u),m=o[Fd[d]](f),p=g;E<p&&(p=E),m<p&&(p=m);let M=g;E>M&&(M=E),m>M&&(M=m),t[n+d]=p,t[n+d+3]=M}return t}computePrimitiveBounds(e,t,n){let i=this.geometry,s=this._indirectBuffer,o=i.attributes.position,a=i.index?i.index.array:null,c=o.normalized;if(e<0||t+e-n.offset>n.length/6)throw new Error("MeshBVH: compute triangle bounds range is invalid.");let l=o.array,h=o.offset||0,u=3;o.isInterleavedBufferAttribute&&(u=o.data.stride);let f=["getX","getY","getZ"],d=n.offset;for(let g=e,E=e+t;g<E;g++){let p=(s?s[g]:g)*3,M=(g-d)*6,x=p+0,v=p+1,S=p+2;a&&(x=a[x],v=a[v],S=a[S]),c||(x=x*u+h,v=v*u+h,S=S*u+h);for(let A=0;A<3;A++){let C,I,w;c?(C=o[f[A]](x),I=o[f[A]](v),w=o[f[A]](S)):(C=l[x+A],I=l[v+A],w=l[S+A]);let _=C;I<_&&(_=I),w<_&&(_=w);let b=C;I>b&&(b=I),w>b&&(b=w);let P=(b-_)/2,U=A*2;n[M+U+0]=_+P,n[M+U+1]=P+(Math.abs(_)+P)*To}}return n}raycastObject3D(e,t,n=[]){let{material:i}=e;if(i===void 0)return;M0.copy(e.matrixWorld).invert(),Qu.copy(t.ray).applyMatrix4(M0),S0.setFromMatrixScale(e.matrixWorld),E0.copy(Qu.direction).multiply(S0);let s=E0.length(),o=t.near/s,a=t.far/s;if(t.firstHitOnly===!0){let c=this.raycastFirst(Qu,i,o,a);c=Hd(c,e,t),c&&n.push(c)}else{let c=this.raycast(Qu,i,o,a);for(let l=0,h=c.length;l<h;l++){let u=Hd(c[l],e,t);u&&n.push(u)}}return n}refit(e=null){return(this.indirect?m0:o0)(this,e)}raycast(e,t=An,n=0,i=1/0){let s=this._roots,o=[],a=this.indirect?g0:u0;for(let c=0,l=s.length;c<l;c++)a(this,c,t,e,o,n,i);return o}raycastFirst(e,t=An,n=0,i=1/0){let s=this._roots,o=null,a=this.indirect?x0:h0;for(let c=0,l=s.length;c<l;c++){let h=a(this,c,t,e,n,i);h!=null&&(o==null||h.distance<o.distance)&&(o=h)}return o}intersectsGeometry(e,t){let n=!1,i=this._roots,s=this.indirect?y0:d0;for(let o=0,a=i.length;o<a&&(n=s(this,o,e,t),!n);o++);return n}shapecast(e){let t=Wn.getPrimitive(),n=super.shapecast({...e,intersectsPrimitive:e.intersectsTriangle,scratchPrimitive:t,iterate:this.indirect?l0:s0});return Wn.releasePrimitive(t),n}bvhcast(e,t,n){let{intersectsRanges:i,intersectsTriangles:s}=n,o=Wn.getPrimitive(),a=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?g=>{let E=this.resolveTriangleIndex(g);Kt(o,E*3,a,c)}:g=>{Kt(o,g*3,a,c)},h=Wn.getPrimitive(),u=e.geometry.index,f=e.geometry.attributes.position,d=e.indirect?g=>{let E=e.resolveTriangleIndex(g);Kt(h,E*3,u,f)}:g=>{Kt(h,g*3,u,f)};if(s){if(!(e instanceof r))throw new Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');let g=(E,m,p,M,x,v,S,A)=>{for(let C=p,I=p+M;C<I;C++){d(C),h.a.applyMatrix4(t),h.b.applyMatrix4(t),h.c.applyMatrix4(t),h.needsUpdate=!0;for(let w=E,_=E+m;w<_;w++)if(l(w),o.needsUpdate=!0,s(o,h,w,C,x,v,S,A))return!0}return!1};if(i){let E=i;i=function(m,p,M,x,v,S,A,C){return E(m,p,M,x,v,S,A,C)?!0:g(m,p,M,x,v,S,A,C)}}else i=g}return super.bvhcast(e,t,{intersectsRanges:i})}intersectsBox(e,t){return Ju.set(e.min,e.max,t),Ju.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Ju.intersectsBox(n),intersectsTriangle:n=>Ju.intersectsTriangle(n)})}intersectsSphere(e){return this.shapecast({intersectsBounds:t=>e.intersectsBox(t),intersectsTriangle:t=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,n={},i={},s=0,o=1/0){return(this.indirect?_0:p0)(this,e,t,n,i,s,o)}closestPointToPoint(e,t={},n=0,i=1/0){return Jg(this,e,t,n,i)}};at();var j2=parseInt("180")>=166,Oo={Mesh:_e.prototype.raycast,Line:Ni.prototype.raycast,LineSegments:Ui.prototype.raycast,LineLoop:Ir.prototype.raycast,Points:yi.prototype.raycast,BatchedMesh:ha.prototype.raycast},Cn=new _e,$u=[];function Wr(r,e){if(this.isBatchedMesh)Z1.call(this,r,e);else{let{geometry:t}=this;if(t.boundsTree)t.boundsTree.raycastObject3D(this,r,e);else{let n;if(this instanceof _e)n=Oo.Mesh;else if(this instanceof Ui)n=Oo.LineSegments;else if(this instanceof Ir)n=Oo.LineLoop;else if(this instanceof Ni)n=Oo.Line;else if(this instanceof yi)n=Oo.Points;else throw new Error("BVH: Fallback raycast function not found.");n.call(this,r,e)}}}function Z1(r,e){if(this.boundsTrees){let t=this.boundsTrees,n=this._drawInfo||this._instanceInfo,i=this._drawRanges||this._geometryInfo,s=this.matrixWorld;Cn.material=this.material,Cn.geometry=this.geometry;let o=Cn.geometry.boundsTree,a=Cn.geometry.drawRange;Cn.geometry.boundingSphere===null&&(Cn.geometry.boundingSphere=new mn);for(let c=0,l=n.length;c<l;c++){if(!this.getVisibleAt(c))continue;let h=n[c].geometryIndex;if(Cn.geometry.boundsTree=t[h],this.getMatrixAt(c,Cn.matrixWorld).premultiply(s),!Cn.geometry.boundsTree){this.getBoundingBoxAt(h,Cn.geometry.boundingBox),this.getBoundingSphereAt(h,Cn.geometry.boundingSphere);let u=i[h];Cn.geometry.setDrawRange(u.start,u.count)}Cn.raycast(r,$u);for(let u=0,f=$u.length;u<f;u++){let d=$u[u];d.object=this,d.batchId=c,e.push(d)}$u.length=0}Cn.geometry.boundsTree=o,Cn.geometry.drawRange=a,Cn.material=null,Cn.geometry=null}else Oo.BatchedMesh.call(this,r,e)}function w0(r){r.traverse(e=>{e instanceof _e&&!(e instanceof ot)&&/V21.*solid.*inhabited/i.test(e.name+" "+e.parent?.name)&&(e.geometry.boundsTree||(e.geometry.boundsTree=new Xi(e.geometry,{indirect:!0})),e.raycast=Wr)})}var T0="./blender/reference-architecture-v20/";async function b0(r,e){let t=new Kn,[n,i,s]=await Promise.all([t.loadAsync(T0+"polyphemus-v20.glb"),t.loadAsync("./blender/reference-architecture-v21/inhabited-island.glb"),fetch(T0+"input-anatomy.json").then(C=>C.json())]),o=n.scene;o.name="Native V20 complete one-eyed shepherd / matching feet and chest direction",o.position.set(-70,s.supportHeight,-129),o.scale.setScalar(8.5),o.rotation.y=-.32,r.add(o);let a,c=[],l=new Set,h={value:0};if(o.traverse(C=>{if(C instanceof _e){c.push(C.geometry),C.castShadow=!0,C.receiveShadow=!/skin|eyeball|eyelid/i.test(C.name),/eyeball/i.test(C.name)&&!Array.isArray(C.material)&&(a=C);for(let I of Array.isArray(C.material)?C.material:[C.material])l.add(I),I instanceof Xe&&(I.envMapIntensity=.19,I.normalMap&&I.normalScale.set(.22,.22),/tunic|mantle/i.test(I.name)&&(I.roughness=.96,I.color.set(/mantle/i.test(I.name)?6967352:10779715),I.onBeforeCompile=w=>{w.uniforms.clothTime=h,w.vertexShader=w.vertexShader.replace("#include <common>",`#include <common>
uniform float clothTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
transformed.z+=.0025*sin(clothTime*.7+position.y*3.)*smoothstep(.60,1.25,position.y);`)},I.customProgramCacheKey=()=>"v20-wool-breathing"))}}),!a)throw Error("Native Polyphemus single eye missing");o.traverse(C=>{if(C instanceof _e){let I=C.geometry.clone(),w=I.getAttribute("position");for(let _=0;_<w.count;_++){let b=w.getY(_),P=_t.smoothstep(b,.98,1.13)*(1-_t.smoothstep(b,1.4,1.52));w.setX(_,w.getX(_)*(1-.23*P)),w.setZ(_,w.getZ(_)*(1-.34*P))}I.computeVertexNormals(),C.geometry=I}}),o.traverse(C=>{C instanceof _e&&/nipple/i.test(C.name+" "+(Array.isArray(C.material)?C.material.map(I=>I.name).join(" "):C.material.name))&&(C.visible=!1)});let u=Bg(o);l.add(u.skin),i.scene.name="Blender V20 / broad inhabited island, layered cliffs, beach and olive woodland",i.scene.position.set(-65,0,-140),i.scene.scale.set(1.38,1,1.38),i.scene.traverse(C=>{if(C instanceof _e){C.castShadow=C.receiveShadow=!0;for(let I of Array.isArray(C.material)?C.material:[C.material])I instanceof Xe&&(I.envMapIntensity=.18,I.normalMap&&I.normalScale.set(.45,.45),I.map&&(I.map.anisotropy=4),/foliage/i.test(I.name)&&(I.side=Mt,I.onBeforeCompile=w=>{w.uniforms.islandWind=h,w.vertexShader=w.vertexShader.replace("#include <common>",`#include <common>
uniform float islandWind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
transformed.x+=.045*sin(islandWind*.45+position.x*.8+position.z*.7);`)},I.customProgramCacheKey=()=>"native-olive-leaf-breeze-v20"))}}),r.add(i.scene);let f=Ug(i.scene);w0(i.scene);let d=Iu(e);i.scene.traverse(C=>{C instanceof _e&&/V21.*solid.*inhabited/i.test(C.name+" "+C.parent?.name)&&(C.material=d)}),i.scene.updateWorldMatrix(!0,!0);let g=[];i.scene.traverse(C=>{C instanceof _e&&/V21.*solid.*inhabited/i.test(C.name+" "+C.parent?.name)&&g.push(C)});let m=new Bn(new R(-70,90,-129),new R(0,-1,0)).intersectObjects(g,!1)[0];m&&(o.position.y=m.point.y-s.worldBounds.min[1]*8.5);let p=i.scene.clone(!0);p.position.set(110,-2,-240),p.scale.set(.68,.72,.73),p.rotation.y=-.65,p.name="Secondary green headland with eroded coves",r.add(p);let M=Ng(r,i.scene,e);i.scene.userData.habitats=M.species;let x=new R().fromArray(s.rightHandLocal),v=new R().fromArray(s.leftHandLocal),S=new Dt;S.position.copy(x),o.add(S),o.userData.nativeHeldRock=o.userData.nativeFootReef=!0;let A={...s,nativeBlender:!0,newGarment:!1,completeGarment:!1,bareFigure:{clothing:!1,removedMeshes:u.removedGarmentAndHairMeshes,bodyMeshes:u.bodyMeshes,surface:u.surface},eyeCount:1,continuousBody:!0,oneContinuousHeadNeckBody:!0,liveSkeletons:0,heldObject:"none",scale:8.5,figureHeight:s.worldBounds.size[1]*8.5,groundSupport:o.position.y,terrain:f,cloth:"none / exposed weathered anatomy",islandWidth:f.width,habitats:M.species,cave:"Native V21 carved sea-facing cave in a solid island",source:"Retained Blender anatomy / V32.80 male chest and forest scale correction"};return o.userData.cyclops=A,{root:o,rightHand:x,leftHand:v,eye:a,heldRockAnchor:S,stats:A,update:C=>{h.value=C},dispose:()=>{c.forEach(C=>C.dispose()),l.forEach(C=>C.dispose())}}}at();Ss();function A0(r){let e=[];return r.traverse(t=>{if(!(t instanceof _e)||t instanceof ot)return;let n=t,i=!1;for(;n;)/flagship|galley|scout|provision ship|Native V20 complete|Blender V20.*inhabited|Secondary green headland|Native V21|Closed continent/i.test(n.name)&&(i=!0),n=n.parent;i&&!(Array.isArray(t.material)?t.material:[t.material]).some(s=>s instanceof Nt)&&(t.userData.native84Key="native84_"+e.length,e.push(t))}),e}function Od(r,e,t){r.updateMatrixWorld(!0);let n=new R,i=t.map(o=>{let a=o.geometry,c=a.getAttribute("position"),l=[];for(let f=0;f<c.count;f++)n.fromBufferAttribute(c,f),o instanceof En&&o.applyBoneTransform(f,n),n.applyMatrix4(o.matrixWorld),l.push(...n.toArray());let h=Array.isArray(o.material)?o.material[0]:o.material,u=f=>{let d=f?.image;return typeof d?.src=="string"?new URL(d.src,location.href).pathname.slice(1):null};return{key:o.userData.native84Key,name:o.name,visible:o.visible,skinned:o instanceof En,vertices:l,index:a.index?Array.from(a.index.array):null,uv:a.getAttribute("uv")?Array.from(a.getAttribute("uv").array):null,color:h.color?.toArray()??[.3,.3,.3],roughness:h.roughness,metalness:h.metalness,map:u(h.map),normalMap:u(h.normalMap),roughnessMap:u(h.roughnessMap),groups:a.groups}}),s=[];return r.traverse(o=>{if(o instanceof ot&&/forest|canop|trunk|pine|oak/i.test(o.name)){let a=[],c=new ke;for(let l=0;l<o.count;l++)o.getMatrixAt(l,c),a.push(o.matrixWorld.clone().multiply(c).elements);s.push({name:o.name,matrices:a})}}),{source:"V32.83 actual current expanded world geometry",coordinateSystem:"Three.js right-handed Y-up",meshes:i,trees:s,camera:{position:e.position.toArray(),target:[-29,27,-85],fov:e.fov},sun:{position:[-45,45,-160],target:[-12,8,-15]}}}async function R0(r,e){let{GLTFLoader:t}=await Promise.resolve().then(()=>(Ts(),gg)),n=(await new t().loadAsync("./blender/mythology-v32-95/refined-world.glb")).scene;n.updateMatrixWorld(!0);let i=new Map(r.map(m=>[m.userData.native84Key,m])),s=0,o=0,a=new Map;n.traverse(m=>{if(!(m instanceof _e))return;let p=m,M;for(;p&&!M;)M=/native84_\d+/.exec(p.name)?.[0],p=p.parent;if(M){let x=a.get(M)??[];x.push(m),a.set(M,x)}});for(let[m,p]of a){let M=i.get(m);if(!M)continue;let x=p.map(S=>S.geometry.clone().applyMatrix4(S.matrixWorld).applyMatrix4(M.matrixWorld.clone().invert()));if(!(M instanceof En)){let S=x.length===1?x[0]:Ti(x,!0);S&&(M.geometry=S,s++)}let v=p.flatMap(S=>Array.isArray(S.material)?S.material:[S.material]);for(let S of v)if(S instanceof Xe){S.envMapIntensity=.22,S.aoMap&&(S.aoMapIntensity=.65);for(let A of[S.map,S.normalMap,S.roughnessMap,S.metalnessMap,S.aoMap])A&&(A.anisotropy=8,A.needsUpdate=!0);S.side=Mt}!/Wind-filled linen sail/.test(M.name)&&!(M instanceof En)&&(M.material=v.length===1?v[0]:v),o++}let c=(await new t().loadAsync("./blender/mythology-v32-84/forest-crowns.glb")).scene;c.updateMatrixWorld(!0);let l=0,h=[];c.traverse(m=>{m instanceof _e&&h.push(m)}),e.traverse(m=>{if(!(m instanceof ot)||!/Dense evergreen oak crown|Mixed umbrella pine crown/.test(m.name))return;let p=h.find(A=>A.name.includes(m.name.includes("oak")?"oak":"pine"));if(!p)return;let M=p.geometry.clone().applyMatrix4(p.matrixWorld),x=Array.isArray(p.material)?p.material[0]:p.material;x.side=Mt,x.transparent=!1,x.alphaTest=.35,x.alphaToCoverage=!0,x.roughness=.94,x.envMapIntensity=.19,x.map&&(x.map.anisotropy=8);let v=new ot(M,x,Math.ceil(m.count/2)),S=new ke;for(let A=0;A<v.count;A++)m.getMatrixAt(A*2,S),v.setMatrixAt(A,S);v.name="Native Blender leaf detail / "+m.name,v.receiveShadow=!0,v.castShadow=!1,m.parent?.add(v),l+=v.count});let u=r.filter(m=>(Array.isArray(m.material)?m.material:[m.material]).some(p=>p instanceof Xe&&p.aoMap)).length,f=(await new t().loadAsync("./blender/mythology-v32-85/fleet-details.glb")).scene;f.updateMatrixWorld(!0);let d=[];e.traverse(m=>{m.userData.variant!==void 0&&m.name.match(/flagship|galley|scout|provision ship/)&&d.push(m)});let g=0,E=[];f.traverse(m=>{m instanceof _e&&E.push(m)});for(let m of E){let p=m.name.includes("escort")?1:m.name.includes("scout")?2:3,M=d.find(S=>S.userData.variant===p);if(!M)continue;let x=m.geometry.clone().applyMatrix4(m.matrixWorld).applyMatrix4(M.matrixWorld.clone().invert()),v=new _e(x,m.material);v.name=m.name,v.castShadow=v.receiveShadow=!0,M.add(v),g++}return{source:"Blender 5.1.2 / V32.95 native ridges and layered PBR",geometry:s,materials:o,aoMaterials:u,forestClusters:l,fleetDetails:g}}at();function C0(r,e,t){let n=[];r.updateMatrixWorld(!0),r.traverse(b=>{b instanceof _e&&/^native84_(19|20|21|22)$/.test(b.userData.native84Key||"")&&(b.material=Iu(e),b.receiveShadow=!0,n.push(b),b.geometry.boundsTree=new Xi(b.geometry),b.raycast=Wr)});let i=new Bn,s=new ke,o=new R,a=new ke;i.firstHitOnly=!0;let c=(b,P)=>(i.set(new R(b,120,P),new R(0,-1,0)),i.intersectObjects(n,!1)[0]),l=(b,P)=>27*Math.exp(-(((b+107)/66)**2)-((-P-178)/45)**2)+18*Math.exp(-(((b+12)/42)**2)-((-P-183)/36)**2),h=[];r.traverse(b=>{b instanceof ot&&/forest|crown|canop|trunk|pine|oak|understory|leaf litter|branch|cypress/i.test(b.name)&&h.push(b)});for(let b of h){a.copy(b.matrixWorld).invert();for(let P=0;P<b.count;P++){if(b.getMatrixAt(P,s),o.setFromMatrixPosition(s).applyMatrix4(b.matrixWorld),o.x>100||o.z>-45||o.z<-250)continue;let U=c(o.x,o.z);if(!U)continue;let N=0,H=U.point.y,V=l(o.x,o.z);for(let X=0;X<18;X++){let z=(N+H)/2;z+V*_t.smoothstep(z,7,20)>U.point.y?H=z:N=z}let Z=_t.smoothstep((N+H)/2,7,20);if(U.point.y>35||U.point.y>18&&Math.sin(o.x*.043)+Math.cos(o.z*.051)>.85){s.scale(new R(0,0,0)),b.setMatrixAt(P,s);continue}o.y+=l(o.x,o.z)*Z,o.applyMatrix4(a),s.setPosition(o),b.setMatrixAt(P,s)}b.instanceMatrix.needsUpdate=!0,b.computeBoundingSphere()}let u=[],f=[],d=9511,g=()=>(d=Math.imul(d,1664525)+1013904223>>>0,d/4294967296);for(let b=0;b<11;b++){let P=g()*Math.PI*2,U=g()*.7,N=Math.cos(P)*U,H=Math.sin(P)*U,V=.28+g()*.58,Z=.045+g()*.045;u.push(N-Z,0,H,N+Z,0,H,N+Math.cos(P)*.18,V,H+Math.sin(P)*.18);for(let X=0;X<3;X++)f.push(X===2?.48:.13,X===2?.47:.2,X===2?.19:.065)}let E=new gt;E.setAttribute("position",new Ke(u,3)),E.setAttribute("color",new Ke(f,3)),E.computeVertexNormals();let m=new ot(E,new Xe({vertexColors:!0,roughness:.96,side:Mt,envMapIntensity:.25}),4200);m.name="V95 grounded meadow / instanced grass";let p=new Ct,M=0;for(let b=0;b<6800&&M<4200;b++){let P=-192+g()*267,U=-225+g()*165;if(Math.sin(P*.065)+Math.cos(U*.073)<-.45)continue;let N=c(P,U);!N||N.point.y<4||N.point.y>34||Math.abs(N.point.x+70)<15&&Math.abs(N.point.z+129)<19||(p.position.copy(N.point),p.rotation.set(0,g()*6.28,0),p.scale.setScalar(.8+g()*1.6),p.updateMatrix(),m.setMatrixAt(M++,p.matrix))}m.count=M,m.receiveShadow=!0,m.computeBoundingSphere(),r.add(m);let x=new ot(Fr(),e,260),v=0;for(let b=0;b<950&&v<260;b++){let P=-188+g()*225,U=-223+g()*118,N=c(P,U);if(!N||N.point.y<23)continue;p.position.copy(N.point),p.position.y-=.6,p.rotation.set(g()*.35,g()*6.28,g()*.3);let H=2+g()*3.8;p.scale.set(H,H*(.55+g()*.65),H*.8),p.updateMatrix(),x.setMatrixAt(v++,p.matrix)}x.count=v,x.name="V95 fractured exposed ridge outcrops",x.castShadow=x.receiveShadow=!0,x.computeBoundingSphere(),r.add(x);let S=t[0],A=new Xe({color:6439206,roughness:.73,metalness:0,map:S.children.find(b=>b instanceof _e&&b.material.map)?.material.map||null}),C=new Xe({color:11835994,roughness:.39,metalness:.78}),I=new ot(new vn(.045,.052,1,7),C,24),w=0;for(let b of[-1,1])for(let P=0;P<12;P++){let U=4.7+P*.31;p.position.set(U,2.55,b*(1.9-(U-4.7)*.25)),p.rotation.set(0,0,0),p.scale.set(1,.95,1),p.updateMatrix(),I.setMatrixAt(w++,p.matrix)}I.castShadow=!0,S.add(I);let _=new _e(new xn(3.9,.22,3.25),A);return _.position.set(6.4,2.12,0),_.castShadow=_.receiveShadow=!0,S.add(_),S.scale.multiplyScalar(1.12),t[2].scale.z*=.82,t[3].scale.z*=1.12,{nativeVersion:95,layeredTerrainMeshes:n.length,grassTufts:M,groundedPlantBatches:h.length,heroLength:19*S.scale.x}}at();function zd(r,e){let t=[],n=new R;r.updateMatrixWorld(!0),r.traverse(h=>{if(h instanceof _e&&/V21.*solid.*inhabited/i.test(h.name+" "+h.parent?.name)){let u=h.geometry.getAttribute("position");for(let f=0;f<u.count;f+=2)n.fromBufferAttribute(u,f).applyMatrix4(h.matrixWorld),n.y>-.8&&n.y<2.4&&t.push(n.clone())}});let i=new ht().setFromPoints(t);i.expandByScalar(24);let s=i.getSize(new R),o=96,a=new Uint8Array(o*o*4),c=Math.max(1,Math.ceil(t.length/1800));for(let h=0;h<o;h++)for(let u=0;u<o;u++){let f=i.min.x+(u+.5)/o*s.x,d=i.min.z+(h+.5)/o*s.z,g=576;for(let p=0;p<t.length;p+=c){let M=t[p];g=Math.min(g,(M.x-f)**2+(M.z-d)**2)}let E=Math.round((1-_t.smoothstep(Math.sqrt(g),2,19))*255),m=(h*o+u)*4;a[m]=a[m+1]=a[m+2]=E,a[m+3]=255}let l=new $n(a,o,o);return l.needsUpdate=!0,l.minFilter=l.magFilter=Vt,e.uniforms.coastalDepth={value:l},e.uniforms.coastalBounds={value:new At(i.min.x,i.min.z,s.x,s.z)},e.userData.coastalShaderInstalled||(e.userData.coastalShaderInstalled=!0,e.fragmentShader=e.fragmentShader.replace("uniform sampler2D normalSampler;","uniform sampler2D normalSampler;uniform sampler2D coastalDepth;uniform vec4 coastalBounds;").replace("gl_FragColor=vec4(outgoingLight,alpha);",`vec2 coastUV=(worldPosition.xz-coastalBounds.xy)/coastalBounds.zw;
 float coast=texture2D(coastalDepth,clamp(coastUV,0.,1.)).r*step(0.,coastUV.x)*step(0.,coastUV.y)*step(coastUV.x,1.)*step(coastUV.y,1.);
 outgoingLight=mix(outgoingLight,outgoingLight*.82+vec3(.026,.075,.053),coast*.46);gl_FragColor=vec4(outgoingLight,alpha);`)),{shoreSamples:t.length,resolution:o,method:"distance to actual low shoreline vertices / muted green shallow-water attenuation"}}at();var I0="./assets/odyssey/pbr-v103/";async function eh(r){let e=new tn,t=await Promise.all(["Diffuse.jpg","nor_gl.jpg","Surface.png"].map(n=>e.loadAsync(I0+r+"/"+n)));return t.forEach(n=>{n.wrapS=n.wrapT=hn,n.anisotropy=8}),t[0].colorSpace=bt,{diff:t[0],normal:t[1],rough:t[2],ao:t[2],height:t[2]}}async function j1(){let r=new tn,[e,t,n]=await Promise.all(["diff","nor_gl","rough"].map(i=>r.loadAsync("./assets/odyssey/pbr-v106/sand_01/"+i+".jpg")));for(let i of[e,t,n])i.wrapS=i.wrapT=hn,i.anisotropy=8;return e.colorSpace=bt,{diff:e,normal:t,rough:n,ao:n,height:n}}var kd=`varying vec3 pbrPosition,pbrWorld,pbrNormal;
 vec3 triWeights(){vec3 w=pow(abs(normalize(pbrNormal)),vec3(4.));return w/max(dot(w,vec3(1.)),.0001);}
 vec3 tri(sampler2D tex,vec3 p,vec3 w){return texture2D(tex,p.yz).rgb*w.x+texture2D(tex,p.xz).rgb*w.y+texture2D(tex,p.xy).rgb*w.z;}
 vec3 triNormal(sampler2D tex,vec3 p,vec3 w,float strength){
  vec3 a=texture2D(tex,p.yz).xyz*2.-1.,b=texture2D(tex,p.xz).xyz*2.-1.,c=texture2D(tex,p.xy).xyz*2.-1.;
  vec3 n=normalize(pbrNormal),sgn=sign(n);
  a.xy*=strength;b.xy*=strength;c.xy*=strength;
  vec3 x=vec3(a.z*sgn.x,a.x,a.y),y=vec3(b.x,b.z*sgn.y,b.y),z=vec3(c.x,c.y,c.z*sgn.z);
  // Preserve the geometric normal; add only the photographed surface gradient.
  vec3 baseAxes=vec3(sgn.x*w.x,sgn.y*w.y,sgn.z*w.z);
  return normalize(n+(x*w.x+y*w.y+z*w.z-baseAxes));
 }`;function Vd(r){r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 pbrPosition,pbrWorld,pbrNormal;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
   vec4 pbrLocal=vec4(transformed,1.);
   #ifdef USE_INSTANCING
    pbrLocal=instanceMatrix*pbrLocal;
   #endif
   pbrPosition=pbrLocal.xyz;pbrWorld=(modelMatrix*pbrLocal).xyz;pbrNormal=inverseTransformDirection(transformedNormal,viewMatrix);`)}function K1(r,e,t){for(let s of[r,e,t])for(let o of new Set(Object.values(s)))o.wrapS=o.wrapT=Ar;let n=e.normal.clone();n.repeat.set(5.2,5.2),n.needsUpdate=!0;let i=new Xe({color:16777215,roughness:.92,normalMap:n,normalScale:new de(.12,.12),envMapIntensity:.72});return i.name="V106 fine sandy cove / stratified rock / coastal meadow",i.onBeforeCompile=s=>{Vd(s),s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 habitat;varying vec3 groundHabitat;`).replace("#include <begin_vertex>",`#include <begin_vertex>
groundHabitat=habitat;`);for(let[o,a]of Object.entries({r,b:e,f:t}))for(let[c,l]of Object.entries(a))s.uniforms[o+c]={value:l};s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
${kd}
   varying vec3 groundHabitat;uniform sampler2D rdiff,rnormal,rrough,bdiff,bnormal,brough,fdiff,fnormal,frough;
   float groundHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float groundNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(groundHash(i),groundHash(i+vec2(1.,0.)),f.x),mix(groundHash(i+vec2(0.,1.)),groundHash(i+vec2(1.)),f.x),f.y);}
   vec2 groundOffset(vec2 p){return vec2(groundHash(p),groundHash(p+13.17))*2.;}
   vec3 groundSample(sampler2D tex,vec2 uv){vec2 i=floor(uv),f=fract(uv),w=f*f*(3.-2.*f);vec3 a=texture2D(tex,f+groundOffset(i)).rgb,b=texture2D(tex,f-vec2(1.,0.)+groundOffset(i+vec2(1.,0.))).rgb,c=texture2D(tex,f-vec2(0.,1.)+groundOffset(i+vec2(0.,1.))).rgb,d=texture2D(tex,f-vec2(1.)+groundOffset(i+vec2(1.))).rgb;return mix(mix(a,b,w.x),mix(c,d,w.x),w.y);}
   vec3 groundTri(sampler2D tex,vec3 p,vec3 w){vec3 result=vec3(0.);float total=0.;if(w.x>.01){result+=groundSample(tex,p.yz)*w.x;total+=w.x;}if(w.y>.01){result+=groundSample(tex,p.xz)*w.y;total+=w.y;}if(w.z>.01){result+=groundSample(tex,p.xy)*w.z;total+=w.z;}return result/max(total,.0001);}
   vec3 groundDiffuse(sampler2D tex,vec3 p,vec3 w,vec3 meanColor){vec2 uv=p.xz*5.2;vec3 a=texture2D(tex,uv).rgb,b=texture2D(tex,mat2(.8,.6,-.6,.8)*uv*1.37+vec2(.27,.61)).rgb;float grain=clamp(dot((a+b)*.5,vec3(.333333))*3.,0.,1.);return meanColor*(.96+.08*grain);}
   vec3 groundNormal(sampler2D tex,vec3 p,vec3 w,float strength){vec3 a=groundSample(tex,p.yz)*2.-1.,b=groundSample(tex,p.xz)*2.-1.,c=groundSample(tex,p.xy)*2.-1.;vec3 n=normalize(pbrNormal),sgn=sign(n);a.xy*=strength;b.xy*=strength;c.xy*=strength;vec3 x=vec3(a.z*sgn.x,a.x,a.y),y=vec3(b.x,b.z*sgn.y,b.y),z=vec3(c.x,c.y,c.z*sgn.z);return normalize(n+x*w.x+y*w.y+z*w.z-vec3(sgn.x*w.x,sgn.y*w.y,sgn.z*w.z));}`).replace("#include <map_fragment>",`vec3 weights=triWeights();vec3 rp=pbrWorld/13.,bp=pbrWorld/2.2,fp=pbrWorld/3.15;
    float slope=normalize(pbrNormal).y;float coast=pbrWorld.y+.7*sin(pbrWorld.x*.063)*sin(pbrWorld.z*.041);
    float beach=groundHabitat.r;float forest=groundHabitat.g;
    vec3 rockColor=groundTri(rdiff,rp,weights)*vec3(1.85,1.72,1.53);vec3 sandColor=mix(groundTri(bdiff,pbrWorld*1.1,weights)*1.25,vec3(.48,.415,.30),.35);vec3 soilColor=groundTri(fdiff,fp,weights)*vec3(.75,1.05,.60);
    // Albedo remains photographic. Broad sediment colour changes do not replace its detail.
    rockColor*=mix(vec3(.87,.92,.94),vec3(1.10,1.05,.96),.5+.5*sin(pbrWorld.y*.32+pbrWorld.x*.014));
    float wet=1.-smoothstep(.2,1.7,coast);diffuseColor.rgb=mix(mix(rockColor,soilColor,forest),sandColor,beach)*(1.-wet*.32);
    float surfaceAO=mix(mix(groundTri(rrough,rp,weights).r,groundTri(frough,fp,weights).r,forest),groundTri(brough,bp,weights).r,beach);
    diffuseColor.rgb*=mix(.82,1.,surfaceAO)*(.93+.12*groundNoise(pbrWorld.xz*.025));`).replace("#include <roughnessmap_fragment>","float roughnessFactor=mix(mix(.74+.20*groundTri(rrough,rp,weights).g,.84+.14*groundTri(frough,fp,weights).g,forest),.89+.10*groundTri(brough,bp,weights).g,beach);roughnessFactor=mix(roughnessFactor,.42,wet);").replace("#include <normal_fragment_maps>","vec3 rockRelief=groundNormal(rnormal,rp,weights,.62),soilRelief=groundNormal(fnormal,fp,weights,.22),sandRelief=groundNormal(bnormal,pbrWorld*1.1,weights,.14);normal=normalize(mat3(viewMatrix)*normalize(mix(mix(rockRelief,soilRelief,forest),sandRelief,beach)));")},i.customProgramCacheKey=()=>"v106-native-landform-photographic-habitats",i}function J1(r,e){let t=new Xe({color:new Ve().setScalar(.88+e%4*.025),roughness:.78,envMapIntensity:.65,side:Mt});return t.name="V103 real weathered ship timber",t.onBeforeCompile=n=>{Vd(n);for(let[i,s]of Object.entries(r))n.uniforms["wood"+i]={value:s};n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
${kd}
uniform sampler2D wooddiff,woodnormal,woodrough;`).replace("#include <map_fragment>",`vec3 weights=triWeights();vec3 wp=pbrPosition/1.8;vec3 woodColor=tri(wooddiff,wp,weights);
    float damp=1.-smoothstep(-.2,.60,pbrWorld.y);diffuseColor.rgb*=woodColor*(1.-damp*.28);diffuseColor.rgb*=mix(.76,1.,tri(woodrough,wp,weights).r);`).replace("#include <roughnessmap_fragment>","float roughnessFactor=mix(.57+.31*tri(woodrough,wp,weights).g,.37,damp);").replace("#include <normal_fragment_maps>","normal=normalize(mat3(viewMatrix)*triNormal(woodnormal,wp,weights,.55));")},t.customProgramCacheKey=()=>"v103-real-ship-timber",t}function Q1(r){let e=new Xe({color:16777215,roughness:.88,envMapIntensity:.6});return e.name="V103 sea-worn stone / photographic microrelief",e.onBeforeCompile=t=>{Vd(t);for(let[n,i]of Object.entries(r))t.uniforms["stone"+n]={value:i};t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
${kd}
uniform sampler2D stonediff,stonenormal,stonerough;`).replace("#include <map_fragment>","vec3 weights=triWeights();vec3 rp=pbrWorld/2.;float wet=1.-smoothstep(.2,1.8,pbrWorld.y);diffuseColor.rgb*=tri(stonediff,rp,weights)*(1.-wet*.32)*mix(.72,1.,tri(stonerough,rp,weights).r);").replace("#include <roughnessmap_fragment>","float roughnessFactor=mix(.70+.23*tri(stonerough,rp,weights).g,.34,wet);").replace("#include <normal_fragment_maps>","normal=normalize(mat3(viewMatrix)*triNormal(stonenormal,rp,weights,.68));")},e.customProgramCacheKey=()=>"v103-sea-worn-stone",e}async function P0(r,e,t){let[n,i,s,o,a,c]=await Promise.all([eh("weathered_brown_planks"),eh("rough_linen"),eh("seaside_rock"),j1(),eh("forest_ground_04"),new tn().loadAsync(I0+"skin-atlas.png")]);c.colorSpace=bt,c.flipY=!1,c.anisotropy=8;let l=K1(s,o,a),h=Q1(s),u=Array.from({length:8},(S,A)=>J1(n,A)),f=new Jt({map:c,color:16777215,roughness:.63,metalness:0,envMapIntensity:.65,specularIntensity:.36});f.name="V103 original anatomical skin atlas / restored after native import",f.onBeforeCompile=S=>{S.vertexShader=S.vertexShader.replace("#include <common>",`#include <common>
varying vec3 skinPoint;`).replace("#include <begin_vertex>",`#include <begin_vertex>
skinPoint=position;`),S.fragmentShader=S.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 skinPoint;float pore(vec3 p){return sin(p.x*2133.+sin(p.z*1171.))*sin(p.y*1933.+p.z*731.);}`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
float h=pore(skinPoint)*.000045;vec3 a=dFdx(-vViewPosition),b=dFdy(-vViewPosition),c=cross(b,normal),d=cross(normal,a);float dt=dot(a,c);normal=normalize(abs(dt)*normal-sign(dt)*(dFdx(h)*c+dFdy(h)*d));`)},f.customProgramCacheKey=()=>"v103-restored-anatomy-skin";let d=f.clone();d.map=null,d.color.set(13080182),d.name="V103 anatomical eyelid / matched skin pigment";let g=0,E=0,m=0,p=0,M=0,x=0;r.traverse(S=>{if(!(S instanceof _e))return;let A=Number(String(S.userData.native84Key||"").split("_")[1]);if(A>=19&&A<=22||A>=26&&A<=29){if(!S.geometry.getAttribute("habitat")){let b=S.geometry.getAttribute("position"),P=S.geometry.getAttribute("normal"),U=new Float32Array(b.count*3),N=new R,H=new R,V=new yt().getNormalMatrix(S.matrixWorld);for(let Z=0;Z<b.count;Z++){N.fromBufferAttribute(b,Z).applyMatrix4(S.matrixWorld),H.fromBufferAttribute(P,Z).applyMatrix3(V).normalize();let X=(1-_t.smoothstep(N.y,1.8,5.2))*_t.smoothstep(H.y,.7,.94),z=_t.smoothstep(N.y,4.5,9.5)*(1-X)*_t.smoothstep(H.y,.65,.92);U.set([X,z,Math.max(0,1-X-z)],Z*3)}S.geometry.setAttribute("habitat",new Rt(U,3))}S.material=l,g++;return}if([6,7,8,12,13,14,15,17].includes(A)){let b=t.get(S.userData.native84Key);b?(S.geometry=b,S.material=f):S.material=d,S.receiveShadow=!0,p++;return}if(/eroded ridge boulder|fractured exposed ridge outcrops|littoral rock|Scanned sea-worn cliff/.test(S.name)){S.material=h,M+=S instanceof ot?S.count:1;return}let C=Array.isArray(S.material)?S.material:[S.material];if(/Wind-filled linen sail/.test(S.name)){let b=C[0],P=new Jt({map:i.diff.clone(),normalMap:i.normal.clone(),roughnessMap:i.rough.clone(),color:[14998984,12956555,13880248,9480627][S.parent?.userData.variant||0],side:Mt,roughness:.93,normalScale:new de(.28,.28),sheen:.55,sheenRoughness:.85,sheenColor:new Ve(15261120),envMapIntensity:.65}),U=S.geometry.getAttribute("position"),N=S.geometry.getAttribute("uv");S.geometry.computeBoundingBox();let H=S.geometry.boundingBox.getSize(new R);for(let V=0;V<U.count;V++){let Z=N.getX(V),X=N.getY(V),z=Math.sin(Math.PI*Z)*Math.sin(Math.PI*X);U.setZ(V,U.getZ(V)+z*(.085*Math.sin(Z*Math.PI*11+X*.9)+.028*Math.sin(Z*Math.PI*23-X*5)))}U.needsUpdate=!0,S.geometry.computeVertexNormals();for(let V of[P.map,P.normalMap,P.roughnessMap])V.repeat.set(Math.max(5,H.x/.271),Math.max(8,H.y/.271));P.onBeforeCompile=b.onBeforeCompile,P.customProgramCacheKey=()=>"v103-real-linen-seams",P.name="V103 27cm scanned linen with sewn panels",S.material=P,S.receiveShadow=!0,m++;return}let I=S,w=!1;for(;I;)e.includes(I)&&(w=!0),I=I.parent;let _=C.map((b,P)=>b instanceof Xe?w&&b.metalness<.2&&(/Batched solid hull and interior joinery/.test(b.name)&&b.map||b.color.getHex()===6439206||/Raised flagship stern|timber|wood|plank|mast|deck/i.test(S.name+" "+b.name))&&!/skin|Human|cloth|tunic|mantle|fire|linen/.test(S.name+" "+b.name)?(E++,u[P%u.length]):(/foliage|leaf|crown|canopy/i.test(S.name+" "+b.name)?(b.envMapIntensity=.85,b.roughness=.88,b.color.multiplyScalar(1.05),x++):w&&(b.envMapIntensity=.65,/Human.*body|skin/i.test(b.name)&&(b.color.set(16777215),b.roughness=.64,p++)),b):b);S.material=Array.isArray(S.material)?_:_[0]}),r.environmentIntensity=.65;let v=r.children.find(S=>S instanceof lr);return v&&(v.intensity=.72),{version:105,terrain:g,woodMeshes:E,sails:m,skinMeshes:p,stones:M,foliage:x,realPbrMaps:!0,linenSwatchMetres:.271,woodTileMetres:1.8,rockTileMetres:2,sandTileMetres:.423,groundNormalMethod:"Standard photographic grain normal; continuous UV; no biased mip division",source:"Poly Haven CC0 scans + retained native skin atlas",seaChanged:!1}}at();Ss();at();at();var Gd=new ke,ic=class r{constructor(e){e=e||{},this.zNear=e.webGL===!0?-1:0,this.vertices={near:[new R,new R,new R,new R],far:[new R,new R,new R,new R]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4)}setFromProjectionMatrix(e,t){let n=this.zNear,i=e.elements[11]===0;return Gd.copy(e).invert(),this.vertices.near[0].set(1,1,n),this.vertices.near[1].set(1,-1,n),this.vertices.near[2].set(-1,-1,n),this.vertices.near[3].set(-1,1,n),this.vertices.near.forEach(function(s){s.applyMatrix4(Gd)}),this.vertices.far[0].set(1,1,1),this.vertices.far[1].set(1,-1,1),this.vertices.far[2].set(-1,-1,1),this.vertices.far[3].set(-1,1,1),this.vertices.far.forEach(function(s){s.applyMatrix4(Gd);let o=Math.abs(s.z);i?s.z*=Math.min(t/o,1):s.multiplyScalar(Math.min(t/o,1))}),this.vertices}split(e,t){for(;e.length>t.length;)t.push(new r);t.length=e.length;for(let n=0;n<e.length;n++){let i=t[n];if(n===0)for(let s=0;s<4;s++)i.vertices.near[s].copy(this.vertices.near[s]);else for(let s=0;s<4;s++)i.vertices.near[s].lerpVectors(this.vertices.near[s],this.vertices.far[s],e[n-1]);if(n===e.length-1)for(let s=0;s<4;s++)i.vertices.far[s].copy(this.vertices.far[s]);else for(let s=0;s<4;s++)i.vertices.far[s].lerpVectors(this.vertices.near[s],this.vertices.far[s],e[n])}}toSpace(e,t){for(let n=0;n<4;n++)t.vertices.near[n].copy(this.vertices.near[n]).applyMatrix4(e),t.vertices.far[n].copy(this.vertices.far[n]).applyMatrix4(e)}};at();var Wd={lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
 	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

  		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && defined( USE_CSM ) && defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	float linearDepth = (vViewPosition.z) / (shadowFar - cameraNear);
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#if defined( USE_SHADOWMAP ) && defined( CSM_FADE )
		vec2 cascade;
		float cascadeCenter;
		float closestEdge;
		float margin;
		float csmx;
		float csmy;

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
				// NOTE: Depth gets larger away from the camera.
				// cascade.x is closer, cascade.y is further
				cascade = CSM_cascades[ i ];
				cascadeCenter = ( cascade.x + cascade.y ) / 2.0;
				closestEdge = linearDepth < cascadeCenter ? cascade.x : cascade.y;
				margin = 0.25 * pow( closestEdge, 2.0 );
				csmx = cascade.x - margin / 2.0;
				csmy = cascade.y + margin / 2.0;
				if( linearDepth >= csmx && ( linearDepth < csmy || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 ) ) {

					float dist = min( linearDepth - csmx, csmy - linearDepth );
					float ratio = clamp( dist / margin, 0.0, 1.0 );

					vec3 prevColor = directLight.color;
					directionalLightShadow = directionalLightShadows[ i ];
					directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

					bool shouldFadeLastCascade = UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth > cascadeCenter;
					directLight.color = mix( prevColor, directLight.color, shouldFadeLastCascade ? ratio : 1.0 );

					ReflectedLight prevLight = reflectedLight;
					RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

					bool shouldBlend = UNROLLED_LOOP_INDEX != CSM_CASCADES - 1 || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth < cascadeCenter;
					float blendRatio = shouldBlend ? ratio : 1.0;

					reflectedLight.directDiffuse = mix( prevLight.directDiffuse, reflectedLight.directDiffuse, blendRatio );
					reflectedLight.directSpecular = mix( prevLight.directSpecular, reflectedLight.directSpecular, blendRatio );
					reflectedLight.indirectDiffuse = mix( prevLight.indirectDiffuse, reflectedLight.indirectDiffuse, blendRatio );
					reflectedLight.indirectSpecular = mix( prevLight.indirectSpecular, reflectedLight.indirectSpecular, blendRatio );

				}
			#endif

		}
		#pragma unroll_loop_end
	#elif defined (USE_SHADOWMAP)

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLightShadow = directionalLightShadows[ i ];
				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y) directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && (linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1)) RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

			#endif

		}
		#pragma unroll_loop_end

	#elif ( NUM_DIR_LIGHT_SHADOWS > 0 )
		// note: no loop here - all CSM lights are in fact one light only
		getDirectionalLightInfo( directionalLights[0], directLight );
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	#endif

	#if ( NUM_DIR_LIGHTS > NUM_DIR_LIGHT_SHADOWS)
		// compute the lights not casting shadows (if any)

		#pragma unroll_loop_start
		for ( int i = NUM_DIR_LIGHT_SHADOWS; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];

			getDirectionalLightInfo( directionalLight, directLight );

			RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

		}
		#pragma unroll_loop_end

	#endif

#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && !defined( USE_CSM ) && !defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_pars_begin:`
#if defined( USE_CSM ) && defined( CSM_CASCADES )
uniform vec2 CSM_cascades[CSM_CASCADES];
uniform float cameraNear;
uniform float shadowFar;
#endif
	`+Et.lights_pars_begin};var L0=new ke,Xd=new ic({webGL:!0}),vr=new R,rc=new ht,qd=[],Yd=[],Zd=new ke,D0=new ke,$1=new R(0,1,0),th=class{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||"practical",this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new R(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new ic({webGL:!0}),this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this._createLights(),this.updateFrustums(),this._injectInclude()}_createLights(){for(let e=0;e<this.cascades;e++){let t=new ai(16777215,this.lightIntensity);t.castShadow=!0,t.shadow.mapSize.width=this.shadowMapSize,t.shadow.mapSize.height=this.shadowMapSize,t.shadow.camera.near=this.lightNear,t.shadow.camera.far=this.lightFar,t.shadow.bias=this.shadowBias,this.parent.add(t),this.parent.add(t.target),this.lights.push(t)}}_initCascades(){let e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}_updateShadowBounds(){let e=this.frustums;for(let t=0;t<e.length;t++){let i=this.lights[t].shadow.camera,s=this.frustums[t],o=s.vertices.near,a=s.vertices.far,c=a[0],l;c.distanceTo(a[2])>c.distanceTo(o[2])?l=a[2]:l=o[2];let h=c.distanceTo(l);if(this.fade){let u=this.camera,f=Math.max(u.far,this.maxFar),d=s.vertices.far[0].z/(f-u.near),g=.25*Math.pow(d,2)*(f-u.near);h+=g}i.left=-h/2,i.right=h/2,i.top=h/2,i.bottom=-h/2,i.updateProjectionMatrix()}}_getBreaks(){let e=this.camera,t=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case"uniform":n(this.cascades,e.near,t,this.breaks);break;case"logarithmic":i(this.cascades,e.near,t,this.breaks);break;case"practical":s(this.cascades,e.near,t,.5,this.breaks);break;case"custom":this.customSplitsCallback===void 0&&console.error("CSM: Custom split scheme callback not defined."),this.customSplitsCallback(this.cascades,e.near,t,this.breaks);break}function n(o,a,c,l){for(let h=1;h<o;h++)l.push((a+(c-a)*h/o)/c);l.push(1)}function i(o,a,c,l){for(let h=1;h<o;h++)l.push(a*(c/a)**(h/o)/c);l.push(1)}function s(o,a,c,l,h){qd.length=0,Yd.length=0,i(o,a,c,Yd),n(o,a,c,qd);for(let u=1;u<o;u++)h.push(_t.lerp(qd[u-1],Yd[u-1],l));h.push(1)}}update(){let e=this.camera,t=this.frustums;Zd.lookAt(new R,this.lightDirection,$1),D0.copy(Zd).invert();for(let n=0;n<t.length;n++){let i=this.lights[n],s=i.shadow.camera,o=(s.right-s.left)/this.shadowMapSize,a=(s.top-s.bottom)/this.shadowMapSize;L0.multiplyMatrices(D0,e.matrixWorld),t[n].toSpace(L0,Xd);let c=Xd.vertices.near,l=Xd.vertices.far;rc.makeEmpty();for(let h=0;h<4;h++)rc.expandByPoint(c[h]),rc.expandByPoint(l[h]);rc.getCenter(vr),vr.z=rc.max.z+this.lightMargin,vr.x=Math.floor(vr.x/o)*o,vr.y=Math.floor(vr.y/a)*a,vr.applyMatrix4(Zd),i.position.copy(vr),i.target.position.copy(vr),i.target.position.x+=this.lightDirection.x,i.target.position.y+=this.lightDirection.y,i.target.position.z+=this.lightDirection.z}}_injectInclude(){Et.lights_fragment_begin=Wd.lights_fragment_begin,Et.lights_pars_begin=Wd.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE="");let t=[],n=this,i=this.shaders;e.onBeforeCompile=function(s){let o=Math.min(n.camera.far,n.maxFar);n._getExtendedBreaks(t),s.uniforms.CSM_cascades={value:t},s.uniforms.cameraNear={value:n.camera.near},s.uniforms.shadowFar={value:o},i.set(e,s)},i.set(e,null)}_updateUniforms(){let e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(n,i){if(n!==null){let s=n.uniforms;this._getExtendedBreaks(s.CSM_cascades.value),s.cameraNear.value=this.camera.near,s.shadowFar.value=e}!this.fade&&"CSM_FADE"in i.defines?(delete i.defines.CSM_FADE,i.needsUpdate=!0):this.fade&&!("CSM_FADE"in i.defines)&&(i.defines.CSM_FADE="",i.needsUpdate=!0)},this)}_getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new de);e.length=this.breaks.length;for(let t=0;t<this.cascades;t++){let n=this.breaks[t],i=this.breaks[t-1]||0;e[t].x=i,e[t].y=n}}updateFrustums(){this._getBreaks(),this._initCascades(),this._updateShadowBounds(),this._updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){let e=this.shaders;e.forEach(function(t,n){delete n.onBeforeCompile,delete n.defines.USE_CSM,delete n.defines.CSM_CASCADES,delete n.defines.CSM_FADE,t!==null&&(delete t.uniforms.CSM_cascades,delete t.uniforms.cameraNear,delete t.uniforms.shadowFar),n.needsUpdate=!0}),e.clear()}};at();Ts();async function N0(r,e){let t=(await new Kn().loadAsync("./assets/odyssey/vegetation-v104/island_tree_01/tree-web-v104.glb")).scene,n=new tn,[i,s]=await Promise.all([n.loadAsync("./assets/odyssey/vegetation-v104/island_tree_01/textures/island_tree_01_leaves_diff_1k.jpg"),n.loadAsync("./assets/odyssey/vegetation-v104/island_tree_01/textures/island_tree_01_leaves_alpha_1k.png")]);i.colorSpace=bt,i.flipY=s.flipY=!1,i.anisotropy=s.anisotropy=8,t.updateMatrixWorld(!0);let o=new ht().setFromObject(t),a=o.getCenter(new R),c=o.max.y-o.min.y,l=[];t.traverse(x=>{x instanceof _e&&l.push(x)});let h=[];r.traverse(x=>{x instanceof ot&&x.name==="Mixed forest grounded trunks"&&h.push(x)});let u=0,f=0,d=0,g=[],E=[],m=x=>{let v=x.clone(),S=/leaves/.test(v.name);v.transparent=!1,v.opacity=1,v.depthWrite=!0,v.alphaTest=S?.15:0,v.alphaToCoverage=S,v.side=S?Mt:An,v.roughness=S?.88:.94,v.envMapIntensity=.55,S&&(v.map=i,v.alphaMap=s,v.emissiveMap=i,v.emissive.set(12702110),v.emissiveIntensity=.32),v.color.set(S?14936270:15919062);for(let A of[v.map,v.normalMap,v.roughnessMap])A&&(A.anisotropy=8);return v.normalMap&&v.normalScale.set(.6,.6),v.onBeforeCompile=A=>{A.uniforms.forestWind=e,A.vertexShader=A.vertexShader.replace("#include <common>",`#include <common>
uniform float forestWind;varying vec3 treePoint;`).replace("#include <begin_vertex>",`#include <begin_vertex>
treePoint=position;transformed.x+=.006*sin(forestWind*.65+position.y*4.+position.z*8.)*smoothstep(.25,1.,position.y);`),S&&(A.fragmentShader=A.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 treePoint;`).replace("#include <alphatest_fragment>",`diffuseColor.a=pow(diffuseColor.a,.60);
#include <alphatest_fragment>`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
    float topLeaf=smoothstep(.25,1.,treePoint.y);reflectedLight.indirectDiffuse+=diffuseColor.rgb*vec3(.22,.28,.12)*topLeaf;`))},v.customProgramCacheKey=()=>"v104-scanned-coastal-tree-"+(S?"leaves":"bark"),v};for(let x of h){if(!x.visible)continue;let v=[];for(let S=0;S<x.count;S++){let A=new ke,C=new R,I=new $t,w=new R;if(x.getMatrixAt(S,A),A.decompose(C,I,w),w.y<.01)continue;C.y-=w.y*.5;let _=_t.smoothstep(C.y,4,14),b=w.y/.58*(.7+.26*_+.12*Math.sin(S*1.61)),P=S*2.399%6.283,U=new Ct,N=x.userData.v106Plants?.[S];U.position.copy(N?new R(N.x,N.y,N.z):C),U.rotation.set(.025*Math.sin(S*1.7),N?.rotation??P,.03*Math.cos(S*.7)),N?U.scale.set(N.height*N.width,N.height,N.height*N.width):U.scale.set(b*(.53+.07*Math.sin(S*3.7)),b,b*(.53+.06*Math.cos(S*2.3))),U.updateMatrix(),v.push(U.matrix.clone())}for(let S of l){let A=S.geometry.clone().applyMatrix4(S.matrixWorld);A.translate(-a.x,-o.min.y,-a.z),A.scale(1/c,1/c,1/c);let C=Array.isArray(S.material)?S.material.map(w=>m(w)):m(S.material),I=new ot(A,C,v.length);for(let w=0;w<v.length;w++)I.setMatrixAt(w,v[w]),I.setColorAt(w,new Ve().setRGB(.84+.13*(w*17%31/31),.86+.12*(w*11%29/29),.77+.19*(w*23%37/37)));if(I.name="V104 scanned coastal forest / "+(Array.isArray(C)?C[0].name:C.name),I.castShadow=I.receiveShadow=!0,I.computeBoundingSphere(),x.parent.add(I),g.push(I),f++,d+=(A.index?A.index.count:A.getAttribute("position").count)/3,/leaves/.test(I.name)){let w=A.clone(),_=w.getAttribute("position"),b=w.index,P=Array.from(b.array).slice(0,2400),U=new Set(P);for(let H=0;H<400;H++){let V=[H*4,H*4+1,H*4+2,H*4+3],Z=new R;V.forEach(X=>Z.add(new R().fromBufferAttribute(_,X))),Z.multiplyScalar(.25),V.forEach(X=>{let z=new R().fromBufferAttribute(_,X).sub(Z).multiplyScalar(1.85).add(Z);_.setXYZ(X,z.x,z.y,z.z)})}w.setIndex(P),w.computeVertexNormals(),w.computeBoundingSphere();let N=new ot(w,C,v.length);N.name=I.name+" / distant real leaf LOD",N.castShadow=N.receiveShadow=!0,N.count=0,x.parent.add(N),g.push(N),E.push({near:I,far:N,matrices:v}),f++}}u+=v.length}r.traverse(x=>{(/Dense evergreen oak crown|Mixed umbrella pine crown|Tall cypress canopy|Native Blender leaf detail|Mixed forest grounded trunks|Internal simplified forest shadow|^V104 closed inner/.test(x.name)||x instanceof ot&&x.geometry.type==="CylinderGeometry"&&x.count>1e3&&x.geometry.getAttribute("position").count<90&&!x.name.startsWith("V104"))&&(x.visible=!1)});let p=new R(1/0,1/0,1/0);return{source:"Poly Haven island_tree_01 / CC0 / real branches, trunk, foliage and alpha",trees:u,prototypeParts:f,prototypeTriangles:d,farLeafTriangles:800,lodDistance:125,updateLOD:x=>{if(!(p.distanceToSquared(x.position)<9)){p.copy(x.position);for(let{near:v,far:S,matrices:A}of E){let C=0,I=0;for(let w=0;w<A.length;w++){let _=A[w],b=Math.hypot(_.elements[12]-x.position.x,_.elements[14]-x.position.z),P=b<125?v:S,U=b<125?C++:I++;P.setMatrixAt(U,_),P.setColorAt(U,new Ve().setRGB(.84+.13*(w*17%31/31),.86+.12*(w*11%29/29),.77+.19*(w*23%37/37)))}v.count=C,S.count=I;for(let w of[v,S])w.instanceMatrix.needsUpdate=!0,w.instanceColor&&(w.instanceColor.needsUpdate=!0),w.computeBoundingSphere()}}},outputs:g}}var eS=new R(0,1,0),tS=r=>{let e=r;return()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296)};async function U0(r,e,t,n){let i={value:0},s=tS(1041829),o={sails:0,joineryParts:0,rivets:0,ropeRuns:0,canopyBatches:0,shoreRocks:0,shorePebbles:0,clothMaterials:0},a=[],c=(w,_,b,P=new R,U="V104 fitted structural detail")=>{let N=new _e(_,b);return N.position.copy(P),N.name=U,N.castShadow=N.receiveShadow=!0,w.add(N),a.push(N),N},l=(w,_,b,P,U,N)=>{let H=c(w,new vn(P*.88,P,_.distanceTo(b),10),U,_.clone().add(b).multiplyScalar(.5),N);return H.quaternion.setFromUnitVectors(eS,b.clone().sub(_).normalize()),H},h=w=>{let _=new Map;for(let b of w.children)if(b instanceof _e&&!Array.isArray(b.material)&&!(b instanceof ot)){let P=_.get(b.material)||[];P.push(b),_.set(b.material,P)}for(let[b,P]of _){if(P.length<2)continue;let U=P.map(H=>(H.updateMatrix(),(H.geometry.index?H.geometry.toNonIndexed():H.geometry.clone()).applyMatrix4(H.matrix))),N=Ti(U);if(!N)throw Error("V104 joinery geometry merge failed");for(let H of P)w.remove(H),H.geometry.dispose();U.forEach(H=>H.dispose()),c(w,N,b,new R,"V104 continuous fitted ship joinery")}},u=new Xe({color:7889990,metalness:.78,roughness:.56,envMapIntensity:.6});u.name="V104 worn bronze fasteners / restrained patina";let f=new Xe({color:9732966,roughness:.96,envMapIntensity:.4});f.name="V104 twisted hemp standing and running rigging",f.onBeforeCompile=w=>{w.vertexShader=w.vertexShader.replace("#include <common>",`#include <common>
varying vec3 ropeLocal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
ropeLocal=position;`),w.fragmentShader=w.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 ropeLocal;`).replace("#include <map_fragment>",`#include <map_fragment>
float braid=.5+.5*sin(atan(ropeLocal.z,ropeLocal.x)*6.+ropeLocal.y*165.);diffuseColor.rgb*=.76+.24*braid;`)},f.customProgramCacheKey=()=>"v104-hemp-braid";for(let[w,_]of e.entries()){let b=_.root,P=[.72,.76,.78,.75][w];b.traverse(z=>{if(!(!(z instanceof _e)||z instanceof En||z instanceof ot||_.sails.some(Y=>Y.mesh===z))&&/Batched solid hull|Tensioned standing|Square-sail main|Main timber mast|Rigging/.test(z.name)){let Y=z.geometry.clone(),J=Y.getAttribute("position");for(let ne=0;ne<J.count;ne++){let ae=J.getY(ne)+z.position.y;ae>4.3&&(J.setY(ne,4.3+(ae-4.3)*P-z.position.y),ae>13.9&&J.setX(ne,J.getX(ne)*1.27))}J.needsUpdate=!0,Y.computeVertexNormals(),Y.computeBoundingSphere(),z.geometry=Y}});let U=new Dt;U.name="V104 vessel-specific fitted frames and rigging",b.add(U);let N;if(b.traverse(z=>{!N&&z instanceof _e&&!Array.isArray(z.material)&&/V103 real weathered ship timber/.test(z.material.name)&&(N=z.material)}),!N)throw Error("V104 ship timber must already be prepared");let H=N.clone();H.onBeforeCompile=N.onBeforeCompile,H.customProgramCacheKey=N.customProgramCacheKey,H.color.set(12760736),H.name="V104 darker end-grain framing";for(let z of[-1,1]){for(let Y of[0,1]){let J=Array.from({length:65},(ne,ae)=>{let Ue=.025+ae/64*.95;return new R((Ue-.5)*19,1.55-Y*.66+Math.abs(Ue-.5)**4*17,z*(2.74-Y*.15)*Math.sin(Ue*Math.PI)**.63)});c(U,new _i(new Zn(J),80,Y?.095:.145,8,!1),Y?H:N,new R,"V104 thick continuous timber gunwale and strengthening wale"),o.joineryParts++}for(let Y=0;Y<12;Y++){let J=-6.05+Y*1.04,ne=2.62*Math.sin((J/19+.5)*Math.PI)**.63;l(U,new R(J,.52,z*(ne-.5)),new R(J,1.54,z*(ne-.08)),.095,H,"V104 substantial pegged hull knee"),o.joineryParts++}}let V=new ot(new Un(.025,6,4),u,168),Z=new Ct,X=0;for(let z of[-1,1])for(let Y=0;Y<28;Y++)for(let J=0;J<3;J++){let ne=.08+Y/27*.84,ae=.45+J*.21;Z.position.set((ne-.5)*19,-.65+ae*2.15+Math.pow(Math.abs(ne-.5)*2,5)*1.23,z*2.75*Math.sin(ne*Math.PI)**.63*(.2+.8*Math.sin(ae*Math.PI*.5))),Z.scale.set(1,.65,1),Z.updateMatrix(),V.setMatrixAt(X++,Z.matrix)}if(V.name="V104 bronze plank fasteners",V.castShadow=V.receiveShadow=!0,U.add(V),o.rivets+=X,w===0){for(let ne of[...b.children])(ne instanceof ot&&ne.count===24&&ne.geometry.type==="CylinderGeometry"||ne instanceof _e&&ne.geometry.type==="BoxGeometry"&&Math.abs(ne.position.x-6.4)<.01&&Math.abs(ne.position.y-2.12)<.01)&&(ne.visible=!1);let z=new Dr;for(let ne=0;ne<=20;ne++){let ae=4.8+ne/20*3.65,xe=2.55*Math.sin((ae/19+.5)*Math.PI)**.63*.87;ne?z.lineTo(ae,xe):z.moveTo(ae,xe)}for(let ne=20;ne>=0;ne--){let ae=4.8+ne/20*3.65,Ue=2.55*Math.sin((ae/19+.5)*Math.PI)**.63;z.lineTo(ae,-Ue*.87)}z.closePath();let Y=c(U,new ls(z,{depth:.17,bevelEnabled:!0,bevelSize:.025,bevelThickness:.02,bevelSegments:2}),N,new R(0,2,0),"V104 stern platform fitted inside curved hull");Y.rotation.x=-Math.PI/2;for(let ne of[-1,1]){let ae=[];for(let Ue=0;Ue<10;Ue++){let xe=4.92+Ue*.35,j=2.55*Math.sin((xe/19+.5)*Math.PI)**.63*.87;l(U,new R(xe,2,ne*j),new R(xe,2.75,ne*j),.047,H,"V104 pegged stern baluster"),ae.push(new R(xe,2.75,ne*j))}c(U,new _i(new Zn(ae),28,.066,8),N,new R,"V104 connected stern gallery handrail")}let J=b.children.find(ne=>/Stern helmsman/.test(ne.name));J&&(J.position.y=2.17)}for(let[z,Y]of _.sails.entries()){if(Y.freeEdge){Y.mesh.position.y=4.3+(Y.mesh.position.y-4.3)*P;continue}let J=z===0,ne=J?[10.8,9.8,8.7,9.4][w]:4.1,ae=J?[7.65,6.9,6,6.6][w]:3.6,Ue=J?-.7:3.8,xe=J?3.9:3.3,j=xe+ae,re=J?.07:.22,Se=56,He=46,Ie=[],nt=[],rt=[];for(let fe=0;fe<=He;fe++)for(let ge=0;ge<=Se;ge++){let pe=ge/Se,Te=fe/He,be=Math.sin(Math.PI*pe),Le=Math.sin(Math.PI*Te),dt=Math.pow(Math.max(0,be*Le),.72),lt=ne*(.84+.16*Te),k=(J?1.6:.74)*dt,D=Math.min(Math.hypot(pe,Te),Math.hypot(1-pe,Te),Math.hypot(pe,1-Te),Math.hypot(1-pe,1-Te)),te=.105*Math.sin(pe*42+Te*9)*be*Le+.11*Math.sin(D*65+pe*3)*Math.exp(-D*5)*be;if(Ie.push(Ue+(pe-.5)*lt,xe+Te*ae-.44*be*(1-Te)+.07*Math.sin(pe*19)*Le,re+k+te+.15*Le),nt.push(pe,Te),ge<Se&&fe<He){let le=fe*(Se+1)+ge,we=le+1,ce=le+Se+1;rt.push(le,we,ce,we,ce+1,ce)}}let W=new gt;W.setAttribute("position",new Ke(Ie,3)),W.setAttribute("uv",new Ke(nt,2)),W.setIndex(rt),W.computeVertexNormals(),W.computeBoundingSphere(),Y.mesh.geometry=W,Y.base=new Float32Array(Ie);let ve=Y.mesh.material;ve.color.set([15655102,13942417,14471349,10926008][w]),ve.sheen=.28,ve.sheenColor.set(16771012),ve.normalScale.set(.25,.25),ve.roughness=.92;for(let fe of[ve.map,ve.normalMap,ve.roughnessMap])fe?.repeat.set(ne/.271,ae/.271);ve.onBeforeCompile=fe=>{fe.vertexShader=fe.vertexShader.replace("#include <common>",`#include <common>
varying vec2 wovenUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
wovenUv=uv;`),fe.fragmentShader=fe.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 wovenUv;`).replace("#include <map_fragment>",`#include <map_fragment>
      float dist=abs(fract(wovenUv.x*9.+.5)-.5),seam=1.-smoothstep(.006,.017,dist);
      float hem=1.-smoothstep(.008,.022,min(min(wovenUv.x,1.-wovenUv.x),min(wovenUv.y,1.-wovenUv.y)));
      float panel=floor(wovenUv.x*9.);diffuseColor.rgb*=.96+.035*sin(panel*4.71);
      float stains=.5+.5*sin(wovenUv.x*17.+sin(wovenUv.y*11.))*sin(wovenUv.y*23.+wovenUv.x*4.);
      diffuseColor.rgb*=vec3(1.10,1.015,.88)*(1.-.13*seam-.19*hem)*(.93+.07*stains);`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
      vec3 warmSun=normalize(mat3(viewMatrix)*vec3(-33.,37.,-145.));
      float throughCloth=pow(max(dot(-normal,warmSun),0.),1.6)*.65;
      reflectedLight.indirectDiffuse+=diffuseColor.rgb*vec3(1.,.73,.43)*throughCloth;`)},ve.customProgramCacheKey=()=>"v104-tensioned-thin-sewn-linen",ve.needsUpdate=!0,l(U,new R(Ue-ne*.54,j+.05,re),new R(Ue+ne*.54,j+.05,re),J?.12:.075,N,"V104 tapered sail yard");for(let fe of[-1,1]){let ge=new R(Ue+fe*ne*.42,xe,re),pe=new R(fe<0?-6.5:5.8,1.68,fe*2.18),Te=ge.clone().lerp(pe,.5);Te.y-=.14,c(U,new _i(new Zn([ge,Te,pe]),18,.029,7),f,new R,"V104 sail corner sheet visibly anchored to deck"),o.ropeRuns++}o.sails++}for(let z of[-5.5,4.45])for(let Y=0;Y<4;Y++){let J=c(U,new Ur(.19+Y*.038,.018,6,28),f,new R(z,1.74+Y*.017,1.53),"V104 coiled hemp on side deck");J.rotation.x=Math.PI/2}for(let z=0;z<5;z++)c(U,new Ur(.12,.014,6,20),f,new R(-.7,4.8+z*.033,0),"V104 mast rope lashing").rotation.x=Math.PI/2;h(U)}let d=new Set;for(let w of e)w.root.traverse(_=>{if(!(_ instanceof _e))return;let b=Array.isArray(_.material)?_.material:[_.material];for(let P of b)if(!(!(P instanceof Xe)||d.has(P))&&(d.add(P),/tunic|mantle|linen|garment|hem/i.test(P.name)&&!/V103 27cm|V104/.test(P.name))){P.color.set(/mantle/i.test(P.name)?[6771014,7956557,5333339,8412237][w.root.userData.variant]:[14009506,12627849,12040094,10794928][w.root.userData.variant]),P.roughness=.95,P.envMapIntensity=.65;let U=P.onBeforeCompile;P.onBeforeCompile=(N,H)=>{U.call(P,N,H),N.vertexShader=N.vertexShader.replace("#include <common>",`#include <common>
varying vec3 garmentPoint;`).replace("#include <begin_vertex>",`#include <begin_vertex>
garmentPoint=position;`),N.fragmentShader=N.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 garmentPoint;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
      float weave=sin(garmentPoint.x*490.)*sin(garmentPoint.y*410.+garmentPoint.z*200.);
      float h=weave*.0003+sin(garmentPoint.x*36.+garmentPoint.y*9.)*.0022;
      vec3 q0=dFdx(-vViewPosition),q1=dFdy(-vViewPosition),r1=cross(q1,normal),r2=cross(normal,q0);float det=dot(q0,r1);
      normal=normalize(abs(det)*normal-sign(det)*(dFdx(h)*r1+dFdy(h)*r2));`)},P.customProgramCacheKey=()=>"v104-worn-crew-cloth",P.needsUpdate=!0,o.clothMaterials++}});let g=await N0(r,i);o.canopyBatches=g.prototypeParts;let E=new Set;r.traverse(w=>{if(w instanceof _e)for(let _ of Array.isArray(w.material)?w.material:[w.material]){if(!(_ instanceof Xe)||E.has(_)||!/V103 original anatomical skin atlas/.test(_.name))continue;E.add(_);let b=_.onBeforeCompile;_.roughness=.74,_.onBeforeCompile=(P,U)=>{b.call(_,P,U),P.fragmentShader=P.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
   float pigment=.5+.5*sin(skinPoint.x*2.4+sin(skinPoint.z*4.3))*sin(skinPoint.y*3.7+sin(skinPoint.x*9.));
   float grime=.5+.5*sin(skinPoint.x*9.7+sin(skinPoint.z*5.6))*sin(skinPoint.y*7.1);
   diffuseColor.rgb*=mix(vec3(.77,.70,.62),vec3(1.02,.95,.87),pigment)*(.90+.10*grime);`)},_.customProgramCacheKey=()=>"v104-weathered-anatomical-skin",_.needsUpdate=!0}});let m=new Un(1,28,18),p=m.getAttribute("position");for(let w=0;w<p.count;w++){let _=p.getX(w),b=p.getY(w),P=p.getZ(w),U=1+.13*Math.sin(_*8+P*4)*Math.cos(b*7)+.075*Math.sin(P*17-b*13);p.setXYZ(w,_*U,b*U*(.85+.08*Math.sin(b*13)),P*U)}m.computeVertexNormals();let M=[],x;if(r.traverse(w=>{w instanceof _e&&!Array.isArray(w.material)&&/V103 sea-worn stone/.test(w.material.name)&&(x=w.material)}),r.traverse(w=>{w instanceof _e&&(w.visible&&/^native84_(19|20|21|22)$/.test(w.userData.native84Key||"")&&M.push(w),/Naturally exposed limestone outcrops|eroded ridge boulder|fractured exposed ridge outcrops|littoral rock/i.test(w.name)&&(w.geometry=m,x&&(w.material=x)))}),M.length&&x){r.updateMatrixWorld(!0);let w=new Bn,_=new R(0,-1,0),b=new Ct;w.firstHitOnly=!0,r.traverse(V=>{if(!(V instanceof ot)||!/^Naturally exposed|V95 fractured/.test(V.name)||!V.visible)return;let Z=new ke,X=new R,z=new $t,Y=new R;for(let J=0;J<V.count;J++){V.getMatrixAt(J,Z),Z.decompose(X,z,Y),w.set(new R(X.x,120,X.z),_);let ne=w.intersectObjects(M,!1)[0];if(!ne)continue;let ae=ne.point.y,Ue=ae<8,xe=Ue?Array.from({length:12},(j,re)=>[Math.cos(re*Math.PI/6)*Y.x*.98,Math.sin(re*Math.PI/6)*Y.z*.98]):[];for(let[j,re]of xe){w.set(new R(X.x+j,120,X.z+re),_);let Se=w.intersectObjects(M,!1)[0];Se&&(ae=Math.min(ae,Se.point.y))}X.y=ae-Y.y*(Ue?.38:.3),Z.compose(X,z,Y),V.setMatrixAt(J,Z)}V.instanceMatrix.needsUpdate=!0,V.computeBoundingSphere()});let P=new ot(m,x,74),U=new ot(new Un(1,7,5),x,240),N=0,H=0;for(let V=0;V<3600&&N<74;V++){let Z=-207+s()*325,X=-241+s()*178;if(Z>-132&&Z<22)continue;w.set(new R(Z,95,X),_);let z=w.intersectObjects(M,!1)[0];if(!z||z.point.y<-.5||z.point.y>6||Math.hypot(Z+70,X+129)<15)continue;let Y=.6+s()*2.5;b.position.copy(z.point),b.position.y-=Y*.34,b.rotation.set(s()*.4,s()*6.28,s()*.3),b.scale.set(Y*(.9+s()*.5),Y*(.32+s()*.3),Y*.85),b.updateMatrix(),P.setMatrixAt(N++,b.matrix);for(let J=0;J<3&&H<240;J++){b.position.set(z.point.x+(s()-.5)*2.7,z.point.y+.025,z.point.z+(s()-.5)*2.7),b.rotation.set(s(),s()*6.28,s());let ne=.04+s()*.13;b.scale.set(ne*1.5,ne*.52,ne),b.updateMatrix(),U.setMatrixAt(H++,b.matrix)}}P.count=N,U.count=H,P.name="V104 broken coastal bedrock and intertidal shelves",U.name="V104 granular pebble transition";for(let V of[P,U])V.castShadow=V.receiveShadow=!0,V.computeBoundingSphere(),r.add(V);o.shoreRocks=N,o.shorePebbles=H}let v=n.target.position.clone().sub(n.position).normalize();r.remove(n,n.target);let S=new th({camera:t,parent:r,cascades:2,maxFar:430,mode:"custom",customSplitsCallback:(w,_,b,P)=>{P.push(66/b,1)},shadowMapSize:2048,shadowBias:-3e-5,lightDirection:v,lightIntensity:3.5,lightMargin:220});S.fade=!0;for(let w of S.lights)w.color.set(16769458),w.shadow.normalBias=.012;let A=new Set;r.traverse(w=>{if(w instanceof _e)for(let _ of Array.isArray(w.material)?w.material:[w.material])_ instanceof Xe&&A.add(_)});for(let w of A){let _=w.onBeforeCompile;S.setupMaterial(w);let b=w.onBeforeCompile;w.onBeforeCompile=(P,U)=>{_.call(w,P,U),b.call(w,P,U)},w.needsUpdate=!0}let C=r.children.find(w=>w instanceof ai&&!S.lights.includes(w));C&&(C.color.set(11914970),C.intensity=1.05);let I=r.children.find(w=>w instanceof lr);return I&&(I.color.set(12109785),I.groundColor.set(5588537),I.intensity=.65),r.environmentIntensity=.5,{prepareMaterial:w=>{let _=w.onBeforeCompile;S.setupMaterial(w);let b=w.onBeforeCompile;w.onBeforeCompile=(P,U)=>{_.call(w,P,U),b.call(w,P,U)}},info:{version:104,...o,forest:{source:g.source,trees:g.trees,prototypeTriangles:g.prototypeTriangles,farLeafTriangles:g.farLeafTriangles,lodDistance:g.lodDistance},shadowCascades:2,nearShadowReach:66,sunDirectionRetained:!0,seaShaderRetained:!0,flightRetained:!0},resize:()=>S.updateFrustums(),update:w=>{i.value=w,g.updateLOD(t),t.updateMatrixWorld(),S.update()},exportMeshes:a}}at();Ts();async function B0(r){let e=new Kn,t="./blender/mythology-v32-106/",[n,i,s,o]=await Promise.all([e.loadAsync(t+"island-geometry-v106.glb"),e.loadAsync(t+"cyclops-male-v106.glb"),e.loadAsync(t+"groundcover-v106.glb"),fetch(t+"woodland-placement.json").then(_=>{if(!_.ok)throw Error("V106 woodland manifest missing");return _.json()})]);r.updateMatrixWorld(!0),n.scene.updateMatrixWorld(!0);let a,c;if(n.scene.traverse(_=>{_ instanceof _e&&(a=_)}),r.traverse(_=>{_ instanceof _e&&_.userData.native84Key==="native84_19"&&(c=_)}),!a||!c)throw Error("Native V106 island or original surface missing");let l=a.geometry.clone().applyMatrix4(a.matrixWorld).applyMatrix4(c.matrixWorld.clone().invert());l.computeVertexNormals();let h=l.getAttribute("position"),u=new Float32Array(h.count*2),f=new Float32Array(h.count*3),d=new R,g=new R,E=new yt().getNormalMatrix(c.matrixWorld),m=l.getAttribute("normal");for(let _=0;_<h.count;_++){d.fromBufferAttribute(h,_).applyMatrix4(c.matrixWorld),g.fromBufferAttribute(m,_).applyMatrix3(E).normalize(),u[_*2]=d.x/2,u[_*2+1]=d.z/2;let b=Math.atan2((-d.z-145)/103,(d.x+65)/164),P=Math.abs(Math.atan2(Math.sin(b+Math.PI/2),Math.cos(b+Math.PI/2))),N=(1-_t.smoothstep(P,.28,.74))*(1-_t.smoothstep(d.y,1.6,4.3))*_t.smoothstep(g.y,.7,.94),H=_t.smoothstep(d.y,4.5,9.5)*(1-N)*_t.smoothstep(g.y,.65,.92);f.set([N,H,Math.max(0,1-N-H)],_*3)}l.setAttribute("uv",new Rt(u,2)),l.setAttribute("habitat",new Rt(f,3)),l.boundsTree=new Xi(l),c.geometry=l,c.raycast=Wr;let p=0;r.traverse(_=>{if(_ instanceof _e){let b=_.userData.native84Key||"";/^native84_(20|21|22|23|24|25)$/.test(b)&&(_.visible=!1,_.userData.inactiveTerrain=!0)}_ instanceof ot&&/forest|crown|canop|trunk|pine|oak|understory|leaf litter|branch|cypress|grounded meadow|Naturally exposed|V95 fractured/i.test(_.name)&&!_.userData.variant&&(_.visible=!1,p++)});let M=r.children.find(_=>/Native V20 complete/.test(_.name));M&&(M.visible=!1);let x=new ot(new vn(.12,.17,1,6),new Xe({color:4208167}),o.trees.length),v=new Ct;x.name="Mixed forest grounded trunks",x.userData.v106Plants=o.trees;for(let _=0;_<o.trees.length;_++){let b=o.trees[_];v.position.set(b.x,b.y+b.height*.29,b.z),v.rotation.set(0,b.rotation,0),v.scale.set(b.width,b.height*.58,b.width),v.updateMatrix(),x.setMatrixAt(_,v.matrix)}x.computeBoundingSphere(),r.add(x);let S=await new tn().loadAsync("./assets/odyssey/pbr-v103/skin-atlas.png");S.colorSpace=bt,S.flipY=!1,S.anisotropy=8;let A=new Jt({map:S,color:13218974,roughness:.76,envMapIntensity:.65,specularIntensity:.25,side:Mt});A.name="V106 reshaped male cyclops / original skin photograph and pores",A.onBeforeCompile=_=>{_.vertexShader=_.vertexShader.replace("#include <common>",`#include <common>
varying vec3 maleSkin;`).replace("#include <begin_vertex>",`#include <begin_vertex>
maleSkin=position;`),_.fragmentShader=_.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 maleSkin;`).replace("#include <map_fragment>",`#include <map_fragment>
   float pigment=.5+.5*sin(maleSkin.x*29.+sin(maleSkin.z*37.))*sin(maleSkin.y*43.);diffuseColor.rgb*=mix(vec3(.82,.78,.71),vec3(1.02,.98,.92),pigment);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
   float relief=sin(maleSkin.x*2300.+sin(maleSkin.z*1770.))*sin(maleSkin.y*1930.)*.000032;
   vec3 a=dFdx(-vViewPosition),b=dFdy(-vViewPosition),c=cross(b,normal),d=cross(normal,a);float dt=dot(a,c);normal=normalize(abs(dt)*normal-sign(dt)*(dFdx(relief)*c+dFdy(relief)*d));`)},A.customProgramCacheKey=()=>"v106-actual-male-anatomy-skin";let C=i.scene;C.name="V106 actual MCP male cyclops",C.traverse(_=>{if(_ instanceof _e)if(_.castShadow=_.receiveShadow=!0,!/pupil|iris|eyeball|beard|facial hair/i.test(_.name))_.material=A;else for(let b of Array.isArray(_.material)?_.material:[_.material])b instanceof Xe&&(b.envMapIntensity=.45)}),r.add(C),s.scene.name="V106 actual MCP curved coastal ground cover",s.scene.traverse(_=>{if(_ instanceof _e){_.receiveShadow=!0,_.castShadow=!1;for(let b of Array.isArray(_.material)?_.material:[_.material])b instanceof Xe&&(b.side=Mt,b.envMapIntensity=.8,b.roughness=.95)}}),r.add(s.scene);let I=new ht().setFromObject(c),w=new ht().setFromObject(C);return{version:106,actualBlenderMcpGeometry:!0,vertices:h.count,worldBounds:{min:I.min.toArray(),max:I.max.toArray()},trees:o.trees.length,removedOldBatches:p,giantCenter:w.getCenter(new R),giantHeight:w.max.y-w.min.y,giant:C,newMeshes:[...s.scene.children,...C.children].filter(_=>_ instanceof _e)}}at();at();at();var fi=Uint8Array,zo=Uint16Array,nS=Int32Array,H0=new fi([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),F0=new fi([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),iS=new fi([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),O0=function(r,e){for(var t=new zo(31),n=0;n<31;++n)t[n]=e+=1<<r[n-1];for(var i=new nS(t[30]),n=1;n<30;++n)for(var s=t[n];s<t[n+1];++s)i[s]=s-t[n]<<5|n;return{b:t,r:i}},z0=O0(H0,2),k0=z0.b,rS=z0.r;k0[28]=258,rS[258]=28;var V0=O0(F0,0),sS=V0.b,DC=V0.r,Jd=new zo(32768);for(kt=0;kt<32768;++kt)yr=(kt&43690)>>1|(kt&21845)<<1,yr=(yr&52428)>>2|(yr&13107)<<2,yr=(yr&61680)>>4|(yr&3855)<<4,Jd[kt]=((yr&65280)>>8|(yr&255)<<8)>>1;var yr,kt,sc=(function(r,e,t){for(var n=r.length,i=0,s=new zo(e);i<n;++i)r[i]&&++s[r[i]-1];var o=new zo(e);for(i=1;i<e;++i)o[i]=o[i-1]+s[i-1]<<1;var a;if(t){a=new zo(1<<e);var c=15-e;for(i=0;i<n;++i)if(r[i])for(var l=i<<4|r[i],h=e-r[i],u=o[r[i]-1]++<<h,f=u|(1<<h)-1;u<=f;++u)a[Jd[u]>>c]=l}else for(a=new zo(n),i=0;i<n;++i)r[i]&&(a[i]=Jd[o[r[i]-1]++]>>15-r[i]);return a}),oc=new fi(288);for(kt=0;kt<144;++kt)oc[kt]=8;var kt;for(kt=144;kt<256;++kt)oc[kt]=9;var kt;for(kt=256;kt<280;++kt)oc[kt]=7;var kt;for(kt=280;kt<288;++kt)oc[kt]=8;var kt,G0=new fi(32);for(kt=0;kt<32;++kt)G0[kt]=5;var kt;var oS=sc(oc,9,1);var aS=sc(G0,5,1),jd=function(r){for(var e=r[0],t=1;t<r.length;++t)r[t]>e&&(e=r[t]);return e},Ai=function(r,e,t){var n=e/8|0;return(r[n]|r[n+1]<<8)>>(e&7)&t},Kd=function(r,e){var t=e/8|0;return(r[t]|r[t+1]<<8|r[t+2]<<16)>>(e&7)},cS=function(r){return(r+7)/8|0},lS=function(r,e,t){return(e==null||e<0)&&(e=0),(t==null||t>r.length)&&(t=r.length),new fi(r.subarray(e,t))};var uS=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ri=function(r,e,t){var n=new Error(e||uS[r]);if(n.code=r,Error.captureStackTrace&&Error.captureStackTrace(n,Ri),!t)throw n;return n},hS=function(r,e,t,n){var i=r.length,s=n?n.length:0;if(!i||e.f&&!e.l)return t||new fi(0);var o=!t,a=o||e.i!=2,c=e.i;o&&(t=new fi(i*3));var l=function(nt){var rt=t.length;if(nt>rt){var W=new fi(Math.max(rt*2,nt));W.set(t),t=W}},h=e.f||0,u=e.p||0,f=e.b||0,d=e.l,g=e.d,E=e.m,m=e.n,p=i*8;do{if(!d){h=Ai(r,u,1);var M=Ai(r,u+1,3);if(u+=3,M)if(M==1)d=oS,g=aS,E=9,m=5;else if(M==2){var A=Ai(r,u,31)+257,C=Ai(r,u+10,15)+4,I=A+Ai(r,u+5,31)+1;u+=14;for(var w=new fi(I),_=new fi(19),b=0;b<C;++b)_[iS[b]]=Ai(r,u+b*3,7);u+=C*3;for(var P=jd(_),U=(1<<P)-1,N=sc(_,P,1),b=0;b<I;){var H=N[Ai(r,u,U)];u+=H&15;var x=H>>4;if(x<16)w[b++]=x;else{var V=0,Z=0;for(x==16?(Z=3+Ai(r,u,3),u+=2,V=w[b-1]):x==17?(Z=3+Ai(r,u,7),u+=3):x==18&&(Z=11+Ai(r,u,127),u+=7);Z--;)w[b++]=V}}var X=w.subarray(0,A),z=w.subarray(A);E=jd(X),m=jd(z),d=sc(X,E,1),g=sc(z,m,1)}else Ri(1);else{var x=cS(u)+4,v=r[x-4]|r[x-3]<<8,S=x+v;if(S>i){c&&Ri(0);break}a&&l(f+v),t.set(r.subarray(x,S),f),e.b=f+=v,e.p=u=S*8,e.f=h;continue}if(u>p){c&&Ri(0);break}}a&&l(f+131072);for(var Y=(1<<E)-1,J=(1<<m)-1,ne=u;;ne=u){var V=d[Kd(r,u)&Y],ae=V>>4;if(u+=V&15,u>p){c&&Ri(0);break}if(V||Ri(2),ae<256)t[f++]=ae;else if(ae==256){ne=u,d=null;break}else{var Ue=ae-254;if(ae>264){var b=ae-257,xe=H0[b];Ue=Ai(r,u,(1<<xe)-1)+k0[b],u+=xe}var j=g[Kd(r,u)&J],re=j>>4;j||Ri(3),u+=j&15;var z=sS[re];if(re>3){var xe=F0[re];z+=Kd(r,u)&(1<<xe)-1,u+=xe}if(u>p){c&&Ri(0);break}a&&l(f+131072);var Se=f+Ue;if(f<z){var He=s-z,Ie=Math.min(z,Se);for(He+f<0&&Ri(3);f<Ie;++f)t[f]=n[He+f]}for(;f<Se;++f)t[f]=t[f-z]}}e.l=d,e.p=ne,e.b=f,e.f=h,d&&(h=1,e.m=E,e.d=g,e.n=m)}while(!h);return f!=t.length&&o?lS(t,0,f):t.subarray(0,f)};var fS=new fi(0);var dS=function(r,e){return((r[0]&15)!=8||r[0]>>4>7||(r[0]<<8|r[1])%31)&&Ri(6,"invalid zlib data"),(r[1]>>5&1)==+!e&&Ri(6,"invalid zlib data: "+(r[1]&32?"need":"unexpected")+" dictionary"),(r[1]>>3&4)+2};function ac(r,e){return hS(r.subarray(dS(r,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}var pS=typeof TextDecoder<"u"&&new TextDecoder,mS=0;try{pS.decode(fS,{stream:!0}),mS=1}catch{}var nh=class extends fs{constructor(e){super(e),this.type=qt,this.outputFormat=ln}parse(e){let w=Math.pow(2.7182818,2.2);function _(T,y){let L=0;for(let F=0;F<65536;++F)(F==0||T[F>>3]&1<<(F&7))&&(y[L++]=F);let B=L-1;for(;L<65536;)y[L++]=0;return B}function b(T){for(let y=0;y<16384;y++)T[y]={},T[y].len=0,T[y].lit=0,T[y].p=null}let P={l:0,c:0,lc:0};function U(T,y,L,B,F){for(;L<T;)y=y<<8|et(B,F),L+=8;L-=T,P.l=y>>L&(1<<T)-1,P.c=y,P.lc=L}let N=new Array(59);function H(T){for(let L=0;L<=58;++L)N[L]=0;for(let L=0;L<65537;++L)N[T[L]]+=1;let y=0;for(let L=58;L>0;--L){let B=y+N[L]>>1;N[L]=y,y=B}for(let L=0;L<65537;++L){let B=T[L];B>0&&(T[L]=B|N[B]++<<6)}}function V(T,y,L,B,F,G){let O=y,Q=0,ee=0;for(;B<=F;B++){if(O.value-y.value>L)return!1;U(6,Q,ee,T,O);let K=P.l;if(Q=P.c,ee=P.lc,G[B]=K,K==63){if(O.value-y.value>L)throw new Error("Something wrong with hufUnpackEncTable");U(8,Q,ee,T,O);let se=P.l+6;if(Q=P.c,ee=P.lc,B+se>F+1)throw new Error("Something wrong with hufUnpackEncTable");for(;se--;)G[B++]=0;B--}else if(K>=59){let se=K-59+2;if(B+se>F+1)throw new Error("Something wrong with hufUnpackEncTable");for(;se--;)G[B++]=0;B--}}H(G)}function Z(T){return T&63}function X(T){return T>>6}function z(T,y,L,B){for(;y<=L;y++){let F=X(T[y]),G=Z(T[y]);if(F>>G)throw new Error("Invalid table entry");if(G>14){let O=B[F>>G-14];if(O.len)throw new Error("Invalid table entry");if(O.lit++,O.p){let Q=O.p;O.p=new Array(O.lit);for(let ee=0;ee<O.lit-1;++ee)O.p[ee]=Q[ee]}else O.p=new Array(1);O.p[O.lit-1]=y}else if(G){let O=0;for(let Q=1<<14-G;Q>0;Q--){let ee=B[(F<<14-G)+O];if(ee.len||ee.p)throw new Error("Invalid table entry");ee.len=G,ee.lit=y,O++}}}return!0}let Y={c:0,lc:0};function J(T,y,L,B){T=T<<8|et(L,B),y+=8,Y.c=T,Y.lc=y}let ne={c:0,lc:0};function ae(T,y,L,B,F,G,O,Q,ee){if(T==y){B<8&&(J(L,B,F,G),L=Y.c,B=Y.lc),B-=8;let K=L>>B;if(K=new Uint8Array([K])[0],Q.value+K>ee)return!1;let se=O[Q.value-1];for(;K-- >0;)O[Q.value++]=se}else if(Q.value<ee)O[Q.value++]=T;else return!1;ne.c=L,ne.lc=B}function Ue(T){return T&65535}function xe(T){let y=Ue(T);return y>32767?y-65536:y}let j={a:0,b:0};function re(T,y){let L=xe(T),F=xe(y),G=L+(F&1)+(F>>1),O=G,Q=G-F;j.a=O,j.b=Q}function Se(T,y){let L=Ue(T),B=Ue(y),F=L-(B>>1)&65535,G=B+F-32768&65535;j.a=G,j.b=F}function He(T,y,L,B,F,G,O){let Q=O<16384,ee=L>F?F:L,K=1,se,me;for(;K<=ee;)K<<=1;for(K>>=1,se=K,K>>=1;K>=1;){me=0;let ue=me+G*(F-se),Ee=G*K,ze=G*se,$=B*K,he=B*se,Re,Ae,We,tt;for(;me<=ue;me+=ze){let ut=me,st=me+B*(L-se);for(;ut<=st;ut+=he){let St=ut+$,Zt=ut+Ee,pt=Zt+$;Q?(re(T[ut+y],T[Zt+y]),Re=j.a,We=j.b,re(T[St+y],T[pt+y]),Ae=j.a,tt=j.b,re(Re,Ae),T[ut+y]=j.a,T[St+y]=j.b,re(We,tt),T[Zt+y]=j.a,T[pt+y]=j.b):(Se(T[ut+y],T[Zt+y]),Re=j.a,We=j.b,Se(T[St+y],T[pt+y]),Ae=j.a,tt=j.b,Se(Re,Ae),T[ut+y]=j.a,T[St+y]=j.b,Se(We,tt),T[Zt+y]=j.a,T[pt+y]=j.b)}if(L&K){let St=ut+Ee;Q?re(T[ut+y],T[St+y]):Se(T[ut+y],T[St+y]),Re=j.a,T[St+y]=j.b,T[ut+y]=Re}}if(F&K){let ut=me,st=me+B*(L-se);for(;ut<=st;ut+=he){let St=ut+$;Q?re(T[ut+y],T[St+y]):Se(T[ut+y],T[St+y]),Re=j.a,T[St+y]=j.b,T[ut+y]=Re}}se=K,K>>=1}return me}function Ie(T,y,L,B,F,G,O,Q,ee){let K=0,se=0,me=O,ue=Math.trunc(B.value+(F+7)/8);for(;B.value<ue;)for(J(K,se,L,B),K=Y.c,se=Y.lc;se>=14;){let ze=K>>se-14&16383,$=y[ze];if($.len)se-=$.len,ae($.lit,G,K,se,L,B,Q,ee,me),K=ne.c,se=ne.lc;else{if(!$.p)throw new Error("hufDecode issues");let he;for(he=0;he<$.lit;he++){let Re=Z(T[$.p[he]]);for(;se<Re&&B.value<ue;)J(K,se,L,B),K=Y.c,se=Y.lc;if(se>=Re&&X(T[$.p[he]])==(K>>se-Re&(1<<Re)-1)){se-=Re,ae($.p[he],G,K,se,L,B,Q,ee,me),K=ne.c,se=ne.lc;break}}if(he==$.lit)throw new Error("hufDecode issues")}}let Ee=8-F&7;for(K>>=Ee,se-=Ee;se>0;){let ze=y[K<<14-se&16383];if(ze.len)se-=ze.len,ae(ze.lit,G,K,se,L,B,Q,ee,me),K=ne.c,se=ne.lc;else throw new Error("hufDecode issues")}return!0}function nt(T,y,L,B,F,G){let O={value:0},Q=L.value,ee=$e(y,L),K=$e(y,L);L.value+=4;let se=$e(y,L);if(L.value+=4,ee<0||ee>=65537||K<0||K>=65537)throw new Error("Something wrong with HUF_ENCSIZE");let me=new Array(65537),ue=new Array(16384);b(ue);let Ee=B-(L.value-Q);if(V(T,L,Ee,ee,K,me),se>8*(B-(L.value-Q)))throw new Error("Something wrong with hufUncompress");z(me,ee,K,ue),Ie(me,ue,T,L,se,K,G,F,O)}function rt(T,y,L){for(let B=0;B<L;++B)y[B]=T[y[B]]}function W(T){for(let y=1;y<T.length;y++){let L=T[y-1]+T[y]-128;T[y]=L}}function ve(T,y){let L=0,B=Math.floor((T.length+1)/2),F=0,G=T.length-1;for(;!(F>G||(y[F++]=T[L++],F>G));)y[F++]=T[B++]}function fe(T){let y=T.byteLength,L=new Array,B=0,F=new DataView(T);for(;y>0;){let G=F.getInt8(B++);if(G<0){let O=-G;y-=O+1;for(let Q=0;Q<O;Q++)L.push(F.getUint8(B++))}else{let O=G;y-=2;let Q=F.getUint8(B++);for(let ee=0;ee<O+1;ee++)L.push(Q)}}return L}function ge(T,y,L,B,F,G){let O=new DataView(G.buffer),Q=L[T.idx[0]].width,ee=L[T.idx[0]].height,K=3,se=Math.floor(Q/8),me=Math.ceil(Q/8),ue=Math.ceil(ee/8),Ee=Q-(me-1)*8,ze=ee-(ue-1)*8,$={value:0},he=new Array(K),Re=new Array(K),Ae=new Array(K),We=new Array(K),tt=new Array(K);for(let st=0;st<K;++st)tt[st]=y[T.idx[st]],he[st]=st<1?0:he[st-1]+me*ue,Re[st]=new Float32Array(64),Ae[st]=new Uint16Array(64),We[st]=new Uint16Array(me*64);for(let st=0;st<ue;++st){let St=8;st==ue-1&&(St=ze);let Zt=8;for(let vt=0;vt<me;++vt){vt==me-1&&(Zt=Ee);for(let wt=0;wt<K;++wt)Ae[wt].fill(0),Ae[wt][0]=F[he[wt]++],Te($,B,Ae[wt]),be(Ae[wt],Re[wt]),Le(Re[wt]);K==3&&dt(Re);for(let wt=0;wt<K;++wt)lt(Re[wt],We[wt],vt*64)}let pt=0;for(let vt=0;vt<K;++vt){let wt=L[T.idx[vt]].type;for(let Qt=8*st;Qt<8*st+St;++Qt){pt=tt[vt][Qt];for(let dn=0;dn<se;++dn){let Xn=dn*64+(Qt&7)*8;O.setUint16(pt+0*wt,We[vt][Xn+0],!0),O.setUint16(pt+2*wt,We[vt][Xn+1],!0),O.setUint16(pt+4*wt,We[vt][Xn+2],!0),O.setUint16(pt+6*wt,We[vt][Xn+3],!0),O.setUint16(pt+8*wt,We[vt][Xn+4],!0),O.setUint16(pt+10*wt,We[vt][Xn+5],!0),O.setUint16(pt+12*wt,We[vt][Xn+6],!0),O.setUint16(pt+14*wt,We[vt][Xn+7],!0),pt+=16*wt}}if(se!=me)for(let Qt=8*st;Qt<8*st+St;++Qt){let dn=tt[vt][Qt]+8*se*2*wt,Xn=se*64+(Qt&7)*8;for(let ni=0;ni<Zt;++ni)O.setUint16(dn+ni*2*wt,We[vt][Xn+ni],!0)}}}let ut=new Uint16Array(Q);O=new DataView(G.buffer);for(let st=0;st<K;++st){L[T.idx[st]].decoded=!0;let St=L[T.idx[st]].type;if(L[st].type==2)for(let Zt=0;Zt<ee;++Zt){let pt=tt[st][Zt];for(let vt=0;vt<Q;++vt)ut[vt]=O.getUint16(pt+vt*2*St,!0);for(let vt=0;vt<Q;++vt)O.setFloat32(pt+vt*2*St,oe(ut[vt]),!0)}}}function pe(T,y,L,B,F,G){let O=new DataView(G.buffer),Q=L[T],ee=Q.width,K=Q.height,se=Math.ceil(ee/8),me=Math.ceil(K/8),ue=Math.floor(ee/8),Ee=ee-(se-1)*8,ze=K-(me-1)*8,$={value:0},he=0,Re=new Float32Array(64),Ae=new Uint16Array(64),We=new Uint16Array(se*64);for(let tt=0;tt<me;++tt){let ut=8;tt==me-1&&(ut=ze);for(let st=0;st<se;++st)Ae.fill(0),Ae[0]=F[he++],Te($,B,Ae),be(Ae,Re),Le(Re),lt(Re,We,st*64);for(let st=8*tt;st<8*tt+ut;++st){let St=y[T][st];for(let Zt=0;Zt<ue;++Zt){let pt=Zt*64+(st&7)*8;for(let vt=0;vt<8;++vt)O.setUint16(St+vt*2*Q.type,We[pt+vt],!0);St+=16*Q.type}if(se!=ue){let Zt=ue*64+(st&7)*8;for(let pt=0;pt<Ee;++pt)O.setUint16(St+pt*2*Q.type,We[Zt+pt],!0)}}}Q.decoded=!0}function Te(T,y,L){let B,F=1;for(;F<64;)B=y[T.value],B==65280?F=64:B>>8==255?F+=B&255:(L[F]=B,F++),T.value++}function be(T,y){y[0]=oe(T[0]),y[1]=oe(T[1]),y[2]=oe(T[5]),y[3]=oe(T[6]),y[4]=oe(T[14]),y[5]=oe(T[15]),y[6]=oe(T[27]),y[7]=oe(T[28]),y[8]=oe(T[2]),y[9]=oe(T[4]),y[10]=oe(T[7]),y[11]=oe(T[13]),y[12]=oe(T[16]),y[13]=oe(T[26]),y[14]=oe(T[29]),y[15]=oe(T[42]),y[16]=oe(T[3]),y[17]=oe(T[8]),y[18]=oe(T[12]),y[19]=oe(T[17]),y[20]=oe(T[25]),y[21]=oe(T[30]),y[22]=oe(T[41]),y[23]=oe(T[43]),y[24]=oe(T[9]),y[25]=oe(T[11]),y[26]=oe(T[18]),y[27]=oe(T[24]),y[28]=oe(T[31]),y[29]=oe(T[40]),y[30]=oe(T[44]),y[31]=oe(T[53]),y[32]=oe(T[10]),y[33]=oe(T[19]),y[34]=oe(T[23]),y[35]=oe(T[32]),y[36]=oe(T[39]),y[37]=oe(T[45]),y[38]=oe(T[52]),y[39]=oe(T[54]),y[40]=oe(T[20]),y[41]=oe(T[22]),y[42]=oe(T[33]),y[43]=oe(T[38]),y[44]=oe(T[46]),y[45]=oe(T[51]),y[46]=oe(T[55]),y[47]=oe(T[60]),y[48]=oe(T[21]),y[49]=oe(T[34]),y[50]=oe(T[37]),y[51]=oe(T[47]),y[52]=oe(T[50]),y[53]=oe(T[56]),y[54]=oe(T[59]),y[55]=oe(T[61]),y[56]=oe(T[35]),y[57]=oe(T[36]),y[58]=oe(T[48]),y[59]=oe(T[49]),y[60]=oe(T[57]),y[61]=oe(T[58]),y[62]=oe(T[62]),y[63]=oe(T[63])}function Le(T){let y=.5*Math.cos(.7853975),L=.5*Math.cos(3.14159/16),B=.5*Math.cos(3.14159/8),F=.5*Math.cos(3*3.14159/16),G=.5*Math.cos(5*3.14159/16),O=.5*Math.cos(3*3.14159/8),Q=.5*Math.cos(7*3.14159/16),ee=new Array(4),K=new Array(4),se=new Array(4),me=new Array(4);for(let ue=0;ue<8;++ue){let Ee=ue*8;ee[0]=B*T[Ee+2],ee[1]=O*T[Ee+2],ee[2]=B*T[Ee+6],ee[3]=O*T[Ee+6],K[0]=L*T[Ee+1]+F*T[Ee+3]+G*T[Ee+5]+Q*T[Ee+7],K[1]=F*T[Ee+1]-Q*T[Ee+3]-L*T[Ee+5]-G*T[Ee+7],K[2]=G*T[Ee+1]-L*T[Ee+3]+Q*T[Ee+5]+F*T[Ee+7],K[3]=Q*T[Ee+1]-G*T[Ee+3]+F*T[Ee+5]-L*T[Ee+7],se[0]=y*(T[Ee+0]+T[Ee+4]),se[3]=y*(T[Ee+0]-T[Ee+4]),se[1]=ee[0]+ee[3],se[2]=ee[1]-ee[2],me[0]=se[0]+se[1],me[1]=se[3]+se[2],me[2]=se[3]-se[2],me[3]=se[0]-se[1],T[Ee+0]=me[0]+K[0],T[Ee+1]=me[1]+K[1],T[Ee+2]=me[2]+K[2],T[Ee+3]=me[3]+K[3],T[Ee+4]=me[3]-K[3],T[Ee+5]=me[2]-K[2],T[Ee+6]=me[1]-K[1],T[Ee+7]=me[0]-K[0]}for(let ue=0;ue<8;++ue)ee[0]=B*T[16+ue],ee[1]=O*T[16+ue],ee[2]=B*T[48+ue],ee[3]=O*T[48+ue],K[0]=L*T[8+ue]+F*T[24+ue]+G*T[40+ue]+Q*T[56+ue],K[1]=F*T[8+ue]-Q*T[24+ue]-L*T[40+ue]-G*T[56+ue],K[2]=G*T[8+ue]-L*T[24+ue]+Q*T[40+ue]+F*T[56+ue],K[3]=Q*T[8+ue]-G*T[24+ue]+F*T[40+ue]-L*T[56+ue],se[0]=y*(T[ue]+T[32+ue]),se[3]=y*(T[ue]-T[32+ue]),se[1]=ee[0]+ee[3],se[2]=ee[1]-ee[2],me[0]=se[0]+se[1],me[1]=se[3]+se[2],me[2]=se[3]-se[2],me[3]=se[0]-se[1],T[0+ue]=me[0]+K[0],T[8+ue]=me[1]+K[1],T[16+ue]=me[2]+K[2],T[24+ue]=me[3]+K[3],T[32+ue]=me[3]-K[3],T[40+ue]=me[2]-K[2],T[48+ue]=me[1]-K[1],T[56+ue]=me[0]-K[0]}function dt(T){for(let y=0;y<64;++y){let L=T[0][y],B=T[1][y],F=T[2][y];T[0][y]=L+1.5747*F,T[1][y]=L-.1873*B-.4682*F,T[2][y]=L+1.8556*B}}function lt(T,y,L){for(let B=0;B<64;++B)y[L+B]=vi.toHalfFloat(k(T[B]))}function k(T){return T<=1?Math.sign(T)*Math.pow(Math.abs(T),2.2):Math.sign(T)*Math.pow(w,Math.abs(T)-1)}function D(T){return new DataView(T.array.buffer,T.offset.value,T.size)}function te(T){let y=T.viewer.buffer.slice(T.offset.value,T.offset.value+T.size),L=new Uint8Array(fe(y)),B=new Uint8Array(L.length);return W(L),ve(L,B),new DataView(B.buffer)}function le(T){let y=T.array.slice(T.offset.value,T.offset.value+T.size),L=ac(y),B=new Uint8Array(L.length);return W(L),ve(L,B),new DataView(B.buffer)}function we(T){let y=T.viewer,L={value:T.offset.value},B=new Uint16Array(T.columns*T.lines*(T.inputChannels.length*T.type)),F=new Uint8Array(8192),G=0,O=new Array(T.inputChannels.length);for(let ze=0,$=T.inputChannels.length;ze<$;ze++)O[ze]={},O[ze].start=G,O[ze].end=O[ze].start,O[ze].nx=T.columns,O[ze].ny=T.lines,O[ze].size=T.type,G+=O[ze].nx*O[ze].ny*O[ze].size;let Q=qe(y,L),ee=qe(y,L);if(ee>=8192)throw new Error("Something is wrong with PIZ_COMPRESSION BITMAP_SIZE");if(Q<=ee)for(let ze=0;ze<ee-Q+1;ze++)F[ze+Q]=Oe(y,L);let K=new Uint16Array(65536),se=_(F,K),me=$e(y,L);nt(T.array,y,L,me,B,G);for(let ze=0;ze<T.inputChannels.length;++ze){let $=O[ze];for(let he=0;he<O[ze].size;++he)He(B,$.start+he,$.nx,$.size,$.ny,$.nx*$.size,se)}rt(K,B,G);let ue=0,Ee=new Uint8Array(B.buffer.byteLength);for(let ze=0;ze<T.lines;ze++)for(let $=0;$<T.inputChannels.length;$++){let he=O[$],Re=he.nx*he.size,Ae=new Uint8Array(B.buffer,he.end*2,Re*2);Ee.set(Ae,ue),ue+=Re*2,he.end+=Re}return new DataView(Ee.buffer)}function ce(T){let y=T.array.slice(T.offset.value,T.offset.value+T.size),L=ac(y),B=T.inputChannels.length*T.lines*T.columns*T.totalBytes,F=new ArrayBuffer(B),G=new DataView(F),O=0,Q=0,ee=new Array(4);for(let K=0;K<T.lines;K++)for(let se=0;se<T.inputChannels.length;se++){let me=0;switch(T.inputChannels[se].pixelType){case 1:ee[0]=O,ee[1]=ee[0]+T.columns,O=ee[1]+T.columns;for(let Ee=0;Ee<T.columns;++Ee){let ze=L[ee[0]++]<<8|L[ee[1]++];me+=ze,G.setUint16(Q,me,!0),Q+=2}break;case 2:ee[0]=O,ee[1]=ee[0]+T.columns,ee[2]=ee[1]+T.columns,O=ee[2]+T.columns;for(let Ee=0;Ee<T.columns;++Ee){let ze=L[ee[0]++]<<24|L[ee[1]++]<<16|L[ee[2]++]<<8;me+=ze,G.setUint32(Q,me,!0),Q+=4}break}}return G}function Qe(T){let y=T.viewer,L={value:T.offset.value},B=new Uint8Array(T.columns*T.lines*(T.inputChannels.length*T.type*2)),F={version:Je(y,L),unknownUncompressedSize:Je(y,L),unknownCompressedSize:Je(y,L),acCompressedSize:Je(y,L),dcCompressedSize:Je(y,L),rleCompressedSize:Je(y,L),rleUncompressedSize:Je(y,L),rleRawSize:Je(y,L),totalAcUncompressedCount:Je(y,L),totalDcUncompressedCount:Je(y,L),acCompression:Je(y,L)};if(F.version<2)throw new Error("EXRLoader.parse: "+ct.compression+" version "+F.version+" is unsupported");let G=new Array,O=qe(y,L)-2;for(;O>0;){let $=Be(y.buffer,L),he=Oe(y,L),Re=he>>2&3,Ae=(he>>4)-1,We=new Int8Array([Ae])[0],tt=Oe(y,L);G.push({name:$,index:We,type:tt,compression:Re}),O-=$.length+3}let Q=ct.channels,ee=new Array(T.inputChannels.length);for(let $=0;$<T.inputChannels.length;++$){let he=ee[$]={},Re=Q[$];he.name=Re.name,he.compression=0,he.decoded=!1,he.type=Re.pixelType,he.pLinear=Re.pLinear,he.width=T.columns,he.height=T.lines}let K={idx:new Array(3)};for(let $=0;$<T.inputChannels.length;++$){let he=ee[$];for(let Re=0;Re<G.length;++Re){let Ae=G[Re];he.name==Ae.name&&(he.compression=Ae.compression,Ae.index>=0&&(K.idx[Ae.index]=$),he.offset=$)}}let se,me,ue;if(F.acCompressedSize>0)switch(F.acCompression){case 0:se=new Uint16Array(F.totalAcUncompressedCount),nt(T.array,y,L,F.acCompressedSize,se,F.totalAcUncompressedCount);break;case 1:let $=T.array.slice(L.value,L.value+F.totalAcUncompressedCount),he=ac($);se=new Uint16Array(he.buffer),L.value+=F.totalAcUncompressedCount;break}if(F.dcCompressedSize>0){let $={array:T.array,offset:L,size:F.dcCompressedSize};me=new Uint16Array(le($).buffer),L.value+=F.dcCompressedSize}if(F.rleRawSize>0){let $=T.array.slice(L.value,L.value+F.rleCompressedSize),he=ac($);ue=fe(he.buffer),L.value+=F.rleCompressedSize}let Ee=0,ze=new Array(ee.length);for(let $=0;$<ze.length;++$)ze[$]=new Array;for(let $=0;$<T.lines;++$)for(let he=0;he<ee.length;++he)ze[he].push(Ee),Ee+=ee[he].width*T.type*2;K.idx[0]!==void 0&&ee[K.idx[0]]&&ge(K,ze,ee,se,me,B);for(let $=0;$<ee.length;++$){let he=ee[$];if(!he.decoded)switch(he.compression){case 2:let Re=0,Ae=0;for(let We=0;We<T.lines;++We){let tt=ze[$][Re];for(let ut=0;ut<he.width;++ut){for(let st=0;st<2*he.type;++st)B[tt++]=ue[Ae+st*he.width*he.height];Ae++}Re++}break;case 1:pe($,ze,ee,se,me,B);break;default:throw new Error("EXRLoader.parse: unsupported channel compression")}}return new DataView(B.buffer)}function Be(T,y){let L=new Uint8Array(T),B=0;for(;L[y.value+B]!=0;)B+=1;let F=new TextDecoder().decode(L.slice(y.value,y.value+B));return y.value=y.value+B+1,F}function je(T,y,L){let B=new TextDecoder().decode(new Uint8Array(T).slice(y.value,y.value+L));return y.value=y.value+L,B}function Ze(T,y){let L=ye(T,y),B=$e(T,y);return[L,B]}function Ce(T,y){let L=$e(T,y),B=$e(T,y);return[L,B]}function ye(T,y){let L=T.getInt32(y.value,!0);return y.value=y.value+4,L}function $e(T,y){let L=T.getUint32(y.value,!0);return y.value=y.value+4,L}function et(T,y){let L=T[y.value];return y.value=y.value+1,L}function Oe(T,y){let L=T.getUint8(y.value);return y.value=y.value+1,L}let Je=function(T,y){let L;return"getBigInt64"in DataView.prototype?L=Number(T.getBigInt64(y.value,!0)):L=T.getUint32(y.value+4,!0)+Number(T.getUint32(y.value,!0)<<32),y.value+=8,L};function q(T,y){let L=T.getFloat32(y.value,!0);return y.value+=4,L}function De(T,y){return vi.toHalfFloat(q(T,y))}function oe(T){let y=(T&31744)>>10,L=T&1023;return(T>>15?-1:1)*(y?y===31?L?NaN:1/0:Math.pow(2,y-15)*(1+L/1024):6103515625e-14*(L/1024))}function qe(T,y){let L=T.getUint16(y.value,!0);return y.value+=2,L}function Pe(T,y){return oe(qe(T,y))}function Me(T,y,L,B){let F=L.value,G=[];for(;L.value<F+B-1;){let O=Be(y,L),Q=ye(T,L),ee=Oe(T,L);L.value+=3;let K=ye(T,L),se=ye(T,L);G.push({name:O,pixelType:Q,pLinear:ee,xSampling:K,ySampling:se})}return L.value+=1,G}function it(T,y){let L=q(T,y),B=q(T,y),F=q(T,y),G=q(T,y),O=q(T,y),Q=q(T,y),ee=q(T,y),K=q(T,y);return{redX:L,redY:B,greenX:F,greenY:G,blueX:O,blueY:Q,whiteX:ee,whiteY:K}}function xt(T,y){let L=["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"],B=Oe(T,y);return L[B]}function Pt(T,y){let L=ye(T,y),B=ye(T,y),F=ye(T,y),G=ye(T,y);return{xMin:L,yMin:B,xMax:F,yMax:G}}function Lt(T,y){let L=["INCREASING_Y","DECREASING_Y","RANDOM_Y"],B=Oe(T,y);return L[B]}function fn(T,y){let L=["ENVMAP_LATLONG","ENVMAP_CUBE"],B=Oe(T,y);return L[B]}function Tn(T,y){let L=["ONE_LEVEL","MIPMAP_LEVELS","RIPMAP_LEVELS"],B=["ROUND_DOWN","ROUND_UP"],F=$e(T,y),G=$e(T,y),O=Oe(T,y);return{xSize:F,ySize:G,levelMode:L[O&15],roundingMode:B[O>>4]}}function Cs(T,y){let L=q(T,y),B=q(T,y);return[L,B]}function nn(T,y){let L=q(T,y),B=q(T,y),F=q(T,y);return[L,B,F]}function qi(T,y,L,B,F){if(B==="string"||B==="stringvector"||B==="iccProfile")return je(y,L,F);if(B==="chlist")return Me(T,y,L,F);if(B==="chromaticities")return it(T,L);if(B==="compression")return xt(T,L);if(B==="box2i")return Pt(T,L);if(B==="envmap")return fn(T,L);if(B==="tiledesc")return Tn(T,L);if(B==="lineOrder")return Lt(T,L);if(B==="float")return q(T,L);if(B==="v2f")return Cs(T,L);if(B==="v3f")return nn(T,L);if(B==="int")return ye(T,L);if(B==="rational")return Ze(T,L);if(B==="timecode")return Ce(T,L);if(B==="preview")return L.value+=F,"skipped";L.value+=F}function Yi(T,y){let L=Math.log2(T);return y=="ROUND_DOWN"?Math.floor(L):Math.ceil(L)}function Zi(T,y,L){let B=0;switch(T.levelMode){case"ONE_LEVEL":B=1;break;case"MIPMAP_LEVELS":B=Yi(Math.max(y,L),T.roundingMode)+1;break;case"RIPMAP_LEVELS":throw new Error("THREE.EXRLoader: RIPMAP_LEVELS tiles currently unsupported.")}return B}function ji(T,y,L,B){let F=new Array(T);for(let G=0;G<T;G++){let O=1<<G,Q=y/O|0;B=="ROUND_UP"&&Q*O<y&&(Q+=1);let ee=Math.max(Q,1);F[G]=(ee+L-1)/L|0}return F}function Xr(){let T=this,y=T.offset,L={value:0};for(let B=0;B<T.tileCount;B++){let F=ye(T.viewer,y),G=ye(T.viewer,y);y.value+=8,T.size=$e(T.viewer,y);let O=F*T.blockWidth,Q=G*T.blockHeight;T.columns=O+T.blockWidth>T.width?T.width-O:T.blockWidth,T.lines=Q+T.blockHeight>T.height?T.height-Q:T.blockHeight;let ee=T.columns*T.totalBytes,se=T.size<T.lines*ee?T.uncompress(T):D(T);y.value+=T.size;for(let me=0;me<T.lines;me++){let ue=me*T.columns*T.totalBytes;for(let Ee=0;Ee<T.inputChannels.length;Ee++){let ze=ct.channels[Ee].name,$=T.channelByteOffsets[ze]*T.columns,he=T.decodeChannels[ze];if(he===void 0)continue;L.value=ue+$;let Re=(T.height-(1+Q+me))*T.outLineWidth;for(let Ae=0;Ae<T.columns;Ae++){let We=Re+(Ae+O)*T.outputChannels+he;T.byteArray[We]=T.getter(se,L)}}}}}function Ki(){let T=this,y=T.offset,L={value:0};for(let B=0;B<T.height/T.blockHeight;B++){let F=ye(T.viewer,y)-ct.dataWindow.yMin;T.size=$e(T.viewer,y),T.lines=F+T.blockHeight>T.height?T.height-F:T.blockHeight;let G=T.columns*T.totalBytes,Q=T.size<T.lines*G?T.uncompress(T):D(T);y.value+=T.size;for(let ee=0;ee<T.blockHeight;ee++){let K=B*T.blockHeight,se=ee+T.scanOrder(K);if(se>=T.height)continue;let me=ee*G,ue=(T.height-1-se)*T.outLineWidth;for(let Ee=0;Ee<T.inputChannels.length;Ee++){let ze=ct.channels[Ee].name,$=T.channelByteOffsets[ze]*T.columns,he=T.decodeChannels[ze];if(he!==void 0){L.value=me+$;for(let Re=0;Re<T.columns;Re++){let Ae=ue+Re*T.outputChannels+he;T.byteArray[Ae]=T.getter(Q,L)}}}}}}function Is(T,y,L){let B={};if(T.getUint32(0,!0)!=20000630)throw new Error("THREE.EXRLoader: Provided file doesn't appear to be in OpenEXR format.");B.version=T.getUint8(4);let F=T.getUint8(5);B.spec={singleTile:!!(F&2),longName:!!(F&4),deepFormat:!!(F&8),multiPart:!!(F&16)},L.value=8;let G=!0;for(;G;){let O=Be(y,L);if(O==="")G=!1;else{let Q=Be(y,L),ee=$e(T,L),K=qi(T,y,L,Q,ee);K===void 0?console.warn(`THREE.EXRLoader: Skipped unknown header attribute type '${Q}'.`):B[O]=K}}if((F&-7)!=0)throw console.error("THREE.EXRHeader:",B),new Error("THREE.EXRLoader: Provided file is currently unsupported.");return B}function ie(T,y,L,B,F,G){let O={size:0,viewer:y,array:L,offset:B,width:T.dataWindow.xMax-T.dataWindow.xMin+1,height:T.dataWindow.yMax-T.dataWindow.yMin+1,inputChannels:T.channels,channelByteOffsets:{},shouldExpand:!1,scanOrder:null,totalBytes:null,columns:null,lines:null,type:null,uncompress:null,getter:null,format:null,colorSpace:Xt};switch(T.compression){case"NO_COMPRESSION":O.blockHeight=1,O.uncompress=D;break;case"RLE_COMPRESSION":O.blockHeight=1,O.uncompress=te;break;case"ZIPS_COMPRESSION":O.blockHeight=1,O.uncompress=le;break;case"ZIP_COMPRESSION":O.blockHeight=16,O.uncompress=le;break;case"PIZ_COMPRESSION":O.blockHeight=32,O.uncompress=we;break;case"PXR24_COMPRESSION":O.blockHeight=16,O.uncompress=ce;break;case"DWAA_COMPRESSION":O.blockHeight=32,O.uncompress=Qe;break;case"DWAB_COMPRESSION":O.blockHeight=256,O.uncompress=Qe;break;default:throw new Error("EXRLoader.parse: "+T.compression+" is unsupported")}let Q={};for(let ue of T.channels)switch(ue.name){case"Y":case"R":case"G":case"B":case"A":Q[ue.name]=!0,O.type=ue.pixelType}let ee=!1,K=!1;if(Q.R&&Q.G&&Q.B)O.outputChannels=4;else if(Q.Y)O.outputChannels=1;else throw new Error("EXRLoader.parse: file contains unsupported data channels.");switch(O.outputChannels){case 4:G==ln?(ee=!Q.A,O.format=ln,O.colorSpace=Xt,O.outputChannels=4,O.decodeChannels={R:0,G:1,B:2,A:3}):G==pr?(O.format=pr,O.colorSpace=Xt,O.outputChannels=2,O.decodeChannels={R:0,G:1}):G==wi?(O.format=wi,O.colorSpace=Xt,O.outputChannels=1,O.decodeChannels={R:0}):K=!0;break;case 1:G==ln?(ee=!0,O.format=ln,O.colorSpace=Xt,O.outputChannels=4,O.shouldExpand=!0,O.decodeChannels={Y:0}):G==pr?(O.format=pr,O.colorSpace=Xt,O.outputChannels=2,O.shouldExpand=!0,O.decodeChannels={Y:0}):G==wi?(O.format=wi,O.colorSpace=Xt,O.outputChannels=1,O.decodeChannels={Y:0}):K=!0;break;default:K=!0}if(K)throw new Error("EXRLoader.parse: invalid output format for specified file.");if(O.type==1)switch(F){case cn:O.getter=Pe;break;case qt:O.getter=qe;break}else if(O.type==2)switch(F){case cn:O.getter=q;break;case qt:O.getter=De}else throw new Error("EXRLoader.parse: unsupported pixelType "+O.type+" for "+T.compression+".");O.columns=O.width;let se=O.width*O.height*O.outputChannels;switch(F){case cn:O.byteArray=new Float32Array(se),ee&&O.byteArray.fill(1,0,se);break;case qt:O.byteArray=new Uint16Array(se),ee&&O.byteArray.fill(15360,0,se);break;default:console.error("THREE.EXRLoader: unsupported type: ",F);break}let me=0;for(let ue of T.channels)O.decodeChannels[ue.name]!==void 0&&(O.channelByteOffsets[ue.name]=me),me+=ue.pixelType*2;if(O.totalBytes=me,O.outLineWidth=O.width*O.outputChannels,T.lineOrder==="INCREASING_Y"?O.scanOrder=ue=>ue:O.scanOrder=ue=>O.height-1-ue,T.spec.singleTile){O.blockHeight=T.tiles.ySize,O.blockWidth=T.tiles.xSize;let ue=Zi(T.tiles,O.width,O.height),Ee=ji(ue,O.width,T.tiles.xSize,T.tiles.roundingMode),ze=ji(ue,O.height,T.tiles.ySize,T.tiles.roundingMode);O.tileCount=Ee[0]*ze[0];for(let $=0;$<ue;$++)for(let he=0;he<ze[$];he++)for(let Re=0;Re<Ee[$];Re++)Je(y,B);O.decode=Xr.bind(O)}else{O.blockWidth=O.width;let ue=Math.ceil(O.height/O.blockHeight);for(let Ee=0;Ee<ue;Ee++)Je(y,B);O.decode=Ki.bind(O)}return O}let Ne={value:0},Fe=new DataView(e),ft=new Uint8Array(e),ct=Is(Fe,e,Ne),Ye=ie(ct,Fe,ft,Ne,this.type,this.outputFormat);if(Ye.decode(),Ye.shouldExpand){let T=Ye.byteArray;if(this.outputFormat==ln)for(let y=0;y<T.length;y+=4)T[y+2]=T[y+1]=T[y];else if(this.outputFormat==pr)for(let y=0;y<T.length;y+=2)T[y+1]=T[y]}return{header:ct,width:Ye.width,height:Ye.height,data:Ye.byteArray,format:Ye.format,colorSpace:Ye.colorSpace,type:this.type}}setDataType(e){return this.type=e,this}setOutputFormat(e){return this.outputFormat=e,this}load(e,t,n,i){function s(o,a){o.colorSpace=a.colorSpace,o.minFilter=Vt,o.magFilter=Vt,o.generateMipmaps=!1,o.flipY=!1,t&&t(o,a)}return super.load(e,s,n,i)}};async function W0(){let r=await new nh().setDataType(qt).loadAsync("./blender/mythology-v32-118/ground-cycles-radiance.exr");r.colorSpace=Xt,r.flipY=!1,r.repeat.y=-1,r.offset.y=1,r.anisotropy=8;let e=await Promise.all(["./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_diff_2k.jpg","./assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg","./assets/odyssey/pbr-v106/sand_01/diff.jpg"].map(n=>new tn().loadAsync(n)));e.forEach(n=>{n.wrapS=n.wrapT=hn,n.colorSpace=bt,n.anisotropy=8});let t=new _n({map:r,toneMapped:!0});return t.name="V118 actual Cycles radiance with metre-scale photographic close detail",t.onBeforeCompile=n=>{e.forEach((i,s)=>n.uniforms["v118_detail"+s]={value:i}),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 habitat;varying vec3 v118_detailWorld,v118_detailNormal,v118_detailHabitat;`).replace("#include <begin_vertex>",`#include <begin_vertex>
v118_detailWorld=(modelMatrix*vec4(position,1.)).xyz;v118_detailNormal=mat3(modelMatrix)*normal;v118_detailHabitat=habitat;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
   uniform sampler2D v118_detail0,v118_detail1,v118_detail2;varying vec3 v118_detailWorld,v118_detailNormal,v118_detailHabitat;
   float v118_photo(sampler2D t,vec3 p,vec3 w){return dot(texture2D(t,p.yz).rgb*w.x+texture2D(t,p.xz).rgb*w.y+texture2D(t,p.xy).rgb*w.z,vec3(.2126,.7152,.0722));}
   float v118_contrast(sampler2D t,vec3 p,vec3 w){float a=v118_photo(t,p,w);float mean=(v118_photo(t,p+vec3(.17,.23,.19),w)+v118_photo(t,p-vec3(.21,.19,.17),w)+v118_photo(t,p+vec3(.34,-.37,.29),w)+v118_photo(t,p-vec3(.31,-.33,.35),w))*.25;return clamp(sqrt((a+.035)/(mean+.035)),.78,1.23);}`).replace("#include <map_fragment>",`#include <map_fragment>
    vec3 v118_dw=pow(abs(normalize(v118_detailNormal)),vec3(5.));v118_dw/=max(.0001,v118_dw.x+v118_dw.y+v118_dw.z);
    float v118_dc=mix(mix(v118_contrast(v118_detail0,v118_detailWorld/1.8,v118_dw),v118_contrast(v118_detail1,v118_detailWorld/1.7,v118_dw),clamp(v118_detailHabitat.g,0.,1.)),v118_contrast(v118_detail2,v118_detailWorld/.42,v118_dw),clamp(v118_detailHabitat.r,0.,1.));
    diffuseColor.rgb*=mix(1.,v118_dc,1.-smoothstep(40.,125.,distance(cameraPosition,v118_detailWorld)));`)},t.customProgramCacheKey=()=>"v118-cycles-radiance-photo-detail-1",t}async function X0(){let r=new tn,e=["./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_diff_2k.jpg","./assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg","./assets/odyssey/pbr-v106/sand_01/diff.jpg","./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_nor_gl_2k.jpg","./assets/odyssey/pbr-v103/forest_ground_04/nor_gl.jpg","./assets/odyssey/pbr-v106/sand_01/nor_gl.jpg","./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_rough_2k.jpg","./assets/odyssey/pbr-v103/forest_ground_04/Rough.jpg","./assets/odyssey/pbr-v106/sand_01/rough.jpg","./blender/mythology-v32-118/ground-contact-ao.png"],t=await Promise.all(e.map(i=>r.loadAsync(i)));t.forEach((i,s)=>{i.anisotropy=8,s<9&&(i.wrapS=i.wrapT=hn),s<3&&(i.colorSpace=bt)}),t[9].flipY=!1;let n=new Xe({color:16777215,roughness:.84,envMapIntensity:.65,aoMap:t[9],aoMapIntensity:.75});return n.name="V118 pale fractured coast / dry woodland / fine sand / native Cycles AO",n.onBeforeCompile=i=>{for(let[s,o]of["rockColor","soilColor","sandColor","rockNormal","soilNormal","sandNormal","rockRough","soilRough","sandRough"].entries())i.uniforms["v118_"+o]={value:t[s]};i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 habitat;varying vec3 v118_habitat,v118_world,v118_normal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
v118_habitat=habitat;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
v118_world=(modelMatrix*vec4(transformed,1.)).xyz;v118_normal=inverseTransformDirection(transformedNormal,viewMatrix);`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
  varying vec3 v118_habitat,v118_world,v118_normal;
  uniform sampler2D v118_rockColor,v118_soilColor,v118_sandColor,v118_rockNormal,v118_soilNormal,v118_sandNormal,v118_rockRough,v118_soilRough,v118_sandRough;
  vec3 v118_weights(){vec3 w=pow(abs(normalize(v118_normal)),vec3(5.));return w/max(.0001,w.x+w.y+w.z);}
  vec3 v118_tri(sampler2D t,vec3 p,vec3 w){return texture2D(t,p.yz).rgb*w.x+texture2D(t,p.xz).rgb*w.y+texture2D(t,p.xy).rgb*w.z;}
  vec3 v118_bump(sampler2D t,vec3 p,vec3 w,float strength){vec3 a=texture2D(t,p.yz).xyz*2.-1.,b=texture2D(t,p.xz).xyz*2.-1.,c=texture2D(t,p.xy).xyz*2.-1.;a.xy*=strength;b.xy*=strength;c.xy*=strength;vec3 n=normalize(v118_normal),sg=sign(n);return normalize(n+vec3(a.z*sg.x,a.x,a.y)*w.x+vec3(b.x,b.z*sg.y,b.y)*w.y+vec3(c.x,c.y,c.z*sg.z)*w.z-sg*w);}`).replace("#include <map_fragment>",`vec3 v118_w=v118_weights();float v118_sand=clamp(v118_habitat.r,0.,1.),v118_soil=clamp(v118_habitat.g,0.,1.);float v118_wet=1.-smoothstep(.15,1.6,v118_world.y);
  vec3 v118_rawRock=v118_tri(v118_rockColor,v118_world/1.8,v118_w);float v118_peak=max(max(v118_rawRock.r,v118_rawRock.g),v118_rawRock.b);
  vec3 v118_r=min(mix(vec3(v118_peak),v118_rawRock,.38)*vec3(3.8,3.7,3.25),vec3(.82,.82,.80)),v118_f=v118_tri(v118_soilColor,v118_world/1.7,v118_w)*vec3(1.04,.94,.72),v118_b=v118_tri(v118_sandColor,v118_world/.42,v118_w)*vec3(1.14,1.10,.98);
  diffuseColor.rgb=mix(mix(v118_r,v118_f,v118_soil),v118_b,v118_sand)*(1.-.25*v118_wet);`).replace("#include <roughnessmap_fragment>","float v118_rr=v118_tri(v118_rockRough,v118_world/1.8,v118_w).r,v118_fr=v118_tri(v118_soilRough,v118_world/1.7,v118_w).r,v118_br=v118_tri(v118_sandRough,v118_world/.42,v118_w).r;float roughnessFactor=mix(clamp(mix(mix(v118_rr,v118_fr,v118_soil),v118_br,v118_sand),.58,.96),.43,v118_wet);").replace("#include <normal_fragment_maps>","vec3 v118_rn=v118_bump(v118_rockNormal,v118_world/1.8,v118_w,.30),v118_fn=v118_bump(v118_soilNormal,v118_world/1.7,v118_w,.16),v118_bn=v118_bump(v118_sandNormal,v118_world/.42,v118_w,.09);normal=normalize(mat3(viewMatrix)*normalize(mix(mix(v118_rn,v118_fn,v118_soil),v118_bn,v118_sand)));")},n.customProgramCacheKey=()=>"v118-native-ground-contact-and-pale-rock",n}Ts();Ss();async function q0(r,e,t){let n=new Kn,i="./blender/mythology-v32-118/",[s,o,a,c,l]=await Promise.all(["island","cliffs","biome-web","fleet","cyclops"].map(z=>n.loadAsync(i+z+"-v118.glb")));r.updateMatrixWorld(!0),s.scene.updateMatrixWorld(!0);let h,u;if(s.scene.traverse(z=>{z instanceof _e&&(h=z)}),r.traverse(z=>{z instanceof _e&&z.userData.native84Key==="native84_19"&&(u=z)}),!h||!u)throw Error("V117 actual native island and habitat surface required");let f=h.geometry.clone().applyMatrix4(h.matrixWorld).applyMatrix4(u.matrixWorld.clone().invert());f.computeVertexNormals();let d=f.getAttribute("color_1")||f.getAttribute("color");if(!d)throw Error("Actual Blender Habitat colours missing");let g=new Float32Array(d.count*3);for(let z=0;z<d.count;z++)g.set([d.getX(z),d.getY(z),d.getZ(z)],z*3);f.setAttribute("habitat",new Rt(g,3)),f.boundsTree=new Xi(f),u.geometry=f,u.raycast=Wr;let E=await W0();u.material=E;let m=0;r.traverse(z=>{if(z===u)return;let Y=Number(String(z.userData.native84Key||"").split("_")[1]);(Y>=20&&Y<=32||/^(Wet fractured littoral rock|coastal_cliff_02_LOD0)$/.test(z.name))&&(z.visible=!1,m++),/^V106 actual MCP/.test(z.name)&&(z.visible=!1,m++),z instanceof ot&&!xS(z)&&/forest|crown|canop|trunk|pine|oak|understory|leaf litter|branch|cypress|grounded meadow|Naturally exposed|V95 fractured|V104 broken coastal|V104 granular/i.test(z.name)&&(z.visible=!1,m++)});let p=new Set;function M(z){z.traverse(Y=>{if(Y instanceof _e){Y.castShadow=!0,Y.receiveShadow=!0;for(let J of Array.isArray(Y.material)?Y.material:[Y.material])J instanceof Xe&&(J.envMapIntensity=.65,/leaf|leaves|canopy|fern/i.test(J.name)&&(J.alphaTest=.42,J.transparent=!1,J.side=Mt),p.has(J)||(p.add(J),t(J)))}})}let x=await X0();x.aoMap=null,x.name="V118 pale photographic fractured rock / live PBR on CLOSED boulders";let v=new Set;o.scene.traverse(z=>{if(!(!(z instanceof _e)||(Array.isArray(z.material)?z.material:[z.material]).some(J=>/rooted|bark/i.test(J.name)))){if(!v.has(z.geometry.uuid)){let J=new Float32Array(z.geometry.getAttribute("position").count*3);for(let ne=2;ne<J.length;ne+=3)J[ne]=1;z.geometry.setAttribute("habitat",new Rt(J,3)),v.add(z.geometry.uuid)}z.material=x}}),o.scene.name="V118 actual CLOSED coastal boulders and grounded woody roots",M(o.scene),r.add(o.scene),l.scene.name="V117 actual re-grounded anatomical cyclops",M(l.scene),r.add(l.scene),a.scene.updateMatrixWorld(!0);let S=new Dt;S.name="V117 native biomes / live geometric LOD";let A=new Map;a.scene.traverse(z=>{if(!(z instanceof _e))return;let Y=z.geometry.uuid+"|"+(Array.isArray(z.material)?z.material.map(ne=>ne.uuid).join(","):z.material.uuid),J=A.get(Y);J||(J={g:z.geometry,m:z.material,matrices:[],name:z.name},A.set(Y,J)),J.matrices.push(z.matrixWorld.clone())});let C=[],I=await new tn().loadAsync(i+"canopy-impostor.png");I.colorSpace=bt,I.anisotropy=8;let w=[0,Math.PI/3,Math.PI*2/3].map(z=>new Bi(1.08,1.08).translate(0,.54,0).rotateY(z)),_=Ti(w,!1),b=new _n({map:I,alphaTest:.32,side:Mt});b.name="V117 actual native full canopy render / distant crossed-card LOD";for(let z of A.values()){let Y=new ot(z.g,z.m,z.matrices.length);Y.name=z.name,Y.receiveShadow=!0,z.matrices.forEach((ne,ae)=>Y.setMatrixAt(ae,ne)),Y.computeBoundingSphere(),S.add(Y);let J=(Array.isArray(z.m)?z.m:[z.m]).some(ne=>/leaf|leaves|canopy/i.test(ne.name));if(J&&_){let ne=new ot(_,b,z.matrices.length);ne.name="V117 intact far leaves",ne.frustumCulled=!1,ne.receiveShadow=!0,ne.userData.nativeCanopyColour=!0,ne.count=0,S.add(ne),Y.userData.nativeCanopyColour=!0,C.push({near:Y,far:ne,matrices:z.matrices})}if(J){let ne=b.clone();ne.colorWrite=!1,ne.depthWrite=!1;let ae=new ot(_,ne,z.matrices.length);ae.name="V118 alpha canopy shadow",z.matrices.forEach((Ue,xe)=>ae.setMatrixAt(xe,Ue)),ae.computeBoundingSphere(),S.add(ae)}}M(S),S.traverse(z=>{z instanceof _e&&(z.userData.nativeCanopyColour||/GROUNDCOVER/.test(z.name))&&(z.castShadow=!1)}),r.add(S);let P=[...A.values()].find(z=>/tree.*part1/.test(z.name)),U=new R(-80,10,-125);if(P){let z=P.matrices.map(Y=>new R().setFromMatrixPosition(Y)).filter(Y=>Y.y>4&&Y.y<22&&Y.z>-155);z.sort((Y,J)=>Y.z-J.z),z.length&&U.copy(z[Math.floor(z.length*.65)])}let N=new R,H=[];c.scene.updateMatrixWorld(!0),c.scene.getObjectByName("V112_SHIP_0")?.traverse(z=>{z instanceof _e&&/captain.*Humanlow.poly$/i.test(z.name)&&new ht().setFromObject(z).getCenter(N)});for(let z=0;z<e.length;z++){let Y=c.scene.getObjectByName("V112_SHIP_"+z);if(!Y)throw Error("Missing distinct native vessel "+z);let J=e[z];for(let xe of J.root.children)xe.visible=!1;J.sails.length=0;let ne=Y.matrixWorld.clone().invert(),ae=new Map,Ue=[];Y.traverse(xe=>{if(!(xe instanceof _e))return;if(xe.userData.role==="sail"){let He=xe.geometry.clone();He.computeBoundingBox(),xe.geometry=He,H.push({mesh:xe,positions:new Float32Array(He.getAttribute("position").array),normal:new Float32Array(He.getAttribute("normal").array),bounds:He.boundingBox.clone()});return}let j=Array.isArray(xe.material)?xe.material:[xe.material];if(j.length!==1)return;let re=(xe.geometry.index?xe.geometry.toNonIndexed():xe.geometry.clone()).applyMatrix4(ne.clone().multiply(xe.matrixWorld));for(let He of Object.keys(re.attributes))["position","normal","uv"].includes(He)||re.deleteAttribute(He);re.getAttribute("uv")||re.setAttribute("uv",new Ke(new Float32Array(re.getAttribute("position").count*2),2));let Se=ae.get(j[0])||[];Se.push(re),ae.set(j[0],Se),Ue.push(xe)});for(let[xe,j]of ae){let re=Ti(j,!1);if(!re)throw Error("Native vessel surface merge failed");let Se=new _e(re,xe);Se.name="V117 vessel "+z+" actual material batch / "+xe.name,Y.add(Se),j.forEach(He=>He.dispose())}for(let xe of Ue)xe.parent?.remove(xe);J.root.attach(Y),Y.name="V117 distinct vessel "+z,M(Y)}let Z=new ht().setFromObject(l.scene),X=new ht().setFromObject(u);return{treeBase:U,captainHead:N,info:{version:118,actualBlenderMcp:!0,hiddenOld:m,islandVertices:f.getAttribute("position").count,woodlandBatches:A.size,distinctShips:e.length,curvedSails:H.length,source:"Actual local Blender V118 native GLBs",principalHead:N.toArray(),treeBase:U.toArray(),staticCyclesGroundRadiance:!0,radianceResolution:4096,rootSystems:543,maquis:420,shadeFerns:202,seaChanged:!1,islandBounds:{min:X.min.toArray(),max:X.max.toArray()},canopyLOD:"16 close complete leaf proxies maximum; distant actual foliage-only native render crossed cards",nativeFile:"blender/mythology-v32-118/05-final-mediterranean-world.blend"},giant:l.scene,giantCenter:Z.getCenter(new R),update:(z,Y)=>{if(Y){let J=new R,ne=new ke;for(let ae of C){let Ue=0,xe=0;for(let j of ae.matrices)J.setFromMatrixPosition(j),J.distanceTo(Y.position)<55&&Ue<16?ae.near.setMatrixAt(Ue++,j):ae.far.setMatrixAt(xe++,j);ae.near.count=Ue,ae.far.count=xe,ae.near.instanceMatrix.needsUpdate=!0,ae.far.instanceMatrix.needsUpdate=!0}}for(let J of H){let ne=J.mesh.geometry.getAttribute("position"),ae=J.bounds.max.x-J.bounds.min.x,Ue=J.bounds.max.z-J.bounds.min.z;for(let xe=0;xe<ne.count;xe++){let j=J.positions[xe*3],re=J.positions[xe*3+2],Se=(j-J.bounds.min.x)/Math.max(.01,ae),He=(re-J.bounds.min.z)/Math.max(.01,Ue),Ie=Math.sin(Math.PI*Se)*Math.sin(Math.PI*He),nt=.055*Ie*Math.sin(z*1.4+j*.6+re*.9);ne.setXYZ(xe,j+J.normal[xe*3]*nt,J.positions[xe*3+1]+J.normal[xe*3+1]*nt,re+J.normal[xe*3+2]*nt)}ne.needsUpdate=!0}}}}function xS(r){let e=r;for(;e;){if(e.userData.variant!==void 0)return!0;e=e.parent}return!1}var ih=document.getElementById("odysseyScene");if(ih){let r=!1,e=()=>{r||(r=!0,vS(ih).catch(t=>{ih.classList.add("has-error"),console.error("Odyssey scene could not load",t)}))};ih.closest("#odyssey")?.dataset.open==="true"&&e(),window.addEventListener("v31:odyssey-open",e)}async function vS(r){let e=!1,t=performance.now(),n=()=>new Promise(ie=>setTimeout(ie,0)),i=r.querySelector("canvas");i.style.opacity="0";let s=new du({canvas:i,antialias:!0,powerPreference:"high-performance"});s.setPixelRatio(Math.min(devicePixelRatio,1.25)),s.toneMapping=ao,s.toneMappingExposure=1,s.shadowMap.enabled=!0,s.shadowMap.type=dl;let o=new la,a=new an(35.8,1,.2,12e3);a.position.set(27,15,60);let c=lg(a,i);c.target.set(-105,16,-130),c.update();let l=new ai(16764294,3.25);l.position.set(-100,80,30),l.target.position.set(-12,8,-15),l.castShadow=!0,l.shadow.mapSize.set(2048,2048),l.shadow.camera.left=-40,l.shadow.camera.right=40,l.shadow.mapSize.set(4096,4096),l.shadow.camera.left=-245,l.shadow.camera.right=245,l.shadow.camera.top=185,l.shadow.camera.bottom=-185,l.shadow.camera.near=-420,l.shadow.camera.far=700,l.shadow.bias=-16e-5,l.shadow.normalBias=.035;let h=new ai(13357510,.85);h.position.set(-25,18,35),o.add(l,l.target,h,new lr(11648965,3485728,.38));let u=new vo(s),f=await new xu().loadAsync("./assets/odyssey/venice_sunset_1k.hdr");f.mapping=co,o.environment=u.fromEquirectangular(f).texture,o.environmentIntensity=.22,u.dispose();let d=new Nt({side:Mn,depthWrite:!1,uniforms:{map:{value:f},time:{value:0}},vertexShader:"varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`uniform sampler2D map;uniform float time;varying vec3 direction;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
    float fbm(vec2 p){float r=0.,a=.5;for(int i=0;i<5;i++){r+=a*noise(p);p=p*2.03+vec2(13.1,7.3);a*=.5;}return r;}
    void main(){vec3 d=normalize(direction);vec2 uv=vec2(atan(d.z,d.x)/6.2831853+.5,.62+max(d.y,0.)*.34);
    vec3 photo=texture2D(map,uv).rgb;float glow=pow(max(dot(d,normalize(vec3(-45.,35.,-160.))),0.),32.);
    float horizon=pow(max(0.,1.-abs(d.y)),5.);
    vec3 clear=mix(vec3(.026,.058,.063),vec3(.73,.34,.075),horizon);clear+=vec3(1.3,.70,.18)*glow*3.9;
    vec2 drift=vec2(d.x*5.+d.z*2.+time*.006,d.y*12.);
    float cloud=fbm(drift+vec2(1.,3.))+fbm(drift*2.2)*.13;
    float mass=smoothstep(.39,.69,cloud),rim=smoothstep(.39,.51,cloud)*(1.-smoothstep(.51,.67,cloud));
    vec3 cloudColor=mix(vec3(.018,.033,.038),vec3(.28,.16,.065),horizon*.56+glow*.44);
    vec3 sky=mix(clear,cloudColor,mass*.93);sky+=vec3(.43,.22,.047)*rim*(glow+.11)*horizon;
    sky=mix(sky,photo*.28,.035);
    gl_FragColor=vec4(sky,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`}),g=new _e(new Un(11e3,48,24),d);o.add(g);let E=await new tn().loadAsync("./assets/odyssey/waternormals.jpg");E.wrapS=E.wrapT=hn;let m=new mu(new Bi(900,900,220,220),{textureWidth:768,textureHeight:768,waterNormals:E,sunDirection:new R(-45,45,-160).normalize(),sunColor:16762229,waterColor:536107,distortionScale:4.8,fog:!1});m.rotation.x=-Math.PI/2,m.position.y=-.15,m.receiveShadow=!0,m.material.vertexShader=m.material.vertexShader.replace("void main() {","void main() {vec3 displaced=position;float waveDetail=1.-smoothstep(170.,700.,length(position.xy));displaced.z+=(.34*sin(position.x*.21+time*.75)+.18*sin(position.y*.33-time*.62)+.06*sin(position.x*.8+position.y*.6-time*1.1))*waveDetail;").replaceAll("vec4( position, 1.0 )","vec4( displaced, 1.0 )"),m.material.fragmentShader=m.material.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, alpha );","outgoingLight=mix(outgoingLight,waterColor*.42,.14+.22*smoothstep(-14.,25.,worldPosition.z));gl_FragColor=vec4(outgoingLight,alpha);"),m.material.fragmentShader=m.material.fragmentShader.replace("float rf0 = 0.3;","float rf0 = 0.045;").replace("vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight","vec3( 0.012 ) + reflectionSample * 0.64 + reflectionSample * specularLight").replace("sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );",`float rippleVariance=max(length(fwidth(surfaceNormal)),.0);
      float seaDistance=length(worldToEye);surfaceNormal=normalize(mix(surfaceNormal,vec3(0.,1.,0.),smoothstep(80.,850.,seaDistance)*.78));
      float seaShininess=mix(42.,12.,clamp(rippleVariance*2.,0.,1.));
      sunLight(surfaceNormal,eyeDirection,seaShininess,.58,.5,diffuseLight,specularLight);`),m.material.fragmentShader=m.material.fragmentShader.replace("uniform sampler2D normalSampler;",`uniform sampler2D normalSampler;
    uniform vec4 vesselWakes[4];uniform vec2 vesselHeading[4];
    float vesselWake(vec2 position){float result=0.;for(int i=0;i<4;i++){
      vec2 delta=position-vesselWakes[i].xy;vec2 heading=vesselHeading[i];
      float along=dot(delta,heading),across=abs(dot(delta,vec2(-heading.y,heading.x)));
      float stern=vesselWakes[i].z*.43,run=along-stern;
      float envelope=smoothstep(-1.3,1.7,run)*(1.-smoothstep(6.,24.,run));
      float edge=vesselWakes[i].w*.31+max(run,0.)*.20;
      float thickness=.18+max(run,0.)*.027;
      result+=exp(-pow((across-edge)/thickness,2.))*envelope*.035;
    }return result;}`).replace("gl_FragColor=vec4(outgoingLight,alpha);","outgoingLight+=vec3(.18,.22,.20)*vesselWake(worldPosition.xz);gl_FragColor=vec4(outgoingLight,alpha);"),o.add(m);let p=[],M=[],x=[],v=220,S=[450,550,850,1400,2500,6e3,1e4];for(let ie of S)for(let Ne=0;Ne<4;Ne++)for(let Fe=0;Fe<v;Fe++){let ft=-1+Fe/v*2,ct=[[1,ft],[-ft,1],[-1,-ft],[ft,-1]][Ne];p.push(ct[0]*ie,ct[1]*ie,0),x.push(ct[0]*ie/900,ct[1]*ie/900)}let A=v*4;for(let ie=0;ie<S.length-1;ie++)for(let Ne=0;Ne<A;Ne++){let Fe=ie*A+Ne,ft=ie*A+(Ne+1)%A,ct=Fe+A,Ye=ft+A;M.push(Fe,ct,ft,ft,ct,Ye)}let C=new gt;C.setAttribute("position",new Ke(p,3)),C.setAttribute("uv",new Ke(x,2)),C.setIndex(M),C.computeVertexNormals();let I=new _e(C,m.material);I.name="Continuous outer ocean to ten kilometres",I.rotation.x=-Math.PI/2,I.position.y=-.15,o.add(I);let w=m.onBeforeRender.bind(m);m.onBeforeRender=(...ie)=>{I.visible=!1,w(...ie),I.visible=!0};let _=yS(1829),b=new tn,P=await b.loadAsync("./assets/odyssey/rough_linen/rough_linen_diff_1k.jpg"),U=await b.loadAsync("./assets/odyssey/rough_linen/rough_linen_nor_gl_1k.jpg"),N=await b.loadAsync("./assets/odyssey/rough_linen/rough_linen_rough_1k.jpg");P.colorSpace=bt;for(let ie of[P,U,N])ie.wrapS=ie.wrapT=hn,ie.anisotropy=8;let H=await new Kn().loadAsync("./assets/odyssey/ulysses-rigged.glb"),V={value:0},Z=[],X=await b.loadAsync("./assets/odyssey/wood_planks/wood_planks_diff_1k.jpg"),z=await b.loadAsync("./assets/odyssey/wood_planks/wood_planks_nor_gl_1k.jpg"),Y=await b.loadAsync("./assets/odyssey/wood_planks/wood_planks_rough_1k.jpg");X.colorSpace=bt;for(let ie of[X,z,Y])ie.wrapS=ie.wrapT=hn,ie.anisotropy=8;let J=new Xe({map:X,normalMap:z,normalScale:new de(.88,.88),roughnessMap:Y,roughness:.9,color:12362110,envMapIntensity:.45}),ne=J.clone();ne.color.set(9204571);let ae=J.clone();for(let ie of["map","normalMap","roughnessMap"])ae[ie]=J[ie].clone(),ae[ie].repeat.set(.24,.4);let Ue=Array.from({length:9},(ie,Ne)=>{let Fe=J.clone();return Fe.color.multiplyScalar(.82+Ne%4*.055),Fe.side=Mt,Fe.onBeforeCompile=ft=>{ft.vertexShader=ft.vertexShader.replace("#include <common>",`#include <common>
varying float timberHeight;`).replace("#include <begin_vertex>",`#include <begin_vertex>
timberHeight=position.y;`),ft.fragmentShader=ft.fragmentShader.replace("#include <common>",`#include <common>
varying float timberHeight;`).replace("#include <map_fragment>",`#include <map_fragment>
diffuseColor.rgb*=mix(.48,1.,smoothstep(-.12,.68,timberHeight));`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=mix(.40,roughnessFactor,smoothstep(-.12,.68,timberHeight));`)},Fe.customProgramCacheKey=()=>"odyssey-aged-timber-v32-67",Fe}),xe=new Xe({color:10516535,metalness:.84,roughness:.39}),j=new Xe({color:11116157,roughness:.93}),re=new tn,Se=await re.loadAsync("./assets/odyssey/rock_boulder_cracked_diff_1k.jpg"),He=await re.loadAsync("./assets/odyssey/rock_boulder_cracked_nor_gl_1k.jpg"),Ie=await re.loadAsync("./assets/odyssey/rock_boulder_cracked_rough_1k.jpg");for(let ie of[Se,He,Ie])ie.wrapS=ie.wrapT=hn,ie.anisotropy=8;Se.colorSpace=bt;let nt=Mg(Se,He,Ie);function rt(ie,Ne,Fe,ft,ct){let Ye=new _e(ie,Ne);return Ye.name=ct,Ye.position.copy(ft instanceof R?ft:new R(...ft)),Ye.castShadow=!0,Ye.receiveShadow=!0,Fe.add(Ye),Ye}function W(ie,Ne,Fe,ft,ct,Ye="Rigging"){let T=Ne.clone().sub(ie),y=rt(new vn(Fe,Fe,T.length(),8),ft,ct,ie.clone().add(Ne).multiplyScalar(.5),Ye);return y.quaternion.setFromUnitVectors(new R(0,1,0),T.normalize()),y}let ve=(await new Kn().loadAsync("./assets/odyssey/coastal_cliff_02/coastal_cliff_02.web.gltf")).scene;ve.traverse(ie=>{if(ie instanceof _e){ie.castShadow=!0,ie.receiveShadow=!0;let Ne=ie.material;Ne.color.set(10855822),Ne.roughness=.92,Ne.normalScale.set(.62,.62)}});function fe(ie,Ne,Fe,ft,ct,Ye){let T=ve.clone(!0);T.name="Scanned sea-worn cliff and stratified ledges",T.position.set(ie,-1.6,Ne),T.scale.set(Fe,ft,ct),T.rotation.y=Ye,o.add(T)}fe(-100,-151,1.05,.75,1.25,.28),fe(69,-149,1.35,.64,1.45,-.55),fe(-120,-215,2.5,1.15,3.4,.45);for(let ie=0;ie<18;ie++){let Ne=Fr(1,ie*.37),Fe=rt(Ne,nt,o,[-84+ie*1.4,-.2,-44+Math.sin(ie*.32)*13],"Wet fractured littoral rock");Fe.scale.set(2+_()*3,2+_()*4,1.4+_()*3),Fe.rotation.set(_()*.6,_()*3,_()*.6)}await n();let ge=await b0(o,nt),pe=zd(o,m.material),Te=_g(o),be={continuousBody:!0,...ge.stats};fe(-85,-170,.63,.56,1.1,0),fe(-43,-178,.62,.62,1.2,.2);let Le=Eg(o),dt=Lg(o,nt,J,P,H.scene,ge);function lt(ie,Ne,Fe){let ft=[],ct=[],Ye=[];for(let F=0;F<=30;F++)for(let G=0;G<=30;G++){let O=G/30,Q=F/30,ee=Ne[0].clone().lerp(Ne[1],O),K=Ne[3].clone().lerp(Ne[2],O),se=ee.lerp(K,Q);if(se.z+=.92*Math.sin(Math.PI*O)*Math.sin(Math.PI*Q),se.y+=.18*Math.sin(Math.PI*O)*(1-Q),se.z+=.026*Math.sin(O*Math.PI*18)*Math.sin(Math.PI*Q)*Math.sin(Math.PI*O),ft.push(se.x,se.y,se.z),ct.push(O,Q),F<30&&G<30){let me=F*31+G,ue=me+1,Ee=me+30+1;Ye.push(me,ue,Ee,ue,Ee+1,Ee)}}let y=new gt;y.setAttribute("position",new Ke(ft,3)),y.setAttribute("uv",new Ke(ct,2)),y.setIndex(Ye),y.computeVertexNormals();let L=new Jt({map:P.clone(),normalMap:U.clone(),normalScale:new de(.8,.8),roughnessMap:N.clone(),roughness:.96,side:Mt,color:13878946,sheen:.16,sheenRoughness:.95,sheenColor:new Ve(12891278)});for(let F of[L.map,L.normalMap,L.roughnessMap])F.repeat.set(5,7.6);return L.onBeforeCompile=F=>{F.vertexShader=F.vertexShader.replace("#include <common>",`#include <common>
varying vec2 sailUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
sailUv=uv;`),F.fragmentShader=F.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 sailUv;`).replace("#include <roughnessmap_fragment>","float roughnessFactor=.86+.12*texture2D(roughnessMap,vRoughnessMapUv).g;").replace("#include <map_fragment>",`#include <map_fragment>
          float seamDistance=abs(fract(sailUv.x*7.+.5)-.5);
          float seam=1.-smoothstep(.009,.021,seamDistance);
          float hem=1.-smoothstep(.009,.020,min(min(sailUv.x,1.-sailUv.x),min(sailUv.y,1.-sailUv.y)));
          float stitch=seam*(.5+.5*step(.55,fract(sailUv.y*160.)));
          diffuseColor.rgb*=1.-seam*.26-hem*.32-stitch*.12; diffuseColor.rgb*=.94+.06*sin(sailUv.x*70.)*sin(sailUv.y*110.);`)},L.customProgramCacheKey=()=>"odyssey-taut-heavy-woven-sail-v32-72",{mesh:rt(y,L,ie,[0,0,0],"Wind-filled linen sail"),base:new Float32Array(ft),phase:Fe}}function k(ie,Ne,Fe,ft,ct=0){let Ye=new Dt;Ye.name=["Ulysses flagship","Ochre escort galley","Single-mast scout","Blue-sailed provision ship"][ct],Ye.userData.variant=ct,Ye.position.set(ie,.18,Ne),Ye.scale.setScalar(Fe),o.add(Ye);let T=19,y=5.5,L=64;for(let $=0;$<9;$++)for(let he of[-1,1]){let Re=[],Ae=[],We=[];for(let ut=0;ut<=L;ut++)for(let st=0;st<2;st++){let St=ut/L,Zt=($+st*.97)/9;Re.push((St-.5)*T,-.65+Zt*2.15+Math.pow(Math.abs(St-.5)*2,5)*1.23,he*(y/2)*Math.pow(Math.sin(St*Math.PI),.63)*(.2+.8*Math.sin(Zt*Math.PI*.5))),We.push(St*2.4+$*.137,($%8+st*.94)/8)}for(let ut=0;ut<L;ut++){let st=ut*2;Ae.push(st,st+1,st+2,st+1,st+3,st+2)}let tt=new gt;tt.setAttribute("position",new Ke(Re,3)),tt.setAttribute("uv",new Ke(We,2)),tt.setIndex(Ae),tt.computeVertexNormals(),rt(tt,Ue[$],Ye,[0,0,0],"Individually curved hull plank")}let B=new Dr;B.moveTo(-9.15,0);for(let $=0;$<=64;$++){let he=$/64;B.lineTo((he-.5)*18.3,y*.48*Math.sin(he*Math.PI)**.65)}for(let $=64;$>=0;$--){let he=$/64;B.lineTo((he-.5)*18.3,-y*.48*Math.sin(he*Math.PI)**.65)}B.closePath();let F=new as;F.moveTo(-4.25,-1.62),F.lineTo(-4.25,1.62),F.lineTo(4.4,1.62),F.lineTo(4.4,-1.62),F.closePath(),B.holes.push(F);let G=rt(new ls(B,{depth:.14,bevelEnabled:!0,bevelSize:.04,bevelThickness:.03,bevelSegments:2,steps:1}),ae,Ye,[0,1.5,0],"Solid timber deck with open hold");G.rotation.x=-Math.PI/2,rt(new xn(13.8,.14,3.72),ne,Ye,[0,.26,0],"Recessed structural bilge floor");for(let $ of[-1,1])rt(new xn(8.75,.23,.13),ne,Ye,[.075,1.58,$*1.69],"Thick open rowing-well coaming");for(let $ of[-4.31,4.46])rt(new xn(.13,.23,3.49),ne,Ye,[$,1.58,0],"Hold end coaming");for(let $=0;$<13;$++){let he=-6+$,Re=y*.44*Math.sin((he/18.3+.5)*Math.PI)**.65,Ae=[new R(he,1.45,-Re),new R(he,.72,-Re*.73),new R(he,.38,0),new R(he,.72,Re*.73),new R(he,1.45,Re)];rt(new _i(new Zn(Ae),16,.055,6,!1),ne,Ye,[0,0,0],"Interior bent timber frame")}for(let $ of[-.33,.33])W(new R(3.79,.34,$),new R(4.23,1.49,$),.046,J,Ye,"Hold ladder stringer");for(let $=0;$<5;$++)rt(new xn(.11,.066,.68),J,Ye,[3.84+$*.08,.47+$*.23,0],"Hold ladder step");for(let $ of[-6.35,6])rt(new xn(.14,1.12,3.5),ne,Ye,[$,.93,0],"Interior watertight bulkhead");for(let $ of[-1,1]){let he=Array.from({length:65},(Re,Ae)=>{let We=Ae/64;return new R((We-.5)*19,1.65+Math.abs(We-.5)**4*17,$*y*.5*Math.sin(We*Math.PI)**.63)});rt(new _i(new Zn(he),64,.072,8,!1),xe,Ye,[0,0,0],"Bronze hull rail")}for(let $=0;$<6;$++){let he=-3.65+$*1.36;rt(new xn(.28,.16,3.36),ne,Ye,[he,.75,0],"Recessed rowing bench")}for(let $ of[-7.25,6.72])rt(new xn(2.22,.17,2.1),ae,Ye,[$,1.82,0],"Raised bow and stern working deck");for(let $ of[-1,1])for(let he=0;he<4;he++)rt(new xn(8.48,.055,.1),J,Ye,[.08,1.67,$*(1.87+he*.14)],"Individual side-deck plank");let O=-.7;W(new R(O,.29,0),new R(O,15.25,0),.095,J,Ye,"Main timber mast"),W(new R(-4.8,14.7,0),new R(3.5,14.7,0),.071,J,Ye,"Square-sail main yard"),ct!==2&&(W(new R(3.8,.29,0),new R(3.8,9.5,0),.07,J,Ye,"After mast"),W(new R(1.8,9.5,.04),new R(5.8,9.5,.04),.048,J,Ye,"After square yard"));let Q=[lt(Ye,[new R(-3.7,5.2,0),new R(2.5,5.2,0),new R(3.2,14.7,0),new R(-4.5,14.7,0)],ft),lt(Ye,[new R(2.1,4.4,.1),new R(5.5,4.4,.1),new R(5.5,9.5,.1),new R(2.1,9.5,.1)],ft+1)];if(ct===2&&(Ye.remove(Q[1].mesh),Q[1].mesh.geometry.dispose(),Q[1].mesh.material.dispose(),Q.splice(1,1)),ct>0)for(let $ of Q){$.mesh.material=$.mesh.material.clone(),$.mesh.material.color.set([16777215,11968878,12893605,8426907][ct]);let he=$.mesh.geometry.attributes.position;for(let Re=0;Re<he.count;Re++){let Ae=he.getY(Re);he.setY(Re,5.2+(Ae-5.2)*[1,.91,.76,.84][ct])}he.needsUpdate=!0,$.mesh.geometry.computeVertexNormals(),$.base=new Float32Array(he.array)}for(let $ of[-1,1])for(let he of[-5.4,-2.1,1.8,5.6])W(new R(O,13.5,0),new R(he,1.65,$*2.1),.025,j,Ye,"Tensioned standing rigging");W(new R(-4.5,5.2,0),new R(-6,1.8,0),.016,j,Ye,"Sail foot sheet");let ee=new Xe({color:[9250844,10253376,6450770,4482930][ct],roughness:.87,side:Mt}),K=new _e(new Bi(2.2,.46,12,3),ee);if(K.position.set(.25,15.3,.11),Ye.add(K),Q.push({mesh:K,base:new Float32Array(K.geometry.attributes.position.array),phase:ft+2,freeEdge:!0}),ct===0){let $=Tu(H.scene);$.name="Anatomically rigged linen-clothed torch bearer",$.position.set(-7.17,1.94,.12),$.rotation.y=-.55,$.scale.setScalar(1.2),Ye.add($),Sg($,P,U,N,V);let he=new Ca($);for(let We of H.animations){let tt=We.clone();tt.tracks=tt.tracks.filter(ut=>/head|spine01|upperarm01.?R/.test(ut.name)&&ut.name.endsWith(".quaternion")),he.clipAction(tt).play()}let Re=$.getObjectByName("Living_torch_fire")||$.getObjectByName("Living torch fire")||$,Ae=new ps(16756307,18,6,2);o.add(Ae),Z.push({mixer:he,fire:Re,fireScale:Re.scale.clone(),lamp:Ae})}let se=new Zn([new R(-9.1,1.7,0),new R(-10.1,2.5,0),new R(-10,3.7,0)]);if(rt(new _i(se,20,.093,10,!1),xe,Ye,[0,0,0],"Curved carved figurehead"),ct>0){let $=[1,.91,.76,.84][ct];K.position.y=5.2+(K.position.y-5.2)*$,Ye.traverse(he=>{if(he instanceof _e&&/Main mast|Main square yard|After mast|After square yard|Tensioned standing rigging/.test(he.name)){let Re=he.geometry.clone(),Ae=Re.getAttribute("position");for(let We=0;We<Ae.count;We++){let tt=Ae.getY(We)+he.position.y;tt>5.2&&Ae.setY(We,5.2+(tt-5.2)*$-he.position.y)}Re.computeVertexNormals(),he.geometry=Re}})}let me=new Map;for(let $ of[...Ye.children])if($ instanceof _e&&!($ instanceof En)&&!Q.some(he=>he.mesh===$)&&!Array.isArray($.material)){let he=me.get($.material)??[];he.push($),me.set($.material,he)}for(let[$,he]of me){if(he.length<2)continue;let Re=he.map(We=>(We.updateMatrix(),(We.geometry.index?We.geometry.toNonIndexed():We.geometry.clone()).applyMatrix4(We.matrix))),Ae=Ti(Re);if(!Ae){Re.forEach(We=>We.dispose());continue}for(let We of he)Ye.remove(We);Re.forEach(We=>We.dispose()),rt(Ae,$,Ye,[0,0,0],"Batched solid hull and interior joinery")}let ue=Cg(Ye,J,P,H.scene,ft,ct);ct>0&&Ye.traverse($=>{if($ instanceof _e&&!($ instanceof En)&&$.name==="Batched solid hull and interior joinery"){let he=$.material;he instanceof Xe&&($.material=he.clone(),$.material.color.multiply(new Ve([16777215,14206104,10261121,11837565][ct])))}});let Ee=Ig(o,Ye,T,y),ze=Ye.position.clone();return{root:Ye,origin:ze,sails:Q,phase:ft,crew:ue,wake:Ee}}let D=[];for(let[ie,Ne]of[[-7,3,1.22,0],[42,-24,1.12,2.1],[-32,-10,1.08,3.2],[-10,-35,1.05,1.5]].entries())D.push(k(...Ne,ie)),await n();D[1].root.rotation.y=-.42,D[2].root.rotation.y=.28,m.material.uniforms.vesselWakes={value:D.map(ie=>ie.wake.footprint)},m.material.uniforms.vesselHeading={value:D.map(ie=>ie.wake.heading)};let te=new Zn([new R(27,15,60),new R(16,16,49),new R(0,14,43),new R(-8,15,59)],!0,"centripetal"),le=new Zn([new R(-105,16,-130),new R(-92,18,-121),new R(-79,17,-112),new R(-96,17,-122)],!0,"centripetal"),we=new sn(1,1,{type:qt,depthBuffer:!0,samples:4});we.depthTexture=new Pr(1,1);let ce=new _u(s,we);ce.renderTarget2.depthTexture=new Pr(1,1),ce.addPass(new Eu(o,a));let Qe=new bu(a);ce.addPass(Qe);let Be=new wo(new de(1,1),.16,.35,1.18);ce.addPass(Be),ce.addPass(new Mu),ce.addPass(new wu);let je=!1,Ze=!1,Ce=performance.now(),ye=0,$e=0,et=0,Oe=!1,Je=0;c.addEventListener("start",()=>{Oe=!0}),c.addEventListener("end",()=>{Oe=!1,Je=1/0});let q=0,De=new Bn,oe=new de;i.addEventListener("pointerdown",ie=>oe.set(ie.clientX,ie.clientY)),i.addEventListener("pointerup",ie=>{if(!e||oe.distanceTo(new de(ie.clientX,ie.clientY))>5)return;let Ne=i.getBoundingClientRect();De.setFromCamera(new de((ie.clientX-Ne.left)/Ne.width*2-1,1-(ie.clientY-Ne.top)/Ne.height*2),a),D.some((Fe,ft)=>De.ray.intersectsBox(Cs[ft]))&&(q=1,nn.interactions++)}),o.updateMatrixWorld(!0);let qe=A0(o),Pe=qe.filter(ie=>/^Closed continent /.test(ie.name)).map(ie=>({mesh:ie,geometry:ie.geometry,material:ie.material})),Me=new Map(qe.filter(ie=>/Uncut_anatomical_Human(body|ears|lips|fingernails|toenails)/.test(ie.name)).map(ie=>[ie.userData.native84Key,ie.geometry.clone()])),it=await R0(qe,o);await n();for(let ie of Pe)ie.mesh.geometry=ie.geometry,ie.mesh.material=ie.material;let xt=C0(o,nt,D.map(ie=>ie.root));await n();let Pt=await B0(o);await n(),Object.assign(pe,zd(o,m.material));let Lt=await P0(o,D.map(ie=>ie.root),Me);await n();let fn=await U0(o,D,a,l);await n();let Tn=await q0(o,D,fn.prepareMaterial);await n();let Cs=D.map(ie=>new ht().setFromObject(ie.root));Pt.giantCenter.copy(Tn.giantCenter),Object.assign(fn.info,{version:106,island:{...Pt,giant:void 0,newMeshes:void 0,giantCenter:Pt.giantCenter.toArray()}}),Object.assign(fn.info,{version:118,nativeWorld:Tn.info,forest:{source:"Actual native masked Poly Haven scan forest",planted:620,visibleTrees:543,nearLeafTriangles:88336,maxNearTrees:16,far:"actual native full-tree render crossed cards"},shoreRocks:10,shorePebbles:0,flightRetained:!1,sunDirectionRetained:!1});for(let ie of D)for(let Ne of ie.sails)Ne.base=new Float32Array(Ne.mesh.geometry.getAttribute("position").array);let nn={surfaceFinish:xt,materialFinish:Lt,visualFinish:fn.info,nativeRefinement:it,prepareMode:"explicit-click",exportNative:()=>{let ie=fn.exportMeshes.filter(Fe=>Fe.parent);ie.forEach((Fe,ft)=>Fe.userData.native84Key="native104_"+ft);let Ne=Od(o,a,[...qe,...ie]);return Ne.camera.target=c.target.toArray(),Ne},exportInstances:()=>{let ie=[];return o.updateMatrixWorld(!0),o.traverse(Ne=>{if(!(Ne instanceof ot)||!Ne.visible)return;let Fe=Ne,ft=!1;for(;Fe;)Fe.userData.variant!==void 0&&(ft=!0),Fe=Fe.parent;if(!ft&&!/^V104|Naturally exposed|V95 fractured/.test(Ne.name))return;let ct=Ne.clone();ct.matrixWorld.identity(),ct.userData.native84Key="instance104_"+ie.length;let Ye=Od(o,a,[ct]).meshes[0],T=new ke,y=[];for(let F=0;F<Ne.count;F++)Ne.getMatrixAt(F,T),y.push(Ne.matrixWorld.clone().multiply(T).elements.slice());let L=Array.isArray(Ne.material)?Ne.material[0]:Ne.material,B=F=>{let G=F?.image;return typeof G?.src=="string"?new URL(G.src,location.href).pathname.slice(1):null};ie.push({geometry:Ye,matrices:y,inVessel:ft,materialName:L.name,alphaMap:B(L.alphaMap),alphaTest:L.alphaTest})}),ie},inputControls:c.debug,ready:!1,prepareMilliseconds:0,time:0,renderFrames:0,heartbeats:0,active:!1,boats:D.length,interactive:!0,interactions:0,anatomicalHumans:Z.length,depthAwareVolumeFog:!0,objects:0,camera:[0,0,0],cameraMode:"cinematic-flight",flightDuration:40,coastalDepth:pe,fleetVariants:D.map(ie=>({name:ie.root.name,variant:ie.root.userData.variant,sails:ie.sails.filter(Ne=>!Ne.freeEdge).length,crew:ie.crew.people})),unmannedOars:0,mannedOars:D.reduce((ie,Ne)=>ie+Ne.crew.rowers.length,0),crew:D.reduce((ie,Ne)=>ie+Ne.crew.people,0),storyElements:dt.labels,giantPose:dt.giantPose,whiteWakeTubes:0,proceduralOpenSeaFoam:!1,filteredWaterHighlights:!0,flagshipLength:19*1.22,birds:Le.length,oceanRadius:1e4,openHolds:4,boatLengths:D.map(ie=>19*ie.root.scale.x),worldDepth:{continentalWidth:Te.continentalWidth,distances:Te.distances,rainDrops:Te.rainDrops,aerosols:Te.aerosols},giantSurface:"V118 recessed single eye, integrated lids/hair and continuous CC0 male anatomy",giantEye:be,anatomicalRowers:48,periodClothing:"linen tunics / wool mantles / leather belts and shoes / bronze fasteners",reefGeometry:"asymmetric stratified reef island and low broken littoral shelves",holdDepths:()=>D.map(ie=>{ie.root.updateMatrixWorld(!0);let Ne=ie.root.localToWorld(new R(1.07,3,.64)),Fe=ie.root.localToWorld(new R(1.07,0,.64)),ct=new Bn(Ne,Fe.sub(Ne).normalize()).intersectObject(ie.root,!0)[0];return ct?1.5-ie.root.worldToLocal(ct.point.clone()).y:0}),projectBoats:()=>D.map(ie=>{let Ne=ie.root.localToWorld(new R(-1,1.76,0)).project(a),Fe=i.getBoundingClientRect();return[Fe.left+(Ne.x+1)*Fe.width/2,Fe.top+(1-Ne.y)*Fe.height/2]}),projectBirds:()=>Le.map(ie=>{let Ne=ie.root.getWorldPosition(new R).project(a),Fe=i.getBoundingClientRect();return{pixel:[Fe.left+(Ne.x+1)*Fe.width/2,Fe.top+(1-Ne.y)*Fe.height/2],depth:Ne.z,position:ie.root.position.toArray(),wingAngles:ie.wings.map(ft=>ft.rotation.z)}}),review:ie=>{c.resetInteraction(),ye=ie,Je=0,a.position.copy(te.getPoint(ye%40/40)),c.target.copy(le.getPoint(ye%40/40)),Au(Le,ye),c.update()},reviewTreeBase:()=>{c.resetInteraction(),Je=1/0;let ie=Tn.treeBase;a.position.copy(ie).add(new R(4,2.2,8)),c.target.copy(ie).add(new R(0,1,0)),c.update()},reviewCaptain:()=>{c.resetInteraction(),Je=1/0;let ie=Tn.captainHead;a.position.copy(ie).add(new R(2.2,.5,2.2)),c.target.copy(ie),c.update()},reviewShore:()=>{c.resetInteraction(),Je=1/0,a.position.set(-190,12,-53),c.target.set(-157,12,-108),c.update()},reviewGiantHead:()=>{c.resetInteraction(),Je=1/0;let ie=Pt.giantCenter;a.position.set(ie.x+1,ie.y+6.4,ie.z+7),c.target.copy(ie).add(new R(0,6.4,0)),c.update()},reviewGiant:()=>{c.resetInteraction(),Je=1/0;let ie=Pt.giantCenter;a.position.set(ie.x+6,ie.y+3,ie.z+35),c.target.copy(ie).add(new R(0,2,0)),c.update()},performanceInfo:()=>({render:{...s.info.render},memory:{...s.info.memory},programs:s.info.programs?.length}),inspectVisual:()=>{let ie=[];return o.traverse(Ne=>{Ne instanceof _e&&ie.push({name:Ne.name,key:Ne.userData.native84Key,instanced:Ne instanceof ot?Ne.count:0,visible:Ne.visible,materials:(Array.isArray(Ne.material)?Ne.material:[Ne.material]).map(Fe=>({name:Fe.name,type:Fe.type,color:Fe.color?.getHexString(),map:Fe.map?.name}))})}),ie},capture:()=>(ce.render(),i.toDataURL("image/png"))};o.traverse(()=>nn.objects++),window.odysseyState=nn;function qi(){s.setSize(r.clientWidth,r.clientHeight,!1),ce.setSize(r.clientWidth,r.clientHeight),a.aspect=r.clientWidth/r.clientHeight,a.updateProjectionMatrix(),fn.resize()}new ResizeObserver(qi).observe(r),qi(),new IntersectionObserver(ie=>{je=ie[0].isIntersecting}).observe(r);let Yi=r.querySelector("[data-odyssey-pause]");Yi.addEventListener("click",()=>{Ze=!Ze,Yi.setAttribute("aria-pressed",String(Ze)),Yi.setAttribute("aria-label",Ze?"\u7EE7\u7EED\u573A\u666F":"\u6682\u505C\u573A\u666F"),Yi.innerHTML=Ze?'<i data-lucide="play"></i>':'<i data-lucide="pause"></i>',window.lucide?.createIcons()}),r.querySelector("[data-odyssey-reset]").addEventListener("click",()=>{c.resetInteraction(),ye=0,Je=0,a.position.copy(te.getPoint(0)),c.target.copy(le.getPoint(0)),c.update()});let Zi=r.closest("section"),ji=()=>{let ie=document.getElementById("entryGate");return!!ie&&(!document.body.classList.contains("experience-entered")||!!window.gsap?.isTweening(ie))};window.addEventListener("scroll",()=>{if(Zi.getAttribute("role")==="dialog"){$e=0;return}let ie=Zi.getBoundingClientRect();$e=_t.clamp(-ie.top/Math.max(1,Zi.offsetHeight-innerHeight),0,1)},{passive:!0});function Xr(ie){requestAnimationFrame(Xr);let Ne=Math.min(.5,(ie-Ce)/1e3);if(Ce=ie,nn.heartbeats++,!je){let Fe=r.getBoundingClientRect();je=Fe.bottom>0&&Fe.top<innerHeight}if(Zi.hidden&&(je=!1),nn.active=je,!(!je||document.hidden||ji())){Ze||(ye+=Ne),m.material.uniforms.time.value=ye,d.uniforms.time.value=ye,Qe.uniforms.time.value=ye,Te.update(ye),V.value=ye,q=Math.max(0,q-(Ze?0:Ne)*.6);for(let Fe of D){Fe.root.position.x=Fe.origin.x+.19*Math.sin(ye*.14+Fe.phase);let ft=Fe.root.position.x,ct=Fe.root.position.z,Ye=ft*.21+ye*.75,T=-ct*.33-ye*.62,y=ft*.8-ct*.6-ye*1.1;Fe.root.position.y=Fe.origin.y+.34*Math.sin(Ye)+.18*Math.sin(T)+.06*Math.sin(y),Fe.root.rotation.z=Math.atan(.34*.21*Math.cos(Ye)+.06*.8*Math.cos(y))*.75,Fe.root.rotation.x=Math.atan(.18*.33*Math.cos(T)+.06*.6*Math.cos(y))*.6,pd(Fe.crew,ye),Pg(Fe.wake,Fe.root,ye);for(let L of Fe.sails){let B=L.mesh.geometry.attributes.position;for(let F=0;F<B.count;F++){let G=L.base[F*3+1],O=L.base[F*3],Q=L.mesh.geometry.attributes.uv,ee=L.freeEdge?(O+1.1)/2.2:Math.sin(Math.PI*Q.getX(F))*Math.sin(Math.PI*Q.getY(F));B.setZ(F,L.base[F*3+2]+(.14+q*.16)*Math.sin(G*.77+O*.43-ye*1.3+L.phase)*ee+L.base[F*3+2]*.035*Math.sin(ye*.83+L.phase)*ee)}B.needsUpdate=!0,nn.renderFrames%3===0&&L.mesh.geometry.computeVertexNormals()}}for(let Fe of Z)Fe.mixer.setTime(ye),Fe.fire.scale.set(Fe.fireScale.x*(1+.12*Math.sin(ye*17)),Fe.fireScale.y*(1+.24*Math.sin(ye*11.7)),Fe.fireScale.z*(1+.1*Math.cos(ye*13))),Fe.fire.getWorldPosition(Fe.lamp.position),Fe.lamp.intensity=18+5*Math.sin(ye*11.7)+q*40;if(Tn.update(ye,a),Au(Le,ye),dt.update(ye),ge.update(ye),et=_t.lerp(et,$e,1-Math.exp(-Ne*2)),!Ze&&!Oe&&ye>=Je){let Fe=ye%40/40,ft=te.getPoint(Fe),ct=le.getPoint(Fe);ft.y+=et*4,ct.y+=et*1.5;let Ye=1-Math.exp(-Ne*.75);a.position.lerp(ft,Ye),c.target.lerp(ct,Ye),nn.cameraMode="cinematic-flight"}else(Oe||ye<Je)&&(nn.cameraMode="manual-orbit");c.update(),fn.update(ye),ce.render(),nn.time=ye,nn.renderFrames++,nn.camera=a.position.toArray(),r.classList.add("is-ready")}}s.setSize(16,16,!1),ce.setSize(16,16),fn.update(0),await s.compileAsync(o,a),await n();let Ki=new Set;o.traverseVisible(ie=>{if(ie instanceof _e)for(let Ne of Array.isArray(ie.material)?ie.material:[ie.material])for(let Fe of Object.values(Ne))Fe instanceof en&&Ki.add(Fe)});let Is=0;for(let ie of Ki)s.initTexture(ie),++Is%3===0&&await n();ce.render(),await n(),qi(),ce.render(),nn.prepareMilliseconds=performance.now()-t,nn.ready=!0,e=!0,i.style.opacity="",r.classList.add("is-ready"),Ce=performance.now(),requestAnimationFrame(Xr)}function yS(r){return()=>(r=Math.imul(r,1664525)+1013904223|0,(r>>>0)/4294967296)}
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

three/examples/jsm/libs/fflate.module.js:
  (*!
  fflate - fast JavaScript compression/decompression
  <https://101arrowz.github.io/fflate>
  Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
  version 0.8.2
  *)
*/
//# sourceMappingURL=odyssey-scene.js.map
