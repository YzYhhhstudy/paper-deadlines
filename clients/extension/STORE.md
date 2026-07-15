# Chrome Web Store / Edge Add-ons 上架手册

> 照着本文档逐步执行即可，所有文案可直接复制。
> 流程与字段限制来自 LeetLog 上架实战（见 leetlog/docs/store-submission.md）。

## 0. 打包

```sh
npm run pack:extension   # 生成 dist/ddl-radar-extension.zip
```

manifest 权限只有 `alarms`、`storage` 和 host `yzyhhhstudy.github.io`——
比 LeetLog 简单得多（无 content script、无本地服务器），审核风险很低。

---

## A. Chrome Web Store

### 1. 开发者账号（一次性）

[chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)

- $5 一次性注册费
- Google 账号必须开启**两步验证**，否则无法提交
- **Account 标签页**：填写并**验证联系邮箱**（不验证不能发布）
- **Trader 声明**（欧盟 DSA 要求）：免费业余项目选 **Non-trader**

### 2. 上传

"New item" → 上传 `dist/ddl-radar-extension.zip`。

### 3. Store listing 标签页

| 字段 | 填什么 |
|------|--------|
| **名称** | `DDL Radar — CS Conference Deadlines` |
| **Summary**（≤132 字符） | 见下方，已卡在限内 |
| **描述** | 见下方英文版；再加一个 Chinese (Simplified) 本地化贴中文版 |
| **类别** | Productivity → Tools |
| **语言** | English（主）+ Chinese (Simplified)（本地化） |
| **商店图标** | 上传 `icons/icon-128.png`（listing 的图标要单独传，不读 zip 里的） |
| **截图** | ≥1 张，**1280×800** 或 640×400。建议 2 张：① 插件 popup（角标可见）② 网站主界面（说明数据来源生态） |
| **宣传图** | Small promo tile 440×280 可选，暂可跳过 |
| **Homepage URL** | `https://yzyhhhstudy.github.io/paper-deadlines/` |
| **Support URL** | `https://github.com/YzYhhhstudy/paper-deadlines/issues` |

**Summary（127 字符，直接粘贴）**：

```
Toolbar countdown for 70+ CS conference deadlines: badge shows deadlines within 7 days, popup with search and CCF/CORE ranks.
```

**描述（英文）**：

```
Track submission deadlines for 70+ computer-science conferences right from your toolbar.

🔴 Badge — shows how many deadlines fall within the next 7 days
📋 Popup — upcoming deadlines with live countdowns, full-text search, abstract-deadline warnings and CCF/CORE ranks
🔄 Auto-refresh — data syncs every 6 hours from the open-source DDL Radar dataset, which is cross-checked weekly against official sites and OpenReview

NO DATA COLLECTED
The only network request is fetching a public, read-only JSON dataset. No account, no analytics, no tracking. Fully open source: https://github.com/YzYhhhstudy/paper-deadlines

MORE CLIENTS
The same dataset also powers a website/PWA with calendar subscription (webcal), a submission-pipeline kanban board, a CLI, Raycast commands and Obsidian integration: https://yzyhhhstudy.github.io/paper-deadlines/
```

**描述（中文，用于 zh-CN 本地化）**：

```
在浏览器工具栏直接追踪 70+ 个 CS 会议的投稿截止日期。

🔴 角标 —— 显示 7 天内截止的会议数量
📋 弹窗 —— 实时倒计时、全文搜索、摘要截止预警、CCF/CORE 等级
🔄 自动同步 —— 数据每 6 小时刷新，来自开源的 DDL Radar 数据集（每周自动与官网、OpenReview 交叉核对）

不收集任何数据：唯一的网络请求是拉取公开只读的 JSON 数据，无账号、无埋点、无追踪，完全开源。

同一份数据还驱动网页/PWA（支持 webcal 日历订阅、投稿进度看板）、CLI、Raycast 和 Obsidian 集成：https://yzyhhhstudy.github.io/paper-deadlines/
```

### 4. Privacy 标签页（审核重点，逐字段填）

- **Single purpose（单一用途声明）**：

  ```
  Display countdowns for computer-science conference submission deadlines via a toolbar badge and popup.
  ```

- **Permission justifications（每个权限一条，写含糊是被打回的最常见原因）**：
  - `alarms` →
    ```
    Refresh the public conference-deadline dataset in the background every 6 hours so the badge count stays current.
    ```
  - `storage` →
    ```
    Cache the downloaded dataset on the user's device so the popup opens instantly and keeps working offline. No user data is stored.
    ```
  - `host_permissions: https://yzyhhhstudy.github.io/*` →
    ```
    Fetch the public, read-only conference dataset (data.json) published by the open-source DDL Radar project. This is the extension's only network request; nothing is sent to any server.
    ```

- **Remote code**：选 **No, I am not using remote code**（所有 JS 都在包内）
- **Data usage**：勾 **"I do not collect or use any user data"**（本插件确实什么都不收集，
  这条路径比 LeetLog 的还简单——LeetLog 因为读取用户提交代码必须勾 User activity /
  Website content，我们全都不用勾），三条 certify 照勾
- **Privacy policy URL**：
  `https://github.com/YzYhhhstudy/paper-deadlines/blob/master/PRIVACY.md`
  （不收集数据时该字段可选，但填上能显著降低审核摩擦）

### 5. 给审核员的备注（"Additional instructions"，上限 500 字符）

直接粘贴（约 380 字符）：

```
No account or login required. The extension makes exactly one type of network request: GET https://yzyhhhstudy.github.io/paper-deadlines/data.json (public, read-only, open-source dataset). No user data is collected or transmitted. Source code: https://github.com/YzYhhhstudy/paper-deadlines

Test: install, click the toolbar icon — upcoming conference deadlines appear immediately. The badge shows the count of deadlines within 7 days.
```

### 6. Distribution 标签页

- Payment: **Free** ｜ Visibility: **Public** ｜ Regions: **All regions**

提交后审核通常 **1~3 个工作日**。

---

## B. Edge Add-ons（免费，用同一个 zip）

[合作伙伴中心](https://partner.microsoft.com/dashboard/microsoftedge) →
注册（免费，无 $5）→ New extension → 上传同一个 zip。

- **Properties**：类别 Productivity；隐私政策 URL 填同一个 PRIVACY.md 链接
- **Listings**：英文 + 中文两个 listing，文案直接复用上面 A.3 的
- **Notes for certification**：粘贴 A.5 的审核备注

Edge 审核通常比 Chrome 慢一些（最长 7 天），但要求更宽松。

---

## C. 过审后 checklist（2026-07 双商店均已完成）

- [x] CWS 2026-07-06 过审，Edge 2026-07-09 过审（提交于 07-06，3 天）
  - Chrome：`chromewebstore.google.com/detail/hdpljcjehnoghfblbppkmfpgmhnefcpg`
  - Edge：`microsoftedge.microsoft.com/addons/detail/ddl-radar/pjeajfgilojgegmcbefpbceaipjcojia`
    （CRX ID `pjeajfgilojgegmcbefpbceaipjcojia`；用户数徽章走公开端点
    `getproductdetailsbycrxid/<crxid>` 的 `$.activeInstallCount`，shields dynamic json）
- [x] README 徽章：CWS 用户数 + Edge 用户数（均为动态徽章）
- [x] 两份 README 表格：插件行改为双商店链接优先
- [x] Roadmap 勾掉两个商店的上架项
- 以后更新版本：改 `manifest.json` 的 `version` → `npm run pack:extension` →
  两个商店的控制台分别上传同一个新 zip（listing 文案不用重填）
