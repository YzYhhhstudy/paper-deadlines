// DDL Radar — 会议截稿日追踪
const $ = (s) => document.querySelector(s);

// ---------- 主题切换：暗色 / 亮色 / 跟随系统 ----------
function setupTheme(storageKey) {
  const MODES = ["auto", "light", "dark"];
  const LABELS = { auto: "🖥 跟随系统", light: "☀️ 亮色", dark: "🌙 暗色" };
  const btn = $("#themeBtn");
  let mode = localStorage.getItem(storageKey);
  if (!MODES.includes(mode)) mode = "auto";

  function apply() {
    if (mode === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset.theme = mode;
    btn.textContent = LABELS[mode];
    localStorage.setItem(storageKey, mode);
  }
  btn.onclick = () => {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    apply();
  };
  apply();
}
setupTheme("ddlradar-theme");

const state = {
  search: "",
  area: "",
  rank: "",
  starredOnly: false,
  hidePast: true,
  starred: new Set(JSON.parse(localStorage.getItem("ddlradar-starred") || "[]")),
};

function saveStars() {
  localStorage.setItem("ddlradar-starred", JSON.stringify([...state.starred]));
}

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
  if (fullMsLeft(conf) <= 0) return `<div class="countdown done">已截止</div>`;
  const nd = nextDeadline(conf);
  const ms = new Date(nd.iso).getTime() - Date.now();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const cls = d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
  const label = nd.type === "abstract"
    ? `<div class="cd-label abs">⚠️ 先交摘要！距<b>摘要</b>截止</div>`
    : conf.abstractDeadline
      ? `<div class="cd-label">摘要已截止 · 距全文截止</div>`
      : `<div class="cd-label">距全文截止</div>`;
  return `${label}<div class="countdown ${cls}">${d}<small>天</small>${h}<small>时</small>${m}<small>分</small></div>`;
}

function fmtLocal(iso) {
  return new Date(iso).toLocaleString("zh-CN", {
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
    .filter((c) => !state.area || c.area === state.area)
    .filter((c) => !state.rank || c.rank === state.rank)
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
  const wrap = $("#cards");
  const confs = visibleConfs();
  if (!confs.length) {
    wrap.innerHTML = `<div class="empty">没有符合条件的会议 — 试试放宽筛选，或在 data.js 中添加</div>`;
    return;
  }
  wrap.innerHTML = confs.map((c) => {
    const past = fullMsLeft(c) <= 0;
    const star = state.starred.has(c.name);
    const absUpcoming = nextDeadline(c).type === "abstract";
    return `<div class="card ${past ? "past" : ""}">
      <div class="card-top">
        <h3><a href="${c.link}" target="_blank" rel="noopener">${c.name}</a></h3>
        <button class="star ${star ? "on" : ""}" data-name="${c.name}" title="收藏">⭐</button>
      </div>
      <div class="full-name">${c.fullName}</div>
      <div class="tags">
        <span class="tag rank-${c.rank}">${c.rank}</span>
        <span class="tag">${c.area}</span>
        <span class="tag">📍 ${c.place}</span>
        <span class="tag">🗓 ${c.confDate}</span>
      </div>
      ${countdownHtml(c)}
      <div class="meta">
        ${c.abstractDeadline ? `<span class="${absUpcoming ? "abs-hot" : ""}">${absUpcoming ? "⚠️ " : ""}摘要截止：<b>${fmtLocal(c.abstractDeadline)}</b>（你的本地时间）${absUpcoming ? " ← 早于全文，别错过" : ""}</span><br>` : ""}
        全文截止：<b>${fmtLocal(c.deadline)}</b>（你的本地时间）
        ${c.history ? `<br><span class="hist" title="往年全文截稿日（大致日期），帮助判断该会议 DDL 的年度规律">📈 近年 DDL：${c.history.map(fmtHist).join(" · ")}</span>` : ""}
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

// ---------- .ics 导出 ----------

function icsDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function exportIcs() {
  const chosen = CONFERENCES.filter((c) => state.starred.has(c.name));
  if (!chosen.length) {
    alert("先点 ⭐ 收藏几个会议，再导出到日历。");
    return;
  }
  const events = chosen.flatMap((c) => {
    const mk = (label, iso) => [
      "BEGIN:VEVENT",
      `UID:${c.name.replace(/\s+/g, "-")}-${label}@ddlradar`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(iso)}`,
      `DTEND:${icsDate(iso)}`,
      `SUMMARY:📡 ${c.name} ${label}截止`,
      `DESCRIPTION:${c.fullName}\\n${c.link}`,
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${c.name} ${label}截止仅剩 7 天`,
      "END:VALARM",
      "END:VEVENT",
    ];
    return [
      ...(c.abstractDeadline ? mk("摘要", c.abstractDeadline) : []),
      ...mk("全文", c.deadline),
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

function setup() {
  // 领域下拉自动生成
  const areas = [...new Set(CONFERENCES.map((c) => c.area))].sort();
  areas.forEach((a) => $("#areaFilter").add(new Option(a, a)));

  $("#search").oninput = (e) => { state.search = e.target.value.trim(); render(); };
  $("#areaFilter").onchange = (e) => { state.area = e.target.value; render(); };
  $("#rankFilter").onchange = (e) => { state.rank = e.target.value; render(); };
  $("#starredOnly").onchange = (e) => { state.starredOnly = e.target.checked; render(); };
  $("#hidePast").onchange = (e) => { state.hidePast = e.target.checked; render(); };
  $("#exportIcs").onclick = exportIcs;
}

setup();
render();
setInterval(render, 60 * 1000); // 每分钟刷新倒计时
