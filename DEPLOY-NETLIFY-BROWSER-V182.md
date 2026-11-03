# Netlify V32.182 delivery repair

The user rejected V180. Its previous HTTP/standalone checks did not establish that the real visitor flow worked. V182 preserves the existing design, factual copy, original media, original UE project and original checkout; this is a delivery and navigation repair.

## Confirmed causes

- A legacy startup condition expected V31 in the document title. The actual Chinese title failed that condition; the old loader waited for window.load and intercepted clicks after the original film finished. Startup now uses the actual opening element/event and clears the obsolete overlay at handoff.
- Netlify Pretty URLs rewrote .html anchors to extensionless paths. Original navigation only recognised .html and allowed a native iframe navigation, losing the reading context and portal flag. Site processing now has html.pretty_urls=false. The delivery runtime also normalises known old extensionless routes and links before the authored handlers run.
- A capture listener took ownership of React notebook links and reloaded the entire main document. Notebook links keep their existing handler, with retained-document verification through all five works.
- Hidden mythology/desktop initialization competed with the active opening and movies. These scenes are prepared on approach/entry, while retained frames preserve returns. Work reveals use same-origin DOM readiness rather than every offscreen image finishing.
- The user's Edge has a translation extension. Standard translate=no/notranslate protects the original English/Chinese; this does not assert that every reported corrupt character was proven to come from translation.
- The intro's old HLS split did not actually present all 480 original frames. Seven transport chunks now reconstruct and play the exact original 25,344,593-byte MP4, without re-encoding or resizing.
- Transient asset failures now have bounded retries, including legacy vendor scripts, home modules, source textures and the locally vendored HLS player. The staging collector follows lazy module dependencies rather than relying only on an old file list. The obsolete native-worker registrations/caches are removed only for this site's own named workers.

## Reproduce the artifact

Build with the installed build-v161-ui.mjs, build-v165.mjs and build-reading-v157.mjs scripts after source changes. For a complete asset regeneration, run prepare-netlify-v180.py, optimize-home-lossless-v181.py, prepare-original-intro-v182.py, then stage-netlify-v180.py, in that order. Never write through the source asset junctions. Do not publish the raw Git root.

The exact static artifact is described by deploy/netlify-v182-asset-plan.json. Raw source media, UE/native executables, credentials, verification helpers and node_modules are excluded from the release and source backup. Git auto builds remain stopped to keep a source-only push from replacing the complete package. No paid service is opened.

## Verification

Run scripts/browser-v179/verify-public-flow-v182.mjs with PORTFOLIO_QA_ORIGIN set to the actual draft/production HTTPS origin, PORTFOLIO_QA_FRESH=1 and PORTFOLIO_QA_SEEK=1. It clicks the real exhibition index, reading shelf/page turn, mythology/night/return, desktop TV, notebook works, all five works/six video elements including midpoint playback, and final live-home return. It checks that the main document survives and no workstation backend is used. PORTFOLIO_QA_FAULT=1 deliberately fails one vendor script, home module, texture and HLS player to exercise recovery.

The final results and publication identity are recorded in deploy/browser-v182-release.json after the public run. A ready deploy, a 200 response or a local preview alone is not sufficient. V180 and initial failed V182 drafts remain in history as failed delivery evidence.

The browser renderer retains the original geometry/material inputs; it is not pixel-identical native UE. First visits still download substantial original media/models. This record does not certify all networks/GPUs, universal mainland/overseas reachability, zero dropped frames or the user's visual acceptance.
