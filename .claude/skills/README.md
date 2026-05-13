# Claude Skills 總覽

> 說「列出我的 skill」或「我有哪些 skill」→ Claude 會讀這份檔案給你看。

---

## Skills（自動觸發）

| skill 名稱 | 觸發方式 | 功能說明 | 輸出位置 |
|---|---|---|---|
| `flash` | 貼新聞 / 說「記下來」 | 自動解析市場快訊，記錄情緒標注，推上部落格 | `flash-notes/YYYY-MM.md` + 部落格 `投資/快訊/` |
| `daily-report` | 說「今日日報」「寫日報」 | 搜尋台灣理財 + 勞動新聞，草稿確認後推上部落格 | `投資/理財日報/` + `勞動/勞動日報/` |
| `weapon-report` | 說「武器日報」「軍事日報」 | 搜尋全球武器新聞，最多 3 篇 MDX 草稿，確認後推上 | `軍事/武器裝備/` |
| `tech-analysis` | 說台股技術主題（CoWoS、HBM、先進封裝等） | 六模組台股產業分析文章 | `投資/台股/` |
| `us-tech-analysis` | 給美股 ticker（NVDA、TSLA 等） | 七模組美股產業分析文章（含台股連動） | `投資/美股/` |
| `us-weekly-report` | 說「寫美股週報」「瀑布分析」 | 美股週報撰寫框架，含供應鏈瀑布分析 | `投資/美股/` |
| `gold-analysis` | 討論黃金走勢、央行購金、去美元化 | 黃金分析框架（自動套用，不寫檔） | 對話中輸出 |

| `deep-analysis` | 說「深度分析 TICKER」「深挖這家公司」「寫深度報告」 | 六節架構深度分析：業務本質→市場→護城河→財務→結構性洞察→風險，先討論架構再動筆 | `投資/美股/[TICKER]-深度分析.mdx` |

| `quick-scan` | 說「快篩」「塊篩」「快速掃描 TICKER」 | 六節精簡結構：公司定位→觸發事件→財務→論點→觀察指標→結論，直接推上 | `投資/美股/[TICKER]-快篩.mdx` |
| ` ai-infra-scan ` | (TODO trigger) | AI 基礎設施新聞解讀框架。當使用者貼上 AI 產業新聞、說「幫我解讀」「... | (TODO output) |
| ` earnings ` | (TODO trigger) | 財報快查框架。當使用者說「看 [TICKER] 財報」「[TICKER] ... | (TODO output) |
| ` macro-scan ` | (TODO trigger) | 總體經濟掃描框架。當使用者說「總經掃描」「這週有什麼數據」「總經環境」 | (TODO output) |
---

## Commands（手動輸入）

| 指令 | 觸發方式 | 功能說明 |
|---|---|---|
| `/flash [內容]` | CLI 輸入 | 記錄市場快訊（同 flash skill） |
| `/flashlog` | CLI 輸入 | 查閱本月快訊速覽 + 最近 5 則 |
| `/stock-scan [代號]` | CLI 輸入 | 個股快速掃描分析 |

---

## 日報確認語法

| 輸入 | 動作 |
|---|---|
| 「確認」 | 兩份都推（理財 + 勞動） |
| 「理財確認」 | 只推理財日報 |
| 「勞動確認」 | 只推勞動日報 |
| 「武器確認」 | 武器裝備三篇全推 |
| 「推武器第 N 篇」 | 只推指定篇 |
| 「修改 [哪份] [哪節]：[內容]」 | 修改草稿後重新預覽 |

---

## 輸出路徑對照

```
C:\Users\alpha\my-blog\src\content\notes\
├── 投資\
│   ├── 快訊\YYYY-MM.mdx          ← flash
│   ├── 理財日報\理財日報-YYYY-MM-DD.md  ← daily-report
│   ├── 台股\[關鍵詞]-產業分析.mdx      ← tech-analysis
│   └── 美股\[TICKER]-產業分析.mdx     ← us-tech-analysis / us-weekly-report
├── 勞動\
│   └── 勞動日報\勞動日報-YYYY-MM-DD.md ← daily-report
└── 軍事\
    └── 武器裝備\YYYY-MM-DD-[主題].mdx  ← weapon-report

C:\Users\alpha\flash-notes\YYYY-MM.md  ← flash 本機備份
```

---

## 新增 / 修改 skill

- 各 skill 完整定義在：`C:\Users\alpha\.claude\skills\[skill名稱]\SKILL.md`
- 修改後下次對話自動生效，不需重啟
