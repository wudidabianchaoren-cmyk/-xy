from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'scripts/verify-v32-72-package.mjs';s=p.read_text('utf8');start=s.index("  const entry=");end=s.index("  await writeFile(root+'/先读这里.md'",start)
s=s[:start]+"  const entry=await readFile(dest+'/接续说明.md','utf8')+'\\n\\n当前完整E接续包：'+dest+'。本包独立8032运行及逐文件SHA校验通过；保存结果complete/currentPackageRunPassed双true。旧包冻结，直接运行项目/serve-preview.py看效果，无需重渲染。\\n';\n"+s[end:]
p.write_text(s,'utf8')
p=r/'scripts/save-current-v32-72.mjs';s=p.read_text('utf8').replace("const manifest=[];", "await writeFile(dest+'/工具恢复.md',(await readFile('VIDEO-TOOLS-V32-72.md','utf8'))+'\\n\\n异机恢复：将 项目/motion/remotion-v32-72/toolchain-lock/package.json 和 package-lock.json 复制到 E:/Brain-Universe-assets/V32-72/video-tools/，运行 npm ci --prefix E:/Brain-Universe-assets/V32-72/video-tools --cache E:/Brain-Universe-assets/V32-72/npm-cache。官方技能在安装技能/，复制到新工作区的 .agents/skills。Captions本地运行文件可运行项目/scripts/install-captions-runtime-v32-72.mjs重新生成；需要先运行 verify-video-tools-v32-72.mjs获取官方配置。运行网站不需要这些工具或云端密钥。\\n');\nconst manifest=[];")
p.write_text(s,'utf8')
p=r/'scripts/install-video-tools-v32-72.ps1'
ps='''$ErrorActionPreference='Stop'
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
'''
p.write_text(ps,'utf-8-sig')
print('New archive entry uses the actual V32.72 handoff; tool recovery scripts are idempotent.')
