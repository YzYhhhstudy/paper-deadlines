#!/usr/bin/env node
// DDL Radar CLI — 终端里查会议截稿倒计时
//   npx github:YzYhhhstudy/paper-deadlines [选项]
// 选项：
//   --days N      只看未来 N 天（默认 90）
//   --area X      按领域过滤（可逗号分隔多个，如 AI/ML,CV）
//   --rank X      按 CCF 等级过滤（如 CCF-A）
//   --search Q    按名称/别名搜索
//   --local       使用本地 data.json（仓库内运行时）
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (name, dft) => {
  const i = args.indexOf("--" + name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : dft;
};
const DAYS = parseInt(opt("days", "90"), 10);
const AREAS = opt("area", "").split(",").filter(Boolean);
const RANK = opt("rank", "");
const Q = opt("search", "").toLowerCase();
const DATA_URL = "https://yzyhhhstudy.github.io/paper-deadlines/data.json";

const C = { red: "\x1b[31m", yellow: "\x1b[33m", green: "\x1b[32m", dim: "\x1b[2m", bold: "\x1b[1m", reset: "\x1b[0m" };

async function loadData() {
  const local = path.join(__dirname, "..", "data.json");
  if (args.includes("--local") && fs.existsSync(local)) {
    return JSON.parse(fs.readFileSync(local, "utf8"));
  }
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    if (fs.existsSync(local)) return JSON.parse(fs.readFileSync(local, "utf8"));
    console.error("⚠️ 无法获取数据（离线？）：" + e.message);
    process.exit(1);
  }
}

(async () => {
  const confs = await loadData();
  const now = Date.now();

  const rows = confs
    .filter((c) => !c.rolling)
    .filter((c) => !AREAS.length || AREAS.includes(c.area))
    .filter((c) => !RANK || c.rank === RANK)
    .filter((c) => !Q || c.name.toLowerCase().includes(Q) || c.fullName.toLowerCase().includes(Q)
      || (c.aliases || []).some((a) => a.toLowerCase().includes(Q)))
    .map((c) => {
      const abs = c.abstractDeadline && new Date(c.abstractDeadline).getTime() > now;
      const iso = abs ? c.abstractDeadline : c.deadline;
      return { ...c, iso, abs, ms: new Date(iso).getTime() - now };
    })
    .filter((c) => c.ms > 0 && c.ms <= DAYS * 86400000)
    .sort((a, b) => a.ms - b.ms);

  if (!rows.length) {
    console.log("（没有符合条件的截稿 — 试试放宽 --days / --area / --rank）");
    return;
  }

  console.log(`${C.bold}📡 DDL Radar${C.reset} ${C.dim}— 未来 ${DAYS} 天内 ${rows.length} 个截稿${C.reset}\n`);
  for (const c of rows) {
    const d = Math.floor(c.ms / 86400000);
    const color = d < 7 ? C.red : d < 30 ? C.yellow : C.green;
    const days = `${color}${String(d).padStart(3)}d${C.reset}`;
    const date = c.iso.slice(0, 10);
    const absTag = c.abs ? ` ${C.yellow}⚠️abs${C.reset}` : "";
    console.log(`${days}  ${C.dim}${date}${C.reset}  ${C.bold}${c.name.padEnd(26)}${C.reset} ${C.dim}${c.rank.padEnd(8)} ${c.area}${C.reset}${absTag}`);
  }
  console.log(`\n${C.dim}→ https://yzyhhhstudy.github.io/paper-deadlines/${C.reset}`);
})();
