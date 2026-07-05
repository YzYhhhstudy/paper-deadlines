#!/usr/bin/env node
// DDL 摘要生成器：未来 N 天内的截稿列表，供邮件 / 群机器人推送
//   node scripts/digest.js [--days 14] [--format text|markdown|slack|discord|feishu]
// slack/discord/feishu 输出对应 webhook 的 JSON body，text/markdown 输出正文
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (name, dft) => {
  const i = args.indexOf("--" + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dft;
};
const DAYS = parseInt(opt("days", "14"), 10);
const FORMAT = opt("format", "text");
const SITE = "https://yzyhhhstudy.github.io/paper-deadlines/";

const confs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data.json"), "utf8"));
const now = Date.now();

const upcoming = confs
  .filter((c) => !c.rolling)
  .map((c) => {
    const abs = c.abstractDeadline && new Date(c.abstractDeadline).getTime() > now;
    const iso = abs ? c.abstractDeadline : c.deadline;
    return { ...c, nextIso: iso, isAbs: abs, ms: new Date(iso).getTime() - now };
  })
  .filter((c) => c.ms > 0 && c.ms <= DAYS * 86400000)
  .sort((a, b) => a.ms - b.ms);

const line = (c, md) => {
  const d = Math.floor(c.ms / 86400000);
  const date = c.nextIso.slice(0, 10);
  const mark = d < 3 ? "🔴" : d < 7 ? "🟠" : "🟡";
  const name = md ? `<${c.link}|${c.name}>` : c.name;
  return `${mark} ${name}（${c.rank}）— ${c.isAbs ? "摘要" : "全文"}截止 ${date}，还剩 ${d} 天`;
};

const title = `📡 DDL Radar 周报：未来 ${DAYS} 天内 ${upcoming.length} 个截稿`;
const textBody = [title, "", ...upcoming.map((c) => line(c, false)), "", `完整列表：${SITE}`].join("\n");

if (FORMAT === "text") {
  console.log(textBody);
} else if (FORMAT === "markdown") {
  const md = [
    `## ${title}`, "",
    ...upcoming.map((c) => {
      const d = Math.floor(c.ms / 86400000);
      return `- ${d < 3 ? "🔴" : d < 7 ? "🟠" : "🟡"} [${c.name}](${c.link})（${c.rank}）— ${c.isAbs ? "摘要" : "全文"}截止 \`${c.nextIso.slice(0, 10)}\`，还剩 **${d} 天**`;
    }),
    "", `[完整列表](${SITE})`,
  ].join("\n");
  console.log(md);
} else if (FORMAT === "slack") {
  console.log(JSON.stringify({ text: [title, ...upcoming.map((c) => line(c, true)), `完整列表：${SITE}`].join("\n") }));
} else if (FORMAT === "discord") {
  console.log(JSON.stringify({ content: textBody.slice(0, 1900) }));
} else if (FORMAT === "feishu") {
  console.log(JSON.stringify({ msg_type: "text", content: { text: textBody } }));
} else {
  console.error("未知 format：" + FORMAT);
  process.exit(1);
}
