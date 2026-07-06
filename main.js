"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => DdlRadarPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DATA_URL = "https://yzyhhhstudy.github.io/paper-deadlines/data.json";
var SITE_URL = "https://yzyhhhstudy.github.io/paper-deadlines/";
var VIEW_TYPE = "ddl-radar-view";
var DAY_MS = 864e5;
var DEFAULT_SETTINGS = {
  language: "en",
  starred: [],
  reminderDays: 7,
  refreshHours: 6,
  defaultDays: 180,
  starredOnly: false,
  lastReminder: "",
  cacheConfs: [],
  cacheFetchedAt: 0
};
var STRINGS = {
  en: {
    panel: "DDL Radar: conference deadlines",
    search: "Search venues\u2026",
    starredOnly: "Starred only",
    refresh: "Refresh data",
    refreshed: "DDL Radar data refreshed",
    offline: "DDL Radar: fetch failed, using cached data",
    empty: "No upcoming deadlines",
    abs: "abstract",
    absFirst: "\u26A0\uFE0F abstract due",
    full: "deadline",
    insertCmd: "Insert deadline table",
    openCmd: "Open deadline panel",
    refreshCmd: "Refresh conference data",
    days: (d) => `${d}d`,
    dueSoon: (n) => `\u{1F4E1} ${n} deadline${n > 1 ? "s" : ""} within 7 days`,
    tblHead: "| Deadline | Conference | Rank | Area | Countdown |\n|---|---|---|---|---|",
    bannerDdl: "until deadline",
    site: "Full site \u2192",
    setLanguage: "Language",
    setLanguageDesc: "Plugin interface language",
    setReminder: "Reminder lead time (days)",
    setReminderDesc: "On startup, show a notice for starred conferences due within N days (at most once a day)",
    setRefresh: "Auto-refresh interval (hours)",
    setRefreshDesc: "How often to re-fetch the public dataset",
    setWindow: "Default window (days)",
    setWindowDesc: "Code blocks and inserted tables show deadlines within N days by default",
    setSource: "Data source",
    refreshNow: "Refresh now"
  },
  zh: {
    panel: "DDL Radar\uFF1A\u4F1A\u8BAE\u622A\u7A3F",
    search: "\u641C\u7D22\u4F1A\u8BAE\u2026",
    starredOnly: "\u53EA\u770B\u6536\u85CF",
    refresh: "\u5237\u65B0\u6570\u636E",
    refreshed: "DDL Radar \u6570\u636E\u5DF2\u5237\u65B0",
    offline: "DDL Radar\uFF1A\u62C9\u53D6\u6570\u636E\u5931\u8D25\uFF0C\u4F7F\u7528\u672C\u5730\u7F13\u5B58",
    empty: "\u6CA1\u6709\u5373\u5C06\u622A\u6B62\u7684\u4F1A\u8BAE",
    abs: "\u6458\u8981",
    absFirst: "\u26A0\uFE0F \u6458\u8981\u622A\u6B62",
    full: "\u622A\u7A3F",
    insertCmd: "\u63D2\u5165\u622A\u7A3F\u8868\u683C",
    openCmd: "\u6253\u5F00\u622A\u7A3F\u9762\u677F",
    refreshCmd: "\u5237\u65B0\u4F1A\u8BAE\u6570\u636E",
    days: (d) => `${d} \u5929`,
    dueSoon: (n) => `\u{1F4E1} ${n} \u4E2A\u4F1A\u8BAE 7 \u5929\u5185\u622A\u6B62`,
    tblHead: "| \u622A\u7A3F | \u4F1A\u8BAE | \u7B49\u7EA7 | \u9886\u57DF | \u5012\u8BA1\u65F6 |\n|---|---|---|---|---|",
    bannerDdl: "\u8DDD\u622A\u7A3F",
    site: "\u5B8C\u6574\u7AD9\u70B9 \u2192",
    setLanguage: "\u8BED\u8A00 / Language",
    setLanguageDesc: "\u63D2\u4EF6\u754C\u9762\u8BED\u8A00",
    setReminder: "\u63D0\u9192\u63D0\u524D\u91CF\uFF08\u5929\uFF09",
    setReminderDesc: "\u542F\u52A8\u65F6\uFF0C\u6536\u85CF\u7684\u4F1A\u8BAE\u5728 N \u5929\u5185\u622A\u6B62\u4F1A\u5F39\u51FA\u63D0\u9192\uFF08\u6BCF\u5929\u6700\u591A\u4E00\u6B21\uFF09",
    setRefresh: "\u81EA\u52A8\u5237\u65B0\u95F4\u9694\uFF08\u5C0F\u65F6\uFF09",
    setRefreshDesc: "\u4ECE\u516C\u5F00\u6570\u636E\u96C6\u62C9\u53D6\u6700\u65B0\u622A\u7A3F\u6570\u636E\u7684\u9891\u7387",
    setWindow: "\u9ED8\u8BA4\u65F6\u95F4\u7A97\u53E3\uFF08\u5929\uFF09",
    setWindowDesc: "\u4EE3\u7801\u5757\u4E0E\u63D2\u5165\u8868\u683C\u9ED8\u8BA4\u53EA\u663E\u793A N \u5929\u5185\u7684\u622A\u7A3F",
    setSource: "\u6570\u636E\u6765\u6E90",
    refreshNow: "\u7ACB\u5373\u5237\u65B0"
  }
};
function nextDeadline(c) {
  if (c.rolling || !c.deadline) return null;
  if (new Date(c.deadline).getTime() <= Date.now()) return null;
  if (c.abstractDeadline && new Date(c.abstractDeadline).getTime() > Date.now()) {
    return { iso: c.abstractDeadline, abs: true };
  }
  return { iso: c.deadline, abs: false };
}
function daysLeft(iso) {
  return Math.floor((new Date(iso).getTime() - Date.now()) / DAY_MS);
}
function urgencyClass(d) {
  return d < 7 ? "ddlr-urgent" : d < 30 ? "ddlr-soon" : "ddlr-safe";
}
function displayRank(c, lang) {
  if (lang === "zh") return c.rank || (c.core ? `CORE ${c.core}` : "");
  return c.core ? `CORE ${c.core}` : c.rank || "";
}
function fmtDate(iso) {
  const dt = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}
var DdlRadarPlugin = class extends import_obsidian.Plugin {
  settings = { ...DEFAULT_SETTINGS };
  confs = [];
  statusEl = null;
  get t() {
    return STRINGS[this.settings.language] ?? STRINGS.en;
  }
  async onload() {
    await this.loadSettings();
    this.confs = this.settings.cacheConfs;
    this.registerView(VIEW_TYPE, (leaf) => new RadarView(leaf, this));
    this.addRibbonIcon("radar", "DDL Radar", () => this.activateView());
    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass("ddlr-status");
    this.statusEl.onClickEvent(() => this.activateView());
    this.addCommand({
      id: "open-panel",
      name: this.t.openCmd,
      callback: () => this.activateView()
    });
    this.addCommand({
      id: "refresh-data",
      name: this.t.refreshCmd,
      callback: async () => {
        await this.refreshData(true);
        new import_obsidian.Notice(this.t.refreshed);
      }
    });
    this.addCommand({
      id: "insert-table",
      name: this.t.insertCmd,
      editorCallback: (editor) => {
        editor.replaceSelection(this.buildTable({ days: this.settings.defaultDays, limit: 20 }));
      }
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
      window.setInterval(() => this.refreshData(false), Math.max(1, this.settings.refreshHours) * 36e5)
    );
    this.app.workspace.onLayoutReady(() => this.refreshData(false));
  }
  onunload() {
    activeDocument.querySelectorAll(".ddlr-banner").forEach((b) => b.remove());
  }
  async loadSettings() {
    const saved = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...saved ?? {} };
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  applyLanguage() {
    this.updateStatusBar();
    this.updateBanner(this.app.workspace.getActiveFile());
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((l) => {
      const v = l.view;
      if (v instanceof RadarView) v.rebuild();
    });
  }
  // ---- data ----
  async refreshData(force) {
    const age = Date.now() - this.settings.cacheFetchedAt;
    if (!force && this.confs.length && age < this.settings.refreshHours * 36e5) {
      this.afterDataChanged();
      return;
    }
    try {
      const res = await (0, import_obsidian.requestUrl)({ url: DATA_URL });
      this.confs = res.json;
      this.settings.cacheConfs = this.confs;
      this.settings.cacheFetchedAt = Date.now();
      await this.saveSettings();
    } catch {
      if (this.confs.length) new import_obsidian.Notice(this.t.offline);
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
  filtered(f) {
    const q = (f.query || "").toLowerCase();
    const out = [];
    for (const c of this.confs) {
      const nd = nextDeadline(c);
      if (!nd) continue;
      const d = daysLeft(nd.iso);
      if (f.days !== void 0 && d > f.days) continue;
      if (f.areas && f.areas.length && !f.areas.some((a) => (c.area || "").toLowerCase() === a.toLowerCase())) continue;
      if (f.ranks && f.ranks.length && !f.ranks.some((r) => (c.rank || "").toLowerCase() === r.toLowerCase() || (c.core || "").toLowerCase() === r.toLowerCase()))
        continue;
      if (f.starred && !this.settings.starred.includes(c.name)) continue;
      if (q && !c.name.toLowerCase().includes(q) && !(c.fullName || "").toLowerCase().includes(q) && !(c.aliases || []).some((a) => a.toLowerCase().includes(q)))
        continue;
      out.push({ c, iso: nd.iso, abs: nd.abs, d });
    }
    out.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());
    return f.limit ? out.slice(0, f.limit) : out;
  }
  findConf(ref) {
    const v = ref.trim().toLowerCase();
    if (!v) return null;
    const exact = this.confs.find(
      (c) => c.name.toLowerCase() === v || (c.aliases || []).some((a) => a.toLowerCase() === v)
    );
    if (exact) return exact;
    const prefix = this.confs.filter((c) => c.name.toLowerCase().startsWith(v) && nextDeadline(c)).sort((a, b) => new Date(nextDeadline(a).iso).getTime() - new Date(nextDeadline(b).iso).getTime());
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
    this.statusEl.setText(urgent ? this.t.dueSoon(urgent) : "\u{1F4E1}");
    this.statusEl.toggleClass("ddlr-status-urgent", urgent > 0);
  }
  maybeRemind() {
    const today = fmtDate((/* @__PURE__ */ new Date()).toISOString());
    if (this.settings.lastReminder === today) return;
    const due = this.filtered({ days: this.settings.reminderDays, starred: true });
    if (!due.length) return;
    this.settings.lastReminder = today;
    void this.saveSettings();
    for (const r of due) {
      new import_obsidian.Notice(`\u{1F4E1} ${r.c.name}: ${this.t.days(r.d)} (${r.abs ? this.t.abs + " " : ""}${fmtDate(r.iso)})`, 8e3);
    }
  }
  renderBoard(el, f) {
    el.empty();
    el.addClass("ddlr-board");
    if (!this.confs.length) {
      el.createDiv({ text: this.t.empty, cls: "ddlr-empty" });
      return;
    }
    const rows = this.filtered({ days: f.days ?? this.settings.defaultDays, ...f });
    if (!rows.length) {
      el.createDiv({ text: this.t.empty, cls: "ddlr-empty" });
      return;
    }
    for (const r of rows) {
      const row = el.createDiv({ cls: "ddlr-row" });
      row.createSpan({ cls: "ddlr-date", text: fmtDate(r.iso) });
      const a = row.createEl("a", { cls: "ddlr-name", text: r.c.name, href: r.c.link || SITE_URL });
      a.setAttr("rel", "noopener");
      const rank = displayRank(r.c, this.settings.language);
      if (rank) row.createSpan({ cls: "ddlr-rank", text: rank });
      if (r.abs) row.createSpan({ cls: "ddlr-abs", text: `\u26A0\uFE0F ${this.t.abs}` });
      row.createSpan({ cls: `ddlr-left ${urgencyClass(r.d)}`, text: this.t.days(r.d) });
    }
  }
  buildTable(f) {
    const rows = this.filtered(f);
    const lines = [this.t.tblHead];
    for (const r of rows) {
      const rank = displayRank(r.c, this.settings.language);
      const abs = r.abs ? ` \u26A0\uFE0F${this.t.abs}` : "";
      lines.push(
        `| ${fmtDate(r.iso)}${abs} | [${r.c.name}](${r.c.link || SITE_URL}) | ${rank} | ${r.c.area || ""} | ${this.t.days(r.d)} |`
      );
    }
    return lines.join("\n") + "\n";
  }
  updateBanner(file) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view) return;
    view.containerEl.querySelectorAll(".ddlr-banner").forEach((b) => b.remove());
    if (!file || !this.confs.length) return;
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
    const raw = fm?.conference;
    if (raw == null || raw === "") return;
    const refs = (Array.isArray(raw) ? raw : [raw]).map((x) => String(x));
    const content = view.containerEl.querySelector(".view-content");
    if (!content) return;
    for (const ref of refs) {
      const c = this.findConf(ref);
      if (!c) continue;
      const nd = nextDeadline(c);
      const banner = createDiv({ cls: "ddlr-banner" });
      banner.createSpan({ cls: "ddlr-banner-name", text: `\u{1F4E1} ${c.name}` });
      if (nd) {
        const d = daysLeft(nd.iso);
        banner.createSpan({
          cls: `ddlr-left ${urgencyClass(d)}`,
          text: `${this.t.days(d)} ${nd.abs ? this.t.absFirst : this.t.bannerDdl} \xB7 ${fmtDate(nd.iso)}`
        });
        if (nd.abs && c.deadline) {
          banner.createSpan({ cls: "ddlr-banner-full", text: `${this.t.full}: ${fmtDate(c.deadline)}` });
        }
      } else {
        banner.createSpan({ cls: "ddlr-banner-full", text: c.rolling ? "rolling" : "\u2014" });
      }
      const link = c.submitLink || c.link;
      if (link) {
        const a = banner.createEl("a", { cls: "ddlr-banner-link", text: "\u2197", href: link });
        a.setAttr("rel", "noopener");
      }
      content.prepend(banner);
    }
  }
};
function parseBlockParams(source) {
  const f = {};
  for (const line of source.split("\n")) {
    const m = line.match(/^\s*([a-zA-Z]+)\s*:\s*(.+?)\s*$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2];
    if (key === "days") f.days = parseInt(val, 10) || void 0;
    else if (key === "limit") f.limit = parseInt(val, 10) || void 0;
    else if (key === "areas" || key === "area") f.areas = val.split(",").map((s) => s.trim()).filter(Boolean);
    else if (key === "ranks" || key === "rank") f.ranks = val.split(",").map((s) => s.trim()).filter(Boolean);
    else if (key === "starred") f.starred = val.toLowerCase() === "true";
    else if (key === "query" || key === "search") f.query = val;
  }
  return f;
}
var RadarView = class extends import_obsidian.ItemView {
  plugin;
  query = "";
  listEl = null;
  constructor(leaf, plugin) {
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
    this.rebuild();
    if (!this.plugin.confs.length) await this.plugin.refreshData(false);
  }
  rebuild() {
    const t = this.plugin.t;
    const root = this.contentEl;
    root.empty();
    root.addClass("ddlr-view");
    const head = root.createDiv({ cls: "ddlr-head" });
    const search = head.createEl("input", { type: "text", cls: "ddlr-search" });
    search.placeholder = t.search;
    search.value = this.query;
    search.oninput = () => {
      this.query = search.value.trim().toLowerCase();
      this.renderList();
    };
    const controls = head.createDiv({ cls: "ddlr-controls" });
    const starToggle = controls.createEl("label", { cls: "ddlr-startoggle" });
    const cb = starToggle.createEl("input", { type: "checkbox" });
    cb.checked = this.plugin.settings.starredOnly;
    starToggle.appendText(` \u2B50 ${t.starredOnly}`);
    cb.onchange = () => {
      this.plugin.settings.starredOnly = cb.checked;
      void this.plugin.saveSettings();
      this.renderList();
    };
    const refreshBtn = controls.createEl("button", { cls: "ddlr-refresh", text: `\u21BB ${t.refresh}` });
    refreshBtn.onclick = async () => {
      await this.plugin.refreshData(true);
      new import_obsidian.Notice(this.plugin.t.refreshed);
    };
    const site = controls.createEl("a", { cls: "ddlr-site", text: t.site, href: SITE_URL });
    site.setAttr("rel", "noopener");
    this.listEl = root.createDiv({ cls: "ddlr-list" });
    this.renderList();
  }
  renderList() {
    const el = this.listEl;
    if (!el) return;
    el.empty();
    const t = this.plugin.t;
    const rows = this.plugin.filtered({
      query: this.query,
      starred: this.plugin.settings.starredOnly
    });
    if (!rows.length) {
      el.createDiv({ text: t.empty, cls: "ddlr-empty" });
      return;
    }
    for (const r of rows) {
      const row = el.createDiv({ cls: "ddlr-row" });
      const star = row.createSpan({
        cls: "ddlr-star" + (this.plugin.settings.starred.includes(r.c.name) ? " is-starred" : ""),
        text: this.plugin.settings.starred.includes(r.c.name) ? "\u2605" : "\u2606"
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
      const rank = displayRank(r.c, this.plugin.settings.language);
      if (rank) row.createSpan({ cls: "ddlr-rank", text: rank });
      if (r.abs) row.createSpan({ cls: "ddlr-abs", text: `\u26A0\uFE0F${t.abs}` });
      row.createSpan({ cls: `ddlr-left ${urgencyClass(r.d)}`, text: t.days(r.d) });
    }
  }
  async onClose() {
    this.contentEl.empty();
  }
};
var RadarSettingTab = class extends import_obsidian.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    const t = this.plugin.t;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName(t.setLanguage).setDesc(t.setLanguageDesc).addDropdown(
      (dd) => dd.addOption("en", "English").addOption("zh", "\u4E2D\u6587").setValue(this.plugin.settings.language).onChange(async (v) => {
        this.plugin.settings.language = v === "zh" ? "zh" : "en";
        await this.plugin.saveSettings();
        this.plugin.applyLanguage();
        this.display();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t.setReminder).setDesc(t.setReminderDesc).addSlider(
      (s) => s.setLimits(1, 30, 1).setValue(this.plugin.settings.reminderDays).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.reminderDays = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t.setRefresh).setDesc(t.setRefreshDesc).addSlider(
      (s) => s.setLimits(1, 24, 1).setValue(this.plugin.settings.refreshHours).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.refreshHours = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t.setWindow).setDesc(t.setWindowDesc).addSlider(
      (s) => s.setLimits(30, 365, 5).setValue(this.plugin.settings.defaultDays).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.defaultDays = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t.setSource).setDesc(DATA_URL).addButton(
      (b) => b.setButtonText(t.refreshNow).onClick(async () => {
        await this.plugin.refreshData(true);
        new import_obsidian.Notice(this.plugin.t.refreshed);
      })
    );
  }
};
