"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
  type ReactNode,
} from "react";
import { IconCheck, IconCircleX, IconInfoCircle, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastItem extends ToastInput {
  id: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function variantStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-emerald-500/35 bg-emerald-500/12";
    case "error":
      return "border-red-500/35 bg-red-500/12";
    default:
      return "border-border bg-card";
  }
}

function iconBadgeStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "bg-emerald-500/20 text-emerald-300";
    case "error":
      return "bg-red-500/20 text-red-300";
    default:
      return "bg-accent text-accent-foreground";
  }
}

function VariantIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case "success":
      return <IconCheck className="h-4 w-4" stroke={2} />;
    case "error":
      return <IconCircleX className="h-4 w-4" stroke={2} />;
    default:
      return <IconInfoCircle className="h-4 w-4" stroke={2} />;
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const touchStartXRef = useRef<Record<string, number>>({});

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const showToast = useCallback(
    ({ title, description, variant = "info", durationMs = 3200 }: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((prev) => [
        ...prev.slice(-3),
        {
          id,
          title,
          description,
          variant,
          durationMs,
        },
      ]);

      if (durationMs > 0) {
        timersRef.current[id] = setTimeout(() => {
          dismissToast(id);
        }, durationMs);
      }
    },
    [dismissToast]
  );

  const handleTouchStart = useCallback((id: string, event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current[id] = event.touches[0]?.clientX ?? 0;
  }, []);

  const handleTouchEnd = useCallback(
    (id: string, event: TouchEvent<HTMLDivElement>) => {
      const startX = touchStartXRef.current[id];

      if (startX === undefined) {
        return;
      }

      const endX = event.changedTouches[0]?.clientX ?? startX;
      const deltaX = endX - startX;

      delete touchStartXRef.current[id];

      if (Math.abs(deltaX) > 70) {
        dismissToast(id);
      }
    },
    [dismissToast]
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-3 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-20 sm:w-[min(92vw,380px)] sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto w-full max-w-md touch-pan-y select-none rounded-xl border p-3.5 pr-2 shadow-lg backdrop-blur-sm",
              variantStyles(toast.variant)
            )}
            role="status"
            aria-live="polite"
            onTouchStart={(event) => handleTouchStart(toast.id, event)}
            onTouchEnd={(event) => handleTouchEnd(toast.id, event)}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  iconBadgeStyles(toast.variant)
                )}
              >
                <VariantIcon variant={toast.variant} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-card-foreground">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <IconX className="h-4 w-4" stroke={2} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
