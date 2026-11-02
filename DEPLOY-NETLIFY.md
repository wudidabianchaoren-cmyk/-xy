# Netlify deployment record — 2026-11-02

The user selected the existing Netlify project and requested no further artwork or interface changes. Work on other hosting providers is stopped.

- GitHub: https://github.com/wudidabianchaoren-cmyk/-xy
- Original source and V32.178 optimization record: `e17e93bf7406976aebc8b2f88e737e753c2fd323`, verified against remote `main`.
- Netlify project: `eloquent-puffpuff-c8613b`
- Project ID: `faee03e7-3e2a-4967-ac0e-f218a7efa8ab`
- Existing production address: https://eloquent-puffpuff-c8613b.netlify.app
- Existing user-created production deploy: `6ae837168a4f56e2249bc9b1`.

## Findings and configuration

The existing Git deployment published the repository root. Raw media is intentionally excluded from Git, so the deployed page had missing vendor libraries, pictures, fonts, geometry and films. An unauthenticated browser initially received a Netlify 401 private-project login page.

The project production audience was changed to Public through the user's existing Edge session. An independent browser then received the actual page rather than the login screen. Deploy previews retain their existing access policy.

Automatic Git builds are stopped (`build_settings.stop_builds=true`, confirmed by the API). This prevents a source-only Git push from replacing a media-complete deployment. The GitHub repository remains connected. Future releases must assemble and validate the actual media package; do not publish the repository root directly.

The CLI is authenticated using its normal local Netlify configuration. Credentials, complete API responses, staging files and verification evidence remain ignored under `.verify/netlify-v179/`. Do not copy those directories into a public release or Git.

## Static candidate

Original HTML, CSS, JavaScript and media bytes were staged separately. The dependency plan contains 1,367 files, 3,258,050,201 bytes. A local staged-page check found zero static HTTP errors and zero uncaught page errors during its initial sample. That short sample does not verify the complete website or a public UE session.

The first CLI upload stalled. A second draft deploy, `6ae85cd81221c0b29f9af0fb`, uses the complete static manifest. Uploads are resumed through the official Netlify HTTPS API with bounded request timeouts and recorded progress. The original production deploy has not been replaced at this checkpoint.

## Required before complete public release

The desktop and mythology pages use the original native UE runtime, Node signaling/WebSocket service and Python editor control on this workstation. A static upload does not install or run those processes on Netlify. A real independently hosted HTTPS/WebSocket UE service, publicly reachable media and per-viewer session isolation remain required. Do not invent `UE_BACKEND_ORIGIN`, connect a temporary workstation tunnel and call it shutdown-independent hosting, remove the existing Cloudflare release gate, or silently switch the renderer to a lower-quality substitute.

The user's total annual paid budget remains CNY 20. No paid plan, GPU server or additional provider was opened. Netlify's free service remains subject to its published limits; no domestic or worldwide availability guarantee has been verified.

The production URL alone is not evidence of a complete deployment. Verify actual page content, media byte ranges, UE video frames, input behavior and multiple independent visitors before declaring the full portfolio deployed. Regional availability needs independent mainland and overseas measurements.
