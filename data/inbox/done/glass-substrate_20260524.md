# CODEX TASK：產業分析報告

## 任務資訊
- topic: 玻璃基板行業
- date: 2026-05-24
- output_path: data/outbox/glass-substrate_20260524.mdx
- mode: standard

---

## Step 1：讀取本地資料

依序讀取以下路徑，整理與 玻璃基板行業 相關的資訊：

1. `data/db/` — 掃描所有子目錄（macro/companies/news/raw），抽出與 玻璃基板行業 相關的檔案
2. `data/intel/` — 讀取最新 2 份新聞摘要 JSON，找出相關段落
3. `data/regime/current.json` — 取得目前宏觀 Regime（景氣座標）
4. `data/coverage/` — 若有相關 ticker 的 company bible，一併讀取

本地資料整理完畢後，條列出：
- 已確認的財務數字（來源 + 日期）
- 已確認的產業事實
- 尚未取得、需要網路補充的項目

---

## Step 2：網路搜尋補充

針對 Step 1 中「尚未取得」的項目，搜尋以下內容：

- 玻璃基板行業 最新產業動態（2025–2026）
- 主要公司最新季報數字（營收、毛利率、EPS）
- 主要分析師最新評等與目標價
- 近期重大新聞（法規、競爭者動態、技術突破）

**規則：財務數字必須來自搜尋結果，不使用訓練資料中的數字。**
數據優先順序：官方 IR / SEC 申報 > 財經媒體 > 分析師報告

---

## Step 3：依 MODE 撰寫報告

### MODE = standard（七模組框架）

**模組 1：公司 / 產業定位**
- 一句話說明「這是什麼」「規模」
- 為什麼「現在」值得分析（觸發點）
- 與競爭對手的差異表格

**模組 2：財務快照**
- 最新季度：營收、毛利率、EPS vs 預期
- 下季度指引
- 本益比、自由現金流
- 用 Callout type="data" 呈現

**模組 3：核心護城河**
- 技術壁壘、市占率、客戶黏性
- 量化：毛利率相對同業
- 用 Callout type="insight"

**模組 4：瓶頸→溢出**
- 現有技術 / 市場的瓶頸
- 溢出方向：誰受益、誰受壓
- 用 Callout type="warning" 框出瓶頸

**模組 5：台股連動（有連動才寫，無則省略）**
- 直接供應商：台股代號、供應比重、受益程度
- 用 Callout type="data"

**模組 6：催化劑與時程**
- 未來 3–6 個月具體催化劑
- 時間軸表格
- 用 Callout type="insight"

**模組 7：風險與輸家**
- 最多 3 個風險，每個含機制 + 量化影響
- 用 Callout type="warning"

---

## Step 4：輸出格式規範

**MDX 第一行（必填）：**
```
import Callout from '@components/Callout.astro';
```

**Frontmatter（standard mode）：**
```yaml
---
title: '[產業名]：[15字內核心論點]'
description: '[60字內，含定位、核心優勢、關鍵數字]'
category: '投資'
subcategory: '美股'
topic: '產業分析'
pubDate: '2026-05-24'
---
```

**Callout 可用 type（只有這五種）：**
- data：財務數據、比較表格
- insight：護城河、受益邏輯
- warning：風險、瓶頸、輸家
- quote：一句話核心洞見
- link：外部參考

**禁止事項：**
- 裸 $數字（改用中文「xxx億美元」或 \$xxx）
- 多層巢狀 Callout
- `<script>` 標籤
- topic 與 subcategory 同名

---

## Step 5：存檔

將完整 MDX 報告（含 frontmatter）存到：
`data/outbox/glass-substrate_20260524.mdx`

不要印到 stdout，直接寫檔。
寫完後回報：已存到 data/outbox/glass-substrate_20260524.mdx，字數約 XXX 字。
