from pathlib import Path
r=Path(__file__).resolve().parents[1]
s=(r/'.verify/run-v32-72-regressions.mjs').read_text('utf8')
s=s.replace("  local", "  local")
s=s.replace("s=s.replace(\"const before=await page.evaluate(()=>scrollY);\",\"await page.locator('[data-odyssey-close]').click();const before=await page.evaluate(()=>scrollY);\");", "s=s.replace(\"const before=await page.evaluate(()=>scrollY);\",\"await page.locator('[data-odyssey-close]').click();await page.evaluate(()=>window.__v31Lenis.scrollTo(document.getElementById('odysseyIntroduction'),{immediate:true,force:true}));await page.waitForTimeout(400);const before=await page.evaluate(()=>scrollY);\");")
s=s.replace("for(const name of ['verify-v32-61-particles.mjs','verify-v32-61-entry.mjs','verify-local-scenes.mjs'])", "for(const name of (process.argv.includes('--targeted')?['verify-v32-61-particles.mjs','verify-local-scenes.mjs']:['verify-v32-61-particles.mjs','verify-v32-61-entry.mjs','verify-local-scenes.mjs']))")
(r/'.verify/run-v32-72-regressions.mjs').write_text(s,'utf8')
