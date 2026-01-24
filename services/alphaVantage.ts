import { OHLCPoint } from "@/types/widget";

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// simple in-memory cache (price only)
const priceCache: Record<string, string> = {};

/* --------------------------------------------------
   PRICE + OHLC (Card & Table widgets)
-------------------------------------------------- */
export async function fetchStockPrice(symbol: string) {
  const normalized = symbol.toUpperCase();

  // return cached price if exists
  if (priceCache[normalized]) {
    return {
      price: priceCache[normalized],
      cached: true,
      ohlc: null, // table widgets can still work without cache
    };
  }

  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${normalized}&apikey=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Network error");

  const data = await response.json();
  const quote = data?.["Global Quote"];

  const ohlc = {
    open: quote?.["02. open"],
    high: quote?.["03. high"],
    low: quote?.["04. low"],
    price: quote?.["05. price"],
  };

  if (!ohlc.price) {
    throw new Error("No price in response");
  }

  // cache only price (safe with rate limits)
  priceCache[normalized] = ohlc.price;

  return {
    price: ohlc.price,
    cached: false,
    ohlc,
  };
}

/* --------------------------------------------------
   TIME SERIES (Chart widget) — OHLC
-------------------------------------------------- */
export async function fetchTimeSeriesDaily(
  symbol: string
): Promise<OHLCPoint[]> {
  const normalized = symbol.toUpperCase();

  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${normalized}&apikey=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Network error");

  const data = await res.json();
  const series = data?.["Time Series (Daily)"];

  if (!series) {
    throw new Error("No time series data");
  }

  const points: OHLCPoint[] = Object.keys(series)
    .slice(0, 30) // last 30 days
    .map((date) => ({
      date,
      open: Number(series[date]["1. open"]),
      high: Number(series[date]["2. high"]),
      low: Number(series[date]["3. low"]),
      close: Number(series[date]["4. close"]),
    }))
    .reverse();

  return points;
}
