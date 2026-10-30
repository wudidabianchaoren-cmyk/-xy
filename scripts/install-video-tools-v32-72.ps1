$ErrorActionPreference='Stop'
$toolRoot='E:/Brain-Universe-assets/V32-72/video-tools'
New-Item -ItemType Directory -Path $toolRoot -Force | Out-Null
$env:TMPDIR='E:/Brain-Universe-assets/V32-72/download-tmp'
New-Item -ItemType Directory -Path $env:TMPDIR -Force | Out-Null
$env:TEMP=$env:TMPDIR
$env:TMP=$env:TMPDIR
if(-not (Test-Path -LiteralPath (Join-Path $toolRoot 'node_modules/remotion/package.json'))){
 Copy-Item -LiteralPath 'motion/remotion-v32-72/toolchain-lock/package.json' -Destination (Join-Path $toolRoot 'package.json')
 Copy-Item -LiteralPath 'motion/remotion-v32-72/toolchain-lock/package-lock.json' -Destination (Join-Path $toolRoot 'package-lock.json')
 & 'E:/nodejs/npm.cmd' ci --prefix $toolRoot --cache 'E:/Brain-Universe-assets/V32-72/npm-cache'
 if($LASTEXITCODE -ne 0){throw 'Official tool download failed'}
}
$installer='F:/codex吴翔宇/skills/.system/skill-installer/scripts/install-skill-from-github.py'
$skillDest=Join-Path (Resolve-Path '..').Path '.agents/skills'
$packages=@(
 @{repo='heygen-com/hyperframes';path='skills/hyperframes'},
 @{repo='heygen-com/hyperframes';path='skills/hyperframes-animation'},
 @{repo='heygen-com/hyperframes';path='skills/hyperframes-cli'},
 @{repo='remotion-dev/skills';path='skills/remotion-best-practices'},
 @{repo='elevenlabs/skills';path='text-to-speech'},
 @{repo='elevenlabs/skills';path='sound-effects'},
 @{repo='elevenlabs/skills';path='music'}
)
foreach($item in $packages){
 $name=($item.path -split '/')[-1]
 if(-not (Test-Path -LiteralPath (Join-Path $skillDest $name))){
  & python $installer --repo $item.repo --path $item.path --dest $skillDest
  if($LASTEXITCODE -ne 0){throw ('Skill installation failed: '+$name)}
 }
}
Write-Output 'Official local tools and skills available. Cloud account authorization is separate.'
