from pathlib import Path
import json
P=Path('E:/codex/unreal/ZaOjIngV146');(P/'Config').mkdir(parents=True,exist_ok=True)
(P/'ZaOjIngV146.uproject').write_text(json.dumps({'FileVersion':3,'EngineAssociation':'5.8','Category':'Portfolio','Description':'Native coastal look development','Plugins':[{'Name':'PythonScriptPlugin','Enabled':True},{'Name':'EditorScriptingUtilities','Enabled':True}]},indent=2),encoding='utf-8')
(P/'Config/DefaultEngine.ini').write_text('''[/Script/Engine.RendererSettings]
r.DynamicGlobalIlluminationMethod=1
r.ReflectionMethod=1
r.GenerateMeshDistanceFields=True
r.Shadow.Virtual.Enable=1
r.Nanite.ProjectEnabled=True
r.AllowStaticLighting=False
r.DefaultFeature.AutoExposure=False
r.DefaultFeature.MotionBlur=False
[/Script/WindowsTargetPlatform.WindowsTargetSettings]
DefaultGraphicsRHI=DefaultGraphicsRHI_DX12
+D3D12TargetedShaderFormats=PCD3D_SM6
[/Script/EngineSettings.GameMapsSettings]
EditorStartupMap=/Game/Cove/Lookdev
''',encoding='utf-8')
print(P)
