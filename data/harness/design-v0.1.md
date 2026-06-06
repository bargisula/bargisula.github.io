# Xompass Harness 設計文件 v0.1

**建立：** 2026-06-06
**狀態：** 待下次議題開工
**決策來源：** 2026-06-06 晨會高管討論

---

## 核心裁定

**採 Option A：輸出端驗證。**

每份 agent 輸出在產生時就強制通過三個檢查，不通過退回重做：

```
✓ Source：結論從哪裡來（URL / 申報文件 / agent 名稱）
✓ Timestamp：有效期到什麼時候
✓ Invalidation：若 X 則失效（至少一條條件句）
```

---

## 五模組現況與優先序

| 模組 | 現況 | 優先序 | 說明 |
|---|---|---|---|
| Verification | 40% | **P0** | 最大系統性風險——產出高外觀低品質而不自知 |
| Memory 邊界 | 60% | P1 | 需加入口規則：「這條消失下游結論會變嗎？」 |
| Feedback | 20% | P2 | position 檔加 checkpoints，PMC 每季比對 |
| Context 自動載入 | 80% | P3 | 補 DSMM 骨架 + Regime + 持倉清單自動載入 |
| Workflow | 70% | P4 | jade-scan 已上線，持續完善 |

---

## 高管共識（三條）

1. **每個輸出都必須有失效條件**——沒有「若 X 則失效」的結論是意見，不是論點
2. **Memory 是條件觸發的，不是累積的**——進 Memory 前問：這條消失下游結論會變嗎？
3. **Verification 比 Feedback 更危險**——隱性腐爛比原地踏步更難察覺

---

## 要建的三件東西

**① `data/harness/output-verification-schema.json`**
定義不同輸出類型（Insight / jade-report / industry-analyst / Regime 更新）各自的最低要求欄位。

**② 各 agent prompt 加 Verification Step**
影響範圍：industry-analyst、jade-report、CMO、ai-infra-researcher
方式：在 prompt 最後加強制自我檢核節，缺欄位補完才輸出。

**③ position 檔 + insights.json 加 checkpoints 欄位**
格式：
```json
"checkpoints": [
  {
    "condition": "若 AVGO 未在 Q3 財報前宣布加入 FUSION",
    "due_date": "2026-09-30",
    "result": null,
    "verdict": null
  }
]
```
PMC 每季讀此欄位，比對結果，寫回 `result` 和 `verdict`。

---

## CTO 提醒（下次開工前必讀）

> 「寧可手動篩選 5 條真正重要的訊號，也不要自動收集 50 條讓分析師淹沒。Harness 最脆弱的設計是：沒有重要性門檻的自動收集。」

Verification 加進去之前，先確認每個 agent 的輸出量是否合理——驗證一百條廢話不會讓系統更好。

---

## 下次開工的起點

1. 讀此文件
2. 建 `output-verification-schema.json`（30 分鐘）
3. 選一個 agent 先試行（建議從 jade-report 開始，輸出結構最清楚）
4. 跑一次端對端驗證確認機制運作
5. 再逐步推展到其他 agent
