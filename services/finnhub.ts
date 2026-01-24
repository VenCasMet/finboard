const FINNHUB_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

/* ---------------- PRICE + OHLC ---------------- */
export async function fetchFinnhubQuote(symbol: string) {
  const res = await fetch(
    `${BASE_URL}/quote?symbol=${symbol.toUpperCase()}&token=${FINNHUB_KEY}`
  );

  if (!res.ok) throw new Error("Finnhub network error");

  const data = await res.json();

  // Finnhub response format
  // c = current, o = open, h = high, l = low
  if (!data.c) throw new Error("Finnhub no price");

  return {
    price: data.c.toString(),
    ohlc: {
      open: data.o.toString(),
      high: data.h.toString(),
      low: data.l.toString(),
      price: data.c.toString(),
    },
  };
}

/* ---------------- DAILY CANDLES (CHART) ---------------- */
export async function fetchFinnhubDaily(symbol: string) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 60 * 60 * 24 * 30; // last 30 days

  const res = await fetch(
    `${BASE_URL}/stock/candle?symbol=${symbol.toUpperCase()}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_KEY}`
  );

  if (!res.ok) throw new Error("Finnhub candle error");

  const data = await res.json();

  if (data.s !== "ok") throw new Error("Finnhub no candles");

  return data.t.map((t: number, i: number) => ({
    date: new Date(t * 1000).toLocaleDateString(),
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
  }));
}
