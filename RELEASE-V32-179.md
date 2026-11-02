# V32.179 — Netlify deployment preparation

2026-11-03 checkpoint: the separately authorized browser pilot is saved on `deploy/netlify-browser-v179` at `4284d01`. Original UE/app unchanged. Scoped local runtime and film playback checks passed, but overall visual parity and full portfolio migration have not passed. It has not been merged or deployed. See the newest section in DEPLOY-NETLIFY.md and that branch's BROWSER-MIGRATION-V179.md.

No portfolio appearance, content, camera, animation or original UE quality changes were made.

The user subsequently authorized an isolated browser migration, conditional on preserving the original and avoiding obvious visual degradation. A same-camera comparison found the existing web fallback visibly inferior, so it has not been accepted or promoted. The ready Netlify static draft remains incomplete and unpublished; see the latest checkpoint in the deployment record before resuming.

V32.178 source and optimization notes were already pushed to GitHub at `e17e93bf7406976aebc8b2f88e737e753c2fd323`; local and remote `main` matched. This iteration records the user's switch to the existing Netlify project, restoration of missing static dependencies, public production access and protection against source-only automatic deploys.

See [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md) for exact project identity, upload evidence and remaining native-runtime requirements. A ready static draft must not be described as a complete independently running UE portfolio.
