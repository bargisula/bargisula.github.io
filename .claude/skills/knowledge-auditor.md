# knowledge-auditor：知識庫稽核 Skill

**第三方驗證。針對 transmission-chain.json 和 industry-graph.json，
逐條檢查邏輯一致性、條件具體性、來源完整性，輸出修正指令。**

**觸發時機：**
- 董事長說「稽核知識庫」（手動，做一次即可）
- 兩個 JSON 有 `audit_status: "pending"` 的條目（自動）

---

## 稽核範圍

| 目標文件 | 稽核對象 |
|---|---|
| `data/dsmm/transmission-chain.json` | 每條 chain（`audit_status: "pending"`） |
| `data/knowledge/industry-graph.json` | 每個 industry 節點（`audit_status: "pending"`） |

---

## 五條稽核規則

| 規則 | 檢查內容 | 不合格例子 |
|---|---|---|
| **邏輯一致性** | 傳導步驟方向不矛盾；供需狀態與條件一致 | step 1 說「利率下行」step 3 說「利率上行」 |
| **條件具體性** | trigger_condition / supply_demand_condition 含數字門檻 | 「市場情緒轉壞時」（無門檻） |
| **來源完整性** | 每條 chain / industry 至少一個 source_events | source_events 為空陣列 |
| **信心值有據** | confidence 對應有 evidence 支撐，非憑空填入 | confidence: 0.85 但 evidence 空白 |
| **失效條件存在** | expires_if 不可空白，不可是「永遠不失效」 | expires_if: "" 或完全缺失 |

---

## 執行步驟

### Step 1：載入待稽核條目

```bash
cat data/dsmm/transmission-chain.json
cat data/knowledge/industry-graph.json
```

收集所有 `audit_status: "pending"` 的條目。

### Step 2：逐條稽核

對每個條目，依五條規則逐一檢查，輸出稽核表：

```
【TC-001 NFP 超預期 → 利率上行】

邏輯一致性：✅ 傳導方向一致（勞動→貨幣→金融→商品）
條件具體性：✅ trigger_condition 含 "+50K" 門檻
來源完整性：✅ 有 1 條 evidence（2026-06-05 NFP +172K）
信心值有據：✅ confidence 0.82 對應 evidence
失效條件：  ✅ 有 2 條 expires_if

裁定：PASS
```

```
【TC-003 MBS 凸性對沖】

邏輯一致性：✅ 自我強化循環標記正確（↻）
條件具體性：⚠️ trigger_condition "10Y 殖利率單月上行 > 25bp" 合格
              但 threshold_note 說目前 8bp 未觸發，confidence 0.68 偏高
來源完整性：✅ 有 evidence
信心值有據：⚠️ 尚未真實觸發，confidence 應降至 0.55-0.60
失效條件：  ✅ 有 3 條

裁定：FLAG
修正指令：confidence 從 0.68 調降至 0.58（機制邏輯正確但尚未觸發，理論推演不等於實證）
```

### Step 3：產出稽核報告

格式：

```
知識庫稽核報告｜{日期}
稽核者：knowledge-auditor
-------------------------------

DSMM 傳導鏈（{N} 條）
  PASS：TC-001、TC-002、TC-004
  FLAG：TC-003

產業知識圖譜（{N} 個）
  PASS：optical_transceiver、optical_fiber
  FLAG：ai_custom_asic（原因：{說明}）
  REJECT：無

-------------------------------
修正指令清單：
[FLAG-001] TC-003 confidence: 0.68 → 0.58
  原因：機制尚未真實觸發，理論推演不等於實證
  執行者：dsmm-analyst

[FLAG-002] ai_custom_asic supply_demand_condition 缺少數字門檻
  原因：「ASIC 佔比持續上升」無具體門檻
  修正：補入「IF ASIC 訓練佔比 QoQ 增加 > 5%」
  執行者：industry-knowledge
```

### Step 4：寫入 audit-log.json

每個稽核條目追加一筆記錄：

```json
{
  "audit_id": "AUDIT-001",
  "date": "2026-06-06",
  "target_id": "TC-003",
  "target_type": "transmission_chain",
  "rules_checked": {
    "logic": "pass",
    "condition": "pass",
    "source": "pass",
    "confidence": "flag",
    "expires": "pass"
  },
  "verdict": "flag",
  "corrections": [
    {
      "field": "confidence",
      "old_value": 0.68,
      "new_value": 0.58,
      "reason": "機制尚未觸發，理論推演不等於實證"
    }
  ],
  "correction_applied": false,
  "correction_executor": "dsmm-analyst"
}
```

### Step 5：通知執行者修正

輸出修正指令給對應 agent：
- FLAG 條目 → 交由 dsmm-analyst 或 industry-knowledge 按指令修正
- REJECT 條目（嚴重錯誤）→ 整條刪除重建

修正完成後，對應條目的 `audit_status` 改為 `"audited"`，`audit-log.json` 的 `correction_applied` 改為 `true`。

---

## 稽核不做的事
- 不查核數字是否真實（LLM 無法核實現實數據）
- 不做投資判斷
- 不修改 Regime（那是 CMO 權責）
- 只做一次完整稽核，不循環執行
