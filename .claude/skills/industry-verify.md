---
name: industry-verify
description: >
  產業分析預測驗證技能。驗證 industry-pipeline 的 VCP 預測是否成真，
  更新論點信心值，累積各維度推演準確率。
  呼叫方式：/industry-verify {run_id}
---

你是產業分析系統的**驗證者**。

論點的價值在於「可被現實推翻」。每個 VCP 到期後驗證，對了強化信心，錯了找出哪個維度的邏輯有缺陷。

---

## 呼叫方式

```
/industry-verify IND-20260606-OPT
```

---

## 執行步驟

### Step 0：讀取待驗證檔案

```bash
cat data/industry/verification/{run_id}-verify.json
cat data/industry/pipeline/{run_id}/06-summary.json
cat data/industry/pipeline/{run_id}/05-thesis.json
```

確認有 `verification_status: "pending"` 且 checkpoints 存在。

### Step 1：逐一查核每個 Checkpoint

對每個 checkpoint，依 `check_source` 欄位查詢實際數值：

**查詢方式：**
- 財報數據 → WebSearch「{公司} {季度} earnings {指標}」
- 法說引用 → WebSearch「{公司} earnings call {季度} transcript」
- 市場數據 → Yahoo Finance / Bloomberg

**判斷 verdict：**

| 情況 | verdict | score |
|---|---|---|
| 預測正確且在閾值範圍內 | CONFIRMED | 1.0 |
| 方向正確但幅度偏離（差距 > 50%） | PARTIAL | 0.5 |
| 預測錯誤 | WRONG | 0.0 |
| 公司被收購/退市/事件無效 | INVALIDATED | null |
| check_date 尚未到 | 跳過 | null |

**注意：** 若財報尚未發布（check_date 未到），標記 `status: "not_due"`，不填 verdict。

### Step 2：計算整體分數

```
overall_score = sum(score) / count(非 null score)
```

分級：
- ≥ 0.80：論點邏輯扎實
- 0.50-0.79：部分成立，需確認哪個維度偏差
- < 0.50：論點有結構性問題，考慮重跑流水線

### Step 3：更新論點信心值

讀取 `data/industry/pipeline/{run_id}/05-thesis.json`。

對每個已驗證 VCP，依其 `dimension` 更新 `logic_tree` 中對應節點的 confidence：

```
CONFIRMED → node.confidence = node.confidence * 0.95 + 1.0 * 0.05
WRONG     → node.confidence = node.confidence * 0.90
PARTIAL   → 不動
```

若有 Kill Switch 的 `confirmed_by` 條件被實際數據觸發，在 `05-thesis.json` 中標記：
```json
{ "id": "KS-001", "triggered": true, "triggered_date": "YYYY-MM-DD" }
```

同時更新 `06-summary.json` 的 `overall_confidence`（取四個 logic_tree 節點的平均）。

### Step 4：DSMM 信號比對（若有 linked_dsmm_chains）

讀取 `data/industry/pipeline/{run_id}/00-trigger.json` 的 `linked_dsmm_chains`。

若有綁定 TC（例如 TC-004），對照 DSMM 的最新 VCP 裁定：
- 若 TC-004 相關 VCP 也是 CONFIRMED → 需求維度信心額外 +0.02
- 若 TC-004 WRONG → 需求維度信心 -0.05，並加入 note

寫入 `06-summary.json` 的 `dsmm_cross_signal` 欄位：
```json
{
  "tc": "TC-004",
  "dsmm_verdict": "CONFIRMED",
  "adjustment": "+0.02 on 需求維度"
}
```

### Step 5：寫回驗證檔並回報

更新 `data/industry/verification/{run_id}-verify.json`：
- 填入所有 actual、verdict、score
- 更新 `verification_status: "completed"`（若所有 not_due 以外的 VCP 均已裁定）或 `"partial"`（仍有未到期）
- 填入 `overall_score`

更新 `data/industry/pipeline/{run_id}/06-summary.json`（信心值）。
更新 `data/industry/pipeline/{run_id}/05-thesis.json`（logic_tree confidence、Kill Switch 觸發狀態）。

回報格式：

```
産業驗證完成：{run_id}
  産業：{industry}
  論點：{thesis_statement 前50字}...

  驗證結果：
  ├ VCP-001（需求）：CIEN book-to-bill > 1.2 → 實際「1.38」→ CONFIRMED ✅
  ├ VCP-002（供給）：COHR 毛利率 QoQ > 0% → 實際「+1.8%」→ CONFIRMED ✅
  ├ VCP-003（競爭）：CIEN 毛利率 QoQ > 0% → 尚未到期 ⏳
  └ VCP-004（技術）：CPO 非量產標配 → 尚未到期 ⏳

  此次分數：1.0（2/2 已到期，均確認）
  論點信心更新：0.82 → 0.84
  Kill Switch 狀態：均未觸發

  DSMM 交叉信號：TC-004 CONFIRMED，需求維度額外 +0.02
```

---

## 不做的事

- 不重新跑分析（只驗證，不重寫結論）
- 不因單次 WRONG 就建議放棄持倉（那是 PMC 的職責）
- 若公司法說未提及某指標，標記 `actual: "法說未提及"`, `verdict: "INVALIDATED"`
