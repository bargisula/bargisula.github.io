# CODEX TASK：產業分析報告

## 任務資訊
- topic: {{TOPIC}}
- date: {{DATE}}
- output_path: {{OUTPUT_PATH}}
- mode: {{MODE}}

---

## Step 1：讀取本地資料

依序讀取以下路徑，整理與 {{TOPIC}} 相關的資訊：

1. `data/db/` — 掃描所有子目錄（macro/companies/news/raw），抽出與 {{TOPIC}} 相關的檔案
2. `data/intel/` — 讀取最新 2 份新聞摘要 JSON，找出相關段落
3. `data/regime/current.json` — 取得目前宏觀 Regime（景氣座標）
4. `data/coverage/` — 若有相關 ticker 的 company bible，一併讀取

本地資料整理完畢後，條列出：
- 已確認的財務數字（來源 + 日期）
- 已確認的產業事實
- 尚未取得、需要網路補充的項目

---

## Step 2：網路搜尋補充

針對 Step 1 中「尚未取得」的項目，搜尋以下內容：

- {{TOPIC}} 最新產業動態（2025–2026）
- 主要公司最新季報數字（營收、毛利率、EPS）
- 主要分析師最新評等與目標價
- 近期重大新聞（法規、競爭者動態、技術突破）

**規則：財務數字必須來自搜尋結果，不使用訓練資料中的數字。**
數據優先順序：官方 IR / SEC 申報 > 財經媒體 > 分析師報告

---

## Step 3：讀取框架並撰寫報告

**執行前必讀：** `data/frameworks/industry-analysis.md`

嚴格按照框架中的規範撰寫，不得自行發揮，不得省略必填模組，
不得新增框架以外的區塊（例如「資料盤點」等額外段落）。

框架包含：
- 依 {{MODE}} 選擇 Company 模式或 Industry 模式
- 七模組的必填內容與禁止事項
- 寫作語氣與風格要求
- MDX 格式順序（frontmatter 在前，import 在後）
- Callout 使用規則
- Frontmatter 規範

---

## Step 4：存檔

將完整 MDX 報告（含 frontmatter）存到：
`{{OUTPUT_PATH}}`

不要印到 stdout，直接寫檔。
寫完後回報：已存到 {{OUTPUT_PATH}}，字數約 XXX 字。
