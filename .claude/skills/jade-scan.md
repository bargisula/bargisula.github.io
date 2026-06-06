# jade-scan：璞玉自動掃描

**觸發時機：**
- 晨會啟動時後台並行執行（自動）
- 董事長說「/jade-scan」或「璞玉掃描」（手動）

---

## 流程

### Step 0：載入設定
讀取以下三個設定檔，後續步驟依賴這些資料：
- `data/knowledge/trigger-words.json`（觸發關鍵詞與規則）
- `data/knowledge/edges.json`（供應鏈關係邊清單）
- `data/knowledge/scan-log.json`（去重記錄）

### Step 1：拉取 EDGAR 最新 8-K 清單
使用 SEC EDGAR API 拉取最近 5 個交易日的 8-K 申報：
```
https://efts.sec.gov/LATEST/search-index?q=%22%22&dateRange=custom&startdt=YYYY-MM-DD&enddt=YYYY-MM-DD&forms=8-K
```
或使用：`https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=40`

> ⚠️ **User-Agent 必填**：efts.sec.gov 對無 User-Agent 的請求回傳 403。
> 若 WebFetch 失敗，改用 PowerShell Bash 工具加 header：
> ```powershell
> Invoke-WebRequest -Uri "https://efts.sec.gov/LATEST/search-index?..." `
>   -Headers @{"User-Agent"="bargisula@gmail.com jade-scan/1.0"} | Select-Object -ExpandProperty Content
> ```
> 或直接用 Bash curl：
> ```bash
> curl -H "User-Agent: bargisula@gmail.com jade-scan/1.0" "https://efts.sec.gov/..."
> ```

聚焦欄位：公司名稱、CIK、申報日期、exhibit 清單。
優先抓有 99.1（earnings release）或 EX-99 附件的 8-K，這類通常含業績摘要或法說要點。

### Step 2：抓取申報文字內容
對每份 8-K，取以下段落（優先順序）：
1. Exhibit 99.1 的前 3,000 字（業績摘要）
2. 主文件的 Item 2.02（Results of Operations）
3. 若有連結到法說逐字稿頁面，額外抓前 5,000 字

若 EDGAR 無完整逐字稿，以 `{COMPANY} earnings call transcript {QUARTER}` 搜尋 Seeking Alpha 或公司 IR 官網補充。

### Step 3：關鍵詞比對
依 `trigger-words.json` 的規則掃描每份文件：

**觸發條件（任一成立）：**
- 同一類別關鍵詞在同一段落（前後 3 段）出現 2 次以上
- 跨類別各出現 1 次（例：supply_tightness + new_customer_signal）

**排除條件：**
- 命中詞出現在 `exclusion_list` 的排除片語內
- 文件日期超過 10 個交易日（舊聞）

記錄命中的關鍵詞、所屬類別、原文片段（50 字）。

### Step 4：去重檢查
對每個命中的公司，查 `scan-log.json`：
- 若該公司在 `cooldown.company_weeks`（預設 8 週）內已有記錄 → 跳過
- 若命中的產業在 `cooldown.industry_weeks`（預設 4 週）內已有完整分析記錄 → 降優先度（不跳過，但標記 `low_priority: true`）

### Step 5：供應鏈展開
對通過去重的公司，從 `edges.json` 展開一度關係：
- 找出所有 `from = 觸發公司` 且 `type = supplies_to 或 manufactures_at` 的邊
- 依 `weight` 降序排列，取前 5 名
- 這些是「間接受益候選」

同時保留觸發公司本身作為「直接候選」。

### Step 6：stock-scan 快篩
對直接候選 + 間接受益候選，逐一執行快速評估：
- 最近是否有重大利多/利空新聞（避免追高）
- 分析師覆蓋密度（少覆蓋 = 更可能是璞玉）
- 技術面是否已大漲（若近 3 個月漲超 40%，降低優先度）

快篩通過條件：無明顯利空 + 覆蓋度不過度密集 + 未大漲。

### Step 7：寫入 inbox
對快篩通過的候選，寫入 `data/jade/inbox/` 目錄：

**檔案命名：** `YYYYMMDD-{TICKER}.json`

**格式：**
```json
{
  "date": "2026-06-06",
  "ticker": "GLW",
  "trigger_company": "NVDA",
  "trigger_source": "NVDA 8-K 2026-06-05 Exhibit 99.1",
  "trigger_keywords": ["design win", "lead times extending"],
  "trigger_snippet": "...we continue to see lead times extending across optical interconnect...",
  "edge_path": "NVDA → supplies_to → GLW (weight: 0.35)",
  "quick_scan_result": "pass",
  "status": "pending",
  "suggested_action": "industry-analyst optical_fiber 或 jade-report GLW"
}
```

### Step 8：更新去重 log
將本次掃描命中的公司寫入 `scan-log.json`：
```json
{
  "company": "NVDA",
  "industry": "ai_infrastructure",
  "date": "2026-06-06",
  "result": "triggered",
  "candidates_generated": ["GLW", "COHR"]
}
```

### Step 9：回報摘要
輸出一行摘要供晨會 Step 3 使用：
```
jade-scan 完成：掃描 {N} 份 8-K，命中 {M} 筆，產生 {K} 個璞玉候選 → {TICKER1}, {TICKER2}
```

若無任何候選：`jade-scan 完成：本日無新璞玉候選（{N} 份 8-K 掃描，無關鍵詞命中或全數去重）`

---

## 注意事項
- 不做深度分析，只做訊號偵測與候選產生
- 深度分析交給 industry-analyst，格式化交給 jade-report，裁定交給晨會
- edges.json 的 `estimated: true` 邊的展開結果標記為「推算關係，需人工確認」
- 若 EDGAR API 無法存取，改用 WebSearch 搜尋 `site:sec.gov 8-K {date range}`
