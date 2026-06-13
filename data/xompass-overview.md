# Xompass 運作說明

**X（探索前沿）+ Compass（方向導航）**

Xompass 是一個以 AI 驅動的投資研究與決策系統，目標是把每日市場資訊轉化為可執行的投資裁示，並持續維護一個結構化的世界觀。

---

## 一、核心流程

```
新聞 / 數據
    ↓
晨會（每日）
    ↓
洞察（因果假說）→ 推導鏈（往前推 3-5 步）→ 裁示（行動動詞）
    ↓
紀錄存檔 → 下次會議追蹤
```

每次晨會由 CEO agent 主持，流程：
1. 複盤上次裁定
2. 比對現有 Insight 是否被新聞挑戰
3. 收集市場數字與新聞
4. 提煉洞察、推導鏈
5. 提出裁示，等待確認
6. 存入會議紀錄

---

## 二、知識架構（四層）

| 層級 | 是什麼 | 位置 | 壽命 |
|---|---|---|---|
| **框架** | 分析方法，告訴你怎麼想（DSMM 宏觀框架、Leopold 模型） | `.claude/commands/` | 永久，定期更新 |
| **Bible** | 已確認的事實，是分析的底稿（公司護城河、財報結構） | `data/coverage/` | 永久，財報後更新 |
| **Insight** | 待驗證的因果假說，每日監控是否失效 | `data/insights/insights.json` | 數週至數月 |
| **Watchlist** | 短期事件追蹤，有到期日 | `data/tracking/` | 事件結束即關閉 |

**升降規則：**
- 新事件觀察到 → 提出 Insight（假說）
- Insight 多次被事件驗證 → 升格為 Bible（事實）
- Insight 被事件推翻 → 標記失效
- 短期事件（某日數據、某換股） → Watchlist，不進 Insight

**Insight 上限 5 條**，超過則強制淘汰，避免每日掃描成為雜訊。

---

## 三、主要分析框架

### DSMM（動態序列總體模型）
宏觀衝擊的傳導分析框架。核心邏輯：
- 每個衝擊有「入口市場」（財政→商品市場；貨幣→貨幣市場；地緣→商品市場）
- 傳導有速度順序：金融市場 → 貨幣市場 → 商品市場 → 勞動市場 → 財政動態
- 路徑鎖定診斷：g-(r+ρ)→0 + 通膨預期升 > 產出升 → 貨幣政策失效

使用方式：呼叫 `/dsmm [衝擊描述]` 進行結構化分析。
完整內容：`src/content/notes/經濟/xompass-macro-framework.md`

### Leopold 模型
篩股框架。核心邏輯：先建立世界觀，找物理上確定但市場未定價的瓶頸，押解決瓶頸最快的標的。

---

## 四、AI 團隊分工

| Agent | 角色 | 主要職責 |
|---|---|---|
| CEO | 會議主席 | 主持晨會、知識層到智慧層的推演、調度其他 agent |
| CMO | 首席宏觀官 | Regime 判讀、景氣座標、DSMM 五傳導鏈 |
| DNI | 情報長 | 每日新聞抓取與分類（財經/科技/地緣/軍事） |
| Secretary | 秘書 | 行事曆、watchlist 追蹤 |
| ai-infra-researcher | AI 基礎設施研究員 | NVDA/AMD/AVGO/QCOM 四檔深度覆蓋，維護 Bible |
| industry-analyst | 產業分析師 | 產業深度報告 |
| earnings-analyst | 財報分析師 | 個股財報解析 |
| CTO | 技術長 | 6-18 個月技術轉折點，不做個股分析 |
| CIO | 投資長 | 整合輸出，推上 GitHub |

---

## 五、資料目錄索引

```
data/
├── meetings/           ← 每日晨會紀錄（最重要的決策歷史）
├── insights/           ← 當前世界觀（insights.json，≤5 條 active）
├── tracking/
│   ├── picks.json      ← 個股論點追蹤（週追蹤節點）
│   └── watchlist.json  ← 短期事件追蹤
├── coverage/
│   ├── ai-chips/       ← NVDA / AMD / AVGO / QCOM Bible
│   └── ai-infra-adjacent/ ← GLW 等延伸覆蓋
├── regime/
│   └── current.json    ← 當前宏觀 Regime（CMO 維護）
└── xompass-overview.md ← 本文件
```

---

## 六、顧問閱讀建議順序

1. `data/meetings/` 最新 3-5 份 → 了解近期決策脈絡
2. `data/insights/insights.json` → 了解當前世界觀假說
3. `data/tracking/picks.json` → 了解當前個股論點
4. `data/coverage/ai-chips/NVDA.json`（或其他標的）→ 了解 Bible 深度
5. `src/content/notes/經濟/xompass-macro-framework.md` → 了解宏觀分析邏輯

---

## 七、投資原則

- **論點先於部位**：進場前必須有明確的因果論點與失效條件
- **條件式裁示**：「若 PCE ≤3.2% 則加碼」，不做無條件判斷
- **錯誤分類**：timing 錯 / logic 錯 / external 黑天鵝 / entry_price 設錯，四種失敗模式分開記錄
- **可驗證性**：每次裁定必須有「下一個確認點」，讓下次會議可以回頭檢驗

---

*最後更新：2026-05-27*
