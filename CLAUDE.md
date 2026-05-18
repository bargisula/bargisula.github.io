# bargisula.github.io

## 內容分類

### Notes（`src/content/notes/`）
新增分類需同步更新 `src/content.config.ts` 的 enum：

| 分類 | 說明 |
|---|---|
| 經濟 | 總體經濟、央行政策、宏觀數據 |
| 投資 | 美股、台股、產業分析、個股研究 |
| 軍事 | 台海安全、區域衝突、武器系統 |
| 小書 | 閱讀筆記、書摘 |
| 勞動 | 勞動市場、就業、薪資數據 |
| 雜記 | 其他不易分類的思考 |
| 國際情勢 | 地緣政治、外交、國際秩序 |

### Blog（`src/content/blog/`）
`投資 / 科技 / 生活 / 策略 / 其他`

---

## Frontmatter 規範

### Notes
```yaml
---
title: '【分類】標題'
description: '60字內摘要'
category: '經濟'           # 必填，只能用上表分類
subcategory: '美股'        # 選填
topic: '自動研究'          # 選填
series: '系列名稱'         # 選填
seriesOrder: 1             # 選填，搭配 series
pubDate: 'YYYY-MM-DD'     # 必填
updatedDate: 'YYYY-MM-DD' # 選填
---
```

### Blog
```yaml
---
title: '標題'
description: '摘要'
pubDate: 'YYYY-MM-DD'
category: '投資'
heroImage: './image.png'  # 選填
---
```

---

## 日期規範

- 台灣時間（UTC+8），所有 `pubDate` 用台灣當日日期
- 美股數據：台灣時間 06:00 後 = 前一美股交易日
- 台股數據：台灣時間 13:35 後 = 當日收盤

美股休市：元旦、MLK Day（1月第3週一）、總統日（2月第3週一）、陣亡將士紀念日（5月最後週一）、六月節（6/19）、獨立日（7/4）、勞動節（9月第1週一）、感恩節（11月第4週四）、聖誕節（12/25）

---

## MDX 禁止事項

- 裸 `$數字`（改用中文或 `\$數字`，Astro 會把 `$...$` 當 LaTeX）
- 多層巢狀 Callout
- `<script>` 標籤

Callout 可用類型：`data` / `insight` / `warning` / `quote` / `link`

---

## Git 推送規範

```bash
git add [指定檔案]    # 不用 -A
git commit -m "[type]: [描述]"
git push -u origin [branch]
```

Commit 類型：`post:` / `analysis:` / `fix:` / `system:`

推送前確認：frontmatter 必填欄位齊全、無裸 `$數字`、不覆蓋當日同名檔案
