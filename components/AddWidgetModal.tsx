import { useState } from "react";

type WidgetType = "card" | "table" | "chart";

interface AddWidgetModalProps {
  onClose: () => void;
  onAdd: (
    title: string,
    type: "card" | "table" | "chart",
    symbol: string
  ) => void;
}

export default function AddWidgetModal({
  onClose,
  onAdd,
}: AddWidgetModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<WidgetType>("card");
  const [symbol, setSymbol] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div
        className="
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          rounded-lg w-full max-w-md p-6
        "
      >
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
          Add New Widget
        </h2>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Widget title"
            className="
              w-full px-3 py-2 rounded-md text-sm
              bg-slate-100 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:border-emerald-500
            "
          />

          {/* Symbol input */}
          <input
            type="text"
            value={symbol}
            onChange={(e) =>
              setSymbol(e.target.value.toUpperCase())
            }
            placeholder="Stock symbol (e.g. AAPL)"
            className="
              w-full px-3 py-2 rounded-md text-sm
              bg-slate-100 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:border-emerald-500
            "
          />

          {/* Type select */}
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as WidgetType)
            }
            className="
              w-full px-3 py-2 rounded-md text-sm
              bg-slate-100 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:outline-none
            "
          >
            <option value="card">Card</option>
            <option value="table">Table</option>
            <option value="chart">Chart</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm
              text-slate-900 dark:text-slate-400
              hover:text-slate-900 dark:hover:text-white
            "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!title.trim() || !symbol.trim()) return;
              onAdd(title, type, symbol);
              onClose();
            }}
            className="
              bg-emerald-600 hover:bg-emerald-500
              text-white
              px-4 py-2 rounded-md text-sm font-medium
            "
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
