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
- 🗂 ~70 conferences in 16 areas: AI/ML, CV, NLP, Speech, Robotics (IROS/ICRA/RSS/CoRL),
  Data Mining, DB, Systems, Arch/HPC, Networking, Security, SE, HCI, Graphics, Theory, Multimedia
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
static site; `data.js` and `feeds/` are generated, don't edit them by hand).

## Run

Pure static page: `open index.html`, or deploy to GitHub Pages / Vercel.

## Roadmap

- [x] Move data to YAML + crowdsourced GitHub PRs (the ccfddl model)
- [x] `webcal://` subscription (auto-sync instead of manual export)
- [ ] Browser / email notifications
- [ ] Journals (TPAMI, JMLR…) and workshops
- [ ] Show h5-index and acceptance rates

## License

MIT
