# Chrome Web Store / Edge Add-ons 上架材料

## 打包

```sh
npm run pack:extension   # 生成 dist/ddl-radar-extension.zip
```

## 上架步骤

**Chrome Web Store**：[开发者控制台](https://chrome.google.com/webstore/devconsole)
（一次性 $5 注册费）→ New item → 上传 zip → 填下方文案 → 提交审核（通常 1-3 天）。

**Edge Add-ons**：[合作伙伴中心](https://partner.microsoft.com/dashboard/microsoftedge)
（免费）→ 同一个 zip 直接提交。

## 商店文案（可直接粘贴）

- **名称**：DDL Radar — CS Conference Deadlines
- **一句话简介**：Countdown badge & popup for 70+ CS conference deadlines. 学术会议截稿倒计时。
- **详细描述**：

  Track submission deadlines for 70+ computer-science conferences right from
  your toolbar. The badge shows how many deadlines fall within 7 days; the
  popup lists upcoming deadlines with search, abstract-deadline warnings and
  CCF/CORE ranks. Data refreshes automatically every 6 hours from the
  open-source DDL Radar dataset (community-maintained, cross-checked against
  official sites and OpenReview weekly).

  跟踪 70+ 个 CS 会议的投稿截止：工具栏角标显示 7 天内截止数量，弹窗支持搜索、
  摘要截止预警。数据每 6 小时自动同步，来自开源的 DDL Radar 数据集。

  Website: https://yzyhhhstudy.github.io/paper-deadlines/

- **类别**：Productivity / Tools
- **语言**：English, 中文

## 隐私声明（商店必填）

本插件不收集、不传输任何用户数据。唯一的网络请求是从
`yzyhhhstudy.github.io` 拉取公开的会议数据 JSON；数据缓存在浏览器本地
（chrome.storage.local）。无分析、无追踪、无账号。

Single purpose: display CS conference deadline countdowns.
Permissions justification: `alarms`(定时刷新数据), `storage`(本地缓存数据),
host `yzyhhhstudy.github.io`(拉取公开数据)。
