 import { X } from "lucide-react";
import { useToastStore } from "../stores/toast.store";

export const Toast = () => {
  const { toast, closeToast } = useToastStore();
  
  if (!toast.open) return null;

  const severityColors = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    info: "bg-blue-100 border-blue-400 text-blue-800",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-in">
      <div
        className={`${severityColors[toast.severity]} 
          flex items-center justify-between 
          p-4 rounded-lg border shadow-lg`}
        role="alert"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">
            {toast.severity.charAt(0).toUpperCase() + toast.severity.slice(1)}
          </span>
          <p className="text-sm">{toast.message}</p>
        </div>
        <button
          onClick={closeToast}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};