import { useEffect, useState } from "react";
import "./DashboardOverview.css";

// Interfaz para la data del resumen del parqueadero
interface ParkingData {
  totalSpaces: number;
  occupiedSpaces: number;
  vehiclesRegisteredToday: number;
}

// SIMULACIÓN DE API
// En un entorno real, usarías apiRequest<ParkingData> al endpoint correcto.
const fetchParkingData = (): Promise<ParkingData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalSpaces: 150,
        occupiedSpaces: 112,
        vehiclesRegisteredToday: 45,
      });
    }, 800);
  });
};

export default function DashboardOverview() {
  const [data, setData] = useState<ParkingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedData = await fetchParkingData();
      setData(fetchedData);
      setLoading(false);
    };
    loadData();
  }, []);

  const availableSpaces = data ? data.totalSpaces - data.occupiedSpaces : 0;

  // Determina la clase del indicador basado en la disponibilidad
  const getAvailabilityStatusClass = () => {
    if (!data) return "status-unknown";
    const percentage = (availableSpaces / data.totalSpaces) * 100;
    if (percentage > 30) return "status-high"; // Más del 30% libre
    if (percentage > 10) return "status-medium"; // Entre 10% y 30% libre
    return "status-low"; // Menos del 10% libre (casi lleno)
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
      <h2 className="overview-title">Resumen Operacional del Parqueadero</h2>

      <div className="stats-grid">
        {/* Card 1: Espacios Disponibles (El más importante) */}
        <div
          className={`stat-card available-spaces ${getAvailabilityStatusClass()}`}
        >
          <p className="stat-label">Espacios Disponibles</p>
          <span className="stat-value">{availableSpaces}</span>
          <p className="stat-hint">De {data?.totalSpaces || 0} totales</p>
        </div>

        {/* Card 2: Espacios Ocupados */}
        <div className="stat-card occupied-spaces">
          <p className="stat-label">Espacios Ocupados</p>
          <span className="stat-value">{data?.occupiedSpaces || 0}</span>
          <p className="stat-hint">Vehículos actualmente dentro</p>
        </div>

        {/* Card 3: Registros del Día */}
        <div className="stat-card daily-registers">
          <p className="stat-label">Vehículos Registrados Hoy</p>
          <span className="stat-value">
            {data?.vehiclesRegisteredToday || 0}
          </span>
          <p className="stat-hint">Entradas y salidas</p>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-button primary-action">
          Registrar Entrada Rápida
        </button>
        <button className="action-button secondary-action">
          Ver Mapa de Espacios
        </button>
      </div>
    </div>
  );
}
