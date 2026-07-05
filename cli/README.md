# ddl-radar CLI

CS conference deadline countdowns in your terminal.

```sh
npx ddl-radar                     # 未来 90 天的截稿（发布到 npm 后）
npx github:YzYhhhstudy/paper-deadlines   # 无需 npm 发布也可直接用
ddl-radar --days 30 --area AI/ML,CV --rank CCF-A --search neurips
```

Options: `--days N` `--area X[,Y]` `--rank CCF-A` `--search Q` `--local`

## 发布到 npm（维护者）

```sh
cd cli && npm login && npm publish
```
