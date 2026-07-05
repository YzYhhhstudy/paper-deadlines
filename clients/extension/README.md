# DDL Radar 浏览器插件（Chrome / Edge）

工具栏角标显示 **7 天内截止的会议数量**，点击弹出最近截稿列表（支持搜索、摘要截止预警，中英文自动切换）。数据每 6 小时自动同步自 [DDL Radar](https://yzyhhhstudy.github.io/paper-deadlines/) 的 `data.json`。

## 安装（开发者模式加载）

1. 下载本仓库（`git clone` 或 Code → Download ZIP 后解压）
2. 打开扩展管理页：
   - **Chrome**：地址栏输入 `chrome://extensions`
   - **Edge**：地址栏输入 `edge://extensions`
3. 打开右上角（Edge 在左侧）的 **开发者模式 / Developer mode**
4. 点 **加载已解压的扩展程序 / Load unpacked**，选择本目录 `clients/extension/`
5. 完成——工具栏出现 📡 图标，有临近 DDL 时显示红色数字角标

> 上架 Chrome Web Store / Edge Add-ons 需要开发者账号，把本目录打 zip 直接提交即可。

## English

Toolbar badge shows the number of deadlines within 7 days; the popup lists
upcoming deadlines with search. To install: open `chrome://extensions` (or
`edge://extensions`), enable Developer mode, click "Load unpacked" and select
this `clients/extension/` folder.
