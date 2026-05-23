# Xompass 知識庫

三層領域知識系統，讓每次分析從已知基準出發，而非從零開始。

## 架構

```
data/knowledge/
  mechanisms/    因果傳導鏈（能源→通膨、EM 傳染路徑等）
  structures/    產業結構與供應鏈地圖
  entities/      公司與機構知識（延伸 data/coverage/ 的 company bible 概念）
```

## 知識類型差異

| 層級 | 內容 | 更新頻率 | 主要消費者 |
|---|---|---|---|
| mechanisms | 因果機制、傳導鏈、歷史先例 | 事件驅動 | CEO、CMO |
| structures | 產業結構、供應鏈層次、競爭格局 | 每半年至一年 | industry-analyst、CMO |
| entities | 公司基本面、論點、歷史驚喜 | 每季財報 | earnings-analyst、ai-infra-researcher |

## 使用規範

- **讀取**：各 agent Step 0 讀取相關知識後再開始分析
- **更新**：每次會議若產生新機制知識，CEO 在寫會議紀錄後同步更新
- **驗證**：每個知識節點有 `last_validated` 欄位，過期知識需標記並重評
- **連結**：用 `related` 欄位跨層連結相關知識，不孤立存在

## 第一批入庫（2026-05-23）

- `mechanisms/energy-to-pce.md`：能源衝擊 → PCE 三波傳導鏈
- `mechanisms/em-contagion.md`：新興市場危機傳染路徑（27 國框架）
