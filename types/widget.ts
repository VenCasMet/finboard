export type WidgetType = "card" | "table" | "chart";

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  symbol: string;
}

export interface OHLCPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
