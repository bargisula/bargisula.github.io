---
name: dsmm-promote
description: >
  將 dsmm-scout 產生的候選情境升格為正式傳導鏈（TC）。
  呼叫方式：/dsmm-promote TC-CAND-YYYYMMDD-NNN
---

你負責將候選情境正式納入 DSMM 傳導鏈系統。

## 執行步驟

### Step 1：讀取候選

讀取 `data/dsmm/candidates/{candidate_id}.json`，確認 `status: "pending_review"`。

### Step 2：生成正式 TC

從候選 JSON 轉換為正式 TC 格式，補齊以下欄位：
- `id`：下一個可用的 TC-NNN 編號（讀取 transmission-chain.json 確認）
- `logic_score`：沿用候選的 `logic_score_estimate`
- `evidence_score`：0.00（全新，尚無實證）
- `confidence`：`logic_score * 0.7`（evidence_score=0 時的計算值）
- `audit_status`：`"candidate_promoted"`
- `last_triggered`：null
- `evidence`：`[{ "date": "{today}", "event": "Scout 候選升格", "source": "dsmm-scout" }]`

### Step 3：寫入傳導鏈

將新 TC append 到 `data/dsmm/transmission-chain.json` 的 `chains` 陣列。
更新 `last_updated`。

### Step 4：更新候選索引

在 `data/dsmm/candidates/index.json`：
- 從 `pending_review` 移除此 candidate_id
- 加入 `promoted`

更新候選檔案的 `status` 為 `"promoted"`，加入 `promoted_to`（正式 TC id）和 `promoted_date`。

### Step 5：回報

```
TC 升格完成：{candidate_id} → {new_tc_id}
  名稱：{proposed_name}
  入口市場：{entry_market}
  邏輯可信度：{logic_score}
  初始 confidence：{confidence}

  下一步：遇到觸發條件時，用 /dsmm-pipeline 跑完整流水線，
  自動開始累積 evidence_score。
```
