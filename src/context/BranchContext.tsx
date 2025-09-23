import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export enum BranchStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type Branch = {
  name: string;
  address: string;
  city: string;
  stateRegion: string;
  phone: string;
  openingTime: string; 
  closingTime: string;  
  status: BranchStatus;
};

interface BranchContextType {
  branch: Branch | null;
  setBranch: (branch: Branch) => void;
  clearBranch: () => void;
  updateBranch: (fields: Partial<Branch>) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branch, setBranchState] = useState<Branch | null>(() => {
    try {
      const storedBranch = localStorage.getItem("branchData");
      if (storedBranch) {
        console.log("[BranchContext] Loaded from localStorage:", storedBranch);
        return JSON.parse(storedBranch);
      }
      return null;
    } catch (error) {
      console.error("[BranchContext] Error parsing stored branch data:", error);
      localStorage.removeItem("branchData");
      return null;
    }
  });

  // ✅ efecto para loggear cada vez que cambie el branch
  useEffect(() => {
    console.log("[BranchContext] Branch updated:", branch);
  }, [branch]);

  const setBranch = (data: Branch) => {
    console.log("[BranchContext] setBranch called with:", data);
    setBranchState(data);
    localStorage.setItem("branchData", JSON.stringify(data));
  };

  const clearBranch = () => {
    console.log("[BranchContext] clearBranch called");
    setBranchState(null);
    localStorage.removeItem("branchData");
  };

  const updateBranch = (fields: Partial<Branch>) => {
    if (!branch) {
      console.warn("[BranchContext] updateBranch called but branch is null");
      return;
    }
    const updated = { ...branch, ...fields };
    console.log("[BranchContext] updateBranch with:", fields, " → result:", updated);
    setBranchState(updated);
    localStorage.setItem("branchData", JSON.stringify(updated));
  };

  const value = {
    branch,
    setBranch,
    clearBranch,
    updateBranch,
  };

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch debe usarse dentro de un BranchProvider");
  }
  return context;
};