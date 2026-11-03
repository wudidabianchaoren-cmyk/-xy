# V32.180 Netlify browser deployment

This is the separately authorized browser migration. The original UE project, original website checkout and raw media remain preserved. This branch uses original geometry, textures and locally captured original lighting; it does not require this workstation's UE, Python, Node or signaling server for visitors.

## Delivery package

- Current candidate deploy: `6ae97dfdd0e427878b274a08` in the existing Netlify project `eloquent-puffpuff-c8613b`.
- Static manifest: 1,760 files / 2,855,817,434 bytes at the final staging checkpoint. Large originals referenced by the application are delivered through their mapped fragments.
- Six movie streams use HLS/fMP4 containers with `-c copy`; demuxed video SHA256 matches each original. No video re-encode or frame downscaling was used. The 16-second intro uses dependent fragments for continuous playback; it retains its original keyframes and 480 source frames.
- Thirty large binary paths use gzip and 4 MiB fragments. Twenty-eight reconstruct their original files exactly. Two home models use an independently verified container repack: identical geometry buffers, scene tables and decoded texture pixels, with PNG-to-lossless-WebP packing and no resize. These two optimized GLB containers differ from their originals. The browser reconstructs original bytes for the existing loaders, with bounded retries and three ordered in-flight segments before exposing each chunk to the stream.
- The generated resource map and early runtime bridge apply consistently to all deployed HTML pages. The current v31 page is published as the root entry. Authoring-only native capture query remains local-only.
- Runtime material probes and sand-story motion atlases omitted by the old collector are included. Source `.blend`, engine executables, private verification files, tokens and account configuration are excluded.
- HLS.js 1.7.4 is locally vendored with its license; no public CDN is needed to load the player.

The sea retains live planar reflections and real moving geometry rather than a perspective-projected source photograph, which created visible rectangle seams. Native-derived lighting on the static island remains separate from live water, boat, video and calendar.

## Validation and limits

The final local staged artifact passed home/16-second intro, desktop, two large films and mythology/day-night checks with zero sampled page, console, HTTP or native-backend errors. The day view sample was about 64 FPS on the local RTX4060. One room sample reported one dropped video frame; no universal zero-stutter claim is made. Previous local checks covered the five discs and three books.

The renderer is a browser implementation, not the original native UE renderer. Original scenes and source assets are preserved; rendering can differ in view-dependent reflection and shading. Native originals and same-camera reference captures are retained for comparison. This record is not a claim of user visual acceptance or pixel-identical realtime UE output.

Public checks, final production identity and Git hashes are written to `deploy/browser-v180-release.json` after verification. Mainland/overseas universal reachability and all possible GPU/browser combinations have not been established by a single workstation test.

## Repeatable release

1. Keep work isolated from the original checkout; never overwrite linked source asset folders.
2. Build `scripts/build-v161-ui.mjs` and `scripts/build-v165.mjs` with the installed toolchain.
3. Run `scripts/browser-v179/prepare-netlify-v180.py` to verify stream-copy and byte-identical fragments.
4. Run `scripts/browser-v179/optimize-home-lossless-v181.py`, then `scripts/browser-v179/stage-netlify-v180.py` to construct a release containing the actual static inputs. Do not publish the raw Git root.
5. Upload via Netlify's authenticated CLI/API. Refresh the digest manifest to obtain the actual missing hashes; do not infer completion from an empty GET response field. Honor 429 retry headers, use low concurrency and do not launch competing upload helpers.
6. Run the browser checks against the real anonymous HTTPS origin before publishing. API `ready` alone is not a runtime test.

Git auto builds stay stopped to prevent a source-only push replacing the complete artifact. Free hosting limits still apply; no paid plan or recurring server was opened. New releases should use new versioned derived-asset paths because current derived paths carry immutable cache headers.
