# 實體知識層（Entities）

## 用途

存放公司與機構的累積知識，讓每次分析從已知基準出發。

## 與 data/coverage/ 的關係

- `data/coverage/ai-chips/`：ai-infra-researcher 維護，覆蓋 NVDA/AMD/QCOM/AVGO
- `data/knowledge/entities/`：本目錄擴展至其他公司與機構，格式與 company bible 對齊

## 建議格式（JSON）

```json
{
  "ticker": "TICKER",
  "company": "公司名稱",
  "last_updated": "YYYY-MM-DD",
  "business_model": "...",
  "competitive_position": "...",
  "key_metrics_history": {},
  "our_thesis": "...",
  "notable_surprises": [],
  "risk_factors": [],
  "related_knowledge": []
}
```

## 現有文件

（尚未建立，待下次個股深入討論後填入）

## 建議候選

- TSMC.json（台積電）
- GLW.json（Corning，已有追蹤論點）
- VRT.json、ETN.json（電力基礎設施，AI capex 鏈）
- Fed.json（聯準會，機構知識）
