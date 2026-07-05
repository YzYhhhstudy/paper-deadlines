# 多设备同步与团队共享看板 — 设计文档

> 状态：设计稿（未实现）。个人数据目前存 localStorage，已有 JSON 备份/恢复作为手动迁移手段（P0，已上线）。

## 背景与原则

DDL Radar 是纯静态站（GitHub Pages），没有自己的后端。个人数据只有几 KB
（收藏、投稿状态、提醒设置），变更频率低（每天几次点击）。因此：

1. **不为这个数据量自建后端**——运维成本远超价值；
2. **利用用户已有的账号体系**（科研用户 ≈ 100% 有 GitHub 账号）；
3. **离线优先**：localStorage 仍是唯一真相源，同步是异步的备份/合并层。

## P1 个人多设备同步 — GitHub Gist 方案

### 流程

```
浏览器 A                      GitHub Gist (私密)                浏览器 B
localStorage  --push(防抖)-->  ddl-radar-sync.json  --pull(启动时)--> localStorage
```

- **认证**：用户在设置面板粘贴一个只有 `gist` 权限的 fine-grained PAT（存
  localStorage，不离开浏览器；页面直连 api.github.com，无中间服务器）。
- **首次开启**：创建一个私密 Gist（文件名 `ddl-radar-sync.json`），把 Gist id
  一并存本地；其他设备粘贴同一个 PAT 后自动发现该 Gist（按文件名搜索）。
- **push**：本地数据变更后防抖 30s PATCH Gist（内容 = 现有备份 JSON + `updatedAt`）。
- **pull**：页面加载时 GET Gist，若远端 `updatedAt` 较新则合并。

### 合并策略（避免丢数据）

- 收藏（Set）：并集；显式"取消收藏"记录 tombstone（`removed: {name: ts}`），
  以时间戳新者为准。
- 投稿状态（Map）：按会议逐键合并，时间戳新者胜——需要把 statusMap 升级为
  `{name: {status, ts}}`（向后兼容旧格式，读到字符串时视为 ts=0）。
- 设置类（语言/主题/提醒天数）：整体时间戳新者胜。

### 为什么不用 OAuth Device Flow

Device flow 体验更好但需要注册 OAuth App 且 token 交换要 CORS 代理（GitHub
的 token 端点不给浏览器 CORS）→ 引入第一个服务端组件。PAT 方案零服务端，
目标用户（会用 GitHub 提 PR 的科研人）完全能接受。以后若做托管版再升级。

### 风险

- PAT 泄漏 = Gist 可写 → 引导用户创建仅 gist 权限的 token，并在 UI 明示。
- Gist API 限流 5000/h，防抖后远够。

## P2 团队共享看板 — 仓库文件方案

### 场景

课题组共同追一批目标会议：谁在投哪个会、进展如何，组内可见。

### 方案：团队自己的 GitHub 仓库当后端

- 团队建一个（私有）仓库，放 `ddl-team.json`：
  `{ members: {alice: {statusMap}, bob: {...}}, watchlist: ["NeurIPS", ...] }`
- 页面新增"团队"视图：填 `owner/repo` + PAT（repo 权限）后：
  - **读**：Contents API 拉 `ddl-team.json`，看板按成员分色/分行展示；60s 轮询。
  - **写**：只写自己的 `members.<me>` 子树，用 Contents API 带 SHA 的 PUT
    （乐观锁；409 时重拉重放）。
- 权限、成员管理、审计全部复用 GitHub 仓库权限——零自建。

### 展示形态

- 看板列内按成员聚合：`NeurIPS 2026` 卡片上显示 alice🟡在写 / bob🟠已投；
- 团队命中率统计（录用/有结果 按成员和整组）；
- watchlist 驱动"只看团队关注"筛选。

### 取舍与后路

- 轮询 60s 足够（数据变更以天为单位）；不做实时协同（CRDT/websocket 均过度）。
- 若未来用户量大到值得做托管后端，同一数据模型平移到任意 KV 存储即可，
  前端合并逻辑不变。

## 实施顺序

1. ✅ P0 JSON 备份/恢复（已上线）
2. P1 statusMap 加时间戳（兼容迁移）→ Gist push/pull → 设置面板 UI
3. P2 团队仓库读 → 团队看板视图 → 写回与冲突处理

P1 约 2-3 天，P2 约 3-5 天。两者都不新增任何服务器。
