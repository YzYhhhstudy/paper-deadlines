#!/usr/bin/env node
// 官网变更检测 + LLM 结构化提取（数据自动化流水线的"官网核实"环节）
//   node scripts/crawl.js [--fix] [--limit N]
//
// 流程：抓取每个会议官网 → 提取含日期/截稿关键词的文本片段 → 与 data/crawl-cache.json
// 里的哈希比对，页面没变直接跳过（零 LLM 成本）→ 变更的片段交给 Claude 按 JSON schema
// 提取截稿/通知/投稿入口 → 与现有数据比对；--fix 且置信度 high 时写回 YAML 并加 verified。
// 未配置凭证（ANTHROPIC_API_KEY / ant 登录态）时只做哈希检测，报告哪些页面变了。
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const FIX = process.argv.includes("--fix");
const limitIdx = process.argv.indexOf("--limit");
const LIMIT = limitIdx >= 0 ? +process.argv[limitIdx + 1] : Infinity;
const MODEL = process.env.CRAWL_MODEL || "claude-opus-4-8";

const ROOT = path.join(__dirname, "..");
const CACHE_FILE = path.join(ROOT, "data", "crawl-cache.json");
const cache = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) : {};

// 结构化输出 schema（structured outputs 不支持递归/数值约束；对象需 additionalProperties: false）
const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    deadline: { anyOf: [{ type: "string" }, { type: "null" }], description: "即将到来那一届/轮的全文截稿日 YYYY-MM-DD；页面没写则 null" },
    abstractDeadline: { anyOf: [{ type: "string" }, { type: "null" }], description: "摘要/注册截止日 YYYY-MM-DD；没有则 null" },
    notification: { anyOf: [{ type: "string" }, { type: "null" }], description: "结果通知日 YYYY-MM-DD；没有则 null" },
    submitPortal: { anyOf: [{ type: "string" }, { type: "null" }], description: "投稿系统 URL（OpenReview/HotCRP/CMT 等）；没有则 null" },
    confidence: { type: "string", enum: ["high", "medium", "low"], description: "high=页面明确写出年份+日期；medium=需要推断；low=信息含糊" },
    evidence: { type: "string", description: "支撑结论的页面原文引用（≤200 字符）" },
  },
  required: ["deadline", "abstractDeadline", "notification", "submitPortal", "confidence", "evidence"],
  additionalProperties: false,
};

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ");
}

// 只保留含月份/截稿关键词的句子，控制 LLM 输入体积
function dateSnippet(text) {
  const KEY = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|deadline|submission|notification|camera.?ready|due|cycle|round|abstract/i;
  const parts = text.split(/(?<=[.!?])\s+|(?=\d{4})/).filter((s) => KEY.test(s) && /\d/.test(s));
  return [...new Set(parts)].join("\n").slice(0, 4000);
}

async function fetchPage(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DDLRadarBot/1.0; +https://github.com/YzYhhhstudy/paper-deadlines)" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; } finally { clearTimeout(timer); }
}

function getClient() {
  try {
    const Anthropic = require("@anthropic-ai/sdk").default || require("@anthropic-ai/sdk");
    const client = new Anthropic(); // 从 ANTHROPIC_API_KEY / ant 登录态解析凭证
    return process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN ? client : null;
  } catch { return null; }
}

async function extract(client, conf, snippet) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    output_config: { format: { type: "json_schema", schema: EXTRACT_SCHEMA } },
    messages: [{
      role: "user",
      content: `以下是学术会议 ${conf.name}（官网 ${conf.link}）页面上与日期相关的文本片段。请提取"即将到来的那一届/那一轮"的关键日期。只使用片段中明确出现的信息，不要编造；今天之前的日期照常提取（用于核对历史数据）。\n\n<页面片段>\n${snippet}\n</页面片段>`,
    }],
  });
  if (response.stop_reason === "refusal") return null;
  const text = response.content.find((b) => b.type === "text")?.text;
  return text ? JSON.parse(text) : null;
}

function patchYaml(base, field, value, note) {
  const slug = base.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const file = path.join(ROOT, "data", "conferences", slug + ".yml");
  if (!fs.existsSync(file)) return false;
  let txt = fs.readFileSync(file, "utf8");
  const isDateTime = field === "deadline" || field === "abstractDeadline";
  const rendered = isDateTime ? `"${value}T23:59:59-12:00"` : `"${value}"`;
  const re = new RegExp(`^(\\s*)${field}: "[^"]+".*$`, "m");
  if (re.test(txt)) {
    txt = txt.replace(re, `$1${field}: ${rendered}   # ${note}`);
  } else {
    txt = txt.replace(/^(\s*)deadline:/m, `$1${field}: ${rendered}   # ${note}\n$1deadline:`);
  }
  if (field === "deadline" && !/verified: true/.test(txt)) {
    txt = txt.replace(/^(\s*)deadline: (.*)$/m, `$1deadline: $2\n$1verified: true`);
  }
  fs.writeFileSync(file, txt);
  return true;
}

(async () => {
  const confs = JSON.parse(fs.readFileSync(path.join(ROOT, "data.json"), "utf8"))
    .filter((c) => !c.rolling && c.link);
  const client = getClient();
  const lines = ["", "## 官网爬取核对", ""];
  let unchanged = 0, changed = 0, fixed = 0, unreachable = 0, checked = 0;

  const seen = new Set();
  for (const c of confs) {
    if (checked >= LIMIT) break;
    if (seen.has(c.link)) continue;
    seen.add(c.link);
    checked++;

    const html = await fetchPage(c.link);
    if (!html) { unreachable++; continue; }
    const snippet = dateSnippet(stripHtml(html));
    const hash = crypto.createHash("sha256").update(snippet).digest("hex").slice(0, 16);

    if (cache[c.link] === hash) { unchanged++; continue; }
    changed++;

    if (!client) {
      lines.push(`- 🔍 **${c.name}**：页面有变化（未配置 LLM 凭证，仅记录）`);
      cache[c.link] = hash;
      continue;
    }

    let info;
    try { info = await extract(client, c, snippet); } catch (e) {
      lines.push(`- ❓ **${c.name}**：LLM 提取失败（${e.message?.slice(0, 80)}）`);
      continue; // 不更新缓存，下次重试
    }
    cache[c.link] = hash;
    if (!info) continue;

    const base = (c.name.match(/^(.+?)\s+\d{4}/) || [])[1] || c.name;
    for (const [field, ours] of [["deadline", c.deadline?.slice(0, 10)], ["abstractDeadline", c.abstractDeadline?.slice(0, 10)], ["notification", c.notification]]) {
      const theirs = info[field];
      if (!theirs || theirs === ours) continue;
      if (FIX && info.confidence === "high") {
        if (patchYaml(base, field, theirs, `官网 LLM 提取，evidence: ${info.evidence.slice(0, 60).replace(/"/g, "'")}`)) {
          fixed++;
          lines.push(`- 🔧 **${c.name}** ${field}：\`${ours || "(缺)"}\` → \`${theirs}\`（官网，置信度 high）`);
          continue;
        }
      }
      lines.push(`- ⚠️ **${c.name}** ${field}：我们 \`${ours || "(缺)"}\`，官网 \`${theirs}\`（置信度 ${info.confidence}）「${info.evidence.slice(0, 100)}」`);
    }
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1) + "\n");
  lines.push("", `**官网爬取结果**：检查 ${checked} · 未变化 ${unchanged} · 有变化 ${changed}${FIX ? ` · 🔧 已修正 ${fixed}` : ""} · 不可达 ${unreachable}`);
  console.log(lines.join("\n"));
})();
