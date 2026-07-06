// DDL Radar for Obsidian — CS conference deadline countdowns inside your vault.
// Data: the public, read-only DDL Radar dataset (data.json). No accounts, no telemetry.
import {
  App,
  Editor,
  ItemView,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  WorkspaceLeaf,
  requestUrl,
} from "obsidian";

const DATA_URL = "https://yzyhhhstudy.github.io/paper-deadlines/data.json";
const SITE_URL = "https://yzyhhhstudy.github.io/paper-deadlines/";
const VIEW_TYPE = "ddl-radar-view";
const DAY_MS = 86400000;

interface Conf {
  name: string;
  fullName?: string;
  area?: string;
  rank?: string;
  core?: string;
  abstractDeadline?: string;
  deadline?: string;
  link?: string;
  submitLink?: string;
  place?: string;
  acceptRate?: string;
  h5?: number;
  rolling?: boolean;
  type?: string;
  aliases?: string[];
}

interface RadarSettings {
  starred: string[];
  reminderDays: number;
  refreshHours: number;
  defaultDays: number;
  starredOnly: boolean;
  lastReminder: string;
  cacheConfs: Conf[];
  cacheFetchedAt: number;
}

const DEFAULT_SETTINGS: RadarSettings = {
  starred: [],
  reminderDays: 7,
  refreshHours: 6,
  defaultDays: 180,
  starredOnly: false,
  lastReminder: "",
  cacheConfs: [],
  cacheFetchedAt: 0,
};

const zh = (window.localStorage.getItem("language") || "").startsWith("zh");
const T = zh
  ? {
      panel: "DDL Radar：会议截稿",
      search: "搜索会议…",
      starredOnly: "只看收藏",
      refresh: "刷新数据",
      refreshed: "DDL Radar 数据已刷新",
      offline: "DDL Radar：拉取数据失败，使用本地缓存",
      empty: "没有即将截止的会议",
      abs: "摘要",
      absFirst: "⚠️ 摘要截止",
      full: "截稿",
      insertCmd: "插入截稿表格",
      openCmd: "打开截稿面板",
      refreshCmd: "刷新会议数据",
      days: (d: number) => `${d} 天`,
      dueSoon: (n: number) => `📡 ${n} 个会议 7 天内截止`,
      tblHead: "| 截稿 | 会议 | 等级 | 领域 | 倒计时 |\n|---|---|---|---|---|",
      bannerDdl: "距截稿",
      site: "完整站点 →",
    }
  : {
      panel: "DDL Radar: conference deadlines",
      search: "Search venues…",
      starredOnly: "Starred only",
      refresh: "Refresh data",
      refreshed: "DDL Radar data refreshed",
      offline: "DDL Radar: fetch failed, using cached data",
      empty: "No upcoming deadlines",
      abs: "abstract",
      absFirst: "⚠️ abstract due",
      full: "deadline",
      insertCmd: "Insert deadline table",
      openCmd: "Open deadline panel",
      refreshCmd: "Refresh conference data",
      days: (d: number) => `${d}d`,
      dueSoon: (n: number) => `📡 ${n} deadline${n > 1 ? "s" : ""} within 7 days`,
      tblHead: "| Deadline | Conference | Rank | Area | Countdown |\n|---|---|---|---|---|",
      bannerDdl: "until deadline",
      site: "Full site →",
    };

function nextDeadline(c: Conf): { iso: string; abs: boolean } | null {
  if (c.rolling || !c.deadline) return null;
  if (new Date(c.deadline).getTime() <= Date.now()) return null;
  if (c.abstractDeadline && new Date(c.abstractDeadline).getTime() > Date.now()) {
    return { iso: c.abstractDeadline, abs: true };
  }
  return { iso: c.deadline, abs: false };
}

function daysLeft(iso: string): number {
  return Math.floor((new Date(iso).getTime() - Date.now()) / DAY_MS);
}

function urgencyClass(d: number): string {
  return d < 7 ? "ddlr-urgent" : d < 30 ? "ddlr-soon" : "ddlr-safe";
}

function fmtDate(iso: string): string {
  const dt = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

interface Filter {
  days?: number;
  areas?: string[];
  ranks?: string[];
  starred?: boolean;
  limit?: number;
  query?: string;
}

export default class DdlRadarPlugin extends Plugin {
  settings: RadarSettings = { ...DEFAULT_SETTINGS };
  confs: Conf[] = [];
  statusEl: HTMLElement | null = null;

  async onload() {
    await this.loadSettings();
    this.confs = this.settings.cacheConfs;

    this.registerView(VIEW_TYPE, (leaf) => new RadarView(leaf, this));
    this.addRibbonIcon("radar", T.panel, () => this.activateView());

    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass("ddlr-status");
    this.statusEl.onClickEvent(() => this.activateView());

    this.addCommand({
      id: "open-panel",
      name: T.openCmd,
      callback: () => this.activateView(),
    });
    this.addCommand({
      id: "refresh-data",
      name: T.refreshCmd,
      callback: async () => {
        await this.refreshData(true);
        new Notice(T.refreshed);
      },
    });
    this.addCommand({
      id: "insert-table",
      name: T.insertCmd,
      editorCallback: (editor: Editor) => {
        editor.replaceSelection(this.buildTable({ days: this.settings.defaultDays, limit: 20 }));
      },
    });

    this.registerMarkdownCodeBlockProcessor("ddl-radar", (source, el) => {
      this.renderBoard(el, parseBlockParams(source));
    });

    this.registerEvent(this.app.workspace.on("file-open", (f) => this.updateBanner(f)));
    this.registerEvent(
      this.app.metadataCache.on("changed", (f) => {
        if (f === this.app.workspace.getActiveFile()) this.updateBanner(f);
      })
    );

    this.addSettingTab(new RadarSettingTab(this.app, this));

    this.registerInterval(
      window.setInterval(() => this.refreshData(false), Math.max(1, this.settings.refreshHours) * 3600000)
    );

    // initial load after layout is ready so Notices/status bar land cleanly
    this.app.workspace.onLayoutReady(() => this.refreshData(false));
  }

  onunload() {
    document.querySelectorAll(".ddlr-banner").forEach((b) => b.remove());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // ---- data ----

  async refreshData(force: boolean) {
    const age = Date.now() - this.settings.cacheFetchedAt;
    if (!force && this.confs.length && age < this.settings.refreshHours * 3600000) {
      this.afterDataChanged();
      return;
    }
    try {
      const res = await requestUrl({ url: DATA_URL });
      this.confs = res.json as Conf[];
      this.settings.cacheConfs = this.confs;
      this.settings.cacheFetchedAt = Date.now();
      await this.saveSettings();
    } catch {
      if (this.confs.length) new Notice(T.offline);
    }
    this.afterDataChanged();
  }

  afterDataChanged() {
    this.updateStatusBar();
    this.maybeRemind();
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((l) => {
      const v = l.view;
      if (v instanceof RadarView) v.renderList();
    });
    this.updateBanner(this.app.workspace.getActiveFile());
  }

  filtered(f: Filter): { c: Conf; iso: string; abs: boolean; d: number }[] {
    const q = (f.query || "").toLowerCase();
    const out: { c: Conf; iso: string; abs: boolean; d: number }[] = [];
    for (const c of this.confs) {
      const nd = nextDeadline(c);
      if (!nd) continue;
      const d = daysLeft(nd.iso);
      if (f.days !== undefined && d > f.days) continue;
      if (f.areas && f.areas.length && !f.areas.some((a) => (c.area || "").toLowerCase() === a.toLowerCase())) continue;
      if (
        f.ranks &&
        f.ranks.length &&
        !f.ranks.some((r) => (c.rank || "").toLowerCase() === r.toLowerCase() || (c.core || "").toLowerCase() === r.toLowerCase())
      )
        continue;
      if (f.starred && !this.settings.starred.includes(c.name)) continue;
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !(c.fullName || "").toLowerCase().includes(q) &&
        !(c.aliases || []).some((a) => a.toLowerCase().includes(q))
      )
        continue;
      out.push({ c, iso: nd.iso, abs: nd.abs, d });
    }
    out.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());
    return f.limit ? out.slice(0, f.limit) : out;
  }

  findConf(ref: string): Conf | null {
    const v = ref.trim().toLowerCase();
    if (!v) return null;
    const exact = this.confs.find(
      (c) => c.name.toLowerCase() === v || (c.aliases || []).some((a) => a.toLowerCase() === v)
    );
    if (exact) return exact;
    const prefix = this.confs
      .filter((c) => c.name.toLowerCase().startsWith(v) && nextDeadline(c))
      .sort((a, b) => new Date(nextDeadline(a)!.iso).getTime() - new Date(nextDeadline(b)!.iso).getTime());
    return prefix[0] || null;
  }

  // ---- UI pieces ----

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      const right = workspace.getRightLeaf(false);
      if (!right) return;
      leaf = right;
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }

  updateStatusBar() {
    if (!this.statusEl) return;
    const urgent = this.filtered({ days: 6 }).length;
    this.statusEl.setText(urgent ? T.dueSoon(urgent) : "📡");
    this.statusEl.toggleClass("ddlr-status-urgent", urgent > 0);
  }

  maybeRemind() {
    const today = fmtDate(new Date().toISOString());
    if (this.settings.lastReminder === today) return;
    const due = this.filtered({ days: this.settings.reminderDays, starred: true });
    if (!due.length) return;
    this.settings.lastReminder = today;
    void this.saveSettings();
    for (const r of due) {
      new Notice(`📡 ${r.c.name}: ${T.days(r.d)} (${r.abs ? T.abs + " " : ""}${fmtDate(r.iso)})`, 8000);
    }
  }

  renderBoard(el: HTMLElement, f: Filter) {
    el.empty();
    el.addClass("ddlr-board");
    if (!this.confs.length) {
      el.createDiv({ text: T.empty, cls: "ddlr-empty" });
      return;
    }
    const rows = this.filtered({ days: f.days ?? this.settings.defaultDays, ...f });
    if (!rows.length) {
      el.createDiv({ text: T.empty, cls: "ddlr-empty" });
      return;
    }
    for (const r of rows) {
      const row = el.createDiv({ cls: "ddlr-row" });
      row.createSpan({ cls: "ddlr-date", text: fmtDate(r.iso) });
      const a = row.createEl("a", { cls: "ddlr-name", text: r.c.name, href: r.c.link || SITE_URL });
      a.setAttr("rel", "noopener");
      const rank = r.c.rank || r.c.core;
      if (rank) row.createSpan({ cls: "ddlr-rank", text: rank });
      if (r.abs) row.createSpan({ cls: "ddlr-abs", text: `⚠️ ${T.abs}` });
      row.createSpan({ cls: `ddlr-left ${urgencyClass(r.d)}`, text: T.days(r.d) });
    }
  }

  buildTable(f: Filter): string {
    const rows = this.filtered(f);
    const lines = [T.tblHead];
    for (const r of rows) {
      const rank = r.c.rank || r.c.core || "";
      const abs = r.abs ? ` ⚠️${T.abs}` : "";
      lines.push(
        `| ${fmtDate(r.iso)}${abs} | [${r.c.name}](${r.c.link || SITE_URL}) | ${rank} | ${r.c.area || ""} | ${T.days(r.d)} |`
      );
    }
    return lines.join("\n") + "\n";
  }

  updateBanner(file: TFile | null) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    view.containerEl.querySelectorAll(".ddlr-banner").forEach((b) => b.remove());
    if (!file || !this.confs.length) return;
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
    const raw = fm?.conference;
    if (!raw) return;
    const refs: string[] = Array.isArray(raw) ? raw.map(String) : [String(raw)];
    const content = view.containerEl.querySelector(".view-content");
    if (!content) return;
    for (const ref of refs) {
      const c = this.findConf(ref);
      if (!c) continue;
      const nd = nextDeadline(c);
      const banner = createDiv({ cls: "ddlr-banner" });
      banner.createSpan({ cls: "ddlr-banner-name", text: `📡 ${c.name}` });
      if (nd) {
        const d = daysLeft(nd.iso);
        banner.createSpan({
          cls: `ddlr-left ${urgencyClass(d)}`,
          text: `${T.days(d)} ${nd.abs ? T.absFirst : T.bannerDdl} · ${fmtDate(nd.iso)}`,
        });
        if (nd.abs && c.deadline) {
          banner.createSpan({ cls: "ddlr-banner-full", text: `${T.full}: ${fmtDate(c.deadline)}` });
        }
      } else {
        banner.createSpan({ cls: "ddlr-banner-full", text: c.rolling ? "rolling" : "—" });
      }
      const link = c.submitLink || c.link;
      if (link) {
        const a = banner.createEl("a", { cls: "ddlr-banner-link", text: "↗", href: link });
        a.setAttr("rel", "noopener");
      }
      content.prepend(banner);
    }
  }
}

function parseBlockParams(source: string): Filter {
  const f: Filter = {};
  for (const line of source.split("\n")) {
    const m = line.match(/^\s*([a-zA-Z]+)\s*:\s*(.+?)\s*$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2];
    if (key === "days") f.days = parseInt(val, 10) || undefined;
    else if (key === "limit") f.limit = parseInt(val, 10) || undefined;
    else if (key === "areas" || key === "area") f.areas = val.split(",").map((s) => s.trim()).filter(Boolean);
    else if (key === "ranks" || key === "rank") f.ranks = val.split(",").map((s) => s.trim()).filter(Boolean);
    else if (key === "starred") f.starred = val.toLowerCase() === "true";
    else if (key === "query" || key === "search") f.query = val;
  }
  return f;
}

class RadarView extends ItemView {
  plugin: DdlRadarPlugin;
  query = "";
  listEl: HTMLElement | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: DdlRadarPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "DDL Radar";
  }
  getIcon() {
    return "radar";
  }

  async onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass("ddlr-view");

    const head = root.createDiv({ cls: "ddlr-head" });
    const search = head.createEl("input", { type: "text", cls: "ddlr-search" });
    search.placeholder = T.search;
    search.oninput = () => {
      this.query = search.value.trim().toLowerCase();
      this.renderList();
    };

    const controls = head.createDiv({ cls: "ddlr-controls" });
    const starToggle = controls.createEl("label", { cls: "ddlr-startoggle" });
    const cb = starToggle.createEl("input", { type: "checkbox" });
    cb.checked = this.plugin.settings.starredOnly;
    starToggle.appendText(` ⭐ ${T.starredOnly}`);
    cb.onchange = () => {
      this.plugin.settings.starredOnly = cb.checked;
      void this.plugin.saveSettings();
      this.renderList();
    };
    const refreshBtn = controls.createEl("button", { cls: "ddlr-refresh", text: `↻ ${T.refresh}` });
    refreshBtn.onclick = async () => {
      await this.plugin.refreshData(true);
      new Notice(T.refreshed);
    };
    const site = controls.createEl("a", { cls: "ddlr-site", text: T.site, href: SITE_URL });
    site.setAttr("rel", "noopener");

    this.listEl = root.createDiv({ cls: "ddlr-list" });
    this.renderList();
    if (!this.plugin.confs.length) await this.plugin.refreshData(false);
  }

  renderList() {
    const el = this.listEl;
    if (!el) return;
    el.empty();
    const rows = this.plugin.filtered({
      query: this.query,
      starred: this.plugin.settings.starredOnly,
    });
    if (!rows.length) {
      el.createDiv({ text: T.empty, cls: "ddlr-empty" });
      return;
    }
    for (const r of rows) {
      const row = el.createDiv({ cls: "ddlr-row" });
      const star = row.createSpan({
        cls: "ddlr-star" + (this.plugin.settings.starred.includes(r.c.name) ? " is-starred" : ""),
        text: this.plugin.settings.starred.includes(r.c.name) ? "★" : "☆",
      });
      star.onclick = () => {
        const s = this.plugin.settings.starred;
        const i = s.indexOf(r.c.name);
        if (i >= 0) s.splice(i, 1);
        else s.push(r.c.name);
        void this.plugin.saveSettings();
        this.renderList();
      };
      row.createSpan({ cls: "ddlr-date", text: fmtDate(r.iso).slice(5) });
      const a = row.createEl("a", { cls: "ddlr-name", text: r.c.name, href: r.c.link || SITE_URL });
      a.setAttr("rel", "noopener");
      a.setAttr("title", r.c.fullName || r.c.name);
      const rank = r.c.rank || r.c.core;
      if (rank) row.createSpan({ cls: "ddlr-rank", text: rank });
      if (r.abs) row.createSpan({ cls: "ddlr-abs", text: `⚠️${T.abs}` });
      row.createSpan({ cls: `ddlr-left ${urgencyClass(r.d)}`, text: T.days(r.d) });
    }
  }

  async onClose() {
    this.contentEl.empty();
  }
}

class RadarSettingTab extends PluginSettingTab {
  plugin: DdlRadarPlugin;

  constructor(app: App, plugin: DdlRadarPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName(zh ? "提醒提前量（天）" : "Reminder lead time (days)")
      .setDesc(
        zh
          ? "启动时，收藏的会议在 N 天内截止会弹出提醒（每天最多一次）"
          : "On startup, show a notice for starred conferences due within N days (at most once a day)"
      )
      .addSlider((s) =>
        s
          .setLimits(1, 30, 1)
          .setValue(this.plugin.settings.reminderDays)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.reminderDays = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(zh ? "自动刷新间隔（小时）" : "Auto-refresh interval (hours)")
      .setDesc(zh ? "从公开数据集拉取最新截稿数据的频率" : "How often to re-fetch the public dataset")
      .addSlider((s) =>
        s
          .setLimits(1, 24, 1)
          .setValue(this.plugin.settings.refreshHours)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.refreshHours = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(zh ? "默认时间窗口（天）" : "Default window (days)")
      .setDesc(
        zh
          ? "代码块与插入表格默认只显示 N 天内的截稿"
          : "Code blocks and inserted tables show deadlines within N days by default"
      )
      .addSlider((s) =>
        s
          .setLimits(30, 365, 5)
          .setValue(this.plugin.settings.defaultDays)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.defaultDays = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(zh ? "数据来源" : "Data source")
      .setDesc(DATA_URL)
      .addButton((b) =>
        b.setButtonText(zh ? "立即刷新" : "Refresh now").onClick(async () => {
          await this.plugin.refreshData(true);
          new Notice(T.refreshed);
        })
      );
  }
}
