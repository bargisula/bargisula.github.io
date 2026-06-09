# /status：系統狀態掃描

**觸發關鍵詞：** `系統狀態`、`status`、`system`、`掃一下`、`健康檢查`、`系統怎樣`

**目的：** 一次輸出整個研究系統的當前狀態，不做任何分析，只報數字和燈號。

---

## 執行步驟

全部用 bash 讀本機檔案，不做 WebSearch，不呼叫任何 agent。

```bash
# 1. position 檔
ls -la data/positions/sectors/*.md

# 2. trigger-map
cat data/positions/trigger-map.json

# 3. 最新 signals
ls -t data/signals/*.json | head -1 | xargs cat

# 4. regime
cat data/regime/current.json

# 5. earnings
ls -t data/earnings/*.json 2>/dev/null | head -5

# 6. knowledge graph
cat data/knowledge/power-infra-nodes.json | python -c "import json,sys; d=json.load(sys.stdin); print(len(d.get('nodes',[])), 'nodes', len(d.get('edges',[])), 'edges')" 2>/dev/null || echo "無法讀取"

# 7. DSMM runs
ls data/dsmm/pipeline/ 2>/dev/null | tail -5 || echo "無 run"
```

---

## 輸出格式（固定，每次相同）

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥  系統狀態｜YYYY-MM-DD HH:MM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【論點覆蓋】
  板塊               Position  Trigger  上次更新   健康
  power_electronics    ✅        ✅      N 天前     🟢/🟡/🔴
  AI_infrastructure    ✅        ✅      N 天前     🟢/🟡/🔴
  optical_fiber        ❌        ✅      —          ℹ️ 無論點檔
  liquid_cooling       ❌        ✅      —          ℹ️ 無論點檔
  tw_drone             ✅        ✅      N 天前     🟢/🟡/🔴

  健康燈號規則：
    🟢 ≤ 14 天
    🟡 15–30 天（若有 ⚠️ 條件則加標）
    🔴 > 30 天

【投資機會信號】
  來源：data/signals/YYYY-MM-DD.json（N 天前）
  板塊               分數   狀態
  power_electronics   5/5   候選 🎯
  AI_infrastructure   4/5   候選 🎯
  optical_fiber       2/5   觀察 👁
  tw_drone            2/5   觀察 👁
  long_duration_growth  —   壓制 ⛔

  若 signals 檔 > 7 天：標注「⚠️ 信號檔過期，建議重跑」

【景氣座標】
  更新：YYYY-MM-DD（N 天前）
  象限：[Overheat / Recovery / Stagflation / Recession]
  趨勢：[方向]  信心：[high/medium/low]
  紅燈：[列出 🔴 的 active_faces，白話一句]

  若 > 7 天未更新：🟡 建議本週重跑 DSMM

【財報記錄】
  最近分析：[TICKER] [季度]（N 天前）
  [若有多筆，列最近 3 筆]
  若無：ℹ️ 尚無財報分析記錄

【知識圖譜】
  power-infra：N 節點 / N 條邊
  [其他圖譜若有]

【DSMM Runs】
  最近 run：[列最近 3 個 RUN-ID]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 需要行動的項目
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [若有 🔴 或過期 signals → 條列出來]
  [若無 → 「✅ 系統健康，無待辦」]
```

---

## 規則

- 只讀不寫，不修改任何檔案
- 不做任何分析或推論，只回報數字
- 執行時間 < 10 秒（全部本機讀取）
- 若某個檔案不存在，顯示「找不到」而非報錯
