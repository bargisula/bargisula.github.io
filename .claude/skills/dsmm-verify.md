---
name: dsmm-verify
description: >
  DSMM 預測驗證技能。驗證 dsmm-pipeline 的預測是否成真，計算準確率，
  更新傳導鏈信心值，累積系統推演能力記錄。
  呼叫方式：/dsmm-verify {run_id}
  驗證後，若系統累計有 ≥5 個已驗證的 run，自動計算系統推演準確率（生成「智慧指標」）。
---

你是 DSMM 系統的**驗證者**。

流水線的價值不在輸出，而在**預測是否可被現實驗證**。
每次驗證都是系統向「推演能力」前進的一步：預測對了，confidence 上調；預測錯了，找出哪條鏈的邏輯有缺陷。

---

## 呼叫方式

```
/dsmm-verify RUN-20260606-1420
```

---

## 執行步驟

### Step 0：讀取待驗證檔案

```bash
cat data/dsmm/verification/{run_id}-verify.json
cat data/dsmm/pipeline/{run_id}/06-summary.json
```

確認 `verification_status: "pending"` 且有 checkpoints 存在。

### Step 1：逐一查核每個 Checkpoint

對每個 checkpoint，查找對應的實際數值：

**優先查詢順序：**
1. 用 WebSearch 搜尋對應的市場數據（Yahoo Finance、CME FedWatch、FRED）
2. 從 data/intel/ 的近期新聞（DNI 整理）讀取

**填寫 actual 欄位：**
- 若 `check_date` 已過 → 查詢歷史數值
- 若 `check_date` 尚未到 → 標記 `status: "not_due"`, `verdict: null`

**判斷 verdict：**
| 情況 | verdict | score |
|---|---|---|
| 預測方向正確 AND 幅度在估計範圍內 | CONFIRMED | 1.0 |
| 預測方向正確但幅度偏離（差距 > 50%） | PARTIAL | 0.5 |
| 預測方向正確但幅度遠超（> 2倍） | PARTIAL | 0.5 |
| 預測方向錯誤 | WRONG | 0.0 |
| 事件被外生因素中斷（例如 Fed 緊急降息） | INVALIDATED | null |

### Step 2：計算整體分數

```
overall_score = sum(score for score not null) / count(score not null)
```

若 `overall_score ≥ 0.80` → 此次流水線「高度準確」
若 `overall_score 0.50-0.79` → 「部分準確」
若 `overall_score < 0.50` → 「方向有誤，需檢查邏輯」

### Step 3：更新傳導鏈信心值

讀取 `data/dsmm/transmission-chain.json`（schema v2.0，有 `logic_score` + `evidence_score`）。

對每個有 `tc_reference` 的已驗證 checkpoint，更新對應 TC 的 `evidence_score`：

```
CONFIRMED → evidence_score = evidence_score * 0.9 + 1.0 * 0.1
WRONG     → evidence_score = evidence_score * 0.8
PARTIAL   → 不動
INVALIDATED → 不動
```

同步重算 `confidence`（展示用）：
```
confidence = logic_score * 0.7 + evidence_score * 0.3
```

更新 transmission-chain.json 中對應 chain 的 `evidence_score`、`confidence` 和 `evidence` 欄位（新增驗證事件記錄）。

### Step 3b：跨流水線信號輸出（C-2）

若此次有任何 TC-004 相關 VCP 被裁定（CONFIRMED 或 WRONG），寫入跨流水線信號：

```bash
# 寫入 data/dsmm/cross-signals.json
```

```json
{
  "last_updated": "YYYY-MM-DD",
  "signals": [
    {
      "source_run": "{run_id}",
      "tc": "TC-004",
      "vcp_id": "VCP-007",
      "verdict": "CONFIRMED",
      "signal_date": "YYYY-MM-DD",
      "adjustment_for_industry": {
        "dimension": "需求",
        "direction": "+0.02",
        "reason": "TC-004 Q3 hyperscaler capex CONFIRMED，強化光傳輸需求斜率"
      },
      "linked_industry_runs": ["IND-20260606-OPT"]
    }
  ]
}
```

若 `cross-signals.json` 已存在，**新增**到 `signals` 陣列，不覆蓋舊記錄。

`/industry-verify` 會自動讀取此檔，對 `linked_industry_runs` 內的產業論點套用 `adjustment`。

### Step 4：系統智慧指標（每 5 次驗證觸發一次）

```bash
ls data/dsmm/verification/ | grep -v template | wc -l
```

若已完成的驗證 run ≥ 5，計算系統推演能力：

```json
{
  "system_inference_score": {
    "calculated_at": "YYYY-MM-DD",
    "total_runs_verified": N,
    "total_checkpoints": M,
    "overall_accuracy": 0.XX,
    "by_market": {
      "金融市場": {"accuracy": 0.XX, "n": N},
      "貨幣市場": {"accuracy": 0.XX, "n": N},
      "商品市場": {"accuracy": 0.XX, "n": N},
      "勞動市場": {"accuracy": 0.XX, "n": N},
      "財政動態": {"accuracy": 0.XX, "n": N}
    },
    "by_tc_reference": {
      "TC-001": {"accuracy": 0.XX, "n": N},
      "TC-004": {"accuracy": 0.XX, "n": N}
    },
    "wisdom_verdict": "系統已可推演（accuracy ≥ 0.75）|需更多數據|邏輯需修正"
  }
}
```

存入 `data/dsmm/system-inference-score.json`，並回報結果。

### Step 5：更新驗證檔並回報

寫回 `data/dsmm/verification/{run_id}-verify.json`（填入所有 actual、verdict、score）。

更新 `verification_status: "completed"`。

回報格式：

```
DSMM 驗證完成：{run_id}
  事件：{event_title}
  驗證日：{today}

  驗證結果：
  ├ VCP-001（金融市場）：預測「10Y > 4.60%」→ 實際「4.67%」→ CONFIRMED ✅
  ├ VCP-002（貨幣市場）：預測「降息次數 < 1.5」→ 實際「1.0次」→ CONFIRMED ✅
  └ VCP-003（商品市場）：預測「capex 下修 > 3%」→ 尚未到期 ⏳

  此次分數：0.85（2/2 已到期，均確認）
  傳導鏈更新：TC-001 confidence 0.82 → 0.83

  系統累積：{N} 次驗證，推演準確率 {overall_accuracy}
  → 智慧狀態：{wisdom_verdict}
```

---

## 不做的事

- 不主動改變事件的 entry_market 或重寫 summary（只驗證，不重分析）
- 不因為單次錯誤就大幅調降 confidence（單次 WRONG 僅 -10%，需多次才顯著影響）
- 不驗證尚未到期的 checkpoint（標記 not_due，等待下次呼叫）
