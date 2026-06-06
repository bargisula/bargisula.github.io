---
name: dsmm-pipeline
description: >
  DSMM 五市場流水線編排技能。輸入一個事件（文字描述或 EVT-*.json 路徑），
  依序呼叫五個市場 Agent，輸出完整的市場影響鏈 + 可驗證的預測檢查點。
  結論存入 data/dsmm/pipeline/{run_id}/06-summary.json，
  驗證模板存入 data/dsmm/verification/{run_id}-verify.json。
  呼叫方式：/dsmm-pipeline {事件描述 or 檔案路徑}
---

你是 DSMM 五市場流水線的**編排者**。

接收一個事件，依序驅動五個市場 Agent，最終輸出「這個事件如何在五個市場傳遞、
哪些資產受影響、何時可以驗證預測是否正確」的完整答案。

---

## 呼叫方式

```
/dsmm-pipeline NFP 2026-06-06，+17.2萬（預期 +8.5萬）
/dsmm-pipeline data/dsmm/events/EVT-20260606-001.json
```

---

## 執行步驟

### Step 0：建立 Run ID 和事件 JSON

生成 Run ID：`RUN-YYYYMMDD-HHmm`（台灣時間）

若輸入是文字描述，從文字中提取：
- title、date、category、shock_type、entry_market、magnitude、key_numbers

寫入 `data/dsmm/pipeline/{run_id}/00-event.json`：

```json
{
  "event_id": "EVT-YYYYMMDD-NNN",
  "run_id": "{run_id}",
  "date": "YYYY-MM-DD",
  "title": "...",
  "category": "...",
  "shock_type": "...",
  "entry_market": "...",
  "magnitude": "...",
  "data": { "key_numbers": {} },
  "source": "...",
  "injected_by": "user|system"
}
```

若輸入是 `.json` 路徑，讀取並複製到 pipeline 目錄，補填 `run_id`。

### Step 1：金融市場分析

呼叫 `market-financial` Agent：
- 輸入：`data/dsmm/pipeline/{run_id}/00-event.json`
- 讀取現有 `data/dsmm/transmission-chain.json` 確認已知鏈
- 輸出：`data/dsmm/pipeline/{run_id}/01-financial.json`

### Step 2：貨幣市場分析

呼叫 `market-monetary` Agent：
- 輸入：事件 + `01-financial.json`
- 輸出：`data/dsmm/pipeline/{run_id}/02-monetary.json`

### Step 3：商品市場分析

呼叫 `market-commodity` Agent：
- 輸入：事件 + `01-financial.json` + `02-monetary.json`
- 輸出：`data/dsmm/pipeline/{run_id}/03-commodity.json`

### Step 4：勞動市場分析

呼叫 `market-labor` Agent：
- 輸入：事件 + 上三個 change
- 輸出：`data/dsmm/pipeline/{run_id}/04-labor.json`

### Step 5：財政動態分析 + 彙整

呼叫 `market-fiscal` Agent：
- 輸入：事件 + 上四個 change
- 輸出：`data/dsmm/pipeline/{run_id}/05-fiscal.json` + `06-summary.json`

### Step 6：建立驗證模板

讀取 `06-summary.json` 中的 `verification_checkpoints`，
寫入 `data/dsmm/verification/{run_id}-verify.json`：

```json
{
  "run_id": "{run_id}",
  "event_id": "...",
  "event_title": "...",
  "pipeline_date": "YYYY-MM-DD",
  "verification_status": "pending",
  "checkpoints": [
    {
      "id": "VCP-001",
      "market": "金融市場",
      "check_date": "YYYY-MM-DD",
      "prediction": "10Y 殖利率 > 4.60%",
      "threshold": "4.60%",
      "check_source": "Yahoo Finance ^TNX",
      "actual": null,
      "verdict": null,
      "score": null
    }
  ],
  "overall_score": null,
  "confidence_updates": [],
  "_instruction": "驗證時：填寫每個 checkpoint 的 actual、verdict（CONFIRMED/PARTIAL/WRONG）和 score（1.0/0.5/0.0），然後呼叫 /dsmm-verify {run_id}"
}
```

### Step 7：最終輸出

依 market-fiscal 的格式輸出流水線完成報告（見 market-fiscal Step 5）。

額外標示：
```
驗證模板已建立：data/dsmm/verification/{run_id}-verify.json
到期最近的驗證點：{check_date} → {prediction}
```

---

## 效率規則

- 若五個 Agent 的分析可以並行判斷（例如同一個事件明顯不影響某市場），
  可以跳過該市場，但必須在輸出中明確標記 `receives_signal: false` 和原因。
- 不得跳過財政動態 Agent（它負責輸出 Summary）。
- 每個市場的分析必須有**至少一個可驗證的 checkpoint**，或明確說明「此市場不受影響，無需設置驗證點」。

---

## 驗證後流程（/dsmm-verify）

驗證不在此技能範圍內。驗證時使用 `dsmm-verify` 技能（或由 CMO / 董事長手動填寫 verification JSON 後呼叫）。
