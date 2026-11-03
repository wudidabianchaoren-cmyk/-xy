/** Keep the original texture object/material settings while retrying a failed download. */
export function installTextureNetworkRetry(three:any){
 const prototype=three.TextureLoader.prototype;if(prototype.portfolioNetworkRetry)return;prototype.portfolioNetworkRetry=true;const original=prototype.load;
 prototype.load=function(url:string,onLoad?:Function,onProgress?:Function,onError?:Function){
  const loader=this;let result:any,attempt=0;
  const request=()=>{const address=new URL(url,location.href);if(attempt&&/^https?:$/.test(address.protocol))address.searchParams.set('assetRetry',String(attempt));
   return original.call(loader,attempt?address.href:url,(texture:any)=>{if(texture!==result){result.image=texture.image;result.needsUpdate=true;}onLoad?.(result);},onProgress,(error:any)=>{
    if(attempt++<2&&/^https?:$/.test(address.protocol)){const diagnostic=(window as any).portfolioDeliveryState;if(diagnostic)(diagnostic.recoveredTextureAttempts??=[]).push({url,attempt});setTimeout(request,attempt*400);}else{const failure=new Error('Texture download failed: '+address.pathname);const diagnostic=(window as any).portfolioDeliveryState;if(diagnostic)(diagnostic.textureFailures??=[]).push({url:address.pathname,attempts:attempt});onError?.(failure);}
   });
  };result=request();return result;
 };
}
