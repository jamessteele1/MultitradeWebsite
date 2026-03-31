"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ServiceUpgradesState = {
  powerType: "site" | "generator" | "self-contained" | "";
  mineSpec: boolean | null;
  mineName: string;
};

type ServiceUpgradesContextType = {
  state: ServiceUpgradesState;
  update: (data: Partial<ServiceUpgradesState>) => void;
  isComplete: boolean;
};

const ServiceUpgradesContext = createContext<ServiceUpgradesContextType | null>(null);

export function ServiceUpgradesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ServiceUpgradesState>({
    powerType: "",
    mineSpec: null,
    mineName: "",
  });

  const update = useCallback((data: Partial<ServiceUpgradesState>) => {
    setState((prev) => ({ ...prev, ...data }));
  }, []);

  const isComplete =
    state.powerType !== "" &&
    state.mineSpec !== null &&
    (state.mineSpec === false || state.mineName !== "");

  return (
    <ServiceUpgradesContext.Provider value={{ state, update, isComplete }}>
      {children}
    </ServiceUpgradesContext.Provider>
  );
}

export function useServiceUpgrades() {
  return useContext(ServiceUpgradesContext);
}
