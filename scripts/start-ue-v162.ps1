param([ValidateSet('home','myth','room')][string]$Scene='home',[ValidateSet('VP9','VP8','H264')][string]$Codec='VP9')
$taskStartupMutex=New-Object System.Threading.Mutex($false,'Local\ZaojingNativeUEStartupV165')
if(-not $taskStartupMutex.WaitOne(0)){Write-Output 'Native viewport startup already in progress';$taskStartupMutex.Dispose();return}
try{
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
$stateRoot=Join-Path $projectRoot '.verify/v32-162'
$previewReady=$false
try{$previewReady=(Invoke-WebRequest 'http://127.0.0.1:8031/v31.html' -Method Head -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200}catch{}
if(-not $previewReady){
 $previewArgs='"'+(Join-Path $projectRoot 'serve-preview.py')+'"'
 $previewProcess=Start-Process -FilePath 'C:/Users/HP/AppData/Local/Programs/Python/Python313/python.exe' -ArgumentList $previewArgs -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
 $previewProcess.Id | Set-Content (Join-Path $stateRoot 'preview.pid')
}
$health=$null
try{$health=Invoke-RestMethod 'http://127.0.0.1:8089/health' -TimeoutSec 2}catch{}
if(-not $health){
 $existingSignal=Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object {$_.CommandLine -like '*server-v162.cjs*'} | Select-Object -First 1
 if($existingSignal){
  for($signalWait=0;$signalWait -lt 30;$signalWait++){
   try{$health=Invoke-RestMethod 'http://127.0.0.1:8089/health' -TimeoutSec 1;if($health){break}}catch{}
   Start-Sleep -Milliseconds 300
  }
  if(-not $health){throw 'The existing local control service did not become ready. No duplicate was started.'}
 }else{
 $signalArgs='"'+(Join-Path $projectRoot 'tools/pixel-streaming-v149/server-v162.cjs')+'"'
 $signalProcess=Start-Process -FilePath 'E:/nodejs/node.exe' -ArgumentList $signalArgs -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
 $signalProcess.Id | Set-Content (Join-Path $stateRoot 'signal.pid')
 }
}
$editorProcess=Get-CimInstance Win32_Process -Filter "Name='UnrealEditor.exe'" | Where-Object {$_.CommandLine -like '*ZaOjIngV146.uproject*'} | Select-Object -First 1
if(-not $editorProcess){
 $pythonScript=(Join-Path $projectRoot 'scripts/ue-live-final-v162.py').Replace('\','/')
 $logFile=(Join-Path $stateRoot 'ue-live-runtime.log').Replace('\','/')
 $editorArgs='"E:/codex/unreal/ZaOjIngV146/ZaOjIngV146.uproject" -unattended -RenderOffScreen -PortfolioInitialScene='+$Scene+' -dx12 -force_high_performance_gpu -ddc=InstalledNoZenLocalFallback -nosplash -NoSound -ResX=1600 -ResY=900 -Windowed -EditorPixelStreamingRes=1920x1080 -PixelStreamingConnectionURL=ws://127.0.0.1:8888 -PixelStreamingEditorStartOnLaunch=true -PixelStreamingEditorSource=LevelEditorViewport -PixelStreamingEditorUseRemoteSignallingServer=true -PixelStreamingEncoderCodec='+$Codec+' -ExecCmds="MediaIO.EnableExperimentalScheduling 0" -ExecutePythonScript="'+$pythonScript+'" -abslog="'+$logFile+'"'
 $newEditor=Start-Process -FilePath 'D:/Epic/UE_5.8/Engine/Binaries/Win64/UnrealEditor.exe' -ArgumentList $editorArgs -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
 $newEditor.Id | Set-Content (Join-Path $stateRoot 'ue.pid')
}
$runningEditorForV165=Get-CimInstance Win32_Process -Filter "Name='UnrealEditor.exe'" | Where-Object {$_.CommandLine -like '*ZaOjIngV146.uproject*'} | Select-Object -First 1
$nativeProcessStartedAt=if($runningEditorForV165){[DateTimeOffset]::new((Get-Process -Id $runningEditorForV165.ProcessId).StartTime.ToUniversalTime()).ToUnixTimeSeconds()}else{[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()}
$streamReady=$false
for($readyAttempt=0;$readyAttempt -lt 300;$readyAttempt++){
 try{$nativeHealth=Invoke-RestMethod 'http://127.0.0.1:8089/health' -TimeoutSec 2;$heartbeatAge=[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()-$nativeHealth.native.heartbeat;if($nativeHealth.streamers.Count -gt 0 -and $nativeHealth.native.phase -eq 'native viewport live' -and $heartbeatAge -lt 6 -and [double]$nativeHealth.native.startedAt -ge ($nativeProcessStartedAt-1)){$streamReady=$true;break}}catch{}
 Start-Sleep -Milliseconds 1000
}
if(-not $streamReady){throw 'The local UE viewport did not become ready. See .verify/v32-162/ue-live-runtime.log.'}
Write-Output 'Local UE5.8.4 viewport service ready. Preview: http://127.0.0.1:8031/v31.html?v=32.171'

}finally{$taskStartupMutex.ReleaseMutex();$taskStartupMutex.Dispose()}
