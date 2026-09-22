# Lucky Date Mate

Lucky Date Mate is a speed-dating roulette game built with Next.js and TypeScript. Players spin a six-slice wheel to discover potential dates, earn points, gain extra spins, or try again.

## Features

- 30 profile records stored in `data/index.js`
- Three randomly selected potential dates on each round
- Six roulette outcomes: three date profiles, `+2 spins`, `Try again`, and `-2 points`
- Three starting spins per round
- Points and spin tracking
- Result popups with outcome-specific animations and sounds
- Animated game-over state when the final spin is used
- Fresh profile selection when a new round starts
- Profile detail pages with WhatsApp redirect actions
- Original procedural R&B-inspired Web Audio music with unique profile soundbites

## Requirements

- Node.js 20 or newer
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |

## How To Play

1. Open the home page and enter the roulette.
2. The game starts with three spins and zero points.
3. Spin the wheel to select one of the six outcomes.
4. Landing on a date awards 10 points and opens that person&apos;s profile.
5. `+2 spins` adds two spins and two points.
6. `Try again` returns the spin that was used.
7. `-2 points` removes two points, without reducing the score below zero.
8. When the last spin is used, the animated game-over screen appears.
9. Start a new round to reset the score, restore three spins, and select three new profiles.

Sound is disabled by default. Use the sound control in the game header to enable the ambient music and outcome cues. Browsers require audio to start after a user interaction.

## Routes

- `/` - Landing page
- `/game` - Roulette game
- `/profile/[id]` - Selected profile details and WhatsApp contact action

## Project Structure

```text
app/
  game/page.tsx          Game state, roulette outcomes, points, and audio
  profile/[id]/page.tsx  Profile detail route
  globals.css            Global styles and animations
  page.tsx               Landing page
components/
  RouletteWheel.tsx      Six-slice roulette wheel UI
data/
  index.js               30 profile records
types/
  user.ts                Shared User type
```

## Profile Data

Profile data is currently local demo data. Each profile includes identity details, interests, personality traits, an image URL, and a WhatsApp-ready number. The WhatsApp numbers should be replaced with verified, consent-based contact details before production use.

## Audio

The game does not use a copyrighted recording or sample. Ambient music, action cues, and profile soundbites are generated in the browser with the Web Audio API. Each profile&apos;s soundbite is derived from its profile ID, giving every profile a consistent but distinct musical cue.

## Production Build

Run the checks before deployment:

```bash
npm run lint
npm run build
```

The app can be deployed to any platform that supports Next.js, including Vercel.