"use client";

import { useState } from "react";
import AddWidgetModal from "@/components/AddWidgetModal";
import WidgetRenderer from "@/components/widgets/WidgetRenderer";
import WidgetWrapper from "@/components/widgets/WidgetWrapper";
import { useDashboardStore } from "@/store/dashboardStore";
import ThemeToggle from "@/components/ThemeToggle";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* ---------------- Draggable Wrapper ---------------- */

function DraggableWidget({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function Home() {
  const {
    widgets,
    addWidget,
    removeWidget,
    reorderWidgets,
  } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex(
      (w) => w.id === active.id
    );
    const newIndex = widgets.findIndex(
      (w) => w.id === over.id
    );

    reorderWidgets(oldIndex, newIndex);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        
        <div>
          <h1 className="text-xl font-semibold">
            Finance Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Build your custom finance dashboard
          </p>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md text-sm font-medium text-white"
          >
            + Add Widget
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <section className="p-6">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgets.map((widget) => (
                <DraggableWidget
                  key={widget.id}
                  id={widget.id}
                >
                  <WidgetWrapper
                    title={widget.title}
                    onRemove={() =>
                      removeWidget(widget.id)
                    }
                  >
                    <WidgetRenderer widget={widget} />
                  </WidgetWrapper>
                </DraggableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <AddWidgetModal
          onClose={() => setIsModalOpen(false)}
          onAdd={(title, type, symbol) =>
            addWidget({
              id: crypto.randomUUID(),
              title,
              type,
              symbol,
            })
          }
        />
      )}
    </main>
  );
}
