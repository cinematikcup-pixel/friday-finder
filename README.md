# Friday Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/cinematikcup-pixel/friday-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/cinematikcup-pixel/friday-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Friday Finder is a real Black Friday deal finder: 42 Black Friday and Cyber Monday deals, each found and checked on November 27, 2026 (Black Friday itself) against the store named or a deals source that names the store. Every deal shows its product, store, sale price, usual price, discount, a link to the product at that store, when the price was checked, the source that showed the price, and an honest verdict — TRUE DEAL for an all-time low or a 40%+ cut confirmed as the year's lowest, GOOD PRICE for a solid real saving.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network requests at run time: the site is static files under `app/`, and the deals are data in `app/data.js`.

Search, filter by category, store and discount, filter to true deals only, and sort by discount, saving or price. The filter state lives in the URL (`?q=&cat=&store=&min=&sort=&only=`), so any view can be shared. Click a deal for its detail page, including a cross-store comparison for products sold at more than one store.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library (`vendor/makefun-frontend.ts`).

---

<sub>Entered on [make.fun](https://make.fun/?ref=cn79959a&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
