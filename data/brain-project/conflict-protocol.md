# 衝突仲裁協議

*Brain Project Phase 1 文件*
*建立日期：2026-05-26*

---

## 核心原則

三層系統（Bible → Insight → Regime）發生矛盾時，修改順序固定：

```
1. 先更新 Regime（更新當前位置，不動世界觀）
2. 再查哪條 Insight 的假設斷了（局部更新）
3. 只有外生變數發生結構性跳躍，才動 Bible
```

**直覺：** 地圖錯了不一定要重畫地圖，先確認你站在哪裡。

---

## 判斷流程

### Step 1：新事件 vs 現有 Insight

新數據或新聞進來時，先對照 `insights.json` 的 `invalidation_signal` 欄位：

| 情況 | 處置 |
|---|---|
| 新事件觸發 `invalidation_signal` | 將 Insight status 改為 `invalidated`，記錄日期與觸發事件 |
| 新事件與 Insight 主張方向相同 | 升一次 tier 評分（L1 → L2 候選），不修改其他欄位 |
| 新事件部分衝突（前提假設動搖但未完全失效） | 降低 confidence，加 note，等第二次確認 |
| 新事件與 Insight 無關 | 忽略，不觸發仲裁 |

### Step 2：Insight 失效 → 是否影響 Regime

Insight 失效後，查看 `regime_dependency` 欄位：

- 若失效 Insight 的 `regime_dependency` 包含當前 Regime 名稱 → **觸發 Regime 複核**
- Regime 複核由 CMO 執行，判斷：
  - Regime 名稱不變，更新 `insight_signal` 欄位即可
  - Regime 名稱需更換 → 更新 `current.json` 全部欄位

### Step 3：多條 Insight 失效 → 是否影響 Bible

觸發 Bible 複核的條件（三者同時）：

1. 同一層（macro 或 industry）有 **2 條以上 L2 或 L3 Insight** 在同一週期內失效
2. 失效原因指向同一個**外生變數結構性跳躍**（例：地緣格局改變、技術突破）
3. CMO 或 CEO 確認「這不是 Regime 位置問題，是世界觀問題」

Bible 複核由 CEO + 董事長主導，不由 AI 自動執行。

---

## 晨會衝突驅動格式（Step -1）

每次晨會開始前，Secretary 執行以下比對：

```
1. 讀取昨夜 DNI 新聞
2. 對照 insights.json 所有 active Insight 的 invalidation_signal
3. 若有命中 → 輸出衝突提示

格式：
「昨夜 [事件名稱] 與 Insight [ID] 的前提假設 [具體假設] 出現偏差：
  預期方向：[Insight 預測]
  實際數字：[新數據]
  建議今日優先討論：是否觸發失效 OR 降低 confidence」
```

若無命中 → 輸出「昨夜無新事件觸發 Insight 衝突，推演基礎不變。」

---

## 修改紀錄規範

每次仲裁結果須記錄於 Insight 的 `audit_note` 欄位（若欄位不存在則新增）：

```json
"audit_note": "2026-06-01：PCE 3.1% 使 INS-001 前提弱化，confidence 從 0.65 調降至 0.50，待 FOMC 6/17 確認"
```

正式失效須另建 `data/insights/audit_log.json` 紀錄（Phase 4 建立）。

---

## 禁止事項

- **不得**因單一數據點就升級 Bible，Bible 是世界觀，不是當週新聞的反應
- **不得**刪除失效的 Insight，應標記 `status: invalidated` 並保留，失效本身是學習素材
- **不得**在未觸發仲裁流程的情況下手動修改 confidence，所有 confidence 修改須有事件依據
