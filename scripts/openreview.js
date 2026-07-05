#!/usr/bin/env node
// OpenReview 官方数据核对：托管在 OpenReview 的会议，其 venue group 带有官方截稿时刻。
// 与我们的数据按"绝对时刻"比对（避免不同时区的日期字面误报），差异可用 --fix 写回
// YAML（AoE 表示）并加 verified 标记。venue 未创建（CFP 未开放）时自动跳过。
//   node scripts/openreview.js [--fix]
const fs = require("fs");
const path = require("path");

const FIX = process.argv.includes("--fix");
const API = "https://api2.openreview.net/groups?id=";

// 我们的会议 base 名 → OpenReview venue id 模板（{y} 为届年份）
const VENUES = {
  "NeurIPS": "NeurIPS.cc/{y}/Conference",
  "ICLR": "ICLR.cc/{y}/Conference",
  "ICML": "ICML.cc/{y}/Conference",
  "CoRL": "robot-learning.org/CoRL/{y}/Conference",
  "AISTATS": "aistats.org/AISTATS/{y}/Conference",
  "UAI": "auai.org/UAI/{y}/Conference",
};

// "May 07 2026 11:59AM UTC-0" → Date
function parseOrDate(s) {
  const m = s.trim().match(/^(\w{3}) (\d{1,2}) (\d{4}) (\d{1,2}):(\d{2})(AM|PM) UTC([+-]\d+)?/i);
  if (!m) return null;
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  let h = +m[4] % 12;
  if (m[6].toUpperCase() === "PM") h += 12;
  const offset = parseInt(m[7] || "0", 10);
  return new Date(Date.UTC(+m[3], months[m[1]], +m[2], h - offset, +m[5]));
}

// 绝对时刻 → AoE(UTC-12) 墙上时间的 ISO 写法（我们 YAML 的统一格式）
function toAoe(date) {
  const d = new Date(date.getTime() - 12 * 3600e3);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:00-12:00`;
}

function patchYaml(base, field, aoeIso) {
  const slug = base.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const file = path.join(__dirname, "..", "data", "conferences", slug + ".yml");
  if (!fs.existsSync(file)) return false;
  const txt = fs.readFileSync(file, "utf8");
  const re = new RegExp(`^(\\s*)${field}: "[^"]+".*$`, "m");
  let out;
  if (re.test(txt)) {
    out = txt.replace(re, `$1${field}: "${aoeIso}"   # OpenReview 官方核实`);
  } else if (field === "abstractDeadline") {
    out = txt.replace(/^(\s*)deadline:/m, `$1abstractDeadline: "${aoeIso}"   # OpenReview 官方核实\n$1deadline:`);
  } else return false;
  if (!/verified: true/.test(out)) {
    out = out.replace(/^(\s*)deadline: (.*)$/m, `$1deadline: $2\n$1verified: true`);
  }
  fs.writeFileSync(file, out);
  return true;
}

(async () => {
  const ours = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data.json"), "utf8"));
  const lines = ["", "## OpenReview 官方核对", ""];
  let ok = 0, fixed = 0, diff = 0, missing = 0;

  for (const c of ours) {
    const m = c.name.match(/^(.+?)\s+(\d{4})/);
    if (!m || !VENUES[m[1]]) continue;
    const venueId = VENUES[m[1]].replace("{y}", m[2]);
    let dateStr;
    try {
      const res = await fetch(API + encodeURIComponent(venueId));
      const groups = (await res.json()).groups || [];
      dateStr = groups[0]?.content?.date?.value;
    } catch { /* 网络失败按未创建处理 */ }
    if (!dateStr) { missing++; lines.push(`- ⏳ **${c.name}**：OpenReview venue 尚未创建（\`${venueId}\`）`); continue; }

    const checks = [
      ["deadline", /Submission Deadline: ([^,]+)/i],
      ["abstractDeadline", /Abstract Registration: ([^,]+)/i],
    ];
    for (const [field, re] of checks) {
      const mm = dateStr.match(re);
      if (!mm) continue;
      const orDate = parseOrDate(mm[1]);
      if (!orDate) { lines.push(`- ❓ **${c.name}**：无法解析 OpenReview 日期 "${mm[1].trim()}"`); continue; }
      const oursMs = c[field] ? Date.parse(c[field]) : null;
      if (oursMs != null && Math.abs(oursMs - orDate.getTime()) <= 60e3) { ok++; continue; }
      const aoe = toAoe(orDate);
      if (FIX && patchYaml(m[1], field, aoe)) {
        fixed++;
        lines.push(`- 🔧 **${c.name}** ${field}：\`${c[field] || "(缺)"}\` → \`${aoe}\`（OpenReview 官方）`);
      } else {
        diff++;
        lines.push(`- ⚠️ **${c.name}** ${field}：我们 \`${c[field] || "(缺)"}\`，OpenReview \`${aoe}\``);
      }
    }
  }

  lines.push("", `**OpenReview 结果**：✅ 时刻一致 ${ok}${FIX ? ` · 🔧 已修正 ${fixed}` : ""} · ⚠️ 差异 ${diff} · ⏳ venue 未创建 ${missing}`);
  console.log(lines.join("\n"));
})();
