/* Only the scene being revealed can block the opening film. */
(()=>{
 const entries=new Map(['home','directory','mythology'].map(name=>[name,{state:'pending',error:''}]));
 const required=new Set(['home']);
 const emit=()=>window.dispatchEvent(new CustomEvent('v132:boot-progress',{detail:Object.fromEntries(entries)}));
 window.portfolioBoot={entries,required,requireForOpening(name){required.add(name);emit();},
  complete(name){entries.set(name,{state:'ready',at:performance.now()});emit();},
  fail(name,error){entries.set(name,{state:'error',error:String(error)});emit();},
  async wait(){const began=performance.now();while([...required].some(name=>entries.get(name)?.state!=='ready')){const failure=[...required].find(name=>entries.get(name)?.state==='error');if(failure)throw Error(entries.get(failure).error);if(performance.now()-began>30000)throw Error('First-frame preparation timed out');await new Promise(r=>setTimeout(r,50));}},
  async homeGPU(){while(entries.get('home').state==='pending')await new Promise(r=>setTimeout(r,50));}
 };
})();
