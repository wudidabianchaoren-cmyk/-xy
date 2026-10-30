$ErrorActionPreference='Stop'
$portfolioRoot=[System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$evidenceRoot=Join-Path $portfolioRoot '.verify/v32-149'
$bridgeScript=Join-Path $portfolioRoot 'tools/pixel-streaming-v149/server.cjs'
New-Item -ItemType Directory -Path $evidenceRoot -Force | Out-Null
$signalReady=$false
try{$null=Invoke-RestMethod -Uri 'http://127.0.0.1:8089/health' -TimeoutSec 2;$signalReady=$true}catch{}
if(-not $signalReady){
 $signalProcess=Start-Process -FilePath 'E:/nodejs/node.exe' -ArgumentList @('"'+$bridgeScript+'"') -WorkingDirectory (Split-Path $bridgeScript) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $evidenceRoot 'signal.out.log') -RedirectStandardError (Join-Path $evidenceRoot 'signal.err.log')
 $signalProcess.Id | Set-Content -LiteralPath (Join-Path $evidenceRoot 'signal.pid')
}
$existingCove=Get-CimInstance Win32_Process -Filter "Name='UnrealEditor.exe'" | Where-Object {$_.CommandLine -match 'ZaOjIngV146.uproject'}
if(-not $existingCove){
 $liveScript=Join-Path $portfolioRoot 'scripts/ue-live-bootstrap-v149.py'
 if(-not (Test-Path -LiteralPath $liveScript)){throw 'UE live bootstrap is missing.'}
 $arguments=@('"E:/codex/unreal/ZaOjIngV146/ZaOjIngV146.uproject"','/Game/Cove/FullCoveV149','-dx12','-force_high_performance_gpu','-ddc=InstalledNoZenLocalFallback','-unattended','-nosplash','-NoSound','-ResX=1600','-ResY=900','-Windowed','-RenderOffscreen','-EditorPixelStreamingRes=2200x1400','-PixelStreamingConnectionURL=ws://127.0.0.1:8888','-PixelStreamingEditorStartOnLaunch=true','-PixelStreamingEditorSource=LevelEditorViewport','-PixelStreamingEditorUseRemoteSignallingServer=true','-PixelStreamingEncoderCodec=VP8',('-ExecutePythonScript="'+$liveScript+'"'),('-abslog="'+(Join-Path $evidenceRoot 'ue-live-runtime.log')+'"'))
 $coveProcess=Start-Process -FilePath 'D:/Epic/UE_5.8/Engine/Binaries/Win64/UnrealEditor.exe' -ArgumentList $arguments -WindowStyle Hidden -PassThru
 $coveProcess.Id | Set-Content -LiteralPath (Join-Path $evidenceRoot 'ue.pid')
}
Write-Output 'UE cove local runtime started. Open http://127.0.0.1:8031/mythology.html?v=32.149'
