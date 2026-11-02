from pathlib import Path
from PIL import Image
import math, statistics
folder=Path('assets/browser-v179/myth-field')
# Native sky over the unobstructed left horizon, indexed by world elevation.
# This avoids projecting a finite view's ocean pixels onto a distant sky sphere.
def normalized(v):
 length=math.sqrt(sum(n*n for n in v));return [n/length for n in v]
def cross(a,b):return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
direction=normalized([-43,-8,-65]);right=normalized(cross(direction,[0,1,0]));up=cross(right,direction)
slopes=[]
for row in range(360):
 vy=(1-2*(row+.5)/1080)*math.tan(math.radians(17));vx=(2*50.5/1920-1)*math.tan(math.radians(17))*16/9
 ray=normalized([direction[j]+up[j]*vy+right[j]*vx for j in range(3)]);slopes.append(ray[1])
for mode in ['day','night']:
 image=Image.open(folder/f'coast-{mode}.png').convert('RGB')
 colors=[[statistics.median(image.getpixel((x,y))[c] for x in range(10,90)) for c in range(3)] for y in range(360)]
 output=Image.new('RGB',(256,1))
 for i in range(256):
  elevation=i/255*.25
  j=min(range(360),key=lambda n:abs(slopes[n]-elevation));output.putpixel((i,0),tuple(round(v) for v in colors[j]))
 output.save(folder/f'sky-{mode}.png')
