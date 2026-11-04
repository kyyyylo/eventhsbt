# Housebets Sportsbook — Final Contest Prototype

A five-page, mobile-first responsive sportsbook design prototype with an original Housebets Sloth brand treatment. The interface is intentionally clean, quiet, and typography-led, with restrained transitions.

## The five required pages
1. Sports home
2. Live
3. Football
4. Match page
5. Bet slip + My bets (one page with two internal tabs)

## Contest-rule checklist
- Exactly five navigable primary pages.
- Singles only: one active outcome per bet slip; selecting a different outcome replaces the previous one.
- Sample fixtures, scores, odds, statistics, and timeline events only.
- Does not copy an existing sportsbook layout; uses an original Housebets-inspired visual system.
- Shows all required market states: Changed, Suspended, Failed.
- Responsive for desktop, tablet, Android, and iPhone.
- Sloth mascot brand treatment integrated in header and Sports home hero.
- Bet slip and My Bets are combined in a single primary page.

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

## Deploy to Vercel
1. Upload the contents of this folder to a GitHub repository (the `app`, `public`, and `package.json` items must be at repository root).
2. Import that repository at https://vercel.com/new.
3. Select Next.js and deploy. No environment variables are required.

## Prototype-only limitations
No live odds feed, live score API, sportsbook provider integration, user authentication, real wallet, deposit, withdrawal, payment, or real wager placement is connected. Data is illustrative only. Local demo history is device/browser-specific.
