const web=new URLSearchParams(location.search).get('renderer')==='web';
const entry=web?'./mythology-web-v165.js?v=32.183':'./mythology-native-v165.js?v=32.183';
await import(/* @vite-ignore */ entry);
if(web&&new URLSearchParams(location.search).get('nativeLightfield')!=='1'){const script=document.createElement('script');script.src='./mythology-offline-v162.js?v=32.183';document.body.append(script);}
else if(!web&&'serviceWorker'in navigator)void navigator.serviceWorker.register('./mythology-sw-v167.js?v=32.183',{scope:'./',updateViaCache:'none'}).catch(()=>{});
