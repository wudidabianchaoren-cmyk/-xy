"""Six actual native frames across twenty wall-clock seconds, with matching motion state."""
from pathlib import Path
import json,time
V153=P/'.verify/v32-153';captureDir153=V153/'dynamic-20s';captureDir153.mkdir(exist_ok=True);captureStart153=time.monotonic();captureIndex153=0;captureStates153=[];captureHandle153=None
def captureTick153(dt):
 global captureIndex153,captureHandle153
 elapsed=time.monotonic()-captureStart153
 if captureIndex153<6 and elapsed>=3+captureIndex153*4:
  state=json.loads((V153/'ue-motion-state.json').read_text(encoding='utf-8'));state['captureElapsed']=elapsed;state['file']='frame-%02d.png'%captureIndex153;captureStates153.append(state);u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(captureDir153/state['file']),camera=cam);captureIndex153+=1
 if captureIndex153==6:
  (captureDir153/'states.json').write_text(json.dumps({'wallClockSpanSeconds':captureStates153[-1]['captureElapsed']-captureStates153[0]['captureElapsed'],'actualNativeFrames':6,'states':captureStates153},indent=2),encoding='utf-8');u.unregister_slate_post_tick_callback(captureHandle153)
captureHandle153=u.register_slate_post_tick_callback(captureTick153)
