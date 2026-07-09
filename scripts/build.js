#!/usr/bin/env node
// 构建脚本：data/conferences/*.yml → data.js + feeds/*.ics
//   node scripts/build.js             校验并生成
//   node scripts/build.js --validate  只校验（CI 的 PR 检查用）
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data", "conferences");
const FEEDS_DIR = path.join(ROOT, "feeds");
const validateOnly = process.argv.includes("--validate");

const CCF_RANKS = ["CCF-A", "CCF-B", "CCF-C", "Non-CCF"];
const CORE_RANKS = ["A*", "A", "B", "C", "Unranked"];
// 带时区偏移的 ISO 8601，如 2026-07-23T23:59:59-12:00
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

// ---------- 读取 + 校验 ----------

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml")).sort();
if (!files.length) {
  console.error("no yaml files found in data/conferences/");
  process.exit(1);
}

const conferences = []; // 展平后的各届会议（沿用前端 data.js 的字段结构）
const seriesByFile = {}; // yml 文件名 → 系列名（Latest! 页脚显示用）

for (const f of files) {
  let doc;
  try {
    doc = yaml.load(fs.readFileSync(path.join(DATA_DIR, f), "utf8"));
  } catch (e) {
    err(f, `YAML 解析失败: ${e.message.split("\n")[0]}`);
    continue;
  }
  if (!doc || typeof doc !== "object") { err(f, "文件为空或不是对象"); continue; }
  if (typeof doc.name === "string") seriesByFile[f] = doc.name;

  for (const key of ["name", "fullName", "area", "ccf", "core", "link"]) {
    if (typeof doc[key] !== "string" || !doc[key].trim()) err(f, `缺少字段 ${key}`);
  }
  if (doc.ccf && !CCF_RANKS.includes(doc.ccf)) err(f, `ccf 必须是 ${CCF_RANKS.join(" / ")}，收到 "${doc.ccf}"`);
  if (doc.core && !CORE_RANKS.includes(doc.core)) err(f, `core 必须是 ${CORE_RANKS.join(" / ")}，收到 "${doc.core}"`);
  if (doc.link && !/^https?:\/\//.test(doc.link)) err(f, `link 必须是 http(s) URL`);

  const type = doc.type || "conference";
  if (!["conference", "journal", "workshop"].includes(type)) { err(f, `type 必须是 conference / journal / workshop，收到 "${doc.type}"`); continue; }

  // 期刊：滚动投稿，无固定截稿日
  if (type === "journal") {
    if (doc.rolling !== true) { err(f, "期刊暂只支持滚动投稿，请设置 rolling: true"); continue; }
    if (errors.some((e) => e.startsWith(f + ":"))) continue;
    conferences.push({
      name: doc.name,
      type: "journal",
      rolling: true,
      fullName: doc.fullName,
      area: doc.area,
      rank: doc.ccf,
      core: doc.core,
      link: doc.link,
      ...(doc.aliases ? { aliases: doc.aliases } : {}),
      ...(doc.h5 ? { h5: doc.h5 } : {}),
      ...(doc.acceptRate ? { acceptRate: String(doc.acceptRate) } : {}),
    });
    continue;
  }

  if (!Array.isArray(doc.editions) || !doc.editions.length) { err(f, "editions 至少要有一届"); continue; }

  doc.editions.forEach((ed, i) => {
    const where = `editions[${i}]`;
    if (typeof ed.id !== "string" || !ed.id.trim()) err(f, `${where}.id 缺失`);
    for (const [key, required] of [["deadline", true], ["abstractDeadline", false]]) {
      if (ed[key] == null) { if (required) err(f, `${where}.${key} 缺失`); continue; }
      if (!ISO_RE.test(ed[key])) err(f, `${where}.${key} 需为带时区偏移的 ISO 8601（如 2026-07-23T23:59:59-12:00），收到 "${ed[key]}"`);
      else if (isNaN(Date.parse(ed[key]))) err(f, `${where}.${key} 不是合法日期`);
    }
    if (ed.abstractDeadline && ed.deadline && Date.parse(ed.abstractDeadline) >= Date.parse(ed.deadline)) {
      err(f, `${where} 摘要截止应早于全文截止`);
    }
    if (typeof ed.confDate !== "string" || !ed.confDate.trim()) err(f, `${where}.confDate 缺失`);
    if (typeof ed.place !== "string" || !ed.place.trim()) err(f, `${where}.place 缺失`);
    for (const key of ["notification", "rebuttal"]) {
      if (ed[key] != null && !DATE_RE.test(String(ed[key]))) err(f, `${where}.${key} 需为 YYYY-MM-DD，收到 "${ed[key]}"`);
    }
    if (ed.submitLink != null && !/^https?:\/\//.test(ed.submitLink)) err(f, `${where}.submitLink 必须是 http(s) URL`);
  });

  if (doc.history != null) {
    if (!Array.isArray(doc.history)) err(f, "history 需为日期数组");
    else doc.history.forEach((h, i) => { if (!DATE_RE.test(String(h))) err(f, `history[${i}] 需为 YYYY-MM-DD，收到 "${h}"`); });
  }

  if (doc.aliases != null) {
    if (!Array.isArray(doc.aliases) || doc.aliases.some((a) => typeof a !== "string" || !a.trim())) {
      err(f, "aliases 需为非空字符串数组");
    }
  }

  if (doc.h5 != null && (!Number.isInteger(doc.h5) || doc.h5 <= 0)) err(f, `h5 需为正整数，收到 "${doc.h5}"`);
  if (doc.acceptRate != null && !/^~?\d+(\.\d+)?%$/.test(String(doc.acceptRate))) {
    err(f, `acceptRate 需形如 "~25%"，收到 "${doc.acceptRate}"`);
  }
  if (doc.acceptHistory != null) {
    if (!Array.isArray(doc.acceptHistory) || doc.acceptHistory.some((h) =>
      !h || !Number.isInteger(h.year) || typeof h.rate !== "number" || h.rate <= 0 || h.rate >= 100)) {
      err(f, "acceptHistory 需为 [{year: 2024, rate: 25.8}, …]（rate 为百分数数值）");
    }
  }

  if (errors.some((e) => e.startsWith(f + ":"))) continue;

  for (const ed of doc.editions) {
    conferences.push({
      name: ed.id,
      ...(type !== "conference" ? { type } : {}),
      fullName: doc.fullName,
      area: doc.area,
      rank: doc.ccf,
      core: doc.core,
      ...(ed.abstractDeadline ? { abstractDeadline: ed.abstractDeadline } : {}),
      deadline: ed.deadline,
      ...(ed.verified ? { verified: true } : {}), // 官网核实过：对账机器人不自动改写
      ...(ed.rebuttal ? { rebuttal: String(ed.rebuttal) } : {}),
      ...(ed.notification ? { notification: String(ed.notification) } : {}),
      ...(ed.submitLink ? { submitLink: ed.submitLink } : {}),
      confDate: ed.confDate,
      place: ed.place,
      link: doc.link,
      ...(doc.history ? { history: doc.history.map(String) } : {}),
      ...(doc.aliases ? { aliases: doc.aliases } : {}),
      ...(doc.h5 ? { h5: doc.h5 } : {}),
      // acceptRate 未写时从 acceptHistory 末值派生（卡片标签与曲线自动一致）
      ...(doc.acceptRate || doc.acceptHistory
        ? { acceptRate: doc.acceptRate ? String(doc.acceptRate) : `~${doc.acceptHistory[doc.acceptHistory.length - 1].rate}%` }
        : {}),
      ...(doc.acceptHistory ? { acceptHistory: doc.acceptHistory } : {}),
    });
  }
}

if (errors.length) {
  console.error(`✘ 校验失败（${errors.length} 处）：`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log(`✔ 校验通过：${files.length} 个会议文件，${conferences.length} 届`);
if (validateOnly) process.exit(0);

conferences.sort((a, b) => a.name.localeCompare(b.name, "en"));

// ---------- 生成 data.js ----------

const banner = `// ⚠️ 本文件由 scripts/build.js 自动生成，请勿手改！
// 数据源在 data/conferences/*.yml —— 改完运行 npm run build（CI 也会自动重建）
const CONFERENCES = `;
fs.writeFileSync(path.join(ROOT, "data.js"), banner + JSON.stringify(conferences, null, 2) + ";\n");
// 对外只读 API：其他端（插件 / CLI / bot…）直接 fetch 这份 JSON
fs.writeFileSync(path.join(ROOT, "data.json"), JSON.stringify(conferences, null, 2) + "\n");

// Obsidian / Markdown 消费端：全量截稿表（确定性输出，不含倒计时）
const mdRows = conferences.filter((c) => !c.rolling)
  .sort((a, b) => a.deadline.localeCompare(b.deadline))
  .map((c) => `| ${c.name} | ${c.deadline.slice(0, 10)} | ${c.abstractDeadline ? c.abstractDeadline.slice(0, 10) : "—"} | ${c.rank} | ${c.area} |`);
fs.writeFileSync(path.join(ROOT, "deadlines.md"), [
  "# DDL Radar — 会议截稿总表",
  "",
  "> 由 scripts/build.js 自动生成 · 数据以 [官网/DDL Radar](https://yzyhhhstudy.github.io/paper-deadlines/) 为准",
  "",
  "| 会议 | 全文截止 | 摘要截止 | CCF | 领域 |",
  "|---|---|---|---|---|",
  ...mdRows,
  "",
].join("\n"));
console.log(`✔ data.js + data.json + deadlines.md（${conferences.length} 届）`);

// ---------- 生成 updates.js（页脚 Latest! 最近数据更新）----------
// 来源：git log 里改动过 data/conferences 的提交（跳过机器人重建提交）。
// 注意：内容依赖本地 git 历史，因此不参与 CI 的"生成物是否同步"检查，
// 由 master 构建单独提交。git 不可用（浅克隆等）时保留旧文件，绝不让构建失败。
try {
  const { execSync } = require("child_process");
  const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  const commits = run('git log --no-merges --date=short --pretty=format:"%H|%ad|%s" -n 40 -- data/conferences')
    .split("\n").filter(Boolean)
    .map((l) => { const [hash, date, ...s] = l.split("|"); return { hash, date, subject: s.join("|") }; })
    .filter((c) => !/^chore: rebuild/.test(c.subject));
  const updates = [];
  for (const c of commits) {
    if (updates.length >= 8) break;
    const confs = [...new Set(
      run(`git diff-tree --no-commit-id --name-only -r ${c.hash} -- data/conferences`)
        .split("\n").filter(Boolean)
        .map((p) => seriesByFile[path.basename(p)] || path.basename(p).replace(/\.ya?ml$/, "").toUpperCase())
    )];
    if (!confs.length) continue;
    // 批量提交只列前几个，避免页脚被 70+ 个会议名撑爆
    const entry = { date: c.date, confs: confs.slice(0, 5), subject: c.subject };
    if (confs.length > 5) entry.more = confs.length - 5;
    updates.push(entry);
  }
  fs.writeFileSync(path.join(ROOT, "updates.js"),
    "// ⚠️ 由 scripts/build.js 从 git 历史自动生成（Latest! 页脚），请勿手改\n" +
    "window.DDL_UPDATES = " + JSON.stringify(updates, null, 1) + ";\n");
  console.log(`✔ updates.js（${updates.length} 条最近更新）`);
} catch (e) {
  if (!fs.existsSync(path.join(ROOT, "updates.js"))) {
    fs.writeFileSync(path.join(ROOT, "updates.js"), "window.DDL_UPDATES = [];\n");
  }
  console.log("⚠ git 历史不可用，updates.js 保持原样");
}

// ---------- 生成 feeds/*.ics ----------
// 注意：输出必须是确定性的（不用 Date.now），否则 CI 的"生成物是否同步"检查会误报

const slug = (s) => s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const icsEscape = (s) => String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
const icsDate = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
// RFC 5545 行折叠：≤75 字节，续行以空格开头
function fold(line) {
  const out = [];
  let rest = line;
  while (Buffer.byteLength(rest) > 73) {
    let cut = 73;
    while (Buffer.byteLength(rest.slice(0, cut)) > 73) cut--;
    out.push(rest.slice(0, cut));
    rest = " " + rest.slice(cut);
  }
  out.push(rest);
  return out;
}

function icsEvent(c, label, iso) {
  const uid = `${slug(c.name)}-${slug(label)}@ddlradar`;
  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsDate(iso)}`, // 用截止时间做时间戳，保证输出确定性
    `DTSTART:${icsDate(iso)}`,
    `DTEND:${icsDate(iso)}`,
    `SUMMARY:${icsEscape(`📡 ${c.name} ${label}`)}`,
    `DESCRIPTION:${icsEscape(`${c.fullName}\n${c.link}`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(`${c.name} ${label} — 7 days left`)}`,
    "END:VALARM",
    "END:VEVENT",
  ];
}

function writeFeed(fileBase, calName, confs) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DDLRadar//feeds//EN",
    `X-WR-CALNAME:${icsEscape(calName)}`,
    "X-PUBLISHED-TTL:P1D",
    "REFRESH-INTERVAL;VALUE=DURATION:P1D",
  ];
  for (const c of confs) {
    if (c.rolling) continue; // 滚动投稿的期刊没有固定日期
    if (c.abstractDeadline) lines.push(...icsEvent(c, "abstract deadline", c.abstractDeadline));
    lines.push(...icsEvent(c, "full paper deadline", c.deadline));
  }
  lines.push("END:VCALENDAR");
  fs.writeFileSync(path.join(FEEDS_DIR, fileBase + ".ics"), lines.flatMap(fold).join("\r\n") + "\r\n");
}

fs.rmSync(FEEDS_DIR, { recursive: true, force: true });
fs.mkdirSync(FEEDS_DIR, { recursive: true });
writeFeed("all", "DDL Radar · All CS Conferences", conferences);
const areas = [...new Set(conferences.map((c) => c.area))].sort();
for (const a of areas) {
  writeFeed(slug(a), `DDL Radar · ${a}`, conferences.filter((c) => c.area === a));
}
console.log(`✔ feeds/：all.ics + ${areas.length} 个领域 feed`);
