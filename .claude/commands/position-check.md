# /position-check：新聞 vs 論點比對

用法：`/position-check [TICKER 或 sector 關鍵字]`

範例：`/position-check NVDA`、`/position-check tw-drone`

---

## 執行步驟

### Step 1：讀取 Position 檔

**AI 晶片四檔（NVDA / AMD / AVGO / QCOM）：**
```
data/coverage/ai-chips/[TICKER].json
```

**其他個股：**
```
data/positions/[TICKER].md
```

**產業論點：**
```
data/positions/sectors/[關鍵字].md
ls data/positions/sectors/  ← 若不確定檔名，先列出
```

若找不到任何 position 檔，回覆：「[TICKER] 尚無論點記錄，是否要建立初始論點？」

---

### Step 2：從 intel 快取掃描相關新聞

**掃描邏輯：**

1. 列出最近 7 天的 intel 檔：
```
ls data/intel/*.json
```

2. 依序讀取，用 title + summary 關鍵字過濾相關文章：

| 標的 | 搜尋關鍵字（不分大小寫） |
|---|---|
| NVDA | nvidia, nvda, blackwell, hopper, cuda, jensen, h100, h200, gb200 |
| AMD | amd, mi300, mi400, rdna, lisa su, instinct |
| AVGO | broadcom, avgo, vmware, hock tan, asic |
| QCOM | qualcomm, qcom, snapdragon, arm |
| 台灣無人機 | 無人機, drone, altius, 雷虎, 漢翔, blue uas, 經緯航太, uav |
| 台灣軍售 | 軍售, arms sale, taiwan defense, fms, 對台 |

3. 收集每筆符合的文章：`{date, source, title, summary, category}`

若 intel 快取無相關文章（關鍵字都沒中），才用 WebSearch 補充，**但有以下硬性限制：**

**WebSearch 限制規則（強制執行，不可繞過）：**
- 最多執行 **2 次** WebSearch
- 每次搜尋若無明確結果，**立即停止，不重試**
- 搜不到就在比對表填 `➖ 無新證據（搜尋未取得）`，繼續下一條件
- **禁止為了找到特定數字而反覆嘗試不同搜尋詞**
- 整個 position-check 流程總時間不應超過 3 分鐘

---

### Step 3：逐條條件比對

對每一個 condition，找對應的新聞證據，判斷：
- ✅ 成立：新聞支持此條件仍然為真
- ⚠️ 弱化：新聞顯示此條件受到挑戰，但未明確失效
- ❌ 失效：新聞明確顯示此條件不再成立
- ➖ 無新證據：近期無相關新聞，維持上次狀態

對每一個 kill_switch，判斷：
- 🔴 已觸發：新聞確認此事件發生
- 🟢 未觸發：新聞無跡象

---

### Step 4：輸出比對報告

格式：

```
## [TICKER] 論點比對｜[今日日期]

**論點版本：** v[N]（上次更新 [日期]）
**論點：** [thesis 一句話]

---

### 條件檢核

| ID | 條件 | 前次狀態 | 本次裁定 | 依據新聞 |
|---|---|---|---|---|
| C1 | [description] | ✅ | ✅ | [文章標題（來源，日期）] |
| C2 | [description] | ✅ | ⚠️ | [文章標題（來源，日期）] |
| C3 | [description] | ⚠️ | ⚠️ | [文章標題（來源，日期）] |

### Kill Switch 檢查

| ID | 條件 | 狀態 | 依據 |
|---|---|---|---|
| K1 | [description] | 🟢 未觸發 | 無相關新聞 |
| K2 | [description] | 🟢 未觸發 | — |

---

### 整體裁定

**論點狀態：** [完整成立 / 部分弱化 / 需更新 / 已失效]

**變化摘要：**
- [若有條件狀態改變，說明從 X → Y，原因是什麼新聞]

**建議動作：**
- [繼續持有邏輯 / 需要補充數據的項目 / 建議重新評估的條件]
```

---

### Step 5：更新 Position 檔

比對完成後，自動更新對應的 position 檔：

**JSON 格式（AI 晶片四檔）：**
- 更新每個 condition 的 `status` 和 `last_checked`
- 更新每個 kill_switch 的 `triggered` 和 `last_checked`
- 在 `thesis_history` 新增一筆（若有條件狀態變化）

**MD 格式（個股 / 產業）：**
- 更新表格中的「狀態」欄與「上次檢查」欄
- 在「## 檢核紀錄」區塊新增一筆（觸發原因、新事件、條件變化、裁定）

---

## 規則

- **不重新生成論點**：若所有條件仍成立，輸出「論點完整成立，無需更新」即可
- **只更新有變化的條件**：沒有新證據的條件維持原狀，不重寫
- **新聞優先級**：intel 快取 > WebSearch（先找快取，找不到才爬）
- **裁定必須有據**：每個 ⚠️ 或 ❌ 必須引用具體文章，不能靠感覺
- **WebSearch 硬上限：最多 2 次，搜不到就填 ➖ 繼續**，絕不重試
- **資料未就緒的處理**：若某條件等待的事件（如財報）剛發生不到 24 小時，搜不到數據屬正常，在備注欄填「資料尚未索引，建議 24 小時後再執行」，維持原狀態，不卡在搜尋
