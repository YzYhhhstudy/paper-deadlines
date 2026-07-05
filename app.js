// DDL Radar — 会议截稿日追踪
const $ = (s) => document.querySelector(s);

// ---------- i18n ----------
// 等级体系随语言切换：中文界面用 CCF 等级（c.rank），英文界面用 CORE 等级（c.core）
const I18N = {
  zh: {
    htmlLang: "zh-CN",
    dateLocale: "zh-CN",
    docTitle: "DDL Radar · 会议/期刊截稿日追踪",
    subtitle: "学术会议 / 期刊截稿日追踪 — 倒计时 · 收藏 · 日历订阅",
    themeTitles: { auto: "主题：自动（跟随系统）", light: "主题：亮色", dark: "主题：暗色" },
    selAll: "全选",
    selNone: "清空",
    exportBtn: "📅 导出收藏到日历",
    exportTitle: "把收藏的会议 DDL 导出为 .ics 日历文件",
    searchPh: "🔍 搜索会议名称（如 NeurIPS / CVPR…）",
    allAreas: "全部领域",
    allRanks: "全部等级",
    nSelected: (n) => `已选 ${n} 项`,
    starredOnly: "只看收藏 ⭐",
    hidePast: "隐藏已截止",
    empty: "没有符合条件的会议 — 试试放宽筛选，或在 data.js 中添加",
    done: "已截止",
    d: "天", h: "时", m: "分",
    absFirst: "⚠️ 先交摘要！距<b>摘要</b>截止",
    absClosed: "摘要已截止 · 距全文截止",
    fullLeft: "距全文截止",
    absLabel: "摘要截止：",
    fullLabel: "全文截止：",
    localTime: "（你的本地时间）",
    absNote: " ← 早于全文，别错过",
    hist: "📈 近年 DDL：",
    histTitle: "往年全文截稿日（大致日期），帮助判断该会议 DDL 的年度规律",
    starTitle: "收藏",
    foot1: `⚠️ 截稿日期为示例/往年推算数据，投稿前请务必核对会议官网。数据维护在
      <code>data/conferences/*.yml</code>，欢迎提 PR 修改补充（CI 自动校验并重建站点）。`,
    foot2: "倒计时按会议官方时区计算（多数为 AoE = UTC-12）。收藏保存在浏览器本地。等级依据 CCF 推荐目录。",
    subBtn: "📡 订阅日历",
    subTitle: "在 Google/Apple 日历中订阅 DDL，数据更新自动同步",
    subAll: "📅 全部会议",
    sortOptions: { deadline: "按截止时间", h5: "按 h5 指数", acceptAsc: "录取率 低→高", acceptDesc: "录取率 高→低" },
    viewCards: "▦ 卡片",
    viewTimeline: "☰ 时间线",
    viewKanban: "▤ 看板",
    statusNames: { planned: "想投", writing: "在写", submitted: "已投", rebuttal: "Rebuttal", accepted: "已录用", rejected: "被拒" },
    statusNone: "＋ 状态",
    hitRate: (a, total) => `🎯 个人命中率 ${Math.round(a / total * 100)}%（录用 ${a} / 有结果 ${total}）`,
    submitBtn: "🚀 投稿入口",
    notifyDaysLbl: "提前提醒（天）",
    notifyEnable: "🔔 开启提醒",
    notifyDisable: "🔕 关闭提醒",
    kanbanEmpty: "还没有会议进入投稿流程 — 在会议卡片右上角选择「想投 / 在写 / 已投 / Rebuttal」即可加入看板",
    notifLabel: "结果通知：",
    rebuttalLabel: "Rebuttal：",
    keyDates: "关键日期",
    acceptTrend: "历年录取率（约数）",
    tlAxisBtn: "⇥ 时间轴",
    tlListBtn: "☰ 列表",
    todayLbl: "今天",
    tlRolling: "🔄 期刊 · 随时可投",
    absTag: "摘要截止",
    daysLeft: (d) => `${d} 天`,
    h5Tag: (v) => `h5 ${v}`,
    acceptTag: (v) => `录取率 ${v}`,
    rolling: "🔄 随时可投",
    rollingLabel: "滚动审稿",
    rollingMeta: "期刊滚动收稿，无固定截止日期",
    journalTag: "期刊",
    notifyTitle: (name, d) => `📡 ${name} 还有 ${d} 天截稿`,
    notifyOn: "DDL 提醒已开启：收藏的会议临近截止时通知（提前 7 天 / 1 天）· 点击关闭",
    notifyOff: "开启 DDL 提醒（收藏的会议临近截止时浏览器通知）",
    contribLead: "发现 DDL 过期或缺了你关注的会议？",
    contribAdd: "➕ 添加新会议",
    contribFix: "✏️ 修正现有数据",
    contribTail: "（在 GitHub 上直接编辑 YAML 并提 PR，CI 自动校验）",
    alertStar: "先点 ⭐ 收藏几个会议，再导出到日历。",
    icsAbs: "摘要截止", icsFull: "全文截止",
    icsAlarm: (name, label) => `${name} ${label}仅剩 7 天`,
    rankKey: "rank",
    rankOptions: ["CCF-A", "CCF-B", "CCF-C", "Non-CCF"],
    rankOptionLabel: (v) => (v === "Non-CCF" ? "非 CCF" : v),
    rankTag: (v) => v,
  },
  en: {
    htmlLang: "en",
    dateLocale: "en-US",
    docTitle: "DDL Radar · Conference Deadline Tracker",
    subtitle: "Academic conference / journal deadline tracker — countdown · stars · calendar feed",
    themeTitles: { auto: "Theme: auto (follow system)", light: "Theme: light", dark: "Theme: dark" },
    selAll: "Select all",
    selNone: "Clear",
    exportBtn: "📅 Export stars to calendar",
    exportTitle: "Export starred deadlines as an .ics calendar file",
    searchPh: "🔍 Search conferences (e.g. NeurIPS / CVPR…)",
    allAreas: "All areas",
    allRanks: "All ranks",
    nSelected: (n) => `${n} selected`,
    starredOnly: "Starred only ⭐",
    hidePast: "Hide past",
    empty: "No conferences match — try relaxing filters, or add some in data.js",
    done: "Closed",
    d: "d", h: "h", m: "m",
    absFirst: "⚠️ Abstract first! Until <b>abstract</b> deadline",
    absClosed: "Abstract closed · until full paper deadline",
    fullLeft: "Until full paper deadline",
    absLabel: "Abstract: ",
    fullLabel: "Full paper: ",
    localTime: " (your local time)",
    absNote: " ← earlier than the full paper, don't miss it",
    hist: "📈 Past DDLs: ",
    histTitle: "Approximate full-paper deadlines from past years, to gauge each venue's yearly pattern",
    starTitle: "Star",
    foot1: `⚠️ Deadlines are sample data estimated from past cycles — always verify on the
      official website before submitting. Data lives in <code>data/conferences/*.yml</code> —
      PRs welcome (CI validates and rebuilds the site).`,
    foot2: "Countdowns use each venue's official timezone (mostly AoE = UTC-12). Stars are stored locally in your browser. Ranks follow the CORE conference ranking (portal.core.edu.au).",
    subBtn: "📡 Subscribe",
    subTitle: "Subscribe to DDLs in Google/Apple Calendar — updates sync automatically",
    subAll: "📅 All conferences",
    sortOptions: { deadline: "By deadline", h5: "By h5-index", acceptAsc: "Accept rate low→high", acceptDesc: "Accept rate high→low" },
    viewCards: "▦ Cards",
    viewTimeline: "☰ Timeline",
    viewKanban: "▤ Board",
    statusNames: { planned: "Planned", writing: "Writing", submitted: "Submitted", rebuttal: "Rebuttal", accepted: "Accepted", rejected: "Rejected" },
    statusNone: "＋ status",
    hitRate: (a, total) => `🎯 Hit rate ${Math.round(a / total * 100)}% (${a} accepted / ${total} decided)`,
    submitBtn: "🚀 Submit portal",
    notifyDaysLbl: "Remind before (days)",
    notifyEnable: "🔔 Enable reminders",
    notifyDisable: "🔕 Turn off",
    kanbanEmpty: "Nothing in your pipeline yet — pick “Planned / Writing / Submitted / Rebuttal” on any conference card",
    notifLabel: "Notification: ",
    rebuttalLabel: "Rebuttal: ",
    keyDates: "Key dates",
    acceptTrend: "Acceptance rate by year (approx.)",
    tlAxisBtn: "⇥ Axis",
    tlListBtn: "☰ List",
    todayLbl: "Today",
    tlRolling: "🔄 Journals · rolling",
    absTag: "abstract",
    daysLeft: (d) => `${d}d`,
    h5Tag: (v) => `h5 ${v}`,
    acceptTag: (v) => `acc. ${v}`,
    rolling: "🔄 Open for submission",
    rollingLabel: "Rolling review",
    rollingMeta: "Journal with rolling submissions — no fixed deadline",
    journalTag: "Journal",
    notifyTitle: (name, d) => `📡 ${name} — ${d} day${d > 1 ? "s" : ""} to deadline`,
    notifyOn: "DDL reminders on: notified 7 days / 1 day before starred deadlines · click to turn off",
    notifyOff: "Enable DDL reminders (browser notifications for starred venues)",
    contribLead: "Spotted an outdated DDL, or missing your venue?",
    contribAdd: "➕ Add a conference",
    contribFix: "✏️ Fix existing data",
    contribTail: "(edit the YAML on GitHub and open a PR — CI validates it)",
    alertStar: "Star ⭐ a few conferences first, then export.",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core",
    rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "Unranked" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "Unranked" : `CORE ${v}`),
  },
  ja: {
    htmlLang: "ja",
    dateLocale: "ja-JP",
    docTitle: "DDL Radar · 学会締切トラッカー",
    subtitle: "学会・ジャーナル投稿締切トラッカー — カウントダウン · お気に入り · カレンダー連携",
    themeTitles: { auto: "テーマ：自動（システムに従う）", light: "テーマ：ライト", dark: "テーマ：ダーク" },
    selAll: "すべて選択",
    selNone: "クリア",
    exportBtn: "📅 お気に入りをカレンダーへ",
    exportTitle: "お気に入りの締切を .ics ファイルとして書き出す",
    searchPh: "🔍 学会名で検索（例：NeurIPS / CVPR…）",
    allAreas: "全分野",
    allRanks: "全ランク",
    nSelected: (n) => `${n} 件選択中`,
    starredOnly: "お気に入りのみ ⭐",
    hidePast: "締切済みを隠す",
    empty: "該当する学会がありません — フィルタを緩めるか、YAML で追加してください",
    done: "締切済み",
    d: "日", h: "時間", m: "分",
    absFirst: "⚠️ まずアブストラクト！<b>アブスト</b>締切まで",
    absClosed: "アブスト締切済み · 本文締切まで",
    fullLeft: "本文締切まで",
    absLabel: "アブスト締切：",
    fullLabel: "本文締切：",
    localTime: "（ローカル時間）",
    absNote: " ← 本文より早いので注意",
    hist: "📈 過去の締切：",
    histTitle: "過去数年の本文締切（目安）。毎年の傾向の把握に",
    starTitle: "お気に入り",
    foot1: `⚠️ 締切はサンプル／過去の傾向からの推定です。投稿前に必ず公式サイトでご確認ください。
      データは <code>data/conferences/*.yml</code> で管理（PR 歓迎、CI が自動検証）。`,
    foot2: "カウントダウンは各学会の公式タイムゾーン（多くは AoE = UTC-12）基準。お気に入りはブラウザに保存。ランクは CORE ランキング（portal.core.edu.au）に基づきます。",
    sortOptions: { deadline: "締切順", h5: "h5 指数順", acceptAsc: "採択率 低→高", acceptDesc: "採択率 高→低" },
    viewCards: "▦ カード",
    viewTimeline: "☰ タイムライン",
    viewKanban: "▤ ボード",
    statusNames: { planned: "投稿予定", writing: "執筆中", submitted: "投稿済み", rebuttal: "リバッタル", accepted: "採択", rejected: "不採択" },
    statusNone: "＋ 状態",
    hitRate: (a, total) => `🎯 マイ採択率 ${Math.round(a / total * 100)}%（採択 ${a} / 結果 ${total}）`,
    submitBtn: "🚀 投稿ページ",
    notifyDaysLbl: "リマインド（日前）",
    notifyEnable: "🔔 リマインダーを有効化",
    notifyDisable: "🔕 オフにする",
    kanbanEmpty: "パイプラインはまだ空です — カードで「投稿予定 / 執筆中 / 投稿済み / リバッタル」を選んでください",
    notifLabel: "結果通知：",
    rebuttalLabel: "リバッタル：",
    keyDates: "重要日程",
    acceptTrend: "採択率の推移（目安）",
    tlAxisBtn: "⇥ 軸",
    tlListBtn: "☰ リスト",
    todayLbl: "今日",
    tlRolling: "🔄 ジャーナル · 随時投稿可",
    absTag: "アブスト",
    daysLeft: (d) => `${d} 日`,
    h5Tag: (v) => `h5 ${v}`,
    acceptTag: (v) => `採択率 ${v}`,
    rolling: "🔄 随時投稿可",
    rollingLabel: "ローリング査読",
    rollingMeta: "ジャーナルは随時投稿可、固定締切なし",
    journalTag: "ジャーナル",
    notifyTitle: (name, d) => `📡 ${name} 締切まであと ${d} 日`,
    notifyOn: "締切リマインダー ON：お気に入りの締切 7 日前 / 1 日前に通知 · クリックで OFF",
    notifyOff: "締切リマインダーを有効にする（ブラウザ通知）",
    contribLead: "締切が古い、または学会が見つからない？",
    contribAdd: "➕ 学会を追加",
    contribFix: "✏️ データを修正",
    contribTail: "（GitHub 上で YAML を編集して PR — CI が自動検証）",
    subBtn: "📡 購読",
    subTitle: "Google/Apple カレンダーで締切を購読 — 更新は自動同期",
    subAll: "📅 すべての学会",
    alertStar: "まず ⭐ でお気に入りに登録してからエクスポートしてください。",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core",
    rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "ランク外" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "ランク外" : `CORE ${v}`),
  },
  ko: {
    htmlLang: "ko", dateLocale: "ko-KR",
    docTitle: "DDL Radar · 학회 마감일 트래커",
    subtitle: "학회·저널 투고 마감 트래커 — 카운트다운 · 즐겨찾기 · 캘린더 연동",
    themeTitles: { auto: "테마: 자동(시스템)", light: "테마: 라이트", dark: "테마: 다크" },
    selAll: "전체 선택", selNone: "지우기",
    exportBtn: "📅 즐겨찾기를 캘린더로", exportTitle: "즐겨찾기한 마감일을 .ics 파일로 내보내기",
    searchPh: "🔍 학회 검색 (예: NeurIPS / CVPR…)",
    allAreas: "전체 분야", allRanks: "전체 등급", nSelected: (n) => `${n}개 선택`,
    starredOnly: "즐겨찾기만 ⭐", hidePast: "마감된 항목 숨기기",
    empty: "조건에 맞는 학회가 없습니다 — 필터를 완화하거나 YAML로 추가하세요",
    done: "마감됨", d: "일", h: "시간", m: "분",
    absFirst: "⚠️ 초록 먼저! <b>초록</b> 마감까지", absClosed: "초록 마감 · 본문 마감까지", fullLeft: "본문 마감까지",
    absLabel: "초록 마감: ", fullLabel: "본문 마감: ", localTime: " (현지 시간)",
    absNote: " ← 본문보다 빠르니 주의", hist: "📈 과거 마감일: ",
    histTitle: "지난 몇 년간의 본문 마감일(대략) — 연간 패턴 파악용",
    starTitle: "즐겨찾기",
    foot1: `⚠️ 마감일은 과거 주기 기반 추정치입니다. 투고 전 반드시 공식 사이트를 확인하세요.
      데이터는 <code>data/conferences/*.yml</code>에서 관리(PR 환영, CI 자동 검증).`,
    foot2: "카운트다운은 각 학회 공식 시간대(대부분 AoE = UTC-12) 기준. 즐겨찾기는 브라우저에 저장. 등급은 CORE 랭킹(portal.core.edu.au) 기준.",
    sortOptions: { deadline: "마감순", h5: "h5 지수순", acceptAsc: "채택률 낮은순", acceptDesc: "채택률 높은순" },
    viewCards: "▦ 카드", viewTimeline: "☰ 타임라인", viewKanban: "▤ 보드",
    statusNames: { planned: "투고 예정", writing: "작성 중", submitted: "투고 완료", rebuttal: "리버틀", accepted: "채택됨", rejected: "거절됨" },
    statusNone: "＋ 상태",
    hitRate: (a, total) => `🎯 내 채택률 ${Math.round(a / total * 100)}% (채택 ${a} / 결과 ${total})`,
    submitBtn: "🚀 제출 페이지",
    notifyDaysLbl: "미리 알림(일)",
    notifyEnable: "🔔 알림 켜기",
    notifyDisable: "🔕 알림 끄기",
    kanbanEmpty: "파이프라인이 비어 있습니다 — 카드에서 '투고 예정 / 작성 중 / 투고 완료 / 리버틀'을 선택하세요",
    notifLabel: "결과 통지: ", rebuttalLabel: "리버틀: ",
    keyDates: "주요 일정", acceptTrend: "연도별 채택률(대략)",
    tlAxisBtn: "⇥ 축", tlListBtn: "☰ 목록", todayLbl: "오늘",
    tlRolling: "🔄 저널 · 상시 투고", absTag: "초록",
    daysLeft: (d) => `${d}일`, h5Tag: (v) => `h5 ${v}`, acceptTag: (v) => `채택률 ${v}`,
    rolling: "🔄 상시 투고 가능", rollingLabel: "롤링 심사",
    rollingMeta: "저널은 상시 투고 가능, 고정 마감 없음", journalTag: "저널",
    notifyTitle: (name, d) => `📡 ${name} 마감까지 ${d}일`,
    notifyOn: "마감 알림 ON: 즐겨찾기 마감 7일/1일 전 알림 · 클릭하여 끄기",
    notifyOff: "마감 알림 켜기(브라우저 알림)",
    contribLead: "마감일이 오래됐거나 학회가 없나요?",
    contribAdd: "➕ 학회 추가", contribFix: "✏️ 데이터 수정",
    contribTail: "(GitHub에서 YAML 편집 후 PR — CI가 자동 검증)",
    subBtn: "📡 구독", subTitle: "Google/Apple 캘린더에서 마감일 구독 — 자동 동기화", subAll: "📅 전체 학회",
    alertStar: "먼저 ⭐로 몇 개 즐겨찾기한 뒤 내보내세요.",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core", rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "등급 외" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "등급 외" : `CORE ${v}`),
  },
  de: {
    htmlLang: "de", dateLocale: "de-DE",
    docTitle: "DDL Radar · Deadline-Tracker für Konferenzen",
    subtitle: "Deadline-Tracker für Konferenzen & Journals — Countdown · Favoriten · Kalender",
    themeTitles: { auto: "Thema: automatisch (System)", light: "Thema: hell", dark: "Thema: dunkel" },
    selAll: "Alle auswählen", selNone: "Leeren",
    exportBtn: "📅 Favoriten in Kalender", exportTitle: "Favorisierte Deadlines als .ics exportieren",
    searchPh: "🔍 Konferenz suchen (z. B. NeurIPS / CVPR…)",
    allAreas: "Alle Bereiche", allRanks: "Alle Ränge", nSelected: (n) => `${n} ausgewählt`,
    starredOnly: "Nur Favoriten ⭐", hidePast: "Abgelaufene ausblenden",
    empty: "Keine passenden Konferenzen — Filter lockern oder per YAML ergänzen",
    done: "Abgelaufen", d: "T", h: "Std", m: "Min",
    absFirst: "⚠️ Erst Abstract! Bis zur <b>Abstract</b>-Deadline",
    absClosed: "Abstract vorbei · bis zur Volltext-Deadline", fullLeft: "Bis zur Volltext-Deadline",
    absLabel: "Abstract: ", fullLabel: "Volltext: ", localTime: " (Ortszeit)",
    absNote: " ← früher als der Volltext!", hist: "📈 Frühere Deadlines: ",
    histTitle: "Ungefähre Volltext-Deadlines der Vorjahre — für das Jahresmuster",
    starTitle: "Favorit",
    foot1: `⚠️ Termine sind Schätzungen aus früheren Zyklen — vor dem Einreichen immer die offizielle
      Seite prüfen. Daten in <code>data/conferences/*.yml</code> (PRs willkommen, CI validiert).`,
    foot2: "Countdowns in der offiziellen Zeitzone (meist AoE = UTC-12). Favoriten lokal im Browser. Ränge nach CORE-Ranking (portal.core.edu.au).",
    sortOptions: { deadline: "Nach Deadline", h5: "Nach h5-Index", acceptAsc: "Quote niedrig→hoch", acceptDesc: "Quote hoch→niedrig" },
    viewCards: "▦ Karten", viewTimeline: "☰ Zeitachse", viewKanban: "▤ Board",
    statusNames: { planned: "Geplant", writing: "Schreiben", submitted: "Eingereicht", rebuttal: "Rebuttal", accepted: "Angenommen", rejected: "Abgelehnt" },
    statusNone: "＋ Status",
    hitRate: (a, total) => `🎯 Trefferquote ${Math.round(a / total * 100)} % (${a} von ${total} entschieden)`,
    submitBtn: "🚀 Einreichung",
    notifyDaysLbl: "Erinnerung (Tage vorher)",
    notifyEnable: "🔔 Erinnerungen aktivieren",
    notifyDisable: "🔕 Ausschalten",
    kanbanEmpty: "Pipeline leer — wähle auf einer Karte „Geplant / Schreiben / Eingereicht / Rebuttal“",
    notifLabel: "Benachrichtigung: ", rebuttalLabel: "Rebuttal: ",
    keyDates: "Wichtige Termine", acceptTrend: "Annahmequote nach Jahr (ca.)",
    tlAxisBtn: "⇥ Achse", tlListBtn: "☰ Liste", todayLbl: "Heute",
    tlRolling: "🔄 Journals · fortlaufend", absTag: "Abstract",
    daysLeft: (d) => `${d} T`, h5Tag: (v) => `h5 ${v}`, acceptTag: (v) => `Quote ${v}`,
    rolling: "🔄 Jederzeit einreichbar", rollingLabel: "Rolling Review",
    rollingMeta: "Journal mit fortlaufender Einreichung — keine feste Deadline", journalTag: "Journal",
    notifyTitle: (name, d) => `📡 ${name} — noch ${d} Tag${d > 1 ? "e" : ""}`,
    notifyOn: "Erinnerungen an: 7 Tage / 1 Tag vor favorisierten Deadlines · klicken zum Ausschalten",
    notifyOff: "Deadline-Erinnerungen aktivieren (Browser-Benachrichtigungen)",
    contribLead: "Veraltete Deadline oder fehlt eine Konferenz?",
    contribAdd: "➕ Konferenz hinzufügen", contribFix: "✏️ Daten korrigieren",
    contribTail: "(YAML auf GitHub bearbeiten und PR öffnen — CI validiert)",
    subBtn: "📡 Abonnieren", subTitle: "Deadlines im Google/Apple-Kalender abonnieren — synchronisiert automatisch", subAll: "📅 Alle Konferenzen",
    alertStar: "Erst ⭐ einige Konferenzen favorisieren, dann exportieren.",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core", rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "Ohne Rang" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "Ohne Rang" : `CORE ${v}`),
  },
  fr: {
    htmlLang: "fr", dateLocale: "fr-FR",
    docTitle: "DDL Radar · Suivi des deadlines de conférences",
    subtitle: "Suivi des deadlines de conférences et revues — compte à rebours · favoris · calendrier",
    themeTitles: { auto: "Thème : auto (système)", light: "Thème : clair", dark: "Thème : sombre" },
    selAll: "Tout sélectionner", selNone: "Effacer",
    exportBtn: "📅 Favoris vers le calendrier", exportTitle: "Exporter les deadlines favorites en .ics",
    searchPh: "🔍 Rechercher (ex. NeurIPS / CVPR…)",
    allAreas: "Tous les domaines", allRanks: "Tous les rangs", nSelected: (n) => `${n} sélectionnés`,
    starredOnly: "Favoris seulement ⭐", hidePast: "Masquer les passées",
    empty: "Aucune conférence trouvée — élargissez les filtres ou ajoutez-en via YAML",
    done: "Clôturée", d: "j", h: "h", m: "min",
    absFirst: "⚠️ Résumé d'abord ! Avant la deadline du <b>résumé</b>",
    absClosed: "Résumé clos · avant la deadline de l'article", fullLeft: "Avant la deadline de l'article",
    absLabel: "Résumé : ", fullLabel: "Article : ", localTime: " (heure locale)",
    absNote: " ← plus tôt que l'article !", hist: "📈 Deadlines passées : ",
    histTitle: "Deadlines des années précédentes (approx.) — pour repérer le rythme annuel",
    starTitle: "Favori",
    foot1: `⚠️ Dates estimées à partir des cycles passés — vérifiez toujours le site officiel avant de
      soumettre. Données dans <code>data/conferences/*.yml</code> (PR bienvenues, validées par la CI).`,
    foot2: "Comptes à rebours dans le fuseau officiel (souvent AoE = UTC-12). Favoris stockés localement. Rangs selon le classement CORE (portal.core.edu.au).",
    sortOptions: { deadline: "Par deadline", h5: "Par indice h5", acceptAsc: "Taux acc. croissant", acceptDesc: "Taux acc. décroissant" },
    viewCards: "▦ Cartes", viewTimeline: "☰ Chronologie", viewKanban: "▤ Tableau",
    statusNames: { planned: "Prévu", writing: "Rédaction", submitted: "Soumis", rebuttal: "Rebuttal", accepted: "Accepté", rejected: "Rejeté" },
    statusNone: "＋ statut",
    hitRate: (a, total) => `🎯 Taux de réussite ${Math.round(a / total * 100)} % (${a}/${total} décidés)`,
    submitBtn: "🚀 Soumission",
    notifyDaysLbl: "Rappel (jours avant)",
    notifyEnable: "🔔 Activer les rappels",
    notifyDisable: "🔕 Désactiver",
    kanbanEmpty: "Pipeline vide — choisissez « Prévu / Rédaction / Soumis / Rebuttal » sur une carte",
    notifLabel: "Notification : ", rebuttalLabel: "Rebuttal : ",
    keyDates: "Dates clés", acceptTrend: "Taux d'acceptation par an (approx.)",
    tlAxisBtn: "⇥ Axe", tlListBtn: "☰ Liste", todayLbl: "Aujourd'hui",
    tlRolling: "🔄 Revues · au fil de l'eau", absTag: "résumé",
    daysLeft: (d) => `${d} j`, h5Tag: (v) => `h5 ${v}`, acceptTag: (v) => `acc. ${v}`,
    rolling: "🔄 Soumission ouverte", rollingLabel: "Évaluation continue",
    rollingMeta: "Revue à soumission continue — pas de deadline fixe", journalTag: "Revue",
    notifyTitle: (name, d) => `📡 ${name} — ${d} jour${d > 1 ? "s" : ""} restants`,
    notifyOn: "Rappels activés : 7 j / 1 j avant les deadlines favorites · cliquer pour désactiver",
    notifyOff: "Activer les rappels (notifications du navigateur)",
    contribLead: "Deadline obsolète ou conférence manquante ?",
    contribAdd: "➕ Ajouter une conférence", contribFix: "✏️ Corriger les données",
    contribTail: "(éditez le YAML sur GitHub et ouvrez une PR — validée par la CI)",
    subBtn: "📡 S'abonner", subTitle: "Abonnez-vous aux deadlines dans Google/Apple Agenda — synchro auto", subAll: "📅 Toutes les conférences",
    alertStar: "Ajoutez d'abord ⭐ quelques favoris, puis exportez.",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core", rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "Non classé" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "Non classé" : `CORE ${v}`),
  },
  es: {
    htmlLang: "es", dateLocale: "es-ES",
    docTitle: "DDL Radar · Rastreador de deadlines",
    subtitle: "Rastreador de deadlines de congresos y revistas — cuenta atrás · favoritos · calendario",
    themeTitles: { auto: "Tema: automático (sistema)", light: "Tema: claro", dark: "Tema: oscuro" },
    selAll: "Seleccionar todo", selNone: "Limpiar",
    exportBtn: "📅 Favoritos al calendario", exportTitle: "Exportar deadlines favoritas como .ics",
    searchPh: "🔍 Buscar (p. ej. NeurIPS / CVPR…)",
    allAreas: "Todas las áreas", allRanks: "Todos los rangos", nSelected: (n) => `${n} seleccionados`,
    starredOnly: "Solo favoritos ⭐", hidePast: "Ocultar vencidas",
    empty: "No hay congresos que coincidan — relaja los filtros o añade por YAML",
    done: "Cerrada", d: "d", h: "h", m: "min",
    absFirst: "⚠️ ¡Primero el resumen! Hasta la deadline del <b>resumen</b>",
    absClosed: "Resumen cerrado · hasta la deadline del artículo", fullLeft: "Hasta la deadline del artículo",
    absLabel: "Resumen: ", fullLabel: "Artículo: ", localTime: " (hora local)",
    absNote: " ← antes que el artículo", hist: "📈 Deadlines pasadas: ",
    histTitle: "Deadlines de años anteriores (aprox.) — para ver el patrón anual",
    starTitle: "Favorito",
    foot1: `⚠️ Fechas estimadas a partir de ciclos anteriores — verifica siempre el sitio oficial antes
      de enviar. Datos en <code>data/conferences/*.yml</code> (PRs bienvenidos, validados por CI).`,
    foot2: "Cuentas atrás en la zona horaria oficial (mayormente AoE = UTC-12). Favoritos guardados localmente. Rangos según el ranking CORE (portal.core.edu.au).",
    sortOptions: { deadline: "Por deadline", h5: "Por índice h5", acceptAsc: "Acept. baja→alta", acceptDesc: "Acept. alta→baja" },
    viewCards: "▦ Tarjetas", viewTimeline: "☰ Cronología", viewKanban: "▤ Tablero",
    statusNames: { planned: "Planificado", writing: "Escribiendo", submitted: "Enviado", rebuttal: "Rebuttal", accepted: "Aceptado", rejected: "Rechazado" },
    statusNone: "＋ estado",
    hitRate: (a, total) => `🎯 Tasa de éxito ${Math.round(a / total * 100)}% (${a}/${total} decididos)`,
    submitBtn: "🚀 Envío",
    notifyDaysLbl: "Aviso (días antes)",
    notifyEnable: "🔔 Activar avisos",
    notifyDisable: "🔕 Desactivar",
    kanbanEmpty: "Pipeline vacío — elige «Planificado / Escribiendo / Enviado / Rebuttal» en una tarjeta",
    notifLabel: "Notificación: ", rebuttalLabel: "Rebuttal: ",
    keyDates: "Fechas clave", acceptTrend: "Tasa de aceptación por año (aprox.)",
    tlAxisBtn: "⇥ Eje", tlListBtn: "☰ Lista", todayLbl: "Hoy",
    tlRolling: "🔄 Revistas · continuo", absTag: "resumen",
    daysLeft: (d) => `${d} d`, h5Tag: (v) => `h5 ${v}`, acceptTag: (v) => `acept. ${v}`,
    rolling: "🔄 Envío abierto", rollingLabel: "Revisión continua",
    rollingMeta: "Revista de envío continuo — sin deadline fija", journalTag: "Revista",
    notifyTitle: (name, d) => `📡 ${name} — queda${d > 1 ? "n" : ""} ${d} día${d > 1 ? "s" : ""}`,
    notifyOn: "Recordatorios activados: 7 días / 1 día antes de las deadlines favoritas · clic para desactivar",
    notifyOff: "Activar recordatorios (notificaciones del navegador)",
    contribLead: "¿Deadline desactualizada o falta tu congreso?",
    contribAdd: "➕ Añadir congreso", contribFix: "✏️ Corregir datos",
    contribTail: "(edita el YAML en GitHub y abre un PR — la CI lo valida)",
    subBtn: "📡 Suscribirse", subTitle: "Suscríbete a las deadlines en Google/Apple Calendar — sincroniza solo", subAll: "📅 Todos los congresos",
    alertStar: "Marca ⭐ algunos congresos primero y luego exporta.",
    icsAbs: "abstract deadline", icsFull: "full paper deadline",
    icsAlarm: (name, label) => `${name} ${label} — 7 days left`,
    rankKey: "core", rankOptions: ["A*", "A", "B", "C", "Unranked"],
    rankOptionLabel: (v) => (v === "Unranked" ? "Sin rango" : `CORE ${v}`),
    rankTag: (v) => (v === "Unranked" ? "Sin rango" : `CORE ${v}`),
  },
};

// URL 参数优先（分享链接可完整复现视图），其次本地偏好，最后浏览器语言
const urlParams = new URLSearchParams(location.search);
let lang = urlParams.get("lang") || localStorage.getItem("ddlradar-lang");
if (!I18N[lang]) {
  const nav = (navigator.language || "").toLowerCase();
  lang = Object.keys(I18N).find((l) => nav.startsWith(l)) || "en";
}
const t = (key) => I18N[lang][key];

// 会议在当前等级体系下的等级值
const rankOf = (c) => c[t("rankKey")];
// "A*" 之类的值不能直接作 CSS 类名，转成安全写法（A* → Astar）
const rankSlug = (v) => v.replace(/\*/g, "star").replace(/[^A-Za-z-]/g, "");

// 带文字的控件用"影子标签"：所有语言的文案叠放在同一格，非当前语言的隐藏，
// 控件宽度 = 各语言中的最大值 → 切换语言时尺寸/位置完全不变（免手调像素，任何字体下都成立）
function biLabel(el, key) {
  // 每个 span 固定标注自身语言：OpenType locl 特性会按 lang 选择地区字形，
  // 若跟随页面语言会导致同一字符串在不同界面语言下宽度微差
  el.innerHTML = `<span class="bi-wrap">` + Object.keys(I18N).map((l) =>
    `<span lang="${I18N[l].htmlLang}" class="${l === lang ? "" : "ghost"}"${l === lang ? "" : ' aria-hidden="true"'}>${I18N[l][key]}</span>`
  ).join("") + `</span>`;
}

// ---------- 主题切换：暗色 / 亮色 / 自动（跟随系统），图标按钮无文字宽度差 ----------
const THEME_MODES = ["auto", "light", "dark"];
const THEME_ICONS = { auto: "🖥", light: "☀️", dark: "🌙" };
let themeMode = localStorage.getItem("ddlradar-theme");
if (!THEME_MODES.includes(themeMode)) themeMode = "auto";

function applyTheme() {
  if (themeMode === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = themeMode;
  $("#themeBtn").textContent = THEME_ICONS[themeMode];
  $("#themeBtn").title = t("themeTitles")[themeMode];
  $("#themeBtn").setAttribute("aria-label", t("themeTitles")[themeMode]);
  localStorage.setItem("ddlradar-theme", themeMode);
}
$("#themeBtn").onclick = () => {
  themeMode = THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length];
  applyTheme();
};

const state = {
  search: urlParams.get("q") || "",
  areas: new Set((urlParams.get("areas") || "").split(",").filter(Boolean)),   // 空 = 全部
  ranks: new Set((urlParams.get("ranks") || "").split(",").filter(Boolean)),   // 空 = 全部（值属于当前语言的等级体系）
  starredOnly: urlParams.get("star") === "1",
  hidePast: urlParams.get("past") !== "show",
  sort: ["deadline", "h5", "acceptAsc", "acceptDesc"].includes(urlParams.get("sort")) ? urlParams.get("sort") : "deadline",
  view: ["timeline", "kanban"].includes(urlParams.get("view")) ? urlParams.get("view") : "cards",
  tlMode: urlParams.get("tlmode") === "list" ? "list" : "axis", // 时间线默认横轴模式
  tlZoom: [3, 6, 12].includes(+urlParams.get("zoom")) ? +urlParams.get("zoom") : 6, // 可视窗口月数
  starred: new Set(JSON.parse(localStorage.getItem("ddlradar-starred") || "[]")),
  // 投稿流程状态：会议名 → planned / writing / submitted / rebuttal
  statusMap: JSON.parse(localStorage.getItem("ddlradar-status") || "{}"),
};
const STATUSES = ["planned", "writing", "submitted", "rebuttal", "accepted", "rejected"];

function saveStatus() {
  localStorage.setItem("ddlradar-status", JSON.stringify(state.statusMap));
}

// 筛选状态实时写回 URL（replaceState 不产生历史记录），复制地址栏即可分享当前视图
let lastUrl = null;
function syncUrl() {
  const p = new URLSearchParams();
  p.set("lang", lang);
  if (state.search) p.set("q", state.search);
  if (state.areas.size) p.set("areas", [...state.areas].join(","));
  if (state.ranks.size) p.set("ranks", [...state.ranks].join(","));
  if (state.starredOnly) p.set("star", "1");
  if (!state.hidePast) p.set("past", "show");
  if (state.sort !== "deadline") p.set("sort", state.sort);
  if (state.view !== "cards") p.set("view", state.view);
  if (state.tlMode !== "axis") p.set("tlmode", state.tlMode);
  if (state.tlZoom !== 6) p.set("zoom", String(state.tlZoom));
  const url = location.pathname + "?" + p.toString();
  if (url !== lastUrl) {
    lastUrl = url;
    try { history.replaceState(null, "", url); } catch (e) { /* file:// 下部分浏览器禁止 */ }
  }
}

function saveStars() {
  localStorage.setItem("ddlradar-starred", JSON.stringify([...state.starred]));
}

// ---------- 多选下拉 ----------

function setupMsel(rootSel, selected, getOptions, getAllLabel, getOptionLabel) {
  const root = $(rootSel);
  const btn = root.querySelector(".msel-btn");
  const panel = root.querySelector(".msel-panel");

  function refreshBtn() {
    const chosen = [...selected];
    btn.textContent = !chosen.length
      ? getAllLabel()
      : chosen.length <= 2
        ? chosen.map(getOptionLabel).join(" + ")
        : t("nSelected")(chosen.length);
    btn.classList.toggle("active", chosen.length > 0);
  }

  function rebuild() {
    // 全选/清空合并为一个切换按钮：未全选时点击=全选，已全选时点击=清空
    const opts = getOptions();
    const allSelected = opts.length > 0 && opts.every((v) => selected.has(v));
    panel.innerHTML = `<div class="msel-actions">
        <button type="button" data-act="${allSelected ? "none" : "all"}">${allSelected ? t("selNone") : t("selAll")}</button>
      </div>` + opts.map((v) => `<label>
        <input type="checkbox" value="${v}" ${selected.has(v) ? "checked" : ""}> ${getOptionLabel(v)}
      </label>`).join("");
    panel.querySelectorAll("input").forEach((cb) => {
      cb.onchange = () => {
        cb.checked ? selected.add(cb.value) : selected.delete(cb.value);
        rebuild(); // 全选状态可能变化，刷新切换按钮文案
        render();
      };
    });
    panel.querySelector(".msel-actions button").onclick = (e) => {
      if (e.target.dataset.act === "all") opts.forEach((v) => selected.add(v));
      else selected.clear();
      rebuild();
      render();
    };
    refreshBtn();
  }

  btn.onclick = (e) => {
    e.stopPropagation();
    const wasOpen = root.classList.contains("open");
    document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open"));
    if (!wasOpen) root.classList.add("open");
  };
  panel.onclick = (e) => e.stopPropagation();

  return { rebuild };
}

document.addEventListener("click", () =>
  document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open")));

const areaSel = setupMsel("#areaSel", state.areas,
  () => [...new Set(CONFERENCES.map((c) => c.area))].sort(),
  () => t("allAreas"), (v) => v);

const rankSel = setupMsel("#rankSel", state.ranks,
  () => t("rankOptions"),
  () => t("allRanks"), (v) => t("rankOptionLabel")(v));

// ---------- 日历订阅（webcal feeds，由 scripts/build.js 生成） ----------

const FEED_HOST = "yzyhhhstudy.github.io/paper-deadlines";
const feedSlug = (s) => s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function buildSubPanel() {
  const link = (slug, label) => `<a href="webcal://${FEED_HOST}/feeds/${slug}.ics">${label}</a>`;
  const areas = [...new Set(CONFERENCES.map((c) => c.area))].sort();
  $("#subPanel").innerHTML =
    link("all", t("subAll")) + areas.map((a) => link(feedSlug(a), a)).join("");
  biLabel($("#subBtn"), "subBtn");
  $("#subBtn").title = t("subTitle");
}

$("#subBtn").onclick = (e) => {
  e.stopPropagation();
  const root = $("#subSel");
  const wasOpen = root.classList.contains("open");
  document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open"));
  if (!wasOpen) root.classList.add("open");
};

// ---------- 倒计时 ----------

// 下一个截点：摘要截止未过 → 摘要；否则 → 全文
function nextDeadline(conf) {
  if (conf.abstractDeadline && new Date(conf.abstractDeadline).getTime() > Date.now()) {
    return { iso: conf.abstractDeadline, type: "abstract" };
  }
  return { iso: conf.deadline, type: "full" };
}

// 距下一个截点（排序、倒计时用）；滚动投稿视为无限远
function msLeft(conf) {
  if (conf.rolling) return Infinity;
  return new Date(nextDeadline(conf).iso).getTime() - Date.now();
}

// 距全文截止（判断"已截止"用）；滚动投稿永不截止
function fullMsLeft(conf) {
  if (conf.rolling) return Infinity;
  return new Date(conf.deadline).getTime() - Date.now();
}

function countdownHtml(conf) {
  if (conf.rolling) return `<div class="cd-label">${t("rollingLabel")}</div><div class="countdown rolling">${t("rolling")}</div>`;
  if (fullMsLeft(conf) <= 0) return `<div class="countdown done">${t("done")}</div>`;
  const nd = nextDeadline(conf);
  const ms = new Date(nd.iso).getTime() - Date.now();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const cls = d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
  const label = nd.type === "abstract"
    ? `<div class="cd-label abs">${t("absFirst")}</div>`
    : conf.abstractDeadline
      ? `<div class="cd-label">${t("absClosed")}</div>`
      : `<div class="cd-label">${t("fullLeft")}</div>`;
  return `${label}<div class="countdown ${cls}">${d}<small>${t("d")}</small>${h}<small>${t("h")}</small>${m}<small>${t("m")}</small></div>`;
}

function fmtLocal(iso) {
  return new Date(iso).toLocaleString(t("dateLocale"), {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

// 通知/rebuttal 这类"未来里程碑"行：日期 +（还剩 N 天），已过则不显示倒计时
function milestoneLine(labelKey, dateStr) {
  const d = Math.ceil((new Date(dateStr + "T23:59:59Z").getTime() - Date.now()) / 86400000);
  return `<br>${t(labelKey)}<b>${dateStr}</b>${d >= 0 ? `（${t("daysLeft")(d)}）` : ""}`;
}

// "2024-05-22" → "'24 05/22"
function fmtHist(d) {
  const [y, m, dd] = d.split("-");
  return `'${y.slice(2)} ${m}/${dd}`;
}

// ---------- 渲染 ----------

function visibleConfs() {
  const q = state.search.toLowerCase();
  return CONFERENCES
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q)
      || (c.aliases || []).some((a) => a.toLowerCase().includes(q)))
    .filter((c) => !state.areas.size || state.areas.has(c.area))
    .filter((c) => !state.ranks.size || state.ranks.has(rankOf(c)))
    .filter((c) => !state.starredOnly || state.starred.has(c.name))
    .filter((c) => !state.hidePast || fullMsLeft(c) > 0)
    .sort((a, b) => {
      // h5 降序；录取率支持正序（低→高，难中优先）与倒序（高→低），缺数据的排最后
      if (state.sort === "h5") return (b.h5 || -1) - (a.h5 || -1);
      const rate = (c, miss) => parseFloat(String(c.acceptRate || "").replace("~", "")) || miss;
      if (state.sort === "acceptAsc") return rate(a, 999) - rate(b, 999);
      if (state.sort === "acceptDesc") return rate(b, -1) - rate(a, -1);
      const aAlive = fullMsLeft(a) > 0, bAlive = fullMsLeft(b) > 0;
      // 未截止的按「下一个截点」（摘要或全文）升序，滚动期刊排其后，已截止的排最后
      if (aAlive && bAlive) {
        const d = msLeft(a) - msLeft(b);
        return isNaN(d) ? 0 : d; // 两个 Infinity 相减为 NaN（都是滚动期刊）
      }
      if (aAlive) return -1;
      if (bAlive) return 1;
      return fullMsLeft(b) - fullMsLeft(a);
    });
}

// ---------- 会议详情弹窗：关键日期 + 历年录取率曲线 ----------

function acceptChartSvg(hist) {
  const W = 420, H = 120, padL = 34, padR = 16, padT = 12, padB = 22;
  const rates = hist.map((h) => h.rate);
  const lo = Math.floor(Math.min(...rates) - 2), hi = Math.ceil(Math.max(...rates) + 2);
  const x = (i) => padL + (i * (W - padL - padR)) / Math.max(1, hist.length - 1);
  const y = (r) => padT + ((hi - r) * (H - padT - padB)) / (hi - lo);
  const pts = hist.map((h, i) => `${x(i)},${y(h.rate)}`).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" class="accept-chart">
    ${[lo, (lo + hi) / 2, hi].map((r) => `<g>
      <line x1="${padL}" y1="${y(r)}" x2="${W - padR}" y2="${y(r)}" class="grid"/>
      <text x="${padL - 5}" y="${y(r) + 3}" text-anchor="end" class="lbl">${Math.round(r)}%</text></g>`).join("")}
    <polyline points="${pts}" class="line"/>
    ${hist.map((h, i) => `<g>
      <circle cx="${x(i)}" cy="${y(h.rate)}" r="3.2" class="dot"/>
      <text x="${x(i)}" y="${y(h.rate) - 7}" text-anchor="middle" class="val">${h.rate}%</text>
      <text x="${x(i)}" y="${H - 6}" text-anchor="middle" class="lbl">'${String(h.year).slice(2)}</text></g>`).join("")}
  </svg>`;
}

function openDetail(c) {
  const rank = rankOf(c);
  const dateRow = (label, value) => value ? `<div class="dt-row"><span>${label}</span><b>${value}</b></div>` : "";
  $("#detailBox").innerHTML = `
    <button class="dt-close" aria-label="×">✕</button>
    <h2><a href="${c.link}" target="_blank" rel="noopener">${c.name}</a></h2>
    <div class="full-name">${c.fullName}</div>
    <div class="tags">
      <span class="tag rank-${rankSlug(rank)}">${t("rankTag")(rank)}</span>
      ${c.type === "journal" ? `<span class="tag type-journal">📖 ${t("journalTag")}</span>` : ""}
      ${c.type === "workshop" ? `<span class="tag type-workshop">🛠 Workshop</span>` : ""}
      <span class="tag">${c.area}</span>
      ${c.h5 ? `<span class="tag tag-metric">${t("h5Tag")(c.h5)}</span>` : ""}
      ${c.acceptRate ? `<span class="tag tag-metric">${t("acceptTag")(c.acceptRate)}</span>` : ""}
    </div>
    <h4>${t("keyDates")}</h4>
    ${c.rolling ? `<div class="dt-row"><b>${t("rollingMeta")}</b></div>` : ""}
    ${dateRow(t("absLabel"), c.abstractDeadline && fmtLocal(c.abstractDeadline))}
    ${dateRow(t("fullLabel"), c.deadline && fmtLocal(c.deadline))}
    ${dateRow(t("rebuttalLabel"), c.rebuttal)}
    ${dateRow(t("notifLabel"), c.notification)}
    ${c.history ? `<div class="dt-row hist"><span>${t("hist")}</span><b>${c.history.map(fmtHist).join(" · ")}</b></div>` : ""}
    ${c.submitLink ? `<div class="dt-row"><span></span><a class="tag tag-submit" href="${c.submitLink}" target="_blank" rel="noopener">${t("submitBtn")}</a></div>` : ""}
    ${c.acceptHistory ? `<h4>${t("acceptTrend")}</h4>${acceptChartSvg(c.acceptHistory)}` : ""}
  `;
  $("#detailOverlay").hidden = false;
  $("#detailBox").querySelector(".dt-close").onclick = closeDetail;
}

function closeDetail() { $("#detailOverlay").hidden = true; }
$("#detailOverlay").onclick = (e) => { if (e.target === $("#detailOverlay")) closeDetail(); };
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });

// ---------- 投稿流程：状态选择器 + 看板视图 ----------

function statusSelHtml(name) {
  const st = state.statusMap[name] || "";
  return `<select class="status-sel ${st ? "has st-" + st : ""}" data-name="${name}" title="${t("statusNone")}">
    <option value="">${st ? "—" : t("statusNone")}</option>
    ${STATUSES.map((s) => `<option value="${s}" ${st === s ? "selected" : ""}>${t("statusNames")[s]}</option>`).join("")}
  </select>`;
}

function bindStatusSels(root) {
  root.querySelectorAll(".status-sel").forEach((sel) => {
    sel.onchange = () => {
      if (sel.value) state.statusMap[sel.dataset.name] = sel.value;
      else delete state.statusMap[sel.dataset.name];
      saveStatus();
      render();
    };
    sel.onclick = (e) => e.stopPropagation();
  });
}

function kanbanCountdown(c) {
  // 已投/rebuttal 阶段关心的是结果通知，其余阶段关心投稿截止
  const st = state.statusMap[c.name];
  if (st === "accepted") return `<span class="kb-cd safe">🎉 ${c.confDate || ""}</span>`;
  if (st === "rejected") return `<span class="kb-cd done">—</span>`;
  if ((st === "submitted" || st === "rebuttal") && c.notification) {
    const d = Math.ceil((new Date(c.notification + "T23:59:59Z").getTime() - Date.now()) / 86400000);
    if (d >= 0) return `<span class="kb-cd soon">${t("notifLabel")}${c.notification.slice(5)} · ${t("daysLeft")(d)}</span>`;
  }
  if (c.rolling) return `<span class="kb-cd safe">${t("rolling")}</span>`;
  if (fullMsLeft(c) <= 0) return `<span class="kb-cd done">${t("done")}</span>`;
  const d = Math.floor(msLeft(c) / 86400000);
  const cls = d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
  return `<span class="kb-cd ${cls}">${nextDeadline(c).iso.slice(5, 10)} · ${t("daysLeft")(d)}</span>`;
}

function renderKanban(wrap) {
  // 看板是"我的投稿流程"，不受筛选影响，展示所有设置过状态的会议
  const cols = STATUSES.map((s) => {
    const items = CONFERENCES.filter((c) => state.statusMap[c.name] === s);
    return `<div class="kb-col" data-status="${s}">
      <div class="kb-head st-${s}">${t("statusNames")[s]} <span class="kb-count">${items.length}</span></div>
      ${items.map((c) => `<div class="kb-item" draggable="true" data-name="${c.name}">
        <a href="${c.link}" target="_blank" rel="noopener">${c.name}</a>
        ${kanbanCountdown(c)}
        ${statusSelHtml(c.name)}
      </div>`).join("")}
    </div>`;
  });
  // 个人命中率：已录用 / (已录用 + 被拒)
  const acc = Object.values(state.statusMap).filter((s) => s === "accepted").length;
  const rej = Object.values(state.statusMap).filter((s) => s === "rejected").length;
  const stats = acc + rej > 0 ? `<div class="kb-stats">${t("hitRate")(acc, acc + rej)}</div>` : "";
  const any = Object.keys(state.statusMap).length;
  wrap.innerHTML = `<div class="kanban">${stats}${cols.join("")}</div>` +
    (any ? "" : `<div class="empty">${t("kanbanEmpty")}</div>`);
  bindStatusSels(wrap);

  // 拖拽卡片到目标列即改状态（下拉选择仍保留，兼容触屏）
  wrap.querySelectorAll(".kb-item").forEach((el) => {
    el.ondragstart = (e) => e.dataTransfer.setData("text/plain", el.dataset.name);
  });
  wrap.querySelectorAll(".kb-col").forEach((col) => {
    col.ondragover = (e) => { e.preventDefault(); col.classList.add("drag-over"); };
    col.ondragleave = () => col.classList.remove("drag-over");
    col.ondrop = (e) => {
      e.preventDefault();
      col.classList.remove("drag-over");
      const name = e.dataTransfer.getData("text/plain");
      if (!name || state.statusMap[name] === col.dataset.status) return;
      state.statusMap[name] = col.dataset.status;
      saveStatus();
      render();
    };
  });
}

// ---------- 时间线视图：横轴时间轴（默认）/ 按月分组列表 ----------

// 横轴模式：x 轴为时间，重叠的会议自动分行（泳道），可横向滚动
// 比例尺按"可视区约等于 6 个月"动态计算，更远的时间左右滑动查看
function tlAxisHtml(confs, viewportW) {
  const dated = confs.filter((c) => !c.rolling)
    .sort((a, b) => new Date(nextDeadline(a).iso) - new Date(nextDeadline(b).iso));
  if (!dated.length) return `<div class="empty">${t("empty")}</div>`;

  const DAY = 86400000, LANE_H = 36;
  const windowDays = state.tlZoom * 30.5; // 可视窗口 = 3/6/12 个月
  const PX_PER_DAY = Math.max(1.4, (viewportW - 28) / windowDays);
  const start = Date.now() - 6 * DAY;
  const end = Math.max(...dated.map((c) => new Date(nextDeadline(c).iso).getTime())) + 24 * DAY;
  const width = Math.ceil((end - start) / DAY * PX_PER_DAY);
  const xOf = (ts) => (ts - start) / DAY * PX_PER_DAY;

  // 泳道分配：与本行上一个标签重叠就换行
  const lanes = [];
  const items = dated.map((c) => {
    const nd = nextDeadline(c);
    const x = xOf(new Date(nd.iso).getTime());
    const label = `${c.name} · ${t("daysLeft")(Math.max(0, Math.floor(msLeft(c) / DAY)))}`;
    const w = label.length * 7.4 + 34;
    let lane = lanes.findIndex((endX) => endX + 10 < x);
    if (lane < 0) { lane = lanes.length; lanes.push(0); }
    lanes[lane] = x + w;
    return { c, nd, x, lane, label };
  });
  const height = lanes.length * LANE_H + 34;

  // 月份网格线
  let months = "";
  const cur = new Date(start);
  cur.setDate(1); cur.setMonth(cur.getMonth() + 1);
  for (; cur.getTime() < end; cur.setMonth(cur.getMonth() + 1)) {
    const x = xOf(cur.getTime());
    months += `<div class="tl-gridline" style="left:${x}px"></div>
      <div class="tl-gridlbl" style="left:${x + 5}px">${cur.toLocaleString(t("dateLocale"), { year: "2-digit", month: "short" })}</div>`;
  }

  const pins = items.map(({ c, nd, x, lane, label }) => {
    const d = Math.floor(msLeft(c) / DAY);
    const cls = d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
    return `<div class="tl-pin ${cls}" style="left:${x}px;top:${lane * LANE_H + 26}px" data-name="${c.name}"
      title="${nd.iso.slice(0, 10)}${nd.type === "abstract" ? " · " + t("absTag") : ""}">${nd.type === "abstract" ? "⚠️ " : ""}${label}</div>`;
  }).join("");

  const todayX = xOf(Date.now());
  return `<div class="tl-axis-scroll"><div class="tl-axis" style="width:${width}px;height:${height}px">
    ${months}
    <div class="tl-today" style="left:${todayX}px"></div>
    <div class="tl-todaylbl" style="left:${todayX + 5}px">${t("todayLbl")}</div>
    ${pins}
  </div></div>`;
}

function renderTimeline(wrap, confs) {
  const zoomSeg = state.tlMode === "axis" ? `<div class="seg tl-zoomseg">
    ${[3, 6, 12].map((mo) => `<button type="button" data-z="${mo}" class="${state.tlZoom === mo ? "on" : ""}">${mo}M</button>`).join("")}
  </div>` : "";
  const toolbar = `<div class="tl-toolbar">${zoomSeg}<div class="seg tl-modeseg">
    <button type="button" data-m="axis" class="${state.tlMode === "axis" ? "on" : ""}">${t("tlAxisBtn")}</button>
    <button type="button" data-m="list" class="${state.tlMode === "list" ? "on" : ""}">${t("tlListBtn")}</button>
  </div></div>`;
  const body = state.tlMode === "axis" ? tlAxisHtml(confs, wrap.clientWidth || 1200) : tlListHtml(confs);
  wrap.innerHTML = `<div class="timeline-wrap">${toolbar}${body}</div>`;
  wrap.querySelectorAll(".tl-modeseg button").forEach((b) => {
    b.onclick = () => { state.tlMode = b.dataset.m; render(); };
  });
  wrap.querySelectorAll(".tl-zoomseg button").forEach((b) => {
    b.onclick = () => { state.tlZoom = +b.dataset.z; render(); };
  });
  wrap.querySelectorAll(".tl-pin").forEach((el) => {
    el.onclick = () => {
      const c = CONFERENCES.find((x) => x.name === el.dataset.name);
      if (c) openDetail(c);
    };
  });
}

// 列表模式：按月分组
function tlListHtml(confs) {
  const dated = confs.filter((c) => !c.rolling)
    .sort((a, b) => new Date(nextDeadline(a).iso) - new Date(nextDeadline(b).iso));
  const rolling = confs.filter((c) => c.rolling);

  const monthOf = (iso) => new Date(iso).toLocaleString(t("dateLocale"), { year: "numeric", month: "long" });
  const dayOf = (iso) => new Date(iso).toLocaleString(t("dateLocale"), { month: "2-digit", day: "2-digit" });

  const row = (c) => {
    const nd = c.rolling ? null : nextDeadline(c);
    const past = fullMsLeft(c) <= 0;
    const d = past || c.rolling ? null : Math.floor(msLeft(c) / 86400000);
    const cls = d == null ? "" : d < 7 ? "urgent" : d < 30 ? "soon" : "safe";
    return `<div class="tl-row ${past ? "past" : ""}">
      <span class="tl-date">${nd ? dayOf(nd.iso) : "—"}</span>
      <a href="${c.link}" target="_blank" rel="noopener">${c.name}</a>
      <span class="tag rank-${rankSlug(rankOf(c))}">${t("rankTag")(rankOf(c))}</span>
      ${nd && nd.type === "abstract" ? `<span class="tag">⚠️ ${t("absTag")}</span>` : ""}
      <span class="tl-left ${cls}">${past ? t("done") : c.rolling ? t("rolling") : t("daysLeft")(d)}</span>
    </div>`;
  };

  let html = "", curMonth = null;
  for (const c of dated) {
    const m = monthOf(nextDeadline(c).iso);
    if (m !== curMonth) { html += `<div class="tl-month">${m}</div>`; curMonth = m; }
    html += row(c);
  }
  if (rolling.length) {
    html += `<div class="tl-month">${t("tlRolling")}</div>` + rolling.map(row).join("");
  }
  return `<div class="timeline">${html}</div>`;
}

function render() {
  syncUrl();
  const wrap = $("#cards");
  const confs = visibleConfs();
  if (!confs.length) {
    wrap.innerHTML = `<div class="empty">${t("empty")}</div>`;
    return;
  }
  if (state.view === "kanban") { renderKanban(wrap); return; }
  if (state.view === "timeline") { renderTimeline(wrap, confs); return; }
  wrap.innerHTML = confs.map((c) => {
    const past = fullMsLeft(c) <= 0;
    const star = state.starred.has(c.name);
    const absUpcoming = nextDeadline(c).type === "abstract";
    const rank = rankOf(c);
    return `<div class="card ${past ? "past" : ""}" data-name="${c.name}">
      <div class="card-top">
        <h3><a href="${c.link}" target="_blank" rel="noopener">${c.name}</a></h3>
        <span class="card-actions">${statusSelHtml(c.name)}<button class="star ${star ? "on" : ""}" data-name="${c.name}" title="${t("starTitle")}">⭐</button></span>
      </div>
      <div class="full-name">${c.fullName}</div>
      <div class="tags">
        <span class="tag rank-${rankSlug(rank)}">${t("rankTag")(rank)}</span>
        ${c.type === "journal" ? `<span class="tag type-journal">📖 ${t("journalTag")}</span>` : ""}
        ${c.type === "workshop" ? `<span class="tag type-workshop">🛠 Workshop</span>` : ""}
        <span class="tag">${c.area}</span>
        ${c.place ? `<span class="tag">📍 ${c.place}</span>` : ""}
        ${c.confDate ? `<span class="tag">🗓 ${c.confDate}</span>` : ""}
        ${c.h5 ? `<span class="tag tag-metric">${t("h5Tag")(c.h5)}</span>` : ""}
        ${c.acceptRate ? `<span class="tag tag-metric">${t("acceptTag")(c.acceptRate)}</span>` : ""}
        ${c.submitLink ? `<a class="tag tag-submit" href="${c.submitLink}" target="_blank" rel="noopener">${t("submitBtn")}</a>` : ""}
      </div>
      ${countdownHtml(c)}
      <div class="meta">
        ${c.abstractDeadline ? `<span class="${absUpcoming ? "abs-hot" : ""}">${absUpcoming ? "⚠️ " : ""}${t("absLabel")}<b>${fmtLocal(c.abstractDeadline)}</b>${t("localTime")}${absUpcoming ? t("absNote") : ""}</span><br>` : ""}
        ${c.rolling ? t("rollingMeta") : `${t("fullLabel")}<b>${fmtLocal(c.deadline)}</b>${t("localTime")}`}
        ${c.rebuttal ? milestoneLine("rebuttalLabel", c.rebuttal) : ""}
        ${c.notification ? milestoneLine("notifLabel", c.notification) : ""}
        ${c.history ? `<br><span class="hist" title="${t("histTitle")}">${t("hist")}${c.history.map(fmtHist).join(" · ")}</span>` : ""}
      </div>
    </div>`;
  }).join("");

  wrap.querySelectorAll(".star").forEach((btn) => {
    btn.onclick = () => {
      const n = btn.dataset.name;
      state.starred.has(n) ? state.starred.delete(n) : state.starred.add(n);
      saveStars();
      render();
    };
  });
  bindStatusSels(wrap);
  // 点卡片空白处打开详情（链接/收藏/状态选择不触发）
  wrap.querySelectorAll(".card").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.closest("a, button, select")) return;
      const c = CONFERENCES.find((x) => x.name === el.dataset.name);
      if (c) openDetail(c);
    };
  });
}

// ---------- 语言切换 ----------

// "添加会议"：跳到 GitHub 新建文件页并预填 YAML 模板，不熟 git 的人也能三步提 PR
const REPO_URL = "https://github.com/YzYhhhstudy/paper-deadlines";
const YAML_TEMPLATE = `name: "MyConf"
fullName: "Full Conference Name"
area: "AI/ML"
ccf: "Non-CCF"    # CCF-A / CCF-B / CCF-C / Non-CCF
core: "Unranked"  # A* / A / B / C / Unranked
link: "https://example.org"
editions:
  - id: "MyConf 2027"
    deadline: "2027-01-01T23:59:59-12:00"   # AoE = -12:00
    confDate: "2027-06"
    place: "TBD"
`;

function renderContrib() {
  const addUrl = `${REPO_URL}/new/master?filename=data/conferences/my-conf.yml&value=${encodeURIComponent(YAML_TEMPLATE)}`;
  const fixUrl = `${REPO_URL}/tree/master/data/conferences`;
  $("#contrib").innerHTML = `${t("contribLead")}
    <a href="${addUrl}" target="_blank" rel="noopener">${t("contribAdd")}</a> ·
    <a href="${fixUrl}" target="_blank" rel="noopener">${t("contribFix")}</a>
    ${t("contribTail")}`;
}

function applyLang() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("docTitle");
  $("#subtitle").textContent = t("subtitle");
  buildLangSel();
  $("#viewSeg").querySelectorAll("button").forEach((b) => {
    biLabel(b, { cards: "viewCards", timeline: "viewTimeline", kanban: "viewKanban" }[b.dataset.view]);
    b.classList.toggle("on", b.dataset.view === state.view);
  });
  biLabel($("#exportIcs"), "exportBtn");
  $("#exportIcs").title = t("exportTitle");
  $("#search").placeholder = t("searchPh");
  const sortSel = $("#sortSel");
  sortSel.innerHTML = Object.entries(t("sortOptions"))
    .map(([v, label]) => `<option value="${v}" ${state.sort === v ? "selected" : ""}>${label}</option>`).join("");
  biLabel($("#starredLabel"), "starredOnly");
  biLabel($("#hidePastLabel"), "hidePast");
  $("#foot1").innerHTML = t("foot1");
  $("#foot2").textContent = t("foot2");
  renderContrib();
  applyTheme();
  updateNotifyBtn(); // 函数声明有提升，首次调用时已可用
  buildSubPanel();
  areaSel.rebuild();
  rankSel.rebuild();
  render();
  localStorage.setItem("ddlradar-lang", lang);
}

// ---------- 语言下拉 ----------

const LANG_NAMES = { zh: "中文", en: "English", ja: "日本語", ko: "한국어", de: "Deutsch", fr: "Français", es: "Español" };

function buildLangSel() {
  $("#langBtn").textContent = `🌐 ${LANG_NAMES[lang]}`;
  $("#langPanel").innerHTML = Object.entries(LANG_NAMES).map(([l, name]) =>
    `<a href="#" data-lang="${l}" lang="${I18N[l].htmlLang}" class="${l === lang ? "cur" : ""}">${l === lang ? "✓ " : ""}${name}</a>`).join("");
  $("#langPanel").querySelectorAll("a").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      $("#langSel").classList.remove("open");
      if (a.dataset.lang === lang) return;
      const prevRankKey = t("rankKey");
      lang = a.dataset.lang;
      // 等级体系变了（CCF ↔ CORE）才清空等级筛选
      if (t("rankKey") !== prevRankKey) state.ranks.clear();
      applyLang();
    };
  });
}

$("#langBtn").onclick = (e) => {
  e.stopPropagation();
  const root = $("#langSel");
  const wasOpen = root.classList.contains("open");
  document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open"));
  if (!wasOpen) root.classList.add("open");
};

// ---------- .ics 导出 ----------

function icsDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function exportIcs() {
  const chosen = CONFERENCES.filter((c) => state.starred.has(c.name) && !c.rolling);
  if (!chosen.length) {
    alert(t("alertStar"));
    return;
  }
  const events = chosen.flatMap((c) => {
    const mk = (label, iso) => [
      "BEGIN:VEVENT",
      `UID:${c.name.replace(/\s+/g, "-")}-${label.replace(/\s+/g, "-")}@ddlradar`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(iso)}`,
      `DTEND:${icsDate(iso)}`,
      `SUMMARY:📡 ${c.name} ${label}`,
      `DESCRIPTION:${c.fullName}\\n${c.link}`,
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${t("icsAlarm")(c.name, label)}`,
      "END:VALARM",
      "END:VEVENT",
    ];
    return [
      ...(c.abstractDeadline ? mk(t("icsAbs"), c.abstractDeadline) : []),
      ...mk(t("icsFull"), c.deadline),
    ];
  });
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DDLRadar//CN",
    ...events, "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ddl-radar.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- 控件 ----------

$("#search").value = state.search;
$("#starredOnly").checked = state.starredOnly;
$("#hidePast").checked = state.hidePast;
$("#viewSeg").querySelectorAll("button").forEach((b) => {
  b.onclick = () => {
    state.view = b.dataset.view;
    $("#viewSeg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  };
});
$("#sortSel").onchange = (e) => { state.sort = e.target.value; render(); };
$("#search").oninput = (e) => { state.search = e.target.value.trim(); render(); };
$("#starredOnly").onchange = (e) => { state.starredOnly = e.target.checked; render(); };
$("#hidePast").onchange = (e) => { state.hidePast = e.target.checked; render(); };
$("#exportIcs").onclick = exportIcs;

// ---------- DDL 浏览器通知：收藏的会议临近截止时提醒（提前天数可自定义） ----------

const NOTIFY_DAY_PRESETS = [1, 3, 7, 14, 30];

function notifyThresholds() {
  try {
    const v = JSON.parse(localStorage.getItem("ddlradar-notify-days") || "[7,1]");
    return Array.isArray(v) && v.length ? v : [7, 1];
  } catch { return [7, 1]; }
}

function notifyEnabled() {
  return "Notification" in window && Notification.permission === "granted"
    && localStorage.getItem("ddlradar-notify") !== "off";
}

async function checkNotifications() {
  if (!notifyEnabled()) return;
  const seen = JSON.parse(localStorage.getItem("ddlradar-notified") || "{}");
  // 首次加载时 SW 可能尚未注册完，等 ready（3 秒兜底后退回构造函数通知）
  let reg = null;
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((r) => setTimeout(() => r(null), 3000)),
    ]);
  }
  for (const c of CONFERENCES) {
    if (!state.starred.has(c.name) || c.rolling) continue;
    const nd = nextDeadline(c);
    const ms = new Date(nd.iso).getTime() - Date.now();
    if (ms <= 0) continue;
    // 从最紧的档位往外找第一个命中的（升序），每个档位对每个截点只发一次
    for (const days of [...notifyThresholds()].sort((a, b) => a - b)) {
      if (ms > days * 86400000) continue;
      const key = `${c.name}|${nd.iso}|${days}`;
      if (seen[key]) break;
      seen[key] = 1;
      const title = t("notifyTitle")(c.name, Math.ceil(ms / 86400000));
      const opts = {
        body: `${nd.type === "abstract" ? t("absLabel") : t("fullLabel")}${fmtLocal(nd.iso)}`,
        icon: "icons/icon-192.png", tag: key,
      };
      if (reg) reg.showNotification(title, opts);
      else new Notification(title, opts);
      break; // 每个会议只发当前最紧的一档
    }
  }
  localStorage.setItem("ddlradar-notified", JSON.stringify(seen));
}

function updateNotifyBtn() {
  const btn = $("#notifyBtn");
  if (!("Notification" in window)) { btn.style.display = "none"; return; }
  const on = notifyEnabled();
  btn.textContent = on ? "🔔" : "🔕";
  btn.title = t(on ? "notifyOn" : "notifyOff");
  btn.setAttribute("aria-label", btn.title);
}

// 铃铛下拉：开关提醒 + 自定义提前天数
function buildNotifyPanel() {
  const panel = $("#notifyPanel");
  if (!("Notification" in window)) return;
  if (!notifyEnabled()) {
    panel.innerHTML = `<a href="#" data-act="enable">${t("notifyEnable")}</a>`;
  } else {
    const days = notifyThresholds();
    panel.innerHTML = `<div class="msel-actions"><span class="notify-lbl">${t("notifyDaysLbl")}</span></div>` +
      NOTIFY_DAY_PRESETS.map((d) => `<label>
        <input type="checkbox" value="${d}" ${days.includes(d) ? "checked" : ""}> ${t("daysLeft")(d)}
      </label>`).join("") +
      `<a href="#" data-act="disable">${t("notifyDisable")}</a>`;
  }
  panel.querySelectorAll("input").forEach((cb) => {
    cb.onchange = () => {
      const sel = [...panel.querySelectorAll("input:checked")].map((x) => +x.value);
      localStorage.setItem("ddlradar-notify-days", JSON.stringify(sel.length ? sel : [7, 1]));
      checkNotifications();
    };
  });
  panel.querySelectorAll("a[data-act]").forEach((a) => {
    a.onclick = async (e) => {
      e.preventDefault();
      if (a.dataset.act === "enable") {
        if (Notification.permission !== "granted" && await Notification.requestPermission() !== "granted") return;
        localStorage.setItem("ddlradar-notify", "on");
        checkNotifications();
      } else {
        localStorage.setItem("ddlradar-notify", "off");
        $("#notifySel").classList.remove("open");
      }
      updateNotifyBtn();
      buildNotifyPanel();
    };
  });
  panel.onclick = (e) => e.stopPropagation();
}

$("#notifyBtn").onclick = (e) => {
  if (!("Notification" in window)) return;
  e.stopPropagation();
  const root = $("#notifySel");
  const wasOpen = root.classList.contains("open");
  document.querySelectorAll(".msel.open").forEach((m) => m.classList.remove("open"));
  if (!wasOpen) { buildNotifyPanel(); root.classList.add("open"); }
};

applyLang();
checkNotifications();
setInterval(render, 60 * 1000); // 每分钟刷新倒计时

// 窗口尺寸变化时重算时间轴比例尺（6 个月窗口跟随可视区宽度）
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (state.view === "timeline" && state.tlMode === "axis") render();
  }, 200);
});
setInterval(checkNotifications, 3600 * 1000); // 每小时检查一次提醒

// ---------- PWA：注册 Service Worker（需要 https 或 localhost） ----------
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* 注册失败不影响页面 */ });
}
