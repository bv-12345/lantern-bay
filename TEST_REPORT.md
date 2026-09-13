# Lantern Bay — test report

Run date: 2026-09-13 UTC. This report records developer-operated and automated simulated learner journeys. No children participated and no learner information was collected.

## Environment and results

- Domain tests: Node.js 20.19.2, `node --test model.test.mjs`: **10 passed, 0 failed**.
- Browser: Playwright 1.55.0, Chromium 140.0.7339.16, headless Linux.
- Viewports: **360 × 900**, **768 × 900**, **1280 × 900** CSS pixels.
- All 18 tasks were completed through the rendered controls at all three widths.
- No JavaScript page errors, runtime external requests, horizontal page overflow, or counter targets smaller than 48 × 48 CSS pixels were observed in those journeys.
- 360-pixel context enabled touch emulation and used taps on counters. Other interactions used browser clicks or keyboard events. This is not physical-device testing.
- Reduced-motion preference was enabled for each journey; no forced animation, audio autoplay, flashing, or moving-only interaction is used.
- Results: [browser-results.json](evidence/browser-results.json). Reproduction script: [browser_check.py](browser_check.py), which starts its own loopback HTTP server.

## Acceptance mapping

| Acceptance example | Steps performed | Observed outcome / evidence |
|---|---|---|
| Ten distinct slots, no duplicate counter per slot | Count buttons in every frame; toggle all slot indices in model tests; repeatedly tap same slot | Exactly ten slots; each contains zero or one counter. Model test 1; browser checks at all widths. |
| Seven plus three completes ten | Enter Make ten; add three; check | Seven round starting counters and three star counters fill the frame; `7 + 3 = 10`. [Desktop](evidence/03-make-ten-1280.png), [mobile](evidence/03-make-ten-360.png). |
| Removing four from nine yields five, no negatives | Story 2 begins at nine; activate −1 four times; check; model continues removing past zero | Result `9 − 4 = 5`; quantity stays at zero when further subtraction is attempted. [Story screenshot](evidence/04-story-1280.png), model test 3. |
| Zero is a deliberate number | Quantity target zero; check empty frame; also story starts from zero and a later story removes all four | Empty state says `0 lights · all ten spaces are empty`; correct feedback explains zero. Model tests 4 and 6; complete browser journey. |
| Retries preserve state and progress | Wrong check; hint; scaffold switch; example replay; reset; correct check twice | Wrong attempts do not advance; reset restores starting collection; repeated correct checks count a task once. First build progress remains 1, not 2. |
| Fresh final problem with hints/explanation | Make four into ten, then remove two; use optional hint; check and open summary | Final equation `10 − 2 = 8` and explanation connects both changes. [Final](evidence/05-final-1280.png), [summary](evidence/06-summary-1280.png). |
| Correctness is independent of arbitrary placement | For target three, fill spaces 10, 5, and 8 | Accepted with three lights. Model test 7 and browser journey. |
| At least five bonds including 0+10 and 5+5 | Complete starts 7, 5, 0, 8, 2, 6 | All six produce a whole ten, correct equations, and distinct starting/added counters. |
| Six original addition/subtraction situations | Complete all six stories with changes +3, −4, +4, −2, +5, −4 | Correct respective totals 5, 5, 7, 4, 5, 0. Equations appear after object-based answer checking. |

## Interaction and accessibility review

Developer-operated review used rendered screenshots and explicit keyboard/touch inputs in Chromium. These checks supplement the automated arithmetic tests; they do not constitute a certified accessibility audit.

- **Keyboard:** focused a slot, activated Space twice, verified its pressed state toggled and focus remained on that slot. Activated +1 with Enter and moved focus with Tab. Navigation, hint, reset, example replay, and completion use semantic buttons/selects. The app supplies a skip link and visible orange focus outline.
- **Touch:** 360-pixel emulation tapped three nonadjacent slots and completed the same quantity task. All counter bounds were measured at least 48 × 48 CSS pixels. No dragging is required.
- **Feedback:** wrong answers offered a counting or story strategy. Correct answers explained the quantities. Hints, two selectable scaffolds, replayed demonstrations, and unlimited retries remained usable.
- **Reset and leaving:** reset-current restores initial counters; leaving returns to the welcome screen; full-journey reset clears recorded activity completion; refreshing starts fresh. No local storage is used.
- **Sound fallback:** replaced available voice list with an empty list; Read aloud presented the visible prompt and Sound on switched to Text mode. Playback with a real local English voice was not tested. The app only selects local voices and sends no prompt to a remote speech service.
- **Non-colour cues:** starting counters show a round mark and added counters a star, with text labels. Every slot has an accessible name including position and occupancy, plus a visible total and empty-space count.
- **Contrast:** calculated text/background examples: primary ink on paper 10.52:1, muted text on paper 5.55:1, orange text on paper 5.00:1, white text on teal 7.24:1. Control borders were strengthened after initial screenshot review; the harbor caption was changed to light text. This is a target-based review, not a claim that every possible browser/OS state has been audited.

## Numbered screenshot walkthrough

1. [Welcome and three-stop overview](evidence/01-welcome-1280.png): begin with Let's explore.
2. [Build a quantity](evidence/02-build-1280.png): three lights in different positions still make three.
3. [Make ten](evidence/03-make-ten-1280.png): seven starting lights and three added lights form ten.
4. [Picture story](evidence/04-story-1280.png): four boats leave a collection of nine; five remain.
5. [New final problem](evidence/05-final-1280.png): making ten and then subtracting two are connected.
6. [Completion summary](evidence/06-summary-1280.png): activity record and a screen-free follow-up.
7. [Mobile make-ten view](evidence/03-make-ten-360.png) and [tablet make-ten view](evidence/03-make-ten-768.png): the same required controls and frame remain available.

## Limits

Firefox, Safari, real touch hardware, screen-reader speech output, and actual local voice playback were not tested. No learning-effectiveness study or child testing was performed. Screenshot journeys use known mathematical fixtures; they demonstrate functional behavior and do not measure learner understanding. The interface can involve vertical scrolling on small displays; no core controls were clipped or horizontally inaccessible.
