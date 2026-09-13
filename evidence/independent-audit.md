# Independent acceptance audit — Lantern Bay

Audit date: 2026-09-13 UTC. Scope: the repository worktree and the brief at
`/workspace/cash50/work/loop/number-adventure-brief.md`.

## Result

**Local deliverable: PASS.** The three required activities, final transfer,
supporting documentation, licence, editable source, and reproducible evidence
are present. The two external submission gates below remain pending at the time
of this audit, so the complete Taskmarket package is **not yet eligible to mark
PASS** until they are verified.

## Verified evidence

- `node --test model.test.mjs` was run independently after the final story-picture
  patch: **10 passed, 0 failed**.
- `evidence/browser-results.json` records passing Playwright journeys for
  **360 × 900, 768 × 900, and 1280 × 900**. Each records all 18 lesson tasks,
  touch emulation at 360px, reduced motion, no page errors, no external requests,
  no horizontal overflow, and controls at least 48px.
- The final screenshots were regenerated after the contrast and story-picture
  changes. The 360px welcome view shows the light harbor caption; the 360px and
  1280px story views show a current, labelled object picture alongside the
  manipulated ten-frame.
- `model.mjs` keeps ten unique slots, bounds quantities at zero through ten,
  preserves the supplied part of a number bond, and checks numerical quantity
  rather than placement. Its content covers build targets 0 and 10; six bonds
  including 7+3, 5+5, and 0+10; six original within-ten stories; and a two-step
  4→10→8 transfer task.
- `README.md`, `EDUCATOR_GUIDE.md`, and `TEST_REPORT.md` provide the requested
  setup/runtime limits, architecture/state description, adult guidance,
  two named reference links, acceptance mapping, actual test scope, numbered
  screenshot walkthrough, original-asset attribution, and MIT licence.
- The published Git remote's `main` ref was independently observed at
  `8e32937b6baf5b1ef39f8089abf28a50e320d55d`, matching the local `HEAD`.

## Remaining external gates

1. Verify a public, no-login **HTTPS preview URL** after Pages deploys, including
   a real load of the learner page.
2. Create and attach the **complete source archive** to the Taskmarket submission.
   The local repository contains no final archive at this audit point.
3. Submit the exact public repository/commit, HTTPS URL, and archive only after
   both checks above pass.

## Non-blocking limits accurately documented

The evidence uses headless Chromium and emulated touch. Firefox, Safari, real
touch hardware, screen-reader output, and real local voice playback were not
tested. Those limits are disclosed in `TEST_REPORT.md`; they do not contradict
the stated test evidence.
