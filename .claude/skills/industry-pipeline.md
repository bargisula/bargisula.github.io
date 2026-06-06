---
name: industry-pipeline
description: >
  產業分析流水線編排技能。輸入產業名稱或觸發事件，依序呼叫 5 個 agent，
  產出完整產業分析報告並存入 data/industry/pipeline/{run_id}/。
---

# /industry-pipeline

**格式**：`/industry-pipeline <產業名稱> [觸發事件]`

**範例**：
```
/industry-pipeline 光傳輸系統 "CIEN 法說：hyperscaler 訂單大爆發"
/industry-pipeline AI 伺服器供應鏈
```

---

## 執行步驟

### Step 0：建立 Run ID

```
格式：IND-{YYYYMMDD}-{產業縮寫}
範例：IND-20260606-OPT（光傳輸），IND-20260606-AIX（AI 基礎設施）
```

建立目錄：`data/industry/pipeline/{run_id}/`

### Step 1：寫入觸發事件

寫 `data/industry/pipeline/{run_id}/00-trigger.json`：

```json
{
  "run_id": "{run_id}",
  "industry": "{產業名稱}",
  "trigger_event": "{觸發事件，若無則填 '主動分析'}",
  "triggered_at": "YYYY-MM-DD",
  "related_tickers": [],
  "linked_dsmm_chains": [],
  "_note": "related_tickers 和 linked_dsmm_chains 在分析過程中填入"
}
```

### Step 2：依序執行 5 個 agent

**第 1 棒**：呼叫 `industry-demand` agent
- 輸入：`00-trigger.json` + industry-graph.json + 相關財報
- 輸出：`01-demand.json`
- 確認輸出存在後才進入下一棒

**第 2 棒**：呼叫 `industry-supply` agent
- 輸入：`00-trigger.json` + `01-demand.json`
- 輸出：`02-supply.json`

**第 3 棒**：呼叫 `industry-competition` agent
- 輸入：`01-demand.json` + `02-supply.json` + industry-graph.json
- 輸出：`03-competition.json`

**第 4 棒**：呼叫 `industry-technology` agent
- 輸入：`01~03-*.json`
- 輸出：`04-technology.json`

**第 5 棒**：呼叫 `industry-thesis` agent
- 輸入：`00~04-*.json` + data/positions/（若有）
- 輸出：`05-thesis.json` + `06-summary.json`

### Step 3：建立驗證檔案

彙總 5 棒的 `verifiable_by` 欄位，寫入：
`data/industry/verification/{run_id}-verify.json`

```json
{
  "run_id": "{run_id}",
  "industry": "{產業名稱}",
  "created_at": "YYYY-MM-DD",
  "verification_status": "pending",
  "checkpoints": [
    {
      "id": "VCP-IND-{run_id}-001",
      "dimension": "需求",
      "check_date": "YYYY-MM-DD",
      "prediction": "...",
      "threshold": "...",
      "check_source": "...",
      "status": "pending",
      "actual": null,
      "verdict": null,
      "score": null
    }
  ],
  "overall_score": null
}
```

### Step 4：更新 industry-graph.json

若此產業在 `data/knowledge/industry-graph.json` 中已有節點，
更新對應的 `analysis_run_id` 和 `last_analyzed` 欄位。
若無節點，添加一筆新節點。

### Step 5：輸出摘要

以表格列出 4 個維度的 verdict 和信心值，加論點一句話，加 Kill Switch 數量，加驗證日期表。

---

## 快速查看

分析完成後可用以下指令查看：
```
cat data/industry/pipeline/{run_id}/06-summary.json
```

驗證到期後執行：
```
/industry-verify {run_id}
```
