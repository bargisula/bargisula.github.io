#!/usr/bin/env python3
"""
fetch_market.py
每天 22:00 UTC（台灣 06:00）由 GitHub Actions 執行
抓取道瓊、那斯達克100、S&P 500 最新收盤資料
寫入 src/data/market.json（Astro build 時靜態燒入首頁）
"""

import json
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

try:
    import yfinance as yf
except ImportError:
    print("ERROR: yfinance not installed. Run: pip install yfinance")
    sys.exit(1)

INDICES = [
    {"symbol": "^DJI",  "name": "道瓊"},
    {"symbol": "^NDX",  "name": "那斯達克100"},
    {"symbol": "^GSPC", "name": "S&P 500"},
]

OUTPUT_PATH = Path(__file__).parent.parent / "src" / "data" / "market.json"


def fetch_index(symbol: str) -> dict | None:
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="5d", interval="1d")
        if hist.empty or len(hist) < 2:
            print(f"  WARN: no sufficient data for {symbol}")
            return None

        latest = hist.iloc[-1]
        prev   = hist.iloc[-2]
        close      = float(latest["Close"])
        prev_close = float(prev["Close"])
        change     = round(close - prev_close, 2)
        pct        = round((change / prev_close) * 100, 2)
        date_str   = hist.index[-1].strftime("%Y-%m-%d")

        return {
            "close":  round(close, 2),
            "change": change,
            "pct":    pct,
            "date":   date_str,
        }
    except Exception as e:
        print(f"  ERROR fetching {symbol}: {e}")
        return None


def main():
    print(f"[fetch_market] Starting at {datetime.now(timezone.utc).isoformat()}")

    results = []
    source_date = None

    for idx in INDICES:
        print(f"  Fetching {idx['symbol']} ({idx['name']}) ...")
        data = fetch_index(idx["symbol"])
        if data is None:
            print(f"  SKIP: {idx['symbol']}")
            # Keep previous value if exists
            continue

        if source_date is None:
            source_date = data["date"]

        results.append({
            "name":   idx["name"],
            "symbol": idx["symbol"],
            "close":  data["close"],
            "change": data["change"],
            "pct":    data["pct"],
        })
        print(f"    {idx['name']}: {data['close']:,.2f}  {data['change']:+.2f} ({data['pct']:+.2f}%)")

    if not results:
        print("ERROR: No data fetched. Keeping existing market.json.")
        sys.exit(0)

    # If partial fetch, fill missing from existing file
    if len(results) < len(INDICES) and OUTPUT_PATH.exists():
        existing = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
        existing_map = {i["symbol"]: i for i in existing.get("indices", [])}
        fetched_symbols = {r["symbol"] for r in results}
        for idx in INDICES:
            if idx["symbol"] not in fetched_symbols and idx["symbol"] in existing_map:
                results.append(existing_map[idx["symbol"]])
                print(f"  Kept previous data for {idx['symbol']}")
        # Restore original order
        order = [i["symbol"] for i in INDICES]
        results.sort(key=lambda x: order.index(x["symbol"]) if x["symbol"] in order else 99)

    # Taiwan date: UTC+8
    tw_now = datetime.now(timezone(timedelta(hours=8)))
    updated = tw_now.strftime("%Y-%m-%d")

    output = {
        "updated": updated,
        "indices": results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(output, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"[fetch_market] Written to {OUTPUT_PATH}")
    print(f"[fetch_market] Done. updated={updated}, source_date={source_date}")


if __name__ == "__main__":
    main()
