import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { showAlert } from "@/utils/alerts";
import { useAuth } from "./AuthContext";
import { apiRequest } from "@/services";

export interface ParkingAlert {
  level: "normal" | "info" | "warning" | "critical";
  message: string;
  shouldNotify: boolean;
}

export interface ParkingSummary {
  totalSpaces: number;
  availableSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
  occupancyRate: number;
  activeVehicles: number;
}

export interface ZoneDetail {
  zoneId: number;
  zoneName: string;
  vehicleType: string;
  totalSpaces: number;
  availableSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
  occupancyRate: string;
}

export interface ParkingStatusData {
  branchId: number;
  timestamp: string;
  summary: ParkingSummary;
  alert: ParkingAlert;
  zoneDetails: ZoneDetail[];
}

interface ApiParkingResponse {
  success: boolean;
  data?: ParkingStatusData;
  message?: string;
}

interface ParkingContextType {
  parkingData: ParkingStatusData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const useParkingStatus = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error(
      "useParkingStatus debe usarse dentro de un ParkingProvider"
    );
  }
  return context;
};

interface ParkingProviderProps {
  children: ReactNode;
}

export const ParkingProvider = ({ children }: ParkingProviderProps) => {
  const { user } = useAuth();
  const [parkingData, setParkingData] = useState<ParkingStatusData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParkingStatus = async () => {
    if (!user?.branchId) {
      setError("No se pudo obtener la información de la sede");
      setLoading(false);
      return;
    }

    try {
      const API_URL = `/api/stats/parking/status/${user.branchId}`;
      const result: ApiParkingResponse = await apiRequest<ParkingStatusData>(
        API_URL,
        "GET"
      );

      if (result.success && result.data) {
        setParkingData(result.data);
        setError(null);
      } else {
        const errorMsg =
          result.message || "No se pudo cargar el estado del parqueadero";
        setError(errorMsg);
        showAlert(errorMsg, "error");
      }
    } catch (err: any) {
      const errorMsg =
        err.message || "Error de conexión con el servidor. Intenta recargar.";
      setError(errorMsg);
      console.error("Error fetching parking status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.branchId) return;

    // Carga inicial
    fetchParkingStatus();

    // Polling cada 30 segundos
    const interval = setInterval(fetchParkingStatus, 30000);

    return () => clearInterval(interval);
  }, [user?.branchId]);

  const value: ParkingContextType = {
    parkingData,
    loading,
    error,
    refresh: fetchParkingStatus,
  };

  return (
    <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
  );
};
