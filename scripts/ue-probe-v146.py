import unreal,json
from pathlib import Path
P=Path('E:/codex/unreal/ZaOjIngV146');P.mkdir(parents=True,exist_ok=True)
out={'engine':unreal.SystemLibrary.get_engine_version()}
for name in ['FbxImportUI','FbxStaticMeshImportData','StaticMeshEditorSubsystem','AutomationLibrary','MaterialEditingLibrary','EditorAssetLibrary','AssetImportTask']:
 c=getattr(unreal,name,None);out[name]={'doc':str(c.__doc__)[:12000] if c else None,'methods':[x for x in dir(c) if any(k in x for k in ['nanite','import','screenshot','texture','save','finish','material'])] if c else []}
(P/'api-probe.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
unreal.log('V146_API_PROBE_READY')
