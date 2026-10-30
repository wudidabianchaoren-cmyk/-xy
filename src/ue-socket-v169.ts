import{WebSocketTransport}from'../tools/pixel-streaming-v149/node_modules/@epicgames-ps/lib-pixelstreamingcommon-ue5.8/dist/esm/Transport/WebSocketTransport.js';
/** ICE callbacks can race a reconnect. Only send on this socket after OPEN. */
const prototype=WebSocketTransport.prototype as any;
if(!prototype.portfolioReadyGuardV169){
 prototype.portfolioReadyGuardV169=true;
 const pending=new WeakMap<WebSocket,string[]>();
 prototype.isConnected=function(){return this.webSocket?.readyState===WebSocket.OPEN;};
 prototype.sendMessage=function(message:string){
  const socket=this.webSocket as WebSocket|undefined;if(!socket)return;
  if(socket.readyState===WebSocket.OPEN){socket.send(message);return;}
  if(socket.readyState!==WebSocket.CONNECTING)return;
  let queue=pending.get(socket);if(!queue){queue=[];pending.set(socket,queue);socket.addEventListener('open',()=>{const messages=pending.get(socket)||[];pending.delete(socket);if(this.webSocket===socket&&socket.readyState===WebSocket.OPEN)for(const item of messages)socket.send(item);},{once:true});socket.addEventListener('close',()=>pending.delete(socket),{once:true});}
  if(queue.length<128)queue.push(message);
 };
}
