// DDL Radar — 会议截稿日追踪
const $ = (s) => document.querySelector(s);

// ---------- i18n ----------
// 等级体系随语言切换：中文界面用 CCF 等级（c.rank），英文界面用 CORE 等级（c.core）
const I18N = {
  zh: {
    htmlLang: "zh-CN",
    dateLocale: "zh-CN",
    docTitle: "DDL Radar · 会议/期刊截稿日追踪",
    subtitle: "学术会议 / 期刊截稿日追踪 — 倒计时 · 收藏 · 日历订阅",
    themeTitles: { auto: "主题：自动（跟随系统）", light: "主题：亮色", dark: "主题：暗色" },
    selAll: "全选",
    selNone: "清空",
    exportBtn: "📅 导出收藏到日历",
    exportTitle: "把收藏的会议 DDL 导出为 .ics 日历文件",
    searchPh: "🔍 搜索会议名称（如 NeurIPS / CVPR…）",
    allAreas: "全部领域",
    allRanks: "全部等级",
    nSelected: (n) => `已选 ${n} 项`,
    starredOnly: "只看收藏 ⭐",
    hidePast: "隐藏已截止",
    empty: "没有符合条件的会议 — 试试放宽筛选，或在 data.js 中添加",
    done: "已截止",
    d: "天", h: "时", m: "分",
    absFirst: "⚠️ 先交摘要！距<b>摘要</b>截止",
    absClosed: "摘要已截止 · 距全文截止",
    fullLeft: "距全文截止",
    absLabel: "摘要截止：",
    fullLabel: "全文截止：",
    localTime: "（你的本地时间）",
    absNote: " ← 早于全文，别错过",
    hist: "📈 近年 DDL：",
    histTitle: "往年全文截稿日（大致日期），帮助判断该会议 DDL 的年度规律",
    starTitle: "收藏",
    foot1: `⚠️ 截稿日期为示例/往年推算数据，投稿前请务必核对会议官网。数据维护在
      <code>data/conferences/*.yml</code>，欢迎提 PR 修改补充（CI 自动校验并重建站点）。`,
    foot2: "倒计时按会议官方时区计算（多数为 AoE = UTC-12）。收藏保存在浏览器本地。等级依据 CCF 推荐目录。",
    subBtn: "📡 订阅日历",
    subTitle: "在 Google/Apple 日历中订阅 DDL，数据更新自动同步",
    subAll: "📅 全部会议",
    alertStar: "先点 ⭐ 收藏几个会议，再导出到日历。",
    icsAbs: "摘要截止", icsFull: "全文截止",
    icsAlarm: (name, label) => `${name} ${label}仅剩 7 天`,
    rankKey: "rank",
    rankOptions: ["CCF-A", "CCF-B", "CCF-C", "Non-CCF"],
    rankOptionLabel: (v) => (v === "Non-CCF" ? "非 CCF" : v),
    rankTag: (v) => v,
  },
  en: {
    htmlLang: "en",
    dateLocale: "en-US",
    docTitle: "DDL Radar · Conference Deadline Tracker",
    subtitle: "Academic conference / journal deadline tracker — countdown · stars · calendar feed",
    themeTitles: { auto: "Theme: auto (follow system)", light: "Theme: light", dark: "Theme: dark" },
    selAll: "Select all",
    selNone: "Clear",
    exportBtn: "📅 Export stars to calendar",
    exportTitle: "Export starred deadlines as an .ics calendar file",
    searchPh: "🔍 Search conferences (e.g. NeurIPS / CVPR…)",
    allAreas: "All areas",
    allRanks: "All ranks",
    nSelected: (n) => `${n} selected`,
    starredOnly: "Starred only ⭐",
    hidePast: "Hide past",
    empty: "No conferences match — try relaxing filters, or add some in data.js",
    done: "Closed",
    d: "d", h: "h", m: "m",
    absFirst: "⚠️ Abstract first! Until <b>abstract</b> deadline",
    absClosed: "Abstract closed · until full paper deadline",
    fullLeft: "Until full paper deadline",
    absLabel: "Abstract: ",
    fullLabel: "Full paper: ",
    localTime: " (your local time)",
    absNote: " ← earlier than the full paper, don't miss it",
    hist: "📈 Past DDLs: ",
    histTitle: "Approximate full-paper deadlines from past years, to gauge each venue's yearly pattern",
    starTitle: "Star",
    foot1: `⚠️ Deadlines are sample data estimated from past cycles — always verify on the
      official website before submitting. Data lives in <code>data/conferences/*.yml</code> —
      PRs welcome (CI validates and rebuilds the site).`,
    foot2: "Countdowns use each venue's official timezone (mostly AoE = UTC-12). Stars are stored locally in your browser. Ranks follow the CORE conference ranking (portal.core.edu.au).",
    subBtn: "📡 Subscribe",
    subTitle: "Subscribe to DDLs in Google/Apple Calendar — updates sync automatically",
    subAll: "📅 All conferences",
    alertStar: "Star ⭐ a few conferences first, then export.",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core",
    rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "Unranked" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "Unranked" : `CORE ${v}`),
  },
};

// URL 参数优先（分享链接可完整复现视图），其次本地偏好，最后浏览器语言
const urlParams = new URLSearchParams(location.search);
let lang = urlParams.get("lang") || localStorage.getItem("ddlradar-lang");
if (!I18N[lang]) lang = (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
const t = (key) => I18N[lang][key];

// 会议在当前等级体系下的等级值
const rankOf = (c) => c[t("rankKey")];
// "A*" 之类的值不能直接作 CSS 类名，转成安全写法（A* → Astar）
const rankSlug = (v) => v.replace(/\*/g, "star").replace(/[^A-Za-z-]/g, "");

// 带文字的控件用"影子标签"：中英两份文案叠放在同一格，非当前语言的隐藏，
// 控件宽度 = 两者较大值 → 切换语言时尺寸/位置完全不变（免手调像素，任何字体下都成立）
function biLabel(el, key) {
  const other = lang === "zh" ? "en" : "zh";
  el.innerHTML = `<span class="bi-wrap"><span>${I18N[lang][key]}</span><span class="ghost" aria-hidden="true">${I18N[other][key]}</span></span>`;
}

// ---------- 主题切换：暗色 / 亮色 / 自动（跟随系统），图标按钮无文字宽度差 ----------
const THEME_MODES = ["auto", "light", "dark"];
const THEME_ICONS = { auto: "🖥", light: "☀️", dark: "🌙" };
let themeMode = localStorage.getItem("ddlradar-theme");
if (!THEME_MODES.includes(themeMode)) themeMode = "auto";

function applyTheme() {
  if (themeMode === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = themeMode;
  $("#themeBtn").textContent = THEME_ICONS[themeMode];
  $("#themeBtn").title = t("themeTitles")[themeMode];
  $("#themeBtn").setAttribute("aria-label", t("themeTitles")[themeMode]);
  localStorage.setItem("ddlradar-theme", themeMode);
}
$("#themeBtn").onclick = () => {
  themeMode = THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length];
  applyTheme();
};

const state = {
  search: urlParams.get("q") || "",
  areas: new Set((urlParams.get("areas") || "").split(",").filter(Boolean)),   // 空 = 全部
  ranks: new Set((urlParams.get("ranks") || "").split(",").filter(Boolean)),   // 空 = 全部（值属于当前语言的等级体系）
  starredOnly: urlParams.get("star") === "1",
  hidePast: urlParams.get("past") !== "show",
  starred: new Set(JSON.parse(localStorage.getItem("ddlradar-starred") || "[]")),
};

// 筛选状态实时写回 URL（replaceState 不产生历史记录），复制地址栏即可分享当前视图
let lastUrl = null;
function syncUrl() {
  const p = new URLSearchParams();
  p.set("lang", lang);
  if (state.search) p.set("q", state.search);
  if (state.areas.size) p.set("areas", [...state.areas].join(","));
  if (state.ranks.size) p.set("ranks", [...state.ranks].join(","));
  if (state.starredOnly) p.set("star", "1");
  if (!state.hidePast) p.set("past", "show");
  const url = location.pathname + "?" + p.toString();
  if (url !== lastUrl) {
    lastUrl = url;
    try { history.replaceState(null, "", url); } catch (e) { /* file:// 下部分浏览器禁止 */ }
  }
}

function saveStars() {
  localStorage.setItem("ddlradar-starred", JSON.stringify([...state.starred]));
}

// ---------- 多选下拉 ----------

function setupMsel(rootSel, selected, getOptions, getAllLabel, getOptionLabel) {
  const root = $(rootSel);
  const btn = root.querySelector(".msel-btn");
  const panel = root.querySelector(".msel-panel");

  function refreshBtn() {
    const chosen = [...selected];
    btn.textContent = !chosen.length
      ? getAllLabel()
      : chosen.length <= 2
        ? chosen.map(getOptionLabel).join(" + ")
        : t("nSelected")(chosen.length);
    btn.classList.toggle("active", chosen.length > 0);
  }

  function rebuild() {
    panel.innerHTML = `<div class="msel-actions">
        <button type="button" data-act="all">${t("selAll")}</button>
        <button type="button" data-act="none">${t("selNone")}</button>
      </div>` + getOptions().map((v) => `<label>
        <input type="checkbox" value="${v}" ${selected.has(v) ? "checked" : ""}> ${getOptionLabel(v)}
      </label>`).join("");
    panel.querySelectorAll("input").forEach((cb) => {
      cb.onchange = () => {
        cb.checked ? selected.add(cb.value) : selected.delete(cb.value);
        refreshBtn();
        render();
      };
    });
    panel.querySelectorAll(".msel-actions button").forEach((b) => {
      b.onclick = () => {
        if (b.dataset.act === "all") getOptions().forEach((v) => selected.add(v));
        else selected.clear();
        rebuild();
        render();
      };
    });
    refreshBtn();
  }

  btn.onclick = (e) => {
    e.stopPropagation();
    const wasOpen = root.classList.contains("open");
    document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open"));
    if (!wasOpen) root.classList.add("open");
  };
  panel.onclick = (e) => e.stopPropagation();

  return { rebuild };
}

document.addEventListener("click", () =>
  document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open")));

const areaSel = setupMsel("#areaSel", state.areas,
  () => [...new Set(CONFERENCES.map((c) => c.area))].sort(),
  () => t("allAreas"), (v) => v);

const rankSel = setupMsel("#rankSel", state.ranks,
  () => t("rankOptions"),
  () => t("allRanks"), (v) => t("rankOptionLabel")(v));

// ---------- 日历订阅（webcal feeds，由 scripts/build.js 生成） ----------

const FEED_HOST = "yzyhhhstudy.github.io/paper-deadlines";
const feedSlug = (s) => s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function buildSubPanel() {
  const link = (slug, label) => `<a href="webcal://${FEED_HOST}/feeds/${slug}.ics">${label}</a>`;
  const areas = [...new Set(CONFERENCES.map((c) => c.area))].sort();
  $("#subPanel").innerHTML =
    link("all", t("subAll")) + areas.map((a) => link(feedSlug(a), a)).join("");
  biLabel($("#subBtn"), "subBtn");
  $("#subBtn").title = t("subTitle");
}

$("#subBtn").onclick = (e) => {
  e.stopPropagation();
  const root = $("#subSel");
  const wasOpen = root.classList.contains("open");
  document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open"));
  if (!wasOpen) root.classList.add("open");
};

// ---------- 倒计时 ----------

// 下一个截点：摘要截止未过 → 摘要；否则 → 全文
function nextDeadline(conf) {
  if (conf.abstractDeadline && new Date(conf.abstractDeadline).getTime() > Date.now()) {
    return { iso: conf.abstractDeadline, type: "abstract" };
  }
  return { iso: conf.deadline, type: "full" };
}

// 距下一个截点（排序、倒计时用）
function msLeft(conf) {
  return new Date(nextDeadline(conf).iso).getTime() - Date.now();
}

// 距全文截止（判断"已截止"用）
function fullMsLeft(conf) {
  return new Date(conf.deadline).getTime() - Date.now();
}

function countdownHtml(conf) {
  if (fullMsLeft(conf) <= 0) return `<div class="countdown done">${t("done")}</div>`;
  const nd = nextDeadline(conf);
  const ms = new Date(nd.iso).getTime() - Date.now();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const cls = d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
  const label = nd.type === "abstract"
    ? `<div class="cd-label abs">${t("absFirst")}</div>`
    : conf.abstractDeadline
      ? `<div class="cd-label">${t("absClosed")}</div>`
      : `<div class="cd-label">${t("fullLeft")}</div>`;
  return `${label}<div class="countdown ${cls}">${d}<small>${t("d")}</small>${h}<small>${t("h")}</small>${m}<small>${t("m")}</small></div>`;
}

function fmtLocal(iso) {
  return new Date(iso).toLocaleString(t("dateLocale"), {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

// "2024-05-22" → "'24 05/22"
function fmtHist(d) {
  const [y, m, dd] = d.split("-");
  return `'${y.slice(2)} ${m}/${dd}`;
}

// ---------- 渲染 ----------

function visibleConfs() {
  const q = state.search.toLowerCase();
  return CONFERENCES
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q))
    .filter((c) => !state.areas.size || state.areas.has(c.area))
    .filter((c) => !state.ranks.size || state.ranks.has(rankOf(c)))
    .filter((c) => !state.starredOnly || state.starred.has(c.name))
    .filter((c) => !state.hidePast || fullMsLeft(c) > 0)
    .sort((a, b) => {
      const aAlive = fullMsLeft(a) > 0, bAlive = fullMsLeft(b) > 0;
      // 未截止的按「下一个截点」（摘要或全文）升序，已截止的排最后
      if (aAlive && bAlive) return msLeft(a) - msLeft(b);
      if (aAlive) return -1;
      if (bAlive) return 1;
      return fullMsLeft(b) - fullMsLeft(a);
    });
}

function render() {
  syncUrl();
  const wrap = $("#cards");
  const confs = visibleConfs();
  if (!confs.length) {
    wrap.innerHTML = `<div class="empty">${t("empty")}</div>`;
    return;
  }
  wrap.innerHTML = confs.map((c) => {
    const past = fullMsLeft(c) <= 0;
    const star = state.starred.has(c.name);
    const absUpcoming = nextDeadline(c).type === "abstract";
    const rank = rankOf(c);
    return `<div class="card ${past ? "past" : ""}">
      <div class="card-top">
        <h3><a href="${c.link}" target="_blank" rel="noopener">${c.name}</a></h3>
        <button class="star ${star ? "on" : ""}" data-name="${c.name}" title="${t("starTitle")}">⭐</button>
      </div>
      <div class="full-name">${c.fullName}</div>
      <div class="tags">
        <span class="tag rank-${rankSlug(rank)}">${t("rankTag")(rank)}</span>
        <span class="tag">${c.area}</span>
        <span class="tag">📍 ${c.place}</span>
        <span class="tag">🗓 ${c.confDate}</span>
      </div>
      ${countdownHtml(c)}
      <div class="meta">
        ${c.abstractDeadline ? `<span class="${absUpcoming ? "abs-hot" : ""}">${absUpcoming ? "⚠️ " : ""}${t("absLabel")}<b>${fmtLocal(c.abstractDeadline)}</b>${t("localTime")}${absUpcoming ? t("absNote") : ""}</span><br>` : ""}
        ${t("fullLabel")}<b>${fmtLocal(c.deadline)}</b>${t("localTime")}
        ${c.history ? `<br><span class="hist" title="${t("histTitle")}">${t("hist")}${c.history.map(fmtHist).join(" · ")}</span>` : ""}
      </div>
    </div>`;
  }).join("");

  wrap.querySelectorAll(".star").forEach((btn) => {
    btn.onclick = () => {
      const n = btn.dataset.name;
      state.starred.has(n) ? state.starred.delete(n) : state.starred.add(n);
      saveStars();
      render();
    };
  });
}

// ---------- 语言切换 ----------

function applyLang() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("docTitle");
  $("#subtitle").textContent = t("subtitle");
  $("#langSeg").querySelectorAll("button").forEach((b) =>
    b.classList.toggle("on", b.dataset.lang === lang));
  biLabel($("#exportIcs"), "exportBtn");
  $("#exportIcs").title = t("exportTitle");
  $("#search").placeholder = t("searchPh");
  biLabel($("#starredLabel"), "starredOnly");
  biLabel($("#hidePastLabel"), "hidePast");
  $("#foot1").innerHTML = t("foot1");
  $("#foot2").textContent = t("foot2");
  applyTheme();
  buildSubPanel();
  areaSel.rebuild();
  rankSel.rebuild();
  render();
  localStorage.setItem("ddlradar-lang", lang);
}

$("#langSeg").querySelectorAll("button").forEach((b) => {
  b.onclick = () => {
    if (lang === b.dataset.lang) return;
    lang = b.dataset.lang;
    state.ranks.clear(); // CCF 与 CORE 的等级值不同，切语言时清空等级筛选
    applyLang();
  };
});

// ---------- .ics 导出 ----------

function icsDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function exportIcs() {
  const chosen = CONFERENCES.filter((c) => state.starred.has(c.name));
  if (!chosen.length) {
    alert(t("alertStar"));
    return;
  }
  const events = chosen.flatMap((c) => {
    const mk = (label, iso) => [
      "BEGIN:VEVENT",
      `UID:${c.name.replace(/\s+/g, "-")}-${label.replace(/\s+/g, "-")}@ddlradar`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(iso)}`,
      `DTEND:${icsDate(iso)}`,
      `SUMMARY:📡 ${c.name} ${label}`,
      `DESCRIPTION:${c.fullName}\\n${c.link}`,
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${t("icsAlarm")(c.name, label)}`,
      "END:VALARM",
      "END:VEVENT",
    ];
    return [
      ...(c.abstractDeadline ? mk(t("icsAbs"), c.abstractDeadline) : []),
      ...mk(t("icsFull"), c.deadline),
    ];
  });
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DDLRadar//CN",
    ...events, "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ddl-radar.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- 控件 ----------

$("#search").value = state.search;
$("#starredOnly").checked = state.starredOnly;
$("#hidePast").checked = state.hidePast;
$("#search").oninput = (e) => { state.search = e.target.value.trim(); render(); };
$("#starredOnly").onchange = (e) => { state.starredOnly = e.target.checked; render(); };
$("#hidePast").onchange = (e) => { state.hidePast = e.target.checked; render(); };
$("#exportIcs").onclick = exportIcs;

applyLang();
setInterval(render, 60 * 1000); // 每分钟刷新倒计时
