// src/components/parking/ParkingMetrics.tsx
import { useParkingStatus } from "@/context/ParkingContext";
import { CheckCircle, Car, Users, TrendingUp } from "lucide-react";

export const ParkingMetrics = () => {
  const { parkingData, loading } = useParkingStatus();

  if (loading) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card available-spaces status-unknown">
            <p className="stat-label">Cargando...</p>
            <span className="stat-value">-</span>
            <p className="stat-hint">Obteniendo datos</p>
          </div>
        ))}
      </div>
    );
  }

  if (!parkingData) {
    return null;
  }

  const { summary } = parkingData;

  // Determinar clase de estado para espacios disponibles
  const getAvailabilityClass = () => {
    const percentage = (summary.availableSpaces / summary.totalSpaces) * 100;
    if (percentage > 30) return "status-high";
    if (percentage > 10) return "status-medium";
    return "status-low";
  };

  return (
    <div className="stats-grid">
      {/* Card 1: Espacios Disponibles */}
      <div className={`stat-card available-spaces ${getAvailabilityClass()}`}>
        <div className="stat-header">
          <p className="stat-label">Espacios Disponibles</p>
          <CheckCircle className="stat-icon" />
        </div>
        <span className="stat-value">{summary.availableSpaces}</span>
        <p className="stat-hint">De {summary.totalSpaces} totales</p>
      </div>

      {/* Card 2: Espacios Ocupados */}
      <div className="stat-card occupied-spaces">
        <div className="stat-header">
          <p className="stat-label">Espacios Ocupados</p>
          <Car className="stat-icon" />
        </div>
        <span className="stat-value">{summary.occupiedSpaces}</span>
        <p className="stat-hint">En uso actualmente</p>
      </div>

      {/* Card 3: Vehículos Activos */}
      <div className="stat-card daily-registers available-spaces status-high">
        <div className="stat-header">
          <p className="stat-label">Vehículos Activos</p>
          <Users className="stat-icon" />
        </div>
        <span className="stat-value">{summary.activeVehicles}</span>
        <p className="stat-hint">Sin salida registrada</p>
      </div>

      {/* Card 4: Ocupación */}
      <div className="stat-card revenue-card">
        <div className="stat-header">
          <p className="stat-label">Ocupación Total</p>
          <TrendingUp className="stat-icon" />
        </div>
        <span className="stat-value">{summary.occupancyRate}%</span>
        <p className="stat-hint">Porcentaje de uso</p>
      </div>
    </div>
  );
};
