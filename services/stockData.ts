import { fetchStockPrice } from "./alphaVantage";
import { fetchFinnhubQuote } from "./finnhub";

/* ---------------- CARD + TABLE ONLY ---------------- */
export async function fetchStockData(symbol: string) {
  try {
    const av = await fetchStockPrice(symbol);

    if (av.price) {
      return {
        price: av.price,
        ohlc: av.ohlc,
      };
    }

    throw new Error("Alpha Vantage failed");
  } catch {
    const fh = await fetchFinnhubQuote(symbol);

    return {
      price: fh.price,
      ohlc: fh.ohlc,
    };
  }
}
