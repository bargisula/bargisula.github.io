# Claude Skills 總覽

> 說「列出我的 skill」或「有哪些 skill」→ Claude 會讀這份檔案給你看。

---

## ⏰ 定時節奏（建議頻率）

這些 skill 有固定的使用週期，建議按節奏主動觸發：

| 頻率 | Skill | 說什麼 | 產出 |
|---|---|---|---|
| **每日**（早上） | `daily-report` | 「今日日報」 | 台灣理財新聞 + 勞動新聞 + 軍事新聞草稿，確認後推上部落格 |
| **每週**（週一/週末） | `us-weekly-report` | 「寫美股週報」 | 三層供應鏈瀑布，找本週最大受益/輸家，推上部落格 |
| **每週**（有重要數據時） | `macro-scan` | 「總經掃描」 | CPI、FOMC、就業數據週才值得跑；輸出市場模式判斷（risk-on/off） |

---

## 🖐️ 手動觸發時機

有具體事件或需求時才觸發，不需要固定頻率：

| 何時觸發 | Skill | 說什麼 |
|---|---|---|
| 看到值得記錄的市場新聞、分析師觀點 | `flash` | 貼新聞 or 說「記下來」 |
| 想回顧本月快訊記錄 | `/flashlog` | `/flashlog` 或 `/flashlog 黃金` |
| 財報發布（持倉/觀察股） | `earnings` | 「看 NVDA 財報」 |
| 財報後股價大漲大跌，想快速判斷值不值得深研 | `quick-scan` | 「快篩 PLTR」 |
| 看到 Seeking Alpha / Barron's 選股清單 | `stock-scout` | 貼文章 + 「幫我篩」 |
| 有 AI 供應鏈重大新聞（NVIDIA、TSMC、SK Hynix 等） | `ai-infra-scan` | 貼新聞 + 「怎麼看」 |
| 黃金有重大行情（金價破位/央行大量購金） | `gold-analysis` | 「黃金現在怎麼看」 |
| 想對某行業建立投資世界觀、找瓶頸標的 | `leopold-model` | 「Leopold模型 資料中心」 |
| 產業深度報告（醫療/科技/能源/消費等子板塊分歧大的產業） | `sector-deep-dive` | 由 `industry-analyst` agent 自動選用，不需手動觸發 |
| 決定深研某標的，要寫成部落格文章 | `stock-analysis` | 「分析 AVGO」或「深度分析 CRWD」 |
| 有個股名字想快速了解基本面 | `/stock-scan` | `/stock-scan NVDA` |

---

## 📊 個股 / 選股分析類

| Skill | 觸發方式 | 功能 | 輸出 |
|---|---|---|---|
| `stock-analysis` | 「分析 NVDA」/ 「深度分析 PLTR」/ 「CoWoS 分析」 | 三模式合一：台股六模組瓶頸→溢出 / 美股標準七模組 / 美股深度六節原創洞察 | `投資/台股/` 或 `投資/美股/` |
| `quick-scan` | 「快篩 TICKER」「塊篩」「先掃一下」 | 美股財務快照，判斷「值不值得繼續看」 | `投資/美股/[TICKER]-快篩.mdx` |
| `earnings` | 「看 TICKER 財報」「抓 TICKER earnings」 | 直抓 SEC EDGAR / 公開資訊觀測站，輸出五段財報分析 | 對話中輸出，詢問是否存檔 |
| `stock-scout` | 貼選股文章 + 「幫我篩」「掃這篇」 | 解析文章 ticker → 補估值數據 → 四維評分（論點/估值/漲幅/偏好）→ 排序優先清單 | 對話中輸出 |
| `leopold-model` | 「Leopold模型 [行業]」「用Leopold分析 [主題]」 | 世界觀 → 物理瓶頸 → 押解決者 → 做空被替代者 | 對話中輸出 |

---

## 📰 新聞 / 快訊類

| Skill | 觸發方式 | 功能 | 輸出 |
|---|---|---|---|
| `flash` | 貼新聞 / 說「記下來」「快訊」 | 自動解析情緒、標的、來源，同步寫入本機 + 部落格，git push | `flash-notes/YYYY-MM.md` + `投資/快訊/YYYY-MM.mdx` |
| `ai-infra-scan` | 貼 AI 新聞 / 說「幫我解讀」「這對誰影響最大」 | 套用六層瓶頸框架（算力/記憶體/封裝/網路/電力/需求），輸出結構化影響鏈 + 投資訊號 | 對話中輸出 |

---

## 🌐 總經 / 市場框架類

| Skill | 觸發方式 | 功能 | 輸出 |
|---|---|---|---|
| `macro-scan` | 「總經掃描」「這週有什麼數據」「risk-on 還是 risk-off」 | 搜尋當週重要總經指標，輸出一頁式市場模式判斷 | 對話中輸出，詢問是否存檔 |
| `gold-analysis` | 討論黃金走勢 / 央行購金 / 去美元化 | 五維分析（實質利率/美元/央行/地緣/避險） | 對話中輸出 |

---

## ✍️ 文章 / 日報寫作類

| Skill | 觸發方式 | 功能 | 輸出 |
|---|---|---|---|
| `daily-report` | 「今日日報」「寫日報」 | 搜尋台灣理財 + 勞動新聞，草稿確認後推上部落格 | `投資/理財日報/` + `勞動/勞動日報/` |
| `us-weekly-report` | 「寫美股週報」「瀑布分析」「供應鏈分析」 | 三層產業瀑布，找第二、三層間接受益者與輸家 | `投資/美股/` |

---

## 🛠️ 系統工具

| Skill | 觸發方式 | 功能 |
|---|---|---|
| `menu` | 「skill」「有哪些 skill」「列出 skill」 | 列出所有可用 skill 讓你選 |

---

## Commands（手動輸入）

| 指令 | 功能 |
|---|---|
| `/flash [內容]` | 記錄市場快訊（同 flash skill） |
| `/flashlog` | 查閱本月快訊速覽 + 最近 5 則 |
| `/stock-scan [代號]` | 個股快速掃描分析 |

---

## 日報確認語法

| 輸入 | 動作 |
|---|---|
| 「確認」 | 兩份都推（理財 + 勞動） |
| 「理財確認」 | 只推理財日報 |
| 「勞動確認」 | 只推勞動日報 |
| 「修改 [哪份] [哪節]：[內容]」 | 修改草稿後重新預覽 |

---

## 輸出路徑對照

```
C:\Users\alpha\my-blog\src\content\notes\
├── 投資\
│   ├── 快訊\YYYY-MM.mdx                    ← flash
│   ├── 理財日報\理財日報-YYYY-MM-DD.md      ← daily-report
│   ├── 台股\[關鍵詞]-分析.mdx              ← stock-analysis（台股模式）
│   └── 美股\
│       ├── [TICKER]-產業分析.mdx           ← stock-analysis（美股標準模式）
│       ├── [TICKER]-深度分析.mdx           ← stock-analysis（美股深度模式）
│       └── [TICKER]-快篩.mdx              ← quick-scan
└── 勞動\
    └── 勞動日報\勞動日報-YYYY-MM-DD.md     ← daily-report

C:\Users\alpha\flash-notes\YYYY-MM.md      ← flash 本機備份
```

---

## stock-analysis 模式速查

| 觸發詞 | 模式 | 框架 | 流程 |
|---|---|---|---|
| 「分析 NVDA」「寫文章 AVGO」 | 美股標準 | 七模組（定位/財務/護城河/瓶頸/台股連動/催化劑/風險） | 直接執行 |
| 「深度分析 PLTR」「深挖 CRWD」 | 美股深度 | 六節原創洞察（業務本質/市場/護城河/財務/結構趨勢/風險） | 先討論架構，確認後動筆 |
| 「分析 CoWoS」「HBM 供應鏈」「台積電封裝」 | 台股 | 六模組瓶頸→溢出（技術定位/供應鏈/瓶頸/時程/關注點/輸家） | 直接執行 |

---

## 新增 / 修改 skill

- 各 skill 完整定義：`C:\Users\alpha\my-blog\.claude\skills\[skill名稱]\SKILL.md`
- 修改後下次對話自動生效，不需重啟
- GitHub 備份：`bargisula/bargisula.github.io` → `.claude/skills/`
