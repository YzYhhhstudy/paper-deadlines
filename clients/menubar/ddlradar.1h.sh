#!/bin/bash
# DDL Radar 菜单栏插件（SwiftBar / xbar，每小时刷新）
# 安装：
#   1. 安装 SwiftBar（brew install swiftbar）或 xbar
#   2. 把本文件拷贝到插件目录（SwiftBar 首次启动时选择的目录）并加执行权限：
#      cp ddlradar.1h.sh <插件目录>/ && chmod +x <插件目录>/ddlradar.1h.sh
# 菜单栏显示"📡 N"（7 天内截止数），下拉列出最近 15 个 DDL，点击直达会议官网
#
# <bitbar.title>DDL Radar</bitbar.title>
# <bitbar.version>1.0</bitbar.version>
# <bitbar.desc>CS conference deadline countdown</bitbar.desc>

curl -sf --max-time 10 "https://yzyhhhstudy.github.io/paper-deadlines/data.json" | python3 -c '
import json, sys
from datetime import datetime, timezone

confs = json.load(sys.stdin)
now = datetime.now(timezone.utc)
rows = []
for c in confs:
    if c.get("rolling"):
        continue
    nxt = c["deadline"]
    if c.get("abstractDeadline") and datetime.fromisoformat(c["abstractDeadline"]) > now:
        nxt = c["abstractDeadline"]
    dt = datetime.fromisoformat(nxt)
    days = (dt - now).days
    if days < 0:
        continue
    rows.append((days, c["name"], dt.strftime("%m-%d"), c["link"]))

rows.sort()
urgent = sum(1 for d, *_ in rows if d < 7)
print(f"📡 {urgent}" if urgent else "📡")
print("---")
for days, name, date, link in rows[:15]:
    color = "#ff5d5d" if days < 7 else "#f0a832" if days < 30 else "#37c47f"
    print(f"{days:>3}d · {date} · {name} | href={link} color={color} font=Menlo")
print("---")
print("打开 DDL Radar | href=https://yzyhhhstudy.github.io/paper-deadlines/")
' || echo "📡 ⚠️"
