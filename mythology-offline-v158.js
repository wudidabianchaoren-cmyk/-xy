/* Offline support is limited to this local cove and its own assets. */
(() => {
 const state=window.mythologyOffline={supported:'serviceWorker' in navigator,ready:false,files:0,error:null};
 if(!state.supported)return;
 const label=document.createElement('span');label.className='local-cove-offline';label.setAttribute('role','status');label.textContent='离线资源准备中';
 document.querySelector('.odyssey-stage')?.append(label);
 let registration;
 const show=data=>{Object.assign(state,data);label.textContent=data.ready?'离线资源已就绪':data.error?'离线资源未齐，可重新打开此页重试':`离线资源准备中${data.files?' · '+data.files:''}`;};
 navigator.serviceWorker.addEventListener('message',event=>{if(event.data?.type==='myth-offline-158')show(event.data);});
 const report=()=>registration?.active?.postMessage({type:'myth-offline-status-158'});
 navigator.serviceWorker.addEventListener('controllerchange',report);
 navigator.serviceWorker.register('./mythology-sw-v158.js',{scope:'./',updateViaCache:'none'}).then(async r=>{registration=r;await navigator.serviceWorker.ready;report();}).catch(error=>show({error:String(error)}));
})();
