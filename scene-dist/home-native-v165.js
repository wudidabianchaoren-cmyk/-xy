var Sp=Object.create;var nc=Object.defineProperty;var bp=Object.getOwnPropertyDescriptor;var Mp=Object.getOwnPropertyNames;var wp=Object.getPrototypeOf,Ep=Object.prototype.hasOwnProperty;var Tp=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports),$u=(i,e)=>{for(var t in e)nc(i,t,{get:e[t],enumerable:!0})},Cp=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Mp(e))!Ep.call(i,r)&&r!==t&&nc(i,r,{get:()=>e[r],enumerable:!(n=bp(e,r))||n.enumerable});return i};var Ap=(i,e,t)=>(t=i!=null?Sp(wp(i)):{},Cp(e||!i||!i.__esModule?nc(t,"default",{value:i,enumerable:!0}):t,i));var cp=Tp((LE,Ru)=>{"use strict";var se={};se.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};se.localCName=se.generateIdentifier();se.splitLines=function(i){return i.trim().split(`
`).map(e=>e.trim())};se.splitSections=function(i){return i.split(`
m=`).map((t,n)=>(n>0?"m="+t:t).trim()+`\r
`)};se.getDescription=function(i){let e=se.splitSections(i);return e&&e[0]};se.getMediaSections=function(i){let e=se.splitSections(i);return e.shift(),e};se.matchPrefix=function(i,e){return se.splitLines(i).filter(t=>t.indexOf(e)===0)};se.parseCandidate=function(i){let e;i.indexOf("a=candidate:")===0?e=i.substring(12).split(" "):e=i.substring(10).split(" ");let t={foundation:e[0],component:{1:"rtp",2:"rtcp"}[e[1]]||e[1],protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]};for(let n=8;n<e.length;n+=2)switch(e[n]){case"raddr":t.relatedAddress=e[n+1];break;case"rport":t.relatedPort=parseInt(e[n+1],10);break;case"tcptype":t.tcpType=e[n+1];break;case"ufrag":t.ufrag=e[n+1],t.usernameFragment=e[n+1];break;default:t[e[n]]===void 0&&(t[e[n]]=e[n+1]);break}return t};se.writeCandidate=function(i){let e=[];e.push(i.foundation);let t=i.component;t==="rtp"?e.push(1):t==="rtcp"?e.push(2):e.push(t),e.push(i.protocol.toUpperCase()),e.push(i.priority),e.push(i.address||i.ip),e.push(i.port);let n=i.type;return e.push("typ"),e.push(n),n!=="host"&&i.relatedAddress&&i.relatedPort!==void 0&&(e.push("raddr"),e.push(i.relatedAddress),e.push("rport"),e.push(i.relatedPort)),i.tcpType&&i.protocol.toLowerCase()==="tcp"&&(e.push("tcptype"),e.push(i.tcpType)),(i.usernameFragment||i.ufrag)&&(e.push("ufrag"),e.push(i.usernameFragment||i.ufrag)),"candidate:"+e.join(" ")};se.parseIceOptions=function(i){return i.substring(14).split(" ")};se.parseRtpMap=function(i){let e=i.substring(9).split(" "),t={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),t.name=e[0],t.clockRate=parseInt(e[1],10),t.channels=e.length===3?parseInt(e[2],10):1,t.numChannels=t.channels,t};se.writeRtpMap=function(i){let e=i.payloadType;i.preferredPayloadType!==void 0&&(e=i.preferredPayloadType);let t=i.channels||i.numChannels||1;return"a=rtpmap:"+e+" "+i.name+"/"+i.clockRate+(t!==1?"/"+t:"")+`\r
`};se.parseExtmap=function(i){let e=i.substring(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1],attributes:e.slice(2).join(" ")}};se.writeExtmap=function(i){return"a=extmap:"+(i.id||i.preferredId)+(i.direction&&i.direction!=="sendrecv"?"/"+i.direction:"")+" "+i.uri+(i.attributes?" "+i.attributes:"")+`\r
`};se.parseFmtp=function(i){let e={},t,n=i.substring(i.indexOf(" ")+1).split(";");for(let r=0;r<n.length;r++)t=n[r].trim().split("="),e[t[0].trim()]=t[1];return e};se.writeFmtp=function(i){let e="",t=i.payloadType;if(i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.parameters&&Object.keys(i.parameters).length){let n=[];Object.keys(i.parameters).forEach(r=>{i.parameters[r]!==void 0?n.push(r+"="+i.parameters[r]):n.push(r)}),e+="a=fmtp:"+t+" "+n.join(";")+`\r
`}return e};se.parseRtcpFb=function(i){let e=i.substring(i.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")}};se.writeRtcpFb=function(i){let e="",t=i.payloadType;return i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.rtcpFeedback&&i.rtcpFeedback.length&&i.rtcpFeedback.forEach(n=>{e+="a=rtcp-fb:"+t+" "+n.type+(n.parameter&&n.parameter.length?" "+n.parameter:"")+`\r
`}),e};se.parseSsrcMedia=function(i){let e=i.indexOf(" "),t={ssrc:parseInt(i.substring(7,e),10)},n=i.indexOf(":",e);return n>-1?(t.attribute=i.substring(e+1,n),t.value=i.substring(n+1)):t.attribute=i.substring(e+1),t};se.parseSsrcGroup=function(i){let e=i.substring(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(t=>parseInt(t,10))}};se.getMid=function(i){let e=se.matchPrefix(i,"a=mid:")[0];if(e)return e.substring(6)};se.parseFingerprint=function(i){let e=i.substring(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1].toUpperCase()}};se.getDtlsParameters=function(i,e){return{role:"auto",fingerprints:se.matchPrefix(i+e,"a=fingerprint:").map(se.parseFingerprint)}};se.writeDtlsParameters=function(i,e){let t="a=setup:"+e+`\r
`;return i.fingerprints.forEach(n=>{t+="a=fingerprint:"+n.algorithm+" "+n.value+`\r
`}),t};se.parseCryptoLine=function(i){let e=i.substring(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)}};se.writeCryptoLine=function(i){return"a=crypto:"+i.tag+" "+i.cryptoSuite+" "+(typeof i.keyParams=="object"?se.writeCryptoKeyParams(i.keyParams):i.keyParams)+(i.sessionParams?" "+i.sessionParams.join(" "):"")+`\r
`};se.parseCryptoKeyParams=function(i){if(i.indexOf("inline:")!==0)return null;let e=i.substring(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0}};se.writeCryptoKeyParams=function(i){return i.keyMethod+":"+i.keySalt+(i.lifeTime?"|"+i.lifeTime:"")+(i.mkiValue&&i.mkiLength?"|"+i.mkiValue+":"+i.mkiLength:"")};se.getCryptoParameters=function(i,e){return se.matchPrefix(i+e,"a=crypto:").map(se.parseCryptoLine)};se.getIceParameters=function(i,e){let t=se.matchPrefix(i+e,"a=ice-ufrag:")[0],n=se.matchPrefix(i+e,"a=ice-pwd:")[0];return t&&n?{usernameFragment:t.substring(12),password:n.substring(10)}:null};se.writeIceParameters=function(i){let e="a=ice-ufrag:"+i.usernameFragment+`\r
a=ice-pwd:`+i.password+`\r
`;return i.iceLite&&(e+=`a=ice-lite\r
`),e};se.parseRtpParameters=function(i){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=se.splitLines(i)[0].split(" ");e.profile=n[2];for(let s=3;s<n.length;s++){let o=n[s],a=se.matchPrefix(i,"a=rtpmap:"+o+" ")[0];if(a){let l=se.parseRtpMap(a),c=se.matchPrefix(i,"a=fmtp:"+o+" ");switch(l.parameters=c.length?se.parseFmtp(c[0]):{},l.rtcpFeedback=se.matchPrefix(i,"a=rtcp-fb:"+o+" ").map(se.parseRtcpFb),e.codecs.push(l),l.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(l.name.toUpperCase());break;default:break}}}se.matchPrefix(i,"a=extmap:").forEach(s=>{e.headerExtensions.push(se.parseExtmap(s))});let r=se.matchPrefix(i,"a=rtcp-fb:* ").map(se.parseRtcpFb);return e.codecs.forEach(s=>{r.forEach(o=>{s.rtcpFeedback.find(l=>l.type===o.type&&l.parameter===o.parameter)||s.rtcpFeedback.push(o)})}),e};se.writeRtpDescription=function(i,e){let t="";t+="m="+i+" ",t+=e.codecs.length>0?"9":"0",t+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",t+=e.codecs.map(r=>r.preferredPayloadType!==void 0?r.preferredPayloadType:r.payloadType).join(" ")+`\r
`,t+=`c=IN IP4 0.0.0.0\r
`,t+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(r=>{t+=se.writeRtpMap(r),t+=se.writeFmtp(r),t+=se.writeRtcpFb(r)});let n=0;return e.codecs.forEach(r=>{r.maxptime>n&&(n=r.maxptime)}),n>0&&(t+="a=maxptime:"+n+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(r=>{t+=se.writeExtmap(r)}),t};se.parseRtpEncodingParameters=function(i){let e=[],t=se.parseRtpParameters(i),n=t.fecMechanisms.indexOf("RED")!==-1,r=t.fecMechanisms.indexOf("ULPFEC")!==-1,s=se.matchPrefix(i,"a=ssrc:").map(h=>se.parseSsrcMedia(h)).filter(h=>h.attribute==="cname"),o=s.length>0&&s[0].ssrc,a,l=se.matchPrefix(i,"a=ssrc-group:FID").map(h=>h.substring(17).split(" ").map(d=>parseInt(d,10)));l.length>0&&l[0].length>1&&l[0][0]===o&&(a=l[0][1]),t.codecs.forEach(h=>{if(h.name.toUpperCase()==="RTX"&&h.parameters.apt){let u={ssrc:o,codecPayloadType:parseInt(h.parameters.apt,10)};o&&a&&(u.rtx={ssrc:a}),e.push(u),n&&(u=JSON.parse(JSON.stringify(u)),u.fec={ssrc:o,mechanism:r?"red+ulpfec":"red"},e.push(u))}}),e.length===0&&o&&e.push({ssrc:o});let c=se.matchPrefix(i,"b=");return c.length&&(c[0].indexOf("b=TIAS:")===0?c=parseInt(c[0].substring(7),10):c[0].indexOf("b=AS:")===0?c=parseInt(c[0].substring(5),10)*1e3*.95-2e3*8:c=void 0,e.forEach(h=>{h.maxBitrate=c})),e};se.parseRtcpParameters=function(i){let e={},t=se.matchPrefix(i,"a=ssrc:").map(s=>se.parseSsrcMedia(s)).filter(s=>s.attribute==="cname")[0];t&&(e.cname=t.value,e.ssrc=t.ssrc);let n=se.matchPrefix(i,"a=rtcp-rsize");e.reducedSize=n.length>0,e.compound=n.length===0;let r=se.matchPrefix(i,"a=rtcp-mux");return e.mux=r.length>0,e};se.writeRtcpParameters=function(i){let e="";return i.reducedSize&&(e+=`a=rtcp-rsize\r
`),i.mux&&(e+=`a=rtcp-mux\r
`),i.ssrc!==void 0&&i.cname&&(e+="a=ssrc:"+i.ssrc+" cname:"+i.cname+`\r
`),e};se.parseMsid=function(i){let e,t=se.matchPrefix(i,"a=msid:");if(t.length===1)return e=t[0].substring(7).split(" "),{stream:e[0],track:e[1]};let n=se.matchPrefix(i,"a=ssrc:").map(r=>se.parseSsrcMedia(r)).filter(r=>r.attribute==="msid");if(n.length>0)return e=n[0].value.split(" "),{stream:e[0],track:e[1]}};se.parseSctpDescription=function(i){let e=se.parseMLine(i),t=se.matchPrefix(i,"a=max-message-size:"),n;t.length>0&&(n=parseInt(t[0].substring(19),10)),isNaN(n)&&(n=65536);let r=se.matchPrefix(i,"a=sctp-port:");if(r.length>0)return{port:parseInt(r[0].substring(12),10),protocol:e.fmt,maxMessageSize:n};let s=se.matchPrefix(i,"a=sctpmap:");if(s.length>0){let o=s[0].substring(10).split(" ");return{port:parseInt(o[0],10),protocol:o[1],maxMessageSize:n}}};se.writeSctpDescription=function(i,e){let t=[];return i.protocol!=="DTLS/SCTP"?t=["m="+i.kind+" 9 "+i.protocol+" "+e.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+e.port+`\r
`]:t=["m="+i.kind+" 9 "+i.protocol+" "+e.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+e.port+" "+e.protocol+` 65535\r
`],e.maxMessageSize!==void 0&&t.push("a=max-message-size:"+e.maxMessageSize+`\r
`),t.join("")};se.generateSessionId=function(){return Math.random().toString().substr(2,22)};se.writeSessionBoilerplate=function(i,e,t){let n,r=e!==void 0?e:2;return i?n=i:n=se.generateSessionId(),`v=0\r
o=`+(t||"thisisadapterortc")+" "+n+" "+r+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`};se.getDirection=function(i,e){let t=se.splitLines(i);for(let n=0;n<t.length;n++)switch(t[n]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[n].substring(2);default:}return e?se.getDirection(e):"sendrecv"};se.getKind=function(i){return se.splitLines(i)[0].split(" ")[0].substring(2)};se.isRejected=function(i){return i.split(" ",2)[1]==="0"};se.parseMLine=function(i){let t=se.splitLines(i)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};se.parseOLine=function(i){let t=se.matchPrefix(i,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};se.isValidSDP=function(i){if(typeof i!="string"||i.length===0)return!1;let e=se.splitLines(i);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof Ru=="object"&&(Ru.exports=se)});var yd=0,Fc=1,vd=2;var Nc=1,xd=2,Cn=3,Vn=0,Yt=1,cn=2,Wn=0,_i=1,Qr=2,Oc=3,Uc=4,_d=5,ti=100,Sd=101,bd=102,Md=103,wd=104,Ed=200,Td=201,Cd=202,Ad=203,Gs=204,Xs=205,Rd=206,Id=207,Pd=208,Ld=209,Dd=210,Fd=211,Nd=212,Od=213,Ud=214,go=0,yo=1,vo=2,Si=3,xo=4,_o=5,So=6,bo=7,kc=0,kd=1,Bd=2,Gn=0,Vd=1,zd=2,Hd=3,Mo=4,Wd=5,Gd=6,Xd=7;var Bc=300,Ti=301,Ci=302,wo=303,Eo=304,es=306,qs=1e3,ei=1001,Ys=1002,fn=1003,qd=1004;var ts=1005;var xn=1006,To=1007;var ai=1008;var Mn=1009,Vc=1010,zc=1011,ar=1012,Co=1013,li=1014,An=1015,lr=1016,Ao=1017,Ro=1018,cr=1020,Hc=35902,Wc=35899,Gc=1021,Xc=1022,pn=1023,er=1026,hr=1027,qc=1028,Io=1029,Yc=1030,Po=1031;var Lo=1033,ns=33776,is=33777,rs=33778,ss=33779,Do=35840,Fo=35841,No=35842,Oo=35843,Uo=36196,ko=37492,Bo=37496,Vo=37808,zo=37809,Ho=37810,Wo=37811,Go=37812,Xo=37813,qo=37814,Yo=37815,$o=37816,Ko=37817,Jo=37818,Zo=37819,jo=37820,Qo=37821,ea=36492,ta=36494,na=36495,ia=36283,ra=36284,sa=36285,oa=36286;var Ir=2300,$s=2301,Ws=2302,Ec=2400,Tc=2401,Cc=2402;var Yd=3200,$d=3201;var $c=0,Kd=1,Xn="",qt="srgb",bi="srgb-linear",Pr="linear",lt="srgb";var xi=7680;var Ac=519,Jd=512,Zd=513,jd=514,Kc=515,Qd=516,ef=517,tf=518,nf=519,Rc=35044;var Jc="300 es",vn=2e3,Lr=2001;var zn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ku=1234567,Ar=Math.PI/180,Mi=180/Math.PI;function ur(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[t&63|128]+Vt[t>>8&255]+"-"+Vt[t>>16&255]+Vt[t>>24&255]+Vt[n&255]+Vt[n>>8&255]+Vt[n>>16&255]+Vt[n>>24&255]).toLowerCase()}function Ke(i,e,t){return Math.max(e,Math.min(t,i))}function Zc(i,e){return(i%e+e)%e}function Rp(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Ip(i,e,t){return i!==e?(t-i)/(e-i):0}function Rr(i,e,t){return(1-t)*i+t*e}function Pp(i,e,t,n){return Rr(i,e,1-Math.exp(-t*n))}function Lp(i,e=1){return e-Math.abs(Zc(i,e*2)-e)}function Dp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Fp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Np(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Op(i,e){return i+Math.random()*(e-i)}function Up(i){return i*(.5-Math.random())}function kp(i){i!==void 0&&(Ku=i);let e=Ku+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Bp(i){return i*Ar}function Vp(i){return i*Mi}function zp(i){return(i&i-1)===0&&i!==0}function Hp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Gp(i,e,t,n,r){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),d=o((e-n)/2),p=s((n-e)/2),g=o((n-e)/2);switch(r){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ji(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Xt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var jt={DEG2RAD:Ar,RAD2DEG:Mi,generateUUID:ur,clamp:Ke,euclideanModulo:Zc,mapLinear:Rp,inverseLerp:Ip,lerp:Rr,damp:Pp,pingpong:Lp,smoothstep:Dp,smootherstep:Fp,randInt:Np,randFloat:Op,randFloatSpread:Up,seededRandom:kp,degToRad:Bp,radToDeg:Vp,isPowerOfTwo:zp,ceilPowerOfTwo:Hp,floorPowerOfTwo:Wp,setQuaternionFromProperEuler:Gp,normalize:Xt,denormalize:ji},Ye=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},on=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let l=n[r+0],c=n[r+1],h=n[r+2],u=n[r+3],d=s[o+0],p=s[o+1],g=s[o+2],M=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=M;return}if(u!==M||l!==d||c!==p||h!==g){let m=1-a,f=l*d+c*p+h*g+u*M,T=f>=0?1:-1,E=1-f*f;if(E>Number.EPSILON){let v=Math.sqrt(E),S=Math.atan2(v,f*T);m=Math.sin(m*S)/v,a=Math.sin(a*S)/v}let b=a*T;if(l=l*m+d*b,c=c*m+p*b,h=h*m+g*b,u=u*m+M*b,m===1-a){let v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,o){let a=n[r],l=n[r+1],c=n[r+2],h=n[r+3],u=s[o],d=s[o+1],p=s[o+2],g=s[o+3];return e[t]=a*g+h*u+l*p-c*d,e[t+1]=l*g+h*d+c*u-a*p,e[t+2]=c*g+h*p+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(r/2),u=a(s/2),d=l(n/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-r*a,this._w=o*h-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,s=this._z,o=this._w,a=o*e._w+n*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ju.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ju.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*n),h=2*(a*t-s*r),u=2*(s*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=r+l*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ic.copy(this).projectOnVector(e),this.sub(ic)}reflect(e){return this.sub(ic.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ic=new O,Ju=new on,We=class i{constructor(e,t,n,r,s,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c)}set(e,t,n,r,s,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],M=r[0],m=r[3],f=r[6],T=r[1],E=r[4],b=r[7],v=r[2],S=r[5],C=r[8];return s[0]=o*M+a*T+l*v,s[3]=o*m+a*E+l*S,s[6]=o*f+a*b+l*C,s[1]=c*M+h*T+u*v,s[4]=c*m+h*E+u*S,s[7]=c*f+h*b+u*C,s[2]=d*M+p*T+g*v,s[5]=d*m+p*E+g*S,s[8]=d*f+p*b+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*s*h+n*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*s,p=c*s-o*l,g=t*u+n*d+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/g;return e[0]=u*M,e[1]=(r*c-h*n)*M,e[2]=(a*n-r*o)*M,e[3]=d*M,e[4]=(h*t-r*l)*M,e[5]=(r*s-a*t)*M,e[6]=p*M,e[7]=(n*l-c*t)*M,e[8]=(o*t-n*s)*M,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(rc.makeScale(e,t)),this}rotate(e){return this.premultiply(rc.makeRotation(-e)),this}translate(e,t){return this.premultiply(rc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},rc=new We;function jc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Dr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function rf(){let i=Dr("canvas");return i.style.display="block",i}var Zu={};function tr(i){i in Zu||(Zu[i]=!0,console.warn(i))}function sf(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var ju=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qu=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xp(){let i={enabled:!0,workingColorSpace:bi,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===lt&&(r.r=Bn(r.r),r.g=Bn(r.g),r.b=Bn(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===lt&&(r.r=Qi(r.r),r.g=Qi(r.g),r.b=Qi(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Xn?Pr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return tr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return tr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[bi]:{primaries:e,whitePoint:n,transfer:Pr,toXYZ:ju,fromXYZ:Qu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:qt},outputColorSpaceConfig:{drawingBufferColorSpace:qt}},[qt]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:ju,fromXYZ:Qu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:qt}}}),i}var tt=Xp();function Bn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Qi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Vi,Ks=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Vi===void 0&&(Vi=Dr("canvas")),Vi.width=e.width,Vi.height=e.height;let r=Vi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=Vi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Dr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Bn(s[o]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Bn(t[n]/255)*255):t[n]=Bn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},qp=0,nr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=ur(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(sc(r[o].image)):s.push(sc(r[o]))}else s=sc(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function sc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ks.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Yp=0,oc=new O,an=class i extends zn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=ei,r=ei,s=xn,o=ai,a=pn,l=Mn,c=i.DEFAULT_ANISOTROPY,h=Xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=ur(),this.name="",this.source=new nr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ye(0,0),this.repeat=new Ye(1,1),this.center=new Ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(oc).x}get height(){return this.source.getSize(oc).y}get depth(){return this.source.getSize(oc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qs:e.x=e.x-Math.floor(e.x);break;case ei:e.x=e.x<0?0:1;break;case Ys:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case qs:e.y=e.y-Math.floor(e.y);break;case ei:e.y=e.y<0?0:1;break;case Ys:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=Bc;an.DEFAULT_ANISOTROPY=1;var bt=class i{constructor(e=0,t=0,n=0,r=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],M=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+M)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,b=(p+1)/2,v=(f+1)/2,S=(h+d)/4,C=(u+M)/4,R=(g+m)/4;return E>b&&E>v?E<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(E),r=S/n,s=C/n):b>v?b<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),n=S/r,s=R/r):v<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(v),n=C/s,r=R/s),this.set(n,r,s,t),this}let T=Math.sqrt((m-g)*(m-g)+(u-M)*(u-M)+(d-h)*(d-h));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(u-M)/T,this.z=(d-h)/T,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Js=class extends zn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new bt(0,0,e,t),this.scissorTest=!1,this.viewport=new bt(0,0,e,t);let r={width:e,height:t,depth:n.depth},s=new an(r);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:xn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new nr(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Tn=class extends Js{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Fr=class extends an{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Zs=class extends an{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ni=class{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,mn):mn.fromBufferAttribute(s,o),mn.applyMatrix4(e.matrixWorld),this.expandByPoint(mn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Es.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Es.copy(n.boundingBox)),Es.applyMatrix4(e.matrixWorld),this.union(Es)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mn),mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wr),Ts.subVectors(this.max,wr),zi.subVectors(e.a,wr),Hi.subVectors(e.b,wr),Wi.subVectors(e.c,wr),Yn.subVectors(Hi,zi),$n.subVectors(Wi,Hi),mi.subVectors(zi,Wi);let t=[0,-Yn.z,Yn.y,0,-$n.z,$n.y,0,-mi.z,mi.y,Yn.z,0,-Yn.x,$n.z,0,-$n.x,mi.z,0,-mi.x,-Yn.y,Yn.x,0,-$n.y,$n.x,0,-mi.y,mi.x,0];return!ac(t,zi,Hi,Wi,Ts)||(t=[1,0,0,0,1,0,0,0,1],!ac(t,zi,Hi,Wi,Ts))?!1:(Cs.crossVectors(Yn,$n),t=[Cs.x,Cs.y,Cs.z],ac(t,zi,Hi,Wi,Ts))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Dn=[new O,new O,new O,new O,new O,new O,new O,new O],mn=new O,Es=new ni,zi=new O,Hi=new O,Wi=new O,Yn=new O,$n=new O,mi=new O,wr=new O,Ts=new O,Cs=new O,gi=new O;function ac(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){gi.fromArray(i,s);let a=r.x*Math.abs(gi.x)+r.y*Math.abs(gi.y)+r.z*Math.abs(gi.z),l=e.dot(gi),c=t.dot(gi),h=n.dot(gi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var $p=new ni,Er=new O,lc=new O,ir=class{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):$p.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Er.subVectors(e,this.center);let t=Er.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Er,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(lc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Er.copy(e.center).add(lc)),this.expandByPoint(Er.copy(e.center).sub(lc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Fn=new O,cc=new O,As=new O,Kn=new O,hc=new O,Rs=new O,uc=new O,Nr=class{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Fn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Fn.copy(this.origin).addScaledVector(this.direction,t),Fn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){cc.copy(e).add(t).multiplyScalar(.5),As.copy(t).sub(e).normalize(),Kn.copy(this.origin).sub(cc);let s=e.distanceTo(t)*.5,o=-this.direction.dot(As),a=Kn.dot(this.direction),l=-Kn.dot(As),c=Kn.lengthSq(),h=Math.abs(1-o*o),u,d,p,g;if(h>0)if(u=o*l-a,d=o*a-l,g=s*h,u>=0)if(d>=-g)if(d<=g){let M=1/h;u*=M,d*=M,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(cc).addScaledVector(As,d),p}intersectSphere(e,t){Fn.subVectors(e.center,this.origin);let n=Fn.dot(this.direction),r=Fn.dot(Fn)-n*n,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>r)||((a>n||n!==n)&&(n=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Fn)!==null}intersectTriangle(e,t,n,r,s){hc.subVectors(t,e),Rs.subVectors(n,e),uc.crossVectors(hc,Rs);let o=this.direction.dot(uc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Kn.subVectors(this.origin,e);let l=a*this.direction.dot(Rs.crossVectors(Kn,Rs));if(l<0)return null;let c=a*this.direction.dot(hc.cross(Kn));if(c<0||l+c>o)return null;let h=-a*Kn.dot(uc);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xt=class i{constructor(e,t,n,r,s,o,a,l,c,h,u,d,p,g,M,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c,h,u,d,p,g,M,m)}set(e,t,n,r,s,o,a,l,c,h,u,d,p,g,M,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=M,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Gi.setFromMatrixColumn(e,0).length(),s=1/Gi.setFromMatrixColumn(e,1).length(),o=1/Gi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=o*h,p=o*u,g=a*h,M=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=d-M*c,t[9]=-a*l,t[2]=M-d*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,g=c*h,M=c*u;t[0]=d+M*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=M+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,g=c*h,M=c*u;t[0]=d-M*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=M-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,p=o*u,g=a*h,M=a*u;t[0]=l*h,t[4]=g*c-p,t[8]=d*c+M,t[1]=l*u,t[5]=M*c+d,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,p=o*c,g=a*l,M=a*c;t[0]=l*h,t[4]=M-d*u,t[8]=g*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+g,t[10]=d-M*u}else if(e.order==="XZY"){let d=o*l,p=o*c,g=a*l,M=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+M,t[5]=o*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*h,t[10]=M*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Kp,e,Jp)}lookAt(e,t,n){let r=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),Jn.crossVectors(n,nn),Jn.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),Jn.crossVectors(n,nn)),Jn.normalize(),Is.crossVectors(nn,Jn),r[0]=Jn.x,r[4]=Is.x,r[8]=nn.x,r[1]=Jn.y,r[5]=Is.y,r[9]=nn.y,r[2]=Jn.z,r[6]=Is.z,r[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],M=n[6],m=n[10],f=n[14],T=n[3],E=n[7],b=n[11],v=n[15],S=r[0],C=r[4],R=r[8],_=r[12],x=r[1],I=r[5],D=r[9],V=r[13],W=r[2],Z=r[6],K=r[10],te=r[14],z=r[3],oe=r[7],de=r[11],Ee=r[15];return s[0]=o*S+a*x+l*W+c*z,s[4]=o*C+a*I+l*Z+c*oe,s[8]=o*R+a*D+l*K+c*de,s[12]=o*_+a*V+l*te+c*Ee,s[1]=h*S+u*x+d*W+p*z,s[5]=h*C+u*I+d*Z+p*oe,s[9]=h*R+u*D+d*K+p*de,s[13]=h*_+u*V+d*te+p*Ee,s[2]=g*S+M*x+m*W+f*z,s[6]=g*C+M*I+m*Z+f*oe,s[10]=g*R+M*D+m*K+f*de,s[14]=g*_+M*V+m*te+f*Ee,s[3]=T*S+E*x+b*W+v*z,s[7]=T*C+E*I+b*Z+v*oe,s[11]=T*R+E*D+b*K+v*de,s[15]=T*_+E*V+b*te+v*Ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],M=e[7],m=e[11],f=e[15];return g*(+s*l*u-r*c*u-s*a*d+n*c*d+r*a*p-n*l*p)+M*(+t*l*p-t*c*d+s*o*d-r*o*p+r*c*h-s*l*h)+m*(+t*c*u-t*a*p-s*o*u+n*o*p+s*a*h-n*c*h)+f*(-r*a*h-t*l*u+t*a*d+r*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],M=e[13],m=e[14],f=e[15],T=u*m*c-M*d*c+M*l*p-a*m*p-u*l*f+a*d*f,E=g*d*c-h*m*c-g*l*p+o*m*p+h*l*f-o*d*f,b=h*M*c-g*u*c+g*a*p-o*M*p-h*a*f+o*u*f,v=g*u*l-h*M*l-g*a*d+o*M*d+h*a*m-o*u*m,S=t*T+n*E+r*b+s*v;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/S;return e[0]=T*C,e[1]=(M*d*s-u*m*s-M*r*p+n*m*p+u*r*f-n*d*f)*C,e[2]=(a*m*s-M*l*s+M*r*c-n*m*c-a*r*f+n*l*f)*C,e[3]=(u*l*s-a*d*s-u*r*c+n*d*c+a*r*p-n*l*p)*C,e[4]=E*C,e[5]=(h*m*s-g*d*s+g*r*p-t*m*p-h*r*f+t*d*f)*C,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*f-t*l*f)*C,e[7]=(o*d*s-h*l*s+h*r*c-t*d*c-o*r*p+t*l*p)*C,e[8]=b*C,e[9]=(g*u*s-h*M*s-g*n*p+t*M*p+h*n*f-t*u*f)*C,e[10]=(o*M*s-g*a*s+g*n*c-t*M*c-o*n*f+t*a*f)*C,e[11]=(h*a*s-o*u*s-h*n*c+t*u*c+o*n*p-t*a*p)*C,e[12]=v*C,e[13]=(h*M*r-g*u*r+g*n*d-t*M*d-h*n*m+t*u*m)*C,e[14]=(g*a*r-o*M*r-g*n*l+t*M*l+o*n*m-t*a*m)*C,e[15]=(o*u*r-h*a*r+h*n*l-t*u*l-o*n*d+t*a*d)*C,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+n,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,h=o+o,u=a+a,d=s*c,p=s*h,g=s*u,M=o*h,m=o*u,f=a*u,T=l*c,E=l*h,b=l*u,v=n.x,S=n.y,C=n.z;return r[0]=(1-(M+f))*v,r[1]=(p+b)*v,r[2]=(g-E)*v,r[3]=0,r[4]=(p-b)*S,r[5]=(1-(d+f))*S,r[6]=(m+T)*S,r[7]=0,r[8]=(g+E)*C,r[9]=(m-T)*C,r[10]=(1-(d+M))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,s=Gi.set(r[0],r[1],r[2]).length(),o=Gi.set(r[4],r[5],r[6]).length(),a=Gi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],gn.copy(this);let c=1/s,h=1/o,u=1/a;return gn.elements[0]*=c,gn.elements[1]*=c,gn.elements[2]*=c,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=u,gn.elements[9]*=u,gn.elements[10]*=u,t.setFromRotationMatrix(gn),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=vn,l=!1){let c=this.elements,h=2*s/(t-e),u=2*s/(n-r),d=(t+e)/(t-e),p=(n+r)/(n-r),g,M;if(l)g=s/(o-s),M=o*s/(o-s);else if(a===vn)g=-(o+s)/(o-s),M=-2*o*s/(o-s);else if(a===Lr)g=-o/(o-s),M=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=vn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),p=-(n+r)/(n-r),g,M;if(l)g=1/(o-s),M=o/(o-s);else if(a===vn)g=-2/(o-s),M=-(o+s)/(o-s);else if(a===Lr)g=-1/(o-s),M=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Gi=new O,gn=new xt,Kp=new O(0,0,0),Jp=new O(1,1,1),Jn=new O,Is=new O,nn=new O,ed=new xt,td=new on,_n=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],u=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ed.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ed,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return td.setFromEuler(this),this.setFromQuaternion(td,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};_n.DEFAULT_ORDER="XYZ";var rr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Zp=0,nd=new O,Xi=new on,Nn=new xt,Ps=new O,Tr=new O,jp=new O,Qp=new on,id=new O(1,0,0),rd=new O(0,1,0),sd=new O(0,0,1),od={type:"added"},em={type:"removed"},qi={type:"childadded",child:null},dc={type:"childremoved",child:null},Ot=class i extends zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=ur(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new O,t=new _n,n=new on,r=new O(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new xt},normalMatrix:{value:new We}}),this.matrix=new xt,this.matrixWorld=new xt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.premultiply(Xi),this}rotateX(e){return this.rotateOnAxis(id,e)}rotateY(e){return this.rotateOnAxis(rd,e)}rotateZ(e){return this.rotateOnAxis(sd,e)}translateOnAxis(e,t){return nd.copy(e).applyQuaternion(this.quaternion),this.position.add(nd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(id,e)}translateY(e){return this.translateOnAxis(rd,e)}translateZ(e){return this.translateOnAxis(sd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ps.copy(e):Ps.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(Tr,Ps,this.up):Nn.lookAt(Ps,Tr,this.up),this.quaternion.setFromRotationMatrix(Nn),r&&(Nn.extractRotation(r.matrixWorld),Xi.setFromRotationMatrix(Nn),this.quaternion.premultiply(Xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(od),qi.child=e,this.dispatchEvent(qi),qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(em),dc.child=e,this.dispatchEvent(dc),dc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Nn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Nn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(od),qi.child=e,this.dispatchEvent(qi),qi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,e,jp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,Qp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}};Ot.DEFAULT_UP=new O(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var yn=new O,On=new O,fc=new O,Un=new O,Yi=new O,$i=new O,ad=new O,pc=new O,mc=new O,gc=new O,yc=new bt,vc=new bt,xc=new bt,Qn=class i{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),yn.subVectors(e,t),r.cross(yn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){yn.subVectors(r,t),On.subVectors(n,t),fc.subVectors(e,t);let o=yn.dot(yn),a=yn.dot(On),l=yn.dot(fc),c=On.dot(On),h=On.dot(fc),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(c*l-a*h)*d,g=(o*h-a*l)*d;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(e,t,n,r,s,o,a,l){return this.getBarycoord(e,t,n,r,Un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Un.x),l.addScaledVector(o,Un.y),l.addScaledVector(a,Un.z),l)}static getInterpolatedAttribute(e,t,n,r,s,o){return yc.setScalar(0),vc.setScalar(0),xc.setScalar(0),yc.fromBufferAttribute(e,t),vc.fromBufferAttribute(e,n),xc.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(yc,s.x),o.addScaledVector(vc,s.y),o.addScaledVector(xc,s.z),o}static isFrontFacing(e,t,n,r){return yn.subVectors(n,t),On.subVectors(e,t),yn.cross(On).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return yn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),yn.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,o,a;Yi.subVectors(r,n),$i.subVectors(s,n),pc.subVectors(e,n);let l=Yi.dot(pc),c=$i.dot(pc);if(l<=0&&c<=0)return t.copy(n);mc.subVectors(e,r);let h=Yi.dot(mc),u=$i.dot(mc);if(h>=0&&u<=h)return t.copy(r);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Yi,o);gc.subVectors(e,s);let p=Yi.dot(gc),g=$i.dot(gc);if(g>=0&&p<=g)return t.copy(s);let M=p*c-l*g;if(M<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector($i,a);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return ad.subVectors(s,r),a=(u-h)/(u-h+(p-g)),t.copy(r).addScaledVector(ad,a);let f=1/(m+M+d);return o=M*f,a=d*f,t.copy(n).addScaledVector(Yi,o).addScaledVector($i,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},of={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Ls={h:0,s:0,l:0};function _c(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var $e=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=tt.workingColorSpace){if(e=Zc(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=_c(o,s,e+1/3),this.g=_c(o,s,e),this.b=_c(o,s,e-1/3)}return tt.colorSpaceToWorking(this,r),this}setStyle(e,t=qt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qt){let n=of[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=Qi(e.r),this.g=Qi(e.g),this.b=Qi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qt){return tt.workingToColorSpace(zt.copy(this),e),Math.round(Ke(zt.r*255,0,255))*65536+Math.round(Ke(zt.g*255,0,255))*256+Math.round(Ke(zt.b*255,0,255))}getHexString(e=qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(zt.copy(this),t);let n=zt.r,r=zt.g,s=zt.b,o=Math.max(n,r,s),a=Math.min(n,r,s),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-n)/u+2;break;case s:l=(n-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=qt){tt.workingToColorSpace(zt.copy(this),e);let t=zt.r,n=zt.g,r=zt.b;return e!==qt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Zn),this.setHSL(Zn.h+e,Zn.s+t,Zn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Zn),e.getHSL(Ls);let n=Rr(Zn.h,Ls.h,t),r=Rr(Zn.s,Ls.s,t),s=Rr(Zn.l,Ls.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zt=new $e;$e.NAMES=of;var tm=0,ii=class extends zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=ur(),this.name="",this.type="Material",this.blending=_i,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Gs,this.blendDst=Xs,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=Si,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ac,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xi,this.stencilZFail=xi,this.stencilZPass=xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_i&&(n.blending=this.blending),this.side!==Vn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Gs&&(n.blendSrc=this.blendSrc),this.blendDst!==Xs&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Si&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ac&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},wi=class extends ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=kc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var At=new O,Ds=new Ye,nm=0,sn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:nm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Rc,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ds.fromBufferAttribute(this,t),Ds.applyMatrix3(e),this.setXY(t,Ds.x,Ds.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix3(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ji(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Xt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ji(t,this.array)),t}setX(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ji(t,this.array)),t}setY(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ji(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ji(t,this.array)),t}setW(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),n=Xt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),n=Xt(n,this.array),r=Xt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),n=Xt(n,this.array),r=Xt(r,this.array),s=Xt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Rc&&(e.usage=this.usage),e}};var Or=class extends sn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Ur=class extends sn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Pt=class extends sn{constructor(e,t,n){super(new Float32Array(e),t,n)}},im=0,dn=new xt,Sc=new Ot,Ki=new O,rn=new ni,Cr=new ni,Nt=new O,Sn=class i extends zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:im++}),this.uuid=ur(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(jc(e)?Ur:Or)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new We().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return dn.makeRotationFromQuaternion(e),this.applyMatrix4(dn),this}rotateX(e){return dn.makeRotationX(e),this.applyMatrix4(dn),this}rotateY(e){return dn.makeRotationY(e),this.applyMatrix4(dn),this}rotateZ(e){return dn.makeRotationZ(e),this.applyMatrix4(dn),this}translate(e,t,n){return dn.makeTranslation(e,t,n),this.applyMatrix4(dn),this}scale(e,t,n){return dn.makeScale(e,t,n),this.applyMatrix4(dn),this}lookAt(e){return Sc.lookAt(e),Sc.updateMatrix(),this.applyMatrix4(Sc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ki).negate(),this.translate(Ki.x,Ki.y,Ki.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pt(n,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ni);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];rn.setFromBufferAttribute(s),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ir);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){let n=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Cr.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(rn.min,Cr.min),rn.expandByPoint(Nt),Nt.addVectors(rn.max,Cr.max),rn.expandByPoint(Nt)):(rn.expandByPoint(Cr.min),rn.expandByPoint(Cr.max))}rn.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)Nt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Nt));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Nt.fromBufferAttribute(a,c),l&&(Ki.fromBufferAttribute(e,c),Nt.add(Ki)),r=Math.max(r,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new sn(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<n.count;R++)a[R]=new O,l[R]=new O;let c=new O,h=new O,u=new O,d=new Ye,p=new Ye,g=new Ye,M=new O,m=new O;function f(R,_,x){c.fromBufferAttribute(n,R),h.fromBufferAttribute(n,_),u.fromBufferAttribute(n,x),d.fromBufferAttribute(s,R),p.fromBufferAttribute(s,_),g.fromBufferAttribute(s,x),h.sub(c),u.sub(c),p.sub(d),g.sub(d);let I=1/(p.x*g.y-g.x*p.y);isFinite(I)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(I),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(I),a[R].add(M),a[_].add(M),a[x].add(M),l[R].add(m),l[_].add(m),l[x].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let R=0,_=T.length;R<_;++R){let x=T[R],I=x.start,D=x.count;for(let V=I,W=I+D;V<W;V+=3)f(e.getX(V+0),e.getX(V+1),e.getX(V+2))}let E=new O,b=new O,v=new O,S=new O;function C(R){v.fromBufferAttribute(r,R),S.copy(v);let _=a[R];E.copy(_),E.sub(v.multiplyScalar(v.dot(_))).normalize(),b.crossVectors(S,_);let I=b.dot(l[R])<0?-1:1;o.setXYZW(R,E.x,E.y,E.z,I)}for(let R=0,_=T.length;R<_;++R){let x=T[R],I=x.start,D=x.count;for(let V=I,W=I+D;V<W;V+=3)C(e.getX(V+0)),C(e.getX(V+1)),C(e.getX(V+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new sn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let r=new O,s=new O,o=new O,a=new O,l=new O,c=new O,h=new O,u=new O;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),M=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,M),o.fromBufferAttribute(t,m),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),p=0,g=0;for(let M=0,m=l.length;M<m;M++){a.isInterleavedBufferAttribute?p=l[M]*a.data.stride+a.offset:p=l[M]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new sn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,n);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=e(d,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let c in r){let h=r[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ld=new xt,yi=new Nr,Fs=new ir,cd=new O,Ns=new O,Os=new O,Us=new O,bc=new O,ks=new O,hd=new O,Bs=new O,Ut=class extends Ot{constructor(e=new Sn,t=new wi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){ks.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=a[l],u=s[l];h!==0&&(bc.fromBufferAttribute(u,e),o?ks.addScaledVector(bc,h):ks.addScaledVector(bc.sub(t),h))}t.add(ks)}return t}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fs.copy(n.boundingSphere),Fs.applyMatrix4(s),yi.copy(e.ray).recast(e.near),!(Fs.containsPoint(yi.origin)===!1&&(yi.intersectSphere(Fs,cd)===null||yi.origin.distanceToSquared(cd)>(e.far-e.near)**2))&&(ld.copy(s).invert(),yi.copy(e.ray).applyMatrix4(ld),!(n.boundingBox!==null&&yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,yi)))}_computeIntersections(e,t,n){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,M=d.length;g<M;g++){let m=d[g],f=o[m.materialIndex],T=Math.max(m.start,p.start),E=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let b=T,v=E;b<v;b+=3){let S=a.getX(b),C=a.getX(b+1),R=a.getX(b+2);r=Vs(this,f,e,n,c,h,u,S,C,R),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,p.start),M=Math.min(a.count,p.start+p.count);for(let m=g,f=M;m<f;m+=3){let T=a.getX(m),E=a.getX(m+1),b=a.getX(m+2);r=Vs(this,o,e,n,c,h,u,T,E,b),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,M=d.length;g<M;g++){let m=d[g],f=o[m.materialIndex],T=Math.max(m.start,p.start),E=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let b=T,v=E;b<v;b+=3){let S=b,C=b+1,R=b+2;r=Vs(this,f,e,n,c,h,u,S,C,R),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,p.start),M=Math.min(l.count,p.start+p.count);for(let m=g,f=M;m<f;m+=3){let T=m,E=m+1,b=m+2;r=Vs(this,o,e,n,c,h,u,T,E,b),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};function rm(i,e,t,n,r,s,o,a){let l;if(e.side===Yt?l=n.intersectTriangle(o,s,r,!0,a):l=n.intersectTriangle(r,s,o,e.side===Vn,a),l===null)return null;Bs.copy(a),Bs.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Bs);return c<t.near||c>t.far?null:{distance:c,point:Bs.clone(),object:i}}function Vs(i,e,t,n,r,s,o,a,l,c){i.getVertexPosition(a,Ns),i.getVertexPosition(l,Os),i.getVertexPosition(c,Us);let h=rm(i,e,t,n,Ns,Os,Us,hd);if(h){let u=new O;Qn.getBarycoord(hd,Ns,Os,Us,u),r&&(h.uv=Qn.getInterpolatedAttribute(r,a,l,c,u,new Ye)),s&&(h.uv1=Qn.getInterpolatedAttribute(s,a,l,c,u,new Ye)),o&&(h.normal=Qn.getInterpolatedAttribute(o,a,l,c,u,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new O,materialIndex:0};Qn.getNormal(Ns,Os,Us,d.normal),h.face=d,h.barycoord=u}return h}var ri=class i extends Sn{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,r,o,2),g("x","z","y",1,-1,e,n,-t,r,o,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Pt(c,3)),this.setAttribute("normal",new Pt(h,3)),this.setAttribute("uv",new Pt(u,2));function g(M,m,f,T,E,b,v,S,C,R,_){let x=b/C,I=v/R,D=b/2,V=v/2,W=S/2,Z=C+1,K=R+1,te=0,z=0,oe=new O;for(let de=0;de<K;de++){let Ee=de*I-V;for(let Be=0;Be<Z;Be++){let at=Be*x-D;oe[M]=at*T,oe[m]=Ee*E,oe[f]=W,c.push(oe.x,oe.y,oe.z),oe[M]=0,oe[m]=0,oe[f]=S>0?1:-1,h.push(oe.x,oe.y,oe.z),u.push(Be/C),u.push(1-de/R),te+=1}}for(let de=0;de<R;de++)for(let Ee=0;Ee<C;Ee++){let Be=d+Ee+Z*de,at=d+Ee+Z*(de+1),rt=d+(Ee+1)+Z*(de+1),et=d+(Ee+1)+Z*de;l.push(Be,at,et),l.push(at,rt,et),z+=6}a.addGroup(p,z,_),p+=z,d+=te}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ai(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Ht(i){let e={};for(let t=0;t<i.length;t++){let n=Ai(i[t]);for(let r in n)e[r]=n[r]}return e}function sm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Qc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var af={clone:Ai,merge:Ht},om=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,am=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bn=class extends ii{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=om,this.fragmentShader=am,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ai(e.uniforms),this.uniformsGroups=sm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},kr=class extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new xt,this.projectionMatrix=new xt,this.projectionMatrixInverse=new xt,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},jn=new O,ud=new Ye,dd=new Ye,It=class extends kr{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Mi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Mi*2*Math.atan(Math.tan(Ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,t){return this.getViewBounds(e,ud,dd),t.subVectors(dd,ud)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ar*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ji=-90,Zi=1,js=class extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new It(Ji,Zi,e,t);r.layers=this.layers,this.add(r);let s=new It(Ji,Zi,e,t);s.layers=this.layers,this.add(s);let o=new It(Ji,Zi,e,t);o.layers=this.layers,this.add(o);let a=new It(Ji,Zi,e,t);a.layers=this.layers,this.add(a);let l=new It(Ji,Zi,e,t);l.layers=this.layers,this.add(l);let c=new It(Ji,Zi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===vn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Br=class extends an{constructor(e=[],t=Ti,n,r,s,o,a,l,c,h){super(e,t,n,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Qs=class extends Tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Br(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ri(5,5,5),s=new bn({name:"CubemapFromEquirect",uniforms:Ai(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Yt,blending:Wn});s.uniforms.tEquirect.value=t;let o=new Ut(r,s),a=t.minFilter;return t.minFilter===ai&&(t.minFilter=xn),new js(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}},kn=class extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}},lm={type:"move"},sr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let M of e.hand.values()){let m=t.getJointPose(M,n),f=this._getHandJoint(c,M);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(lm)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new kn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Vr=class extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Mc=new O,cm=new O,hm=new We,Zt=class{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Mc.subVectors(n,t).cross(cm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Mc),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||hm.getNormalMatrix(e),r=this.coplanarPoint(Mc).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},vi=new ir,um=new Ye(.5,.5),zs=new O,or=class{constructor(e=new Zt,t=new Zt,n=new Zt,r=new Zt,s=new Zt,o=new Zt){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vn,n=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],p=s[7],g=s[8],M=s[9],m=s[10],f=s[11],T=s[12],E=s[13],b=s[14],v=s[15];if(r[0].setComponents(c-o,p-h,f-g,v-T).normalize(),r[1].setComponents(c+o,p+h,f+g,v+T).normalize(),r[2].setComponents(c+a,p+u,f+M,v+E).normalize(),r[3].setComponents(c-a,p-u,f-M,v-E).normalize(),n)r[4].setComponents(l,d,m,b).normalize(),r[5].setComponents(c-l,p-d,f-m,v-b).normalize();else if(r[4].setComponents(c-l,p-d,f-m,v-b).normalize(),t===vn)r[5].setComponents(c+l,p+d,f+m,v+b).normalize();else if(t===Lr)r[5].setComponents(l,d,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),vi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),vi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(vi)}intersectsSprite(e){vi.center.set(0,0,0);let t=um.distanceTo(e.center);return vi.radius=.7071067811865476+t,vi.applyMatrix4(e.matrixWorld),this.intersectsSphere(vi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(zs.x=r.normal.x>0?e.max.x:e.min.x,zs.y=r.normal.y>0?e.max.y:e.min.y,zs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(zs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var zr=class extends an{constructor(e,t,n=li,r,s,o,a=fn,l=fn,c,h=er,u=1){if(h!==er&&h!==hr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,r,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new nr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Hr=class extends an{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var eo=class i extends Sn{constructor(e=1,t=1,n=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};let c=this;r=Math.floor(r),s=Math.floor(s);let h=[],u=[],d=[],p=[],g=0,M=[],m=n/2,f=0;T(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new Pt(u,3)),this.setAttribute("normal",new Pt(d,3)),this.setAttribute("uv",new Pt(p,2));function T(){let b=new O,v=new O,S=0,C=(t-e)/n;for(let R=0;R<=s;R++){let _=[],x=R/s,I=x*(t-e)+e;for(let D=0;D<=r;D++){let V=D/r,W=V*l+a,Z=Math.sin(W),K=Math.cos(W);v.x=I*Z,v.y=-x*n+m,v.z=I*K,u.push(v.x,v.y,v.z),b.set(Z,C,K).normalize(),d.push(b.x,b.y,b.z),p.push(V,1-x),_.push(g++)}M.push(_)}for(let R=0;R<r;R++)for(let _=0;_<s;_++){let x=M[_][R],I=M[_+1][R],D=M[_+1][R+1],V=M[_][R+1];(e>0||_!==0)&&(h.push(x,I,V),S+=3),(t>0||_!==s-1)&&(h.push(I,D,V),S+=3)}c.addGroup(f,S,0),f+=S}function E(b){let v=g,S=new Ye,C=new O,R=0,_=b===!0?e:t,x=b===!0?1:-1;for(let D=1;D<=r;D++)u.push(0,m*x,0),d.push(0,x,0),p.push(.5,.5),g++;let I=g;for(let D=0;D<=r;D++){let W=D/r*l+a,Z=Math.cos(W),K=Math.sin(W);C.x=_*K,C.y=m*x,C.z=_*Z,u.push(C.x,C.y,C.z),d.push(0,x,0),S.x=Z*.5+.5,S.y=K*.5*x+.5,p.push(S.x,S.y),g++}for(let D=0;D<r;D++){let V=v+D,W=I+D;b===!0?h.push(W,W+1,V):h.push(W+1,W,V),R+=3}c.addGroup(f,R,b===!0?1:2),f+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Wr=class i extends eo{constructor(e=1,t=1,n=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,n,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},to=class i extends Sn{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};let s=[],o=[];a(r),c(n),h(),this.setAttribute("position",new Pt(s,3)),this.setAttribute("normal",new Pt(s.slice(),3)),this.setAttribute("uv",new Pt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(T){let E=new O,b=new O,v=new O;for(let S=0;S<t.length;S+=3)p(t[S+0],E),p(t[S+1],b),p(t[S+2],v),l(E,b,v,T)}function l(T,E,b,v){let S=v+1,C=[];for(let R=0;R<=S;R++){C[R]=[];let _=T.clone().lerp(b,R/S),x=E.clone().lerp(b,R/S),I=S-R;for(let D=0;D<=I;D++)D===0&&R===S?C[R][D]=_:C[R][D]=_.clone().lerp(x,D/I)}for(let R=0;R<S;R++)for(let _=0;_<2*(S-R)-1;_++){let x=Math.floor(_/2);_%2===0?(d(C[R][x+1]),d(C[R+1][x]),d(C[R][x])):(d(C[R][x+1]),d(C[R+1][x+1]),d(C[R+1][x]))}}function c(T){let E=new O;for(let b=0;b<s.length;b+=3)E.x=s[b+0],E.y=s[b+1],E.z=s[b+2],E.normalize().multiplyScalar(T),s[b+0]=E.x,s[b+1]=E.y,s[b+2]=E.z}function h(){let T=new O;for(let E=0;E<s.length;E+=3){T.x=s[E+0],T.y=s[E+1],T.z=s[E+2];let b=m(T)/2/Math.PI+.5,v=f(T)/Math.PI+.5;o.push(b,1-v)}g(),u()}function u(){for(let T=0;T<o.length;T+=6){let E=o[T+0],b=o[T+2],v=o[T+4],S=Math.max(E,b,v),C=Math.min(E,b,v);S>.9&&C<.1&&(E<.2&&(o[T+0]+=1),b<.2&&(o[T+2]+=1),v<.2&&(o[T+4]+=1))}}function d(T){s.push(T.x,T.y,T.z)}function p(T,E){let b=T*3;E.x=e[b+0],E.y=e[b+1],E.z=e[b+2]}function g(){let T=new O,E=new O,b=new O,v=new O,S=new Ye,C=new Ye,R=new Ye;for(let _=0,x=0;_<s.length;_+=9,x+=6){T.set(s[_+0],s[_+1],s[_+2]),E.set(s[_+3],s[_+4],s[_+5]),b.set(s[_+6],s[_+7],s[_+8]),S.set(o[x+0],o[x+1]),C.set(o[x+2],o[x+3]),R.set(o[x+4],o[x+5]),v.copy(T).add(E).add(b).divideScalar(3);let I=m(v);M(S,x+0,T,I),M(C,x+2,E,I),M(R,x+4,b,I)}}function M(T,E,b,v){v<0&&T.x===1&&(o[E]=T.x-1),b.x===0&&b.z===0&&(o[E]=v/2/Math.PI+.5)}function m(T){return Math.atan2(T.z,-T.x)}function f(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Gr=class i extends to{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Xr=class i extends Sn{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(r),c=a+1,h=l+1,u=e/a,d=t/l,p=[],g=[],M=[],m=[];for(let f=0;f<h;f++){let T=f*d-o;for(let E=0;E<c;E++){let b=E*u-s;g.push(b,-T,0),M.push(0,0,1),m.push(E/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let T=0;T<a;T++){let E=T+c*f,b=T+c*(f+1),v=T+1+c*(f+1),S=T+1+c*f;p.push(E,b,S),p.push(b,v,S)}this.setIndex(p),this.setAttribute("position",new Pt(g,3)),this.setAttribute("normal",new Pt(M,3)),this.setAttribute("uv",new Pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var qr=class i extends Sn{constructor(e=1,t=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);let o=[],a=[],l=[],c=[],h=new O,u=new O,d=new O;for(let p=0;p<=n;p++)for(let g=0;g<=r;g++){let M=g/r*s,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(M),u.y=(e+t*Math.cos(m))*Math.sin(M),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(M),h.y=e*Math.sin(M),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/r),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=r;g++){let M=(r+1)*p+g-1,m=(r+1)*(p-1)+g-1,f=(r+1)*(p-1)+g,T=(r+1)*p+g;o.push(M,m,T),o.push(m,f,T)}this.setIndex(o),this.setAttribute("position",new Pt(a,3)),this.setAttribute("normal",new Pt(l,3)),this.setAttribute("uv",new Pt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Hn=class extends ii{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new $e(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$c,this.normalScale=new Ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Yr=class extends Hn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ke(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new $e(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new $e(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new $e(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var no=class extends ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Yd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},io=class extends ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Hs(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function dm(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Ei=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ro=class extends Ei{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ec,endingEnd:Ec}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case Tc:s=e,a=2*t-n;break;case Cc:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Tc:o=e,l=2*n-t;break;case Cc:o=1,l=n+r[1]-r[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-t)/(r-t),M=g*g,m=M*g,f=-d*m+2*d*M-d*g,T=(1+d)*m+(-1.5-2*d)*M+(-.5+d)*g+1,E=(-1-p)*m+(1.5+p)*M+.5*g,b=p*m-p*M;for(let v=0;v!==a;++v)s[v]=f*o[h+v]+T*o[c+v]+E*o[l+v]+b*o[u+v];return s}},so=class extends Ei{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(r-t),u=1-h;for(let d=0;d!==a;++d)s[d]=o[c+d]*u+o[l+d]*h;return s}},oo=class extends Ei{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},ln=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Hs(t,this.TimeBufferType),this.values=Hs(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Hs(e.times,Array),values:Hs(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new oo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new so(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ro(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ir:t=this.InterpolantFactoryMethodDiscrete;break;case $s:t=this.InterpolantFactoryMethodLinear;break;case Ws:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ir;case this.InterpolantFactoryMethodLinear:return $s;case this.InterpolantFactoryMethodSmooth:return Ws}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&dm(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ws,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(r)l=!0;else{let u=a*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){let M=t[u+g];if(M!==t[d+g]||M!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};ln.prototype.ValueTypeName="";ln.prototype.TimeBufferType=Float32Array;ln.prototype.ValueBufferType=Float32Array;ln.prototype.DefaultInterpolation=$s;var si=class extends ln{constructor(e,t,n){super(e,t,n)}};si.prototype.ValueTypeName="bool";si.prototype.ValueBufferType=Array;si.prototype.DefaultInterpolation=Ir;si.prototype.InterpolantFactoryMethodLinear=void 0;si.prototype.InterpolantFactoryMethodSmooth=void 0;var ao=class extends ln{constructor(e,t,n,r){super(e,t,n,r)}};ao.prototype.ValueTypeName="color";var lo=class extends ln{constructor(e,t,n,r){super(e,t,n,r)}};lo.prototype.ValueTypeName="number";var co=class extends Ei{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(r-t),c=e*a;for(let h=c+a;c!==h;c+=4)on.slerpFlat(s,0,o,c-a,o,c,l);return s}},$r=class extends ln{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new co(this.times,this.values,this.getValueSize(),e)}};$r.prototype.ValueTypeName="quaternion";$r.prototype.InterpolantFactoryMethodSmooth=void 0;var oi=class extends ln{constructor(e,t,n){super(e,t,n)}};oi.prototype.ValueTypeName="string";oi.prototype.ValueBufferType=Array;oi.prototype.DefaultInterpolation=Ir;oi.prototype.InterpolantFactoryMethodLinear=void 0;oi.prototype.InterpolantFactoryMethodSmooth=void 0;var ho=class extends ln{constructor(e,t,n,r){super(e,t,n,r)}};ho.prototype.ValueTypeName="vector";var uo=class{constructor(e,t,n){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},lf=new uo,fo=class{constructor(e){this.manager=e!==void 0?e:lf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};fo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Kr=class extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new $e(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Jr=class extends Kr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $e(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},wc=new xt,fd=new O,pd=new O,Ic=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ye(512,512),this.mapType=Mn,this.map=null,this.mapPass=null,this.matrix=new xt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new or,this._frameExtents=new Ye(1,1),this._viewportCount=1,this._viewports=[new bt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;fd.setFromMatrixPosition(e.matrixWorld),t.position.copy(fd),pd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pd),t.updateMatrixWorld(),wc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(wc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Pc=class extends Ic{constructor(){super(new It(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Mi*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Zr=class extends Kr{constructor(e,t,n=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.distance=n,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new Pc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var po=class extends kr{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,o=n+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var mo=class extends It{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var eh="\\[\\]\\.:\\/",fm=new RegExp("["+eh+"]","g"),th="[^"+eh+"]",pm="[^"+eh.replace("\\.","")+"]",mm=/((?:WC+[\/:])*)/.source.replace("WC",th),gm=/(WCOD+)?/.source.replace("WCOD",pm),ym=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",th),vm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",th),xm=new RegExp("^"+mm+gm+ym+vm+"$"),_m=["material","materials","bones","map"],Lc=class{constructor(e,t,n){let r=n||gt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},gt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(fm,"")}static parseTrackName(e){let t=xm.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);_m.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};gt.Composite=Lc;gt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};gt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};gt.prototype.GetterByBindingType=[gt.prototype._getValue_direct,gt.prototype._getValue_array,gt.prototype._getValue_arrayElement,gt.prototype._getValue_toArray];gt.prototype.SetterByBindingTypeAndVersioning=[[gt.prototype._setValue_direct,gt.prototype._setValue_direct_setNeedsUpdate,gt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_array,gt.prototype._setValue_array_setNeedsUpdate,gt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_arrayElement,gt.prototype._setValue_arrayElement_setNeedsUpdate,gt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_fromArray,gt.prototype._setValue_fromArray_setNeedsUpdate,gt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var vx=new Float32Array(1);var md=new xt,jr=class{constructor(e,t,n=0,r=1/0){this.ray=new Nr(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new rr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return md.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(md),this}intersectObject(e,t=!0,n=[]){return Dc(e,this,n,t),n.sort(gd),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)Dc(e[r],this,n,t);return n.sort(gd),n}};function gd(i,e){return i.distance-e.distance}function Dc(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){let s=i.children;for(let o=0,a=s.length;o<a;o++)Dc(s[o],e,t,!0)}}function nh(i,e,t,n){let r=Sm(n);switch(t){case Gc:return i*e;case qc:return i*e/r.components*r.byteLength;case Io:return i*e/r.components*r.byteLength;case Yc:return i*e*2/r.components*r.byteLength;case Po:return i*e*2/r.components*r.byteLength;case Xc:return i*e*3/r.components*r.byteLength;case pn:return i*e*4/r.components*r.byteLength;case Lo:return i*e*4/r.components*r.byteLength;case ns:case is:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case rs:case ss:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fo:case Oo:return Math.max(i,16)*Math.max(e,8)/4;case Do:case No:return Math.max(i,8)*Math.max(e,8)/2;case Uo:case ko:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Vo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ho:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Wo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Go:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case qo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case $o:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ko:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Jo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Zo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case jo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Qo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ea:case ta:case na:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ia:case ra:return Math.ceil(i/4)*Math.ceil(e/4)*8;case sa:case oa:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Sm(i){switch(i){case Mn:case Vc:return{byteLength:1,components:1};case ar:case zc:case lr:return{byteLength:2,components:1};case Ao:case Ro:return{byteLength:2,components:4};case li:case Co:case An:return{byteLength:4,components:1};case Hc:case Wc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Lf(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Mm(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],M=u[p];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++d,u[d]=M)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let M=u[p];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var wm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Em=`#ifdef USE_ALPHAHASH
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
#endif`,Tm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Cm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Am=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Im=`#ifdef USE_AOMAP
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
#endif`,Pm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lm=`#ifdef USE_BATCHING
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
#endif`,Dm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Fm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Nm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Om=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Um=`#ifdef USE_IRIDESCENCE
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
#endif`,km=`#ifdef USE_BUMPMAP
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
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Wm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,qm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ym=`#define PI 3.141592653589793
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
} // validated`,$m=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Km=`vec3 transformedNormal = objectNormal;
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
#endif`,Jm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,eg="gl_FragColor = linearToOutputTexel( gl_FragColor );",tg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ng=`#ifdef USE_ENVMAP
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
#endif`,ig=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,rg=`#ifdef USE_ENVMAP
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
#endif`,sg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,og=`#ifdef USE_ENVMAP
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
#endif`,ag=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,lg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ug=`#ifdef USE_GRADIENTMAP
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
}`,dg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mg=`uniform bool receiveShadow;
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
#endif`,gg=`#ifdef USE_ENVMAP
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
#endif`,yg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_g=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Sg=`PhysicalMaterial material;
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
#endif`,bg=`struct PhysicalMaterial {
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
}`,Mg=`
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
#endif`,wg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Eg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Cg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ag=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ig=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Dg=`#if defined( USE_POINTS_UV )
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
#endif`,Fg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ng=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Og=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ug=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bg=`#ifdef USE_MORPHTARGETS
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
#endif`,Vg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Hg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Wg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,qg=`#ifdef USE_NORMALMAP
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
#endif`,Yg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$g=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Qg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ey=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ty=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ny=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,iy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ry=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,oy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ay=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ly=`float getShadowMask() {
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
}`,cy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hy=`#ifdef USE_SKINNING
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
#endif`,uy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dy=`#ifdef USE_SKINNING
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
#endif`,fy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,py=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,my=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gy=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,yy=`#ifdef USE_TRANSMISSION
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
#endif`,vy=`#ifdef USE_TRANSMISSION
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
#endif`,xy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_y=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,by=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,My=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wy=`uniform sampler2D t2D;
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
}`,Ey=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ty=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Cy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ay=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ry=`#include <common>
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
}`,Iy=`#if DEPTH_PACKING == 3200
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
}`,Py=`#define DISTANCE
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
}`,Ly=`#define DISTANCE
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
}`,Dy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ny=`uniform float scale;
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
}`,Oy=`uniform vec3 diffuse;
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
}`,Uy=`#include <common>
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
}`,ky=`uniform vec3 diffuse;
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
}`,By=`#define LAMBERT
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
}`,Vy=`#define LAMBERT
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
}`,zy=`#define MATCAP
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
}`,Hy=`#define MATCAP
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
}`,Wy=`#define NORMAL
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
}`,Gy=`#define NORMAL
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
}`,Xy=`#define PHONG
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
}`,qy=`#define PHONG
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
}`,Yy=`#define STANDARD
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
}`,$y=`#define STANDARD
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
}`,Ky=`#define TOON
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
}`,Jy=`#define TOON
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
}`,Zy=`uniform float size;
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
}`,jy=`uniform vec3 diffuse;
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
}`,Qy=`#include <common>
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
}`,e0=`uniform vec3 color;
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
}`,t0=`uniform float rotation;
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
}`,n0=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:wm,alphahash_pars_fragment:Em,alphamap_fragment:Tm,alphamap_pars_fragment:Cm,alphatest_fragment:Am,alphatest_pars_fragment:Rm,aomap_fragment:Im,aomap_pars_fragment:Pm,batching_pars_vertex:Lm,batching_vertex:Dm,begin_vertex:Fm,beginnormal_vertex:Nm,bsdfs:Om,iridescence_fragment:Um,bumpmap_pars_fragment:km,clipping_planes_fragment:Bm,clipping_planes_pars_fragment:Vm,clipping_planes_pars_vertex:zm,clipping_planes_vertex:Hm,color_fragment:Wm,color_pars_fragment:Gm,color_pars_vertex:Xm,color_vertex:qm,common:Ym,cube_uv_reflection_fragment:$m,defaultnormal_vertex:Km,displacementmap_pars_vertex:Jm,displacementmap_vertex:Zm,emissivemap_fragment:jm,emissivemap_pars_fragment:Qm,colorspace_fragment:eg,colorspace_pars_fragment:tg,envmap_fragment:ng,envmap_common_pars_fragment:ig,envmap_pars_fragment:rg,envmap_pars_vertex:sg,envmap_physical_pars_fragment:gg,envmap_vertex:og,fog_vertex:ag,fog_pars_vertex:lg,fog_fragment:cg,fog_pars_fragment:hg,gradientmap_pars_fragment:ug,lightmap_pars_fragment:dg,lights_lambert_fragment:fg,lights_lambert_pars_fragment:pg,lights_pars_begin:mg,lights_toon_fragment:yg,lights_toon_pars_fragment:vg,lights_phong_fragment:xg,lights_phong_pars_fragment:_g,lights_physical_fragment:Sg,lights_physical_pars_fragment:bg,lights_fragment_begin:Mg,lights_fragment_maps:wg,lights_fragment_end:Eg,logdepthbuf_fragment:Tg,logdepthbuf_pars_fragment:Cg,logdepthbuf_pars_vertex:Ag,logdepthbuf_vertex:Rg,map_fragment:Ig,map_pars_fragment:Pg,map_particle_fragment:Lg,map_particle_pars_fragment:Dg,metalnessmap_fragment:Fg,metalnessmap_pars_fragment:Ng,morphinstance_vertex:Og,morphcolor_vertex:Ug,morphnormal_vertex:kg,morphtarget_pars_vertex:Bg,morphtarget_vertex:Vg,normal_fragment_begin:zg,normal_fragment_maps:Hg,normal_pars_fragment:Wg,normal_pars_vertex:Gg,normal_vertex:Xg,normalmap_pars_fragment:qg,clearcoat_normal_fragment_begin:Yg,clearcoat_normal_fragment_maps:$g,clearcoat_pars_fragment:Kg,iridescence_pars_fragment:Jg,opaque_fragment:Zg,packing:jg,premultiplied_alpha_fragment:Qg,project_vertex:ey,dithering_fragment:ty,dithering_pars_fragment:ny,roughnessmap_fragment:iy,roughnessmap_pars_fragment:ry,shadowmap_pars_fragment:sy,shadowmap_pars_vertex:oy,shadowmap_vertex:ay,shadowmask_pars_fragment:ly,skinbase_vertex:cy,skinning_pars_vertex:hy,skinning_vertex:uy,skinnormal_vertex:dy,specularmap_fragment:fy,specularmap_pars_fragment:py,tonemapping_fragment:my,tonemapping_pars_fragment:gy,transmission_fragment:yy,transmission_pars_fragment:vy,uv_pars_fragment:xy,uv_pars_vertex:_y,uv_vertex:Sy,worldpos_vertex:by,background_vert:My,background_frag:wy,backgroundCube_vert:Ey,backgroundCube_frag:Ty,cube_vert:Cy,cube_frag:Ay,depth_vert:Ry,depth_frag:Iy,distanceRGBA_vert:Py,distanceRGBA_frag:Ly,equirect_vert:Dy,equirect_frag:Fy,linedashed_vert:Ny,linedashed_frag:Oy,meshbasic_vert:Uy,meshbasic_frag:ky,meshlambert_vert:By,meshlambert_frag:Vy,meshmatcap_vert:zy,meshmatcap_frag:Hy,meshnormal_vert:Wy,meshnormal_frag:Gy,meshphong_vert:Xy,meshphong_frag:qy,meshphysical_vert:Yy,meshphysical_frag:$y,meshtoon_vert:Ky,meshtoon_frag:Jy,points_vert:Zy,points_frag:jy,shadow_vert:Qy,shadow_frag:e0,sprite_vert:t0,sprite_frag:n0},me={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},Rn={basic:{uniforms:Ht([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Ht([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new $e(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Ht([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Ht([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Ht([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new $e(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Ht([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Ht([me.points,me.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Ht([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Ht([me.common,me.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Ht([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Ht([me.sprite,me.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Ht([me.common,me.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Ht([me.lights,me.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};Rn.physical={uniforms:Ht([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var aa={r:0,b:0,g:0},Ri=new _n,i0=new xt;function r0(i,e,t,n,r,s,o){let a=new $e(0),l=s===!0?0:1,c,h,u=null,d=0,p=null;function g(E){let b=E.isScene===!0?E.background:null;return b&&b.isTexture&&(b=(E.backgroundBlurriness>0?t:e).get(b)),b}function M(E){let b=!1,v=g(E);v===null?f(a,l):v&&v.isColor&&(f(v,1),b=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,b){let v=g(b);v&&(v.isCubeTexture||v.mapping===es)?(h===void 0&&(h=new Ut(new ri(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Ai(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Ri.copy(b.backgroundRotation),Ri.x*=-1,Ri.y*=-1,Ri.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ri.y*=-1,Ri.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(i0.makeRotationFromEuler(Ri)),h.material.toneMapped=tt.getTransfer(v.colorSpace)!==lt,(u!==v||d!==v.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,p=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Ut(new Xr(2,2),new bn({name:"BackgroundMaterial",uniforms:Ai(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=tt.getTransfer(v.colorSpace)!==lt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,p=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function f(E,b){E.getRGB(aa,Qc(i)),n.buffers.color.setClear(aa.r,aa.g,aa.b,b,o)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,b=1){a.set(E),l=b,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,f(a,l)},render:M,addToRenderList:m,dispose:T}}function s0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null),s=r,o=!1;function a(x,I,D,V,W){let Z=!1,K=u(V,D,I);s!==K&&(s=K,c(s.object)),Z=p(x,V,D,W),Z&&g(x,V,D,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,b(x,I,D,V),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function u(x,I,D){let V=D.wireframe===!0,W=n[x.id];W===void 0&&(W={},n[x.id]=W);let Z=W[I.id];Z===void 0&&(Z={},W[I.id]=Z);let K=Z[V];return K===void 0&&(K=d(l()),Z[V]=K),K}function d(x){let I=[],D=[],V=[];for(let W=0;W<t;W++)I[W]=0,D[W]=0,V[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:D,attributeDivisors:V,object:x,attributes:{},index:null}}function p(x,I,D,V){let W=s.attributes,Z=I.attributes,K=0,te=D.getAttributes();for(let z in te)if(te[z].location>=0){let de=W[z],Ee=Z[z];if(Ee===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(Ee=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(Ee=x.instanceColor)),de===void 0||de.attribute!==Ee||Ee&&de.data!==Ee.data)return!0;K++}return s.attributesNum!==K||s.index!==V}function g(x,I,D,V){let W={},Z=I.attributes,K=0,te=D.getAttributes();for(let z in te)if(te[z].location>=0){let de=Z[z];de===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(de=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(de=x.instanceColor));let Ee={};Ee.attribute=de,de&&de.data&&(Ee.data=de.data),W[z]=Ee,K++}s.attributes=W,s.attributesNum=K,s.index=V}function M(){let x=s.newAttributes;for(let I=0,D=x.length;I<D;I++)x[I]=0}function m(x){f(x,0)}function f(x,I){let D=s.newAttributes,V=s.enabledAttributes,W=s.attributeDivisors;D[x]=1,V[x]===0&&(i.enableVertexAttribArray(x),V[x]=1),W[x]!==I&&(i.vertexAttribDivisor(x,I),W[x]=I)}function T(){let x=s.newAttributes,I=s.enabledAttributes;for(let D=0,V=I.length;D<V;D++)I[D]!==x[D]&&(i.disableVertexAttribArray(D),I[D]=0)}function E(x,I,D,V,W,Z,K){K===!0?i.vertexAttribIPointer(x,I,D,W,Z):i.vertexAttribPointer(x,I,D,V,W,Z)}function b(x,I,D,V){M();let W=V.attributes,Z=D.getAttributes(),K=I.defaultAttributeValues;for(let te in Z){let z=Z[te];if(z.location>=0){let oe=W[te];if(oe===void 0&&(te==="instanceMatrix"&&x.instanceMatrix&&(oe=x.instanceMatrix),te==="instanceColor"&&x.instanceColor&&(oe=x.instanceColor)),oe!==void 0){let de=oe.normalized,Ee=oe.itemSize,Be=e.get(oe);if(Be===void 0)continue;let at=Be.buffer,rt=Be.type,et=Be.bytesPerElement,q=rt===i.INT||rt===i.UNSIGNED_INT||oe.gpuType===Co;if(oe.isInterleavedBufferAttribute){let ne=oe.data,Se=ne.stride,Fe=oe.offset;if(ne.isInstancedInterleavedBuffer){for(let Ae=0;Ae<z.locationSize;Ae++)f(z.location+Ae,ne.meshPerAttribute);x.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ae=0;Ae<z.locationSize;Ae++)m(z.location+Ae);i.bindBuffer(i.ARRAY_BUFFER,at);for(let Ae=0;Ae<z.locationSize;Ae++)E(z.location+Ae,Ee/z.locationSize,rt,de,Se*et,(Fe+Ee/z.locationSize*Ae)*et,q)}else{if(oe.isInstancedBufferAttribute){for(let ne=0;ne<z.locationSize;ne++)f(z.location+ne,oe.meshPerAttribute);x.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let ne=0;ne<z.locationSize;ne++)m(z.location+ne);i.bindBuffer(i.ARRAY_BUFFER,at);for(let ne=0;ne<z.locationSize;ne++)E(z.location+ne,Ee/z.locationSize,rt,de,Ee*et,Ee/z.locationSize*ne*et,q)}}else if(K!==void 0){let de=K[te];if(de!==void 0)switch(de.length){case 2:i.vertexAttrib2fv(z.location,de);break;case 3:i.vertexAttrib3fv(z.location,de);break;case 4:i.vertexAttrib4fv(z.location,de);break;default:i.vertexAttrib1fv(z.location,de)}}}}T()}function v(){R();for(let x in n){let I=n[x];for(let D in I){let V=I[D];for(let W in V)h(V[W].object),delete V[W];delete I[D]}delete n[x]}}function S(x){if(n[x.id]===void 0)return;let I=n[x.id];for(let D in I){let V=I[D];for(let W in V)h(V[W].object),delete V[W];delete I[D]}delete n[x.id]}function C(x){for(let I in n){let D=n[I];if(D[x.id]===void 0)continue;let V=D[x.id];for(let W in V)h(V[W].object),delete V[W];delete D[x.id]}}function R(){_(),o=!0,s!==r&&(s=r,c(s.object))}function _(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:R,resetDefaultState:_,dispose:v,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:m,disableUnusedAttributes:T}}function o0(i,e,t){let n;function r(c){n=c}function s(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,n,1)}function l(c,h,u,d){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let M=0;M<u;M++)g+=h[M]*d[M];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function a0(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==pn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let R=C===lr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Mn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==An&&!R)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:T,maxVaryings:E,maxFragmentUniforms:b,vertexTextures:v,maxSamples:S}}function l0(i){let e=this,t=null,n=0,r=!1,s=!1,o=new Zt,a=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||r;return r=d,n=u.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,M=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?h(null):c();else{let T=s?0:n,E=T*4,b=f.clippingState||null;l.value=b,b=h(g,d,E,p);for(let v=0;v!==E;++v)b[v]=t[v];f.clippingState=b,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,g){let M=u!==null?u.length:0,m=null;if(M!==0){if(m=l.value,g!==!0||m===null){let f=p+M*4,T=d.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<f)&&(m=new Float32Array(f));for(let E=0,b=p;E!==M;++E,b+=4)o.copy(u[E]).applyMatrix4(T,a),o.normal.toArray(m,b),m[b+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,m}}function c0(i){let e=new WeakMap;function t(o,a){return a===wo?o.mapping=Ti:a===Eo&&(o.mapping=Ci),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===wo||a===Eo)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Qs(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){let a=o.target;a.removeEventListener("dispose",r);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}var fr=4,cf=[.125,.215,.35,.446,.526,.582],Li=20,ih=new po,hf=new $e,rh=null,sh=0,oh=0,ah=!1,Pi=(1+Math.sqrt(5))/2,dr=1/Pi,uf=[new O(-Pi,dr,0),new O(Pi,dr,0),new O(-dr,0,Pi),new O(dr,0,Pi),new O(0,Pi,-dr),new O(0,Pi,dr),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],h0=new O,ha=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100,s={}){let{size:o=256,position:a=h0}=s;rh=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),oh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ff(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(rh,sh,oh),this._renderer.xr.enabled=ah,e.scissorTest=!1,la(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ti||e.mapping===Ci?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),rh=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),oh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:xn,minFilter:xn,generateMipmaps:!1,type:lr,format:pn,colorSpace:bi,depthBuffer:!1},r=df(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=df(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=u0(s)),this._blurMaterial=d0(s,e,t)}return r}_compileMaterial(e){let t=new Ut(this._lodPlanes[0],e);this._renderer.compile(t,ih)}_sceneToCubeUV(e,t,n,r,s){let l=new It(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(hf),u.toneMapping=Gn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));let M=new wi({name:"PMREM.Background",side:Yt,depthWrite:!1,depthTest:!1}),m=new Ut(new ri,M),f=!1,T=e.background;T?T.isColor&&(M.color.copy(T),e.background=null,f=!0):(M.color.copy(hf),f=!0);for(let E=0;E<6;E++){let b=E%3;b===0?(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[E],s.y,s.z)):b===1?(l.up.set(0,0,c[E]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[E],s.z)):(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[E]));let v=this._cubeSize;la(r,b*v,E>2?v:0,v,v),u.setRenderTarget(r),f&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,e.background=T}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===Ti||e.mapping===Ci;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=pf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ff());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new Ut(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;la(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,ih)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=uf[(r-s-1)%uf.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,r,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Ut(this._lodPlanes[r],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Li-1),M=s/g,m=isFinite(s)?1+Math.floor(h*M):Li;m>Li&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Li}`);let f=[],T=0;for(let C=0;C<Li;++C){let R=C/M,_=Math.exp(-R*R/2);f.push(_),C===0?T+=_:C<m&&(T+=2*_)}for(let C=0;C<f.length;C++)f[C]=f[C]/T;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;let b=this._sizeLods[r],v=3*b*(r>E-fr?r-E+fr:0),S=4*(this._cubeSize-b);la(t,v,S,3*b,2*b),l.setRenderTarget(t),l.render(u,ih)}};function u0(i){let e=[],t=[],n=[],r=i,s=i-fr+1+cf.length;for(let o=0;o<s;o++){let a=Math.pow(2,r);t.push(a);let l=1/a;o>i-fr?l=cf[o-i+fr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,M=3,m=2,f=1,T=new Float32Array(M*g*p),E=new Float32Array(m*g*p),b=new Float32Array(f*g*p);for(let S=0;S<p;S++){let C=S%3*2/3-1,R=S>2?0:-1,_=[C,R,0,C+2/3,R,0,C+2/3,R+1,0,C,R,0,C+2/3,R+1,0,C,R+1,0];T.set(_,M*g*S),E.set(d,m*g*S);let x=[S,S,S,S,S,S];b.set(x,f*g*S)}let v=new Sn;v.setAttribute("position",new sn(T,M)),v.setAttribute("uv",new sn(E,m)),v.setAttribute("faceIndex",new sn(b,f)),e.push(v),r>fr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function df(i,e,t){let n=new Tn(i,e,t);return n.texture.mapping=es,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function la(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function d0(i,e,t){let n=new Float32Array(Li),r=new O(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:Li,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:yh(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function ff(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yh(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function pf(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function yh(){return`

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
	`}function f0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===wo||l===Eo,h=l===Ti||l===Ci;if(c||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new ha(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&r(p)?(t===null&&(t=new ha(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function r(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){let l=a.target;l.removeEventListener("dispose",s);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function p0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&tr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function m0(i,e,t,n){let r={},s=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];let p=s.get(d);p&&(e.remove(p),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let p in d)e.update(d[p],i.ARRAY_BUFFER)}function c(u){let d=[],p=u.index,g=u.attributes.position,M=0;if(p!==null){let T=p.array;M=p.version;for(let E=0,b=T.length;E<b;E+=3){let v=T[E+0],S=T[E+1],C=T[E+2];d.push(v,S,S,C,C,v)}}else if(g!==void 0){let T=g.array;M=g.version;for(let E=0,b=T.length/3-1;E<b;E+=3){let v=E+0,S=E+1,C=E+2;d.push(v,S,S,C,C,v)}}else return;let m=new(jc(d)?Ur:Or)(d,1);m.version=M;let f=s.get(u);f&&e.remove(f),s.set(u,m)}function h(u){let d=s.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function g0(i,e,t){let n;function r(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,s,d*o),t.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,s,d*o,g),t.update(p,n,g))}function h(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function u(d,p,g,M){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],M[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,d,0,M,0,g);let f=0;for(let T=0;T<g;T++)f+=p[T]*M[T];t.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function y0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(s/3);break;case i.LINES:t.lines+=a*(s/2);break;case i.LINE_STRIP:t.lines+=a*(s-1);break;case i.LINE_LOOP:t.lines+=a*s;break;case i.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function v0(i,e,t){let n=new WeakMap,r=new bt;function s(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let _=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",_)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,M=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],T=a.morphAttributes.color||[],E=0;p===!0&&(E=1),g===!0&&(E=2),M===!0&&(E=3);let b=a.attributes.position.count*E,v=1;b>e.maxTextureSize&&(v=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let S=new Float32Array(b*v*4*u),C=new Fr(S,b,v,u);C.type=An,C.needsUpdate=!0;let R=E*4;for(let x=0;x<u;x++){let I=m[x],D=f[x],V=T[x],W=b*v*4*x;for(let Z=0;Z<I.count;Z++){let K=Z*R;p===!0&&(r.fromBufferAttribute(I,Z),S[W+K+0]=r.x,S[W+K+1]=r.y,S[W+K+2]=r.z,S[W+K+3]=0),g===!0&&(r.fromBufferAttribute(D,Z),S[W+K+4]=r.x,S[W+K+5]=r.y,S[W+K+6]=r.z,S[W+K+7]=0),M===!0&&(r.fromBufferAttribute(V,Z),S[W+K+8]=r.x,S[W+K+9]=r.y,S[W+K+10]=r.z,S[W+K+11]=V.itemSize===4?r.w:1)}}d={count:u,texture:C,size:new Ye(b,v)},n.set(a,d),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let M=0;M<c.length;M++)p+=c[M];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function x0(i,e,t,n){let r=new WeakMap;function s(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(r.get(u)!==c&&(e.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return u}function o(){r=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}var Df=new an,mf=new zr(1,1),Ff=new Fr,Nf=new Zs,Of=new Br,gf=[],yf=[],vf=new Float32Array(16),xf=new Float32Array(9),_f=new Float32Array(4);function mr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=gf[r];if(s===void 0&&(s=new Float32Array(r),gf[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function Lt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Dt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function da(i,e){let t=yf[e];t===void 0&&(t=new Int32Array(e),yf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function _0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function S0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2fv(this.addr,e),Dt(t,e)}}function b0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;i.uniform3fv(this.addr,e),Dt(t,e)}}function M0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4fv(this.addr,e),Dt(t,e)}}function w0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;_f.set(n),i.uniformMatrix2fv(this.addr,!1,_f),Dt(t,n)}}function E0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;xf.set(n),i.uniformMatrix3fv(this.addr,!1,xf),Dt(t,n)}}function T0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;vf.set(n),i.uniformMatrix4fv(this.addr,!1,vf),Dt(t,n)}}function C0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function A0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2iv(this.addr,e),Dt(t,e)}}function R0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3iv(this.addr,e),Dt(t,e)}}function I0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4iv(this.addr,e),Dt(t,e)}}function P0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function L0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2uiv(this.addr,e),Dt(t,e)}}function D0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3uiv(this.addr,e),Dt(t,e)}}function F0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4uiv(this.addr,e),Dt(t,e)}}function N0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(mf.compareFunction=Kc,s=mf):s=Df,t.setTexture2D(e||s,r)}function O0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Nf,r)}function U0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Of,r)}function k0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Ff,r)}function B0(i){switch(i){case 5126:return _0;case 35664:return S0;case 35665:return b0;case 35666:return M0;case 35674:return w0;case 35675:return E0;case 35676:return T0;case 5124:case 35670:return C0;case 35667:case 35671:return A0;case 35668:case 35672:return R0;case 35669:case 35673:return I0;case 5125:return P0;case 36294:return L0;case 36295:return D0;case 36296:return F0;case 35678:case 36198:case 36298:case 36306:case 35682:return N0;case 35679:case 36299:case 36307:return O0;case 35680:case 36300:case 36308:case 36293:return U0;case 36289:case 36303:case 36311:case 36292:return k0}}function V0(i,e){i.uniform1fv(this.addr,e)}function z0(i,e){let t=mr(e,this.size,2);i.uniform2fv(this.addr,t)}function H0(i,e){let t=mr(e,this.size,3);i.uniform3fv(this.addr,t)}function W0(i,e){let t=mr(e,this.size,4);i.uniform4fv(this.addr,t)}function G0(i,e){let t=mr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function X0(i,e){let t=mr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function q0(i,e){let t=mr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Y0(i,e){i.uniform1iv(this.addr,e)}function $0(i,e){i.uniform2iv(this.addr,e)}function K0(i,e){i.uniform3iv(this.addr,e)}function J0(i,e){i.uniform4iv(this.addr,e)}function Z0(i,e){i.uniform1uiv(this.addr,e)}function j0(i,e){i.uniform2uiv(this.addr,e)}function Q0(i,e){i.uniform3uiv(this.addr,e)}function ev(i,e){i.uniform4uiv(this.addr,e)}function tv(i,e,t){let n=this.cache,r=e.length,s=da(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Df,s[o])}function nv(i,e,t){let n=this.cache,r=e.length,s=da(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Nf,s[o])}function iv(i,e,t){let n=this.cache,r=e.length,s=da(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Of,s[o])}function rv(i,e,t){let n=this.cache,r=e.length,s=da(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Ff,s[o])}function sv(i){switch(i){case 5126:return V0;case 35664:return z0;case 35665:return H0;case 35666:return W0;case 35674:return G0;case 35675:return X0;case 35676:return q0;case 5124:case 35670:return Y0;case 35667:case 35671:return $0;case 35668:case 35672:return K0;case 35669:case 35673:return J0;case 5125:return Z0;case 36294:return j0;case 36295:return Q0;case 36296:return ev;case 35678:case 36198:case 36298:case 36306:case 35682:return tv;case 35679:case 36299:case 36307:return nv;case 35680:case 36300:case 36308:case 36293:return iv;case 36289:case 36303:case 36311:case 36292:return rv}}var ch=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=B0(t.type)}},hh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=sv(t.type)}},uh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],n)}}},lh=/(\w+)(\])?(\[|\.)?/g;function Sf(i,e){i.seq.push(e),i.map[e.id]=e}function ov(i,e,t){let n=i.name,r=n.length;for(lh.lastIndex=0;;){let s=lh.exec(n),o=lh.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Sf(t,c===void 0?new ch(a,i,e):new hh(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new uh(a),Sf(t,u)),t=u}}}var pr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);ov(s,o,this)}}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&n.push(o)}return n}};function bf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var av=37297,lv=0;function cv(i,e){let t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Mf=new We;function hv(i){tt._getMatrix(Mf,tt.workingColorSpace,i);let e=`mat3( ${Mf.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case Pr:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function wf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+cv(i.getShaderSource(e),a)}else return s}function uv(i,e){let t=hv(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function dv(i,e){let t;switch(e){case Vd:t="Linear";break;case zd:t="Reinhard";break;case Hd:t="Cineon";break;case Mo:t="ACESFilmic";break;case Gd:t="AgX";break;case Xd:t="Neutral";break;case Wd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ca=new O;function fv(){tt.getLuminanceCoefficients(ca);let i=ca.x.toFixed(4),e=ca.y.toFixed(4),t=ca.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function pv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(os).join(`
`)}function mv(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function gv(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(e,r),o=s.name,a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function os(i){return i!==""}function Ef(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Tf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var yv=/^[ \t]*#include +<([\w\d./]+)>/gm;function dh(i){return i.replace(yv,xv)}var vv=new Map;function xv(i,e){let t=Xe[e];if(t===void 0){let n=vv.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return dh(t)}var _v=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Cf(i){return i.replace(_v,Sv)}function Sv(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Af(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function bv(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Nc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===xd?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Cn&&(e="SHADOWMAP_TYPE_VSM"),e}function Mv(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ti:case Ci:e="ENVMAP_TYPE_CUBE";break;case es:e="ENVMAP_TYPE_CUBE_UV";break}return e}function wv(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ci:e="ENVMAP_MODE_REFRACTION";break}return e}function Ev(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case kc:e="ENVMAP_BLENDING_MULTIPLY";break;case kd:e="ENVMAP_BLENDING_MIX";break;case Bd:e="ENVMAP_BLENDING_ADD";break}return e}function Tv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Cv(i,e,t,n){let r=i.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=bv(t),c=Mv(t),h=wv(t),u=Ev(t),d=Tv(t),p=pv(t),g=mv(s),M=r.createProgram(),m,f,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(os).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(os).join(`
`),f.length>0&&(f+=`
`)):(m=[Af(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(os).join(`
`),f=[Af(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gn?"#define TONE_MAPPING":"",t.toneMapping!==Gn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Gn?dv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,uv("linearToOutputTexel",t.outputColorSpace),fv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(os).join(`
`)),o=dh(o),o=Ef(o,t),o=Tf(o,t),a=dh(a),a=Ef(a,t),a=Tf(a,t),o=Cf(o),a=Cf(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Jc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Jc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let E=T+m+o,b=T+f+a,v=bf(r,r.VERTEX_SHADER,E),S=bf(r,r.FRAGMENT_SHADER,b);r.attachShader(M,v),r.attachShader(M,S),t.index0AttributeName!==void 0?r.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function C(I){if(i.debug.checkShaderErrors){let D=r.getProgramInfoLog(M)||"",V=r.getShaderInfoLog(v)||"",W=r.getShaderInfoLog(S)||"",Z=D.trim(),K=V.trim(),te=W.trim(),z=!0,oe=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,M,v,S);else{let de=wf(r,v,"vertex"),Ee=wf(r,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+Z+`
`+de+`
`+Ee)}else Z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Z):(K===""||te==="")&&(oe=!1);oe&&(I.diagnostics={runnable:z,programLog:Z,vertexShader:{log:K,prefix:m},fragmentShader:{log:te,prefix:f}})}r.deleteShader(v),r.deleteShader(S),R=new pr(r,M),_=gv(r,M)}let R;this.getUniforms=function(){return R===void 0&&C(this),R};let _;this.getAttributes=function(){return _===void 0&&C(this),_};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(M,av)),x},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=lv++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=v,this.fragmentShader=S,this}var Av=0,fh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ph(e),t.set(e,n)),n}},ph=class{constructor(e){this.id=Av++,this.code=e,this.usedTimes=0}};function Rv(i,e,t,n,r,s,o){let a=new rr,l=new fh,c=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures,p=r.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(_){return c.add(_),_===0?"uv":`uv${_}`}function m(_,x,I,D,V){let W=D.fog,Z=V.geometry,K=_.isMeshStandardMaterial?D.environment:null,te=(_.isMeshStandardMaterial?t:e).get(_.envMap||K),z=te&&te.mapping===es?te.image.height:null,oe=g[_.type];_.precision!==null&&(p=r.getMaxPrecision(_.precision),p!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",p,"instead."));let de=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Ee=de!==void 0?de.length:0,Be=0;Z.morphAttributes.position!==void 0&&(Be=1),Z.morphAttributes.normal!==void 0&&(Be=2),Z.morphAttributes.color!==void 0&&(Be=3);let at,rt,et,q;if(oe){let ot=Rn[oe];at=ot.vertexShader,rt=ot.fragmentShader}else at=_.vertexShader,rt=_.fragmentShader,l.update(_),et=l.getVertexShaderID(_),q=l.getFragmentShaderID(_);let ne=i.getRenderTarget(),Se=i.state.buffers.depth.getReversed(),Fe=V.isInstancedMesh===!0,Ae=V.isBatchedMesh===!0,qe=!!_.map,Ct=!!_.matcap,P=!!te,it=!!_.aoMap,H=!!_.lightMap,ie=!!_.bumpMap,pe=!!_.normalMap,st=!!_.displacementMap,Me=!!_.emissiveMap,He=!!_.metalnessMap,Et=!!_.roughnessMap,vt=_.anisotropy>0,A=_.clearcoat>0,y=_.dispersion>0,U=_.iridescence>0,Y=_.sheen>0,ee=_.transmission>0,J=vt&&!!_.anisotropyMap,Re=A&&!!_.clearcoatMap,ue=A&&!!_.clearcoatNormalMap,Ie=A&&!!_.clearcoatRoughnessMap,Pe=U&&!!_.iridescenceMap,ce=U&&!!_.iridescenceThicknessMap,ve=Y&&!!_.sheenColorMap,Ue=Y&&!!_.sheenRoughnessMap,Le=!!_.specularMap,ge=!!_.specularColorMap,Ge=!!_.specularIntensityMap,F=ee&&!!_.transmissionMap,he=ee&&!!_.thicknessMap,fe=!!_.gradientMap,we=!!_.alphaMap,ae=_.alphaTest>0,Q=!!_.alphaHash,Ce=!!_.extensions,ze=Gn;_.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(ze=i.toneMapping);let ft={shaderID:oe,shaderType:_.type,shaderName:_.name,vertexShader:at,fragmentShader:rt,defines:_.defines,customVertexShaderID:et,customFragmentShaderID:q,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:p,batching:Ae,batchingColor:Ae&&V._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&V.instanceColor!==null,instancingMorph:Fe&&V.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:bi,alphaToCoverage:!!_.alphaToCoverage,map:qe,matcap:Ct,envMap:P,envMapMode:P&&te.mapping,envMapCubeUVHeight:z,aoMap:it,lightMap:H,bumpMap:ie,normalMap:pe,displacementMap:d&&st,emissiveMap:Me,normalMapObjectSpace:pe&&_.normalMapType===Kd,normalMapTangentSpace:pe&&_.normalMapType===$c,metalnessMap:He,roughnessMap:Et,anisotropy:vt,anisotropyMap:J,clearcoat:A,clearcoatMap:Re,clearcoatNormalMap:ue,clearcoatRoughnessMap:Ie,dispersion:y,iridescence:U,iridescenceMap:Pe,iridescenceThicknessMap:ce,sheen:Y,sheenColorMap:ve,sheenRoughnessMap:Ue,specularMap:Le,specularColorMap:ge,specularIntensityMap:Ge,transmission:ee,transmissionMap:F,thicknessMap:he,gradientMap:fe,opaque:_.transparent===!1&&_.blending===_i&&_.alphaToCoverage===!1,alphaMap:we,alphaTest:ae,alphaHash:Q,combine:_.combine,mapUv:qe&&M(_.map.channel),aoMapUv:it&&M(_.aoMap.channel),lightMapUv:H&&M(_.lightMap.channel),bumpMapUv:ie&&M(_.bumpMap.channel),normalMapUv:pe&&M(_.normalMap.channel),displacementMapUv:st&&M(_.displacementMap.channel),emissiveMapUv:Me&&M(_.emissiveMap.channel),metalnessMapUv:He&&M(_.metalnessMap.channel),roughnessMapUv:Et&&M(_.roughnessMap.channel),anisotropyMapUv:J&&M(_.anisotropyMap.channel),clearcoatMapUv:Re&&M(_.clearcoatMap.channel),clearcoatNormalMapUv:ue&&M(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&M(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Pe&&M(_.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&M(_.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&M(_.sheenColorMap.channel),sheenRoughnessMapUv:Ue&&M(_.sheenRoughnessMap.channel),specularMapUv:Le&&M(_.specularMap.channel),specularColorMapUv:ge&&M(_.specularColorMap.channel),specularIntensityMapUv:Ge&&M(_.specularIntensityMap.channel),transmissionMapUv:F&&M(_.transmissionMap.channel),thicknessMapUv:he&&M(_.thicknessMap.channel),alphaMapUv:we&&M(_.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(pe||vt),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!Z.attributes.uv&&(qe||we),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:V.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:Be,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:ze,decodeVideoTexture:qe&&_.map.isVideoTexture===!0&&tt.getTransfer(_.map.colorSpace)===lt,decodeVideoTextureEmissive:Me&&_.emissiveMap.isVideoTexture===!0&&tt.getTransfer(_.emissiveMap.colorSpace)===lt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===cn,flipSided:_.side===Yt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ce&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ce&&_.extensions.multiDraw===!0||Ae)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return ft.vertexUv1s=c.has(1),ft.vertexUv2s=c.has(2),ft.vertexUv3s=c.has(3),c.clear(),ft}function f(_){let x=[];if(_.shaderID?x.push(_.shaderID):(x.push(_.customVertexShaderID),x.push(_.customFragmentShaderID)),_.defines!==void 0)for(let I in _.defines)x.push(I),x.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(T(x,_),E(x,_),x.push(i.outputColorSpace)),x.push(_.customProgramCacheKey),x.join()}function T(_,x){_.push(x.precision),_.push(x.outputColorSpace),_.push(x.envMapMode),_.push(x.envMapCubeUVHeight),_.push(x.mapUv),_.push(x.alphaMapUv),_.push(x.lightMapUv),_.push(x.aoMapUv),_.push(x.bumpMapUv),_.push(x.normalMapUv),_.push(x.displacementMapUv),_.push(x.emissiveMapUv),_.push(x.metalnessMapUv),_.push(x.roughnessMapUv),_.push(x.anisotropyMapUv),_.push(x.clearcoatMapUv),_.push(x.clearcoatNormalMapUv),_.push(x.clearcoatRoughnessMapUv),_.push(x.iridescenceMapUv),_.push(x.iridescenceThicknessMapUv),_.push(x.sheenColorMapUv),_.push(x.sheenRoughnessMapUv),_.push(x.specularMapUv),_.push(x.specularColorMapUv),_.push(x.specularIntensityMapUv),_.push(x.transmissionMapUv),_.push(x.thicknessMapUv),_.push(x.combine),_.push(x.fogExp2),_.push(x.sizeAttenuation),_.push(x.morphTargetsCount),_.push(x.morphAttributeCount),_.push(x.numDirLights),_.push(x.numPointLights),_.push(x.numSpotLights),_.push(x.numSpotLightMaps),_.push(x.numHemiLights),_.push(x.numRectAreaLights),_.push(x.numDirLightShadows),_.push(x.numPointLightShadows),_.push(x.numSpotLightShadows),_.push(x.numSpotLightShadowsWithMaps),_.push(x.numLightProbes),_.push(x.shadowMapType),_.push(x.toneMapping),_.push(x.numClippingPlanes),_.push(x.numClipIntersection),_.push(x.depthPacking)}function E(_,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),x.gradientMap&&a.enable(22),_.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),_.push(a.mask)}function b(_){let x=g[_.type],I;if(x){let D=Rn[x];I=af.clone(D.uniforms)}else I=_.uniforms;return I}function v(_,x){let I;for(let D=0,V=h.length;D<V;D++){let W=h[D];if(W.cacheKey===x){I=W,++I.usedTimes;break}}return I===void 0&&(I=new Cv(i,x,_,s),h.push(I)),I}function S(_){if(--_.usedTimes===0){let x=h.indexOf(_);h[x]=h[h.length-1],h.pop(),_.destroy()}}function C(_){l.remove(_)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:b,acquireProgram:v,releaseProgram:S,releaseShaderCache:C,programs:h,dispose:R}}function Iv(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,l){i.get(o)[a]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function Pv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Rf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function If(){let i=[],e=0,t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function o(u,d,p,g,M,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:M,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=M,f.group=m),e++,f}function a(u,d,p,g,M,m){let f=o(u,d,p,g,M,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):t.push(f)}function l(u,d,p,g,M,m){let f=o(u,d,p,g,M,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function c(u,d){t.length>1&&t.sort(u||Pv),n.length>1&&n.sort(d||Rf),r.length>1&&r.sort(d||Rf)}function h(){for(let u=e,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:a,unshift:l,finish:h,sort:c}}function Lv(){let i=new WeakMap;function e(n,r){let s=i.get(n),o;return s===void 0?(o=new If,i.set(n,[o])):r>=s.length?(o=new If,s.push(o)):o=s[r],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Dv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new $e};break;case"SpotLight":t={position:new O,direction:new O,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function Fv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Nv=0;function Ov(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Uv(i){let e=new Dv,t=Fv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new O);let r=new O,s=new xt,o=new xt;function a(c){let h=0,u=0,d=0;for(let _=0;_<9;_++)n.probe[_].set(0,0,0);let p=0,g=0,M=0,m=0,f=0,T=0,E=0,b=0,v=0,S=0,C=0;c.sort(Ov);for(let _=0,x=c.length;_<x;_++){let I=c[_],D=I.color,V=I.intensity,W=I.distance,Z=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=D.r*V,u+=D.g*V,d+=D.b*V;else if(I.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(I.sh.coefficients[K],V);C++}else if(I.isDirectionalLight){let K=e.get(I);if(K.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let te=I.shadow,z=t.get(I);z.shadowIntensity=te.intensity,z.shadowBias=te.bias,z.shadowNormalBias=te.normalBias,z.shadowRadius=te.radius,z.shadowMapSize=te.mapSize,n.directionalShadow[p]=z,n.directionalShadowMap[p]=Z,n.directionalShadowMatrix[p]=I.shadow.matrix,T++}n.directional[p]=K,p++}else if(I.isSpotLight){let K=e.get(I);K.position.setFromMatrixPosition(I.matrixWorld),K.color.copy(D).multiplyScalar(V),K.distance=W,K.coneCos=Math.cos(I.angle),K.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),K.decay=I.decay,n.spot[M]=K;let te=I.shadow;if(I.map&&(n.spotLightMap[v]=I.map,v++,te.updateMatrices(I),I.castShadow&&S++),n.spotLightMatrix[M]=te.matrix,I.castShadow){let z=t.get(I);z.shadowIntensity=te.intensity,z.shadowBias=te.bias,z.shadowNormalBias=te.normalBias,z.shadowRadius=te.radius,z.shadowMapSize=te.mapSize,n.spotShadow[M]=z,n.spotShadowMap[M]=Z,b++}M++}else if(I.isRectAreaLight){let K=e.get(I);K.color.copy(D).multiplyScalar(V),K.halfWidth.set(I.width*.5,0,0),K.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=K,m++}else if(I.isPointLight){let K=e.get(I);if(K.color.copy(I.color).multiplyScalar(I.intensity),K.distance=I.distance,K.decay=I.decay,I.castShadow){let te=I.shadow,z=t.get(I);z.shadowIntensity=te.intensity,z.shadowBias=te.bias,z.shadowNormalBias=te.normalBias,z.shadowRadius=te.radius,z.shadowMapSize=te.mapSize,z.shadowCameraNear=te.camera.near,z.shadowCameraFar=te.camera.far,n.pointShadow[g]=z,n.pointShadowMap[g]=Z,n.pointShadowMatrix[g]=I.shadow.matrix,E++}n.point[g]=K,g++}else if(I.isHemisphereLight){let K=e.get(I);K.skyColor.copy(I.color).multiplyScalar(V),K.groundColor.copy(I.groundColor).multiplyScalar(V),n.hemi[f]=K,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=me.LTC_FLOAT_1,n.rectAreaLTC2=me.LTC_FLOAT_2):(n.rectAreaLTC1=me.LTC_HALF_1,n.rectAreaLTC2=me.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==M||R.rectAreaLength!==m||R.hemiLength!==f||R.numDirectionalShadows!==T||R.numPointShadows!==E||R.numSpotShadows!==b||R.numSpotMaps!==v||R.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=M,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=b+v-S,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=C,R.directionalLength=p,R.pointLength=g,R.spotLength=M,R.rectAreaLength=m,R.hemiLength=f,R.numDirectionalShadows=T,R.numPointShadows=E,R.numSpotShadows=b,R.numSpotMaps=v,R.numLightProbes=C,n.version=Nv++)}function l(c,h){let u=0,d=0,p=0,g=0,M=0,m=h.matrixWorldInverse;for(let f=0,T=c.length;f<T;f++){let E=c[f];if(E.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),u++}else if(E.isSpotLight){let b=n.spot[p];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),p++}else if(E.isRectAreaLight){let b=n.rectArea[g];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(m),o.identity(),s.copy(E.matrixWorld),s.premultiply(m),o.extractRotation(s),b.halfWidth.set(E.width*.5,0,0),b.halfHeight.set(0,E.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){let b=n.point[d];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){let b=n.hemi[M];b.direction.setFromMatrixPosition(E.matrixWorld),b.direction.transformDirection(m),M++}}}return{setup:a,setupView:l,state:n}}function Pf(i){let e=new Uv(i),t=[],n=[];function r(h){c.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function kv(i){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new Pf(i),e.set(r,[a])):s>=o.length?(a=new Pf(i),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Bv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vv=`uniform sampler2D shadow_pass;
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
}`;function zv(i,e,t){let n=new or,r=new Ye,s=new Ye,o=new bt,a=new no({depthPacking:$d}),l=new io,c={},h=t.maxTextureSize,u={[Vn]:Yt,[Yt]:Vn,[cn]:cn},d=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ye},radius:{value:4}},vertexShader:Bv,fragmentShader:Vv}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new Sn;g.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new Ut(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nc;let f=this.type;this.render=function(S,C,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;let _=i.getRenderTarget(),x=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Wn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let V=f!==Cn&&this.type===Cn,W=f===Cn&&this.type!==Cn;for(let Z=0,K=S.length;Z<K;Z++){let te=S[Z],z=te.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",te,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);let oe=z.getFrameExtents();if(r.multiply(oe),s.copy(z.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/oe.x),r.x=s.x*oe.x,z.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/oe.y),r.y=s.y*oe.y,z.mapSize.y=s.y)),z.map===null||V===!0||W===!0){let Ee=this.type!==Cn?{minFilter:fn,magFilter:fn}:{};z.map!==null&&z.map.dispose(),z.map=new Tn(r.x,r.y,Ee),z.map.texture.name=te.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();let de=z.getViewportCount();for(let Ee=0;Ee<de;Ee++){let Be=z.getViewport(Ee);o.set(s.x*Be.x,s.y*Be.y,s.x*Be.z,s.y*Be.w),D.viewport(o),z.updateMatrices(te,Ee),n=z.getFrustum(),b(C,R,z.camera,te,this.type)}z.isPointLightShadow!==!0&&this.type===Cn&&T(z,R),z.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(_,x,I)};function T(S,C){let R=e.update(M);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Tn(r.x,r.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(C,null,R,d,M,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(C,null,R,p,M,null)}function E(S,C,R,_){let x=null,I=R.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(I!==void 0)x=I;else if(x=R.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let D=x.uuid,V=C.uuid,W=c[D];W===void 0&&(W={},c[D]=W);let Z=W[V];Z===void 0&&(Z=x.clone(),W[V]=Z,C.addEventListener("dispose",v)),x=Z}if(x.visible=C.visible,x.wireframe=C.wireframe,_===Cn?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:u[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,R.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let D=i.properties.get(x);D.light=R}return x}function b(S,C,R,_,x){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&x===Cn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,S.matrixWorld);let V=e.update(S),W=S.material;if(Array.isArray(W)){let Z=V.groups;for(let K=0,te=Z.length;K<te;K++){let z=Z[K],oe=W[z.materialIndex];if(oe&&oe.visible){let de=E(S,oe,_,x);S.onBeforeShadow(i,S,C,R,V,de,z),i.renderBufferDirect(R,null,V,de,S,z),S.onAfterShadow(i,S,C,R,V,de,z)}}}else if(W.visible){let Z=E(S,W,_,x);S.onBeforeShadow(i,S,C,R,V,Z,null),i.renderBufferDirect(R,null,V,Z,S,null),S.onAfterShadow(i,S,C,R,V,Z,null)}}let D=S.children;for(let V=0,W=D.length;V<W;V++)b(D[V],C,R,_,x)}function v(S){S.target.removeEventListener("dispose",v);for(let R in c){let _=c[R],x=S.target.uuid;x in _&&(_[x].dispose(),delete _[x])}}}var Hv={[go]:yo,[vo]:So,[xo]:bo,[Si]:_o,[yo]:go,[So]:vo,[bo]:xo,[_o]:Si};function Wv(i,e){function t(){let F=!1,he=new bt,fe=null,we=new bt(0,0,0,0);return{setMask:function(ae){fe!==ae&&!F&&(i.colorMask(ae,ae,ae,ae),fe=ae)},setLocked:function(ae){F=ae},setClear:function(ae,Q,Ce,ze,ft){ft===!0&&(ae*=ze,Q*=ze,Ce*=ze),he.set(ae,Q,Ce,ze),we.equals(he)===!1&&(i.clearColor(ae,Q,Ce,ze),we.copy(he))},reset:function(){F=!1,fe=null,we.set(-1,0,0,0)}}}function n(){let F=!1,he=!1,fe=null,we=null,ae=null;return{setReversed:function(Q){if(he!==Q){let Ce=e.get("EXT_clip_control");Q?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),he=Q;let ze=ae;ae=null,this.setClear(ze)}},getReversed:function(){return he},setTest:function(Q){Q?ne(i.DEPTH_TEST):Se(i.DEPTH_TEST)},setMask:function(Q){fe!==Q&&!F&&(i.depthMask(Q),fe=Q)},setFunc:function(Q){if(he&&(Q=Hv[Q]),we!==Q){switch(Q){case go:i.depthFunc(i.NEVER);break;case yo:i.depthFunc(i.ALWAYS);break;case vo:i.depthFunc(i.LESS);break;case Si:i.depthFunc(i.LEQUAL);break;case xo:i.depthFunc(i.EQUAL);break;case _o:i.depthFunc(i.GEQUAL);break;case So:i.depthFunc(i.GREATER);break;case bo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=Q}},setLocked:function(Q){F=Q},setClear:function(Q){ae!==Q&&(he&&(Q=1-Q),i.clearDepth(Q),ae=Q)},reset:function(){F=!1,fe=null,we=null,ae=null,he=!1}}}function r(){let F=!1,he=null,fe=null,we=null,ae=null,Q=null,Ce=null,ze=null,ft=null;return{setTest:function(ot){F||(ot?ne(i.STENCIL_TEST):Se(i.STENCIL_TEST))},setMask:function(ot){he!==ot&&!F&&(i.stencilMask(ot),he=ot)},setFunc:function(ot,Ln,En){(fe!==ot||we!==Ln||ae!==En)&&(i.stencilFunc(ot,Ln,En),fe=ot,we=Ln,ae=En)},setOp:function(ot,Ln,En){(Q!==ot||Ce!==Ln||ze!==En)&&(i.stencilOp(ot,Ln,En),Q=ot,Ce=Ln,ze=En)},setLocked:function(ot){F=ot},setClear:function(ot){ft!==ot&&(i.clearStencil(ot),ft=ot)},reset:function(){F=!1,he=null,fe=null,we=null,ae=null,Q=null,Ce=null,ze=null,ft=null}}}let s=new t,o=new n,a=new r,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,p=[],g=null,M=!1,m=null,f=null,T=null,E=null,b=null,v=null,S=null,C=new $e(0,0,0),R=0,_=!1,x=null,I=null,D=null,V=null,W=null,Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,te=0,z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(z)[1]),K=te>=1):z.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),K=te>=2);let oe=null,de={},Ee=i.getParameter(i.SCISSOR_BOX),Be=i.getParameter(i.VIEWPORT),at=new bt().fromArray(Ee),rt=new bt().fromArray(Be);function et(F,he,fe,we){let ae=new Uint8Array(4),Q=i.createTexture();i.bindTexture(F,Q),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ce=0;Ce<fe;Ce++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(he,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,ae):i.texImage2D(he+Ce,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ae);return Q}let q={};q[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),q[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),q[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(i.DEPTH_TEST),o.setFunc(Si),ie(!1),pe(Fc),ne(i.CULL_FACE),it(Wn);function ne(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function Se(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function Fe(F,he){return u[F]!==he?(i.bindFramebuffer(F,he),u[F]=he,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=he),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=he),!0):!1}function Ae(F,he){let fe=p,we=!1;if(F){fe=d.get(he),fe===void 0&&(fe=[],d.set(he,fe));let ae=F.textures;if(fe.length!==ae.length||fe[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,Ce=ae.length;Q<Ce;Q++)fe[Q]=i.COLOR_ATTACHMENT0+Q;fe.length=ae.length,we=!0}}else fe[0]!==i.BACK&&(fe[0]=i.BACK,we=!0);we&&i.drawBuffers(fe)}function qe(F){return g!==F?(i.useProgram(F),g=F,!0):!1}let Ct={[ti]:i.FUNC_ADD,[Sd]:i.FUNC_SUBTRACT,[bd]:i.FUNC_REVERSE_SUBTRACT};Ct[Md]=i.MIN,Ct[wd]=i.MAX;let P={[Ed]:i.ZERO,[Td]:i.ONE,[Cd]:i.SRC_COLOR,[Gs]:i.SRC_ALPHA,[Dd]:i.SRC_ALPHA_SATURATE,[Pd]:i.DST_COLOR,[Rd]:i.DST_ALPHA,[Ad]:i.ONE_MINUS_SRC_COLOR,[Xs]:i.ONE_MINUS_SRC_ALPHA,[Ld]:i.ONE_MINUS_DST_COLOR,[Id]:i.ONE_MINUS_DST_ALPHA,[Fd]:i.CONSTANT_COLOR,[Nd]:i.ONE_MINUS_CONSTANT_COLOR,[Od]:i.CONSTANT_ALPHA,[Ud]:i.ONE_MINUS_CONSTANT_ALPHA};function it(F,he,fe,we,ae,Q,Ce,ze,ft,ot){if(F===Wn){M===!0&&(Se(i.BLEND),M=!1);return}if(M===!1&&(ne(i.BLEND),M=!0),F!==_d){if(F!==m||ot!==_){if((f!==ti||b!==ti)&&(i.blendEquation(i.FUNC_ADD),f=ti,b=ti),ot)switch(F){case _i:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qr:i.blendFunc(i.ONE,i.ONE);break;case Oc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Uc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case _i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Oc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Uc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}T=null,E=null,v=null,S=null,C.set(0,0,0),R=0,m=F,_=ot}return}ae=ae||he,Q=Q||fe,Ce=Ce||we,(he!==f||ae!==b)&&(i.blendEquationSeparate(Ct[he],Ct[ae]),f=he,b=ae),(fe!==T||we!==E||Q!==v||Ce!==S)&&(i.blendFuncSeparate(P[fe],P[we],P[Q],P[Ce]),T=fe,E=we,v=Q,S=Ce),(ze.equals(C)===!1||ft!==R)&&(i.blendColor(ze.r,ze.g,ze.b,ft),C.copy(ze),R=ft),m=F,_=!1}function H(F,he){F.side===cn?Se(i.CULL_FACE):ne(i.CULL_FACE);let fe=F.side===Yt;he&&(fe=!fe),ie(fe),F.blending===_i&&F.transparent===!1?it(Wn):it(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),s.setMask(F.colorWrite);let we=F.stencilWrite;a.setTest(we),we&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Me(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):Se(i.SAMPLE_ALPHA_TO_COVERAGE)}function ie(F){x!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),x=F)}function pe(F){F!==yd?(ne(i.CULL_FACE),F!==I&&(F===Fc?i.cullFace(i.BACK):F===vd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Se(i.CULL_FACE),I=F}function st(F){F!==D&&(K&&i.lineWidth(F),D=F)}function Me(F,he,fe){F?(ne(i.POLYGON_OFFSET_FILL),(V!==he||W!==fe)&&(i.polygonOffset(he,fe),V=he,W=fe)):Se(i.POLYGON_OFFSET_FILL)}function He(F){F?ne(i.SCISSOR_TEST):Se(i.SCISSOR_TEST)}function Et(F){F===void 0&&(F=i.TEXTURE0+Z-1),oe!==F&&(i.activeTexture(F),oe=F)}function vt(F,he,fe){fe===void 0&&(oe===null?fe=i.TEXTURE0+Z-1:fe=oe);let we=de[fe];we===void 0&&(we={type:void 0,texture:void 0},de[fe]=we),(we.type!==F||we.texture!==he)&&(oe!==fe&&(i.activeTexture(fe),oe=fe),i.bindTexture(F,he||q[F]),we.type=F,we.texture=he)}function A(){let F=de[oe];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function U(){try{i.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Y(){try{i.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ee(){try{i.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Re(){try{i.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ue(){try{i.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ie(){try{i.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pe(){try{i.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ce(){try{i.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ve(F){at.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),at.copy(F))}function Ue(F){rt.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),rt.copy(F))}function Le(F,he){let fe=c.get(he);fe===void 0&&(fe=new WeakMap,c.set(he,fe));let we=fe.get(F);we===void 0&&(we=i.getUniformBlockIndex(he,F.name),fe.set(F,we))}function ge(F,he){let we=c.get(he).get(F);l.get(he)!==we&&(i.uniformBlockBinding(he,we,F.__bindingPointIndex),l.set(he,we))}function Ge(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},oe=null,de={},u={},d=new WeakMap,p=[],g=null,M=!1,m=null,f=null,T=null,E=null,b=null,v=null,S=null,C=new $e(0,0,0),R=0,_=!1,x=null,I=null,D=null,V=null,W=null,at.set(0,0,i.canvas.width,i.canvas.height),rt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ne,disable:Se,bindFramebuffer:Fe,drawBuffers:Ae,useProgram:qe,setBlending:it,setMaterial:H,setFlipSided:ie,setCullFace:pe,setLineWidth:st,setPolygonOffset:Me,setScissorTest:He,activeTexture:Et,bindTexture:vt,unbindTexture:A,compressedTexImage2D:y,compressedTexImage3D:U,texImage2D:Pe,texImage3D:ce,updateUBOMapping:Le,uniformBlockBinding:ge,texStorage2D:ue,texStorage3D:Ie,texSubImage2D:Y,texSubImage3D:ee,compressedTexSubImage2D:J,compressedTexSubImage3D:Re,scissor:ve,viewport:Ue,reset:Ge}}function Gv(i,e,t,n,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ye,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,y){return p?new OffscreenCanvas(A,y):Dr("canvas")}function M(A,y,U){let Y=1,ee=vt(A);if((ee.width>U||ee.height>U)&&(Y=U/Math.max(ee.width,ee.height)),Y<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let J=Math.floor(Y*ee.width),Re=Math.floor(Y*ee.height);u===void 0&&(u=g(J,Re));let ue=y?g(J,Re):u;return ue.width=J,ue.height=Re,ue.getContext("2d").drawImage(A,0,0,J,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+J+"x"+Re+")."),ue}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),A;return A}function m(A){return A.generateMipmaps}function f(A){i.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(A,y,U,Y,ee=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let J=y;if(y===i.RED&&(U===i.FLOAT&&(J=i.R32F),U===i.HALF_FLOAT&&(J=i.R16F),U===i.UNSIGNED_BYTE&&(J=i.R8)),y===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.R8UI),U===i.UNSIGNED_SHORT&&(J=i.R16UI),U===i.UNSIGNED_INT&&(J=i.R32UI),U===i.BYTE&&(J=i.R8I),U===i.SHORT&&(J=i.R16I),U===i.INT&&(J=i.R32I)),y===i.RG&&(U===i.FLOAT&&(J=i.RG32F),U===i.HALF_FLOAT&&(J=i.RG16F),U===i.UNSIGNED_BYTE&&(J=i.RG8)),y===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RG8UI),U===i.UNSIGNED_SHORT&&(J=i.RG16UI),U===i.UNSIGNED_INT&&(J=i.RG32UI),U===i.BYTE&&(J=i.RG8I),U===i.SHORT&&(J=i.RG16I),U===i.INT&&(J=i.RG32I)),y===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RGB8UI),U===i.UNSIGNED_SHORT&&(J=i.RGB16UI),U===i.UNSIGNED_INT&&(J=i.RGB32UI),U===i.BYTE&&(J=i.RGB8I),U===i.SHORT&&(J=i.RGB16I),U===i.INT&&(J=i.RGB32I)),y===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),U===i.UNSIGNED_INT&&(J=i.RGBA32UI),U===i.BYTE&&(J=i.RGBA8I),U===i.SHORT&&(J=i.RGBA16I),U===i.INT&&(J=i.RGBA32I)),y===i.RGB&&(U===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),U===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),y===i.RGBA){let Re=ee?Pr:tt.getTransfer(Y);U===i.FLOAT&&(J=i.RGBA32F),U===i.HALF_FLOAT&&(J=i.RGBA16F),U===i.UNSIGNED_BYTE&&(J=Re===lt?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function b(A,y){let U;return A?y===null||y===li||y===cr?U=i.DEPTH24_STENCIL8:y===An?U=i.DEPTH32F_STENCIL8:y===ar&&(U=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===li||y===cr?U=i.DEPTH_COMPONENT24:y===An?U=i.DEPTH_COMPONENT32F:y===ar&&(U=i.DEPTH_COMPONENT16),U}function v(A,y){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==fn&&A.minFilter!==xn?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function S(A){let y=A.target;y.removeEventListener("dispose",S),R(y),y.isVideoTexture&&h.delete(y)}function C(A){let y=A.target;y.removeEventListener("dispose",C),x(y)}function R(A){let y=n.get(A);if(y.__webglInit===void 0)return;let U=A.source,Y=d.get(U);if(Y){let ee=Y[y.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&_(A),Object.keys(Y).length===0&&d.delete(U)}n.remove(A)}function _(A){let y=n.get(A);i.deleteTexture(y.__webglTexture);let U=A.source,Y=d.get(U);delete Y[y.__cacheKey],o.memory.textures--}function x(A){let y=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(y.__webglFramebuffer[Y]))for(let ee=0;ee<y.__webglFramebuffer[Y].length;ee++)i.deleteFramebuffer(y.__webglFramebuffer[Y][ee]);else i.deleteFramebuffer(y.__webglFramebuffer[Y]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[Y])}else{if(Array.isArray(y.__webglFramebuffer))for(let Y=0;Y<y.__webglFramebuffer.length;Y++)i.deleteFramebuffer(y.__webglFramebuffer[Y]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let Y=0;Y<y.__webglColorRenderbuffer.length;Y++)y.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[Y]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let U=A.textures;for(let Y=0,ee=U.length;Y<ee;Y++){let J=n.get(U[Y]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(U[Y])}n.remove(A)}let I=0;function D(){I=0}function V(){let A=I;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),I+=1,A}function W(A){let y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function Z(A,y){let U=n.get(A);if(A.isVideoTexture&&He(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&U.__version!==A.version){let Y=A.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(U,A,y);return}}else A.isExternalTexture&&(U.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+y)}function K(A,y){let U=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&U.__version!==A.version){q(U,A,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+y)}function te(A,y){let U=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&U.__version!==A.version){q(U,A,y);return}t.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+y)}function z(A,y){let U=n.get(A);if(A.version>0&&U.__version!==A.version){ne(U,A,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+y)}let oe={[qs]:i.REPEAT,[ei]:i.CLAMP_TO_EDGE,[Ys]:i.MIRRORED_REPEAT},de={[fn]:i.NEAREST,[qd]:i.NEAREST_MIPMAP_NEAREST,[ts]:i.NEAREST_MIPMAP_LINEAR,[xn]:i.LINEAR,[To]:i.LINEAR_MIPMAP_NEAREST,[ai]:i.LINEAR_MIPMAP_LINEAR},Ee={[Jd]:i.NEVER,[nf]:i.ALWAYS,[Zd]:i.LESS,[Kc]:i.LEQUAL,[jd]:i.EQUAL,[tf]:i.GEQUAL,[Qd]:i.GREATER,[ef]:i.NOTEQUAL};function Be(A,y){if(y.type===An&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===xn||y.magFilter===To||y.magFilter===ts||y.magFilter===ai||y.minFilter===xn||y.minFilter===To||y.minFilter===ts||y.minFilter===ai)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,oe[y.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,oe[y.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,oe[y.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,de[y.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,de[y.minFilter]),y.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Ee[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===fn||y.minFilter!==ts&&y.minFilter!==ai||y.type===An&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let U=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function at(A,y){let U=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",S));let Y=y.source,ee=d.get(Y);ee===void 0&&(ee={},d.set(Y,ee));let J=W(y);if(J!==A.__cacheKey){ee[J]===void 0&&(ee[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,U=!0),ee[J].usedTimes++;let Re=ee[A.__cacheKey];Re!==void 0&&(ee[A.__cacheKey].usedTimes--,Re.usedTimes===0&&_(y)),A.__cacheKey=J,A.__webglTexture=ee[J].texture}return U}function rt(A,y,U){return Math.floor(Math.floor(A/U)/y)}function et(A,y,U,Y){let J=A.updateRanges;if(J.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,U,Y,y.data);else{J.sort((ce,ve)=>ce.start-ve.start);let Re=0;for(let ce=1;ce<J.length;ce++){let ve=J[Re],Ue=J[ce],Le=ve.start+ve.count,ge=rt(Ue.start,y.width,4),Ge=rt(ve.start,y.width,4);Ue.start<=Le+1&&ge===Ge&&rt(Ue.start+Ue.count-1,y.width,4)===ge?ve.count=Math.max(ve.count,Ue.start+Ue.count-ve.start):(++Re,J[Re]=Ue)}J.length=Re+1;let ue=i.getParameter(i.UNPACK_ROW_LENGTH),Ie=i.getParameter(i.UNPACK_SKIP_PIXELS),Pe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let ce=0,ve=J.length;ce<ve;ce++){let Ue=J[ce],Le=Math.floor(Ue.start/4),ge=Math.ceil(Ue.count/4),Ge=Le%y.width,F=Math.floor(Le/y.width),he=ge,fe=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ge),i.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,Ge,F,he,fe,U,Y,y.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ue),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ie),i.pixelStorei(i.UNPACK_SKIP_ROWS,Pe)}}function q(A,y,U){let Y=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(Y=i.TEXTURE_3D);let ee=at(A,y),J=y.source;t.bindTexture(Y,A.__webglTexture,i.TEXTURE0+U);let Re=n.get(J);if(J.version!==Re.__version||ee===!0){t.activeTexture(i.TEXTURE0+U);let ue=tt.getPrimaries(tt.workingColorSpace),Ie=y.colorSpace===Xn?null:tt.getPrimaries(y.colorSpace),Pe=y.colorSpace===Xn||ue===Ie?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);let ce=M(y.image,!1,r.maxTextureSize);ce=Et(y,ce);let ve=s.convert(y.format,y.colorSpace),Ue=s.convert(y.type),Le=E(y.internalFormat,ve,Ue,y.colorSpace,y.isVideoTexture);Be(Y,y);let ge,Ge=y.mipmaps,F=y.isVideoTexture!==!0,he=Re.__version===void 0||ee===!0,fe=J.dataReady,we=v(y,ce);if(y.isDepthTexture)Le=b(y.format===hr,y.type),he&&(F?t.texStorage2D(i.TEXTURE_2D,1,Le,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,Le,ce.width,ce.height,0,ve,Ue,null));else if(y.isDataTexture)if(Ge.length>0){F&&he&&t.texStorage2D(i.TEXTURE_2D,we,Le,Ge[0].width,Ge[0].height);for(let ae=0,Q=Ge.length;ae<Q;ae++)ge=Ge[ae],F?fe&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,Ue,ge.data):t.texImage2D(i.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ve,Ue,ge.data);y.generateMipmaps=!1}else F?(he&&t.texStorage2D(i.TEXTURE_2D,we,Le,ce.width,ce.height),fe&&et(y,ce,ve,Ue)):t.texImage2D(i.TEXTURE_2D,0,Le,ce.width,ce.height,0,ve,Ue,ce.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){F&&he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Le,Ge[0].width,Ge[0].height,ce.depth);for(let ae=0,Q=Ge.length;ae<Q;ae++)if(ge=Ge[ae],y.format!==pn)if(ve!==null)if(F){if(fe)if(y.layerUpdates.size>0){let Ce=nh(ge.width,ge.height,y.format,y.type);for(let ze of y.layerUpdates){let ft=ge.data.subarray(ze*Ce/ge.data.BYTES_PER_ELEMENT,(ze+1)*Ce/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,ze,ge.width,ge.height,1,ve,ft)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,ce.depth,ve,ge.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ae,Le,ge.width,ge.height,ce.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?fe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,ce.depth,ve,Ue,ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ae,Le,ge.width,ge.height,ce.depth,0,ve,Ue,ge.data)}else{F&&he&&t.texStorage2D(i.TEXTURE_2D,we,Le,Ge[0].width,Ge[0].height);for(let ae=0,Q=Ge.length;ae<Q;ae++)ge=Ge[ae],y.format!==pn?ve!==null?F?fe&&t.compressedTexSubImage2D(i.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,ge.data):t.compressedTexImage2D(i.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?fe&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,Ue,ge.data):t.texImage2D(i.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ve,Ue,ge.data)}else if(y.isDataArrayTexture)if(F){if(he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Le,ce.width,ce.height,ce.depth),fe)if(y.layerUpdates.size>0){let ae=nh(ce.width,ce.height,y.format,y.type);for(let Q of y.layerUpdates){let Ce=ce.data.subarray(Q*ae/ce.data.BYTES_PER_ELEMENT,(Q+1)*ae/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,ce.width,ce.height,1,ve,Ue,Ce)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,ve,Ue,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Le,ce.width,ce.height,ce.depth,0,ve,Ue,ce.data);else if(y.isData3DTexture)F?(he&&t.texStorage3D(i.TEXTURE_3D,we,Le,ce.width,ce.height,ce.depth),fe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,ve,Ue,ce.data)):t.texImage3D(i.TEXTURE_3D,0,Le,ce.width,ce.height,ce.depth,0,ve,Ue,ce.data);else if(y.isFramebufferTexture){if(he)if(F)t.texStorage2D(i.TEXTURE_2D,we,Le,ce.width,ce.height);else{let ae=ce.width,Q=ce.height;for(let Ce=0;Ce<we;Ce++)t.texImage2D(i.TEXTURE_2D,Ce,Le,ae,Q,0,ve,Ue,null),ae>>=1,Q>>=1}}else if(Ge.length>0){if(F&&he){let ae=vt(Ge[0]);t.texStorage2D(i.TEXTURE_2D,we,Le,ae.width,ae.height)}for(let ae=0,Q=Ge.length;ae<Q;ae++)ge=Ge[ae],F?fe&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ve,Ue,ge):t.texImage2D(i.TEXTURE_2D,ae,Le,ve,Ue,ge);y.generateMipmaps=!1}else if(F){if(he){let ae=vt(ce);t.texStorage2D(i.TEXTURE_2D,we,Le,ae.width,ae.height)}fe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,Ue,ce)}else t.texImage2D(i.TEXTURE_2D,0,Le,ve,Ue,ce);m(y)&&f(Y),Re.__version=J.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function ne(A,y,U){if(y.image.length!==6)return;let Y=at(A,y),ee=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+U);let J=n.get(ee);if(ee.version!==J.__version||Y===!0){t.activeTexture(i.TEXTURE0+U);let Re=tt.getPrimaries(tt.workingColorSpace),ue=y.colorSpace===Xn?null:tt.getPrimaries(y.colorSpace),Ie=y.colorSpace===Xn||Re===ue?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);let Pe=y.isCompressedTexture||y.image[0].isCompressedTexture,ce=y.image[0]&&y.image[0].isDataTexture,ve=[];for(let Q=0;Q<6;Q++)!Pe&&!ce?ve[Q]=M(y.image[Q],!0,r.maxCubemapSize):ve[Q]=ce?y.image[Q].image:y.image[Q],ve[Q]=Et(y,ve[Q]);let Ue=ve[0],Le=s.convert(y.format,y.colorSpace),ge=s.convert(y.type),Ge=E(y.internalFormat,Le,ge,y.colorSpace),F=y.isVideoTexture!==!0,he=J.__version===void 0||Y===!0,fe=ee.dataReady,we=v(y,Ue);Be(i.TEXTURE_CUBE_MAP,y);let ae;if(Pe){F&&he&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Ge,Ue.width,Ue.height);for(let Q=0;Q<6;Q++){ae=ve[Q].mipmaps;for(let Ce=0;Ce<ae.length;Ce++){let ze=ae[Ce];y.format!==pn?Le!==null?F?fe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,0,0,ze.width,ze.height,Le,ze.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,Ge,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,0,0,ze.width,ze.height,Le,ge,ze.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,Ge,ze.width,ze.height,0,Le,ge,ze.data)}}}else{if(ae=y.mipmaps,F&&he){ae.length>0&&we++;let Q=vt(ve[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Ge,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ce){F?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ve[Q].width,ve[Q].height,Le,ge,ve[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ge,ve[Q].width,ve[Q].height,0,Le,ge,ve[Q].data);for(let Ce=0;Ce<ae.length;Ce++){let ft=ae[Ce].image[Q].image;F?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,0,0,ft.width,ft.height,Le,ge,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,Ge,ft.width,ft.height,0,Le,ge,ft.data)}}else{F?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Le,ge,ve[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ge,Le,ge,ve[Q]);for(let Ce=0;Ce<ae.length;Ce++){let ze=ae[Ce];F?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,0,0,Le,ge,ze.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,Ge,Le,ge,ze.image[Q])}}}m(y)&&f(i.TEXTURE_CUBE_MAP),J.__version=ee.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function Se(A,y,U,Y,ee,J){let Re=s.convert(U.format,U.colorSpace),ue=s.convert(U.type),Ie=E(U.internalFormat,Re,ue,U.colorSpace),Pe=n.get(y),ce=n.get(U);if(ce.__renderTarget=y,!Pe.__hasExternalTextures){let ve=Math.max(1,y.width>>J),Ue=Math.max(1,y.height>>J);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,J,Ie,ve,Ue,y.depth,0,Re,ue,null):t.texImage2D(ee,J,Ie,ve,Ue,0,Re,ue,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),Me(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,ee,ce.__webglTexture,0,st(y)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,ee,ce.__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Fe(A,y,U){if(i.bindRenderbuffer(i.RENDERBUFFER,A),y.depthBuffer){let Y=y.depthTexture,ee=Y&&Y.isDepthTexture?Y.type:null,J=b(y.stencilBuffer,ee),Re=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=st(y);Me(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ue,J,y.width,y.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,J,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,J,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,A)}else{let Y=y.textures;for(let ee=0;ee<Y.length;ee++){let J=Y[ee],Re=s.convert(J.format,J.colorSpace),ue=s.convert(J.type),Ie=E(J.internalFormat,Re,ue,J.colorSpace),Pe=st(y);U&&Me(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,Ie,y.width,y.height):Me(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Pe,Ie,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Ie,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ae(A,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Y=n.get(y.depthTexture);Y.__renderTarget=y,(!Y.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),Z(y.depthTexture,0);let ee=Y.__webglTexture,J=st(y);if(y.depthTexture.format===er)Me(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0);else if(y.depthTexture.format===hr)Me(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function qe(A){let y=n.get(A),U=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){let Y=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),Y){let ee=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,Y.removeEventListener("dispose",ee)};Y.addEventListener("dispose",ee),y.__depthDisposeCallback=ee}y.__boundDepthTexture=Y}if(A.depthTexture&&!y.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");let Y=A.texture.mipmaps;Y&&Y.length>0?Ae(y.__webglFramebuffer[0],A):Ae(y.__webglFramebuffer,A)}else if(U){y.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[Y]),y.__webglDepthbuffer[Y]===void 0)y.__webglDepthbuffer[Y]=i.createRenderbuffer(),Fe(y.__webglDepthbuffer[Y],A,!1);else{let ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,J)}}else{let Y=A.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Fe(y.__webglDepthbuffer,A,!1);else{let ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,J)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ct(A,y,U){let Y=n.get(A);y!==void 0&&Se(Y.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&qe(A)}function P(A){let y=A.texture,U=n.get(A),Y=n.get(y);A.addEventListener("dispose",C);let ee=A.textures,J=A.isWebGLCubeRenderTarget===!0,Re=ee.length>1;if(Re||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=y.version,o.memory.textures++),J){U.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(y.mipmaps&&y.mipmaps.length>0){U.__webglFramebuffer[ue]=[];for(let Ie=0;Ie<y.mipmaps.length;Ie++)U.__webglFramebuffer[ue][Ie]=i.createFramebuffer()}else U.__webglFramebuffer[ue]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){U.__webglFramebuffer=[];for(let ue=0;ue<y.mipmaps.length;ue++)U.__webglFramebuffer[ue]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(Re)for(let ue=0,Ie=ee.length;ue<Ie;ue++){let Pe=n.get(ee[ue]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&Me(A)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let ue=0;ue<ee.length;ue++){let Ie=ee[ue];U.__webglColorRenderbuffer[ue]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[ue]);let Pe=s.convert(Ie.format,Ie.colorSpace),ce=s.convert(Ie.type),ve=E(Ie.internalFormat,Pe,ce,Ie.colorSpace,A.isXRRenderTarget===!0),Ue=st(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ue,ve,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,U.__webglColorRenderbuffer[ue])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),Fe(U.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Be(i.TEXTURE_CUBE_MAP,y);for(let ue=0;ue<6;ue++)if(y.mipmaps&&y.mipmaps.length>0)for(let Ie=0;Ie<y.mipmaps.length;Ie++)Se(U.__webglFramebuffer[ue][Ie],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie);else Se(U.__webglFramebuffer[ue],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);m(y)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let ue=0,Ie=ee.length;ue<Ie;ue++){let Pe=ee[ue],ce=n.get(Pe),ve=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ve=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ve,ce.__webglTexture),Be(ve,Pe),Se(U.__webglFramebuffer,A,Pe,i.COLOR_ATTACHMENT0+ue,ve,0),m(Pe)&&f(ve)}t.unbindTexture()}else{let ue=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ue=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,Y.__webglTexture),Be(ue,y),y.mipmaps&&y.mipmaps.length>0)for(let Ie=0;Ie<y.mipmaps.length;Ie++)Se(U.__webglFramebuffer[Ie],A,y,i.COLOR_ATTACHMENT0,ue,Ie);else Se(U.__webglFramebuffer,A,y,i.COLOR_ATTACHMENT0,ue,0);m(y)&&f(ue),t.unbindTexture()}A.depthBuffer&&qe(A)}function it(A){let y=A.textures;for(let U=0,Y=y.length;U<Y;U++){let ee=y[U];if(m(ee)){let J=T(A),Re=n.get(ee).__webglTexture;t.bindTexture(J,Re),f(J),t.unbindTexture()}}}let H=[],ie=[];function pe(A){if(A.samples>0){if(Me(A)===!1){let y=A.textures,U=A.width,Y=A.height,ee=i.COLOR_BUFFER_BIT,J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(A),ue=y.length>1;if(ue)for(let Pe=0;Pe<y.length;Pe++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);let Ie=A.texture.mipmaps;Ie&&Ie.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let Pe=0;Pe<y.length;Pe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),ue){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Pe]);let ce=n.get(y[Pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ce,0)}i.blitFramebuffer(0,0,U,Y,0,0,U,Y,ee,i.NEAREST),l===!0&&(H.length=0,ie.length=0,H.push(i.COLOR_ATTACHMENT0+Pe),A.depthBuffer&&A.resolveDepthBuffer===!1&&(H.push(J),ie.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ie)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,H))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ue)for(let Pe=0;Pe<y.length;Pe++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Pe]);let ce=n.get(y[Pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.TEXTURE_2D,ce,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let y=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function st(A){return Math.min(r.maxSamples,A.samples)}function Me(A){let y=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function He(A){let y=o.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function Et(A,y){let U=A.colorSpace,Y=A.format,ee=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||U!==bi&&U!==Xn&&(tt.getTransfer(U)===lt?(Y!==pn||ee!==Mn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),y}function vt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=D,this.setTexture2D=Z,this.setTexture2DArray=K,this.setTexture3D=te,this.setTextureCube=z,this.rebindTextures=Ct,this.setupRenderTarget=P,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=pe,this.setupDepthRenderbuffer=qe,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Me}function Xv(i,e){function t(n,r=Xn){let s,o=tt.getTransfer(r);if(n===Mn)return i.UNSIGNED_BYTE;if(n===Ao)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ro)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Hc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Wc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Vc)return i.BYTE;if(n===zc)return i.SHORT;if(n===ar)return i.UNSIGNED_SHORT;if(n===Co)return i.INT;if(n===li)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===lr)return i.HALF_FLOAT;if(n===Gc)return i.ALPHA;if(n===Xc)return i.RGB;if(n===pn)return i.RGBA;if(n===er)return i.DEPTH_COMPONENT;if(n===hr)return i.DEPTH_STENCIL;if(n===qc)return i.RED;if(n===Io)return i.RED_INTEGER;if(n===Yc)return i.RG;if(n===Po)return i.RG_INTEGER;if(n===Lo)return i.RGBA_INTEGER;if(n===ns||n===is||n===rs||n===ss)if(o===lt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ns)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===is)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===rs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ss)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ns)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===is)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===rs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ss)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Do||n===Fo||n===No||n===Oo)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Do)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Fo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===No)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Uo||n===ko||n===Bo)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Uo||n===ko)return o===lt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Bo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Vo||n===zo||n===Ho||n===Wo||n===Go||n===Xo||n===qo||n===Yo||n===$o||n===Ko||n===Jo||n===Zo||n===jo||n===Qo)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Vo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ho)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Go)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===qo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===$o)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ko)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Zo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Qo)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ea||n===ta||n===na)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===ea)return o===lt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ta)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===na)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ia||n===ra||n===sa||n===oa)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===ia)return s.COMPRESSED_RED_RGTC1_EXT;if(n===ra)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oa)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===cr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var qv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Yv=`
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

}`,mh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Hr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new bn({vertexShader:qv,fragmentShader:Yv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ut(new Xr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gh=class extends zn{constructor(e,t){super();let n=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null,M=typeof XRWebGLBinding<"u",m=new mh,f={},T=t.getContextAttributes(),E=null,b=null,v=[],S=[],C=new Ye,R=null,_=new It;_.viewport=new bt;let x=new It;x.viewport=new bt;let I=[_,x],D=new mo,V=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ne=v[q];return ne===void 0&&(ne=new sr,v[q]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(q){let ne=v[q];return ne===void 0&&(ne=new sr,v[q]=ne),ne.getGripSpace()},this.getHand=function(q){let ne=v[q];return ne===void 0&&(ne=new sr,v[q]=ne),ne.getHandSpace()};function Z(q){let ne=S.indexOf(q.inputSource);if(ne===-1)return;let Se=v[ne];Se!==void 0&&(Se.update(q.inputSource,q.frame,c||o),Se.dispatchEvent({type:q.type,data:q.inputSource}))}function K(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",te);for(let q=0;q<v.length;q++){let ne=S[q];ne!==null&&(S[q]=null,v[q].disconnect(ne))}V=null,W=null,m.reset();for(let q in f)delete f[q];e.setRenderTarget(E),p=null,d=null,u=null,r=null,b=null,et.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(E=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",K),r.addEventListener("inputsourceschange",te),T.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,Fe=null,Ae=null;T.depth&&(Ae=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=T.stencil?hr:er,Fe=T.stencil?cr:li);let qe={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(qe),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new Tn(d.textureWidth,d.textureHeight,{format:pn,type:Mn,depthTexture:new zr(d.textureWidth,d.textureHeight,Fe,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let Se={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,Se),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Tn(p.framebufferWidth,p.framebufferHeight,{format:pn,type:Mn,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),et.setContext(r),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function te(q){for(let ne=0;ne<q.removed.length;ne++){let Se=q.removed[ne],Fe=S.indexOf(Se);Fe>=0&&(S[Fe]=null,v[Fe].disconnect(Se))}for(let ne=0;ne<q.added.length;ne++){let Se=q.added[ne],Fe=S.indexOf(Se);if(Fe===-1){for(let qe=0;qe<v.length;qe++)if(qe>=S.length){S.push(Se),Fe=qe;break}else if(S[qe]===null){S[qe]=Se,Fe=qe;break}if(Fe===-1)break}let Ae=v[Fe];Ae&&Ae.connect(Se)}}let z=new O,oe=new O;function de(q,ne,Se){z.setFromMatrixPosition(ne.matrixWorld),oe.setFromMatrixPosition(Se.matrixWorld);let Fe=z.distanceTo(oe),Ae=ne.projectionMatrix.elements,qe=Se.projectionMatrix.elements,Ct=Ae[14]/(Ae[10]-1),P=Ae[14]/(Ae[10]+1),it=(Ae[9]+1)/Ae[5],H=(Ae[9]-1)/Ae[5],ie=(Ae[8]-1)/Ae[0],pe=(qe[8]+1)/qe[0],st=Ct*ie,Me=Ct*pe,He=Fe/(-ie+pe),Et=He*-ie;if(ne.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Et),q.translateZ(He),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ae[10]===-1)q.projectionMatrix.copy(ne.projectionMatrix),q.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let vt=Ct+He,A=P+He,y=st-Et,U=Me+(Fe-Et),Y=it*P/A*vt,ee=H*P/A*vt;q.projectionMatrix.makePerspective(y,U,Y,ee,vt,A),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Ee(q,ne){ne===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(ne.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let ne=q.near,Se=q.far;m.texture!==null&&(m.depthNear>0&&(ne=m.depthNear),m.depthFar>0&&(Se=m.depthFar)),D.near=x.near=_.near=ne,D.far=x.far=_.far=Se,(V!==D.near||W!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),V=D.near,W=D.far),D.layers.mask=q.layers.mask|6,_.layers.mask=D.layers.mask&3,x.layers.mask=D.layers.mask&5;let Fe=q.parent,Ae=D.cameras;Ee(D,Fe);for(let qe=0;qe<Ae.length;qe++)Ee(Ae[qe],Fe);Ae.length===2?de(D,_,x):D.projectionMatrix.copy(_.projectionMatrix),Be(q,D,Fe)};function Be(q,ne,Se){Se===null?q.matrix.copy(ne.matrixWorld):(q.matrix.copy(Se.matrixWorld),q.matrix.invert(),q.matrix.multiply(ne.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(ne.projectionMatrix),q.projectionMatrixInverse.copy(ne.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Mi*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(q){return f[q]};let at=null;function rt(q,ne){if(h=ne.getViewerPose(c||o),g=ne,h!==null){let Se=h.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let Fe=!1;Se.length!==D.cameras.length&&(D.cameras.length=0,Fe=!0);for(let P=0;P<Se.length;P++){let it=Se[P],H=null;if(p!==null)H=p.getViewport(it);else{let pe=u.getViewSubImage(d,it);H=pe.viewport,P===0&&(e.setRenderTargetTextures(b,pe.colorTexture,pe.depthStencilTexture),e.setRenderTarget(b))}let ie=I[P];ie===void 0&&(ie=new It,ie.layers.enable(P),ie.viewport=new bt,I[P]=ie),ie.matrix.fromArray(it.transform.matrix),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.projectionMatrix.fromArray(it.projectionMatrix),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert(),ie.viewport.set(H.x,H.y,H.width,H.height),P===0&&(D.matrix.copy(ie.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Fe===!0&&D.cameras.push(ie)}let Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){u=n.getBinding();let P=u.getDepthInformation(Se[0]);P&&P.isValid&&P.texture&&m.init(P,r.renderState)}if(Ae&&Ae.includes("camera-access")&&M){e.state.unbindTexture(),u=n.getBinding();for(let P=0;P<Se.length;P++){let it=Se[P].camera;if(it){let H=f[it];H||(H=new Hr,f[it]=H);let ie=u.getCameraImage(it);H.sourceTexture=ie}}}}for(let Se=0;Se<v.length;Se++){let Fe=S[Se],Ae=v[Se];Fe!==null&&Ae!==void 0&&Ae.update(Fe,ne,c||o)}at&&at(q,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),g=null}let et=new Lf;et.setAnimationLoop(rt),this.setAnimationLoop=function(q){at=q},this.dispose=function(){}}},Ii=new _n,$v=new xt;function Kv(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Qc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,T,E,b){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),u(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,b)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),M(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,T,E):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Yt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Yt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let T=e.get(f),E=T.envMap,b=T.envMapRotation;E&&(m.envMap.value=E,Ii.copy(b),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),m.envMapRotation.value.setFromMatrix4($v.makeRotationFromEuler(Ii)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,T,E){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*T,m.scale.value=E*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,T){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Yt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function M(m,f){let T=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Jv(i,e,t,n){let r={},s={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,E){let b=E.program;n.uniformBlockBinding(T,b)}function c(T,E){let b=r[T.id];b===void 0&&(g(T),b=h(T),r[T.id]=b,T.addEventListener("dispose",m));let v=E.program;n.updateUBOMapping(T,v);let S=e.render.frame;s[T.id]!==S&&(d(T),s[T.id]=S)}function h(T){let E=u();T.__bindingPointIndex=E;let b=i.createBuffer(),v=T.__size,S=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,v,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,b),b}function u(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){let E=r[T.id],b=T.uniforms,v=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let S=0,C=b.length;S<C;S++){let R=Array.isArray(b[S])?b[S]:[b[S]];for(let _=0,x=R.length;_<x;_++){let I=R[_];if(p(I,S,_,v)===!0){let D=I.__offset,V=Array.isArray(I.value)?I.value:[I.value],W=0;for(let Z=0;Z<V.length;Z++){let K=V[Z],te=M(K);typeof K=="number"||typeof K=="boolean"?(I.__data[0]=K,i.bufferSubData(i.UNIFORM_BUFFER,D+W,I.__data)):K.isMatrix3?(I.__data[0]=K.elements[0],I.__data[1]=K.elements[1],I.__data[2]=K.elements[2],I.__data[3]=0,I.__data[4]=K.elements[3],I.__data[5]=K.elements[4],I.__data[6]=K.elements[5],I.__data[7]=0,I.__data[8]=K.elements[6],I.__data[9]=K.elements[7],I.__data[10]=K.elements[8],I.__data[11]=0):(K.toArray(I.__data,W),W+=te.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(T,E,b,v){let S=T.value,C=E+"_"+b;if(v[C]===void 0)return typeof S=="number"||typeof S=="boolean"?v[C]=S:v[C]=S.clone(),!0;{let R=v[C];if(typeof S=="number"||typeof S=="boolean"){if(R!==S)return v[C]=S,!0}else if(R.equals(S)===!1)return R.copy(S),!0}return!1}function g(T){let E=T.uniforms,b=0,v=16;for(let C=0,R=E.length;C<R;C++){let _=Array.isArray(E[C])?E[C]:[E[C]];for(let x=0,I=_.length;x<I;x++){let D=_[x],V=Array.isArray(D.value)?D.value:[D.value];for(let W=0,Z=V.length;W<Z;W++){let K=V[W],te=M(K),z=b%v,oe=z%te.boundary,de=z+oe;b+=oe,de!==0&&v-de<te.storage&&(b+=v-de),D.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=b,b+=te.storage}}}let S=b%v;return S>0&&(b+=v-S),T.__size=b,T.__cache={},this}function M(T){let E={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(E.boundary=4,E.storage=4):T.isVector2?(E.boundary=8,E.storage=8):T.isVector3||T.isColor?(E.boundary=16,E.storage=12):T.isVector4?(E.boundary=16,E.storage=16):T.isMatrix3?(E.boundary=48,E.storage=48):T.isMatrix4?(E.boundary=64,E.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),E}function m(T){let E=T.target;E.removeEventListener("dispose",m);let b=o.indexOf(E.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(r[E.id]),delete r[E.id],delete s[E.id]}function f(){for(let T in r)i.deleteBuffer(r[T]);o=[],r={},s={}}return{bind:l,update:c,dispose:f}}var ua=class{constructor(e={}){let{canvas:t=rf(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),M=new Int32Array(4),m=null,f=null,T=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Gn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let b=this,v=!1;this._outputColorSpace=qt;let S=0,C=0,R=null,_=-1,x=null,I=new bt,D=new bt,V=null,W=new $e(0),Z=0,K=t.width,te=t.height,z=1,oe=null,de=null,Ee=new bt(0,0,K,te),Be=new bt(0,0,K,te),at=!1,rt=new or,et=!1,q=!1,ne=new xt,Se=new O,Fe=new bt,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qe=!1;function Ct(){return R===null?z:1}let P=n;function it(w,k){return t.getContext(w,k)}try{let w={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",fe,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",ae,!1),P===null){let k="webgl2";if(P=it(k,w),P===null)throw it(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let H,ie,pe,st,Me,He,Et,vt,A,y,U,Y,ee,J,Re,ue,Ie,Pe,ce,ve,Ue,Le,ge,Ge;function F(){H=new p0(P),H.init(),Le=new Xv(P,H),ie=new a0(P,H,e,Le),pe=new Wv(P,H),ie.reversedDepthBuffer&&d&&pe.buffers.depth.setReversed(!0),st=new y0(P),Me=new Iv,He=new Gv(P,H,pe,Me,ie,Le,st),Et=new c0(b),vt=new f0(b),A=new Mm(P),ge=new s0(P,A),y=new m0(P,A,st,ge),U=new x0(P,y,A,st),ce=new v0(P,ie,He),ue=new l0(Me),Y=new Rv(b,Et,vt,H,ie,ge,ue),ee=new Kv(b,Me),J=new Lv,Re=new kv(H),Pe=new r0(b,Et,vt,pe,U,p,l),Ie=new zv(b,U,ie),Ge=new Jv(P,st,ie,pe),ve=new o0(P,H,st),Ue=new g0(P,H,st),st.programs=Y.programs,b.capabilities=ie,b.extensions=H,b.properties=Me,b.renderLists=J,b.shadowMap=Ie,b.state=pe,b.info=st}F();let he=new gh(b,P);this.xr=he,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let w=H.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=H.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(w){w!==void 0&&(z=w,this.setSize(K,te,!1))},this.getSize=function(w){return w.set(K,te)},this.setSize=function(w,k,G=!0){if(he.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=w,te=k,t.width=Math.floor(w*z),t.height=Math.floor(k*z),G===!0&&(t.style.width=w+"px",t.style.height=k+"px"),this.setViewport(0,0,w,k)},this.getDrawingBufferSize=function(w){return w.set(K*z,te*z).floor()},this.setDrawingBufferSize=function(w,k,G){K=w,te=k,z=G,t.width=Math.floor(w*G),t.height=Math.floor(k*G),this.setViewport(0,0,w,k)},this.getCurrentViewport=function(w){return w.copy(I)},this.getViewport=function(w){return w.copy(Ee)},this.setViewport=function(w,k,G,X){w.isVector4?Ee.set(w.x,w.y,w.z,w.w):Ee.set(w,k,G,X),pe.viewport(I.copy(Ee).multiplyScalar(z).round())},this.getScissor=function(w){return w.copy(Be)},this.setScissor=function(w,k,G,X){w.isVector4?Be.set(w.x,w.y,w.z,w.w):Be.set(w,k,G,X),pe.scissor(D.copy(Be).multiplyScalar(z).round())},this.getScissorTest=function(){return at},this.setScissorTest=function(w){pe.setScissorTest(at=w)},this.setOpaqueSort=function(w){oe=w},this.setTransparentSort=function(w){de=w},this.getClearColor=function(w){return w.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(w=!0,k=!0,G=!0){let X=0;if(w){let B=!1;if(R!==null){let le=R.texture.format;B=le===Lo||le===Po||le===Io}if(B){let le=R.texture.type,ye=le===Mn||le===li||le===ar||le===cr||le===Ao||le===Ro,Te=Pe.getClearColor(),be=Pe.getClearAlpha(),Oe=Te.r,ke=Te.g,De=Te.b;ye?(g[0]=Oe,g[1]=ke,g[2]=De,g[3]=be,P.clearBufferuiv(P.COLOR,0,g)):(M[0]=Oe,M[1]=ke,M[2]=De,M[3]=be,P.clearBufferiv(P.COLOR,0,M))}else X|=P.COLOR_BUFFER_BIT}k&&(X|=P.DEPTH_BUFFER_BIT),G&&(X|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",fe,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",ae,!1),Pe.dispose(),J.dispose(),Re.dispose(),Me.dispose(),Et.dispose(),vt.dispose(),U.dispose(),ge.dispose(),Ge.dispose(),Y.dispose(),he.dispose(),he.removeEventListener("sessionstart",En),he.removeEventListener("sessionend",Hu),fi.stop()};function fe(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),v=!0}function we(){console.log("THREE.WebGLRenderer: Context Restored."),v=!1;let w=st.autoReset,k=Ie.enabled,G=Ie.autoUpdate,X=Ie.needsUpdate,B=Ie.type;F(),st.autoReset=w,Ie.enabled=k,Ie.autoUpdate=G,Ie.needsUpdate=X,Ie.type=B}function ae(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Q(w){let k=w.target;k.removeEventListener("dispose",Q),Ce(k)}function Ce(w){ze(w),Me.remove(w)}function ze(w){let k=Me.get(w).programs;k!==void 0&&(k.forEach(function(G){Y.releaseProgram(G)}),w.isShaderMaterial&&Y.releaseShaderCache(w))}this.renderBufferDirect=function(w,k,G,X,B,le){k===null&&(k=Ae);let ye=B.isMesh&&B.matrixWorld.determinant()<0,Te=mp(w,k,G,X,B);pe.setMaterial(X,ye);let be=G.index,Oe=1;if(X.wireframe===!0){if(be=y.getWireframeAttribute(G),be===void 0)return;Oe=2}let ke=G.drawRange,De=G.attributes.position,Ze=ke.start*Oe,ht=(ke.start+ke.count)*Oe;le!==null&&(Ze=Math.max(Ze,le.start*Oe),ht=Math.min(ht,(le.start+le.count)*Oe)),be!==null?(Ze=Math.max(Ze,0),ht=Math.min(ht,be.count)):De!=null&&(Ze=Math.max(Ze,0),ht=Math.min(ht,De.count));let wt=ht-Ze;if(wt<0||wt===1/0)return;ge.setup(B,X,Te,G,be);let mt,ut=ve;if(be!==null&&(mt=A.get(be),ut=Ue,ut.setIndex(mt)),B.isMesh)X.wireframe===!0?(pe.setLineWidth(X.wireframeLinewidth*Ct()),ut.setMode(P.LINES)):ut.setMode(P.TRIANGLES);else if(B.isLine){let Ne=X.linewidth;Ne===void 0&&(Ne=1),pe.setLineWidth(Ne*Ct()),B.isLineSegments?ut.setMode(P.LINES):B.isLineLoop?ut.setMode(P.LINE_LOOP):ut.setMode(P.LINE_STRIP)}else B.isPoints?ut.setMode(P.POINTS):B.isSprite&&ut.setMode(P.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)tr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(H.get("WEBGL_multi_draw"))ut.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let Ne=B._multiDrawStarts,_t=B._multiDrawCounts,nt=B._multiDrawCount,en=be?A.get(be).bytesPerElement:1,Bi=Me.get(X).currentProgram.getUniforms();for(let tn=0;tn<nt;tn++)Bi.setValue(P,"_gl_DrawID",tn),ut.render(Ne[tn]/en,_t[tn])}else if(B.isInstancedMesh)ut.renderInstances(Ze,wt,B.count);else if(G.isInstancedBufferGeometry){let Ne=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,_t=Math.min(G.instanceCount,Ne);ut.renderInstances(Ze,wt,_t)}else ut.render(Ze,wt)};function ft(w,k,G){w.transparent===!0&&w.side===cn&&w.forceSinglePass===!1?(w.side=Yt,w.needsUpdate=!0,ws(w,k,G),w.side=Vn,w.needsUpdate=!0,ws(w,k,G),w.side=cn):ws(w,k,G)}this.compile=function(w,k,G=null){G===null&&(G=w),f=Re.get(G),f.init(k),E.push(f),G.traverseVisible(function(B){B.isLight&&B.layers.test(k.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),w!==G&&w.traverseVisible(function(B){B.isLight&&B.layers.test(k.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),f.setupLights();let X=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let le=B.material;if(le)if(Array.isArray(le))for(let ye=0;ye<le.length;ye++){let Te=le[ye];ft(Te,G,B),X.add(Te)}else ft(le,G,B),X.add(le)}),f=E.pop(),X},this.compileAsync=function(w,k,G=null){let X=this.compile(w,k,G);return new Promise(B=>{function le(){if(X.forEach(function(ye){Me.get(ye).currentProgram.isReady()&&X.delete(ye)}),X.size===0){B(w);return}setTimeout(le,10)}H.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let ot=null;function Ln(w){ot&&ot(w)}function En(){fi.stop()}function Hu(){fi.start()}let fi=new Lf;fi.setAnimationLoop(Ln),typeof self<"u"&&fi.setContext(self),this.setAnimationLoop=function(w){ot=w,he.setAnimationLoop(w),w===null?fi.stop():fi.start()},he.addEventListener("sessionstart",En),he.addEventListener("sessionend",Hu),this.render=function(w,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(v===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(he.cameraAutoUpdate===!0&&he.updateCamera(k),k=he.getCamera()),w.isScene===!0&&w.onBeforeRender(b,w,k,R),f=Re.get(w,E.length),f.init(k),E.push(f),ne.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),rt.setFromProjectionMatrix(ne,vn,k.reversedDepth),q=this.localClippingEnabled,et=ue.init(this.clippingPlanes,q),m=J.get(w,T.length),m.init(),T.push(m),he.enabled===!0&&he.isPresenting===!0){let le=b.xr.getDepthSensingMesh();le!==null&&ec(le,k,-1/0,b.sortObjects)}ec(w,k,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(oe,de),qe=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,qe&&Pe.addToRenderList(m,w),this.info.render.frame++,et===!0&&ue.beginShadows();let G=f.state.shadowsArray;Ie.render(G,w,k),et===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=m.opaque,B=m.transmissive;if(f.setupLights(),k.isArrayCamera){let le=k.cameras;if(B.length>0)for(let ye=0,Te=le.length;ye<Te;ye++){let be=le[ye];Gu(X,B,w,be)}qe&&Pe.render(w);for(let ye=0,Te=le.length;ye<Te;ye++){let be=le[ye];Wu(m,w,be,be.viewport)}}else B.length>0&&Gu(X,B,w,k),qe&&Pe.render(w),Wu(m,w,k);R!==null&&C===0&&(He.updateMultisampleRenderTarget(R),He.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(b,w,k),ge.resetDefaultState(),_=-1,x=null,E.pop(),E.length>0?(f=E[E.length-1],et===!0&&ue.setGlobalState(b.clippingPlanes,f.state.camera)):f=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function ec(w,k,G,X){if(w.visible===!1)return;if(w.layers.test(k.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(k);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||rt.intersectsSprite(w)){X&&Fe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ne);let ye=U.update(w),Te=w.material;Te.visible&&m.push(w,ye,Te,G,Fe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||rt.intersectsObject(w))){let ye=U.update(w),Te=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Fe.copy(w.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Fe.copy(ye.boundingSphere.center)),Fe.applyMatrix4(w.matrixWorld).applyMatrix4(ne)),Array.isArray(Te)){let be=ye.groups;for(let Oe=0,ke=be.length;Oe<ke;Oe++){let De=be[Oe],Ze=Te[De.materialIndex];Ze&&Ze.visible&&m.push(w,ye,Ze,G,Fe.z,De)}}else Te.visible&&m.push(w,ye,Te,G,Fe.z,null)}}let le=w.children;for(let ye=0,Te=le.length;ye<Te;ye++)ec(le[ye],k,G,X)}function Wu(w,k,G,X){let B=w.opaque,le=w.transmissive,ye=w.transparent;f.setupLightsView(G),et===!0&&ue.setGlobalState(b.clippingPlanes,G),X&&pe.viewport(I.copy(X)),B.length>0&&Ms(B,k,G),le.length>0&&Ms(le,k,G),ye.length>0&&Ms(ye,k,G),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function Gu(w,k,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[X.id]===void 0&&(f.state.transmissionRenderTarget[X.id]=new Tn(1,1,{generateMipmaps:!0,type:H.has("EXT_color_buffer_half_float")||H.has("EXT_color_buffer_float")?lr:Mn,minFilter:ai,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let le=f.state.transmissionRenderTarget[X.id],ye=X.viewport||I;le.setSize(ye.z*b.transmissionResolutionScale,ye.w*b.transmissionResolutionScale);let Te=b.getRenderTarget(),be=b.getActiveCubeFace(),Oe=b.getActiveMipmapLevel();b.setRenderTarget(le),b.getClearColor(W),Z=b.getClearAlpha(),Z<1&&b.setClearColor(16777215,.5),b.clear(),qe&&Pe.render(G);let ke=b.toneMapping;b.toneMapping=Gn;let De=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),f.setupLightsView(X),et===!0&&ue.setGlobalState(b.clippingPlanes,X),Ms(w,G,X),He.updateMultisampleRenderTarget(le),He.updateRenderTargetMipmap(le),H.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let ht=0,wt=k.length;ht<wt;ht++){let mt=k[ht],ut=mt.object,Ne=mt.geometry,_t=mt.material,nt=mt.group;if(_t.side===cn&&ut.layers.test(X.layers)){let en=_t.side;_t.side=Yt,_t.needsUpdate=!0,Xu(ut,G,X,Ne,_t,nt),_t.side=en,_t.needsUpdate=!0,Ze=!0}}Ze===!0&&(He.updateMultisampleRenderTarget(le),He.updateRenderTargetMipmap(le))}b.setRenderTarget(Te,be,Oe),b.setClearColor(W,Z),De!==void 0&&(X.viewport=De),b.toneMapping=ke}function Ms(w,k,G){let X=k.isScene===!0?k.overrideMaterial:null;for(let B=0,le=w.length;B<le;B++){let ye=w[B],Te=ye.object,be=ye.geometry,Oe=ye.group,ke=ye.material;ke.allowOverride===!0&&X!==null&&(ke=X),Te.layers.test(G.layers)&&Xu(Te,k,G,be,ke,Oe)}}function Xu(w,k,G,X,B,le){w.onBeforeRender(b,k,G,X,B,le),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(b,k,G,X,w,le),B.transparent===!0&&B.side===cn&&B.forceSinglePass===!1?(B.side=Yt,B.needsUpdate=!0,b.renderBufferDirect(G,k,X,B,w,le),B.side=Vn,B.needsUpdate=!0,b.renderBufferDirect(G,k,X,B,w,le),B.side=cn):b.renderBufferDirect(G,k,X,B,w,le),w.onAfterRender(b,k,G,X,B,le)}function ws(w,k,G){k.isScene!==!0&&(k=Ae);let X=Me.get(w),B=f.state.lights,le=f.state.shadowsArray,ye=B.state.version,Te=Y.getParameters(w,B.state,le,k,G),be=Y.getProgramCacheKey(Te),Oe=X.programs;X.environment=w.isMeshStandardMaterial?k.environment:null,X.fog=k.fog,X.envMap=(w.isMeshStandardMaterial?vt:Et).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?k.environmentRotation:w.envMapRotation,Oe===void 0&&(w.addEventListener("dispose",Q),Oe=new Map,X.programs=Oe);let ke=Oe.get(be);if(ke!==void 0){if(X.currentProgram===ke&&X.lightsStateVersion===ye)return Yu(w,Te),ke}else Te.uniforms=Y.getUniforms(w),w.onBeforeCompile(Te,b),ke=Y.acquireProgram(Te,be),Oe.set(be,ke),X.uniforms=Te.uniforms;let De=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(De.clippingPlanes=ue.uniform),Yu(w,Te),X.needsLights=yp(w),X.lightsStateVersion=ye,X.needsLights&&(De.ambientLightColor.value=B.state.ambient,De.lightProbe.value=B.state.probe,De.directionalLights.value=B.state.directional,De.directionalLightShadows.value=B.state.directionalShadow,De.spotLights.value=B.state.spot,De.spotLightShadows.value=B.state.spotShadow,De.rectAreaLights.value=B.state.rectArea,De.ltc_1.value=B.state.rectAreaLTC1,De.ltc_2.value=B.state.rectAreaLTC2,De.pointLights.value=B.state.point,De.pointLightShadows.value=B.state.pointShadow,De.hemisphereLights.value=B.state.hemi,De.directionalShadowMap.value=B.state.directionalShadowMap,De.directionalShadowMatrix.value=B.state.directionalShadowMatrix,De.spotShadowMap.value=B.state.spotShadowMap,De.spotLightMatrix.value=B.state.spotLightMatrix,De.spotLightMap.value=B.state.spotLightMap,De.pointShadowMap.value=B.state.pointShadowMap,De.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=ke,X.uniformsList=null,ke}function qu(w){if(w.uniformsList===null){let k=w.currentProgram.getUniforms();w.uniformsList=pr.seqWithValue(k.seq,w.uniforms)}return w.uniformsList}function Yu(w,k){let G=Me.get(w);G.outputColorSpace=k.outputColorSpace,G.batching=k.batching,G.batchingColor=k.batchingColor,G.instancing=k.instancing,G.instancingColor=k.instancingColor,G.instancingMorph=k.instancingMorph,G.skinning=k.skinning,G.morphTargets=k.morphTargets,G.morphNormals=k.morphNormals,G.morphColors=k.morphColors,G.morphTargetsCount=k.morphTargetsCount,G.numClippingPlanes=k.numClippingPlanes,G.numIntersection=k.numClipIntersection,G.vertexAlphas=k.vertexAlphas,G.vertexTangents=k.vertexTangents,G.toneMapping=k.toneMapping}function mp(w,k,G,X,B){k.isScene!==!0&&(k=Ae),He.resetTextureUnits();let le=k.fog,ye=X.isMeshStandardMaterial?k.environment:null,Te=R===null?b.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:bi,be=(X.isMeshStandardMaterial?vt:Et).get(X.envMap||ye),Oe=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ke=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),De=!!G.morphAttributes.position,Ze=!!G.morphAttributes.normal,ht=!!G.morphAttributes.color,wt=Gn;X.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(wt=b.toneMapping);let mt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ut=mt!==void 0?mt.length:0,Ne=Me.get(X),_t=f.state.lights;if(et===!0&&(q===!0||w!==x)){let Gt=w===x&&X.id===_;ue.setState(X,w,Gt)}let nt=!1;X.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==_t.state.version||Ne.outputColorSpace!==Te||B.isBatchedMesh&&Ne.batching===!1||!B.isBatchedMesh&&Ne.batching===!0||B.isBatchedMesh&&Ne.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ne.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ne.instancing===!1||!B.isInstancedMesh&&Ne.instancing===!0||B.isSkinnedMesh&&Ne.skinning===!1||!B.isSkinnedMesh&&Ne.skinning===!0||B.isInstancedMesh&&Ne.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ne.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ne.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ne.instancingMorph===!1&&B.morphTexture!==null||Ne.envMap!==be||X.fog===!0&&Ne.fog!==le||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==ue.numPlanes||Ne.numIntersection!==ue.numIntersection)||Ne.vertexAlphas!==Oe||Ne.vertexTangents!==ke||Ne.morphTargets!==De||Ne.morphNormals!==Ze||Ne.morphColors!==ht||Ne.toneMapping!==wt||Ne.morphTargetsCount!==ut)&&(nt=!0):(nt=!0,Ne.__version=X.version);let en=Ne.currentProgram;nt===!0&&(en=ws(X,k,B));let Bi=!1,tn=!1,Mr=!1,St=en.getUniforms(),hn=Ne.uniforms;if(pe.useProgram(en.program)&&(Bi=!0,tn=!0,Mr=!0),X.id!==_&&(_=X.id,tn=!0),Bi||x!==w){pe.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),St.setValue(P,"projectionMatrix",w.projectionMatrix),St.setValue(P,"viewMatrix",w.matrixWorldInverse);let Jt=St.map.cameraPosition;Jt!==void 0&&Jt.setValue(P,Se.setFromMatrixPosition(w.matrixWorld)),ie.logarithmicDepthBuffer&&St.setValue(P,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&St.setValue(P,"isOrthographic",w.isOrthographicCamera===!0),x!==w&&(x=w,tn=!0,Mr=!0)}if(B.isSkinnedMesh){St.setOptional(P,B,"bindMatrix"),St.setOptional(P,B,"bindMatrixInverse");let Gt=B.skeleton;Gt&&(Gt.boneTexture===null&&Gt.computeBoneTexture(),St.setValue(P,"boneTexture",Gt.boneTexture,He))}B.isBatchedMesh&&(St.setOptional(P,B,"batchingTexture"),St.setValue(P,"batchingTexture",B._matricesTexture,He),St.setOptional(P,B,"batchingIdTexture"),St.setValue(P,"batchingIdTexture",B._indirectTexture,He),St.setOptional(P,B,"batchingColorTexture"),B._colorsTexture!==null&&St.setValue(P,"batchingColorTexture",B._colorsTexture,He));let un=G.morphAttributes;if((un.position!==void 0||un.normal!==void 0||un.color!==void 0)&&ce.update(B,G,en),(tn||Ne.receiveShadow!==B.receiveShadow)&&(Ne.receiveShadow=B.receiveShadow,St.setValue(P,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(hn.envMap.value=be,hn.flipEnvMap.value=be.isCubeTexture&&be.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&k.environment!==null&&(hn.envMapIntensity.value=k.environmentIntensity),tn&&(St.setValue(P,"toneMappingExposure",b.toneMappingExposure),Ne.needsLights&&gp(hn,Mr),le&&X.fog===!0&&ee.refreshFogUniforms(hn,le),ee.refreshMaterialUniforms(hn,X,z,te,f.state.transmissionRenderTarget[w.id]),pr.upload(P,qu(Ne),hn,He)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(pr.upload(P,qu(Ne),hn,He),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&St.setValue(P,"center",B.center),St.setValue(P,"modelViewMatrix",B.modelViewMatrix),St.setValue(P,"normalMatrix",B.normalMatrix),St.setValue(P,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let Gt=X.uniformsGroups;for(let Jt=0,tc=Gt.length;Jt<tc;Jt++){let pi=Gt[Jt];Ge.update(pi,en),Ge.bind(pi,en)}}return en}function gp(w,k){w.ambientLightColor.needsUpdate=k,w.lightProbe.needsUpdate=k,w.directionalLights.needsUpdate=k,w.directionalLightShadows.needsUpdate=k,w.pointLights.needsUpdate=k,w.pointLightShadows.needsUpdate=k,w.spotLights.needsUpdate=k,w.spotLightShadows.needsUpdate=k,w.rectAreaLights.needsUpdate=k,w.hemisphereLights.needsUpdate=k}function yp(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,k,G){let X=Me.get(w);X.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Me.get(w.texture).__webglTexture=k,Me.get(w.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,k){let G=Me.get(w);G.__webglFramebuffer=k,G.__useDefaultFramebuffer=k===void 0};let vp=P.createFramebuffer();this.setRenderTarget=function(w,k=0,G=0){R=w,S=k,C=G;let X=!0,B=null,le=!1,ye=!1;if(w){let be=Me.get(w);if(be.__useDefaultFramebuffer!==void 0)pe.bindFramebuffer(P.FRAMEBUFFER,null),X=!1;else if(be.__webglFramebuffer===void 0)He.setupRenderTarget(w);else if(be.__hasExternalTextures)He.rebindTextures(w,Me.get(w.texture).__webglTexture,Me.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let De=w.depthTexture;if(be.__boundDepthTexture!==De){if(De!==null&&Me.has(De)&&(w.width!==De.image.width||w.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");He.setupDepthRenderbuffer(w)}}let Oe=w.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(ye=!0);let ke=Me.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ke[k])?B=ke[k][G]:B=ke[k],le=!0):w.samples>0&&He.useMultisampledRTT(w)===!1?B=Me.get(w).__webglMultisampledFramebuffer:Array.isArray(ke)?B=ke[G]:B=ke,I.copy(w.viewport),D.copy(w.scissor),V=w.scissorTest}else I.copy(Ee).multiplyScalar(z).floor(),D.copy(Be).multiplyScalar(z).floor(),V=at;if(G!==0&&(B=vp),pe.bindFramebuffer(P.FRAMEBUFFER,B)&&X&&pe.drawBuffers(w,B),pe.viewport(I),pe.scissor(D),pe.setScissorTest(V),le){let be=Me.get(w.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+k,be.__webglTexture,G)}else if(ye){let be=k;for(let Oe=0;Oe<w.textures.length;Oe++){let ke=Me.get(w.textures[Oe]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Oe,ke.__webglTexture,G,be)}}else if(w!==null&&G!==0){let be=Me.get(w.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,be.__webglTexture,G)}_=-1},this.readRenderTargetPixels=function(w,k,G,X,B,le,ye,Te=0){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Me.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(be=be[ye]),be){pe.bindFramebuffer(P.FRAMEBUFFER,be);try{let Oe=w.textures[Te],ke=Oe.format,De=Oe.type;if(!ie.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ie.textureTypeReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=w.width-X&&G>=0&&G<=w.height-B&&(w.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Te),P.readPixels(k,G,X,B,Le.convert(ke),Le.convert(De),le))}finally{let Oe=R!==null?Me.get(R).__webglFramebuffer:null;pe.bindFramebuffer(P.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(w,k,G,X,B,le,ye,Te=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Me.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(be=be[ye]),be)if(k>=0&&k<=w.width-X&&G>=0&&G<=w.height-B){pe.bindFramebuffer(P.FRAMEBUFFER,be);let Oe=w.textures[Te],ke=Oe.format,De=Oe.type;if(!ie.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ie.textureTypeReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ze=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ze),P.bufferData(P.PIXEL_PACK_BUFFER,le.byteLength,P.STREAM_READ),w.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Te),P.readPixels(k,G,X,B,Le.convert(ke),Le.convert(De),0);let ht=R!==null?Me.get(R).__webglFramebuffer:null;pe.bindFramebuffer(P.FRAMEBUFFER,ht);let wt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await sf(P,wt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ze),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,le),P.deleteBuffer(Ze),P.deleteSync(wt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,k=null,G=0){let X=Math.pow(2,-G),B=Math.floor(w.image.width*X),le=Math.floor(w.image.height*X),ye=k!==null?k.x:0,Te=k!==null?k.y:0;He.setTexture2D(w,0),P.copyTexSubImage2D(P.TEXTURE_2D,G,0,0,ye,Te,B,le),pe.unbindTexture()};let xp=P.createFramebuffer(),_p=P.createFramebuffer();this.copyTextureToTexture=function(w,k,G=null,X=null,B=0,le=null){le===null&&(B!==0?(tr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=B,B=0):le=0);let ye,Te,be,Oe,ke,De,Ze,ht,wt,mt=w.isCompressedTexture?w.mipmaps[le]:w.image;if(G!==null)ye=G.max.x-G.min.x,Te=G.max.y-G.min.y,be=G.isBox3?G.max.z-G.min.z:1,Oe=G.min.x,ke=G.min.y,De=G.isBox3?G.min.z:0;else{let un=Math.pow(2,-B);ye=Math.floor(mt.width*un),Te=Math.floor(mt.height*un),w.isDataArrayTexture?be=mt.depth:w.isData3DTexture?be=Math.floor(mt.depth*un):be=1,Oe=0,ke=0,De=0}X!==null?(Ze=X.x,ht=X.y,wt=X.z):(Ze=0,ht=0,wt=0);let ut=Le.convert(k.format),Ne=Le.convert(k.type),_t;k.isData3DTexture?(He.setTexture3D(k,0),_t=P.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(He.setTexture2DArray(k,0),_t=P.TEXTURE_2D_ARRAY):(He.setTexture2D(k,0),_t=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,k.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,k.unpackAlignment);let nt=P.getParameter(P.UNPACK_ROW_LENGTH),en=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Bi=P.getParameter(P.UNPACK_SKIP_PIXELS),tn=P.getParameter(P.UNPACK_SKIP_ROWS),Mr=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,mt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,mt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Oe),P.pixelStorei(P.UNPACK_SKIP_ROWS,ke),P.pixelStorei(P.UNPACK_SKIP_IMAGES,De);let St=w.isDataArrayTexture||w.isData3DTexture,hn=k.isDataArrayTexture||k.isData3DTexture;if(w.isDepthTexture){let un=Me.get(w),Gt=Me.get(k),Jt=Me.get(un.__renderTarget),tc=Me.get(Gt.__renderTarget);pe.bindFramebuffer(P.READ_FRAMEBUFFER,Jt.__webglFramebuffer),pe.bindFramebuffer(P.DRAW_FRAMEBUFFER,tc.__webglFramebuffer);for(let pi=0;pi<be;pi++)St&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Me.get(w).__webglTexture,B,De+pi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Me.get(k).__webglTexture,le,wt+pi)),P.blitFramebuffer(Oe,ke,ye,Te,Ze,ht,ye,Te,P.DEPTH_BUFFER_BIT,P.NEAREST);pe.bindFramebuffer(P.READ_FRAMEBUFFER,null),pe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(B!==0||w.isRenderTargetTexture||Me.has(w)){let un=Me.get(w),Gt=Me.get(k);pe.bindFramebuffer(P.READ_FRAMEBUFFER,xp),pe.bindFramebuffer(P.DRAW_FRAMEBUFFER,_p);for(let Jt=0;Jt<be;Jt++)St?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,un.__webglTexture,B,De+Jt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,un.__webglTexture,B),hn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Gt.__webglTexture,le,wt+Jt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Gt.__webglTexture,le),B!==0?P.blitFramebuffer(Oe,ke,ye,Te,Ze,ht,ye,Te,P.COLOR_BUFFER_BIT,P.NEAREST):hn?P.copyTexSubImage3D(_t,le,Ze,ht,wt+Jt,Oe,ke,ye,Te):P.copyTexSubImage2D(_t,le,Ze,ht,Oe,ke,ye,Te);pe.bindFramebuffer(P.READ_FRAMEBUFFER,null),pe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else hn?w.isDataTexture||w.isData3DTexture?P.texSubImage3D(_t,le,Ze,ht,wt,ye,Te,be,ut,Ne,mt.data):k.isCompressedArrayTexture?P.compressedTexSubImage3D(_t,le,Ze,ht,wt,ye,Te,be,ut,mt.data):P.texSubImage3D(_t,le,Ze,ht,wt,ye,Te,be,ut,Ne,mt):w.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,le,Ze,ht,ye,Te,ut,Ne,mt.data):w.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,le,Ze,ht,mt.width,mt.height,ut,mt.data):P.texSubImage2D(P.TEXTURE_2D,le,Ze,ht,ye,Te,ut,Ne,mt);P.pixelStorei(P.UNPACK_ROW_LENGTH,nt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,en),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Bi),P.pixelStorei(P.UNPACK_SKIP_ROWS,tn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Mr),le===0&&k.generateMipmaps&&P.generateMipmap(_t),pe.unbindTexture()},this.initRenderTarget=function(w){Me.get(w).__webglFramebuffer===void 0&&He.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?He.setTextureCube(w,0):w.isData3DTexture?He.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?He.setTexture2DArray(w,0):He.setTexture2D(w,0),pe.unbindTexture()},this.resetState=function(){S=0,C=0,R=null,pe.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var ci;(function(i){i[i.Disabled=0]="Disabled",i[i.Error=1]="Error",i[i.Warning=2]="Warning",i[i.Info=3]="Info",i[i.Debug=4]="Debug"})(ci||(ci={}));var fa=class{constructor(){this.logLevel=ci.Debug,this.includeStack=!0}};var vh=class{InitLogging(e,t){this.ValidateContext(),this.context.logLevel=e,this.context.includeStack=t}Debug(e){this.ValidateContext(),this.context.logLevel>=ci.Debug&&this.CommonLog("Debug",e)}Info(e){this.ValidateContext(),this.context.logLevel>=ci.Info&&this.CommonLog("Info",e)}Warning(e){this.ValidateContext(),this.context.logLevel>=ci.Warning&&this.CommonLog("Warning",e)}Error(e){this.ValidateContext(),this.context.logLevel>=ci.Error&&this.CommonLog("Error",e)}CommonLog(e,t){let n=`[${e}] - ${t}`;this.context.includeStack&&(n+=`
Stack: ${this.GetStackTrace()}`),e==="Error"?console.error(n):e==="Warning"?console.warn(n):console.log(n)}GetStackTrace(){let e=new Error,t="No Stack Available for this browser";return e.stack&&(t=e.stack.toString().replace(/Error/g,"")),t}ValidateContext(){this.context||(typeof window>"u"||!window?this.context=new fa:window.loggerContext?this.context=window.loggerContext:(this.context=new fa,window.loggerContext=this.context))}},L=new vh;var pa=class{constructor(e){this._args=[],this._callback=e}handleEvent(e){this._callback(...this._args),this._args=[]}setArgs(...e){this._args=e}},gr=class extends EventTarget{constructor(){super(),this._eventListeners=new Map}removeListenerInternal(e,t){if(this._eventListeners.has(e)){let n=this._eventListeners.get(e);if(n===void 0)return this;for(let r=0;r<n.length;++r){let s=n[r];if(s.callback===t){super.removeEventListener(e,s.eventListenerWrapper),n.splice(r,1);break}}}return this}addListener(e,t){return this.on(e,t)}on(e,t){var n;let r=new pa(t);return super.addEventListener(e,r),this._eventListeners.has(e)||this._eventListeners.set(e,new Array),(n=this._eventListeners.get(e))===null||n===void 0||n.push({callback:t,eventListenerWrapper:r}),this}once(e,t){var n;let r={once:!0},s=new pa((...o)=>{t(...o),this.removeListenerInternal(e,t)});return super.addEventListener(e,s,r),this._eventListeners.has(e)||this._eventListeners.set(e,new Array),(n=this._eventListeners.get(e))===null||n===void 0||n.push({callback:t,eventListenerWrapper:s}),this}removeListener(e,t){return this.removeListenerInternal(e,t),this}off(e,t){return this.removeListener(e,t)}removeAllListeners(e){if(this._eventListeners.has(e)){let t=this._eventListeners.get(e);if(t===void 0)return this;for(let n of t)this.removeEventListener(e,n.eventListenerWrapper);this._eventListeners.delete(e)}return this}emit(e,...t){if(this._eventListeners.has(e)){let n=this._eventListeners.get(e);if(n===void 0)return!1;for(let r of n)r.eventListenerWrapper.setArgs(...t);return super.dispatchEvent(new Event(e)),!0}return!1}};var Di=class extends gr{constructor(e){super(),this.WS_OPEN_STATE=1,this.protocols=e}sendMessage(e){this.webSocket&&this.webSocket.send(e)}connect(e){L.Info(e);try{return this.webSocket=new WebSocket(e,this.protocols),this.webSocket.onopen=t=>this.handleOnOpen(),this.webSocket.onerror=t=>this.handleOnError(),this.webSocket.onclose=t=>this.handleOnClose(t),this.webSocket.onmessage=t=>this.handleOnMessage(t),this.webSocket.onmessagebinary=t=>this.handleOnMessageBinary(t),!0}catch(t){return L.Error(t instanceof Error?t.message:String(t)),!1}}disconnect(e,t){this.webSocket&&this.webSocket.close(e,t)}isConnected(){return!!this.webSocket&&this.webSocket.readyState!=WebSocket.CLOSED}handleOnMessageBinary(e){!e||!e.data||e.data.text().then(t=>{let n=new MessageEvent("messageFromBinary",{data:t});this.handleOnMessage(n)}).catch(t=>{L.Error(`Failed to parse binary blob from websocket, reason: ${t.message}`)})}handleOnMessage(e){if(e.data&&e.data instanceof Blob){this.handleOnMessageBinary(e);return}this.onMessage&&this.onMessage(e.data)}handleOnOpen(){L.Info("Connected to the signalling server via WebSocket"),this.emit("open")}handleOnError(){this.emit("error")}handleOnClose(e){L.Info("Disconnected to the signalling server via WebSocket: "+JSON.stringify(e.code)+" - "+e.reason),this.emit("close",e)}};var ma=Di.prototype;if(!ma.portfolioReadyGuardV169){ma.portfolioReadyGuardV169=!0;let i=new WeakMap;ma.isConnected=function(){return this.webSocket?.readyState===WebSocket.OPEN},ma.sendMessage=function(e){let t=this.webSocket;if(!t)return;if(t.readyState===WebSocket.OPEN){t.send(e);return}if(t.readyState!==WebSocket.CONNECTING)return;let n=i.get(t);n||(n=[],i.set(t,n),t.addEventListener("open",()=>{let r=i.get(t)||[];if(i.delete(t),this.webSocket===t&&t.readyState===WebSocket.OPEN)for(let s of r)t.send(s)},{once:!0}),t.addEventListener("close",()=>i.delete(t),{once:!0})),n.length<128&&n.push(e)}}var ls=class extends gr{static get SIGNALLING_VERSION(){return"1.3.0"}constructor(e){super(),this.transport=e,e.onMessage=t=>{let n;try{let r=JSON.parse(t);L.Debug(`Protocol received => 
`+JSON.stringify(r,void 0,4)),n=r}catch(r){r instanceof Error?L.Error(`Error parsing message string ${t}.
${r.message}`):L.Error("Unknown error while parsing message data in handleOnMessage");return}e.emit("message",n),this.emit(n.type,n)||this.emit("unhandled",n)}}connect(e){return this.transport.connect(e)}disconnect(e,t){this.transport.disconnect(e,t)}isConnected(){return this.transport.isConnected()}sendMessage(e){this.transport.sendMessage(JSON.stringify(e)),this.transport.emit("out",e),L.Debug(`Protocol sent => 
`+JSON.stringify(e,void 0,4))}};var pt={};$u(pt,{answer:()=>du,base_message:()=>rx,config:()=>tu,dataChannelRequest:()=>vu,disconnectPlayer:()=>pu,endpointId:()=>iu,endpointIdConfirm:()=>ru,iceCandidate:()=>fu,iceCandidateData:()=>La,identify:()=>nu,layerPreference:()=>yu,listStreamers:()=>su,offer:()=>uu,peerConnectionOptions:()=>Pa,peerDataChannels:()=>xu,peerDataChannelsReady:()=>_u,ping:()=>us,playerConnected:()=>cu,playerCount:()=>wu,playerDisconnected:()=>hu,pong:()=>mu,startStreaming:()=>bu,stats:()=>Eu,stopStreaming:()=>Mu,streamerDataChannels:()=>Su,streamerDisconnected:()=>gu,streamerIdChanged:()=>sx,streamerList:()=>ou,subscribe:()=>au,subscribeFailed:()=>ox,unsubscribe:()=>lu});function ga(i){let e=typeof i;if(e=="object"){if(Array.isArray(i))return"array";if(i===null)return"null"}return e}function Uf(i){return i!==null&&typeof i=="object"&&!Array.isArray(i)}var qn="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),ya=[];for(let i=0;i<qn.length;i++)ya[qn[i].charCodeAt(0)]=i;ya[45]=qn.indexOf("+");ya[95]=qn.indexOf("/");function kf(i){let e=i.length*3/4;i[i.length-2]=="="?e-=2:i[i.length-1]=="="&&(e-=1);let t=new Uint8Array(e),n=0,r=0,s,o=0;for(let a=0;a<i.length;a++){if(s=ya[i.charCodeAt(a)],s===void 0)switch(i[a]){case"=":r=0;case`
`:case"\r":case"	":case" ":continue;default:throw Error("invalid base64 string.")}switch(r){case 0:o=s,r=1;break;case 1:t[n++]=o<<2|(s&48)>>4,o=s,r=2;break;case 2:t[n++]=(o&15)<<4|(s&60)>>2,o=s,r=3;break;case 3:t[n++]=(o&3)<<6|s,r=0;break}}if(r==1)throw Error("invalid base64 string.");return t.subarray(0,n)}function Bf(i){let e="",t=0,n,r=0;for(let s=0;s<i.length;s++)switch(n=i[s],t){case 0:e+=qn[n>>2],r=(n&3)<<4,t=1;break;case 1:e+=qn[r|n>>4],r=(n&15)<<2,t=2;break;case 2:e+=qn[r|n>>6],e+=qn[n&63],t=0;break}return t&&(e+=qn[r],e+="=",t==1&&(e+="=")),e}var _e;(function(i){i.symbol=Symbol.for("protobuf-ts/unknown"),i.onRead=(t,n,r,s,o)=>{(e(n)?n[i.symbol]:n[i.symbol]=[]).push({no:r,wireType:s,data:o})},i.onWrite=(t,n,r)=>{for(let{no:s,wireType:o,data:a}of i.list(n))r.tag(s,o).raw(a)},i.list=(t,n)=>{if(e(t)){let r=t[i.symbol];return n?r.filter(s=>s.no==n):r}return[]},i.last=(t,n)=>i.list(t,n).slice(-1)[0];let e=t=>t&&Array.isArray(t[i.symbol])})(_e||(_e={}));var re;(function(i){i[i.Varint=0]="Varint",i[i.Bit64=1]="Bit64",i[i.LengthDelimited=2]="LengthDelimited",i[i.StartGroup=3]="StartGroup",i[i.EndGroup=4]="EndGroup",i[i.Bit32=5]="Bit32"})(re||(re={}));function Vf(){let i=0,e=0;for(let n=0;n<28;n+=7){let r=this.buf[this.pos++];if(i|=(r&127)<<n,(r&128)==0)return this.assertBounds(),[i,e]}let t=this.buf[this.pos++];if(i|=(t&15)<<28,e=(t&112)>>4,(t&128)==0)return this.assertBounds(),[i,e];for(let n=3;n<=31;n+=7){let r=this.buf[this.pos++];if(e|=(r&127)<<n,(r&128)==0)return this.assertBounds(),[i,e]}throw new Error("invalid varint")}function xa(i,e,t){for(let s=0;s<28;s=s+7){let o=i>>>s,a=!(!(o>>>7)&&e==0),l=(a?o|128:o)&255;if(t.push(l),!a)return}let n=i>>>28&15|(e&7)<<4,r=e>>3!=0;if(t.push((r?n|128:n)&255),!!r){for(let s=3;s<31;s=s+7){let o=e>>>s,a=!!(o>>>7),l=(a?o|128:o)&255;if(t.push(l),!a)return}t.push(e>>>31&1)}}var va=65536*65536;function xh(i){let e=i[0]=="-";e&&(i=i.slice(1));let t=1e6,n=0,r=0;function s(o,a){let l=Number(i.slice(o,a));r*=t,n=n*t+l,n>=va&&(r=r+(n/va|0),n=n%va)}return s(-24,-18),s(-18,-12),s(-12,-6),s(-6),[e,n,r]}function _a(i,e){if(e>>>0<=2097151)return""+(va*e+(i>>>0));let t=i&16777215,n=(i>>>24|e<<8)>>>0&16777215,r=e>>16&65535,s=t+n*6777216+r*6710656,o=n+r*8147497,a=r*2,l=1e7;s>=l&&(o+=Math.floor(s/l),s%=l),o>=l&&(a+=Math.floor(o/l),o%=l);function c(h,u){let d=h?String(h):"";return u?"0000000".slice(d.length)+d:d}return c(a,0)+c(o,a)+c(s,1)}function _h(i,e){if(i>=0){for(;i>127;)e.push(i&127|128),i=i>>>7;e.push(i)}else{for(let t=0;t<9;t++)e.push(i&127|128),i=i>>7;e.push(1)}}function zf(){let i=this.buf[this.pos++],e=i&127;if((i&128)==0)return this.assertBounds(),e;if(i=this.buf[this.pos++],e|=(i&127)<<7,(i&128)==0)return this.assertBounds(),e;if(i=this.buf[this.pos++],e|=(i&127)<<14,(i&128)==0)return this.assertBounds(),e;if(i=this.buf[this.pos++],e|=(i&127)<<21,(i&128)==0)return this.assertBounds(),e;i=this.buf[this.pos++],e|=(i&15)<<28;for(let t=5;(i&128)!==0&&t<10;t++)i=this.buf[this.pos++];if((i&128)!=0)throw new Error("invalid varint");return this.assertBounds(),e>>>0}var dt;function Zv(){let i=new DataView(new ArrayBuffer(8));dt=globalThis.BigInt!==void 0&&typeof i.getBigInt64=="function"&&typeof i.getBigUint64=="function"&&typeof i.setBigInt64=="function"&&typeof i.setBigUint64=="function"?{MIN:BigInt("-9223372036854775808"),MAX:BigInt("9223372036854775807"),UMIN:BigInt("0"),UMAX:BigInt("18446744073709551615"),C:BigInt,V:i}:void 0}Zv();function Hf(i){if(!i)throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support")}var Wf=/^-?[0-9]+$/,ba=4294967296,Sa=2147483648,Ma=class{constructor(e,t){this.lo=e|0,this.hi=t|0}isZero(){return this.lo==0&&this.hi==0}toNumber(){let e=this.hi*ba+(this.lo>>>0);if(!Number.isSafeInteger(e))throw new Error("cannot convert to safe number");return e}},Rt=class i extends Ma{static from(e){if(dt)switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=="")throw new Error("string is no integer");e=dt.C(e);case"number":if(e===0)return this.ZERO;e=dt.C(e);case"bigint":if(!e)return this.ZERO;if(e<dt.UMIN)throw new Error("signed value for ulong");if(e>dt.UMAX)throw new Error("ulong too large");return dt.V.setBigUint64(0,e,!0),new i(dt.V.getInt32(0,!0),dt.V.getInt32(4,!0))}else switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=e.trim(),!Wf.test(e))throw new Error("string is no integer");let[t,n,r]=xh(e);if(t)throw new Error("signed value for ulong");return new i(n,r);case"number":if(e==0)return this.ZERO;if(!Number.isSafeInteger(e))throw new Error("number is no integer");if(e<0)throw new Error("signed value for ulong");return new i(e,e/ba)}throw new Error("unknown value "+typeof e)}toString(){return dt?this.toBigInt().toString():_a(this.lo,this.hi)}toBigInt(){return Hf(dt),dt.V.setInt32(0,this.lo,!0),dt.V.setInt32(4,this.hi,!0),dt.V.getBigUint64(0,!0)}};Rt.ZERO=new Rt(0,0);var Mt=class i extends Ma{static from(e){if(dt)switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=="")throw new Error("string is no integer");e=dt.C(e);case"number":if(e===0)return this.ZERO;e=dt.C(e);case"bigint":if(!e)return this.ZERO;if(e<dt.MIN)throw new Error("signed long too small");if(e>dt.MAX)throw new Error("signed long too large");return dt.V.setBigInt64(0,e,!0),new i(dt.V.getInt32(0,!0),dt.V.getInt32(4,!0))}else switch(typeof e){case"string":if(e=="0")return this.ZERO;if(e=e.trim(),!Wf.test(e))throw new Error("string is no integer");let[t,n,r]=xh(e);if(t){if(r>Sa||r==Sa&&n!=0)throw new Error("signed long too small")}else if(r>=Sa)throw new Error("signed long too large");let s=new i(n,r);return t?s.negate():s;case"number":if(e==0)return this.ZERO;if(!Number.isSafeInteger(e))throw new Error("number is no integer");return e>0?new i(e,e/ba):new i(-e,-e/ba).negate()}throw new Error("unknown value "+typeof e)}isNegative(){return(this.hi&Sa)!==0}negate(){let e=~this.hi,t=this.lo;return t?t=~t+1:e+=1,new i(t,e)}toString(){if(dt)return this.toBigInt().toString();if(this.isNegative()){let e=this.negate();return"-"+_a(e.lo,e.hi)}return _a(this.lo,this.hi)}toBigInt(){return Hf(dt),dt.V.setInt32(0,this.lo,!0),dt.V.setInt32(4,this.hi,!0),dt.V.getBigInt64(0,!0)}};Mt.ZERO=new Mt(0,0);var Gf={readUnknownField:!0,readerFactory:i=>new Sh(i)};function Xf(i){return i?Object.assign(Object.assign({},Gf),i):Gf}var Sh=class{constructor(e,t){this.varint64=Vf,this.uint32=zf,this.buf=e,this.len=e.length,this.pos=0,this.view=new DataView(e.buffer,e.byteOffset,e.byteLength),this.textDecoder=t??new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0})}tag(){let e=this.uint32(),t=e>>>3,n=e&7;if(t<=0||n<0||n>5)throw new Error("illegal tag: field no "+t+" wire type "+n);return[t,n]}skip(e){let t=this.pos;switch(e){case re.Varint:for(;this.buf[this.pos++]&128;);break;case re.Bit64:this.pos+=4;case re.Bit32:this.pos+=4;break;case re.LengthDelimited:let n=this.uint32();this.pos+=n;break;case re.StartGroup:let r;for(;(r=this.tag()[1])!==re.EndGroup;)this.skip(r);break;default:throw new Error("cant skip wire type "+e)}return this.assertBounds(),this.buf.subarray(t,this.pos)}assertBounds(){if(this.pos>this.len)throw new RangeError("premature EOF")}int32(){return this.uint32()|0}sint32(){let e=this.uint32();return e>>>1^-(e&1)}int64(){return new Mt(...this.varint64())}uint64(){return new Rt(...this.varint64())}sint64(){let[e,t]=this.varint64(),n=-(e&1);return e=(e>>>1|(t&1)<<31)^n,t=t>>>1^n,new Mt(e,t)}bool(){let[e,t]=this.varint64();return e!==0||t!==0}fixed32(){return this.view.getUint32((this.pos+=4)-4,!0)}sfixed32(){return this.view.getInt32((this.pos+=4)-4,!0)}fixed64(){return new Rt(this.sfixed32(),this.sfixed32())}sfixed64(){return new Mt(this.sfixed32(),this.sfixed32())}float(){return this.view.getFloat32((this.pos+=4)-4,!0)}double(){return this.view.getFloat64((this.pos+=8)-8,!0)}bytes(){let e=this.uint32(),t=this.pos;return this.pos+=e,this.assertBounds(),this.buf.subarray(t,t+e)}string(){return this.textDecoder.decode(this.bytes())}};function Qe(i,e){if(!i)throw new Error(e)}var jv=34028234663852886e22,Qv=-34028234663852886e22,ex=4294967295,tx=2147483647,nx=-2147483648;function hi(i){if(typeof i!="number")throw new Error("invalid int 32: "+typeof i);if(!Number.isInteger(i)||i>tx||i<nx)throw new Error("invalid int 32: "+i)}function Fi(i){if(typeof i!="number")throw new Error("invalid uint 32: "+typeof i);if(!Number.isInteger(i)||i>ex||i<0)throw new Error("invalid uint 32: "+i)}function yr(i){if(typeof i!="number")throw new Error("invalid float 32: "+typeof i);if(Number.isFinite(i)&&(i>jv||i<Qv))throw new Error("invalid float 32: "+i)}var qf={writeUnknownFields:!0,writerFactory:()=>new bh};function Yf(i){return i?Object.assign(Object.assign({},qf),i):qf}var bh=class{constructor(e){this.stack=[],this.textEncoder=e??new TextEncoder,this.chunks=[],this.buf=[]}finish(){this.chunks.push(new Uint8Array(this.buf));let e=0;for(let r=0;r<this.chunks.length;r++)e+=this.chunks[r].length;let t=new Uint8Array(e),n=0;for(let r=0;r<this.chunks.length;r++)t.set(this.chunks[r],n),n+=this.chunks[r].length;return this.chunks=[],t}fork(){return this.stack.push({chunks:this.chunks,buf:this.buf}),this.chunks=[],this.buf=[],this}join(){let e=this.finish(),t=this.stack.pop();if(!t)throw new Error("invalid state, fork stack empty");return this.chunks=t.chunks,this.buf=t.buf,this.uint32(e.byteLength),this.raw(e)}tag(e,t){return this.uint32((e<<3|t)>>>0)}raw(e){return this.buf.length&&(this.chunks.push(new Uint8Array(this.buf)),this.buf=[]),this.chunks.push(e),this}uint32(e){for(Fi(e);e>127;)this.buf.push(e&127|128),e=e>>>7;return this.buf.push(e),this}int32(e){return hi(e),_h(e,this.buf),this}bool(e){return this.buf.push(e?1:0),this}bytes(e){return this.uint32(e.byteLength),this.raw(e)}string(e){let t=this.textEncoder.encode(e);return this.uint32(t.byteLength),this.raw(t)}float(e){yr(e);let t=new Uint8Array(4);return new DataView(t.buffer).setFloat32(0,e,!0),this.raw(t)}double(e){let t=new Uint8Array(8);return new DataView(t.buffer).setFloat64(0,e,!0),this.raw(t)}fixed32(e){Fi(e);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!0),this.raw(t)}sfixed32(e){hi(e);let t=new Uint8Array(4);return new DataView(t.buffer).setInt32(0,e,!0),this.raw(t)}sint32(e){return hi(e),e=(e<<1^e>>31)>>>0,_h(e,this.buf),this}sfixed64(e){let t=new Uint8Array(8),n=new DataView(t.buffer),r=Mt.from(e);return n.setInt32(0,r.lo,!0),n.setInt32(4,r.hi,!0),this.raw(t)}fixed64(e){let t=new Uint8Array(8),n=new DataView(t.buffer),r=Rt.from(e);return n.setInt32(0,r.lo,!0),n.setInt32(4,r.hi,!0),this.raw(t)}int64(e){let t=Mt.from(e);return xa(t.lo,t.hi,this.buf),this}sint64(e){let t=Mt.from(e),n=t.hi>>31,r=t.lo<<1^n,s=(t.hi<<1|t.lo>>>31)^n;return xa(r,s,this.buf),this}uint64(e){let t=Rt.from(e);return xa(t.lo,t.hi,this.buf),this}};var $f={emitDefaultValues:!1,enumAsInteger:!1,useProtoFieldName:!1,prettySpaces:0},Kf={ignoreUnknownFields:!1};function Jf(i){return i?Object.assign(Object.assign({},Kf),i):Kf}function Zf(i){return i?Object.assign(Object.assign({},$f),i):$f}var wa=Symbol.for("protobuf-ts/message-type");function Mh(i){let e=!1,t=[];for(let n=0;n<i.length;n++){let r=i.charAt(n);r=="_"?e=!0:/\d/.test(r)?(t.push(r),e=!0):e?(t.push(r.toUpperCase()),e=!1):n==0?t.push(r.toLowerCase()):t.push(r)}return t.join("")}var j;(function(i){i[i.DOUBLE=1]="DOUBLE",i[i.FLOAT=2]="FLOAT",i[i.INT64=3]="INT64",i[i.UINT64=4]="UINT64",i[i.INT32=5]="INT32",i[i.FIXED64=6]="FIXED64",i[i.FIXED32=7]="FIXED32",i[i.BOOL=8]="BOOL",i[i.STRING=9]="STRING",i[i.BYTES=12]="BYTES",i[i.UINT32=13]="UINT32",i[i.SFIXED32=15]="SFIXED32",i[i.SFIXED64=16]="SFIXED64",i[i.SINT32=17]="SINT32",i[i.SINT64=18]="SINT64"})(j||(j={}));var $t;(function(i){i[i.BIGINT=0]="BIGINT",i[i.STRING=1]="STRING",i[i.NUMBER=2]="NUMBER"})($t||($t={}));var cs;(function(i){i[i.NO=0]="NO",i[i.PACKED=1]="PACKED",i[i.UNPACKED=2]="UNPACKED"})(cs||(cs={}));function jf(i){var e,t,n,r;return i.localName=(e=i.localName)!==null&&e!==void 0?e:Mh(i.name),i.jsonName=(t=i.jsonName)!==null&&t!==void 0?t:Mh(i.name),i.repeat=(n=i.repeat)!==null&&n!==void 0?n:cs.NO,i.opt=(r=i.opt)!==null&&r!==void 0?r:i.repeat||i.oneof?!1:i.kind=="message",i}function Qf(i){if(typeof i!="object"||i===null||!i.hasOwnProperty("oneofKind"))return!1;switch(typeof i.oneofKind){case"string":return i[i.oneofKind]===void 0?!1:Object.keys(i).length==2;case"undefined":return Object.keys(i).length==1;default:return!1}}var Ea=class{constructor(e){var t;this.fields=(t=e.fields)!==null&&t!==void 0?t:[]}prepare(){if(this.data)return;let e=[],t=[],n=[];for(let r of this.fields)if(r.oneof)n.includes(r.oneof)||(n.push(r.oneof),e.push(r.oneof),t.push(r.oneof));else switch(t.push(r.localName),r.kind){case"scalar":case"enum":(!r.opt||r.repeat)&&e.push(r.localName);break;case"message":r.repeat&&e.push(r.localName);break;case"map":e.push(r.localName);break}this.data={req:e,known:t,oneofs:Object.values(n)}}is(e,t,n=!1){if(t<0)return!0;if(e==null||typeof e!="object")return!1;this.prepare();let r=Object.keys(e),s=this.data;if(r.length<s.req.length||s.req.some(o=>!r.includes(o))||!n&&r.some(o=>!s.known.includes(o)))return!1;if(t<1)return!0;for(let o of s.oneofs){let a=e[o];if(!Qf(a))return!1;if(a.oneofKind===void 0)continue;let l=this.fields.find(c=>c.localName===a.oneofKind);if(!l||!this.field(a[a.oneofKind],l,n,t))return!1}for(let o of this.fields)if(o.oneof===void 0&&!this.field(e[o.localName],o,n,t))return!1;return!0}field(e,t,n,r){let s=t.repeat;switch(t.kind){case"scalar":return e===void 0?t.opt:s?this.scalars(e,t.T,r,t.L):this.scalar(e,t.T,t.L);case"enum":return e===void 0?t.opt:s?this.scalars(e,j.INT32,r):this.scalar(e,j.INT32);case"message":return e===void 0?!0:s?this.messages(e,t.T(),n,r):this.message(e,t.T(),n,r);case"map":if(typeof e!="object"||e===null)return!1;if(r<2)return!0;if(!this.mapKeys(e,t.K,r))return!1;switch(t.V.kind){case"scalar":return this.scalars(Object.values(e),t.V.T,r,t.V.L);case"enum":return this.scalars(Object.values(e),j.INT32,r);case"message":return this.messages(Object.values(e),t.V.T(),n,r)}break}return!0}message(e,t,n,r){return n?t.isAssignable(e,r):t.is(e,r)}messages(e,t,n,r){if(!Array.isArray(e))return!1;if(r<2)return!0;if(n){for(let s=0;s<e.length&&s<r;s++)if(!t.isAssignable(e[s],r-1))return!1}else for(let s=0;s<e.length&&s<r;s++)if(!t.is(e[s],r-1))return!1;return!0}scalar(e,t,n){let r=typeof e;switch(t){case j.UINT64:case j.FIXED64:case j.INT64:case j.SFIXED64:case j.SINT64:switch(n){case $t.BIGINT:return r=="bigint";case $t.NUMBER:return r=="number"&&!isNaN(e);default:return r=="string"}case j.BOOL:return r=="boolean";case j.STRING:return r=="string";case j.BYTES:return e instanceof Uint8Array;case j.DOUBLE:case j.FLOAT:return r=="number"&&!isNaN(e);default:return r=="number"&&Number.isInteger(e)}}scalars(e,t,n,r){if(!Array.isArray(e))return!1;if(n<2)return!0;if(Array.isArray(e)){for(let s=0;s<e.length&&s<n;s++)if(!this.scalar(e[s],t,r))return!1}return!0}mapKeys(e,t,n){let r=Object.keys(e);switch(t){case j.INT32:case j.FIXED32:case j.SFIXED32:case j.SINT32:case j.UINT32:return this.scalars(r.slice(0,n).map(s=>parseInt(s)),t,n);case j.BOOL:return this.scalars(r.slice(0,n).map(s=>s=="true"?!0:s=="false"?!1:s),t,n);default:return this.scalars(r,t,n,$t.STRING)}}};function Qt(i,e){switch(e){case $t.BIGINT:return i.toBigInt();case $t.NUMBER:return i.toNumber();default:return i.toString()}}var Ta=class{constructor(e){this.info=e}prepare(){var e;if(this.fMap===void 0){this.fMap={};let t=(e=this.info.fields)!==null&&e!==void 0?e:[];for(let n of t)this.fMap[n.name]=n,this.fMap[n.jsonName]=n,this.fMap[n.localName]=n}}assert(e,t,n){if(!e){let r=ga(n);throw(r=="number"||r=="boolean")&&(r=n.toString()),new Error(`Cannot parse JSON ${r} for ${this.info.typeName}#${t}`)}}read(e,t,n){this.prepare();let r=[];for(let[s,o]of Object.entries(e)){let a=this.fMap[s];if(!a){if(!n.ignoreUnknownFields)throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${s}`);continue}let l=a.localName,c;if(a.oneof){if(o===null&&(a.kind!=="enum"||a.T()[0]!=="google.protobuf.NullValue"))continue;if(r.includes(a.oneof))throw new Error(`Multiple members of the oneof group "${a.oneof}" of ${this.info.typeName} are present in JSON.`);r.push(a.oneof),c=t[a.oneof]={oneofKind:l}}else c=t;if(a.kind=="map"){if(o===null)continue;this.assert(Uf(o),a.name,o);let h=c[l];for(let[u,d]of Object.entries(o)){this.assert(d!==null,a.name+" map value",null);let p;switch(a.V.kind){case"message":p=a.V.T().internalJsonRead(d,n);break;case"enum":if(p=this.enum(a.V.T(),d,a.name,n.ignoreUnknownFields),p===!1)continue;break;case"scalar":p=this.scalar(d,a.V.T,a.V.L,a.name);break}this.assert(p!==void 0,a.name+" map value",d);let g=u;a.K==j.BOOL&&(g=g=="true"?!0:g=="false"?!1:g),g=this.scalar(g,a.K,$t.STRING,a.name).toString(),h[g]=p}}else if(a.repeat){if(o===null)continue;this.assert(Array.isArray(o),a.name,o);let h=c[l];for(let u of o){this.assert(u!==null,a.name,null);let d;switch(a.kind){case"message":d=a.T().internalJsonRead(u,n);break;case"enum":if(d=this.enum(a.T(),u,a.name,n.ignoreUnknownFields),d===!1)continue;break;case"scalar":d=this.scalar(u,a.T,a.L,a.name);break}this.assert(d!==void 0,a.name,o),h.push(d)}}else switch(a.kind){case"message":if(o===null&&a.T().typeName!="google.protobuf.Value"){this.assert(a.oneof===void 0,a.name+" (oneof member)",null);continue}c[l]=a.T().internalJsonRead(o,n,c[l]);break;case"enum":if(o===null)continue;let h=this.enum(a.T(),o,a.name,n.ignoreUnknownFields);if(h===!1)continue;c[l]=h;break;case"scalar":if(o===null)continue;c[l]=this.scalar(o,a.T,a.L,a.name);break}}}enum(e,t,n,r){if(e[0]=="google.protobuf.NullValue"&&Qe(t===null||t==="NULL_VALUE",`Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} only accepts null.`),t===null)return 0;switch(typeof t){case"number":return Qe(Number.isInteger(t),`Unable to parse field ${this.info.typeName}#${n}, enum can only be integral number, got ${t}.`),t;case"string":let s=t;e[2]&&t.substring(0,e[2].length)===e[2]&&(s=t.substring(e[2].length));let o=e[1][s];return typeof o>"u"&&r?!1:(Qe(typeof o=="number",`Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} has no value for "${t}".`),o)}Qe(!1,`Unable to parse field ${this.info.typeName}#${n}, cannot parse enum value from ${typeof t}".`)}scalar(e,t,n,r){let s;try{switch(t){case j.DOUBLE:case j.FLOAT:if(e===null)return 0;if(e==="NaN")return Number.NaN;if(e==="Infinity")return Number.POSITIVE_INFINITY;if(e==="-Infinity")return Number.NEGATIVE_INFINITY;if(e===""){s="empty string";break}if(typeof e=="string"&&e.trim().length!==e.length){s="extra whitespace";break}if(typeof e!="string"&&typeof e!="number")break;let o=Number(e);if(Number.isNaN(o)){s="not a number";break}if(!Number.isFinite(o)){s="too large or small";break}return t==j.FLOAT&&yr(o),o;case j.INT32:case j.FIXED32:case j.SFIXED32:case j.SINT32:case j.UINT32:if(e===null)return 0;let a;if(typeof e=="number"?a=e:e===""?s="empty string":typeof e=="string"&&(e.trim().length!==e.length?s="extra whitespace":a=Number(e)),a===void 0)break;return t==j.UINT32?Fi(a):hi(a),a;case j.INT64:case j.SFIXED64:case j.SINT64:if(e===null)return Qt(Mt.ZERO,n);if(typeof e!="number"&&typeof e!="string")break;return Qt(Mt.from(e),n);case j.FIXED64:case j.UINT64:if(e===null)return Qt(Rt.ZERO,n);if(typeof e!="number"&&typeof e!="string")break;return Qt(Rt.from(e),n);case j.BOOL:if(e===null)return!1;if(typeof e!="boolean")break;return e;case j.STRING:if(e===null)return"";if(typeof e!="string"){s="extra whitespace";break}try{encodeURIComponent(e)}catch(l){l="invalid UTF8";break}return e;case j.BYTES:if(e===null||e==="")return new Uint8Array(0);if(typeof e!="string")break;return kf(e)}}catch(o){s=o.message}this.assert(!1,r+(s?" - "+s:""),e)}};var Ca=class{constructor(e){var t;this.fields=(t=e.fields)!==null&&t!==void 0?t:[]}write(e,t){let n={},r=e;for(let s of this.fields){if(!s.oneof){let c=this.field(s,r[s.localName],t);c!==void 0&&(n[t.useProtoFieldName?s.name:s.jsonName]=c);continue}let o=r[s.oneof];if(o.oneofKind!==s.localName)continue;let a=s.kind=="scalar"||s.kind=="enum"?Object.assign(Object.assign({},t),{emitDefaultValues:!0}):t,l=this.field(s,o[s.localName],a);Qe(l!==void 0),n[t.useProtoFieldName?s.name:s.jsonName]=l}return n}field(e,t,n){let r;if(e.kind=="map"){Qe(typeof t=="object"&&t!==null);let s={};switch(e.V.kind){case"scalar":for(let[l,c]of Object.entries(t)){let h=this.scalar(e.V.T,c,e.name,!1,!0);Qe(h!==void 0),s[l.toString()]=h}break;case"message":let o=e.V.T();for(let[l,c]of Object.entries(t)){let h=this.message(o,c,e.name,n);Qe(h!==void 0),s[l.toString()]=h}break;case"enum":let a=e.V.T();for(let[l,c]of Object.entries(t)){Qe(c===void 0||typeof c=="number");let h=this.enum(a,c,e.name,!1,!0,n.enumAsInteger);Qe(h!==void 0),s[l.toString()]=h}break}(n.emitDefaultValues||Object.keys(s).length>0)&&(r=s)}else if(e.repeat){Qe(Array.isArray(t));let s=[];switch(e.kind){case"scalar":for(let l=0;l<t.length;l++){let c=this.scalar(e.T,t[l],e.name,e.opt,!0);Qe(c!==void 0),s.push(c)}break;case"enum":let o=e.T();for(let l=0;l<t.length;l++){Qe(t[l]===void 0||typeof t[l]=="number");let c=this.enum(o,t[l],e.name,e.opt,!0,n.enumAsInteger);Qe(c!==void 0),s.push(c)}break;case"message":let a=e.T();for(let l=0;l<t.length;l++){let c=this.message(a,t[l],e.name,n);Qe(c!==void 0),s.push(c)}break}(n.emitDefaultValues||s.length>0||n.emitDefaultValues)&&(r=s)}else switch(e.kind){case"scalar":r=this.scalar(e.T,t,e.name,e.opt,n.emitDefaultValues);break;case"enum":r=this.enum(e.T(),t,e.name,e.opt,n.emitDefaultValues,n.enumAsInteger);break;case"message":r=this.message(e.T(),t,e.name,n);break}return r}enum(e,t,n,r,s,o){if(e[0]=="google.protobuf.NullValue")return!s&&!r?void 0:null;if(t===void 0){Qe(r);return}if(!(t===0&&!s&&!r))return Qe(typeof t=="number"),Qe(Number.isInteger(t)),o||!e[1].hasOwnProperty(t)?t:e[2]?e[2]+e[1][t]:e[1][t]}message(e,t,n,r){return t===void 0?r.emitDefaultValues?null:void 0:e.internalJsonWrite(t,r)}scalar(e,t,n,r,s){if(t===void 0){Qe(r);return}let o=s||r;switch(e){case j.INT32:case j.SFIXED32:case j.SINT32:return t===0?o?0:void 0:(hi(t),t);case j.FIXED32:case j.UINT32:return t===0?o?0:void 0:(Fi(t),t);case j.FLOAT:yr(t);case j.DOUBLE:return t===0?o?0:void 0:(Qe(typeof t=="number"),Number.isNaN(t)?"NaN":t===Number.POSITIVE_INFINITY?"Infinity":t===Number.NEGATIVE_INFINITY?"-Infinity":t);case j.STRING:return t===""?o?"":void 0:(Qe(typeof t=="string"),t);case j.BOOL:return t===!1?o?!1:void 0:(Qe(typeof t=="boolean"),t);case j.UINT64:case j.FIXED64:Qe(typeof t=="number"||typeof t=="string"||typeof t=="bigint");let a=Rt.from(t);return a.isZero()&&!o?void 0:a.toString();case j.INT64:case j.SFIXED64:case j.SINT64:Qe(typeof t=="number"||typeof t=="string"||typeof t=="bigint");let l=Mt.from(t);return l.isZero()&&!o?void 0:l.toString();case j.BYTES:return Qe(t instanceof Uint8Array),t.byteLength?Bf(t):o?"":void 0}}};function hs(i,e=$t.STRING){switch(i){case j.BOOL:return!1;case j.UINT64:case j.FIXED64:return Qt(Rt.ZERO,e);case j.INT64:case j.SFIXED64:case j.SINT64:return Qt(Mt.ZERO,e);case j.DOUBLE:case j.FLOAT:return 0;case j.BYTES:return new Uint8Array(0);case j.STRING:return"";default:return 0}}var Aa=class{constructor(e){this.info=e}prepare(){var e;if(!this.fieldNoToField){let t=(e=this.info.fields)!==null&&e!==void 0?e:[];this.fieldNoToField=new Map(t.map(n=>[n.no,n]))}}read(e,t,n,r){this.prepare();let s=r===void 0?e.len:e.pos+r;for(;e.pos<s;){let[o,a]=e.tag(),l=this.fieldNoToField.get(o);if(!l){let d=n.readUnknownField;if(d=="throw")throw new Error(`Unknown field ${o} (wire type ${a}) for ${this.info.typeName}`);let p=e.skip(a);d!==!1&&(d===!0?_e.onRead:d)(this.info.typeName,t,o,a,p);continue}let c=t,h=l.repeat,u=l.localName;switch(l.oneof&&(c=c[l.oneof],c.oneofKind!==u&&(c=t[l.oneof]={oneofKind:u})),l.kind){case"scalar":case"enum":let d=l.kind=="enum"?j.INT32:l.T,p=l.kind=="scalar"?l.L:void 0;if(h){let m=c[u];if(a==re.LengthDelimited&&d!=j.STRING&&d!=j.BYTES){let f=e.uint32()+e.pos;for(;e.pos<f;)m.push(this.scalar(e,d,p))}else m.push(this.scalar(e,d,p))}else c[u]=this.scalar(e,d,p);break;case"message":if(h){let m=c[u],f=l.T().internalBinaryRead(e,e.uint32(),n);m.push(f)}else c[u]=l.T().internalBinaryRead(e,e.uint32(),n,c[u]);break;case"map":let[g,M]=this.mapEntry(l,e,n);c[u][g]=M;break}}}mapEntry(e,t,n){let r=t.uint32(),s=t.pos+r,o,a;for(;t.pos<s;){let[l,c]=t.tag();switch(l){case 1:e.K==j.BOOL?o=t.bool().toString():o=this.scalar(t,e.K,$t.STRING);break;case 2:switch(e.V.kind){case"scalar":a=this.scalar(t,e.V.T,e.V.L);break;case"enum":a=t.int32();break;case"message":a=e.V.T().internalBinaryRead(t,t.uint32(),n);break}break;default:throw new Error(`Unknown field ${l} (wire type ${c}) in map entry for ${this.info.typeName}#${e.name}`)}}if(o===void 0){let l=hs(e.K);o=e.K==j.BOOL?l.toString():l}if(a===void 0)switch(e.V.kind){case"scalar":a=hs(e.V.T,e.V.L);break;case"enum":a=0;break;case"message":a=e.V.T().create();break}return[o,a]}scalar(e,t,n){switch(t){case j.INT32:return e.int32();case j.STRING:return e.string();case j.BOOL:return e.bool();case j.DOUBLE:return e.double();case j.FLOAT:return e.float();case j.INT64:return Qt(e.int64(),n);case j.UINT64:return Qt(e.uint64(),n);case j.FIXED64:return Qt(e.fixed64(),n);case j.FIXED32:return e.fixed32();case j.BYTES:return e.bytes();case j.UINT32:return e.uint32();case j.SFIXED32:return e.sfixed32();case j.SFIXED64:return Qt(e.sfixed64(),n);case j.SINT32:return e.sint32();case j.SINT64:return Qt(e.sint64(),n)}}};var Ra=class{constructor(e){this.info=e}prepare(){if(!this.fields){let e=this.info.fields?this.info.fields.concat():[];this.fields=e.sort((t,n)=>t.no-n.no)}}write(e,t,n){this.prepare();for(let s of this.fields){let o,a,l=s.repeat,c=s.localName;if(s.oneof){let h=e[s.oneof];if(h.oneofKind!==c)continue;o=h[c],a=!0}else o=e[c],a=!1;switch(s.kind){case"scalar":case"enum":let h=s.kind=="enum"?j.INT32:s.T;if(l)if(Qe(Array.isArray(o)),l==cs.PACKED)this.packed(t,h,s.no,o);else for(let u of o)this.scalar(t,h,s.no,u,!0);else o===void 0?Qe(s.opt):this.scalar(t,h,s.no,o,a||s.opt);break;case"message":if(l){Qe(Array.isArray(o));for(let u of o)this.message(t,n,s.T(),s.no,u)}else this.message(t,n,s.T(),s.no,o);break;case"map":Qe(typeof o=="object"&&o!==null);for(let[u,d]of Object.entries(o))this.mapEntry(t,n,s,u,d);break}}let r=n.writeUnknownFields;r!==!1&&(r===!0?_e.onWrite:r)(this.info.typeName,e,t)}mapEntry(e,t,n,r,s){e.tag(n.no,re.LengthDelimited),e.fork();let o=r;switch(n.K){case j.INT32:case j.FIXED32:case j.UINT32:case j.SFIXED32:case j.SINT32:o=Number.parseInt(r);break;case j.BOOL:Qe(r=="true"||r=="false"),o=r=="true";break}switch(this.scalar(e,n.K,1,o,!0),n.V.kind){case"scalar":this.scalar(e,n.V.T,2,s,!0);break;case"enum":this.scalar(e,j.INT32,2,s,!0);break;case"message":this.message(e,t,n.V.T(),2,s);break}e.join()}message(e,t,n,r,s){s!==void 0&&(n.internalBinaryWrite(s,e.tag(r,re.LengthDelimited).fork(),t),e.join())}scalar(e,t,n,r,s){let[o,a,l]=this.scalarInfo(t,r);(!l||s)&&(e.tag(n,o),e[a](r))}packed(e,t,n,r){if(!r.length)return;Qe(t!==j.BYTES&&t!==j.STRING),e.tag(n,re.LengthDelimited),e.fork();let[,s]=this.scalarInfo(t);for(let o=0;o<r.length;o++)e[s](r[o]);e.join()}scalarInfo(e,t){let n=re.Varint,r,s=t===void 0,o=t===0;switch(e){case j.INT32:r="int32";break;case j.STRING:o=s||!t.length,n=re.LengthDelimited,r="string";break;case j.BOOL:o=t===!1,r="bool";break;case j.UINT32:r="uint32";break;case j.DOUBLE:n=re.Bit64,r="double";break;case j.FLOAT:n=re.Bit32,r="float";break;case j.INT64:o=s||Mt.from(t).isZero(),r="int64";break;case j.UINT64:o=s||Rt.from(t).isZero(),r="uint64";break;case j.FIXED64:o=s||Rt.from(t).isZero(),n=re.Bit64,r="fixed64";break;case j.BYTES:o=s||!t.byteLength,n=re.LengthDelimited,r="bytes";break;case j.FIXED32:n=re.Bit32,r="fixed32";break;case j.SFIXED32:n=re.Bit32,r="sfixed32";break;case j.SFIXED64:o=s||Mt.from(t).isZero(),n=re.Bit64,r="sfixed64";break;case j.SINT32:r="sint32";break;case j.SINT64:o=s||Mt.from(t).isZero(),r="sint64";break}return[n,r,s||o]}};function ep(i){let e=i.messagePrototype?Object.create(i.messagePrototype):Object.defineProperty({},wa,{value:i});for(let t of i.fields){let n=t.localName;if(!t.opt)if(t.oneof)e[t.oneof]={oneofKind:void 0};else if(t.repeat)e[n]=[];else switch(t.kind){case"scalar":e[n]=hs(t.T,t.L);break;case"enum":e[n]=0;break;case"map":e[n]={};break}}return e}function Je(i,e,t){let n,r=t,s;for(let o of i.fields){let a=o.localName;if(o.oneof){let l=r[o.oneof];if(l?.oneofKind==null)continue;if(n=l[a],s=e[o.oneof],s.oneofKind=l.oneofKind,n==null){delete s[a];continue}}else if(n=r[a],s=e,n==null)continue;switch(o.repeat&&(s[a].length=n.length),o.kind){case"scalar":case"enum":if(o.repeat)for(let c=0;c<n.length;c++)s[a][c]=n[c];else s[a]=n;break;case"message":let l=o.T();if(o.repeat)for(let c=0;c<n.length;c++)s[a][c]=l.create(n[c]);else s[a]===void 0?s[a]=l.create(n):l.mergePartial(s[a],n);break;case"map":switch(o.V.kind){case"scalar":case"enum":Object.assign(s[a],n);break;case"message":let c=o.V.T();for(let h of Object.keys(n))s[a][h]=c.create(n[h]);break}break}}}function ip(i,e,t){if(e===t)return!0;if(!e||!t)return!1;for(let n of i.fields){let r=n.localName,s=n.oneof?e[n.oneof][r]:e[r],o=n.oneof?t[n.oneof][r]:t[r];switch(n.kind){case"enum":case"scalar":let a=n.kind=="enum"?j.INT32:n.T;if(!(n.repeat?tp(a,s,o):rp(a,s,o)))return!1;break;case"map":if(!(n.V.kind=="message"?np(n.V.T(),Ia(s),Ia(o)):tp(n.V.kind=="enum"?j.INT32:n.V.T,Ia(s),Ia(o))))return!1;break;case"message":let l=n.T();if(!(n.repeat?np(l,s,o):l.equals(s,o)))return!1;break}}return!0}var Ia=Object.values;function rp(i,e,t){if(e===t)return!0;if(i!==j.BYTES)return!1;let n=e,r=t;if(n.length!==r.length)return!1;for(let s=0;s<n.length;s++)if(n[s]!=r[s])return!1;return!0}function tp(i,e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!rp(i,e[n],t[n]))return!1;return!0}function np(i,e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!i.equals(e[n],t[n]))return!1;return!0}var sp=Object.getOwnPropertyDescriptors(Object.getPrototypeOf({})),ix=sp[wa]={},je=class{constructor(e,t,n){this.defaultCheckDepth=16,this.typeName=e,this.fields=t.map(jf),this.options=n??{},ix.value=this,this.messagePrototype=Object.create(null,sp),this.refTypeCheck=new Ea(this),this.refJsonReader=new Ta(this),this.refJsonWriter=new Ca(this),this.refBinReader=new Aa(this),this.refBinWriter=new Ra(this)}create(e){let t=ep(this);return e!==void 0&&Je(this,t,e),t}clone(e){let t=this.create();return Je(this,t,e),t}equals(e,t){return ip(this,e,t)}is(e,t=this.defaultCheckDepth){return this.refTypeCheck.is(e,t,!1)}isAssignable(e,t=this.defaultCheckDepth){return this.refTypeCheck.is(e,t,!0)}mergePartial(e,t){Je(this,e,t)}fromBinary(e,t){let n=Xf(t);return this.internalBinaryRead(n.readerFactory(e),e.byteLength,n)}fromJson(e,t){return this.internalJsonRead(e,Jf(t))}fromJsonString(e,t){let n=JSON.parse(e);return this.fromJson(n,t)}toJson(e,t){return this.internalJsonWrite(e,Zf(t))}toJsonString(e,t){var n;let r=this.toJson(e,t);return JSON.stringify(r,null,(n=t?.prettySpaces)!==null&&n!==void 0?n:0)}toBinary(e,t){let n=Yf(t);return this.internalBinaryWrite(e,n.writerFactory(),n).finish()}internalJsonRead(e,t,n){if(e!==null&&typeof e=="object"&&!Array.isArray(e)){let r=n??this.create();return this.refJsonReader.read(e,r,t),r}throw new Error(`Unable to parse message ${this.typeName} from JSON ${ga(e)}.`)}internalJsonWrite(e,t){return this.refJsonWriter.write(e,t)}internalBinaryWrite(e,t,n){return this.refBinWriter.write(e,t,n),t}internalBinaryRead(e,t,n,r){let s=r??this.create();return this.refBinReader.read(e,s,n,t),s}};var wh=class extends je{constructor(){super("base_message",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},rx=new wh,Eh=class extends je{constructor(){super("peerConnectionOptions",[])}create(e){let t=globalThis.Object.create(this.messagePrototype);return e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},Pa=new Eh,Th=class extends je{constructor(){super("config",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"peerConnectionOptions",kind:"message",T:()=>Pa},{no:3,name:"protocolVersion",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.peerConnectionOptions=Pa.internalBinaryRead(e,e.uint32(),n,s.peerConnectionOptions);break;case 3:s.protocolVersion=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.peerConnectionOptions&&Pa.internalBinaryWrite(e.peerConnectionOptions,t.tag(2,re.LengthDelimited).fork(),n).join(),e.protocolVersion!==void 0&&t.tag(3,re.LengthDelimited).string(e.protocolVersion);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},tu=new Th,Ch=class extends je{constructor(){super("identify",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},nu=new Ch,Ah=class extends je{constructor(){super("endpointId",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"id",kind:"scalar",T:9},{no:3,name:"protocolVersion",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.id="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.id=e.string();break;case 3:s.protocolVersion=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.id!==""&&t.tag(2,re.LengthDelimited).string(e.id),e.protocolVersion!==void 0&&t.tag(3,re.LengthDelimited).string(e.protocolVersion);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},iu=new Ah,Rh=class extends je{constructor(){super("endpointIdConfirm",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"committedId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.committedId="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.committedId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.committedId!==""&&t.tag(2,re.LengthDelimited).string(e.committedId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},ru=new Rh,Ih=class extends je{constructor(){super("streamerIdChanged",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"newID",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.newID="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.newID=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.newID!==""&&t.tag(2,re.LengthDelimited).string(e.newID);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},sx=new Ih,Ph=class extends je{constructor(){super("listStreamers",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},su=new Ph,Lh=class extends je{constructor(){super("streamerList",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"ids",kind:"scalar",repeat:2,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.ids=[],e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.ids.push(e.string());break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);for(let s=0;s<e.ids.length;s++)t.tag(2,re.LengthDelimited).string(e.ids[s]);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},ou=new Lh,Dh=class extends je{constructor(){super("subscribe",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"streamerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.streamerId="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.streamerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.streamerId!==""&&t.tag(2,re.LengthDelimited).string(e.streamerId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},au=new Dh,Fh=class extends je{constructor(){super("unsubscribe",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},lu=new Fh,Nh=class extends je{constructor(){super("subscribeFailed",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"message",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.message="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.message=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.message!==""&&t.tag(2,re.LengthDelimited).string(e.message);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},ox=new Nh,Oh=class extends je{constructor(){super("playerConnected",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"dataChannel",kind:"scalar",T:8},{no:3,name:"sfu",kind:"scalar",T:8},{no:5,name:"playerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.dataChannel=!1,t.sfu=!1,t.playerId="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.dataChannel=e.bool();break;case 3:s.sfu=e.bool();break;case 5:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.dataChannel!==!1&&t.tag(2,re.Varint).bool(e.dataChannel),e.sfu!==!1&&t.tag(3,re.Varint).bool(e.sfu),e.playerId!==""&&t.tag(5,re.LengthDelimited).string(e.playerId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},cu=new Oh,Uh=class extends je{constructor(){super("playerDisconnected",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"playerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.playerId="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.playerId!==""&&t.tag(2,re.LengthDelimited).string(e.playerId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},hu=new Uh,kh=class extends je{constructor(){super("offer",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"sdp",kind:"scalar",T:9},{no:3,name:"playerId",kind:"scalar",opt:!0,T:9},{no:4,name:"sfu",kind:"scalar",opt:!0,T:8},{no:5,name:"multiplex",kind:"scalar",opt:!0,T:8},{no:6,name:"scalabilityMode",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.sdp="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.sdp=e.string();break;case 3:s.playerId=e.string();break;case 4:s.sfu=e.bool();break;case 5:s.multiplex=e.bool();break;case 6:s.scalabilityMode=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.sdp!==""&&t.tag(2,re.LengthDelimited).string(e.sdp),e.playerId!==void 0&&t.tag(3,re.LengthDelimited).string(e.playerId),e.sfu!==void 0&&t.tag(4,re.Varint).bool(e.sfu),e.multiplex!==void 0&&t.tag(5,re.Varint).bool(e.multiplex),e.scalabilityMode!==void 0&&t.tag(6,re.LengthDelimited).string(e.scalabilityMode);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},uu=new kh,Bh=class extends je{constructor(){super("answer",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"sdp",kind:"scalar",T:9},{no:3,name:"playerId",kind:"scalar",opt:!0,T:9},{no:4,name:"minBitrateBps",kind:"scalar",opt:!0,T:5},{no:5,name:"maxBitrateBps",kind:"scalar",opt:!0,T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.sdp="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.sdp=e.string();break;case 3:s.playerId=e.string();break;case 4:s.minBitrateBps=e.int32();break;case 5:s.maxBitrateBps=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.sdp!==""&&t.tag(2,re.LengthDelimited).string(e.sdp),e.playerId!==void 0&&t.tag(3,re.LengthDelimited).string(e.playerId),e.minBitrateBps!==void 0&&t.tag(4,re.Varint).int32(e.minBitrateBps),e.maxBitrateBps!==void 0&&t.tag(5,re.Varint).int32(e.maxBitrateBps);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},du=new Bh,Vh=class extends je{constructor(){super("iceCandidateData",[{no:1,name:"candidate",kind:"scalar",T:9},{no:2,name:"sdpMid",kind:"scalar",T:9},{no:3,name:"sdpMLineIndex",kind:"scalar",T:5},{no:4,name:"usernameFragment",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.candidate="",t.sdpMid="",t.sdpMLineIndex=0,e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.candidate=e.string();break;case 2:s.sdpMid=e.string();break;case 3:s.sdpMLineIndex=e.int32();break;case 4:s.usernameFragment=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.candidate!==""&&t.tag(1,re.LengthDelimited).string(e.candidate),e.sdpMid!==""&&t.tag(2,re.LengthDelimited).string(e.sdpMid),e.sdpMLineIndex!==0&&t.tag(3,re.Varint).int32(e.sdpMLineIndex),e.usernameFragment!==void 0&&t.tag(4,re.LengthDelimited).string(e.usernameFragment);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},La=new Vh,zh=class extends je{constructor(){super("iceCandidate",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"candidate",kind:"message",T:()=>La},{no:3,name:"playerId",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.candidate=La.internalBinaryRead(e,e.uint32(),n,s.candidate);break;case 3:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.candidate&&La.internalBinaryWrite(e.candidate,t.tag(2,re.LengthDelimited).fork(),n).join(),e.playerId!==void 0&&t.tag(3,re.LengthDelimited).string(e.playerId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},fu=new zh,Hh=class extends je{constructor(){super("disconnectPlayer",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"playerId",kind:"scalar",T:9},{no:3,name:"reason",kind:"scalar",opt:!0,T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.playerId="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.playerId=e.string();break;case 3:s.reason=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.playerId!==""&&t.tag(2,re.LengthDelimited).string(e.playerId),e.reason!==void 0&&t.tag(3,re.LengthDelimited).string(e.reason);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},pu=new Hh,Wh=class extends je{constructor(){super("ping",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"time",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.time=0,e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.time=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.time!==0&&t.tag(2,re.Varint).int32(e.time);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},us=new Wh,Gh=class extends je{constructor(){super("pong",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"time",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.time=0,e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.time=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.time!==0&&t.tag(2,re.Varint).int32(e.time);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},mu=new Gh,Xh=class extends je{constructor(){super("streamerDisconnected",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},gu=new Xh,qh=class extends je{constructor(){super("layerPreference",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"spatialLayer",kind:"scalar",T:5},{no:3,name:"temporalLayer",kind:"scalar",T:5},{no:4,name:"playerId",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.spatialLayer=0,t.temporalLayer=0,t.playerId="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.spatialLayer=e.int32();break;case 3:s.temporalLayer=e.int32();break;case 4:s.playerId=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.spatialLayer!==0&&t.tag(2,re.Varint).int32(e.spatialLayer),e.temporalLayer!==0&&t.tag(3,re.Varint).int32(e.temporalLayer),e.playerId!==""&&t.tag(4,re.LengthDelimited).string(e.playerId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},yu=new qh,Yh=class extends je{constructor(){super("dataChannelRequest",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},vu=new Yh,$h=class extends je{constructor(){super("peerDataChannels",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"playerId",kind:"scalar",T:9},{no:3,name:"sendStreamId",kind:"scalar",T:5},{no:4,name:"recvStreamId",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.playerId="",t.sendStreamId=0,t.recvStreamId=0,e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.playerId=e.string();break;case 3:s.sendStreamId=e.int32();break;case 4:s.recvStreamId=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.playerId!==""&&t.tag(2,re.LengthDelimited).string(e.playerId),e.sendStreamId!==0&&t.tag(3,re.Varint).int32(e.sendStreamId),e.recvStreamId!==0&&t.tag(4,re.Varint).int32(e.recvStreamId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},xu=new $h,Kh=class extends je{constructor(){super("peerDataChannelsReady",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},_u=new Kh,Jh=class extends je{constructor(){super("streamerDataChannels",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"sfuId",kind:"scalar",T:9},{no:3,name:"sendStreamId",kind:"scalar",T:5},{no:4,name:"recvStreamId",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.sfuId="",t.sendStreamId=0,t.recvStreamId=0,e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.sfuId=e.string();break;case 3:s.sendStreamId=e.int32();break;case 4:s.recvStreamId=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.sfuId!==""&&t.tag(2,re.LengthDelimited).string(e.sfuId),e.sendStreamId!==0&&t.tag(3,re.Varint).int32(e.sendStreamId),e.recvStreamId!==0&&t.tag(4,re.Varint).int32(e.recvStreamId);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},Su=new Jh,Zh=class extends je{constructor(){super("startStreaming",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},bu=new Zh,jh=class extends je{constructor(){super("stopStreaming",[{no:1,name:"type",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},Mu=new jh,Qh=class extends je{constructor(){super("playerCount",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"count",kind:"scalar",T:5}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.count=0,e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.count=e.int32();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.count!==0&&t.tag(2,re.Varint).int32(e.count);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},wu=new Qh,eu=class extends je{constructor(){super("stats",[{no:1,name:"type",kind:"scalar",T:9},{no:2,name:"data",kind:"scalar",T:9}])}create(e){let t=globalThis.Object.create(this.messagePrototype);return t.type="",t.data="",e!==void 0&&Je(this,t,e),t}internalBinaryRead(e,t,n,r){let s=r??this.create(),o=e.pos+t;for(;e.pos<o;){let[a,l]=e.tag();switch(a){case 1:s.type=e.string();break;case 2:s.data=e.string();break;default:let c=n.readUnknownField;if(c==="throw")throw new globalThis.Error(`Unknown field ${a} (wire type ${l}) for ${this.typeName}`);let h=e.skip(l);c!==!1&&(c===!0?_e.onRead:c)(this.typeName,s,a,l,h)}}return s}internalBinaryWrite(e,t,n){e.type!==""&&t.tag(1,re.LengthDelimited).string(e.type),e.data!==""&&t.tag(2,re.LengthDelimited).string(e.data);let r=n.writeUnknownFields;return r!==!1&&(r==!0?_e.onWrite:r)(this.typeName,e,t),t}},Eu=new eu;var op={answer:du,config:tu,disconnectPlayer:pu,endpointId:iu,endpointIdConfirm:ru,iceCandidate:fu,identify:nu,listStreamers:su,offer:uu,ping:us,playerConnected:cu,playerCount:wu,playerDisconnected:hu,pong:mu,stats:Eu,streamerDisconnected:gu,streamerList:ou,subscribe:au,unsubscribe:lu,layerPreference:yu,dataChannelRequest:vu,peerDataChannels:xu,peerDataChannelsReady:_u,streamerDataChannels:Su,startStreaming:bu,stopStreaming:Mu};var Kt={};$u(Kt,{createMessage:()=>Tu,validateMessage:()=>ax});function Tu(i,e){let t=i.create();return t.type=i.typeName,e&&i.mergePartial(t,e),t}function ax(i){var e;let t=!0;if(!i.type)return L.Error(`Parsed message has no type. Rejected. ${JSON.stringify(i)}`),null;let n=op[i.type];if(!n)return L.Error(`Message is of an unknown type: "${i.type}". Rejected.`),null;if(n.fields)for(let r of n.fields)r.opt||Object.prototype.hasOwnProperty.call(i,r.name)||(L.Error(`Message "${i.type}" is missing required field "${r.name}". Rejected.`),t=!1);for(let r in i)((e=n.fields)===null||e===void 0?void 0:e.find(o=>o.name===r))||(L.Error(`Message "${i.type}" contains unknown field "${r}". Rejected.`),t=!1);return t?n:null}var ds=class{get RTT(){return this.rtt}constructor(e,t){this.alive=!1,this.rtt=0,this.protocol=e,this.timeout=t,this.onResponse=this.onHeartbeatResponse.bind(this),this.protocol.transport.on("close",this.stop.bind(this)),this.start()}start(){this.alive=!0,this.protocol.on("pong",this.onResponse),this.keepalive=setInterval(this.sendHeartbeat.bind(this),this.timeout)}stop(){clearInterval(this.keepalive),this.protocol.off("pong",this.onResponse)}sendHeartbeat(){var e;if(this.alive===!1){(e=this.onTimeout)===null||e===void 0||e.call(this);return}this.alive=!1,this.protocol.sendMessage(Tu(us,{time:new Date().getTime()}))}onHeartbeatResponse(e){this.rtt=new Date().getTime()-e.time,this.alive=!0}};var Da=class{static addVideoHeaderExtensionToSdp(e,t){let n=e.split(`
`).filter(l=>l.startsWith("a=extmap:")).map(l=>parseInt(l.split(" ")[0].substring(9),10)).sort((l,c)=>l-c).filter((l,c,h)=>h.indexOf(l)===c),s="a=extmap:"+(n[n.length-1]+1)+" "+t+`\r
`,o=e.split(`
m=`).map((l,c)=>(c>0?"m="+l:l).trim()+`\r
`);return o.shift()+o.map(l=>l.startsWith("m=video")?l+s:l).join("")}};var Fa=class{constructor(e){this.videoElementProvider=e,this.audioElement=document.createElement("Audio"),this.videoElementProvider.setAudioElement(this.audioElement)}handleOnTrack(e){if(L.Info("handleOnTrack "+JSON.stringify(e.streams)),e.streams.length<1||e.streams[0].id==="probator")return;let t=this.videoElementProvider.getVideoElement();if(e.track&&L.Info("Got track - "+e.track.kind+" id="+e.track.id+" readyState="+e.track.readyState),e.track.kind==="audio"){this.CreateAudioTrack(e.streams[0]);return}else if(e.track.kind==="video"&&t.srcObject!==e.streams[0]){t.srcObject=e.streams[0],L.Info("Set video source from video track ontrack.");return}}CreateAudioTrack(e){let t=this.videoElementProvider.getVideoElement();t.srcObject!=e&&t.srcObject&&t.srcObject!==e&&(this.audioElement.srcObject=e,L.Info("Created new audio element to play separate audio stream."))}};var Na=class{constructor(e){this.freezeFrameHeight=0,this.freezeFrameWidth=0,this.rootDiv=e,this.rootElement=document.createElement("div"),this.rootElement.id="freezeFrame",this.rootElement.style.display="none",this.rootElement.style.pointerEvents="none",this.rootElement.style.position="absolute",this.rootElement.style.zIndex="20",this.imageElement=document.createElement("img"),this.imageElement.style.position="absolute",this.rootElement.appendChild(this.imageElement),this.rootDiv.appendChild(this.rootElement)}setElementForShow(){this.rootElement.style.display="block"}setElementForHide(){this.rootElement.style.display="none"}updateImageElementSource(e){let t=btoa(e.reduce((n,r)=>n+String.fromCharCode(r),""));this.imageElement.src="data:image/jpeg;base64,"+t}setDimensionsFromElementAndResize(){this.freezeFrameHeight=this.imageElement.naturalHeight,this.freezeFrameWidth=this.imageElement.naturalWidth,this.resize()}resize(){if(this.freezeFrameWidth!==0&&this.freezeFrameHeight!==0){let e=0,t=0,n=0,r=0,s=this.rootDiv.clientWidth/this.rootDiv.clientHeight,o=this.freezeFrameWidth/this.freezeFrameHeight;s<o?(e=this.rootDiv.clientWidth,t=Math.floor(this.rootDiv.clientWidth/o),n=Math.floor((this.rootDiv.clientHeight-t)*.5),r=0):(e=Math.floor(this.rootDiv.clientHeight*o),t=this.rootDiv.clientHeight,n=0,r=Math.floor((this.rootDiv.clientWidth-e)*.5)),this.rootElement.style.width=this.rootDiv.offsetWidth+"px",this.rootElement.style.height=this.rootDiv.offsetHeight+"px",this.rootElement.style.left="0px",this.rootElement.style.top="0px",this.imageElement.style.width=e+"px",this.imageElement.style.height=t+"px",this.imageElement.style.left=r+"px",this.imageElement.style.top=n+"px"}}};var Oa=class{constructor(e){this.receiving=!1,this.size=0,this.jpeg=void 0,this.valid=!1,this.freezeFrameDelay=50,this.freezeFrame=new Na(e)}showFreezeFrame(){this.valid&&this.freezeFrame.setElementForShow()}hideFreezeFrame(){this.valid=!1,this.freezeFrame.setElementForHide()}updateFreezeFrameAndShow(e,t){this.freezeFrame.updateImageElementSource(e),this.freezeFrame.imageElement.onload=()=>{this.freezeFrame.setDimensionsFromElementAndResize(),t()}}processFreezeFrameMessage(e,t){this.receiving||(this.receiving=!0,this.valid=!1,this.size=0,this.jpeg=void 0),this.size=new DataView(e.slice(1,5).buffer).getInt32(0,!0);let n=e.slice(5);if(this.jpeg){let r=new Uint8Array(this.jpeg.length+n.length);r.set(this.jpeg,0),r.set(n,this.jpeg.length),this.jpeg=r}else this.jpeg=n,this.receiving=!0,L.Info(`received first chunk of freeze frame: ${this.jpeg.length}/${this.size}`);this.jpeg.length===this.size?(this.receiving=!1,this.valid=!0,L.Info(`received complete freeze frame ${this.size}`),this.updateFreezeFrameAndShow(this.jpeg,t)):this.jpeg.length>this.size&&(L.Error(`received bigger freeze frame than advertised: ${this.jpeg.length}/${this.size}`),this.jpeg=void 0,this.receiving=!1)}};var In=class{constructor(e,t,n,r,s=()=>{}){this.parseURLParams(),this.onChange=s,this.onChangeEmit=()=>{},this.id=e,this.description=n,this.label=t,this.value=r}set label(e){this._label=e,this.onChangeEmit(this._value)}get label(){return this._label}get value(){return this._value}set value(e){this._value=e,this.onChange(this._value,this),this.onChangeEmit(this._value)}updateURLParams(){if(this.useUrlParams){let e=new URLSearchParams(window.location.search),t=this.getValueAsString(),n=!1;for(let[r,s]of e)if(r.toLowerCase()==this.id.toLowerCase()){e.set(r,t),n=!0;break}n||e.set(this.id,t),window.history.replaceState({},"",e.toString()!==""?`${location.pathname}?${e}`:`${location.pathname}`)}}getValueAsString(){return""}parseURLParams(){this._urlParams={};let e=new URLSearchParams(window.location.search);for(let[t,n]of e)this._urlParams[t.toLowerCase()]=n}hasURLParam(e){return e.toLowerCase()in this._urlParams}getURLParam(e){return this.hasURLParam(e)?this._urlParams[e.toLowerCase()]:""}};var ct=class extends In{constructor(e,t,n,r,s,o=()=>{}){if(super(e,t,n,r,o),!s||!this.hasURLParam(this.id))this.flag=r;else{let a=this.getURLParam(this.id);this.flag=a.toLowerCase()!="false"}this.useUrlParams=s}getValueAsString(){return this.flag?"true":"false"}enable(){this.flag=!0}get flag(){return!!this.value}set flag(e){this.value=e}};var kt=class extends In{constructor(e,t,n,r,s,o,a,l=()=>{}){if(super(e,t,n,o,l),this._min=r,this._max=s,!a||!this.hasURLParam(this.id))this.number=o;else{let c=Number.parseFloat(this.getURLParam(this.id));this.number=Number.isNaN(c)?o:c}this.useUrlParams=a}getValueAsString(){return this.number.toString()}set number(e){this.value=this.clamp(e)}get number(){return this.value}clamp(e){return this._min==null&&this._max==null?e:this._min==null?Math.min(this._max,e):this._max==null?Math.max(this._min,e):Math.max(Math.min(this._max,e),this._min)}get min(){return this._min}get max(){return this._max}addOnChangedListener(e){this.onChange=e}};var Ua=class extends In{constructor(e,t,n,r,s,o=()=>{}){super(e,t,n,r,o),!s||!this.hasURLParam(this.id)?this.text=r:this.text=this.getURLParam(this.id),this.useUrlParams=s}getValueAsString(){return this.text}get text(){return this.value}set text(e){this.value=e}};var vr=class extends In{constructor(e,t,n,r,s,o,a=function(c){return c},l=()=>{}){super(e,t,n,r,l),this._urlParamResolver=a;let c=this.hasURLParam(this.id)?this._urlParamResolver(this.getURLParam(this.id)):r;this.options=s??[c],this.selected=c,this.useUrlParams=o}getValueAsString(){return this.selected}addOnChangedListener(e){this.onChange=e}get options(){return this._options}set options(e){this._options=e,this.onChangeEmit(this.selected)}get selected(){return this.value}set selected(e){e!==void 0&&(this.options.includes(e)?this.value=e:L.Error(`Could not set "${e}" as the selected option for ${this.id} because it wasn't one of the options.`))}set urlParamResolver(e){this._urlParamResolver=e}};var ka=class extends Event{constructor(e){super("afkWarningActivate"),this.data=e}},fs=class extends Event{constructor(e){super("afkWarningUpdate"),this.data=e}},Ba=class extends Event{constructor(){super("afkWarningDeactivate")}},Va=class extends Event{constructor(){super("afkTimedOut")}},za=class extends Event{constructor(e){super("videoEncoderAvgQP"),this.data=e}},Ha=class extends Event{constructor(){super("webRtcSdp")}},Wa=class extends Event{constructor(e){super("webRtcSdpAnswer"),this.data=e}},Ga=class extends Event{constructor(e){super("webRtcSdpOffer"),this.data=e}},Xa=class extends Event{constructor(){super("webRtcAutoConnect")}},qa=class extends Event{constructor(){super("webRtcConnecting")}},Ya=class extends Event{constructor(){super("webRtcConnected")}},$a=class extends Event{constructor(){super("webRtcFailed")}},Ka=class extends Event{constructor(e){super("webRtcDisconnected"),this.data=e}},Ja=class extends Event{constructor(e){super("dataChannelOpen"),this.data=e}},Za=class extends Event{constructor(e){super("dataChannelClose"),this.data=e}},ja=class extends Event{constructor(e){super("dataChannelError"),this.data=e}},Qa=class extends Event{constructor(){super("videoInitialized")}},el=class extends Event{constructor(){super("streamLoading")}},tl=class extends Event{constructor(){super("streamConnect")}},nl=class extends Event{constructor(){super("streamDisconnect")}},il=class extends Event{constructor(){super("streamReconnect")}},rl=class extends Event{constructor(e){super("playStreamError"),this.data=e}},sl=class extends Event{constructor(){super("playStream")}},ps=class extends Event{constructor(e){super("playStreamRejected"),this.data=e}},ol=class extends Event{constructor(e){super("loadFreezeFrame"),this.data=e}},al=class extends Event{constructor(){super("hideFreezeFrame")}},ll=class extends Event{constructor(e){super("statsReceived"),this.data=e}},cl=class extends Event{constructor(e){super("streamerListMessage"),this.data=e}},hl=class extends Event{constructor(e){super("StreamerIDChangedMessage"),this.data=e}},ul=class extends Event{constructor(e){super("latencyTestResult"),this.data=e}},dl=class extends Event{constructor(e){super("latencyCalculated"),this.data=e}},fl=class extends Event{constructor(e){super("showOnScreenKeyboard"),this.data=e}},pl=class extends Event{constructor(e){super("dataChannelLatencyTestResponse"),this.data=e}},ml=class extends Event{constructor(e){super("dataChannelLatencyTestResult"),this.data=e}},gl=class extends Event{constructor(e){super("subscribeFailed"),this.data=e}},yl=class extends Event{constructor(e){super("initialSettings"),this.data=e}},Ni=class extends Event{constructor(e){super("settingsChanged"),this.data=e}};var vl=class extends Event{constructor(e){super("xrFrame"),this.data=e}},xl=class extends Event{constructor(e){super("playerCount"),this.data=e}},_l=class extends Event{constructor(){super("webRtcTCPRelayDetected")}},Sl=class extends EventTarget{dispatchEvent(e){return super.dispatchEvent(e)}addEventListener(e,t){super.addEventListener(e,t)}removeEventListener(e,t){super.removeEventListener(e,t)}};function Cu(i){let[e,t]=i.trim().split(" "),n=new Map;for(let r of(t??"").split(";")){let[s,o]=r.split("=");s&&n.set(s.trim().toLowerCase(),(o??"").trim())}return{name:(e??"").toUpperCase(),parameters:n}}var lx=[{profileIdc:66,pattern:"x1xx0000",profile:"constrained-baseline"},{profileIdc:77,pattern:"1xxx0000",profile:"constrained-baseline"},{profileIdc:88,pattern:"11xx0000",profile:"constrained-baseline"},{profileIdc:66,pattern:"x0xx0000",profile:"baseline"},{profileIdc:88,pattern:"10xx0000",profile:"baseline"},{profileIdc:77,pattern:"0x0x0000",profile:"main"},{profileIdc:100,pattern:"00000000",profile:"high"},{profileIdc:100,pattern:"00001100",profile:"constrained-high"},{profileIdc:244,pattern:"00000000",profile:"predictive-high-444"}];function cx(i){var e;let t=parseInt(i.substring(0,2),16),n=parseInt(i.substring(2,4),16),r=lx.find(({profileIdc:s,pattern:o})=>s===t&&[...o].every((a,l)=>a==="x"||(n>>7-l&1)===Number(a)));return(e=r?.profile)!==null&&e!==void 0?e:i.substring(0,4).toLowerCase()}function Oi(i){let{name:e,parameters:t}=Cu(i),n=(r,s)=>{var o;return(o=t.get(r))!==null&&o!==void 0?o:s};switch(e){case"H264":{let r=cx(n("profile-level-id","42e01f"));return`${e} profile=${r};packetization-mode=${n("packetization-mode","0")}`}case"H265":return`${e} profile-id=${n("profile-id","1")};tier-flag=${n("tier-flag","0")};tx-mode=${n("tx-mode","SRST").toUpperCase()}`;case"VP9":return`${e} profile-id=${n("profile-id","0")}`;case"AV1":return`${e} profile=${n("profile","0")}`;default:return e}}function Au(i){return i.mimeType.split("/")[1]+" "+(i.sdpFmtpLine||"")}function ap(i,e){var t,n;let r=Oi(i),s=Cu(i).name;return(n=(t=e.find(o=>o===i))!==null&&t!==void 0?t:e.find(o=>Oi(o)===r))!==null&&n!==void 0?n:e.find(o=>Cu(o).name===s)}function lp(i,e){let t=n=>{let r=e.indexOf(Au(n));return r===-1?e.length:r};return[...i].sort((n,r)=>t(n)-t(r))}var ui=class{static getSupportedVideoCodecs(){let e=[];if(!RTCRtpReceiver.getCapabilities)return L.Warning("RTCRtpReceiver.getCapabilities API is not available in your browser, defaulting to guess that we support H.264."),e.push("H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f"),e;let t=/(VP\d|H26\d|AV1).*/,n=RTCRtpReceiver.getCapabilities("video");return n?(n.codecs.forEach(r=>{let s=Au(r);t.exec(s)!==null&&e.push(s)}),e):(e.push("H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f"),e)}};var N=class{};N.AutoConnect="AutoConnect";N.AutoPlayVideo="AutoPlayVideo";N.AFKDetection="TimeoutIfIdle";N.HoveringMouseMode="HoveringMouse";N.ForceMonoAudio="ForceMonoAudio";N.ForceTURN="ForceTURN";N.FakeMouseWithTouches="FakeMouseWithTouches";N.IsQualityController="ControlsQuality";N.MatchViewportResolution="MatchViewportRes";N.StartVideoMuted="StartVideoMuted";N.SuppressBrowserKeys="SuppressBrowserKeys";N.UseMic="UseMic";N.UseModalForTextInput="UseModalForTextInput";N.UseCamera="UseCamera";N.KeyboardInput="KeyboardInput";N.MouseInput="MouseInput";N.MouseDoubleClickAutoRelease="MouseDoubleClickAutoRelease";N.TouchInput="TouchInput";N.GamepadInput="GamepadInput";N.XRControllerInput="XRControllerInput";N.AutoEnterVR="AutoEnterVR";N.WaitForStreamer="WaitForStreamer";N.HideUI="HideUI";N.EnableCaptureTimeExt="EnableCaptureTimeExt";N.BrowserSendOffer="BrowserSendOffer";N.LatencyCSV="LatencyCSV";var hx=i=>Object.getOwnPropertyNames(N).some(e=>N[e]===i),$=class{};$.AFKTimeoutSecs="AFKTimeout";$.AFKCountdownSecs="AFKCountdown";$.MinQP="MinQP";$.MaxQP="MaxQP";$.MinQuality="MinQuality";$.MaxQuality="MaxQuality";$.CompatQualityMin="CompatQualityMin";$.CompatQualityMax="CompatQualityMax";$.WebRTCFPS="WebRTCFPS";$.WebRTCMinBitrate="WebRTCMinBitrate";$.WebRTCMaxBitrate="WebRTCMaxBitrate";$.MaxReconnectAttempts="MaxReconnectAttempts";$.StreamerAutoJoinInterval="StreamerAutoJoinInterval";$.KeepaliveDelay="KeepaliveDelay";$.ViewportResScale="ViewportResScale";var ux=i=>Object.getOwnPropertyNames($).some(e=>$[e]===i),wn=class{};wn.SignallingServerUrl="ss";var dx=i=>Object.getOwnPropertyNames(wn).some(e=>wn[e]===i),Ve=class{};Ve.PreferredCodec="PreferredCodec";Ve.StreamerId="StreamerId";Ve.PreferredQuality="PreferredQuality";var fx=i=>Object.getOwnPropertyNames(Ve).some(e=>Ve[e]===i),bl=class{constructor(e={}){this.flags=new Map,this.numericParameters=new Map,this.textParameters=new Map,this.optionParameters=new Map;let{initialSettings:t,useUrlParams:n,webSocketProtocols:r}=e;this._useUrlParams=!!n,this._webSocketProtocols=r,this.populateDefaultSettings(this._useUrlParams,t)}get useUrlParams(){return this._useUrlParams}get webSocketProtocols(){return this._webSocketProtocols}populateDefaultSettings(e,t){this.textParameters.set(wn.SignallingServerUrl,new Ua(wn.SignallingServerUrl,"Signalling url","Url of the signalling server",t&&Object.prototype.hasOwnProperty.call(t,wn.SignallingServerUrl)?t[wn.SignallingServerUrl]:(location.protocol==="https:"?"wss://":"ws://")+window.location.hostname+(window.location.port==="80"||window.location.port===""?"":`:${window.location.port}`),e)),this.optionParameters.set(Ve.StreamerId,new vr(Ve.StreamerId,"Streamer ID","The ID of the streamer to stream.",t&&Object.prototype.hasOwnProperty.call(t,Ve.StreamerId)?t[Ve.StreamerId]:"",t&&Object.prototype.hasOwnProperty.call(t,Ve.StreamerId)?[t[Ve.StreamerId]]:void 0,e));let n=function(){let s=ui.getSupportedVideoCodecs();if(s.length==1)return s[0];if(s.length>0){let o=s[0];for(let a of s)if(a.startsWith("H264"))return a;return o}return L.Error("Could not find any reasonable video codec to assign as a default."),""},r=function(s){let o=ui.getSupportedVideoCodecs();if(o.includes(s))return s;for(let a of o)if(a.startsWith(s))return a;return s};this.optionParameters.set(Ve.PreferredCodec,new vr(Ve.PreferredCodec,"Preferred Codec","The preferred codec to be used during codec negotiation",t&&Object.prototype.hasOwnProperty.call(t,Ve.PreferredCodec)?r(t[Ve.PreferredCodec]):n(),ui.getSupportedVideoCodecs(),e,r)),this.optionParameters.set(Ve.PreferredQuality,new vr(Ve.PreferredQuality,"Preferred Quality","The preferred quality of the stream (only applicable when using the SFU)",t&&Object.prototype.hasOwnProperty.call(t,Ve.PreferredQuality)?t[Ve.PreferredQuality]:"Default",["Default"],e)),this.flags.set(N.AutoConnect,new ct(N.AutoConnect,"Auto connect to stream","Whether we should attempt to auto connect to the signalling server or show a click to start prompt.",t&&Object.prototype.hasOwnProperty.call(t,N.AutoConnect)?t[N.AutoConnect]:!1,e)),this.flags.set(N.AutoPlayVideo,new ct(N.AutoPlayVideo,"Auto play video","When video is ready automatically start playing it as opposed to showing a play button.",t&&Object.prototype.hasOwnProperty.call(t,N.AutoPlayVideo)?t[N.AutoPlayVideo]:!0,e)),this.flags.set(N.UseMic,new ct(N.UseMic,"Use microphone","Make browser request microphone access and open an input audio track.",t&&Object.prototype.hasOwnProperty.call(t,N.UseMic)?t[N.UseMic]:!1,e)),this.flags.set(N.UseModalForTextInput,new ct(N.UseModalForTextInput,"Use modal for text input","When entering input into a streamed UE text widget, use an input modal.",t&&Object.prototype.hasOwnProperty.call(t,N.UseModalForTextInput)?t[N.UseModalForTextInput]:!0,e)),this.flags.set(N.UseCamera,new ct(N.UseCamera,"Use webcam","Make browser request webcam access and open a input video track.",t&&Object.prototype.hasOwnProperty.call(t,N.UseCamera)?t[N.UseCamera]:!1,e)),this.flags.set(N.StartVideoMuted,new ct(N.StartVideoMuted,"Start video muted","Video will start muted if true.",t&&Object.prototype.hasOwnProperty.call(t,N.StartVideoMuted)?t[N.StartVideoMuted]:!1,e)),this.flags.set(N.SuppressBrowserKeys,new ct(N.SuppressBrowserKeys,"Suppress browser keys","Suppress certain browser keys that we use in UE, for example F5 to show shader complexity instead of refresh the page.",t&&Object.prototype.hasOwnProperty.call(t,N.SuppressBrowserKeys)?t[N.SuppressBrowserKeys]:!0,e)),this.flags.set(N.IsQualityController,new ct(N.IsQualityController,"Is quality controller?","True if this peer controls stream quality",t&&Object.prototype.hasOwnProperty.call(t,N.IsQualityController)?t[N.IsQualityController]:!0,e)),this.flags.set(N.ForceMonoAudio,new ct(N.ForceMonoAudio,"Force mono audio","Force browser to request mono audio in the SDP",t&&Object.prototype.hasOwnProperty.call(t,N.ForceMonoAudio)?t[N.ForceMonoAudio]:!1,e)),this.flags.set(N.ForceTURN,new ct(N.ForceTURN,"Force TURN","Only generate TURN/Relayed ICE candidates.",t&&Object.prototype.hasOwnProperty.call(t,N.ForceTURN)?t[N.ForceTURN]:!1,e)),this.flags.set(N.AFKDetection,new ct(N.AFKDetection,"AFK if idle","Timeout the experience if user is AFK for a period.",t&&Object.prototype.hasOwnProperty.call(t,N.AFKDetection)?t[N.AFKDetection]:!1,e)),this.flags.set(N.MatchViewportResolution,new ct(N.MatchViewportResolution,"Match viewport resolution","Pixel Streaming will be instructed to dynamically resize the video stream to match the size of the video element.",t&&Object.prototype.hasOwnProperty.call(t,N.MatchViewportResolution)?t[N.MatchViewportResolution]:!1,e)),this.flags.set(N.HoveringMouseMode,new ct(N.HoveringMouseMode,"Control Scheme: Locked Mouse","Either locked mouse, where the pointer is consumed by the video and locked to it, or hovering mouse, where the mouse is not consumed.",t&&Object.prototype.hasOwnProperty.call(t,N.HoveringMouseMode)?t[N.HoveringMouseMode]:!1,e,(s,o)=>{o.label=`Control Scheme: ${s?"Hovering":"Locked"} Mouse`})),this.flags.set(N.FakeMouseWithTouches,new ct(N.FakeMouseWithTouches,"Fake mouse with touches","A single finger touch is converted into a mouse event. This allows a non-touch application to be controlled partially via a touch device.",t&&Object.prototype.hasOwnProperty.call(t,N.FakeMouseWithTouches)?t[N.FakeMouseWithTouches]:!1,e)),this.flags.set(N.KeyboardInput,new ct(N.KeyboardInput,"Keyboard input","If enabled, send keyboard events to streamer",t&&Object.prototype.hasOwnProperty.call(t,N.KeyboardInput)?t[N.KeyboardInput]:!0,e)),this.flags.set(N.MouseInput,new ct(N.MouseInput,"Mouse input","If enabled, send mouse events to streamer",t&&Object.prototype.hasOwnProperty.call(t,N.MouseInput)?t[N.MouseInput]:!0,e)),this.flags.set(N.MouseDoubleClickAutoRelease,new ct(N.MouseDoubleClickAutoRelease,"Auto release after double-click","After sending a MouseDouble message, also send a matching MouseUp so the streamer\u2019s pressed-button state stays balanced. Disable to restore pre-fix behaviour if your project handles the doubleclick release itself.",t&&Object.prototype.hasOwnProperty.call(t,N.MouseDoubleClickAutoRelease)?t[N.MouseDoubleClickAutoRelease]:!0,e)),this.flags.set(N.TouchInput,new ct(N.TouchInput,"Touch input","If enabled, send touch events to streamer",t&&Object.prototype.hasOwnProperty.call(t,N.TouchInput)?t[N.TouchInput]:!0,e)),this.flags.set(N.GamepadInput,new ct(N.GamepadInput,"Gamepad input","If enabled, send gamepad events to streamer",t&&Object.prototype.hasOwnProperty.call(t,N.GamepadInput)?t[N.GamepadInput]:!0,e)),this.flags.set(N.XRControllerInput,new ct(N.XRControllerInput,"XR controller input","If enabled, send XR controller events to streamer",t&&Object.prototype.hasOwnProperty.call(t,N.XRControllerInput)?t[N.XRControllerInput]:!0,e)),this.flags.set(N.AutoEnterVR,new ct(N.AutoEnterVR,"Auto enter VR","When the video is ready and an immersive-vr session is supported, request the WebXR session automatically. May fail if the browser requires a user gesture to start a WebXR session.",t&&Object.prototype.hasOwnProperty.call(t,N.AutoEnterVR)?t[N.AutoEnterVR]:!1,e)),this.flags.set(N.WaitForStreamer,new ct(N.WaitForStreamer,"Wait for streamer","Will continue trying to connect to the first streamer available.",t&&Object.prototype.hasOwnProperty.call(t,N.WaitForStreamer)?t[N.WaitForStreamer]:!0,e)),this.flags.set(N.HideUI,new ct(N.HideUI,"Hide the UI overlay","Will hide all UI overlay details",t&&Object.prototype.hasOwnProperty.call(t,N.HideUI)?t[N.HideUI]:!1,e)),this.flags.set(N.EnableCaptureTimeExt,new ct(N.EnableCaptureTimeExt,"Enable abs-capture-time","Enables the abs-capture-time RTP header extension",t&&Object.prototype.hasOwnProperty.call(t,N.EnableCaptureTimeExt)?t[N.EnableCaptureTimeExt]:!1,e)),this.flags.set(N.BrowserSendOffer,new ct(N.BrowserSendOffer,"Browser send offer (4.27 ONLY)","Browser will initiate the WebRTC handshake by sending the offer to the streamer (4.27 ONLY)",t&&Object.prototype.hasOwnProperty.call(t,N.BrowserSendOffer)?t[N.BrowserSendOffer]:!1,e)),this.flags.set(N.LatencyCSV,new ct(N.LatencyCSV,"Export Latency CSV","Shows a button in the stats panel that allows to run a latency test and export the results to a CSV file.",t&&Object.prototype.hasOwnProperty.call(t,N.LatencyCSV)?t[N.LatencyCSV]:!1,e)),this.numericParameters.set($.AFKTimeoutSecs,new kt($.AFKTimeoutSecs,"AFK timeout","The time (in seconds) it takes for the application to time out if AFK timeout is enabled.",0,null,t&&Object.prototype.hasOwnProperty.call(t,$.AFKTimeoutSecs)?t[$.AFKTimeoutSecs]:120,e)),this.numericParameters.set($.AFKCountdownSecs,new kt($.AFKCountdownSecs,"AFK countdown","The time (in seconds) for a user to respond before the stream is ended after an AFK timeout.",10,null,10,e)),this.numericParameters.set($.MaxReconnectAttempts,new kt($.MaxReconnectAttempts,"Max Reconnects","Maximum number of reconnects the application will attempt when a streamer disconnects.",0,999,t&&Object.prototype.hasOwnProperty.call(t,$.MaxReconnectAttempts)?t[$.MaxReconnectAttempts]:3,e)),this.numericParameters.set($.MinQP,new kt($.MinQP,"Min QP","The lower bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.",0,51,t&&Object.prototype.hasOwnProperty.call(t,$.MinQP)?t[$.MinQP]:0,e)),this.numericParameters.set($.MaxQP,new kt($.MaxQP,"Max QP","The upper bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.",0,51,t&&Object.prototype.hasOwnProperty.call(t,$.MaxQP)?t[$.MaxQP]:51,e)),this.numericParameters.set($.MinQuality,new kt($.MinQuality,"Min Quality","The lower bound for the quality factor of the encoder. 0 = Worst quality, 100 = Best quality.",0,100,t&&Object.prototype.hasOwnProperty.call(t,$.MinQuality)?t[$.MinQuality]:0,e)),this.numericParameters.set($.MaxQuality,new kt($.MaxQuality,"Max Quality","The upper bound for the quality factor of the encoder. 0 = Worst quality, 100 = Best quality.",0,100,t&&Object.prototype.hasOwnProperty.call(t,$.MaxQuality)?t[$.MaxQuality]:100,e)),this.numericParameters.set($.CompatQualityMin,new kt($.CompatQualityMin,"Min Quality","The lower bound for encoding quality. 0 = Worst, 100 = Best.",0,100,t&&Object.prototype.hasOwnProperty.call(t,$.CompatQualityMin)?t[$.CompatQualityMin]:0,e)),this.numericParameters.set($.CompatQualityMax,new kt($.CompatQualityMax,"Max Quality","The upper bound for encoding quality. 0 = Worst, 100 = Best.",0,100,t&&Object.prototype.hasOwnProperty.call(t,$.CompatQualityMax)?t[$.CompatQualityMax]:100,e)),this.numericParameters.set($.WebRTCFPS,new kt($.WebRTCFPS,"Max FPS","The maximum FPS that WebRTC will try to transmit frames at.",1,999,t&&Object.prototype.hasOwnProperty.call(t,$.WebRTCFPS)?t[$.WebRTCFPS]:60,e)),this.numericParameters.set($.WebRTCMinBitrate,new kt($.WebRTCMinBitrate,"Min Bitrate (kbps)","The minimum bitrate that WebRTC should use.",0,5e5,t&&Object.prototype.hasOwnProperty.call(t,$.WebRTCMinBitrate)?t[$.WebRTCMinBitrate]:0,e)),this.numericParameters.set($.WebRTCMaxBitrate,new kt($.WebRTCMaxBitrate,"Max Bitrate (kbps)","The maximum bitrate that WebRTC should use.",0,5e5,t&&Object.prototype.hasOwnProperty.call(t,$.WebRTCMaxBitrate)?t[$.WebRTCMaxBitrate]:0,e)),this.numericParameters.set($.StreamerAutoJoinInterval,new kt($.StreamerAutoJoinInterval,"Streamer Auto Join Interval (ms)","Delay between retries when waiting for an available streamer.",500,9e5,t&&Object.prototype.hasOwnProperty.call(t,$.StreamerAutoJoinInterval)?t[$.StreamerAutoJoinInterval]:3e3,e)),this.numericParameters.set($.KeepaliveDelay,new kt($.KeepaliveDelay,"Connection Keepalive delay","Delay between keepalive pings to the signalling server.",0,9e5,t&&Object.prototype.hasOwnProperty.call(t,$.KeepaliveDelay)?t[$.KeepaliveDelay]:3e4,e)),this.numericParameters.set($.ViewportResScale,new kt($.ViewportResScale,"Viewport Resolution Scale","Scale factor for viewport resolution when MatchViewportResolution is enabled. 1.0 = 100%, 0.5 = 50%, 2.0 = 200%.",.1,3,t&&Object.prototype.hasOwnProperty.call(t,$.ViewportResScale)?t[$.ViewportResScale]:1,e))}_addOnNumericSettingChangedListener(e,t){this.numericParameters.has(e)&&this.numericParameters.get(e).addOnChangedListener(t)}_addOnOptionSettingChangedListener(e,t){this.optionParameters.has(e)&&this.optionParameters.get(e).addOnChangedListener(t)}getNumericSettingValue(e){if(this.numericParameters.has(e))return this.numericParameters.get(e).number;throw new Error(`There is no numeric setting with the id of ${e}`)}hasNumericSetting(e){return this.numericParameters.has(e)}getTextSettingValue(e){if(this.textParameters.has(e))return this.textParameters.get(e).value;throw new Error(`There is no numeric setting with the id of ${e}`)}setNumericSetting(e,t){if(this.numericParameters.has(e))this.numericParameters.get(e).number=t;else throw new Error(`There is no numeric setting with the id of ${e}`)}_addOnSettingChangedListener(e,t){this.flags.has(e)&&(this.flags.get(e).onChange=t)}_addOnTextSettingChangedListener(e,t){this.textParameters.has(e)&&(this.textParameters.get(e).onChange=t)}getSettingOption(e){return this.optionParameters.get(e)}isFlagEnabled(e){return this.flags.get(e).flag}setFlagEnabled(e,t){this.flags.has(e)?this.flags.get(e).flag=t:L.Warning(`Cannot toggle flag called ${e} - it does not exist in the Config.flags map.`)}setTextSetting(e,t){this.textParameters.has(e)?this.textParameters.get(e).text=t:L.Warning(`Cannot set text setting called ${e} - it does not exist in the Config.textParameters map.`)}setOptionSettingOptions(e,t){this.optionParameters.has(e)?this.optionParameters.get(e).options=t:L.Warning(`Cannot set text setting called ${e} - it does not exist in the Config.optionParameters map.`)}setOptionSettingValue(e,t){if(!this.optionParameters.has(e))L.Warning(`Cannot set text setting called ${e} - it does not exist in the Config.enumParameters map.`);else{let n=this.optionParameters.get(e),r=n.options;r.includes(t)||(r.push(t),n.options=r),n.selected=t}}setFlagLabel(e,t){this.flags.has(e)?this.flags.get(e).label=t:L.Warning(`Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`)}setSettings(e){for(let t of Object.keys(e))hx(t)?this.setFlagEnabled(t,e[t]):ux(t)?this.setNumericSetting(t,e[t]):dx(t)?this.setTextSetting(t,e[t]):fx(t)&&this.setOptionSettingValue(t,e[t])}getSettings(){let e={};for(let[t,n]of this.flags.entries())e[t]=n.flag;for(let[t,n]of this.numericParameters.entries())e[t]=n.number;for(let[t,n]of this.textParameters.entries())e[t]=n.text;for(let[t,n]of this.optionParameters.entries())e[t]=n.selected;return e}getFlags(){return Array.from(this.flags.values())}getTextSettings(){return Array.from(this.textParameters.values())}getNumericSettings(){return Array.from(this.numericParameters.values())}getOptionSettings(){return Array.from(this.optionParameters.values())}_registerOnChangeEvents(e){for(let t of this.flags.keys()){let n=this.flags.get(t);n&&(n.onChangeEmit=r=>e.dispatchEvent(new Ni({id:n.id,type:"flag",value:r,target:n})))}for(let t of this.numericParameters.keys()){let n=this.numericParameters.get(t);n&&(n.onChangeEmit=r=>e.dispatchEvent(new Ni({id:n.id,type:"number",value:r,target:n})))}for(let t of this.textParameters.keys()){let n=this.textParameters.get(t);n&&(n.onChangeEmit=r=>e.dispatchEvent(new Ni({id:n.id,type:"text",value:r,target:n})))}for(let t of this.optionParameters.keys()){let n=this.optionParameters.get(t);n&&(n.onChangeEmit=r=>e.dispatchEvent(new Ni({id:n.id,type:"option",value:r,target:n})))}}},Ui;(function(i){i[i.LockedMouse=0]="LockedMouse",i[i.HoveringMouse=1]="HoveringMouse"})(Ui||(Ui={}));var Ml=class{constructor(e,t,n){this.active=!1,this.countdownActive=!1,this.warnTimer=void 0,this.countDown=0,this.countDownTimer=void 0,this.config=e,this.pixelStreaming=t,this.onDismissAfk=n,this.onAFKTimedOutCallback=()=>{L.Warning("AFK timed out, did you want to override this callback?")}}onAfkClick(){clearInterval(this.countDownTimer),(this.active||this.countdownActive)&&(this.startAfkWarningTimer(),this.pixelStreaming.dispatchEvent(new Ba))}startAfkWarningTimer(){this.config.getNumericSettingValue($.AFKTimeoutSecs)>0&&this.config.isFlagEnabled(N.AFKDetection)?this.active=!0:this.active=!1,this.resetAfkWarningTimer()}stopAfkWarningTimer(){this.active=!1,this.countdownActive=!1,clearTimeout(this.warnTimer),clearInterval(this.countDownTimer)}pauseAfkWarningTimer(){this.active=!1}resetAfkWarningTimer(){this.active&&this.config.isFlagEnabled(N.AFKDetection)&&(clearTimeout(this.warnTimer),this.warnTimer=setTimeout(()=>this.activateAfkEvent(),this.config.getNumericSettingValue($.AFKTimeoutSecs)*1e3))}activateAfkEvent(){this.pauseAfkWarningTimer(),this.pixelStreaming.dispatchEvent(new ka({countDown:this.countDown,dismissAfk:this.onDismissAfk})),this.countDown=this.config.getNumericSettingValue($.AFKCountdownSecs),this.countdownActive=!0,this.pixelStreaming.dispatchEvent(new fs({countDown:this.countDown})),this.config.isFlagEnabled(N.HoveringMouseMode)||document.exitPointerLock&&document.exitPointerLock(),this.countDownTimer=setInterval(()=>{this.countDown--,this.countDown===0?(this.pixelStreaming.dispatchEvent(new Va),this.onAFKTimedOutCallback(),L.Info("You have been disconnected due to inactivity"),this.stopAfkWarningTimer()):this.pixelStreaming.dispatchEvent(new fs({countDown:this.countDown}))},1e3)}};var ms=class{constructor(){this.isReceivingFreezeFrame=!1}getDataChannelInstance(){return this}createDataChannel(e,t,n){this.peerConnection=e,this.label=t,this.datachannelOptions=n,n==null&&(this.datachannelOptions={},this.datachannelOptions.ordered=!0),this.dataChannel=this.peerConnection.createDataChannel(this.label,this.datachannelOptions),this.setupDataChannel()}setupDataChannel(){this.dataChannel.binaryType="arraybuffer",this.dataChannel.onopen=e=>this.handleOnOpen(e),this.dataChannel.onclose=e=>this.handleOnClose(e),this.dataChannel.onmessage=e=>this.handleOnMessage(e),this.dataChannel.onerror=e=>this.handleOnError(e)}handleOnOpen(e){var t;L.Info(`Data Channel (${this.label}) opened.`),this.onOpen((t=this.dataChannel)===null||t===void 0?void 0:t.label,e)}handleOnClose(e){var t;L.Info(`Data Channel (${this.label}) closed.`),this.onClose((t=this.dataChannel)===null||t===void 0?void 0:t.label,e)}handleOnMessage(e){L.Info(`Data Channel (${this.label}) message: ${e.type}`)}handleOnError(e){var t;L.Info(`Data Channel (${this.label}) error: ${e.type}`),this.onError((t=this.dataChannel)===null||t===void 0?void 0:t.label,e)}onOpen(e,t){}onClose(e,t){}onError(e,t){}};var wl=class{},El=class{};var Tl=class{};var gs=class{};var ys=class{},vs=class{};var Cl=class{};var Al=class{};var Rl=class{constructor(){this.inboundVideoStats=new El,this.inboundAudioStats=new wl,this.candidatePairs=new Array,this.datachannelStats=new Tl,this.localCandidates=new Array,this.remoteCandidates=new Array,this.outboundVideoStats=new ys,this.outboundAudioStats=new ys,this.remoteOutboundAudioStats=new vs,this.remoteOutboundVideoStats=new vs,this.sessionStats=new Cl,this.streamStats=new Al,this.codecs=new Map}processStats(e){this.localCandidates=new Array,this.remoteCandidates=new Array,this.candidatePairs=new Array,e.forEach(t=>{switch(t.type){case"candidate-pair":this.handleCandidatePair(t);break;case"certificate":break;case"codec":this.handleCodec(t);break;case"data-channel":this.handleDataChannel(t);break;case"inbound-rtp":this.handleInboundRTP(t);break;case"local-candidate":this.handleLocalCandidate(t);break;case"media-source":break;case"media-playout":break;case"outbound-rtp":this.handleLocalOutbound(t);break;case"peer-connection":break;case"remote-candidate":this.handleRemoteCandidate(t);break;case"remote-inbound-rtp":break;case"remote-outbound-rtp":this.handleRemoteOutbound(t);break;case"track":this.handleTrack(t);break;case"transport":this.handleTransport(t);break;case"stream":this.handleStream(t);break;default:L.Error("unhandled Stat Type"),L.Info(t);break}})}handleStream(e){this.streamStats=e}handleCandidatePair(e){this.candidatePairs.push(e)}handleDataChannel(e){this.datachannelStats.bytesReceived=e.bytesReceived,this.datachannelStats.bytesSent=e.bytesSent,this.datachannelStats.dataChannelIdentifier=e.dataChannelIdentifier,this.datachannelStats.id=e.id,this.datachannelStats.label=e.label,this.datachannelStats.messagesReceived=e.messagesReceived,this.datachannelStats.messagesSent=e.messagesSent,this.datachannelStats.protocol=e.protocol,this.datachannelStats.state=e.state,this.datachannelStats.timestamp=e.timestamp}handleLocalCandidate(e){let t=new gs;t.label="local-candidate",t.address=e.address,t.port=e.port,t.protocol=e.protocol,t.candidateType=e.candidateType,t.id=e.id,t.relayProtocol=e.relayProtocol,t.transportId=e.transportId,this.localCandidates.push(t)}handleRemoteCandidate(e){let t=new gs;t.label="remote-candidate",t.address=e.address,t.port=e.port,t.protocol=e.protocol,t.id=e.id,t.candidateType=e.candidateType,t.relayProtocol=e.relayProtocol,t.transportId=e.transportId,this.remoteCandidates.push(t)}handleInboundRTP(e){switch(e.kind){case"video":e.bytesReceived>this.inboundVideoStats.bytesReceived&&e.timestamp>this.inboundVideoStats.timestamp&&(this.inboundVideoStats.bitrate=8*(e.bytesReceived-this.inboundVideoStats.bytesReceived)/(e.timestamp-this.inboundVideoStats.timestamp),this.inboundVideoStats.bitrate=Math.floor(this.inboundVideoStats.bitrate));for(let t in e)this.inboundVideoStats[t]=e[t];break;case"audio":e.bytesReceived>this.inboundAudioStats.bytesReceived&&e.timestamp>this.inboundAudioStats.timestamp&&(this.inboundAudioStats.bitrate=8*(e.bytesReceived-this.inboundAudioStats.bytesReceived)/(e.timestamp-this.inboundAudioStats.timestamp),this.inboundAudioStats.bitrate=Math.floor(this.inboundAudioStats.bitrate));for(let t in e)this.inboundAudioStats[t]=e[t];break;default:L.Error(`Kind should be audio or video, we got ${e.kind} - that's unsupported.`);break}}handleLocalOutbound(e){let t=e.kind==="audio"?this.outboundAudioStats:this.outboundVideoStats;t.active=e.active,t.codecId=e.codecId,t.bytesSent=e.bytesSent,t.frameHeight=e.frameHeight,t.frameWidth=e.frameWidth,t.framesEncoded=e.framesEncoded,t.framesPerSecond=e.framesPerSecond,t.headerBytesSent=e.headerBytesSent,t.id=e.id,t.keyFramesEncoded=e.keyFramesEncoded,t.kind=e.kind,t.mediaSourceId=e.mediaSourceId,t.mid=e.mid,t.nackCount=e.nackCount,t.packetsSent=e.packetsSent,t.qpSum=e.qpSum,t.qualityLimitationDurations=e.qualityLimitationDurations,t.qualityLimitationReason=e.qualityLimitationReason,t.remoteId=e.remoteId,t.retransmittedBytesSent=e.retransmittedBytesSent,t.rid=e.rid,t.scalabilityMode=e.scalabilityMode,t.ssrc=e.ssrc,t.targetBitrate=e.targetBitrate,t.timestamp=e.timestamp,t.totalEncodeTime=e.totalEncodeTime,t.totalEncodeBytesTarget=e.totalEncodeBytesTarget,t.totalPacketSendDelay=e.totalPacketSendDelay,t.transportId=e.transportId}handleRemoteOutbound(e){let t=e.kind==="audio"?this.remoteOutboundAudioStats:this.remoteOutboundVideoStats;t.bytesSent=e.bytesSent,t.codecId=e.codecId,t.id=e.id,t.kind=e.kind,t.localId=e.localId,t.packetsSent=e.packetsSent,t.remoteTimestamp=e.remoteTimestamp,t.reportsSent=e.reportsSent,t.roundTripTimeMeasurements=e.roundTripTimeMeasurements,t.ssrc=e.ssrc,t.timestamp=e.timestamp,t.totalRoundTripTime=e.totalRoundTripTime,t.transportId=e.transportId}handleTrack(e){e.type==="track"&&(e.trackIdentifier==="video_label"||e.kind==="video")&&(this.inboundVideoStats.framesDropped=e.framesDropped,this.inboundVideoStats.framesReceived=e.framesReceived,this.inboundVideoStats.frameHeight=e.frameHeight,this.inboundVideoStats.frameWidth=e.frameWidth)}handleTransport(e){this.transportStats=e}handleCodec(e){let t=e.id;this.codecs.set(t,e)}handleSessionStatistics(e,t,n){let r=Date.now()-e;this.sessionStats.runTime=new Date(r).toISOString().substr(11,8).toString();let s=t===null?"Not sent yet":t?"true":"false";this.sessionStats.controlsStreamInput=s,this.sessionStats.videoEncoderAvgQP=n}isNumber(e){return typeof e=="number"&&isFinite(e)}getActiveCandidatePair(){if(this.candidatePairs===void 0)return null;if(this.transportStats){let t=this.candidatePairs.find(n=>n.id===this.transportStats.selectedCandidatePairId);return t===void 0?null:t}let e=this.candidatePairs.find(t=>t.selected);return e===void 0?null:e}};var Ll=Ap(cp());var di=class{static isVideoTransceiver(e){return this.canTransceiverReceiveVideo(e)||this.canTransceiverSendVideo(e)}static canTransceiverReceiveVideo(e){return!!e&&(e.direction==="sendrecv"||e.direction==="recvonly")&&e.receiver&&e.receiver.track&&e.receiver.track.kind==="video"}static canTransceiverSendVideo(e){return!!e&&(e.direction==="sendrecv"||e.direction==="sendonly")&&e.sender&&e.sender.track&&e.sender.track.kind==="video"}static isAudioTransceiver(e){return this.canTransceiverReceiveAudio(e)||this.canTransceiverSendAudio(e)}static canTransceiverReceiveAudio(e){return!!e&&(e.direction==="sendrecv"||e.direction==="recvonly")&&e.receiver&&e.receiver.track&&e.receiver.track.kind==="audio"}static canTransceiverSendAudio(e){return!!e&&(e.direction==="sendrecv"||e.direction==="sendonly")&&e.sender&&e.sender.track&&e.sender.track.kind==="audio"}};var Iu=class{},Pu=class{},Il=class{constructor(){this.latestSenderRecvClockOffset=null}calculate(e,t){let n=new Lu,r=this.getRTTMs(e);if(r!=null){n.rttMs=r;let s=this.getCaptureSource(t);if(s!=null){let o=this.calculateSenderLatency(e,s);o!==null&&(n.senderLatencyMs=o)}}return e.inboundVideoStats.totalProcessingDelay!==void 0&&e.inboundVideoStats.framesDecoded!==void 0&&(n.averageProcessingDelayMs=e.inboundVideoStats.totalProcessingDelay/e.inboundVideoStats.framesDecoded*1e3),e.inboundVideoStats.jitterBufferDelay!==void 0&&e.inboundVideoStats.jitterBufferEmittedCount!==void 0&&(n.averageJitterBufferDelayMs=e.inboundVideoStats.jitterBufferDelay/e.inboundVideoStats.jitterBufferEmittedCount*1e3),e.inboundVideoStats.framesDecoded!==void 0&&e.inboundVideoStats.totalDecodeTime!==void 0&&(n.averageDecodeLatencyMs=e.inboundVideoStats.totalDecodeTime/e.inboundVideoStats.framesDecoded*1e3),e.inboundVideoStats.totalAssemblyTime!==void 0&&e.inboundVideoStats.framesAssembledFromMultiplePackets!==void 0&&(n.averageAssemblyDelayMs=e.inboundVideoStats.totalAssemblyTime/e.inboundVideoStats.framesAssembledFromMultiplePackets*1e3),e.inboundVideoStats.googTimingFrameInfo!==void 0&&e.inboundVideoStats.googTimingFrameInfo.length>0&&(n.frameTiming=this.extractFrameTimingInfo(e.inboundVideoStats.googTimingFrameInfo)),n.frameTiming!==void 0&&n.frameTiming.captureToSendLatencyMs!==void 0&&n.averageProcessingDelayMs!==void 0&&n.rttMs!==void 0&&(n.averageE2ELatency=n.frameTiming.captureToSendLatencyMs+n.rttMs*.5+n.averageProcessingDelayMs),n.senderLatencyMs!=null&&n.averageProcessingDelayMs!==void 0&&n.rttMs!==void 0&&(n.averageE2ELatency=n.senderLatencyMs+n.rttMs*.5+n.averageProcessingDelayMs),n}extractFrameTimingInfo(e){let t=new Pu,n=e.split(",");return n.length===15&&(t.rtpTimestamp=Number.parseInt(n[0]),t.captureTimestamp=Number.parseInt(n[1]),t.encodeStartTimestamp=Number.parseInt(n[2]),t.encodeFinishTimestamp=Number.parseInt(n[3]),t.packetizerFinishTimestamp=Number.parseInt(n[4]),t.pacerExitTimestamp=Number.parseInt(n[5]),t.networkTimestamp1=Number.parseInt(n[6]),t.networkTimestamp2=Number.parseInt(n[7]),t.receiveStart=Number.parseInt(n[8]),t.receiveFinish=Number.parseInt(n[9]),t.decodeStart=Number.parseInt(n[10]),t.decodeFinish=Number.parseInt(n[11]),t.renderTime=Number.parseInt(n[12]),t.isOutlier=Number.parseInt(n[13])>0,t.isTriggeredByTimer=Number.parseInt(n[14])>0,t.encoderLatencyMs=t.encodeFinishTimestamp-t.encodeStartTimestamp,t.packetizeLatencyMs=t.packetizerFinishTimestamp-t.encodeFinishTimestamp,t.pacerLatencyMs=t.pacerExitTimestamp-t.packetizerFinishTimestamp,t.captureToSendLatencyMs=t.pacerExitTimestamp-t.captureTimestamp),t}calculateSenderLatency(e,t){let n=t.captureTimestamp+t.senderCaptureTimeOffset,r=this.calculateSenderReceiverClockOffset(e);if(r==null)if(this.latestSenderRecvClockOffset!=null)r=this.latestSenderRecvClockOffset;else return null;else this.latestSenderRecvClockOffset=r;let a=n+r-22089888e5;return t.timestamp-a}getCaptureSource(e){e=e.filter(t=>t.track.kind==="video");for(let t of e){let n=t.getSynchronizationSources().concat(t.getContributingSources());for(let r of n)if(r.captureTimestamp!==void 0&&r.senderCaptureTimeOffset!==void 0&&r.timestamp!==void 0){let s=new Iu;return s.timestamp=r.timestamp,s.captureTimestamp=r.captureTimestamp,s.senderCaptureTimeOffset=r.senderCaptureTimeOffset,s}}return null}calculateSenderReceiverClockOffset(e){if(!(e.remoteOutboundVideoStats!==void 0&&e.remoteOutboundVideoStats.timestamp!==void 0&&e.remoteOutboundVideoStats.remoteTimestamp!==void 0))return null;let n=e.remoteOutboundVideoStats.timestamp,r=e.remoteOutboundVideoStats.remoteTimestamp,s=this.getRTTMs(e);if(n!==void 0&&r!==void 0&&s!==null){let o=s*.5;return n-(r+o)}else return null}getRTTMs(e){let t=e.getActiveCandidatePair();return t&&t.currentRoundTripTime!==void 0?t.currentRoundTripTime*1e3:e.remoteOutboundVideoStats&&e.remoteOutboundVideoStats.totalRoundTripTime!==void 0&&e.remoteOutboundVideoStats.roundTripTimeMeasurements!==void 0&&e.remoteOutboundVideoStats.roundTripTimeMeasurements>0?e.remoteOutboundVideoStats.totalRoundTripTime/e.remoteOutboundVideoStats.roundTripTimeMeasurements*1e3:e.remoteOutboundAudioStats&&e.remoteOutboundAudioStats.totalRoundTripTime!==void 0&&e.remoteOutboundAudioStats.roundTripTimeMeasurements!==void 0&&e.remoteOutboundAudioStats.roundTripTimeMeasurements>0?e.remoteOutboundAudioStats.totalRoundTripTime/e.remoteOutboundAudioStats.roundTripTimeMeasurements*1e3:null}},Lu=class{constructor(){this.senderLatencyMs=void 0,this.senderLatencyAbsCaptureTimeMs=void 0,this.rttMs=void 0,this.averageProcessingDelayMs=void 0,this.averageJitterBufferDelayMs=void 0,this.averageDecodeLatencyMs=void 0,this.averageAssemblyDelayMs=void 0,this.averageE2ELatency=void 0,this.frameTiming=void 0}};var Du=function(i,e,t,n){function r(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(h){try{c(n.next(h))}catch(u){o(u)}}function l(h){try{c(n.throw(h))}catch(u){o(u)}}function c(h){h.done?s(h.value):r(h.value).then(a,l)}c((n=n.apply(i,e||[])).next())})},px="http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time",Pl=class{constructor(e,t,n){this.config=t,this.createPeerConnection(e,n),this.latencyCalculator=new Il}createPeerConnection(e,t){this.config.isFlagEnabled(N.ForceTURN)&&(e.iceTransportPolicy="relay",L.Info("Forcing TURN usage by setting ICE Transport Policy in peer connection config.")),this.peerConnection=new RTCPeerConnection(e),this.peerConnection.onsignalingstatechange=n=>this.handleSignalStateChange(n),this.peerConnection.oniceconnectionstatechange=n=>this.handleIceConnectionStateChange(n),this.peerConnection.onicegatheringstatechange=n=>this.handleIceGatheringStateChange(n),this.peerConnection.ontrack=n=>this.handleOnTrack(n),this.peerConnection.onicecandidate=n=>this.handleIceCandidate(n),this.peerConnection.ondatachannel=n=>this.handleDataChannel(n),this.aggregatedStats=new Rl,this.preferredCodec=t,this.updateCodecSelection=!0}createOffer(e,t){L.Info("Create Offer");let n=location.hostname==="localhost"||location.hostname==="127.0.0.1",r=location.protocol==="https:",s=t.isFlagEnabled(N.UseMic),o=t.isFlagEnabled(N.UseCamera);(s||o)&&!(n||r)&&(s=!1,o=!1,L.Error("Microphone and Webcam access in the browser will not work if you are not on HTTPS or localhost. Disabling mic and webcam access."),L.Error("For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")),this.setupTransceiversAsync(s,o).finally(()=>{var a;(a=this.peerConnection)===null||a===void 0||a.createOffer(e).then(l=>{var c;this.showTextOverlayConnecting(),l.sdp=this.mungeSDP(l.sdp,s),(c=this.peerConnection)===null||c===void 0||c.setLocalDescription(l),this.onSendWebRTCOffer(l)}).catch(()=>{this.showTextOverlaySetupFailure()})})}receiveOffer(e,t){var n;L.Info("Receive Offer"),this.isFirefox()&&(e.sdp=e.sdp.replace(/^a=extmap:\d+ http:\/\/www\.webrtc\.org\/experiments\/rtp-hdrext\/abs-capture-time\r\n/gm,"")),(n=this.peerConnection)===null||n===void 0||n.setRemoteDescription(e).then(()=>{this.onSetRemoteDescription(e);let r=location.hostname==="localhost"||location.hostname==="127.0.0.1",s=location.protocol==="https:",o=t.isFlagEnabled(N.UseMic),a=t.isFlagEnabled(N.UseCamera);(o||a)&&!(r||s)&&(o=!1,a=!1,L.Error("Microphone and Webcam access in the browser will not work if you are not on HTTPS or localhost. Disabling mic and webcam access."),L.Error("For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")),this.config.setOptionSettingOptions(Ve.PreferredCodec,this.fuzzyIntersectUEAndBrowserCodecs(e)),this.setupTransceiversAsync(o,a).finally(()=>{var l;(l=this.peerConnection)===null||l===void 0||l.createAnswer().then(c=>{var h;return c.sdp=this.mungeSDP(c.sdp,o),(h=this.peerConnection)===null||h===void 0?void 0:h.setLocalDescription(c)}).then(()=>{var c;this.onSetLocalDescription((c=this.peerConnection)===null||c===void 0?void 0:c.localDescription)}).catch(c=>{L.Error(`createAnswer() failed - ${c}`)})})})}receiveAnswer(e){var t;(t=this.peerConnection)===null||t===void 0||t.setRemoteDescription(e),this.config.setOptionSettingOptions(Ve.PreferredCodec,this.fuzzyIntersectUEAndBrowserCodecs(e))}generateStats(){var e;(e=this.peerConnection)===null||e===void 0||e.getStats().then(t=>{var n;if(this.aggregatedStats.processStats(t),this.onVideoStats(this.aggregatedStats),!this.peerConnection)return;let r=this.latencyCalculator.calculate(this.aggregatedStats,this.peerConnection.getReceivers());if(this.onLatencyCalculated(r),this.updateCodecSelection&&this.aggregatedStats.inboundVideoStats.codecId){let s=this.aggregatedStats.codecs.get(this.aggregatedStats.inboundVideoStats.codecId);if(s===void 0)return;let o=s.mimeType.replace("video/",""),a=o;s.sdpFmtpLine&&s.sdpFmtpLine.trim()!==""&&(a=`${o} ${s.sdpFmtpLine.trim()}`);let l=this.config.getSettingOption(Ve.PreferredCodec).options,c=Oi(a),h=(n=l.find(u=>u===a))!==null&&n!==void 0?n:l.find(u=>Oi(u)===c);if(h!==void 0){this.config.setOptionSettingValue(Ve.PreferredCodec,h);return}}})}close(){this.peerConnection&&(this.peerConnection.close(),this.peerConnection=null)}mungeSDP(e,t){let n=e.replace(/(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm,`$1;x-google-start-bitrate=10000;x-google-max-bitrate=100000\r
`),r="maxaveragebitrate=510000;";return t&&(r+="sprop-maxcapturerate=48000;"),r+=this.config.isFlagEnabled(N.ForceMonoAudio)?"stereo=0;":"stereo=1;",r+="useinbandfec=1",n=n.replace("useinbandfec=1",r),this.config.isFlagEnabled(N.EnableCaptureTimeExt)&&!this.isFirefox()&&(n=Da.addVideoHeaderExtensionToSdp(n,px)),n}isFirefox(){return navigator.userAgent.indexOf("Firefox")>0}handleOnIce(e){var t;if(L.Info("peerconnection handleOnIce"),this.config.isFlagEnabled(N.ForceTURN)&&e.candidate.indexOf("relay")<0){L.Info(`Dropping candidate because it was not TURN relay. | Type= ${e.type} | Protocol= ${e.protocol} | Address=${e.address} | Port=${e.port} |`);return}(t=this.peerConnection)===null||t===void 0||t.addIceCandidate(e)}handleSignalStateChange(e){var t;L.Info("signaling state change: "+((t=this.peerConnection)===null||t===void 0?void 0:t.signalingState))}handleIceConnectionStateChange(e){var t;L.Info("ice connection state change: "+((t=this.peerConnection)===null||t===void 0?void 0:t.iceConnectionState)),this.onIceConnectionStateChange(e)}handleIceGatheringStateChange(e){L.Info("ice gathering state change: "+JSON.stringify(e))}handleOnTrack(e){e.streams.length<1||e.streams[0].id==="probator"||(e.track.kind==="video"&&(this.videoTrack=e.track),e.track.kind==="audio"&&(this.audioTrack=e.track),this.onTrack(e))}handleIceCandidate(e){this.onPeerIceCandidate(e)}handleDataChannel(e){this.onDataChannel(e)}onTrack(e){}onIceConnectionStateChange(e){}onPeerIceCandidate(e){}onDataChannel(e){}fuzzyIntersectUEAndBrowserCodecs(e){var t;let n=new Array,r=this.parseAvailableCodecs(e),s=this.config.getSettingOption(Ve.PreferredCodec).options;for(let o of r){let a=Oi(o),l=(t=s.find(c=>c===o))!==null&&t!==void 0?t:s.find(c=>Oi(c)===a);l!==void 0&&!n.includes(l)&&n.push(l)}return n}setupTransceiversAsync(e,t){return Du(this,void 0,void 0,function*(){var n,r,s,o,a,l,c,h,u,d;let p=!1;for(let M of(r=(n=this.peerConnection)===null||n===void 0?void 0:n.getTransceivers())!==null&&r!==void 0?r:[])if(M&&M.receiver&&M.receiver.track&&M.receiver.track.kind==="video"){p=!0;break}if(t?yield this.setupVideoSender(p):p||(s=this.peerConnection)===null||s===void 0||s.addTransceiver("video",{direction:"recvonly"}),RTCRtpReceiver.getCapabilities&&this.preferredCodec!=""){let M=this.config.getSettingOption(Ve.PreferredCodec).options,m=ap(this.preferredCodec,M),f=lp((a=(o=RTCRtpReceiver.getCapabilities("video"))===null||o===void 0?void 0:o.codecs)!==null&&a!==void 0?a:[],m!==void 0?[m,...M]:M);for(let T of(c=(l=this.peerConnection)===null||l===void 0?void 0:l.getTransceivers())!==null&&c!==void 0?c:[])T&&T.receiver&&T.receiver.track&&T.receiver.track.kind==="video"&&T.setCodecPreferences&&f.length>0&&T.setCodecPreferences(f)}let g=!1;for(let M of(u=(h=this.peerConnection)===null||h===void 0?void 0:h.getTransceivers())!==null&&u!==void 0?u:[])if(M&&M.receiver&&M.receiver.track&&M.receiver.track.kind==="audio"){g=!0;break}e?yield this.setupAudioSender(g):g||(d=this.peerConnection)===null||d===void 0||d.addTransceiver("audio",{direction:"recvonly"})})}setupVideoSender(e){return Du(this,void 0,void 0,function*(){var t,n,r,s;let o={video:!0},a=yield navigator.mediaDevices.getUserMedia(o);if(a)if(e){for(let l of(n=(t=this.peerConnection)===null||t===void 0?void 0:t.getTransceivers())!==null&&n!==void 0?n:[])if(di.canTransceiverReceiveVideo(l))for(let c of a.getTracks())c.kind==="video"&&(l.sender.replaceTrack(c),l.direction="sendrecv")}else for(let l of a.getTracks())l.kind==="video"&&((r=this.peerConnection)===null||r===void 0||r.addTransceiver(l,{direction:"sendrecv"}));else e||(s=this.peerConnection)===null||s===void 0||s.addTransceiver("video",{direction:"recvonly"})})}setupAudioSender(e){return Du(this,void 0,void 0,function*(){var t,n,r,s;let a={video:!1,audio:{autoGainControl:!1,channelCount:1,echoCancellation:!1,latency:0,noiseSuppression:!1,sampleRate:48e3,sampleSize:16,volume:1}},l=yield navigator.mediaDevices.getUserMedia(a);if(l)if(e){for(let c of(n=(t=this.peerConnection)===null||t===void 0?void 0:t.getTransceivers())!==null&&n!==void 0?n:[])if(di.canTransceiverReceiveAudio(c))for(let h of l.getTracks())h.kind==="audio"&&(c.sender.replaceTrack(h),c.direction="sendrecv")}else for(let c of l.getTracks())c.kind==="audio"&&((r=this.peerConnection)===null||r===void 0||r.addTransceiver(c,{direction:"sendrecv"}));else e||(s=this.peerConnection)===null||s===void 0||s.addTransceiver("audio",{direction:"recvonly"})})}onVideoStats(e){}onLatencyCalculated(e){}onSendWebRTCOffer(e){}onSetRemoteDescription(e){}onSetLocalDescription(e){}showTextOverlayConnecting(){}showTextOverlaySetupFailure(){}parseAvailableCodecs(e){if(!RTCRtpReceiver.getCapabilities)return["Only available on Chrome"];let t=[],n=(0,Ll.splitSections)(e.sdp);return n.shift(),n.forEach(r=>{let{codecs:s}=(0,Ll.parseRtpParameters)(r),o=/(VP\d|H26\d|AV1).*/;s.forEach(a=>{let l=a.name+" "+Object.keys(a.parameters||{}).map(h=>h+"="+a.parameters[h]).join(";");if(o.exec(l)!==null){let h=a.name+" "+Object.keys(a.parameters||{}).map(u=>u+"="+a.parameters[u]).join(";");t.push(h)}})}),t}};var Dl=class{constructor(){this.PixelStreamingSettings=new Fu,this.EncoderSettings=new Nu,this.WebRTCSettings=new Ou}ueCompatible(){this.WebRTCSettings.MaxFPS!=null&&(this.WebRTCSettings.FPS=this.WebRTCSettings.MaxFPS)}},Fu=class{},Nu=class{},Ou=class{};var Fl=class{constructor(){this.ReceiptTimeMs=null,this.TransmissionTimeMs=null,this.PreCaptureTimeMs=null,this.PostCaptureTimeMs=null,this.PreEncodeTimeMs=null,this.PostEncodeTimeMs=null,this.EncodeMs=null,this.CaptureToSendMs=null,this.testStartTimeMs=0,this.browserReceiptTimeMs=0,this.latencyExcludingDecode=0,this.testDuration=0,this.networkLatency=0,this.browserSendLatency=0,this.frameDisplayDeltaTimeMs=0,this.endToEndLatency=0,this.encodeLatency=0}setFrameDisplayDeltaTime(e){this.frameDisplayDeltaTimeMs==0&&(this.frameDisplayDeltaTimeMs=Math.round(e))}processFields(){this.EncodeMs==null&&(this.PreEncodeTimeMs!=null||this.PostEncodeTimeMs!=null)&&(L.Info(`Setting Encode Ms 
 ${this.PostEncodeTimeMs} 
 ${this.PreEncodeTimeMs}`),this.EncodeMs=this.PostEncodeTimeMs-this.PreEncodeTimeMs),this.CaptureToSendMs==null&&(this.PreCaptureTimeMs!=null||this.PostCaptureTimeMs!=null)&&(L.Info(`Setting CaptureToSendMs Ms 
 ${this.PostCaptureTimeMs} 
 ${this.PreCaptureTimeMs}`),this.CaptureToSendMs=this.PostCaptureTimeMs-this.PreCaptureTimeMs)}};var xr=class{static setExtensionFromBytes(e,t){t.receiving||(t.mimetype="",t.extension="",t.receiving=!0,t.valid=!1,t.chunks=0,t.data=[],t.timestampStart=new Date().getTime(),L.Info("Received first chunk of file"));let n=new TextDecoder("utf-16").decode(e.slice(1));L.Info(n),t.extension=n}static setMimeTypeFromBytes(e,t){t.receiving||(t.mimetype="",t.extension="",t.receiving=!0,t.valid=!1,t.chunks=0,t.data=[],t.timestampStart=new Date().getTime(),L.Info("Received first chunk of file"));let n=new TextDecoder("utf-16").decode(e.slice(1));L.Info(n),t.mimetype=n}static setContentsFromBytes(e,t){if(!t.receiving)return;let n=1,r=4,s=16*1024,o=n+r,a=s-o;t.chunks=Math.ceil(new DataView(e.slice(n,o).buffer).getInt32(0,!0)/a);let l=e.slice(o);if(t.data.push(l),L.Info(`Received file chunk: ${t.data.length}/${t.chunks}`),t.data.length===t.chunks){t.receiving=!1,t.valid=!0,L.Info("Received complete file");let c=new Date().getTime()-t.timestampStart,h=Math.round(t.chunks*s/c);L.Info(`Average transfer bitrate: ${h}kb/s over ${c/1e3} seconds`)}else t.data.length>t.chunks&&(t.receiving=!1,L.Error(`Received bigger file than advertised: ${t.data.length}/${t.chunks}`))}},Nl=class{constructor(){this.mimetype="",this.extension="",this.receiving=!1,this.chunks=0,this.data=[],this.valid=!1}};var Ft=class{};Ft.backSpace=8;Ft.shift=16;Ft.control=17;Ft.alt=18;Ft.rightShift=253;Ft.rightControl=254;Ft.rightAlt=255;var xs=Object.freeze({Escape:27,Digit0:48,Digit1:49,Digit2:50,Digit3:51,Digit4:52,Digit5:53,Digit6:54,Digit7:55,Digit8:56,Digit9:57,Minus:173,Equal:187,Backspace:8,Tab:9,KeyQ:81,KeyW:87,KeyE:69,KeyR:82,KeyT:84,KeyY:89,KeyU:85,KeyI:73,KeyO:79,KeyP:80,BracketLeft:219,BracketRight:221,Enter:13,ControlLeft:17,KeyA:65,KeyS:83,KeyD:68,KeyF:70,KeyG:71,KeyH:72,KeyJ:74,KeyK:75,KeyL:76,Semicolon:186,Quote:222,Backquote:192,ShiftLeft:16,Backslash:220,KeyZ:90,KeyX:88,KeyC:67,KeyV:86,KeyB:66,KeyN:78,KeyM:77,Comma:188,Period:190,Slash:191,ShiftRight:253,AltLeft:18,Space:32,CapsLock:20,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,Pause:19,ScrollLock:145,NumpadDivide:111,NumpadMultiply:106,NumpadSubtract:109,NumpadAdd:107,NumpadDecimal:110,Numpad9:105,Numpad8:104,Numpad7:103,Numpad6:102,Numpad5:101,Numpad4:100,Numpad3:99,Numpad2:98,Numpad1:97,Numpad0:96,NumLock:144,ControlRight:254,AltRight:255,Home:36,End:35,ArrowUp:38,ArrowLeft:37,ArrowRight:39,ArrowDown:40,PageUp:33,PageDown:34,Insert:45,Delete:46,ContextMenu:93,MetaLeft:91,MetaRight:92,OSLeft:91,OSRight:92});var Ol=class{constructor(e,t,n){this.streamMessageController=e,this.config=t,this.activeKeys=n,this.onKeyDownListener=this.handleOnKeyDown.bind(this),this.onKeyUpListener=this.handleOnKeyUp.bind(this),this.onKeyPressListener=this.handleOnKeyPress.bind(this)}register(){document.addEventListener("keydown",this.onKeyDownListener),document.addEventListener("keyup",this.onKeyUpListener),document.addEventListener("keypress",this.onKeyPressListener)}unregister(){document.removeEventListener("keydown",this.onKeyDownListener),document.removeEventListener("keyup",this.onKeyUpListener),document.removeEventListener("keypress",this.onKeyPressListener)}handleOnKeyDown(e){var t;let n=this.getKeycode(e);if(!n||n===229)return;(t=this.streamMessageController.toStreamerHandlers.get("KeyDown"))===null||t===void 0||t([this.getKeycode(e),e.repeat?1:0]),this.activeKeys.getActiveKeys().push(n),n===Ft.backSpace&&this.handleOnKeyPress(new KeyboardEvent("keypress",{charCode:Ft.backSpace,keyCode:Ft.backSpace})),this.config.isFlagEnabled(N.SuppressBrowserKeys)&&this.isKeyCodeBrowserKey(n)&&e.preventDefault()}handleOnKeyUp(e){var t;let n=this.getKeycode(e);if(!n)return;(t=this.streamMessageController.toStreamerHandlers.get("KeyUp"))===null||t===void 0||t([n]),this.config.isFlagEnabled(N.SuppressBrowserKeys)&&this.isKeyCodeBrowserKey(n)&&e.preventDefault()}handleOnKeyPress(e){var t;let n=this.getKeycode(e);if(!n)return;(t=this.streamMessageController.toStreamerHandlers.get("KeyPress"))===null||t===void 0||t([n])}getKeycode(e){if(!("keyCode"in e)){let t=e;return t.code in xs?xs[t.code]:(L.Warning(`Keyboard code of ${t.code} is not supported in our mapping, ignoring this key.`),null)}return e.keyCode===Ft.shift&&e.code==="ShiftRight"?Ft.rightShift:e.keyCode===Ft.control&&e.code==="ControlRight"?Ft.rightControl:e.keyCode===Ft.alt&&e.code==="AltRight"?Ft.rightAlt:e.code==="MetaLeft"||e.code==="OSLeft"?xs.MetaLeft:e.code==="MetaRight"||e.code==="OSRight"?xs.MetaRight:e.keyCode}isKeyCodeBrowserKey(e){return e>=112&&e<=123||e===9}};var Tt=class{};Tt.mainButton=0;Tt.auxiliaryButton=1;Tt.secondaryButton=2;Tt.fourthButton=3;Tt.fifthButton=4;var Bt=class{};Bt.primaryButton=1;Bt.secondaryButton=2;Bt.auxiliaryButton=4;Bt.fourthButton=8;Bt.fifthButton=16;var _r=class{constructor(e,t,n,r,s){this.streamMessageController=e,this.coordinateConverter=n,this.videoPlayer=t,this.activeKeys=r,this.config=s,this.onEnterListener=this.onMouseEnter.bind(this),this.onLeaveListener=this.onMouseLeave.bind(this)}register(){this.registerMouseEnterAndLeaveEvents()}unregister(){this.unregisterMouseEnterAndLeaveEvents()}registerMouseEnterAndLeaveEvents(){let e=this.videoPlayer.getVideoParentElement();e?.addEventListener("mouseenter",this.onEnterListener),e?.addEventListener("mouseleave",this.onLeaveListener)}unregisterMouseEnterAndLeaveEvents(){let e=this.videoPlayer.getVideoParentElement();e?.removeEventListener("mouseenter",this.onEnterListener),e?.removeEventListener("mouseleave",this.onLeaveListener)}onMouseEnter(e){var t;this.videoPlayer.isVideoReady()&&((t=this.streamMessageController.toStreamerHandlers.get("MouseEnter"))===null||t===void 0||t(),this.pressMouseButtons(e.buttons,e.x,e.y))}onMouseLeave(e){var t;this.videoPlayer.isVideoReady()&&((t=this.streamMessageController.toStreamerHandlers.get("MouseLeave"))===null||t===void 0||t(),this.releaseMouseButtons(e.buttons,e.x,e.y))}releaseMouseButtons(e,t,n){let r=this.coordinateConverter.translateUnsigned(t,n);e&Bt.primaryButton&&this.sendMouseUp(Tt.mainButton,r.x,r.y),e&Bt.secondaryButton&&this.sendMouseUp(Tt.secondaryButton,r.x,r.y),e&Bt.auxiliaryButton&&this.sendMouseUp(Tt.auxiliaryButton,r.x,r.y),e&Bt.fourthButton&&this.sendMouseUp(Tt.fourthButton,r.x,r.y),e&Bt.fifthButton&&this.sendMouseUp(Tt.fifthButton,r.x,r.y)}pressMouseButtons(e,t,n){if(!this.videoPlayer.isVideoReady())return;let r=this.coordinateConverter.translateUnsigned(t,n);e&Bt.primaryButton&&this.sendMouseDown(Tt.mainButton,r.x,r.y),e&Bt.secondaryButton&&this.sendMouseDown(Tt.secondaryButton,r.x,r.y),e&Bt.auxiliaryButton&&this.sendMouseDown(Tt.auxiliaryButton,r.x,r.y),e&Bt.fourthButton&&this.sendMouseDown(Tt.fourthButton,r.x,r.y),e&Bt.fifthButton&&this.sendMouseDown(Tt.fifthButton,r.x,r.y)}sendMouseDown(e,t,n){var r;(r=this.streamMessageController.toStreamerHandlers.get("MouseDown"))===null||r===void 0||r([e,t,n])}sendMouseUp(e,t,n){var r;let s=this.coordinateConverter.translateUnsigned(t,n);(r=this.streamMessageController.toStreamerHandlers.get("MouseUp"))===null||r===void 0||r([e,s.x,s.y])}};var Ul=class extends _r{constructor(e,t,n,r,s){super(e,t,n,r,s),this.videoElementParent=t.getVideoParentElement(),this.x=this.videoElementParent.getBoundingClientRect().width/2,this.y=this.videoElementParent.getBoundingClientRect().height/2,this.normalizedCoord=this.coordinateConverter.translateUnsigned(this.x,this.y),this.onRequestLockListener=this.onRequestLock.bind(this),this.onLockStateChangeListener=this.onLockStateChange.bind(this),this.onMouseUpListener=this.onMouseUp.bind(this),this.onMouseDownListener=this.onMouseDown.bind(this),this.onMouseDblClickListener=this.onMouseDblClick.bind(this),this.onMouseWheelListener=this.onMouseWheel.bind(this),this.onMouseMoveListener=this.onMouseMove.bind(this)}register(){super.register(),this.videoElementParent.requestPointerLock=this.videoElementParent.requestPointerLock||this.videoElementParent.mozRequestPointerLock,document.exitPointerLock=document.exitPointerLock||document.mozExitPointerLock,this.videoElementParent.requestPointerLock&&this.videoElementParent.addEventListener("click",this.onRequestLockListener),document.addEventListener("pointerlockchange",this.onLockStateChangeListener),document.addEventListener("mozpointerlockchange",this.onLockStateChangeListener),this.videoElementParent.addEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.addEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.addEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.addEventListener("dblclick",this.onMouseDblClickListener)}unregister(){let e=document.pointerLockElement||document.mozPointerLockElement;document.exitPointerLock&&e===this.videoElementParent&&document.exitPointerLock(),this.videoElementParent.removeEventListener("click",this.onRequestLockListener),document.removeEventListener("pointerlockchange",this.onLockStateChangeListener),document.removeEventListener("mozpointerlockchange",this.onLockStateChangeListener),document.removeEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.removeEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.removeEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.removeEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.removeEventListener("dblclick",this.onMouseDblClickListener),super.unregister()}onRequestLock(){this.videoElementParent.requestPointerLock()}onLockStateChange(){(document.pointerLockElement||document.mozPointerLockElement)===this.videoElementParent?(L.Info("Pointer locked"),document.addEventListener("mousemove",this.onMouseMoveListener)):(L.Info("The pointer lock status is now unlocked"),document.removeEventListener("mousemove",this.onMouseMoveListener),this.activeKeys.getActiveKeys().forEach(n=>{this.streamMessageController.toStreamerHandlers.get("KeyUp")([n])}))}onMouseDown(e){this.videoPlayer.isVideoReady()&&this.streamMessageController.toStreamerHandlers.get("MouseDown")([e.button,this.normalizedCoord.x,this.normalizedCoord.y])}onMouseUp(e){this.videoPlayer.isVideoReady()&&this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,this.normalizedCoord.x,this.normalizedCoord.y])}onMouseMove(e){if(!this.videoPlayer.isVideoReady())return;let t=this.videoPlayer.getVideoParentElement().clientWidth,n=this.videoPlayer.getVideoParentElement().clientHeight;for(this.x+=e.movementX,this.y+=e.movementY;this.x>t;)this.x-=t;for(;this.y>n;)this.y-=n;for(;this.x<0;)this.x+=t;for(;this.y<0;)this.y+=n;this.normalizedCoord=this.coordinateConverter.translateUnsigned(this.x,this.y);let r=this.coordinateConverter.translateSigned(e.movementX,e.movementY);this.streamMessageController.toStreamerHandlers.get("MouseMove")([this.normalizedCoord.x,this.normalizedCoord.y,r.x,r.y])}onMouseWheel(e){this.videoPlayer.isVideoReady()&&this.streamMessageController.toStreamerHandlers.get("MouseWheel")([e.wheelDelta,this.normalizedCoord.x,this.normalizedCoord.y])}onMouseDblClick(e){this.videoPlayer.isVideoReady()&&(this.streamMessageController.toStreamerHandlers.get("MouseDouble")([e.button,this.normalizedCoord.x,this.normalizedCoord.y]),this.config.isFlagEnabled(N.MouseDoubleClickAutoRelease)&&this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,this.normalizedCoord.x,this.normalizedCoord.y]))}};var kl=class extends _r{constructor(e,t,n,r,s){super(e,t,n,r,s),this.pressedButtons=new Set,this.videoElementParent=t.getVideoParentElement(),this.onMouseUpListener=this.onMouseUp.bind(this),this.onMouseDownListener=this.onMouseDown.bind(this),this.onMouseDblClickListener=this.onMouseDblClick.bind(this),this.onMouseWheelListener=this.onMouseWheel.bind(this),this.onMouseMoveListener=this.onMouseMove.bind(this),this.onContextMenuListener=this.onContextMenu.bind(this)}register(){super.register(),this.videoElementParent.addEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.addEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.addEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.addEventListener("contextmenu",this.onContextMenuListener),this.videoElementParent.addEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.addEventListener("dblclick",this.onMouseDblClickListener)}unregister(){this.videoElementParent.removeEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.removeEventListener("mousedown",this.onMouseDownListener),this.videoElementParent.removeEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.removeEventListener("contextmenu",this.onContextMenuListener),this.videoElementParent.removeEventListener("wheel",this.onMouseWheelListener),this.videoElementParent.removeEventListener("dblclick",this.onMouseDblClickListener),this.pressedButtons.size>0&&(window.removeEventListener("mousemove",this.onMouseMoveListener),window.removeEventListener("mouseup",this.onMouseUpListener),this.pressedButtons.clear()),super.unregister()}startCapturing(){this.videoElementParent.removeEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.removeEventListener("mouseup",this.onMouseUpListener),window.addEventListener("mousemove",this.onMouseMoveListener),window.addEventListener("mouseup",this.onMouseUpListener)}stopCapturing(){window.removeEventListener("mousemove",this.onMouseMoveListener),window.removeEventListener("mouseup",this.onMouseUpListener),this.videoElementParent.addEventListener("mousemove",this.onMouseMoveListener),this.videoElementParent.addEventListener("mouseup",this.onMouseUpListener)}offsetFromVideo(e){if(e.currentTarget===this.videoElementParent)return{x:e.offsetX,y:e.offsetY};let t=this.videoElementParent.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}onMouseDown(e){if(!this.videoPlayer.isVideoReady())return;let t=this.offsetFromVideo(e),n=this.coordinateConverter.translateUnsigned(t.x,t.y);this.streamMessageController.toStreamerHandlers.get("MouseDown")([e.button,n.x,n.y]),e.preventDefault(),this.pressedButtons.size===0&&this.startCapturing(),this.pressedButtons.add(e.button)}onMouseUp(e){if(!this.videoPlayer.isVideoReady())return;let t=this.offsetFromVideo(e),n=this.coordinateConverter.translateUnsigned(t.x,t.y);this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,n.x,n.y]),e.preventDefault(),this.pressedButtons.delete(e.button),this.pressedButtons.size===0&&this.stopCapturing()}onContextMenu(e){this.videoPlayer.isVideoReady()&&e.preventDefault()}onMouseMove(e){if(!this.videoPlayer.isVideoReady())return;let t=this.offsetFromVideo(e),n=this.coordinateConverter.translateUnsigned(t.x,t.y),r=this.coordinateConverter.translateSigned(e.movementX,e.movementY);this.streamMessageController.toStreamerHandlers.get("MouseMove")([n.x,n.y,r.x,r.y]),e.currentTarget===this.videoElementParent&&e.preventDefault()}onMouseWheel(e){if(!this.videoPlayer.isVideoReady())return;let t=this.coordinateConverter.translateUnsigned(e.offsetX,e.offsetY);this.streamMessageController.toStreamerHandlers.get("MouseWheel")([e.wheelDelta,t.x,t.y]),e.preventDefault()}onMouseDblClick(e){if(!this.videoPlayer.isVideoReady())return;let t=this.coordinateConverter.translateUnsigned(e.offsetX,e.offsetY);this.streamMessageController.toStreamerHandlers.get("MouseDouble")([e.button,t.x,t.y]),this.config.isFlagEnabled(N.MouseDoubleClickAutoRelease)&&this.streamMessageController.toStreamerHandlers.get("MouseUp")([e.button,t.x,t.y])}};var Bl=class{constructor(e,t,n){this.fingers=[9,8,7,6,5,4,3,2,1,0],this.fingerIds=new Map,this.maxByteValue=255,this.streamMessageController=e,this.videoPlayer=t,this.coordinateConverter=n,this.videoElementParent=t.getVideoElement(),this.onTouchStartListener=this.onTouchStart.bind(this),this.onTouchEndListener=this.onTouchEnd.bind(this),this.onTouchMoveListener=this.onTouchMove.bind(this)}register(){this.videoElementParent.addEventListener("touchstart",this.onTouchStartListener),this.videoElementParent.addEventListener("touchend",this.onTouchEndListener),this.videoElementParent.addEventListener("touchmove",this.onTouchMoveListener)}unregister(){this.videoElementParent.removeEventListener("touchstart",this.onTouchStartListener),this.videoElementParent.removeEventListener("touchend",this.onTouchEndListener),this.videoElementParent.removeEventListener("touchmove",this.onTouchMoveListener)}rememberTouch(e){let t=this.fingers.pop();t===void 0&&L.Info("exhausted touch identifiers"),this.fingerIds.set(e.identifier,t)}forgetTouch(e){this.fingers.push(this.fingerIds.get(e.identifier)),this.fingers.sort(function(t,n){return n-t}),this.fingerIds.delete(e.identifier)}onTouchStart(e){if(this.videoPlayer.isVideoReady()){for(let t=0;t<e.changedTouches.length;t++)this.rememberTouch(e.changedTouches[t]);this.emitTouchData("TouchStart",e.changedTouches),e.preventDefault()}}onTouchEnd(e){if(this.videoPlayer.isVideoReady()){this.emitTouchData("TouchEnd",e.changedTouches);for(let t=0;t<e.changedTouches.length;t++)this.forgetTouch(e.changedTouches[t]);e.preventDefault()}}onTouchMove(e){this.videoPlayer.isVideoReady()&&(this.emitTouchData("TouchMove",e.touches),e.preventDefault())}emitTouchData(e,t){if(!this.videoPlayer.isVideoReady())return;let n=this.videoPlayer.getVideoParentElement().getBoundingClientRect(),r=this.streamMessageController.toStreamerHandlers;for(let s=0;s<t.length;s++){let a=t[s],l=a.clientX-n.left,c=a.clientY-n.top;L.Info(`F${this.fingerIds.get(a.identifier)}=(${l}, ${c})`);let h=this.coordinateConverter.translateUnsigned(l,c);switch(e){case"TouchStart":r.get("TouchStart")([1,h.x,h.y,this.fingerIds.get(a.identifier),this.maxByteValue*(a.force>0?a.force:1),h.inRange?1:0]);break;case"TouchEnd":r.get("TouchEnd")([1,h.x,h.y,this.fingerIds.get(a.identifier),this.maxByteValue*a.force,h.inRange?1:0]);break;case"TouchMove":r.get("TouchMove")([1,h.x,h.y,this.fingerIds.get(a.identifier),this.maxByteValue*(a.force>0?a.force:1),h.inRange?1:0]);break}}}};var Vl=class{constructor(e,t,n){this.streamMessageController=e,this.videoPlayer=t,this.coordinateConverter=n,this.onTouchStartListener=this.onTouchStart.bind(this),this.onTouchEndListener=this.onTouchEnd.bind(this),this.onTouchMoveListener=this.onTouchMove.bind(this),this.videoElementParentClientRect=this.videoPlayer.getVideoParentElement().getBoundingClientRect()}register(){document.addEventListener("touchstart",this.onTouchStartListener),document.addEventListener("touchend",this.onTouchEndListener),document.addEventListener("touchmove",this.onTouchMoveListener)}unregister(){document.removeEventListener("touchstart",this.onTouchStartListener),document.removeEventListener("touchend",this.onTouchEndListener),document.removeEventListener("touchmove",this.onTouchMoveListener)}onTouchStart(e){if(!(!this.videoPlayer.isVideoReady()||e.target!==this.videoPlayer.getVideoElement())){if(this.fakeTouchFinger==null){let t=e.changedTouches[0];this.fakeTouchFinger={id:t.identifier,x:t.clientX-this.videoElementParentClientRect.left,y:t.clientY-this.videoElementParentClientRect.top};let n=this.videoPlayer.getVideoParentElement(),r=new MouseEvent("mouseenter",t);n.dispatchEvent(r);let s=this.coordinateConverter.translateUnsigned(this.fakeTouchFinger.x,this.fakeTouchFinger.y);this.streamMessageController.toStreamerHandlers.get("MouseDown")([Tt.mainButton,s.x,s.y])}e.preventDefault()}}onTouchEnd(e){if(!this.videoPlayer.isVideoReady()||this.fakeTouchFinger==null)return;let t=this.videoPlayer.getVideoParentElement(),n=this.streamMessageController.toStreamerHandlers;for(let r=0;r<e.changedTouches.length;r++){let s=e.changedTouches[r];if(s.identifier===this.fakeTouchFinger.id){let o=s.clientX-this.videoElementParentClientRect.left,a=s.clientY-this.videoElementParentClientRect.top,l=this.coordinateConverter.translateUnsigned(o,a);n.get("MouseUp")([Tt.mainButton,l.x,l.y]);let c=new MouseEvent("mouseleave",s);t.dispatchEvent(c),this.fakeTouchFinger=null;break}}e.preventDefault()}onTouchMove(e){if(!this.videoPlayer.isVideoReady()||this.fakeTouchFinger==null)return;let t=this.streamMessageController.toStreamerHandlers;for(let n=0;n<e.touches.length;n++){let r=e.touches[n];if(r.identifier===this.fakeTouchFinger.id){let s=r.clientX-this.videoElementParentClientRect.left,o=r.clientY-this.videoElementParentClientRect.top,a=this.coordinateConverter.translateUnsigned(s,o),l=this.coordinateConverter.translateSigned(s-this.fakeTouchFinger.x,o-this.fakeTouchFinger.y);t.get("MouseMove")([a.x,a.y,l.x,l.y]),this.fakeTouchFinger.x=s,this.fakeTouchFinger.y=o;break}}e.preventDefault()}};function ki(i){return JSON.parse(JSON.stringify({buttons:i.buttons.map(e=>JSON.parse(JSON.stringify({pressed:e.pressed,touched:e.touched,value:e.value}))),axes:i.axes}))}var Sr;(function(i){i[i.RightClusterBottomButton=0]="RightClusterBottomButton",i[i.RightClusterRightButton=1]="RightClusterRightButton",i[i.RightClusterLeftButton=2]="RightClusterLeftButton",i[i.RightClusterTopButton=3]="RightClusterTopButton",i[i.LeftShoulder=4]="LeftShoulder",i[i.RightShoulder=5]="RightShoulder",i[i.LeftTrigger=6]="LeftTrigger",i[i.RightTrigger=7]="RightTrigger",i[i.SelectOrBack=8]="SelectOrBack",i[i.StartOrForward=9]="StartOrForward",i[i.LeftAnalogPress=10]="LeftAnalogPress",i[i.RightAnalogPress=11]="RightAnalogPress",i[i.LeftClusterTopButton=12]="LeftClusterTopButton",i[i.LeftClusterBottomButton=13]="LeftClusterBottomButton",i[i.LeftClusterLeftButton=14]="LeftClusterLeftButton",i[i.LeftClusterRightButton=15]="LeftClusterRightButton",i[i.CentreButton=16]="CentreButton",i[i.LeftStickHorizontal=0]="LeftStickHorizontal",i[i.LeftStickVertical=1]="LeftStickVertical",i[i.RightStickHorizontal=2]="RightStickHorizontal",i[i.RightStickVertical=3]="RightStickVertical"})(Sr||(Sr={}));var zl=class{constructor(e){this.streamMessageController=e,this.onGamepadConnectedListener=this.onGamepadConnected.bind(this),this.onGamepadDisconnectedListener=this.onGamepadDisconnected.bind(this),this.beforeUnloadListener=this.onBeforeUnload.bind(this),this.requestAnimationFrame=(window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.requestAnimationFrame).bind(window)}register(){window.addEventListener("beforeunload",this.beforeUnloadListener);let e=window;if("GamepadEvent"in e?(window.addEventListener("gamepadconnected",this.onGamepadConnectedListener),window.addEventListener("gamepaddisconnected",this.onGamepadDisconnectedListener)):"WebKitGamepadEvent"in e&&(window.addEventListener("webkitgamepadconnected",this.onGamepadConnectedListener),window.addEventListener("webkitgamepaddisconnected",this.onGamepadDisconnectedListener)),this.controllers=[],navigator.getGamepads)for(let t of navigator.getGamepads())t&&this.onGamepadConnected(new GamepadEvent("gamepadconnected",{gamepad:t}))}unregister(){window.removeEventListener("gamepadconnected",this.onGamepadConnectedListener),window.removeEventListener("gamepaddisconnected",this.onGamepadDisconnectedListener),window.removeEventListener("webkitgamepadconnected",this.onGamepadConnectedListener),window.removeEventListener("webkitgamepaddisconnected",this.onGamepadDisconnectedListener);for(let e of this.controllers)e&&e.id!==void 0&&this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([e.id]);this.controllers=[]}onGamepadResponseReceived(e){for(let t of this.controllers)if(t&&t.id===void 0){t.id=e;break}}onGamepadConnected(e){let t=e.gamepad,n={currentState:ki(t),prevState:ki(t),id:void 0};this.controllers[t.index]=n,window.requestAnimationFrame(()=>this.updateStatus()),this.streamMessageController.toStreamerHandlers.get("GamepadConnected")()}onGamepadDisconnected(e){let t=e.gamepad,n=this.controllers[t.index];this.controllers=this.controllers.filter((r,s)=>s!==t.index),n.id!==void 0&&this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([n.id])}scanGamepads(){let e=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():[];for(let t=0;t<e.length;t++)e[t]&&this.controllers[e[t].index]!==void 0&&(this.controllers[e[t].index].currentState=e[t])}updateStatus(){this.scanGamepads();let e=this.streamMessageController.toStreamerHandlers;for(let t of this.controllers){if(!t)continue;let n=t.id===void 0?this.controllers.indexOf(t):t.id,r=t.currentState;for(let o=0;o<t.currentState.buttons.length;o++){let a=o,l=t.currentState.buttons[o],c=t.prevState.buttons[o];l.pressed?a===Sr.LeftTrigger?e.get("GamepadAnalog")([n,5,l.value]):a===Sr.RightTrigger?e.get("GamepadAnalog")([n,6,l.value]):e.get("GamepadButtonPressed")([n,o,c.pressed?1:0]):!l.pressed&&c.pressed&&(a===Sr.LeftTrigger?e.get("GamepadAnalog")([n,5,0]):a===Sr.RightTrigger?e.get("GamepadAnalog")([n,6,0]):e.get("GamepadButtonReleased")([n,o,0]))}for(let o=0;o<r.axes.length;o+=2){let a=parseFloat(r.axes[o].toFixed(4)),l=-parseFloat(r.axes[o+1].toFixed(4));e.get("GamepadAnalog")([n,o+1,a]),e.get("GamepadAnalog")([n,o+2,l])}let s=this.controllers.indexOf(t);this.controllers[s].prevState=ki(r)}this.controllers.length>0&&this.requestAnimationFrame(()=>this.updateStatus())}onBeforeUnload(e){for(let t of this.controllers)!t||t.id===void 0||this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([t.id])}};var Hl=class{constructor(e,t,n){this.activeKeys=new Uu,this.toStreamerMessagesProvider=e,this.videoElementProvider=t,this.coordinateConverter=n}registerKeyBoard(e){L.Info("Register Keyboard Events");let t=new Ol(this.toStreamerMessagesProvider,e,this.activeKeys);return t.register(),t}registerMouse(e,t){L.Info("Register Mouse Events");let n;return e==Ui.HoveringMouse?n=new kl(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter,this.activeKeys,t):n=new Ul(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter,this.activeKeys,t),n.register(),n}registerTouch(e){L.Info("Registering Touch");let t;return e?t=new Vl(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter):t=new Bl(this.toStreamerMessagesProvider,this.videoElementProvider,this.coordinateConverter),t.register(),t}registerGamePad(){L.Info("Register Game Pad");let e=new zl(this.toStreamerMessagesProvider);return e.register(),e}},Uu=class{constructor(){this.activeKeys=[],this.activeKeys=[]}getActiveKeys(){return this.activeKeys}};var _s=class i{constructor(e,t){this.lastTimeResized=new Date().getTime(),this.videoElement=document.createElement("video"),this.config=t,this.videoElement.id="streamingVideo",this.videoElement.disablePictureInPicture=!0,this.videoElement.playsInline=!0,this.videoElement.style.width="100%",this.videoElement.style.height="100%",this.videoElement.style.position="absolute",this.videoElement.style.pointerEvents="all",e.appendChild(this.videoElement),this.onResizePlayerCallback=()=>{L.Warning("Resolution changed, restyling player, did you forget to override this function?")},this.onMatchViewportResolutionCallback=()=>{L.Warning("Resolution changed and match viewport resolution is turned on, did you forget to override this function?")},this.videoElement.onclick=()=>{this.audioElement!==void 0&&this.audioElement.paused&&this.audioElement.play(),this.videoElement.paused&&this.videoElement.play()},this.videoElement.onloadedmetadata=()=>{this.onVideoInitialized()},window.addEventListener("resize",()=>this.resizePlayerStyle(),!0),window.addEventListener("orientationchange",()=>this.onOrientationChange())}destroy(){this.videoElement.src="",this.videoElement.srcObject=null,this.videoElement.remove(),this.audioElement&&(this.audioElement.src="",this.audioElement.srcObject=null,this.audioElement.remove())}setAudioElement(e){this.audioElement=e}play(){return this.videoElement.muted=this.config.isFlagEnabled(N.StartVideoMuted),this.videoElement.autoplay=this.config.isFlagEnabled(N.AutoPlayVideo),this.videoElement.play()}isPaused(){return this.videoElement.paused}isVideoReady(){return this.videoElement.readyState!==void 0&&this.videoElement.readyState>0}hasVideoSource(){return this.videoElement.srcObject!==void 0&&this.videoElement.srcObject!==null}getVideoElement(){return this.videoElement}getVideoParentElement(){var e;return(e=this.videoElement.parentElement)!==null&&e!==void 0?e:void 0}setVideoEnabled(e){this.videoElement.srcObject.getTracks().forEach(n=>n.enabled=e)}onVideoInitialized(){}onOrientationChange(){clearTimeout(this.orientationChangeTimeout),this.orientationChangeTimeout=window.setTimeout(()=>{this.resizePlayerStyle()},500)}resizePlayerStyle(){let e=this.getVideoParentElement();if(e){if(this.updateVideoStreamSize(),e.classList.contains("fixed-size")){this.onResizePlayerCallback();return}this.resizePlayerStyleToFillParentElement(),this.onResizePlayerCallback()}}resizePlayerStyleToFillParentElement(){this.getVideoParentElement().setAttribute("style","top: "+0+"px; left: "+0+"px; width: "+"100%"+"; height: "+"100%"+"; cursor: default;")}updateVideoStreamSize(){if(!this.config.isFlagEnabled(N.MatchViewportResolution))return;if(new Date().getTime()-this.lastTimeResized>300){let t=this.getVideoParentElement();if(!t)return;let n=this.config.hasNumericSetting($.ViewportResScale)?this.config.getNumericSettingValue($.ViewportResScale):1,r=Math.round(t.clientWidth*n),s=Math.round(t.clientHeight*n);(r>i.maxEncoderDimension||s>i.maxEncoderDimension)&&L.Warning(`Requested stream resolution (${r}x${s}) exceeds the common H.264 encoder limit of ${i.maxEncoderDimension}x${i.maxEncoderDimension}; encoding may fail. Lower ViewportResScale or disable MatchViewportResolution.`),this.onMatchViewportResolutionCallback(r,s),this.lastTimeResized=new Date().getTime()}else L.Info("Resizing too often - skipping"),clearTimeout(this.resizeTimeoutHandle),this.resizeTimeoutHandle=window.setTimeout(()=>this.updateVideoStreamSize(),100)}};_s.maxEncoderDimension=4096;var Wl=class{constructor(){this.toStreamerHandlers=new Map,this.fromStreamerHandlers=new Map,this.toStreamerMessages=new Map,this.fromStreamerMessages=new Map}populateDefaultProtocol(){this.toStreamerMessages.set("IFrameRequest",{id:0,structure:[]}),this.toStreamerMessages.set("RequestQualityControl",{id:1,structure:[]}),this.toStreamerMessages.set("FpsRequest",{id:2,structure:[]}),this.toStreamerMessages.set("AverageBitrateRequest",{id:3,structure:[]}),this.toStreamerMessages.set("StartStreaming",{id:4,structure:[]}),this.toStreamerMessages.set("StopStreaming",{id:5,structure:[]}),this.toStreamerMessages.set("LatencyTest",{id:6,structure:["string"]}),this.toStreamerMessages.set("RequestInitialSettings",{id:7,structure:[]}),this.toStreamerMessages.set("TestEcho",{id:8,structure:[]}),this.toStreamerMessages.set("DataChannelLatencyTest",{id:9,structure:[]}),this.toStreamerMessages.set("UIInteraction",{id:50,structure:["string"]}),this.toStreamerMessages.set("Command",{id:51,structure:["string"]}),this.toStreamerMessages.set("TextboxEntry",{id:52,structure:["string"]}),this.toStreamerMessages.set("KeyDown",{id:60,structure:["uint8","uint8"]}),this.toStreamerMessages.set("KeyUp",{id:61,structure:["uint8"]}),this.toStreamerMessages.set("KeyPress",{id:62,structure:["uint16"]}),this.toStreamerMessages.set("MouseEnter",{id:70,structure:[]}),this.toStreamerMessages.set("MouseLeave",{id:71,structure:[]}),this.toStreamerMessages.set("MouseDown",{id:72,structure:["uint8","uint16","uint16"]}),this.toStreamerMessages.set("MouseUp",{id:73,structure:["uint8","uint16","uint16"]}),this.toStreamerMessages.set("MouseMove",{id:74,structure:["uint16","uint16","int16","int16"]}),this.toStreamerMessages.set("MouseWheel",{id:75,structure:["int16","uint16","uint16"]}),this.toStreamerMessages.set("MouseDouble",{id:76,structure:["uint8","uint16","uint16"]}),this.toStreamerMessages.set("TouchStart",{id:80,structure:["uint8","uint16","uint16","uint8","uint8","uint8"]}),this.toStreamerMessages.set("TouchEnd",{id:81,structure:["uint8","uint16","uint16","uint8","uint8","uint8"]}),this.toStreamerMessages.set("TouchMove",{id:82,structure:["uint8","uint16","uint16","uint8","uint8","uint8"]}),this.toStreamerMessages.set("GamepadConnected",{id:93,structure:[]}),this.toStreamerMessages.set("GamepadButtonPressed",{id:90,structure:["uint8","uint8","uint8"]}),this.toStreamerMessages.set("GamepadButtonReleased",{id:91,structure:["uint8","uint8","uint8"]}),this.toStreamerMessages.set("GamepadAnalog",{id:92,structure:["uint8","uint8","double"]}),this.toStreamerMessages.set("GamepadDisconnected",{id:94,structure:["uint8"]}),this.fromStreamerMessages.set(0,"QualityControlOwnership"),this.fromStreamerMessages.set(1,"Response"),this.fromStreamerMessages.set(2,"Command"),this.fromStreamerMessages.set(3,"FreezeFrame"),this.fromStreamerMessages.set(4,"UnfreezeFrame"),this.fromStreamerMessages.set(5,"VideoEncoderAvgQP"),this.fromStreamerMessages.set(6,"LatencyTest"),this.fromStreamerMessages.set(7,"InitialSettings"),this.fromStreamerMessages.set(8,"FileExtension"),this.fromStreamerMessages.set(9,"FileMimeType"),this.fromStreamerMessages.set(10,"FileContents"),this.fromStreamerMessages.set(11,"TestEcho"),this.fromStreamerMessages.set(12,"InputControlOwnership"),this.fromStreamerMessages.set(13,"GamepadResponse"),this.fromStreamerMessages.set(14,"DataChannelLatencyTest"),this.fromStreamerMessages.set(255,"Protocol")}registerMessageHandler(e,t,n){switch(e){case xe.ToStreamer:this.toStreamerHandlers.set(t,n);break;case xe.FromStreamer:this.fromStreamerHandlers.set(t,n);break;default:L.Info(`Unknown message direction ${e}`)}}},xe;(function(i){i[i.ToStreamer=0]="ToStreamer",i[i.FromStreamer=1]="FromStreamer"})(xe||(xe={}));var Gl=class{constructor(){this.responseEventListeners=new Map}addResponseEventListener(e,t){this.responseEventListeners.set(e,t)}removeResponseEventListener(e){this.responseEventListeners.delete(e)}onResponse(e){L.Info("DataChannelReceiveMessageType.Response");let t=new TextDecoder("utf-16").decode(e.slice(1));L.Info(t),this.responseEventListeners.forEach(n=>{n(t)})}};var Xl=class{constructor(e,t){this.dataChannelSender=e,this.toStreamerMessagesMapProvider=t}sendMessageToStreamer(e,t){t===void 0&&(t=[]);let r=this.toStreamerMessagesMapProvider.toStreamerMessages.get(e);if(r===void 0){L.Error(`Attempted to send a message to the streamer with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`);return}if(r.structure&&t&&r.structure.length!==t.length){L.Error(`Provided message data doesn't match expected layout. Expected [ ${r.structure.map(l=>{switch(l){case"uint8":case"uint16":case"int16":case"float":case"double":default:return"number";case"string":return"string";case"raw":return"Uint8Array"}}).toString()} ] but received [ ${t.map(l=>l instanceof Uint8Array?"Uint8Array":typeof l).toString()} ]`);return}let s=0;t.forEach((l,c)=>{switch(r.structure[c]){case"uint8":s+=1;break;case"uint16":s+=2;break;case"int16":s+=2;break;case"float":s+=4;break;case"double":s+=8;break;case"string":s+=2,s+=2*l.length;break;case"raw":s+=l.byteLength;break}});let o=new DataView(new ArrayBuffer(s+1));o.setUint8(0,r.id);let a=1;if(t.forEach((l,c)=>{switch(r.structure[c]){case"uint8":o.setUint8(a,l),a+=1;break;case"uint16":o.setUint16(a,l,!0),a+=2;break;case"int16":o.setInt16(a,l,!0),a+=2;break;case"float":o.setFloat32(a,l,!0),a+=4;break;case"double":o.setFloat64(a,l,!0),a+=8;break;case"string":o.setUint16(a,l.length,!0),a+=2;for(let u=0;u<l.length;u++)o.setUint16(a,l.charCodeAt(u),!0),a+=2;break;case"raw":{let u=l;new Uint8Array(o.buffer).set(u,a),a+=u.byteLength;break}}}),!this.dataChannelSender.canSend()){L.Info(`Data channel cannot send yet, skipping sending message: ${e} - ${new Uint8Array(o.buffer)}`);return}this.dataChannelSender.sendData(o.buffer)}};var ql=class{constructor(e){this.sendMessageController=e}SendRequestQualityControl(){this.sendMessageController.sendMessageToStreamer("RequestQualityControl")}SendMaxFpsRequest(){this.sendMessageController.sendMessageToStreamer("FpsRequest")}SendAverageBitrateRequest(){this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest")}SendStartStreaming(){this.sendMessageController.sendMessageToStreamer("StartStreaming")}SendStopStreaming(){this.sendMessageController.sendMessageToStreamer("StopStreaming")}SendRequestInitialSettings(){this.sendMessageController.sendMessageToStreamer("RequestInitialSettings")}};var Yl=class{constructor(e){this.dataChannelProvider=e}canSend(){return this.dataChannelProvider.getDataChannelInstance().dataChannel!==void 0&&this.dataChannelProvider.getDataChannelInstance().dataChannel.readyState==="open"}sendData(e){let t=this.dataChannelProvider.getDataChannelInstance();t.dataChannel.readyState==="open"?(t.dataChannel.send(e),L.Info(`Message Sent: ${new Uint8Array(e)}`),this.resetAfkWarningTimerOnDataSend()):L.Error(`Message Failed: ${new Uint8Array(e)}`)}resetAfkWarningTimerOnDataSend(){}};var $l=class{reconfigure(e,t){let n=e.height/e.width,r=t.height/t.width;this.playerIsLarger=n>r,this.playerSize=e,this.ratio=this.playerIsLarger?n/r:r/n}translateUnsigned(e,t){let n=this.playerIsLarger?e/this.playerSize.width:this.ratio*(e/this.playerSize.width-.5)+.5,r=this.playerIsLarger?this.ratio*(t/this.playerSize.height-.5)+.5:t/this.playerSize.height;return n<0||n>1||r<0||r>1?{inRange:!1,x:65535,y:65535}:{inRange:!0,x:n*65536,y:r*65536}}translateSigned(e,t){let n=this.playerIsLarger?e/(.5*this.playerSize.width):this.ratio*e/(.5*this.playerSize.width),r=this.playerIsLarger?this.ratio*t/(.5*this.playerSize.height):t/(.5*this.playerSize.height);return{x:n*32767,y:r*32767}}untranslateUnsigned(e,t){let n=this.playerIsLarger?e/65536:(e/65536-.5)/this.ratio+.5,r=this.playerIsLarger?(t/65536-.5)/this.ratio+.5:t/65536;return{x:n*this.playerSize.width,y:r*this.playerSize.height}}};var br=class{constructor(e){this._urlParams={};let t=new URLSearchParams(e);for(let[n,r]of t)this._urlParams[n.toLowerCase()]=r}has(e){return e.toLowerCase()in this._urlParams}get(e){return this.has(e)?this._urlParams[e.toLowerCase()]:null}};var Kl=class{constructor(e,t){this.shouldShowPlayOverlay=!0,this.autoJoinTimer=void 0,this.playerId=null,this.config=e,this.pixelStreaming=t,this.responseController=new Gl,this.file=new Nl,this.sdpConstraints={offerToReceiveAudio:!0,offerToReceiveVideo:!0},this.afkController=new Ml(this.config,this.pixelStreaming,this.onAfkTriggered.bind(this)),this.afkController.onAFKTimedOutCallback=()=>{this.closeSignalingServer("You have been disconnected due to inactivity.",!1)},this.freezeFrameController=new Oa(this.pixelStreaming.videoElementParent),this.videoPlayer=new _s(this.pixelStreaming.videoElementParent,this.config),this.videoPlayer.onVideoInitialized=()=>this.handleVideoInitialized(),this.videoPlayer.onMatchViewportResolutionCallback=(n,r)=>{let s={"Resolution.Width":n,"Resolution.Height":r};this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(s)])},this.videoPlayer.onResizePlayerCallback=()=>{this.setUpMouseAndFreezeFrame()},this.streamController=new Fa(this.videoPlayer),this.coordinateConverter=new $l,this.sendrecvDataChannelController=new ms,this.recvDataChannelController=new ms,this.registerDataChannelEventEmitters(this.sendrecvDataChannelController),this.registerDataChannelEventEmitters(this.recvDataChannelController),this.dataChannelSender=new Yl(this.sendrecvDataChannelController),this.dataChannelSender.resetAfkWarningTimerOnDataSend=()=>this.afkController.resetAfkWarningTimer(),this.streamMessageController=new Wl,this.transport=new Di(e.webSocketProtocols),this.protocol=new ls(this.transport),this.protocol.addListener(pt.config.typeName,n=>this.handleOnConfigMessage(n)),this.protocol.addListener(pt.ping.typeName,n=>this.handlePingMessage(n)),this.protocol.addListener(pt.streamerList.typeName,n=>this.handleStreamerListMessage(n)),this.protocol.addListener(pt.subscribeFailed.typeName,n=>this.handleSubscribeFailedMessage(n)),this.protocol.addListener(pt.streamerIdChanged.typeName,n=>this.handleStreamerIDChangedMessage(n)),this.protocol.addListener(pt.playerCount.typeName,n=>{let r=n;this.pixelStreaming._onPlayerCount(r.count)}),this.protocol.addListener(pt.answer.typeName,n=>this.handleWebRtcAnswer(n)),this.protocol.addListener(pt.offer.typeName,n=>this.handleWebRtcOffer(n)),this.protocol.addListener(pt.peerDataChannels.typeName,n=>this.handleWebRtcSFUPeerDatachannels(n)),this.protocol.addListener(pt.iceCandidate.typeName,n=>{let r=n;this.handleIceCandidate(r.candidate)}),this.protocol.transport.addListener("open",()=>{if(!this.config.isFlagEnabled(N.BrowserSendOffer)){let r=Kt.createMessage(pt.listStreamers);this.protocol.sendMessage(r)}this.reconnectAttempt=0,this.isReconnecting=!1}),this.protocol.transport.addListener("error",()=>{L.Error("Got a transport error.")}),this.protocol.transport.addListener("close",n=>{let s=this.config.getNumericSettingValue($.MaxReconnectAttempts),o=this.reconnectAttempt<s,l=(this.forceReconnect||this.enableAutoReconnect&&s>0&&o)&&n.code!=1001,c=!l,h=this.disconnectMessage?this.disconnectMessage:n.reason;this.forceReconnect=!1,this.config.getSettingOption(Ve.PreferredCodec).options=ui.getSupportedVideoCodecs(),this.pixelStreaming._onDisconnect(h,c),this.afkController.stopAfkWarningTimer(),this.statsTimerHandle&&window.clearInterval(this.statsTimerHandle),this.setVideoEncoderAvgQP(0),this.setTouchInputEnabled(!1),this.setMouseInputEnabled(!1),this.setKeyboardInputEnabled(!1),this.setGamePadInputEnabled(!1),l&&setTimeout(()=>{this.reconnectAttempt++,this.doReconnect(n.reason)},2e3)}),this.sendMessageController=new Xl(this.dataChannelSender,this.streamMessageController),this.toStreamerMessagesController=new ql(this.sendMessageController),this.registerMessageHandlers(),this.streamMessageController.populateDefaultProtocol(),this.inputClassesFactory=new Hl(this.streamMessageController,this.videoPlayer,this.coordinateConverter),this.isUsingSFU=!1,this.isUsingSVC=!1,this.isQualityController=!1,this.preferredCodec="",this.enableAutoReconnect=!0,this.forceReconnect=!1,this.reconnectAttempt=0,this.isReconnecting=!1,this.config._addOnOptionSettingChangedListener(Ve.StreamerId,n=>{if(n===void 0||n==="")return;this.peerConnectionController.peerConnection.close(),this.peerConnectionController.createPeerConnection(this.peerConfig,this.preferredCodec),this.subscribedStream=n;let r=Kt.createMessage(pt.subscribe,{streamerId:n});this.protocol.sendMessage(r)}),this.config._addOnOptionSettingChangedListener(Ve.PreferredQuality,n=>{if(n===void 0||n==="")return;let r;if(this.isUsingSVC)r=Kt.createMessage(pt.layerPreference,{spatialLayer:+n[1]-1,temporalLayer:+n[3]-1});else{let o=this.config.getSettingOption(Ve.PreferredQuality).options.indexOf(n);r=Kt.createMessage(pt.layerPreference,{spatialLayer:o,temporalLayer:0})}this.protocol.sendMessage(r)}),this.setVideoEncoderAvgQP(-1),this.signallingUrlBuilder=()=>this.config.getTextSettingValue(wn.SignallingServerUrl)}destroyVideoPlayer(){this.videoPlayer.destroy()}handleOnMessage(e){let t=new Uint8Array(e.data);L.Info("Message incoming:"+t);let n=this.streamMessageController.fromStreamerMessages.get(t[0]);this.streamMessageController.fromStreamerHandlers.get(n)(e.data)}registerMessageHandlers(){this.streamMessageController.registerMessageHandler(xe.FromStreamer,"QualityControlOwnership",e=>this.onQualityControlOwnership(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"Response",e=>this.responseController.onResponse(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"Command",e=>{this.onCommand(e)}),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"FreezeFrame",e=>this.onFreezeFrameMessage(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"UnfreezeFrame",()=>this.invalidateFreezeFrameAndEnableVideo()),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"VideoEncoderAvgQP",e=>this.handleVideoEncoderAvgQP(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"LatencyTest",e=>this.handleLatencyTestResult(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"DataChannelLatencyTest",e=>this.handleDataChannelLatencyTestResponse(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"InitialSettings",e=>this.handleInitialSettings(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"FileExtension",e=>this.onFileExtension(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"FileMimeType",e=>this.onFileMimeType(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"FileContents",e=>this.onFileContents(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"TestEcho",()=>{}),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"InputControlOwnership",e=>this.onInputControlOwnership(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"GamepadResponse",e=>this.onGamepadResponse(e)),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"Multiplexed",()=>{}),this.streamMessageController.registerMessageHandler(xe.FromStreamer,"Protocol",e=>this.onProtocolMessage(e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"IFrameRequest",()=>this.sendMessageController.sendMessageToStreamer("IFrameRequest")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"RequestQualityControl",()=>this.sendMessageController.sendMessageToStreamer("RequestQualityControl")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"FpsRequest",()=>this.sendMessageController.sendMessageToStreamer("FpsRequest")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"AverageBitrateRequest",()=>this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"StartStreaming",()=>this.sendMessageController.sendMessageToStreamer("StartStreaming")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"StopStreaming",()=>this.sendMessageController.sendMessageToStreamer("StopStreaming")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"LatencyTest",e=>this.sendMessageController.sendMessageToStreamer("LatencyTest",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"RequestInitialSettings",()=>this.sendMessageController.sendMessageToStreamer("RequestInitialSettings")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"TestEcho",()=>{}),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"UIInteraction",e=>this.sendMessageController.sendMessageToStreamer("UIInteraction",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"Command",e=>this.sendMessageController.sendMessageToStreamer("Command",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"TextboxEntry",e=>this.sendMessageController.sendMessageToStreamer("TextboxEntry",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"KeyDown",e=>this.sendMessageController.sendMessageToStreamer("KeyDown",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"KeyUp",e=>this.sendMessageController.sendMessageToStreamer("KeyUp",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"KeyPress",e=>this.sendMessageController.sendMessageToStreamer("KeyPress",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"MouseEnter",e=>this.sendMessageController.sendMessageToStreamer("MouseEnter",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"MouseLeave",e=>this.sendMessageController.sendMessageToStreamer("MouseLeave",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"MouseDown",e=>this.sendMessageController.sendMessageToStreamer("MouseDown",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"MouseUp",e=>this.sendMessageController.sendMessageToStreamer("MouseUp",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"MouseMove",e=>this.sendMessageController.sendMessageToStreamer("MouseMove",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"MouseWheel",e=>this.sendMessageController.sendMessageToStreamer("MouseWheel",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"MouseDouble",e=>this.sendMessageController.sendMessageToStreamer("MouseDouble",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"TouchStart",e=>this.sendMessageController.sendMessageToStreamer("TouchStart",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"TouchEnd",e=>this.sendMessageController.sendMessageToStreamer("TouchEnd",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"TouchMove",e=>this.sendMessageController.sendMessageToStreamer("TouchMove",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"GamepadConnected",()=>this.sendMessageController.sendMessageToStreamer("GamepadConnected")),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"GamepadButtonPressed",e=>this.sendMessageController.sendMessageToStreamer("GamepadButtonPressed",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"GamepadButtonReleased",e=>this.sendMessageController.sendMessageToStreamer("GamepadButtonReleased",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"GamepadAnalog",e=>this.sendMessageController.sendMessageToStreamer("GamepadAnalog",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"GamepadDisconnected",e=>this.sendMessageController.sendMessageToStreamer("GamepadDisconnected",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XREyeViews",e=>this.sendMessageController.sendMessageToStreamer("XREyeViews",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRHMDTransform",e=>this.sendMessageController.sendMessageToStreamer("XRHMDTransform",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRControllerTransform",e=>this.sendMessageController.sendMessageToStreamer("XRControllerTransform",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRSystem",e=>this.sendMessageController.sendMessageToStreamer("XRSystem",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRButtonTouched",e=>this.sendMessageController.sendMessageToStreamer("XRButtonTouched",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRButtonTouchReleased",e=>this.sendMessageController.sendMessageToStreamer("XRButtonTouchReleased",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRButtonPressed",e=>this.sendMessageController.sendMessageToStreamer("XRButtonPressed",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRButtonReleased",e=>this.sendMessageController.sendMessageToStreamer("XRButtonReleased",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"XRAnalog",e=>this.sendMessageController.sendMessageToStreamer("XRAnalog",e)),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"ChannelRelayStatus",()=>{}),this.streamMessageController.registerMessageHandler(xe.ToStreamer,"Multiplexed",()=>{})}onCommand(e){L.Info("DataChannelReceiveMessageType.Command");let t=new TextDecoder("utf-16").decode(e.slice(1));L.Info("Data Channel Command: "+t);let n=JSON.parse(t);n.command==="onScreenKeyboard"&&this.handleOnScreenKeyboardCommand(n)}handleOnScreenKeyboardCommand(e){var t,n,r,s;let o={showOnScreenKeyboard:(t=e.showOnScreenKeyboard)!==null&&t!==void 0?t:!0,x:(n=e.x)!==null&&n!==void 0?n:0,y:(r=e.y)!==null&&r!==void 0?r:0,contents:(s=e.contents)!==null&&s!==void 0?s:""};this.pixelStreaming.dispatchEvent(new fl(o))}onProtocolMessage(e){try{let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t);Object.prototype.hasOwnProperty.call(n,"Direction")||L.Error("Malformed protocol received. Ensure the protocol message contains a direction");let r=n.Direction;delete n.Direction,L.Info(`Received new ${r==xe.FromStreamer?"FromStreamer":"ToStreamer"} protocol. Updating existing protocol...`),Object.keys(n).forEach(s=>{let o=n[s];switch(r){case xe.ToStreamer:if(!Object.prototype.hasOwnProperty.call(o,"id")){L.Error(`ToStreamer->${s} protocol definition was malformed as it didn't contain at least an id

                                           Definition was: ${JSON.stringify(o,null,2)}`);return}if(s==="UIInteraction"||s==="Command"||s==="LatencyTest")return;this.streamMessageController.toStreamerHandlers.get(s)?this.streamMessageController.toStreamerMessages.set(s,o):L.Error(`There was no registered handler for "${s}" - try adding one using registerMessageHandler(MessageDirection.ToStreamer, "${s}", myHandler)`);break;case xe.FromStreamer:if(!Object.prototype.hasOwnProperty.call(o,"id")){L.Error(`FromStreamer->${s} protocol definition was malformed as it didn't contain at least an id

                            Definition was: ${JSON.stringify(o,null,2)}`);return}this.streamMessageController.fromStreamerHandlers.get(s)?this.streamMessageController.fromStreamerMessages.set(o.id,s):L.Error(`There was no registered handler for "${o}" - try adding one using registerMessageHandler(MessageDirection.FromStreamer, "${s}", myHandler)`);break;default:L.Error(`Unknown direction: ${r}`)}}),this.toStreamerMessagesController.SendRequestInitialSettings(),this.toStreamerMessagesController.SendRequestQualityControl()}catch(t){L.Info(t)}}onInputControlOwnership(e){let t=new Uint8Array(e);L.Info("DataChannelReceiveMessageType.InputControlOwnership");let n=new Boolean(t[1]).valueOf();L.Info(`Received input controller message - will your input control the stream: ${n}`),this.pixelStreaming._onInputControlOwnership(n)}onGamepadResponse(e){let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t);this.gamePadController.onGamepadResponseReceived(n.controllerId)}onAfkTriggered(){this.afkController.onAfkClick(),this.videoPlayer.isPaused()&&this.videoPlayer.hasVideoSource()&&this.playStream()}setAfkEnabled(e){e?this.onAfkTriggered():this.afkController.stopAfkWarningTimer()}tryReconnect(e){this.forceReconnect=!0,this.doReconnect(e)}doReconnect(e){if(!this.protocol){L.Info("This player has no protocol connection.");return}this.isReconnecting=!0,this.protocol.isConnected()?(this.forceReconnect||(this.disconnectMessage=`${e} Reconnecting.`),this.closeSignalingServer(e,!0)):(this.pixelStreaming._onWebRtcAutoConnect(),this.connectToSignallingServer())}loadFreezeFrameOrShowPlayOverlay(){this.pixelStreaming.dispatchEvent(new ol({shouldShowPlayOverlay:this.shouldShowPlayOverlay,isValid:this.freezeFrameController.valid,jpegData:this.freezeFrameController.jpeg})),this.shouldShowPlayOverlay===!0?(L.Info("showing play overlay"),this.resizePlayerStyle()):(L.Info("showing freeze frame"),this.freezeFrameController.showFreezeFrame()),setTimeout(()=>{this.videoPlayer.setVideoEnabled(!1)},this.freezeFrameController.freezeFrameDelay)}onFreezeFrameMessage(e){L.Info("DataChannelReceiveMessageType.FreezeFrame");let t=new Uint8Array(e);this.freezeFrameController.processFreezeFrameMessage(t,()=>this.loadFreezeFrameOrShowPlayOverlay())}invalidateFreezeFrameAndEnableVideo(){L.Info("DataChannelReceiveMessageType.FreezeFrame"),setTimeout(()=>{this.pixelStreaming.dispatchEvent(new al),this.freezeFrameController.hideFreezeFrame()},this.freezeFrameController.freezeFrameDelay),this.videoPlayer.getVideoElement()&&this.videoPlayer.setVideoEnabled(!0)}onFileExtension(e){let t=new Uint8Array(e);xr.setExtensionFromBytes(t,this.file)}onFileMimeType(e){let t=new Uint8Array(e);xr.setMimeTypeFromBytes(t,this.file)}onFileContents(e){let t=new Uint8Array(e);xr.setContentsFromBytes(t,this.file)}playStream(){if(!this.videoPlayer.getVideoElement()){let e="Could not play video stream because the video player was not initialized correctly.";this.pixelStreaming.dispatchEvent(new rl({message:e})),L.Error(e),this.closeSignalingServer("Stream not initialized correctly",!1);return}if(!this.videoPlayer.hasVideoSource()){L.Warning("Cannot play stream, the video element has no srcObject to play.");return}if(this.setTouchInputEnabled(this.config.isFlagEnabled(N.TouchInput)),this.pixelStreaming.dispatchEvent(new sl),this.streamController.audioElement.srcObject){let e=this.config.isFlagEnabled(N.StartVideoMuted);this.streamController.audioElement.muted=e,e?this.playVideo():this.streamController.audioElement.play().then(()=>{this.playVideo()}).catch(t=>{L.Info(t),L.Info("Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."),this.pixelStreaming.dispatchEvent(new ps({reason:t}))})}else this.playVideo();this.shouldShowPlayOverlay=!1,this.freezeFrameController.showFreezeFrame()}playVideo(){this.videoPlayer.play().catch(e=>{this.streamController.audioElement.srcObject&&this.streamController.audioElement.pause(),L.Info(e),L.Info("Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."),this.pixelStreaming.dispatchEvent(new ps({reason:e}))})}autoPlayVideoOrSetUpPlayOverlay(){this.config.isFlagEnabled(N.AutoPlayVideo)&&this.playStream(),this.resizePlayerStyle()}connectToSignallingServer(){this.locallyClosed=!1,this.enableAutoReconnect=!0,this.disconnectMessage=null;let e=this.signallingUrlBuilder();this.protocol.connect(e);let t=this.config.getNumericSettingValue($.KeepaliveDelay);t>0&&(this.keepalive=new ds(this.protocol,t),this.keepalive.onTimeout=()=>{L.Error("Protocol timeout"),this.protocol.disconnect()})}startSession(e){if(this.peerConfig=e,this.config.isFlagEnabled(N.ForceTURN)&&!this.checkTurnServerAvailability(e)){L.Info("No turn server was found in the Peer Connection Options. TURN cannot be forced, closing connection. Please use STUN instead"),this.closeSignalingServer("TURN cannot be forced, closing connection. Please use STUN instead.",!1);return}this.peerConnectionController=new Pl(this.peerConfig,this.config,this.preferredCodec),this.peerConnectionController.onVideoStats=r=>{this.handleVideoStats(r)},this.peerConnectionController.onLatencyCalculated=r=>{this.pixelStreaming._onLatencyCalculated(r)},this.peerConnectionController.onSendWebRTCOffer=r=>{this.handleSendWebRTCOffer(r)},this.peerConnectionController.onSetLocalDescription=r=>{r.type==="offer"?this.handleSendWebRTCOffer(r):r.type==="answer"?this.handleSendWebRTCAnswer(r):L.Error(`PeerConnectionController onSetLocalDescription was called with unexpected type ${r.type}`)},this.peerConnectionController.onSetRemoteDescription=r=>{r.type==="offer"?this.pixelStreaming._onWebRtcSdpOffer(r):r.type==="answer"?this.pixelStreaming._onWebRtcSdpAnswer(r):L.Error(`PeerConnectionController onSetRemoteDescription was called with unexpected type ${r.type}`)},this.peerConnectionController.onPeerIceCandidate=r=>this.handleSendIceCandidate(r),this.peerConnectionController.onDataChannel=r=>this.handleDataChannel(r),this.peerConnectionController.showTextOverlayConnecting=()=>this.pixelStreaming._onWebRtcConnecting(),this.peerConnectionController.showTextOverlaySetupFailure=()=>this.pixelStreaming._onWebRtcFailed();let t=!1;this.peerConnectionController.onIceConnectionStateChange=()=>{!t&&["connected","completed"].includes(this.peerConnectionController.peerConnection.iceConnectionState)&&(this.pixelStreaming._onWebRtcConnected(),t=!0)},this.peerConnectionController.onTrack=r=>this.streamController.handleOnTrack(r),this.config.isFlagEnabled(N.BrowserSendOffer)&&(this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection,"cirrus",this.datachannelOptions),this.sendrecvDataChannelController.handleOnMessage=r=>this.handleOnMessage(r),this.peerConnectionController.createOffer(this.sdpConstraints,this.config))}checkTurnServerAvailability(e){if(!e.iceServers)return L.Info("A turn sever was not found"),!1;for(let t of e.iceServers)for(let n of t.urls)if(n.includes("turn"))return L.Info(`A turn sever was found at ${n}`),!0;return L.Info("A turn sever was not found"),!1}handleOnConfigMessage(e){this.resizePlayerStyle(),this.startSession(e.peerConnectionOptions)}handlePingMessage(e){this.protocol.sendMessage(Kt.createMessage(pt.pong,{time:e.time}))}handleStreamerListMessage(e){L.Info(`Got streamer list ${e.ids}`);let t="",n=this.config.getSettingOption(Ve.StreamerId);n.selected.toString().trim()&&(t=n.selected);let s=[...e.ids];s.unshift(""),this.config.setOptionSettingOptions(Ve.StreamerId,s);let o="",a=this.config.isFlagEnabled(N.WaitForStreamer),l=this.config.getNumericSettingValue($.MaxReconnectAttempts),c=this.config.getNumericSettingValue($.StreamerAutoJoinInterval),h=this.config.useUrlParams,u=new br(window.location.search);h&&u.has(Ve.StreamerId)?t=u.get(Ve.StreamerId):this.subscribedStream&&(t=this.subscribedStream),t&&e.ids.includes(t)?o=t:(!t||!a)&&e.ids.length==1&&(o=e.ids[0]),o?(this.reconnectAttempt=0,this.isReconnecting=!1,this.config.setOptionSettingValue(Ve.StreamerId,o)):a&&(this.reconnectAttempt<l?(this.reconnectAttempt++,this.isReconnecting=!0,setTimeout(()=>{this.protocol.sendMessage(Kt.createMessage(pt.listStreamers))},c)):(this.reconnectAttempt=0,this.isReconnecting=!1,this.enableAutoReconnect=!1)),this.pixelStreaming.dispatchEvent(new cl({messageStreamerList:e,autoSelectedStreamerId:o,wantedStreamerId:t}))}handleSubscribeFailedMessage(e){this.reconnectAttempt=0,this.isReconnecting=!1,this.enableAutoReconnect=!1,this.pixelStreaming._onSubscribeFailed(e.message)}handleStreamerIDChangedMessage(e){let t=e.newID,n=this.config.getSettingOption(Ve.StreamerId),r=n.onChange;n.onChange=()=>{};let s=n.options;for(let o=0;o<s.length;++o)if(s[o]==this.subscribedStream){s[o]=t;break}n.options=s,n.selected=t,n.onChange=r,this.subscribedStream=e.newID,this.pixelStreaming.dispatchEvent(new hl({newID:t}))}handleWebRtcAnswer(e){L.Info(`Got answer sdp ${e.sdp}`),e.playerId&&(this.playerId=e.playerId);let t={sdp:e.sdp,type:"answer"};this.peerConnectionController.receiveAnswer(t),this.handlePostWebrtcNegotiation()}handleWebRtcOffer(e){L.Info(`Got offer sdp ${e.sdp}`),e.playerId&&(this.playerId=e.playerId),this.isUsingSFU=e.sfu?e.sfu:!1,this.isUsingSVC=e.scalabilityMode?e.scalabilityMode!="L1T1":!1,(this.isUsingSFU||this.isUsingSVC)&&(this.peerConnectionController.preferredCodec="");let t=e.scalabilityMode?e.scalabilityMode:"L1T1",n=["Default"];if(this.isUsingSFU)if(!this.isUsingSVC)n=["High","Medium","Low"];else{n=[];let s=+t[1],o=+t[3];for(let a=1;a<=s;a++)for(let l=1;l<=o;l++)n.push(`S${a}T${l}`)}this.config.setOptionSettingOptions(Ve.PreferredQuality,n),this.config.setOptionSettingValue(Ve.PreferredQuality,n[0]);let r={sdp:e.sdp,type:"offer"};this.peerConnectionController.receiveOffer(r,this.config),this.handlePostWebrtcNegotiation()}handleWebRtcSFUPeerDatachannels(e){let t={ordered:!0,negotiated:!0,id:e.sendStreamId},n=e.sendStreamId!=e.recvStreamId;if(this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection,n?"send-datachannel":"datachannel",t),n){let r={ordered:!0,negotiated:!0,id:e.recvStreamId};this.recvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection,"recv-datachannel",r),this.recvDataChannelController.handleOnOpen=()=>this.protocol.sendMessage(Kt.createMessage(pt.peerDataChannelsReady)),this.recvDataChannelController.handleOnMessage=s=>this.handleOnMessage(s)}else this.sendrecvDataChannelController.handleOnMessage=r=>this.handleOnMessage(r)}handlePostWebrtcNegotiation(){this.afkController.startAfkWarningTimer(),this.pixelStreaming._onWebRtcSdp(),this.statsTimerHandle&&this.statsTimerHandle!==void 0&&window.clearInterval(this.statsTimerHandle),this.statsTimerHandle=window.setInterval(()=>this.getStats(),1e3),this.setMouseInputEnabled(this.config.isFlagEnabled(N.MouseInput)),this.setKeyboardInputEnabled(this.config.isFlagEnabled(N.KeyboardInput)),this.setGamePadInputEnabled(this.config.isFlagEnabled(N.GamepadInput))}handleIceCandidate(e){L.Info(`Remote ICE candidate information received: ${JSON.stringify(e)}`);let t=new RTCIceCandidate({candidate:e.candidate,sdpMLineIndex:0});this.peerConnectionController.handleOnIce(t)}handleSendIceCandidate(e){e.candidate&&e.candidate.candidate&&(L.Info("Local ICE candidate generated: "+JSON.stringify(e.candidate)),this.protocol.sendMessage(Kt.createMessage(pt.iceCandidate,{candidate:e.candidate})))}handleDataChannel(e){L.Info("Data channel created for us by browser as we are a receiving peer."),this.sendrecvDataChannelController.dataChannel=e.channel,this.sendrecvDataChannelController.setupDataChannel(),this.sendrecvDataChannelController.handleOnMessage=t=>this.handleOnMessage(t)}handleSendWebRTCOffer(e){if(e.type!=="offer"){L.Error(`handleSendWebRTCOffer was called with type ${e.type} - it only expects "offer"`);return}L.Info("Sending the offer to the Server");let t={sdp:e.sdp,minBitrateBps:1e3*this.config.getNumericSettingValue($.WebRTCMinBitrate),maxBitrateBps:1e3*this.config.getNumericSettingValue($.WebRTCMaxBitrate)};this.protocol.sendMessage(Kt.createMessage(pt.offer,t)),this.pixelStreaming._onWebRtcSdpOffer(e)}handleSendWebRTCAnswer(e){if(e.type!=="answer"){L.Error(`handleSendWebRTCAnswer was called with type ${e.type} - it only expects "answer"`);return}L.Info("Sending the answer to the Server");let t={sdp:e.sdp,minBitrateBps:1e3*this.config.getNumericSettingValue($.WebRTCMinBitrate),maxBitrateBps:1e3*this.config.getNumericSettingValue($.WebRTCMaxBitrate)};this.protocol.sendMessage(Kt.createMessage(pt.answer,t)),this.isUsingSFU&&this.protocol.sendMessage(Kt.createMessage(pt.dataChannelRequest)),this.pixelStreaming._onWebRtcSdpAnswer(e)}setUpMouseAndFreezeFrame(){let e=this.videoPlayer.getVideoParentElement(),t=this.videoPlayer.getVideoElement();this.coordinateConverter.reconfigure({width:e.clientWidth,height:e.clientHeight},{width:t.videoWidth,height:t.videoHeight}),this.freezeFrameController.freezeFrame.resize()}closeSignalingServer(e,t){var n;this.locallyClosed=!0,this.enableAutoReconnect=t,this.disconnectMessage=e,(n=this.protocol)===null||n===void 0||n.disconnect(1e3,e)}closePeerConnection(){var e;(e=this.peerConnectionController)===null||e===void 0||e.close()}close(){this.closeSignalingServer("",!1),this.closePeerConnection()}getStats(){this.peerConnectionController.generateStats()}sendLatencyTest(){this.latencyStartTime=Date.now(),this.streamMessageController.toStreamerHandlers.get("LatencyTest")([JSON.stringify({StartTime:this.latencyStartTime})])}sendDataChannelLatencyTest(e){this.streamMessageController.toStreamerHandlers.get("DataChannelLatencyTest")([JSON.stringify(e)])}sendEncoderMinQP(e){L.Info(`MinQP=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MinQP":e})])}sendEncoderMaxQP(e){L.Info(`MaxQP=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MaxQP":e})])}sendEncoderMinQuality(e){L.Info(`MinQuality=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MinQuality":e})])}sendEncoderMaxQuality(e){L.Info(`MaxQuality=${e}
`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"Encoder.MaxQuality":e})])}sendWebRTCMinBitrate(e){L.Info(`WebRTC Min Bitrate=${e}`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.MinBitrate":e})])}sendWebRTCMaxBitrate(e){L.Info(`WebRTC Max Bitrate=${e}`),e!=null&&this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.MaxBitrate":e})])}sendWebRTCFps(e){L.Info(`WebRTC FPS=${e}`),e!=null&&(this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.Fps":e})]),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"WebRTC.MaxFps":e})]))}sendShowFps(){L.Info("----   Sending show stat to UE   ----"),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({"stat.fps":""})])}sendIframeRequest(){L.Info("----   Sending Request for an IFrame  ----"),this.streamMessageController.toStreamerHandlers.get("IFrameRequest")()}isDataChannelOpen(){var e,t;return((t=(e=this.sendrecvDataChannelController)===null||e===void 0?void 0:e.dataChannel)===null||t===void 0?void 0:t.readyState)==="open"}emitUIInteraction(e){L.Info("----   Sending custom UIInteraction message   ----"),this.streamMessageController.toStreamerHandlers.get("UIInteraction")([JSON.stringify(e)])}emitCommand(e){L.Info("----   Sending custom Command message   ----"),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(e)])}emitConsoleCommand(e){L.Info("----   Sending custom Command:ConsoleCommand message   ----"),this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ConsoleCommand:e})])}sendRequestQualityControlOwnership(){L.Info("----   Sending Request to Control Quality  ----"),this.toStreamerMessagesController.SendRequestQualityControl()}sendTextboxEntry(e){var t;L.Info("----   Sending TextboxEntry message  ----"),(t=this.streamMessageController.toStreamerHandlers.get("TextboxEntry"))===null||t===void 0||t([e])}handleLatencyTestResult(e){L.Info("DataChannelReceiveMessageType.latencyTest");let t=new TextDecoder("utf-16").decode(e.slice(1)),n=new Fl;Object.assign(n,JSON.parse(t)),n.processFields(),n.testStartTimeMs=this.latencyStartTime,n.browserReceiptTimeMs=Date.now(),n.latencyExcludingDecode=~~(n.browserReceiptTimeMs-n.testStartTimeMs),n.testDuration=~~(n.TransmissionTimeMs-n.ReceiptTimeMs),n.networkLatency=~~(n.latencyExcludingDecode-n.testDuration),n.frameDisplayDeltaTimeMs&&n.browserReceiptTimeMs&&(n.endToEndLatency=(n.frameDisplayDeltaTimeMs+n.networkLatency,~~+n.CaptureToSendMs)),this.pixelStreaming._onLatencyTestResult(n)}handleDataChannelLatencyTestResponse(e){L.Info("DataChannelReceiveMessageType.dataChannelLatencyResponse");let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t);this.pixelStreaming._onDataChannelLatencyTestResponse(n)}handleInitialSettings(e){L.Info("DataChannelReceiveMessageType.InitialSettings");let t=new TextDecoder("utf-16").decode(e.slice(1)),n=JSON.parse(t),r=new Dl;n.Encoder&&(r.EncoderSettings=n.Encoder),n.WebRTC&&(r.WebRTCSettings=n.WebRTC),n.PixelStreaming&&(r.PixelStreamingSettings=n.PixelStreaming),n.ConfigOptions&&n.ConfigOptions.DefaultToHover!==void 0&&this.config.setFlagEnabled(N.HoveringMouseMode,!!n.ConfigOptions.DefaultToHover),r.ueCompatible(),L.Info(t),this.pixelStreaming._onInitialSettings(r)}handleVideoEncoderAvgQP(e){L.Info("DataChannelReceiveMessageType.VideoEncoderAvgQP");let t=Number(new TextDecoder("utf-16").decode(e.slice(1)));this.setVideoEncoderAvgQP(t)}handleVideoInitialized(){this.pixelStreaming._onVideoInitialized(),this.autoPlayVideoOrSetUpPlayOverlay(),this.resizePlayerStyle(),this.videoPlayer.updateVideoStreamSize()}onQualityControlOwnership(e){let t=new Uint8Array(e);L.Info("DataChannelReceiveMessageType.QualityControlOwnership"),this.isQualityController=new Boolean(t[1]).valueOf(),L.Info(`Received quality controller message, will control quality: ${this.isQualityController}`),this.pixelStreaming._onQualityControlOwnership(this.isQualityController)}handleVideoStats(e){this.pixelStreaming._onVideoStats(e)}resizePlayerStyle(){this.videoPlayer.resizePlayerStyle()}setPreferredCodec(e){this.preferredCodec=e,this.peerConnectionController&&(this.peerConnectionController.preferredCodec=e,this.peerConnectionController.updateCodecSelection=!1)}setVideoEncoderAvgQP(e){this.videoAvgQp=e,this.pixelStreaming._onVideoEncoderAvgQP(this.videoAvgQp)}setKeyboardInputEnabled(e){var t;(t=this.keyboardController)===null||t===void 0||t.unregister(),e&&(this.keyboardController=this.inputClassesFactory.registerKeyBoard(this.config))}setMouseInputEnabled(e){var t;if((t=this.mouseController)===null||t===void 0||t.unregister(),e){let n=this.config.isFlagEnabled(N.HoveringMouseMode)?Ui.HoveringMouse:Ui.LockedMouse;this.mouseController=this.inputClassesFactory.registerMouse(n,this.config)}}setTouchInputEnabled(e){var t;(t=this.touchController)===null||t===void 0||t.unregister(),e&&(this.touchController=this.inputClassesFactory.registerTouch(this.config.isFlagEnabled(N.FakeMouseWithTouches)))}setGamePadInputEnabled(e){var t;(t=this.gamePadController)===null||t===void 0||t.unregister(),e&&(this.gamePadController=this.inputClassesFactory.registerGamePad())}registerDataChannelEventEmitters(e){e.onOpen=(t,n)=>this.pixelStreaming.dispatchEvent(new Ja({label:t,event:n})),e.onClose=(t,n)=>this.pixelStreaming.dispatchEvent(new Za({label:t,event:n})),e.onError=(t,n)=>this.pixelStreaming.dispatchEvent(new ja({label:t,event:n}))}registerMessageHandler(e,t,n){t===xe.FromStreamer&&typeof n>"u"&&L.Warning(`Unable to register handler for ${e} as no handler was passed`),this.streamMessageController.registerMessageHandler(t,e,r=>typeof n>"u"&&t===xe.ToStreamer?this.sendMessageController.sendMessageToStreamer(e,r):n(r))}};var Jl=class{constructor(e){this.toStreamerMessagesProvider=e,this.controllers=[]}updateStatus(e,t,n){if(e.gamepad){let r=t.getPose(e.gripSpace,n);if(!r)return;let s=0;e.profiles.includes("htc-vive")?s=1:e.profiles.includes("oculus-touch")&&(s=2),this.toStreamerMessagesProvider.toStreamerHandlers.get("XRSystem")([s]);let o=2;switch(e.handedness){case"left":o=0;break;case"right":o=1;break}let a=r.transform.matrix,l=[];for(let d=0;d<16;d++)l[d]=new Float32Array([a[d]])[0];this.toStreamerMessagesProvider.toStreamerHandlers.get("XRControllerTransform")([l[0],l[4],l[8],l[12],l[1],l[5],l[9],l[13],l[2],l[6],l[10],l[14],l[3],l[7],l[11],l[15],o]),this.controllers[o]===void 0&&(this.controllers[o]={prevState:void 0,currentState:void 0,id:void 0},this.controllers[o].prevState=ki(e.gamepad)),this.controllers[o].currentState=ki(e.gamepad);let c=this.controllers[o],h=c.currentState,u=c.prevState;for(let d=0;d<h.buttons.length;d++){let p=h.buttons[d],g=u.buttons[d];if(p.pressed){let M=g.pressed?1:0;this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonPressed")([o,d,M,p.value])}else g.pressed&&this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonReleased")([o,d,0]);if(p.touched){let M=g.touched?1:0;this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonTouched")([o,d,M])}else g.touched&&this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonTouchReleased")([o,d,0])}for(let d=0;d<h.axes.length;d++){let p=h.axes[d],g=u.axes[d];p!=g&&this.toStreamerMessagesProvider.toStreamerHandlers.get("XRAnalog")([o,d,p])}this.controllers[o].prevState=h}}};var Ss=class{constructor(e){this.xrViewerPose=null,this.EPSILON=1e-7,this.videoTexture=null,this.prevVideoWidth=0,this.prevVideoHeight=0,this.leftView=null,this.rightView=null,this.lastSentLeftEyeProj=null,this.lastSentRightEyeProj=null,this.lastSentRelativeLeftEyePos=null,this.lastSentRelativeRightEyePos=null,this.xrSession=null,this.webRtcController=e,this.xrGamepadController=new Jl(this.webRtcController.streamMessageController),this.onSessionEnded=new EventTarget,this.onSessionStarted=new EventTarget,this.onFrame=new EventTarget}xrClicked(){if(this.xrSession)this.xrSession.end();else{if(!navigator.xr){L.Error("This browser does not support XR.");return}navigator.xr.requestSession("immersive-vr",{optionalFeatures:[]}).then(e=>{this.onXrSessionStarted(e)})}}onXrSessionEnded(){L.Info("XR Session ended"),this.xrSession=null,this.onSessionEnded.dispatchEvent(new Event("xrSessionEnded"))}initGL(){if(this.gl)return;let e=document.createElement("canvas");this.gl=e.getContext("webgl2",{xrCompatible:!0}),this.gl.clearColor(0,0,0,1)}initShaders(){let e=`
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
        `,n=this.gl.createShader(this.gl.VERTEX_SHADER);this.gl.shaderSource(n,e),this.gl.compileShader(n);let r=this.gl.createShader(this.gl.FRAGMENT_SHADER);this.gl.shaderSource(r,t),this.gl.compileShader(r);let s=this.gl.createProgram();this.gl.attachShader(s,n),this.gl.attachShader(s,r),this.gl.linkProgram(s),this.gl.useProgram(s),this.positionLocation=this.gl.getAttribLocation(s,"a_position"),this.texcoordLocation=this.gl.getAttribLocation(s,"a_texCoord")}updateVideoTexture(){this.videoTexture||(this.videoTexture=this.gl.createTexture(),this.gl.bindTexture(this.gl.TEXTURE_2D,this.videoTexture),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR));let e=this.webRtcController.videoPlayer.getVideoElement().videoHeight,t=this.webRtcController.videoPlayer.getVideoElement().videoWidth;this.prevVideoHeight!=e||this.prevVideoWidth!=t?this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,t,e,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.webRtcController.videoPlayer.getVideoElement()):this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,0,0,t,e,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.webRtcController.videoPlayer.getVideoElement()),this.prevVideoHeight=e,this.prevVideoWidth=t}initBuffers(){this.positionBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.positionBuffer),this.gl.enableVertexAttribArray(this.positionLocation),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,1,1,1,-1,-1,-1,-1,1,1,1,-1]),this.gl.STATIC_DRAW),this.gl.vertexAttribPointer(this.positionLocation,2,this.gl.FLOAT,!1,0,0),this.texcoordBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.texcoordBuffer),this.gl.enableVertexAttribArray(this.texcoordLocation),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),this.gl.STATIC_DRAW),this.gl.vertexAttribPointer(this.texcoordLocation,2,this.gl.FLOAT,!1,0,0)}onXrSessionStarted(e){L.Info("XR Session started"),this.xrSession=e,this.xrSession.addEventListener("end",()=>{this.onXrSessionEnded()}),this.initGL(),this.initShaders(),this.initBuffers(),e.requestReferenceSpace("local").then(t=>{if(this.xrRefSpace=t,this.xrSession.updateRenderState({baseLayer:new XRWebGLLayer(this.xrSession,this.gl)}),this.xrSession.supportedFrameRates)for(let n of this.xrSession.supportedFrameRates)n==90&&e.updateTargetFrameRate(90);this.xrSession.requestAnimationFrame(this.onXrFrame.bind(this))}),this.onSessionStarted.dispatchEvent(new Event("xrSessionStarted"))}areArraysEqual(e,t){return e.length===t.length&&e.every((n,r)=>Math.abs(n-t[r])<=this.EPSILON)}arePointsEqual(e,t){return Math.abs(e.x-t.x)>=this.EPSILON&&Math.abs(e.y-t.y)>=this.EPSILON&&Math.abs(e.z-t.z)>=this.EPSILON}sendXRDataToUE(){if(this.leftView==null||this.rightView==null)return;let e=this.lastSentLeftEyeProj==null||this.lastSentRightEyeProj==null||this.lastSentRelativeLeftEyePos==null||this.lastSentRelativeRightEyePos==null,t=this.leftView.transform.matrix,n=this.leftView.projectionMatrix,r=this.rightView.transform.matrix,s=this.rightView.projectionMatrix,o=this.xrViewerPose.transform.matrix;if(!e&&this.lastSentLeftEyeProj!=null&&this.lastSentRightEyeProj!=null){let c=this.areArraysEqual(n,this.lastSentLeftEyeProj),h=this.areArraysEqual(s,this.lastSentRightEyeProj);e=c==!1||h==!1}let a=new DOMPointReadOnly(this.leftView.transform.position.x-this.xrViewerPose.transform.position.x,this.leftView.transform.position.y-this.xrViewerPose.transform.position.y,this.leftView.transform.position.z-this.xrViewerPose.transform.position.z,1),l=new DOMPointReadOnly(this.leftView.transform.position.x-this.xrViewerPose.transform.position.x,this.leftView.transform.position.y-this.xrViewerPose.transform.position.y,this.leftView.transform.position.z-this.xrViewerPose.transform.position.z,1);if(!e&&this.lastSentRelativeLeftEyePos!=null&&this.lastSentRelativeRightEyePos!=null){let c=this.arePointsEqual(a,this.lastSentRelativeLeftEyePos),h=this.arePointsEqual(l,this.lastSentRelativeRightEyePos);e=c==!1||h==!1}e?(this.webRtcController.streamMessageController.toStreamerHandlers.get("XREyeViews")([t[0],t[4],t[8],t[12],t[1],t[5],t[9],t[13],t[2],t[6],t[10],t[14],t[3],t[7],t[11],t[15],n[0],n[4],n[8],n[12],n[1],n[5],n[9],n[13],n[2],n[6],n[10],n[14],n[3],n[7],n[11],n[15],r[0],r[4],r[8],r[12],r[1],r[5],r[9],r[13],r[2],r[6],r[10],r[14],r[3],r[7],r[11],r[15],s[0],s[4],s[8],s[12],s[1],s[5],s[9],s[13],s[2],s[6],s[10],s[14],s[3],s[7],s[11],s[15],o[0],o[4],o[8],o[12],o[1],o[5],o[9],o[13],o[2],o[6],o[10],o[14],o[3],o[7],o[11],o[15]]),this.lastSentLeftEyeProj=n,this.lastSentRightEyeProj=s,this.lastSentRelativeLeftEyePos=a,this.lastSentRelativeRightEyePos=l):this.webRtcController.streamMessageController.toStreamerHandlers.get("XRHMDTransform")([o[0],o[4],o[8],o[12],o[1],o[5],o[9],o[13],o[2],o[6],o[10],o[14],o[3],o[7],o[11],o[15]])}onXrFrame(e,t){if(this.xrViewerPose=t.getViewerPose(this.xrRefSpace),this.xrViewerPose){if(this.updateViews(),this.leftView==null||this.rightView==null)return;this.sendXRDataToUE(),this.updateVideoTexture(),this.render()}this.webRtcController.config.isFlagEnabled(N.XRControllerInput)&&this.xrSession.inputSources.forEach((n,r,s)=>{this.xrGamepadController.updateStatus(n,t,this.xrRefSpace)},this),this.xrSession.requestAnimationFrame((n,r)=>this.onXrFrame(n,r)),this.onFrame.dispatchEvent(new vl({time:e,frame:t}))}updateViews(){if(this.xrViewerPose)for(let e of this.xrViewerPose.views)e.eye==="left"?this.leftView=e:e.eye==="right"&&(this.rightView=e)}render(){if(!this.gl)return;let e=this.xrSession.renderState.baseLayer;this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,e.framebuffer),this.gl.viewport(0,0,e.framebufferWidth,e.framebufferHeight),this.gl.drawArrays(this.gl.TRIANGLES,0,6)}static isSessionSupported(e){location.protocol!=="https:"&&L.Info("WebXR requires https, if you want WebXR use https.");try{if(navigator.xr)return navigator.xr.isSessionSupported(e)}catch{return Promise.resolve(!1)}return Promise.resolve(!1)}};var Zl=class{constructor(e){this.seq=e.Seq,this.playerSentTimestamp=Date.now(),this.requestFillerSize=e.Filler?e.Filler.length:0}update(e){this.playerReceivedTimestamp=Date.now(),this.streamerReceivedTimestamp=e.ReceivedTimestamp,this.streamerSentTimestamp=e.SentTimestamp,this.responseFillerSize=e.Filler?e.Filler.length:0}};var jl=class{constructor(e,t){this.intervalHandle=void 0,this.sink=e,this.callback=t,this.records=new Map,this.seq=0}start(e){return this.isRunning()?!1:(this.startTime=Date.now(),this.records.clear(),this.intervalHandle=window.setInterval((()=>{Date.now()-this.startTime>=e.duration?this.stop():this.sendRequest(e.requestSize,e.responseSize)}).bind(this),Math.floor(1e3/e.rps)),!0)}stop(){this.intervalHandle&&(window.clearInterval(this.intervalHandle),this.intervalHandle=void 0,this.callback(this.produceResult()))}produceResult(){let e=new Map(this.records);return{records:e,dataChannelRtt:Math.ceil(Array.from(this.records.values()).reduce((t,n)=>t+(n.playerReceivedTimestamp-n.playerSentTimestamp),0)/this.records.size),playerToStreamerTime:Math.ceil(Array.from(this.records.values()).reduce((t,n)=>t+(n.streamerReceivedTimestamp-n.playerSentTimestamp),0)/this.records.size),streamerToPlayerTime:Math.ceil(Array.from(this.records.values()).reduce((t,n)=>t+(n.playerReceivedTimestamp-n.streamerSentTimestamp),0)/this.records.size),exportLatencyAsCSV:()=>{let t=`Timestamp;RTT;PlayerToStreamer;StreamerToPlayer;
`;return e.forEach(n=>{t+=n.playerSentTimestamp+";",t+=n.playerReceivedTimestamp-n.playerSentTimestamp+";",t+=n.streamerReceivedTimestamp-n.playerSentTimestamp+";",t+=n.playerReceivedTimestamp-n.streamerSentTimestamp+";",t+=`
`}),t}}}isRunning(){return!!this.intervalHandle}receive(e){if(!this.isRunning())return;if(!e){L.Error("Undefined response from server");return}let t=this.records.get(e.Seq);t&&t.update(e)}sendRequest(e,t){let n=this.createRequest(e,t),r=new Zl(n);this.records.set(r.seq,r),this.sink(n)}createRequest(e,t){return{Seq:this.seq++,FillResponseSize:t,Filler:e?"A".repeat(e):""}}};var bs=class{constructor(e,t){this.allowConsoleCommands=!1,this.config=e,t?.videoElementParent&&(this._videoElementParent=t.videoElementParent),this._eventEmitter=new Sl,this.configureSettings(),this.setWebRtcPlayerController(new Kl(this.config,this)),this._webXrController=new Ss(this._webRtcController),this._setupWebRtcTCPRelayDetection=this._setupWebRtcTCPRelayDetection.bind(this),this._eventEmitter.addEventListener("webRtcConnected",n=>{this._eventEmitter.addEventListener("statsReceived",this._setupWebRtcTCPRelayDetection)})}get videoElementParent(){return this._videoElementParent||(this._videoElementParent=document.createElement("div"),this._videoElementParent.id="videoElementParent"),this._videoElementParent}configureSettings(){this.config._addOnSettingChangedListener(N.IsQualityController,e=>{e===!0&&!this._webRtcController.isQualityController&&this._webRtcController.sendRequestQualityControlOwnership()}),this.config._addOnSettingChangedListener(N.AFKDetection,e=>{this._webRtcController.setAfkEnabled(e)}),this.config._addOnSettingChangedListener(N.MatchViewportResolution,()=>{this._webRtcController.videoPlayer.updateVideoStreamSize()}),this.config._addOnSettingChangedListener(N.HoveringMouseMode,e=>{this.config.setFlagLabel(N.HoveringMouseMode,`Control Scheme: ${e?"Hovering":"Locked"} Mouse`),this._webRtcController.setMouseInputEnabled(this.config.isFlagEnabled(N.MouseInput))}),this.config._addOnSettingChangedListener(N.KeyboardInput,e=>{this._webRtcController.setKeyboardInputEnabled(e)}),this.config._addOnSettingChangedListener(N.MouseInput,e=>{this._webRtcController.setMouseInputEnabled(e)}),this.config._addOnSettingChangedListener(N.FakeMouseWithTouches,e=>{this._webRtcController.setTouchInputEnabled(this.config.isFlagEnabled(N.TouchInput))}),this.config._addOnSettingChangedListener(N.TouchInput,e=>{this._webRtcController.setTouchInputEnabled(e)}),this.config._addOnSettingChangedListener(N.GamepadInput,e=>{this._webRtcController.setGamePadInputEnabled(e)}),this.config._addOnNumericSettingChangedListener($.MinQP,e=>{L.Info("--------  Sending MinQP  --------"),this._webRtcController.sendEncoderMinQP(e),L.Info("-------------------------------------------");let t=Math.trunc(100*(1-e/51));this.config.setNumericSetting($.CompatQualityMax,t)}),this.config._addOnNumericSettingChangedListener($.MaxQP,e=>{L.Info("--------  Sending MaxQP  --------"),this._webRtcController.sendEncoderMaxQP(e),L.Info("-------------------------------------------");let t=Math.trunc(100*(1-e/51));this.config.setNumericSetting($.CompatQualityMin,t)}),this.config._addOnNumericSettingChangedListener($.MinQuality,e=>{L.Info("--------  Sending MinQuality  --------"),this._webRtcController.sendEncoderMinQuality(e),L.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener($.MaxQuality,e=>{L.Info("--------  Sending MaxQuality  --------"),this._webRtcController.sendEncoderMaxQuality(e),L.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener($.CompatQualityMin,e=>{e=51-e/100*51,L.Info("--------  Sending MinQP from quality value  --------"),this._webRtcController.sendEncoderMaxQP(e),L.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener($.CompatQualityMax,e=>{e=51-e/100*51,L.Info("--------  Sending MaxQP from quality value  --------"),this._webRtcController.sendEncoderMinQP(e),L.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener($.WebRTCMinBitrate,e=>{L.Info("--------  Sending web rtc settings  --------"),this._webRtcController.sendWebRTCMinBitrate(e*1e3),L.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener($.WebRTCMaxBitrate,e=>{L.Info("--------  Sending web rtc settings  --------"),this._webRtcController.sendWebRTCMaxBitrate(e*1e3),L.Info("-------------------------------------------")}),this.config._addOnNumericSettingChangedListener($.WebRTCFPS,e=>{L.Info("--------  Sending web rtc settings  --------"),this._webRtcController.sendWebRTCFps(e),L.Info("-------------------------------------------")}),this.config._addOnOptionSettingChangedListener(Ve.PreferredCodec,e=>{this._webRtcController&&this._webRtcController.setPreferredCodec(e)}),this.config._registerOnChangeEvents(this._eventEmitter)}_onInputControlOwnership(e){this._inputController=e}setWebRtcPlayerController(e){this._webRtcController=e,this._webRtcController.setPreferredCodec(this.config.getSettingOption(Ve.PreferredCodec).selected),this._webRtcController.resizePlayerStyle(),this.checkForAutoConnect()}connect(){this._eventEmitter.dispatchEvent(new tl),this._webRtcController.connectToSignallingServer()}reconnect(){this._eventEmitter.dispatchEvent(new il),this._webRtcController.tryReconnect("Reconnecting...")}disconnect(){this._eventEmitter.dispatchEvent(new nl),this._webRtcController.close()}play(){this._onStreamLoading(),this._webRtcController.playStream()}checkForAutoConnect(){this.config.isFlagEnabled(N.AutoConnect)&&(this._onWebRtcAutoConnect(),this._webRtcController.connectToSignallingServer())}unmuteMicrophone(e=!1){if(this.config.isFlagEnabled("UseMic")){this.setMicrophoneMuted(!1);return}if(e){this.config.setFlagEnabled("UseMic",!0),this.reconnect();return}L.Warning("Trying to unmute mic, but PixelStreaming was initialized with no microphone track. Call with forceEnable == true to re-connect with a mic track.")}muteMicrophone(){if(this.config.isFlagEnabled("UseMic")){this.setMicrophoneMuted(!0);return}L.Info("Trying to mute mic, but PixelStreaming has no microphone track, so sending sound is already disabled.")}setMicrophoneMuted(e){var t,n,r,s;for(let o of(s=(r=(n=(t=this._webRtcController)===null||t===void 0?void 0:t.peerConnectionController)===null||n===void 0?void 0:n.peerConnection)===null||r===void 0?void 0:r.getTransceivers())!==null&&s!==void 0?s:[])di.canTransceiverSendAudio(o)&&(o.sender.track.enabled=!e)}unmuteCamera(e=!1){if(this.config.isFlagEnabled("UseCamera")){this.setCameraMuted(!1);return}if(e){this.config.setFlagEnabled("UseCamera",!0),this.reconnect();return}L.Warning("Trying to unmute video, but PixelStreaming was initialized with no video track. Call with forceEnable == true to re-connect with a video track.")}muteCamera(){if(this.config.isFlagEnabled("UseCamera")){this.setCameraMuted(!0);return}L.Info("Trying to mute camera, but PixelStreaming has no video track, so sending video is already disabled.")}setCameraMuted(e){var t,n,r,s;for(let o of(s=(r=(n=(t=this._webRtcController)===null||t===void 0?void 0:t.peerConnectionController)===null||n===void 0?void 0:n.peerConnection)===null||r===void 0?void 0:r.getTransceivers())!==null&&s!==void 0?s:[])di.canTransceiverSendVideo(o)&&(o.sender.track.enabled=!e)}_onWebRtcAutoConnect(){this._eventEmitter.dispatchEvent(new Xa)}_onWebRtcSdp(){this._eventEmitter.dispatchEvent(new Ha)}_onWebRtcSdpOffer(e){this._eventEmitter.dispatchEvent(new Ga({sdp:e}))}_onWebRtcSdpAnswer(e){this._eventEmitter.dispatchEvent(new Wa({sdp:e}))}_onLatencyCalculated(e){this._eventEmitter.dispatchEvent(new dl({latencyInfo:e}))}_onStreamLoading(){this._eventEmitter.dispatchEvent(new el)}_onDisconnect(e,t){this._eventEmitter.dispatchEvent(new Ka({eventString:e,allowClickToReconnect:t}))}_onWebRtcConnecting(){this._eventEmitter.dispatchEvent(new qa)}_onWebRtcConnected(){this._eventEmitter.dispatchEvent(new Ya)}_onWebRtcFailed(){this._eventEmitter.dispatchEvent(new $a)}_onVideoInitialized(){this._eventEmitter.dispatchEvent(new Qa),this._videoStartTime=Date.now(),this.checkForAutoEnterVR()}checkForAutoEnterVR(){this.config.isFlagEnabled(N.AutoEnterVR)&&Ss.isSessionSupported("immersive-vr").then(e=>{if(!e){L.Info("AutoEnterVR is on but immersive-vr is not supported on this device.");return}this._webXrController.xrClicked()}).catch(e=>{let t=e instanceof Error?e.message:JSON.stringify(e);L.Warning(`AutoEnterVR check failed: ${t}`)})}_onLatencyTestResult(e){this._eventEmitter.dispatchEvent(new ul({latencyTimings:e}))}_onDataChannelLatencyTestResponse(e){this._eventEmitter.dispatchEvent(new pl({response:e}))}_onVideoStats(e){(!this._videoStartTime||this._videoStartTime===void 0)&&(this._videoStartTime=Date.now()),e.handleSessionStatistics(this._videoStartTime,this._inputController,this._webRtcController.videoAvgQp),this._eventEmitter.dispatchEvent(new ll({aggregatedStats:e}))}_onVideoEncoderAvgQP(e){this._eventEmitter.dispatchEvent(new za({avgQP:e}))}_onInitialSettings(e){var t;this._eventEmitter.dispatchEvent(new yl({settings:e})),e.PixelStreamingSettings&&(this.allowConsoleCommands=(t=e.PixelStreamingSettings.AllowPixelStreamingCommands)!==null&&t!==void 0?t:!1,this.allowConsoleCommands===!1&&L.Info("-AllowPixelStreamingCommands=false, sending arbitrary console commands from browser to UE is disabled."));let n=this.config.useUrlParams,r=new br(window.location.search);L.Info(`using URL parameters ${n}`),e.EncoderSettings&&(e.EncoderSettings.MinQP&&(this.config.setNumericSetting($.MinQP,n&&r.has($.MinQP)?Number.parseFloat(r.get($.MinQP)):e.EncoderSettings.MinQP||0),this.config.setNumericSetting($.MaxQP,n&&r.has($.MaxQP)?Number.parseFloat(r.get($.MaxQP)):e.EncoderSettings.MaxQP||51)),e.EncoderSettings.MinQuality&&(this.config.setNumericSetting($.MinQuality,n&&r.has($.MinQuality)?Number.parseFloat(r.get($.MinQuality)):e.EncoderSettings.MinQuality||0),this.config.setNumericSetting($.MaxQuality,n&&r.has($.MaxQuality)?Number.parseFloat(r.get($.MaxQuality)):e.EncoderSettings.MaxQuality||100)),n&&(r.has($.CompatQualityMin)&&this.config.setNumericSetting($.CompatQualityMin,Number.parseFloat(r.get($.CompatQualityMin))),r.has($.CompatQualityMax)&&this.config.setNumericSetting($.CompatQualityMax,Number.parseFloat(r.get($.CompatQualityMax))))),e.WebRTCSettings&&(this.config.setNumericSetting($.WebRTCMinBitrate,n&&r.has($.WebRTCMinBitrate)?Number.parseFloat(r.get($.WebRTCMinBitrate)):e.WebRTCSettings.MinBitrate/1e3),this.config.setNumericSetting($.WebRTCMaxBitrate,n&&r.has($.WebRTCMaxBitrate)?Number.parseFloat(r.get($.WebRTCMaxBitrate)):e.WebRTCSettings.MaxBitrate/1e3),this.config.setNumericSetting($.WebRTCFPS,n&&r.has($.WebRTCFPS)?Number.parseFloat(r.get($.WebRTCFPS)):e.WebRTCSettings.FPS))}_onQualityControlOwnership(e){this.config.setFlagEnabled(N.IsQualityController,e)}_onPlayerCount(e){this._eventEmitter.dispatchEvent(new xl({count:e}))}_onSubscribeFailed(e){this._eventEmitter.dispatchEvent(new gl({message:e}))}_setupWebRtcTCPRelayDetection(e){let t=e.data.aggregatedStats.getActiveCandidatePair();if(t!=null){let n=e.data.aggregatedStats.localCandidates.find(r=>r.id==t.localCandidateId,null);n!=null&&n.candidateType=="relay"&&n.relayProtocol=="tcp"&&this._eventEmitter.dispatchEvent(new _l),this._eventEmitter.removeEventListener("statsReceived",this._setupWebRtcTCPRelayDetection)}}requestLatencyTest(){return this._webRtcController.videoPlayer.isVideoReady()?(this._webRtcController.sendLatencyTest(),!0):!1}requestDataChannelLatencyTest(e){return this._webRtcController.isDataChannelOpen()?(this._dataChannelLatencyTestController||(this._dataChannelLatencyTestController=new jl(this._webRtcController.sendDataChannelLatencyTest.bind(this._webRtcController),t=>{this._eventEmitter.dispatchEvent(new ml({result:t}))}),this.addEventListener("dataChannelLatencyTestResponse",({data:{response:t}})=>{this._dataChannelLatencyTestController.receive(t)})),this._dataChannelLatencyTestController.start(e)):!1}requestShowFps(){return this._webRtcController.isDataChannelOpen()?(this._webRtcController.sendShowFps(),!0):!1}requestIframe(){return this._webRtcController.videoPlayer.isVideoReady()?(this._webRtcController.sendIframeRequest(),!0):!1}emitUIInteraction(e){return this._webRtcController.isDataChannelOpen()?(this._webRtcController.emitUIInteraction(e),!0):!1}emitCommand(e){return!this._webRtcController.isDataChannelOpen()||!this.allowConsoleCommands&&"ConsoleCommand"in e?!1:(this._webRtcController.emitCommand(e),!0)}emitConsoleCommand(e){return!this.allowConsoleCommands||!this._webRtcController.isDataChannelOpen()?!1:(this._webRtcController.emitConsoleCommand(e),!0)}sendTextboxEntry(e){return this._webRtcController.isDataChannelOpen()?(this._webRtcController.sendTextboxEntry(e),!0):!1}addResponseEventListener(e,t){this._webRtcController.responseController.addResponseEventListener(e,t)}removeResponseEventListener(e){this._webRtcController.responseController.removeResponseEventListener(e)}dispatchEvent(e){return this._eventEmitter.dispatchEvent(e)}addEventListener(e,t){this._eventEmitter.addEventListener(e,t)}removeEventListener(e,t){this._eventEmitter.removeEventListener(e,t)}toggleXR(){this.webXrController.xrClicked()}setSignallingUrlBuilder(e){this._webRtcController.signallingUrlBuilder=e}get webRtcController(){return this._webRtcController}get signallingProtocol(){return this._webRtcController.protocol}get webXrController(){return this._webXrController}registerMessageHandler(e,t,n){if(t===xe.FromStreamer&&typeof n>"u"){L.Warning(`Unable to register an undefined handler for ${e}`);return}t===xe.ToStreamer&&typeof n>"u"?this._webRtcController.streamMessageController.registerMessageHandler(t,e,r=>this._webRtcController.sendMessageController.sendMessageToStreamer(e,r)):this._webRtcController.streamMessageController.registerMessageHandler(t,e,r=>n(r))}get toStreamerHandlers(){return this._webRtcController.streamMessageController.toStreamerHandlers}isReconnecting(){return this._webRtcController.isReconnecting}};var yt=(()=>{try{return window.top}catch{return window}})();function mx(){if(yt.__portfolioNativeHubV167)return yt.__portfolioNativeHubV167;let i=yt.document,e=yt.PORTFOLIO_STREAM_URL||(/^(127\.0\.0\.1|localhost)$/.test(yt.location.hostname)?"http://127.0.0.1:8089":new URL("/ue",yt.location.href).href.replace(/\/$/,"")),t=i.createElement("div");t.className="ue-native-transport-v167",Object.assign(t.style,{position:"absolute",inset:"0",pointerEvents:"none",overflow:"hidden"});let n=new bl({useUrlParams:!1,initialSettings:{ss:e.replace(/^http/,"ws"),AutoConnect:!1,AutoPlayVideo:!0,StartVideoMuted:!0,WaitForStreamer:!0,PreferredCodec:new URLSearchParams(yt.location.search).get("nativeCodec")||"VP9",MouseInput:!1,KeyboardInput:!1,TouchInput:!1,GamepadInput:!1,MatchViewportRes:!1,WebRTCFPS:45,WebRTCMinBitrate:12e3,WebRTCMaxBitrate:4e4}}),r=new bs(n,{videoElementParent:t}),s={apiVersion:171,transport:t,player:r,endpoint:e,surfaces:new Set,owner:null,connected:!1,connecting:!1,retryAt:0,sending:!1,healthPending:!1,seq:0,id:crypto.randomUUID(),last:"",sentAt:0,frames:0,lastFrameAt:0,lastHealth:0,native:null,claim:!0,connectingAt:0,connections:0};yt.__portfolioNativeHubV167=s;let o=null,a=0;function l(v=!1){for(let[R,_]of[["position","absolute"],["inset","0"],["width","100%"],["height","100%"]])t.style.setProperty(R,_,"important");let S=t.querySelector("video");if(!S||S===o&&!v)return;o&&a&&o.cancelVideoFrameCallback(a),o=S,Object.assign(S.style,{position:"absolute",inset:"0",width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none"}),S.muted=!0;let C=()=>{s.frames++,s.lastFrameAt=performance.now();let R=s.owner;if(R&&(R.status.frames=s.frames,R.status.resolution=[S.videoWidth,S.videoHeight],R.state.nativeFramePresented?.(s.native,s.frames),!R.status.ready&&s.serviceReady&&(R.scene!=="room"||s.calendarReady&&s.frames>=(s.calendarFrame||0)+4&&performance.now()-(s.calendarAt||0)>100)&&R.ackAt&&s.frames>=R.ackFrame+(R.warmed?4:8)&&performance.now()-R.ackAt>(R.warmed?160:650)&&s.native?.scene===R.scene)){R.warmed=!0,R.status.prewarmed=!0,R.status.ready=!0,R.status.engine=s.native.engine,R.status.readyAt=performance.now(),R.cover.hidden=!0,R.cover.style.display="none",R.layer.setAttribute("aria-busy","false");for(let _ of R.inputs||[])_.canvas.style.pointerEvents=_.events;R.state.nativeSurfaceChanged?.(!0)}a=S.requestVideoFrameCallback(C)};a=S.requestVideoFrameCallback(C)}let c=v=>{if(v){if(v.status.ready&&performance.now()-v.status.readyAt>1200&&s.native?.scene===v.scene){let S=t.querySelector("video");if(S?.videoWidth){let C=i.createElement("canvas");C.width=1280,C.height=720,C.getContext("2d").drawImage(S,0,0,1280,720),(v.poster||v.cover).style.backgroundImage='url("'+C.toDataURL("image/jpeg",.9)+'")',v.caption.hidden=!0}}v.status.ready=!1,v.ackAt=0,v.cover.hidden=!1,v.cover.style.display="",v.caption.hidden=!1,v.layer.setAttribute("aria-busy","true");for(let S of v.inputs||[])S.canvas.style.pointerEvents="none";v.state.nativeSurfaceChanged?.(!1)}};function h(){let v=[...s.surfaces].filter(x=>x.alive&&x.visible()),C=String(yt.homeClockState?.renderer||"").startsWith("Three.js")&&yt.homeClockState?.ready&&s.focused&&!yt.document.hidden?[...s.surfaces].filter(x=>x.alive&&x.scene!=="home"):[],R=v.at(-1)||C.filter(x=>!x.warmed).at(-1)||null;if(R===s.owner)return;s.controlAbort?.abort();let _=s.owner;c(_),s.owner=R,s.last="",s.claim=!0,s.native=null,R?(R.layer.prepend(t),l(!0),c(R),R.firstSeq=0,R.status.switchedAt=performance.now(),t.querySelector("video")?.play().catch(()=>{}),s.resize?.()):_&&fetch(e+"/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:s.id,clientSeq:++s.seq,active:!1})}).catch(()=>{})}async function u(v=!1){if(!(s.ensurePending||s.destroyed||!v&&performance.now()-(s.lastEnsure||-1/0)<4e3)){s.ensurePending=!0,s.lastEnsure=performance.now();try{let S=await fetch(new URL("/_runtime/"+(v?"refresh":"ensure"),yt.location.origin),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scene:s.owner?.scene||"room"}),signal:AbortSignal.timeout(3500)});if(!S.ok)throw Error("Runtime startup unavailable");s.runtime=await S.json();for(let C of s.surfaces)C.status.starting=!!s.runtime.starting,C.status.serviceReady=!!s.runtime.ready}catch(S){s.lastEnsureError=String(S);for(let C of s.surfaces)C.status.serviceReady=!1,C.status.startupError=String(S),C.status.ready||(C.caption.textContent="\u5B9E\u65F6\u753B\u9762\u5C1A\u672A\u8FDE\u63A5\uFF0C\u8BF7\u91CD\u8BD5")}finally{s.ensurePending=!1}}}s.ensureNative=u;async function d(){if(!(s.healthPending||!s.owner||!s.connected)){s.healthPending=!0;try{let v=await fetch(e+"/health",{signal:AbortSignal.timeout(1400)}).then(R=>R.json());s.lastHealth=performance.now();let S=s.owner;s.serviceReady=!!(v.streamers?.length&&v.native?.phase==="native viewport live"&&Date.now()/1e3-v.native.heartbeat<6);let C=!!v.runtime?.calendarReady;if(C&&!s.calendarReady&&(s.calendarFrame=s.frames,s.calendarAt=performance.now()),s.calendarReady=C,s.native=s.serviceReady?v.native:null,!s.serviceReady){S&&(c(S),S.status.serviceReady=!1),u();return}S&&(S.status.serviceReady=!0,S.status.calendarDate=v.runtime?.calendarDate,S.status.calendarReady=s.calendarReady),S&&v.native?.scene===S.scene&&v.native?.seq>=S.firstSeq&&S.firstSeq&&t.querySelector("video")?.readyState>=2&&(S.status.presentedCamera=v.native.camera,S.status.presentedTarget=v.native.target,S.status.appliedSeq=v.native.seq,S.ackAt||(S.ackAt=performance.now(),S.ackFrame=s.frames)),S&&v.native?.scene&&v.native.scene!==S.scene&&(c(S),s.last="")}catch(v){s.owner&&(s.owner.status.lastTransportError=String(v))}finally{s.healthPending=!1}}}async function p(){if(s.destroyed)return;s.focused=yt.document.hasFocus(),h();let v=s.owner;if(!v){s.idleAt||(s.idleAt=performance.now());let I=yt.document.hidden?1e3:3e3;(s.connected||s.connecting)&&performance.now()-s.idleAt>=I&&(s.idleReleased=!0,s.idleReleases=(s.idleReleases||0)+1,s.controlAbort?.abort(),s.connected=s.connecting=s.serviceReady=!1,s.last="",r.disconnect());return}if(s.idleAt=0,s.idleReleased=!1,!s.serviceReady&&!yt.document.hidden&&u(),!s.connected){performance.now()>s.retryAt&&(s.connecting=!0,s.connectingAt=performance.now(),s.retryAt=performance.now()+12e3,s.connections++,r.connect());return}if(l(),s.sending)return;let S=v.camera(),C=I=>I.map(D=>Math.round(D*1e5)/1e5),R={scene:v.scene,camera:C(S.position),target:C(S.target),fov:S.fov,verticalFov:!0,directCamera:S.directCamera??!1,roomTime:S.roomTime===void 0?void 0:Math.round(S.roomTime*2)/2,roomWork:S.roomWork,roomTV:S.roomTV,roomDirectVideo:S.roomDirectVideo??!1,roomProps:S.roomProps,night:S.night??!1,paused:S.paused??(!v.visible()&&!!v.warmed&&performance.now()-v.status.readyAt>1200),lamp:S.lamp??!0,homeParts:S.homeParts??[],homeKey:S.homeKey,homeWest:S.homeWest,active:!0,claim:s.claim,clientId:s.id,clientSeq:++s.seq};s.outputPaused=R.paused;let _=JSON.stringify({...R,clientSeq:0,claim:!1});if(_===s.last&&performance.now()-s.sentAt<1e3){performance.now()-s.lastHealth>(S.directCamera||v.status.appliedSeq<v.status.lastSeq?22:v.status.ready?180:80)&&d();return}s.sending=!0;let x=new AbortController;s.controlAbort=x;try{let I=await fetch(e+"/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(R),signal:AbortSignal.any([AbortSignal.timeout(1600),x.signal])}).then(V=>V.json());if(!I.ok)throw Error(I.code||"Camera update failed");if(v!==s.owner)return;if(I.owned===!1){v.status.blocked=!0,c(v),v.caption.textContent="\u70B9\u51FB\u753B\u9762\u7EE7\u7EED";return}v.status.lastTransportError&&(v.status.lastRecoveredAt=performance.now()),v.status.lastTransportError="",v.status.blocked=!1,v.status.connected=!0,v.status.sent++,v.status.lastSeq=I.seq,v.firstSeq||(v.firstSeq=I.seq),s.claim=!1,s.last=_,s.sentAt=performance.now(),performance.now()-s.lastHealth>(S.directCamera?22:50)&&d();let D=t.querySelector("video");D&&(!R.paused||!v.status.ready)&&D.paused&&D.play().catch(()=>{})}catch(I){if(v!==s.owner||x.signal.aborted)return;v.status.lastTransportError=String(I),v.status.lastTransportFailureAt=performance.now(),v.status.transientRetries++,!v.status.ready&&performance.now()-v.status.switchedAt>6e3&&(v.caption.textContent="\u6B63\u5728\u8FDE\u63A5\u5B9E\u65F6\u573A\u666F \xB7 \u70B9\u51FB\u91CD\u8BD5")}finally{s.controlAbort===x&&(s.controlAbort=null),s.sending=!1}}s.update=p,s.health=d,s.hide=c;let g=()=>{try{let v=r._webRtcController?.peerConnectionController?.peerConnection,S=0;for(let C of v?.getReceivers()??[]){if(C.track?.kind!=="video")continue;let R=C,_=/^(127\.0\.0\.1|localhost)$/.test(new URL(e).hostname);"jitterBufferTarget"in R&&(R.jitterBufferTarget=_?0:30,S++),"playoutDelayHint"in R&&(R.playoutDelayHint=_?0:.03,S++)}s.receiverPolicy={propertiesSet:S,localTargetMs:0}}catch(v){s.receiverPolicyError=String(v)}};r.addEventListener("videoInitialized",()=>{g(),l(),r.play()});let M=()=>{if(s.destroyed||!s.owner||!s.channelOpen)return;let v=Math.max(1280,Math.min(1920,Math.ceil(s.owner.host.clientWidth*yt.devicePixelRatio/32)*32)),S=v*9/16,C=t.querySelector("video");s.owner.status.displayResolution=[v,S],!(C?.videoWidth===v&&C?.videoHeight===S)&&r.emitCommand({"Resolution.Width":v,"Resolution.Height":S})};s.resize=M,r.addEventListener("dataChannelOpen",()=>{s.channelOpen=!0,M(),setTimeout(M,500)});let m=()=>{s.destroyed||(s.connected=!0,s.connecting=!1,s.connectedAt=performance.now(),s.retryAt=0,g(),l(),p())};r.addEventListener("playStream",m),r.addEventListener("webRtcConnected",m),r.addEventListener("webRtcDisconnected",()=>{s.connected=s.connecting=s.channelOpen=s.serviceReady=!1,s.retryAt=performance.now()+1200,s.claim=!0,c(s.owner),s.last=""}),s.focused=yt.document.hasFocus(),yt.addEventListener("focus",()=>{s.focused=yt.document.hasFocus(),s.claim=!0,p()}),yt.addEventListener("blur",()=>{s.focused=yt.document.hasFocus(),p()}),yt.addEventListener("pointerdown",()=>{s.owner?.status.blocked&&(s.claim=!0,s.last=""),p()},!0);let f=()=>{s.destroyed||(u(!0),c(s.owner),s.connected=s.connecting=s.serviceReady=!1,s.retryAt=performance.now()+400,s.claim=!0,s.last="",r.disconnect())};s.recover=f;let T=performance.now(),E=()=>{let v=performance.now(),S=v-T>2e3;if(T=v,!s.owner||s.destroyed)return;let C=s.owner.camera();if(S){s.lastFrameAt=v;return}(!s.owner.status.ready||v-s.lastFrameAt>1600)&&d(),s.connected&&s.owner.visible()&&!s.outputPaused&&!C.paused&&v-Math.max(s.lastFrameAt,s.connectedAt||v)>6e3&&(s.owner.status.stallRecoveries=(s.owner.status.stallRecoveries||0)+1,f())},b=()=>{clearInterval(s.timer),clearInterval(s.healthTimer),s.timer=setInterval(p,22),s.healthTimer=setInterval(E,200)};return b(),yt.addEventListener("pagehide",()=>{s.destroyed=!0,clearInterval(s.timer),clearInterval(s.healthTimer),s.controlAbort?.abort(),c(s.owner),s.owner=null,s.connected=s.serviceReady=!1,o&&a&&o.cancelVideoFrameCallback(a),a=0,navigator.sendBeacon(e+"/control",new Blob([JSON.stringify({clientId:s.id,clientSeq:++s.seq,active:!1})],{type:"text/plain"})),r.disconnect()}),yt.addEventListener("pageshow",v=>{!v.persisted&&!s.destroyed||(s.destroyed=!1,s.connected=s.connecting=s.serviceReady=!1,s.claim=!0,s.last="",s.retryAt=0,s.lastFrameAt=performance.now(),l(!0),b(),u(),p())}),s}async function ku(i,e,t,n){let r=mx(),s=document.createElement("div");s.className="ue-native-surface-v162",Object.assign(s.style,{position:"absolute",inset:"0",pointerEvents:"none",zIndex:"0",background:"#171a18",overflow:"hidden"}),i.prepend(s);let o=document.createElement("div");o.className="ue-native-cover-v171",Object.assign(o.style,{position:"absolute",inset:"0",zIndex:"25",pointerEvents:"auto",overflow:"hidden",background:"#171a18"}),s.append(o),s.setAttribute("aria-busy","true");let a=document.createElement("div");a.setAttribute("aria-hidden","true"),Object.assign(a.style,{position:"absolute",inset:"-12px",filter:"blur(9px) brightness(.5)",background:`#171a18 url("./assets/native-v171/${e}.jpg?v=32.171") center / cover no-repeat`}),o.append(a);let l=document.createElement("div");Object.assign(l.style,{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",display:"grid",gap:"18px",justifyItems:"center",textAlign:"center",color:"#eee7da",font:"14px/1.8 sans-serif"}),o.append(l);let c=document.createElement("span");c.className="ue-native-caption-v171",c.setAttribute("role","status"),c.textContent=e==="myth"?"\u6B63\u5728\u51C6\u5907\u6D77\u6E7E\u2026":e==="room"?"\u6B63\u5728\u51C6\u5907\u5DE5\u4F5C\u53F0\u2026":"\u6B63\u5728\u51C6\u5907\u5EAD\u9662\u2026",l.append(c);let h=document.createElement("button");h.type="button",h.textContent="\u70B9\u51FB\u8FDB\u5165",Object.assign(h.style,{padding:"9px 18px",background:"#d3c5a8",color:"#202821",border:"0",borderRadius:"5px",cursor:"pointer",font:"13px/1.5 sans-serif",pointerEvents:"auto"});let u=-1/0;h.addEventListener("click",()=>{let C=performance.now();if(!(C-u<1200)){if(u=C,r.connected&&C-r.lastFrameAt<1600||r.connecting&&C-r.connectingAt<4e3){r.claim=!0,r.last="",r.update();return}r.recover()}}),l.append(h);let d=Array.from(i.querySelectorAll("canvas,.directory-scene-input")).map(C=>({canvas:C,events:C.style.pointerEvents}));for(let C of d)C.canvas.style.pointerEvents="none";let p=n.nativeUE={version:171,ready:!1,scene:e,wholeViewport:!0,blocked:!1,transientRetries:0,lastTransportError:"",sent:0,errors:[],lastSeq:0,connected:!1,frames:0,resolution:[0,0],sharedTransport:!0,switchedAt:performance.now()},g=!0,M=!1,m=()=>{if(!g||!M||document.hidden||document.body.classList.contains("works-orbit-open")||document.body.classList.contains("standalone-archive-open")||document.body.classList.contains("directory-music-open")||document.body.classList.contains("directory-source-open")||document.body.classList.contains("portfolio-surface-suspended"))return!1;try{if(!r.focused)return!1;let C=window;for(;C!==yt;){let R=C.frameElement;if(!R||R.getClientRects().length===0)return!1;let _=R.getBoundingClientRect();if(_.bottom<=0||_.top>=C.parent.innerHeight||getComputedStyle(R).visibility==="hidden")return!1;C=C.parent}}catch{return!1}return t().enabled!==!1},f={host:i,layer:s,cover:o,poster:a,caption:c,inputs:d,scene:e,camera:t,state:n,status:p,alive:!0,visible:m,firstSeq:0,ackAt:0,ackFrame:0};r.surfaces.add(f);let T=new ResizeObserver(()=>{r.owner===f&&r.resize?.()});T.observe(i);let E=()=>{m()&&p.blocked&&(r.claim=!0,r.last="",r.update())};i.addEventListener("pointerdown",E,!0);let b=new IntersectionObserver(([C])=>{M=C.isIntersecting&&C.intersectionRatio>.45,r.update()},{threshold:[0,.45,.5,1]});b.observe(i);let v=new MutationObserver(()=>void r.update());v.observe(document.body,{attributes:!0,attributeFilter:["class"]});let S=()=>void r.update();return document.addEventListener("visibilitychange",S),n.nativeSurfaceChanged?.(!1),r.update(),{layer:s,update:r.update,async waitForView(){let C=t(),R=performance.now()+8e3;r.last="",await r.update();let _;for(;performance.now()<R;){await r.health();let D=r.native;if(D?.scene===e&&D.camera?.every((V,W)=>Math.abs(V-C.position[W])<.01)&&D.target?.every((V,W)=>Math.abs(V-C.target[W])<.01)){_=D;break}await new Promise(V=>setTimeout(V,40))}if(!_)throw Error("Native camera pose acknowledgement timed out");let x=r.frames,I=s.querySelector("video");for(I?.paused&&await I.play();performance.now()<R&&r.frames<x+2;)await new Promise(D=>setTimeout(D,20));return{scene:e,poseAcknowledged:!0,seq:_.seq,streamFramesAfterPose:r.frames-x,at:performance.now()}},suspend(){f.alive=!1,r.hide(f),r.update()},destroy(){g=!1,f.alive=!1,r.surfaces.delete(f),b.disconnect(),T.disconnect(),v.disconnect(),i.removeEventListener("pointerdown",E,!0),document.removeEventListener("visibilitychange",S),r.owner===f&&(r.owner=null,r.last=""),s.remove(),r.update()}}}var Pn=[{t:0,p:[-.45,1.25,5.8],g:[0,7.8,-1],f:68},{t:3.2,p:[-1.25,1.6,7.2],g:[-2.1,5.6,-1.1],f:62},{t:5.8,p:[-3.6,2,9.3],g:[-5.8,3.2,-3],f:58},{t:8.5,p:[3.5,1.85,8.8],g:[7.15,3.2,-1],f:56},{t:11.5,p:[1.3,4.2,10.8],g:[0,5.5,-.4],f:52},{t:16,p:[0,5.2,24],g:[0,4.2,-2],f:40}];async function hp(){let i=await fetch("./blender/home-camera-v32-84/camera-v84.json");if(!i.ok)throw new Error("Blender V32.84 camera source missing");if(Pn=(await i.json()).keys,Pn.length!==6||Pn.at(-1)?.t!==16)throw new Error("Invalid native camera track");return{source:"Blender V32.84 / camera-v84.json",keys:Pn.length,duration:16}}function up(i,e,t){let n=Pn.at(-1);n.p=t.position,n.g=t.target,n.f=jt.radToDeg(2*Math.atan(36/(2*t.lens*16/9)));let r=Math.max(0,Pn.findIndex((l,c)=>c<Pn.length-1&&e>=l.t&&e<Pn[c+1].t)),s=e>=16?n:Pn[r],o=e>=16?n:Pn[r+1],a=jt.clamp((e-s.t)/Math.max(.01,o.t-s.t),0,1);return a=a*a*(3-2*a),i.position.fromArray(s.p).lerp(new O().fromArray(o.p),a),i.lookAt(new O().fromArray(s.g).lerp(new O().fromArray(o.g),a)),i.fov=jt.lerp(s.f,o.f,a),i.updateProjectionMatrix(),e>=16?"fixed-wide":["tower-low-angle","tower-turn-left","west-bell-and-stone","cloister-turn-right","clock-and-figure","courtyard-reveal"][r]}var Ql=0;async function Bu(i,e=1.2){return i.dataset.researchEntry&&(window.dispatchEvent(new CustomEvent("v31:research-open",{detail:i.id})),i=i.closest(".research-board")??i),dp(()=>{let t=window.__v31Lenis;t?.resize?.(),t?.start?.(),t?t.scrollTo(i,{immediate:!0,force:!0}):window.scrollTo({top:i.getBoundingClientRect().top+scrollY,behavior:"instant"}),window.dispatchEvent(new CustomEvent("v31:chapter-arrived",{detail:i.id}))})}async function dp(i){let e=++Ql,t=matchMedia("(prefers-reduced-motion: reduce)").matches,n=document.getElementById("chapterJumpCover");n||(n=document.createElement("div"),n.id="chapterJumpCover",n.setAttribute("aria-hidden","true"),document.body.append(n)),n.hidden=!1,n.style.background="#0e1613",n.getAnimations().forEach(r=>r.cancel()),await n.animate([{opacity:0},{opacity:1}],{duration:t?0:140,fill:"forwards",easing:"ease-out"}).finished.catch(()=>{}),e===Ql&&(i(),await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r()))),e===Ql&&(await n.animate([{opacity:1},{opacity:0}],{duration:t?0:220,fill:"forwards",easing:"ease-out"}).finished.catch(()=>{}),e===Ql&&(n.hidden=!0)))}window.addEventListener("v31:chapter-jump",i=>{let e=document.getElementById(i.detail);e&&Bu(e)});window.addEventListener("v31:directory-open",i=>{let e=i.detail;dp(()=>{e.kind==="works"?window.openWorksOrbitArchive?.(e.source):window.dispatchEvent(new CustomEvent("v31:open-standalone",{detail:{target:e.kind}}))})});function fp(i,e,t){let n=[{name:"\u4E66\u9875\u4E0E\u4E16\u754C",code:"READING ROOM",point:[-12.7,1.65,-6.3],title:"\u5728\u4E66\u9875\u4E0E\u573A\u666F\u4E4B\u95F4",copy:"\u7535\u5F71\u624B\u7A3F\u3001\u6C34\u58A8\u6545\u4E8B\u4E0E\u4E09\u7EF4\u6D77\u6E7E\uFF0C\u4E09\u79CD\u8FDB\u5165\u5F71\u50CF\u7684\u65B9\u5F0F\u3002",links:[["\u8FDB\u5165\u4E66\u9875\u4E0E\u4E16\u754C","@reading"]]},{name:"\u5F71\u50CF \xB7 \u6863\u6848\u9986",code:"IMAGE ARCHIVE",point:[-7.35,.45,-2.6],title:"\u6CBF\u7740\u56FE\u50CF\uFF0C\u56DE\u5230\u4F5C\u54C1",copy:"\u8FD9\u91CC\u6536\u96C6\u6211\u7684\u5F71\u50CF\u4E0E\u89C6\u89C9\u5C1D\u8BD5\uFF0C\u4E5F\u7559\u4E0B\u5B83\u4EEC\u5F62\u6210\u7684\u7EBF\u7D22\u3002",links:[["\u5F71\u50CF\u4F5C\u54C1","imageChapters"],["\u63D0\u793A\u8BCD\u957F\u6210\u7535\u5F71","lifePurpose"]]},{name:"\u795E\u8BDD \xB7 \u8FDC\u822A",code:"MYTH & VOYAGE",point:[-4.75,.2,-2.35],title:"\u4ECE\u753B\u5E03\u8D70\u5411\u6D77\u9762",copy:"\u8FDB\u5165\u900F\u7EB3\u7684\u795E\u8BDD\u4E16\u754C\uFF0C\u6362\u4E00\u4E2A\u89D2\u5EA6\u89C2\u770B\u53E4\u8001\u7684\u6545\u4E8B\u3002",links:[["\u4E09\u7EF4\u795E\u8BDD","odysseyIntroduction"]]},{name:"\u9020\u5883\u624B\u8BB0 \xB7 \u5165\u53E3",code:"THE LIVING ARCHIVE",point:[0,-.05,.1],title:"\u9009\u62E9\u4E00\u6761\u8DEF\uFF0C\u6162\u6162\u770B",copy:"\u5F71\u50CF\u3001\u7C92\u5B50\u3001\u9605\u8BFB\u548C\u5B66\u4E60\uFF0C\u5728\u8FD9\u91CC\u76F8\u9047\u3002",links:[["\u5C55\u89C8\u76EE\u5F55","@index"],["\u7C92\u5B50\u4E0E\u7269\u8D28","sandNarrative"]]},{name:"\u5B66\u4E60 \xB7 \u5149\u4E4B\u56DE\u5ECA",code:"LEARNING CLOISTER",point:[7.85,.16,.24],title:"\u6CBF\u7740\u597D\u5947\u5FC3\u7EE7\u7EED\u5B66\u4E60",copy:"\u628A\u770B\u89C1\u7684\u4E1C\u897F\u8BB0\u4E0B\u6765\uFF0C\u4E5F\u7ED9\u65B0\u7684\u95EE\u9898\u7559\u4E00\u4E2A\u4F4D\u7F6E\u3002",links:[["\u5B66\u4E60\u672D\u8BB0","@learning"]]}],r=document.createElement("nav");r.className="courtyard-wayfinding",r.setAttribute("aria-label","\u5EFA\u7B51\u4E2D\u7684\u5C55\u89C8\u5165\u53E3"),r.hidden=!0,i.append(r);let s=document.createElement("p");s.className="courtyard-hint",s.innerHTML="<span>THE LIVING ARCHIVE</span> \u6CBF\u7740\u5EFA\u7B51\uFF0C\u8FDB\u5165\u4F5C\u54C1",r.append(s);let o=document.createElement("aside");o.className="courtyard-card",o.hidden=!0,o.setAttribute("aria-label","\u5C55\u89C8\u5165\u53E3"),r.append(o);let a=-1,l=0,c=0,h=0,u=matchMedia("(prefers-reduced-motion: reduce)").matches,d=()=>{if(a<0)return;a=-1,clearTimeout(l),clearTimeout(c);let E=++h;M.forEach(v=>v.setAttribute("aria-expanded","false")),o.classList.remove("is-open"),o.getAnimations().forEach(v=>v.cancel()),o.animate([{opacity:1,transform:"translateY(0) rotateX(0)"},{opacity:0,transform:"translateY(10px) rotateX(-4deg)"}],{duration:u?0:180,easing:"ease-in",fill:"forwards"}).finished.then(()=>{E===h&&(o.hidden=!0)}).catch(()=>{})};function p(E){if(d(),E==="@reading"||E==="@learning"){try{sessionStorage.setItem("brain-universe-return-scroll",String(scrollY))}catch{}let v=E==="@reading"?"./reading.html?v=32.143":"./learning.html?v=32.143";window.portfolioNavigate?window.portfolioNavigate(v):location.href=v;return}if(E==="@index"){document.getElementById("indexTrigger")?.click();return}let b=document.getElementById(E);b&&Bu(b,1.3)}function g(E){if(clearTimeout(l),clearTimeout(c),E===a&&!o.hidden)return;let b=++h;a=E;let v=n[E];o.getAnimations().forEach(z=>z.cancel()),o.replaceChildren();let S=document.createElement("img");S.className="courtyard-card-image",S.alt="",S.setAttribute("aria-hidden","true");let C=document.createElement("canvas");C.width=560,C.height=216;let R=C.getContext("2d"),_=i.querySelector("video"),x=_&&_.videoWidth?_:e,I=x instanceof HTMLVideoElement?x.videoWidth:e.width,D=x instanceof HTMLVideoElement?x.videoHeight:e.height;if(R){let z=new O(...v.point);z.y+=E===3?3.5:1.5,z.project(t);let oe=I*.25,de=oe*216/560,Ee=(z.x+1)*I*.5,Be=(1-z.y)*D*.5;R.drawImage(x,Math.max(0,Math.min(I-oe,Ee-oe/2)),Math.max(0,Math.min(D-de,Be-de/2)),oe,de,0,0,560,216),S.src=C.toDataURL("image/jpeg",.85),o.append(S)}let V=document.createElement("div");V.className="courtyard-card-content",o.append(V);let W=document.createElement("small");W.textContent=String(E+1).padStart(2,"0")+" / "+v.code;let Z=document.createElement("h3");Z.textContent=v.title;let K=document.createElement("p");K.textContent=v.copy,V.append(W,Z,K);for(let[z,oe]of v.links){let de=document.createElement("button");de.type="button";let Ee=document.createElement("span");Ee.textContent=z;let Be=document.createElement("i");Be.textContent="\u2197",Be.setAttribute("aria-hidden","true"),de.append(Ee,Be),de.addEventListener("click",()=>p(oe)),V.append(de)}let te=document.createElement("button");te.type="button",te.className="courtyard-card-close",te.setAttribute("aria-label","\u6536\u8D77\u5165\u53E3\u5361\u7247"),te.textContent="\u6536\u8D77",te.addEventListener("click",d),V.append(te),o.hidden=!1,o.classList.add("is-open"),M.forEach((z,oe)=>z.setAttribute("aria-expanded",String(oe===E))),m(),o.animate([{opacity:0,transform:"translateY(42px) rotateX(-18deg) scale(.86)",filter:"blur(3px)"},{opacity:1,transform:"translateY(-5px) rotateX(2deg) scale(1.025)",filter:"blur(0px)",offset:.7},{opacity:1,transform:"translateY(0) rotateX(0) scale(1)",filter:"blur(0px)"}],{duration:u?0:620,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"}),Array.from(V.children).forEach((z,oe)=>z.animate([{opacity:0,transform:"translateY(6px)"},{opacity:1,transform:"translateY(0)"}],{duration:u?0:300,delay:u?0:70+oe*35,fill:"both",easing:"ease-out"}))}let M=n.map((E,b)=>{let v=document.createElement("button");return v.type="button",v.className="courtyard-place",v.setAttribute("aria-label",E.name+"\uFF1A\u6253\u5F00\u5C55\u89C8\u5165\u53E3"),v.setAttribute("aria-expanded","false"),v.innerHTML='<i aria-hidden="true" data-symbol="'+["\u25A4","\u25A7","\u2248","\u25F7","\u2301"][b]+'"></i><span>'+E.name+"</span>",v.addEventListener("pointerenter",S=>{S.pointerType==="mouse"&&(clearTimeout(l),c=window.setTimeout(()=>g(b),170))}),v.addEventListener("pointerleave",()=>{clearTimeout(c),l=window.setTimeout(d,650)}),v.addEventListener("focus",()=>g(b)),v.addEventListener("click",S=>{S.stopPropagation(),g(b)}),v.addEventListener("dblclick",S=>S.stopPropagation()),r.append(v),v});o.addEventListener("pointerenter",()=>clearTimeout(l)),o.addEventListener("pointerleave",()=>{l=window.setTimeout(d,650)}),r.addEventListener("keydown",E=>{if(E.code==="Space"&&E.stopPropagation(),E.key==="Escape"){let b=a;b>=0&&M[b].focus(),d(),E.stopPropagation()}}),document.addEventListener("pointerdown",E=>{a>=0&&!r.contains(E.target)&&d()});function m(){if(a<0)return;let E=M[a],b=parseFloat(E.style.left),v=parseFloat(E.style.top),S=Math.min(310,i.clientWidth-32);o.style.width=S+"px",o.style.left=Math.max(16,Math.min(i.clientWidth-S-16,b-S*.5))+"px",o.style.top=Math.max(160,Math.min(i.clientHeight-o.offsetHeight-24,v-o.offsetHeight-22))+"px"}let f=new O,T="";return{update:E=>{E||d()},places:n.map(E=>({name:E.name,point:E.point,links:E.links})),open:g,close:d}}var gx;function Vu(i,e){let t=gx??=new ua({alpha:!1,antialias:!0});t.setPixelRatio(Math.min(devicePixelRatio,1.5)),t.setSize(308,218),t.setClearColor(726034),t.outputColorSpace=qt,t.toneMapping=Mo,t.toneMappingExposure=1.1,t.shadowMap.enabled=!0,i.append(t.domElement),t.domElement.setAttribute("aria-label",e==="theatre"?"\u62D6\u52A8\u89C2\u770B\u7ACB\u4F53\u900F\u89C6\u5267\u573A":"\u79FB\u52A8\u6ED1\u6761\uFF0C\u8BA9\u5149\u7A7F\u8FC7\u539A\u73BB\u7483\u4E0E\u94DC\u6846");let n=new Vr,r=new It(36,308/218,.1,50),s=new kn;n.add(s);let o=new Hn({color:11899216,metalness:.85,roughness:.34}),a=new Hn({color:2696990,roughness:.74}),l=new Hn({color:2702906,roughness:.56}),c=new Hn({color:14461796,metalness:.55,roughness:.3}),h=(_,x,I,D,V,W,Z,K=s)=>{let te=new Ut(new ri(D,V,W),Z);return te.position.set(_,x,I),te.castShadow=te.receiveShadow=!0,K.add(te),te},u=h(0,-.9,-.1,4,.13,3.4,a),d=h(0,1.45,-1,3.3,.1,.13,o),p=new Zr(16763001,80,12,.65,.7,2);p.position.set(-2,3,2),p.target.position.set(0,0,-.7),p.castShadow=!0,p.shadow.mapSize.set(512,512),n.add(p,p.target,new Jr(10207165,1511945,.95));let g=.5,M=!1,m=0,f=0,T=0,E=_=>{M=!0,m=_.clientX,t.domElement.setPointerCapture(_.pointerId)},b=_=>{M&&(f=jt.clamp(f+(_.clientX-m)*.01,-.8,.8),m=_.clientX)},v=()=>{M=!1};if(e==="theatre"){for(let x=0;x<6;x++){let I=1-x*.1,D=1.1-x*.58;for(let W of[-1.45,1.45])h(W*I,.24,D,.1,2.15*I,.13,o);h(0,1.28*I,D,2.95*I,.1,.13,o);let V=new Ut(new qr(.66*I,.018,8,64),x%2?c:o);V.position.set(.22*x/6,.12,D),s.add(V)}let _=new Ut(new Gr(.22,2),c);_.position.set(0,.14,-1.6),s.add(_),h(0,-.17,-2.3,2.5,1.7,.12,l),r.position.set(.1,1,6.7),t.domElement.addEventListener("pointerdown",E),t.domElement.addEventListener("pointermove",b),t.domElement.addEventListener("pointerup",v),t.domElement.addEventListener("pointercancel",v)}else{let _=new Yr({color:9747116,metalness:0,roughness:.12,transmission:.88,thickness:.18,ior:1.48,transparent:!0,opacity:.72,envMapIntensity:1.2,clearcoat:1,side:cn});for(let I of[-.96,0,.96]){h(I,.15,0,.07,2.4,.2,o);for(let D=0;D<3;D++){let V=h(I+.43,-.58+D*.72,-.025,.79,.64,.16,_);V.rotation.y=D%2?-.13:.13}}for(let I of[-.96,-.25,.46,1.18])h(.43,I,0,2.9,.055,.2,o);let x=new Ut(new Wr(.6,3.1,32,1,!0),new wi({color:16762743,transparent:!0,opacity:.065,depthWrite:!1,side:cn,blending:Qr}));x.position.set(.25,.15,.45),x.rotation.z=-.62,s.add(x),r.position.set(3.9,1.7,5.5)}r.lookAt(.15,.18,-.3);let S=0,C=0,R=()=>{S=requestAnimationFrame(R),!(document.hidden||C++%2)&&(T+=(f-T)*.12,e==="theatre"?s.rotation.y=T:(p.position.x=-3+g*6,p.position.z=2.5,p.color.setHSL(.09-g*.025,.72,.75),s.rotation.y=(g-.5)*.18),t.render(n,r))};return R(),{set:_=>g=_,dispose:()=>{cancelAnimationFrame(S),t.domElement.removeEventListener("pointerdown",E),t.domElement.removeEventListener("pointermove",b),t.domElement.removeEventListener("pointerup",v),t.domElement.removeEventListener("pointercancel",v);let _=new Set,x=new Set;n.traverse(I=>{if(I instanceof Ut){_.add(I.geometry);for(let D of Array.isArray(I.material)?I.material:[I.material])x.add(D)}}),_.forEach(I=>I.dispose()),x.forEach(I=>I.dispose()),p.dispose(),t.renderLists.dispose(),t.domElement.remove()}}}function pp(i,e,t){let n=document.createElement("div");n.className="home-discoveries",n.hidden=!0,i.append(n);let r=[{id:"manuscript",label:"\u6253\u5F00\u5EFA\u7B51\u91CC\u7684\u900F\u89C6\u5267\u573A",p:new O(-12.7,1.45,-6.3)},{id:"music",label:"\u6253\u5F00\u949F\u4EAD\u4E0B\u7684\u4E09\u97F3\u4E50\u5323",p:new O(-4.75,1.15,-2.8)},{id:"light",label:"\u6253\u5F00\u56DE\u5ECA\u91CC\u7684\u5149\u4E4B\u7A97",p:new O(7.8,1.05,.24)},{id:"creation",label:"\u67E5\u770B\u4E3B\u9875\u7684\u6A21\u578B\u3001\u6750\u8D28\u4E0E\u5149\u7EBF\u6784\u5EFA",p:new O(0,3.7,.8)}],s=document.createElement("aside");s.className="home-discovery-panel",s.hidden=!0,s.setAttribute("role","dialog"),n.append(s);let o={opened:"",opens:0,notes:0,light:.5,positions:[]};window.homeDiscoveryState=o;let a=-1,l,c,h=matchMedia("(prefers-reduced-motion: reduce)").matches,u=()=>{a<0||(c?.dispose(),c=void 0,s.hidden=!0,a=-1,o.opened="",g.forEach(T=>T.setAttribute("aria-expanded","false")),l?.suspend())},d=(T,E)=>{l??=new AudioContext,l.resume();let b=l.createOscillator(),v=l.createGain(),S=l.currentTime;b.type="sine",b.frequency.value=[261.63,329.63,392][T],v.gain.setValueAtTime(0,S),v.gain.linearRampToValueAtTime(.07,S+.025),v.gain.exponentialRampToValueAtTime(1e-4,S+1.2),b.connect(v),v.connect(l.destination),b.start(S),b.stop(S+1.25),b.onended=()=>{b.disconnect(),v.disconnect()},o.notes++,E.animate([{transform:"translateY(0)"},{transform:"translateY(4px)"},{transform:"translateY(0)"}],{duration:320})};function p(T){if(T===3){u(),o.opens++,window.dispatchEvent(new CustomEvent("v91:home-creation-open"));return}if(a===T){u();return}u(),a=T,o.opened=r[T].id,o.opens++,g.forEach((S,C)=>S.setAttribute("aria-expanded",String(T===C))),s.replaceChildren();let E=document.createElement("button");E.className="discovery-close",E.textContent="\xD7",E.setAttribute("aria-label","\u6536\u8D77\u5EFA\u7B51\u91CC\u7684\u53D1\u73B0"),E.onclick=u,s.append(E);let b=document.createElement("small");b.textContent=["01 / A LITTLE PERSPECTIVE","02 / THREE NOTES","03 / A WINDOW OF LIGHT"][T],s.append(b);let v=document.createElement("h3");if(v.textContent=["\u6362\u4E2A\u89D2\u5EA6\uFF0C\u4E16\u754C\u5C31\u53D8\u4E86","\u7559\u4E00\u5C0F\u6BB5\u58F0\u97F3\u5728\u8FD9\u91CC","\u8BA9\u5149\uFF0C\u6162\u6162\u8D70\u8FC7"][T],s.append(v),T===0){let S=document.createElement("div");S.className="discovery-object",s.append(S),c=Vu(S,"theatre");let C=document.createElement("p");C.textContent="\u62D6\u52A8\u5C0F\u5267\u573A\u3002\u516D\u5C42\u94DC\u6846\uFF0C\u4F1A\u5728\u4E00\u4E2A\u89D2\u5EA6\u5408\u6210\u4E00\u53EA\u773C\u775B\u3002",s.append(C)}if(T===1){let S=document.createElement("div");S.className="discovery-music",["C","E","G"].forEach((R,_)=>{let x=document.createElement("button");x.textContent=R,x.setAttribute("aria-label","\u6F14\u594F\u97F3\u7B26 "+R),x.onclick=()=>d(_,x),S.append(x)}),s.append(S);let C=document.createElement("p");C.textContent="\u70B9\u4E00\u4E0B\u94DC\u7247\uFF0C\u542C\u4E09\u58F0\u8F7B\u54CD\u3002",s.append(C)}if(T===2){let S=document.createElement("div");S.className="discovery-object",s.append(S),c=Vu(S,"glass");let C=document.createElement("input");C.type="range",C.min="0",C.max="100",C.value="50",C.setAttribute("aria-label","\u79FB\u52A8\u5149\u4E4B\u7A97"),C.oninput=()=>{o.light=+C.value/100,c?.set(o.light)},s.append(C);let R=document.createElement("p");R.textContent="\u79FB\u52A8\u5149\u6E90\uFF0C\u770B\u539A\u73BB\u7483\u3001\u94DC\u6846\u548C\u5B83\u4EEC\u7684\u5F71\u5B50\u4E00\u8D77\u53D8\u5316\u3002",s.append(R)}s.hidden=!1,M(),s.animate([{opacity:0,transform:"translateY(12px) scale(.97)"},{opacity:1,transform:"translateY(-2px) scale(1.005)",offset:.76},{opacity:1,transform:"translateY(0) scale(1)"}],{duration:h?0:460,easing:"cubic-bezier(.16,1,.3,1)"})}let g=r.map((T,E)=>{let b=document.createElement("button");return b.className="home-secret-hit",b.type="button",b.dataset.discovery=T.id,b.setAttribute("aria-label",T.label),b.setAttribute("aria-expanded","false"),b.innerHTML='<i aria-hidden="true"></i>',b.onclick=v=>{v.stopPropagation(),p(E)},n.append(b),b});n.addEventListener("pointerdown",T=>T.stopPropagation()),n.addEventListener("dblclick",T=>T.stopPropagation()),n.addEventListener("keydown",T=>{T.key==="Escape"&&u(),T.stopPropagation()}),document.addEventListener("keydown",T=>{T.key==="Escape"&&a>=0&&u()}),document.addEventListener("pointerdown",T=>{n.contains(T.target)||u()}),window.addEventListener("scroll",u,{passive:!0});function M(){if(a<0)return;let T=g[a],E=parseFloat(T.style.left),b=parseFloat(T.style.top),v=340;s.style.left=Math.max(28,Math.min(i.clientWidth-v-28,E+(E>i.clientWidth*.6?-v-22:34)))+"px",s.style.top=Math.max(160,Math.min(i.clientHeight-s.offsetHeight-28,b-s.offsetHeight*.65))+"px"}let m=new O,f="";for(let T of["pageshow","resize","portfolio:surface-return"])window.addEventListener(T,()=>{f=""});return{update:T=>{if(n.hidden=!T,!T){u();return}let E=e.getBoundingClientRect(),b=i.getBoundingClientRect(),v=E.width+","+E.height+","+Array.from(t.matrixWorld.elements).map(S=>S.toFixed(4)).join(",");v!==f&&(f=v,o.positions=r.map((S,C)=>{let R=m.copy(S.p).project(t),_=E.left-b.left+(R.x+1)*E.width/2,x=E.top-b.top+(1-R.y)*E.height/2;g[C].style.left=_.toFixed(2)+"px",g[C].style.top=x.toFixed(2)+"px";let I=Math.abs(R.x)>1||Math.abs(R.y)>1;return g[C].hidden!==I&&(g[C].hidden=I),{id:S.id,x:_+b.left,y:x+b.top}}),a>=0&&M())}}}function zu(i){return i.x<-6.3?(i.x=-7.35+(i.x+8.1)*.91,i.y*=.94,i.z-=.36):i.x>4.35&&(i.x=4.35+(i.x-4.35)*.89,i.y*=.95,i.z-=.42),i}var Wt=document.querySelector(".home-rendered-architecture");Wt&&(async()=>{let i=window,e=performance.now(),t=document.getElementById("homeArchitectureVideo");t&&(t.pause(),t.preload="none",t.hidden=!0);let n=document.createElement("canvas");n.className="home-live-world",n.style.opacity="0",n.setAttribute("aria-hidden","true"),Wt.append(n),Wt.style.backgroundImage='url("./assets/native-v167/home.jpg?v=32.168")',Wt.style.backgroundSize="cover",Wt.style.backgroundPosition="center";let r=new It(28.6,16/9,.5,110),s=fp(Wt,n,r),o=pp(Wt,n,r),a=i.homeClockState={version:165,ready:!1,renderer:"Unreal Engine 5.8.4",browserRenderer:"transform rig / no WebGL context",browserMeshCount:0,elapsed:0,interactions:0,renderFrames:0,figureTravel:[0,0],figureStrokes:[0,0],figureTarget:-1,dialAngles:[0,0],angles:[0,0,0],westOn:!1,bellAngle:0,camera:[0,0,0],scenePaused:!1},[l,c]=await Promise.all([fetch("./assets/home/native-rig-v165.json").then(H=>{if(!H.ok)throw Error("Native home rig unavailable");return H.json()}),fetch("./blender/reference-architecture-v16/world-track.json").then(H=>H.json()),hp()]),h=l.nodes.map(H=>{let ie=new Ot;return ie.name=H.name,ie.position.fromArray(H.p),ie.quaternion.fromArray(H.q),ie.scale.fromArray(H.s),ie});l.nodes.forEach((H,ie)=>{H.parent>=0&&h[H.parent].add(h[ie])});let u=new Map(l.aliases.map(([H,ie])=>[H,h[ie]])),d=l.anchors.map(H=>({id:H.id,object:h[H.node],inverse:new xt().fromArray(H.inverse)})),p=H=>[...u].find(([ie])=>H.test(ie))?.[1],g=[...u].filter(([H])=>/upper automaton [01]$|hinged blue apostle shutter/.test(H)),M=new O(0,0,-1),m=new on,f=[0,0],T=[0,0],E=a.figureTravel,b=a.figureStrokes,v=0,S=16,C=!1,R=!1,_=0,x=0,I=-1,D=-1,V=-1,W=-1,Z=0,K=-1,te=document.body.dataset.openingComplete==="true"||document.body.dataset.returnedFromChild==="true",z=()=>{let H=Wt.querySelector("video");if(!H||!H.videoWidth)throw Error("Native home frame unavailable");let ie=document.createElement("canvas");return ie.width=H.videoWidth,ie.height=H.videoHeight,ie.getContext("2d").drawImage(H,0,0),ie.toDataURL("image/jpeg",.95)};Object.assign(a,{capture:z,captureDisplay:z,prepareDisplayCapture:async()=>z(),renderIntroPose:H=>{S=H,oe(0)},project:H=>{let ie=H==="upper"?new O(-.15,5.45,-.1):H==="lower"?new O(-.15,1.77,-.1):H==="knights"||H==="knight-0"?new O(-.84,7.52,-.2):H==="knight-1"?new O(.54,7.52,-.2):H==="bell"?new O(-4.75,4.38,-2.8):zu(new O(-8.1,2.97,-2.1));ie.project(r);let pe=n.getBoundingClientRect();return[pe.left+(ie.x+1)*pe.width/2,pe.top+(1-ie.y)*pe.height/2]},poses:()=>[...u].filter(([H])=>/automaton|shutter|travelling archivist|temple hanging bell/.test(H)).map(([H,ie])=>({name:H,p:ie.position.toArray(),q:ie.quaternion.toArray()}))}),Object.defineProperty(window,"homeArchitectureState",{configurable:!0,get:()=>({started:document.body.dataset.openingComplete==="true",formed:!0,paused:C,time:v,duration:16,cameraLocked:S>=16,loopMode:"intro-once-then-live-wide"})});function oe(H){let ie=c.frames[Math.floor(v%16*24)%384],pe=c.frames[(Math.floor(v%16*24)+1)%384],st=v*24%1;for(let[A,y]of Object.entries(ie.groups)){let U=u.get(A),Y=pe.groups[A];!U||!Y||(U.position.fromArray(y.p).lerp(new O().fromArray(Y.p),st),zu(U.position),U.quaternion.fromArray(y.q).slerp(m.fromArray(Y.q),st),U.scale.fromArray(y.s),y.p[0]<-6.3?U.scale.multiplyScalar(.94):y.p[0]>4.35&&U.scale.multiplyScalar(.95))}a.shot=up(r,S,c.camera.frames[0]),r.updateMatrixWorld(!0),a.cameraLocked=S>=16;let Me=p(/LIVE.*calendar.*rotor/),He=p(/LIVE.*astronomical.*rotor/);for(let[A,y]of[He,Me].entries())if(y){T[A]=jt.damp(T[A],V===A?.24:0,6,H),f[A]+=T[A]*H;let U=v*(A===0?.014:-.019)+f[A];y.quaternion.setFromAxisAngle(M,U),a.dialAngles[A]=U}for(let[A,y]of["hour","minute","seconds"].entries()){let U=p(new RegExp("live.*"+y+".*hand"));if(U){let Y=([36630,630,30][A]+v)/[43200,3600,60][A]*Math.PI*2;U.quaternion.setFromAxisAngle(M,Y),a.angles[A]=Y}}for(let A=0;A<2;A++){E[A]=jt.clamp(E[A]+(I===A?H/2.2:-H/1.7),0,1);let y=E[A]*7,U=Math.floor(y),Y=y-U;b[A]=Math.min(1,(U+jt.smoothstep(Y,.14,.87))/7)}for(let[A,y]of g){let U=/upper automaton ([01])$/.exec(A);if(U){let Y=+U[1],ee=c.frames[0].groups[A];y.position.z=jt.lerp(ee.p[2],.34,jt.smoothstep(b[Y],.22,1))}if(/hinged blue apostle shutter/.test(A)){let Y=/\.(\d+)$/.exec(A),ee=Y?+Y[1]:0,J=ee>=2?1:0,Re=c.frames[0].groups[A];y.quaternion.fromArray(Re.q).multiply(new on().setFromAxisAngle(new O(0,1,0),(ee%2?-1:1)*1.65*jt.smoothstep(b[J],0,.36)))}}let Et=Math.max(1,Math.ceil(H*120)),vt=H/Et;for(let A=0;A<Et;A++)x+=(-_*20-x*3.8)*vt,_+=x*vt;p(/temple hanging bell/)?.rotateZ(_),Object.assign(a,{elapsed:v,camera:r.position.toArray(),heldFigures:I>=0,figureTarget:I,westOn:R,bellAngle:_,scenePaused:C}),a.renderFrames++,s.update(S>=16),o.update(S>=16)}function de(){let H=Math.max(Wt.clientWidth/1600,Wt.clientHeight/900);n.width=1600,n.height=900,Object.assign(n.style,{width:1600*H+"px",height:900*H+"px",left:(Wt.clientWidth-1600*H)/2+"px",top:(Wt.clientHeight-900*H)/2+"px"});let ie=a.nativeController?.layer;ie&&Object.assign(ie.style,{inset:"auto",width:n.style.width,height:n.style.height,left:n.style.left,top:n.style.top})}new ResizeObserver(de).observe(Wt),de(),oe(0),a.ready=!0,a.loadMilliseconds=performance.now()-e,a.nativeSurfaceChanged=H=>{H&&i.portfolioBoot?.complete("home")};let Ee=()=>d.map(H=>{H.object.updateWorldMatrix(!0,!1);let ie=H.object.matrixWorld.clone().multiply(H.inverse),pe=new O,st=new on,Me=new O;return ie.decompose(pe,st,Me),{id:H.id,p:pe.toArray(),q:st.toArray(),s:Me.toArray()}});a.nativeController=await ku(Wt,"home",()=>({position:r.position.toArray(),target:new O(0,0,-1).applyQuaternion(r.quaternion).add(r.position).toArray(),fov:r.fov,homeParts:Ee(),homeKey:[-8,9,6],homeWest:R,paused:C||document.body.classList.contains("v31-index-open")||!(document.body.dataset.openingComplete==="true"||i.homeDesignedIntroState?.preparing),enabled:te&&scrollY<innerHeight*.85&&!document.body.classList.contains("portfolio-portal-open")}),a),de();let Be=()=>{te||(te=!0,S=i.homeDesignedIntroState?.renderedMaster?16:0,oe(0),a.nativeController.update(),i.homeDesignedIntroState?.prepareForOpening?.().catch(H=>{a.preparationError=String(H)}))},at=setInterval(()=>{let H=document.querySelector(".prelude-opening-video");H&&H.currentTime>=17&&(clearInterval(at),Be())},100);addEventListener("v162:prepare-home-handoff",Be),addEventListener("v31:opening-complete",()=>{te=!0,clearInterval(at),a.nativeController.update()},{once:!0});let rt=new jr,et=new Zt(new O(0,0,1),.1),q=new O;function ne(H){let ie=n.getBoundingClientRect();if(rt.setFromCamera(new Ye((H.clientX-ie.left)/ie.width*2-1,1-(H.clientY-ie.top)/ie.height*2),r),!rt.ray.intersectPlane(et,q))return"";if(Math.hypot(q.x+.15,q.y-5.45)<1.84)return"upper";if(Math.hypot(q.x+.15,q.y-1.77)<1.36)return"lower";if(q.y>7.14&&q.y<8.04){if(Math.abs(q.x+.84)<.29)return"knight-0";if(Math.abs(q.x-.54)<.29)return"knight-1"}return rt.ray.intersectPlane(new Zt(new O(0,0,1),2.8),q),Math.abs(q.x+4.75)<.48&&Math.abs(q.y-4.4)<.7?"bell":(rt.ray.intersectPlane(new Zt(new O(0,0,1),2.46),q),Math.abs(q.x+7.35)<.48&&q.y>2.25&&q.y<3.58?"west":"")}n.addEventListener("pointerdown",H=>{if(H.button!==0||S<16)return;let ie=ne(H);if(ie){if(H.stopPropagation(),a.interactions++,ie.startsWith("knight-")){let pe=+ie.slice(-1);H.pointerType==="mouse"?I=pe:(D=D===pe?-1:pe,I=D);return}K=H.pointerId,n.setPointerCapture(H.pointerId),ie==="bell"?x+=2.4:ie==="west"?R=!R:(W=ie==="upper"?0:1,Z=Math.atan2(q.x+.15,q.y-(W===0?5.45:1.77)))}}),n.addEventListener("pointermove",H=>{if(S<16)return;let ie=ne(H);if(V=ie==="upper"?0:ie==="lower"?1:-1,n.style.cursor=W>=0?"grabbing":V>=0?"grab":ie?"pointer":"",H.pointerType==="mouse"&&(I=ie.startsWith("knight-")?+ie.slice(-1):-1),W>=0&&H.pointerId===K){rt.ray.intersectPlane(et,q);let pe=Math.atan2(q.x+.15,q.y-(W===0?5.45:1.77));f[W]+=Math.atan2(Math.sin(pe-Z),Math.cos(pe-Z)),Z=pe,H.stopPropagation()}});let Se=H=>{K===H.pointerId&&(W=-1,K=-1,n.hasPointerCapture(H.pointerId)&&n.releasePointerCapture(H.pointerId))};n.addEventListener("pointerup",Se),n.addEventListener("pointercancel",H=>{Se(H),I=D=-1}),n.addEventListener("lostpointercapture",Se),n.addEventListener("pointerleave",()=>{V=-1,I=D}),Wt.addEventListener("keydown",H=>{H.code==="Space"&&(H.preventDefault(),C=!C),H.code==="Home"&&(H.preventDefault(),S=16,C=!1)});let Fe=0,Ae=!1,qe=!1,Ct=performance.now();function P(H){if(Fe=0,!qe)return;let ie=Math.min(.05,Math.max(0,(H-Ct)/1e3));Ct=H,C||(v+=ie),S=i.homeDesignedIntroState?.renderedMaster?16:i.homeDesignedIntroState?.active?Math.min(16,i.homeDesignedIntroState.frame/30):i.homeDesignedIntroState?.preparing?0:16,oe(C?0:ie),Fe=requestAnimationFrame(P)}function it(){qe=Ae&&!document.hidden&&document.hasFocus()&&(document.body.dataset.openingComplete==="true"||!!i.homeDesignedIntroState?.preparing)&&!["portfolio-portal-open","standalone-archive-open","works-orbit-open"].some(H=>document.body.classList.contains(H)),qe&&!Fe?(Ct=performance.now(),Fe=requestAnimationFrame(P)):qe||(cancelAnimationFrame(Fe),Fe=0)}new IntersectionObserver(([H])=>{Ae=H.isIntersecting&&H.intersectionRatio>.1,it()},{threshold:[0,.1,.5,1]}).observe(Wt),new MutationObserver(it).observe(document.body,{attributes:!0,attributeFilter:["class","data-opening-complete"]}),addEventListener("focus",it),addEventListener("blur",it),document.addEventListener("visibilitychange",it),addEventListener("v31:opening-complete",it),addEventListener("portfolio:surface-return",()=>{S=16,C=!1,oe(0)}),addEventListener("v85:home-intro-finished",()=>{S=16,C=!1,oe(0)})})().catch(i=>{console.error("Native homepage controls failed",i),window.portfolioBoot?.fail("home",i)});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
//# sourceMappingURL=home-native-v165.js.map
