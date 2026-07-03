<div align="right"><a href="./README.md">English</a> | 简体中文</div>

# 📡 DDL Radar · 学术会议/期刊截稿日追踪

追踪 AI/ML、CV、NLP、Systems、Security 等领域顶会截稿日，主打**个性化**：
倒计时、按领域/CCF 等级筛选、收藏、一键导出 .ics 到 Google/Apple 日历。

灵感来自 [ccfddl.com](https://ccfddl.com) 与 [aideadlin.es](https://aideadlin.es)，差异化在个性化订阅与日历集成。

## 功能

- ⏳ 实时倒计时（天/时/分），<7 天红色、<30 天橙色预警
- 🗂 覆盖 15 个领域近 70 个会议：AI/ML、CV、NLP、Speech、Robotics（IROS/ICRA/RSS/CoRL）、Data Mining、DB、Systems、Arch/HPC、Networking、Security、SE、HCI、Graphics、Theory、Multimedia
- 🎨 暗色 / 亮色 / 跟随系统三态主题切换（记忆偏好）
- 🏷 按领域和 CCF 等级（A/B/C/非CCF）筛选，支持搜索
- 📈 20 个主流会议附**近 5 年历史 DDL**，一眼看出该会议每年几月截稿的规律（大致日期 ±数天，精确请查官网或 [ccfddl 数据仓库](https://github.com/ccfddl/ccf-deadlines)）
- ⭐ 收藏关注的会议（localStorage 持久化），可只看收藏
- 📅 一键把收藏的 DDL 导出为 `.ics`（含摘要+全文截止、提前 7 天提醒），导入 Google/Apple Calendar
- 🌐 截止时间自动换算为你的本地时间（数据里存官方时区，多数为 AoE）
- 🙈 可隐藏/显示已截止的会议

## ⚠️ 数据说明

`data.js` 中的日期是**示例/往年周期推算**，投稿前务必核对官网。
数据结构：

```js
{
  name: "ICLR 2027", fullName: "…", area: "AI/ML", rank: "CCF-A",
  abstractDeadline: "2026-09-18T23:59:59-12:00",  // 可选
  deadline: "2026-09-24T23:59:59-12:00",           // AoE 写 -12:00
  confDate: "2027-04", place: "TBD", link: "https://iclr.cc",
}
```

## 运行

纯静态页面，零依赖：`open index.html`，或部署到 GitHub Pages / Vercel。

## Roadmap

- [ ] 数据改为 YAML + GitHub PR 众包维护（参考 ccfddl 模式）
- [ ] 浏览器通知 / 邮件提醒
- [ ] 订阅链接（webcal://）自动同步日历，而非手动导出
- [ ] 覆盖期刊（TPAMI、JMLR…）与 workshop
- [ ] 显示 h5-index、录取率等元信息
