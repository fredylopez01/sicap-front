import { useEffect, useState } from "react";
import "./DashboardOverview.css";
import { CreateEntryModal } from "../records/entry/CreateEntryModal";
import { RecordTable } from "../records/recordsList/RecordTable";
import { ApiResponse, DailySummary, ParkingRecordFiltered } from "@/interfaces";
import { showAlert } from "@/utils/alerts";
import { apiRequest } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { VehicleExitForm } from "../records/exit/VehicleExitForm";
import { ParkingMetrics } from "@/components/ParkingAlert/ParkingMetrics";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
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
    fetchDailySummary();
  }, []);

  const onReload = () => {
    fetchDailySummary();
  };

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

  const redirectToBranch = () => {
    window.location.href = `/dashboard/sedes/${user?.branchId}`;
  };

  // Función para formatear moneda
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
          {user?.role === "ADMIN" ? (
            <Button
              onClick={redirectToBranch}
              className="action-button secondary-action"
            >
              Ir a mi parqueadero
            </Button>
          ) : null}

          <CreateEntryModal onCreate={onReload} />
          {/* <button className="action-button secondary-action">
            Ver Mapa de Espacios
          </button> */}
          <VehicleExitForm onCreate={onReload} />
        </div>
      </div>

      {/* Métricas de Parqueadero (4 cards) */}
      <ParkingMetrics />

      {/* Sección de Métricas del Día */}
      <div className="daily-metrics-section">
        <h3 className="section-subtitle">Actividad del Día</h3>
        <div className="stats-grid">
          {/* Card: Entradas Hoy */}
          <div className="stat-card daily-registers available-spaces status-high">
            <p className="stat-label">Entradas Hoy</p>
            <span className="stat-value">
              {dailySummary?.totalVehiclesEntered ?? 0}
            </span>
            <p className="stat-hint">Vehículos registrados</p>
          </div>

          {/* Card: Salidas Hoy */}
          <div className="stat-card daily-registers available-spaces status-low">
            <p className="stat-label">Salidas Hoy</p>
            <span className="stat-value">
              {dailySummary?.totalVehiclesExited ?? 0}
            </span>
            <p className="stat-hint">Vehículos que egresaron</p>
          </div>

          {/* Card: Recaudación Total */}
          <div className="stat-card occupied-spaces">
            <p className="stat-label">Recaudación Hoy</p>
            <span className="stat-value">
              {formatCurrency(dailySummary?.totalRevenue)}
            </span>
            <p className="stat-hint">Total de ingresos brutos</p>
          </div>
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
