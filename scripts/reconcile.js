#!/usr/bin/env node
// 数据对账：把我们的 DDL 和 ccfddl（github.com/ccfddl/ccf-deadlines，MIT）比对，
// 输出 Markdown 报告；有差异的行以 ⚠️ 开头，CI 据此开/更新 issue。
//   node scripts/reconcile.js <ccfddl 仓库的 conference 目录>
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ccfddlDir = process.argv[2];
const FIX = process.argv.includes("--fix"); // 单一候选日期的差异直接改写 YAML（配合 CI 开 PR）
if (!ccfddlDir || !fs.existsSync(ccfddlDir)) {
  console.error("用法: node scripts/reconcile.js <ccfddl/conference 目录> [--fix]");
  process.exit(1);
}

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
// 双方命名习惯差异（我们的 base 名 → ccfddl 的 title）
const NAME_MAP = {
  "ieee s&p": "s&p", "acm ccs": "ccs", "acm mm": "mm",
  "usenix atc": "atc", "usenix security": "usenix security",
};

// ---------- 读 ccfddl 数据 ----------
const theirs = new Map(); // norm(title) → {title, confs}
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.ya?ml$/.test(e.name)) {
      let docs;
      try { docs = yaml.load(fs.readFileSync(p, "utf8")); } catch { continue; }
      for (const d of Array.isArray(docs) ? docs : [docs]) {
        if (d && d.title) theirs.set(norm(d.title), d);
      }
    }
  }
})(ccfddlDir);

// ---------- 读我们的数据 ----------
const ours = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data.json"), "utf8"));

function findTheirs(base, aliases) {
  const candidates = [base, NAME_MAP[base.toLowerCase()], ...(aliases || [])].filter(Boolean);
  for (const c of candidates) {
    if (theirs.has(norm(c))) return theirs.get(norm(c));
  }
  return null;
}

const lines = ["# 与 ccfddl 的数据对账报告", "", `双方均为社区维护数据，差异仅供人工核对官网。共比对 ${ours.length} 条。`, ""];
let diff = 0, ok = 0, notFound = 0, fixed = 0;

for (const c of ours) {
  if (c.rolling) continue; // 期刊无固定 DDL，跳过
  const m = c.name.match(/^(.+?)\s+(\d{4})/);
  if (!m) continue;
  const [, base, yearStr] = m;
  const year = +yearStr;

  const entry = findTheirs(base, c.aliases);
  if (!entry) { notFound++; lines.push(`- ❓ **${c.name}**：在 ccfddl 中未找到同名会议`); continue; }

  const conf = (entry.confs || []).find((x) => x.year === year);
  if (!conf) { lines.push(`- ❓ **${c.name}**：ccfddl 尚无 ${year} 年数据`); notFound++; continue; }

  const ourDate = c.deadline.slice(0, 10);
  const theirDates = (conf.timeline || [])
    .map((tl) => String(tl.deadline || "").slice(0, 10))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  if (!theirDates.length) { lines.push(`- ❓ **${c.name}**：ccfddl 的 ${year} 年截稿日为 TBD`); notFound++; continue; }

  if (theirDates.includes(ourDate)) { ok++; continue; }

  // --fix：ccfddl 只有一个候选日期时，直接改写对应 YAML 的 deadline 日期部分（保留时间与时区）。
  // 若修正会导致摘要截止 >= 全文截止（说明摘要日期也变了），转人工处理
  const wouldBreakAbstract = c.abstractDeadline
    && theirDates.length === 1 && c.abstractDeadline.slice(0, 10) >= theirDates[0];
  if (FIX && theirDates.length === 1 && !wouldBreakAbstract) {
    const slug = base.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const file = path.join(__dirname, "..", "data", "conferences", slug + ".yml");
    if (fs.existsSync(file)) {
      const txt = fs.readFileSync(file, "utf8");
      const patched = txt.split("\n").map((line) =>
        /^\s*deadline:/.test(line) && line.includes(ourDate) ? line.replace(ourDate, theirDates[0]) : line
      ).join("\n");
      if (patched !== txt) {
        fs.writeFileSync(file, patched);
        fixed++;
        lines.push(`- 🔧 **${c.name}**：\`${ourDate}\` → \`${theirDates[0]}\`（已按 ccfddl 自动修正，请审核）`);
        continue;
      }
    }
  }
  diff++;
  lines.push(`- ⚠️ **${c.name}**：我们 \`${ourDate}\`，ccfddl \`${theirDates.join(" / ")}\` — 请核对官网后修正 \`data/conferences/\``);
}

lines.push("", `**结果**：✅ 一致 ${ok}${FIX ? ` · 🔧 已自动修正 ${fixed}` : ""} · ⚠️ 待人工处理 ${diff} · ❓ 无法比对 ${notFound}`);
console.log(lines.join("\n"));
