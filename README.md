# Celebration Website (React)

A cinematic, chapter-by-chapter birthday story built with React + Vite. Only one scene appears at a time, with soft transitions between chapters.

Features included:
- A beige opening screen with small pastel flowers that sweep away to reveal a personalized gift tag and an Unwrap button; the cake only appears after unwrapping
- Press, slide, and release across the cake to split it along your actual cutting line, revealing sponge and cream as the pieces separate. The Continue button unlocks after the animation. Enter/Space provides a keyboard alternative.
- A birthday wish scene with roots and branches growing from the ground, then a full rounded canopy of scattered, overlapping balloons tethered to nearby branches; the lower trunk stays visible. The animation respects reduced-motion preferences.
- Drag the bow away from the heart and release to shoot; missed shots can be retried. Enter/Space provides a keyboard alternative.
- Five floating balloons, each revealing a personal message when popped
- Swipeable Polaroid gallery with previous/next and continuous looping autoplay every six seconds, followed by the letter. There is no countdown or gallery pause/play control.
- Opening envelope, rising letter, and word-by-word message reveal as the final chapter. The closing birthday wish and replay action are available only here, after the letter is fully revealed.
- Looping background birthday music that continues across scenes, with a music toggle. Playback is attempted on load; if the browser blocks audible autoplay, the first click/tap or key press starts it instead.
- Only the flower animation stays beige. The unwrap page and subsequent scenes follow the selected maroon dark theme or beige light theme. Theme and music controls appear at bottom-right once the flowers clear; the theme choice is remembered on the same browser.

## Safe Open-Source Modules Used

- `framer-motion` for animations
- `canvas-confetti` for popper/confetti effects
- `lucide-react` for control icons
- `@fontsource` packages for bundled open-source fonts

No analytics, account system, remote scripts, or runtime external requests are used. Fonts and placeholder photos are served locally. npm reported zero known vulnerabilities during the latest dependency installation; this is not a guarantee that any software is malware-free.

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Customize Quickly

Edit the `birthday` object at the top of `src/App.jsx`:
- `name` and `from` for the recipient and sender
- `reasons` for the five balloon messages
- `letter` for your paragraphs, revealed word by word
- `photos` for image paths and handwritten captions

Replace the five landscape placeholder photos in `public/memories/` with your own images, keeping the names `01.jpg` through `05.jpg`, or change the paths in `birthday.photos`. The placeholders were downloaded from Lorem Picsum (`picsum.photos/id/1015`, `1016`, `1039`, `1043`, and `1057`). They are not personal photos.

You can also tune colors, styles, and animation feel in `src/App.css`.
