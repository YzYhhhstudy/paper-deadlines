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
- 🏷 Filter by area and CCF rank (A/B/C/non-CCF), full-text search
- ⭐ Star conferences (persisted locally), one-click **.ics export** of starred deadlines
  (abstract + full paper, with 7-day-before alarms) for Google/Apple Calendar
- 🌐 Deadlines auto-converted to your local time (source data stores official timezone, mostly AoE)
- 🎨 Dark / light / system theme

## ⚠️ Data disclaimer

Dates in `data.js` are **estimates extrapolated from past cycles** — always verify against the
official site before submitting. Data format:

```js
{
  name: "ICLR 2027", fullName: "…", area: "AI/ML", rank: "CCF-A",
  abstractDeadline: "2026-09-18T23:59:59-12:00",  // optional
  deadline: "2026-09-24T23:59:59-12:00",           // AoE = -12:00
  confDate: "2027-04", place: "TBD", link: "https://iclr.cc",
}
```

## Run

Pure static page, zero dependencies: `open index.html`, or deploy to GitHub Pages / Vercel.

## Roadmap

- [ ] Move data to YAML + crowdsourced GitHub PRs (the ccfddl model)
- [ ] Browser / email notifications
- [ ] `webcal://` subscription (auto-sync instead of manual export)
- [ ] Journals (TPAMI, JMLR…) and workshops
- [ ] Show h5-index and acceptance rates

## License

MIT
