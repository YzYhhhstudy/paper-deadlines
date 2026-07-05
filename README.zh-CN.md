<div align="right"><a href="./README.md">English</a> | 简体中文</div>

# 📡 DDL Radar · 学术会议/期刊截稿日追踪

追踪 AI/ML、CV、NLP、Systems、Security 等领域顶会截稿日，主打**个性化**：
倒计时、按领域/CCF 等级筛选、收藏、一键导出 .ics 到 Google/Apple 日历。

灵感来自 [ccfddl.com](https://ccfddl.com) 与 [aideadlin.es](https://aideadlin.es)，差异化在个性化订阅与日历集成。

## 功能

- ⏳ 实时倒计时（天/时/分），<7 天红色、<30 天橙色预警
- 🗂 覆盖 15 个领域近 70 个会议：AI/ML、CV、NLP、Speech、Robotics（IROS/ICRA/RSS/CoRL）、Data Mining、DB、Systems、Arch/HPC、Networking、Security、SE、HCI、Graphics、Theory、Multimedia
- 🎨 暗色 / 亮色 / 自动（跟随系统）三态主题切换（记忆偏好）
- 🌏 **中英双语界面**：按浏览器语言自动选择，一键切换并记忆偏好
- 🏷 按领域和等级**多选**筛选，支持搜索
- 🎓 **双等级体系**：中文界面显示 CCF 等级（A/B/C/非CCF），英文界面显示国际通用的
  [CORE 等级](https://portal.core.edu.au)（A*/A/B/C）
- 📈 20 个主流会议附**近 5 年历史 DDL**，一眼看出该会议每年几月截稿的规律（大致日期 ±数天，精确请查官网或 [ccfddl 数据仓库](https://github.com/ccfddl/ccf-deadlines)）
- ⭐ 收藏关注的会议（localStorage 持久化），可只看收藏
- 📅 一键把收藏的 DDL 导出为 `.ics`（含摘要+全文截止、提前 7 天提醒），导入 Google/Apple Calendar
- 📡 **webcal:// 日历订阅**：全部会议或按领域订阅一次，数据更新后日历自动同步，无需重复导出
- 🌐 截止时间自动换算为你的本地时间（数据里存官方时区，多数为 AoE）
- 🙈 可隐藏/显示已截止的会议

## 📡 日历订阅

点页头的**订阅日历**按钮，或直接在 Google/Apple 日历中添加 `webcal://` 订阅链接——
全部会议用 `webcal://yzyhhhstudy.github.io/paper-deadlines/feeds/all.ics`，
也可按领域订阅（如 `feeds/ai-ml.ics`）。数据更新后 feed 自动重建，日历 App 会定期自动同步，
无需再手动导出。

## 🗂 数据与贡献

日期是**示例/往年周期推算**，投稿前务必核对官网。每个会议一个 YAML 文件，放在
`data/conferences/` 下：

```yaml
name: "ICLR"
fullName: "International Conference on Learning Representations"
area: "AI/ML"
ccf: "CCF-A"    # CCF-A / CCF-B / CCF-C / Non-CCF（中文界面显示）
core: "A*"      # CORE：A* / A / B / C / Unranked（英文界面显示）
link: "https://iclr.cc"
editions:
  - id: "ICLR 2027"
    abstractDeadline: "2026-09-18T23:59:59-12:00"   # 可选
    deadline: "2026-09-24T23:59:59-12:00"           # AoE 写 -12:00
    confDate: "2027-04"
    place: "TBD"
history:        # 往年全文截稿日（可选）
  - "2025-09-19"
```

发现某个 DDL 过期了？**改 YAML 提 PR** 即可——CI 自动校验格式，合并后自动重建
`data.js` 和日历 feeds。本地构建：`npm install && npm run build`
（页面本身仍是零依赖静态站；`data.js` 和 `feeds/` 是生成物，不要手改）。

## 运行

纯静态页面：`open index.html`，或部署到 GitHub Pages / Vercel。

## Roadmap

- [x] 数据改为 YAML + GitHub PR 众包维护（参考 ccfddl 模式）
- [x] 订阅链接（webcal://）自动同步日历，而非手动导出
- [ ] 浏览器通知 / 邮件提醒
- [ ] 覆盖期刊（TPAMI、JMLR…）与 workshop
- [ ] 显示 h5-index、录取率等元信息
