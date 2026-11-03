# V32.184 entry recovery

Scope: repair the reported frozen0percent/0.0second entry at https://zaojing-wxy.netlify.app . Preserve the existing design, source artwork, authored20second opening and480frame/16second courtyard intro. No engine, driver, native recapture, new provider or paid service.

## Incident evidence

Read the actual ordinary Edge tab through Windows UI Automation. It displayed the opening at0percent, clock-tower geometry/mechanisms, `Preparation paused — please retry` and `Preparation paused · Retry`. This confirms a failed home preparation state. The failing resource from that old tab was not captured; do not assert that the later injected marble-image failure was the original cause. Initial anonymous browser navigation also timed out once. Root and immutable-deploy HTTP requests subsequently returned200. Do not attribute this to quota, DNS or a particular extension without evidence.

Confirmed source defects: the visible preparation timer read the video's currentTime, so a paused or unbuffered film always showed0.0s; the opening fetched all7.36MB into a Blob before decoding; the initial film lacked a usable autoplay-denial recovery; the second intro's play promise could reject without a click-to-continue path; an early rejected texture promise could raise an unhandled rejection before later assembly awaited it.

## Repair

- Play the existing fast-start MP4 progressively through the browser's native byte-range support. The file is unchanged; moov begins at byte32. Do not transcode or skip authored content.
- Track real preparation time, including network wait. Percent remains authored-film progress, not a fabricated download percentage.
- Detect25seconds without media progress while visible, retry at most twice, retain playback position, and expose a real retry action after persistent failure. Hidden-tab time does not count as a stalled connection.
- Show `Click to enter` or `Click to continue` when the corresponding video play promise is blocked. Buttons use pointer-events:auto through the noninteractive cinema overlay. A blocked first play does not immediately retry behind the button.
- Show courtyard preparation failures promptly and preserve a retry control across the handoff. Retry reloads with an owned entryRetry parameter; binary/fetch resources use cache:reload for that retry. No unrelated browser data is cleared.
- Preserve original failed-texture diagnostics, attach an early rejection handler without swallowing the later assembly failure, and expose home.error for runtime verification.

## Validation and publication

Run `scripts/browser-v179/verify-entry-v184.mjs`. ENTRY_CASE=recover injects one opening request failure and autoplay rejection in both films, clicks both actual recovery buttons, requires both clips to end naturally with appropriate presented-frame counts and waits for live home/interface readiness. ENTRY_CASE=home-failure persistently fails one original texture through all retries, verifies a visible resource-specific failure, removes the fault, clicks reload and requires successful original films/live home. ENTRY_CASE=stall blocks the first film request past25seconds and verifies retry to actual playback; it does not repeat a full movie/site audit. ENTRY_CASE=public with ENTRY_ORIGIN set to the exact draft performs a fresh normal network entry and waits for original films plus live home readiness.

Only publish after the cases pass. The final deploy identity, network checks and exact test results belong in `deploy/browser-v184-entry-release.json`; `deploy/netlify-v184-asset-plan.json` describes the artifact. Earlier V184 drafts are preparation history, not production. Preserve the complete existing static package and stopped automatic Git builds; do not deploy the raw source checkout.

First live courtyard preparation is still substantial. This entry repair does not establish instant loading, universal network/GPU behavior, native UE pixel identity, or a fix for the V183 desk/mythology performance and off-axis visual defects. It is not a redesign or a complete quality acceptance.

The final anonymous public sample actually encountered `net::ERR_HTTP2_PING_FAILED` and stopped around5.88seconds. One media retry resumed playback and reached both natural film endings and live home readiness. That transport console error is recorded, not hidden or described as zero errors. No sampled page-JavaScript or HTTP-status errors remained. The live home became ready around196.5seconds in this slow sample; this is a recovery proof, not an instant-load performance pass. Production deploy6aea209888437f0ae482bc78 was promoted only after those checks, then seven production files matched the tested artifact. The initial refresh guard stopped on an unrelated active tab. Later the unique existing live portfolio tab was selected and its observed Retry invoked after origin verification; opening advanced to54percent and the portfolio interface/content was subsequently observed. This is not a complete agent-driven runtime QA in that profile.
