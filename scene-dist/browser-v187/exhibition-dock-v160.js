import{a as Ke,b as ke,c as H,e as ue,f as ve}from"./shared-RGYTE4B5.js";import{a as Se,c as gt,d as J}from"./shared-R5XT465O.js";import{c as X}from"./shared-RTTFH4P3.js";var ee=X(Se()),Ie=X(gt());var Y=X(Se());var xe=X(J());function ht(t){let r=t.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);return r?{h:parseFloat(r[1]),s:parseFloat(r[2]),l:parseFloat(r[3])}:{h:40,s:80,l:80}}function vt(t,r){let{h:o,s:n,l:d}=ht(t),b=`${o}deg ${n}% ${d}%`,u=[100,60,50,40,30,20,10],w=["","-60","-50","-40","-30","-20","-10"],x={};for(let m=0;m<u.length;m++)x[`--glow-color${w[m]}`]=`hsl(${b} / ${Math.min(u[m]*r,100)}%)`;return x}var xt=["80% 55%","69% 34%","8% 6%","41% 38%","86% 85%","82% 18%","51% 4%"],bt=["--gradient-one","--gradient-two","--gradient-three","--gradient-four","--gradient-five","--gradient-six","--gradient-seven"],wt=[0,1,2,0,1,2,1];function yt(t){let r={};for(let o=0;o<7;o++){let n=t[Math.min(wt[o],t.length-1)];r[bt[o]]=`radial-gradient(at ${xt[o]}, ${n} 0px, transparent 50%)`}return r["--gradient-base"]=`linear-gradient(${t[0]} 0 100%)`,r}function Et(t){let r=t.trim().replace("#","");if(!/^[\da-f]{3}([\da-f]{3})?$/i.test(r))return!1;let o=r.length===3?r.split("").map(u=>u+u).join(""):r,n=parseInt(o.slice(0,2),16),d=parseInt(o.slice(2,4),16),b=parseInt(o.slice(4,6),16);return n*.2126+d*.7152+b*.0722>180}function Je(t){return 1-Math.pow(1-t,3)}function je(t){return t*t*t}function Le({start:t=0,end:r=100,duration:o=1e3,delay:n=0,ease:d=Je,onUpdate:b,onEnd:u}){let w=performance.now()+n;function x(){let m=performance.now()-w,c=Math.min(m/o,1);b(t+(r-t)*d(c)),c<1?requestAnimationFrame(x):u&&u()}setTimeout(()=>requestAnimationFrame(x),n)}var Tt=({children:t,className:r="",edgeSensitivity:o=30,glowColor:n="40 80 80",backgroundColor:d="#120F17",borderRadius:b=28,glowRadius:u=40,glowIntensity:w=1,coneSpread:x=25,animated:m=!1,colors:c=["#c084fc","#f472b6","#38bdf8"],fillOpacity:i=.5})=>{let s=(0,Y.useRef)(null),f=(0,Y.useCallback)(h=>{let{width:l,height:M}=h.getBoundingClientRect();return[l/2,M/2]},[]),T=(0,Y.useCallback)((h,l,M)=>{let[E,A]=f(h),D=l-E,q=M-A,te=1/0,O=1/0;return D!==0&&(te=E/Math.abs(D)),q!==0&&(O=A/Math.abs(q)),Math.min(Math.max(1/Math.min(te,O),0),1)},[f]),g=(0,Y.useCallback)((h,l,M)=>{let[E,A]=f(h),D=l-E,q=M-A;if(D===0&&q===0)return 0;let O=Math.atan2(q,D)*(180/Math.PI)+90;return O<0&&(O+=360),O},[f]),y=(0,Y.useCallback)(h=>{let l=s.current;if(!l)return;let M=l.getBoundingClientRect(),E=h.clientX-M.left,A=h.clientY-M.top,D=T(l,E,A),q=g(l,E,A);l.style.setProperty("--edge-proximity",`${(D*100).toFixed(3)}`),l.style.setProperty("--cursor-angle",`${q.toFixed(3)}deg`)},[T,g]);(0,Y.useEffect)(()=>{if(!m||!s.current)return;let h=s.current,l=110,M=465;h.classList.add("sweep-active"),h.style.setProperty("--cursor-angle",`${l}deg`),Le({duration:500,onUpdate:E=>h.style.setProperty("--edge-proximity",E)}),Le({ease:je,duration:1500,end:50,onUpdate:E=>{h.style.setProperty("--cursor-angle",`${(M-l)*(E/100)+l}deg`)}}),Le({ease:Je,delay:1500,duration:2250,start:50,end:100,onUpdate:E=>{h.style.setProperty("--cursor-angle",`${(M-l)*(E/100)+l}deg`)}}),Le({ease:je,delay:2500,duration:1500,start:100,end:0,onUpdate:E=>h.style.setProperty("--edge-proximity",E),onEnd:()=>h.classList.remove("sweep-active")})},[m]);let L=vt(n,w),k=Et(d);return(0,xe.jsxs)("div",{ref:s,onPointerMove:y,className:`border-glow-card${k?" border-glow-card--light":""} ${r}`,style:{"--card-bg":d,"--edge-sensitivity":o,"--border-radius":`${b}px`,"--glow-padding":`${u}px`,"--cone-spread":x,"--fill-opacity":i,...L,...yt(c)},children:[(0,xe.jsx)("span",{className:"edge-light"}),(0,xe.jsx)("div",{className:"border-glow-inner",children:t})]})},Qe=Tt;var Q=X(Se());var F=X(J()),Ze=50;function Ue({defaultValue:t=50,startingValue:r=0,maxValue:o=100,className:n="",isStepped:d=!1,stepSize:b=1,leftIcon:u=(0,F.jsx)("span",{children:"\u2212"}),rightIcon:w=(0,F.jsx)("span",{children:"+"}),onValueChange:x}){return(0,F.jsx)("div",{className:`slider-container ${n}`,children:(0,F.jsx)(Rt,{defaultValue:t,startingValue:r,maxValue:o,isStepped:d,stepSize:b,onValueChange:x,leftIcon:u,rightIcon:w})})}function Rt({defaultValue:t,startingValue:r,maxValue:o,isStepped:n,stepSize:d,leftIcon:b,rightIcon:u,onValueChange:w}){let[x,m]=(0,Q.useState)(t),c=(0,Q.useRef)(null);(0,Q.useEffect)(()=>{w?.(x)},[x]);let[i,s]=(0,Q.useState)("middle"),f=ke(0),T=ke(0),g=ke(1);(0,Q.useEffect)(()=>{m(t)},[t]),Ke(f,"change",l=>{if(c.current){let{left:M,right:E}=c.current.getBoundingClientRect(),A;l<M?(s("left"),A=M-l):l>E?(s("right"),A=l-E):(s("middle"),A=0),T.jump(Mt(A,Ze))}});let y=l=>{if(l.buttons>0&&c.current){let{left:M,width:E}=c.current.getBoundingClientRect(),A=r+(l.clientX-M)/E*(o-r);n&&(A=Math.round(A/d)*d),A=Math.min(Math.max(A,r),o),m(A),f.jump(l.clientX)}},L=l=>{y(l),l.currentTarget.setPointerCapture(l.pointerId)},k=()=>{ue(T,0,{type:"spring",bounce:.5})},h=()=>{let l=o-r;return l===0?0:(x-r)/l*100};return(0,F.jsxs)(F.Fragment,{children:[(0,F.jsxs)(ve.div,{onHoverStart:()=>ue(g,1.2),onHoverEnd:()=>ue(g,1),onTouchStart:()=>ue(g,1.2),onTouchEnd:()=>ue(g,1),style:{scale:g,opacity:H(g,[1,1.2],[.7,1])},className:"slider-wrapper",children:[(0,F.jsx)(ve.div,{animate:{scale:i==="left"?[1,1.4,1]:1,transition:{duration:.25}},style:{x:H(()=>i==="left"?-T.get()/g.get():0)},children:b}),(0,F.jsx)("div",{ref:c,className:"slider-root",onPointerMove:y,onPointerDown:L,onPointerUp:k,onPointerCancel:k,onLostPointerCapture:k,children:(0,F.jsx)(ve.div,{style:{scaleX:H(()=>{if(c.current){let{width:l}=c.current.getBoundingClientRect();return 1+T.get()/l}}),scaleY:H(T,[0,Ze],[1,.8]),transformOrigin:H(()=>{if(c.current){let{left:l,width:M}=c.current.getBoundingClientRect();return f.get()<l+M/2?"right":"left"}}),height:H(g,[1,1.2],[6,12]),marginTop:H(g,[1,1.2],[0,-3]),marginBottom:H(g,[1,1.2],[0,-3])},className:"slider-track-wrapper",children:(0,F.jsx)("div",{className:"slider-track",children:(0,F.jsx)("div",{className:"slider-range",style:{width:`${h()}%`}})})})}),(0,F.jsx)(ve.div,{animate:{scale:i==="right"?[1,1.4,1]:1,transition:{duration:.25}},style:{x:H(()=>i==="right"?T.get()/g.get():0)},children:u})]}),(0,F.jsx)("p",{className:"value-indicator",children:Math.round(x)})]})}function Mt(t,r){if(r===0)return 0;let o=t/r;return 2*(1/(1+Math.exp(-o))-.5)*r}var Z=X(Se());var Be=X(J()),At="https://images.unsplash.com/photo-1693250707557-a846a014b321?q=80&w=1400&auto=format&fit=crop",St=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,kt=`#version 300 es
precision highp float;
uniform sampler2D uPrevious;
uniform vec2 uTexture;
uniform vec2 uView;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uSoftness;
uniform float uStrength;
uniform float uFade;
out vec4 outColor;

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
  return length(p - a - ab * h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uTexture;
  vec2 p = vec2(uv.x, 1.0 - uv.y) * uView;
  float trail = max(texture(uPrevious, uv).r - uFade, 0.0);
  float band = max(uRadius * uSoftness, 1.0);
  float brush = clamp((uRadius - segment(p, uFrom, uTo)) / band, 0.0, 1.0);
  brush = brush * brush * (3.0 - 2.0 * brush);
  outColor = vec4(max(trail, brush * uStrength), 0.0, 0.0, 1.0);
}`,Lt=`#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform sampler2D uMask;
uniform vec2 uResolution;
uniform vec2 uView;
uniform float uDpr;
uniform vec4 uFrame;
uniform float uTexels;
uniform float uMode;
uniform float uShape;
uniform float uCell;
uniform float uAngle;
uniform float uScale;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform vec3 uPaper;
uniform float uContrast;
uniform float uBrightness;
uniform float uInvert;
uniform float uRough;
uniform float uShift;
uniform vec3 uMatte;
uniform float uKey;
uniform float uReverse;
uniform float uIntro;
uniform vec4 uBursts[4];
uniform float uBurstWidth;
out vec4 outColor;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
const vec3 CYAN = vec3(0.0, 0.64, 0.93);
const vec3 MAGENTA = vec3(0.92, 0.07, 0.56);
const vec3 YELLOW = vec3(1.0, 0.91, 0.0);
const vec3 KEY = vec3(0.11, 0.1, 0.12);
const vec3 RED = vec3(1.0, 0.16, 0.12);
const vec3 GREEN = vec3(0.12, 1.0, 0.3);
const vec3 BLUE = vec3(0.16, 0.32, 1.0);

mat2 rotate(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec4 photo(vec2 p, float lod, float margin) {
  vec2 uv = (p - uFrame.xy) / uFrame.zw;
  vec4 c = textureLod(uImage, clamp(uv, 0.0, 1.0), lod);
  vec2 slack = margin * uCell / uFrame.zw;
  vec2 inside = step(-slack, uv) * step(uv, 1.0 + slack);
  float keep = inside.x * inside.y * c.a;
  keep *= mix(1.0, smoothstep(0.05, 0.2, distance(c.rgb, uMatte)), uKey);
  return vec4(c.rgb, keep);
}

float grade(float v) {
  v = clamp((v - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);
  return mix(v, 1.0 - v, uInvert);
}

vec3 gradeColor(vec3 c) {
  return vec3(grade(c.r), grade(c.g), grade(c.b));
}

vec3 tone(vec3 c) {
  return pow(max(c, 0.0), vec3(1.5));
}

float press(float t, float alpha) {
  return (0.05 + clamp(t, 0.0, 1.0) * 0.89) * alpha;
}

float plate(float t, float alpha) {
  return (0.02 + clamp(t, 0.0, 1.0) * 0.92) * alpha;
}

vec3 decode(vec3 c) {
  return pow(max(c, 0.0), vec3(2.2));
}

vec4 separate(vec3 color) {
  vec3 target = clamp(tone(gradeColor(color)) / max(tone(uPaper), vec3(0.02)), 0.0, 1.0);
  vec3 absorbC = 1.0 - decode(CYAN);
  vec3 absorbM = 1.0 - decode(MAGENTA);
  vec3 absorbY = 1.0 - decode(YELLOW);
  float bright = pow(max(max(target.r, target.g), target.b), 0.4545);
  float key = pow(clamp(1.0 - bright / 0.62, 0.0, 1.0), 1.4) * 0.95;
  vec3 rest = clamp(target / max(1.0 - key * (1.0 - decode(KEY)), vec3(0.03)), 0.0, 1.0);
  vec3 a = 1.0 - rest;
  for (int i = 0; i < 3; i++) {
    vec3 tc = 1.0 - a.x * absorbC;
    vec3 tm = 1.0 - a.y * absorbM;
    vec3 ty = 1.0 - a.z * absorbY;
    mat3 slope = mat3(-absorbC * tm * ty, -absorbM * tc * ty, -absorbY * tc * tm);
    if (abs(determinant(slope)) < 1e-6) break;
    a = clamp(a - inverse(slope) * (tc * tm * ty - rest), 0.0, 1.0);
  }
  return vec4(a, key);
}

vec3 emit(vec3 color) {
  vec3 target = max(tone(gradeColor(color)) - tone(uPaper), 0.0);
  mat3 lights = mat3(decode(RED), decode(GREEN), decode(BLUE));
  return clamp(inverse(lights) * target, 0.0, 1.0);
}

float metric(vec2 f) {
  if (uShape < 0.5) return length(f);
  if (uShape < 1.5) return length(f * vec2(0.8, 1.15));
  if (uShape < 2.5) return max(abs(f.x), abs(f.y));
  if (uShape < 3.5) return abs(f.x) + abs(f.y);
  if (uShape < 4.5) return abs(f.y);
  return min(abs(f.x), abs(f.y));
}

float reach(float t) {
  t = clamp(t, 0.0, 1.0);
  if (uShape < 0.5) return t < 0.785 ? sqrt(t / 3.14159) : mix(0.5, 0.72, (t - 0.785) / 0.215);
  if (uShape < 1.5) return t < 0.7 ? sqrt(t * 0.92 / 3.14159) : mix(0.4497, 0.72, (t - 0.7) / 0.3);
  if (uShape < 2.5) return 0.5 * sqrt(t) + 0.02 * t;
  if (uShape < 3.5) return t < 0.5 ? sqrt(t * 0.5) : 1.0 - sqrt((1.0 - t) * 0.5);
  if (uShape < 4.5) return 0.52 * t;
  return (1.0 - sqrt(1.0 - t)) * 0.5 + 0.02 * t;
}

vec2 center(vec2 p, float angle) {
  vec2 q = rotate(angle) * p / uCell;
  vec2 c = floor(q) + 0.5;
  if (uShape > 3.5 && uShape < 4.5) c.x = q.x;
  return rotate(-angle) * c * uCell;
}

float dots(vec2 p, float angle, float t, float seed, float grow) {
  vec2 q = rotate(angle) * p / uCell;
  float d = metric(fract(q) - 0.5);
  d += (noise(p * 0.42 + seed * 17.0) - 0.5) * uRough * 0.18;
  float r = reach(t) * uScale * grow;
  float w = max(fwidth(d), 0.0001) * 0.75;
  return smoothstep(r + w, r - w, d) * clamp(r / (w * 2.0), 0.0, 1.0);
}

float coverage(vec4 image) {
  float shade = dot(tone(gradeColor(image.rgb)), LUMA);
  float paper = dot(tone(uPaper), LUMA);
  float span = dot(tone(uInk), LUMA) - paper;
  float t = abs(span) < 0.02 ? 1.0 - shade : (shade - paper) / span;
  return press(t, image.a);
}

float burst(vec2 p) {
  float value = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 b = uBursts[i];
    if (b.w <= 0.0) continue;
    float offset = distance(p, b.xy) - b.z;
    float edge = offset > 0.0 ? offset / (uBurstWidth * 0.35) : -offset / uBurstWidth;
    value = max(value, clamp(1.0 - edge, 0.0, 1.0) * b.w);
  }
  return value;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uDpr;
  float lod = log2(max(uCell * uTexels, 1.0));
  float base = uAngle;
  vec2 drift = vec2(uShift, uShift * -0.6);

  vec2 field = p / max(uView.x, uView.y) - uView / max(uView.x, uView.y) * 0.5;
  float delay = length(field) * 1.15 + hash(floor(p / uCell)) * 0.06;
  float grow = smoothstep(0.0, 1.0, clamp((uIntro * 1.7 - delay) / 0.45, 0.0, 1.0));

  vec3 print = uPaper;
  if (uMode < 0.5) {
    float k = dots(p, base, coverage(photo(center(p, base), lod, 0.5)), 0.0, grow);
    print = mix(uPaper, uInk, k);
  } else if (uMode < 1.5) {
    float second = base + 0.5236;
    float tA = coverage(photo(center(p, base), lod, 0.5));
    float tB = coverage(photo(center(p + drift, second) - drift, lod, 0.5));
    float kA = dots(p, base, pow(tA, 1.9), 0.0, grow);
    float kB = dots(p + drift, second, clamp(tB * 1.3, 0.0, 1.0) * 0.8, 1.0, grow);
    if (dot(uPaper, LUMA) > 0.5) {
      print = uPaper * mix(vec3(1.0), uAccent, kB) * mix(vec3(1.0), uInk, kA);
    } else {
      print = min(uPaper + uAccent * kB + uInk * kA, vec3(1.0));
    }
  } else if (dot(uPaper, LUMA) > 0.5) {
    float ac = base - 0.5236;
    float am = base + 0.5236;
    float ay = base - 0.7854;
    vec4 sc = photo(center(p + drift, ac) - drift, lod, 0.5);
    vec4 sm = photo(center(p - drift, am) + drift, lod, 0.5);
    vec4 sy = photo(center(p + drift.yx, ay) - drift.yx, lod, 0.5);
    vec4 sk = photo(center(p, base), lod, 0.5);
    float kc = sc.a > 0.0 ? dots(p + drift, ac, plate(separate(sc.rgb).x, sc.a), 1.0, grow) : 0.0;
    float km = sm.a > 0.0 ? dots(p - drift, am, plate(separate(sm.rgb).y, sm.a), 2.0, grow) : 0.0;
    float ky = sy.a > 0.0 ? dots(p + drift.yx, ay, plate(separate(sy.rgb).z, sy.a), 3.0, grow) : 0.0;
    float kk = sk.a > 0.0 ? dots(p, base, plate(separate(sk.rgb).w, sk.a), 4.0, grow) : 0.0;
    print = uPaper;
    print *= mix(vec3(1.0), CYAN, kc);
    print *= mix(vec3(1.0), MAGENTA, km);
    print *= mix(vec3(1.0), YELLOW, ky);
    print *= mix(vec3(1.0), KEY, kk);
  } else {
    float ar = base - 0.5236;
    float ag = base + 0.5236;
    vec4 sr = photo(center(p + drift, ar) - drift, lod, 0.5);
    vec4 sg = photo(center(p - drift, ag) + drift, lod, 0.5);
    vec4 sb = photo(center(p, base), lod, 0.5);
    float kr = dots(p + drift, ar, plate(emit(sr.rgb).x, sr.a), 1.0, grow);
    float kg = dots(p - drift, ag, plate(emit(sg.rgb).y, sg.a), 2.0, grow);
    float kb = dots(p, base, plate(emit(sb.rgb).z, sb.a), 3.0, grow);
    print = min(uPaper + RED * kr + GREEN * kg + BLUE * kb, vec3(1.0));
  }

  vec2 maskUv = vec2(p.x / uView.x, 1.0 - p.y / uView.y);
  float shown = max(texture(uMask, maskUv).r, burst(p));
  shown = mix(shown, 1.0 - shown, uReverse);
  shown = shown * shown * (3.0 - 2.0 * shown);
  vec2 q = rotate(base) * p / uCell;
  float d = metric(fract(q) - 0.5);
  float r = reach(1.0) * 1.08 * shown;
  float w = max(fwidth(d), 0.0001) * 0.75;
  float k = smoothstep(r + w, r - w, d) * clamp(r / (w * 2.0), 0.0, 1.0);
  vec4 sharp = photo(p, 0.0, 0.0);
  vec3 real = mix(uPaper, sharp.rgb, sharp.a);
  outColor = vec4(mix(print, real, k), 1.0);
}`,Pt={mono:0,duotone:1,color:2},Ct={dot:0,ellipse:1,square:2,diamond:3,line:4,cross:5},et=4,tt=1.3,It=1.4,rt=.5,be=(t,r,o)=>Math.min(o,Math.max(r,t)),at=(t,r,o)=>{let n=t.createShader(r);return n?(t.shaderSource(n,o),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)?n:(t.deleteShader(n),null)):null},nt=(t,r)=>{let o=at(t,t.VERTEX_SHADER,St),n=at(t,t.FRAGMENT_SHADER,r),d=t.createProgram();return!o||!n||!d?null:(t.attachShader(d,o),t.attachShader(d,n),t.bindAttribLocation(d,0,"aPosition"),t.linkProgram(d),t.deleteShader(o),t.deleteShader(n),t.getProgramParameter(d,t.LINK_STATUS)?d:(t.deleteProgram(d),null))},ot=(t,r,o)=>{let n={};for(let d of o)n[d]=t.getUniformLocation(r,d);return n},Ft=(t,r,o)=>[r*(.5+.32*Math.sin(t*.53)+.08*Math.sin(t*1.31+.6)),o*(.5+.27*Math.sin(t*.71+1.1)+.07*Math.cos(t*1.57))],_t=(t,r)=>{t.canvas.width=32,t.canvas.height=32,t.clearRect(0,0,32,32),t.drawImage(r,0,0,32,32);let n=t.getImageData(0,0,32,32).data,d=[0,0,0],b=[0,0,0],u=0,w=0;for(let c=0;c<32;c++)for(let i=0;i<32;i++){if(i>0&&c>0&&i<31&&c<31)continue;let s=(c*32+i)*4;n[s+3]<250&&w++;for(let f=0;f<3;f++){let T=n[s+f]/255;d[f]+=T,b[f]+=T*T}u++}let x=[d[0]/u,d[1]/u,d[2]/u],m=x.reduce((c,i,s)=>c+Math.sqrt(Math.max(0,b[s]/u-i*i)),0)/3;return{matte:x,plain:w<u*.5&&m<.06}},Ut=({src:t=At,fit:r="cover",mode:o="mono",shape:n="dot",cellSize:d=6,angle:b=45,dotScale:u=1,inkColor:w="#120f17",accentColor:x="#ff4f2a",paperColor:m="#ffffff",contrast:c=1.1,brightness:i=0,invert:s=!1,roughness:f=0,misregistration:T=0,revealRadius:g=160,softness:y=.6,linger:L=1.2,reverse:k=!1,wander:h=!1,clickBurst:l=!0,intro:M=!0,className:E="",style:A})=>{let D=(0,Z.useRef)(null),q=(0,Z.useRef)(null),te=(0,Z.useRef)(null),O={fit:r,mode:Pt[o]??0,shape:Ct[n]??0,cellSize:be(d,2,80),angle:b,dotScale:be(u,.2,2),inkColor:String(w),accentColor:String(x),paperColor:String(m),contrast:c,brightness:i,invert:s,roughness:be(f,0,1),misregistration:be(T,0,1),revealRadius:Math.max(0,g),softness:be(y,0,1),linger:Math.max(0,L),reverse:k,wander:h,clickBurst:l,intro:M},we=(0,Z.useRef)(O);return we.current=O,(0,Z.useEffect)(()=>{let _=D.current,V=q.current,e=V?.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1});if(!_||!V||!e)return;let ye=nt(e,kt),Ee=nt(e,Lt);if(!ye||!Ee)return;let z=ot(e,ye,["uPrevious","uTexture","uView","uFrom","uTo","uRadius","uSoftness","uStrength","uFade"]),R=ot(e,Ee,["uImage","uMask","uResolution","uView","uDpr","uFrame","uTexels","uMode","uShape","uCell","uAngle","uScale","uInk","uAccent","uPaper","uContrast","uBrightness","uInvert","uRough","uShift","uMatte","uKey","uReverse","uIntro","uBursts","uBurstWidth"]),Te=e.createVertexArray(),Ne=e.createBuffer();e.bindVertexArray(Te),e.bindBuffer(e.ARRAY_BUFFER,Ne),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null);let Xe=!!e.getExtension("EXT_color_buffer_float"),Re=e.createTexture();e.bindTexture(e.TEXTURE_2D,Re),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let Me=(a,v)=>{let S=e.createTexture();e.bindTexture(e.TEXTURE_2D,S),Xe?e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,a,v,0,e.RGBA,e.HALF_FLOAT,null):e.texImage2D(e.TEXTURE_2D,0,e.RGBA,a,v,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let C=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,C),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,S,0),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.bindFramebuffer(e.FRAMEBUFFER,null),{texture:S,framebuffer:C,width:a,height:v}},qe=a=>{e.deleteFramebuffer(a.framebuffer),e.deleteTexture(a.texture)},N=[Me(2,2),Me(2,2)],ie=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),He=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,Fe=new Map,K=[],se=new Float32Array(et*4),P={x:0,y:0,inside:!1,fresh:!0,placed:!1},U={x:0,y:0,px:0,py:0},p={width:1,height:1,dpr:1,image:null,matte:[0,0,0],key:0,introStart:0,presence:0,drift:0,trailUntil:0},ce=0,le=0,pe=!0,me=!0,_e=a=>{if(Fe.has(a))return Fe.get(a);let v=[0,0,0];if(ie&&a){ie.clearRect(0,0,1,1),ie.fillStyle="#000000",ie.fillStyle=/^[0-9a-f]{3,8}$/i.test(a)?`#${a}`:a,ie.fillRect(0,0,1,1);let[S,C,B]=ie.getImageData(0,0,1,1).data;v=[S/255,C/255,B/255]}return Fe.set(a,v),v},ut=a=>{let{image:v,width:S,height:C}=p;if(!v)return[0,0,S,C];let B=(a.fit==="cover"?Math.max:Math.min)(S/v.naturalWidth,C/v.naturalHeight),G=v.naturalWidth*B,$=v.naturalHeight*B;return[(S-G)/2,(C-$)/2,G,$]},Oe=()=>{let a=Math.max(1,_.clientWidth),v=Math.max(1,_.clientHeight),S=Math.min(window.devicePixelRatio||1,2);p.width=a,p.height=v,p.dpr=S,V.width=Math.max(1,Math.round(a*S)),V.height=Math.max(1,Math.round(v*S));let C=Math.max(2,Math.round(a*rt)),B=Math.max(2,Math.round(v*rt));(C!==N[0].width||B!==N[0].height)&&(N.forEach(qe),N=[Me(C,B),Me(C,B)]),P.placed||(P.x=a/2,P.y=v/2),re()},ft=(a,v)=>{let S=Xe?0:.0058823529411764705;e.bindFramebuffer(e.FRAMEBUFFER,N[1].framebuffer),e.viewport(0,0,N[1].width,N[1].height),e.useProgram(ye),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,N[0].texture),e.uniform1i(z.uPrevious,0),e.uniform2f(z.uTexture,N[1].width,N[1].height),e.uniform2f(z.uView,p.width,p.height),e.uniform2f(z.uFrom,U.px,U.py),e.uniform2f(z.uTo,U.x,U.y),e.uniform1f(z.uRadius,a.revealRadius*(.45+.55*p.presence)),e.uniform1f(z.uSoftness,a.softness),e.uniform1f(z.uStrength,p.presence),e.uniform1f(z.uFade,Math.max(a.linger>0?v/a.linger:1,S)),e.bindVertexArray(Te),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),N.reverse()},Ve=(a,v)=>{let[S,C,B,G]=ut(a),$=p.image,he=$?!a.intro||He?1:Math.min(1,(v-p.introStart)/1e3/It):0;return e.viewport(0,0,V.width,V.height),e.useProgram(Ee),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,Re),e.uniform1i(R.uImage,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,N[0].texture),e.uniform1i(R.uMask,1),e.uniform2f(R.uResolution,V.width,V.height),e.uniform2f(R.uView,p.width,p.height),e.uniform1f(R.uDpr,V.width/p.width),e.uniform4f(R.uFrame,S,C,B,G),e.uniform1f(R.uTexels,$?$.naturalWidth/B:1),e.uniform1f(R.uMode,a.mode),e.uniform1f(R.uShape,a.shape),e.uniform1f(R.uCell,a.cellSize),e.uniform1f(R.uAngle,a.angle*Math.PI/180),e.uniform1f(R.uScale,a.dotScale),e.uniform3fv(R.uInk,_e(a.inkColor)),e.uniform3fv(R.uAccent,_e(a.accentColor)),e.uniform3fv(R.uPaper,_e(a.paperColor)),e.uniform1f(R.uContrast,a.contrast),e.uniform1f(R.uBrightness,a.brightness),e.uniform1f(R.uInvert,a.invert?1:0),e.uniform1f(R.uRough,a.roughness),e.uniform1f(R.uShift,a.misregistration*a.cellSize*.35),e.uniform3fv(R.uMatte,p.matte),e.uniform1f(R.uKey,p.key),e.uniform1f(R.uReverse,a.reverse?1:0),e.uniform1f(R.uIntro,1-(1-he)*(1-he)),e.uniform4fv(R.uBursts,se),e.uniform1f(R.uBurstWidth,Math.max(60,a.revealRadius*.9)),e.bindVertexArray(Te),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),he},ze=a=>{if(ce=0,!me||!pe||document.hidden)return;let v=we.current,S=le?Math.min(.05,Math.max(0,(a-le)/1e3)):1/60;le=a;let C=v.wander&&!He,B=P.x,G=P.y;if(!P.inside&&C){p.drift=Math.min(1,p.drift+S/1.2);let[I,de]=Ft(a/1e3,p.width,p.height),ae=p.drift*p.drift*(3-2*p.drift);B+=(I-B)*ae,G+=(de-G)*ae}else p.drift=0;let $=P.inside||C;if(p.presence+=(($?1:0)-p.presence)*(1-Math.exp(-S/.16)),P.fresh)U.x=U.px=B,U.y=U.py=G,P.fresh=!1;else{let I=1-Math.exp(-S/.035);U.x+=(B-U.x)*I,U.y+=(G-U.y)*I}se.fill(0);for(let I=K.length-1;I>=0;I--)(a-K[I].start)/1e3>=tt&&K.splice(I,1);K.forEach((I,de)=>{let ae=Math.max(0,(a-I.start)/1e3/tt),mt=Math.hypot(Math.max(I.x,p.width-I.x),Math.max(I.y,p.height-I.y))+80;se[de*4]=I.x,se[de*4+1]=I.y,se[de*4+2]=mt*Math.sin(ae*Math.PI/2),se[de*4+3]=1-ae*ae*ae}),p.presence>.002&&(p.trailUntil=a+v.linger*1e3+200),ft(v,S),U.px=U.x,U.py=U.y;let he=Ve(v,a);$||p.presence>.002||K.length>0||a<p.trailUntil||p.image&&he<1?ce=requestAnimationFrame(ze):le=0},re=()=>{!ce&&me&&pe&&!document.hidden&&(ce=requestAnimationFrame(ze))},j=new Image;j.crossOrigin="anonymous",j.decoding="async",j.onload=()=>{if(!me)return;e.bindTexture(e.TEXTURE_2D,Re),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,j),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR);let a=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});if(a)try{let v=_t(a,j);p.matte=v.matte,p.key=v.plain?1:0}catch{p.key=0}p.image=j,p.introStart=performance.now(),re()},j.src=t;let pt=a=>{let v=_.getBoundingClientRect();P.x=a.clientX-v.left,P.y=a.clientY-v.top,P.placed=!0},ge=a=>{pt(a),P.inside||(P.inside=!0,P.fresh=!0),re()},Ae=()=>{P.inside=!1,re()},Ge=a=>{ge(a),!(!we.current.clickBurst||a.pointerType==="mouse"&&a.button!==0)&&(K.push({x:P.x,y:P.y,start:performance.now()}),K.length>et&&K.shift())},$e=()=>{le=0,re()};_.addEventListener("pointermove",ge,{passive:!0}),_.addEventListener("pointerenter",ge,{passive:!0}),_.addEventListener("pointerdown",Ge,{passive:!0}),_.addEventListener("pointerleave",Ae,{passive:!0}),_.addEventListener("pointercancel",Ae,{passive:!0}),document.addEventListener("visibilitychange",$e);let Ye=new ResizeObserver(Oe);Ye.observe(_);let We=new IntersectionObserver(a=>{pe=a.some(v=>v.isIntersecting),pe&&(le=0,re())});return We.observe(_),Oe(),te.current=()=>{!ce&&me&&pe&&(Ve(we.current,performance.now()),re())},()=>{me=!1,cancelAnimationFrame(ce),te.current=null,j.onload=null,Ye.disconnect(),We.disconnect(),_.removeEventListener("pointermove",ge),_.removeEventListener("pointerenter",ge),_.removeEventListener("pointerdown",Ge),_.removeEventListener("pointerleave",Ae),_.removeEventListener("pointercancel",Ae),document.removeEventListener("visibilitychange",$e),N.forEach(qe),e.deleteTexture(Re),e.deleteBuffer(Ne),e.deleteVertexArray(Te),e.deleteProgram(ye),e.deleteProgram(Ee)}},[t]),(0,Z.useEffect)(()=>{te.current?.()}),(0,Be.jsx)("div",{ref:D,className:`halftone-reveal${E?` ${E}`:""}`,style:A,children:(0,Be.jsx)("canvas",{ref:q,className:"halftone-reveal-canvas","aria-hidden":"true"})})},it=Ut;function st(){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;let t=document.createElement("canvas");t.className="archive-click-sparks",t.setAttribute("aria-hidden","true"),document.body.append(t);let r=t.getContext("2d"),o=0,n=[];function d(){t.width=innerWidth,t.height=innerHeight}d(),window.addEventListener("resize",d);function b(i){o=0,r.clearRect(0,0,t.width,t.height),n=n.filter(s=>i-s.t<520);for(let s of n){let f=(i-s.t)/520,T=f*(2-f),g=T*25,y=9*(1-T);r.strokeStyle="#d2b477",r.globalAlpha=1-f,r.lineWidth=1.6,r.beginPath(),r.moveTo(s.x+Math.cos(s.a)*g,s.y+Math.sin(s.a)*g),r.lineTo(s.x+Math.cos(s.a)*(g+y),s.y+Math.sin(s.a)*(g+y)),r.stroke()}n.length&&(o=requestAnimationFrame(b))}let u="button,a,.life-note-card,.image-chapter figure,.index-work";document.addEventListener("click",i=>{let s=i.target.closest(u);if(!s||s.closest("#volumeSlider,#brightnessSlider"))return;let f=performance.now();for(let T=0;T<8;T++)n.push({x:i.clientX,y:i.clientY,a:T*Math.PI/4,t:f});o||(o=requestAnimationFrame(b))},{capture:!0});let w=null,x=0,m=0,c=0;document.addEventListener("pointermove",i=>{m=i.clientX,c=i.clientY;let s=i.target.closest("button:not(.home-secret-hit),.life-note-card,.image-chapter figure");w!==s&&(w?.classList.remove("archive-hover"),w=s,s?.classList.add("archive-hover")),!x&&s&&(x=requestAnimationFrame(()=>{x=0;let f=s.getBoundingClientRect();s.style.setProperty("--glow-x",((m-f.x)/f.width*100).toFixed(1)+"%"),s.style.setProperty("--glow-y",((c-f.y)/f.height*100).toFixed(1)+"%")}))},{passive:!0}),document.addEventListener("focusin",i=>i.target.closest("button")?.classList.add("archive-hover")),document.addEventListener("focusout",i=>i.target.closest("button")?.classList.remove("archive-hover"))}var W=X(J()),ct=new WeakSet;function Bt({node:t}){let r=(0,ee.useRef)(null);return(0,ee.useEffect)(()=>{r.current?.append(t)},[t]),(0,W.jsx)("span",{ref:r,style:{display:"contents"}})}function Dt(t){if(ct.has(t)||t.closest(".archive-border-mount"))return;ct.add(t);let r=document.createElement("div");r.className="archive-border-mount",t.before(r),(0,Ie.createRoot)(r).render((0,W.jsx)(Qe,{backgroundColor:"#16211b",glowColor:"40 80 80",colors:["#e9c078","#83ad9d","#e4cdae"],borderRadius:14,glowRadius:32,glowIntensity:1.15,fillOpacity:.2,children:(0,W.jsx)(Bt,{node:t})}))}var Pe=document.getElementById("indexList");if(Pe){let t=()=>Pe.querySelectorAll(".index-work").forEach(Dt);new MutationObserver(t).observe(Pe,{childList:!0}),t(),Pe.addEventListener("pointermove",r=>{let o=r.target.closest(".border-glow-card");if(o){let n=o.getBoundingClientRect(),d=Math.atan2(r.clientY-n.y-n.height/2,r.clientX-n.x-n.width/2)*180/Math.PI+90;o.style.setProperty("--edge-proximity","100"),o.style.setProperty("--cursor-angle",d+"deg")}})}function Nt({node:t,min:r,max:o}){let[n,d]=(0,ee.useState)({value:Number(t.getAttribute("aria-valuenow")),revision:0}),b=(0,ee.useRef)(!1);return(0,ee.useEffect)(()=>{let u=w=>{b.current||d(x=>({value:w.detail,revision:x.revision+1}))};return t.addEventListener("v84:slider-sync",u),()=>t.removeEventListener("v84:slider-sync",u)},[t]),(0,W.jsx)(Ue,{className:"archive-elastic",startingValue:r,maxValue:o,defaultValue:n.value,isStepped:!0,stepSize:1,leftIcon:(0,W.jsx)("span",{}),rightIcon:(0,W.jsx)("span",{}),onValueChange:u=>{b.current=!0;try{t.dispatchEvent(new CustomEvent("v84:slider-value",{detail:u}))}finally{b.current=!1}}},n.revision)}for(let[t,r,o]of[["volumeSlider",0,100],["brightnessSlider",60,115]]){let n=document.getElementById(t);n&&(n.replaceChildren(),(0,Ie.createRoot)(n).render((0,W.jsx)(Nt,{node:n,min:r,max:o})))}var Ce=null,fe=null,lt=0,De=()=>{clearTimeout(lt),Ce?.unmount(),Ce=null,fe?.remove(),fe=null};window.addEventListener("v85:image-viewer-close",De);window.addEventListener("v85:image-viewer-open",t=>{De();let r=t.detail,o=r.querySelector("img");o?.src&&(fe=document.createElement("div"),fe.className="photo-halftone-reveal",o.after(fe),Ce=(0,Ie.createRoot)(fe),Ce.render((0,W.jsx)(it,{src:o.src,fit:"contain",mode:"duotone",cellSize:7,inkColor:"#25352d",accentColor:"#b49459",paperColor:"#eeece5",intro:!1,linger:.15,revealRadius:220,wander:!1})),lt=setTimeout(De,2500))});st();var ne=document.querySelector("#workFlow.scroll-collage");if(ne&&!ne.dataset.collageReady){let s=function(){m=0;let g=ne.getBoundingClientRect(),y=u(-g.top/(g.height-innerHeight));i.progress=y,t.forEach((L,k)=>{let h=k*.32,l=u((y-h)/.32),M=k===0?1:w(h-.14,h+.035,y),E=k===2?w(.91,1,y):w(h+.19,h+.32,y),A=1-.4*w(h,h+.23,y),D=(1-M)*innerHeight*.27-E*innerHeight*.18;L.style.transform=`translate(-50%,-50%) translateY(${D}px) scale(${A})`,L.style.opacity=String(M*(1-E))}),i.text=Math.min(2,Math.floor(y/.32)),b.forEach((L,k)=>{let h=w(-.035+k*.009,.3+k*.009,y),l=w(.9,1,y),[M,E]=n[k],A=M>.5?1:-1,D=E<.5?-1:1;L.style.opacity=String(h*(1-l*.12)),L.style.transform=`translate(${c?0:A*(1-h)*innerWidth*.34}px,${c?0:D*(1-h)*innerHeight*.42-l*innerHeight*.07}px) scale(${c?1:1.09-.09*h})`})};Xt=s;let t=[...ne.querySelectorAll("h2")],r=ne.querySelector(".scroll-collage-images"),o=[1,2,3,4,5,6,8,9,10,11].map(g=>`./assets/atmosphere-v172/atmosphere-${String(g).padStart(2,"0")}.webp`),n=[[.015,.31,.145],[.25,.17,.15],[.48,.06,.13],[.76,.2,.15],[.84,.55,.14],[.64,.79,.16],[.38,.76,.145],[.17,.64,.15],[.015,.82,.13],[.65,.04,.13]];r.replaceChildren();let d=[],b=o.map((g,y)=>{let L=d[y]??document.createElement("img");L.src=g,L.alt="",L.loading="lazy";let[k,h,l]=n[y];return L.style.cssText=`left:${k*100}%;top:${h*100}%;width:${l*100}%;height:auto;aspect-ratio:16/9;object-fit:cover;filter:saturate(.86) contrast(1.025);`,r.append(L),L}),u=g=>Math.max(0,Math.min(1,g)),w=(g,y,L)=>{let k=u((L-g)/(y-g));return k*k*(3-2*k)},x=!1,m=0,c=matchMedia("(prefers-reduced-motion: reduce)").matches,i={version:178,progress:0,text:0,reversible:!0,imageCount:b.length,frameAspectRatio:"16/9"};window.scrollCollageState=i;let f=()=>{m||(m=requestAnimationFrame(s))};new IntersectionObserver(([g])=>{if(x=g.isIntersecting,x){for(let y of b)y.loading="eager",y.decoding="async",y.decode().then(f).catch(()=>{});s()}},{rootMargin:"2200px"}).observe(ne),window.addEventListener("scroll",()=>{x&&f()},{passive:!0}),window.addEventListener("resize",f),s(),ne.dataset.collageReady="178",window.addEventListener("pageshow",s),document.fonts.ready.then(s)}var Xt;var oe=document.getElementById("indexList"),dt=document.getElementById("indexOverlay");if(oe&&dt){let t=matchMedia("(prefers-reduced-motion: reduce)").matches,r=()=>{for(let[m,c]of[...oe.querySelectorAll(".index-work")].entries()){let i=c.querySelector(".number");i&&(i.textContent=String(m+1).padStart(2,"0"));let s=c.querySelector(".title")?.textContent?.trim(),f=c.querySelector(".meta"),T=s==="\u5B66\u4E60"?"LEARNING / NOTES & PRACTICE<br>\u628A\u8BFB\u5230\u7684\u4E1C\u897F\u8BB0\u4E0B\u6765\uFF0C\u628A\u65B0\u7684\u60F3\u6CD5\u8BD5\u4E00\u8BD5\u3002":s==="\u9605\u8BFB"?"READING / FILM AESTHETICS<br>\u7FFB\u5F00\u7535\u5F71\u7F8E\u5B66\u624B\u7A3F\uFF0C\u4FDD\u7559\u539F\u6765\u7684\u56FE\u50CF\u4E0E\u8DE8\u9875\u8BBE\u8BA1\u3002":null;f&&T&&f.innerHTML!==T&&(f.innerHTML=T)}};new MutationObserver(r).observe(oe,{childList:!0}),r();let n=0,d=new Map,b=new Map,u=()=>[...oe.querySelectorAll(".index-work")],w=()=>{n=0;let m=!1;for(let c of u()){let i=b.get(c)||{p:0,v:0},s=d.get(c)||0;i.v=(i.v+(s-i.p)*.19)*.7,i.p+=i.v,b.set(c,i),c.style.setProperty("--dock-drop",(i.p*3.5).toFixed(3)+"px"),c.style.setProperty("--dock-scale",(1+i.p*.018).toFixed(5)),Math.abs(s-i.p)+Math.abs(i.v)>.001&&(m=!0)}m&&dt.classList.contains("v31-index-open")&&(n=requestAnimationFrame(w))},x=(m,c)=>{if(!t){for(let i of u()){let s=i.getBoundingClientRect(),f=Math.hypot(m-(s.left+s.width*.5),c-(s.top+s.height*.5));d.set(i,Math.max(0,1-f/Math.max(122,s.width*.65)))}n||(n=requestAnimationFrame(w))}};oe.addEventListener("pointermove",m=>x(m.clientX,m.clientY)),oe.addEventListener("pointerleave",()=>x(-1e4,-1e4)),oe.addEventListener("focusin",m=>{let c=m.target.closest(".index-work");if(c){let i=c.getBoundingClientRect();x(i.left+i.width*.5,i.top+i.height*.5)}})}
//# sourceMappingURL=exhibition-dock-v160.js.map
