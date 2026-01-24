"use client";

import { useEffect, useState } from "react";
import { Widget } from "@/types/widget";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { fetchStockData } from "@/services/stockData";
import { fetchTwelveDataChart } from "@/services/twelveData";

interface WidgetRendererProps {
  widget: Widget;
}

type Interval = "1day" | "1week" | "1month";
type ChartType = "line" | "candle";

/* --------------------------------------------
   🔒 IN-MEMORY CHART CACHE (VERY IMPORTANT)
-------------------------------------------- */
const chartCache: Record<string, any[]> = {};

export default function WidgetRenderer({ widget }: WidgetRendererProps) {
  /* ---------------- STATE ---------------- */
  const [price, setPrice] = useState<string | null>(null);
  const [ohlc, setOhlc] = useState<{
    open: string;
    high: string;
    low: string;
    price: string;
  } | null>(null);

  const [series, setSeries] = useState<
    {
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
    }[]
  >([]);

  const [cardLoading, setCardLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // Chart controls
  const [interval, setInterval] = useState<Interval>("1day");
  const [chartType, setChartType] = useState<ChartType>("line");

  /* --------------------------------------------------
     CARD DATA
  -------------------------------------------------- */
  useEffect(() => {
    if (widget.type !== "card") return;

    setCardLoading(true);

    fetchStockData(widget.symbol)
      .then((res) => {
        setPrice(res.price ?? null);
      })
      .catch(() => {
        setPrice(null);
      })
      .finally(() => setCardLoading(false));
  }, [widget.type, widget.symbol]);

  /* --------------------------------------------------
     TABLE DATA
  -------------------------------------------------- */
  useEffect(() => {
    if (widget.type !== "table") return;

    setTableLoading(true);

    fetchStockData(widget.symbol)
      .then((res) => {
        if (res.ohlc) setOhlc(res.ohlc);
      })
      .catch(() => {
        // keep last known good OHLC
      })
      .finally(() => setTableLoading(false));
  }, [widget.type, widget.symbol]);

  /* --------------------------------------------------
     CHART DATA (TwelveData + CACHE)
  -------------------------------------------------- */
  useEffect(() => {
    if (widget.type !== "chart") return;

    const cacheKey = `${widget.symbol}_${interval}`;

    // 1️⃣ Serve from cache immediately
    if (chartCache[cacheKey]) {
      setSeries(chartCache[cacheKey]);
      return;
    }

    setChartLoading(true);

    fetchTwelveDataChart(widget.symbol, interval)
      .then((pts) => {
        if (pts && pts.length > 0) {
          chartCache[cacheKey] = pts; // ✅ cache it
          setSeries(pts);
        }
      })
      .catch(() => {
        // ❗ DO NOTHING — never wipe existing chart
      })
      .finally(() => setChartLoading(false));
  }, [widget.type, widget.symbol, interval]);

  /* --------------------------------------------------
     CARD UI
  -------------------------------------------------- */
  if (widget.type === "card") {
    return (
      <div>
        <p className="text-sm text-slate-400">
          {widget.symbol.toUpperCase()} Price
        </p>

        {cardLoading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : price ? (
          <p className="text-slate-100 font-semibold">₹ {price}</p>
        ) : (
          <p className="text-slate-400 text-sm">No data</p>
        )}
      </div>
    );
  }

  /* --------------------------------------------------
     TABLE UI
  -------------------------------------------------- */
  if (widget.type === "table") {
    if (tableLoading && !ohlc) {
      return <p className="text-slate-400 text-sm">Loading…</p>;
    }

    if (!ohlc) {
      return <p className="text-slate-400 text-sm">No data</p>;
    }

    return (
      <div className="space-y-2">
        <p className="text-sm text-slate-400">
          {widget.symbol.toUpperCase()} — OHLC
        </p>

        <table className="w-full text-sm text-slate-300">
          <tbody>
            <tr>
              <td>Open</td>
              <td className="text-right">₹ {ohlc.open}</td>
            </tr>
            <tr>
              <td>High</td>
              <td className="text-right">₹ {ohlc.high}</td>
            </tr>
            <tr>
              <td>Low</td>
              <td className="text-right">₹ {ohlc.low}</td>
            </tr>
            <tr>
              <td>Close</td>
              <td className="text-right font-semibold">
                ₹ {ohlc.price}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  /* --------------------------------------------------
     CHART UI
  -------------------------------------------------- */
  if (widget.type === "chart") {
    return (
      <div className="space-y-2">
        {/* Controls */}
        <div className="flex justify-between items-center text-xs text-slate-400">
          <div className="flex gap-2">
            {(["1day", "1week", "1month"] as Interval[]).map((i) => (
              <button
                key={i}
                onClick={() => setInterval(i)}
                className={`px-2 py-1 rounded ${
                  interval === i
                    ? "bg-slate-700 text-white"
                    : "hover:text-white"
                }`}
              >
                {i.replace("1", "").toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setChartType("line")}
              className={chartType === "line" ? "text-white" : ""}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("candle")}
              className={chartType === "candle" ? "text-white" : ""}
            >
              Candle
            </button>
          </div>
        </div>

        {chartLoading && (
          <p className="text-slate-400 text-sm">Loading chart…</p>
        )}

        {!chartLoading && series.length === 0 && (
          <p className="text-slate-400 text-sm">
            Chart data unavailable (API limit)
          </p>
        )}

        {series.length > 0 && (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={false} />
              <YAxis />
              <Tooltip />
              <Legend />

              {chartType === "line" && (
                <Line
                  dataKey="close"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={false}
                />
              )}

              {chartType === "candle" && (
                <>
                  <Line dataKey="high" stroke="#22c55e" dot={false} />
                  <Line dataKey="low" stroke="#ef4444" dot={false} />
                  <Line dataKey="open" stroke="#38bdf8" dot />
                  <Line dataKey="close" stroke="#facc15" dot />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  return null;
}
