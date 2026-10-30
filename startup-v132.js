/* One entry gate owns preparation; chapters retain their already-created scenes. */
(()=>{
 const entries=new Map(['home','directory'].map(name=>[name,{state:'pending',error:''}]));
 const emit=()=>window.dispatchEvent(new CustomEvent('v132:boot-progress',{detail:Object.fromEntries(entries)}));
 window.portfolioBoot={
  entries,complete(name){entries.set(name,{state:'ready',at:performance.now()});emit();},
  fail(name,error){entries.set(name,{state:'error',error:String(error)});emit();},
  async wait(){const began=performance.now();while(true){const values=[...entries.values()];if(values.every(v=>v.state==='ready'))return;if(values.some(v=>v.state==='error'))throw Error(values.find(v=>v.state==='error').error);if(performance.now()-began>90000)throw Error('场景准备超时，请重试');await new Promise(r=>setTimeout(r,100));}},
  async homeGPU(){while(entries.get('home').state==='pending')await new Promise(r=>setTimeout(r,50));}
 };
})();
