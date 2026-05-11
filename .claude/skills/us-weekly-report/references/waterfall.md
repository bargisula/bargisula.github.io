# 產業瀑布地圖（Supply Chain Waterfall Maps）

> 每個地圖的閱讀方式：
> - **第一層**：市場最先反應，追高風險高，週報重點在「已反應多少」
> - **第二層**：需求傳遞滯後 1–2 季，是最佳切入時機帶
> - **第三層**：設備/材料/替代，週期最長、漲幅可能最大，但需要更長耐心
> - **輸家**：被替代、被排擠、被轉移的那些

---

## 一、AI 記憶體：HBM 主線

```
觸發：AI 訓練/推理對記憶體頻寬需求暴增
    │
    ▼ 第一層（直接）
    SK Hynix（HBM3E 龍頭，供 NVDA）
    Micron / MU（HBM3E 追趕，已進入 NVDA 供應鏈）
    Samsung（HBM 良率問題，暫時落後）
    │
    ▼ 第二層（封裝 + 標準 DRAM 拉升）
    TSMC CoWoS 先進封裝（HBM+GPU 整合必經）
    DDR5 伺服器 DRAM（AI 伺服器整體記憶體用量提升）
    記憶體模組廠（Kingston、Crucial 上游）
    │
    ▼ 第三層（設備 + 材料 + 儲存替代）
    HBM 堆疊設備：東京電子（TEL）、Applied Materials（AMAT）
    TSV（Through Silicon Via）材料：信越化學、Sumco
    封裝基板：Unimicron（欣興）、南亞電路板
    [替代效應] NAND / SSD：若 DRAM 頻寬貴，推動儲存層優化需求
    │
    ▼ 輸家
    GDDR6 遊戲顯存（資源向 HBM 集中）
    傳統 DDR4 低端 DRAM（需求排擠）
```

**關鍵數字追蹤：** HBM 佔 DRAM 總產值比例、TSMC CoWoS 產能利用率、Micron HBM 良率指引

---

## 二、AI 算力基礎設施

```
觸發：雲端廠商（AWS/Azure/GCP）資本支出擴張
    │
    ▼ 第一層（直接）
    NVDA（GPU 龍頭）
    AMD（MI 系列替代）
    INTC（Gaudi AI 加速器，市佔小但有政策支持）
    │
    ▼ 第二層（伺服器 + 網路 + 電力）
    SMCI（SuperMicro，AI 伺服器整機）
    AVGO（AI ASIC 定製晶片、網路交換器）
    Marvell（DPU、網路晶片）
    Dell / HPE（傳統伺服器廠轉型 AI 伺服器）
    電力：Eaton、Vertiv（資料中心電源管理）
    │
    ▼ 第三層（散熱 + 電網 + 廠房）
    液冷散熱：Vertiv、Modine、CoolIT
    電網基礎建設：Quanta Services、MYR Group
    UPS 不斷電：Eaton、Schneider Electric
    銅纜 / 光纖：Amphenol、Belden
    [替代效應] 空冷散熱（逐漸被液冷取代）
    │
    ▼ 輸家
    傳統 x86 伺服器廠（若轉型慢）
    空冷散熱供應商
```

---

## 三、AI 晶片：製造端

```
觸發：NVDA Blackwell / AMD MI350 訂單大增
    │
    ▼ 第一層（直接）
    TSMC（唯一能量產 3nm/2nm 的代工廠）
    ASML（EUV 光刻機，TSMC 先進製程必需）
    │
    ▼ 第二層（製程材料 + 前段設備）
    AMAT（化學氣相沉積、蝕刻設備）
    Lam Research（蝕刻設備龍頭）
    KLA（量測與檢測設備）
    光阻材料：JSR、信越化學、Merck KGaA
    特殊氣體：Air Products、Linde
    │
    ▼ 第三層（矽晶圓 + 封測）
    矽晶圓：Sumco、Shin-Etsu
    先進封裝封測：ASE（日月光）、Amkor
    PCB 載板：欣興、景碩
    │
    ▼ 輸家
    成熟製程代工廠（需求向先進製程集中）
    GDDR6 記憶體（算力擴張優先 HBM）
```

---

## 四、美中晶片戰鬆綁

```
觸發：出口管制放寬、對中科技管制談判進展
    │
    ▼ 第一層（直接受益）
    QCOM（中國手機晶片收入佔 60%+）
    NVDA（重返部分中國市場）
    AMD（中國資料中心客戶解凍）
    │
    ▼ 第二層（中國本地需求復甦）
    TSM（中國客戶訂單回流）
    AVGO（中國 AI ASIC 合作）
    Apple 供應鏈（臺灣、越南製造受益）
    │
    ▼ 第三層（中國科技基礎設施）
    中國伺服器廠商採購（間接拉動美系零組件）
    工業自動化晶片（MCU、FPGA 需求恢復）
    │
    ▼ 輸家
    中國本土晶片廠（華為海思、中芯，競爭環境恢復壓力）
    美國製造回流敘事（若鬆綁，本土 Fab 投資邏輯弱化）
```

---

## 五、電動車：電池主線

```
觸發：電動車銷量數據超預期 / 電池成本突破
    │
    ▼ 第一層（直接）
    TSLA（電動車整車龍頭）
    BYD（中國龍頭，美股透過 ADR 或 ETF）
    │
    ▼ 第二層（電池 + 充電）
    寧德時代（CATL，電池龍頭，非美股但影響供應鏈）
    ALB（Albemarle，鋰礦龍頭）
    Livent / Arcadium（鋰化學品）
    CHPT（ChargePoint，充電網路）
    BLNK（Blink，充電設備）
    │
    ▼ 第三層（原材料 + 車用晶片）
    鋰/鈷：SQM、Piedmont Lithium
    車用晶片：NXP、Infineon、ON Semiconductor
    功率半導體：Wolfspeed（SiC，碳化矽）
    銅線束：Aptiv、Lear
    │
    ▼ 輸家
    傳統燃油車零組件廠（需求長期萎縮）
    加油站相關
```

---

## 六、功率半導體：能源轉型

```
觸發：資料中心電力需求、電動車、再生能源擴張
    │
    ▼ 第一層（直接）
    Wolfspeed（碳化矽 SiC 龍頭）
    ON Semiconductor（車用 / 工業 MOSFET）
    Infineon（歐洲功率半導體龍頭）
    │
    ▼ 第二層（應用端）
    電動車逆變器：需要 SiC 功率模組
    太陽能逆變器：SolarEdge、Enphase（下游）
    資料中心 UPS / 電源：Eaton、Vertiv
    │
    ▼ 第三層（SiC 材料 + 製造）
    SiC 基板材料：Wolfspeed 本身也做
    SiC 晶圓廠設備：II-VI（Coherent）
    │
    ▼ 輸家
    傳統矽基 IGBT（被 SiC 逐漸替代）
```

---

## 七、生技製藥：GLP-1 主線

```
觸發：減重藥（GLP-1）市場需求爆發
    │
    ▼ 第一層（直接）
    Novo Nordisk（Wegovy/Ozempic）
    Eli Lilly（Mounjaro/Zepbound）
    │
    ▼ 第二層（CDMO + 設備）
    CDMO（委託製造）：Lonza、Samsung Biologics
    注射設備：BD（Becton Dickinson）、West Pharmaceutical
    藥用輔料：Catalent（已被 Novo 收購）
    │
    ▼ 第三層（下游治療 + 診斷）
    心臟病、糖尿病治療需求下降 → 相關器材廠承壓
    減肥輔助食品、健身設備（若減重藥普及影響消費行為）
    │
    ▼ 輸家
    傳統減肥手術器材（如 Intuitive Surgical GLP-1 潛在衝擊）
    糖尿病設備廠（DexCom、Abbott 的 CGM 長期潛在衝擊）
    食品飲料（若消費者食慾下降影響卡路里攝入）
```

---

## 八、國防：無人機與電子戰

```
觸發：地緣衝突、國防預算擴張
    │
    ▼ 第一層（直接）
    LMT（Lockheed Martin）、RTX（Raytheon）
    LDOS（Leidos，政府 IT 與情報）
    NOC（Northrop，B-21 轟炸機）
    │
    ▼ 第二層（無人機 + 衛星通訊）
    AeroVironment（小型無人機）
    Kratos（靶機、無人戰術系統）
    Iridium / ViaSat（戰場通訊衛星）
    │
    ▼ 第三層（電子戰 + 網路安全）
    電子戰系統：L3Harris
    軍用網路安全：Booz Allen Hamilton（BAH）
    關鍵礦物（鈦、稀土）：MP Materials
    │
    ▼ 輸家
    預算削減時的傳統採購項目（若政策轉向）
```

---

## 瀑布分析的反向問題清單

分析任何主題時，用以下問題確認深度到位：

**往下問：**
- 「這個需求，原料/零組件從哪裡來？」
- 「這個零組件，誰的設備在做？」
- 「這台設備，材料/化學品從哪裡來？」

**往旁邊問（替代效應）：**
- 「如果這層貴了/缺了，客戶會轉用什麼？」
- 「這個主題，哪個技術/產品是它的替代品？替代品廠商怎麼樣？」

**往反方向問（輸家）：**
- 「誰的訂單因為這個主題而流失？」
- 「誰在這個主題之前是主流，現在被替代？」
- 「這個成本上升，誰的毛利率會最先被壓縮？」

---

*更新原則：當市場出現新的供應鏈結構（新技術/新政策），在此文件新增對應瀑布地圖。*
