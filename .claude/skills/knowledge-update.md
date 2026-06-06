# knowledge-update：知識庫更新 Skill

**Group C 執行者**

**觸發時機：**
- jade-scan 掃描時命中 Group C 條件（自動）
- 董事長說「更新知識庫」或「更新 edges」（手動）
- ai-infra-researcher 在論點更新後判斷供應鏈關係改變（自動呼叫）

---

## Group C 觸發條件（任一）

| 條件 | 來源 | 門檻 |
|---|---|---|
| 超大雲端 capex 指引變化 | 電話會議 | 單季 QoQ 變化 >15% 或管理層措辭轉向 |
| 新競爭者出現 | 10-K Risk Factors | 出現原本 edges.json 不存在的公司名稱 |
| 供應商客戶關係描述變化 | 10-K / 電話會議 | 主要客戶或供應商變更 / 新 Design Win |
| edges.json 某條邊的 weight 估算明顯失準 | 財報數字 | 財報揭露數字與 estimated weight 偏差 >30% |

---

## 執行步驟

### Step 0：確認觸發來源

讀取觸發資訊（來自 jade-scan inbox 或人工指示）：
- 觸發公司（TICKER）
- 觸發條件類型（capex_change / new_competitor / relationship_change / weight_correction）
- 原始文字依據（來自電話會議、10-K、8-K）

### Step 1：讀取現有知識庫狀態

```bash
cat data/knowledge/edges.json
```

找出所有與觸發公司相關的邊（from 或 to 含觸發公司）。

### Step 2：評估變化類型與幅度

依觸發條件評估需要做的更新：

**小變化（自動更新，不升格晨會）：**
- 新增一條 edges.json 邊（新關係、新供應商）
- 修正某條邊的 weight（財報數字更新）
- 已有公司的 note 欄位補充說明

**大變化（自動更新 + 升格晨會）：**
- 刪除一條邊（關係斷裂、客戶流失）
- 反轉一條邊方向（買賣關係對調）
- 傳導鏈方向需要改變（DSMM 連鎖反應）
- 新競爭者進入且已有高 weight 邊被威脅

### Step 3：更新 edges.json

對需要新增的邊，追加到 `edges` 陣列：

```json
{
  "from": "TICKER_A",
  "to": "TICKER_B",
  "type": "supplies_to",
  "weight": 0.XX,
  "note": "說明來源事件",
  "estimated": true,
  "added_date": "YYYY-MM-DD",
  "trigger_source": "CIEN Q2 FY2026 電話會議 Q&A"
}
```

對需要修正的邊，更新 weight 和 note，補充：
```json
"weight_history": [
  {"date": "2026-06-06", "old_weight": 0.30, "new_weight": 0.40, "reason": "財報揭露比例更新"}
]
```

同時更新 `last_updated` 和 `changelog` 欄位。

### Step 4：判斷是否需要 flag CMO 更新 DSMM

若以下任一成立，在輸出中加入 `⚑ CMO：需重估 DSMM 傳導鏈`：
- Hyperscaler capex 指引下調 >15%（影響 AI_capex_cycle Regime 假設）
- AI 算力主要供應商關係斷裂（影響 INS-002 等 Insight 條件）
- 新競爭者搶佔 >20% 市場（可能改變供應鏈邊的 weight 分布）

### Step 5：回報摘要

**小變化：**
```
✅ 知識庫更新（小）：edges.json 新增 1 條邊 {FROM} → {TO}（{type}，weight={W}）
來源：{觸發公司} {文件名稱}
不需要晨會升格。
```

**大變化：**
```
⚠️ 知識庫更新（大）：{具體變化描述}
建議晨會議題：[更新內容對現有論點的影響]
{若有} ⚑ CMO：需重估 DSMM 傳導鏈
```

---

## 不做的事

- 不分析個股投資論點（交給 ai-infra-researcher）
- 不更新 insights.json（交給 earnings-analyst 的 Step 4）
- 不自己決定是否進場（交給晨會裁定）
- 不刪除 estimated: true 的邊（除非有財報數字反駁）

---

## 常用邊類型說明

| type | 含義 | 典型情境 |
|---|---|---|
| supplies_to | A 向 B 供貨 | 光模組供應商 → 資料中心 |
| manufactures_at | A 在 B 代工 | fabless → TSMC |
| competes_with | A 與 B 競爭 | COHR vs 其他光模組廠 |
| replaces | A 技術取代 B | CPO 取代插拔式光模組 |

`weight` 代表收入依賴程度（0-1），優先用財報揭露數字，無財報依據則標 `estimated: true`。
