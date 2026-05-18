# bargisula.github.io — 系統知識庫

此檔案是所有 agents 與 Claude 的共用知識基礎。
Agent 的 prompt 中若有與此重複的內容，應以此為準並移除重複段落。

---

## 專案概覽

- **類型**：Astro 靜態部落格
- **主題**：經濟、投資、軍事、科技、時事分析
- **部署**：GitHub Pages，透過 `.github/workflows/deploy.yml` 自動部署

---

## 目錄結構

```
bargisula.github.io/
├── src/
│   ├── content/
│   │   ├── blog/          # 部落格文章（.md / .mdx）
│   │   └── notes/         # 筆記（.md / .mdx）
│   └── content.config.ts  # 分類 schema 定義
├── data/                  # JSON 格式的結構化資料
│   ├── finance/           # 市場快報 JSON
│   ├── military/          # 軍事分析 JSON
│   ├── projects/          # 專案介紹 JSON
│   └── silicon/           # 科技產業 JSON
├── .claude/
│   ├── agents/            # Sub-agent 定義
│   ├── commands/          # 使用者 slash commands
│   └── scheduled-tasks/   # 排程任務定義
└── CLAUDE.md              # 本檔案
```

---

## 內容分類

### Notes 分類（`src/content/notes/`）
定義於 `src/content.config.ts`，新增分類需同步更新 enum：

| 分類 | 說明 |
|---|---|
| 經濟 | 總體經濟、央行政策、宏觀數據 |
| 投資 | 美股、台股、產業分析、個股研究 |
| 軍事 | 台海安全、區域衝突、武器系統 |
| 小書 | 閱讀筆記、書摘 |
| 勞動 | 勞動市場、就業、薪資數據 |
| 雜記 | 其他不易分類的思考 |
| 國際情勢 | 地緣政治、外交、國際秩序 |

### Blog 分類（`src/content/blog/`）
`投資 / 科技 / 生活 / 策略 / 其他`

---

## Frontmatter 規範

### Notes
```yaml
---
title: '【分類】標題'
description: '60字內摘要'
category: '經濟'           # 必填，只能用上表分類
subcategory: '美股'        # 選填
topic: '自動研究'          # 選填
series: '系列名稱'         # 選填，系列文章用
seriesOrder: 1             # 選填，搭配 series 使用
pubDate: 'YYYY-MM-DD'     # 必填
updatedDate: 'YYYY-MM-DD' # 選填
---
```

### Blog
```yaml
---
title: '標題'
description: '摘要'
pubDate: 'YYYY-MM-DD'
category: '投資'
heroImage: './image.png'  # 選填
---
```

---

## 日期與時區規範

- **台灣時間（TST）= UTC+8**
- 所有文章 `pubDate` 用台灣時間當日日期
- 美股數據日期：台灣時間 06:00 後 = 前一美股交易日收盤
- 台股數據日期：台灣時間 13:35 後 = 當日台股收盤

**美國主要假日（美股休市）：**
元旦、MLK Day（一月第三週一）、總統日（二月第三週一）、陣亡將士紀念日（五月最後週一）、六月節（6/19）、獨立日（7/4）、勞動節（九月第一週一）、感恩節（十一月第四週四）、聖誕節（12/25）

---

## Git 推送規範

```bash
# 標準推送流程
git add [指定檔案路徑]     # 不用 git add -A，避免意外包含敏感檔案
git commit -m "[type]: [描述]"
git push -u origin [branch]
```

**Commit message 類型：**
- `post:` 新增文章
- `analysis:` 新增分析報告
- `fix:` 修正既有內容
- `system:` 系統/設定變更

**推送前必查：**
1. frontmatter 完整（title、description、category、pubDate 必填）
2. MDX 語法：不使用裸 `$數字`（Astro 會把 `$...$` 當 LaTeX 處理）
3. 當日已有同名檔案時，不覆蓋，改用 updatedDate

---

## MDX 語法規範

**Callout 可用類型：**
| type | 用途 |
|---|---|
| data | 數據表格、比較圖 |
| insight | 核心洞察、受益分析 |
| warning | 風險、做空邏輯 |
| quote | 一句話結論 |
| link | 來源連結 |

**禁止：**
- 裸 `$數字`（改用中文或 `\$數字`）
- 多層巢狀 Callout
- `<script>` 標籤

---

## Agent 系統地圖

### Sub-agents（`.claude/agents/`）
| Agent | 角色 | 使用時機 |
|---|---|---|
| **ceo** | 執行長，系統診斷與策略建議 | `/ceo [模式]` |
| **cio** | 投資長，整合各 agent 產出報告 | 需要完整投資報告時 |
| **market-data** | 市場數據採集員 | 需要指數/匯率/法人數字時 |
| **news-scout** | 新聞精選員 | 需要精選市場新聞時 |
| **industry-analyst** | 產業分析師，產出完整 MDX 報告 | 需要深度產業研究時 |
| **us-pre** | 美股盤前報告員 | 台灣時間 21:30 |
| **us-post** | 美股盤後報告員 | 台灣時間 06:00 |
| **tw-pre** | 台股盤前報告員 | 台灣時間 08:30 |
| **tw-post** | 台股盤後報告員 | 台灣時間 13:35 |
| **macro-scan-auto** | 總經週掃描，自動排程 | 週日 10:20 |

### Skills（`.claude/commands/`）
| Skill | 功能 |
|---|---|
| `/stock-scan [TICKER]` | 個股快速五維掃描 |
| `/flash [內容]` | 記錄市場快訊到月份 MD 檔 |
| `/flashlog` | 查閱本月快訊記錄 |
| `/ceo [模式]` | 執行長系統診斷 |

---

## Token 使用原則

- **資料採集任務**（market-data、news-scout）：優先使用 haiku
- **分析與整合任務**（cio、industry-analyst、ceo）：使用 sonnet
- **每個 agent 輸出有上限**：market-data 輸出表格即止，不發散分析
- **重複資訊集中到此檔案**：不在個別 agent 中重複說明通用規則
