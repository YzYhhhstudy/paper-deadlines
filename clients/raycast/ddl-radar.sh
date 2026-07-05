#!/bin/bash

# Raycast 脚本命令：显示最近的会议截稿倒计时
# 安装：Raycast → Settings → Extensions → Script Commands → Add Directories → 选择本目录

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title DDL Radar
# @raycast.mode fullOutput

# Optional parameters:
# @raycast.icon 📡
# @raycast.packageName DDL Radar
# @raycast.description Upcoming CS conference deadlines

curl -sf --max-time 10 "https://yzyhhhstudy.github.io/paper-deadlines/data.json" | python3 -c '
import json, sys
from datetime import datetime, timezone

confs = json.load(sys.stdin)
now = datetime.now(timezone.utc)
rows = []
for c in confs:
    if c.get("rolling"):
        continue
    nxt, tag = c["deadline"], ""
    if c.get("abstractDeadline") and datetime.fromisoformat(c["abstractDeadline"]) > now:
        nxt, tag = c["abstractDeadline"], " ⚠️abs"
    dt = datetime.fromisoformat(nxt)
    days = (dt - now).days
    if days < 0:
        continue
    rows.append((days, c["name"], c["rank"], dt.strftime("%m-%d"), tag))

rows.sort()
print(f"📡 DDL Radar — {len(rows)} upcoming\n")
for days, name, rank, date, tag in rows[:20]:
    icon = "🔴" if days < 7 else "🟠" if days < 30 else "🟢"
    print(f"{icon} {days:>3}d  {date}  {name:<28} {rank}{tag}")
print("\n→ https://yzyhhhstudy.github.io/paper-deadlines/")
' || echo "⚠️ 获取数据失败，请检查网络"
