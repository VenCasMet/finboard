interface WidgetWrapperProps {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}

export default function WidgetWrapper({
  title,
  onRemove,
  children,
}: WidgetWrapperProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 relative">
      
      {/* 🔹 DRAG HANDLE (HEADER ONLY) */}
      <div
        className="flex items-center justify-between mb-3 cursor-grab active:cursor-grabbing"
      >
        <h2 className="text-slate-100 font-medium select-none">
          {title}
        </h2>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 text-sm"
        >
          ✕
        </button>
      </div>

      {/* 🔹 CONTENT (NON-DRAGGABLE) */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="relative"
      >
        {children}
      </div>
    </div>
  );
}
