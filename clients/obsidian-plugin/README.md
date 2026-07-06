# DDL Radar for Obsidian

CS conference deadline countdowns inside your vault — no other plugins required.
Works on desktop **and** mobile (`isDesktopOnly: false`).

## Features

- **📡 Sidebar panel** (ribbon icon or command *Open deadline panel*): upcoming
  deadlines with live countdowns, search, CCF/CORE ranks, abstract-deadline
  warnings and ⭐ stars (stored locally in plugin data)
- **In-note deadline board** — put a code block in any note:

  ~~~markdown
  ```ddl-radar
  areas: AI/ML, CV
  days: 120
  limit: 15
  ```
  ~~~

  Supported keys: `days`, `areas`, `ranks` (matches CCF *or* CORE), `starred: true`,
  `limit`, `query`.
- **Frontmatter countdown banner** — the killer feature for paper notes. Add

  ```yaml
  ---
  conference: NeurIPS 2027
  ---
  ```

  and the note shows a live countdown banner (abstract + full-paper deadlines,
  one-click link to the CFP / submission portal). Accepts a list for multi-venue
  notes; aliases and prefixes work (`conference: NeurIPS`).
- **Status bar badge**: number of deadlines within 7 days; click to open the panel
- **Startup reminders**: a notice for starred conferences due within N days
  (configurable, at most once per day)
- **Command palette**: *Insert deadline table* drops a Markdown snapshot at the cursor
- UI in English (default) / 中文 — switch in Settings → DDL Radar → Language

## Network use disclosure

The plugin makes exactly one type of network request: fetching the public,
read-only conference dataset
[`data.json`](https://yzyhhhstudy.github.io/paper-deadlines/data.json) published
by this repository (cross-checked weekly against official sites). The dataset is
cached locally (default refresh: every 6 h) so the plugin works offline. Nothing
is ever sent anywhere: no accounts, no analytics, no telemetry. Stars and
settings stay in your vault's plugin data.

## Development

```sh
cd clients/obsidian-plugin
npm install
npm run build     # → main.js
npm run typecheck
```

Manual install: copy `main.js`, `manifest.json`, `styles.css` into
`<vault>/.obsidian/plugins/ddl-radar/` and enable it in
Settings → Community plugins.
