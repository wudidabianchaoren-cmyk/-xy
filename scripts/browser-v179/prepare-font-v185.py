from pathlib import Path
import hashlib, json
from fontTools import subset
from fontTools.ttLib import TTFont

root=Path.cwd()
source=root/'assets/directory-v119/handwriting.ttf'
out=root/'assets/browser-v185/fonts'
out.mkdir(parents=True,exist_ok=True)
assert out.resolve().is_relative_to(root.resolve())
files=[*root.glob('*.html'),*root.glob('*.js'),*root.glob('src/**/*.ts'),*root.glob('src/**/*.tsx'),*root.glob('src/**/*.jsx')]
text=''.join(path.read_text(encoding='utf-8-sig') for path in files)
codes=set(range(32,127))|{ord(c)for c in text if ord(c)>127}
font=TTFont(source)
original=len(font.getBestCmap())
options=subset.Options()
options.flavor='woff2'
options.name_IDs=['*']
subsetter=subset.Subsetter(options=options)
subsetter.populate(unicodes=codes)
subsetter.subset(font)
font.flavor='woff2'
target=out/'directory-hand.woff2'
font.save(target)
check=TTFont(target)
expected=set(TTFont(source).getBestCmap())&codes
assert expected<=set(check.getBestCmap())
record={'source':'assets/directory-v119/handwriting.ttf','target':target.relative_to(root).as_posix(),'sourceBytes':source.stat().st_size,'bytes':target.stat().st_size,'sourceGlyphs':original,'retainedGlyphs':len(check.getBestCmap()),'requiredSourceCharactersPreserved':True,'sourceUnmodifiedSHA256':hashlib.sha256(source.read_bytes()).hexdigest()}
(root/'deploy/font-v185.json').write_text(json.dumps(record,indent=2),encoding='utf-8')
print(json.dumps(record))
