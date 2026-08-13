"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; msg: string; type: ToastType };

const Ctx = createContext<{ toast: (msg: string, type?: ToastType) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((msg: string, type: ToastType = "success") => {
    const t = { id: ++idRef.current, msg, type };
    setToasts((p) => [...p, t]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 3800);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type} animate-toast pointer-events-auto`}
            role="status"
          >
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
