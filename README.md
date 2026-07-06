<div align="right">English | <a href="./README.zh-CN.md">简体中文</a></div>

# 📡 DDL Radar · CS Conference Deadline Tracker

[![Data validate & build](https://github.com/YzYhhhstudy/paper-deadlines/actions/workflows/data.yml/badge.svg)](https://github.com/YzYhhhstudy/paper-deadlines/actions/workflows/data.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fyzyhhhstudy.github.io%2Fpaper-deadlines%2F&label=site)](https://yzyhhhstudy.github.io/paper-deadlines/)
[![PWA](https://img.shields.io/badge/PWA-installable-5b4be0)](https://yzyhhhstudy.github.io/paper-deadlines/)
[![npm](https://img.shields.io/npm/v/ddl-radar?logo=npm&color=cb3837)](https://www.npmjs.com/package/ddl-radar)
[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-in_review-fbbc05)](clients/extension/)
[![Edge Add-ons](https://img.shields.io/badge/Edge_Add--ons-in_review-0078d7)](clients/extension/)
[![Obsidian](https://img.shields.io/badge/Obsidian-community_plugin-7c3aed?logo=obsidian&logoColor=white)](https://obsidian.md/plugins?id=ddl-radar)
[![i18n](https://img.shields.io/badge/i18n-7_languages-1baf7a)](#features)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/YzYhhhstudy/paper-deadlines/tree/master/data/conferences)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](#license)

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
- 🌏 **7-language UI** (English / 中文 / 日本語 / 한국어 / Deutsch / Français / Español) — auto-detected, remembered locally
- 🏷 **Multi-select** filters by area and rank, plus full-text search
- 📋 **Submission pipeline**: drag cards across Planned / Writing / Submitted / Rebuttal / Accepted / Rejected
  on the kanban **Board**, with your personal **hit-rate** stat
- 📈 **Detail view**: click any card for key dates (incl. rebuttal & notification countdowns) and an acceptance-rate trend chart
- ⇥ **Timeline view**: horizontal time axis with 3/6/12-month zoom (overlapping deadlines stack into lanes) plus a list mode
- 🚀 **Submit-portal links** straight to OpenReview/ARR where available
- 🔔 Reminders with **custom lead times** (1/3/7/14/30 days); sort by deadline, h5, or acceptance rate in either direction
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

## Where to use it

One data source (`data.json`), many clients:

| Client | How |
|--------|-----|
| 🌐 **Web / PWA** | [Live site](https://yzyhhhstudy.github.io/paper-deadlines/) — install via the address-bar icon (Chrome/Edge) or Share → Add to Home Screen (iOS); works offline; UI in 中 / EN / 日 |
| 📅 **Calendar** | Header **Subscribe** button → `webcal://` feeds, auto-syncing in Google/Apple Calendar |
| 🧩 **Chrome / Edge extension** | Badge = deadlines within 7 days + popup list. Load [`clients/extension/`](clients/extension/) unpacked — see its [README](clients/extension/README.md) |
| ⚡ **Raycast** | Add [`clients/raycast/`](clients/raycast/) as a Script Commands directory |
| 📟 **macOS menu bar** | Copy [`clients/menubar/ddlradar.1h.sh`](clients/menubar/ddlradar.1h.sh) into your SwiftBar/xbar plugins folder |
| 💻 **CLI** | `npx ddl-radar --days 30 --area AI/ML` — on [npm](https://www.npmjs.com/package/ddl-radar), or `npm i -g ddl-radar` |
| 📬 **Email / Slack / Discord / Feishu** | Weekly digest via GitHub Actions — set the secrets documented in [`.github/workflows/digest.yml`](.github/workflows/digest.yml) |
| 📓 **Obsidian** | **[Install from Community plugins](https://obsidian.md/plugins?id=ddl-radar)** — search "DDL Radar" (desktop & mobile, no dependencies): sidebar countdown panel, in-note `ddl-radar` boards, frontmatter countdown banners on your paper notes, status-bar badge. Fetches only the public `data.json` — details in [`clients/obsidian-plugin/`](clients/obsidian-plugin/) |
| 🔌 **Your own client** | `GET` [`/data.json`](https://yzyhhhstudy.github.io/paper-deadlines/data.json) |

## Run locally

Pure static page: `open index.html`, or deploy to GitHub Pages / Vercel.

## Roadmap

- [x] Move data to YAML + crowdsourced GitHub PRs (the ccfddl model)
- [x] `webcal://` subscription (auto-sync instead of manual export)
- [x] Browser notifications
- [x] Journals (TPAMI, JMLR, IJCV, TACL)
- [x] h5-index and acceptance rates
- [x] PWA (installable, offline)
- [x] Workshops; weekly email/chat digest
- [x] Browser extension, Raycast, menu bar, CLI clients on `data.json`
- [x] Weekly reconciliation bot with auto-fix PRs (ccfddl)
- [ ] Automated crawling of official sites for deadlines/CFP details
- [x] CLI published to npm ([`ddl-radar`](https://www.npmjs.com/package/ddl-radar))
- [ ] Publish extension to Chrome Web Store / Edge Add-ons (submitted, in review)
- [x] Obsidian community-plugin listing ([install](https://obsidian.md/plugins?id=ddl-radar))

## License

MIT
