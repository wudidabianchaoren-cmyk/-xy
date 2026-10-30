"""Print the Shanghai date on the original world-space paper; use room light, never emission."""
import unreal as u,time,json,subprocess,shutil,os
from pathlib import Path
from datetime import datetime,timedelta,timezone
P=Path(__file__).resolve().parents[1];date_key=None;checked=0.;pending=None;generation_key=None

def update(cache):
 global date_key,checked,pending,generation_key
 now=time.monotonic()
 if pending is not None:
  if pending.poll()is None:return
  if pending.returncode!=0:raise RuntimeError('Calendar texture generation failed')
  pending=None
  task=u.AssetImportTask();task.filename=str(P/'assets/calendar-v170/current.png');task.destination_path='/Game/V170';task.destination_name='CalendarDate';task.replace_existing=True;task.automated=True;task.save=True;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);texture=u.load_asset('/Game/V170/CalendarDate');assert texture
  mat=u.load_asset('/Game/V170/PrintedCalendar');mel=u.MaterialEditingLibrary
  if not mat:
   mat=u.AssetToolsHelpers.get_asset_tools().create_asset('PrintedCalendar','/Game/V170',u.Material,u.MaterialFactoryNew());mat.set_editor_property('two_sided',True);sample=mel.create_material_expression(mat,u.MaterialExpressionTextureSampleParameter2D);sample.set_editor_property('parameter_name','PrintedDate');sample.texture=texture;mel.connect_material_property(sample,'RGB',u.MaterialProperty.MP_BASE_COLOR)
   rough=mel.create_material_expression(mat,u.MaterialExpressionConstant);rough.r=1.;mel.connect_material_property(rough,'',u.MaterialProperty.MP_ROUGHNESS);mel.recompile_material(mat);u.EditorAssetLibrary.save_loaded_asset(mat)
  matches=[]
  for a in cache.values():
   if isinstance(a,u.StaticMeshActor)and a.static_mesh_component.static_mesh and a.static_mesh_component.static_mesh.get_name()=='Live_clean_white_calendar_page___Asia_Shanghai':
    mid=a.static_mesh_component.create_dynamic_material_instance(0,mat);mid.set_texture_parameter_value('PrintedDate',texture);matches.append(a.get_actor_label())
  assert len(matches)==1,'Exactly one original native calendar page is required'
  date_key=generation_key;(P/'.verify/v32-170/calendar-native.json').write_text(json.dumps({'date':date_key,'timeZone':'Asia/Shanghai','actors':matches,'nativeWorldSpace':True,'emissive':False,'at':time.time()}))
 if now-checked<15:return
 checked=now;key=datetime.now(timezone(timedelta(hours=8))).strftime('%Y-%m-%d')
 if key==date_key:return
 generation_key=key;exe=os.environ.get('PORTFOLIO_PYTHON')or shutil.which('python');assert exe,'Python is required for daily calendar texture'
 pending=subprocess.Popen([exe,str(P/'scripts/calendar-texture-v170.py'),key],creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
