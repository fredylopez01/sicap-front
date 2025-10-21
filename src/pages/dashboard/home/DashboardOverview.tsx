import { useEffect, useState } from "react";
import "./DashboardOverview.css";
import { CreateEntryModal } from "../records/entry/CreateEntryModal";
import { RecordTable } from "../records/recordsList/RecordTable";
import { ApiResponse, DailySummary, ParkingRecordFiltered } from "@/interfaces";
import { showAlert } from "@/utils/alerts";
import { apiRequest } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { VehicleExitForm } from "../records/exit/VehicleExitForm";

// Interfaz para la data de espacios (Existente)
interface ParkingData {
  totalSpaces: number;
  occupiedSpaces: number;
}

const fetchParkingData = (): Promise<ParkingData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalSpaces: 150,
        occupiedSpaces: 112,
      });
    }, 500);
  });
};

export default function DashboardOverview() {
  const { user } = useAuth();
  const [parkingData, setParkingData] = useState<ParkingData | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  // const [dateSummary, setDateSummary] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDailySummary = async () => {
    const API_URL = `/api/vehicleRecords/dailySummary/${user!.branchId}`;
    try {
      setLoading(true);

      const result: ApiResponse<DailySummary> = await apiRequest<DailySummary>(
        API_URL,
        "POST",
        { date: "" }
      );

      if (result.success) {
        if (result.data?.date) setDailySummary(result.data);
      } else {
        showAlert(
          result.message || "No se pudo cargar la lista de registros.",
          "error"
        );
      }
    } catch (err: any) {
      showAlert(
        "Error de conexión con el servidor. Intenta recargar.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [fetchedParkingData] = await Promise.all([fetchParkingData()]);

      setParkingData(fetchedParkingData);
      fetchDailySummary();

      setLoading(false);
    };
    loadData();
  }, []);

  const handleRecordUpdatedTable = (
    updatedRecord: Partial<ParkingRecordFiltered>
  ) => {
    setDailySummary((prev) => {
      if (!prev) return prev;

      const updatedRecords = prev.records.map((record) =>
        record.id === updatedRecord.id
          ? { ...record, ...updatedRecord }
          : record
      );

      return { ...prev, records: updatedRecords };
    });
  };

  const availableSpaces = parkingData
    ? parkingData.totalSpaces - parkingData.occupiedSpaces
    : 0;

  // Determina la clase del indicador basado en la disponibilidad
  const getAvailabilityStatusClass = () => {
    if (!parkingData) return "status-unknown";
    const percentage = (availableSpaces / parkingData.totalSpaces) * 100;
    if (percentage > 30) return "status-high";
    if (percentage > 10) return "status-medium";
    return "status-low";
  };

  // Función para formatear moneda (copiada de RecordTable para la Card de Recaudación)
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  if (loading) {
    return (
      <div className="dashboard-overview loading-state">
        <p>Cargando datos del parqueadero...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="overview-header">
        <h2 className="overview-title">Resumen Operacional</h2>
        <div className="quick-actions">
          <CreateEntryModal />
          {/* <button className="action-button secondary-action">
            Ver Mapa de Espacios
          </button> */}
          <VehicleExitForm />
        </div>
      </div>

      <div className="stats-grid">
        {/* Card 1: Espacios Disponibles */}
        <div
          className={`stat-card available-spaces ${getAvailabilityStatusClass()}`}
        >
          <p className="stat-label">Espacios Disponibles</p>
          <span className="stat-value">{availableSpaces}</span>
          <p className="stat-hint">
            De {parkingData?.totalSpaces || 0} totales
          </p>
        </div>

        {/* Card 2: Total Vehículos Ingresados Hoy (NUEVO) */}
        <div className="stat-card daily-registers available-spaces status-high">
          <p className="stat-label">Entradas Hoy</p>
          <span className="stat-value">
            {dailySummary?.totalVehiclesEntered ?? 0}
          </span>
          <p className="stat-hint">Vehículos registrados</p>
        </div>

        {/* Card 3: Total Vehículos Egresados Hoy (NUEVO) */}
        <div className="stat-card daily-registers available-spaces status-low">
          <p className="stat-label">Salidas Hoy</p>
          <span className="stat-value">
            {dailySummary?.totalVehiclesExited ?? 0}
          </span>
          <p className="stat-hint">Vehículos que egresaron</p>
        </div>

        {/* Card 4: Recaudación Total del Día (NUEVO) */}
        <div className="stat-card occupied-spaces">
          <p className="stat-label">Recaudación Hoy</p>
          <span className="stat-value">
            {formatCurrency(dailySummary?.totalRevenue)}
          </span>
          <p className="stat-hint">Total de ingresos brutos</p>
        </div>
      </div>

      {/* Tabla de Registros Recientes */}
      <div className="recent-records-section">
        <h3 className="section-title-over-view">
          Registros Recientes del Día ({dailySummary?.date})
        </h3>
        {dailySummary?.records && dailySummary.records.length > 0 ? (
          <RecordTable
            records={dailySummary.records}
            onRecordUpdatedTable={handleRecordUpdatedTable}
          />
        ) : (
          <div className="empty-state">
            Al parecer no se ha presentado ningún tipo de actividad hoy.
          </div>
        )}
      </div>
    </div>
  );
}
