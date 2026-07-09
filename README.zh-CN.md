<div align="right"><a href="./README.md">English</a> | 简体中文</div>

# 📡 DDL Radar · 学术会议/期刊截稿日追踪

[![Data validate & build](https://github.com/YzYhhhstudy/paper-deadlines/actions/workflows/data.yml/badge.svg)](https://github.com/YzYhhhstudy/paper-deadlines/actions/workflows/data.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fyzyhhhstudy.github.io%2Fpaper-deadlines%2F&label=site)](https://yzyhhhstudy.github.io/paper-deadlines/)
[![PWA](https://img.shields.io/badge/PWA-installable-5b4be0)](https://yzyhhhstudy.github.io/paper-deadlines/)
[![npm](https://img.shields.io/npm/v/ddl-radar?logo=npm&color=cb3837)](https://www.npmjs.com/package/ddl-radar)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/hdpljcjehnoghfblbppkmfpgmhnefcpg?label=Chrome%20Web%20Store&color=fbbc05)](https://chromewebstore.google.com/detail/hdpljcjehnoghfblbppkmfpgmhnefcpg)
[![Chrome users](https://img.shields.io/chrome-web-store/users/hdpljcjehnoghfblbppkmfpgmhnefcpg?label=users&color=34a853)](https://chromewebstore.google.com/detail/hdpljcjehnoghfblbppkmfpgmhnefcpg)
[![Edge Add-ons](https://img.shields.io/badge/Edge_Add--ons-in_review-0078d7)](clients/extension/)
[![Obsidian downloads](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&query=%24%5B%22ddl-radar%22%5D.downloads&label=obsidian&logo=obsidian&logoColor=white&color=7c3aed&suffix=%20downloads)](https://obsidian.md/plugins?id=ddl-radar)
[![i18n](https://img.shields.io/badge/i18n-7_languages-1baf7a)](#功能)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/YzYhhhstudy/paper-deadlines/tree/master/data/conferences)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/YzYhhhstudy/paper-deadlines)

追踪 AI/ML、CV、NLP、Systems、Security 等领域顶会截稿日，主打**个性化**：
倒计时、按领域/CCF 等级筛选、收藏、一键导出 .ics 到 Google/Apple 日历。

灵感来自 [ccfddl.com](https://ccfddl.com) 与 [aideadlin.es](https://aideadlin.es)，差异化在个性化订阅与日历集成。

## 功能

- ⏳ 实时倒计时（天/时/分），<7 天红色、<30 天橙色预警
- 🗂 覆盖 16 个领域近 70 个会议（AI/ML、CV、NLP、Systems、Security 等），另有
  📖 **滚动投稿期刊**（TPAMI、IJCV、JMLR、TACL）
- 📱 **可安装 PWA**：离线可用，可添加到手机主屏幕 / 桌面
- 🔔 **截稿提醒**：收藏的会议临近截止时浏览器通知（提前 7 天 / 1 天）
- ☰ **时间线视图**：按月分组看 DDL 密度，与卡片视图一键切换
- 🔗 **可分享链接**：搜索、筛选、视图状态全部编码进 URL，复制地址栏即可分享
- 🔎 别名搜索（NIPS → NeurIPS、Oakland → IEEE S&P、ESEC/FSE → FSE…）
- 📊 约 36 个主流会议附 h5 指数与录取率标签，支持按两者排序
- 🎨 暗色 / 亮色 / 自动（跟随系统）三态主题切换（记忆偏好）
- 🌏 **7 语言界面**（中 / 英 / 日 / 韩 / 德 / 法 / 西）：按浏览器语言自动选择，记忆偏好
- 🏷 按领域和等级**多选**筛选，支持搜索
- 📋 **投稿进度看板**：「想投 / 在写 / 已投 / Rebuttal / 已录用 / 被拒」六列，支持**拖拽**移动，自动统计**个人命中率**
- 📈 **会议详情页**：点卡片查看关键日期（含 rebuttal / 结果通知倒计时）与历年录取率曲线
- ⇥ **时间线视图**：默认横轴时间轴（3/6/12 个月缩放、重叠会议自动分行），可切换列表模式
- 🚀 **投稿入口直达**：OpenReview / ARR 托管的会议一键跳转投稿系统
- 🔔 提醒提前量可自定义（1/3/7/14/30 天）；排序支持截止时间、h5、录取率双向
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
`data.js`、`data.json` 和日历 feeds。本地构建：`npm install && npm run build`
（页面本身仍是零依赖静态站；生成物不要手改）。

可选字段：`aliases`（搜索别名）、`h5`、`acceptRate`、期刊用 `type: journal` + `rolling: true`。

- **只读 API**：全部数据发布在
  [`/data.json`](https://yzyhhhstudy.github.io/paper-deadlines/data.json)，
  可以直接在它之上做 CLI / 插件 / 机器人等其他端
- **每周对账机器人**：GitHub Action 每周一自动和
  [ccfddl](https://github.com/ccfddl/ccf-deadlines) 比对日期，有差异就开 issue 提醒核对

## 在哪里使用

一份数据源（`data.json`），多端使用：

| 端 | 用法 |
|----|------|
| 🌐 **网页 / PWA** | [线上站点](https://yzyhhhstudy.github.io/paper-deadlines/)——桌面 Chrome/Edge 点地址栏安装图标、iPhone 用 Safari 分享→添加到主屏幕；离线可用；界面支持 中 / EN / 日 |
| 📅 **日历订阅** | 页头**订阅日历**按钮 → `webcal://` 订阅源，Google/Apple 日历自动同步 |
| 🧩 **Chrome / Edge 插件** | **[Chrome 商店一键安装](https://chromewebstore.google.com/detail/hdpljcjehnoghfblbppkmfpgmhnefcpg)**——角标显示 7 天内截止数 + 弹窗搜索/等级。Edge 商店审核中；手动加载方式见 [`clients/extension/`](clients/extension/README.md) |
| ⚡ **Raycast** | 把 [`clients/raycast/`](clients/raycast/) 添加为 Script Commands 目录 |
| 📟 **macOS 菜单栏** | 把 [`clients/menubar/ddlradar.1h.sh`](clients/menubar/ddlradar.1h.sh) 拷入 SwiftBar/xbar 插件目录 |
| 💻 **命令行** | `npx ddl-radar --days 30 --area AI/ML`——已发布 [npm](https://www.npmjs.com/package/ddl-radar)，也可 `npm i -g ddl-radar` |
| 📬 **邮件 / Slack / Discord / 飞书** | GitHub Actions 每周一推送摘要——按 [`.github/workflows/digest.yml`](.github/workflows/digest.yml) 里的说明配置 Secrets 即可 |
| 📓 **Obsidian** | **[社区插件市场一键安装](https://obsidian.md/plugins?id=ddl-radar)**——设置 → 第三方插件 → 搜 "DDL Radar"（桌面 + 手机，零依赖）：侧边栏倒计时面板、笔记内 `ddl-radar` 代码块看板、论文笔记 frontmatter 倒计时横幅、状态栏角标。仅拉取公开 `data.json`——详见 [`clients/obsidian-plugin/`](clients/obsidian-plugin/) |
| 🔌 **自己开发** | 直接 `GET` [`/data.json`](https://yzyhhhstudy.github.io/paper-deadlines/data.json) |

## 本地运行

纯静态页面：`open index.html`，或部署到 GitHub Pages / Vercel。

## Roadmap

- [x] 数据改为 YAML + GitHub PR 众包维护（参考 ccfddl 模式）
- [x] 订阅链接（webcal://）自动同步日历，而非手动导出
- [x] 浏览器通知
- [x] 期刊（TPAMI、JMLR、IJCV、TACL）
- [x] h5-index、录取率
- [x] PWA（可安装、离线可用）
- [x] Workshop；每周邮件/群机器人摘要
- [x] 基于 data.json 的浏览器插件 / Raycast / 菜单栏 / CLI
- [x] 每周对账机器人 + 自动修正 PR（ccfddl）
- [ ] 自动爬取官网获取精确 DDL / CFP 详情
- [x] CLI 发布到 npm（[`ddl-radar`](https://www.npmjs.com/package/ddl-radar)）
- [x] 插件上架 Chrome Web Store（[一键安装](https://chromewebstore.google.com/detail/hdpljcjehnoghfblbppkmfpgmhnefcpg)）
- [ ] Edge Add-ons 上架（已提交，审核中）
- [x] Obsidian 社区插件市场上架（[一键安装](https://obsidian.md/plugins?id=ddl-radar)）
