import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const KEY = "wedding-access-code";

type AccessValue = {
  ready: boolean;
  code: string | null;
  grant: (code: string) => void;
  revoke: () => void;
};

const AccessContext = createContext<AccessValue | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    setCode(window.localStorage.getItem(KEY));
    setReady(true);
  }, []);

  const grant = useCallback((value: string) => {
    window.localStorage.setItem(KEY, value);
    window.sessionStorage.setItem(KEY, value);
    setCode(value);
  }, []);

  const revoke = useCallback(() => {
    window.localStorage.removeItem(KEY);
    window.sessionStorage.removeItem(KEY);
    setCode(null);
  }, []);

  const value = useMemo(() => ({ ready, code, grant, revoke }), [ready, code, grant, revoke]);

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used inside AccessProvider");
  return ctx;
}
