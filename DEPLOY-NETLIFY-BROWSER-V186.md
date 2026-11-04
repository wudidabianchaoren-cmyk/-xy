# V32.186 delivery and performance repair

Existing portfolio and Netlify project only. Original UE project, source media and source assets are preserved. Annual total budget 20 CNY; no purchases or new services. Single agent; desktop scope. This release is an incremental repair. Functional test success must not be described as complete quality/performance acceptance.

## Changes

Installed and used `find-skills` from vercel-labs/skills, `threejs-performance` from cloudai-x/threejs-skills, and `web-perf` from cloudflare/skills. Installation sources and local instruction hashes: `deploy/installed-skills-v186.json`. Searches used `npx.cmd --yes skills find web performance` and `npx.cmd --yes skills find threejs performance`.

GLB embedded images are shared by content hash, with lossless WebP for PNGs only where smaller and exact decoded pixels match. Existing JPEG/AVIF payloads are copied. Canonical aliases remove duplicate image URLs. This does not turn the previous V185 AVIF/intro derivatives into mathematically lossless assets; those retain the measurements and limitations in the V185 record.

The world omits two obsolete engraving buffers that the unchanged V25 detail unconditionally replaces before rendering. Nodes, materials, animation and retained buffer views are preserved; original GLBs are not overwritten. Six derived models use Meshopt with NONE filter, no quantization, reordering or simplification. Every encoded view is decoded and byte-compared before delivery. The world uses three coalesced requests instead of twenty-two, with identical compressed payload bytes. See `shared-images-v186.json`, `replaced-geometry-v186.json` and `lossless-geometry-v186.json`.

Actual courtyard GLSL sources are precompiled in the same WebGL context while assets download. Normal Three compilation and validation still run. Failure safely falls back to ordinary compilation. No program/material injection or renderer switch is used. Original light BRDF/order remain. Representative final compilation in the final public draft was 0.27 seconds; complete loading is still longer than authored film duration.

Home models and their exact shared image jobs start earlier. Worker pixel extraction and cooperative texture uploads retain decoded pixels, sampler settings, UV transforms and context restoration. Three 2048-pixel test images produced zero differing channels. Identical uploaded sources can be reused. Original per-scene quality remains.

Critical scripts/styles are packed or inlined in authored order, and actual module graphs are preloaded. The progressive media helper embeds manifests/init headers and fetches four future segments in parallel, appending in order with real seek cancellation. The original 20-second opening is copy-fragmented with encoded video packet hashes unchanged. Six work films retain their original streams. With injected 1.5-second latency on every segment, a 14-second sample advanced normally with 423 video frames and zero sampled drops or waits.

Myth background preparation now starts on reading-shelf intent after the shelf is ready. Parked preparation downloads only resources and defers scene/GPU work until activation. This avoids the rejected early-prewarm regression that delayed shelf and desktop entry. All native lighting fields remain. Shader endpoint samples and fallback reuse avoid redundant texture reads without changing the full PBR fallback. Sea, ship, sails, crew, birds, day/night and original controls are retained.

## Rejected experiments and limits

Spot-light uniform-loop compilation caused more than 90 seconds of compilation and was reverted. Exact source-cache sharing saved only one program and was reverted. Per-leaf day/night lighting retained every source card and wind vertex but changed some tree highlights; an isolated sample improved about 13.2 to 17.7 FPS, still below the target. It remains query-only (`nativeLeafRadiance186`), disabled in ordinary visits, and is not claimed as accepted artwork. Original PBR/default MSAA remain enabled.

Default myth performance remains around 14 FPS on the tested Iris Xe integrated GPU. Source scene is about five million triangles per frame. No claim of zero stutter, native UE pixel parity, universal instant loading, worldwide availability or user acceptance is justified. Window/side-view and myth off-axis source-field limitations from earlier records are not declared resolved by a click test.

## Validation and reproduction

Build `python scripts/browser-v179/build-release-v186.py`: modern186, fallback186, stage, packed CSS/classic/critical delivery, preservation of published185 modules, then manifest. Geometry preparation is `share-images-v186.py`, `canonical-images-v186.py`, `omit-replaced-geometry-v186.py`, `lossless-geometry-v186.mjs`, with opening preparation `prepare-opening-media-v186.py`. Do not reset resource maps with old build scripts. Repeating the image preparation resets subsequent geometry mappings, so repeat the whole dependent preparation chain when intentionally regenerating assets.

New assets belong only to real `assets/browser-v186`; existing junctions are read-only inputs. Derived binaries/media remain locally and in the Netlify artifact, while derivation scripts, proof manifests, rendering sources and the shader warm-up source pack are backed up in the existing GitHub branch. Old185 modules remain immutable for cached visitors. Auto Git builds stay stopped; upload only the frozen staged manifest, not the repository root.

Fourteen actual room mouse steps passed locally: lamp, five CDs with arrival-before-screen checks, cinema book, all four window routes/intermediate captures, left/right look and actual WEBGL context loss/restoration. Final draft7 passed twelve anonymous public click/play/midpoint/return steps with sampled page/console/HTTP/native errors zero. Six films include midpoint playback; the retained main document returns live. Final draft live home was 55.98 seconds and both authored films finished at 61.69 seconds, compared with the previous formal185 entry still unready at 263.5 seconds. These are measured runs, not a general guarantee. Final production promotion, artifact hashes and formal-origin results are in `deploy/browser-v186-release.json` and accompanying production records.

## Final formal state and held experiment

Production6aeb132267752522e800789e/sourceb7e778297ef8b9d69626c5f5a9e7aaf3dcf64894 passed50formal hashes and12step flow. Home59.90s, films62.27s, myth78.86s. Six explicit-count6sec work-film samples passed, five without drops and one2/146drops. Default IrisXe myth~15.34FPS remains below target. allRequirementsComplete=false, qualityApproved=false.

Later reversible numeric-depth trial14,946,510->5,865,422bytes reconstructed all6originalSHA256values locally, but draft8 public delivery FAILED:18HTTP2 protocol console errors and home199.10s. NOT promoted. Default code/build/aliases restored to publishedb7e7782. Experimental scripts/helper/patch/proofs retained disconnected from normal rendering.186d local-only namespace archived. Published immutable186 entries must be retained; a future delivery revision needs fresh URLs. Network concurrency contention is a hypothesis, not a proven cause or shipped fix.
