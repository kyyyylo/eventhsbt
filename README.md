# Housebets Sportsbook — Final Version

A five-page, mobile-first responsive sportsbook design prototype with an original Housebets Sloth brand treatment. The interface is intentionally clean, quiet, and typography-led, with restrained transitions.

## The five required pages
1. Sports home
2. Live
3. Football
4. Match page
5. Bet slip + My bets (one page with two internal tabs)

## Included interactions
- Search fixture/team/league on Sports home.
- Filter by sport on Sports home and Live page.
- Filter Football by league and live/upcoming status.
- Favourite fixtures stored locally in browser localStorage.
- Open a fixture in Match page.
- Match page includes Markets, Stats, and Timeline tabs.
- Market accordions and category filters.
- Changed odds remain visible; Suspended and Failed outcomes are disabled.
- Singles-only selection logic.
- Demo stake calculation and demo entry history stored in browser localStorage.
- Sticky bet-slip shortcut appears after a selection.
- Reduced-motion preference support.

## Run locally
Requires Node.js 18.18+.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Prototype-only limitations
No live odds feed, live score API, sportsbook provider integration, user authentication, real wallet, deposit, withdrawal, payment, or real wager placement is connected. Data is illustrative only. Local demo history is device/browser-specific.
