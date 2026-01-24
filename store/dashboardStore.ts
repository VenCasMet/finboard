import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Widget } from "@/types/widget";
import { arrayMove } from "@dnd-kit/sortable";

interface DashboardState {
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (oldIndex: number, newIndex: number) => void;
}


export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: [],

      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, widget],
        })),

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),

      reorderWidgets: (oldIndex, newIndex) =>
        set((state) => ({
          widgets: arrayMove(state.widgets, oldIndex, newIndex),
        })),
    }),
    {
      name: "finboard-dashboard",
    }
  )
);
