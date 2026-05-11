---
name: us-weekly-report
description: >
  美股週報視覺版面撰寫框架。當使用者說「寫週報」「美股週報」「本週整理」時，
  自動搜尋數據、產出六節視覺化 MDX 週報，使用 WeeklyNewsletter.astro 元件，
  推上部落格。週報包含：美股總覽、台股總覽、個股公司介紹（quick-scan 精簡版）、
  產業焦點、總體經濟儀表板、下週行事曆。
user-invocable: false
---

# 美股週報 SKILL（視覺版）

## 執行流程

```
取得日期 → 搜尋各節數據 → 產出 MDX 草稿（對話中預覽）→ 等確認 → 寫檔 → git push
```

**草稿確認前不寫任何檔案。**

---

## 步驟 1：取得週期

- 週報日期 = 本週五日期（YYYY-MM-DD）
- 週報標題日期範圍：本週一 ~ 本週五（MM/DD–MM/DD）
- 若使用者在非週五執行，以「本週最後交易日」為準

---

## 步驟 2：搜尋各節數據

以下六項並行搜尋，取本週數據：

### 節 1：美股總覽
- S&P 500、Nasdaq、Dow Jones 本週漲跌幅（%）與收盤價
- 本週最具代表性新聞事件 2–3 條（財報超預期、政策、地緣）
- 每條新聞附：標題、一句重點說明、對市場的影響方向

### 節 2：台股總覽
- 加權指數週漲跌幅（%）與收盤點位
- 本週三大法人買超 / 賣超前 3 名標的（若可搜到）
- 台股重要新聞 1–2 條（科技股動態、外資動向）

### 節 3：個股公司介紹（每週 1–2 家）
- 選擇本週最具話題性的 1–2 支美股
- 每家搜尋：公司基本定位、本週觸發事件、最新財務數字
- 格式依「個股卡片格式」（見下方模板）
- **選股標準**：財報剛發布 > 重大企業新聞 > 本週漲跌最大異常股

### 節 4：產業焦點
- 本週最強的一個產業主題（搜尋本週科技/AI/半導體/能源新聞）
- 附：趨勢分析（現在發生什麼）+ 操作建議（如何應對）

### 節 5：總體經濟儀表板
- 美元指數（DXY）週漲跌
- 10Y 美債殖利率週變化
- 黃金現貨（USD/oz）週漲跌
- WTI 原油（USD/桶）週漲跌
- 本週重要總經數據（CPI / NFP / PMI 等，若有發布）

### 節 6：下週行事曆
- 下週重要財報：公司名 + 日期 + 市場關注點
- 下週重要總經數據：數據名 + 日期 + 預期 + 解讀方向
- 重要 Fed 發言 / FOMC 日期（若有）

---

## 步驟 3：產出 MDX 草稿

### frontmatter

```yaml
---
title: '美股週報 YYYY/MM/DD｜[本週最重要一句話，含關鍵數字]'
description: '[60字內，含三大指數漲跌、核心主題、個股亮點]'
category: '投資'
subcategory: '週報'
topic: '週報'
pubDate: 'YYYY-MM-DD'
---
```

### MDX 頂部 import（必填兩行）

```mdx
import WeeklyNewsletter from '../../../../components/WeeklyNewsletter.astro';
import Callout from '../../../../components/Callout.astro';
```

---

## MDX 視覺結構模板

以下為完整週報模板，依搜尋到的數據填入 `[佔位符]`：

````mdx
<WeeklyNewsletter>

<div class="wn-header">
  <div class="wn-header-title">📊 美股週報</div>
  <div class="wn-header-meta">
    [MM/DD]–[MM/DD] · [YYYY] 第 [N] 週<br/>
    S&P [漲跌符號][X.X%] · Nasdaq [漲跌符號][X.X%]
  </div>
</div>

<div class="wn-summary">
  <h2>本週摘要</h2>
  <ul>
    <li>[本週最重要事件，含方向性判斷]</li>
    <li>[第二重點，含數字]</li>
    <li>[第三重點，含數字或產業觀察]</li>
  </ul>
</div>

{/* ── 節 1：美股總覽 ── */}
<div class="wn-section">
  <div class="wn-section-header">🇺🇸 美股總覽</div>
  <div class="wn-section-body">

    <table class="wn-index-table">
      <thead>
        <tr><th>指數</th><th>收盤</th><th>週漲跌</th><th>週漲跌幅</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>S&P 500</td>
          <td>[收盤點位]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][點數]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X.X%]</td>
        </tr>
        <tr>
          <td>Nasdaq</td>
          <td>[收盤點位]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][點數]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X.X%]</td>
        </tr>
        <tr>
          <td>Dow Jones</td>
          <td>[收盤點位]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][點數]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X.X%]</td>
        </tr>
      </tbody>
    </table>

    <div class="wn-news">
      <div class="wn-news-title">[新聞標題 1]</div>
      <div class="wn-news-body">
        [一段說明，3–4句，含事件背景、數字、市場影響]
        <div class="wn-trend"><strong>市場解讀</strong>[趨勢分析，1–2句]</div>
      </div>
    </div>

    <div class="wn-news">
      <div class="wn-news-title">[新聞標題 2]</div>
      <div class="wn-news-body">
        [說明]
        <div class="wn-advice"><strong>操作參考</strong>[給投資人的一句話判斷]</div>
      </div>
    </div>

  </div>
</div>

{/* ── 節 2：台股總覽 ── */}
<div class="wn-section">
  <div class="wn-section-header">🇹🇼 台股總覽</div>
  <div class="wn-section-body">

    <table class="wn-index-table">
      <thead>
        <tr><th>指數</th><th>收盤</th><th>週漲跌幅</th><th>週均量</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>加權指數</td>
          <td>[點位]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X.X%]</td>
          <td>[成交量，如 2,800億]</td>
        </tr>
      </tbody>
    </table>

    <div class="wn-news">
      <div class="wn-news-title">[台股重要新聞]</div>
      <div class="wn-news-body">
        [說明，含法人動向、外資買賣超重點]
        <div class="wn-trend"><strong>台股觀察</strong>[下週值得注意的方向]</div>
      </div>
    </div>

  </div>
</div>

{/* ── 節 3：個股公司介紹 ── */}
<div class="wn-section">
  <div class="wn-section-header">🔍 個股介紹</div>
  <div class="wn-section-body">

    {/* 個股卡片 × 1–2 張 */}
    <div class="wn-stock">
      <div class="wn-stock-header">
        <span>[TICKER] [公司名]</span>
        <span class="wn-stock-verdict">[看多 / 觀察 / 看空]</span>
      </div>
      <div class="wn-stock-body">
        <div class="wn-stock-meta">
          <span>市值：[XXB]</span>
          <span>本週：[▲或▼][X.X%]</span>
          <span>觸發：[財報 / 新聞 / 異動]</span>
        </div>

        **公司定位**：[3句話說清楚這家公司做什麼、主要客戶是誰、跟競爭對手最大的不同。結尾一句：簡單說：＿＿＿]

        **本週觸發**：[事件說明，1–2句，說明為什麼值得看]

        <table class="wn-index-table">
          <thead>
            <tr><th>維度</th><th>評分</th><th>說明</th></tr>
          </thead>
          <tbody>
            <tr><td>財報質量</td><td>[✅/⚠️/❌]</td><td>[一句說明]</td></tr>
            <tr><td>核心論點</td><td>[✅/⚠️/❌]</td><td>[一句說明]</td></tr>
            <tr><td>估值</td><td>[✅/⚠️/❌]</td><td>[一句說明]</td></tr>
            <tr><td>短期時機</td><td>[✅/⚠️/❌]</td><td>[一句說明]</td></tr>
          </tbody>
        </table>

        **一句話：[明確立場，不寫「需要觀察」這種廢話]**
      </div>
    </div>

  </div>
</div>

{/* ── 節 4：產業焦點 ── */}
<div class="wn-section">
  <div class="wn-section-header">🔬 產業焦點</div>
  <div class="wn-section-body">

    <div class="wn-news">
      <div class="wn-news-title">[本週產業主題標題]</div>
      <div class="wn-news-body">
        [2–3段說明：這個產業主題本週發生了什麼、為什麼重要、長期方向]
        <div class="wn-trend">
          <strong>趨勢判斷</strong>[方向性判斷，含時間週期（短期/中期/長期）]
        </div>
        <div class="wn-advice">
          <strong>操作建議</strong>[投資人怎麼應對，具體一點，不要只說「持續關注」]
          <ul>
            <li>[具體行動 1，如：已有部位者可持有，目標 $XXX]</li>
            <li>[具體行動 2，如：尚未進場者等 [事件] 確認後再行動]</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</div>

{/* ── 節 5：總體經濟儀表板 ── */}
<div class="wn-section">
  <div class="wn-section-header">🌐 總體經濟儀表板</div>
  <div class="wn-section-body">

    <table class="wn-index-table">
      <thead>
        <tr><th>指標</th><th>現值</th><th>週變化</th><th>方向</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>美元指數 DXY</td>
          <td>[現值]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X.X]</td>
          <td>[美元走強/走弱對風險資產的意涵]</td>
        </tr>
        <tr>
          <td>10Y 美債殖利率</td>
          <td>[X.XX%]</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X bps]</td>
          <td>[升息預期升溫/降溫]</td>
        </tr>
        <tr>
          <td>黃金現貨</td>
          <td>$[XXXX]/oz</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X.X%]</td>
          <td>[避險需求 / 美元避風港]</td>
        </tr>
        <tr>
          <td>WTI 原油</td>
          <td>$[XX.X]/桶</td>
          <td class="[wn-up 或 wn-down]">[▲或▼][X.X%]</td>
          <td>[供需判斷]</td>
        </tr>
      </tbody>
    </table>

    {/* 若本週有重要總經數據發布，加一個 wn-risk 或 wn-trend 框 */}
    <div class="wn-trend">
      <strong>本週重要數據</strong>[數據名稱、公布值、vs 預期、對市場的影響]
    </div>

  </div>
</div>

{/* ── 節 6：下週行事曆 ── */}
<div class="wn-section">
  <div class="wn-section-header">📅 下週行事曆</div>
  <div class="wn-section-body">

    <table class="wn-calendar">
      <thead>
        <tr><th>日期</th><th>事件</th><th>重點關注</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>[週一 MM/DD]</td>
          <td>[財報 / 數據 / Fed 事件]</td>
          <td>[一句重點，如：EPS 預期 $X.XX，關注指引是否上調]</td>
        </tr>
        <tr>
          <td>[週二]</td>
          <td>[事件]</td>
          <td>[重點]</td>
        </tr>
        <tr>
          <td>[週三]</td>
          <td>[事件]</td>
          <td>[重點]</td>
        </tr>
        <tr>
          <td>[週四]</td>
          <td>[事件]</td>
          <td>[重點]</td>
        </tr>
        <tr>
          <td>[週五]</td>
          <td>[事件]</td>
          <td>[重點]</td>
        </tr>
      </tbody>
    </table>

    <div class="wn-risk">
      <strong>下週風險提示</strong>[下週最需要注意的 1–2 個尾部風險，一句一個]
    </div>

  </div>
</div>

<div class="wn-footer">
  本週報為資訊整理，不構成投資建議。數據截至 [YYYY/MM/DD] 收盤。<br/>
  如需個股深度分析，請參閱【快篩】或【產業分析】系列文章。
</div>

</WeeklyNewsletter>
````

---

## 個股卡片（節 3）撰寫規則

個股卡片是 quick-scan SKILL 的**精簡版**（Section 0 + 1 + 5），不含財務表格細項：

| quick-scan 節 | 週報個股卡片對應 |
|---|---|
| Section 0：公司是什麼 | **公司定位**（3句 + 一句帶走定位句）|
| Section 1：觸發事件 | **本週觸發**（1–2句，事件 + 為什麼值得看）|
| Section 2–4：財務/論點/指標 | **省略**（週報不做深度財務拆解）|
| Section 5：快篩結論表格 | **評分表**（4行：財報質量/核心論點/估值/短期時機）|

一句話結論**必須**給明確立場：
- ✅ 範例：「本季財報超預期，CPO 出貨時程提前，短線可追，目標 $85」
- ❌ 禁止：「需要持續觀察後市表現」

---

## 步驟 4：收到確認後寫檔

**路徑：**
```
C:\Users\alpha\my-blog\src\content\notes\投資\週報\週報-YYYY-MM-DD.mdx
```

若路徑不存在（資料夾），先建立：
```
src/content/notes/投資/週報/
```

若同日檔案已存在，告知使用者並詢問是否覆蓋。

---

## 步驟 5：git commit 並推上 GitHub

```bash
git checkout main
git pull origin main
git add src/content/notes/投資/週報/週報-YYYY-MM-DD.mdx
git commit -m "add 美股週報 YYYY-MM-DD"
git push origin main
```

完成後輸出：
```
✅ 已推上 GitHub
   週報-YYYY-MM-DD.mdx
```

---

## CSS 類別快速查表（WeeklyNewsletter.astro）

| class | 用途 |
|---|---|
| `wn-header` | 頂部藍色漸層 header |
| `wn-header-title` | 標題文字 |
| `wn-header-meta` | 右側日期/指數摘要 |
| `wn-summary` | 深藍摘要框（bullet list）|
| `wn-section` | 卡片容器（白底＋邊框）|
| `wn-section-header` | 卡片藍色標題列 |
| `wn-section-body` | 卡片內容區 |
| `wn-index-table` | 指數/儀表板表格 |
| `wn-up` | 漲（紅色，台灣慣例）|
| `wn-down` | 跌（綠色，台灣慣例）|
| `wn-news` | 新聞卡片容器 |
| `wn-news-title` | 新聞標題列（灰底藍字）|
| `wn-news-body` | 新聞內容區 |
| `wn-trend` | 藍色趨勢分析框 |
| `wn-advice` | 黃色操作建議框 |
| `wn-stock` | 個股卡片容器 |
| `wn-stock-header` | 個股綠色標題列 |
| `wn-stock-verdict` | 標題右側判斷標籤（看多/觀察/看空）|
| `wn-stock-body` | 個股內容區 |
| `wn-stock-meta` | 個股 meta tag 列（市值/漲跌/觸發）|
| `wn-calendar` | 行事曆表格 |
| `wn-risk` | 紅色風險提示框 |
| `wn-tag` | 行內藍色標籤 |
| `wn-footer` | 灰色底部免責聲明 |

---

## 草稿確認提示（每次產出草稿後附上）

```
---
📋 週報草稿已完成。

請確認：
- 輸入「確認」→ 寫檔並推上 GitHub
- 輸入「修改第[N]節：[修改內容]」→ 調整後重新預覽
- 輸入「換個股：[TICKER]」→ 重新選股並更新節 3
```

---

## 選股輪換建議（節 3 個股介紹）

避免每週都寫相同個股，建議輪換邏輯：
1. **財報週**（1–2月/4–5月/7–8月/10–11月）→ 優先本週財報個股
2. **非財報週** → 本週漲跌幅最大個股 或 有重大新聞個股
3. **主題週** → 配合節 4 產業焦點，選該產業代表個股

---

*框架設計：bargisula · 週報系統 v2.0（WeeklyNewsletter.astro 視覺版）*
