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
    sortOptions: { deadline: "按截止时间", h5: "按 h5 指数", accept: "按录取率" },
    viewCards: "▦ 卡片",
    viewTimeline: "☰ 时间线",
    viewKanban: "▤ 看板",
    statusNames: { planned: "想投", writing: "在写", submitted: "已投", rebuttal: "Rebuttal" },
    statusNone: "＋ 状态",
    kanbanEmpty: "还没有会议进入投稿流程 — 在会议卡片右上角选择「想投 / 在写 / 已投 / Rebuttal」即可加入看板",
    notifLabel: "结果通知：",
    rebuttalLabel: "Rebuttal：",
    tlRolling: "🔄 期刊 · 随时可投",
    absTag: "摘要截止",
    daysLeft: (d) => `${d} 天`,
    h5Tag: (v) => `h5 ${v}`,
    acceptTag: (v) => `录取率 ${v}`,
    rolling: "🔄 随时可投",
    rollingLabel: "滚动审稿",
    rollingMeta: "期刊滚动收稿，无固定截止日期",
    journalTag: "期刊",
    notifyTitle: (name, d) => `📡 ${name} 还有 ${d} 天截稿`,
    notifyOn: "DDL 提醒已开启：收藏的会议临近截止时通知（提前 7 天 / 1 天）· 点击关闭",
    notifyOff: "开启 DDL 提醒（收藏的会议临近截止时浏览器通知）",
    contribLead: "发现 DDL 过期或缺了你关注的会议？",
    contribAdd: "➕ 添加新会议",
    contribFix: "✏️ 修正现有数据",
    contribTail: "（在 GitHub 上直接编辑 YAML 并提 PR，CI 自动校验）",
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
    sortOptions: { deadline: "By deadline", h5: "By h5-index", accept: "By accept rate" },
    viewCards: "▦ Cards",
    viewTimeline: "☰ Timeline",
    viewKanban: "▤ Board",
    statusNames: { planned: "Planned", writing: "Writing", submitted: "Submitted", rebuttal: "Rebuttal" },
    statusNone: "＋ status",
    kanbanEmpty: "Nothing in your pipeline yet — pick “Planned / Writing / Submitted / Rebuttal” on any conference card",
    notifLabel: "Notification: ",
    rebuttalLabel: "Rebuttal: ",
    tlRolling: "🔄 Journals · rolling",
    absTag: "abstract",
    daysLeft: (d) => `${d}d`,
    h5Tag: (v) => `h5 ${v}`,
    acceptTag: (v) => `acc. ${v}`,
    rolling: "🔄 Open for submission",
    rollingLabel: "Rolling review",
    rollingMeta: "Journal with rolling submissions — no fixed deadline",
    journalTag: "Journal",
    notifyTitle: (name, d) => `📡 ${name} — ${d} day${d > 1 ? "s" : ""} to deadline`,
    notifyOn: "DDL reminders on: notified 7 days / 1 day before starred deadlines · click to turn off",
    notifyOff: "Enable DDL reminders (browser notifications for starred venues)",
    contribLead: "Spotted an outdated DDL, or missing your venue?",
    contribAdd: "➕ Add a conference",
    contribFix: "✏️ Fix existing data",
    contribTail: "(edit the YAML on GitHub and open a PR — CI validates it)",
    alertStar: "Star ⭐ a few conferences first, then export.",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core",
    rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "Unranked" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "Unranked" : `CORE ${v}`),
  },
  ja: {
    htmlLang: "ja",
    dateLocale: "ja-JP",
    docTitle: "DDL Radar · 学会締切トラッカー",
    subtitle: "学会・ジャーナル投稿締切トラッカー — カウントダウン · お気に入り · カレンダー連携",
    themeTitles: { auto: "テーマ：自動（システムに従う）", light: "テーマ：ライト", dark: "テーマ：ダーク" },
    selAll: "すべて選択",
    selNone: "クリア",
    exportBtn: "📅 お気に入りをカレンダーへ",
    exportTitle: "お気に入りの締切を .ics ファイルとして書き出す",
    searchPh: "🔍 学会名で検索（例：NeurIPS / CVPR…）",
    allAreas: "全分野",
    allRanks: "全ランク",
    nSelected: (n) => `${n} 件選択中`,
    starredOnly: "お気に入りのみ ⭐",
    hidePast: "締切済みを隠す",
    empty: "該当する学会がありません — フィルタを緩めるか、YAML で追加してください",
    done: "締切済み",
    d: "日", h: "時間", m: "分",
    absFirst: "⚠️ まずアブストラクト！<b>アブスト</b>締切まで",
    absClosed: "アブスト締切済み · 本文締切まで",
    fullLeft: "本文締切まで",
    absLabel: "アブスト締切：",
    fullLabel: "本文締切：",
    localTime: "（ローカル時間）",
    absNote: " ← 本文より早いので注意",
    hist: "📈 過去の締切：",
    histTitle: "過去数年の本文締切（目安）。毎年の傾向の把握に",
    starTitle: "お気に入り",
    foot1: `⚠️ 締切はサンプル／過去の傾向からの推定です。投稿前に必ず公式サイトでご確認ください。
      データは <code>data/conferences/*.yml</code> で管理（PR 歓迎、CI が自動検証）。`,
    foot2: "カウントダウンは各学会の公式タイムゾーン（多くは AoE = UTC-12）基準。お気に入りはブラウザに保存。ランクは CORE ランキング（portal.core.edu.au）に基づきます。",
    sortOptions: { deadline: "締切順", h5: "h5 指数順", accept: "採択率順" },
    viewCards: "▦ カード",
    viewTimeline: "☰ タイムライン",
    viewKanban: "▤ ボード",
    statusNames: { planned: "投稿予定", writing: "執筆中", submitted: "投稿済み", rebuttal: "リバッタル" },
    statusNone: "＋ 状態",
    kanbanEmpty: "パイプラインはまだ空です — カードで「投稿予定 / 執筆中 / 投稿済み / リバッタル」を選んでください",
    notifLabel: "結果通知：",
    rebuttalLabel: "リバッタル：",
    tlRolling: "🔄 ジャーナル · 随時投稿可",
    absTag: "アブスト",
    daysLeft: (d) => `${d} 日`,
    h5Tag: (v) => `h5 ${v}`,
    acceptTag: (v) => `採択率 ${v}`,
    rolling: "🔄 随時投稿可",
    rollingLabel: "ローリング査読",
    rollingMeta: "ジャーナルは随時投稿可、固定締切なし",
    journalTag: "ジャーナル",
    notifyTitle: (name, d) => `📡 ${name} 締切まであと ${d} 日`,
    notifyOn: "締切リマインダー ON：お気に入りの締切 7 日前 / 1 日前に通知 · クリックで OFF",
    notifyOff: "締切リマインダーを有効にする（ブラウザ通知）",
    contribLead: "締切が古い、または学会が見つからない？",
    contribAdd: "➕ 学会を追加",
    contribFix: "✏️ データを修正",
    contribTail: "（GitHub 上で YAML を編集して PR — CI が自動検証）",
    subBtn: "📡 購読",
    subTitle: "Google/Apple カレンダーで締切を購読 — 更新は自動同期",
    subAll: "📅 すべての学会",
    alertStar: "まず ⭐ でお気に入りに登録してからエクスポートしてください。",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core",
    rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "ランク外" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "ランク外" : `CORE ${v}`),
  },
};

// URL 参数优先（分享链接可完整复现视图），其次本地偏好，最后浏览器语言
const urlParams = new URLSearchParams(location.search);
let lang = urlParams.get("lang") || localStorage.getItem("ddlradar-lang");
if (!I18N[lang]) {
  const nav = (navigator.language || "").toLowerCase();
  lang = nav.startsWith("zh") ? "zh" : nav.startsWith("ja") ? "ja" : "en";
}
const t = (key) => I18N[lang][key];

// 会议在当前等级体系下的等级值
const rankOf = (c) => c[t("rankKey")];
// "A*" 之类的值不能直接作 CSS 类名，转成安全写法（A* → Astar）
const rankSlug = (v) => v.replace(/\*/g, "star").replace(/[^A-Za-z-]/g, "");

// 带文字的控件用"影子标签"：所有语言的文案叠放在同一格，非当前语言的隐藏，
// 控件宽度 = 各语言中的最大值 → 切换语言时尺寸/位置完全不变（免手调像素，任何字体下都成立）
function biLabel(el, key) {
  // 每个 span 固定标注自身语言：OpenType locl 特性会按 lang 选择地区字形，
  // 若跟随页面语言会导致同一字符串在不同界面语言下宽度微差
  el.innerHTML = `<span class="bi-wrap">` + Object.keys(I18N).map((l) =>
    `<span lang="${I18N[l].htmlLang}" class="${l === lang ? "" : "ghost"}"${l === lang ? "" : ' aria-hidden="true"'}>${I18N[l][key]}</span>`
  ).join("") + `</span>`;
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
  sort: ["deadline", "h5", "accept"].includes(urlParams.get("sort")) ? urlParams.get("sort") : "deadline",
  view: ["timeline", "kanban"].includes(urlParams.get("view")) ? urlParams.get("view") : "cards",
  starred: new Set(JSON.parse(localStorage.getItem("ddlradar-starred") || "[]")),
  // 投稿流程状态：会议名 → planned / writing / submitted / rebuttal
  statusMap: JSON.parse(localStorage.getItem("ddlradar-status") || "{}"),
};
const STATUSES = ["planned", "writing", "submitted", "rebuttal"];

function saveStatus() {
  localStorage.setItem("ddlradar-status", JSON.stringify(state.statusMap));
}

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
  if (state.sort !== "deadline") p.set("sort", state.sort);
  if (state.view !== "cards") p.set("view", state.view);
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

// 距下一个截点（排序、倒计时用）；滚动投稿视为无限远
function msLeft(conf) {
  if (conf.rolling) return Infinity;
  return new Date(nextDeadline(conf).iso).getTime() - Date.now();
}

// 距全文截止（判断"已截止"用）；滚动投稿永不截止
function fullMsLeft(conf) {
  if (conf.rolling) return Infinity;
  return new Date(conf.deadline).getTime() - Date.now();
}

function countdownHtml(conf) {
  if (conf.rolling) return `<div class="cd-label">${t("rollingLabel")}</div><div class="countdown rolling">${t("rolling")}</div>`;
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
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q)
      || (c.aliases || []).some((a) => a.toLowerCase().includes(q)))
    .filter((c) => !state.areas.size || state.areas.has(c.area))
    .filter((c) => !state.ranks.size || state.ranks.has(rankOf(c)))
    .filter((c) => !state.starredOnly || state.starred.has(c.name))
    .filter((c) => !state.hidePast || fullMsLeft(c) > 0)
    .sort((a, b) => {
      // h5 降序 / 录取率升序（越低越难中），缺数据的排最后
      if (state.sort === "h5") return (b.h5 || -1) - (a.h5 || -1);
      if (state.sort === "accept") return (parseFloat(String(a.acceptRate || "").replace("~", "")) || 999)
        - (parseFloat(String(b.acceptRate || "").replace("~", "")) || 999);
      const aAlive = fullMsLeft(a) > 0, bAlive = fullMsLeft(b) > 0;
      // 未截止的按「下一个截点」（摘要或全文）升序，滚动期刊排其后，已截止的排最后
      if (aAlive && bAlive) {
        const d = msLeft(a) - msLeft(b);
        return isNaN(d) ? 0 : d; // 两个 Infinity 相减为 NaN（都是滚动期刊）
      }
      if (aAlive) return -1;
      if (bAlive) return 1;
      return fullMsLeft(b) - fullMsLeft(a);
    });
}

// ---------- 投稿流程：状态选择器 + 看板视图 ----------

function statusSelHtml(name) {
  const st = state.statusMap[name] || "";
  return `<select class="status-sel ${st ? "has st-" + st : ""}" data-name="${name}" title="${t("statusNone")}">
    <option value="">${st ? "—" : t("statusNone")}</option>
    ${STATUSES.map((s) => `<option value="${s}" ${st === s ? "selected" : ""}>${t("statusNames")[s]}</option>`).join("")}
  </select>`;
}

function bindStatusSels(root) {
  root.querySelectorAll(".status-sel").forEach((sel) => {
    sel.onchange = () => {
      if (sel.value) state.statusMap[sel.dataset.name] = sel.value;
      else delete state.statusMap[sel.dataset.name];
      saveStatus();
      render();
    };
    sel.onclick = (e) => e.stopPropagation();
  });
}

function kanbanCountdown(c) {
  // 已投/rebuttal 阶段关心的是结果通知，其余阶段关心投稿截止
  const st = state.statusMap[c.name];
  if ((st === "submitted" || st === "rebuttal") && c.notification) {
    const d = Math.ceil((new Date(c.notification + "T23:59:59Z").getTime() - Date.now()) / 86400000);
    if (d >= 0) return `<span class="kb-cd soon">${t("notifLabel")}${c.notification.slice(5)} · ${t("daysLeft")(d)}</span>`;
  }
  if (c.rolling) return `<span class="kb-cd safe">${t("rolling")}</span>`;
  if (fullMsLeft(c) <= 0) return `<span class="kb-cd done">${t("done")}</span>`;
  const d = Math.floor(msLeft(c) / 86400000);
  const cls = d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
  return `<span class="kb-cd ${cls}">${nextDeadline(c).iso.slice(5, 10)} · ${t("daysLeft")(d)}</span>`;
}

function renderKanban(wrap) {
  // 看板是"我的投稿流程"，不受筛选影响，展示所有设置过状态的会议
  const cols = STATUSES.map((s) => {
    const items = CONFERENCES.filter((c) => state.statusMap[c.name] === s);
    return `<div class="kb-col">
      <div class="kb-head st-${s}">${t("statusNames")[s]} <span class="kb-count">${items.length}</span></div>
      ${items.map((c) => `<div class="kb-item">
        <a href="${c.link}" target="_blank" rel="noopener">${c.name}</a>
        ${kanbanCountdown(c)}
        ${statusSelHtml(c.name)}
      </div>`).join("")}
    </div>`;
  });
  const any = Object.keys(state.statusMap).length;
  wrap.innerHTML = `<div class="kanban">${cols.join("")}</div>` +
    (any ? "" : `<div class="empty">${t("kanbanEmpty")}</div>`);
  bindStatusSels(wrap);
}

// ---------- 时间线视图：按月分组，一眼看清各月 DDL 密度 ----------

function renderTimeline(wrap, confs) {
  // 时间线固定按截稿时间升序（h5/录取率排序在月份分组下没有意义），滚动期刊单独一组
  const dated = confs.filter((c) => !c.rolling)
    .sort((a, b) => new Date(nextDeadline(a).iso) - new Date(nextDeadline(b).iso));
  const rolling = confs.filter((c) => c.rolling);

  const monthOf = (iso) => new Date(iso).toLocaleString(t("dateLocale"), { year: "numeric", month: "long" });
  const dayOf = (iso) => new Date(iso).toLocaleString(t("dateLocale"), { month: "2-digit", day: "2-digit" });

  const row = (c) => {
    const nd = c.rolling ? null : nextDeadline(c);
    const past = fullMsLeft(c) <= 0;
    const d = past || c.rolling ? null : Math.floor(msLeft(c) / 86400000);
    const cls = d == null ? "" : d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
    return `<div class="tl-row ${past ? "past" : ""}">
      <span class="tl-date">${nd ? dayOf(nd.iso) : "—"}</span>
      <a href="${c.link}" target="_blank" rel="noopener">${c.name}</a>
      <span class="tag rank-${rankSlug(rankOf(c))}">${t("rankTag")(rankOf(c))}</span>
      ${nd && nd.type === "abstract" ? `<span class="tag">⚠️ ${t("absTag")}</span>` : ""}
      <span class="tl-left ${cls}">${past ? t("done") : c.rolling ? t("rolling") : t("daysLeft")(d)}</span>
    </div>`;
  };

  let html = "", curMonth = null;
  for (const c of dated) {
    const m = monthOf(nextDeadline(c).iso);
    if (m !== curMonth) { html += `<div class="tl-month">${m}</div>`; curMonth = m; }
    html += row(c);
  }
  if (rolling.length) {
    html += `<div class="tl-month">${t("tlRolling")}</div>` + rolling.map(row).join("");
  }
  wrap.innerHTML = `<div class="timeline">${html}</div>`;
}

function render() {
  syncUrl();
  const wrap = $("#cards");
  const confs = visibleConfs();
  if (!confs.length) {
    wrap.innerHTML = `<div class="empty">${t("empty")}</div>`;
    return;
  }
  if (state.view === "kanban") { renderKanban(wrap); return; }
  if (state.view === "timeline") { renderTimeline(wrap, confs); return; }
  wrap.innerHTML = confs.map((c) => {
    const past = fullMsLeft(c) <= 0;
    const star = state.starred.has(c.name);
    const absUpcoming = nextDeadline(c).type === "abstract";
    const rank = rankOf(c);
    return `<div class="card ${past ? "past" : ""}">
      <div class="card-top">
        <h3><a href="${c.link}" target="_blank" rel="noopener">${c.name}</a></h3>
        <span class="card-actions">${statusSelHtml(c.name)}<button class="star ${star ? "on" : ""}" data-name="${c.name}" title="${t("starTitle")}">⭐</button></span>
      </div>
      <div class="full-name">${c.fullName}</div>
      <div class="tags">
        <span class="tag rank-${rankSlug(rank)}">${t("rankTag")(rank)}</span>
        ${c.type === "journal" ? `<span class="tag type-journal">📖 ${t("journalTag")}</span>` : ""}
        ${c.type === "workshop" ? `<span class="tag type-workshop">🛠 Workshop</span>` : ""}
        <span class="tag">${c.area}</span>
        ${c.place ? `<span class="tag">📍 ${c.place}</span>` : ""}
        ${c.confDate ? `<span class="tag">🗓 ${c.confDate}</span>` : ""}
        ${c.h5 ? `<span class="tag tag-metric">${t("h5Tag")(c.h5)}</span>` : ""}
        ${c.acceptRate ? `<span class="tag tag-metric">${t("acceptTag")(c.acceptRate)}</span>` : ""}
      </div>
      ${countdownHtml(c)}
      <div class="meta">
        ${c.abstractDeadline ? `<span class="${absUpcoming ? "abs-hot" : ""}">${absUpcoming ? "⚠️ " : ""}${t("absLabel")}<b>${fmtLocal(c.abstractDeadline)}</b>${t("localTime")}${absUpcoming ? t("absNote") : ""}</span><br>` : ""}
        ${c.rolling ? t("rollingMeta") : `${t("fullLabel")}<b>${fmtLocal(c.deadline)}</b>${t("localTime")}`}
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
  bindStatusSels(wrap);
}

// ---------- 语言切换 ----------

// "添加会议"：跳到 GitHub 新建文件页并预填 YAML 模板，不熟 git 的人也能三步提 PR
const REPO_URL = "https://github.com/YzYhhhstudy/paper-deadlines";
const YAML_TEMPLATE = `name: "MyConf"
fullName: "Full Conference Name"
area: "AI/ML"
ccf: "Non-CCF"    # CCF-A / CCF-B / CCF-C / Non-CCF
core: "Unranked"  # A* / A / B / C / Unranked
link: "https://example.org"
editions:
  - id: "MyConf 2027"
    deadline: "2027-01-01T23:59:59-12:00"   # AoE = -12:00
    confDate: "2027-06"
    place: "TBD"
`;

function renderContrib() {
  const addUrl = `${REPO_URL}/new/master?filename=data/conferences/my-conf.yml&value=${encodeURIComponent(YAML_TEMPLATE)}`;
  const fixUrl = `${REPO_URL}/tree/master/data/conferences`;
  $("#contrib").innerHTML = `${t("contribLead")}
    <a href="${addUrl}" target="_blank" rel="noopener">${t("contribAdd")}</a> ·
    <a href="${fixUrl}" target="_blank" rel="noopener">${t("contribFix")}</a>
    ${t("contribTail")}`;
}

function applyLang() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("docTitle");
  $("#subtitle").textContent = t("subtitle");
  $("#langSeg").querySelectorAll("button").forEach((b) =>
    b.classList.toggle("on", b.dataset.lang === lang));
  $("#viewSeg").querySelectorAll("button").forEach((b) => {
    biLabel(b, { cards: "viewCards", timeline: "viewTimeline", kanban: "viewKanban" }[b.dataset.view]);
    b.classList.toggle("on", b.dataset.view === state.view);
  });
  biLabel($("#exportIcs"), "exportBtn");
  $("#exportIcs").title = t("exportTitle");
  $("#search").placeholder = t("searchPh");
  const sortSel = $("#sortSel");
  sortSel.innerHTML = Object.entries(t("sortOptions"))
    .map(([v, label]) => `<option value="${v}" ${state.sort === v ? "selected" : ""}>${label}</option>`).join("");
  biLabel($("#starredLabel"), "starredOnly");
  biLabel($("#hidePastLabel"), "hidePast");
  $("#foot1").innerHTML = t("foot1");
  $("#foot2").textContent = t("foot2");
  renderContrib();
  applyTheme();
  updateNotifyBtn(); // 函数声明有提升，首次调用时已可用
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
  const chosen = CONFERENCES.filter((c) => state.starred.has(c.name) && !c.rolling);
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
$("#viewSeg").querySelectorAll("button").forEach((b) => {
  b.onclick = () => {
    state.view = b.dataset.view;
    $("#viewSeg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  };
});
$("#sortSel").onchange = (e) => { state.sort = e.target.value; render(); };
$("#search").oninput = (e) => { state.search = e.target.value.trim(); render(); };
$("#starredOnly").onchange = (e) => { state.starredOnly = e.target.checked; render(); };
$("#hidePast").onchange = (e) => { state.hidePast = e.target.checked; render(); };
$("#exportIcs").onclick = exportIcs;

// ---------- DDL 浏览器通知：收藏的会议临近截止时提醒（提前 7 天 / 1 天各一次） ----------

const NOTIFY_THRESHOLDS = [7, 1];

function notifyEnabled() {
  return "Notification" in window && Notification.permission === "granted"
    && localStorage.getItem("ddlradar-notify") !== "off";
}

async function checkNotifications() {
  if (!notifyEnabled()) return;
  const seen = JSON.parse(localStorage.getItem("ddlradar-notified") || "{}");
  // 首次加载时 SW 可能尚未注册完，等 ready（3 秒兜底后退回构造函数通知）
  let reg = null;
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((r) => setTimeout(() => r(null), 3000)),
    ]);
  }
  for (const c of CONFERENCES) {
    if (!state.starred.has(c.name) || c.rolling) continue;
    const nd = nextDeadline(c);
    const ms = new Date(nd.iso).getTime() - Date.now();
    if (ms <= 0) continue;
    for (const days of NOTIFY_THRESHOLDS) {
      if (ms > days * 86400000) continue;
      const key = `${c.name}|${nd.iso}|${days}`;
      if (seen[key]) break;
      seen[key] = 1;
      const title = t("notifyTitle")(c.name, Math.ceil(ms / 86400000));
      const opts = {
        body: `${nd.type === "abstract" ? t("absLabel") : t("fullLabel")}${fmtLocal(nd.iso)}`,
        icon: "icons/icon-192.png", tag: key,
      };
      if (reg) reg.showNotification(title, opts);
      else new Notification(title, opts);
      break; // 每个会议只发当前最紧的一档
    }
  }
  localStorage.setItem("ddlradar-notified", JSON.stringify(seen));
}

function updateNotifyBtn() {
  const btn = $("#notifyBtn");
  if (!("Notification" in window)) { btn.style.display = "none"; return; }
  const on = notifyEnabled();
  btn.textContent = on ? "🔔" : "🔕";
  btn.title = t(on ? "notifyOn" : "notifyOff");
  btn.setAttribute("aria-label", btn.title);
}

$("#notifyBtn").onclick = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") {
    if (await Notification.requestPermission() !== "granted") { updateNotifyBtn(); return; }
    localStorage.setItem("ddlradar-notify", "on");
  } else {
    localStorage.setItem("ddlradar-notify", notifyEnabled() ? "off" : "on");
  }
  updateNotifyBtn();
  checkNotifications();
};

applyLang();
checkNotifications();
setInterval(render, 60 * 1000); // 每分钟刷新倒计时
setInterval(checkNotifications, 3600 * 1000); // 每小时检查一次提醒

// ---------- PWA：注册 Service Worker（需要 https 或 localhost） ----------
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* 注册失败不影响页面 */ });
}
