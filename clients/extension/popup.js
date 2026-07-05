// DDL Radar 插件弹窗：最近截稿列表 + 搜索。
// 兼容无 chrome.* 环境（便于独立测试）：优先用 storage 缓存，否则直接 fetch
const DATA_URL = "https://yzyhhhstudy.github.io/paper-deadlines/data.json";
const SITE_URL = "https://yzyhhhstudy.github.io/paper-deadlines/";
const zh = (navigator.language || "").toLowerCase().startsWith("zh");
const T = zh
  ? { search: "🔍 搜索会议…", site: "打开完整站点 →", empty: "没有即将截止的会议", days: (d) => `${d} 天`, abs: "⚠️ 摘要" }
  : { search: "🔍 Search venues…", site: "Open full site →", empty: "No upcoming deadlines", days: (d) => `${d}d`, abs: "⚠️ abstract" };

document.getElementById("q").placeholder = T.search;
document.getElementById("siteLink").textContent = T.site;

async function loadData() {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    const { confs, fetchedAt } = await chrome.storage.local.get(["confs", "fetchedAt"]);
    if (confs && Date.now() - (fetchedAt || 0) < 6 * 3600000) return confs;
  }
  const res = await fetch(DATA_URL);
  const confs = await res.json();
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.set({ confs, fetchedAt: Date.now() });
  }
  return confs;
}

function nextDeadline(c) {
  if (c.abstractDeadline && new Date(c.abstractDeadline).getTime() > Date.now()) {
    return { iso: c.abstractDeadline, abs: true };
  }
  return { iso: c.deadline, abs: false };
}

let ALL = [];
function render(q) {
  const now = Date.now();
  const list = ALL
    .filter((c) => !c.rolling && new Date(c.deadline).getTime() > now)
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q)
      || (c.aliases || []).some((a) => a.toLowerCase().includes(q)))
    .sort((a, b) => new Date(nextDeadline(a).iso) - new Date(nextDeadline(b).iso))
    .slice(0, 30);
  const el = document.getElementById("list");
  if (!list.length) { el.innerHTML = `<div class="empty">${T.empty}</div>`; return; }
  el.innerHTML = list.map((c) => {
    const nd = nextDeadline(c);
    const d = Math.floor((new Date(nd.iso).getTime() - now) / 86400000);
    const cls = d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
    const date = new Date(nd.iso).toLocaleDateString(zh ? "zh-CN" : "en-US", { month: "2-digit", day: "2-digit" });
    return `<div class="row">
      <span class="date">${date}</span>
      <a href="${c.link}" target="_blank" rel="noopener">${c.name}</a>
      ${nd.abs ? `<span class="abs">${T.abs}</span>` : ""}
      <span class="left ${cls}">${T.days(d)}</span>
    </div>`;
  }).join("");
}

document.getElementById("q").oninput = (e) => render(e.target.value.trim().toLowerCase());

loadData()
  .then((confs) => { ALL = confs; render(""); })
  .catch(() => { document.getElementById("list").innerHTML = `<div class="empty">⚠️ offline</div>`; });
