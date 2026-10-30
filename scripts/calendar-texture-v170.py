from pathlib import Path
import json,sys
from PIL import Image,ImageDraw,ImageFont
from datetime import datetime,timedelta,timezone
root=Path(__file__).resolve().parents[1];out=root/'assets/calendar-v170';out.mkdir(exist_ok=True)
date=datetime.strptime(sys.argv[1],'%Y-%m-%d')if len(sys.argv)>1 else datetime.now(timezone(timedelta(hours=8)))
im=Image.new('RGB',(768,896),'#e7e3d8');d=ImageDraw.Draw(im);fonts=Path('C:/Windows/Fonts')
font=lambda name,size:ImageFont.truetype(str(fonts/name),size)
d.text((384,115),date.strftime('%B %Y').upper(),font=font('georgia.ttf',34),fill='#424441',anchor='mm');d.text((384,448),str(date.day),font=font('georgiab.ttf',350),fill='#762c23',anchor='mm');d.text((384,736),date.strftime('%A').upper(),font=font('georgia.ttf',32),fill='#44483e',anchor='mm')
im.save(out/'current.png');(out/'date.json').write_text(json.dumps({'date':date.strftime('%Y-%m-%d'),'timeZone':'Asia/Shanghai'}))
