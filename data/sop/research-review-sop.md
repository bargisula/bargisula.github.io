# 研究報告高管檢視 SOP

版本：1.0
建立日期：2026-06-19
負責人：CEO

---

## 一、目的

防止研究報告在方向錯誤（Regime 不符、Kill Switch 已觸發、發布格式錯誤）的情況下生成，
避免浪費分析資源，並確保所有對外發布的論點均經過高管層審核。

---

## 二、適用範圍

以下任一情況觸發本 SOP：

- `senior-analyst` 被呼叫（含 CEO 調度與董事長直接呼叫）
- 新個股首次建立 position 檔（`data/positions/[TICKER].md`）
- 既有 position 檔的論點裁定從「維持」變更為「弱化」或「強化」

**不適用：**
- `junior-analyst` 單季抓取（只存 JSON，不輸出論點裁定）
- `valuation-analyst` 單次估值計算（無論點方向判斷）

---

## 三、高管分工

| 角色 | 檢視內容 | 輸出結論 |
|---|---|---|
| CEO | 標的是否與當前 Regime 方向一致；是否有已知 Kill Switch 風險 | 裁示「可執行」或「暫停，原因 X」 |
| CMO | 對照 `data/regime/current.json`，確認宏觀環境是否支持標的論點方向 | 「Regime 相符」或「Regime 逆風，具體風險 X」 |
| CIO | 確認報告完成後的發布格式與路徑 | 確認發布路徑與格式規範 |

**注意（CIO 職責說明）：**
`data/research/` 是內部存檔，不會出現在網頁。
若需對外發布，報告須轉成 MDX 格式，存入 `src/content/notes/投資/`，
frontmatter 必須符合 CLAUDE.md 規範，由 CIO 負責執行或確認此轉換。

---

## 四、檢視流程

```
senior-analyst 被呼叫
        ↓
Step -1：CEO 啟動高管檢視
        ↓
 ┌─────────────────────────────────┐
 │ CEO  → 確認 Regime 符合度 + Kill Switch
 │ CMO  → 讀 data/regime/current.json 回報
 │ CIO  → 確認發布路徑
 └─────────────────────────────────┘
        ↓
CEO 裁示
  ├── 可執行 → senior-analyst 繼續 Step 0
  └── 暫停   → 回報暫停原因，等董事長指示
```

### 4-1 CEO 檢視清單

1. 讀取 `data/regime/current.json` → 確認當前 Regime 標籤（Inflationary Boom / Deflation 等）
2. 讀取 `data/positions/[TICKER].md`（若存在）→ 確認 Kill Switch 條件（K1–K4）是否已觸發
3. 判斷本次研究的「目的」：是首次建倉研究、定期論點驗證、還是危機追蹤？

### 4-2 CMO 檢視清單

1. 讀取 `data/regime/current.json` 的 `regime` 欄位與 `macro_headwinds`
2. 對照標的所在產業的 Regime 敏感度（參考 senior-analyst Step 3.5 表格）
3. 輸出：「支持 / 中性 / 逆風」三選一，並說明具體原因（一句話）

### 4-3 CIO 檢視清單

1. 確認此次研究完成後是否需要對外發布
2. 若需發布：確認 MDX 存放路徑、category/subcategory/topic 設定
3. 若只需內部存檔：確認寫入 `data/research/` 即可，無需轉換

### 4-4 放行條件

CEO 裁示「可執行」的條件（三項須全部滿足）：

- [ ] Regime 與標的論點方向無明顯衝突，或 CMO 確認逆風已被論點設定預期
- [ ] 無已知 Kill Switch 觸發訊號
- [ ] CIO 已確認發布路徑（或明確標注此次僅內部存檔）

---

## 五、暫停條件

下列任一情況，CEO 裁示「暫停」：

| 情況 | 處理方式 |
|---|---|
| Kill Switch 已觸發（如 K2：客戶集中度 >60% 且客戶公開縮減採購） | 暫停研究，優先呼叫 PMC 評估退場 |
| Regime 與論點方向嚴重衝突（如 Deflationary Bust 中做多週期股） | 要求 CMO 補充 DSMM 分析後再裁定 |
| CMO 回報宏觀逆風但無 DSMM run 佐證 | 依 DSMM 合規規則要求補跑，不直接放行 |

---

## 六、歷史記錄：未檢視執行案例

**日期：** 2026-06-19

**標的：** GOOG、GLW、AVGO

**狀況說明：**

上述三檔在本 SOP 建立之前即已執行 senior-analyst 分析，屬於三層研究架構（junior / senior / valuation）建立初期的測試性執行，未經高管檢視流程。

**影響評估：**

- AVGO 已在覆蓋清單（`data/coverage/ai-chips/AVGO.json`），理應由 `earnings-analyst` 執行，而非 `senior-analyst`。本次執行屬流程尚未收斂時的例外。
- GOOG、GLW 非覆蓋清單標的，由 `senior-analyst` 執行合規，但缺少 Regime 相符確認。

**後續行動：**

- [ ] 補跑 GOOG 高管檢視（CEO + CMO 確認論點方向與 Regime 符合度）
- [ ] 補跑 GLW 高管檢視（同上）
- [ ] AVGO 本次報告標注「測試執行，未完整比對 earnings-analyst 論點框架」
- [ ] 下次 AVGO 分析改回 `earnings-analyst` 執行路徑

---

## 七、版本紀錄

| 版本 | 日期 | 變更說明 |
|---|---|---|
| 1.0 | 2026-06-19 | 初版建立，含高管分工、流程圖、放行條件、未檢視歷史記錄 |
