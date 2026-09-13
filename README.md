# Lantern Bay

Lantern Bay is a small, static number adventure for approximately six-year-old learners. It uses a ten-frame and visible lights to connect numerals with quantities from 0 to 10, compose ten, and solve short addition and subtraction stories.

## Run locally

The app has no build step and no runtime dependency beyond a modern browser. Serve this directory over HTTP with Python 3 (tested with 3.13) so ES modules load correctly:

```sh
cd /path/to/lantern-bay
python3 -m http.server 18763
```

Open `http://localhost:18763/`. There is no install or deployment account requirement.

## Verify the domain model

```sh
node --test model.test.mjs
```

Validated with Node 20.19.2. Ten model tests passed. Full simulated browser journeys passed in Chromium 140 at 360, 768, and 1280 pixels; see `TEST_REPORT.md`. Firefox and Safari were not tested; ES modules, `Array.findLastIndex`, and standard DOM APIs are required. Local English speech voices are optional.

## Architecture

`content.mjs` contains the quantities, number bonds, labels, and six original stories. `model.mjs` is the pure state layer: it creates ten-slot frames, toggles or adjusts counters, computes story results, checks targets, and formats equations. `app.mjs` renders the current activity and handles navigation, feedback, reset, scaffold selection, and optional read-aloud. `style.css` supplies the responsive visual system and focus/touch states. `index.html` is the learner entry point; `guide.html` is the adult-facing guide.

State is held for the current session. Refreshing starts fresh; the app has no account, login, tracking, analytics, child name, or network service. Read-aloud uses browser speech only when available and retains visible text as the fallback.

## Lesson shape

The route has three practice areas: Fill a frame (3, 0, 7, 10), Make ten (7, 5, 0, 8, 2, 6), and Picture stories (six stories). A final transfer stop asks learners to make 4 into 10 and then remove 2 to leave 8. Learners may choose `Count together` or `Explore` support at any time.

See [EDUCATOR_GUIDE.md](EDUCATOR_GUIDE.md) for objectives, adaptations, references, and an offline follow-up.

## Limitations and attribution

This is a focused practice experience, not a diagnostic, assessment, or complete curriculum. Reading level, motor control, number knowledge, and interest vary; an adult should choose the pace and language. The activity does not measure learning gains and does not save progress between refreshes.

Original Lantern Bay code is released under the MIT License in [LICENSE](LICENSE).

## Build, preview, and deployment

Install: none for the app. Build: none; the checked-in files are the production files.
Development and production preview use the same command shown above. Deploy `index.html`,
`style.css`, `app.mjs`, `content.mjs`, `model.mjs`, `guide.html`, `EDUCATOR_GUIDE.md`,
and `LICENSE` to any static HTTPS host. No paid plan, server function, or secret is required.
A `.nojekyll` file supports deployment from the root of a GitHub Pages branch.

## Reproduce browser checks (optional developer tooling)

```sh
python3 -m venv .browser-env
.browser-env/bin/pip install playwright==1.55.0
.browser-env/bin/playwright install chromium
.browser-env/bin/python browser_check.py
```

The check script starts its own local server on an available loopback port, simulates
learner journeys, and writes screenshots/results to `evidence/`. The test tooling is
not loaded by the learner app. Speech playback itself was not verified because no
local English voice was installed; the unavailable-voice path was verified.

## Third-party attribution

All lesson code, stories, and the inline harbor SVG were created for this submission.
Typography uses system fonts; symbols use the browser's installed fonts. No copied
media, remote font, external asset, or bundled third-party runtime library is included.
Educational reference links are in the grown-up guide; their content is not bundled.
