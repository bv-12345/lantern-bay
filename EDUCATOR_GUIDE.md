# Lantern Bay — educator guide

Lantern Bay is a short, replayable ten-frame lesson for a learner around age six. The age is a design target rather than a claim that every six-year-old will find the same reading, pacing, or motor demands suitable.

## Objectives

By the end of a supported session, a learner can:

1. match numerals with collections from zero through ten;
2. describe a ten as two parts in several ways; and
3. model and solve simple addition and subtraction stories within ten using visible objects before reading the equation.

## Prerequisites and setup

No account, learner name, or internet service is required after the files are available. A learner benefits from recognising numerals 0–10 and being able to tap or use a keyboard. An adult can run `python3 -m http.server 18763` in the app folder and open `http://localhost:18763/`.

The focused route takes about 8–12 minutes, but each activity can be replayed or paused. Use the learner screen for the child and this guide for the adult. Progress is held in memory for the open tab and refresh starts a new session.

## Walkthrough

Start with **Fill a frame**. Ask the learner to say the target, then place or remove lights until the frame shows it. The set intentionally includes 3, 0, 7, and 10 so zero is treated as a quantity and ten as a complete frame. Ask, “How did you check?” before moving on.

In **Make ten**, some lights are already present and the learner supplies the missing part. The six starts are 7, 5, 0, 8, 2, and 6. Invite the learner to count empty spaces, predict the missing number, and then check the whole. The two selectable supports are **Count together** and **Explore**; choose the language that fits the conversation rather than assigning a level.

In **Picture stories**, read the short situation aloud if useful. Let the learner build the story with lights, explain what changed, and then inspect the matching equation. The six stories include joining and separating situations, including starting from zero and removing all four objects. Encourage a drawing or spoken explanation before symbols.

The final stop combines the ideas: complete 4 to make 10, then remove 2 so 8 remain. Ask the learner to explain both changes. A wrong attempt is a reason to count, compare, or try again; the experience has unlimited retries and avoids speed or ranking.

## Differentiation and co-play

For more support, count each space together, point to the empty spaces, speak the story in shorter clauses, or let the learner use the visible frame while the adult supplies the words. For more challenge, hide the equation verbally, ask for two ways to make ten, or ask the learner to invent a new story for a displayed equation. Keep the objects visible when abstraction becomes a barrier.

For a learner with motor or attention needs, use the keyboard and the add/remove controls, take one activity at a time, and pause between prompts. For language learners, act out “join,” “take away,” “stay,” and “more” with counters and accept an explanation in the learner’s strongest language. These are practical adaptations, not diagnostic accommodations.

## What the model does and does not mean

The ten-frame is a deliberately small model: each activity is bounded by ten, a slot holds at most one light, and correctness is based on the number shown rather than a particular arrangement. It supports counting and composition but cannot represent every child’s strategy or establish mastery. The app is practice material, not a test, diagnosis, or evidence of validated learning gains. It does not collect data, grade remotely, or preserve a learner profile.

## Content sources

The ten-frame and part–whole emphasis are informed by the Math Learning Center’s [Number Frames](https://www.mathlearningcenter.org/apps/number-frames). The composition-of-ten progression and adult discussion prompts are informed by NCETM’s [Early Years: Composition](https://www.ncetm.org.uk/classroom-resources/ey-composition/). These sources support the choice of manipulable quantities and composing parts; they do not validate this particular app or imply measured outcomes.

## Offline follow-up

Draw two rows of five boxes on paper. Call out a number from 0–10 and have the learner fill that many boxes with dots. Then ask, “How many more to make ten?” For a story, place ten buttons or coins in a row, act out adding or taking away up to ten, and have the learner say the result and tell the story back.

## Technical note

The app is plain HTML, CSS, and ES modules. Content is separated into `content.mjs`; `model.mjs` contains deterministic state and arithmetic; the UI module renders activities and feedback. The optional read-aloud control uses the local browser speech service when available and leaves the written prompt visible otherwise. See `README.md` for commands. Browser, touch, keyboard, and reduced-motion evidence should be added to `TEST_REPORT.md` only after the relevant walkthroughs are performed.
