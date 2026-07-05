// DDL Radar 插件后台：每 6 小时拉一次数据，角标显示"7 天内截止的数量"
const DATA_URL = "https://yzyhhhstudy.github.io/paper-deadlines/data.json";

async function refresh() {
  try {
    const res = await fetch(DATA_URL);
    const confs = await res.json();
    await chrome.storage.local.set({ confs, fetchedAt: Date.now() });

    const now = Date.now();
    const urgent = confs.filter((c) => {
      if (c.rolling) return false;
      const next = c.abstractDeadline && new Date(c.abstractDeadline).getTime() > now
        ? c.abstractDeadline : c.deadline;
      const ms = new Date(next).getTime() - now;
      return ms > 0 && ms <= 7 * 86400000;
    }).length;

    chrome.action.setBadgeBackgroundColor({ color: "#ff5d5d" });
    chrome.action.setBadgeText({ text: urgent ? String(urgent) : "" });
  } catch (e) {
    // 离线等情况：保留旧角标
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("refresh", { periodInMinutes: 360 });
  refresh();
});
chrome.runtime.onStartup.addListener(refresh);
chrome.alarms.onAlarm.addListener((a) => { if (a.name === "refresh") refresh(); });
