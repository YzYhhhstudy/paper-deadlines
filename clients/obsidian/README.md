# Obsidian 联动

不需要装任何插件之外的东西，两种玩法：

## 1. Dataview 实时截稿看板（推荐）

装 [Dataview](https://github.com/blacksmithgu/obsidian-dataview) 插件并在设置里
打开 **Enable JavaScript Queries**，然后把下面代码块贴进任意笔记：

````markdown
```dataviewjs
const res = await fetch("https://yzyhhhstudy.github.io/paper-deadlines/data.json");
const confs = await res.json();
const now = Date.now();
const rows = confs
  .filter(c => !c.rolling && new Date(c.deadline) > now)
  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  .slice(0, 15)
  .map(c => {
    const d = Math.floor((new Date(c.deadline) - now) / 864e5);
    const mark = d < 7 ? "🔴" : d < 30 ? "🟠" : "🟢";
    return [`[${c.name}](${c.link})`, c.deadline.slice(0, 10), `${mark} ${d} 天`, c.rank];
  });
dv.table(["会议", "截止", "剩余", "等级"], rows);
```
````

每次打开笔记自动拉最新数据，倒计时实时计算。想只看某个领域，在 `filter`
里加 `c.area === "AI/ML"` 即可。

## 2. 静态截稿总表

站点同时发布一份 Markdown 表格（构建时生成、随数据更新）：

<https://yzyhhhstudy.github.io/paper-deadlines/deadlines.md>

直接下载放进 vault，或者用 Obsidian 的 URI/模板插件定期拉取。适合离线场景
或不想开 DataviewJS 的用户。

> 💡 和 [lc-notes](https://github.com/YzYhhhstudy) 一样的思路：让科研工作流
> 的数据住在你自己的笔记库里。未来如果做成正式 Obsidian 插件（侧边栏 +
> 提醒），会基于同一个 data.json。
