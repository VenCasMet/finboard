const API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY;

export async function fetchTwelveDataChart(
  symbol: string,
  interval: "1day" | "1week" | "1month"
) {
  const outputSizeMap = {
    "1day": 60,     // ~3 months
    "1week": 52,    // 1 year
    "1month": 24,   // 2 years
  };

  const outputsize = outputSizeMap[interval];

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.values) {
    throw new Error("No chart data");
  }

  return json.values
    .reverse()
    .map((d: any) => ({
      date: d.datetime,
      open: Number(d.open),
      high: Number(d.high),
      low: Number(d.low),
      close: Number(d.close),
    }));
}
