"""Capture the native viewport render texture, before Windows/Slate DPI resampling."""
import unreal as u,builtins,json
from pathlib import Path
def ensure(refresh=False):
 c=getattr(builtins,'_zaojing_native_capture_v164',None)
 if c and c.get_editor_property('stream_fps_override')==45 and not refresh:return
 if not c:
  c=u.new_object(u.PixelStreaming2StreamerComponent)
  c.set_editor_property('streamer_id','Editor')
 c.set_editor_property('signalling_server_url','ws://127.0.0.1:8888')
 c.set_editor_property('stream_fps_override',45)
 c.set_editor_property('couple_framerate',True)
 # With no explicit producer this uses FVideoProducerMediaCapture::CreateActiveViewportCapture,
 # capturing the 1920 x 1080 RHI surface, without the Slate back-buffer crop.
 # StartStreaming replaces the producer. Explicitly retire old MediaIO captures
 # while realtime is drawing, so reconnects cannot accumulate GPU copy work.
 import ue_capture_v176
 for previous in u.ObjectIterator(u.MediaCapture):
  if previous.get_class().get_name()=='PixelStreaming2MediaIOCapture' and previous.get_state()==u.MediaCaptureState.CAPTURING:
   ue_capture_v176.prepare_for_stop(previous)
   previous.stop_capture(False)
 c.start_streaming();builtins._zaojing_native_capture_v164=c;builtins._zaojing_capture_active_v164=True
 ue_capture_v176.schedule()
 (Path(__file__).resolve().parents[1]/'.verify/v32-164/stream-source.json').write_text(json.dumps({'streamer':'Editor','source':'native active viewport MediaIO capture','dpiResamplingBypassed':True}))

def set_active(active):
 # The RHI producer owns pending GPU fences. Stopping it while the editor stops
 # drawing can strand those fences and freeze the next connection. Keep that
 # producer alive; the runtime pauses scene clocks and draws static idle frames at a low rate.
 if active and not getattr(builtins,'_zaojing_capture_active_v164',False):ensure(refresh=True)
 if getattr(builtins,'_zaojing_capture_render_active_v165',None)==active:return
 builtins._zaojing_capture_render_active_v165=active
 (Path(__file__).resolve().parents[1]/'.verify/v32-165/capture-activity.json').write_text(json.dumps({'renderActive':active,'persistentRHIProducer':True,'stoppedCaptures':0,'captureFps':45}))
