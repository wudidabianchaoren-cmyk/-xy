"""Operate observed controls in the user's existing Edge window, never cookies."""
from pathlib import Path
import sys,json,math,time
sys.path.insert(0,str(Path('.verify/v32-190/ui-tools').resolve()))
import uiautomation as u
window=u.ControlFromHandle(133456)
def nodes():
 for control,depth in u.WalkControl(window,maxDepth=30):
  try:
   r=control.BoundingRectangle
   if not control.IsOffscreen and all(math.isfinite(v)for v in[r.left,r.right,r.top,r.bottom])and r.right>r.left and r.bottom>r.top:yield control
  except Exception:pass
def select_tab(text):
 matches=[c for c in nodes()if c.ControlTypeName=='TabItemControl'and text in c.Name]
 if not matches:raise RuntimeError('Required Edge tab missing: '+text)
 matches[-1].GetSelectionItemPattern().Select();time.sleep(.25)
if len(sys.argv)>2 and sys.argv[1]=='tab':select_tab(sys.argv[2]);sys.exit()
if len(sys.argv)>1 and sys.argv[1]=='scroll':
 window.WheelDown(wheelTimes=5);print('Scrolled current Edge page');sys.exit()
if len(sys.argv)>1 and sys.argv[1]in['click','set','toggle']:
 action,name=sys.argv[1:3];kind=sys.argv[4]if action=='set'and len(sys.argv)>4 else sys.argv[3]if action!='set'and len(sys.argv)>3 else None
 matches=[c for c in nodes()if c.Name==name and(not kind or c.ControlTypeName==kind)]
 if len(matches)!=1:raise RuntimeError('Control match count '+str(len(matches))+': '+name)
 c=matches[0]
 kind=c.ControlTypeName
 if action=='set':c.GetValuePattern().SetValue(sys.argv[3])
 elif action=='toggle':c.GetTogglePattern().Toggle()
 else:
  try:c.GetInvokePattern().Invoke()
  except Exception:c.Click(simulateMove=False)
 print(json.dumps({'action':action,'control':name,'kind':kind}));sys.exit()
rows=[]
for c in nodes():
 if c.Name and c.ControlTypeName in ['ButtonControl','EditControl','HyperlinkControl','TextControl','RadioButtonControl','CheckBoxControl','ComboBoxControl','TabItemControl','DataItemControl']:
  rows.append({'name':c.Name,'type':c.ControlTypeName,'id':c.AutomationId})
Path('.verify/v32-190/edge-latest.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps([r for r in rows if not r['id'].startswith('view_')][-115:],ensure_ascii=True))
