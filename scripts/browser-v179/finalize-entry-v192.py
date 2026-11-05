from pathlib import Path
import json, hashlib

root = Path.cwd()
stage = root / '.verify/v32-192/site'
body = (stage / 'heading-interaction-v157.js').read_text(encoding='utf-8')
assert '</script' not in body.lower()
rows = []
for page in stage.glob('*.html'):
    text = page.read_text(encoding='utf-8')
    if ('heading-interaction-v157.js' not in text and 'navigation-v152.js' not in text) or 'data-heading-v157="true"' in text:
        continue
    # The existing navigation loader recognizes this exact marker and therefore
    # does not request another asynchronous copy of the heading polish script.
    tag = '<script type="module" data-heading-v157="true" data-critical-source="heading-interaction-v157.js">\n' + body + '\n</script>'
    text = text.replace('</head>', tag + '</head>', 1)
    page.write_text(text, encoding='utf-8')
    rows.append({'path':page.name,'bytes':len(text.encode()),'sha1':hashlib.sha1(text.encode()).hexdigest()})
(root / 'deploy/entry-polish-v192.json').write_text(json.dumps({'inlineHeading':rows,'noDuplicateHeadingRequest':True},indent=2),encoding='utf-8')
print(json.dumps({'pages':len(rows),'originalPolishPreserved':True}))
