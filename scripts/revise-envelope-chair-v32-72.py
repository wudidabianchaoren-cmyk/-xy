from pathlib import Path
P=Path(__file__).resolve().parents[1]
p=P/'v31-sand-story.js';s=p.read_text(encoding='utf8');a=s.index('  function sampleEnvelopeVolume()');b=s.index('\n  function createField()',a)
replacement='''  function sampleEnvelopeVolume() {
    const random=randomGenerator(973372);
    // A filled closed envelope: rectangular back, overlapping closure and four solid side edges.
    // Perspective is kept modest; the closure is inset above the paper instead of four flat triangles.
    const a=[-1.02,.25,-.045],b=[.74,.17,-.045],c=[-1.00,-.48,.085],d=[.77,-.56,.085];
    const flap=[-.105,-.17,.112];
    const faces=[
      {vertices:[a,b,flap],shade:.44,role:'closure'},
      {vertices:[a,flap,c],shade:.50,role:'left'},
      {vertices:[b,d,flap],shade:.61,role:'right'},
      {vertices:[c,flap,d],shade:.53,role:'lower'}
    ];
    const area=(p,q,r)=>Math.abs((q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]))*.5;
    let total=0;for(const f of faces){total+=area(...f.vertices)*(1+f.shade*.3);f.limit=total;}
    const positions=new Float32Array(PARTICLE_COUNT*3),uv=new Float32Array(PARTICLE_COUNT*2),opacity=new Float32Array(PARTICLE_COUNT),density=new Float32Array(PARTICLE_COUNT),focus=new Float32Array(PARTICLE_COUNT);
    const surfaceCount=Math.floor(PARTICLE_COUNT*.90),edgeCount=Math.floor(PARTICLE_COUNT*.075);
    const segmentDistance=(x,y,p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],t=clamp(((x-p[0])*dx+(y-p[1])*dy)/(dx*dx+dy*dy));return Math.hypot(x-p[0]-t*dx,y-p[1]-t*dy);};
    for(let i=0;i<PARTICLE_COUNT;i++){
      const f=faces.find(f=>random()*total<=f.limit)||faces[3];
      const [p,q,r]=f.vertices,root=Math.sqrt(random()),v=random(),w=[1-root,root*(1-v),root*v];
      let x=p[0]*w[0]+q[0]*w[1]+r[0]*w[2],y=p[1]*w[0]+q[1]*w[1]+r[1]*w[2],z=p[2]*w[0]+q[2]*w[1]+r[2]*w[2];
      const u=clamp((x+1.02)/1.79),vv=clamp((y+.56)/.81);
      z+=.036*Math.sin(Math.PI*u)*Math.sin(Math.PI*vv);
      const seam=Math.min(segmentDistance(x,y,a,flap),segmentDistance(x,y,b,flap));
      const crease=Math.exp(-seam*seam/.00009)*.19;
      let shade=clamp(f.shade+crease+(random()-.5)*.035),alpha=.58+shade*.36;
      if(i>=surfaceCount&&i<surfaceCount+edgeCount){
        const corners=[a,b,d,c],edge=Math.floor(random()*4),p=corners[edge],q=corners[(edge+1)%4],t=random(),h=random();
        x=p[0]+t*(q[0]-p[0]);y=p[1]+t*(q[1]-p[1])-.01*h;z=p[2]+t*(q[2]-p[2])-.047*h;shade=.58;alpha=.75;
      }else if(i>=surfaceCount+edgeCount){
        const t=random();x=c[0]+t*(d[0]-c[0]);y=c[1]+t*(d[1]-c[1])-.025-random()*.025;z=.005;shade=.15;alpha=.045;
      }
      positions.set([x,y,z],i*3);uv.set([.5+x/3.48,.5+y/1.96],i*2);density[i]=shade;opacity[i]=alpha;focus[i]=.5+shade*.2;
    }
    return {positions,uv,opacity,density,focus,detail:{positions:positions.slice(),uv:uv.slice(),opacity:new Float32Array(PARTICLE_COUNT),density:density.slice(),focus:focus.slice()}};
  }
'''
s=s[:a]+replacement+s[b:];s=s.replace('src: "./assets/sand-story/envelope-water.webp", seed: 9733','src: "./assets/sand-story/envelope-volume-v32-72.png", seed: 9733')
p.write_text(s,encoding='utf8')
p=P/'motion/life-purpose-v2/life-film.js';s=p.read_text(encoding='utf8');a=s.index('      // Rear feet deliberately');b=s.index('\n    function scene(',a)
replacement='''      // Consistent three-quarter projection: rear seat joins at A/B, front seat at D/C.
      // Both rear posts continue into legs; cross rails connect matching planes.
      const A=[-112,12],B=[62,-5],C=[116,53],D=[-59,72];
      const rearL=[-127,139],rearR=[58,121],frontR=[139,189],frontL=[-65,200];
      for(const p of [rearL,rearR,frontR])ellipse(p[0],p[1],16,4,'rgba(62,51,36,.10)',true);
      timber(A,rearL,17);timber(B,rearR,17);
      timber(A,[-110,-170],18);timber(B,[64,-187],18);
      timber([-110,-170],[64,-187],21);timber([-111,-117],[64,-134],13);
      timber([-56,-169],[-57,13],10);timber([8,-176],[9,6],10);
      // Lower side stretchers follow the same vanishing directions as the seat.
      timber([-118,87],[-62,145],10);timber([61,76],[128,137],10);timber([-62,145],[128,137],10);
      const seat=g.createLinearGradient(-90,10,90,70);seat.addColorStop(0,'#c5ad88');seat.addColorStop(.6,'#b5976c');seat.addColorStop(1,'#9c7d56');
      g.fillStyle=seat;g.beginPath();[A,B,C,D].forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fill();
      g.save();g.beginPath();[A,B,C,D].forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.clip();
      for(let j=0;j<34;j++){const q=j/34,left=[mix(A[0],D[0],q),mix(A[1],D[1],q)],right=[mix(B[0],C[0],q),mix(B[1],C[1],q)],pts=[];for(let k=0;k<=24;k++){const t=k/24;pts.push([mix(left[0],right[0],t),mix(left[1],right[1],t)+Math.sin(t*14+j*.61)*.35]);}pencil(pts,j%4===0?'rgba(247,230,196,.31)':'rgba(70,53,34,.19)',.55);}
      g.restore();timber(D,C,10);pencil([A,B,C,D,A],'#665b45',1.5);
      timber(C,frontR,18);timber(D,[-60,96],18);
      // A single missing front leg reaches the actual D seat socket; the final post is straight.
      const align=smooth((u-1.45)/1.15),press=smooth((u-2.8)/.65),repaired=press;
      const targetX=(D[0]+frontL[0])/2,targetY=(D[1]+frontL[1])/2;
      const legx=mix(218,targetX,align),legy=mix(145,targetY+14,align)-14*press,legAngle=mix(.7,.047,align);
      g.save();g.translate(legx,legy);g.rotate(legAngle);timber([0,-64],[0,64],18);g.restore();
      const retreat=smooth((u-3.55)/.65),handAlpha=smooth((u-.8)/.45)*(1-retreat);
      if(handAlpha>.01)anchoredCutout('rightHand',[308,473],legx+retreat*120,legy-retreat*30,221,-.22,handAlpha);
      if(repaired>.98){ellipse(frontL[0],frontL[1],17,4,'rgba(62,51,36,.10)',true);g.strokeStyle=C.gold;g.lineWidth=2;g.beginPath();g.moveTo(-59,93);g.lineTo(-42,89);g.stroke();}g.restore();
    }
'''
# C is also the global colour palette; keep the seat corner name distinct.
replacement=replacement.replace('C=[116,53]','frontCorner=[116,53]').replace('[A,B,C,D]','[A,B,frontCorner,D]').replace('B[0],C[0]','B[0],frontCorner[0]').replace('B[1],C[1]','B[1],frontCorner[1]').replace('timber(D,C,10)','timber(D,frontCorner,10)').replace('[A,B,C,D,A]','[A,B,frontCorner,D,A]').replace('timber(C,frontR,18)','timber(frontCorner,frontR,18)')
s=s[:a]+replacement+s[b:];p.write_text(s,encoding='utf8')
print('Envelope complete rectangular body and four narrow volume edges; chair uses consistent seat/post/stretcher projection.')
