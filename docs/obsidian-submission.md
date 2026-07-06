# Obsidian 社区插件上架手册（含 1.0.0 自动审查实战经验）

> 流程与 LeetLog Bridge 相同（community.obsidian.md 门户，不再接受 obsidian-releases PR）。
> 本文档额外沉淀 DDL Radar 1.0.0 自动审查（2026-07-06）暴露的所有坑。

## 提交前 checklist

- [x] 公开仓库 + 根目录 **LICENSE** 文件（README 挂 MIT 徽章不算数，缺文件必卡）
- [x] `manifest.json` 在**仓库根目录**（与插件目录那份保持同步；`npm run build:obsidian` 会自动拷贝）
- [x] **构建产物 `main.js` 也要在仓库根**（或 dist/build/out）——见下文"BUILD VERIFICATION"坑
- [x] Release：**tag = manifest version，不带 v 前缀**；资产 = `main.js` + `manifest.json`（+ `styles.css`）；
      **不要**附 versions.json（LeetLog 审查建议）
- [x] README 明确**披露网络请求**（本插件：仅拉取公开只读 data.json，无遥测）
- [x] manifest：id 全小写、description 英文、`isDesktopOnly` 如实填写

## 提交

1. [community.obsidian.md](https://community.obsidian.md) 登录，关联 GitHub（YzYhhhstudy）
2. Plugins → **New plugin** → 填 `https://github.com/YzYhhhstudy/paper-deadlines` → 同意政策 → Submit
3. 自动审查即时出报告；改完仓库 + 发新 release 可重新触发；之后进人工队列（数周）

## 自动审查实战经验（1.0.0，2026-07-06）

结论先行：**Warning / Recommendation 都不挡人工审核**，但清掉能显著加快人工过审。

| 审查项 | 现象 | 对策 |
|---|---|---|
| RELEASES: artifact attestations | 建议为 main.js/styles.css 提供出处证明 | `.github/workflows/attest-plugin.yml`：tag push 自动（或 workflow_dispatch 补跑历史 tag）→ CI 重新构建 → `actions/attest-build-provenance@v2` → `gh release upload --clobber` 覆盖资产。权限需要 `id-token: write` + `attestations: write` + `contents: write` |
| BUILD VERIFICATION | "did not find a built main.js"——bot 只在仓库根 / dist / build / out 找 | 插件不在仓库根时，把 `main.js`（顺带 styles.css）拷到根目录并提交；`build:obsidian` 脚本已包含 |
| SOURCE CODE: 海量 no-unsafe-* | bot 跑 type-aware ESLint 但不装子目录依赖，`obsidian` 模块解析失败 → 所有 API 调用都被刷成 any | 大部分是环境噪音，不用逐条追；只修**真实的 any 泄漏**：`loadData()` 返回值断言成 `Partial<Settings>`；frontmatter 字段先 `unknown` 再窄化；删无意义的 `as` 断言 |
| `document` → `activeDocument` | 点名警告 | 全局清理用 `activeDocument`（popout 窗口兼容） |
| js-yaml 点名 | 仓库级扫描，连根 package.json 的**站点构建依赖**也扫 | 插件包内没有它就可以不理（Obsidian 内置 `parseYaml`，若真要在插件里解析 YAML 用它） |
| CSS `!important` | 同样是全仓库扫，连浏览器插件的 popup.css 都会被点 | 用源序/特异性替代：暗色为基础样式，浅色 media query 放文件末尾覆盖 |

## ⚠️ 最重要的坑：release 成功 ≠ 商店可见（插件有两处 manifest）

来自 LeetLog 0.3.5 版本推送失败的实战教训（2026-07-06），DDL Radar 同日排查发现
也缺根 versions.json：

- Obsidian 商店判断插件最新版本，读的**不是 GitHub Release**，而是**默认分支
  （master）根目录的 `manifest.json`**；根目录还必须有 `versions.json`
  （版本 → 最低 Obsidian 版本映射）。
- 插件源码目录和仓库根目录各有一份 manifest——release 发得再成功，只要根目录那份
  没更新，商店就永远认为旧版本是最新，不会给用户推送更新。
- 排查时看到"release 资产齐全"容易误判成"商店缓存延迟，等等就好"——先对比
  **根目录 manifest 版本 vs 插件目录 manifest 版本**，不一致才是真因。

防复发（已内置到 attest-plugin.yml，两道保险）：
1. 打 tag 时校验插件 manifest 版本必须等于 tag，不一致直接拒绝发布；
2. 发布成功后机器人自动把根 `manifest.json` + `versions.json` 同步提交回 master
   （commit 形如 `chore: sync root manifest/versions to X.Y.Z for Obsidian catalog`）。
   本地 `npm run build:obsidian` 也会同步这四件套，双保险。

## 发新版本流程

1. 改 `clients/obsidian-plugin/manifest.json` 的 `version`（和 `versions.json` 加一行）
2. `npm run build:obsidian`（构建 + 同步根目录三件套）→ commit + push
3. `git tag X.Y.Z && git push origin X.Y.Z` → CI 自动：构建 → attest → 创建/更新 release 资产
   （首次给已存在的 tag 补 attestation：Actions → Attest plugin release → Run workflow 填 tag）

## 上架后

- [ ] README 徽章：`obsidian-downloads`（等 community-plugin-stats.json 收录 `ddl-radar` 后，
      shields dynamic json 查 `$["ddl-radar"].downloads`）
- [ ] README"多端使用"表格：Obsidian 行改为商店一键安装优先，手动安装收进 `<details>`
- [ ] Roadmap 勾掉 Obsidian 上架项
