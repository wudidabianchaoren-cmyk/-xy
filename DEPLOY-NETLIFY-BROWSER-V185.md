# V32.185 repair and verification

User scope: eight-hour desktop repair, same Netlify portfolio, original design and source UE/media preserved. Start2026-11-03T18:45:12Z; deadline2026-11-04T02:45:12Z. Annual total20CNY; no purchases, other provider, engine/driver install, native recapture or raw input overwrite. Single agent. This is a partial repair, not proof of universal stability, zero stutter or original UE pixel parity.

## Implemented

Shared modern Three/React modules replace duplicated engine bundles. Ordered classic scripts and per-page styles are packed for delivery, retaining authored execution/style order. The directory's original font is subset to the glyphs used by the site (603820bytes versus5.86MB). Critical ESM entries have independent recovery bundles. Compressed model segments and textures retry bounded failures. Graphics-context loss displays an actual recovery surface and restores the room rather than silently retaining a blank canvas. Cooperative texture uploads now isolate shared glTF Texture.Source objects; original pixels and sampler settings remain available after context restoration.

The16second480frame1920x1080 courtyard movie has a6.706MB high-quality AV1 derivative, compared with the original25.346MB. SSIM0.993847 against the original; this is high-quality transcoding, NOT mathematically lossless. The original is preserved and serves as a compatibility fallback. Six existing H264 video streams are also offered as small fMP4 fragments without video-packet changes, with bounded buffering and real keyframe-anchored midpoint seeking. Work covers remain visible until a real video frame exists. Embedded videos wait for their parent visibility message. Source films, authored English and project text remain unchanged.

Home model geometry and scene tables remain byte-identical; selected RGB images use original-dimension AVIF quality98/4:4:4 with measured channel RMS<=2/255 and maximum<=24/255. These image derivatives are NOT lossless. Original assets are unchanged. See transfer-v185.json. A later generic meshopt experiment was rejected and is not enabled or uploaded; it provided insufficient transfer savings. An opening-film AV1 experiment was also rejected (little size benefit); the original20second opening remains the delivery source.

The room's static surfaces use4096 lossless WebP object-space lighting derived from the nine already preserved native source views, with original PBR for unseen surfaces. Original triangles, vertex attributes, physical objects, TV/video/calendar, movable CD/book interactions and controls remain. Static compatible parts batch together; point-light shadows refresh when a physical caster moves. The distant Berlin panorama is excluded from indoor source projection. This removes the camera-dependent indoor ghosting on that panorama and stabilizes cabinet illumination. Calendar date remains dynamic and upright. Cinema header return first closes the book to the shelf, then a separate return leaves the shelf.

Myth retains full PBR and default MSAA. Water/ship/crew/sails and seven seaward gulls use wall-clock animation. Compatible crew parts batch without changing sampled world vertices. Static reflected geometry is cached with depth while moving ship/birds redraw. Shadow restoration is bounded to the moving boat region; foliage uses conservative visibility and front-to-back ordering. The approximate Lambert, no-MSAA, depth-prepass and rest-leaf experiments are query-only and disabled. No original source art or geometry was regenerated.

## Important failures found during this turn

An early shared-source upload implementation produced texSubImage2D errors; fixed before final tests. Background mythology preparation could mark an already open portal as cached/inert; fixed by checking the active portal stack. Early UV atlas renders had a gamma error; corrected. A later staging pass retained OLD on/off WebP files with NEW UV metadata, producing visibly scrambled room surfaces despite successful click checks. This was caught in screenshot review, corrected by copying current derived files and by making the stager always refresh browser-v185 assets. Final source/stage hashes and actual screenshots must be checked; old room-extended screenshots are not visual acceptance evidence. The local HTTP server backlog also caused connection refusals under load; final local server backlog128. Public failures are recorded separately and cannot be dismissed as that local issue.

## Reproduction

Existing derived inputs are real assets/browser-v185; older asset directories are read-only junction inputs. Do not regenerate artwork or overwrite original sources. Build:

1. node scripts/build-browser-v185.mjs
2. node scripts/build-fallback-v185.mjs
3. python scripts/browser-v179/stage-netlify-v185.py
4. python scripts/browser-v179/pack-delivery-v185.py
5. python scripts/browser-v179/pack-classic-v185.py
6. python scripts/browser-v179/manifest-v185.py

Do not run an older build afterward: it overwrites alias entry points. Do not rerun old resource preparation alone: it resets the media/transfer mappings. Keep automatic Git builds stopped. Deploy the hash manifest and exact staged artifact, never the raw Git root. Existing site faee03e7-3e2a-4967-ac0e-f218a7efa8ab; stable URL https://zaojing-wxy.netlify.app . Badge remains because the actual account API rejects removal on the current plan.

Room derivatives reproduce through exportStaticLighting, unwrap-room-v185.mjs, bake-room-atlas-v185.ts, original-PBR bakeUVBase, finish-room-atlas-v185.py, then pack-room-layout-v185.py. Preserve matched layout/on/off files together. Avoid rebuilding this solved asset set just to inspect it. Intro encoding is libaom-av1 cpu-used8 crf18 row-mt1 threads4 tile-columns1 yuv420p g60; prepare-intro-av1-v185.py fragments it and updates only its media mapping.

## Evidence and remaining limits

Exact release identity, public click flow, production file hashes and final results are in deploy/browser-v185-release.json and associated deploy/browser-v185-*.json. Twelve-step actual-click flow checks original entry, cinema page turn/header return, myth/night/return, room TV/notebook, five works/six videos with midpoint seeking and return to the original retained live home. Console errors are a separate required gate, not just a successful waitForFunction.

Performance is NOT fully solved. Corrected local isolated room preparation8.28s, desk53.59FPS, window views roughly100–113FPS on this default Edge/Intel Iris Xe sample; not a universal60FPS promise. Earlier default myth samples remain roughly13–14FPS on Iris Xe, below the requested mature smoothness. Native field seams/sky-water and sail differences still exist. A pre-packed public sample took98s to finish the two authored films and168s to prepare mythology; another fresh public entry timed out waiting for DOMContentLoaded. These are failures of the requested loading/stability target, even though a complete click flow passed. Do not claim the36second public loading target, global availability, zero bugs, user approval or native1:1 quality. Final packed test results must be added without concealing these earlier failures.


Final production cold-entry smoke FAILED after promotion: films around82s, live home still preparing when the180s post-film wait expired (total263.5s). Native geometry decoded105s, textures/environment224s, then29representative programs pending. See browser-v185-production-entry.json.21production hashes are verified, but productionVerified=false denotes the failed actual runtime smoke. The published185repair is partial and must not be called fully stable or accepted.
