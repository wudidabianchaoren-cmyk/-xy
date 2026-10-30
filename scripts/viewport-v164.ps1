$ErrorActionPreference='Stop'
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class V164Viewport {
 [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
 [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h,int n);
 [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h,uint m,IntPtr w,IntPtr l);
 [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h,out RECT r);
 public struct RECT {public int left,top,right,bottom;}
}
'@
$ueProcess=Get-Process -Id ([int](Get-Content (Join-Path $PSScriptRoot '../.verify/v32-162/ue.pid')))
$ueWindow=$ueProcess.MainWindowHandle
if($ueWindow -eq 0){throw 'Owned Unreal Editor window missing'}
[V164Viewport]::ShowWindow($ueWindow,3)|Out-Null
[V164Viewport]::SetForegroundWindow($ueWindow)|Out-Null
$rect=New-Object V164Viewport+RECT
[V164Viewport]::GetClientRect($ueWindow,[ref]$rect)|Out-Null
# Focus only this editor's level viewport, then its standard immersive shortcut.
$x=[int]($rect.right*.5);$y=[int]($rect.bottom*.4);$point=[IntPtr](($y -shl 16) -bor $x)
[V164Viewport]::PostMessage($ueWindow,0x201,[IntPtr]1,$point)|Out-Null
[V164Viewport]::PostMessage($ueWindow,0x202,[IntPtr]0,$point)|Out-Null
[V164Viewport]::PostMessage($ueWindow,0x100,[IntPtr]0x7A,[IntPtr]0)|Out-Null
[V164Viewport]::PostMessage($ueWindow,0x101,[IntPtr]0x7A,[IntPtr]0)|Out-Null
"Immersive shortcut sent to owned UE PID $($ueProcess.Id); client $($rect.right)x$($rect.bottom)"
