<div align="right">English | <a href="./README.zh-CN.md">简体中文</a></div>

# 📡 DDL Radar · CS Conference Deadline Tracker

Track submission deadlines for ~70 conferences across 16 CS areas — with the personal features
the big trackers lack: favorites, calendar export, historical deadline patterns and
**abstract-deadline warnings**.

**Live demo → [yzyhhhstudy.github.io/paper-deadlines](https://yzyhhhstudy.github.io/paper-deadlines/)**

Inspired by [ccfddl](https://ccfddl.com) and [aideadlin.es](https://aideadlin.es);
differentiated by personalization and calendar integration.

## Features

- ⏳ Live countdowns (days/hours/minutes), red under 7 days, orange under 30
- 🗂 ~70 conferences in 16 areas — AI/ML, CV, NLP, Speech, Robotics, Data Mining, DB, Systems,
  Arch/HPC, Networking, Security, SE, HCI, Graphics, Theory, Multimedia — plus
  📖 **rolling journals** (TPAMI, IJCV, JMLR, TACL)
- 📱 **Installable PWA**: works offline, add to home screen / desktop
- 🔔 **Deadline notifications**: browser reminders 7 days / 1 day before starred deadlines
- ☰ **Timeline view**: deadlines grouped by month, next to the classic card grid
- 🔗 **Shareable URLs**: every filter/search/view choice is encoded in the address bar
- 🔎 Alias-aware search (NIPS → NeurIPS, Oakland → IEEE S&P, ESEC/FSE → FSE…)
- 📊 h5-index & acceptance-rate tags for ~36 major venues, sortable by either
- ⚠️ **Abstract-deadline aware**: when a conference has an earlier abstract deadline, the countdown
  targets it and warns you — never mistake the full-paper date for your real DDL
- 📈 5-year historical deadlines for 20 major venues — see each conference's annual pattern at a glance
- 🌏 **Bilingual UI (English / 中文)** — auto-detected from browser language, one-click toggle, remembered locally
- 🏷 **Multi-select** filters by area and rank, plus full-text search
- 🎓 **Dual rank system**: the English UI shows [CORE ranks](https://portal.core.edu.au) (A*/A/B/C —
  the international standard), while the Chinese UI shows CCF ranks (China's official venue tiers)
- ⭐ Star conferences (persisted locally), one-click **.ics export** of starred deadlines
  (abstract + full paper, with 7-day-before alarms) for Google/Apple Calendar
- 📡 **webcal:// subscription** — subscribe once (all conferences, or per area) in
  Google/Apple Calendar and deadline updates sync automatically
- 🌐 Deadlines auto-converted to your local time (source data stores official timezone, mostly AoE)
- 🎨 Dark / light / auto (system) theme

## 📡 Calendar subscription

Click **Subscribe** in the header, or add a `webcal://` feed directly in Google/Apple Calendar —
`webcal://yzyhhhstudy.github.io/paper-deadlines/feeds/all.ics` for everything, or a per-area feed
like `feeds/ai-ml.ics`. Feeds regenerate automatically whenever the data changes, and your
calendar app re-syncs them on its own — no manual re-export.

## 🗂 Data & contributing

Deadlines are **estimates extrapolated from past cycles** — always verify against the official
site before submitting. One YAML file per conference under `data/conferences/`:

```yaml
name: "ICLR"
fullName: "International Conference on Learning Representations"
area: "AI/ML"
ccf: "CCF-A"    # CCF-A / CCF-B / CCF-C / Non-CCF (Chinese UI)
core: "A*"      # CORE: A* / A / B / C / Unranked (English UI)
link: "https://iclr.cc"
editions:
  - id: "ICLR 2027"
    abstractDeadline: "2026-09-18T23:59:59-12:00"   # optional
    deadline: "2026-09-24T23:59:59-12:00"           # AoE = -12:00
    confDate: "2027-04"
    place: "TBD"
history:        # past full-paper deadlines (optional)
  - "2025-09-19"
```

Spotted an outdated deadline? **Edit the YAML and open a PR** — CI validates the format,
and after merge it rebuilds `data.js` and the calendar feeds automatically.
To build locally: `npm install && npm run build` (the page itself stays a zero-dependency
static site; `data.js`, `data.json` and `feeds/` are generated, don't edit them by hand).

Optional YAML fields: `aliases` (search synonyms), `h5`, `acceptRate`,
`type: journal` + `rolling: true` for journals without fixed deadlines.

- **Read-only API**: all data is published at
  [`/data.json`](https://yzyhhhstudy.github.io/paper-deadlines/data.json) — build your own
  client (CLI, extension, bot) on top of it.
- **Weekly reconciliation bot**: an Action cross-checks our dates against
  [ccfddl](https://github.com/ccfddl/ccf-deadlines) every Monday and opens an issue
  listing any differences.

## Run / install

Pure static page: `open index.html`, or deploy to GitHub Pages / Vercel.
On the live site, use the address-bar **install icon** (desktop Chrome/Edge) or
**Share → Add to Home Screen** (iOS Safari) to install it as an offline-capable app.

## Roadmap

- [x] Move data to YAML + crowdsourced GitHub PRs (the ccfddl model)
- [x] `webcal://` subscription (auto-sync instead of manual export)
- [x] Browser notifications
- [x] Journals (TPAMI, JMLR, IJCV, TACL)
- [x] h5-index and acceptance rates
- [x] PWA (installable, offline)
- [ ] Workshops; email digest
- [ ] Browser extension / Raycast / chat-bot clients on top of `data.json`

## License

MIT
