var jd=Object.create;var Pa=Object.defineProperty;var Qd=Object.getOwnPropertyDescriptor;var ef=Object.getOwnPropertyNames;var tf=Object.getPrototypeOf,nf=Object.prototype.hasOwnProperty;var sf=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),Ph=(r,e)=>{for(var t in e)Pa(r,t,{get:e[t],enumerable:!0})},rf=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ef(e))!nf.call(r,i)&&i!==t&&Pa(r,i,{get:()=>e[i],enumerable:!(n=Qd(e,i))||n.enumerable});return r};var of=(r,e,t)=>(t=r!=null?jd(tf(r)):{},rf(e||!r||!r.__esModule?Pa(t,"default",{value:r,enumerable:!0}):t,r));var Nd=sf((EA,yh)=>{"use strict";var U={};U.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};U.localCName=U.generateIdentifier();U.splitLines=function(r){return r.trim().split(`
`).map(e=>e.trim())};U.splitSections=function(r){return r.split(`
m=`).map((t,n)=>(n>0?"m="+t:t).trim()+`\r
`)};U.getDescription=function(r){let e=U.splitSections(r);return e&&e[0]};U.getMediaSections=function(r){let e=U.splitSections(r);return e.shift(),e};U.matchPrefix=function(r,e){return U.splitLines(r).filter(t=>t.indexOf(e)===0)};U.parseCandidate=function(r){let e;r.indexOf("a=candidate:")===0?e=r.substring(12).split(" "):e=r.substring(10).split(" ");let t={foundation:e[0],component:{1:"rtp",2:"rtcp"}[e[1]]||e[1],protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]};for(let n=8;n<e.length;n+=2)switch(e[n]){case"raddr":t.relatedAddress=e[n+1];break;case"rport":t.relatedPort=parseInt(e[n+1],10);break;case"tcptype":t.tcpType=e[n+1];break;case"ufrag":t.ufrag=e[n+1],t.usernameFragment=e[n+1];break;default:t[e[n]]===void 0&&(t[e[n]]=e[n+1]);break}return t};U.writeCandidate=function(r){let e=[];e.push(r.foundation);let t=r.component;t==="rtp"?e.push(1):t==="rtcp"?e.push(2):e.push(t),e.push(r.protocol.toUpperCase()),e.push(r.priority),e.push(r.address||r.ip),e.push(r.port);let n=r.type;return e.push("typ"),e.push(n),n!=="host"&&r.relatedAddress&&r.relatedPort!==void 0&&(e.push("raddr"),e.push(r.relatedAddress),e.push("rport"),e.push(r.relatedPort)),r.tcpType&&r.protocol.toLowerCase()==="tcp"&&(e.push("tcptype"),e.push(r.tcpType)),(r.usernameFragment||r.ufrag)&&(e.push("ufrag"),e.push(r.usernameFragment||r.ufrag)),"candidate:"+e.join(" ")};U.parseIceOptions=function(r){return r.substring(14).split(" ")};U.parseRtpMap=function(r){let e=r.substring(9).split(" "),t={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),t.name=e[0],t.clockRate=parseInt(e[1],10),t.channels=e.length===3?parseInt(e[2],10):1,t.numChannels=t.channels,t};U.writeRtpMap=function(r){let e=r.payloadType;r.preferredPayloadType!==void 0&&(e=r.preferredPayloadType);let t=r.channels||r.numChannels||1;return"a=rtpmap:"+e+" "+r.name+"/"+r.clockRate+(t!==1?"/"+t:"")+`\r
`};U.parseExtmap=function(r){let e=r.substring(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1],attributes:e.slice(2).join(" ")}};U.writeExtmap=function(r){return"a=extmap:"+(r.id||r.preferredId)+(r.direction&&r.direction!=="sendrecv"?"/"+r.direction:"")+" "+r.uri+(r.attributes?" "+r.attributes:"")+`\r
`};U.parseFmtp=function(r){let e={},t,n=r.substring(r.indexOf(" ")+1).split(";");for(let i=0;i<n.length;i++)t=n[i].trim().split("="),e[t[0].trim()]=t[1];return e};U.writeFmtp=function(r){let e="",t=r.payloadType;if(r.preferredPayloadType!==void 0&&(t=r.preferredPayloadType),r.parameters&&Object.keys(r.parameters).length){let n=[];Object.keys(r.parameters).forEach(i=>{r.parameters[i]!==void 0?n.push(i+"="+r.parameters[i]):n.push(i)}),e+="a=fmtp:"+t+" "+n.join(";")+`\r
`}return e};U.parseRtcpFb=function(r){let e=r.substring(r.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")}};U.writeRtcpFb=function(r){let e="",t=r.payloadType;return r.preferredPayloadType!==void 0&&(t=r.preferredPayloadType),r.rtcpFeedback&&r.rtcpFeedback.length&&r.rtcpFeedback.forEach(n=>{e+="a=rtcp-fb:"+t+" "+n.type+(n.parameter&&n.parameter.length?" "+n.parameter:"")+`\r
`}),e};U.parseSsrcMedia=function(r){let e=r.indexOf(" "),t={ssrc:parseInt(r.substring(7,e),10)},n=r.indexOf(":",e);return n>-1?(t.attribute=r.substring(e+1,n),t.value=r.substring(n+1)):t.attribute=r.substring(e+1),t};U.parseSsrcGroup=function(r){let e=r.substring(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(t=>parseInt(t,10))}};U.getMid=function(r){let e=U.matchPrefix(r,"a=mid:")[0];if(e)return e.substring(6)};U.parseFingerprint=function(r){let e=r.substring(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1].toUpperCase()}};U.getDtlsParameters=function(r,e){return{role:"auto",fingerprints:U.matchPrefix(r+e,"a=fingerprint:").map(U.parseFingerprint)}};U.writeDtlsParameters=function(r,e){let t="a=setup:"+e+`\r
`;return r.fingerprints.forEach(n=>{t+="a=fingerprint:"+n.algorithm+" "+n.value+`\r
`}),t};U.parseCryptoLine=function(r){let e=r.substring(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)}};U.writeCryptoLine=function(r){return"a=crypto:"+r.tag+" "+r.cryptoSuite+" "+(typeof r.keyParams=="object"?U.writeCryptoKeyParams(r.keyParams):r.keyParams)+(r.sessionParams?" "+r.sessionParams.join(" "):"")+`\r
`};U.parseCryptoKeyParams=function(r){if(r.indexOf("inline:")!==0)return null;let e=r.substring(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0}};U.writeCryptoKeyParams=function(r){return r.keyMethod+":"+r.keySalt+(r.lifeTime?"|"+r.lifeTime:"")+(r.mkiValue&&r.mkiLength?"|"+r.mkiValue+":"+r.mkiLength:"")};U.getCryptoParameters=function(r,e){return U.matchPrefix(r+e,"a=crypto:").map(U.parseCryptoLine)};U.getIceParameters=function(r,e){let t=U.matchPrefix(r+e,"a=ice-ufrag:")[0],n=U.matchPrefix(r+e,"a=ice-pwd:")[0];return t&&n?{usernameFragment:t.substring(12),password:n.substring(10)}:null};U.writeIceParameters=function(r){let e="a=ice-ufrag:"+r.usernameFragment+`\r
a=ice-pwd:`+r.password+`\r
`;return r.iceLite&&(e+=`a=ice-lite\r
`),e};U.parseRtpParameters=function(r){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=U.splitLines(r)[0].split(" ");e.profile=n[2];for(let s=3;s<n.length;s++){let o=n[s],a=U.matchPrefix(r,"a=rtpmap:"+o+" ")[0];if(a){let l=U.parseRtpMap(a),c=U.matchPrefix(r,"a=fmtp:"+o+" ");switch(l.parameters=c.length?U.parseFmtp(c[0]):{},l.rtcpFeedback=U.matchPrefix(r,"a=rtcp-fb:"+o+" ").map(U.parseRtcpFb),e.codecs.push(l),l.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(l.name.toUpperCase());break;default:break}}}U.matchPrefix(r,"a=extmap:").forEach(s=>{e.headerExtensions.push(U.parseExtmap(s))});let i=U.matchPrefix(r,"a=rtcp-fb:* ").map(U.parseRtcpFb);return e.codecs.forEach(s=>{i.forEach(o=>{s.rtcpFeedback.find(l=>l.type===o.type&&l.parameter===o.parameter)||s.rtcpFeedback.push(o)})}),e};U.writeRtpDescription=function(r,e){let t="";t+="m="+r+" ",t+=e.codecs.length>0?"9":"0",t+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",t+=e.codecs.map(i=>i.preferredPayloadType!==void 0?i.preferredPayloadType:i.payloadType).join(" ")+`\r
`,t+=`c=IN IP4 0.0.0.0\r
`,t+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(i=>{t+=U.writeRtpMap(i),t+=U.writeFmtp(i),t+=U.writeRtcpFb(i)});let n=0;return e.codecs.forEach(i=>{i.maxptime>n&&(n=i.maxptime)}),n>0&&(t+="a=maxptime:"+n+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(i=>{t+=U.writeExtmap(i)}),t};U.parseRtpEncodingParameters=function(r){let e=[],t=U.parseRtpParameters(r),n=t.fecMechanisms.indexOf("RED")!==-1,i=t.fecMechanisms.indexOf("ULPFEC")!==-1,s=U.matchPrefix(r,"a=ssrc:").map(h=>U.parseSsrcMedia(h)).filter(h=>h.attribute==="cname"),o=s.length>0&&s[0].ssrc,a,l=U.matchPrefix(r,"a=ssrc-group:FID").map(h=>h.substring(17).split(" ").map(d=>parseInt(d,10)));l.length>0&&l[0].length>1&&l[0][0]===o&&(a=l[0][1]),t.codecs.forEach(h=>{if(h.name.toUpperCase()==="RTX"&&h.parameters.apt){let u={ssrc:o,codecPayloadType:parseInt(h.parameters.apt,10)};o&&a&&(u.rtx={ssrc:a}),e.push(u),n&&(u=JSON.parse(JSON.stringify(u)),u.fec={ssrc:o,mechanism:i?"red+ulpfec":"red"},e.push(u))}}),e.length===0&&o&&e.push({ssrc:o});let c=U.matchPrefix(r,"b=");return c.length&&(c[0].indexOf("b=TIAS:")===0?c=parseInt(c[0].substring(7),10):c[0].indexOf("b=AS:")===0?c=parseInt(c[0].substring(5),10)*1e3*.95-2e3*8:c=void 0,e.forEach(h=>{h.maxBitrate=c})),e};U.parseRtcpParameters=function(r){let e={},t=U.matchPrefix(r,"a=ssrc:").map(s=>U.parseSsrcMedia(s)).filter(s=>s.attribute==="cname")[0];t&&(e.cname=t.value,e.ssrc=t.ssrc);let n=U.matchPrefix(r,"a=rtcp-rsize");e.reducedSize=n.length>0,e.compound=n.length===0;let i=U.matchPrefix(r,"a=rtcp-mux");return e.mux=i.length>0,e};U.writeRtcpParameters=function(r){let e="";return r.reducedSize&&(e+=`a=rtcp-rsize\r
`),r.mux&&(e+=`a=rtcp-mux\r
`),r.ssrc!==void 0&&r.cname&&(e+="a=ssrc:"+r.ssrc+" cname:"+r.cname+`\r
`),e};U.parseMsid=function(r){let e,t=U.matchPrefix(r,"a=msid:");if(t.length===1)return e=t[0].substring(7).split(" "),{stream:e[0],track:e[1]};let n=U.matchPrefix(r,"a=ssrc:").map(i=>U.parseSsrcMedia(i)).filter(i=>i.attribute==="msid");if(n.length>0)return e=n[0].value.split(" "),{stream:e[0],track:e[1]}};U.parseSctpDescription=function(r){let e=U.parseMLine(r),t=U.matchPrefix(r,"a=max-message-size:"),n;t.length>0&&(n=parseInt(t[0].substring(19),10)),isNaN(n)&&(n=65536);let i=U.matchPrefix(r,"a=sctp-port:");if(i.length>0)return{port:parseInt(i[0].substring(12),10),protocol:e.fmt,maxMessageSize:n};let s=U.matchPrefix(r,"a=sctpmap:");if(s.length>0){let o=s[0].substring(10).split(" ");return{port:parseInt(o[0],10),protocol:o[1],maxMessageSize:n}}};U.writeSctpDescription=function(r,e){let t=[];return r.protocol!=="DTLS/SCTP"?t=["m="+r.kind+" 9 "+r.protocol+" "+e.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+e.port+`\r
`]:t=["m="+r.kind+" 9 "+r.protocol+" "+e.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+e.port+" "+e.protocol+` 65535\r
`],e.maxMessageSize!==void 0&&t.push("a=max-message-size:"+e.maxMessageSize+`\r
`),t.join("")};U.generateSessionId=function(){return Math.random().toString().substr(2,22)};U.writeSessionBoilerplate=function(r,e,t){let n,i=e!==void 0?e:2;return r?n=r:n=U.generateSessionId(),`v=0\r
o=`+(t||"thisisadapterortc")+" "+n+" "+i+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`};U.getDirection=function(r,e){let t=U.splitLines(r);for(let n=0;n<t.length;n++)switch(t[n]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[n].substring(2);default:}return e?U.getDirection(e):"sendrecv"};U.getKind=function(r){return U.splitLines(r)[0].split(" ")[0].substring(2)};U.isRejected=function(r){return r.split(" ",2)[1]==="0"};U.parseMLine=function(r){let t=U.splitLines(r)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};U.parseOLine=function(r){let t=U.matchPrefix(r,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};U.isValidSDP=function(r){if(typeof r!="string"||r.length===0)return!1;let e=U.splitLines(r);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof yh=="object"&&(yh.exports=U)});var on=0,fr=1,Wi=2;var il=1;var sl=100;var rl=204,ol=205;var Ml=0,wl=1,Tl=2,Pi=3,El=4,Cl=5,Al=6,Rl=7,cu=0;var Il=300;var al=1e3,Ai=1001,ll=1002,cl=1003;var hu=1006;var uu=1008;var du=1009;var fu=1014,Li=1015;var Xs=1023;var pu=1028,mu=1029;var Di=2300,qs=2301,Ws=2302,hl=2400,ul=2401,dl=2402;var Pl="",Je="srgb",fl="srgb-linear",pl="linear",Gs="srgb";var sn=7680;var ml=519;var gl=35044;var vt=2e3,Ys=2001;var an=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}},Ae=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Lh=1234567,Ri=Math.PI/180,Fi=180/Math.PI;function Yn(){let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ae[r&255]+Ae[r>>8&255]+Ae[r>>16&255]+Ae[r>>24&255]+"-"+Ae[e&255]+Ae[e>>8&255]+"-"+Ae[e>>16&15|64]+Ae[e>>24&255]+"-"+Ae[t&63|128]+Ae[t>>8&255]+"-"+Ae[t>>16&255]+Ae[t>>24&255]+Ae[n&255]+Ae[n>>8&255]+Ae[n>>16&255]+Ae[n>>24&255]).toLowerCase()}function G(r,e,t){return Math.max(e,Math.min(t,r))}function Ll(r,e){return(r%e+e)%e}function af(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function lf(r,e,t){return r!==e?(t-r)/(e-r):0}function Ii(r,e,t){return(1-t)*r+t*e}function cf(r,e,t,n){return Ii(r,e,1-Math.exp(-t*n))}function hf(r,e=1){return e-Math.abs(Ll(r,e*2)-e)}function uf(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function df(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function ff(r,e){return r+Math.floor(Math.random()*(e-r+1))}function pf(r,e){return r+Math.random()*(e-r)}function mf(r){return r*(.5-Math.random())}function gf(r){r!==void 0&&(Lh=r);let e=Lh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function yf(r){return r*Ri}function xf(r){return r*Fi}function vf(r){return(r&r-1)===0&&r!==0}function _f(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Sf(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function bf(r,e,t,n,i){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),d=o((e-n)/2),f=s((n-e)/2),p=o((n-e)/2);switch(i){case"XYX":r.set(a*h,l*u,l*d,a*c);break;case"YZY":r.set(l*d,a*h,l*u,a*c);break;case"ZXZ":r.set(l*u,l*d,a*h,a*c);break;case"XZX":r.set(a*h,l*p,l*f,a*c);break;case"YXY":r.set(l*f,a*h,l*p,a*c);break;case"ZYZ":r.set(l*p,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Bn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Fe(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}var Mt={DEG2RAD:Ri,RAD2DEG:Fi,generateUUID:Yn,clamp:G,euclideanModulo:Ll,mapLinear:af,inverseLerp:lf,lerp:Ii,damp:cf,pingpong:hf,smoothstep:uf,smootherstep:df,randInt:ff,randFloat:pf,randFloatSpread:mf,seededRandom:gf,degToRad:yf,radToDeg:xf,isPowerOfTwo:vf,ceilPowerOfTwo:_f,floorPowerOfTwo:Sf,setQuaternionFromProperEuler:bf,normalize:Fe,denormalize:Bn},ee=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(G(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},St=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=s[o+0],f=s[o+1],p=s[o+2],g=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=g;return}if(u!==g||l!==d||c!==f||h!==p){let y=1-a,v=l*d+c*f+h*p+u*g,_=v>=0?1:-1,S=1-v*v;if(S>Number.EPSILON){let m=Math.sqrt(S),b=Math.atan2(m,v*_);y=Math.sin(y*b)/m,a=Math.sin(a*b)/m}let x=a*_;if(l=l*y+d*x,c=c*y+f*x,h=h*y+p*x,u=u*y+g*x,y===1-a){let m=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=m,c*=m,h*=m,u*=m}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[o],d=s[o+1],f=s[o+2],p=s[o+3];return e[t]=a*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-a*f,e[t+2]=c*p+h*f+a*d-l*u,e[t+3]=h*p-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(s/2),d=l(n/2),f=l(i/2),p=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(s-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(G(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-s*l,this._y=i*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,s=this._z,o=this._w,a=o*e._w+n*e._x+i*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},M=class r{constructor(e=0,t=0,n=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-s*i),u=2*(s*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=i+l*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this.z=G(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this.z=G(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return La.copy(this).projectOnVector(e),this.sub(La)}reflect(e){return this.sub(La.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(G(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},La=new M,Dh=new St,X=class r{constructor(e,t,n,i,s,o,a,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,l,c)}set(e,t,n,i,s,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],g=i[0],y=i[3],v=i[6],_=i[1],S=i[4],x=i[7],m=i[2],b=i[5],w=i[8];return s[0]=o*g+a*_+l*m,s[3]=o*y+a*S+l*b,s[6]=o*v+a*x+l*w,s[1]=c*g+h*_+u*m,s[4]=c*y+h*S+u*b,s[7]=c*v+h*x+u*w,s[2]=d*g+f*_+p*m,s[5]=d*y+f*S+p*b,s[8]=d*v+f*x+p*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*s*h+n*a*l+i*s*c-i*o*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*s,f=c*s-o*l,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/p;return e[0]=u*g,e[1]=(i*c-h*n)*g,e[2]=(a*n-i*o)*g,e[3]=d*g,e[4]=(h*t-i*l)*g,e[5]=(i*s-a*t)*g,e[6]=f*g,e[7]=(n*l-c*t)*g,e[8]=(o*t-n*s)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Da.makeScale(e,t)),this}rotate(e){return this.premultiply(Da.makeRotation(-e)),this}translate(e,t){return this.premultiply(Da.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Da=new X;function gu(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function yl(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}var Fh={};function xl(r){r in Fh||(Fh[r]=!0,console.warn(r))}var Nh=new X().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Uh=new X().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mf(){let r={enabled:!0,workingColorSpace:fl,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Gs&&(i.r=_t(i.r),i.g=_t(i.g),i.b=_t(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Gs&&(i.r=kn(i.r),i.g=kn(i.g),i.b=kn(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Pl?pl:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return xl("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return xl("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[fl]:{primaries:e,whitePoint:n,transfer:pl,toXYZ:Nh,fromXYZ:Uh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Je},outputColorSpaceConfig:{drawingBufferColorSpace:Je}},[Je]:{primaries:e,whitePoint:n,transfer:Gs,toXYZ:Nh,fromXYZ:Uh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Je}}}),r}var Xe=Mf();function _t(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function kn(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var Tn,$s=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Tn===void 0&&(Tn=yl("canvas")),Tn.width=e.width,Tn.height=e.height;let i=Tn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Tn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=yl("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=_t(s[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(_t(t[n]/255)*255):t[n]=_t(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},wf=0,Ks=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=Yn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(Fa(i[o].image)):s.push(Fa(i[o]))}else s=Fa(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function Fa(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?$s.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Tf=0,Na=new M,ln=class r extends an{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=Ai,i=Ai,s=hu,o=uu,a=Xs,l=du,c=r.DEFAULT_ANISOTROPY,h=Pl){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=Yn(),this.name="",this.source=new Ks(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ee(0,0),this.repeat=new ee(1,1),this.center=new ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new X,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Na).x}get height(){return this.source.getSize(Na).y}get depth(){return this.source.getSize(Na).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Il)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case al:e.x=e.x-Math.floor(e.x);break;case Ai:e.x=e.x<0?0:1;break;case ll:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case al:e.y=e.y-Math.floor(e.y);break;case Ai:e.y=e.y<0?0:1;break;case ll:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Il;ln.DEFAULT_ANISOTROPY=1;var Vn=class r{constructor(e=0,t=0,n=0,i=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],g=l[2],y=l[6],v=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-g)<.01&&Math.abs(p-y)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+g)<.1&&Math.abs(p+y)<.1&&Math.abs(c+f+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(c+1)/2,x=(f+1)/2,m=(v+1)/2,b=(h+d)/4,w=(u+g)/4,E=(p+y)/4;return S>x&&S>m?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=b/n,s=w/n):x>m?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=b/i,s=E/i):m<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(m),n=w/s,i=E/s),this.set(n,i,s,t),this}let _=Math.sqrt((y-p)*(y-p)+(u-g)*(u-g)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(y-p)/_,this.y=(u-g)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+v-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this.z=G(this.z,e.z,t.z),this.w=G(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this.z=G(this.z,e,t),this.w=G(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};var Q=class{constructor(e=new M(1/0,1/0,1/0),t=new M(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=tt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,tt):tt.fromBufferAttribute(s,o),tt.applyMatrix4(e.matrixWorld),this.expandByPoint(tt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ys.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ys.copy(n.boundingBox)),ys.applyMatrix4(e.matrixWorld),this.union(ys)}let i=e.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tt),tt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_i),xs.subVectors(this.max,_i),En.subVectors(e.a,_i),Cn.subVectors(e.b,_i),An.subVectors(e.c,_i),Rt.subVectors(Cn,En),It.subVectors(An,Cn),Zt.subVectors(En,An);let t=[0,-Rt.z,Rt.y,0,-It.z,It.y,0,-Zt.z,Zt.y,Rt.z,0,-Rt.x,It.z,0,-It.x,Zt.z,0,-Zt.x,-Rt.y,Rt.x,0,-It.y,It.x,0,-Zt.y,Zt.x,0];return!Ua(t,En,Cn,An,xs)||(t=[1,0,0,0,1,0,0,0,1],!Ua(t,En,Cn,An,xs))?!1:(vs.crossVectors(Rt,It),t=[vs.x,vs.y,vs.z],Ua(t,En,Cn,An,xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},pt=[new M,new M,new M,new M,new M,new M,new M,new M],tt=new M,ys=new Q,En=new M,Cn=new M,An=new M,Rt=new M,It=new M,Zt=new M,_i=new M,xs=new M,vs=new M,jt=new M;function Ua(r,e,t,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){jt.fromArray(r,s);let a=i.x*Math.abs(jt.x)+i.y*Math.abs(jt.y)+i.z*Math.abs(jt.z),l=e.dot(jt),c=t.dot(jt),h=n.dot(jt);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Ef=new Q,Si=new M,Oa=new M,Le=class{constructor(e=new M,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Ef.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Si.subVectors(e,this.center);let t=Si.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Si,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Oa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Si.copy(e.center).add(Oa)),this.expandByPoint(Si.copy(e.center).sub(Oa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},mt=new M,Ba=new M,_s=new M,Pt=new M,ka=new M,Ss=new M,Va=new M,bt=class{constructor(e=new M,t=new M(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=mt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mt.copy(this.origin).addScaledVector(this.direction,t),mt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Ba.copy(e).add(t).multiplyScalar(.5),_s.copy(t).sub(e).normalize(),Pt.copy(this.origin).sub(Ba);let s=e.distanceTo(t)*.5,o=-this.direction.dot(_s),a=Pt.dot(this.direction),l=-Pt.dot(_s),c=Pt.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=s*h,u>=0)if(d>=-p)if(d<=p){let g=1/h;u*=g,d*=g,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Ba).addScaledVector(_s,d),f}intersectSphere(e,t){mt.subVectors(e.center,this.origin);let n=mt.dot(this.direction),i=mt.dot(mt)-n*n,s=e.radius*e.radius;if(i>s)return null;let o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,mt)!==null}intersectTriangle(e,t,n,i,s){ka.subVectors(t,e),Ss.subVectors(n,e),Va.crossVectors(ka,Ss);let o=this.direction.dot(Va),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Pt.subVectors(this.origin,e);let l=a*this.direction.dot(Ss.crossVectors(Pt,Ss));if(l<0)return null;let c=a*this.direction.dot(ka.cross(Pt));if(c<0||l+c>o)return null;let h=-a*Pt.dot(Va);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},q=class r{constructor(e,t,n,i,s,o,a,l,c,h,u,d,f,p,g,y){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,l,c,h,u,d,f,p,g,y)}set(e,t,n,i,s,o,a,l,c,h,u,d,f,p,g,y){let v=this.elements;return v[0]=e,v[4]=t,v[8]=n,v[12]=i,v[1]=s,v[5]=o,v[9]=a,v[13]=l,v[2]=c,v[6]=h,v[10]=u,v[14]=d,v[3]=f,v[7]=p,v[11]=g,v[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Rn.setFromMatrixColumn(e,0).length(),s=1/Rn.setFromMatrixColumn(e,1).length(),o=1/Rn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=o*h,f=o*u,p=a*h,g=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-g*c,t[9]=-a*l,t[2]=g-d*c,t[6]=p+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,p=c*h,g=c*u;t[0]=d+g*a,t[4]=p*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-p,t[6]=g+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,p=c*h,g=c*u;t[0]=d-g*a,t[4]=-o*u,t[8]=p+f*a,t[1]=f+p*a,t[5]=o*h,t[9]=g-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,p=a*h,g=a*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+g,t[1]=l*u,t[5]=g*c+d,t[9]=f*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,p=a*l,g=a*c;t[0]=l*h,t[4]=g-d*u,t[8]=p*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-g*u}else if(e.order==="XZY"){let d=o*l,f=o*c,p=a*l,g=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+g,t[5]=o*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=a*h,t[10]=g*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Cf,e,Af)}lookAt(e,t,n){let i=this.elements;return We.subVectors(e,t),We.lengthSq()===0&&(We.z=1),We.normalize(),Lt.crossVectors(n,We),Lt.lengthSq()===0&&(Math.abs(n.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),Lt.crossVectors(n,We)),Lt.normalize(),bs.crossVectors(We,Lt),i[0]=Lt.x,i[4]=bs.x,i[8]=We.x,i[1]=Lt.y,i[5]=bs.y,i[9]=We.y,i[2]=Lt.z,i[6]=bs.z,i[10]=We.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],g=n[6],y=n[10],v=n[14],_=n[3],S=n[7],x=n[11],m=n[15],b=i[0],w=i[4],E=i[8],P=i[12],A=i[1],D=i[5],R=i[9],F=i[13],k=i[2],H=i[6],re=i[10],ft=i[14],Kt=i[3],Jt=i[7],Ct=i[11],At=i[15];return s[0]=o*b+a*A+l*k+c*Kt,s[4]=o*w+a*D+l*H+c*Jt,s[8]=o*E+a*R+l*re+c*Ct,s[12]=o*P+a*F+l*ft+c*At,s[1]=h*b+u*A+d*k+f*Kt,s[5]=h*w+u*D+d*H+f*Jt,s[9]=h*E+u*R+d*re+f*Ct,s[13]=h*P+u*F+d*ft+f*At,s[2]=p*b+g*A+y*k+v*Kt,s[6]=p*w+g*D+y*H+v*Jt,s[10]=p*E+g*R+y*re+v*Ct,s[14]=p*P+g*F+y*ft+v*At,s[3]=_*b+S*A+x*k+m*Kt,s[7]=_*w+S*D+x*H+m*Jt,s[11]=_*E+S*R+x*re+m*Ct,s[15]=_*P+S*F+x*ft+m*At,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],g=e[7],y=e[11],v=e[15];return p*(+s*l*u-i*c*u-s*a*d+n*c*d+i*a*f-n*l*f)+g*(+t*l*f-t*c*d+s*o*d-i*o*f+i*c*h-s*l*h)+y*(+t*c*u-t*a*f-s*o*u+n*o*f+s*a*h-n*c*h)+v*(-i*a*h-t*l*u+t*a*d+i*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],g=e[13],y=e[14],v=e[15],_=u*y*c-g*d*c+g*l*f-a*y*f-u*l*v+a*d*v,S=p*d*c-h*y*c-p*l*f+o*y*f+h*l*v-o*d*v,x=h*g*c-p*u*c+p*a*f-o*g*f-h*a*v+o*u*v,m=p*u*l-h*g*l-p*a*d+o*g*d+h*a*y-o*u*y,b=t*_+n*S+i*x+s*m;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let w=1/b;return e[0]=_*w,e[1]=(g*d*s-u*y*s-g*i*f+n*y*f+u*i*v-n*d*v)*w,e[2]=(a*y*s-g*l*s+g*i*c-n*y*c-a*i*v+n*l*v)*w,e[3]=(u*l*s-a*d*s-u*i*c+n*d*c+a*i*f-n*l*f)*w,e[4]=S*w,e[5]=(h*y*s-p*d*s+p*i*f-t*y*f-h*i*v+t*d*v)*w,e[6]=(p*l*s-o*y*s-p*i*c+t*y*c+o*i*v-t*l*v)*w,e[7]=(o*d*s-h*l*s+h*i*c-t*d*c-o*i*f+t*l*f)*w,e[8]=x*w,e[9]=(p*u*s-h*g*s-p*n*f+t*g*f+h*n*v-t*u*v)*w,e[10]=(o*g*s-p*a*s+p*n*c-t*g*c-o*n*v+t*a*v)*w,e[11]=(h*a*s-o*u*s-h*n*c+t*u*c+o*n*f-t*a*f)*w,e[12]=m*w,e[13]=(h*g*i-p*u*i+p*n*d-t*g*d-h*n*y+t*u*y)*w,e[14]=(p*a*i-o*g*i-p*n*l+t*g*l+o*n*y-t*a*y)*w,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*d+t*a*d)*w,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,h=o+o,u=a+a,d=s*c,f=s*h,p=s*u,g=o*h,y=o*u,v=a*u,_=l*c,S=l*h,x=l*u,m=n.x,b=n.y,w=n.z;return i[0]=(1-(g+v))*m,i[1]=(f+x)*m,i[2]=(p-S)*m,i[3]=0,i[4]=(f-x)*b,i[5]=(1-(d+v))*b,i[6]=(y+_)*b,i[7]=0,i[8]=(p+S)*w,i[9]=(y-_)*w,i[10]=(1-(d+g))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,s=Rn.set(i[0],i[1],i[2]).length(),o=Rn.set(i[4],i[5],i[6]).length(),a=Rn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],nt.copy(this);let c=1/s,h=1/o,u=1/a;return nt.elements[0]*=c,nt.elements[1]*=c,nt.elements[2]*=c,nt.elements[4]*=h,nt.elements[5]*=h,nt.elements[6]*=h,nt.elements[8]*=u,nt.elements[9]*=u,nt.elements[10]*=u,t.setFromRotationMatrix(nt),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,o,a=vt,l=!1){let c=this.elements,h=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),p,g;if(l)p=s/(o-s),g=o*s/(o-s);else if(a===vt)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===Ys)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,o,a=vt,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),p,g;if(l)p=1/(o-s),g=o/(o-s);else if(a===vt)p=-2/(o-s),g=-(o+s)/(o-s);else if(a===Ys)p=-1/(o-s),g=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Rn=new M,nt=new q,Cf=new M(0,0,0),Af=new M(1,1,1),Lt=new M,bs=new M,We=new M,Oh=new q,Bh=new St,Nt=class r{constructor(e=0,t=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(G(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-G(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(G(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-G(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(G(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-G(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Oh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Oh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bh.setFromEuler(this),this.setFromQuaternion(Bh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Nt.DEFAULT_ORDER="XYZ";var Ni=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Rf=0,kh=new M,In=new St,gt=new q,Ms=new M,bi=new M,If=new M,Pf=new St,Vh=new M(1,0,0),zh=new M(0,1,0),Hh=new M(0,0,1),Wh={type:"added"},Lf={type:"removed"},Pn={type:"childadded",child:null},za={type:"childremoved",child:null},Ze=class r extends an{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rf++}),this.uuid=Yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new M,t=new Nt,n=new St,i=new M(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new q},normalMatrix:{value:new X}}),this.matrix=new q,this.matrixWorld=new q,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ni,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.multiply(In),this}rotateOnWorldAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.premultiply(In),this}rotateX(e){return this.rotateOnAxis(Vh,e)}rotateY(e){return this.rotateOnAxis(zh,e)}rotateZ(e){return this.rotateOnAxis(Hh,e)}translateOnAxis(e,t){return kh.copy(e).applyQuaternion(this.quaternion),this.position.add(kh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vh,e)}translateY(e){return this.translateOnAxis(zh,e)}translateZ(e){return this.translateOnAxis(Hh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ms.copy(e):Ms.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),bi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gt.lookAt(bi,Ms,this.up):gt.lookAt(Ms,bi,this.up),this.quaternion.setFromRotationMatrix(gt),i&&(gt.extractRotation(i.matrixWorld),In.setFromRotationMatrix(gt),this.quaternion.premultiply(In.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wh),Pn.child=e,this.dispatchEvent(Pn),Pn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Lf),za.child=e,this.dispatchEvent(za),za.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gt.multiply(e.parent.matrixWorld)),e.applyMatrix4(gt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wh),Pn.child=e,this.dispatchEvent(Pn),Pn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bi,e,If),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bi,Pf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};Ze.DEFAULT_UP=new M(0,1,0);Ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var it=new M,yt=new M,Ha=new M,xt=new M,Ln=new M,Dn=new M,Gh=new M,Wa=new M,Ga=new M,Xa=new M,qa=new Vn,Ya=new Vn,$a=new Vn,Pe=class r{constructor(e=new M,t=new M,n=new M){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),it.subVectors(e,t),i.cross(it);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){it.subVectors(i,t),yt.subVectors(n,t),Ha.subVectors(e,t);let o=it.dot(it),a=it.dot(yt),l=it.dot(Ha),c=yt.dot(yt),h=yt.dot(Ha),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,xt)===null?!1:xt.x>=0&&xt.y>=0&&xt.x+xt.y<=1}static getInterpolation(e,t,n,i,s,o,a,l){return this.getBarycoord(e,t,n,i,xt)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,xt.x),l.addScaledVector(o,xt.y),l.addScaledVector(a,xt.z),l)}static getInterpolatedAttribute(e,t,n,i,s,o){return qa.setScalar(0),Ya.setScalar(0),$a.setScalar(0),qa.fromBufferAttribute(e,t),Ya.fromBufferAttribute(e,n),$a.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(qa,s.x),o.addScaledVector(Ya,s.y),o.addScaledVector($a,s.z),o}static isFrontFacing(e,t,n,i){return it.subVectors(n,t),yt.subVectors(e,t),it.cross(yt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return it.subVectors(this.c,this.b),yt.subVectors(this.a,this.b),it.cross(yt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return r.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,o,a;Ln.subVectors(i,n),Dn.subVectors(s,n),Wa.subVectors(e,n);let l=Ln.dot(Wa),c=Dn.dot(Wa);if(l<=0&&c<=0)return t.copy(n);Ga.subVectors(e,i);let h=Ln.dot(Ga),u=Dn.dot(Ga);if(h>=0&&u<=h)return t.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Ln,o);Xa.subVectors(e,s);let f=Ln.dot(Xa),p=Dn.dot(Xa);if(p>=0&&f<=p)return t.copy(s);let g=f*c-l*p;if(g<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(Dn,a);let y=h*p-f*u;if(y<=0&&u-h>=0&&f-p>=0)return Gh.subVectors(s,i),a=(u-h)/(u-h+(f-p)),t.copy(i).addScaledVector(Gh,a);let v=1/(y+g+d);return o=g*v,a=d*v,t.copy(n).addScaledVector(Ln,o).addScaledVector(Dn,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},yu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Dt={h:0,s:0,l:0},ws={h:0,s:0,l:0};function Ka(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}var fe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Je){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=Ll(e,1),t=G(t,0,1),n=G(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=Ka(o,s,e+1/3),this.g=Ka(o,s,e),this.b=Ka(o,s,e-1/3)}return Xe.colorSpaceToWorking(this,i),this}setStyle(e,t=Je){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Je){let n=yu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_t(e.r),this.g=_t(e.g),this.b=_t(e.b),this}copyLinearToSRGB(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Je){return Xe.workingToColorSpace(Re.copy(this),e),Math.round(G(Re.r*255,0,255))*65536+Math.round(G(Re.g*255,0,255))*256+Math.round(G(Re.b*255,0,255))}getHexString(e=Je){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.workingToColorSpace(Re.copy(this),t);let n=Re.r,i=Re.g,s=Re.b,o=Math.max(n,i,s),a=Math.min(n,i,s),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Xe.workingColorSpace){return Xe.workingToColorSpace(Re.copy(this),t),e.r=Re.r,e.g=Re.g,e.b=Re.b,e}getStyle(e=Je){Xe.workingToColorSpace(Re.copy(this),e);let t=Re.r,n=Re.g,i=Re.b;return e!==Je?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Dt),this.setHSL(Dt.h+e,Dt.s+t,Dt.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Dt),e.getHSL(ws);let n=Ii(Dt.h,ws.h,t),i=Ii(Dt.s,ws.s,t),s=Ii(Dt.l,ws.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Re=new fe;fe.NAMES=yu;var Df=0,cn=class extends an{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=Yn(),this.name="",this.type="Material",this.blending=il,this.side=on,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rl,this.blendDst=ol,this.blendEquation=sl,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fe(0,0,0),this.blendAlpha=0,this.depthFunc=Pi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ml,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=sn,this.stencilZFail=sn,this.stencilZPass=sn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==il&&(n.blending=this.blending),this.side!==on&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==rl&&(n.blendSrc=this.blendSrc),this.blendDst!==ol&&(n.blendDst=this.blendDst),this.blendEquation!==sl&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Pi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ml&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==sn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==sn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==sn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},zn=class extends cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nt,this.combine=cu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var ye=new M,Ts=new ee,Ff=0,_e=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ff++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=gl,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ts.fromBufferAttribute(this,t),Ts.applyMatrix3(e),this.setXY(t,Ts.x,Ts.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ye.fromBufferAttribute(this,t),ye.applyMatrix3(e),this.setXYZ(t,ye.x,ye.y,ye.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ye.fromBufferAttribute(this,t),ye.applyMatrix4(e),this.setXYZ(t,ye.x,ye.y,ye.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ye.fromBufferAttribute(this,t),ye.applyNormalMatrix(e),this.setXYZ(t,ye.x,ye.y,ye.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ye.fromBufferAttribute(this,t),ye.transformDirection(e),this.setXYZ(t,ye.x,ye.y,ye.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Fe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Fe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Fe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Fe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Fe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Fe(t,this.array),n=Fe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Fe(t,this.array),n=Fe(n,this.array),i=Fe(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Fe(t,this.array),n=Fe(n,this.array),i=Fe(i,this.array),s=Fe(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gl&&(e.usage=this.usage),e}};var Js=class extends _e{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Zs=class extends _e{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Hn=class extends _e{constructor(e,t,n){super(new Float32Array(e),t,n)}},Nf=0,Ke=new q,Ja=new Ze,Fn=new M,Ge=new Q,Mi=new Q,be=new M,ct=class r extends an{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=Yn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gu(e)?Zs:Js)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new X().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ke.makeRotationFromQuaternion(e),this.applyMatrix4(Ke),this}rotateX(e){return Ke.makeRotationX(e),this.applyMatrix4(Ke),this}rotateY(e){return Ke.makeRotationY(e),this.applyMatrix4(Ke),this}rotateZ(e){return Ke.makeRotationZ(e),this.applyMatrix4(Ke),this}translate(e,t,n){return Ke.makeTranslation(e,t,n),this.applyMatrix4(Ke),this}scale(e,t,n){return Ke.makeScale(e,t,n),this.applyMatrix4(Ke),this}lookAt(e){return Ja.lookAt(e),Ja.updateMatrix(),this.applyMatrix4(Ja.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fn).negate(),this.translate(Fn.x,Fn.y,Fn.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Hn(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Q);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];Ge.setFromBufferAttribute(s),this.morphTargetsRelative?(be.addVectors(this.boundingBox.min,Ge.min),this.boundingBox.expandByPoint(be),be.addVectors(this.boundingBox.max,Ge.max),this.boundingBox.expandByPoint(be)):(this.boundingBox.expandByPoint(Ge.min),this.boundingBox.expandByPoint(Ge.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Le);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new M,1/0);return}if(e){let n=this.boundingSphere.center;if(Ge.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Mi.setFromBufferAttribute(a),this.morphTargetsRelative?(be.addVectors(Ge.min,Mi.min),Ge.expandByPoint(be),be.addVectors(Ge.max,Mi.max),Ge.expandByPoint(be)):(Ge.expandByPoint(Mi.min),Ge.expandByPoint(Mi.max))}Ge.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)be.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(be));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)be.fromBufferAttribute(a,c),l&&(Fn.fromBufferAttribute(e,c),be.add(Fn)),i=Math.max(i,n.distanceToSquared(be))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _e(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let E=0;E<n.count;E++)a[E]=new M,l[E]=new M;let c=new M,h=new M,u=new M,d=new ee,f=new ee,p=new ee,g=new M,y=new M;function v(E,P,A){c.fromBufferAttribute(n,E),h.fromBufferAttribute(n,P),u.fromBufferAttribute(n,A),d.fromBufferAttribute(s,E),f.fromBufferAttribute(s,P),p.fromBufferAttribute(s,A),h.sub(c),u.sub(c),f.sub(d),p.sub(d);let D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(D),y.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(D),a[E].add(g),a[P].add(g),a[A].add(g),l[E].add(y),l[P].add(y),l[A].add(y))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let E=0,P=_.length;E<P;++E){let A=_[E],D=A.start,R=A.count;for(let F=D,k=D+R;F<k;F+=3)v(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let S=new M,x=new M,m=new M,b=new M;function w(E){m.fromBufferAttribute(i,E),b.copy(m);let P=a[E];S.copy(P),S.sub(m.multiplyScalar(m.dot(P))).normalize(),x.crossVectors(b,P);let D=x.dot(l[E])<0?-1:1;o.setXYZW(E,S.x,S.y,S.z,D)}for(let E=0,P=_.length;E<P;++E){let A=_[E],D=A.start,R=A.count;for(let F=D,k=D+R;F<k;F+=3)w(e.getX(F+0)),w(e.getX(F+1)),w(e.getX(F+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new _e(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new M,s=new M,o=new M,a=new M,l=new M,c=new M,h=new M,u=new M;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),g=e.getX(d+1),y=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,g),o.fromBufferAttribute(t,y),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(y,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)be.fromBufferAttribute(e,t),be.normalize(),e.setXYZ(t,be.x,be.y,be.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,p=0;for(let g=0,y=l.length;g<y;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*h;for(let v=0;v<h;v++)d[p++]=c[f++]}return new _e(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=e(l,n);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xh=new q,Qt=new bt,Es=new Le,qh=new M,Cs=new M,As=new M,Rs=new M,Za=new M,Is=new M,Yh=new M,Ps=new M,Ne=class extends Ze{constructor(e=new ct,t=new zn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){Is.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=a[l],u=s[l];h!==0&&(Za.fromBufferAttribute(u,e),o?Is.addScaledVector(Za,h):Is.addScaledVector(Za.sub(t),h))}t.add(Is)}return t}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Es.copy(n.boundingSphere),Es.applyMatrix4(s),Qt.copy(e.ray).recast(e.near),!(Es.containsPoint(Qt.origin)===!1&&(Qt.intersectSphere(Es,qh)===null||Qt.origin.distanceToSquared(qh)>(e.far-e.near)**2))&&(Xh.copy(s).invert(),Qt.copy(e.ray).applyMatrix4(Xh),!(n.boundingBox!==null&&Qt.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Qt)))}_computeIntersections(e,t,n){let i,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,g=d.length;p<g;p++){let y=d[p],v=o[y.materialIndex],_=Math.max(y.start,f.start),S=Math.min(a.count,Math.min(y.start+y.count,f.start+f.count));for(let x=_,m=S;x<m;x+=3){let b=a.getX(x),w=a.getX(x+1),E=a.getX(x+2);i=Ls(this,v,e,n,c,h,u,b,w,E),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=y.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let y=p,v=g;y<v;y+=3){let _=a.getX(y),S=a.getX(y+1),x=a.getX(y+2);i=Ls(this,o,e,n,c,h,u,_,S,x),i&&(i.faceIndex=Math.floor(y/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,g=d.length;p<g;p++){let y=d[p],v=o[y.materialIndex],_=Math.max(y.start,f.start),S=Math.min(l.count,Math.min(y.start+y.count,f.start+f.count));for(let x=_,m=S;x<m;x+=3){let b=x,w=x+1,E=x+2;i=Ls(this,v,e,n,c,h,u,b,w,E),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=y.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let y=p,v=g;y<v;y+=3){let _=y,S=y+1,x=y+2;i=Ls(this,o,e,n,c,h,u,_,S,x),i&&(i.faceIndex=Math.floor(y/3),t.push(i))}}}};function Uf(r,e,t,n,i,s,o,a){let l;if(e.side===fr?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,e.side===on,a),l===null)return null;Ps.copy(a),Ps.applyMatrix4(r.matrixWorld);let c=t.ray.origin.distanceTo(Ps);return c<t.near||c>t.far?null:{distance:c,point:Ps.clone(),object:r}}function Ls(r,e,t,n,i,s,o,a,l,c){r.getVertexPosition(a,Cs),r.getVertexPosition(l,As),r.getVertexPosition(c,Rs);let h=Uf(r,e,t,n,Cs,As,Rs,Yh);if(h){let u=new M;Pe.getBarycoord(Yh,Cs,As,Rs,u),i&&(h.uv=Pe.getInterpolatedAttribute(i,a,l,c,u,new ee)),s&&(h.uv1=Pe.getInterpolatedAttribute(s,a,l,c,u,new ee)),o&&(h.normal=Pe.getInterpolatedAttribute(o,a,l,c,u,new M),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new M,materialIndex:0};Pe.getNormal(Cs,As,Rs,d.normal),h.face=d,h.barycoord=u}return h}function Dl(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Oe(r){let e={};for(let t=0;t<r.length;t++){let n=Dl(r[t]);for(let i in n)e[i]=n[i]}return e}function Of(r){let e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}var Bf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Wn=class extends cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bf,this.fragmentShader=kf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Dl(e.uniforms),this.uniformsGroups=Of(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},js=class extends Ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new q,this.projectionMatrix=new q,this.projectionMatrixInverse=new q,this.coordinateSystem=vt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ft=new M,$h=new ee,Kh=new ee,Ui=class extends js{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Fi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ri*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fi*2*Math.atan(Math.tan(Ri*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ft.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ft.x,Ft.y).multiplyScalar(-e/Ft.z),Ft.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ft.x,Ft.y).multiplyScalar(-e/Ft.z)}getViewSize(e,t){return this.getViewBounds(e,$h,Kh),t.subVectors(Kh,$h)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ri*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Oi=class extends Ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nt,this.environmentIntensity=1,this.environmentRotation=new Nt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var rn=class extends ln{constructor(e=null,t=1,n=1,i,s,o,a,l,c=cl,h=cl,u,d){super(null,o,a,l,c,h,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Bi=class extends _e{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Nn=new q,Jh=new q,Ds=[],Zh=new Q,Vf=new q,wi=new Ne,Ti=new Le,ki=class extends Ne{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Bi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Vf)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Q),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Nn),Zh.copy(e.boundingBox).applyMatrix4(Nn),this.boundingBox.union(Zh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Le),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Nn),Ti.copy(e.boundingSphere).applyMatrix4(Nn),this.boundingSphere.union(Ti)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(wi.geometry=this.geometry,wi.material=this.material,wi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ti.copy(this.boundingSphere),Ti.applyMatrix4(n),e.ray.intersectsSphere(Ti)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Nn),Jh.multiplyMatrices(n,Nn),wi.matrixWorld=Jh,wi.raycast(e,Ds);for(let o=0,a=Ds.length;o<a;o++){let l=Ds[o];l.instanceId=s,l.object=this,t.push(l)}Ds.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Bi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new rn(new Float32Array(i*this.count),i,this.count,pu,Li));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;s[l]=a,s.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ja=new M,zf=new M,Hf=new X,qe=class{constructor(e=new M(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=ja.subVectors(n,t).cross(zf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(ja),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Hf.getNormalMatrix(e),i=this.coplanarPoint(ja).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},en=new Le,Wf=new ee(.5,.5),Fs=new M,Vi=class{constructor(e=new qe,t=new qe,n=new qe,i=new qe,s=new qe,o=new qe){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vt,n=!1){let i=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],p=s[8],g=s[9],y=s[10],v=s[11],_=s[12],S=s[13],x=s[14],m=s[15];if(i[0].setComponents(c-o,f-h,v-p,m-_).normalize(),i[1].setComponents(c+o,f+h,v+p,m+_).normalize(),i[2].setComponents(c+a,f+u,v+g,m+S).normalize(),i[3].setComponents(c-a,f-u,v-g,m-S).normalize(),n)i[4].setComponents(l,d,y,x).normalize(),i[5].setComponents(c-l,f-d,v-y,m-x).normalize();else if(i[4].setComponents(c-l,f-d,v-y,m-x).normalize(),t===vt)i[5].setComponents(c+l,f+d,v+y,m+x).normalize();else if(t===Ys)i[5].setComponents(l,d,y,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),en.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),en.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(en)}intersectsSprite(e){en.center.set(0,0,0);let t=Wf.distanceTo(e.center);return en.radius=.7071067811865476+t,en.applyMatrix4(e.matrixWorld),this.intersectsSphere(en)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Fs.x=i.normal.x>0?e.max.x:e.min.x,Fs.y=i.normal.y>0?e.max.y:e.min.y,Fs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Fs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},at=new q,lt=new Vi,Qs=class r{constructor(){this.coordinateSystem=vt}intersectsObject(e,t){if(!t.isArrayCamera||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(at.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),lt.setFromProjectionMatrix(at,i.coordinateSystem,i.reversedDepth),lt.intersectsObject(e))return!0}return!1}intersectsSprite(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(at.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),lt.setFromProjectionMatrix(at,i.coordinateSystem,i.reversedDepth),lt.intersectsSprite(e))return!0}return!1}intersectsSphere(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(at.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),lt.setFromProjectionMatrix(at,i.coordinateSystem,i.reversedDepth),lt.intersectsSphere(e))return!0}return!1}intersectsBox(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(at.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),lt.setFromProjectionMatrix(at,i.coordinateSystem,i.reversedDepth),lt.intersectsBox(e))return!0}return!1}containsPoint(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){let i=t.cameras[n];if(at.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),lt.setFromProjectionMatrix(at,i.coordinateSystem,i.reversedDepth),lt.containsPoint(e))return!0}return!1}clone(){return new r}};function Qa(r,e){return r-e}function Gf(r,e){return r.z-e.z}function Xf(r,e){return e.z-r.z}var vl=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,o=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let a=s[this.index];o.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}},ze=new q,qf=new fe(1,1,1),jh=new Vi,Yf=new Qs,Ns=new Q,tn=new Le,Ei=new M,Qh=new M,$f=new M,el=new vl,Ie=new Ne,Us=[];function Kf(r,e,t=0){let n=e.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==e.array.constructor){let i=r.count;for(let s=0;s<i;s++)for(let o=0;o<n;o++)e.setComponent(s+t,o,r.getComponent(s,o))}else e.array.set(r.array,t*n);e.needsUpdate=!0}function nn(r,e){if(r.constructor!==e.constructor){let t=Math.min(r.length,e.length);for(let n=0;n<t;n++)e[n]=r[n]}else{let t=Math.min(r.length,e.length);e.set(new r.constructor(r.buffer,0,t))}}var zi=class extends Ne{constructor(e,t,n=t*2,i){super(new ct,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),n=new rn(t,e,e,Xs,Li);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),n=new rn(t,e,e,mu,fu);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),n=new rn(t,e,e,Xs,Li);n.colorSpace=Xe.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in e.attributes){let o=e.getAttribute(s),{array:a,itemSize:l,normalized:c}=o,h=new a.constructor(n*l),u=new _e(h,l,c);t.setAttribute(s,u)}if(e.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new _e(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Q);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,ze),this.getBoundingBoxAt(s,Ns).applyMatrix4(ze),e.union(Ns)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Le);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,ze),this.getBoundingSphereAt(s,tn).applyMatrix4(ze),e.union(tn)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Qa),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let s=this._matricesTexture;ze.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;let o=this._colorsTexture;return o&&(qf.toArray(o.image.data,i*4),o.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let o=e.getIndex();if(o!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?o.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Qa),l=this._availableGeometryIds.shift(),s[l]=i):(l=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(l,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),o=t.getIndex(),a=this._geometryInfo[e];if(i&&o.count>a.reservedIndexCount||t.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let l=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=t.getAttribute("position").count;for(let h in n.attributes){let u=t.getAttribute(h),d=n.getAttribute(h);Kf(u,d,l);let f=u.itemSize;for(let p=u.count,g=c;p<g;p++){let y=l+p;for(let v=0;v<f;v++)d.setComponent(y,v,0)}d.needsUpdate=!0,d.addUpdateRange(l*f,c*f)}if(i){let h=a.indexStart,u=a.reservedIndexCount;a.indexCount=t.getIndex().count;for(let d=0;d<o.count;d++)s.setX(h+d,l+o.getX(d));for(let d=o.count,f=u;d<f;d++)s.setX(h+d,l);s.needsUpdate=!0,s.addUpdateRange(h,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,t.boundingBox!==null&&(a.boundingBox=t.boundingBox.clone()),a.boundingSphere=null,t.boundingSphere!==null&&(a.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,i=n.map((o,a)=>a).sort((o,a)=>n[o].vertexStart-n[a].vertexStart),s=this.geometry;for(let o=0,a=n.length;o<a;o++){let l=i[o],c=n[l];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==t){let{indexStart:h,vertexStart:u,reservedIndexCount:d}=c,f=s.index,p=f.array,g=e-u;for(let y=h;y<h+d;y++)p[y]=p[y]+g;f.array.copyWithin(t,h,h+d),f.addUpdateRange(t,d),c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){let{vertexStart:h,reservedVertexCount:u}=c,d=s.attributes;for(let f in d){let p=d[f],{array:g,itemSize:y}=p;g.copyWithin(e*y,h*y,(h+u)*y),p.addUpdateRange(e*y,u*y)}c.vertexStart=e}e+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart,this._nextIndexStart=s.index?c.indexStart+c.reservedIndexCount:0,this._nextVertexStart=c.vertexStart+c.reservedVertexCount}}return this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){let s=new Q,o=n.index,a=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let h=l;o&&(h=o.getX(h)),s.expandByPoint(Ei.fromBufferAttribute(a,h))}i.boundingBox=s}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){let s=new Le;this.getBoundingBoxAt(e,Ns),Ns.getCenter(s.center);let o=n.index,a=n.attributes.position,l=0;for(let c=i.start,h=i.start+i.count;c<h;c++){let u=c;o&&(u=o.getX(u)),Ei.fromBufferAttribute(a,u),l=Math.max(l,s.center.distanceToSquared(Ei))}s.radius=Math.sqrt(l),i.boundingSphere=s}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(Qa);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let i=new Int32Array(e),s=new Int32Array(e);nn(this._multiDrawCounts,i),nn(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=e;let o=this._indirectTexture,a=this._matricesTexture,l=this._colorsTexture;o.dispose(),this._initIndirectTexture(),nn(o.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),nn(a.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),nn(l.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>e)throw new Error(`BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>t)throw new Error(`BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let s=this.geometry;s.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new ct,this._initializeGeometry(s));let o=this.geometry;s.index&&nn(s.index.array,o.index.array);for(let a in s.attributes)nn(s.attributes[a].array,o.attributes[a].array)}raycast(e,t){let n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,o=this.geometry;Ie.material=this.material,Ie.geometry.index=o.index,Ie.geometry.attributes=o.attributes,Ie.geometry.boundingBox===null&&(Ie.geometry.boundingBox=new Q),Ie.geometry.boundingSphere===null&&(Ie.geometry.boundingSphere=new Le);for(let a=0,l=n.length;a<l;a++){if(!n[a].visible||!n[a].active)continue;let c=n[a].geometryIndex,h=i[c];Ie.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(a,Ie.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,Ie.geometry.boundingBox),this.getBoundingSphereAt(c,Ie.geometry.boundingSphere),Ie.raycast(e,Us);for(let u=0,d=Us.length;u<d;u++){let f=Us[u];f.object=this,f.batchId=a,t.push(f)}Us.length=0}Ie.material=null,Ie.geometry.index=null,Ie.geometry.attributes={},Ie.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let o=i.getIndex(),a=o===null?1:o.array.BYTES_PER_ELEMENT,l=this._instanceInfo,c=this._multiDrawStarts,h=this._multiDrawCounts,u=this._geometryInfo,d=this.perObjectFrustumCulled,f=this._indirectTexture,p=f.image.data,g=n.isArrayCamera?Yf:jh;d&&!n.isArrayCamera&&(ze.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),jh.setFromProjectionMatrix(ze,n.coordinateSystem,n.reversedDepth));let y=0;if(this.sortObjects){ze.copy(this.matrixWorld).invert(),Ei.setFromMatrixPosition(n.matrixWorld).applyMatrix4(ze),Qh.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(ze);for(let S=0,x=l.length;S<x;S++)if(l[S].visible&&l[S].active){let m=l[S].geometryIndex;this.getMatrixAt(S,ze),this.getBoundingSphereAt(m,tn).applyMatrix4(ze);let b=!1;if(d&&(b=!g.intersectsSphere(tn,n)),!b){let w=u[m],E=$f.subVectors(tn.center,Ei).dot(Qh);el.push(w.start,w.count,E,S)}}let v=el.list,_=this.customSort;_===null?v.sort(s.transparent?Xf:Gf):_.call(this,v,n);for(let S=0,x=v.length;S<x;S++){let m=v[S];c[y]=m.start*a,h[y]=m.count,p[y]=m.index,y++}el.reset()}else for(let v=0,_=l.length;v<_;v++)if(l[v].visible&&l[v].active){let S=l[v].geometryIndex,x=!1;if(d&&(this.getMatrixAt(v,ze),this.getBoundingSphereAt(S,tn).applyMatrix4(ze),x=!g.intersectsSphere(tn,n)),!x){let m=u[S];c[y]=m.start*a,h[y]=m.count,p[y]=v,y++}}f.needsUpdate=!0,this._multiDrawCount=y,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,o){this.onBeforeRender(e,null,i,s,o)}},er=class extends cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},tr=new M,nr=new M,eu=new q,Ci=new bt,Os=new Le,tl=new M,tu=new M,Ut=class extends Ze{constructor(e=new ct,t=new er){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)tr.fromBufferAttribute(t,i-1),nr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=tr.distanceTo(nr);e.setAttribute("lineDistance",new Hn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Os.copy(n.boundingSphere),Os.applyMatrix4(i),Os.radius+=s,e.ray.intersectsSphere(Os)===!1)return;eu.copy(i).invert(),Ci.copy(e.ray).applyMatrix4(eu);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=f,y=p-1;g<y;g+=c){let v=h.getX(g),_=h.getX(g+1),S=Bs(this,e,Ci,l,v,_,g);S&&t.push(S)}if(this.isLineLoop){let g=h.getX(p-1),y=h.getX(f),v=Bs(this,e,Ci,l,g,y,p-1);v&&t.push(v)}}else{let f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let g=f,y=p-1;g<y;g+=c){let v=Bs(this,e,Ci,l,g,g+1,g);v&&t.push(v)}if(this.isLineLoop){let g=Bs(this,e,Ci,l,p-1,f,p-1);g&&t.push(g)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Bs(r,e,t,n,i,s,o){let a=r.geometry.attributes.position;if(tr.fromBufferAttribute(a,i),nr.fromBufferAttribute(a,s),t.distanceSqToSegment(tr,nr,tl,tu)>n)return;tl.applyMatrix4(r.matrixWorld);let c=e.ray.origin.distanceTo(tl);if(!(c<e.near||c>e.far))return{distance:c,point:tu.clone().applyMatrix4(r.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:r}}var nu=new M,iu=new M,Gn=class extends Ut{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)nu.fromBufferAttribute(t,i),iu.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+nu.distanceTo(iu);e.setAttribute("lineDistance",new Hn(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Xn=class extends Ut{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},ir=class extends cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},su=new q,_l=new bt,ks=new Le,Vs=new M,qn=class extends Ze{constructor(e=new ct,t=new ir){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(i),ks.radius+=s,e.ray.intersectsSphere(ks)===!1)return;su.copy(i).invert(),_l.copy(e.ray).applyMatrix4(su);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=d,g=f;p<g;p++){let y=c.getX(p);Vs.fromBufferAttribute(u,y),ru(Vs,y,l,i,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,g=f;p<g;p++)Vs.fromBufferAttribute(u,p),ru(Vs,p,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function ru(r,e,t,n,i,s,o){let a=_l.distanceSqToPoint(r);if(a<t){let l=new M;_l.closestPointToPoint(r,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}function zs(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Jf(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var hn=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let o=0;o!==i;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},sr=class extends hn{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:hl,endingEnd:hl}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,o=e+1,a=i[s],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case ul:s=e,a=2*t-n;break;case dl:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ul:o=e,l=2*n-t;break;case dl:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),g=p*p,y=g*p,v=-d*y+2*d*g-d*p,_=(1+d)*y+(-1.5-2*d)*g+(-.5+d)*p+1,S=(-1-f)*y+(1.5+f)*g+.5*p,x=f*y-f*g;for(let m=0;m!==a;++m)s[m]=v*o[h+m]+_*o[c+m]+S*o[l+m]+x*o[u+m];return s}},rr=class extends hn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==a;++d)s[d]=o[c+d]*u+o[l+d]*h;return s}},or=class extends hn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Ye=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=zs(t,this.TimeBufferType),this.values=zs(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:zs(e.times,Array),values:zs(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new or(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new rr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new sr(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Di:t=this.InterpolantFactoryMethodDiscrete;break;case qs:t=this.InterpolantFactoryMethodLinear;break;case Ws:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Di;case this.InterpolantFactoryMethodLinear:return qs;case this.InterpolantFactoryMethodSmooth:return Ws}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,s=0,o=i-1;for(;s!==i&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&Jf(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ws,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let g=t[u+p];if(g!==t[d+p]||g!==t[f+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Ye.prototype.ValueTypeName="";Ye.prototype.TimeBufferType=Float32Array;Ye.prototype.ValueBufferType=Float32Array;Ye.prototype.DefaultInterpolation=qs;var Ot=class extends Ye{constructor(e,t,n){super(e,t,n)}};Ot.prototype.ValueTypeName="bool";Ot.prototype.ValueBufferType=Array;Ot.prototype.DefaultInterpolation=Di;Ot.prototype.InterpolantFactoryMethodLinear=void 0;Ot.prototype.InterpolantFactoryMethodSmooth=void 0;var ar=class extends Ye{constructor(e,t,n,i){super(e,t,n,i)}};ar.prototype.ValueTypeName="color";var lr=class extends Ye{constructor(e,t,n,i){super(e,t,n,i)}};lr.prototype.ValueTypeName="number";var cr=class extends hn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t),c=e*a;for(let h=c+a;c!==h;c+=4)St.slerpFlat(s,0,o,c-a,o,c,l);return s}},Hi=class extends Ye{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new cr(this.times,this.values,this.getValueSize(),e)}};Hi.prototype.ValueTypeName="quaternion";Hi.prototype.InterpolantFactoryMethodSmooth=void 0;var Bt=class extends Ye{constructor(e,t,n){super(e,t,n)}};Bt.prototype.ValueTypeName="string";Bt.prototype.ValueBufferType=Array;Bt.prototype.DefaultInterpolation=Di;Bt.prototype.InterpolantFactoryMethodLinear=void 0;Bt.prototype.InterpolantFactoryMethodSmooth=void 0;var hr=class extends Ye{constructor(e,t,n,i){super(e,t,n,i)}};hr.prototype.ValueTypeName="vector";var ur=class{constructor(e,t,n){let i=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},xu=new ur,dr=class{constructor(e){this.manager=e!==void 0?e:xu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};dr.DEFAULT_MATERIAL_NAME="__DEFAULT";var Fl="\\[\\]\\.:\\/",Zf=new RegExp("["+Fl+"]","g"),Nl="[^"+Fl+"]",jf="[^"+Fl.replace("\\.","")+"]",Qf=/((?:WC+[\/:])*)/.source.replace("WC",Nl),ep=/(WCOD+)?/.source.replace("WCOD",jf),tp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Nl),np=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Nl),ip=new RegExp("^"+Qf+ep+tp+np+"$"),sp=["material","materials","bones","map"],Sl=class{constructor(e,t,n){let i=n||ue.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ue=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Zf,"")}static parseTrackName(e){let t=ip.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);sp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ue.Composite=Sl;ue.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ue.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ue.prototype.GetterByBindingType=[ue.prototype._getValue_direct,ue.prototype._getValue_array,ue.prototype._getValue_arrayElement,ue.prototype._getValue_toArray];ue.prototype.SetterByBindingTypeAndVersioning=[[ue.prototype._setValue_direct,ue.prototype._setValue_direct_setNeedsUpdate,ue.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_array,ue.prototype._setValue_array_setNeedsUpdate,ue.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_arrayElement,ue.prototype._setValue_arrayElement_setNeedsUpdate,ue.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_fromArray,ue.prototype._setValue_fromArray_setNeedsUpdate,ue.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var By=new Float32Array(1);var ou=new q,un=class{constructor(e,t,n=0,i=1/0){this.ray=new bt(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ni,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ou.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ou),this}intersectObject(e,t=!0,n=[]){return bl(e,this,n,t),n.sort(au),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)bl(e[i],this,n,t);return n.sort(au),n}};function au(r,e){return r.distance-e.distance}function bl(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let o=0,a=s.length;o<a;o++)bl(s[o],e,t,!0)}}var lu=new M,Hs=new M,Un=new M,On=new M,nl=new M,rp=new M,op=new M,Ue=class{constructor(e=new M,t=new M){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){lu.subVectors(e,this.start),Hs.subVectors(this.end,this.start);let n=Hs.dot(Hs),s=Hs.dot(lu)/n;return t&&(s=G(s,0,1)),s}closestPointToPoint(e,t,n){let i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(e,t=rp,n=op){let i=10000000000000001e-32,s,o,a=this.start,l=e.start,c=this.end,h=e.end;Un.subVectors(c,a),On.subVectors(h,l),nl.subVectors(a,l);let u=Un.dot(Un),d=On.dot(On),f=On.dot(nl);if(u<=i&&d<=i)return t.copy(a),n.copy(l),t.sub(n),t.dot(t);if(u<=i)s=0,o=f/d,o=G(o,0,1);else{let p=Un.dot(nl);if(d<=i)o=0,s=G(-p/u,0,1);else{let g=Un.dot(On),y=u*d-g*g;y!==0?s=G((g*f-p*d)/y,0,1):s=0,o=(g*s+f)/d,o<0?(o=0,s=G(-p/u,0,1)):o>1&&(o=1,s=G((g-p)/u,0,1))}}return t.copy(a).add(Un.multiplyScalar(s)),n.copy(l).add(On.multiplyScalar(o)),t.sub(n),t.dot(t)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");var ap=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lp=`#ifdef USE_ALPHAHASH
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
#endif`,cp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,up=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fp=`#ifdef USE_AOMAP
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
#endif`,pp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mp=`#ifdef USE_BATCHING
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
#endif`,gp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_p=`#ifdef USE_IRIDESCENCE
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
#endif`,Sp=`#ifdef USE_BUMPMAP
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
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ep=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ap=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ip=`#define PI 3.141592653589793
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
} // validated`,Pp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Lp=`vec3 transformedNormal = objectNormal;
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
#endif`,Dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Up=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Op="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kp=`#ifdef USE_ENVMAP
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
#endif`,Vp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zp=`#ifdef USE_ENVMAP
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
#endif`,Hp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wp=`#ifdef USE_ENVMAP
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
#endif`,Gp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$p=`#ifdef USE_GRADIENTMAP
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
}`,Kp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jp=`uniform bool receiveShadow;
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
#endif`,Qp=`#ifdef USE_ENVMAP
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
#endif`,em=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sm=`PhysicalMaterial material;
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
#endif`,rm=`struct PhysicalMaterial {
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
}`,om=`
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
#endif`,am=`#if defined( RE_IndirectDiffuse )
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
#endif`,lm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,um=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gm=`#if defined( USE_POINTS_UV )
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
#endif`,ym=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_m=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bm=`#ifdef USE_MORPHTARGETS
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
#endif`,Mm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Em=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Am=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rm=`#ifdef USE_NORMALMAP
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
#endif`,Im=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Um=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,km=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xm=`float getShadowMask() {
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
}`,qm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ym=`#ifdef USE_SKINNING
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
#endif`,$m=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Km=`#ifdef USE_SKINNING
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
#endif`,Jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Zm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,og=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ag=`uniform sampler2D t2D;
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
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`#include <common>
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
}`,fg=`#if DEPTH_PACKING == 3200
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
}`,pg=`#define DISTANCE
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
}`,mg=`#define DISTANCE
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`uniform float scale;
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
}`,vg=`uniform vec3 diffuse;
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
}`,_g=`#include <common>
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
}`,Sg=`uniform vec3 diffuse;
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
}`,bg=`#define LAMBERT
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
}`,Mg=`#define LAMBERT
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
}`,wg=`#define MATCAP
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
}`,Tg=`#define MATCAP
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
}`,Eg=`#define NORMAL
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
}`,Cg=`#define NORMAL
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
}`,Ag=`#define PHONG
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
}`,Rg=`#define PHONG
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
}`,Ig=`#define STANDARD
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
}`,Pg=`#define STANDARD
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
}`,Lg=`#define TOON
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
}`,Dg=`#define TOON
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
}`,Fg=`uniform float size;
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
}`,Ng=`uniform vec3 diffuse;
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
}`,Ug=`#include <common>
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
}`,Og=`uniform vec3 color;
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
}`,Bg=`uniform float rotation;
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
}`,kg=`uniform vec3 diffuse;
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
}`,$={alphahash_fragment:ap,alphahash_pars_fragment:lp,alphamap_fragment:cp,alphamap_pars_fragment:hp,alphatest_fragment:up,alphatest_pars_fragment:dp,aomap_fragment:fp,aomap_pars_fragment:pp,batching_pars_vertex:mp,batching_vertex:gp,begin_vertex:yp,beginnormal_vertex:xp,bsdfs:vp,iridescence_fragment:_p,bumpmap_pars_fragment:Sp,clipping_planes_fragment:bp,clipping_planes_pars_fragment:Mp,clipping_planes_pars_vertex:wp,clipping_planes_vertex:Tp,color_fragment:Ep,color_pars_fragment:Cp,color_pars_vertex:Ap,color_vertex:Rp,common:Ip,cube_uv_reflection_fragment:Pp,defaultnormal_vertex:Lp,displacementmap_pars_vertex:Dp,displacementmap_vertex:Fp,emissivemap_fragment:Np,emissivemap_pars_fragment:Up,colorspace_fragment:Op,colorspace_pars_fragment:Bp,envmap_fragment:kp,envmap_common_pars_fragment:Vp,envmap_pars_fragment:zp,envmap_pars_vertex:Hp,envmap_physical_pars_fragment:Qp,envmap_vertex:Wp,fog_vertex:Gp,fog_pars_vertex:Xp,fog_fragment:qp,fog_pars_fragment:Yp,gradientmap_pars_fragment:$p,lightmap_pars_fragment:Kp,lights_lambert_fragment:Jp,lights_lambert_pars_fragment:Zp,lights_pars_begin:jp,lights_toon_fragment:em,lights_toon_pars_fragment:tm,lights_phong_fragment:nm,lights_phong_pars_fragment:im,lights_physical_fragment:sm,lights_physical_pars_fragment:rm,lights_fragment_begin:om,lights_fragment_maps:am,lights_fragment_end:lm,logdepthbuf_fragment:cm,logdepthbuf_pars_fragment:hm,logdepthbuf_pars_vertex:um,logdepthbuf_vertex:dm,map_fragment:fm,map_pars_fragment:pm,map_particle_fragment:mm,map_particle_pars_fragment:gm,metalnessmap_fragment:ym,metalnessmap_pars_fragment:xm,morphinstance_vertex:vm,morphcolor_vertex:_m,morphnormal_vertex:Sm,morphtarget_pars_vertex:bm,morphtarget_vertex:Mm,normal_fragment_begin:wm,normal_fragment_maps:Tm,normal_pars_fragment:Em,normal_pars_vertex:Cm,normal_vertex:Am,normalmap_pars_fragment:Rm,clearcoat_normal_fragment_begin:Im,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Lm,iridescence_pars_fragment:Dm,opaque_fragment:Fm,packing:Nm,premultiplied_alpha_fragment:Um,project_vertex:Om,dithering_fragment:Bm,dithering_pars_fragment:km,roughnessmap_fragment:Vm,roughnessmap_pars_fragment:zm,shadowmap_pars_fragment:Hm,shadowmap_pars_vertex:Wm,shadowmap_vertex:Gm,shadowmask_pars_fragment:Xm,skinbase_vertex:qm,skinning_pars_vertex:Ym,skinning_vertex:$m,skinnormal_vertex:Km,specularmap_fragment:Jm,specularmap_pars_fragment:Zm,tonemapping_fragment:jm,tonemapping_pars_fragment:Qm,transmission_fragment:eg,transmission_pars_fragment:tg,uv_pars_fragment:ng,uv_pars_vertex:ig,uv_vertex:sg,worldpos_vertex:rg,background_vert:og,background_frag:ag,backgroundCube_vert:lg,backgroundCube_frag:cg,cube_vert:hg,cube_frag:ug,depth_vert:dg,depth_frag:fg,distanceRGBA_vert:pg,distanceRGBA_frag:mg,equirect_vert:gg,equirect_frag:yg,linedashed_vert:xg,linedashed_frag:vg,meshbasic_vert:_g,meshbasic_frag:Sg,meshlambert_vert:bg,meshlambert_frag:Mg,meshmatcap_vert:wg,meshmatcap_frag:Tg,meshnormal_vert:Eg,meshnormal_frag:Cg,meshphong_vert:Ag,meshphong_frag:Rg,meshphysical_vert:Ig,meshphysical_frag:Pg,meshtoon_vert:Lg,meshtoon_frag:Dg,points_vert:Fg,points_frag:Ng,shadow_vert:Ug,shadow_frag:Og,sprite_vert:Bg,sprite_frag:kg},O={common:{diffuse:{value:new fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new X},alphaMap:{value:null},alphaMapTransform:{value:new X},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new X}},envmap:{envMap:{value:null},envMapRotation:{value:new X},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new X}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new X}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new X},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new X},normalScale:{value:new ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new X},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new X}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new X}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new X}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new X},alphaTest:{value:0},uvTransform:{value:new X}},sprite:{diffuse:{value:new fe(16777215)},opacity:{value:1},center:{value:new ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new X},alphaMap:{value:null},alphaMapTransform:{value:new X},alphaTest:{value:0}}},vu={basic:{uniforms:Oe([O.common,O.specularmap,O.envmap,O.aomap,O.lightmap,O.fog]),vertexShader:$.meshbasic_vert,fragmentShader:$.meshbasic_frag},lambert:{uniforms:Oe([O.common,O.specularmap,O.envmap,O.aomap,O.lightmap,O.emissivemap,O.bumpmap,O.normalmap,O.displacementmap,O.fog,O.lights,{emissive:{value:new fe(0)}}]),vertexShader:$.meshlambert_vert,fragmentShader:$.meshlambert_frag},phong:{uniforms:Oe([O.common,O.specularmap,O.envmap,O.aomap,O.lightmap,O.emissivemap,O.bumpmap,O.normalmap,O.displacementmap,O.fog,O.lights,{emissive:{value:new fe(0)},specular:{value:new fe(1118481)},shininess:{value:30}}]),vertexShader:$.meshphong_vert,fragmentShader:$.meshphong_frag},standard:{uniforms:Oe([O.common,O.envmap,O.aomap,O.lightmap,O.emissivemap,O.bumpmap,O.normalmap,O.displacementmap,O.roughnessmap,O.metalnessmap,O.fog,O.lights,{emissive:{value:new fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$.meshphysical_vert,fragmentShader:$.meshphysical_frag},toon:{uniforms:Oe([O.common,O.aomap,O.lightmap,O.emissivemap,O.bumpmap,O.normalmap,O.displacementmap,O.gradientmap,O.fog,O.lights,{emissive:{value:new fe(0)}}]),vertexShader:$.meshtoon_vert,fragmentShader:$.meshtoon_frag},matcap:{uniforms:Oe([O.common,O.bumpmap,O.normalmap,O.displacementmap,O.fog,{matcap:{value:null}}]),vertexShader:$.meshmatcap_vert,fragmentShader:$.meshmatcap_frag},points:{uniforms:Oe([O.points,O.fog]),vertexShader:$.points_vert,fragmentShader:$.points_frag},dashed:{uniforms:Oe([O.common,O.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$.linedashed_vert,fragmentShader:$.linedashed_frag},depth:{uniforms:Oe([O.common,O.displacementmap]),vertexShader:$.depth_vert,fragmentShader:$.depth_frag},normal:{uniforms:Oe([O.common,O.bumpmap,O.normalmap,O.displacementmap,{opacity:{value:1}}]),vertexShader:$.meshnormal_vert,fragmentShader:$.meshnormal_frag},sprite:{uniforms:Oe([O.sprite,O.fog]),vertexShader:$.sprite_vert,fragmentShader:$.sprite_frag},background:{uniforms:{uvTransform:{value:new X},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$.background_vert,fragmentShader:$.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new X}},vertexShader:$.backgroundCube_vert,fragmentShader:$.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$.cube_vert,fragmentShader:$.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$.equirect_vert,fragmentShader:$.equirect_frag},distanceRGBA:{uniforms:Oe([O.common,O.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$.distanceRGBA_vert,fragmentShader:$.distanceRGBA_frag},shadow:{uniforms:Oe([O.lights,O.fog,{color:{value:new fe(0)},opacity:{value:1}}]),vertexShader:$.shadow_vert,fragmentShader:$.shadow_frag}};vu.physical={uniforms:Oe([vu.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new X},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new X},clearcoatNormalScale:{value:new ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new X},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new X},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new X},sheen:{value:0},sheenColor:{value:new fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new X},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new X},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new X},transmissionSamplerSize:{value:new ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new X},attenuationDistance:{value:0},attenuationColor:{value:new fe(0)},specularColor:{value:new fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new X},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new X},anisotropyVector:{value:new ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new X}}]),vertexShader:$.meshphysical_vert,fragmentShader:$.meshphysical_frag};var dn=(1+Math.sqrt(5))/2,$n=1/dn,Cb=[new M(-dn,$n,0),new M(dn,$n,0),new M(-$n,0,dn),new M($n,0,dn),new M(0,dn,-$n),new M(0,dn,$n),new M(-1,1,-1),new M(1,1,-1),new M(-1,1,1),new M(1,1,1)];var Ab=new Float32Array(16),Rb=new Float32Array(9),Ib=new Float32Array(4);var Pb={[Ml]:wl,[Tl]:Al,[El]:Rl,[Pi]:Cl,[wl]:Ml,[Al]:Tl,[Rl]:El,[Cl]:Pi};var Kn=Math.pow(2,-24),Xi=Symbol("SKIP_GENERATION"),pr={strategy:0,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[Xi]:!1};function ae(r,e,t){return t.min.x=e[r],t.min.y=e[r+1],t.min.z=e[r+2],t.max.x=e[r+3],t.max.y=e[r+4],t.max.z=e[r+5],t}function qi(r){let e=-1,t=-1/0;for(let n=0;n<3;n++){let i=r[n+3]-r[n];i>t&&(t=i,e=n)}return e}function Ul(r,e){e.set(r)}function Ol(r,e,t){let n,i;for(let s=0;s<3;s++){let o=s+3;n=r[s],i=e[s],t[s]=n<i?n:i,n=r[o],i=e[o],t[o]=n>i?n:i}}function Yi(r,e,t){for(let n=0;n<3;n++){let i=e[r+2*n],s=e[r+2*n+1],o=i-s,a=i+s;o<t[n]&&(t[n]=o),a>t[n+3]&&(t[n+3]=a)}}function Jn(r){let e=r[3]-r[0],t=r[4]-r[1],n=r[5]-r[2];return 2*(e*t+t*n+n*e)}function J(r,e){return e[r+15]===65535}function ie(r,e){return e[r+6]}function oe(r,e){return e[r+14]}function te(r){return r+8}function ne(r,e){let t=e[r+6];return r+t*8}function Zn(r,e){return e[r+7]}function mr(r,e,t,n,i){let s=1/0,o=1/0,a=1/0,l=-1/0,c=-1/0,h=-1/0,u=1/0,d=1/0,f=1/0,p=-1/0,g=-1/0,y=-1/0,v=r.offset||0;for(let _=(e-v)*6,S=(e+t-v)*6;_<S;_+=6){let x=r[_+0],m=r[_+1],b=x-m,w=x+m;b<s&&(s=b),w>l&&(l=w),x<u&&(u=x),x>p&&(p=x);let E=r[_+2],P=r[_+3],A=E-P,D=E+P;A<o&&(o=A),D>c&&(c=D),E<d&&(d=E),E>g&&(g=E);let R=r[_+4],F=r[_+5],k=R-F,H=R+F;k<a&&(a=k),H>h&&(h=H),R<f&&(f=R),R>y&&(y=R)}n[0]=s,n[1]=o,n[2]=a,n[3]=l,n[4]=c,n[5]=h,i[0]=u,i[1]=d,i[2]=f,i[3]=p,i[4]=g,i[5]=y}var wt=32,Wg=(r,e)=>r.candidate-e.candidate,kt=new Array(wt).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),gr=new Float32Array(6);function Su(r,e,t,n,i,s){let o=-1,a=0;if(s===0)o=qi(e),o!==-1&&(a=(e[o]+e[o+3])/2);else if(s===1)o=qi(r),o!==-1&&(a=Gg(t,n,i,o));else if(s===2){let l=Jn(r),c=1.25*i,h=t.offset||0,u=(n-h)*6,d=(n+i-h)*6;for(let f=0;f<3;f++){let p=e[f],v=(e[f+3]-p)/wt;if(i<wt/4){let _=[...kt];_.length=i;let S=0;for(let m=u;m<d;m+=6,S++){let b=_[S];b.candidate=t[m+2*f],b.count=0;let{bounds:w,leftCacheBounds:E,rightCacheBounds:P}=b;for(let A=0;A<3;A++)P[A]=1/0,P[A+3]=-1/0,E[A]=1/0,E[A+3]=-1/0,w[A]=1/0,w[A+3]=-1/0;Yi(m,t,w)}_.sort(Wg);let x=i;for(let m=0;m<x;m++){let b=_[m];for(;m+1<x&&_[m+1].candidate===b.candidate;)_.splice(m+1,1),x--}for(let m=u;m<d;m+=6){let b=t[m+2*f];for(let w=0;w<x;w++){let E=_[w];b>=E.candidate?Yi(m,t,E.rightCacheBounds):(Yi(m,t,E.leftCacheBounds),E.count++)}}for(let m=0;m<x;m++){let b=_[m],w=b.count,E=i-b.count,P=b.leftCacheBounds,A=b.rightCacheBounds,D=0;w!==0&&(D=Jn(P)/l);let R=0;E!==0&&(R=Jn(A)/l);let F=1+1.25*(D*w+R*E);F<c&&(o=f,c=F,a=b.candidate)}}else{for(let x=0;x<wt;x++){let m=kt[x];m.count=0,m.candidate=p+v+x*v;let b=m.bounds;for(let w=0;w<3;w++)b[w]=1/0,b[w+3]=-1/0}for(let x=u;x<d;x+=6){let w=~~((t[x+2*f]-p)/v);w>=wt&&(w=wt-1);let E=kt[w];E.count++,Yi(x,t,E.bounds)}let _=kt[wt-1];Ul(_.bounds,_.rightCacheBounds);for(let x=wt-2;x>=0;x--){let m=kt[x],b=kt[x+1];Ol(m.bounds,b.rightCacheBounds,m.rightCacheBounds)}let S=0;for(let x=0;x<wt-1;x++){let m=kt[x],b=m.count,w=m.bounds,P=kt[x+1].rightCacheBounds;b!==0&&(S===0?Ul(w,gr):Ol(w,gr,gr)),S+=b;let A=0,D=0;S!==0&&(A=Jn(gr)/l);let R=i-S;R!==0&&(D=Jn(P)/l);let F=1+1.25*(A*S+D*R);F<c&&(o=f,c=F,a=m.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${s} used.`);return{axis:o,pos:a}}function Gg(r,e,t,n){let i=0,s=r.offset;for(let o=e,a=e+t;o<a;o++)i+=r[(o-s)*6+n*2];return i/t}var jn=class{constructor(){this.boundingData=new Float32Array(6)}};function bu(r,e,t,n,i,s){let o=n,a=n+i-1,l=s.pos,c=s.axis*2,h=t.offset||0;for(;;){for(;o<=a&&t[(o-h)*6+c]<l;)o++;for(;o<=a&&t[(a-h)*6+c]>=l;)a--;if(o<a){for(let u=0;u<e;u++){let d=r[o*e+u];r[o*e+u]=r[a*e+u],r[a*e+u]=d}for(let u=0;u<6;u++){let d=o-h,f=a-h,p=t[d*6+u];t[d*6+u]=t[f*6+u],t[f*6+u]=p}o++,a--}else return o}}var Mu,yr,Bl,wu,Xg=Math.pow(2,32);function xr(r){return"count"in r?1:1+xr(r.left)+xr(r.right)}function Tu(r,e,t){return Mu=new Float32Array(t),yr=new Uint32Array(t),Bl=new Uint16Array(t),wu=new Uint8Array(t),kl(r,e)}function kl(r,e){let t=r/4,n=r/2,i="count"in e,s=e.boundingData;for(let o=0;o<6;o++)Mu[t+o]=s[o];if(i)return e.buffer?(wu.set(new Uint8Array(e.buffer),r),r+e.buffer.byteLength):(yr[t+6]=e.offset,Bl[n+14]=e.count,Bl[n+15]=65535,r+32);{let{left:o,right:a,splitAxis:l}=e,c=r+32,h=kl(c,o),u=r/32,f=h/32-u;if(f>Xg)throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");return yr[t+6]=f,yr[t+7]=l,kl(h,a)}}function qg(r,e,t,n,i,s){let{maxDepth:o,verbose:a,targetLeafSize:l,_strictLeafSize:c=1/0,strategy:h,onProgress:u}=i,d=r.primitiveBuffer,f=r.primitiveBufferStride,p=new Float32Array(6),g=!1,y=new jn;return mr(e,t,n,y.boundingData,p),_(y,t,n,p),y;function v(S){u&&u((S-s.offset)/s.count)}function _(S,x,m,b=null,w=0){!g&&w>=o&&(g=!0,a&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));let E=m>c;if(m<=l&&!E||w>=o)return v(x+m),S.offset=x,S.count=m,S;let P=Su(S.boundingData,b,e,x,m,h),A=P.axis===-1?-1:bu(d,f,e,x,m,P);if(P.axis===-1||A===x||A===x+m){if(!E)return v(x+m),S.offset=x,S.count=m,S;P.axis=Math.max(0,qi(S.boundingData)),A=x+Math.max(1,Math.floor(m/2))}S.splitAxis=P.axis;let D=new jn,R=x,F=A-x;S.left=D,mr(e,R,F,D.boundingData,p),_(D,R,F,p,w+1);let k=new jn,H=A,re=m-F;return S.right=k,mr(e,H,re,k.boundingData,p),_(k,H,re,p,w+1),S}}function Eu(r,e){let t=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=r.getRootRanges(e.range),i=n[0],s=n[n.length-1],o={offset:i.offset,count:s.offset+s.count-i.offset},a=new Float32Array(6*o.count);a.offset=o.offset,r.computePrimitiveBounds(o.offset,o.count,a),r._roots=n.map(l=>{let c=qg(r,a,l.offset,l.count,e,o),h=xr(c),u=new t(32*h);return Tu(0,c,u),u})}var Vt=class{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){let e=this._primitives;return e.length===0?this._getNewPrimitive():e.pop()}releasePrimitive(e){this._primitives.push(e)}};var Vl=class{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;let e=[],t=null;this.setBuffer=n=>{t&&e.push(t),t=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0&&this.setBuffer(e.pop())}}},j=new Vl;var zt,ei,Qn=[],vr=new Vt(()=>new Q);function Cu(r,e,t,n,i,s){zt=vr.getPrimitive(),ei=vr.getPrimitive(),Qn.push(zt,ei),j.setBuffer(r._roots[e]);let o=zl(0,r.geometry,t,n,i,s);j.clearBuffer(),vr.releasePrimitive(zt),vr.releasePrimitive(ei),Qn.pop(),Qn.pop();let a=Qn.length;return a>0&&(ei=Qn[a-1],zt=Qn[a-2]),o}function zl(r,e,t,n,i=null,s=0,o=0){let{float32Array:a,uint16Array:l,uint32Array:c}=j,h=r*2;if(J(h,l)){let d=ie(r,c),f=oe(h,l);return ae(r,a,zt),n(d,f,!1,o,s+r/8,zt)}else{let A=function(R){let{uint16Array:F,uint32Array:k}=j,H=R*2;for(;!J(H,F);)R=te(R),H=R*2;return ie(R,k)},D=function(R){let{uint16Array:F,uint32Array:k}=j,H=R*2;for(;!J(H,F);)R=ne(R,k),H=R*2;return ie(R,k)+oe(H,F)},d=te(r),f=ne(r,c),p=d,g=f,y,v,_,S;if(i&&(_=zt,S=ei,ae(p,a,_),ae(g,a,S),y=i(_),v=i(S),v<y)){p=f,g=d;let R=y;y=v,v=R,_=S}_||(_=zt,ae(p,a,_));let x=J(p*2,l),m=t(_,x,y,o+1,s+p/8),b;if(m===2){let R=A(p),k=D(p)-R;b=n(R,k,!0,o+1,s+p/8,_)}else b=m&&zl(p,e,t,n,i,s,o+1);if(b)return!0;S=ei,ae(g,a,S);let w=J(g*2,l),E=t(S,w,v,o+1,s+g/8),P;if(E===2){let R=A(g),k=D(g)-R;P=n(R,k,!0,o+1,s+g/8,S)}else P=E&&zl(g,e,t,n,i,s,o+1);return!!P}}var $i=new j.constructor,_r=new j.constructor,Ht=new Vt(()=>new Q),ti=new Q,ni=new Q,Wl=new Q,Gl=new Q,Xl=!1;function Au(r,e,t,n){if(Xl)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");Xl=!0;let i=r._roots,s=e._roots,o,a=0,l=0,c=new q().copy(t).invert();for(let h=0,u=i.length;h<u;h++){$i.setBuffer(i[h]),l=0;let d=Ht.getPrimitive();ae(0,$i.float32Array,d),d.applyMatrix4(c);for(let f=0,p=s.length;f<p&&(_r.setBuffer(s[f]),o=st(0,0,t,c,n,a,l,0,0,d),_r.clearBuffer(),l+=s[f].byteLength/32,!o);f++);if(Ht.releasePrimitive(d),$i.clearBuffer(),a+=i[h].byteLength/32,o)break}return Xl=!1,o}function st(r,e,t,n,i,s=0,o=0,a=0,l=0,c=null,h=!1){let u,d;h?(u=_r,d=$i):(u=$i,d=_r);let f=u.float32Array,p=u.uint32Array,g=u.uint16Array,y=d.float32Array,v=d.uint32Array,_=d.uint16Array,S=r*2,x=e*2,m=J(S,g),b=J(x,_),w=!1;if(b&&m)h?w=i(ie(e,v),oe(e*2,_),ie(r,p),oe(r*2,g),l,o+e/8,a,s+r/8):w=i(ie(r,p),oe(r*2,g),ie(e,v),oe(e*2,_),a,s+r/8,l,o+e/8);else if(b){let E=Ht.getPrimitive();ae(e,y,E),E.applyMatrix4(t);let P=te(r),A=ne(r,p);ae(P,f,ti),ae(A,f,ni);let D=E.intersectsBox(ti),R=E.intersectsBox(ni);w=D&&st(e,P,n,t,i,o,s,l,a+1,E,!h)||R&&st(e,A,n,t,i,o,s,l,a+1,E,!h),Ht.releasePrimitive(E)}else{let E=te(e),P=ne(e,v);ae(E,y,Wl),ae(P,y,Gl);let A=c.intersectsBox(Wl),D=c.intersectsBox(Gl);if(A&&D)w=st(r,E,t,n,i,s,o,a,l+1,c,h)||st(r,P,t,n,i,s,o,a,l+1,c,h);else if(A)if(m)w=st(r,E,t,n,i,s,o,a,l+1,c,h);else{let R=Ht.getPrimitive();R.copy(Wl).applyMatrix4(t);let F=te(r),k=ne(r,p);ae(F,f,ti),ae(k,f,ni);let H=R.intersectsBox(ti),re=R.intersectsBox(ni);w=H&&st(E,F,n,t,i,o,s,l,a+1,R,!h)||re&&st(E,k,n,t,i,o,s,l,a+1,R,!h),Ht.releasePrimitive(R)}else if(D)if(m)w=st(r,P,t,n,i,s,o,a,l+1,c,h);else{let R=Ht.getPrimitive();R.copy(Gl).applyMatrix4(t);let F=te(r),k=ne(r,p);ae(F,f,ti),ae(k,f,ni);let H=R.intersectsBox(ti),re=R.intersectsBox(ni);w=H&&st(P,F,n,t,i,o,s,l,a+1,R,!h)||re&&st(P,k,n,t,i,o,s,l,a+1,R,!h),Ht.releasePrimitive(R)}}return w}var Sr=new class{constructor(){let r=null,e=null,t=null,n=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(s,o)=>{if(n)throw new Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");this.root=o,this.buffer=r=s._roots[o],this.uint16Array=t=new Uint16Array(r),this.uint32Array=e=new Uint32Array(r)},this.reset=()=>{this.root=null,this.buffer=r=null,this.uint16Array=t=null,this.uint32Array=e=null},this.getRangeStart=s=>{let o=s*2;for(;!J(o,t);)s=te(s),o=s*2;return ie(s,e)},this.getRangeEnd=s=>{let o=s*2;for(;!J(o,t);)s=ne(s,e),o=s*2;return ie(s,e)+oe(o,t)};let i=(s,o,a)=>{let l=o*2,c=J(l,t);if(!s(a,c,o)&&!c){let u=te(o),d=ne(o,e);i(s,u,a+1),i(s,d,a+1)}};this.traverseBuffer=s=>{if(n)throw new Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");n=!0;try{i(s,0,0)}finally{n=!1}},this.traverse=s=>{this.traverseBuffer((o,a,l)=>{if(a){let c=l*2,h=e[l+6],u=t[c+14];return s(o,a,new Float32Array(r,l*4,6),h,u)}else{let c=Zn(l,e);return s(o,a,new Float32Array(r,l*4,6),c)}})}}};var Ru=new Q,ii=new Float32Array(6),br=class{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(e){e={...pr,...e},"maxLeafSize"in e&&(console.warn('BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.'),e={...e,targetLeafSize:e.maxLeafSize}),Eu(this,e)}getRootRanges(){throw new Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw new Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(e,t,n,i){let s=1/0,o=1/0,a=1/0,l=-1/0,c=-1/0,h=-1/0;for(let u=e,d=e+t;u<d;u++){this.writePrimitiveBounds(u,ii,0);let[f,p,g,y,v,_]=ii;f<s&&(s=f),y>l&&(l=y),p<o&&(o=p),v>c&&(c=v),g<a&&(a=g),_>h&&(h=_)}return n[i+0]=s,n[i+1]=o,n[i+2]=a,n[i+3]=l,n[i+4]=c,n[i+5]=h,n}computePrimitiveBounds(e,t,n){let i=n.offset||0;for(let s=e,o=e+t;s<o;s++){this.writePrimitiveBounds(s,ii,0);let[a,l,c,h,u,d]=ii,f=(a+h)/2,p=(l+u)/2,g=(c+d)/2,y=(h-a)/2,v=(u-l)/2,_=(d-c)/2,S=(s-i)*6;n[S+0]=f,n[S+1]=y+(Math.abs(f)+y)*Kn,n[S+2]=p,n[S+3]=v+(Math.abs(p)+v)*Kn,n[S+4]=g,n[S+5]=_+(Math.abs(g)+_)*Kn}return n}shiftPrimitiveOffsets(e){let t=this._indirectBuffer;if(t)for(let n=0,i=t.length;n<i;n++)t[n]+=e;else{let n=this._roots;for(let i=0;i<n.length;i++){let s=n[i],o=new Uint32Array(s),a=new Uint16Array(s),l=s.byteLength/32;for(let c=0;c<l;c++){let h=8*c,u=2*h;J(u,a)&&(o[h+6]+=e)}}}}traverse(e,t=0){Sr.setBVH(this,t),Sr.traverse(e),Sr.reset()}refit(){let e=this._roots;for(let t=0,n=e.length;t<n;t++){let i=e[t],s=new Uint32Array(i),o=new Uint16Array(i),a=new Float32Array(i),l=i.byteLength/32;for(let c=l-1;c>=0;c--){let h=c*8,u=h*2;if(J(u,o)){let f=ie(h,s),p=oe(u,o);this.writePrimitiveRangeBounds(f,p,ii,0),a.set(ii,h)}else{let f=te(h),p=ne(h,s);for(let g=0;g<3;g++){let y=a[f+g],v=a[f+g+3],_=a[p+g],S=a[p+g+3];a[h+g]=y<_?y:_,a[h+g+3]=v>S?v:S}}}}}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach(n=>{ae(0,new Float32Array(n),Ru),e.union(Ru)}),e}shapecast(e){let{boundsTraverseOrder:t,intersectsBounds:n,intersectsRange:i,intersectsPrimitive:s,scratchPrimitive:o,iterate:a}=e;if(i&&s){let u=i;i=(d,f,p,g,y)=>u(d,f,p,g,y)?!0:a(d,f,this,s,p,g,o)}else i||(s?i=(u,d,f,p)=>a(u,d,this,s,f,p,o):i=(u,d,f)=>f);let l=!1,c=0,h=this._roots;for(let u=0,d=h.length;u<d;u++){let f=h[u];if(l=Cu(this,u,n,i,t,c),l)break;c+=f.byteLength/32}return l}bvhcast(e,t,n){let{intersectsRanges:i}=n;return Au(this,e,t,i)}};function Iu(){return typeof SharedArrayBuffer<"u"}function ql(r){return r.index?r.index.count:r.attributes.position.count}function Wt(r){return ql(r)/3}function $g(r,e=ArrayBuffer){return r>65535?new Uint32Array(new e(4*r)):new Uint16Array(new e(2*r))}function Pu(r,e){if(!r.index){let t=r.attributes.position.count,n=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,i=$g(t,n);r.setIndex(new _e(i,1));for(let s=0;s<t;s++)i[s]=s}}function Kg(r,e,t){let n=ql(r)/t,i=e||r.drawRange,s=i.start/t,o=(i.start+i.count)/t,a=Math.max(0,s),l=Math.min(n,o)-a;return{offset:Math.floor(a),count:Math.floor(l)}}function Jg(r,e){return r.groups.map(t=>({offset:t.start/e,count:t.count/e}))}function Yl(r,e,t){let n=Kg(r,e,t),i=Jg(r,t);if(!i.length)return[n];let s=[],o=n.offset,a=n.offset+n.count,l=ql(r)/t,c=[];for(let d of i){let{offset:f,count:p}=d,g=f,y=isFinite(p)?p:l-f,v=f+y;g<a&&v>o&&(c.push({pos:Math.max(o,g),isStart:!0}),c.push({pos:Math.min(a,v),isStart:!1}))}c.sort((d,f)=>d.pos!==f.pos?d.pos-f.pos:d.type==="end"?-1:1);let h=0,u=null;for(let d of c){let f=d.pos;h!==0&&f!==u&&s.push({offset:u,count:f-u}),h+=d.isStart?1:-1,u=f}return s}function Zg(r,e){let t=r[r.length-1],n=t.offset+t.count>2**16,i=r.reduce((c,h)=>c+h.count,0),s=n?4:2,o=e?new SharedArrayBuffer(i*s):new ArrayBuffer(i*s),a=n?new Uint32Array(o):new Uint16Array(o),l=0;for(let c=0;c<r.length;c++){let{offset:h,count:u}=r[c];for(let d=0;d<u;d++)a[l+d]=h+d;l+=u}return a}var Mr=class extends br{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(e){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(e){}constructor(e,t={}){if(e.isBufferGeometry){if(e.index&&e.index.isInterleavedBufferAttribute)throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("BVH: Only BufferGeometries are supported.");if(t.useSharedArrayBuffer&&!Iu())throw new Error("BVH: SharedArrayBuffer is not available.");super(),this.geometry=e,this.resolvePrimitiveIndex=t.indirect?n=>this._indirectBuffer[n]:n=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,t={...pr,...t},t[Xi]||this.init(t)}init(e){let{geometry:t,primitiveStride:n}=this;if(e.indirect){let i=Yl(t,e.range,n),s=Zg(i,e.useSharedArrayBuffer);this._indirectBuffer=s}else Pu(t,e);super.init(e),!t.boundingBox&&e.setBoundingBox&&(t.boundingBox=this.getBoundingBox(new Q))}getRootRanges(e){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:Yl(this.geometry,e,this.primitiveStride)}raycastObject3D(){throw new Error("BVH: raycastObject3D() not implemented")}};var $e=class{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let n=1/0,i=-1/0;for(let s=0,o=e.length;s<o;s++){let l=e[s][t];n=l<n?l:n,i=l>i?l:i}this.min=n,this.max=i}setFromPoints(e,t){let n=1/0,i=-1/0;for(let s=0,o=t.length;s<o;s++){let a=t[s],l=e.dot(a);n=l<n?l:n,i=l>i?l:i}this.min=n,this.max=i}isSeparated(e){return this.min>e.max||e.min>this.max}};$e.prototype.setFromBox=(function(){let r=new M;return function(t,n){let i=n.min,s=n.max,o=1/0,a=-1/0;for(let l=0;l<=1;l++)for(let c=0;c<=1;c++)for(let h=0;h<=1;h++){r.x=i.x*l+s.x*(1-l),r.y=i.y*c+s.y*(1-c),r.z=i.z*h+s.z*(1-h);let u=t.dot(r);o=Math.min(u,o),a=Math.max(u,a)}this.min=o,this.max=a}})();var jg=(function(){let r=new M,e=new M,t=new M;return function(i,s,o){let a=i.start,l=r,c=s.start,h=e;t.subVectors(a,c),r.subVectors(i.end,i.start),e.subVectors(s.end,s.start);let u=t.dot(h),d=h.dot(l),f=h.dot(h),p=t.dot(l),y=l.dot(l)*f-d*d,v,_;y!==0?v=(u*d-p*f)/y:v=0,_=(u+v*d)/f,o.x=v,o.y=_}})(),Ki=(function(){let r=new ee,e=new M,t=new M;return function(i,s,o,a){jg(i,s,r);let l=r.x,c=r.y;if(l>=0&&l<=1&&c>=0&&c<=1){i.at(l,o),s.at(c,a);return}else if(l>=0&&l<=1){c<0?s.at(0,a):s.at(1,a),i.closestPointToPoint(a,!0,o);return}else if(c>=0&&c<=1){l<0?i.at(0,o):i.at(1,o),s.closestPointToPoint(o,!0,a);return}else{let h;l<0?h=i.start:h=i.end;let u;c<0?u=s.start:u=s.end;let d=e,f=t;if(i.closestPointToPoint(u,!0,e),s.closestPointToPoint(h,!0,t),d.distanceToSquared(u)<=f.distanceToSquared(h)){o.copy(d),a.copy(u);return}else{o.copy(h),a.copy(f);return}}}})(),Lu=(function(){let r=new M,e=new M,t=new qe,n=new Ue;return function(s,o){let{radius:a,center:l}=s,{a:c,b:h,c:u}=o;if(n.start=c,n.end=h,n.closestPointToPoint(l,!0,r).distanceTo(l)<=a||(n.start=c,n.end=u,n.closestPointToPoint(l,!0,r).distanceTo(l)<=a)||(n.start=h,n.end=u,n.closestPointToPoint(l,!0,r).distanceTo(l)<=a))return!0;let g=o.getPlane(t);if(Math.abs(g.distanceToPoint(l))<=a){let v=g.projectPoint(l,e);if(o.containsPoint(v))return!0}return!1}})();var Qg=["x","y","z"],Tt=1e-15,Du=Tt*Tt;function je(r){return Math.abs(r)<Tt}var Te=class extends Pe{constructor(...e){super(...e),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new M),this.satBounds=new Array(4).fill().map(()=>new $e),this.points=[this.a,this.b,this.c],this.plane=new qe,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new Ue,this.needsUpdate=!0}intersectsSphere(e){return Lu(e,this)}update(){let e=this.a,t=this.b,n=this.c,i=this.points,s=this.satAxes,o=this.satBounds,a=s[0],l=o[0];this.getNormal(a),l.setFromPoints(a,i);let c=s[1],h=o[1];c.subVectors(e,t),h.setFromPoints(c,i);let u=s[2],d=o[2];u.subVectors(t,n),d.setFromPoints(u,i);let f=s[3],p=o[3];f.subVectors(n,e),p.setFromPoints(f,i);let g=c.length(),y=u.length(),v=f.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,g<Tt?y<Tt||v<Tt?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(n)):y<Tt?v<Tt?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(e)):v<Tt&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(t)),this.plane.setFromNormalAndCoplanarPoint(a,e),this.needsUpdate=!1}};Te.prototype.closestPointToSegment=(function(){let r=new M,e=new M,t=new Ue;return function(i,s=null,o=null){let{start:a,end:l}=i,c=this.points,h,u=1/0;for(let d=0;d<3;d++){let f=(d+1)%3;t.start.copy(c[d]),t.end.copy(c[f]),Ki(t,i,r,e),h=r.distanceToSquared(e),h<u&&(u=h,s&&s.copy(r),o&&o.copy(e))}return this.closestPointToPoint(a,r),h=a.distanceToSquared(r),h<u&&(u=h,s&&s.copy(r),o&&o.copy(a)),this.closestPointToPoint(l,r),h=l.distanceToSquared(r),h<u&&(u=h,s&&s.copy(r),o&&o.copy(l)),Math.sqrt(u)}})();Te.prototype.intersectsTriangle=(function(){let r=new Te,e=new $e,t=new $e,n=new M,i=new M,s=new M,o=new M,a=new Ue,l=new Ue,c=new M,h=new ee,u=new ee;function d(S,x,m,b){let w=n;!S.isDegenerateIntoPoint&&!S.isDegenerateIntoSegment?w.copy(S.plane.normal):w.copy(x.plane.normal);let E=S.satBounds,P=S.satAxes;for(let R=1;R<4;R++){let F=E[R],k=P[R];if(e.setFromPoints(k,x.points),F.isSeparated(e)||(o.copy(w).cross(k),e.setFromPoints(o,S.points),t.setFromPoints(o,x.points),e.isSeparated(t)))return!1}let A=x.satBounds,D=x.satAxes;for(let R=1;R<4;R++){let F=A[R],k=D[R];if(e.setFromPoints(k,S.points),F.isSeparated(e)||(o.crossVectors(w,k),e.setFromPoints(o,S.points),t.setFromPoints(o,x.points),e.isSeparated(t)))return!1}return m&&(b||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),m.start.set(0,0,0),m.end.set(0,0,0)),!0}function f(S,x,m,b,w,E,P,A,D,R,F){let k=P/(P-A);R.x=b+(w-b)*k,F.start.subVectors(x,S).multiplyScalar(k).add(S),k=P/(P-D),R.y=b+(E-b)*k,F.end.subVectors(m,S).multiplyScalar(k).add(S)}function p(S,x,m,b,w,E,P,A,D,R,F){if(w>0)f(S.c,S.a,S.b,b,x,m,D,P,A,R,F);else if(E>0)f(S.b,S.a,S.c,m,x,b,A,P,D,R,F);else if(A*D>0||P!=0)f(S.a,S.b,S.c,x,m,b,P,A,D,R,F);else if(A!=0)f(S.b,S.a,S.c,m,x,b,A,P,D,R,F);else if(D!=0)f(S.c,S.a,S.b,b,x,m,D,P,A,R,F);else return!0;return!1}function g(S,x,m,b){let w=x.degenerateSegment,E=S.plane.distanceToPoint(w.start),P=S.plane.distanceToPoint(w.end);return je(E)?je(P)?d(S,x,m,b):(m&&(m.start.copy(w.start),m.end.copy(w.start)),S.containsPoint(w.start)):je(P)?(m&&(m.start.copy(w.end),m.end.copy(w.end)),S.containsPoint(w.end)):S.plane.intersectLine(w,n)!=null?(m&&(m.start.copy(n),m.end.copy(n)),S.containsPoint(n)):!1}function y(S,x,m){let b=x.a;return je(S.plane.distanceToPoint(b))&&S.containsPoint(b)?(m&&(m.start.copy(b),m.end.copy(b)),!0):!1}function v(S,x,m){let b=S.degenerateSegment,w=x.a;return b.closestPointToPoint(w,!0,n),w.distanceToSquared(n)<Du?(m&&(m.start.copy(w),m.end.copy(w)),!0):!1}function _(S,x,m,b){if(S.isDegenerateIntoSegment)if(x.isDegenerateIntoSegment){let w=S.degenerateSegment,E=x.degenerateSegment,P=i,A=s;w.delta(P),E.delta(A);let D=n.subVectors(E.start,w.start),R=P.x*A.y-P.y*A.x;if(je(R))return!1;let F=(D.x*A.y-D.y*A.x)/R,k=-(P.x*D.y-P.y*D.x)/R;if(F<0||F>1||k<0||k>1)return!1;let H=w.start.z+P.z*F,re=E.start.z+A.z*k;return je(H-re)?(m&&(m.start.copy(w.start).addScaledVector(P,F),m.end.copy(w.start).addScaledVector(P,F)),!0):!1}else return x.isDegenerateIntoPoint?v(S,x,m):g(x,S,m,b);else{if(S.isDegenerateIntoPoint)return x.isDegenerateIntoPoint?x.a.distanceToSquared(S.a)<Du?(m&&(m.start.copy(S.a),m.end.copy(S.a)),!0):!1:x.isDegenerateIntoSegment?v(x,S,m):y(x,S,m);if(x.isDegenerateIntoPoint)return y(S,x,m);if(x.isDegenerateIntoSegment)return g(S,x,m,b)}}return function(x,m=null,b=!1){this.needsUpdate&&this.update(),x.isExtendedTriangle?x.needsUpdate&&x.update():(r.copy(x),r.update(),x=r);let w=_(this,x,m,b);if(w!==void 0)return w;let E=this.plane,P=x.plane,A=P.distanceToPoint(this.a),D=P.distanceToPoint(this.b),R=P.distanceToPoint(this.c);je(A)&&(A=0),je(D)&&(D=0),je(R)&&(R=0);let F=A*D,k=A*R;if(F>0&&k>0)return!1;let H=E.distanceToPoint(x.a),re=E.distanceToPoint(x.b),ft=E.distanceToPoint(x.c);je(H)&&(H=0),je(re)&&(re=0),je(ft)&&(ft=0);let Kt=H*re,Jt=H*ft;if(Kt>0&&Jt>0)return!1;i.copy(E.normal),s.copy(P.normal);let Ct=i.cross(s),At=0,Ra=Math.abs(Ct.x),Ih=Math.abs(Ct.y);Ih>Ra&&(Ra=Ih,At=1),Math.abs(Ct.z)>Ra&&(At=2);let wn=Qg[At],qd=this.a[wn],Yd=this.b[wn],$d=this.c[wn],Kd=x.a[wn],Jd=x.b[wn],Zd=x.c[wn];if(p(this,qd,Yd,$d,F,k,A,D,R,h,a))return d(this,x,m,b);if(p(x,Kd,Jd,Zd,Kt,Jt,H,re,ft,u,l))return d(this,x,m,b);if(h.y<h.x){let Ia=h.y;h.y=h.x,h.x=Ia,c.copy(a.start),a.start.copy(a.end),a.end.copy(c)}if(u.y<u.x){let Ia=u.y;u.y=u.x,u.x=Ia,c.copy(l.start),l.start.copy(l.end),l.end.copy(c)}return h.y<u.x||u.y<h.x?!1:(m&&(u.x>h.x?m.start.copy(l.start):m.start.copy(a.start),u.y<h.y?m.end.copy(l.end):m.end.copy(a.end)),!0)}})();Te.prototype.distanceToPoint=(function(){let r=new M;return function(t){return this.closestPointToPoint(t,r),t.distanceTo(r)}})();Te.prototype.distanceToTriangle=(function(){let r=new M,e=new M,t=["a","b","c"],n=new Ue,i=new Ue;return function(o,a=null,l=null){let c=a||l?n:null;if(this.intersectsTriangle(o,c,!0))return(a||l)&&(a&&c.getCenter(a),l&&c.getCenter(l)),0;let h=1/0;for(let u=0;u<3;u++){let d,f=t[u],p=o[f];this.closestPointToPoint(p,r),d=p.distanceToSquared(r),d<h&&(h=d,a&&a.copy(r),l&&l.copy(p));let g=this[f];o.closestPointToPoint(g,r),d=g.distanceToSquared(r),d<h&&(h=d,a&&a.copy(g),l&&l.copy(r))}for(let u=0;u<3;u++){let d=t[u],f=t[(u+1)%3];n.set(this[d],this[f]);for(let p=0;p<3;p++){let g=t[p],y=t[(p+1)%3];i.set(o[g],o[y]),Ki(n,i,r,e);let v=r.distanceToSquared(e);v<h&&(h=v,a&&a.copy(r),l&&l.copy(e))}}return Math.sqrt(h)}})();var me=class{constructor(e,t,n){this.isOrientedBox=!0,this.min=new M,this.max=new M,this.matrix=new q,this.invMatrix=new q,this.points=new Array(8).fill().map(()=>new M),this.satAxes=new Array(3).fill().map(()=>new M),this.satBounds=new Array(3).fill().map(()=>new $e),this.alignedSatBounds=new Array(3).fill().map(()=>new $e),this.needsUpdate=!1,e&&this.min.copy(e),t&&this.max.copy(t),n&&this.matrix.copy(n)}set(e,t,n){this.min.copy(e),this.max.copy(t),this.matrix.copy(n),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}};me.prototype.update=(function(){return function(){let e=this.matrix,t=this.min,n=this.max,i=this.points;for(let c=0;c<=1;c++)for(let h=0;h<=1;h++)for(let u=0;u<=1;u++){let d=1*c|2*h|4*u,f=i[d];f.x=c?n.x:t.x,f.y=h?n.y:t.y,f.z=u?n.z:t.z,f.applyMatrix4(e)}let s=this.satBounds,o=this.satAxes,a=i[0];for(let c=0;c<3;c++){let h=o[c],u=s[c],d=1<<c,f=i[d];h.subVectors(a,f),u.setFromPoints(h,i)}let l=this.alignedSatBounds;l[0].setFromPointsField(i,"x"),l[1].setFromPointsField(i,"y"),l[2].setFromPointsField(i,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();me.prototype.intersectsBox=(function(){let r=new $e;return function(t){this.needsUpdate&&this.update();let n=t.min,i=t.max,s=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(r.min=n.x,r.max=i.x,a[0].isSeparated(r)||(r.min=n.y,r.max=i.y,a[1].isSeparated(r))||(r.min=n.z,r.max=i.z,a[2].isSeparated(r)))return!1;for(let l=0;l<3;l++){let c=o[l],h=s[l];if(r.setFromBox(c,t),h.isSeparated(r))return!1}return!0}})();me.prototype.intersectsTriangle=(function(){let r=new Te,e=new Array(3),t=new $e,n=new $e,i=new M;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(r.copy(o),r.update(),o=r);let a=this.satBounds,l=this.satAxes;e[0]=o.a,e[1]=o.b,e[2]=o.c;for(let d=0;d<3;d++){let f=a[d],p=l[d];if(t.setFromPoints(p,e),f.isSeparated(t))return!1}let c=o.satBounds,h=o.satAxes,u=this.points;for(let d=0;d<3;d++){let f=c[d],p=h[d];if(t.setFromPoints(p,u),f.isSeparated(t))return!1}for(let d=0;d<3;d++){let f=l[d];for(let p=0;p<4;p++){let g=h[p];if(i.crossVectors(f,g),t.setFromPoints(i,e),n.setFromPoints(i,u),t.isSeparated(n))return!1}}return!0}})();me.prototype.closestPointToPoint=(function(){return function(e,t){return this.needsUpdate&&this.update(),t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),t}})();me.prototype.distanceToPoint=(function(){let r=new M;return function(t){return this.closestPointToPoint(t,r),t.distanceTo(r)}})();me.prototype.distanceToBox=(function(){let r=["x","y","z"],e=new Array(12).fill().map(()=>new Ue),t=new Array(12).fill().map(()=>new Ue),n=new M,i=new M;return function(o,a=0,l=null,c=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(l||c)&&(o.getCenter(i),this.closestPointToPoint(i,n),o.closestPointToPoint(n,i),l&&l.copy(n),c&&c.copy(i)),0;let h=a*a,u=o.min,d=o.max,f=this.points,p=1/0;for(let y=0;y<8;y++){let v=f[y];i.copy(v).clamp(u,d);let _=v.distanceToSquared(i);if(_<p&&(p=_,l&&l.copy(v),c&&c.copy(i),_<h))return Math.sqrt(_)}let g=0;for(let y=0;y<3;y++)for(let v=0;v<=1;v++)for(let _=0;_<=1;_++){let S=(y+1)%3,x=(y+2)%3,m=v<<S|_<<x,b=1<<y|v<<S|_<<x,w=f[m],E=f[b];e[g].set(w,E);let A=r[y],D=r[S],R=r[x],F=t[g],k=F.start,H=F.end;k[A]=u[A],k[D]=v?u[D]:d[D],k[R]=_?u[R]:d[D],H[A]=d[A],H[D]=v?u[D]:d[D],H[R]=_?u[R]:d[D],g++}for(let y=0;y<=1;y++)for(let v=0;v<=1;v++)for(let _=0;_<=1;_++){i.x=y?d.x:u.x,i.y=v?d.y:u.y,i.z=_?d.z:u.z,this.closestPointToPoint(i,n);let S=i.distanceToSquared(n);if(S<p&&(p=S,l&&l.copy(n),c&&c.copy(i),S<h))return Math.sqrt(S)}for(let y=0;y<12;y++){let v=e[y];for(let _=0;_<12;_++){let S=t[_];Ki(v,S,n,i);let x=n.distanceToSquared(i);if(x<p&&(p=x,l&&l.copy(n),c&&c.copy(i),x<h))return Math.sqrt(x)}}return Math.sqrt(p)}})();var $l=class extends Vt{constructor(){super(()=>new Te)}},Be=new $l;var Ji=new M,Kl=new M;function Fu(r,e,t={},n=0,i=1/0){let s=n*n,o=i*i,a=1/0,l=null;if(r.shapecast({boundsTraverseOrder:h=>(Ji.copy(e).clamp(h.min,h.max),Ji.distanceToSquared(e)),intersectsBounds:(h,u,d)=>d<a&&d<o,intersectsTriangle:(h,u)=>{h.closestPointToPoint(e,Ji);let d=e.distanceToSquared(Ji);return d<a&&(Kl.copy(Ji),a=d,l=u),d<s}}),a===1/0)return null;let c=Math.sqrt(a);return t.point?t.point.copy(Kl):t.point=Kl.clone(),t.distance=c,t.faceIndex=l,t}var wr=parseInt("180")>=169,ey=parseInt("180")<=161,fn=new M,pn=new M,mn=new M,Tr=new ee,Er=new ee,Cr=new ee,Nu=new M,Uu=new M,Ou=new M,Zi=new M;function ty(r,e,t,n,i,s,o,a){let l;if(s===fr?l=r.intersectTriangle(n,t,e,!0,i):l=r.intersectTriangle(e,t,n,s!==Wi,i),l===null)return null;let c=r.origin.distanceTo(i);return c<o||c>a?null:{distance:c,point:i.clone()}}function Bu(r,e,t,n,i,s,o,a,l,c,h){fn.fromBufferAttribute(e,s),pn.fromBufferAttribute(e,o),mn.fromBufferAttribute(e,a);let u=ty(r,fn,pn,mn,Zi,l,c,h);if(u){if(n){Tr.fromBufferAttribute(n,s),Er.fromBufferAttribute(n,o),Cr.fromBufferAttribute(n,a),u.uv=new ee;let f=Pe.getInterpolation(Zi,fn,pn,mn,Tr,Er,Cr,u.uv);wr||(u.uv=f)}if(i){Tr.fromBufferAttribute(i,s),Er.fromBufferAttribute(i,o),Cr.fromBufferAttribute(i,a),u.uv1=new ee;let f=Pe.getInterpolation(Zi,fn,pn,mn,Tr,Er,Cr,u.uv1);wr||(u.uv1=f),ey&&(u.uv2=u.uv1)}if(t){Nu.fromBufferAttribute(t,s),Uu.fromBufferAttribute(t,o),Ou.fromBufferAttribute(t,a),u.normal=new M;let f=Pe.getInterpolation(Zi,fn,pn,mn,Nu,Uu,Ou,u.normal);u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1),wr||(u.normal=f)}let d={a:s,b:o,c:a,normal:new M,materialIndex:0};if(Pe.getNormal(fn,pn,mn,d.normal),u.face=d,u.faceIndex=s,wr){let f=new M;Pe.getBarycoord(Zi,fn,pn,mn,f),u.barycoord=f}}return u}function ku(r){return r&&r.isMaterial?r.side:r}function si(r,e,t,n,i,s,o){let a=n*3,l=a+0,c=a+1,h=a+2,{index:u,groups:d}=r;r.index&&(l=u.getX(l),c=u.getX(c),h=u.getX(h));let{position:f,normal:p,uv:g,uv1:y}=r.attributes;if(Array.isArray(e)){let v=n*3;for(let _=0,S=d.length;_<S;_++){let{start:x,count:m,materialIndex:b}=d[_];if(v>=x&&v<x+m){let w=ku(e[b]),E=Bu(t,f,p,g,y,l,c,h,w,s,o);if(E)if(E.faceIndex=n,E.face.materialIndex=b,i)i.push(E);else return E}}}else{let v=ku(e),_=Bu(t,f,p,g,y,l,c,h,v,s,o);if(_)if(_.faceIndex=n,_.face.materialIndex=0,i)i.push(_);else return _}return null}function le(r,e,t,n){let i=r.a,s=r.b,o=r.c,a=e,l=e+1,c=e+2;t&&(a=t.getX(a),l=t.getX(l),c=t.getX(c)),i.x=n.getX(a),i.y=n.getY(a),i.z=n.getZ(a),s.x=n.getX(l),s.y=n.getY(l),s.z=n.getZ(l),o.x=n.getX(c),o.y=n.getY(c),o.z=n.getZ(c)}function Vu(r,e,t,n,i,s,o,a){let{geometry:l,_indirectBuffer:c}=r;for(let h=n,u=n+i;h<u;h++)si(l,e,t,h,s,o,a)}function zu(r,e,t,n,i,s,o){let{geometry:a,_indirectBuffer:l}=r,c=1/0,h=null;for(let u=n,d=n+i;u<d;u++){let f;f=si(a,e,t,u,null,s,o),f&&f.distance<c&&(h=f,c=f.distance)}return h}function Hu(r,e,t,n,i,s,o){let{geometry:a}=t,{index:l}=a,c=a.attributes.position;for(let h=r,u=e+r;h<u;h++){let d;if(d=h,le(o,d*3,l,c),o.needsUpdate=!0,n(o,d,i,s))return!0}return!1}function Wu(r,e=null){e&&Array.isArray(e)&&(e=new Set(e));let t=r.geometry,n=t.index?t.index.array:null,i=t.attributes.position,s,o,a,l,c=0,h=r._roots;for(let d=0,f=h.length;d<f;d++)s=h[d],o=new Uint32Array(s),a=new Uint16Array(s),l=new Float32Array(s),u(0,c),c+=s.byteLength;function u(d,f,p=!1){let g=d*2;if(J(g,a)){let y=ie(d,o),v=oe(g,a),_=1/0,S=1/0,x=1/0,m=-1/0,b=-1/0,w=-1/0;for(let E=3*y,P=3*(y+v);E<P;E++){let A=n[E],D=i.getX(A),R=i.getY(A),F=i.getZ(A);D<_&&(_=D),D>m&&(m=D),R<S&&(S=R),R>b&&(b=R),F<x&&(x=F),F>w&&(w=F)}return l[d+0]!==_||l[d+1]!==S||l[d+2]!==x||l[d+3]!==m||l[d+4]!==b||l[d+5]!==w?(l[d+0]=_,l[d+1]=S,l[d+2]=x,l[d+3]=m,l[d+4]=b,l[d+5]=w,!0):!1}else{let y=te(d),v=ne(d,o),_=p,S=!1,x=!1;if(e){if(!_){let A=y/8+f/32,D=v/8+f/32;S=e.has(A),x=e.has(D),_=!S&&!x}}else S=!0,x=!0;let m=_||S,b=_||x,w=!1;m&&(w=u(y,f,_));let E=!1;b&&(E=u(v,f,_));let P=w||E;if(P)for(let A=0;A<3;A++){let D=y+A,R=v+A,F=l[D],k=l[D+3],H=l[R],re=l[R+3];l[d+A]=F<H?F:H,l[d+A+3]=k>re?k:re}return P}}}function Qe(r,e,t,n,i){let s,o,a,l,c,h,u=1/t.direction.x,d=1/t.direction.y,f=1/t.direction.z,p=t.origin.x,g=t.origin.y,y=t.origin.z,v=e[r],_=e[r+3],S=e[r+1],x=e[r+3+1],m=e[r+2],b=e[r+3+2];return u>=0?(s=(v-p)*u,o=(_-p)*u):(s=(_-p)*u,o=(v-p)*u),d>=0?(a=(S-g)*d,l=(x-g)*d):(a=(x-g)*d,l=(S-g)*d),s>l||a>o||((a>s||isNaN(s))&&(s=a),(l<o||isNaN(o))&&(o=l),f>=0?(c=(m-y)*f,h=(b-y)*f):(c=(b-y)*f,h=(m-y)*f),s>h||c>o)?!1:((c>s||s!==s)&&(s=c),(h<o||o!==o)&&(o=h),s<=i&&o>=n)}function Gu(r,e,t,n,i,s,o,a){let{geometry:l,_indirectBuffer:c}=r;for(let h=n,u=n+i;h<u;h++){let d=c?c[h]:h;si(l,e,t,d,s,o,a)}}function Xu(r,e,t,n,i,s,o){let{geometry:a,_indirectBuffer:l}=r,c=1/0,h=null;for(let u=n,d=n+i;u<d;u++){let f;f=si(a,e,t,l?l[u]:u,null,s,o),f&&f.distance<c&&(h=f,c=f.distance)}return h}function qu(r,e,t,n,i,s,o){let{geometry:a}=t,{index:l}=a,c=a.attributes.position;for(let h=r,u=e+r;h<u;h++){let d;if(d=t.resolveTriangleIndex(h),le(o,d*3,l,c),o.needsUpdate=!0,n(o,d,i,s))return!0}return!1}function Yu(r,e,t,n,i,s,o){j.setBuffer(r._roots[e]),Jl(0,r,t,n,i,s,o),j.clearBuffer()}function Jl(r,e,t,n,i,s,o){let{float32Array:a,uint16Array:l,uint32Array:c}=j,h=r*2;if(J(h,l)){let d=ie(r,c),f=oe(h,l);Vu(e,t,n,d,f,i,s,o)}else{let d=te(r);Qe(d,a,n,s,o)&&Jl(d,e,t,n,i,s,o);let f=ne(r,c);Qe(f,a,n,s,o)&&Jl(f,e,t,n,i,s,o)}}var ny=["x","y","z"];function $u(r,e,t,n,i,s){j.setBuffer(r._roots[e]);let o=Zl(0,r,t,n,i,s);return j.clearBuffer(),o}function Zl(r,e,t,n,i,s){let{float32Array:o,uint16Array:a,uint32Array:l}=j,c=r*2;if(J(c,a)){let u=ie(r,l),d=oe(c,a);return zu(e,t,n,u,d,i,s)}else{let u=Zn(r,l),d=ny[u],p=n.direction[d]>=0,g,y;p?(g=te(r),y=ne(r,l)):(g=ne(r,l),y=te(r));let _=Qe(g,o,n,i,s)?Zl(g,e,t,n,i,s):null;if(_){let m=_.point[d];if(p?m<=o[y+u]:m>=o[y+u+3])return _}let x=Qe(y,o,n,i,s)?Zl(y,e,t,n,i,s):null;return _&&x?_.distance<=x.distance?_:x:_||x||null}}var Ar=new Q,ri=new Te,oi=new Te,ji=new q,Ku=new me,Rr=new me;function Ju(r,e,t,n){j.setBuffer(r._roots[e]);let i=jl(0,r,t,n);return j.clearBuffer(),i}function jl(r,e,t,n,i=null){let{float32Array:s,uint16Array:o,uint32Array:a}=j,l=r*2;if(i===null&&(t.boundingBox||t.computeBoundingBox(),Ku.set(t.boundingBox.min,t.boundingBox.max,n),i=Ku),J(l,o)){let h=e.geometry,u=h.index,d=h.attributes.position,f=t.index,p=t.attributes.position,g=ie(r,a),y=oe(l,o);if(ji.copy(n).invert(),t.boundsTree)return ae(r,s,Rr),Rr.matrix.copy(ji),Rr.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:_=>Rr.intersectsBox(_),intersectsTriangle:_=>{_.a.applyMatrix4(n),_.b.applyMatrix4(n),_.c.applyMatrix4(n),_.needsUpdate=!0;for(let S=g*3,x=(y+g)*3;S<x;S+=3)if(le(oi,S,u,d),oi.needsUpdate=!0,_.intersectsTriangle(oi))return!0;return!1}});{let v=Wt(t);for(let _=g*3,S=(y+g)*3;_<S;_+=3){le(ri,_,u,d),ri.a.applyMatrix4(ji),ri.b.applyMatrix4(ji),ri.c.applyMatrix4(ji),ri.needsUpdate=!0;for(let x=0,m=v*3;x<m;x+=3)if(le(oi,x,f,p),oi.needsUpdate=!0,ri.intersectsTriangle(oi))return!0}}}else{let h=te(r),u=ne(r,a);return ae(h,s,Ar),!!(i.intersectsBox(Ar)&&jl(h,e,t,n,i)||(ae(u,s,Ar),i.intersectsBox(Ar)&&jl(u,e,t,n,i)))}}var Ir=new q,Ql=new me,Qi=new me,iy=new M,sy=new M,ry=new M,oy=new M;function Zu(r,e,t,n={},i={},s=0,o=1/0){e.boundingBox||e.computeBoundingBox(),Ql.set(e.boundingBox.min,e.boundingBox.max,t),Ql.needsUpdate=!0;let a=r.geometry,l=a.attributes.position,c=a.index,h=e.attributes.position,u=e.index,d=Be.getPrimitive(),f=Be.getPrimitive(),p=iy,g=sy,y=null,v=null;i&&(y=ry,v=oy);let _=1/0,S=null,x=null;return Ir.copy(t).invert(),Qi.matrix.copy(Ir),r.shapecast({boundsTraverseOrder:m=>Ql.distanceToBox(m),intersectsBounds:(m,b,w)=>w<_&&w<o?(b&&(Qi.min.copy(m.min),Qi.max.copy(m.max),Qi.needsUpdate=!0),!0):!1,intersectsRange:(m,b)=>{if(e.boundsTree)return e.boundsTree.shapecast({boundsTraverseOrder:E=>Qi.distanceToBox(E),intersectsBounds:(E,P,A)=>A<_&&A<o,intersectsRange:(E,P)=>{for(let A=E,D=E+P;A<D;A++){le(f,3*A,u,h),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let R=m,F=m+b;R<F;R++){le(d,3*R,c,l),d.needsUpdate=!0;let k=d.distanceToTriangle(f,p,y);if(k<_&&(g.copy(p),v&&v.copy(y),_=k,S=R,x=A),k<s)return!0}}}});{let w=Wt(e);for(let E=0,P=w;E<P;E++){le(f,3*E,u,h),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let A=m,D=m+b;A<D;A++){le(d,3*A,c,l),d.needsUpdate=!0;let R=d.distanceToTriangle(f,p,y);if(R<_&&(g.copy(p),v&&v.copy(y),_=R,S=A,x=E),R<s)return!0}}}}}),Be.releasePrimitive(d),Be.releasePrimitive(f),_===1/0?null:(n.point?n.point.copy(g):n.point=g.clone(),n.distance=_,n.faceIndex=S,i&&(i.point?i.point.copy(v):i.point=v.clone(),i.point.applyMatrix4(Ir),g.applyMatrix4(Ir),i.distance=g.sub(i.point).length(),i.faceIndex=x),n)}function ju(r,e=null){e&&Array.isArray(e)&&(e=new Set(e));let t=r.geometry,n=t.index?t.index.array:null,i=t.attributes.position,s,o,a,l,c=0,h=r._roots;for(let d=0,f=h.length;d<f;d++)s=h[d],o=new Uint32Array(s),a=new Uint16Array(s),l=new Float32Array(s),u(0,c),c+=s.byteLength;function u(d,f,p=!1){let g=d*2;if(J(g,a)){let y=ie(d,o),v=oe(g,a),_=1/0,S=1/0,x=1/0,m=-1/0,b=-1/0,w=-1/0;for(let E=y,P=y+v;E<P;E++){let A=3*r.resolveTriangleIndex(E);for(let D=0;D<3;D++){let R=A+D;R=n?n[R]:R;let F=i.getX(R),k=i.getY(R),H=i.getZ(R);F<_&&(_=F),F>m&&(m=F),k<S&&(S=k),k>b&&(b=k),H<x&&(x=H),H>w&&(w=H)}}return l[d+0]!==_||l[d+1]!==S||l[d+2]!==x||l[d+3]!==m||l[d+4]!==b||l[d+5]!==w?(l[d+0]=_,l[d+1]=S,l[d+2]=x,l[d+3]=m,l[d+4]=b,l[d+5]=w,!0):!1}else{let y=te(d),v=ne(d,o),_=p,S=!1,x=!1;if(e){if(!_){let A=y/8+f/32,D=v/8+f/32;S=e.has(A),x=e.has(D),_=!S&&!x}}else S=!0,x=!0;let m=_||S,b=_||x,w=!1;m&&(w=u(y,f,_));let E=!1;b&&(E=u(v,f,_));let P=w||E;if(P)for(let A=0;A<3;A++){let D=y+A,R=v+A,F=l[D],k=l[D+3],H=l[R],re=l[R+3];l[d+A]=F<H?F:H,l[d+A+3]=k>re?k:re}return P}}}function Qu(r,e,t,n,i,s,o){j.setBuffer(r._roots[e]),ec(0,r,t,n,i,s,o),j.clearBuffer()}function ec(r,e,t,n,i,s,o){let{float32Array:a,uint16Array:l,uint32Array:c}=j,h=r*2;if(J(h,l)){let d=ie(r,c),f=oe(h,l);Gu(e,t,n,d,f,i,s,o)}else{let d=te(r);Qe(d,a,n,s,o)&&ec(d,e,t,n,i,s,o);let f=ne(r,c);Qe(f,a,n,s,o)&&ec(f,e,t,n,i,s,o)}}var ay=["x","y","z"];function ed(r,e,t,n,i,s){j.setBuffer(r._roots[e]);let o=tc(0,r,t,n,i,s);return j.clearBuffer(),o}function tc(r,e,t,n,i,s){let{float32Array:o,uint16Array:a,uint32Array:l}=j,c=r*2;if(J(c,a)){let u=ie(r,l),d=oe(c,a);return Xu(e,t,n,u,d,i,s)}else{let u=Zn(r,l),d=ay[u],p=n.direction[d]>=0,g,y;p?(g=te(r),y=ne(r,l)):(g=ne(r,l),y=te(r));let _=Qe(g,o,n,i,s)?tc(g,e,t,n,i,s):null;if(_){let m=_.point[d];if(p?m<=o[y+u]:m>=o[y+u+3])return _}let x=Qe(y,o,n,i,s)?tc(y,e,t,n,i,s):null;return _&&x?_.distance<=x.distance?_:x:_||x||null}}var Pr=new Q,ai=new Te,li=new Te,es=new q,td=new me,Lr=new me;function nd(r,e,t,n){j.setBuffer(r._roots[e]);let i=nc(0,r,t,n);return j.clearBuffer(),i}function nc(r,e,t,n,i=null){let{float32Array:s,uint16Array:o,uint32Array:a}=j,l=r*2;if(i===null&&(t.boundingBox||t.computeBoundingBox(),td.set(t.boundingBox.min,t.boundingBox.max,n),i=td),J(l,o)){let h=e.geometry,u=h.index,d=h.attributes.position,f=t.index,p=t.attributes.position,g=ie(r,a),y=oe(l,o);if(es.copy(n).invert(),t.boundsTree)return ae(r,s,Lr),Lr.matrix.copy(es),Lr.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:_=>Lr.intersectsBox(_),intersectsTriangle:_=>{_.a.applyMatrix4(n),_.b.applyMatrix4(n),_.c.applyMatrix4(n),_.needsUpdate=!0;for(let S=g,x=y+g;S<x;S++)if(le(li,3*e.resolveTriangleIndex(S),u,d),li.needsUpdate=!0,_.intersectsTriangle(li))return!0;return!1}});{let v=Wt(t);for(let _=g,S=y+g;_<S;_++){let x=e.resolveTriangleIndex(_);le(ai,3*x,u,d),ai.a.applyMatrix4(es),ai.b.applyMatrix4(es),ai.c.applyMatrix4(es),ai.needsUpdate=!0;for(let m=0,b=v*3;m<b;m+=3)if(le(li,m,f,p),li.needsUpdate=!0,ai.intersectsTriangle(li))return!0}}}else{let h=te(r),u=ne(r,a);return ae(h,s,Pr),!!(i.intersectsBox(Pr)&&nc(h,e,t,n,i)||(ae(u,s,Pr),i.intersectsBox(Pr)&&nc(u,e,t,n,i)))}}var Dr=new q,ic=new me,ts=new me,ly=new M,cy=new M,hy=new M,uy=new M;function id(r,e,t,n={},i={},s=0,o=1/0){e.boundingBox||e.computeBoundingBox(),ic.set(e.boundingBox.min,e.boundingBox.max,t),ic.needsUpdate=!0;let a=r.geometry,l=a.attributes.position,c=a.index,h=e.attributes.position,u=e.index,d=Be.getPrimitive(),f=Be.getPrimitive(),p=ly,g=cy,y=null,v=null;i&&(y=hy,v=uy);let _=1/0,S=null,x=null;return Dr.copy(t).invert(),ts.matrix.copy(Dr),r.shapecast({boundsTraverseOrder:m=>ic.distanceToBox(m),intersectsBounds:(m,b,w)=>w<_&&w<o?(b&&(ts.min.copy(m.min),ts.max.copy(m.max),ts.needsUpdate=!0),!0):!1,intersectsRange:(m,b)=>{if(e.boundsTree){let w=e.boundsTree;return w.shapecast({boundsTraverseOrder:E=>ts.distanceToBox(E),intersectsBounds:(E,P,A)=>A<_&&A<o,intersectsRange:(E,P)=>{for(let A=E,D=E+P;A<D;A++){let R=w.resolveTriangleIndex(A);le(f,3*R,u,h),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let F=m,k=m+b;F<k;F++){let H=r.resolveTriangleIndex(F);le(d,3*H,c,l),d.needsUpdate=!0;let re=d.distanceToTriangle(f,p,y);if(re<_&&(g.copy(p),v&&v.copy(y),_=re,S=F,x=A),re<s)return!0}}}})}else{let w=Wt(e);for(let E=0,P=w;E<P;E++){le(f,3*E,u,h),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let A=m,D=m+b;A<D;A++){let R=r.resolveTriangleIndex(A);le(d,3*R,c,l),d.needsUpdate=!0;let F=d.distanceToTriangle(f,p,y);if(F<_&&(g.copy(p),v&&v.copy(y),_=F,S=A,x=E),F<s)return!0}}}}}),Be.releasePrimitive(d),Be.releasePrimitive(f),_===1/0?null:(n.point?n.point.copy(g):n.point=g.clone(),n.distance=_,n.faceIndex=S,i&&(i.point?i.point.copy(v):i.point=v.clone(),i.point.applyMatrix4(Dr),g.applyMatrix4(Dr),i.distance=g.sub(i.point).length(),i.faceIndex=x),n)}function sc(r,e,t){return r===null?null:(r.point.applyMatrix4(e.matrixWorld),r.distance=r.point.distanceTo(t.ray.origin),r.object=e,r)}var Fr=new me,Nr=new bt,sd=new M,rd=new q,od=new M,rc=["getX","getY","getZ"],Ur=class r extends Mr{static serialize(e,t={}){t={cloneBuffers:!0,...t};let n=e.geometry,i=e._roots,s=e._indirectBuffer,o=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};return t.cloneBuffers?(a.roots=i.map(l=>l.slice()),a.index=o?o.array.slice():null,a.indirectBuffer=s?s.slice():null):(a.roots=i,a.index=o?o.array:null,a.indirectBuffer=s),a}static deserialize(e,t,n={}){n={setIndex:!0,indirect:!!e.indirectBuffer,...n};let{index:i,roots:s,indirectBuffer:o}=e;e.version||(console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),l(s));let a=new r(t,{...n,[Xi]:!0});if(a._roots=s,a._indirectBuffer=o||null,n.setIndex){let c=t.getIndex();if(c===null){let h=new _e(e.index,1,!1);t.setIndex(h)}else c.array!==i&&(c.array.set(i),c.needsUpdate=!0)}return a;function l(c){for(let h=0;h<c.length;h++){let u=c[h],d=new Uint32Array(u),f=new Uint16Array(u);for(let p=0,g=u.byteLength/32;p<g;p++){let y=8*p,v=2*y;J(v,f)||(d[y+6]=d[y+6]/8-p)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(e,t={}){t.maxLeafTris&&(console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.'),t={...t,targetLeafSize:t.maxLeafTris}),super(e,t)}shiftTriangleOffsets(e){return super.shiftPrimitiveOffsets(e)}writePrimitiveBounds(e,t,n){let i=this.geometry,s=this._indirectBuffer,o=i.attributes.position,a=i.index?i.index.array:null,c=(s?s[e]:e)*3,h=c+0,u=c+1,d=c+2;a&&(h=a[h],u=a[u],d=a[d]);for(let f=0;f<3;f++){let p=o[rc[f]](h),g=o[rc[f]](u),y=o[rc[f]](d),v=p;g<v&&(v=g),y<v&&(v=y);let _=p;g>_&&(_=g),y>_&&(_=y),t[n+f]=v,t[n+f+3]=_}return t}computePrimitiveBounds(e,t,n){let i=this.geometry,s=this._indirectBuffer,o=i.attributes.position,a=i.index?i.index.array:null,l=o.normalized;if(e<0||t+e-n.offset>n.length/6)throw new Error("MeshBVH: compute triangle bounds range is invalid.");let c=o.array,h=o.offset||0,u=3;o.isInterleavedBufferAttribute&&(u=o.data.stride);let d=["getX","getY","getZ"],f=n.offset;for(let p=e,g=e+t;p<g;p++){let v=(s?s[p]:p)*3,_=(p-f)*6,S=v+0,x=v+1,m=v+2;a&&(S=a[S],x=a[x],m=a[m]),l||(S=S*u+h,x=x*u+h,m=m*u+h);for(let b=0;b<3;b++){let w,E,P;l?(w=o[d[b]](S),E=o[d[b]](x),P=o[d[b]](m)):(w=c[S+b],E=c[x+b],P=c[m+b]);let A=w;E<A&&(A=E),P<A&&(A=P);let D=w;E>D&&(D=E),P>D&&(D=P);let R=(D-A)/2,F=b*2;n[_+F+0]=A+R,n[_+F+1]=R+(Math.abs(A)+R)*Kn}}return n}raycastObject3D(e,t,n=[]){let{material:i}=e;if(i===void 0)return;rd.copy(e.matrixWorld).invert(),Nr.copy(t.ray).applyMatrix4(rd),od.setFromMatrixScale(e.matrixWorld),sd.copy(Nr.direction).multiply(od);let s=sd.length(),o=t.near/s,a=t.far/s;if(t.firstHitOnly===!0){let l=this.raycastFirst(Nr,i,o,a);l=sc(l,e,t),l&&n.push(l)}else{let l=this.raycast(Nr,i,o,a);for(let c=0,h=l.length;c<h;c++){let u=sc(l[c],e,t);u&&n.push(u)}}return n}refit(e=null){return(this.indirect?ju:Wu)(this,e)}raycast(e,t=on,n=0,i=1/0){let s=this._roots,o=[],a=this.indirect?Qu:Yu;for(let l=0,c=s.length;l<c;l++)a(this,l,t,e,o,n,i);return o}raycastFirst(e,t=on,n=0,i=1/0){let s=this._roots,o=null,a=this.indirect?ed:$u;for(let l=0,c=s.length;l<c;l++){let h=a(this,l,t,e,n,i);h!=null&&(o==null||h.distance<o.distance)&&(o=h)}return o}intersectsGeometry(e,t){let n=!1,i=this._roots,s=this.indirect?nd:Ju;for(let o=0,a=i.length;o<a&&(n=s(this,o,e,t),!n);o++);return n}shapecast(e){let t=Be.getPrimitive(),n=super.shapecast({...e,intersectsPrimitive:e.intersectsTriangle,scratchPrimitive:t,iterate:this.indirect?qu:Hu});return Be.releasePrimitive(t),n}bvhcast(e,t,n){let{intersectsRanges:i,intersectsTriangles:s}=n,o=Be.getPrimitive(),a=this.geometry.index,l=this.geometry.attributes.position,c=this.indirect?p=>{let g=this.resolveTriangleIndex(p);le(o,g*3,a,l)}:p=>{le(o,p*3,a,l)},h=Be.getPrimitive(),u=e.geometry.index,d=e.geometry.attributes.position,f=e.indirect?p=>{let g=e.resolveTriangleIndex(p);le(h,g*3,u,d)}:p=>{le(h,p*3,u,d)};if(s){if(!(e instanceof r))throw new Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');let p=(g,y,v,_,S,x,m,b)=>{for(let w=v,E=v+_;w<E;w++){f(w),h.a.applyMatrix4(t),h.b.applyMatrix4(t),h.c.applyMatrix4(t),h.needsUpdate=!0;for(let P=g,A=g+y;P<A;P++)if(c(P),o.needsUpdate=!0,s(o,h,P,w,S,x,m,b))return!0}return!1};if(i){let g=i;i=function(y,v,_,S,x,m,b,w){return g(y,v,_,S,x,m,b,w)?!0:p(y,v,_,S,x,m,b,w)}}else i=p}return super.bvhcast(e,t,{intersectsRanges:i})}intersectsBox(e,t){return Fr.set(e.min,e.max,t),Fr.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Fr.intersectsBox(n),intersectsTriangle:n=>Fr.intersectsTriangle(n)})}intersectsSphere(e){return this.shapecast({intersectsBounds:t=>e.intersectsBox(t),intersectsTriangle:t=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,n={},i={},s=0,o=1/0){return(this.indirect?id:Zu)(this,e,t,n,i,s,o)}closestPointToPoint(e,t={},n=0,i=1/0){return Fu(this,e,t,n,i)}};var PT=parseInt("180")>=166,ci={Mesh:Ne.prototype.raycast,Line:Ut.prototype.raycast,LineSegments:Gn.prototype.raycast,LineLoop:Xn.prototype.raycast,Points:qn.prototype.raycast,BatchedMesh:zi.prototype.raycast},Ee=new Ne,Or=[];function ad(r,e){if(this.isBatchedMesh)dy.call(this,r,e);else{let{geometry:t}=this;if(t.boundsTree)t.boundsTree.raycastObject3D(this,r,e);else{let n;if(this instanceof Ne)n=ci.Mesh;else if(this instanceof Gn)n=ci.LineSegments;else if(this instanceof Xn)n=ci.LineLoop;else if(this instanceof Ut)n=ci.Line;else if(this instanceof qn)n=ci.Points;else throw new Error("BVH: Fallback raycast function not found.");n.call(this,r,e)}}}function dy(r,e){if(this.boundsTrees){let t=this.boundsTrees,n=this._drawInfo||this._instanceInfo,i=this._drawRanges||this._geometryInfo,s=this.matrixWorld;Ee.material=this.material,Ee.geometry=this.geometry;let o=Ee.geometry.boundsTree,a=Ee.geometry.drawRange;Ee.geometry.boundingSphere===null&&(Ee.geometry.boundingSphere=new Le);for(let l=0,c=n.length;l<c;l++){if(!this.getVisibleAt(l))continue;let h=n[l].geometryIndex;if(Ee.geometry.boundsTree=t[h],this.getMatrixAt(l,Ee.matrixWorld).premultiply(s),!Ee.geometry.boundsTree){this.getBoundingBoxAt(h,Ee.geometry.boundingBox),this.getBoundingSphereAt(h,Ee.geometry.boundingSphere);let u=i[h];Ee.geometry.setDrawRange(u.start,u.count)}Ee.raycast(r,Or);for(let u=0,d=Or.length;u<d;u++){let f=Or[u];f.object=this,f.batchId=l,e.push(f)}Or.length=0}Ee.geometry.boundsTree=o,Ee.geometry.drawRange=a,Ee.material=null,Ee.geometry=null}else ci.BatchedMesh.call(this,r,e)}function ld(r,e){let t=new M,n=new M,i=new M(0,1,0),s={start:new Set,end:new Set,change:new Set},o=new M,a=null,l=0,c=-1,h=0,u=0,d=0,f=0,p=!0,g=Mt.degToRad(15),y={version:172,mode:"bounded dolly / limited horizontal look / no accumulated momentum",wheelMoves:0,acceptedDrags:0,dragging:!1,minDistance:55,maxDistance:88,lateralMotion:!0,yawDegrees:0,maxYawDegrees:15},v=x=>s[x].forEach(m=>m()),_=x=>{a=Mt.clamp((a??r.position.distanceTo(t))+x,y.minDistance,y.maxDistance),v("change")},S=()=>{c>=0&&e.hasPointerCapture(c)&&e.releasePointerCapture(c),c=-1,y.dragging=!1};return e.addEventListener("pointerdown",x=>{!p||x.button!==0||(c=x.pointerId,h=x.clientX,u=x.clientY,e.setPointerCapture(c),e.focus({preventScroll:!0}))}),e.addEventListener("pointermove",x=>{if(c!==x.pointerId||!p)return;let m=x.clientX-h,b=x.clientY-u;h=x.clientX,u=x.clientY,!(Math.abs(m)+Math.abs(b)<.25)&&(y.dragging=!0,y.acceptedDrags++,f=Mt.clamp(f-m*7e-4,-g,g),Math.abs(b)>=.25?_(-b*.045):v("change"),x.preventDefault())}),e.addEventListener("pointerup",S),e.addEventListener("pointercancel",S),e.addEventListener("lostpointercapture",()=>{c=-1,y.dragging=!1}),e.addEventListener("contextmenu",x=>x.preventDefault()),e.addEventListener("wheel",x=>{if(!p)return;x.preventDefault();let m=x.deltaY*(x.deltaMode===1?16:x.deltaMode===2?e.clientHeight:1);_(Mt.clamp(m*.014,-3.5,3.5)),y.wheelMoves++},{passive:!1}),e.addEventListener("keydown",x=>{["ArrowUp","w","ArrowDown","s"].includes(x.key)&&(_(["w","ArrowUp"].includes(x.key)?-1.2:1.2),x.preventDefault())}),{target:t,lookTarget:n,debug:y,get dragging(){return y.dragging||Math.abs(d-f)>5e-5||a!==null&&Math.abs(r.position.distanceTo(t)-a)>.002},get enabled(){return p},set enabled(x){p=x},addEventListener(x,m){s[x].add(m)},setCollider(x){},resetInteraction(){a=null,d=f=0,S()},update(){let x=performance.now(),m=Math.min(.05,Math.max(0,(x-(l||x))/1e3));if(l=x,a!==null&&p){let b=r.position.distanceTo(t),w=Mt.damp(b,a,24,m);o.subVectors(r.position,t).normalize(),r.position.copy(t).addScaledVector(o,Math.abs(w-a)<.002?a:w)}d=Mt.damp(d,f,24,m),Math.abs(d-f)<5e-5&&(d=f),o.subVectors(t,r.position).applyAxisAngle(i,d),n.copy(r.position).add(o),y.yawDegrees=Mt.radToDeg(d),r.lookAt(n),r.updateMatrixWorld()},dispose(){S()}}}var Gt;(function(r){r[r.Disabled=0]="Disabled",r[r.Error=1]="Error",r[r.Warning=2]="Warning",r[r.Info=3]="Info",r[r.Debug=4]="Debug"})(Gt||(Gt={}));var Br=class{constructor(){this.logLevel=Gt.Debug,this.includeStack=!0}};var oc=class{InitLogging(e,t){this.ValidateContext(),this.context.logLevel=e,this.context.includeStack=t}Debug(e){this.ValidateContext(),this.context.logLevel>=Gt.Debug&&this.CommonLog("Debug",e)}Info(e){this.ValidateContext(),this.context.logLevel>=Gt.Info&&this.CommonLog("Info",e)}Warning(e){this.ValidateContext(),this.context.logLevel>=Gt.Warning&&this.CommonLog("Warning",e)}Error(e){this.ValidateContext(),this.context.logLevel>=Gt.Error&&this.CommonLog("Error",e)}CommonLog(e,t){let n=`[${e}] - ${t}`;this.context.includeStack&&(n+=`
Stack: ${this.GetStackTrace()}`),e==="Error"?console.error(n):e==="Warning"?console.warn(n):console.log(n)}GetStackTrace(){let e=new Error,t="No Stack Available for this browser";return e.stack&&(t=e.stack.toString().replace(/Error/g,"")),t}ValidateContext(){this.context||(typeof window>"u"||!window?this.context=new Br:window.loggerContext?this.context=window.loggerContext:(this.context=new Br,window.loggerContext=this.context))}},T=new oc;var kr=class{constructor(e){this._args=[],this._callback=e}handleEvent(e){this._callback(...this._args),this._args=[]}setArgs(...e){this._args=e}},hi=class extends EventTarget{constructor(){super(),this._eventListeners=new Map}removeListenerInternal(e,t){if(this._eventListeners.has(e)){let n=this._eventListeners.get(e);if(n===void 0)return this;for(let i=0;i<n.length;++i){let s=n[i];if(s.callback===t){super.removeEventListener(e,s.eventListenerWrapper),n.splice(i,1);break}}}return this}addListener(e,t){return this.on(e,t)}on(e,t){var n;let i=new kr(t);return super.addEventListener(e,i),this._eventListeners.has(e)||this._eventListeners.set(e,new Array),(n=this._eventListeners.get(e))===null||n===void 0||n.push({callback:t,eventListenerWrapper:i}),this}once(e,t){var n;let i={once:!0},s=new kr((...o)=>{t(...o),this.removeListenerInternal(e,t)});return super.addEventListener(e,s,i),this._eventListeners.has(e)||this._eventListeners.set(e,new Array),(n=this._eventListeners.get(e))===null||n===void 0||n.push({callback:t,eventListenerWrapper:s}),this}removeListener(e,t){return this.removeListenerInternal(e,t),this}off(e,t){return this.removeListener(e,t)}removeAllListeners(e){if(this._eventListeners.has(e)){let t=this._eventListeners.get(e);if(t===void 0)return this;for(let n of t)this.removeEventListener(e,n.eventListenerWrapper);this._eventListeners.delete(e)}return this}emit(e,...t){if(this._eventListeners.has(e)){let n=this._eventListeners.get(e);if(n===void 0)return!1;for(let i of n)i.eventListenerWrapper.setArgs(...t);return super.dispatchEvent(new Event(e)),!0}return!1}};var gn=class extends hi{constructor(e){super(),this.WS_OPEN_STATE=1,this.protocols=e}sendMessage(e){this.webSocket&&this.webSocket.send(e)}connect(e){T.Info(e);try{return this.webSocket=new WebSocket(e,this.protocols),this.webSocket.onopen=t=>this.handleOnOpen(),this.webSocket.onerror=t=>this.handleOnError(),this.webSocket.onclose=t=>this.handleOnClose(t),this.webSocket.onmessage=t=>this.handleOnMessage(t),this.webSocket.onmessagebinary=t=>this.handleOnMessageBinary(t),!0}catch(t){return T.Error(t instanceof Error?t.message:String(t)),!1}}disconnect(e,t){this.webSocket&&this.webSocket.close(e,t)}isConnected(){return!!this.webSocket&&this.webSocket.readyState!=WebSocket.CLOSED}handleOnMessageBinary(e){!e||!e.data||e.data.text().then(t=>{let n=new MessageEvent("messageFromBinary",{data:t});this.handleOnMessage(n)}).catch(t=>{T.Error(`Failed to parse binary blob from websocket, reason: ${t.message}`)})}handleOnMessage(e){if(e.data&&e.data instanceof Blob){this.handleOnMessageBinary(e);return}this.onMessage&&this.onMessage(e.data)}handleOnOpen(){T.Info("Connected to the signalling server via WebSocket"),this.emit("open")}handleOnError(){this.emit("error")}handleOnClose(e){T.Info("Disconnected to the signalling server via WebSocket: "+JSON.stringify(e.code)+" - "+e.reason),this.emit("close",e)}};var Vr=gn.prototype;if(!Vr.portfolioReadyGuardV169){Vr.portfolioReadyGuardV169=!0;let r=new WeakMap;Vr.isConnected=function(){return this.webSocket?.readyState===WebSocket.OPEN},Vr.sendMessage=function(e){let t=this.webSocket;if(!t)return;if(t.readyState===WebSocket.OPEN){t.send(e);return}if(t.readyState!==WebSocket.CONNECTING)return;let n=r.get(t);n||(n=[],r.set(t,n),t.addEventListener("open",()=>{let i=r.get(t)||[];if(r.delete(t),this.webSocket===t&&t.readyState===WebSocket.OPEN)for(let s of i)t.send(s)},{once:!0}),t.addEventListener("close",()=>r.delete(t),{once:!0})),n.length<128&&n.push(e)}}var ns=class extends hi{static get SIGNALLING_VERSION(){return"1.3.0"}constructor(e){super(),this.transport=e,e.onMessage=t=>{let n;try{let i=JSON.parse(t);T.Debug(`Protocol received => 
`+JSON.stringify(i,void 0,4)),n=i}catch(i){i instanceof Error?T.Error(`Error parsing message string ${t}.
${i.message}`):T.Error("Unknown error while parsing message data in handleOnMessage");return}e.emit("message",n),this.emit(n.type,n)||this.emit("unhandled",n)}}connect(e){return this.transport.connect(e)}disconnect(e,t){this.transport.disconnect(e,t)}isConnected(){return this.transport.isConnected()}sendMessage(e){this.transport.sendMessage(JSON.stringify(e)),this.transport.emit("out",e),T.Debug(`Protocol sent => 
`+JSON.stringify(e,void 0,4))}};var he={};Ph(he,{answer:()=>eh,base_message:()=>_y,config:()=>Wc,dataChannelRequest:()=>oh,disconnectPlayer:()=>nh,endpointId:()=>Xc,endpointIdConfirm:()=>qc,iceCandidate:()=>th,iceCandidateData:()=>io,identify:()=>Gc,layerPreference:()=>rh,listStreamers:()=>Yc,offer:()=>Qc,peerConnectionOptions:()=>no,peerDataChannels:()=>ah,peerDataChannelsReady:()=>lh,ping:()=>rs,playerConnected:()=>Zc,playerCount:()=>dh,playerDisconnected:()=>jc,pong:()=>ih,startStreaming:()=>hh,stats:()=>fh,stopStreaming:()=>uh,streamerDataChannels:()=>ch,streamerDisconnected:()=>sh,streamerIdChanged:()=>Sy,streamerList:()=>$c,subscribe:()=>Kc,subscribeFailed:()=>by,unsubscribe:()=>Jc});function zr(r){let e=typeof r;if(e=="object"){if(Array.isArray(r))return"array";if(r===null)return"null"}return e}function cd(r){return r!==null&&typeof r=="object"&&!Array.isArray(r)}var Et="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),Hr=[];for(let r=0;r<Et.length;r++)Hr[Et[r].charCodeAt(0)]=r;Hr[45]=Et.indexOf("+");Hr[95]=Et.indexOf("/");function hd(r){let e=r.length*3/4;r[r.length-2]=="="?e-=2:r[r.length-1]=="="&&(e-=1);let t=new Uint8Array(e),n=0,i=0,s,o=0;for(let a=0;a<r.length;a++){if(s=Hr[r.charCodeAt(a)],s===void 0)switch(r[a]){case"=":i=0;case`
`:case"\r":case"	":case" ":continue;default:throw Error("invalid base64 string.")}switch(i){case 0:o=s,i=1;break;case 1:t[n++]=o<<2|(s&48)>>4,o=s,i=2;break;case 2:t[n++]=(o&15)<<4|(s&60)>>2,o=s,i=3;break;case 3:t[n++]=(o&3)<<6|s,i=0;break}}if(i==1)throw Error("invalid base64 string.");return t.subarray(0,n)}function ud(r){let e="",t=0,n,i=0;for(let s=0;s<r.length;s++)switch(n=r[s],t){case 0:e+=Et[n>>2],i=(n&3)<<4,t=1;break;case 1:e+=Et[i|n>>4],i=(n&15)<<2,t=2;break;case 2:e+=Et[i|n>>6],e+=Et[n&63],t=0;break}return t&&(e+=Et[i],e+="=",t==1&&(e+="=")),e}var V;(function(r){r.symbol=Symbol.for("protobuf-ts/unknown"),r.onRead=(t,n,i,s,o)=>{(e(n)?n[r.symbol]:n[r.symbol]=[]).push({no:i,wireType:s,data:o})},r.onWrite=(t,n,i)=>{for(let{no:s,wireType:o,data:a}of r.list(n))i.tag(s,o).raw(a)},r.list=(t,n)=>{if(e(t)){let i=t[r.symbol];return n?i.filter(s=>s.no==n):i}return[]},r.last=(t,n)=>r.list(t,n).slice(-1)[0];let e=t=>t&&Array.isArray(t[r.symbol])})(V||(V={}));var N;(function(r){r[r.Varint=0]="Varint",r[r.Bit64=1]="Bit64",r[r.LengthDelimited=2]="LengthDelimited",r[r.StartGroup=3]="StartGroup",r[r.EndGroup=4]="EndGroup",r[r.Bit32=5]="Bit32"})(N||(N={}));function dd(){let r=0,e=0;for(let n=0;n<28;n+=7){let i=this.buf[this.pos++];if(r|=(i&127)<<n,(i&128)==0)return this.assertBounds(),[r,e]}let t=this.buf[this.pos++];if(r|=(t&15)<<28,e=(t&112)>>4,(t&128)==0)return this.assertBounds(),[r,e];for(let n=3;n<=31;n+=7){let i=this.buf[this.pos++];if(e|=(i&127)<<n,(i&128)==0)return this.assertBounds(),[r,e]}throw new Error("invalid varint")}function Gr(r,e,t){for(let s=0;s<28;s=s+7){let o=r>>>s,a=!(!(o>>>7)&&e==0),l=(a?o|128:o)&255;if(t.push(l),!a)return}let n=r>>>28&15|(e&7)<<4,i=e>>3!=0;if(t.push((i?n|128:n)&255),!!i){for(let s=3;s<31;s=s+7){let o=e>>>s,a=!!(o>>>7),l=(a?o|128:o)&255;if(t.push(l),!a)return}t.push(e>>>31&1)}}var Wr=65536*65536;function ac(r){let e=r[0]=="-";e&&(r=r.slice(1));let t=1e6,n=0,i=0;function s(o,a){let l=Number(r.slice(o,a));i*=t,n=n*t+l,n>=Wr&&(i=i+(n/Wr|0),n=n%Wr)}return s(-24,-18),s(-18,-12),s(-12,-6),s(-6),[e,n,i]}function Xr(r,e){if(e>>>0<=2097151)return""+(Wr*e+(r>>>0));let t=r&16777215,n=(r>>>24|e<<8)>>>0&16777215,i=e>>16&65535,s=t+n*6777216+i*6710656,o=n+i*8147497,a=i*2,l=1e7;s>=l&&(o+=Math.floor(s/l),s%=l),o>=l&&(a+=Math.floor(o/l),o%=l);function c(h,u){let d=h?String(h):"";return u?"0000000".slice(d.length)+d:d}return c(a,0)+c(o,a)+c(s,1)}function lc(r,e){if(r>=0){for(;r>127;)e.push(r&127|128),r=r>>>7;e.push(r)}else{for(let t=0;t<9;t++)e.push(r&127|128),r=r>>7;e.push(1)}}function fd(){let r=this.buf[this.pos++],e=r&127;if((r&128)==0)return this.assertBounds(),e;if(r=this.buf[this.pos++],e|=(r&127)<<7,(r&128)==0)return this.assertBounds(),e;if(r=this.buf[this.pos++],e|=(r&127)<<14,(r&128)==0)return this.assertBounds(),e;if(r=this.buf[this.pos++],e|=(r&127)<<21,(r&128)==0)return this.assertBounds(),e;r=this.buf[this.pos++],e|=(r&15)<<28;for(let t=5;(r&128)!==0&&t<10;t++)r=this.buf[this.pos++];if((r&128)!=0)throw new Error("invalid varint");return this.assertBounds(),e>>>0}var ce;function fy(){let r=new DataView(new ArrayBuffer(8));ce=globalThis.BigInt!==void 0&&typeof r.getBigInt64=="function"&&typeof r.getBigUint64=="function"&&typeof r.setBigInt64=="function"&&typeof r.setBigUint64=="function"?{MIN:BigInt("-9223372036854775808"),MAX:BigInt("9223372036854775807"),UMIN:BigInt("0"),UMAX:BigInt("18446744073709551615"),C:BigInt,V:r}:void 0}fy();function pd(r){if(!r)throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support")}var md=/^-?[0-9]+$/,Yr=4294967296,qr=2147483648,$r=class{constructor(e,t){this.lo=e|0,this.hi=t|0}isZero(){return this.lo==0&&this.hi==0}toNumber(){let e=this.hi*Yr+(this.lo>>>0);if(!Number.isSafeInteger(e))throw new Error("cannot convert to safe number");return e}},ve=class r extends $r{static from(e){if(ce)switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=="")throw new Error("string is no integer");e=ce.C(e);case"number":if(e===0)return this.ZERO;e=ce.C(e);case"bigint":if(!e)return this.ZERO;if(e<ce.UMIN)throw new Error("signed value for ulong");if(e>ce.UMAX)throw new Error("ulong too large");return ce.V.setBigUint64(0,e,!0),new r(ce.V.getInt32(0,!0),ce.V.getInt32(4,!0))}else switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=e.trim(),!md.test(e))throw new Error("string is no integer");let[t,n,i]=ac(e);if(t)throw new Error("signed value for ulong");return new r(n,i);case"number":if(e==0)return this.ZERO;if(!Number.isSafeInteger(e))throw new Error("number is no integer");if(e<0)throw new Error("signed value for ulong");return new r(e,e/Yr)}throw new Error("unknown value "+typeof e)}toString(){return ce?this.toBigInt().toString():Xr(this.lo,this.hi)}toBigInt(){return pd(ce),ce.V.setInt32(0,this.lo,!0),ce.V.setInt32(4,this.hi,!0),ce.V.getBigUint64(0,!0)}};ve.ZERO=new ve(0,0);var pe=class r extends $r{static from(e){if(ce)switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=="")throw new Error("string is no integer");e=ce.C(e);case"number":if(e===0)return this.ZERO;e=ce.C(e);case"bigint":if(!e)return this.ZERO;if(e<ce.MIN)throw new Error("signed long too small");if(e>ce.MAX)throw new Error("signed long too large");return ce.V.setBigInt64(0,e,!0),new r(ce.V.getInt32(0,!0),ce.V.getInt32(4,!0))}else switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=e.trim(),!md.test(e))throw new Error("string is no integer");let[t,n,i]=ac(e);if(t){if(i>qr||i==qr&&n!=0)throw new Error("signed long too small")}else if(i>=qr)throw new Error("signed long too large");let s=new r(n,i);return t?s.negate():s;case"number":if(e==0)return this.ZERO;if(!Number.isSafeInteger(e))throw new Error("number is no integer");return e>0?new r(e,e/Yr):new r(-e,-e/Yr).negate()}throw new Error("unknown value "+typeof e)}isNegative(){return(this.hi&qr)!==0}negate(){let e=~this.hi,t=this.lo;return t?t=~t+1:e+=1,new r(t,e)}toString(){if(ce)return this.toBigInt().toString();if(this.isNegative()){let e=this.negate();return"-"+Xr(e.lo,e.hi)}return Xr(this.lo,this.hi)}toBigInt(){return pd(ce),ce.V.setInt32(0,this.lo,!0),ce.V.setInt32(4,this.hi,!0),ce.V.getBigInt64(0,!0)}};pe.ZERO=new pe(0,0);var gd={readUnknownField:!0,readerFactory:r=>new cc(r)};function yd(r){return r?Object.assign(Object.assign({},gd),r):gd}var cc=class{constructor(e,t){this.varint64=dd,this.uint32=fd,this.buf=e,this.len=e.length,this.pos=0,this.view=new DataView(e.buffer,e.byteOffset,e.byteLength),this.textDecoder=t??new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0})}tag(){let e=this.uint32(),t=e>>>3,n=e&7;if(t<=0||n<0||n>5)throw new Error("illegal tag: field no "+t+" wire type "+n);return[t,n]}skip(e){let t=this.pos;switch(e){case N.Varint:for(;this.buf[this.pos++]&128;);break;case N.Bit64:this.pos+=4;case N.Bit32:this.pos+=4;break;case N.LengthDelimited:let n=this.uint32();this.pos+=n;break;case N.StartGroup:let i;for(;(i=this.tag()[1])!==N.EndGroup;)this.skip(i);break;default:throw new Error("cant skip wire type "+e)}return this.assertBounds(),this.buf.subarray(t,this.pos)}assertBounds(){if(this.pos>this.len)throw new RangeError("premature EOF")}int32(){return this.uint32()|0}sint32(){let e=this.uint32();return e>>>1^-(e&1)}int64(){return new pe(...this.varint64())}uint64(){return new ve(...this.varint64())}sint64(){let[e,t]=this.varint64(),n=-(e&1);return e=(e>>>1|(t&1)<<31)^n,t=t>>>1^n,new pe(e,t)}bool(){let[e,t]=this.varint64();return e!==0||t!==0}fixed32(){return this.view.getUint32((this.pos+=4)-4,!0)}sfixed32(){return this.view.getInt32((this.pos+=4)-4,!0)}fixed64(){return new ve(this.sfixed32(),this.sfixed32())}sfixed64(){return new pe(this.sfixed32(),this.sfixed32())}float(){return this.view.getFloat32((this.pos+=4)-4,!0)}double(){return this.view.getFloat64((this.pos+=8)-8,!0)}bytes(){let e=this.uint32(),t=this.pos;return this.pos+=e,this.assertBounds(),this.buf.subarray(t,t+e)}string(){return this.textDecoder.decode(this.bytes())}};function Z(r,e){if(!r)throw new Error(e)}var py=34028234663852886e22,my=-34028234663852886e22,gy=4294967295,yy=2147483647,xy=-2147483648;function Xt(r){if(typeof r!="number")throw new Error("invalid int 32: "+typeof r);if(!Number.isInteger(r)||r>yy||r<xy)throw new Error("invalid int 32: "+r)}function yn(r){if(typeof r!="number")throw new Error("invalid uint 32: "+typeof r);if(!Number.isInteger(r)||r>gy||r<0)throw new Error("invalid uint 32: "+r)}function ui(r){if(typeof r!="number")throw new Error("invalid float 32: "+typeof r);if(Number.isFinite(r)&&(r>py||r<my))throw new Error("invalid float 32: "+r)}var xd={writeUnknownFields:!0,writerFactory:()=>new hc};function vd(r){return r?Object.assign(Object.assign({},xd),r):xd}var hc=class{constructor(e){this.stack=[],this.textEncoder=e??new TextEncoder,this.chunks=[],this.buf=[]}finish(){this.chunks.push(new Uint8Array(this.buf));let e=0;for(let i=0;i<this.chunks.length;i++)e+=this.chunks[i].length;let t=new Uint8Array(e),n=0;for(let i=0;i<this.chunks.length;i++)t.set(this.chunks[i],n),n+=this.chunks[i].length;return this.chunks=[],t}fork(){return this.stack.push({chunks:this.chunks,buf:this.buf}),this.chunks=[],this.buf=[],this}join(){let e=this.finish(),t=this.stack.pop();if(!t)throw new Error("invalid state, fork stack empty");return this.chunks=t.chunks,this.buf=t.buf,this.uint32(e.byteLength),this.raw(e)}tag(e,t){return this.uint32((e<<3|t)>>>0)}raw(e){return this.buf.length&&(this.chunks.push(new Uint8Array(this.buf)),this.buf=[]),this.chunks.push(e),this}uint32(e){for(yn(e);e>127;)this.buf.push(e&127|128),e=e>>>7;return this.buf.push(e),this}int32(e){return Xt(e),lc(e,this.buf),this}bool(e){return this.buf.push(e?1:0),this}bytes(e){return this.uint32(e.byteLength),this.raw(e)}string(e){let t=this.textEncoder.encode(e);return this.uint32(t.byteLength),this.raw(t)}float(e){ui(e);let t=new Uint8Array(4);return new DataView(t.buffer).setFloat32(0,e,!0),this.raw(t)}double(e){let t=new Uint8Array(8);return new DataView(t.buffer).setFloat64(0,e,!0),this.raw(t)}fixed32(e){yn(e);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!0),this.raw(t)}sfixed32(e){Xt(e);let t=new Uint8Array(4);return new DataView(t.buffer).setInt32(0,e,!0),this.raw(t)}sint32(e){return Xt(e),e=(e<<1^e>>31)>>>0,lc(e,this.buf),this}sfixed64(e){let t=new Uint8Array(8),n=new DataView(t.buffer),i=pe.from(e);return n.setInt32(0,i.lo,!0),n.setInt32(4,i.hi,!0),this.raw(t)}fixed64(e){let t=new Uint8Array(8),n=new DataView(t.buffer),i=ve.from(e);return n.setInt32(0,i.lo,!0),n.setInt32(4,i.hi,!0),this.raw(t)}int64(e){let t=pe.from(e);return Gr(t.lo,t.hi,this.buf),this}sint64(e){let t=pe.from(e),n=t.hi>>31,i=t.lo<<1^n,s=(t.hi<<1|t.lo>>>31)^n;return Gr(i,s,this.buf),this}uint64(e){let t=ve.from(e);return Gr(t.lo,t.hi,this.buf),this}};var _d={emitDefaultValues:!1,enumAsInteger:!1,useProtoFieldName:!1,prettySpaces:0},Sd={ignoreUnknownFields:!1};function bd(r){return r?Object.assign(Object.assign({},Sd),r):Sd}function Md(r){return r?Object.assign(Object.assign({},_d),r):_d}var Kr=Symbol.for("protobuf-ts/message-type");function uc(r){let e=!1,t=[];for(let n=0;n<r.length;n++){let i=r.charAt(n);i=="_"?e=!0:/\d/.test(i)?(t.push(i),e=!0):e?(t.push(i.toUpperCase()),e=!1):n==0?t.push(i.toLowerCase()):t.push(i)}return t.join("")}var L;(function(r){r[r.DOUBLE=1]="DOUBLE",r[r.FLOAT=2]="FLOAT",r[r.INT64=3]="INT64",r[r.UINT64=4]="UINT64",r[r.INT32=5]="INT32",r[r.FIXED64=6]="FIXED64",r[r.FIXED32=7]="FIXED32",r[r.BOOL=8]="BOOL",r[r.STRING=9]="STRING",r[r.BYTES=12]="BYTES",r[r.UINT32=13]="UINT32",r[r.SFIXED32=15]="SFIXED32",r[r.SFIXED64=16]="SFIXED64",r[r.SINT32=17]="SINT32",r[r.SINT64=18]="SINT64"})(L||(L={}));var ke;(function(r){r[r.BIGINT=0]="BIGINT",r[r.STRING=1]="STRING",r[r.NUMBER=2]="NUMBER"})(ke||(ke={}));var is;(function(r){r[r.NO=0]="NO",r[r.PACKED=1]="PACKED",r[r.UNPACKED=2]="UNPACKED"})(is||(is={}));function wd(r){var e,t,n,i;return r.localName=(e=r.localName)!==null&&e!==void 0?e:uc(r.name),r.jsonName=(t=r.jsonName)!==null&&t!==void 0?t:uc(r.name),r.repeat=(n=r.repeat)!==null&&n!==void 0?n:is.NO,r.opt=(i=r.opt)!==null&&i!==void 0?i:r.repeat||r.oneof?!1:r.kind=="message",r}function Td(r){if(typeof r!="object"||r===null||!r.hasOwnProperty("oneofKind"))return!1;switch(typeof r.oneofKind){case"string":return r[r.oneofKind]===void 0?!1:Object.keys(r).length==2;case"undefined":return Object.keys(r).length==1;default:return!1}}var Jr=class{constructor(e){var t;this.fields=(t=e.fields)!==null&&t!==void 0?t:[]}prepare(){if(this.data)return;let e=[],t=[],n=[];for(let i of this.fields)if(i.oneof)n.includes(i.oneof)||(n.push(i.oneof),e.push(i.oneof),t.push(i.oneof));else switch(t.push(i.localName),i.kind){case"scalar":case"enum":(!i.opt||i.repeat)&&e.push(i.localName);break;case"message":i.repeat&&e.push(i.localName);break;case"map":e.push(i.localName);break}this.data={req:e,known:t,oneofs:Object.values(n)}}is(e,t,n=!1){if(t<0)return!0;if(e==null||typeof e!="object")return!1;this.prepare();let i=Object.keys(e),s=this.data;if(i.length<s.req.length||s.req.some(o=>!i.includes(o))||!n&&i.some(o=>!s.known.includes(o)))return!1;if(t<1)return!0;for(let o of s.oneofs){let a=e[o];if(!Td(a))return!1;if(a.oneofKind===void 0)continue;let l=this.fields.find(c=>c.localName===a.oneofKind);if(!l||!this.field(a[a.oneofKind],l,n,t))return!1}for(let o of this.fields)if(o.oneof===void 0&&!this.field(e[o.localName],o,n,t))return!1;return!0}field(e,t,n,i){let s=t.repeat;switch(t.kind){case"scalar":return e===void 0?t.opt:s?this.scalars(e,t.T,i,t.L):this.scalar(e,t.T,t.L);case"enum":return e===void 0?t.opt:s?this.scalars(e,L.INT32,i):this.scalar(e,L.INT32);case"message":return e===void 0?!0:s?this.messages(e,t.T(),n,i):this.message(e,t.T(),n,i);case"map":if(typeof e!="object"||e===null)return!1;if(i<2)return!0;if(!this.mapKeys(e,t.K,i))return!1;switch(t.V.kind){case"scalar":return this.scalars(Object.values(e),t.V.T,i,t.V.L);case"enum":return this.scalars(Object.values(e),L.INT32,i);case"message":return this.messages(Object.values(e),t.V.T(),n,i)}break}return!0}message(e,t,n,i){return n?t.isAssignable(e,i):t.is(e,i)}messages(e,t,n,i){if(!Array.isArray(e))return!1;if(i<2)return!0;if(n){for(let s=0;s<e.length&&s<i;s++)if(!t.isAssignable(e[s],i-1))return!1}else for(let s=0;s<e.length&&s<i;s++)if(!t.is(e[s],i-1))return!1;return!0}scalar(e,t,n){let i=typeof e;switch(t){case L.UINT64:case L.FIXED64:case L.INT64:case L.SFIXED64:case L.SINT64:switch(n){case ke.BIGINT:return i=="bigint";case ke.NUMBER:return i=="number"&&!isNaN(e);default:return i=="string"}case L.BOOL:return i=="boolean";case L.STRING:return i=="string";case L.BYTES:return e instanceof Uint8Array;case L.DOUBLE:case L.FLOAT:return i=="number"&&!isNaN(e);default:return i=="number"&&Number.isInteger(e)}}scalars(e,t,n,i){if(!Array.isArray(e))return!1;if(n<2)return!0;if(Array.isArray(e)){for(let s=0;s<e.length&&s<n;s++)if(!this.scalar(e[s],t,i))return!1}return!0}mapKeys(e,t,n){let i=Object.keys(e);switch(t){case L.INT32:case L.FIXED32:case L.SFIXED32:case L.SINT32:case L.UINT32:return this.scalars(i.slice(0,n).map(s=>parseInt(s)),t,n);case L.BOOL:return this.scalars(i.slice(0,n).map(s=>s=="true"?!0:s=="false"?!1:s),t,n);default:return this.scalars(i,t,n,ke.STRING)}}};function He(r,e){switch(e){case ke.BIGINT:return r.toBigInt();case ke.NUMBER:return r.toNumber();default:return r.toString()}}var Zr=class{constructor(e){this.info=e}prepare(){var e;if(this.fMap===void 0){this.fMap={};let t=(e=this.info.fields)!==null&&e!==void 0?e:[];for(let n of t)this.fMap[n.name]=n,this.fMap[n.jsonName]=n,this.fMap[n.localName]=n}}assert(e,t,n){if(!e){let i=zr(n);throw(i=="number"||i=="boolean")&&(i=n.toString()),new Error(`Cannot parse JSON ${i} for ${this.info.typeName}#${t}`)}}read(e,t,n){this.prepare();let i=[];for(let[s,o]of Object.entries(e)){let a=this.fMap[s];if(!a){if(!n.ignoreUnknownFields)throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${s}`);continue}let l=a.localName,c;if(a.oneof){if(o===null&&(a.kind!=="enum"||a.T()[0]!=="google.protobuf.NullValue"))continue;if(i.includes(a.oneof))throw new Error(`Multiple members of the oneof group "${a.oneof}" of ${this.info.typeName} are present in JSON.`);i.push(a.oneof),c=t[a.oneof]={oneofKind:l}}else c=t;if(a.kind=="map"){if(o===null)continue;this.assert(cd(o),a.name,o);let h=c[l];for(let[u,d]of Object.entries(o)){this.assert(d!==null,a.name+" map value",null);let f;switch(a.V.kind){case"message":f=a.V.T().internalJsonRead(d,n);break;case"enum":if(f=this.enum(a.V.T(),d,a.name,n.ignoreUnknownFields),f===!1)continue;break;case"scalar":f=this.scalar(d,a.V.T,a.V.L,a.name);break}this.assert(f!==void 0,a.name+" map value",d);let p=u;a.K==L.BOOL&&(p=p=="true"?!0:p=="false"?!1:p),p=this.scalar(p,a.K,ke.STRING,a.name).toString(),h[p]=f}}else if(a.repeat){if(o===null)continue;this.assert(Array.isArray(o),a.name,o);let h=c[l];for(let u of o){this.assert(u!==null,a.name,null);let d;switch(a.kind){case"message":d=a.T().internalJsonRead(u,n);break;case"enum":if(d=this.enum(a.T(),u,a.name,n.ignoreUnknownFields),d===!1)continue;break;case"scalar":d=this.scalar(u,a.T,a.L,a.name);break}this.assert(d!==void 0,a.name,o),h.push(d)}}else switch(a.kind){case"message":if(o===null&&a.T().typeName!="google.protobuf.Value"){this.assert(a.oneof===void 0,a.name+" (oneof member)",null);continue}c[l]=a.T().internalJsonRead(o,n,c[l]);break;case"enum":if(o===null)continue;let h=this.enum(a.T(),o,a.name,n.ignoreUnknownFields);if(h===!1)continue;c[l]=h;break;case"scalar":if(o===null)continue;c[l]=this.scalar(o,a.T,a.L,a.name);break}}}enum(e,t,n,i){if(e[0]=="google.protobuf.NullValue"&&Z(t===null||t==="NULL_VALUE",`Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} only accepts null.`),t===null)return 0;switch(typeof t){case"number":return Z(Number.isInteger(t),`Unable to parse field ${this.info.typeName}#${n}, enum can only be integral number, got ${t}.`),t;case"string":let s=t;e[2]&&t.substring(0,e[2].length)===e[2]&&(s=t.substring(e[2].length));let o=e[1][s];return typeof o>"u"&&i?!1:(Z(typeof o=="number",`Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} has no value for "${t}".`),o)}Z(!1,`Unable to parse field ${this.info.typeName}#${n}, cannot parse enum value from ${typeof t}".`)}scalar(e,t,n,i){let s;try{switch(t){case L.DOUBLE:case L.FLOAT:if(e===null)return 0;if(e==="NaN")return Number.NaN;if(e==="Infinity")return Number.POSITIVE_INFINITY;if(e==="-Infinity")return Number.NEGATIVE_INFINITY;if(e===""){s="empty string";break}if(typeof e=="string"&&e.trim().length!==e.length){s="extra whitespace";break}if(typeof e!="string"&&typeof e!="number")break;let o=Number(e);if(Number.isNaN(o)){s="not a number";break}if(!Number.isFinite(o)){s="too large or small";break}return t==L.FLOAT&&ui(o),o;case L.INT32:case L.FIXED32:case L.SFIXED32:case L.SINT32:case L.UINT32:if(e===null)return 0;let a;if(typeof e=="number"?a=e:e===""?s="empty string":typeof e=="string"&&(e.trim().length!==e.length?s="extra whitespace":a=Number(e)),a===void 0)break;return t==L.UINT32?yn(a):Xt(a),a;case L.INT64:case L.SFIXED64:case L.SINT64:if(e===null)return He(pe.ZERO,n);if(typeof e!="number"&&typeof e!="string")break;return He(pe.from(e),n);case L.FIXED64:case L.UINT64:if(e===null)return He(ve.ZERO,n);if(typeof e!="number"&&typeof e!="string")break;return He(ve.from(e),n);case L.BOOL:if(e===null)return!1;if(typeof e!="boolean")break;return e;case L.STRING:if(e===null)return"";if(typeof e!="string"){s="extra whitespace";break}try{encodeURIComponent(e)}catch(l){l="invalid UTF8";break}return e;case L.BYTES:if(e===null||e==="")return new Uint8Array(0);if(typeof e!="string")break;return hd(e)}}catch(o){s=o.message}this.assert(!1,i+(s?" - "+s:""),e)}};var jr=class{constructor(e){var t;this.fields=(t=e.fields)!==null&&t!==void 0?t:[]}write(e,t){let n={},i=e;for(let s of this.fields){if(!s.oneof){let c=this.field(s,i[s.localName],t);c!==void 0&&(n[t.useProtoFieldName?s.name:s.jsonName]=c);continue}let o=i[s.oneof];if(o.oneofKind!==s.localName)continue;let a=s.kind=="scalar"||s.kind=="enum"?Object.assign(Object.assign({},t),{emitDefaultValues:!0}):t,l=this.field(s,o[s.localName],a);Z(l!==void 0),n[t.useProtoFieldName?s.name:s.jsonName]=l}return n}field(e,t,n){let i;if(e.kind=="map"){Z(typeof t=="object"&&t!==null);let s={};switch(e.V.kind){case"scalar":for(let[l,c]of Object.entries(t)){let h=this.scalar(e.V.T,c,e.name,!1,!0);Z(h!==void 0),s[l.toString()]=h}break;case"message":let o=e.V.T();for(let[l,c]of Object.entries(t)){let h=this.message(o,c,e.name,n);Z(h!==void 0),s[l.toString()]=h}break;case"enum":let a=e.V.T();for(let[l,c]of Object.entries(t)){Z(c===void 0||typeof c=="number");let h=this.enum(a,c,e.name,!1,!0,n.enumAsInteger);Z(h!==void 0),s[l.toString()]=h}break}(n.emitDefaultValues||Object.keys(s).length>0)&&(i=s)}else if(e.repeat){Z(Array.isArray(t));let s=[];switch(e.kind){case"scalar":for(let l=0;l<t.length;l++){let c=this.scalar(e.T,t[l],e.name,e.opt,!0);Z(c!==void 0),s.push(c)}break;case"enum":let o=e.T();for(let l=0;l<t.length;l++){Z(t[l]===void 0||typeof t[l]=="number");let c=this.enum(o,t[l],e.name,e.opt,!0,n.enumAsInteger);Z(c!==void 0),s.push(c)}break;case"message":let a=e.T();for(let l=0;l<t.length;l++){let c=this.message(a,t[l],e.name,n);Z(c!==void 0),s.push(c)}break}(n.emitDefaultValues||s.length>0||n.emitDefaultValues)&&(i=s)}else switch(e.kind){case"scalar":i=this.scalar(e.T,t,e.name,e.opt,n.emitDefaultValues);break;case"enum":i=this.enum(e.T(),t,e.name,e.opt,n.emitDefaultValues,n.enumAsInteger);break;case"message":i=this.message(e.T(),t,e.name,n);break}return i}enum(e,t,n,i,s,o){if(e[0]=="google.protobuf.NullValue")return!s&&!i?void 0:null;if(t===void 0){Z(i);return}if(!(t===0&&!s&&!i))return Z(typeof t=="number"),Z(Number.isInteger(t)),o||!e[1].hasOwnProperty(t)?t:e[2]?e[2]+e[1][t]:e[1][t]}message(e,t,n,i){return t===void 0?i.emitDefaultValues?null:void 0:e.internalJsonWrite(t,i)}scalar(e,t,n,i,s){if(t===void 0){Z(i);return}let o=s||i;switch(e){case L.INT32:case L.SFIXED32:case L.SINT32:return t===0?o?0:void 0:(Xt(t),t);case L.FIXED32:case L.UINT32:return t===0?o?0:void 0:(yn(t),t);case L.FLOAT:ui(t);case L.DOUBLE:return t===0?o?0:void 0:(Z(typeof t=="number"),Number.isNaN(t)?"NaN":t===Number.POSITIVE_INFINITY?"Infinity":t===Number.NEGATIVE_INFINITY?"-Infinity":t);case L.STRING:return t===""?o?"":void 0:(Z(typeof t=="string"),t);case L.BOOL:return t===!1?o?!1:void 0:(Z(typeof t=="boolean"),t);case L.UINT64:case L.FIXED64:Z(typeof t=="number"||typeof t=="string"||typeof t=="bigint");let a=ve.from(t);return a.isZero()&&!o?void 0:a.toString();case L.INT64:case L.SFIXED64:case L.SINT64:Z(typeof t=="number"||typeof t=="string"||typeof t=="bigint");let l=pe.from(t);return l.isZero()&&!o?void 0:l.toString();case L.BYTES:return Z(t instanceof Uint8Array),t.byteLength?ud(t):o?"":void 0}}};function ss(r,e=ke.STRING){switch(r){case L.BOOL:return!1;case L.UINT64:case L.FIXED64:return He(ve.ZERO,e);case L.INT64:case L.SFIXED64:case L.SINT64:return He(pe.ZERO,e);case L.DOUBLE:case L.FLOAT:return 0;case L.BYTES:return new Uint8Array(0);case L.STRING:return"";default:return 0}}var Qr=class{constructor(e){this.info=e}prepare(){var e;if(!this.fieldNoToField){let t=(e=this.info.fields)!==null&&e!==void 0?e:[];this.fieldNoToField=new Map(t.map(n=>[n.no,n]))}}read(e,t,n,i){this.prepare();let s=i===void 0?e.len:e.pos+i;for(;e.pos<s;){let[o,a]=e.tag(),l=this.fieldNoToField.get(o);if(!l){let d=n.readUnknownField;if(d=="throw")throw new Error(`Unknown field ${o} (wire type ${a}) for ${this.info.typeName}`);let f=e.skip(a);d!==!1&&(d===!0?V.onRead:d)(this.info.typeName,t,o,a,f);continue}let c=t,h=l.repeat,u=l.localName;switch(l.oneof&&(c=c[l.oneof],c.oneofKind!==u&&(c=t[l.oneof]={oneofKind:u})),l.kind){case"scalar":case"enum":let d=l.kind=="enum"?L.INT32:l.T,f=l.kind=="scalar"?l.L:void 0;if(h){let y=c[u];if(a==N.LengthDelimited&&d!=L.STRING&&d!=L.BYTES){let v=e.uint32()+e.pos;for(;e.pos<v;)y.push(this.scalar(e,d,f))}else y.push(this.scalar(e,d,f))}else c[u]=this.scalar(e,d,f);break;case"message":if(h){let y=c[u],v=l.T().internalBinaryRead(e,e.uint32(),n);y.push(v)}else c[u]=l.T().internalBinaryRead(e,e.uint32(),n,c[u]);break;case"map":let[p,g]=this.mapEntry(l,e,n);c[u][p]=g;break}}}mapEntry(e,t,n){let i=t.uint32(),s=t.pos+i,o,a;for(;t.pos<s;){let[l,c]=t.tag();switch(l){case 1:e.K==L.BOOL?o=t.bool().toString():o=this.scalar(t,e.K,ke.STRING);break;case 2:switch(e.V.kind){case"scalar":a=this.scalar(t,e.V.T,e.V.L);break;case"enum":a=t.int32();break;case"message":a=e.V.T().internalBinaryRead(t,t.uint32(),n);break}break;default:throw new Error(`Unknown field ${l} (wire type ${c}) in map entry for ${this.info.typeName}#${e.name}`)}}if(o===void 0){let l=ss(e.K);o=e.K==L.BOOL?l.toString():l}if(a===void 0)switch(e.V.kind){case"scalar":a=ss(e.V.T,e.V.L);break;case"enum":a=0;break;case"message":a=e.V.T().create();break}return[o,a]}scalar(e,t,n){switch(t){case L.INT32:return e.int32();case L.STRING:return e.string();case L.BOOL:return e.bool();case L.DOUBLE:return e.double();case L.FLOAT:return e.float();case L.INT64:return He(e.int64(),n);case L.UINT64:return He(e.uint64(),n);case L.FIXED64:return He(e.fixed64(),n);case L.FIXED32:return e.fixed32();case L.BYTES:return e.bytes();case L.UINT32:return e.uint32();case L.SFIXED32:return e.sfixed32();case L.SFIXED64:return He(e.sfixed64(),n);case L.SINT32:return e.sint32();case L.SINT64:return He(e.sint64(),n)}}};var eo=class{constructor(e){this.info=e}prepare(){if(!this.fields){let e=this.info.fields?this.info.fields.concat():[];this.fields=e.sort((t,n)=>t.no-n.no)}}write(e,t,n){this.prepare();for(let s of this.fields){let o,a,l=s.repeat,c=s.localName;if(s.oneof){let h=e[s.oneof];if(h.oneofKind!==c)continue;o=h[c],a=!0}else o=e[c],a=!1;switch(s.kind){case"scalar":case"enum":let h=s.kind=="enum"?L.INT32:s.T;if(l)if(Z(Array.isArray(o)),l==is.PACKED)this.packed(t,h,s.no,o);else for(let u of o)this.scalar(t,h,s.no,u,!0);else o===void 0?Z(s.opt):this.scalar(t,h,s.no,o,a||s.opt);break;case"message":if(l){Z(Array.isArray(o));for(let u of o)this.message(t,n,s.T(),s.no,u)}else this.message(t,n,s.T(),s.no,o);break;case"map":Z(typeof o=="object"&&o!==null);for(let[u,d]of Object.entries(o))this.mapEntry(t,n,s,u,d);break}}let i=n.writeUnknownFields;i!==!1&&(i===!0?V.onWrite:i)(this.info.typeName,e,t)}mapEntry(e,t,n,i,s){e.tag(n.no,N.LengthDelimited),e.fork();let o=i;switch(n.K){case L.INT32:case L.FIXED32:case L.UINT32:case L.SFIXED32:case L.SINT32:o=Number.parseInt(i);break;case L.BOOL:Z(i=="true"||i=="false"),o=i=="true";break}switch(this.scalar(e,n.K,1,o,!0),n.V.kind){case"scalar":this.scalar(e,n.V.T,2,s,!0);break;case"enum":this.scalar(e,L.INT32,2,s,!0);break;case"message":this.message(e,t,n.V.T(),2,s);break}e.join()}message(e,t,n,i,s){s!==void 0&&(n.internalBinaryWrite(s,e.tag(i,N.LengthDelimited).fork(),t),e.join())}scalar(e,t,n,i,s){let[o,a,l]=this.scalarInfo(t,i);(!l||s)&&(e.tag(n,o),e[a](i))}packed(e,t,n,i){if(!i.length)return;Z(t!==L.BYTES&&t!==L.STRING),e.tag(n,N.LengthDelimited),e.fork();let[,s]=this.scalarInfo(t);for(let o=0;o<i.length;o++)e[s](i[o]);e.join()}scalarInfo(e,t){let n=N.Varint,i,s=t===void 0,o=t===0;switch(e){case L.INT32:i="int32";break;case L.STRING:o=s||!t.length,n=N.LengthDelimited,i="string";break;case L.BOOL:o=t===!1,i="bool";break;case L.UINT32:i="uint32";break;case L.DOUBLE:n=N.Bit64,i="double";break;case L.FLOAT:n=N.Bit32,i="float";break;case L.INT64:o=s||pe.from(t).isZero(),i="int64";break;case L.UINT64:o=s||ve.from(t).isZero(),i="uint64";break;case L.FIXED64:o=s||ve.from(t).isZero(),n=N.Bit64,i="fixed64";break;case L.BYTES:o=s||!t.byteLength,n=N.LengthDelimited,i="bytes";break;case L.FIXED32:n=N.Bit32,i="fixed32";break;case L.SFIXED32:n=N.Bit32,i="sfixed32";break;case L.SFIXED64:o=s||pe.from(t).isZero(),n=N.Bit64,i="sfixed64";break;case L.SINT32:i="sint32";break;case L.SINT64:o=s||pe.from(t).isZero(),i="sint64";break}return[n,i,s||o]}};function Ed(r){let e=r.messagePrototype?Object.create(r.messagePrototype):Object.defineProperty({},Kr,{value:r});for(let t of r.fields){let n=t.localName;if(!t.opt)if(t.oneof)e[t.oneof]={oneofKind:void 0};else if(t.repeat)e[n]=[];else switch(t.kind){case"scalar":e[n]=ss(t.T,t.L);break;case"enum":e[n]=0;break;case"map":e[n]={};break}}return e}function Y(r,e,t){let n,i=t,s;for(let o of r.fields){let a=o.localName;if(o.oneof){let l=i[o.oneof];if(l?.oneofKind==null)continue;if(n=l[a],s=e[o.oneof],s.oneofKind=l.oneofKind,n==null){delete s[a];continue}}else if(n=i[a],s=e,n==null)continue;switch(o.repeat&&(s[a].length=n.length),o.kind){case"scalar":case"enum":if(o.repeat)for(let c=0;c<n.length;c++)s[a][c]=n[c];else s[a]=n;break;case"message":let l=o.T();if(o.repeat)for(let c=0;c<n.length;c++)s[a][c]=l.create(n[c]);else s[a]===void 0?s[a]=l.create(n):l.mergePartial(s[a],n);break;case"map":switch(o.V.kind){case"scalar":case"enum":Object.assign(s[a],n);break;case"message":let c=o.V.T();for(let h of Object.keys(n))s[a][h]=c.create(n[h]);break}break}}}function Rd(r,e,t){if(e===t)return!0;if(!e||!t)return!1;for(let n of r.fields){let i=n.localName,s=n.oneof?e[n.oneof][i]:e[i],o=n.oneof?t[n.oneof][i]:t[i];switch(n.kind){case"enum":case"scalar":let a=n.kind=="enum"?L.INT32:n.T;if(!(n.repeat?Cd(a,s,o):Id(a,s,o)))return!1;break;case"map":if(!(n.V.kind=="message"?Ad(n.V.T(),to(s),to(o)):Cd(n.V.kind=="enum"?L.INT32:n.V.T,to(s),to(o))))return!1;break;case"message":let l=n.T();if(!(n.repeat?Ad(l,s,o):l.equals(s,o)))return!1;break}}return!0}var to=Object.values;function Id(r,e,t){if(e===t)return!0;if(r!==L.BYTES)return!1;let n=e,i=t;if(n.length!==i.length)return!1;for(let s=0;s<n.length;s++)if(n[s]!=i[s])return!1;return!0}function Cd(r,e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!Id(r,e[n],t[n]))return!1;return!0}function Ad(r,e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!r.equals(e[n],t[n]))return!1;return!0}var Pd=Object.getOwnPropertyDescriptors(Object.getPrototypeOf({})),vy=Pd[Kr]={},K=class{constructor(e,t,n){this.defaultCheckDepth=16,this.typeName=e,this.fields=t.map(wd),this.options=n??{},vy.value=this,this.messagePrototype=Object.create(null,Pd),this.refTypeCheck=new Jr(this),this.refJsonReader=new Zr(this),this.refJsonWriter=new jr(this),this.refBinReader=new Qr(this),this.refBinWriter=new eo(this)}create(e){let t=Ed(this);return e!==void 0&&Y(this,t,e),t}clone(e){let t=this.create();return Y(this,t,e),t}equals(e,t){return Rd(this,e,t)}is(e,t=this.defaultCheckDepth){return this.refTypeCheck.is(e,t,!1)}isAssignable(e,t=this.defaultCheckDepth){return this.refTypeCheck.is(e,t,!0)}mergePartial(e,t){Y(this,e,t)}fromBinary(e,t){let n=yd(t);return this.internalBinaryRead(n.readerFactory(e),e.byteLength,n)}fromJson(e,t){return this.internalJsonRead(e,bd(t))}fromJsonString(e,t){let n=JSON.parse(e);return this.fromJson(n,t)}toJson(e,t){return this.internalJsonWrite(e,Md(t))}toJsonString(e,t){var n;let i=this.toJson(e,t);return JSON.stringify(i,null,(n=t?.prettySpaces)!==null&&n!==void 0?n:0)}toBinary(e,t){let n=vd(t);return this.internalBinaryWrite(e,n.writerFactory(),n).finish()}internalJsonRead(e,t,n){if(e!==null&&typeof e=="object"&&!Array.isArray(e)){let i=n??this.create();return this.refJsonReader.read(e,i,t),i}throw new Error(`Unable to parse message ${this.typeName} from JSON ${zr(e)}.`)}internalJsonWrite(e,t){return this.refJsonWriter.write(e,t)}internalBinaryWrite(e,t,n){return this.refBinWriter.write(e,t,n),t}internalBinaryRead(e,t,n,i){let s=i??this.create();return this.refBinReader.read(e,s,n,t),s}};var dc=class extends K{constructor(){super("base_message",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},_y=new dc,fc=class extends K{constructor(){super("peerConnectionOptions",[])}create(e){let t=globalThis.Object.create(this.messagePrototype);return e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},no=new fc,pc=class extends K{constructor(){super("config",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"peerConnectionOptions",kind:"message",T:()=>no},{no:3,name:"protocolVersion",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.peerConnectionOptions=no.internalBinaryRead(e,e.uint32(),n,s.peerConnectionOptions);break;case 3:s.protocolVersion=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.peerConnectionOptions&&no.internalBinaryWrite(e.peerConnectionOptions,t.tag(2,N.LengthDelimited).fork(),n).join(),e.protocolVersion!==void 0&&t.tag(3,N.LengthDelimited).string(e.protocolVersion);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Wc=new pc,mc=class extends K{constructor(){super("identify",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Gc=new mc,gc=class extends K{constructor(){super("endpointId",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"id",kind:"scalar",T:9},{no:3,name:"protocolVersion",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.id="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.id=e.string();break;case 3:s.protocolVersion=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.id!==""&&t.tag(2,N.LengthDelimited).string(e.id),e.protocolVersion!==void 0&&t.tag(3,N.LengthDelimited).string(e.protocolVersion);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Xc=new gc,yc=class extends K{constructor(){super("endpointIdConfirm",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"committedId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.committedId="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.committedId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.committedId!==""&&t.tag(2,N.LengthDelimited).string(e.committedId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},qc=new yc,xc=class extends K{constructor(){super("streamerIdChanged",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"newID",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.newID="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.newID=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.newID!==""&&t.tag(2,N.LengthDelimited).string(e.newID);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Sy=new xc,vc=class extends K{constructor(){super("listStreamers",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Yc=new vc,_c=class extends K{constructor(){super("streamerList",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"ids",kind:"scalar",repeat:2,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.ids=[],e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.ids.push(e.string());break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);for(let s=0;s<e.ids.length;s++)t.tag(2,N.LengthDelimited).string(e.ids[s]);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},$c=new _c,Sc=class extends K{constructor(){super("subscribe",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"streamerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.streamerId="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.streamerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.streamerId!==""&&t.tag(2,N.LengthDelimited).string(e.streamerId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Kc=new Sc,bc=class extends K{constructor(){super("unsubscribe",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Jc=new bc,Mc=class extends K{constructor(){super("subscribeFailed",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"message",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.message="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.message=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.message!==""&&t.tag(2,N.LengthDelimited).string(e.message);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},by=new Mc,wc=class extends K{constructor(){super("playerConnected",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"dataChannel",kind:"scalar",T:8},{no:3,name:"sfu",kind:"scalar",T:8},{no:5,name:"playerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.dataChannel=!1,t.sfu=!1,t.playerId="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.dataChannel=e.bool();break;case 3:s.sfu=e.bool();break;case 5:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.dataChannel!==!1&&t.tag(2,N.Varint).bool(e.dataChannel),e.sfu!==!1&&t.tag(3,N.Varint).bool(e.sfu),e.playerId!==""&&t.tag(5,N.LengthDelimited).string(e.playerId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Zc=new wc,Tc=class extends K{constructor(){super("playerDisconnected",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"playerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.playerId="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.playerId!==""&&t.tag(2,N.LengthDelimited).string(e.playerId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},jc=new Tc,Ec=class extends K{constructor(){super("offer",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"sdp",kind:"scalar",T:9},{no:3,name:"playerId",kind:"scalar",opt:!0,T:9},{no:4,name:"sfu",kind:"scalar",opt:!0,T:8},{no:5,name:"multiplex",kind:"scalar",opt:!0,T:8},{no:6,name:"scalabilityMode",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.sdp="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.sdp=e.string();break;case 3:s.playerId=e.string();break;case 4:s.sfu=e.bool();break;case 5:s.multiplex=e.bool();break;case 6:s.scalabilityMode=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.sdp!==""&&t.tag(2,N.LengthDelimited).string(e.sdp),e.playerId!==void 0&&t.tag(3,N.LengthDelimited).string(e.playerId),e.sfu!==void 0&&t.tag(4,N.Varint).bool(e.sfu),e.multiplex!==void 0&&t.tag(5,N.Varint).bool(e.multiplex),e.scalabilityMode!==void 0&&t.tag(6,N.LengthDelimited).string(e.scalabilityMode);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},Qc=new Ec,Cc=class extends K{constructor(){super("answer",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"sdp",kind:"scalar",T:9},{no:3,name:"playerId",kind:"scalar",opt:!0,T:9},{no:4,name:"minBitrateBps",kind:"scalar",opt:!0,T:5},{no:5,name:"maxBitrateBps",kind:"scalar",opt:!0,T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.sdp="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.sdp=e.string();break;case 3:s.playerId=e.string();break;case 4:s.minBitrateBps=e.int32();break;case 5:s.maxBitrateBps=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.sdp!==""&&t.tag(2,N.LengthDelimited).string(e.sdp),e.playerId!==void 0&&t.tag(3,N.LengthDelimited).string(e.playerId),e.minBitrateBps!==void 0&&t.tag(4,N.Varint).int32(e.minBitrateBps),e.maxBitrateBps!==void 0&&t.tag(5,N.Varint).int32(e.maxBitrateBps);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},eh=new Cc,Ac=class extends K{constructor(){super("iceCandidateData",[{no:1,name:"candidate",kind:"scalar",T:9},{no:2,name:"sdpMid",kind:"scalar",T:9},{no:3,name:"sdpMLineIndex",kind:"scalar",T:5},{no:4,name:"usernameFragment",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.candidate="",t.sdpMid="",t.sdpMLineIndex=0,e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.candidate=e.string();break;case 2:s.sdpMid=e.string();break;case 3:s.sdpMLineIndex=e.int32();break;case 4:s.usernameFragment=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.candidate!==""&&t.tag(1,N.LengthDelimited).string(e.candidate),e.sdpMid!==""&&t.tag(2,N.LengthDelimited).string(e.sdpMid),e.sdpMLineIndex!==0&&t.tag(3,N.Varint).int32(e.sdpMLineIndex),e.usernameFragment!==void 0&&t.tag(4,N.LengthDelimited).string(e.usernameFragment);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},io=new Ac,Rc=class extends K{constructor(){super("iceCandidate",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"candidate",kind:"message",T:()=>io},{no:3,name:"playerId",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.candidate=io.internalBinaryRead(e,e.uint32(),n,s.candidate);break;case 3:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.candidate&&io.internalBinaryWrite(e.candidate,t.tag(2,N.LengthDelimited).fork(),n).join(),e.playerId!==void 0&&t.tag(3,N.LengthDelimited).string(e.playerId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},th=new Rc,Ic=class extends K{constructor(){super("disconnectPlayer",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"playerId",kind:"scalar",T:9},{no:3,name:"reason",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.playerId="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.playerId=e.string();break;case 3:s.reason=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.playerId!==""&&t.tag(2,N.LengthDelimited).string(e.playerId),e.reason!==void 0&&t.tag(3,N.LengthDelimited).string(e.reason);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},nh=new Ic,Pc=class extends K{constructor(){super("ping",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"time",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.time=0,e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.time=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.time!==0&&t.tag(2,N.Varint).int32(e.time);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},rs=new Pc,Lc=class extends K{constructor(){super("pong",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"time",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.time=0,e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.time=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.time!==0&&t.tag(2,N.Varint).int32(e.time);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},ih=new Lc,Dc=class extends K{constructor(){super("streamerDisconnected",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},sh=new Dc,Fc=class extends K{constructor(){super("layerPreference",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"spatialLayer",kind:"scalar",T:5},{no:3,name:"temporalLayer",kind:"scalar",T:5},{no:4,name:"playerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.spatialLayer=0,t.temporalLayer=0,t.playerId="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.spatialLayer=e.int32();break;case 3:s.temporalLayer=e.int32();break;case 4:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.spatialLayer!==0&&t.tag(2,N.Varint).int32(e.spatialLayer),e.temporalLayer!==0&&t.tag(3,N.Varint).int32(e.temporalLayer),e.playerId!==""&&t.tag(4,N.LengthDelimited).string(e.playerId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},rh=new Fc,Nc=class extends K{constructor(){super("dataChannelRequest",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},oh=new Nc,Uc=class extends K{constructor(){super("peerDataChannels",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"playerId",kind:"scalar",T:9},{no:3,name:"sendStreamId",kind:"scalar",T:5},{no:4,name:"recvStreamId",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.playerId="",t.sendStreamId=0,t.recvStreamId=0,e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.playerId=e.string();break;case 3:s.sendStreamId=e.int32();break;case 4:s.recvStreamId=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.playerId!==""&&t.tag(2,N.LengthDelimited).string(e.playerId),e.sendStreamId!==0&&t.tag(3,N.Varint).int32(e.sendStreamId),e.recvStreamId!==0&&t.tag(4,N.Varint).int32(e.recvStreamId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},ah=new Uc,Oc=class extends K{constructor(){super("peerDataChannelsReady",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},lh=new Oc,Bc=class extends K{constructor(){super("streamerDataChannels",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"sfuId",kind:"scalar",T:9},{no:3,name:"sendStreamId",kind:"scalar",T:5},{no:4,name:"recvStreamId",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.sfuId="",t.sendStreamId=0,t.recvStreamId=0,e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.sfuId=e.string();break;case 3:s.sendStreamId=e.int32();break;case 4:s.recvStreamId=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.sfuId!==""&&t.tag(2,N.LengthDelimited).string(e.sfuId),e.sendStreamId!==0&&t.tag(3,N.Varint).int32(e.sendStreamId),e.recvStreamId!==0&&t.tag(4,N.Varint).int32(e.recvStreamId);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},ch=new Bc,kc=class extends K{constructor(){super("startStreaming",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},hh=new kc,Vc=class extends K{constructor(){super("stopStreaming",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},uh=new Vc,zc=class extends K{constructor(){super("playerCount",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"count",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.count=0,e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.count=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.count!==0&&t.tag(2,N.Varint).int32(e.count);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},dh=new zc,Hc=class extends K{constructor(){super("stats",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"data",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.data="",e!==void 0&&Y(this,t,e),t}internalBinaryRead(e,t,n,i){let s=i??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.data=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?V.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,N.LengthDelimited).string(e.type),e.data!==""&&t.tag(2,N.LengthDelimited).string(e.data);let i=n.writeUnknownFields;return i!==!1&&(i==!0?V.onWrite:i)(this.typeName,e,t),t}},fh=new Hc;var Ld={answer:eh,config:Wc,disconnectPlayer:nh,endpointId:Xc,endpointIdConfirm:qc,iceCandidate:th,identify:Gc,listStreamers:Yc,offer:Qc,ping:rs,playerConnected:Zc,playerCount:dh,playerDisconnected:jc,pong:ih,stats:fh,streamerDisconnected:sh,streamerList:$c,subscribe:Kc,unsubscribe:Jc,layerPreference:rh,dataChannelRequest:oh,peerDataChannels:ah,peerDataChannelsReady:lh,streamerDataChannels:ch,startStreaming:hh,stopStreaming:uh};var Ve={};Ph(Ve,{createMessage:()=>ph,validateMessage:()=>My});function ph(r,e){let t=r.create();return t.type=r.typeName,e&&r.mergePartial(t,e),t}function My(r){var e;let t=!0;if(!r.type)return T.Error(`Parsed message has no type. Rejected. ${JSON.stringify(r)}`),null;let n=Ld[r.type];if(!n)return T.Error(`Message is of an unknown type: "${r.type}". Rejected.`),null;if(n.fields)for(let i of n.fields)i.opt||Object.prototype.hasOwnProperty.call(r,i.name)||(T.Error(`Message "${r.type}" is missing required field "${i.name}". Rejected.`),t=!1);for(let i in r)((e=n.fields)===null||e===void 0?void 0:e.find(o=>o.name===i))||(T.Error(`Message "${r.type}" contains unknown field "${i}". Rejected.`),t=!1);return t?n:null}var os=class{get RTT(){return this.rtt}constructor(e,t){this.alive=!1,this.rtt=0,this.protocol=e,this.timeout=t,this.onResponse=this.onHeartbeatResponse.bind(this),this.protocol.transport.on("close",this.stop.bind(this)),this.start()}start(){this.alive=!0,this.protocol.on("pong",this.onResponse),this.keepalive=setInterval(this.sendHeartbeat.bind(this),this.timeout)}stop(){clearInterval(this.keepalive),this.protocol.off("pong",this.onResponse)}sendHeartbeat(){var e;if(this.alive===!1){(e=this.onTimeout)===null||e===void 0||e.call(this);return}this.alive=!1,this.protocol.sendMessage(ph(rs,{time:new Date().getTime()}))}onHeartbeatResponse(e){this.rtt=new Date().getTime()-e.time,this.alive=!0}};var so=class{static addVideoHeaderExtensionToSdp(e,t){let n=e.split(`
`).filter(l=>l.startsWith("a=extmap:")).map(l=>parseInt(l.split(" ")[0].substring(9),10)).sort((l,c)=>l-c).filter((l,c,h)=>h.indexOf(l)===c),s="a=extmap:"+(n[n.length-1]+1)+" "+t+`\r
`,o=e.split(`
m=`).map((l,c)=>(c>0?"m="+l:l).trim()+`\r
`);return o.shift()+o.map(l=>l.startsWith("m=video")?l+s:l).join("")}};var ro=class{constructor(e){this.videoElementProvider=e,this.audioElement=document.createElement("Audio"),this.videoElementProvider.setAudioElement(this.audioElement)}handleOnTrack(e){if(T.Info("handleOnTrack "+JSON.stringify(e.streams)),e.streams.length<1||e.streams[0].id==="probator")return;let t=this.videoElementProvider.getVideoElement();if(e.track&&T.Info("Got track - "+e.track.kind+" id="+e.track.id+" readyState="+e.track.readyState),e.track.kind==="audio"){this.CreateAudioTrack(e.streams[0]);return}else if(e.track.kind==="video"&&t.srcObject!==e.streams[0]){t.srcObject=e.streams[0],T.Info("Set video source from video track ontrack.");return}}CreateAudioTrack(e){let t=this.videoElementProvider.getVideoElement();t.srcObject!=e&&t.srcObject&&t.srcObject!==e&&(this.audioElement.srcObject=e,T.Info("Created new audio element to play separate audio stream."))}};var oo=class{constructor(e){this.freezeFrameHeight=0,this.freezeFrameWidth=0,this.rootDiv=e,this.rootElement=document.createElement("div"),this.rootElement.id="freezeFrame",this.rootElement.style.display="none",this.rootElement.style.pointerEvents="none",this.rootElement.style.position="absolute",this.rootElement.style.zIndex="20",this.imageElement=document.createElement("img"),this.imageElement.style.position="absolute",this.rootElement.appendChild(this.imageElement),this.rootDiv.appendChild(this.rootElement)}setElementForShow(){this.rootElement.style.display="block"}setElementForHide(){this.rootElement.style.display="none"}updateImageElementSource(e){let t=btoa(e.reduce((n,i)=>n+String.fromCharCode(i),""));this.imageElement.src="data:image/jpeg;base64,"+t}setDimensionsFromElementAndResize(){this.freezeFrameHeight=this.imageElement.naturalHeight,this.freezeFrameWidth=this.imageElement.naturalWidth,this.resize()}resize(){if(this.freezeFrameWidth!==0&&this.freezeFrameHeight!==0){let e=0,t=0,n=0,i=0,s=this.rootDiv.clientWidth/this.rootDiv.clientHeight,o=this.freezeFrameWidth/this.freezeFrameHeight;s<o?(e=this.rootDiv.clientWidth,t=Math.floor(this.rootDiv.clientWidth/o),n=Math.floor((this.rootDiv.clientHeight-t)*.5),i=0):(e=Math.floor(this.rootDiv.clientHeight*o),t=this.rootDiv.clientHeight,n=0,i=Math.floor((this.rootDiv.clientWidth-e)*.5)),this.rootElement.style.width=this.rootDiv.offsetWidth+"px",this.rootElement.style.height=this.rootDiv.offsetHeight+"px",this.rootElement.style.left="0px",this.rootElement.style.top="0px",this.imageElement.style.width=e+"px",this.imageElement.style.height=t+"px",this.imageElement.style.left=i+"px",this.imageElement.style.top=n+"px"}}};var ao=class{constructor(e){this.receiving=!1,this.size=0,this.jpeg=void 0,this.valid=!1,this.freezeFrameDelay=50,this.freezeFrame=new oo(e)}showFreezeFrame(){this.valid&&this.freezeFrame.setElementForShow()}hideFreezeFrame(){this.valid=!1,this.freezeFrame.setElementForHide()}updateFreezeFrameAndShow(e,t){this.freezeFrame.updateImageElementSource(e),this.freezeFrame.imageElement.onload=()=>{this.freezeFrame.setDimensionsFromElementAndResize(),t()}}processFreezeFrameMessage(e,t){this.receiving||(this.receiving=!0,this.valid=!1,this.size=0,this.jpeg=void 0),this.size=new DataView(e.slice(1,5).buffer).getInt32(0,!0);let n=e.slice(5);if(this.jpeg){let i=new Uint8Array(this.jpeg.length+n.length);i.set(this.jpeg,0),i.set(n,this.jpeg.length),this.jpeg=i}else this.jpeg=n,this.receiving=!0,T.Info(`received first chunk of freeze frame: ${this.jpeg.length}/${this.size}`);this.jpeg.length===this.size?(this.receiving=!1,this.valid=!0,T.Info(`received complete freeze frame ${this.size}`),this.updateFreezeFrameAndShow(this.jpeg,t)):this.jpeg.length>this.size&&(T.Error(`received bigger freeze frame than advertised: ${this.jpeg.length}/${this.size}`),this.jpeg=void 0,this.receiving=!1)}};var ht=class{constructor(e,t,n,i,s=()=>{}){this.parseURLParams(),this.onChange=s,this.onChangeEmit=()=>{},this.id=e,this.description=n,this.label=t,this.value=i}set label(e){this._label=e,this.onChangeEmit(this._value)}get label(){return this._label}get value(){return this._value}set value(e){this._value=e,this.onChange(this._value,this),this.onChangeEmit(this._value)}updateURLParams(){if(this.useUrlParams){let e=new URLSearchParams(window.location.search),t=this.getValueAsString(),n=!1;for(let[i,s]of e)if(i.toLowerCase()==this.id.toLowerCase()){e.set(i,t),n=!0;break}n||e.set(this.id,t),window.history.replaceState({},"",e.toString()!==""?`${location.pathname}?${e}`:`${location.pathname}`)}}getValueAsString(){return""}parseURLParams(){this._urlParams={};let e=new URLSearchParams(window.location.search);for(let[t,n]of e)this._urlParams[t.toLowerCase()]=n}hasURLParam(e){return e.toLowerCase()in this._urlParams}getURLParam(e){return this.hasURLParam(e)?this._urlParams[e.toLowerCase()]:""}};var se=class extends ht{constructor(e,t,n,i,s,o=()=>{}){if(super(e,t,n,i,o),!s||!this.hasURLParam(this.id))this.flag=i;else{let a=this.getURLParam(this.id);this.flag=a.toLowerCase()!="false"}this.useUrlParams=s}getValueAsString(){return this.flag?"true":"false"}enable(){this.flag=!0}get flag(){return!!this.value}set flag(e){this.value=e}};var Me=class extends ht{constructor(e,t,n,i,s,o,a,l=()=>{}){if(super(e,t,n,o,l),this._min=i,this._max=s,!a||!this.hasURLParam(this.id))this.number=o;else{let c=Number.parseFloat(this.getURLParam(this.id));this.number=Number.isNaN(c)?o:c}this.useUrlParams=a}getValueAsString(){return this.number.toString()}set number(e){this.value=this.clamp(e)}get number(){return this.value}clamp(e){return this._min==null&&this._max==null?e:this._min==null?Math.min(this._max,e):this._max==null?Math.max(this._min,e):Math.max(Math.min(this._max,e),this._min)}get min(){return this._min}get max(){return this._max}addOnChangedListener(e){this.onChange=e}};var lo=class extends ht{constructor(e,t,n,i,s,o=()=>{}){super(e,t,n,i,o),!s||!this.hasURLParam(this.id)?this.text=i:this.text=this.getURLParam(this.id),this.useUrlParams=s}getValueAsString(){return this.text}get text(){return this.value}set text(e){this.value=e}};var di=class extends ht{constructor(e,t,n,i,s,o,a=function(c){return c},l=()=>{}){super(e,t,n,i,l),this._urlParamResolver=a;let c=this.hasURLParam(this.id)?this._urlParamResolver(this.getURLParam(this.id)):i;this.options=s??[c],this.selected=c,this.useUrlParams=o}getValueAsString(){return this.selected}addOnChangedListener(e){this.onChange=e}get options(){return this._options}set options(e){this._options=e,this.onChangeEmit(this.selected)}get selected(){return this.value}set selected(e){e!==void 0&&(this.options.includes(e)?this.value=e:T.Error(`Could not set "${e}" as the selected option for ${this.id} because it wasn't one of the options.`))}set urlParamResolver(e){this._urlParamResolver=e}};var co=class extends Event{constructor(e){super("afkWarningActivate"),this.data=e}},as=class extends Event{constructor(e){super("afkWarningUpdate"),this.data=e}},ho=class extends Event{constructor(){super("afkWarningDeactivate")}},uo=class extends Event{constructor(){super("afkTimedOut")}},fo=class extends Event{constructor(e){super("videoEncoderAvgQP"),this.data=e}},po=class extends Event{constructor(){super("webRtcSdp")}},mo=class extends Event{constructor(e){super("webRtcSdpAnswer"),this.data=e}},go=class extends Event{constructor(e){super("webRtcSdpOffer"),this.data=e}},yo=class extends Event{constructor(){super("webRtcAutoConnect")}},xo=class extends Event{constructor(){super("webRtcConnecting")}},vo=class extends Event{constructor(){super("webRtcConnected")}},_o=class extends Event{constructor(){super("webRtcFailed")}},So=class extends Event{constructor(e){super("webRtcDisconnected"),this.data=e}},bo=class extends Event{constructor(e){super("dataChannelOpen"),this.data=e}},Mo=class extends Event{constructor(e){super("dataChannelClose"),this.data=e}},wo=class extends Event{constructor(e){super("dataChannelError"),this.data=e}},To=class extends Event{constructor(){super("videoInitialized")}},Eo=class extends Event{constructor(){super("streamLoading")}},Co=class extends Event{constructor(){super("streamConnect")}},Ao=class extends Event{constructor(){super("streamDisconnect")}},Ro=class extends Event{constructor(){super("streamReconnect")}},Io=class extends Event{constructor(e){super("playStreamError"),this.data=e}},Po=class extends Event{constructor(){super("playStream")}},ls=class extends Event{constructor(e){super("playStreamRejected"),this.data=e}},Lo=class extends Event{constructor(e){super("loadFreezeFrame"),this.data=e}},Do=class extends Event{constructor(){super("hideFreezeFrame")}},Fo=class extends Event{constructor(e){super("statsReceived"),this.data=e}},No=class extends Event{constructor(e){super("streamerListMessage"),this.data=e}},Uo=class extends Event{constructor(e){super("StreamerIDChangedMessage"),this.data=e}},Oo=class extends Event{constructor(e){super("latencyTestResult"),this.data=e}},Bo=class extends Event{constructor(e){super("latencyCalculated"),this.data=e}},ko=class extends Event{constructor(e){super("showOnScreenKeyboard"),this.data=e}},Vo=class extends Event{constructor(e){super("dataChannelLatencyTestResponse"),this.data=e}},zo=class extends Event{constructor(e){super("dataChannelLatencyTestResult"),this.data=e}},Ho=class extends Event{constructor(e){super("subscribeFailed"),this.data=e}},Wo=class extends Event{constructor(e){super("initialSettings"),this.data=e}},xn=class extends Event{constructor(e){super("settingsChanged"),this.data=e}};var Go=class extends Event{constructor(e){super("xrFrame"),this.data=e}},Xo=class extends Event{constructor(e){super("playerCount"),this.data=e}},qo=class extends Event{constructor(){super("webRtcTCPRelayDetected")}},Yo=class extends EventTarget{dispatchEvent(e){return super.dispatchEvent(e)}addEventListener(e,t){super.addEventListener(e,t)}removeEventListener(e,t){super.removeEventListener(e,t)}};function mh(r){let[e,t]=r.trim().split(" "),n=new Map;for(let i of(t??"").split(";")){let[s,o]=i.split("=");s&&n.set(s.trim().toLowerCase(),(o??"").trim())}return{name:(e??"").toUpperCase(),parameters:n}}var wy=[{profileIdc:66,pattern:"x1xx0000",profile:"constrained-baseline"},{profileIdc:77,pattern:"1xxx0000",profile:"constrained-baseline"},{profileIdc:88,pattern:"11xx0000",profile:"constrained-baseline"},{profileIdc:66,pattern:"x0xx0000",profile:"baseline"},{profileIdc:88,pattern:"10xx0000",profile:"baseline"},{profileIdc:77,pattern:"0x0x0000",profile:"main"},{profileIdc:100,pattern:"00000000",profile:"high"},{profileIdc:100,pattern:"00001100",profile:"constrained-high"},{profileIdc:244,pattern:"00000000",profile:"predictive-high-444"}];function Ty(r){var e;let t=parseInt(r.substring(0,2),16),n=parseInt(r.substring(2,4),16),i=wy.find(({profileIdc:s,pattern:o})=>s===t&&[...o].every((a,l)=>a==="x"||(n>>7-l&1)===Number(a)));return(e=i?.profile)!==null&&e!==void 0?e:r.substring(0,4).toLowerCase()}function vn(r){let{name:e,parameters:t}=mh(r),n=(i,s)=>{var o;return(o=t.get(i))!==null&&o!==void 0?o:s};switch(e){case"H264":{let i=Ty(n("profile-level-id","42e01f"));return`${e} profile=${i};packetization-mode=${n("packetization-mode","0")}`}case"H265":return`${e} profile-id=${n("profile-id","1")};tier-flag=${n("tier-flag","0")};tx-mode=${n("tx-mode","SRST").toUpperCase()}`;case"VP9":return`${e} profile-id=${n("profile-id","0")}`;case"AV1":return`${e} profile=${n("profile","0")}`;default:return e}}function gh(r){return r.mimeType.split("/")[1]+" "+(r.sdpFmtpLine||"")}function Dd(r,e){var t,n;let i=vn(r),s=mh(r).name;return(n=(t=e.find(o=>o===r))!==null&&t!==void 0?t:e.find(o=>vn(o)===i))!==null&&n!==void 0?n:e.find(o=>mh(o).name===s)}function Fd(r,e){let t=n=>{let i=e.indexOf(gh(n));return i===-1?e.length:i};return[...r].sort((n,i)=>t(n)-t(i))}var qt=class{static getSupportedVideoCodecs(){let e=[];if(!RTCRtpReceiver.getCapabilities)return T.Warning("RTCRtpReceiver.getCapabilities API is not available in your browser, defaulting to guess that we support H.264."),e.push("H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f"),e;let t=/(VP\d|H26\d|AV1).*/,n=RTCRtpReceiver.getCapabilities("video");return n?(n.codecs.forEach(i=>{let s=gh(i);t.exec(s)!==null&&e.push(s)}),e):(e.push("H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f"),e)}};var C=class{};C.AutoConnect="AutoConnect";C.AutoPlayVideo="AutoPlayVideo";C.AFKDetection="TimeoutIfIdle";C.HoveringMouseMode="HoveringMouse";C.ForceMonoAudio="ForceMonoAudio";C.ForceTURN="ForceTURN";C.FakeMouseWithTouches="FakeMouseWithTouches";C.IsQualityController="ControlsQuality";C.MatchViewportResolution="MatchViewportRes";C.StartVideoMuted="StartVideoMuted";C.SuppressBrowserKeys="SuppressBrowserKeys";C.UseMic="UseMic";C.UseModalForTextInput="UseModalForTextInput";C.UseCamera="UseCamera";C.KeyboardInput="KeyboardInput";C.MouseInput="MouseInput";C.MouseDoubleClickAutoRelease="MouseDoubleClickAutoRelease";C.TouchInput="TouchInput";C.GamepadInput="GamepadInput";C.XRControllerInput="XRControllerInput";C.AutoEnterVR="AutoEnterVR";C.WaitForStreamer="WaitForStreamer";C.HideUI="HideUI";C.EnableCaptureTimeExt="EnableCaptureTimeExt";C.BrowserSendOffer="BrowserSendOffer";C.LatencyCSV="LatencyCSV";var Ey=r=>Object.getOwnPropertyNames(C).some(e=>C[e]===r),I=class{};I.AFKTimeoutSecs="AFKTimeout";I.AFKCountdownSecs="AFKCountdown";I.MinQP="MinQP";I.MaxQP="MaxQP";I.MinQuality="MinQuality";I.MaxQuality="MaxQuality";I.CompatQualityMin="CompatQualityMin";I.CompatQualityMax="CompatQualityMax";I.WebRTCFPS="WebRTCFPS";I.WebRTCMinBitrate="WebRTCMinBitrate";I.WebRTCMaxBitrate="WebRTCMaxBitrate";I.MaxReconnectAttempts="MaxReconnectAttempts";I.StreamerAutoJoinInterval="StreamerAutoJoinInterval";I.KeepaliveDelay="KeepaliveDelay";I.ViewportResScale="ViewportResScale";var Cy=r=>Object.getOwnPropertyNames(I).some(e=>I[e]===r),rt=class{};rt.SignallingServerUrl="ss";var Ay=r=>Object.getOwnPropertyNames(rt).some(e=>rt[e]===r),W=class{};W.PreferredCodec="PreferredCodec";W.StreamerId="StreamerId";W.PreferredQuality="PreferredQuality";var Ry=r=>Object.getOwnPropertyNames(W).some(e=>W[e]===r),$o=class{constructor(e={}){this.flags=new Map,this.numericParameters=new Map,this.textParameters=new Map,this.optionParameters=new Map;let{initialSettings:t,useUrlParams:n,webSocketProtocols:i}=e;this._useUrlParams=!!n,this._webSocketProtocols=i,this.populateDefaultSettings(this._useUrlParams,t)}get useUrlParams(){return this._useUrlParams}get webSocketProtocols(){return this._webSocketProtocols}populateDefaultSettings(e,t){this.textParameters.set(rt.SignallingServerUrl,new lo(rt.SignallingServerUrl,"Signalling url","Url of the signalling server",t&&Object.prototype.hasOwnProperty.call(t,rt.SignallingServerUrl)?t[rt.SignallingServerUrl]:(location.protocol==="https:"?"wss://":"ws://")+window.location.hostname+(window.location.port==="80"||window.location.port===""?"":`:${window.location.port}`),e)),this.optionParameters.set(W.StreamerId,new di(W.StreamerId,"Streamer ID","The ID of the streamer to stream.",t&&Object.prototype.hasOwnProperty.call(t,W.StreamerId)?t[W.StreamerId]:"",t&&Object.prototype.hasOwnProperty.call(t,W.StreamerId)?[t[W.StreamerId]]:void 0,e));let n=function(){let s=qt.getSupportedVideoCodecs();if(s.length==1)return s[0];if(s.length>0){let o=s[0];for(let a of s)if(a.startsWith("H264"))return a;return o}return T.Error("Could not find any reasonable video codec to assign as a default."),""},i=function(s){let o=qt.getSupportedVideoCodecs();if(o.includes(s))return s;for(let a of o)if(a.startsWith(s))return a;return s};this.optionParameters.set(W.PreferredCodec,new di(W.PreferredCodec,"Preferred Codec","The preferred codec to be used during codec negotiation",t&&Object.prototype.hasOwnProperty.call(t,W.PreferredCodec)?i(t[W.PreferredCodec]):n(),qt.getSupportedVideoCodecs(),e,i)),this.optionParameters.set(W.PreferredQuality,new di(W.PreferredQuality,"Preferred Quality","The preferred quality of the stream (only applicable when using the SFU)",t&&Object.prototype.hasOwnProperty.call(t,W.PreferredQuality)?t[W.PreferredQuality]:"Default",["Default"],e)),this.flags.set(C.AutoConnect,new se(C.AutoConnect,"Auto connect to stream","Whether we should attempt to auto connect to the signalling server or show a click to start prompt.",t&&Object.prototype.hasOwnProperty.call(t,C.AutoConnect)?t[C.AutoConnect]:!1,e)),this.flags.set(C.AutoPlayVideo,new se(C.AutoPlayVideo,"Auto play video","When video is ready automatically start playing it as opposed to showing a play button.",t&&Object.prototype.hasOwnProperty.call(t,C.AutoPlayVideo)?t[C.AutoPlayVideo]:!0,e)),this.flags.set(C.UseMic,new se(C.UseMic,"Use microphone","Make browser request microphone access and open an input audio track.",t&&Object.prototype.hasOwnProperty.call(t,C.UseMic)?t[C.UseMic]:!1,e)),this.flags.set(C.UseModalForTextInput,new se(C.UseModalForTextInput,"Use modal for text input","When entering input into a streamed UE text widget, use an input modal.",t&&Object.prototype.hasOwnProperty.call(t,C.UseModalForTextInput)?t[C.UseModalForTextInput]:!0,e)),this.flags.set(C.UseCamera,new se(C.UseCamera,"Use webcam","Make browser request webcam access and open a input video track.",t&&Object.prototype.hasOwnProperty.call(t,C.UseCamera)?t[C.UseCamera]:!1,e)),this.flags.set(C.StartVideoMuted,new se(C.StartVideoMuted,"Start video muted","Video will start muted if true.",t&&Object.prototype.hasOwnProperty.call(t,C.StartVideoMuted)?t[C.StartVideoMuted]:!1,e)),this.flags.set(C.SuppressBrowserKeys,new se(C.SuppressBrowserKeys,"Suppress browser keys","Suppress certain browser keys that we use in UE, for example F5 to show shader complexity instead of refresh the page.",t&&Object.prototype.hasOwnProperty.call(t,C.SuppressBrowserKeys)?t[C.SuppressBrowserKeys]:!0,e)),this.flags.set(C.IsQualityController,new se(C.IsQualityController,"Is quality controller?","True if this peer controls stream quality",t&&Object.prototype.hasOwnProperty.call(t,C.IsQualityController)?t[C.IsQualityController]:!0,e)),this.flags.set(C.ForceMonoAudio,new se(C.ForceMonoAudio,"Force mono audio","Force browser to request mono audio in the SDP",t&&Object.prototype.hasOwnProperty.call(t,C.ForceMonoAudio)?t[C.ForceMonoAudio]:!1,e)),this.flags.set(C.ForceTURN,new se(C.ForceTURN,"Force TURN","Only generate TURN/Relayed ICE candidates.",t&&Object.prototype.hasOwnProperty.call(t,C.ForceTURN)?t[C.ForceTURN]:!1,e)),this.flags.set(C.AFKDetection,new se(C.AFKDetection,"AFK if idle","Timeout the experience if user is AFK for a period.",t&&Object.prototype.hasOwnProperty.call(t,C.AFKDetection)?t[C.AFKDetection]:!1,e)),this.flags.set(C.MatchViewportResolution,new se(C.MatchViewportResolution,"Match viewport resolution","Pixel Streaming will be instructed to dynamically resize the video stream to match the size of the video element.",t&&Object.prototype.hasOwnProperty.call(t,C.MatchViewportResolution)?t[C.MatchViewportResolution]:!1,e)),this.flags.set(C.HoveringMouseMode,new se(C.HoveringMouseMode,"Control Scheme: Locked Mouse","Either locked mouse, where the pointer is consumed by the video and locked to it, or hovering mouse, where the mouse is not consumed.",t&&Object.prototype.hasOwnProperty.call(t,C.HoveringMouseMode)?t[C.HoveringMouseMode]:!1,e,(s,o)=>{o.label=`Control Scheme: ${s?"Hovering":"Locked"} Mouse`})),this.flags.set(C.FakeMouseWithTouches,new se(C.FakeMouseWithTouches,"Fake mouse with touches","A single finger touch is converted into a mouse event. This allows a non-touch application to be controlled partially via a touch device.",t&&Object.prototype.hasOwnProperty.call(t,C.FakeMouseWithTouches)?t[C.FakeMouseWithTouches]:!1,e)),this.flags.set(C.KeyboardInput,new se(C.KeyboardInput,"Keyboard input","If enabled, send keyboard events to streamer",t&&Object.prototype.hasOwnProperty.call(t,C.KeyboardInput)?t[C.KeyboardInput]:!0,e)),this.flags.set(C.MouseInput,new se(C.MouseInput,"Mouse input","If enabled, send mouse events to streamer",t&&Object.prototype.hasOwnProperty.call(t,C.MouseInput)?t[C.MouseInput]:!0,e)),this.flags.set(C.MouseDoubleClickAutoRelease,new se(C.MouseDoubleClickAutoRelease,"Auto release after double-click","After sending a MouseDouble message, also send a matching MouseUp so the streamer\u2019s pressed-button state stays balanced. Disable to restore pre-fix behaviour if your project handles the doubleclick release itself.",t&&Object.prototype.hasOwnProperty.call(t,C.MouseDoubleClickAutoRelease)?t[C.MouseDoubleClickAutoRelease]:!0,e)),this.flags.set(C.TouchInput,new se(C.TouchInput,"Touch input","If enabled, send touch events to streamer",t&&Object.prototype.hasOwnProperty.call(t,C.TouchInput)?t[C.TouchInput]:!0,e)),this.flags.set(C.GamepadInput,new se(C.GamepadInput,"Gamepad input","If enabled, send gamepad events to streamer",t&&Object.prototype.hasOwnProperty.call(t,C.GamepadInput)?t[C.GamepadInput]:!0,e)),this.flags.set(C.XRControllerInput,new se(C.XRControllerInput,"XR controller input","If enabled, send XR controller events to streamer",t&&Object.prototype.hasOwnProperty.call(t,C.XRControllerInput)?t[C.XRControllerInput]:!0,e)),this.flags.set(C.AutoEnterVR,new se(C.AutoEnterVR,"Auto enter VR","When the video is ready and an immersive-vr session is supported, request the WebXR session automatically. May fail if the browser requires a user gesture to start a WebXR session.",t&&Object.prototype.hasOwnProperty.call(t,C.AutoEnterVR)?t[C.AutoEnterVR]:!1,e)),this.flags.set(C.WaitForStreamer,new se(C.WaitForStreamer,"Wait for streamer","Will continue trying to connect to the first streamer available.",t&&Object.prototype.hasOwnProperty.call(t,C.WaitForStreamer)?t[C.WaitForStreamer]:!0,e)),this.flags.set(C.HideUI,new se(C.HideUI,"Hide the UI overlay","Will hide all UI overlay details",t&&Object.prototype.hasOwnProperty.call(t,C.HideUI)?t[C.HideUI]:!1,e)),this.flags.set(C.EnableCaptureTimeExt,new se(C.EnableCaptureTimeExt,"Enable abs-capture-time","Enables the abs-capture-time RTP header extension",t&&Object.prototype.hasOwnProperty.call(t,C.EnableCaptureTimeExt)?t[C.EnableCaptureTimeExt]:!1,e)),this.flags.set(C.BrowserSendOffer,new se(C.BrowserSendOffer,"Browser send offer (4.27 ONLY)","Browser will initiate the WebRTC handshake by sending the offer to the streamer (4.27 ONLY)",t&&Object.prototype.hasOwnProperty.call(t,C.BrowserSendOffer)?t[C.BrowserSendOffer]:!1,e)),this.flags.set(C.LatencyCSV,new se(C.LatencyCSV,"Export Latency CSV","Shows a button in the stats panel that allows to run a latency test and export the results to a CSV file.",t&&Object.prototype.hasOwnProperty.call(t,C.LatencyCSV)?t[C.LatencyCSV]:!1,e)),this.numericParameters.set(I.AFKTimeoutSecs,new Me(I.AFKTimeoutSecs,"AFK timeout","The time (in seconds) it takes for the application to time out if AFK timeout is enabled.",0,null,t&&Object.prototype.hasOwnProperty.call(t,I.AFKTimeoutSecs)?t[I.AFKTimeoutSecs]:120,e)),this.numericParameters.set(I.AFKCountdownSecs,new Me(I.AFKCountdownSecs,"AFK countdown","The time (in seconds) for a user to respond before the stream is ended after an AFK timeout.",10,null,10,e)),this.numericParameters.set(I.MaxReconnectAttempts,new Me(I.MaxReconnectAttempts,"Max Reconnects","Maximum number of reconnects the application will attempt when a streamer disconnects.",0,999,t&&Object.prototype.hasOwnProperty.call(t,I.MaxReconnectAttempts)?t[I.MaxReconnectAttempts]:3,e)),this.numericParameters.set(I.MinQP,new Me(I.MinQP,"Min QP","The lower bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.",0,51,t&&Object.prototype.hasOwnProperty.call(t,I.MinQP)?t[I.MinQP]:0,e)),this.numericParameters.set(I.MaxQP,new Me(I.MaxQP,"Max QP","The upper bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.",0,51,t&&Object.prototype.hasOwnProperty.call(t,I.MaxQP)?t[I.MaxQP]:51,e)),this.numericParameters.set(I.MinQuality,new Me(I.MinQuality,"Min Quality","The lower bound for the quality factor of the encoder. 0 = Worst quality, 100 = Best quality.",0,100,t&&Object.prototype.hasOwnProperty.call(t,I.MinQuality)?t[I.MinQuality]:0,e)),this.numericParameters.set(I.MaxQuality,new Me(I.MaxQuality,"Max Quality","The upper bound for the quality factor of the encoder. 0 = Worst quality, 100 = Best quality.",0,100,t&&Object.prototype.hasOwnProperty.call(t,I.MaxQuality)?t[I.MaxQuality]:100,e)),this.numericParameters.set(I.CompatQualityMin,new Me(I.CompatQualityMin,"Min Quality","The lower bound for encoding quality. 0 = Worst, 100 = Best.",0,100,t&&Object.prototype.hasOwnProperty.call(t,I.CompatQualityMin)?t[I.CompatQualityMin]:0,e)),this.numericParameters.set(I.CompatQualityMax,new Me(I.CompatQualityMax,"Max Quality","The upper bound for encoding quality. 0 = Worst, 100 = Best.",0,100,t&&Object.prototype.hasOwnProperty.call(t,I.CompatQualityMax)?t[I.CompatQualityMax]:100,e)),this.numericParameters.set(I.WebRTCFPS,new Me(I.WebRTCFPS,"Max FPS","The maximum FPS that WebRTC will try to transmit frames at.",1,999,t&&Object.prototype.hasOwnProperty.call(t,I.WebRTCFPS)?t[I.WebRTCFPS]:60,e)),this.numericParameters.set(I.WebRTCMinBitrate,new Me(I.WebRTCMinBitrate,"Min Bitrate (kbps)","The minimum bitrate that WebRTC should use.",0,5e5,t&&Object.prototype.hasOwnProperty.call(t,I.WebRTCMinBitrate)?t[I.WebRTCMinBitrate]:0,e)),this.numericParameters.set(I.WebRTCMaxBitrate,new Me(I.WebRTCMaxBitrate,"Max Bitrate (kbps)","The maximum bitrate that WebRTC should use.",0,5e5,t&&Object.prototype.hasOwnProperty.call(t,I.WebRTCMaxBitrate)?t[I.WebRTCMaxBitrate]:0,e)),this.numericParameters.set(I.StreamerAutoJoinInterval,new Me(I.StreamerAutoJoinInterval,"Streamer Auto Join Interval (ms)","Delay between retries when waiting for an available streamer.",500,9e5,t&&Object.prototype.hasOwnProperty.call(t,I.StreamerAutoJoinInterval)?t[I.StreamerAutoJoinInterval]:3e3,e)),this.numericParameters.set(I.KeepaliveDelay,new Me(I.KeepaliveDelay,"Connection Keepalive delay","Delay between keepalive pings to the signalling server.",0,9e5,t&&Object.prototype.hasOwnProperty.call(t,I.KeepaliveDelay)?t[I.KeepaliveDelay]:3e4,e)),this.numericParameters.set(I.ViewportResScale,new Me(I.ViewportResScale,"Viewport Resolution Scale","Scale factor for viewport resolution when MatchViewportResolution is enabled. 1.0 = 100%, 0.5 = 50%, 2.0 = 200%.",.1,3,t&&Object.prototype.hasOwnProperty.call(t,I.ViewportResScale)?t[I.ViewportResScale]:1,e))}_addOnNumericSettingChangedListener(e,t){this.numericParameters.has(e)&&this.numericParameters.get(e).addOnChangedListener(t)}_addOnOptionSettingChangedListener(e,t){this.optionParameters.has(e)&&this.optionParameters.get(e).addOnChangedListener(t)}getNumericSettingValue(e){if(this.numericParameters.has(e))return this.numericParameters.get(e).number;throw new Error(`There is no numeric setting with the id of ${e}`)}hasNumericSetting(e){return this.numericParameters.has(e)}getTextSettingValue(e){if(this.textParameters.has(e))return this.textParameters.get(e).value;throw new Error(`There is no numeric setting with the id of ${e}`)}setNumericSetting(e,t){if(this.numericParameters.has(e))this.numericParameters.get(e).number=t;else throw new Error(`There is no numeric setting with the id of ${e}`)}_addOnSettingChangedListener(e,t){this.flags.has(e)&&(this.flags.get(e).onChange=t)}_addOnTextSettingChangedListener(e,t){this.textParameters.has(e)&&(this.textParameters.get(e).onChange=t)}getSettingOption(e){return this.optionParameters.get(e)}isFlagEnabled(e){return this.flags.get(e).flag}setFlagEnabled(e,t){this.flags.has(e)?this.flags.get(e).flag=t:T.Warning(`Cannot toggle flag called ${e} - it does not exist in the Config.flags map.`)}setTextSetting(e,t){this.textParameters.has(e)?this.textParameters.get(e).text=t:T.Warning(`Cannot set text setting called ${e} - it does not exist in the Config.textParameters map.`)}setOptionSettingOptions(e,t){this.optionParameters.has(e)?this.optionParameters.get(e).options=t:T.Warning(`Cannot set text setting called ${e} - it does not exist in the Config.optionParameters map.`)}setOptionSettingValue(e,t){if(!this.optionParameters.has(e))T.Warning(`Cannot set text setting called ${e} - it does not exist in the Config.enumParameters map.`);else{let n=this.optionParameters.get(e),i=n.options;i.includes(t)||(i.push(t),n.options=i),n.selected=t}}setFlagLabel(e,t){this.flags.has(e)?this.flags.get(e).label=t:T.Warning(`Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`)}setSettings(e){for(let t of Object.keys(e))Ey(t)?this.setFlagEnabled(t,e[t]):Cy(t)?this.setNumericSetting(t,e[t]):Ay(t)?this.setTextSetting(t,e[t]):Ry(t)&&this.setOptionSettingValue(t,e[t])}getSettings(){let e={};for(let[t,n]of this.flags.entries())e[t]=n.flag;for(let[t,n]of this.numericParameters.entries())e[t]=n.number;for(let[t,n]of this.textParameters.entries())e[t]=n.text;for(let[t,n]of this.optionParameters.entries())e[t]=n.selected;return e}getFlags(){return Array.from(this.flags.values())}getTextSettings(){return Array.from(this.textParameters.values())}getNumericSettings(){return Array.from(this.numericParameters.values())}getOptionSettings(){return Array.from(this.optionParameters.values())}_registerOnChangeEvents(e){for(let t of this.flags.keys()){let n=this.flags.get(t);n&&(n.onChangeEmit=i=>e.dispatchEvent(new xn({id:n.id,type:"flag",value:i,target:n})))}for(let t of this.numericParameters.keys()){let n=this.numericParameters.get(t);n&&(n.onChangeEmit=i=>e.dispatchEvent(new xn({id:n.id,type:"number",value:i,target:n})))}for(let t of this.textParameters.keys()){let n=this.textParameters.get(t);n&&(n.onChangeEmit=i=>e.dispatchEvent(new xn({id:n.id,type:"text",value:i,target:n})))}for(let t of this.optionParameters.keys()){let n=this.optionParameters.get(t);n&&(n.onChangeEmit=i=>e.dispatchEvent(new xn({id:n.id,type:"option",value:i,target:n})))}}},_n;(function(r){r[r.LockedMouse=0]="LockedMouse",r[r.HoveringMouse=1]="HoveringMouse"})(_n||(_n={}));var Ko=class{constructor(e,t,n){this.active=!1,this.countdownActive=!1,this.warnTimer=void 0,this.countDown=0,this.countDownTimer=void 0,this.config=e,this.pixelStreaming=t,this.onDismissAfk=n,this.onAFKTimedOutCallback=()=>{T.Warning("AFK timed out, did you want to override this callback?")}}onAfkClick(){clearInterval(this.countDownTimer),(this.active||this.countdownActive)&&(this.startAfkWarningTimer(),this.pixelStreaming.dispatchEvent(new ho))}startAfkWarningTimer(){this.config.getNumericSettingValue(I.AFKTimeoutSecs)>0&&this.config.isFlagEnabled(C.AFKDetection)?this.active=!0:this.active=!1,this.resetAfkWarningTimer()}stopAfkWarningTimer(){this.active=!1,this.countdownActive=!1,clearTimeout(this.warnTimer),clearInterval(this.countDownTimer)}pauseAfkWarningTimer(){this.active=!1}resetAfkWarningTimer(){this.active&&this.config.isFlagEnabled(C.AFKDetection)&&(clearTimeout(this.warnTimer),this.warnTimer=setTimeout(()=>this.activateAfkEvent(),this.config.getNumericSettingValue(I.AFKTimeoutSecs)*1e3))}activateAfkEvent(){this.pauseAfkWarningTimer(),this.pixelStreaming.dispatchEvent(new co({countDown:this.countDown,dismissAfk:this.onDismissAfk})),this.countDown=this.config.getNumericSettingValue(I.AFKCountdownSecs),this.countdownActive=!0,this.pixelStreaming.dispatchEvent(new as({countDown:this.countDown})),this.config.isFlagEnabled(C.HoveringMouseMode)||document.exitPointerLock&&document.exitPointerLock(),this.countDownTimer=setInterval(()=>{this.countDown--,this.countDown===0?(this.pixelStreaming.dispatchEvent(new uo),this.onAFKTimedOutCallback(),T.Info("You have been disconnected due to inactivity"),this.stopAfkWarningTimer()):this.pixelStreaming.dispatchEvent(new as({countDown:this.countDown}))},1e3)}};var cs=class{constructor(){this.isReceivingFreezeFrame=!1}getDataChannelInstance(){return this}createDataChannel(e,t,n){this.peerConnection=e,this.label=t,this.datachannelOptions=n,n==null&&(this.datachannelOptions={},this.datachannelOptions.ordered=!0),this.dataChannel=this.peerConnection.createDataChannel(this.label,this.datachannelOptions),this.setupDataChannel()}setupDataChannel(){this.dataChannel.binaryType="arraybuffer",this.dataChannel.onopen=e=>this.handleOnOpen(e),this.dataChannel.onclose=e=>this.handleOnClose(e),this.dataChannel.onmessage=e=>this.handleOnMessage(e),this.dataChannel.onerror=e=>this.handleOnError(e)}handleOnOpen(e){var t;T.Info(`Data Channel (${this.label}) opened.`),this.onOpen((t=this.dataChannel)===null||t===void 0?void 0:t.label,e)}handleOnClose(e){var t;T.Info(`Data Channel (${this.label}) closed.`),this.onClose((t=this.dataChannel)===null||t===void 0?void 0:t.label,e)}handleOnMessage(e){T.Info(`Data Channel (${this.label}) message: ${e.type}`)}handleOnError(e){var t;T.Info(`Data Channel (${this.label}) error: ${e.type}`),this.onError((t=this.dataChannel)===null||t===void 0?void 0:t.label,e)}onOpen(e,t){}onClose(e,t){}onError(e,t){}};var Jo=class{},Zo=class{};var jo=class{};var hs=class{};var us=class{},ds=class{};var Qo=class{};var ea=class{};var ta=class{constructor(){this.inboundVideoStats=new Zo,this.inboundAudioStats=new Jo,this.candidatePairs=new Array,this.datachannelStats=new jo,this.localCandidates=new Array,this.remoteCandidates=new Array,this.outboundVideoStats=new us,this.outboundAudioStats=new us,this.remoteOutboundAudioStats=new ds,this.remoteOutboundVideoStats=new ds,this.sessionStats=new Qo,this.streamStats=new ea,this.codecs=new Map}processStats(e){this.localCandidates=new Array,this.remoteCandidates=new Array,this.candidatePairs=new Array,e.forEach(t=>{switch(t.type){case"candidate-pair":this.handleCandidatePair(t);break;case"certificate":break;case"codec":this.handleCodec(t);break;case"data-channel":this.handleDataChannel(t);break;case"inbound-rtp":this.handleInboundRTP(t);break;case"local-candidate":this.handleLocalCandidate(t);break;case"media-source":break;case"media-playout":break;case"outbound-rtp":this.handleLocalOutbound(t);break;case"peer-connection":break;case"remote-candidate":this.handleRemoteCandidate(t);break;case"remote-inbound-rtp":break;case"remote-outbound-rtp":this.handleRemoteOutbound(t);break;case"track":this.handleTrack(t);break;case"transport":this.handleTransport(t);break;case"stream":this.handleStream(t);break;default:T.Error("unhandled Stat Type"),T.Info(t);break}})}handleStream(e){this.streamStats=e}handleCandidatePair(e){this.candidatePairs.push(e)}handleDataChannel(e){this.datachannelStats.bytesReceived=e.bytesReceived,this.datachannelStats.bytesSent=e.bytesSent,this.datachannelStats.dataChannelIdentifier=e.dataChannelIdentifier,this.datachannelStats.id=e.id,this.datachannelStats.label=e.label,this.datachannelStats.messagesReceived=e.messagesReceived,this.datachannelStats.messagesSent=e.messagesSent,this.datachannelStats.protocol=e.protocol,this.datachannelStats.state=e.state,this.datachannelStats.timestamp=e.timestamp}handleLocalCandidate(e){let t=new hs;t.label="local-candidate",t.address=e.address,t.port=e.port,t.protocol=e.protocol,t.candidateType=e.candidateType,t.id=e.id,t.relayProtocol=e.relayProtocol,t.transportId=e.transportId,this.localCandidates.push(t)}handleRemoteCandidate(e){let t=new hs;t.label="remote-candidate",t.address=e.address,t.port=e.port,t.protocol=e.protocol,t.id=e.id,t.candidateType=e.candidateType,t.relayProtocol=e.relayProtocol,t.transportId=e.transportId,this.remoteCandidates.push(t)}handleInboundRTP(e){switch(e.kind){case"video":e.bytesReceived>this.inboundVideoStats.bytesReceived&&e.timestamp>this.inboundVideoStats.timestamp&&(this.inboundVideoStats.bitrate=8*(e.bytesReceived-this.inboundVideoStats.bytesReceived)/(e.timestamp-this.inboundVideoStats.timestamp),this.inboundVideoStats.bitrate=Math.floor(this.inboundVideoStats.bitrate));for(let t in e)this.inboundVideoStats[t]=e[t];break;case"audio":e.bytesReceived>this.inboundAudioStats.bytesReceived&&e.timestamp>this.inboundAudioStats.timestamp&&(this.inboundAudioStats.bitrate=8*(e.bytesReceived-this.inboundAudioStats.bytesReceived)/(e.timestamp-this.inboundAudioStats.timestamp),this.inboundAudioStats.bitrate=Math.floor(this.inboundAudioStats.bitrate));for(let t in e)this.inboundAudioStats[t]=e[t];break;default:T.Error(`Kind should be audio or video, we got ${e.kind} - that's unsupported.`);break}}handleLocalOutbound(e){let t=e.kind==="audio"?this.outboundAudioStats:this.outboundVideoStats;t.active=e.active,t.codecId=e.codecId,t.bytesSent=e.bytesSent,t.frameHeight=e.frameHeight,t.frameWidth=e.frameWidth,t.framesEncoded=e.framesEncoded,t.framesPerSecond=e.framesPerSecond,t.headerBytesSent=e.headerBytesSent,t.id=e.id,t.keyFramesEncoded=e.keyFramesEncoded,t.kind=e.kind,t.mediaSourceId=e.mediaSourceId,t.mid=e.mid,t.nackCount=e.nackCount,t.packetsSent=e.packetsSent,t.qpSum=e.qpSum,t.qualityLimitationDurations=e.qualityLimitationDurations,t.qualityLimitationReason=e.qualityLimitationReason,t.remoteId=e.remoteId,t.retransmittedBytesSent=e.retransmittedBytesSent,t.rid=e.rid,t.scalabilityMode=e.scalabilityMode,t.ssrc=e.ssrc,t.targetBitrate=e.targetBitrate,t.timestamp=e.timestamp,t.totalEncodeTime=e.totalEncodeTime,t.totalEncodeBytesTarget=e.totalEncodeBytesTarget,t.totalPacketSendDelay=e.totalPacketSendDelay,t.transportId=e.transportId}handleRemoteOutbound(e){let t=e.kind==="audio"?this.remoteOutboundAudioStats:this.remoteOutboundVideoStats;t.bytesSent=e.bytesSent,t.codecId=e.codecId,t.id=e.id,t.kind=e.kind,t.localId=e.localId,t.packetsSent=e.packetsSent,t.remoteTimestamp=e.remoteTimestamp,t.reportsSent=e.reportsSent,t.roundTripTimeMeasurements=e.roundTripTimeMeasurements,t.ssrc=e.ssrc,t.timestamp=e.timestamp,t.totalRoundTripTime=e.totalRoundTripTime,t.transportId=e.transportId}handleTrack(e){e.type==="track"&&(e.trackIdentifier==="video_label"||e.kind==="video")&&(this.inboundVideoStats.framesDropped=e.framesDropped,this.inboundVideoStats.framesReceived=e.framesReceived,this.inboundVideoStats.frameHeight=e.frameHeight,this.inboundVideoStats.frameWidth=e.frameWidth)}handleTransport(e){this.transportStats=e}handleCodec(e){let t=e.id;this.codecs.set(t,e)}handleSessionStatistics(e,t,n){let i=Date.now()-e;this.sessionStats.runTime=new Date(i).toISOString().substr(11,8).toString();let s=t===null?"Not sent yet":t?"true":"false";this.sessionStats.controlsStreamInput=s,this.sessionStats.videoEncoderAvgQP=n}isNumber(e){return typeof e=="number"&&isFinite(e)}getActiveCandidatePair(){if(this.candidatePairs===void 0)return null;if(this.transportStats){let t=this.candidatePairs.find(n=>n.id===this.transportStats.selectedCandidatePairId);return t===void 0?null:t}let e=this.candidatePairs.find(t=>t.selected);return e===void 0?null:e}};var sa=of(Nd());var Yt=class{static isVideoTransceiver(e){return this.canTransceiverReceiveVideo(e)||this.canTransceiverSendVideo(e)}static canTransceiverReceiveVideo(e){return!!e&&(e.direction==="sendrecv"||e.direction==="recvonly")&&e.receiver&&e.receiver.track&&e.receiver.track.kind==="video"}static canTransceiverSendVideo(e){return!!e&&(e.direction==="sendrecv"||e.direction==="sendonly")&&e.sender&&e.sender.track&&e.sender.track.kind==="video"}static isAudioTransceiver(e){return this.canTransceiverReceiveAudio(e)||this.canTransceiverSendAudio(e)}static canTransceiverReceiveAudio(e){return!!e&&(e.direction==="sendrecv"||e.direction==="recvonly")&&e.receiver&&e.receiver.track&&e.receiver.track.kind==="audio"}static canTransceiverSendAudio(e){return!!e&&(e.direction==="sendrecv"||e.direction==="sendonly")&&e.sender&&e.sender.track&&e.sender.track.kind==="audio"}};var xh=class{},vh=class{},na=class{constructor(){this.latestSenderRecvClockOffset=null}calculate(e,t){let n=new _h,i=this.getRTTMs(e);if(i!=null){n.rttMs=i;let s=this.getCaptureSource(t);if(s!=null){let o=this.calculateSenderLatency(e,s);o!==null&&(n.senderLatencyMs=o)}}return e.inboundVideoStats.totalProcessingDelay!==void 0&&e.inboundVideoStats.framesDecoded!==void 0&&(n.averageProcessingDelayMs=e.inboundVideoStats.totalProcessingDelay/e.inboundVideoStats.framesDecoded*1e3),e.inboundVideoStats.jitterBufferDelay!==void 0&&e.inboundVideoStats.jitterBufferEmittedCount!==void 0&&(n.averageJitterBufferDelayMs=e.inboundVideoStats.jitterBufferDelay/e.inboundVideoStats.jitterBufferEmittedCount*1e3),e.inboundVideoStats.framesDecoded!==void 0&&e.inboundVideoStats.totalDecodeTime!==void 0&&(n.averageDecodeLatencyMs=e.inboundVideoStats.totalDecodeTime/e.inboundVideoStats.framesDecoded*1e3),e.inboundVideoStats.totalAssemblyTime!==void 0&&e.inboundVideoStats.framesAssembledFromMultiplePackets!==void 0&&(n.averageAssemblyDelayMs=e.inboundVideoStats.totalAssemblyTime/e.inboundVideoStats.framesAssembledFromMultiplePackets*1e3),e.inboundVideoStats.googTimingFrameInfo!==void 0&&e.inboundVideoStats.googTimingFrameInfo.length>0&&(n.frameTiming=this.extractFrameTimingInfo(e.inboundVideoStats.googTimingFrameInfo)),n.frameTiming!==void 0&&n.frameTiming.captureToSendLatencyMs!==void 0&&n.averageProcessingDelayMs!==void 0&&n.rttMs!==void 0&&(n.averageE2ELatency=n.frameTiming.captureToSendLatencyMs+n.rttMs*.5+n.averageProcessingDelayMs),n.senderLatencyMs!=null&&n.averageProcessingDelayMs!==void 0&&n.rttMs!==void 0&&(n.averageE2ELatency=n.senderLatencyMs+n.rttMs*.5+n.averageProcessingDelayMs),n}extractFrameTimingInfo(e){let t=new vh,n=e.split(",");return n.length===15&&(t.rtpTimestamp=Number.parseInt(n[0]),t.captureTimestamp=Number.parseInt(n[1]),t.encodeStartTimestamp=Number.parseInt(n[2]),t.encodeFinishTimestamp=Number.parseInt(n[3]),t.packetizerFinishTimestamp=Number.parseInt(n[4]),t.pacerExitTimestamp=Number.parseInt(n[5]),t.networkTimestamp1=Number.parseInt(n[6]),t.networkTimestamp2=Number.parseInt(n[7]),t.receiveStart=Number.parseInt(n[8]),t.receiveFinish=Number.parseInt(n[9]),t.decodeStart=Number.parseInt(n[10]),t.decodeFinish=Number.parseInt(n[11]),t.renderTime=Number.parseInt(n[12]),t.isOutlier=Number.parseInt(n[13])>0,t.isTriggeredByTimer=Number.parseInt(n[14])>0,t.encoderLatencyMs=t.encodeFinishTimestamp-t.encodeStartTimestamp,t.packetizeLatencyMs=t.packetizerFinishTimestamp-t.encodeFinishTimestamp,t.pacerLatencyMs=t.pacerExitTimestamp-t.packetizerFinishTimestamp,t.captureToSendLatencyMs=t.pacerExitTimestamp-t.captureTimestamp),t}calculateSenderLatency(e,t){let n=t.captureTimestamp+t.senderCaptureTimeOffset,i=this.calculateSenderReceiverClockOffset(e);if(i==null)if(this.latestSenderRecvClockOffset!=null)i=this.latestSenderRecvClockOffset;else return null;else this.latestSenderRecvClockOffset=i;let a=n+i-22089888e5;return t.timestamp-a}getCaptureSource(e){e=e.filter(t=>t.track.kind==="video");for(let t of e){let n=t.getSynchronizationSources().concat(t.getContributingSources());for(let i of n)if(i.captureTimestamp!==void 0&&i.senderCaptureTimeOffset!==void 0&&i.timestamp!==void 0){let s=new xh;return s.timestamp=i.timestamp,s.captureTimestamp=i.captureTimestamp,s.senderCaptureTimeOffset=i.senderCaptureTimeOffset,s}}return null}calculateSenderReceiverClockOffset(e){if(!(e.remoteOutboundVideoStats!==void 0&&e.remoteOutboundVideoStats.timestamp!==void 0&&e.remoteOutboundVideoStats.remoteTimestamp!==void 0))return null;let n=e.remoteOutboundVideoStats.timestamp,i=e.remoteOutboundVideoStats.remoteTimestamp,s=this.getRTTMs(e);if(n!==void 0&&i!==void 0&&s!==null){let o=s*.5;return n-(i+o)}else return null}getRTTMs(e){let t=e.getActiveCandidatePair();return t&&t.currentRoundTripTime!==void 0?t.currentRoundTripTime*1e3:e.remoteOutboundVideoStats&&e.remoteOutboundVideoStats.totalRoundTripTime!==void 0&&e.remoteOutboundVideoStats.roundTripTimeMeasurements!==void 0&&e.remoteOutboundVideoStats.roundTripTimeMeasurements>0?e.remoteOutboundVideoStats.totalRoundTripTime/e.remoteOutboundVideoStats.roundTripTimeMeasurements*1e3:e.remoteOutboundAudioStats&&e.remoteOutboundAudioStats.totalRoundTripTime!==void 0&&e.remoteOutboundAudioStats.roundTripTimeMeasurements!==void 0&&e.remoteOutboundAudioStats.roundTripTimeMeasurements>0?e.remoteOutboundAudioStats.totalRoundTripTime/e.remoteOutboundAudioStats.roundTripTimeMeasurements*1e3:null}},_h=class{constructor(){this.senderLatencyMs=void 0,this.senderLatencyAbsCaptureTimeMs=void 0,this.rttMs=void 0,this.averageProcessingDelayMs=void 0,this.averageJitterBufferDelayMs=void 0,this.averageDecodeLatencyMs=void 0,this.averageAssemblyDelayMs=void 0,this.averageE2ELatency=void 0,this.frameTiming=void 0}};var Sh=function(r,e,t,n){function i(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(h){try{c(n.next(h))}catch(u){o(u)}}function l(h){try{c(n.throw(h))}catch(u){o(u)}}function c(h){h.done?s(h.value):i(h.value).then(a,l)}c((n=n.apply(r,e||[])).next())})},Iy="http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time",ia=class{constructor(e,t,n){this.config=t,this.createPeerConnection(e,n),this.latencyCalculator=new na}createPeerConnection(e,t){this.config.isFlagEnabled(C.ForceTURN)&&(e.iceTransportPolicy="relay",T.Info("Forcing TURN usage by setting ICE Transport Policy in peer connection config.")),this.peerConnection=new RTCPeerConnection(e),this.peerConnection.onsignalingstatechange=n=>this.handleSignalStateChange(n),this.peerConnection.oniceconnectionstatechange=n=>this.handleIceConnectionStateChange(n),this.peerConnection.onicegatheringstatechange=n=>this.handleIceGatheringStateChange(n),this.peerConnection.ontrack=n=>this.handleOnTrack(n),this.peerConnection.onicecandidate=n=>this.handleIceCandidate(n),this.peerConnection.ondatachannel=n=>this.handleDataChannel(n),this.aggregatedStats=new ta,this.preferredCodec=t,this.updateCodecSelection=!0}createOffer(e,t){T.Info("Create Offer");let n=location.hostname==="localhost"||location.hostname==="127.0.0.1",i=location.protocol==="https:",s=t.isFlagEnabled(C.UseMic),o=t.isFlagEnabled(C.UseCamera);(s||o)&&!(n||i)&&(s=!1,o=!1,T.Error("Microphone and Webcam access in the browser will not work if you are not on HTTPS or localhost. Disabling mic and webcam access."),T.Error("For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")),this.setupTransceiversAsync(s,o).finally(()=>{var a;(a=this.peerConnection)===null||a===void 0||a.createOffer(e).then(l=>{var c;this.showTextOverlayConnecting(),l.sdp=this.mungeSDP(l.sdp,s),(c=this.peerConnection)===null||c===void 0||c.setLocalDescription(l),this.onSendWebRTCOffer(l)}).catch(()=>{this.showTextOverlaySetupFailure()})})}receiveOffer(e,t){var n;T.Info("Receive Offer"),this.isFirefox()&&(e.sdp=e.sdp.replace(/^a=extmap:\d+ http:\/\/www\.webrtc\.org\/experiments\/rtp-hdrext\/abs-capture-time\r\n/gm,"")),(n=this.peerConnection)===null||n===void 0||n.setRemoteDescription(e).then(()=>{this.onSetRemoteDescription(e);let i=location.hostname==="localhost"||location.hostname==="127.0.0.1",s=location.protocol==="https:",o=t.isFlagEnabled(C.UseMic),a=t.isFlagEnabled(C.UseCamera);(o||a)&&!(i||s)&&(o=!1,a=!1,T.Error("Microphone and Webcam access in the browser will not work if you are not on HTTPS or localhost. Disabling mic and webcam access."),T.Error("For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")),this.config.setOptionSettingOptions(W.PreferredCodec,this.fuzzyIntersectUEAndBrowserCodecs(e)),this.setupTransceiversAsync(o,a).finally(()=>{var l;(l=this.peerConnection)===null||l===void 0||l.createAnswer().then(c=>{var h;return c.sdp=this.mungeSDP(c.sdp,o),(h=this.peerConnection)===null||h===void 0?void 0:h.setLocalDescription(c)}).then(()=>{var c;this.onSetLocalDescription((c=this.peerConnection)===null||c===void 0?void 0:c.localDescription)}).catch(c=>{T.Error(`createAnswer() failed - ${c}`)})})})}receiveAnswer(e){var t;(t=this.peerConnection)===null||t===void 0||t.setRemoteDescription(e),this.config.setOptionSettingOptions(W.PreferredCodec,this.fuzzyIntersectUEAndBrowserCodecs(e))}generateStats(){var e;(e=this.peerConnection)===null||e===void 0||e.getStats().then(t=>{var n;if(this.aggregatedStats.processStats(t),this.onVideoStats(this.aggregatedStats),!this.peerConnection)return;let i=this.latencyCalculator.calculate(this.aggregatedStats,this.peerConnection.getReceivers());if(this.onLatencyCalculated(i),this.updateCodecSelection&&this.aggregatedStats.inboundVideoStats.codecId){let s=this.aggregatedStats.codecs.get(this.aggregatedStats.inboundVideoStats.codecId);if(s===void 0)return;let o=s.mimeType.replace("video/",""),a=o;s.sdpFmtpLine&&s.sdpFmtpLine.trim()!==""&&(a=`${o} ${s.sdpFmtpLine.trim()}`);let l=this.config.getSettingOption(W.PreferredCodec).options,c=vn(a),h=(n=l.find(u=>u===a))!==null&&n!==void 0?n:l.find(u=>vn(u)===c);if(h!==void 0){this.config.setOptionSettingValue(W.PreferredCodec,h);return}}})}close(){this.peerConnection&&(this.peerConnection.close(),this.peerConnection=null)}mungeSDP(e,t){let n=e.replace(/(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm,`$1;x-google-start-bitrate=10000;x-google-max-bitrate=100000\r
`),i="maxaveragebitrate=510000;";return t&&(i+="sprop-maxcapturerate=48000;"),i+=this.config.isFlagEnabled(C.ForceMonoAudio)?"stereo=0;":"stereo=1;",i+="useinbandfec=1",n=n.replace("useinbandfec=1",i),this.config.isFlagEnabled(C.EnableCaptureTimeExt)&&!this.isFirefox()&&(n=so.addVideoHeaderExtensionToSdp(n,Iy)),n}isFirefox(){return navigator.userAgent.indexOf("Firefox")>0}handleOnIce(e){var t;if(T.Info("peerconnection handleOnIce"),this.config.isFlagEnabled(C.ForceTURN)&&e.candidate.indexOf("relay")<0){T.Info(`Dropping candidate because it was not TURN relay. | Type= ${e.type} | Protocol= ${e.protocol} | Address=${e.address} | Port=${e.port} |`);return}(t=this.peerConnection)===null||t===void 0||t.addIceCandidate(e)}handleSignalStateChange(e){var t;T.Info("signaling state change: "+((t=this.peerConnection)===null||t===void 0?void 0:t.signalingState))}handleIceConnectionStateChange(e){var t;T.Info("ice connection state change: "+((t=this.peerConnection)===null||t===void 0?void 0:t.iceConnectionState)),this.onIceConnectionStateChange(e)}handleIceGatheringStateChange(e){T.Info("ice gathering state change: "+JSON.stringify(e))}handleOnTrack(e){e.streams.length<1||e.streams[0].id==="probator"||(e.track.kind==="video"&&(this.videoTrack=e.track),e.track.kind==="audio"&&(this.audioTrack=e.track),this.onTrack(e))}handleIceCandidate(e){this.onPeerIceCandidate(e)}handleDataChannel(e){this.onDataChannel(e)}onTrack(e){}onIceConnectionStateChange(e){}onPeerIceCandidate(e){}onDataChannel(e){}fuzzyIntersectUEAndBrowserCodecs(e){var t;let n=new Array,i=this.parseAvailableCodecs(e),s=this.config.getSettingOption(W.PreferredCodec).options;for(let o of i){let a=vn(o),l=(t=s.find(c=>c===o))!==null&&t!==void 0?t:s.find(c=>vn(c)===a);l!==void 0&&!n.includes(l)&&n.push(l)}return n}setupTransceiversAsync(e,t){return Sh(this,void 0,void 0,function*(){var n,i,s,o,a,l,c,h,u,d;let f=!1;for(let g of(i=(n=this.peerConnection)===null||n===void 0?void 0:n.getTransceivers())!==null&&i!==void 0?i:[])if(g&&g.receiver&&g.receiver.track&&g.receiver.track.kind==="video"){f=!0;break}if(t?yield this.setupVideoSender(f):f||(s=this.peerConnection)===null||s===void 0||s.addTransceiver("video",{direction:"recvonly"}),RTCRtpReceiver.getCapabilities&&this.preferredCodec!=""){let g=this.config.getSettingOption(W.PreferredCodec).options,y=Dd(this.preferredCodec,g),v=Fd((a=(o=RTCRtpReceiver.getCapabilities("video"))===null||o===void 0?void 0:o.codecs)!==null&&a!==void 0?a:[],y!==void 0?[y,...g]:g);for(let _ of(c=(l=this.peerConnection)===null||l===void 0?void 0:l.getTransceivers())!==null&&c!==void 0?c:[])_&&_.receiver&&_.receiver.track&&_.receiver.track.kind==="video"&&_.setCodecPreferences&&v.length>0&&_.setCodecPreferences(v)}let p=!1;for(let g of(u=(h=this.peerConnection)===null||h===void 0?void 0:h.getTransceivers())!==null&&u!==void 0?u:[])if(g&&g.receiver&&g.receiver.track&&g.receiver.track.kind==="audio"){p=!0;break}e?yield this.setupAudioSender(p):p||(d=this.peerConnection)===null||d===void 0||d.addTransceiver("audio",{direction:"recvonly"})})}setupVideoSender(e){return Sh(this,void 0,void 0,function*(){var t,n,i,s;let o={video:!0},a=yield navigator.mediaDevices.getUserMedia(o);if(a)if(e){for(let l of(n=(t=this.peerConnection)===null||t===void 0?void 0:t.getTransceivers())!==null&&n!==void 0?n:[])if(Yt.canTransceiverReceiveVideo(l))for(let c of a.getTracks())c.kind==="video"&&(l.sender.replaceTrack(c),l.direction="sendrecv")}else for(let l of a.getTracks())l.kind==="video"&&((i=this.peerConnection)===null||i===void 0||i.addTransceiver(l,{direction:"sendrecv"}));else e||(s=this.peerConnection)===null||s===void 0||s.addTransceiver("video",{direction:"recvonly"})})}setupAudioSender(e){return Sh(this,void 0,void 0,function*(){var t,n,i,s;let a={video:!1,audio:{autoGainControl:!1,channelCount:1,echoCancellation:!1,latency:0,noiseSuppression:!1,sampleRate:48e3,sampleSize:16,volume:1}},l=yield navigator.mediaDevices.getUserMedia(a);if(l)if(e){for(let c of(n=(t=this.peerConnection)===null||t===void 0?void 0:t.getTransceivers())!==null&&n!==void 0?n:[])if(Yt.canTransceiverReceiveAudio(c))for(let h of l.getTracks())h.kind==="audio"&&(c.sender.replaceTrack(h),c.direction="sendrecv")}else for(let c of l.getTracks())c.kind==="audio"&&((i=this.peerConnection)===null||i===void 0||i.addTransceiver(c,{direction:"sendrecv"}));else e||(s=this.peerConnection)===null||s===void 0||s.addTransceiver("audio",{direction:"recvonly"})})}onVideoStats(e){}onLatencyCalculated(e){}onSendWebRTCOffer(e){}onSetRemoteDescription(e){}onSetLocalDescription(e){}showTextOverlayConnecting(){}showTextOverlaySetupFailure(){}parseAvailableCodecs(e){if(!RTCRtpReceiver.getCapabilities)return["Only available on Chrome"];let t=[],n=(0,sa.splitSections)(e.sdp);return n.shift(),n.forEach(i=>{let{codecs:s}=(0,sa.parseRtpParameters)(i),o=/(VP\d|H26\d|AV1).*/;s.forEach(a=>{let l=a.name+" "+Object.keys(a.parameters||{}).map(h=>h+"="+a.parameters[h]).join(";");if(o.exec(l)!==null){let h=a.name+" "+Object.keys(a.parameters||{}).map(u=>u+"="+a.parameters[u]).join(";");t.push(h)}})}),t}};var ra=class{constructor(){this.PixelStreamingSettings=new bh,this.EncoderSettings=new Mh,this.WebRTCSettings=new wh}ueCompatible(){this.WebRTCSettings.MaxFPS!=null&&(this.WebRTCSettings.FPS=this.WebRTCSettings.MaxFPS)}},bh=class{},Mh=class{},wh=class{};var oa=class{constructor(){this.ReceiptTimeMs=null,this.TransmissionTimeMs=null,this.PreCaptureTimeMs=null,this.PostCaptureTimeMs=null,this.PreEncodeTimeMs=null,this.PostEncodeTimeMs=null,this.EncodeMs=null,this.CaptureToSendMs=null,this.testStartTimeMs=0,this.browserReceiptTimeMs=0,this.latencyExcludingDecode=0,this.testDuration=0,this.networkLatency=0,this.browserSendLatency=0,this.frameDisplayDeltaTimeMs=0,this.endToEndLatency=0,this.encodeLatency=0}setFrameDisplayDeltaTime(e){this.frameDisplayDeltaTimeMs==0&&(this.frameDisplayDeltaTimeMs=Math.round(e))}processFields(){this.EncodeMs==null&&(this.PreEncodeTimeMs!=null||this.PostEncodeTimeMs!=null)&&(T.Info(`Setting Encode Ms 
 ${this.PostEncodeTimeMs} 
 ${this.PreEncodeTimeMs}`),this.EncodeMs=this.PostEncodeTimeMs-this.PreEncodeTimeMs),this.CaptureToSendMs==null&&(this.PreCaptureTimeMs!=null||this.PostCaptureTimeMs!=null)&&(T.Info(`Setting CaptureToSendMs Ms 
 ${this.PostCaptureTimeMs} 
 ${this.PreCaptureTimeMs}`),this.CaptureToSendMs=this.PostCaptureTimeMs-this.PreCaptureTimeMs)}};var fi=class{static setExtensionFromBytes(e,t){t.receiving||(t.mimetype="",t.extension="",t.receiving=!0,t.valid=!1,t.chunks=0,t.data=[],t.timestampStart=new Date().getTime(),T.Info("Received first chunk of file"));let n=new TextDecoder("utf-16").decode(e.slice(1));T.Info(n),t.extension=n}static setMimeTypeFromBytes(e,t){t.receiving||(t.mimetype="",t.extension="",t.receiving=!0,t.valid=!1,t.chunks=0,t.data=[],t.timestampStart=new Date().getTime(),T.Info("Received first chunk of file"));let n=new TextDecoder("utf-16").decode(e.slice(1));T.Info(n),t.mimetype=n}static setContentsFromBytes(e,t){if(!t.receiving)return;let n=1,i=4,s=16*1024,o=n+i,a=s-o;t.chunks=Math.ceil(new DataView(e.slice(n,o).buffer).getInt32(0,!0)/a);let l=e.slice(o);if(t.data.push(l),T.Info(`Received file chunk: ${t.data.length}/${t.chunks}`),t.data.length===t.chunks){t.receiving=!1,t.valid=!0,T.Info("Received complete file");let c=new Date().getTime()-t.timestampStart,h=Math.round(t.chunks*s/c);T.Info(`Average transfer bitrate: ${h}kb/s over ${c/1e3} seconds`)}else t.data.length>t.chunks&&(t.receiving=!1,T.Error(`Received bigger file than advertised: ${t.data.length}/${t.chunks}`))}},aa=class{constructor(){this.mimetype="",this.extension="",this.receiving=!1,this.chunks=0,this.data=[],this.valid=!1}};var Se=class{};Se.backSpace=8;Se.shift=16;Se.control=17;Se.alt=18;Se.rightShift=253;Se.rightControl=254;Se.rightAlt=255;var fs=Object.freeze({Escape:27,Digit0:48,Digit1:49,Digit2:50,Digit3:51,Digit4:52,Digit5:53,Digit6:54,Digit7:55,Digit8:56,Digit9:57,Minus:173,Equal:187,Backspace:8,Tab:9,KeyQ:81,KeyW:87,KeyE:69,KeyR:82,KeyT:84,KeyY:89,KeyU:85,KeyI:73,KeyO:79,KeyP:80,BracketLeft:219,BracketRight:221,Enter:13,ControlLeft:17,KeyA:65,KeyS:83,KeyD:68,KeyF:70,KeyG:71,KeyH:72,KeyJ:74,KeyK:75,KeyL:76,Semicolon:186,Quote:222,Backquote:192,ShiftLeft:16,Backslash:220,KeyZ:90,KeyX:88,KeyC:67,KeyV:86,KeyB:66,KeyN:78,KeyM:77,Comma:188,Period:190,Slash:191,ShiftRight:253,AltLeft:18,Space:32,CapsLock:20,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,Pause:19,ScrollLock:145,NumpadDivide:111,NumpadMultiply:106,NumpadSubtract:109,NumpadAdd:107,NumpadDecimal:110,Numpad9:105,Numpad8:104,Numpad7:103,Numpad6:102,Numpad5:101,Numpad4:100,Numpad3:99,Numpad2:98,Numpad1:97,Numpad0:96,NumLock:144,ControlRight:254,AltRight:255,Home:36,End:35,ArrowUp:38,ArrowLeft:37,ArrowRight:39,ArrowDown:40,PageUp:33,PageDown:34,Insert:45,Delete:46,ContextMenu:93,MetaLeft:91,MetaRight:92,OSLeft:91,OSRight:92});var la=class{constructor(e,t,n){this.streamMessageController=e,this.config=t,this.activeKeys=n,this.onKeyDownListener=this.handleOnKeyDown.bind(this),this.onKeyUpListener=this.handleOnKeyUp.bind(this),this.onKeyPressListener=this.handleOnKeyPress.bind(this)}register(){document.addEventListener("keydown",this.onKeyDownListener),document.addEventListener("keyup",this.onKeyUpListener),document.addEventListener("keypress",this.onKeyPressListener)}unregister(){document.removeEventListener("keydown",this.onKeyDownListener),document.removeEventListener("keyup",this.onKeyUpListener),document.removeEventListener("keypress",this.onKeyPressListener)}handleOnKeyDown(e){var t;let n=this.getKeycode(e);if(!n||n===229)return;(t=this.streamMessageController.toStreamerHandlers.get("KeyDown"))===null||t===void 0||t([this.getKeycode(e),e.repeat?1:0]),this.activeKeys.getActiveKeys().push(n),n===Se.backSpace&&this.handleOnKeyPress(new KeyboardEvent("keypress",{charCode:Se.backSpace,keyCode:Se.backSpace})),this.config.isFlagEnabled(C.SuppressBrowserKeys)&&this.isKeyCodeBrowserKey(n)&&e.preventDefault()}handleOnKeyUp(e){var t;let n=this.getKeycode(e);if(!n)return;(t=this.streamMessageController.toStreamerHandlers.get("KeyUp"))===null||t===void 0||t([n]),this.config.isFlagEnabled(C.SuppressBrowserKeys)&&this.isKeyCodeBrowserKey(n)&&e.preventDefault()}handleOnKeyPress(e){var t;let n=this.getKeycode(e);if(!n)return;(t=this.streamMessageController.toStreamerHandlers.get("KeyPress"))===null||t===void 0||t([n])}getKeycode(e){if(!("keyCode"in e)){let t=e;return t.code in fs?fs[t.code]:(T.Warning(`Keyboard code of ${t.code} is not supported in our mapping, ignoring this key.`),null)}return e.keyCode===Se.shift&&e.code==="ShiftRight"?Se.rightShift:e.keyCode===Se.control&&e.code==="ControlRight"?Se.rightControl:e.keyCode===Se.alt&&e.code==="AltRight"?Se.rightAlt:e.code==="MetaLeft"||e.code==="OSLeft"?fs.MetaLeft:e.code==="MetaRight"||e.code==="OSRight"?fs.MetaRight:e.keyCode}isKeyCodeBrowserKey(e){return e>=112&&e<=123||e===9}};var ge=class{};ge.mainButton=0;ge.auxiliaryButton=1;ge.secondaryButton=2;ge.fourthButton=3;ge.fifthButton=4;var we=class{};we.primaryButton=1;we.secondaryButton=2;we.auxiliaryButton=4;we.fourthButton=8;we.fifthButton=16;var pi=class{constructor(e,t,n,i,s){this.streamMessageController=e,this.coordinateConverter=n,this.videoPlayer=t,this.activeKeys=i,this.config=s,this.onEnterListener=this.onMouseEnter.bind(this),this.onLeaveListener=this.onMouseLeave.bind(this)}register(){this.registerMouseEnterAndLeaveEvents()}unregister(){this.unregisterMouseEnterAndLeaveEvents()}registerMouseEnterAndLeaveEvents(){let e=this.videoPlayer.getVideoParentElement();e?.addEventListener("mouseenter",this.onEnterListener),e?.addEventListener("mouseleave",this.onLeaveListener)}unregisterMouseEnterAndLeaveEvents(){let e=this.videoPlayer.getVideoParentElement();e?.removeEventListener("mouseenter",this.onEnterListener),e?.removeEventListener("mouseleave",this.onLeaveListener)}onMouseEnter(e){var t;this.videoPlayer.isVideoReady()&&((t=this.streamMessageController.toStreamerHandlers.get("MouseEnter"))===null||t===void 0||t(),this.pressMouseButtons(e.buttons,e.x,e.y))}onMouseLeave(e){var t;this.videoPlayer.isVideoReady()&&((t=this.streamMessageController.toStreamerHandlers.get("MouseLeave"))===null||t===void 0||t(),this.releaseMouseButtons(e.buttons,e.x,e.y))}releaseMouseButtons(e,t,n){let i=this.coordinateConverter.translateUnsigned(t,n);e&we.primaryButton&&this.sendMouseUp(ge.mainButton,i.x,i.y),e&we.secondaryButton&&this.sendMouseUp(ge.secondaryButton,i.x,i.y),e&we.auxiliaryButton&&this.sendMouseUp(ge.auxiliaryButton,i.x,i.y),e&we.fourthButton&&this.sendMouseUp(ge.fourthButton,i.x,i.y),e&we.fifthButton&&this.sendMouseUp(ge.fifthButton,i.x,i.y)}pressMouseButtons(e,t,n){if(!this.videoPlayer.isVideoReady())return;let i=this.coordinateConverter.translateUnsigned(t,n);e&we.primaryButton&&this.sendMouseDown(ge.mainButton,i.x,i.y),e&we.secondaryButton&&this.sendMouseDown(ge.secondaryButton,i.x,i.y),e&we.auxiliaryButton&&this.sendMouseDown(ge.auxiliaryButton,i.x,i.y),e&we.fourthButton&&this.sendMouseDown(ge.fourthButton,i.x,i.y),e&we.fifthButton&&this.sendMouseDown(ge.fifthButton,i.x,i.y)}sendMouseDown(e,t,n){var i;(i=this.streamMessageController.toStreamerHandlers.get("MouseDown"))===null||i===void 0||i([e,t,n])}sendMouseUp(e,t,n){var i;let s=this.coordinateConverter.translateUnsigned(t,n);(i=this.streamMessageController.toStreamerHandlers.get("MouseUp"))===null||i===void 0||i([e,s.x,s.y])}};var ca=class extends pi{constructor(e,t,n,i,s){super(e,t,n,i,s),this.videoElementParent=t.getVideoParentElement(),this.x=this.videoElementParent.getBoundingClientRect().width/2,this.y=this.videoElementParent.getBoundingClientRect().height/2,this.normalizedCoord=this.coordinateConverter.translateUnsigned(this.x,this.y),this.onRequestLockListener=this.onRequestLock.bind(this),this.onLockStateChangeListener=this.onLockStateChange.bind(this),this.onMouseUpListener=this.onMouseUp.bind(this),this.onMouseDownListener=this.onMouseDown.bind(this),this.onMouseDblClickListener=this.onMouseDblClick.bind(this),this.onMouseWheelListener=this.onMouseWheel.bind(this),this.onMouseMoveListener=this.onMouseMove.bind(this)}register(){super.register(),this.videoElementParent.requestPointerLock=this.videoElementParent.requestPointerLock||this.videoElementParent.mozRequestPointerLock,document.exitPointerLock=document.exitPointerLock||document.mozExitPointerLock,this.videoElementParent.requestPointerLock&&this.videoElementParent.addEventListener("click",this.onRequestLockListener),document.addEventListener("pointerlockchange",this.onLockStateChangeListener),document.addEventListener("mozpointerlockchange",this.onLockStateChangeListener),this.videoElementParent.addEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.addEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.addEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.addEventListener("dblclick",this.onMouseDblClickListener)}unregister(){let e=document.pointerLockElement||document.mozPointerLockElement;document.exitPointerLock&&e===this.videoElementParent&&document.exitPointerLock(),this.videoElementParent.removeEventListener("click",this.onRequestLockListener),document.removeEventListener("pointerlockchange",this.onLockStateChangeListener),document.removeEventListener("mozpointerlockchange",this.onLockStateChangeListener),document.removeEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.removeEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.removeEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.removeEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.removeEventListener("dblclick",this.onMouseDblClickListener),super.unregister()}onRequestLock(){this.videoElementParent.requestPointerLock()}onLockStateChange(){(document.pointerLockElement||document.mozPointerLockElement)===this.videoElementParent?(T.Info("Pointer locked"),document.addEventListener("mousemove",this.onMouseMoveListener)):(T.Info("The pointer lock status is now unlocked"),document.removeEventListener("mousemove",this.onMouseMoveListener),this.activeKeys.getActiveKeys().forEach(n=>{this.streamMessageController.toStreamerHandlers.get("KeyUp")([n])}))}onMouseDown(e){this.videoPlayer.isVideoReady()&&this.streamMessageController.toStreamerHandlers.get("MouseDown")([e.button,this.normalizedCoord.x,this.normalizedCoord.y])}onMouseUp(e){this.videoPlayer.isVideoReady()&&this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,this.normalizedCoord.x,this.normalizedCoord.y])}onMouseMove(e){if(!this.videoPlayer.isVideoReady())return;let t=this.videoPlayer.getVideoParentElement().clientWidth,n=this.videoPlayer.getVideoParentElement().clientHeight;for(this.x+=e.movementX,this.y+=e.movementY;this.x>t;)this.x-=t;for(;this.y>n;)this.y-=n;for(;this.x<0;)this.x+=t;for(;this.y<0;)this.y+=n;this.normalizedCoord=this.coordinateConverter.translateUnsigned(this.x,this.y);let i=this.coordinateConverter.translateSigned(e.movementX,e.movementY);this.streamMessageController.toStreamerHandlers.get("MouseMove")([this.normalizedCoord.x,this.normalizedCoord.y,i.x,i.y])}onMouseWheel(e){this.videoPlayer.isVideoReady()&&this.streamMessageController.toStreamerHandlers.get("MouseWheel")([e.wheelDelta,this.normalizedCoord.x,this.normalizedCoord.y])}onMouseDblClick(e){this.videoPlayer.isVideoReady()&&(this.streamMessageController.toStreamerHandlers.get("MouseDouble")([e.button,this.normalizedCoord.x,this.normalizedCoord.y]),this.config.isFlagEnabled(C.MouseDoubleClickAutoRelease)&&this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,this.normalizedCoord.x,this.normalizedCoord.y]))}};var ha=class extends pi{constructor(e,t,n,i,s){super(e,t,n,i,s),this.pressedButtons=new Set,this.videoElementParent=t.getVideoParentElement(),this.onMouseUpListener=this.onMouseUp.bind(this),this.onMouseDownListener=this.onMouseDown.bind(this),this.onMouseDblClickListener=this.onMouseDblClick.bind(this),this.onMouseWheelListener=this.onMouseWheel.bind(this),this.onMouseMoveListener=this.onMouseMove.bind(this),this.onContextMenuListener=this.onContextMenu.bind(this)}register(){super.register(),this.videoElementParent.addEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.addEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.addEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.addEventListener("contextmenu",this.onContextMenuListener),this.videoElementParent.addEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.addEventListener("dblclick",this.onMouseDblClickListener)}unregister(){this.videoElementParent.removeEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.removeEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.removeEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.removeEventListener("contextmenu",this.onContextMenuListener),this.videoElementParent.removeEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.removeEventListener("dblclick",this.onMouseDblClickListener),this.pressedButtons.size>0&&(window.removeEventListener("mousemove",this.onMouseMoveListener),window.removeEventListener("mouseup",this.onMouseUpListener),this.pressedButtons.clear()),super.unregister()}startCapturing(){this.videoElementParent.removeEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.removeEventListener("mouseup",this.onMouseUpListener),window.addEventListener("mousemove",this.onMouseMoveListener),window.addEventListener("mouseup",this.onMouseUpListener)}stopCapturing(){window.removeEventListener("mousemove",this.onMouseMoveListener),window.removeEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.addEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.addEventListener("mouseup",this.onMouseUpListener)}offsetFromVideo(e){if(e.currentTarget===this.videoElementParent)return{x:e.offsetX,y:e.offsetY};let t=this.videoElementParent.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}onMouseDown(e){if(!this.videoPlayer.isVideoReady())return;let t=this.offsetFromVideo(e),n=this.coordinateConverter.translateUnsigned(t.x,t.y);this.streamMessageController.toStreamerHandlers.get("MouseDown")([e.button,n.x,n.y]),e.preventDefault(),this.pressedButtons.size===0&&this.startCapturing(),this.pressedButtons.add(e.button)}onMouseUp(e){if(!this.videoPlayer.isVideoReady())return;let t=this.offsetFromVideo(e),n=this.coordinateConverter.translateUnsigned(t.x,t.y);this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,n.x,n.y]),e.preventDefault(),this.pressedButtons.delete(e.button),this.pressedButtons.size===0&&this.stopCapturing()}onContextMenu(e){this.videoPlayer.isVideoReady()&&e.preventDefault()}onMouseMove(e){if(!this.videoPlayer.isVideoReady())return;let t=this.offsetFromVideo(e),n=this.coordinateConverter.translateUnsigned(t.x,t.y),i=this.coordinateConverter.translateSigned(e.movementX,e.movementY);this.streamMessageController.toStreamerHandlers.get("MouseMove")([n.x,n.y,i.x,i.y]),e.currentTarget===this.videoElementParent&&e.preventDefault()}onMouseWheel(e){if(!this.videoPlayer.isVideoReady())return;let t=this.coordinateConverter.translateUnsigned(e.offsetX,e.offsetY);this.streamMessageController.toStreamerHandlers.get("MouseWheel")([e.wheelDelta,t.x,t.y]),e.preventDefault()}onMouseDblClick(e){if(!this.videoPlayer.isVideoReady())return;let t=this.coordinateConverter.translateUnsigned(e.offsetX,e.offsetY);this.streamMessageController.toStreamerHandlers.get("MouseDouble")([e.button,t.x,t.y]),this.config.isFlagEnabled(C.MouseDoubleClickAutoRelease)&&this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,t.x,t.y])}};var ua=class{constructor(e,t,n){this.fingers=[9,8,7,6,5,4,3,2,1,0],this.fingerIds=new Map,this.maxByteValue=255,this.streamMessageController=e,this.videoPlayer=t,this.coordinateConverter=n,this.videoElementParent=t.getVideoElement(),this.onTouchStartListener=this.onTouchStart.bind(this),this.onTouchEndListener=this.onTouchEnd.bind(this),this.onTouchMoveListener=this.onTouchMove.bind(this)}register(){this.videoElementParent.addEventListener("touchstart",this.onTouchStartListener),this.videoElementParent.addEventListener("touchend",this.onTouchEndListener),this.videoElementParent.addEventListener("touchmove",this.onTouchMoveListener)}unregister(){this.videoElementParent.removeEventListener("touchstart",this.onTouchStartListener),this.videoElementParent.removeEventListener("touchend",this.onTouchEndListener),this.videoElementParent.removeEventListener("touchmove",this.onTouchMoveListener)}rememberTouch(e){let t=this.fingers.pop();t===void 0&&T.Info("exhausted touch identifiers"),this.fingerIds.set(e.identifier,t)}forgetTouch(e){this.fingers.push(this.fingerIds.get(e.identifier)),this.fingers.sort(function(t,n){return n-t}),this.fingerIds.delete(e.identifier)}onTouchStart(e){if(this.videoPlayer.isVideoReady()){for(let t=0;t<e.changedTouches.length;t++)this.rememberTouch(e.changedTouches[t]);this.emitTouchData("TouchStart",e.changedTouches),e.preventDefault()}}onTouchEnd(e){if(this.videoPlayer.isVideoReady()){this.emitTouchData("TouchEnd",e.changedTouches);for(let t=0;t<e.changedTouches.length;t++)this.forgetTouch(e.changedTouches[t]);e.preventDefault()}}onTouchMove(e){this.videoPlayer.isVideoReady()&&(this.emitTouchData("TouchMove",e.touches),e.preventDefault())}emitTouchData(e,t){if(!this.videoPlayer.isVideoReady())return;let n=this.videoPlayer.getVideoParentElement().getBoundingClientRect(),i=this.streamMessageController.toStreamerHandlers;for(let s=0;s<t.length;s++){let a=t[s],l=a.clientX-n.left,c=a.clientY-n.top;T.Info(`F${this.fingerIds.get(a.identifier)}=(${l}, ${c})`);let h=this.coordinateConverter.translateUnsigned(l,c);switch(e){case"TouchStart":i.get("TouchStart")([1,h.x,h.y,this.fingerIds.get(a.identifier),this.maxByteValue*(a.force>0?a.force:1),h.inRange?1:0]);break;case"TouchEnd":i.get("TouchEnd")([1,h.x,h.y,this.fingerIds.get(a.identifier),this.maxByteValue*a.force,h.inRange?1:0]);break;case"TouchMove":i.get("TouchMove")([1,h.x,h.y,this.fingerIds.get(a.identifier),this.maxByteValue*(a.force>0?a.force:1),h.inRange?1:0]);break}}}};var da=class{constructor(e,t,n){this.streamMessageController=e,this.videoPlayer=t,this.coordinateConverter=n,this.onTouchStartListener=this.onTouchStart.bind(this),this.onTouchEndListener=this.onTouchEnd.bind(this),this.onTouchMoveListener=this.onTouchMove.bind(this),this.videoElementParentClientRect=this.videoPlayer.getVideoParentElement().getBoundingClientRect()}register(){document.addEventListener("touchstart",this.onTouchStartListener),document.addEventListener("touchend",this.onTouchEndListener),document.addEventListener("touchmove",this.onTouchMoveListener)}unregister(){document.removeEventListener("touchstart",this.onTouchStartListener),document.removeEventListener("touchend",this.onTouchEndListener),document.removeEventListener("touchmove",this.onTouchMoveListener)}onTouchStart(e){if(!(!this.videoPlayer.isVideoReady()||e.target!==this.videoPlayer.getVideoElement())){if(this.fakeTouchFinger==null){let t=e.changedTouches[0];this.fakeTouchFinger={id:t.identifier,x:t.clientX-this.videoElementParentClientRect.left,y:t.clientY-this.videoElementParentClientRect.top};let n=this.videoPlayer.getVideoParentElement(),i=new MouseEvent("mouseenter",t);n.dispatchEvent(i);let s=this.coordinateConverter.translateUnsigned(this.fakeTouchFinger.x,this.fakeTouchFinger.y);this.streamMessageController.toStreamerHandlers.get("MouseDown")([ge.mainButton,s.x,s.y])}e.preventDefault()}}onTouchEnd(e){if(!this.videoPlayer.isVideoReady()||this.fakeTouchFinger==null)return;let t=this.videoPlayer.getVideoParentElement(),n=this.streamMessageController.toStreamerHandlers;for(let i=0;i<e.changedTouches.length;i++){let s=e.changedTouches[i];if(s.identifier===this.fakeTouchFinger.id){let o=s.clientX-this.videoElementParentClientRect.left,a=s.clientY-this.videoElementParentClientRect.top,l=this.coordinateConverter.translateUnsigned(o,a);n.get("MouseUp")([ge.mainButton,l.x,l.y]);let c=new MouseEvent("mouseleave",s);t.dispatchEvent(c),this.fakeTouchFinger=null;break}}e.preventDefault()}onTouchMove(e){if(!this.videoPlayer.isVideoReady()||this.fakeTouchFinger==null)return;let t=this.streamMessageController.toStreamerHandlers;for(let n=0;n<e.touches.length;n++){let i=e.touches[n];if(i.identifier===this.fakeTouchFinger.id){let s=i.clientX-this.videoElementParentClientRect.left,o=i.clientY-this.videoElementParentClientRect.top,a=this.coordinateConverter.translateUnsigned(s,o),l=this.coordinateConverter.translateSigned(s-this.fakeTouchFinger.x,o-this.fakeTouchFinger.y);t.get("MouseMove")([a.x,a.y,l.x,l.y]),this.fakeTouchFinger.x=s,this.fakeTouchFinger.y=o;break}}e.preventDefault()}};function Sn(r){return JSON.parse(JSON.stringify({buttons:r.buttons.map(e=>JSON.parse(JSON.stringify({pressed:e.pressed,touched:e.touched,value:e.value}))),axes:r.axes}))}var mi;(function(r){r[r.RightClusterBottomButton=0]="RightClusterBottomButton",r[r.RightClusterRightButton=1]="RightClusterRightButton",r[r.RightClusterLeftButton=2]="RightClusterLeftButton",r[r.RightClusterTopButton=3]="RightClusterTopButton",r[r.LeftShoulder=4]="LeftShoulder",r[r.RightShoulder=5]="RightShoulder",r[r.LeftTrigger=6]="LeftTrigger",r[r.RightTrigger=7]="RightTrigger",r[r.SelectOrBack=8]="SelectOrBack",r[r.StartOrForward=9]="StartOrForward",r[r.LeftAnalogPress=10]="LeftAnalogPress",r[r.RightAnalogPress=11]="RightAnalogPress",r[r.LeftClusterTopButton=12]="LeftClusterTopButton",r[r.LeftClusterBottomButton=13]="LeftClusterBottomButton",r[r.LeftClusterLeftButton=14]="LeftClusterLeftButton",r[r.LeftClusterRightButton=15]="LeftClusterRightButton",r[r.CentreButton=16]="CentreButton",r[r.LeftStickHorizontal=0]="LeftStickHorizontal",r[r.LeftStickVertical=1]="LeftStickVertical",r[r.RightStickHorizontal=2]="RightStickHorizontal",r[r.RightStickVertical=3]="RightStickVertical"})(mi||(mi={}));var fa=class{constructor(e){this.streamMessageController=e,this.onGamepadConnectedListener=this.onGamepadConnected.bind(this),this.onGamepadDisconnectedListener=this.onGamepadDisconnected.bind(this),this.beforeUnloadListener=this.onBeforeUnload.bind(this),this.requestAnimationFrame=(window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.requestAnimationFrame).bind(window)}register(){window.addEventListener("beforeunload",this.beforeUnloadListener);let e=window;if("GamepadEvent"in e?(window.addEventListener("gamepadconnected",this.onGamepadConnectedListener),window.addEventListener("gamepaddisconnected",this.onGamepadDisconnectedListener)):"WebKitGamepadEvent"in e&&(window.addEventListener("webkitgamepadconnected",this.onGamepadConnectedListener),window.addEventListener("webkitgamepaddisconnected",this.onGamepadDisconnectedListener)),this.controllers=[],navigator.getGamepads)for(let t of navigator.getGamepads())t&&this.onGamepadConnected(new GamepadEvent("gamepadconnected",{gamepad:t}))}unregister(){window.removeEventListener("gamepadconnected",this.onGamepadConnectedListener),window.removeEventListener("gamepaddisconnected",this.onGamepadDisconnectedListener),window.removeEventListener("webkitgamepadconnected",this.onGamepadConnectedListener),window.removeEventListener("webkitgamepaddisconnected",this.onGamepadDisconnectedListener);for(let e of this.controllers)e&&e.id!==void 0&&this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([e.id]);this.controllers=[]}onGamepadResponseReceived(e){for(let t of this.controllers)if(t&&t.id===void 0){t.id=e;break}}onGamepadConnected(e){let t=e.gamepad,n={currentState:Sn(t),prevState:Sn(t),id:void 0};this.controllers[t.index]=n,window.requestAnimationFrame(()=>this.updateStatus()),this.streamMessageController.toStreamerHandlers.get("GamepadConnected")()}onGamepadDisconnected(e){let t=e.gamepad,n=this.controllers[t.index];this.controllers=this.controllers.filter((i,s)=>s!==t.index),n.id!==void 0&&this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([n.id])}scanGamepads(){let e=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():[];for(let t=0;t<e.length;t++)e[t]&&this.controllers[e[t].index]!==void 0&&(this.controllers[e[t].index].currentState=e[t])}updateStatus(){this.scanGamepads();let e=this.streamMessageController.toStreamerHandlers;for(let t of this.controllers){if(!t)continue;let n=t.id===void 0?this.controllers.indexOf(t):t.id,i=t.currentState;for(let o=0;o<t.currentState.buttons.length;o++){let a=o,l=t.currentState.buttons[o],c=t.prevState.buttons[o];l.pressed?a===mi.LeftTrigger?e.get("GamepadAnalog")([n,5,l.value]):a===mi.RightTrigger?e.get("GamepadAnalog")([n,6,l.value]):e.get("GamepadButtonPressed")([n,o,c.pressed?1:0]):!l.pressed&&c.pressed&&(a===mi.LeftTrigger?e.get("GamepadAnalog")([n,5,0]):a===mi.RightTrigger?e.get("GamepadAnalog")([n,6,0]):e.get("GamepadButtonReleased")([n,o,0]))}for(let o=0;o<i.axes.length;o+=2){let a=parseFloat(i.axes[o].toFixed(4)),l=-parseFloat(i.axes[o+1].toFixed(4));e.get("GamepadAnalog")([n,o+1,a]),e.get("GamepadAnalog")([n,o+2,l])}let s=this.controllers.indexOf(t);this.controllers[s].prevState=Sn(i)}this.controllers.length>0&&this.requestAnimationFrame(()=>this.updateStatus())}onBeforeUnload(e){for(let t of this.controllers)!t||t.id===void 0||this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([t.id])}};var pa=class{constructor(e,t,n){this.activeKeys=new Th,this.toStreamerMessagesProvider=e,this.videoElementProvider=t,this.coordinateConverter=n}registerKeyBoard(e){T.Info("Register Keyboard Events");let t=new la(this.toStreamerMessagesProvider,e,this.activeKeys);return t.register(),t}registerMouse(e,t){T.Info("Register Mouse Events");let n;return e==_n.HoveringMouse?n=new ha(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter,this.activeKeys,t):n=new ca(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter,this.activeKeys,t),n.register(),n}registerTouch(e){T.Info("Registering Touch");let t;return e?t=new da(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter):t=new ua(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter),t.register(),t}registerGamePad(){T.Info("Register Game Pad");let e=new fa(this.toStreamerMessagesProvider);return e.register(),e}},Th=class{constructor(){this.activeKeys=[],this.activeKeys=[]}getActiveKeys(){return this.activeKeys}};var ps=class r{constructor(e,t){this.lastTimeResized=new Date().getTime(),this.videoElement=document.createElement("video"),this.config=t,this.videoElement.id="streamingVideo",this.videoElement.disablePictureInPicture=!0,this.videoElement.playsInline=!0,this.videoElement.style.width="100%",this.videoElement.style.height="100%",this.videoElement.style.position="absolute",this.videoElement.style.pointerEvents="all",e.appendChild(this.videoElement),this.onResizePlayerCallback=()=>{T.Warning("Resolution changed, restyling player, did you forget to override this function?")},this.onMatchViewportResolutionCallback=()=>{T.Warning("Resolution changed and match viewport resolution is turned on, did you forget to override this function?")},this.videoElement.onclick=()=>{this.audioElement!==void 0&&this.audioElement.paused&&this.audioElement.play(),this.videoElement.paused&&this.videoElement.play()},this.videoElement.onloadedmetadata=()=>{this.onVideoInitialized()},window.addEventListener("resize",()=>this.resizePlayerStyle(),!0),window.addEventListener("orientationchange",()=>this.onOrientationChange())}destroy(){this.videoElement.src="",this.videoElement.srcObject=null,this.videoElement.remove(),this.audioElement&&(this.audioElement.src="",this.audioElement.srcObject=null,this.audioElement.remove())}setAudioElement(e){this.audioElement=e}play(){return this.videoElement.muted=this.config.isFlagEnabled(C.StartVideoMuted),this.videoElement.autoplay=this.config.isFlagEnabled(C.AutoPlayVideo),this.videoElement.play()}isPaused(){return this.videoElement.paused}isVideoReady(){return this.videoElement.readyState!==void 0&&this.videoElement.readyState>0}hasVideoSource(){return this.videoElement.srcObject!==void 0&&this.videoElement.srcObject!==null}getVideoElement(){return this.videoElement}getVideoParentElement(){var e;return(e=this.videoElement.parentElement)!==null&&e!==void 0?e:void 0}setVideoEnabled(e){this.videoElement.srcObject.getTracks().forEach(n=>n.enabled=e)}onVideoInitialized(){}onOrientationChange(){clearTimeout(this.orientationChangeTimeout),this.orientationChangeTimeout=window.setTimeout(()=>{this.resizePlayerStyle()},500)}resizePlayerStyle(){let e=this.getVideoParentElement();if(e){if(this.updateVideoStreamSize(),e.classList.contains("fixed-size")){this.onResizePlayerCallback();return}this.resizePlayerStyleToFillParentElement(),this.onResizePlayerCallback()}}resizePlayerStyleToFillParentElement(){this.getVideoParentElement().setAttribute("style","top: "+0+"px; left: "+0+"px; width: "+"100%"+"; height: "+"100%"+"; cursor: default;")}updateVideoStreamSize(){if(!this.config.isFlagEnabled(C.MatchViewportResolution))return;if(new Date().getTime()-this.lastTimeResized>300){let t=this.getVideoParentElement();if(!t)return;let n=this.config.hasNumericSetting(I.ViewportResScale)?this.config.getNumericSettingValue(I.ViewportResScale):1,i=Math.round(t.clientWidth*n),s=Math.round(t.clientHeight*n);(i>r.maxEncoderDimension||s>r.maxEncoderDimension)&&T.Warning(`Requested stream resolution (${i}x${s}) exceeds the common H.264 encoder limit of ${r.maxEncoderDimension}x${r.maxEncoderDimension}; encoding may fail. Lower ViewportResScale or disable MatchViewportResolution.`),this.onMatchViewportResolutionCallback(i,s),this.lastTimeResized=new Date().getTime()}else T.Info("Resizing too often - skipping"),clearTimeout(this.resizeTimeoutHandle),this.resizeTimeoutHandle=window.setTimeout(()=>this.updateVideoStreamSize(),100)}};ps.maxEncoderDimension=4096;var ma=class{constructor(){this.toStreamerHandlers=new Map,this.fromStreamerHandlers=new Map,this.toStreamerMessages=new Map,this.fromStreamerMessages=new Map}populateDefaultProtocol(){this.toStreamerMessages.set("IFrameRequest",{id:0,structure:[]}),this.toStreamerMessages.set("RequestQualityControl",{id:1,structure:[]}),this.toStreamerMessages.set("FpsRequest",{id:2,structure:[]}),this.toStreamerMessages.set("AverageBitrateRequest",{id:3,structure:[]}),this.toStreamerMessages.set("StartStreaming",{id:4,structure:[]}),this.toStreamerMessages.set("StopStreaming",{id:5,structure:[]}),this.toStreamerMessages.set("LatencyTest",{id:6,structure:["string"]}),this.toStreamerMessages.set("RequestInitialSettings",{id:7,structure:[]}),this.toStreamerMessages.set("TestEcho",{id:8,structure:[]}),this.toStreamerMessages.set("DataChannelLatencyTest",{id:9,structure:[]}),this.toStreamerMessages.set("UIInteraction",{id:50,structure:["string"]}),this.toStreamerMessages.set("Command",{id:51,structure:["string"]}),this.toStreamerMessages.set("TextboxEntry",{id:52,structure:["string"]}),this.toStreamerMessages.set("KeyDown",{id:60,structure:["uint8","uint8"]}),this.toStreamerMessages.set("KeyUp",{id:61,structure:["uint8"]}),this.toStreamerMessages.set("KeyPress",{id:62,structure:["uint16"]}),this.toStreamerMessages.set("MouseEnter",{id:70,structure:[]}),this.toStreamerMessages.set("MouseLeave",{id:71,structure:[]}),this.toStreamerMessages.set("MouseDown",{id:72,structure:["uint8","uint16","uint16"]}),this.toStreamerMessages.set("MouseUp",{id:73,structure:["uint8","uint16","uint16"]}),this.toStreamerMessages.set("MouseMove",{id:74,structure:["uint16","uint16","int16","int16"]}),this.toStreamerMessages.set("MouseWheel",{id:75,structure:["int16","uint16","uint16"]}),this.toStreamerMessages.set("MouseDouble",{id:76,structure:["uint8","uint16","uint16"]}),this.toStreamerMessages.set("TouchStart",{id:80,structure:["uint8","uint16","uint16","uint8","uint8","uint8"]}),this.toStreamerMessages.set("TouchEnd",{id:81,structure:["uint8","uint16","uint16","uint8","uint8","uint8"]}),this.toStreamerMessages.set("TouchMove",{id:82,structure:["uint8","uint16","uint16","uint8","uint8","uint8"]}),this.toStreamerMessages.set("GamepadConnected",{id:93,structure:[]}),this.toStreamerMessages.set("GamepadButtonPressed",{id:90,structure:["uint8","uint8","uint8"]}),this.toStreamerMessages.set("GamepadButtonReleased",{id:91,structure:["uint8","uint8","uint8"]}),this.toStreamerMessages.set("GamepadAnalog",{id:92,structure:["uint8","uint8","double"]}),this.toStreamerMessages.set("GamepadDisconnected",{id:94,structure:["uint8"]}),this.fromStreamerMessages.set(0,"QualityControlOwnership"),this.fromStreamerMessages.set(1,"Response"),this.fromStreamerMessages.set(2,"Command"),this.fromStreamerMessages.set(3,"FreezeFrame"),this.fromStreamerMessages.set(4,"UnfreezeFrame"),this.fromStreamerMessages.set(5,"VideoEncoderAvgQP"),this.fromStreamerMessages.set(6,"LatencyTest"),this.fromStreamerMessages.set(7,"InitialSettings"),this.fromStreamerMessages.set(8,"FileExtension"),this.fromStreamerMessages.set(9,"FileMimeType"),this.fromStreamerMessages.set(10,"FileContents"),this.fromStreamerMessages.set(11,"TestEcho"),this.fromStreamerMessages.set(12,"InputControlOwnership"),this.fromStreamerMessages.set(13,"GamepadResponse"),this.fromStreamerMessages.set(14,"DataChannelLatencyTest"),this.fromStreamerMessages.set(255,"Protocol")}registerMessageHandler(e,t,n){switch(e){case B.ToStreamer:this.toStreamerHandlers.set(t,n);break;case B.FromStreamer:this.fromStreamerHandlers.set(t,n);break;default:T.Info(`Unknown message direction ${e}`)}}},B;(function(r){r[r.ToStreamer=0]="ToStreamer",r[r.FromStreamer=1]="FromStreamer"})(B||(B={}));var ga=class{constructor(){this.responseEventListeners=new Map}addResponseEventListener(e,t){this.responseEventListeners.set(e,t)}removeResponseEventListener(e){this.responseEventListeners.delete(e)}onResponse(e){T.Info("DataChannelReceiveMessageType.Response");let t=new TextDecoder("utf-16").decode(e.slice(1));T.Info(t),this.responseEventListeners.forEach(n=>{n(t)})}};var ya=class{constructor(e,t){this.dataChannelSender=e,this.toStreamerMessagesMapProvider=t}sendMessageToStreamer(e,t){t===void 0&&(t=[]);let i=this.toStreamerMessagesMapProvider.toStreamerMessages.get(e);if(i===void 0){T.Error(`Attempted to send a message to the streamer with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`);return}if(i.structure&&t&&i.structure.length!==t.length){T.Error(`Provided message data doesn't match expected layout. Expected [ ${i.structure.map(l=>{switch(l){case"uint8":case"uint16":case"int16":case"float":case"double":default:return"number";case"string":return"string";case"raw":return"Uint8Array"}}).toString()} ] but received [ ${t.map(l=>l instanceof Uint8Array?"Uint8Array":typeof l).toString()} ]`);return}let s=0;t.forEach((l,c)=>{switch(i.structure[c]){case"uint8":s+=1;break;case"uint16":s+=2;break;case"int16":s+=2;break;case"float":s+=4;break;case"double":s+=8;break;case"string":s+=2,s+=2*l.length;break;case"raw":s+=l.byteLength;break}});let o=new DataView(new ArrayBuffer(s+1));o.setUint8(0,i.id);let a=1;if(t.forEach((l,c)=>{switch(i.structure[c]){case"uint8":o.setUint8(a,l),a+=1;break;case"uint16":o.setUint16(a,l,!0),a+=2;break;case"int16":o.setInt16(a,l,!0),a+=2;break;case"float":o.setFloat32(a,l,!0),a+=4;break;case"double":o.setFloat64(a,l,!0),a+=8;break;case"string":o.setUint16(a,l.length,!0),a+=2;for(let u=0;u<l.length;u++)o.setUint16(a,l.charCodeAt(u),!0),a+=2;break;case"raw":{let u=l;new Uint8Array(o.buffer).set(u,a),a+=u.byteLength;break}}}),!this.dataChannelSender.canSend()){T.Info(`Data channel cannot send yet, skipping sending message: ${e} - ${new Uint8Array(o.buffer)}`);return}this.dataChannelSender.sendData(o.buffer)}};var xa=class{constructor(e){this.sendMessageController=e}SendRequestQualityControl(){this.sendMessageController.sendMessageToStreamer("RequestQualityControl")}SendMaxFpsRequest(){this.sendMessageController.sendMessageToStreamer("FpsRequest")}SendAverageBitrateRequest(){this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest")}SendStartStreaming(){this.sendMessageController.sendMessageToStreamer("StartStreaming")}SendStopStreaming(){this.sendMessageController.sendMessageToStreamer("StopStreaming")}SendRequestInitialSettings(){this.sendMessageController.sendMessageToStreamer("RequestInitialSettings")}};var va=class{constructor(e){this.dataChannelProvider=e}canSend(){return this.dataChannelProvider.getDataChannelInstance().dataChannel!==void 0&&this.dataChannelProvider.getDataChannelInstance().dataChannel.readyState==="open"}sendData(e){let t=this.dataChannelProvider.getDataChannelInstance();t.dataChannel.readyState==="open"?(t.dataChannel.send(e),T.Info(`Message Sent: ${new Uint8Array(e)}`),this.resetAfkWarningTimerOnDataSend()):T.Error(`Message Failed: ${new Uint8Array(e)}`)}resetAfkWarningTimerOnDataSend(){}};var _a=class{reconfigure(e,t){let n=e.height/e.width,i=t.height/t.width;this.playerIsLarger=n>i,this.playerSize=e,this.ratio=this.playerIsLarger?n/i:i/n}translateUnsigned(e,t){let n=this.playerIsLarger?e/this.playerSize.width:this.ratio*(e/this.playerSize.width-.5)+.5,i=this.playerIsLarger?this.ratio*(t/this.playerSize.height-.5)+.5:t/this.playerSize.height;return n<0||n>1||i<0||i>1?{inRange:!1,x:65535,y:65535}:{inRange:!0,x:n*65536,y:i*65536}}translateSigned(e,t){let n=this.playerIsLarger?e/(.5*this.playerSize.width):this.ratio*e/(.5*this.playerSize.width),i=this.playerIsLarger?this.ratio*t/(.5*this.playerSize.height):t/(.5*this.playerSize.height);return{x:n*32767,y:i*32767}}untranslateUnsigned(e,t){let n=this.playerIsLarger?e/65536:(e/65536-.5)/this.ratio+.5,i=this.playerIsLarger?(t/65536-.5)/this.ratio+.5:t/65536;return{x:n*this.playerSize.width,y:i*this.playerSize.height}}};var gi=class{constructor(e){this._urlParams={};let t=new URLSearchParams(e);for(let[n,i]of t)this._urlParams[n.toLowerCase()]=i}has(e){return e.toLowerCase()in this._urlParams}get(e){return this.has(e)?this._urlParams[e.toLowerCase()]:null}};var Sa=class{constructor(e,t){this.shouldShowPlayOverlay=!0,this.autoJoinTimer=void 0,this.playerId=null,this.config=e,this.pixelStreaming=t,this.responseController=new ga,this.file=new aa,this.sdpConstraints={offerToReceiveAudio:!0,offerToReceiveVideo:!0},this.afkController=new Ko(this.config,this.pixelStreaming,this.onAfkTriggered.bind(this)),this.afkController.onAFKTimedOutCallback=()=>{this.closeSignalingServer("You have been disconnected due to inactivity.",!1)},this.freezeFrameController=new ao(this.pixelStreaming.videoElementParent),this.videoPlayer=new ps(this.pixelStreaming.videoElementParent,this.config),this.videoPlayer.onVideoInitialized=()=>this.handleVideoInitialized(),this.videoPlayer.onMatchViewportResolutionCallback=(n,i)=>{let s={"Resolution.Width":n,"Resolution.Height":i};this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(s)])},this.videoPlayer.onResizePlayerCallback=()=>{this.setUpMouseAndFreezeFrame()},this.streamController=new ro(this.videoPlayer),this.coordinateConverter=new _a,this.sendrecvDataChannelController=new cs,this.recvDataChannelController=new cs,this.registerDataChannelEventEmitters(this.sendrecvDataChannelController),this.registerDataChannelEventEmitters(this.recvDataChannelController),this.dataChannelSender=new va(this.sendrecvDataChannelController),this.dataChannelSender.resetAfkWarningTimerOnDataSend=()=>this.afkController.resetAfkWarningTimer(),this.streamMessageController=new ma,this.transport=new gn(e.webSocketProtocols),this.protocol=new ns(this.transport),this.protocol.addListener(he.config.typeName,n=>this.handleOnConfigMessage(n)),this.protocol.addListener(he.ping.typeName,n=>this.handlePingMessage(n)),this.protocol.addListener(he.streamerList.typeName,n=>this.handleStreamerListMessage(n)),this.protocol.addListener(he.subscribeFailed.typeName,n=>this.handleSubscribeFailedMessage(n)),this.protocol.addListener(he.streamerIdChanged.typeName,n=>this.handleStreamerIDChangedMessage(n)),this.protocol.addListener(he.playerCount.typeName,n=>{let i=n;this.pixelStreaming._onPlayerCount(i.count)}),this.protocol.addListener(he.answer.typeName,n=>this.handleWebRtcAnswer(n)),this.protocol.addListener(he.offer.typeName,n=>this.handleWebRtcOffer(n)),this.protocol.addListener(he.peerDataChannels.typeName,n=>this.handleWebRtcSFUPeerDatachannels(n)),this.protocol.addListener(he.iceCandidate.typeName,n=>{let i=n;this.handleIceCandidate(i.candidate)}),this.protocol.transport.addListener("open",()=>{if(!this.config.isFlagEnabled(C.BrowserSendOffer)){let i=Ve.createMessage(he.listStreamers);this.protocol.sendMessage(i)}this.reconnectAttempt=0,this.isReconnecting=!1}),this.protocol.transport.addListener("error",()=>{T.Error("Got a transport error.")}),this.protocol.transport.addListener("close",n=>{let s=this.config.getNumericSettingValue(I.MaxReconnectAttempts),o=this.reconnectAttempt<s,l=(this.forceReconnect||this.enableAutoReconnect&&s>0&&o)&&n.code!=1001,c=!l,h=this.disconnectMessage?this.disconnectMessage:n.reason;this.forceReconnect=!1,this.config.getSettingOption(W.PreferredCodec).options=qt.getSupportedVideoCodecs(),this.pixelStreaming._onDisconnect(h,c),this.afkController.stopAfkWarningTimer(),this.statsTimerHandle&&window.clearInterval(this.statsTimerHandle),this.setVideoEncoderAvgQP(0),this.setTouchInputEnabled(!1),this.setMouseInputEnabled(!1),this.setKeyboardInputEnabled(!1),this.setGamePadInputEnabled(!1),l&&setTimeout(()=>{this.reconnectAttempt++,this.doReconnect(n.reason)},2e3)}),this.sendMessageController=new ya(this.dataChannelSender,this.streamMessageController),this.toStreamerMessagesController=new xa(this.sendMessageController),this.registerMessageHandlers(),this.streamMessageController.populateDefaultProtocol(),this.inputClassesFactory=new pa(this.streamMessageController,this.videoPlayer,this.coordinateConverter),this.isUsingSFU=!1,this.isUsingSVC=!1,this.isQualityController=!1,this.preferredCodec="",this.enableAutoReconnect=!0,this.forceReconnect=!1,this.reconnectAttempt=0,this.isReconnecting=!1,this.config._addOnOptionSettingChangedListener(W.StreamerId,n=>{if(n===void 0||n==="")return;this.peerConnectionController.peerConnection.close(),this.peerConnectionController.createPeerConnection(this.peerConfig,this.preferredCodec),this.subscribedStream=n;let i=Ve.createMessage(he.subscribe,{streamerId:n});this.protocol.sendMessage(i)}),this.config._addOnOptionSettingChangedListener(W.PreferredQuality,n=>{if(n===void 0||n==="")return;let i;if(this.isUsingSVC)i=Ve.createMessage(he.layerPreference,{spatialLayer:+n[1]-1,temporalLayer:+n[3]-1});else{let o=this.config.getSettingOption(W.PreferredQuality).options.indexOf(n);i=Ve.createMessage(he.layerPreference,{spatialLayer:o,temporalLayer:0})}this.protocol.sendMessage(i)}),this.setVideoEncoderAvgQP(-1),this.signallingUrlBuilder=()=>this.config.getTextSettingValue(rt.SignallingServerUrl)}destroyVideoPlayer(){this.videoPlayer.destroy()}handleOnMessage(e){let t=new Uint8Array(e.data);T.Info("Message incoming:"+t);let n=this.streamMessageController.fromStreamerMessages.get(t[0]);this.streamMessageController.fromStreamerHandlers.get(n)(e.data)}registerMessageHandlers(){this.streamMessageController.registerMessageHandler(B.FromStreamer,"QualityControlOwnership",e=>this.onQualityControlOwnership(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"Response",e=>this.responseController.onResponse(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"Command",e=>{this.onCommand(e)}),this.streamMessageController.registerMessageHandler(B.FromStreamer,"FreezeFrame",e=>this.onFreezeFrameMessage(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"UnfreezeFrame",()=>this.invalidateFreezeFrameAndEnableVideo()),this.streamMessageController.registerMessageHandler(B.FromStreamer,"VideoEncoderAvgQP",e=>this.handleVideoEncoderAvgQP(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"LatencyTest",e=>this.handleLatencyTestResult(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"DataChannelLatencyTest",e=>this.handleDataChannelLatencyTestResponse(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"InitialSettings",e=>this.handleInitialSettings(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"FileExtension",e=>this.onFileExtension(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"FileMimeType",e=>this.onFileMimeType(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"FileContents",e=>this.onFileContents(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"TestEcho",()=>{}),this.streamMessageController.registerMessageHandler(B.FromStreamer,"InputControlOwnership",e=>this.onInputControlOwnership(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"GamepadResponse",e=>this.onGamepadResponse(e)),this.streamMessageController.registerMessageHandler(B.FromStreamer,"Multiplexed",()=>{}),this.streamMessageController.registerMessageHandler(B.FromStreamer,"Protocol",e=>this.onProtocolMessage(e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"IFrameRequest",()=>this.sendMessageController.sendMessageToStreamer("IFrameRequest")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"RequestQualityControl",()=>this.sendMessageController.sendMessageToStreamer("RequestQualityControl")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"FpsRequest",()=>this.sendMessageController.sendMessageToStreamer("FpsRequest")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"AverageBitrateRequest",()=>this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"StartStreaming",()=>this.sendMessageController.sendMessageToStreamer("StartStreaming")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"StopStreaming",()=>this.sendMessageController.sendMessageToStreamer("StopStreaming")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"LatencyTest",e=>this.sendMessageController.sendMessageToStreamer("LatencyTest",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"RequestInitialSettings",()=>this.sendMessageController.sendMessageToStreamer("RequestInitialSettings")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"TestEcho",()=>{}),this.streamMessageController.registerMessageHandler(B.ToStreamer,"UIInteraction",e=>this.sendMessageController.sendMessageToStreamer("UIInteraction",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"Command",e=>this.sendMessageController.sendMessageToStreamer("Command",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"TextboxEntry",e=>this.sendMessageController.sendMessageToStreamer("TextboxEntry",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"KeyDown",e=>this.sendMessageController.sendMessageToStreamer("KeyDown",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"KeyUp",e=>this.sendMessageController.sendMessageToStreamer("KeyUp",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"KeyPress",e=>this.sendMessageController.sendMessageToStreamer("KeyPress",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"MouseEnter",e=>this.sendMessageController.sendMessageToStreamer("MouseEnter",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"MouseLeave",e=>this.sendMessageController.sendMessageToStreamer("MouseLeave",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"MouseDown",e=>this.sendMessageController.sendMessageToStreamer("MouseDown",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"MouseUp",e=>this.sendMessageController.sendMessageToStreamer("MouseUp",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"MouseMove",e=>this.sendMessageController.sendMessageToStreamer("MouseMove",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"MouseWheel",e=>this.sendMessageController.sendMessageToStreamer("MouseWheel",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"MouseDouble",e=>this.sendMessageController.sendMessageToStreamer("MouseDouble",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"TouchStart",e=>this.sendMessageController.sendMessageToStreamer("TouchStart",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"TouchEnd",e=>this.sendMessageController.sendMessageToStreamer("TouchEnd",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"TouchMove",e=>this.sendMessageController.sendMessageToStreamer("TouchMove",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"GamepadConnected",()=>this.sendMessageController.sendMessageToStreamer("GamepadConnected")),this.streamMessageController.registerMessageHandler(B.ToStreamer,"GamepadButtonPressed",e=>this.sendMessageController.sendMessageToStreamer("GamepadButtonPressed",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"GamepadButtonReleased",e=>this.sendMessageController.sendMessageToStreamer("GamepadButtonReleased",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"GamepadAnalog",e=>this.sendMessageController.sendMessageToStreamer("GamepadAnalog",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"GamepadDisconnected",e=>this.sendMessageController.sendMessageToStreamer("GamepadDisconnected",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XREyeViews",e=>this.sendMessageController.sendMessageToStreamer("XREyeViews",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRHMDTransform",e=>this.sendMessageController.sendMessageToStreamer("XRHMDTransform",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRControllerTransform",e=>this.sendMessageController.sendMessageToStreamer("XRControllerTransform",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRSystem",e=>this.sendMessageController.sendMessageToStreamer("XRSystem",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRButtonTouched",e=>this.sendMessageController.sendMessageToStreamer("XRButtonTouched",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRButtonTouchReleased",e=>this.sendMessageController.sendMessageToStreamer("XRButtonTouchReleased",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRButtonPressed",e=>this.sendMessageController.sendMessageToStreamer("XRButtonPressed",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRButtonReleased",e=>this.sendMessageController.sendMessageToStreamer("XRButtonReleased",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"XRAnalog",e=>this.sendMessageController.sendMessageToStreamer("XRAnalog",e)),this.streamMessageController.registerMessageHandler(B.ToStreamer,"ChannelRelayStatus",()=>{}),this.streamMessageController.registerMessageHandler(B.ToStreamer,"Multiplexed",()=>{})}onCommand(e){T.Info("DataChannelReceiveMessageType.Command");let t=new TextDecoder("utf-16").decode(e.slice(1));T.Info("Data Channel Command: "+t);let n=JSON.parse(t);n.command==="onScreenKeyboard"&&this.handleOnScreenKeyboardCommand(n)}handleOnScreenKeyboardCommand(e){var t,n,i,s;let o={showOnScreenKeyboard:(t=e.showOnScreenKeyboard)!==null&&t!==void 0?t:!0,x:(n=e.x)!==null&&n!==void 0?n:0,y:(i=e.y)!==null&&i!==void 0?i:0,contents:(s=e.contents)!==null&&s!==void 0?s:""};this.pixelStreaming.dispatchEvent(new ko(o))}onProtocolMessage(e){try{let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t);Object.prototype.hasOwnProperty.call(n,"Direction")||T.Error("Malformed protocol received. Ensure the protocol message contains a direction");let i=n.Direction;delete n.Direction,T.Info(`Received new ${i==B.FromStreamer?"FromStreamer":"ToStreamer"} protocol. Updating existing protocol...`),Object.keys(n).forEach(s=>{let o=n[s];switch(i){case B.ToStreamer:if(!Object.prototype.hasOwnProperty.call(o,"id")){T.Error(`ToStreamer->${s} protocol definition was malformed as it didn't contain at least an id

                                           Definition was: ${JSON.stringify(o,null,2)}`);return}if(s==="UIInteraction"||s==="Command"||s==="LatencyTest")return;this.streamMessageController.toStreamerHandlers.get(s)?this.streamMessageController.toStreamerMessages.set(s,o):T.Error(`There was no registered handler for "${s}" - try adding one using registerMessageHandler(MessageDirection.ToStreamer, "${s}", myHandler)`);break;case B.FromStreamer:if(!Object.prototype.hasOwnProperty.call(o,"id")){T.Error(`FromStreamer->${s} protocol definition was malformed as it didn't contain at least an id

                            Definition was: ${JSON.stringify(o,null,2)}`);return}this.streamMessageController.fromStreamerHandlers.get(s)?this.streamMessageController.fromStreamerMessages.set(o.id,s):T.Error(`There was no registered handler for "${o}" - try adding one using registerMessageHandler(MessageDirection.FromStreamer, "${s}", myHandler)`);break;default:T.Error(`Unknown direction: ${i}`)}}),this.toStreamerMessagesController.SendRequestInitialSettings(),this.toStreamerMessagesController.SendRequestQualityControl()}catch(t){T.Info(t)}}onInputControlOwnership(e){let t=new Uint8Array(e);T.Info("DataChannelReceiveMessageType.InputControlOwnership");let n=new Boolean(t[1]).valueOf();T.Info(`Received input controller message - will your input control the stream: ${n}`),this.pixelStreaming._onInputControlOwnership(n)}onGamepadResponse(e){let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t);this.gamePadController.onGamepadResponseReceived(n.controllerId)}onAfkTriggered(){this.afkController.onAfkClick(),this.videoPlayer.isPaused()&&this.videoPlayer.hasVideoSource()&&this.playStream()}setAfkEnabled(e){e?this.onAfkTriggered():this.afkController.stopAfkWarningTimer()}tryReconnect(e){this.forceReconnect=!0,this.doReconnect(e)}doReconnect(e){if(!this.protocol){T.Info("This player has no protocol connection.");return}this.isReconnecting=!0,this.protocol.isConnected()?(this.forceReconnect||(this.disconnectMessage=`${e} Reconnecting.`),this.closeSignalingServer(e,!0)):(this.pixelStreaming._onWebRtcAutoConnect(),this.connectToSignallingServer())}loadFreezeFrameOrShowPlayOverlay(){this.pixelStreaming.dispatchEvent(new Lo({shouldShowPlayOverlay:this.shouldShowPlayOverlay,isValid:this.freezeFrameController.valid,jpegData:this.freezeFrameController.jpeg})),this.shouldShowPlayOverlay===!0?(T.Info("showing play overlay"),this.resizePlayerStyle()):(T.Info("showing freeze frame"),this.freezeFrameController.showFreezeFrame()),setTimeout(()=>{this.videoPlayer.setVideoEnabled(!1)},this.freezeFrameController.freezeFrameDelay)}onFreezeFrameMessage(e){T.Info("DataChannelReceiveMessageType.FreezeFrame");let t=new Uint8Array(e);this.freezeFrameController.processFreezeFrameMessage(t,()=>this.loadFreezeFrameOrShowPlayOverlay())}invalidateFreezeFrameAndEnableVideo(){T.Info("DataChannelReceiveMessageType.FreezeFrame"),setTimeout(()=>{this.pixelStreaming.dispatchEvent(new Do),this.freezeFrameController.hideFreezeFrame()},this.freezeFrameController.freezeFrameDelay),this.videoPlayer.getVideoElement()&&this.videoPlayer.setVideoEnabled(!0)}onFileExtension(e){let t=new Uint8Array(e);fi.setExtensionFromBytes(t,this.file)}onFileMimeType(e){let t=new Uint8Array(e);fi.setMimeTypeFromBytes(t,this.file)}onFileContents(e){let t=new Uint8Array(e);fi.setContentsFromBytes(t,this.file)}playStream(){if(!this.videoPlayer.getVideoElement()){let e="Could not play video stream because the video player was not initialized correctly.";this.pixelStreaming.dispatchEvent(new Io({message:e})),T.Error(e),this.closeSignalingServer("Stream not initialized correctly",!1);return}if(!this.videoPlayer.hasVideoSource()){T.Warning("Cannot play stream, the video element has no srcObject to play.");return}if(this.setTouchInputEnabled(this.config.isFlagEnabled(C.TouchInput)),this.pixelStreaming.dispatchEvent(new Po),this.streamController.audioElement.srcObject){let e=this.config.isFlagEnabled(C.StartVideoMuted);this.streamController.audioElement.muted=e,e?this.playVideo():this.streamController.audioElement.play().then(()=>{this.playVideo()}).catch(t=>{T.Info(t),T.Info("Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."),this.pixelStreaming.dispatchEvent(new ls({reason:t}))})}else this.playVideo();this.shouldShowPlayOverlay=!1,this.freezeFrameController.showFreezeFrame()}playVideo(){this.videoPlayer.play().catch(e=>{this.streamController.audioElement.srcObject&&this.streamController.audioElement.pause(),T.Info(e),T.Info("Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."),this.pixelStreaming.dispatchEvent(new ls({reason:e}))})}autoPlayVideoOrSetUpPlayOverlay(){this.config.isFlagEnabled(C.AutoPlayVideo)&&this.playStream(),this.resizePlayerStyle()}connectToSignallingServer(){this.locallyClosed=!1,this.enableAutoReconnect=!0,this.disconnectMessage=null;let e=this.signallingUrlBuilder();this.protocol.connect(e);let t=this.config.getNumericSettingValue(I.KeepaliveDelay);t>0&&(this.keepalive=new os(this.protocol,t),this.keepalive.onTimeout=()=>{T.Error("Protocol timeout"),this.protocol.disconnect()})}startSession(e){if(this.peerConfig=e,this.config.isFlagEnabled(C.ForceTURN)&&!this.checkTurnServerAvailability(e)){T.Info("No turn server was found in the Peer Connection Options. TURN cannot be forced, closing connection. Please use STUN instead"),this.closeSignalingServer("TURN cannot be forced, closing connection. Please use STUN instead.",!1);return}this.peerConnectionController=new ia(this.peerConfig,this.config,this.preferredCodec),this.peerConnectionController.onVideoStats=i=>{this.handleVideoStats(i)},this.peerConnectionController.onLatencyCalculated=i=>{this.pixelStreaming._onLatencyCalculated(i)},this.peerConnectionController.onSendWebRTCOffer=i=>{this.handleSendWebRTCOffer(i)},this.peerConnectionController.onSetLocalDescription=i=>{i.type==="offer"?this.handleSendWebRTCOffer(i):i.type==="answer"?this.handleSendWebRTCAnswer(i):T.Error(`PeerConnectionController onSetLocalDescription was called with unexpected type ${i.type}`)},this.peerConnectionController.onSetRemoteDescription=i=>{i.type==="offer"?this.pixelStreaming._onWebRtcSdpOffer(i):i.type==="answer"?this.pixelStreaming._onWebRtcSdpAnswer(i):T.Error(`PeerConnectionController onSetRemoteDescription was called with unexpected type ${i.type}`)},this.peerConnectionController.onPeerIceCandidate=i=>this.handleSendIceCandidate(i),this.peerConnectionController.onDataChannel=i=>this.handleDataChannel(i),this.peerConnectionController.showTextOverlayConnecting=()=>this.pixelStreaming._onWebRtcConnecting(),this.peerConnectionController.showTextOverlaySetupFailure=()=>this.pixelStreaming._onWebRtcFailed();let t=!1;this.peerConnectionController.onIceConnectionStateChange=()=>{!t&&["connected","completed"].includes(this.peerConnectionController.peerConnection.iceConnectionState)&&(this.pixelStreaming._onWebRtcConnected(),t=!0)},this.peerConnectionController.onTrack=i=>this.streamController.handleOnTrack(i),this.config.isFlagEnabled(C.BrowserSendOffer)&&(this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection,"cirrus",this.datachannelOptions),this.sendrecvDataChannelController.handleOnMessage=i=>this.handleOnMessage(i),this.peerConnectionController.createOffer(this.sdpConstraints,this.config))}checkTurnServerAvailability(e){if(!e.iceServers)return T.Info("A turn sever was not found"),!1;for(let t of e.iceServers)for(let n of t.urls)if(n.includes("turn"))return T.Info(`A turn sever was found at ${n}`),!0;return T.Info("A turn sever was not found"),!1}handleOnConfigMessage(e){this.resizePlayerStyle(),this.startSession(e.peerConnectionOptions)}handlePingMessage(e){this.protocol.sendMessage(Ve.createMessage(he.pong,{time:e.time}))}handleStreamerListMessage(e){T.Info(`Got streamer list ${e.ids}`);let t="",n=this.config.getSettingOption(W.StreamerId);n.selected.toString().trim()&&(t=n.selected);let s=[...e.ids];s.unshift(""),this.config.setOptionSettingOptions(W.StreamerId,s);let o="",a=this.config.isFlagEnabled(C.WaitForStreamer),l=this.config.getNumericSettingValue(I.MaxReconnectAttempts),c=this.config.getNumericSettingValue(I.StreamerAutoJoinInterval),h=this.config.useUrlParams,u=new gi(window.location.search);h&&u.has(W.StreamerId)?t=u.get(W.StreamerId):this.subscribedStream&&(t=this.subscribedStream),t&&e.ids.includes(t)?o=t:(!t||!a)&&e.ids.length==1&&(o=e.ids[0]),o?(this.reconnectAttempt=0,this.isReconnecting=!1,this.config.setOptionSettingValue(W.StreamerId,o)):a&&(this.reconnectAttempt<l?(this.reconnectAttempt++,this.isReconnecting=!0,setTimeout(()=>{this.protocol.sendMessage(Ve.createMessage(he.listStreamers))},c)):(this.reconnectAttempt=0,this.isReconnecting=!1,this.enableAutoReconnect=!1)),this.pixelStreaming.dispatchEvent(new No({messageStreamerList:e,autoSelectedStreamerId:o,wantedStreamerId:t}))}handleSubscribeFailedMessage(e){this.reconnectAttempt=0,this.isReconnecting=!1,this.enableAutoReconnect=!1,this.pixelStreaming._onSubscribeFailed(e.message)}handleStreamerIDChangedMessage(e){let t=e.newID,n=this.config.getSettingOption(W.StreamerId),i=n.onChange;n.onChange=()=>{};let s=n.options;for(let o=0;o<s.length;++o)if(s[o]==this.subscribedStream){s[o]=t;break}n.options=s,n.selected=t,n.onChange=i,this.subscribedStream=e.newID,this.pixelStreaming.dispatchEvent(new Uo({newID:t}))}handleWebRtcAnswer(e){T.Info(`Got answer sdp ${e.sdp}`),e.playerId&&(this.playerId=e.playerId);let t={sdp:e.sdp,type:"answer"};this.peerConnectionController.receiveAnswer(t),this.handlePostWebrtcNegotiation()}handleWebRtcOffer(e){T.Info(`Got offer sdp ${e.sdp}`),e.playerId&&(this.playerId=e.playerId),this.isUsingSFU=e.sfu?e.sfu:!1,this.isUsingSVC=e.scalabilityMode?e.scalabilityMode!="L1T1":!1,(this.isUsingSFU||this.isUsingSVC)&&(this.peerConnectionController.preferredCodec="");let t=e.scalabilityMode?e.scalabilityMode:"L1T1",n=["Default"];if(this.isUsingSFU)if(!this.isUsingSVC)n=["High","Medium","Low"];else{n=[];let s=+t[1],o=+t[3];for(let a=1;a<=s;a++)for(let l=1;l<=o;l++)n.push(`S${a}T${l}`)}this.config.setOptionSettingOptions(W.PreferredQuality,n),this.config.setOptionSettingValue(W.PreferredQuality,n[0]);let i={sdp:e.sdp,type:"offer"};this.peerConnectionController.receiveOffer(i,this.config),this.handlePostWebrtcNegotiation()}handleWebRtcSFUPeerDatachannels(e){let t={ordered:!0,negotiated:!0,id:e.sendStreamId},n=e.sendStreamId!=e.recvStreamId;if(this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection,n?"send-datachannel":"datachannel",t),n){let i={ordered:!0,negotiated:!0,id:e.recvStreamId};this.recvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection,"recv-datachannel",i),this.recvDataChannelController.handleOnOpen=()=>this.protocol.sendMessage(Ve.createMessage(he.peerDataChannelsReady)),this.recvDataChannelController.handleOnMessage=s=>this.handleOnMessage(s)}else this.sendrecvDataChannelController.handleOnMessage=i=>this.handleOnMessage(i)}handlePostWebrtcNegotiation(){this.afkController.startAfkWarningTimer(),this.pixelStreaming._onWebRtcSdp(),this.statsTimerHandle&&this.statsTimerHandle!==void 0&&window.clearInterval(this.statsTimerHandle),this.statsTimerHandle=window.setInterval(()=>this.getStats(),1e3),this.setMouseInputEnabled(this.config.isFlagEnabled(C.MouseInput)),this.setKeyboardInputEnabled(this.config.isFlagEnabled(C.KeyboardInput)),this.setGamePadInputEnabled(this.config.isFlagEnabled(C.GamepadInput))}handleIceCandidate(e){T.Info(`Remote ICE candidate information received: ${JSON.stringify(e)}`);let t=new RTCIceCandidate({candidate:e.candidate,sdpMLineIndex:0});this.peerConnectionController.handleOnIce(t)}handleSendIceCandidate(e){e.candidate&&e.candidate.candidate&&(T.Info("Local ICE candidate generated: "+JSON.stringify(e.candidate)),this.protocol.sendMessage(Ve.createMessage(he.iceCandidate,{candidate:e.candidate})))}handleDataChannel(e){T.Info("Data channel created for us by browser as we are a receiving peer."),this.sendrecvDataChannelController.dataChannel=e.channel,this.sendrecvDataChannelController.setupDataChannel(),this.sendrecvDataChannelController.handleOnMessage=t=>this.handleOnMessage(t)}handleSendWebRTCOffer(e){if(e.type!=="offer"){T.Error(`handleSendWebRTCOffer was called with type ${e.type} - it only expects "offer"`);return}T.Info("Sending the offer to the Server");let t={sdp:e.sdp,minBitrateBps:1e3*this.config.getNumericSettingValue(I.WebRTCMinBitrate),maxBitrateBps:1e3*this.config.getNumericSettingValue(I.WebRTCMaxBitrate)};this.protocol.sendMessage(Ve.createMessage(he.offer,t)),this.pixelStreaming._onWebRtcSdpOffer(e)}handleSendWebRTCAnswer(e){if(e.type!=="answer"){T.Error(`handleSendWebRTCAnswer was called with type ${e.type} - it only expects "answer"`);return}T.Info("Sending the answer to the Server");let t={sdp:e.sdp,minBitrateBps:1e3*this.config.getNumericSettingValue(I.WebRTCMinBitrate),maxBitrateBps:1e3*this.config.getNumericSettingValue(I.WebRTCMaxBitrate)};this.protocol.sendMessage(Ve.createMessage(he.answer,t)),this.isUsingSFU&&this.protocol.sendMessage(Ve.createMessage(he.dataChannelRequest)),this.pixelStreaming._onWebRtcSdpAnswer(e)}setUpMouseAndFreezeFrame(){let e=this.videoPlayer.getVideoParentElement(),t=this.videoPlayer.getVideoElement();this.coordinateConverter.reconfigure({width:e.clientWidth,height:e.clientHeight},{width:t.videoWidth,height:t.videoHeight}),this.freezeFrameController.freezeFrame.resize()}closeSignalingServer(e,t){var n;this.locallyClosed=!0,this.enableAutoReconnect=t,this.disconnectMessage=e,(n=this.protocol)===null||n===void 0||n.disconnect(1e3,e)}closePeerConnection(){var e;(e=this.peerConnectionController)===null||e===void 0||e.close()}close(){this.closeSignalingServer("",!1),this.closePeerConnection()}getStats(){this.peerConnectionController.generateStats()}sendLatencyTest(){this.latencyStartTime=Date.now(),this.streamMessageController.toStreamerHandlers.get("LatencyTest")([JSON.stringify({StartTime:this.latencyStartTime})])}sendDataChannelLatencyTest(e){this.streamMessageController.toStreamerHandlers.get("DataChannelLatencyTest")([JSON.stringify(e)])}sendEncoderMinQP(e){T.Info(`MinQP=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MinQP":e})])}sendEncoderMaxQP(e){T.Info(`MaxQP=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MaxQP":e})])}sendEncoderMinQuality(e){T.Info(`MinQuality=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MinQuality":e})])}sendEncoderMaxQuality(e){T.Info(`MaxQuality=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MaxQuality":e})])}sendWebRTCMinBitrate(e){T.Info(`WebRTC Min Bitrate=${e}`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.MinBitrate":e})])}sendWebRTCMaxBitrate(e){T.Info(`WebRTC Max Bitrate=${e}`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.MaxBitrate":e})])}sendWebRTCFps(e){T.Info(`WebRTC FPS=${e}`),e!=null&&(this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.Fps":e})]),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.MaxFps":e})]))}sendShowFps(){T.Info("----   Sending show stat to UE   ----"),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"stat.fps":""})])}sendIframeRequest(){T.Info("----   Sending Request for an IFrame  ----"),this.streamMessageController.toStreamerHandlers.get("IFrameRequest")()}isDataChannelOpen(){var e,t;return((t=(e=this.sendrecvDataChannelController)===null||e===void 0?void 0:e.dataChannel)===null||t===void 0?void 0:t.readyState)==="open"}emitUIInteraction(e){T.Info("----   Sending custom UIInteraction message   ----"),this.streamMessageController.toStreamerHandlers.get("UIInteraction")([JSON.stringify(e)])}emitCommand(e){T.Info("----   Sending custom Command message   ----"),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(e)])}emitConsoleCommand(e){T.Info("----   Sending custom Command:ConsoleCommand message   ----"),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ConsoleCommand:e})])}sendRequestQualityControlOwnership(){T.Info("----   Sending Request to Control Quality  ----"),this.toStreamerMessagesController.SendRequestQualityControl()}sendTextboxEntry(e){var t;T.Info("----   Sending TextboxEntry message  ----"),(t=this.streamMessageController.toStreamerHandlers.get("TextboxEntry"))===null||t===void 0||t([e])}handleLatencyTestResult(e){T.Info("DataChannelReceiveMessageType.latencyTest");let t=new TextDecoder("utf-16").decode(e.slice(1)),n=new oa;Object.assign(n,JSON.parse(t)),n.processFields(),n.testStartTimeMs=this.latencyStartTime,n.browserReceiptTimeMs=Date.now(),n.latencyExcludingDecode=~~(n.browserReceiptTimeMs-n.testStartTimeMs),n.testDuration=~~(n.TransmissionTimeMs-n.ReceiptTimeMs),n.networkLatency=~~(n.latencyExcludingDecode-n.testDuration),n.frameDisplayDeltaTimeMs&&n.browserReceiptTimeMs&&(n.endToEndLatency=(n.frameDisplayDeltaTimeMs+n.networkLatency,~~+n.CaptureToSendMs)),this.pixelStreaming._onLatencyTestResult(n)}handleDataChannelLatencyTestResponse(e){T.Info("DataChannelReceiveMessageType.dataChannelLatencyResponse");let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t);this.pixelStreaming._onDataChannelLatencyTestResponse(n)}handleInitialSettings(e){T.Info("DataChannelReceiveMessageType.InitialSettings");let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t),i=new ra;n.Encoder&&(i.EncoderSettings=n.Encoder),n.WebRTC&&(i.WebRTCSettings=n.WebRTC),n.PixelStreaming&&(i.PixelStreamingSettings=n.PixelStreaming),n.ConfigOptions&&n.ConfigOptions.DefaultToHover!==void 0&&this.config.setFlagEnabled(C.HoveringMouseMode,!!n.ConfigOptions.DefaultToHover),i.ueCompatible(),T.Info(t),this.pixelStreaming._onInitialSettings(i)}handleVideoEncoderAvgQP(e){T.Info("DataChannelReceiveMessageType.VideoEncoderAvgQP");let t=Number(new TextDecoder("utf-16").decode(e.slice(1)));this.setVideoEncoderAvgQP(t)}handleVideoInitialized(){this.pixelStreaming._onVideoInitialized(),this.autoPlayVideoOrSetUpPlayOverlay(),this.resizePlayerStyle(),this.videoPlayer.updateVideoStreamSize()}onQualityControlOwnership(e){let t=new Uint8Array(e);T.Info("DataChannelReceiveMessageType.QualityControlOwnership"),this.isQualityController=new Boolean(t[1]).valueOf(),T.Info(`Received quality controller message, will control quality: ${this.isQualityController}`),this.pixelStreaming._onQualityControlOwnership(this.isQualityController)}handleVideoStats(e){this.pixelStreaming._onVideoStats(e)}resizePlayerStyle(){this.videoPlayer.resizePlayerStyle()}setPreferredCodec(e){this.preferredCodec=e,this.peerConnectionController&&(this.peerConnectionController.preferredCodec=e,this.peerConnectionController.updateCodecSelection=!1)}setVideoEncoderAvgQP(e){this.videoAvgQp=e,this.pixelStreaming._onVideoEncoderAvgQP(this.videoAvgQp)}setKeyboardInputEnabled(e){var t;(t=this.keyboardController)===null||t===void 0||t.unregister(),e&&(this.keyboardController=this.inputClassesFactory.registerKeyBoard(this.config))}setMouseInputEnabled(e){var t;if((t=this.mouseController)===null||t===void 0||t.unregister(),e){let n=this.config.isFlagEnabled(C.HoveringMouseMode)?_n.HoveringMouse:_n.LockedMouse;this.mouseController=this.inputClassesFactory.registerMouse(n,this.config)}}setTouchInputEnabled(e){var t;(t=this.touchController)===null||t===void 0||t.unregister(),e&&(this.touchController=this.inputClassesFactory.registerTouch(this.config.isFlagEnabled(C.FakeMouseWithTouches)))}setGamePadInputEnabled(e){var t;(t=this.gamePadController)===null||t===void 0||t.unregister(),e&&(this.gamePadController=this.inputClassesFactory.registerGamePad())}registerDataChannelEventEmitters(e){e.onOpen=(t,n)=>this.pixelStreaming.dispatchEvent(new bo({label:t,event:n})),e.onClose=(t,n)=>this.pixelStreaming.dispatchEvent(new Mo({label:t,event:n})),e.onError=(t,n)=>this.pixelStreaming.dispatchEvent(new wo({label:t,event:n}))}registerMessageHandler(e,t,n){t===B.FromStreamer&&typeof n>"u"&&T.Warning(`Unable to register handler for ${e} as no handler was passed`),this.streamMessageController.registerMessageHandler(t,e,i=>typeof n>"u"&&t===B.ToStreamer?this.sendMessageController.sendMessageToStreamer(e,i):n(i))}};var ba=class{constructor(e){this.toStreamerMessagesProvider=e,this.controllers=[]}updateStatus(e,t,n){if(e.gamepad){let i=t.getPose(e.gripSpace,n);if(!i)return;let s=0;e.profiles.includes("htc-vive")?s=1:e.profiles.includes("oculus-touch")&&(s=2),this.toStreamerMessagesProvider.toStreamerHandlers.get("XRSystem")([s]);let o=2;switch(e.handedness){case"left":o=0;break;case"right":o=1;break}let a=i.transform.matrix,l=[];for(let d=0;d<16;d++)l[d]=new Float32Array([a[d]])[0];this.toStreamerMessagesProvider.toStreamerHandlers.get("XRControllerTransform")([l[0],l[4],l[8],l[12],l[1],l[5],l[9],l[13],l[2],l[6],l[10],l[14],l[3],l[7],l[11],l[15],o]),this.controllers[o]===void 0&&(this.controllers[o]={prevState:void 0,currentState:void 0,id:void 0},this.controllers[o].prevState=Sn(e.gamepad)),this.controllers[o].currentState=Sn(e.gamepad);let c=this.controllers[o],h=c.currentState,u=c.prevState;for(let d=0;d<h.buttons.length;d++){let f=h.buttons[d],p=u.buttons[d];if(f.pressed){let g=p.pressed?1:0;this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonPressed")([o,d,g,f.value])}else p.pressed&&this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonReleased")([o,d,0]);if(f.touched){let g=p.touched?1:0;this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonTouched")([o,d,g])}else p.touched&&this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonTouchReleased")([o,d,0])}for(let d=0;d<h.axes.length;d++){let f=h.axes[d],p=u.axes[d];f!=p&&this.toStreamerMessagesProvider.toStreamerHandlers.get("XRAnalog")([o,d,f])}this.controllers[o].prevState=h}}};var ms=class{constructor(e){this.xrViewerPose=null,this.EPSILON=1e-7,this.videoTexture=null,this.prevVideoWidth=0,this.prevVideoHeight=0,this.leftView=null,this.rightView=null,this.lastSentLeftEyeProj=null,this.lastSentRightEyeProj=null,this.lastSentRelativeLeftEyePos=null,this.lastSentRelativeRightEyePos=null,this.xrSession=null,this.webRtcController=e,this.xrGamepadController=new ba(this.webRtcController.streamMessageController),this.onSessionEnded=new EventTarget,this.onSessionStarted=new EventTarget,this.onFrame=new EventTarget}xrClicked(){if(this.xrSession)this.xrSession.end();else{if(!navigator.xr){T.Error("This browser does not support XR.");return}navigator.xr.requestSession("immersive-vr",{optionalFeatures:[]}).then(e=>{this.onXrSessionStarted(e)})}}onXrSessionEnded(){T.Info("XR Session ended"),this.xrSession=null,this.onSessionEnded.dispatchEvent(new Event("xrSessionEnded"))}initGL(){if(this.gl)return;let e=document.createElement("canvas");this.gl=e.getContext("webgl2",{xrCompatible:!0}),this.gl.clearColor(0,0,0,1)}initShaders(){let e=`
        attribute vec2 a_position;
        attribute vec2 a_texCoord;

        // varyings
        varying vec2 v_texCoord;

        void main() {
           gl_Position = vec4(a_position.x, a_position.y, 0, 1);
           // pass the texCoord to the fragment shader
           // The GPU will interpolate this value between points.
           v_texCoord = a_texCoord;
        }
        `,t=`
        precision mediump float;

        // our texture
        uniform sampler2D u_image;

        // the texCoords passed in from the vertex shader.
        varying vec2 v_texCoord;

        void main() {
           gl_FragColor = texture2D(u_image, v_texCoord);
        }
        `,n=this.gl.createShader(this.gl.VERTEX_SHADER);this.gl.shaderSource(n,e),this.gl.compileShader(n);let i=this.gl.createShader(this.gl.FRAGMENT_SHADER);this.gl.shaderSource(i,t),this.gl.compileShader(i);let s=this.gl.createProgram();this.gl.attachShader(s,n),this.gl.attachShader(s,i),this.gl.linkProgram(s),this.gl.useProgram(s),this.positionLocation=this.gl.getAttribLocation(s,"a_position"),this.texcoordLocation=this.gl.getAttribLocation(s,"a_texCoord")}updateVideoTexture(){this.videoTexture||(this.videoTexture=this.gl.createTexture(),this.gl.bindTexture(this.gl.TEXTURE_2D,this.videoTexture),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR));let e=this.webRtcController.videoPlayer.getVideoElement().videoHeight,t=this.webRtcController.videoPlayer.getVideoElement().videoWidth;this.prevVideoHeight!=e||this.prevVideoWidth!=t?this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,t,e,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.webRtcController.videoPlayer.getVideoElement()):this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,0,0,t,e,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.webRtcController.videoPlayer.getVideoElement()),this.prevVideoHeight=e,this.prevVideoWidth=t}initBuffers(){this.positionBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.positionBuffer),this.gl.enableVertexAttribArray(this.positionLocation),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,1,1,1,-1,-1,-1,-1,1,1,1,-1]),this.gl.STATIC_DRAW),this.gl.vertexAttribPointer(this.positionLocation,2,this.gl.FLOAT,!1,0,0),this.texcoordBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.texcoordBuffer),this.gl.enableVertexAttribArray(this.texcoordLocation),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),this.gl.STATIC_DRAW),this.gl.vertexAttribPointer(this.texcoordLocation,2,this.gl.FLOAT,!1,0,0)}onXrSessionStarted(e){T.Info("XR Session started"),this.xrSession=e,this.xrSession.addEventListener("end",()=>{this.onXrSessionEnded()}),this.initGL(),this.initShaders(),this.initBuffers(),e.requestReferenceSpace("local").then(t=>{if(this.xrRefSpace=t,this.xrSession.updateRenderState({baseLayer:new XRWebGLLayer(this.xrSession,this.gl)}),this.xrSession.supportedFrameRates)for(let n of this.xrSession.supportedFrameRates)n==90&&e.updateTargetFrameRate(90);this.xrSession.requestAnimationFrame(this.onXrFrame.bind(this))}),this.onSessionStarted.dispatchEvent(new Event("xrSessionStarted"))}areArraysEqual(e,t){return e.length===t.length&&e.every((n,i)=>Math.abs(n-t[i])<=this.EPSILON)}arePointsEqual(e,t){return Math.abs(e.x-t.x)>=this.EPSILON&&Math.abs(e.y-t.y)>=this.EPSILON&&Math.abs(e.z-t.z)>=this.EPSILON}sendXRDataToUE(){if(this.leftView==null||this.rightView==null)return;let e=this.lastSentLeftEyeProj==null||this.lastSentRightEyeProj==null||this.lastSentRelativeLeftEyePos==null||this.lastSentRelativeRightEyePos==null,t=this.leftView.transform.matrix,n=this.leftView.projectionMatrix,i=this.rightView.transform.matrix,s=this.rightView.projectionMatrix,o=this.xrViewerPose.transform.matrix;if(!e&&this.lastSentLeftEyeProj!=null&&this.lastSentRightEyeProj!=null){let c=this.areArraysEqual(n,this.lastSentLeftEyeProj),h=this.areArraysEqual(s,this.lastSentRightEyeProj);e=c==!1||h==!1}let a=new DOMPointReadOnly(this.leftView.transform.position.x-this.xrViewerPose.transform.position.x,this.leftView.transform.position.y-this.xrViewerPose.transform.position.y,this.leftView.transform.position.z-this.xrViewerPose.transform.position.z,1),l=new DOMPointReadOnly(this.leftView.transform.position.x-this.xrViewerPose.transform.position.x,this.leftView.transform.position.y-this.xrViewerPose.transform.position.y,this.leftView.transform.position.z-this.xrViewerPose.transform.position.z,1);if(!e&&this.lastSentRelativeLeftEyePos!=null&&this.lastSentRelativeRightEyePos!=null){let c=this.arePointsEqual(a,this.lastSentRelativeLeftEyePos),h=this.arePointsEqual(l,this.lastSentRelativeRightEyePos);e=c==!1||h==!1}e?(this.webRtcController.streamMessageController.toStreamerHandlers.get("XREyeViews")([t[0],t[4],t[8],t[12],t[1],t[5],t[9],t[13],t[2],t[6],t[10],t[14],t[3],t[7],t[11],t[15],n[0],n[4],n[8],n[12],n[1],n[5],n[9],n[13],n[2],n[6],n[10],n[14],n[3],n[7],n[11],n[15],i[0],i[4],i[8],i[12],i[1],i[5],i[9],i[13],i[2],i[6],i[10],i[14],i[3],i[7],i[11],i[15],s[0],s[4],s[8],s[12],s[1],s[5],s[9],s[13],s[2],s[6],s[10],s[14],s[3],s[7],s[11],s[15],o[0],o[4],o[8],o[12],o[1],o[5],o[9],o[13],o[2],o[6],o[10],o[14],o[3],o[7],o[11],o[15]]),this.lastSentLeftEyeProj=n,this.lastSentRightEyeProj=s,this.lastSentRelativeLeftEyePos=a,this.lastSentRelativeRightEyePos=l):this.webRtcController.streamMessageController.toStreamerHandlers.get("XRHMDTransform")([o[0],o[4],o[8],o[12],o[1],o[5],o[9],o[13],o[2],o[6],o[10],o[14],o[3],o[7],o[11],o[15]])}onXrFrame(e,t){if(this.xrViewerPose=t.getViewerPose(this.xrRefSpace),this.xrViewerPose){if(this.updateViews(),this.leftView==null||this.rightView==null)return;this.sendXRDataToUE(),this.updateVideoTexture(),this.render()}this.webRtcController.config.isFlagEnabled(C.XRControllerInput)&&this.xrSession.inputSources.forEach((n,i,s)=>{this.xrGamepadController.updateStatus(n,t,this.xrRefSpace)},this),this.xrSession.requestAnimationFrame((n,i)=>this.onXrFrame(n,i)),this.onFrame.dispatchEvent(new Go({time:e,frame:t}))}updateViews(){if(this.xrViewerPose)for(let e of this.xrViewerPose.views)e.eye==="left"?this.leftView=e:e.eye==="right"&&(this.rightView=e)}render(){if(!this.gl)return;let e=this.xrSession.renderState.baseLayer;this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,e.framebuffer),this.gl.viewport(0,0,e.framebufferWidth,e.framebufferHeight),this.gl.drawArrays(this.gl.TRIANGLES,0,6)}static isSessionSupported(e){location.protocol!=="https:"&&T.Info("WebXR requires https, if you want WebXR use https.");try{if(navigator.xr)return navigator.xr.isSessionSupported(e)}catch{return Promise.resolve(!1)}return Promise.resolve(!1)}};var Ma=class{constructor(e){this.seq=e.Seq,this.playerSentTimestamp=Date.now(),this.requestFillerSize=e.Filler?e.Filler.length:0}update(e){this.playerReceivedTimestamp=Date.now(),this.streamerReceivedTimestamp=e.ReceivedTimestamp,this.streamerSentTimestamp=e.SentTimestamp,this.responseFillerSize=e.Filler?e.Filler.length:0}};var wa=class{constructor(e,t){this.intervalHandle=void 0,this.sink=e,this.callback=t,this.records=new Map,this.seq=0}start(e){return this.isRunning()?!1:(this.startTime=Date.now(),this.records.clear(),this.intervalHandle=window.setInterval((()=>{Date.now()-this.startTime>=e.duration?this.stop():this.sendRequest(e.requestSize,e.responseSize)}).bind(this),Math.floor(1e3/e.rps)),!0)}stop(){this.intervalHandle&&(window.clearInterval(this.intervalHandle),this.intervalHandle=void 0,this.callback(this.produceResult()))}produceResult(){let e=new Map(this.records);return{records:e,dataChannelRtt:Math.ceil(Array.from(this.records.values()).reduce((t,n)=>t+(n.playerReceivedTimestamp-n.playerSentTimestamp),0)/this.records.size),playerToStreamerTime:Math.ceil(Array.from(this.records.values()).reduce((t,n)=>t+(n.streamerReceivedTimestamp-n.playerSentTimestamp),0)/this.records.size),streamerToPlayerTime:Math.ceil(Array.from(this.records.values()).reduce((t,n)=>t+(n.playerReceivedTimestamp-n.streamerSentTimestamp),0)/this.records.size),exportLatencyAsCSV:()=>{let t=`Timestamp;RTT;PlayerToStreamer;StreamerToPlayer;
`;return e.forEach(n=>{t+=n.playerSentTimestamp+";",t+=n.playerReceivedTimestamp-n.playerSentTimestamp+";",t+=n.streamerReceivedTimestamp-n.playerSentTimestamp+";",t+=n.playerReceivedTimestamp-n.streamerSentTimestamp+";",t+=`
`}),t}}}isRunning(){return!!this.intervalHandle}receive(e){if(!this.isRunning())return;if(!e){T.Error("Undefined response from server");return}let t=this.records.get(e.Seq);t&&t.update(e)}sendRequest(e,t){let n=this.createRequest(e,t),i=new Ma(n);this.records.set(i.seq,i),this.sink(n)}createRequest(e,t){return{Seq:this.seq++,FillResponseSize:t,Filler:e?"A".repeat(e):""}}};var gs=class{constructor(e,t){this.allowConsoleCommands=!1,this.config=e,t?.videoElementParent&&(this._videoElementParent=t.videoElementParent),this._eventEmitter=new Yo,this.configureSettings(),this.setWebRtcPlayerController(new Sa(this.config,this)),this._webXrController=new ms(this._webRtcController),this._setupWebRtcTCPRelayDetection=this._setupWebRtcTCPRelayDetection.bind(this),this._eventEmitter.addEventListener("webRtcConnected",n=>{this._eventEmitter.addEventListener("statsReceived",this._setupWebRtcTCPRelayDetection)})}get videoElementParent(){return this._videoElementParent||(this._videoElementParent=document.createElement("div"),this._videoElementParent.id="videoElementParent"),this._videoElementParent}configureSettings(){this.config._addOnSettingChangedListener(C.IsQualityController,e=>{e===!0&&!this._webRtcController.isQualityController&&this._webRtcController.sendRequestQualityControlOwnership()}),this.config._addOnSettingChangedListener(C.AFKDetection,e=>{this._webRtcController.setAfkEnabled(e)}),this.config._addOnSettingChangedListener(C.MatchViewportResolution,()=>{this._webRtcController.videoPlayer.updateVideoStreamSize()}),this.config._addOnSettingChangedListener(C.HoveringMouseMode,e=>{this.config.setFlagLabel(C.HoveringMouseMode,`Control Scheme: ${e?"Hovering":"Locked"} Mouse`),this._webRtcController.setMouseInputEnabled(this.config.isFlagEnabled(C.MouseInput))}),this.config._addOnSettingChangedListener(C.KeyboardInput,e=>{this._webRtcController.setKeyboardInputEnabled(e)}),this.config._addOnSettingChangedListener(C.MouseInput,e=>{this._webRtcController.setMouseInputEnabled(e)}),this.config._addOnSettingChangedListener(C.FakeMouseWithTouches,e=>{this._webRtcController.setTouchInputEnabled(this.config.isFlagEnabled(C.TouchInput))}),this.config._addOnSettingChangedListener(C.TouchInput,e=>{this._webRtcController.setTouchInputEnabled(e)}),this.config._addOnSettingChangedListener(C.GamepadInput,e=>{this._webRtcController.setGamePadInputEnabled(e)}),this.config._addOnNumericSettingChangedListener(I.MinQP,e=>{T.Info("--------  Sending MinQP  --------"),this._webRtcController.sendEncoderMinQP(e),T.Info("-------------------------------------------");let t=Math.trunc(100*(1-e/51));this.config.setNumericSetting(I.CompatQualityMax,t)}),this.config._addOnNumericSettingChangedListener(I.MaxQP,e=>{T.Info("--------  Sending MaxQP  --------"),this._webRtcController.sendEncoderMaxQP(e),T.Info("-------------------------------------------");let t=Math.trunc(100*(1-e/51));this.config.setNumericSetting(I.CompatQualityMin,t)}),this.config._addOnNumericSettingChangedListener(I.MinQuality,e=>{T.Info("--------  Sending MinQuality  --------"),this._webRtcController.sendEncoderMinQuality(e),T.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener(I.MaxQuality,e=>{T.Info("--------  Sending MaxQuality  --------"),this._webRtcController.sendEncoderMaxQuality(e),T.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener(I.CompatQualityMin,e=>{e=51-e/100*51,T.Info("--------  Sending MinQP from quality value  --------"),this._webRtcController.sendEncoderMaxQP(e),T.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener(I.CompatQualityMax,e=>{e=51-e/100*51,T.Info("--------  Sending MaxQP from quality value  --------"),this._webRtcController.sendEncoderMinQP(e),T.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener(I.WebRTCMinBitrate,e=>{T.Info("--------  Sending web rtc settings  --------"),this._webRtcController.sendWebRTCMinBitrate(e*1e3),T.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener(I.WebRTCMaxBitrate,e=>{T.Info("--------  Sending web rtc settings  --------"),this._webRtcController.sendWebRTCMaxBitrate(e*1e3),T.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener(I.WebRTCFPS,e=>{T.Info("--------  Sending web rtc settings  --------"),this._webRtcController.sendWebRTCFps(e),T.Info("-------------------------------------------")}),this.config._addOnOptionSettingChangedListener(W.PreferredCodec,e=>{this._webRtcController&&this._webRtcController.setPreferredCodec(e)}),this.config._registerOnChangeEvents(this._eventEmitter)}_onInputControlOwnership(e){this._inputController=e}setWebRtcPlayerController(e){this._webRtcController=e,this._webRtcController.setPreferredCodec(this.config.getSettingOption(W.PreferredCodec).selected),this._webRtcController.resizePlayerStyle(),this.checkForAutoConnect()}connect(){this._eventEmitter.dispatchEvent(new Co),this._webRtcController.connectToSignallingServer()}reconnect(){this._eventEmitter.dispatchEvent(new Ro),this._webRtcController.tryReconnect("Reconnecting...")}disconnect(){this._eventEmitter.dispatchEvent(new Ao),this._webRtcController.close()}play(){this._onStreamLoading(),this._webRtcController.playStream()}checkForAutoConnect(){this.config.isFlagEnabled(C.AutoConnect)&&(this._onWebRtcAutoConnect(),this._webRtcController.connectToSignallingServer())}unmuteMicrophone(e=!1){if(this.config.isFlagEnabled("UseMic")){this.setMicrophoneMuted(!1);return}if(e){this.config.setFlagEnabled("UseMic",!0),this.reconnect();return}T.Warning("Trying to unmute mic, but PixelStreaming was initialized with no microphone track. Call with forceEnable == true to re-connect with a mic track.")}muteMicrophone(){if(this.config.isFlagEnabled("UseMic")){this.setMicrophoneMuted(!0);return}T.Info("Trying to mute mic, but PixelStreaming has no microphone track, so sending sound is already disabled.")}setMicrophoneMuted(e){var t,n,i,s;for(let o of(s=(i=(n=(t=this._webRtcController)===null||t===void 0?void 0:t.peerConnectionController)===null||n===void 0?void 0:n.peerConnection)===null||i===void 0?void 0:i.getTransceivers())!==null&&s!==void 0?s:[])Yt.canTransceiverSendAudio(o)&&(o.sender.track.enabled=!e)}unmuteCamera(e=!1){if(this.config.isFlagEnabled("UseCamera")){this.setCameraMuted(!1);return}if(e){this.config.setFlagEnabled("UseCamera",!0),this.reconnect();return}T.Warning("Trying to unmute video, but PixelStreaming was initialized with no video track. Call with forceEnable == true to re-connect with a video track.")}muteCamera(){if(this.config.isFlagEnabled("UseCamera")){this.setCameraMuted(!0);return}T.Info("Trying to mute camera, but PixelStreaming has no video track, so sending video is already disabled.")}setCameraMuted(e){var t,n,i,s;for(let o of(s=(i=(n=(t=this._webRtcController)===null||t===void 0?void 0:t.peerConnectionController)===null||n===void 0?void 0:n.peerConnection)===null||i===void 0?void 0:i.getTransceivers())!==null&&s!==void 0?s:[])Yt.canTransceiverSendVideo(o)&&(o.sender.track.enabled=!e)}_onWebRtcAutoConnect(){this._eventEmitter.dispatchEvent(new yo)}_onWebRtcSdp(){this._eventEmitter.dispatchEvent(new po)}_onWebRtcSdpOffer(e){this._eventEmitter.dispatchEvent(new go({sdp:e}))}_onWebRtcSdpAnswer(e){this._eventEmitter.dispatchEvent(new mo({sdp:e}))}_onLatencyCalculated(e){this._eventEmitter.dispatchEvent(new Bo({latencyInfo:e}))}_onStreamLoading(){this._eventEmitter.dispatchEvent(new Eo)}_onDisconnect(e,t){this._eventEmitter.dispatchEvent(new So({eventString:e,allowClickToReconnect:t}))}_onWebRtcConnecting(){this._eventEmitter.dispatchEvent(new xo)}_onWebRtcConnected(){this._eventEmitter.dispatchEvent(new vo)}_onWebRtcFailed(){this._eventEmitter.dispatchEvent(new _o)}_onVideoInitialized(){this._eventEmitter.dispatchEvent(new To),this._videoStartTime=Date.now(),this.checkForAutoEnterVR()}checkForAutoEnterVR(){this.config.isFlagEnabled(C.AutoEnterVR)&&ms.isSessionSupported("immersive-vr").then(e=>{if(!e){T.Info("AutoEnterVR is on but immersive-vr is not supported on this device.");return}this._webXrController.xrClicked()}).catch(e=>{let t=e instanceof Error?e.message:JSON.stringify(e);T.Warning(`AutoEnterVR check failed: ${t}`)})}_onLatencyTestResult(e){this._eventEmitter.dispatchEvent(new Oo({latencyTimings:e}))}_onDataChannelLatencyTestResponse(e){this._eventEmitter.dispatchEvent(new Vo({response:e}))}_onVideoStats(e){(!this._videoStartTime||this._videoStartTime===void 0)&&(this._videoStartTime=Date.now()),e.handleSessionStatistics(this._videoStartTime,this._inputController,this._webRtcController.videoAvgQp),this._eventEmitter.dispatchEvent(new Fo({aggregatedStats:e}))}_onVideoEncoderAvgQP(e){this._eventEmitter.dispatchEvent(new fo({avgQP:e}))}_onInitialSettings(e){var t;this._eventEmitter.dispatchEvent(new Wo({settings:e})),e.PixelStreamingSettings&&(this.allowConsoleCommands=(t=e.PixelStreamingSettings.AllowPixelStreamingCommands)!==null&&t!==void 0?t:!1,this.allowConsoleCommands===!1&&T.Info("-AllowPixelStreamingCommands=false, sending arbitrary console commands from browser to UE is disabled."));let n=this.config.useUrlParams,i=new gi(window.location.search);T.Info(`using URL parameters ${n}`),e.EncoderSettings&&(e.EncoderSettings.MinQP&&(this.config.setNumericSetting(I.MinQP,n&&i.has(I.MinQP)?Number.parseFloat(i.get(I.MinQP)):e.EncoderSettings.MinQP||0),this.config.setNumericSetting(I.MaxQP,n&&i.has(I.MaxQP)?Number.parseFloat(i.get(I.MaxQP)):e.EncoderSettings.MaxQP||51)),e.EncoderSettings.MinQuality&&(this.config.setNumericSetting(I.MinQuality,n&&i.has(I.MinQuality)?Number.parseFloat(i.get(I.MinQuality)):e.EncoderSettings.MinQuality||0),this.config.setNumericSetting(I.MaxQuality,n&&i.has(I.MaxQuality)?Number.parseFloat(i.get(I.MaxQuality)):e.EncoderSettings.MaxQuality||100)),n&&(i.has(I.CompatQualityMin)&&this.config.setNumericSetting(I.CompatQualityMin,Number.parseFloat(i.get(I.CompatQualityMin))),i.has(I.CompatQualityMax)&&this.config.setNumericSetting(I.CompatQualityMax,Number.parseFloat(i.get(I.CompatQualityMax))))),e.WebRTCSettings&&(this.config.setNumericSetting(I.WebRTCMinBitrate,n&&i.has(I.WebRTCMinBitrate)?Number.parseFloat(i.get(I.WebRTCMinBitrate)):e.WebRTCSettings.MinBitrate/1e3),this.config.setNumericSetting(I.WebRTCMaxBitrate,n&&i.has(I.WebRTCMaxBitrate)?Number.parseFloat(i.get(I.WebRTCMaxBitrate)):e.WebRTCSettings.MaxBitrate/1e3),this.config.setNumericSetting(I.WebRTCFPS,n&&i.has(I.WebRTCFPS)?Number.parseFloat(i.get(I.WebRTCFPS)):e.WebRTCSettings.FPS))}_onQualityControlOwnership(e){this.config.setFlagEnabled(C.IsQualityController,e)}_onPlayerCount(e){this._eventEmitter.dispatchEvent(new Xo({count:e}))}_onSubscribeFailed(e){this._eventEmitter.dispatchEvent(new Ho({message:e}))}_setupWebRtcTCPRelayDetection(e){let t=e.data.aggregatedStats.getActiveCandidatePair();if(t!=null){let n=e.data.aggregatedStats.localCandidates.find(i=>i.id==t.localCandidateId,null);n!=null&&n.candidateType=="relay"&&n.relayProtocol=="tcp"&&this._eventEmitter.dispatchEvent(new qo),this._eventEmitter.removeEventListener("statsReceived",this._setupWebRtcTCPRelayDetection)}}requestLatencyTest(){return this._webRtcController.videoPlayer.isVideoReady()?(this._webRtcController.sendLatencyTest(),!0):!1}requestDataChannelLatencyTest(e){return this._webRtcController.isDataChannelOpen()?(this._dataChannelLatencyTestController||(this._dataChannelLatencyTestController=new wa(this._webRtcController.sendDataChannelLatencyTest.bind(this._webRtcController),t=>{this._eventEmitter.dispatchEvent(new zo({result:t}))}),this.addEventListener("dataChannelLatencyTestResponse",({data:{response:t}})=>{this._dataChannelLatencyTestController.receive(t)})),this._dataChannelLatencyTestController.start(e)):!1}requestShowFps(){return this._webRtcController.isDataChannelOpen()?(this._webRtcController.sendShowFps(),!0):!1}requestIframe(){return this._webRtcController.videoPlayer.isVideoReady()?(this._webRtcController.sendIframeRequest(),!0):!1}emitUIInteraction(e){return this._webRtcController.isDataChannelOpen()?(this._webRtcController.emitUIInteraction(e),!0):!1}emitCommand(e){return!this._webRtcController.isDataChannelOpen()||!this.allowConsoleCommands&&"ConsoleCommand"in e?!1:(this._webRtcController.emitCommand(e),!0)}emitConsoleCommand(e){return!this.allowConsoleCommands||!this._webRtcController.isDataChannelOpen()?!1:(this._webRtcController.emitConsoleCommand(e),!0)}sendTextboxEntry(e){return this._webRtcController.isDataChannelOpen()?(this._webRtcController.sendTextboxEntry(e),!0):!1}addResponseEventListener(e,t){this._webRtcController.responseController.addResponseEventListener(e,t)}removeResponseEventListener(e){this._webRtcController.responseController.removeResponseEventListener(e)}dispatchEvent(e){return this._eventEmitter.dispatchEvent(e)}addEventListener(e,t){this._eventEmitter.addEventListener(e,t)}removeEventListener(e,t){this._eventEmitter.removeEventListener(e,t)}toggleXR(){this.webXrController.xrClicked()}setSignallingUrlBuilder(e){this._webRtcController.signallingUrlBuilder=e}get webRtcController(){return this._webRtcController}get signallingProtocol(){return this._webRtcController.protocol}get webXrController(){return this._webXrController}registerMessageHandler(e,t,n){if(t===B.FromStreamer&&typeof n>"u"){T.Warning(`Unable to register an undefined handler for ${e}`);return}t===B.ToStreamer&&typeof n>"u"?this._webRtcController.streamMessageController.registerMessageHandler(t,e,i=>this._webRtcController.sendMessageController.sendMessageToStreamer(e,i)):this._webRtcController.streamMessageController.registerMessageHandler(t,e,i=>n(i))}get toStreamerHandlers(){return this._webRtcController.streamMessageController.toStreamerHandlers}isReconnecting(){return this._webRtcController.isReconnecting}};var de=(()=>{try{return window.top}catch{return window}})();function Py(){if(de.__portfolioNativeHubV167)return de.__portfolioNativeHubV167;let r=de.document,e=de.PORTFOLIO_STREAM_URL||(/^(127\.0\.0\.1|localhost)$/.test(de.location.hostname)?"http://127.0.0.1:8089":new URL("/ue",de.location.href).href.replace(/\/$/,"")),t=r.createElement("div");t.className="ue-native-transport-v167",Object.assign(t.style,{position:"absolute",inset:"0",pointerEvents:"none",overflow:"hidden"});let n=new $o({useUrlParams:!1,initialSettings:{ss:e.replace(/^http/,"ws"),AutoConnect:!1,AutoPlayVideo:!0,StartVideoMuted:!0,WaitForStreamer:!0,PreferredCodec:new URLSearchParams(de.location.search).get("nativeCodec")||"VP9",MouseInput:!1,KeyboardInput:!1,TouchInput:!1,GamepadInput:!1,MatchViewportRes:!1,WebRTCFPS:45,WebRTCMinBitrate:12e3,WebRTCMaxBitrate:4e4}}),i=new gs(n,{videoElementParent:t}),s={apiVersion:171,transport:t,player:i,endpoint:e,surfaces:new Set,owner:null,connected:!1,connecting:!1,retryAt:0,sending:!1,healthPending:!1,seq:0,id:crypto.randomUUID(),last:"",sentAt:0,frames:0,lastFrameAt:0,lastHealth:0,native:null,claim:!0,connectingAt:0,connections:0};de.__portfolioNativeHubV167=s;let o=null,a=0;function l(m=!1){for(let[E,P]of[["position","absolute"],["inset","0"],["width","100%"],["height","100%"]])t.style.setProperty(E,P,"important");let b=t.querySelector("video");if(!b||b===o&&!m)return;o&&a&&o.cancelVideoFrameCallback(a),o=b,Object.assign(b.style,{position:"absolute",inset:"0",width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none"}),b.muted=!0;let w=()=>{s.frames++,s.lastFrameAt=performance.now();let E=s.owner;if(E&&(E.status.frames=s.frames,E.status.resolution=[b.videoWidth,b.videoHeight],E.state.nativeFramePresented?.(s.native,s.frames),!E.status.ready&&s.serviceReady&&(E.scene!=="room"||s.calendarReady&&s.frames>=(s.calendarFrame||0)+4&&performance.now()-(s.calendarAt||0)>100)&&E.ackAt&&s.frames>=E.ackFrame+(E.warmed?4:8)&&performance.now()-E.ackAt>(E.warmed?160:650)&&s.native?.scene===E.scene)){E.warmed=!0,E.status.prewarmed=!0,E.status.ready=!0,E.status.engine=s.native.engine,E.status.readyAt=performance.now(),E.cover.hidden=!0,E.cover.style.display="none",E.layer.setAttribute("aria-busy","false");for(let P of E.inputs||[])P.canvas.style.pointerEvents=P.events;E.state.nativeSurfaceChanged?.(!0)}a=b.requestVideoFrameCallback(w)};a=b.requestVideoFrameCallback(w)}let c=m=>{if(m){if(m.status.ready&&performance.now()-m.status.readyAt>1200&&s.native?.scene===m.scene){let b=t.querySelector("video");if(b?.videoWidth){let w=r.createElement("canvas");w.width=1280,w.height=720,w.getContext("2d").drawImage(b,0,0,1280,720),(m.poster||m.cover).style.backgroundImage='url("'+w.toDataURL("image/jpeg",.9)+'")',m.caption.hidden=!0}}m.status.ready=!1,m.ackAt=0,m.cover.hidden=!1,m.cover.style.display="",m.caption.hidden=!1,m.layer.setAttribute("aria-busy","true");for(let b of m.inputs||[])b.canvas.style.pointerEvents="none";m.state.nativeSurfaceChanged?.(!1)}};function h(){let m=[...s.surfaces].filter(A=>A.alive&&A.visible()),w=String(de.homeClockState?.renderer||"").startsWith("Three.js")&&de.homeClockState?.ready&&s.focused&&!de.document.hidden?[...s.surfaces].filter(A=>A.alive&&A.scene!=="home"):[],E=m.at(-1)||w.filter(A=>!A.warmed).at(-1)||w.find(A=>A.scene==="room")||null;if(E===s.owner)return;s.controlAbort?.abort();let P=s.owner;c(P),s.owner=E,s.last="",s.claim=!0,s.native=null,E?(E.layer.prepend(t),l(!0),c(E),E.firstSeq=0,E.status.switchedAt=performance.now(),t.querySelector("video")?.play().catch(()=>{}),s.resize?.()):P&&fetch(e+"/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:s.id,clientSeq:++s.seq,active:!1})}).catch(()=>{})}async function u(m=!1){if(!(s.ensurePending||s.destroyed||!m&&performance.now()-(s.lastEnsure||-1/0)<4e3)){s.ensurePending=!0,s.lastEnsure=performance.now();try{let b=await fetch(new URL("/_runtime/"+(m?"refresh":"ensure"),de.location.origin),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scene:s.owner?.scene||"room"}),signal:AbortSignal.timeout(3500)});if(!b.ok)throw Error("Runtime startup unavailable");s.runtime=await b.json();for(let w of s.surfaces)w.status.starting=!!s.runtime.starting,w.status.serviceReady=!!s.runtime.ready}catch(b){s.lastEnsureError=String(b);for(let w of s.surfaces)w.status.serviceReady=!1,w.status.startupError=String(b),w.status.ready||(w.caption.textContent="\u5B9E\u65F6\u753B\u9762\u5C1A\u672A\u8FDE\u63A5\uFF0C\u8BF7\u91CD\u8BD5")}finally{s.ensurePending=!1}}}s.ensureNative=u;async function d(){if(!(s.healthPending||!s.owner||!s.connected)){s.healthPending=!0;try{let m=await fetch(e+"/health",{signal:AbortSignal.timeout(1400)}).then(E=>E.json());s.lastHealth=performance.now();let b=s.owner;s.serviceReady=!!(m.streamers?.length&&m.native?.phase==="native viewport live"&&Date.now()/1e3-m.native.heartbeat<6);let w=!!m.runtime?.calendarReady;if(w&&!s.calendarReady&&(s.calendarFrame=s.frames,s.calendarAt=performance.now()),s.calendarReady=w,s.native=s.serviceReady?m.native:null,!s.serviceReady){b&&(c(b),b.status.serviceReady=!1),u();return}b&&(b.status.serviceReady=!0,b.status.calendarDate=m.runtime?.calendarDate,b.status.calendarReady=s.calendarReady),b&&m.native?.scene===b.scene&&m.native?.seq>=b.firstSeq&&b.firstSeq&&t.querySelector("video")?.readyState>=2&&(b.status.presentedCamera=m.native.camera,b.status.presentedTarget=m.native.target,b.status.appliedSeq=m.native.seq,b.ackAt||(b.ackAt=performance.now(),b.ackFrame=s.frames)),b&&m.native?.scene&&m.native.scene!==b.scene&&(c(b),s.last="")}catch(m){s.owner&&(s.owner.status.lastTransportError=String(m))}finally{s.healthPending=!1}}}async function f(){if(s.destroyed)return;s.focused=de.document.hasFocus(),h();let m=s.owner;if(!s.serviceReady&&!de.document.hidden&&u(),!m)return;if(!s.connected){performance.now()>s.retryAt&&(s.connecting=!0,s.connectingAt=performance.now(),s.retryAt=performance.now()+12e3,s.connections++,i.connect());return}if(l(),s.sending)return;let b=m.camera(),w=D=>D.map(R=>Math.round(R*1e5)/1e5),E={scene:m.scene,camera:w(b.position),target:w(b.target),fov:b.fov,verticalFov:!0,directCamera:b.directCamera??!1,roomTime:b.roomTime===void 0?void 0:Math.round(b.roomTime*2)/2,roomWork:b.roomWork,roomTV:b.roomTV,roomProps:b.roomProps,night:b.night??!1,paused:b.paused??(!m.visible()&&!!m.warmed&&performance.now()-m.status.readyAt>1200),lamp:b.lamp??!0,homeParts:b.homeParts??[],homeKey:b.homeKey,homeWest:b.homeWest,active:!0,claim:s.claim,clientId:s.id,clientSeq:++s.seq};s.outputPaused=E.paused;let P=JSON.stringify({...E,clientSeq:0,claim:!1});if(P===s.last&&performance.now()-s.sentAt<1e3){performance.now()-s.lastHealth>(b.directCamera||m.status.appliedSeq<m.status.lastSeq?22:m.status.ready?180:80)&&d();return}s.sending=!0;let A=new AbortController;s.controlAbort=A;try{let D=await fetch(e+"/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(E),signal:AbortSignal.any([AbortSignal.timeout(1600),A.signal])}).then(F=>F.json());if(!D.ok)throw Error(D.code||"Camera update failed");if(m!==s.owner)return;if(D.owned===!1){m.status.blocked=!0,c(m),m.caption.textContent="\u70B9\u51FB\u753B\u9762\u7EE7\u7EED";return}m.status.lastTransportError&&(m.status.lastRecoveredAt=performance.now()),m.status.lastTransportError="",m.status.blocked=!1,m.status.connected=!0,m.status.sent++,m.status.lastSeq=D.seq,m.firstSeq||(m.firstSeq=D.seq),s.claim=!1,s.last=P,s.sentAt=performance.now(),performance.now()-s.lastHealth>(b.directCamera?22:50)&&d();let R=t.querySelector("video");R&&(!E.paused||!m.status.ready)&&R.paused&&R.play().catch(()=>{})}catch(D){if(m!==s.owner||A.signal.aborted)return;m.status.lastTransportError=String(D),m.status.lastTransportFailureAt=performance.now(),m.status.transientRetries++,!m.status.ready&&performance.now()-m.status.switchedAt>6e3&&(m.caption.textContent="\u6B63\u5728\u8FDE\u63A5\u5B9E\u65F6\u573A\u666F \xB7 \u70B9\u51FB\u91CD\u8BD5")}finally{s.controlAbort===A&&(s.controlAbort=null),s.sending=!1}}s.update=f,s.health=d,s.hide=c;let p=()=>{try{let m=i._webRtcController?.peerConnectionController?.peerConnection,b=0;for(let w of m?.getReceivers()??[]){if(w.track?.kind!=="video")continue;let E=w,P=/^(127\.0\.0\.1|localhost)$/.test(new URL(e).hostname);"jitterBufferTarget"in E&&(E.jitterBufferTarget=P?0:30,b++),"playoutDelayHint"in E&&(E.playoutDelayHint=P?0:.03,b++)}s.receiverPolicy={propertiesSet:b,localTargetMs:0}}catch(m){s.receiverPolicyError=String(m)}};i.addEventListener("videoInitialized",()=>{p(),l(),i.play()});let g=()=>{if(s.destroyed||!s.owner||!s.channelOpen)return;let m=Math.max(1280,Math.min(1920,Math.ceil(s.owner.host.clientWidth*de.devicePixelRatio/32)*32)),b=m*9/16,w=t.querySelector("video");s.owner.status.displayResolution=[m,b],!(w?.videoWidth===m&&w?.videoHeight===b)&&i.emitCommand({"Resolution.Width":m,"Resolution.Height":b})};s.resize=g,i.addEventListener("dataChannelOpen",()=>{s.channelOpen=!0,g(),setTimeout(g,500)});let y=()=>{s.destroyed||(s.connected=!0,s.connecting=!1,s.connectedAt=performance.now(),s.retryAt=0,p(),l(),f())};i.addEventListener("playStream",y),i.addEventListener("webRtcConnected",y),i.addEventListener("webRtcDisconnected",()=>{s.connected=s.connecting=s.channelOpen=s.serviceReady=!1,s.retryAt=performance.now()+1200,s.claim=!0,c(s.owner),s.last=""}),s.focused=de.document.hasFocus(),de.addEventListener("focus",()=>{s.focused=de.document.hasFocus(),s.claim=!0,f()}),de.addEventListener("blur",()=>{s.focused=de.document.hasFocus(),f()}),de.addEventListener("pointerdown",()=>{s.owner?.status.blocked&&(s.claim=!0,s.last=""),f()},!0);let v=()=>{s.destroyed||(u(!0),c(s.owner),s.connected=s.connecting=s.serviceReady=!1,s.retryAt=performance.now()+400,s.claim=!0,s.last="",i.disconnect())};s.recover=v;let _=performance.now(),S=()=>{let m=performance.now(),b=m-_>2e3;if(_=m,!s.owner||s.destroyed)return;let w=s.owner.camera();if(b){s.lastFrameAt=m;return}(!s.owner.status.ready||m-s.lastFrameAt>1600)&&d(),s.connected&&s.owner.visible()&&!s.outputPaused&&!w.paused&&m-Math.max(s.lastFrameAt,s.connectedAt||m)>6e3&&(s.owner.status.stallRecoveries=(s.owner.status.stallRecoveries||0)+1,v())},x=()=>{clearInterval(s.timer),clearInterval(s.healthTimer),s.timer=setInterval(f,22),s.healthTimer=setInterval(S,200)};return x(),de.addEventListener("pagehide",()=>{s.destroyed=!0,clearInterval(s.timer),clearInterval(s.healthTimer),s.controlAbort?.abort(),c(s.owner),s.owner=null,s.connected=s.serviceReady=!1,o&&a&&o.cancelVideoFrameCallback(a),a=0,navigator.sendBeacon(e+"/control",new Blob([JSON.stringify({clientId:s.id,clientSeq:++s.seq,active:!1})],{type:"text/plain"})),i.disconnect()}),de.addEventListener("pageshow",m=>{!m.persisted&&!s.destroyed||(s.destroyed=!1,s.connected=s.connecting=s.serviceReady=!1,s.claim=!0,s.last="",s.retryAt=0,s.lastFrameAt=performance.now(),l(!0),x(),u(),f())}),s}async function Eh(r,e,t,n){let i=Py(),s=document.createElement("div");s.className="ue-native-surface-v162",Object.assign(s.style,{position:"absolute",inset:"0",pointerEvents:"none",zIndex:"0",background:"#171a18",overflow:"hidden"}),r.prepend(s);let o=document.createElement("div");o.className="ue-native-cover-v171",Object.assign(o.style,{position:"absolute",inset:"0",zIndex:"25",pointerEvents:"auto",overflow:"hidden",background:"#171a18"}),s.append(o),s.setAttribute("aria-busy","true");let a=document.createElement("div");a.setAttribute("aria-hidden","true"),Object.assign(a.style,{position:"absolute",inset:"-12px",filter:"blur(9px) brightness(.5)",background:`#171a18 url("./assets/native-v171/${e}.jpg?v=32.171") center / cover no-repeat`}),o.append(a);let l=document.createElement("div");Object.assign(l.style,{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",display:"grid",gap:"18px",justifyItems:"center",textAlign:"center",color:"#eee7da",font:"14px/1.8 sans-serif"}),o.append(l);let c=document.createElement("span");c.className="ue-native-caption-v171",c.setAttribute("role","status"),c.textContent=e==="myth"?"\u6B63\u5728\u8FDE\u63A5\u6D77\u6E7E\u2026":e==="room"?"\u6B63\u5728\u8FDE\u63A5\u5DE5\u4F5C\u53F0\u2026":"\u6B63\u5728\u8FDE\u63A5\u5EAD\u9662\u2026",l.append(c);let h=document.createElement("button");h.type="button",h.textContent="\u91CD\u65B0\u8FDE\u63A5",Object.assign(h.style,{padding:"9px 18px",background:"#d3c5a8",color:"#202821",border:"0",borderRadius:"5px",cursor:"pointer",font:"13px/1.5 sans-serif",pointerEvents:"auto"}),h.addEventListener("click",()=>i.recover()),l.append(h);let u=Array.from(r.querySelectorAll("canvas,.directory-scene-input")).map(b=>({canvas:b,events:b.style.pointerEvents}));for(let b of u)b.canvas.style.pointerEvents="none";let d=n.nativeUE={version:171,ready:!1,scene:e,wholeViewport:!0,blocked:!1,transientRetries:0,lastTransportError:"",sent:0,errors:[],lastSeq:0,connected:!1,frames:0,resolution:[0,0],sharedTransport:!0,switchedAt:performance.now()},f=!0,p=!1,g=()=>{if(!f||!p||document.hidden||document.body.classList.contains("works-orbit-open")||document.body.classList.contains("standalone-archive-open")||document.body.classList.contains("directory-music-open")||document.body.classList.contains("directory-source-open")||document.body.classList.contains("portfolio-surface-suspended"))return!1;try{if(!i.focused)return!1;let b=window;for(;b!==de;){let w=b.frameElement;if(!w||w.getClientRects().length===0)return!1;let E=w.getBoundingClientRect();if(E.bottom<=0||E.top>=b.parent.innerHeight||getComputedStyle(w).visibility==="hidden")return!1;b=b.parent}}catch{return!1}return t().enabled!==!1},y={host:r,layer:s,cover:o,poster:a,caption:c,inputs:u,scene:e,camera:t,state:n,status:d,alive:!0,visible:g,firstSeq:0,ackAt:0,ackFrame:0};i.surfaces.add(y);let v=new ResizeObserver(()=>{i.owner===y&&i.resize?.()});v.observe(r);let _=()=>{g()&&d.blocked&&(i.claim=!0,i.last="",i.update())};r.addEventListener("pointerdown",_,!0);let S=new IntersectionObserver(([b])=>{p=b.isIntersecting&&b.intersectionRatio>.45,i.update()},{threshold:[0,.45,.5,1]});S.observe(r);let x=new MutationObserver(()=>void i.update());x.observe(document.body,{attributes:!0,attributeFilter:["class"]});let m=()=>void i.update();return document.addEventListener("visibilitychange",m),n.nativeSurfaceChanged?.(!1),i.update(),{layer:s,update:i.update,async waitForView(){let b=t(),w=performance.now()+8e3;i.last="",await i.update();let E;for(;performance.now()<w;){await i.health();let D=i.native;if(D?.scene===e&&D.camera?.every((R,F)=>Math.abs(R-b.position[F])<.01)&&D.target?.every((R,F)=>Math.abs(R-b.target[F])<.01)){E=D;break}await new Promise(R=>setTimeout(R,40))}if(!E)throw Error("Native camera pose acknowledgement timed out");let P=i.frames,A=s.querySelector("video");for(A?.paused&&await A.play();performance.now()<w&&i.frames<P+2;)await new Promise(D=>setTimeout(D,20));return{scene:e,poseAcknowledged:!0,seq:E.seq,streamFramesAfterPose:i.frames-P,at:performance.now()}},suspend(){y.alive=!1,i.hide(y),i.update()},destroy(){f=!1,y.alive=!1,i.surfaces.delete(y),S.disconnect(),v.disconnect(),x.disconnect(),r.removeEventListener("pointerdown",_,!0),document.removeEventListener("visibilitychange",m),i.owner===y&&(i.owner=null,i.last=""),s.remove(),i.update()}}}function Ud(r,e,t,n,i){let s=document.querySelector("[data-cottage-process]"),o=new M(n[0],n[1]+1.45,n[2]+1.99),a=new M,l=new un,c=new M,h=new M,u=0,d=!1,f=performance.now()+1200,p=[];r.traverse(v=>{v instanceof Ne&&!(v instanceof ki)&&!(v.material instanceof Wn)&&v.visible&&p.push(v)}),s.onclick=()=>{performance.now()<f||!d||(sessionStorage.setItem("odyssey-process-return",JSON.stringify({href:location.href,position:e.position.toArray(),target:i.cameraTarget||[-6,9,-16],night:i.nightMix>.5})),window.portfolioNavigate?.("./mythology-process.html?v=32.167"))};let g=(()=>{try{return JSON.parse(sessionStorage.getItem("odyssey-process-return")||"null")}catch{return null}})();if(g&&(g.returning||document.referrer.includes("mythology-process.html"))){let v=()=>{if(!i.ready){requestAnimationFrame(v);return}i.inspectCamera?.(g.position,g.target),i.setNight?.(g.night),f=performance.now()+1600,sessionStorage.removeItem("odyssey-process-return")};requestAnimationFrame(v)}window.addEventListener("portfolio:child-return",()=>{f=performance.now()+1800,d=!1,s.hidden=!0,sessionStorage.removeItem("odyssey-process-return")});function y(){if(!i.cameraSettled){s.hidden=!0,d=!1,i.cottageEntry={visible:!1};return}let v=t.clientWidth,_=t.clientHeight;if(a.copy(o).project(e),performance.now()-u>180){u=performance.now(),e.getWorldPosition(h),c.copy(o).sub(h);let S=c.length();d=!1,S<29&&a.z<1&&a.z>-1&&Math.abs(a.x)<.96&&Math.abs(a.y)<.94&&(l.set(h,c.normalize()),l.far=S-.13,d=!l.intersectObjects(p,!1).filter(m=>{let b=m.object;return b.visible&&b.isMesh&&!(b.material instanceof Wn)&&m.distance<S-.13}).length)}s.hidden=!d,d&&(s.style.left=(a.x*.5+.5)*v+"px",s.style.top=(-a.y*.5+.5)*_+"px"),i.cottageEntry={visible:d,world:o.toArray(),screen:[(a.x*.5+.5)*v,(-a.y*.5+.5)*_]}}return{update:y}}var xi=document.getElementById("odysseyScene"),dt=xi.querySelector("canvas"),z=window.odysseyState={version:165,ready:!1,frames:0,paused:!1,renderer:"Unreal Engine 5.8.4 / native scene / lightweight navigation",islandAndVesselUnchanged:!0,parallelRenderedScene:!1},et=new Ui(34,16/9,.15,5e3),Ce=ld(et,dt),Ea=new M(37,17,49),Ca=new M(-6,9,-16);et.position.copy(Ea);Ce.target.copy(Ca);Ce.update();dt.style.opacity="0";dt.style.position="absolute";dt.style.inset="0";dt.style.zIndex="2";var yi,$t,Vd,bn=0,zd=Ea.clone(),Hd=Ca.clone(),Wd=Ea.clone(),Gd=Ca.clone(),Ah=0,Ch=0,Od=new Oi,Mn=new un,Ly=new M(0,-1,0),ut=new M,Ta=new M,vi=new M(4,17.6987841,-46),Bd=new Q(vi.clone().add(new M(-3,-.3,-2.6)),vi.clone().add(new M(3,5.2,2.6)));Mn.firstHitOnly=!0;z.cottage={position:vi.toArray(),unchanged:!0};z.controls=Ce.debug;var Rh=()=>document.hidden||document.body.classList.contains("portfolio-surface-suspended");function Xd(){let r=Math.max(1,xi.clientWidth),e=Math.max(1,xi.clientHeight);dt.width=r,dt.height=e,et.aspect=r/e,et.fov=2*Math.atan(Math.tan(34*Math.PI/360)*Math.min(1,16/9/et.aspect))*180/Math.PI,et.updateProjectionMatrix()}new ResizeObserver(Xd).observe(xi);Xd();var kd=[{p:Ea,t:Ca},{p:new M(29,11,40),t:new M(1,3,8)},{p:new M(21,22,13),t:new M(-12,14,-34)},{p:vi.clone().add(new M(5.5,2.8,7.5)),t:vi.clone().add(new M(0,1.9,0))}];function Aa(r){Ce.debug.minDistance=r===3?5:55,Ce.debug.maxDistance=r===3?24:88;let e=kd[r]||kd[0];zd.copy(et.position),Hd.copy(Ce.target),Wd.copy(e.p),Gd.copy(e.t),bn=performance.now(),z.viewIndex=r,z.cameraSettled=!1,Ce.resetInteraction(),ot()}function Dy(r,e){return $t?(Mn.set(new M(r,150,e),Ly),Mn.far=300,Mn.intersectObject($t,!1)[0]?.point.y??-100):-100}Ce.setCollider((r,e)=>{ut.copy(e),ut.y=Math.max(ut.y,.45,Dy(ut.x,ut.z)+.85),Ta.copy(ut).sub(r);let t=Ta.length();if($t&&t>1e-4){Mn.set(r,Ta.normalize()),Mn.far=t+.45;let n=Mn.intersectObject($t,!1)[0];n&&n.distance<t+.4&&ut.copy(r).addScaledVector(Ta,Math.max(0,n.distance-.5))}return Bd.containsPoint(ut)&&!Bd.containsPoint(r)&&ut.copy(r),ut});function Fy(r){if(Ah=0,Rh()){Ch=r;return}let e=Math.min(.05,Math.max(0,(r-(Ch||r))/1e3));if(Ch=r,bn){let t=Math.min(1,(r-bn)/720),n=t*t*(3-2*t);et.position.lerpVectors(zd,Wd,n),Ce.target.lerpVectors(Hd,Gd,n),t>=1&&(bn=0,z.cameraSettled=!0)}Ce.update(),z.camera=et.position.toArray(),z.cameraTarget=Ce.lookTarget.toArray(),z.frames++,Vd?.update(),(!z.paused||bn||Ce.dragging)&&ot()}function ot(){!Ah&&!Rh()&&(Ah=requestAnimationFrame(Fy))}Ce.addEventListener("change",()=>{bn=0,z.cameraSettled=!0,ot()});z.nativeSurfaceChanged=r=>{z.firstNativeFrameAt??=r?performance.now():void 0;let e=document.querySelector(".odyssey-preparing");r?e?.remove():e&&document.querySelector(".ue-native-cover-v164")&&(e.hidden=!0)};z.inspectCamera=(r,e)=>{bn=0,et.position.fromArray(r),Ce.target.fromArray(e),Ce.update(),z.cameraSettled=!0,ot()};z.view=Aa;z.setNight=r=>{z.nightMix=r?1:0;let e=document.querySelector("[data-odyssey-night]");e.textContent=r?"\u5207\u6362\u767D\u5929":"\u5207\u6362\u591C\u665A",e.setAttribute("aria-pressed",String(r)),z.nativeController?.update(),ot()};z.capture=()=>{let r=z.nativeController?.layer.querySelector("video");if(!r?.videoWidth)return"";let e=document.createElement("canvas");return e.width=r.videoWidth,e.height=r.videoHeight,e.getContext("2d").drawImage(r,0,0),e.toDataURL("image/jpeg",.95)};document.querySelector("[data-odyssey-reset]").onclick=()=>Aa(0);document.querySelector("[data-odyssey-house]").onclick=()=>Aa(3);document.querySelector("[data-odyssey-night]").onclick=()=>z.setNight(!z.nightMix);document.querySelector("[data-odyssey-pause]").onclick=r=>{z.paused=!z.paused;let e=r.currentTarget;e.setAttribute("aria-pressed",String(z.paused)),e.setAttribute("aria-label",z.paused?"\u7EE7\u7EED\u573A\u666F":"\u6682\u505C\u573A\u666F"),e.querySelector("path")?.setAttribute("d",z.paused?"M8 5l11 7-11 7z":"M9 5v14M15 5v14"),z.nativeController?.update(),ot()};dt.addEventListener("dblclick",()=>Aa(0));document.addEventListener("visibilitychange",ot);new MutationObserver(ot).observe(document.body,{attributes:!0,attributeFilter:["class"]});addEventListener("portfolio:child-return",()=>{Ce.resetInteraction(),ot()});async function Ny(){let r=performance.now();z.preparation={began:r,navigationReady:!1};let e=fetch("./assets/odyssey/native-v165/collision.bin.gz").then(async i=>{if(!i.ok)throw Error("Coastal navigation data unavailable");return new Response(i.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer()}),t=await Eh(xi,"myth",()=>({position:et.position.toArray(),target:Ce.lookTarget.toArray(),fov:34,night:!!z.nightMix,paused:z.paused,enabled:!Rh()}),z);z.nativeController=t,z.navigation={mode:"bounded dolly / horizontal look +/-15 degrees",fixedDirection:!1,source:"original island / no scene rebuild",pending:!0};for(let i of document.querySelectorAll(".odyssey-hint,.local-cove-help"))i.textContent="\u6EDA\u8F6E\u524D\u540E \xB7 \u4E0A\u4E0B\u62D6\u52A8\u9760\u8FD1\u6216\u9000\u8FDC \xB7 \u5DE6\u53F3\u8F7B\u62D6\u73AF\u987E \xB7 \u53CC\u51FB\u590D\u4F4D";dt.setAttribute("aria-label","\u5B9E\u65F6\u6D77\u6E7E\uFF1A\u6EDA\u8F6E\u6216\u4E0A\u4E0B\u62D6\u52A8\u524D\u540E\u89C2\u770B\uFF0C\u5DE6\u53F3\u8F7B\u62D6\u540415\u5EA6\u73AF\u987E\uFF0C\u53CC\u51FB\u590D\u4F4D"),z.ready=!0,z.readyAt=performance.now(),z.cameraSettled=!0,z.components={sea:!0,ship:!0,crew:!0,island:!0,trees:!0,shrubs:!0,shoreline:!0},z.ships=1,z.giant=!1,document.querySelector("[data-odyssey-night]").disabled=!1;let n=xi.querySelector(".local-cove-renderer");n&&(n.textContent="\u672C\u673A\u5B9E\u65F6\u6D77\u6E7E"),dispatchEvent(new Event("portfolio:progress")),ot(),e.then(async i=>{await new Promise(l=>requestAnimationFrame(()=>setTimeout(l,0)));let s=new Uint32Array(i,0,2),o=new Float32Array(i,8,s[0]*3),a=new Uint32Array(i,8+s[0]*12,s[1]);yi=new ct,yi.setAttribute("position",new _e(o,3)),yi.setIndex(new _e(a,1)),yi.boundsTree=new Ur(yi,{indirect:!0}),$t=new Ne(yi,new zn({side:Wi})),$t.raycast=ad,$t.updateMatrixWorld(!0),Od.add($t),z.navigation.pending=!1,z.navigation.triangles=a.length/3,z.preparation.navigationReady=!0,z.preparation.navigationReadyAt=performance.now(),Vd=Ud(Od,et,dt,vi.toArray(),z),ot()}).catch(i=>{z.navigation.error=String(i),console.error(i)})}Ny().catch(r=>{z.error=String(r),console.error(r);let e=document.querySelector(".odyssey-preparing p");e&&(e.textContent="\u6D77\u6E7E\u8FDE\u63A5\u672A\u5B8C\u6210\uFF0C\u8BF7\u91CD\u65B0\u8FDE\u63A5")});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
//# sourceMappingURL=mythology-native-v165.js.map
