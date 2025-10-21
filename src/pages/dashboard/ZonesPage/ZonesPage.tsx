// src/pages/dashboard/parking/ParkingZonesPage.tsx
import { useParkingStatus } from "@/context/ParkingContext";
import { AlertCircle, Car, RefreshCw } from "lucide-react";
import "./ZonesPage.css";
import { ParkingAlert } from "@/components/ParkingAlert/ParkingAlert";

export default function ParkingZonesPage() {
  const { parkingData, loading, error, refresh } = useParkingStatus();

  if (loading) {
    return (
      <div className="parking-zones-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando estado del parqueadero...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parking-zones-page">
        <div className="error-state">
          <AlertCircle className="error-icon" />
          <h3>Error al cargar datos</h3>
          <p>{error}</p>
          <button onClick={refresh} className="action-button">
            <RefreshCw className="button-icon" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!parkingData) {
    return null;
  }

  const getOccupancyColor = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate >= 90) return "occupancy-critical";
    if (numRate >= 70) return "occupancy-warning";
    if (numRate >= 50) return "occupancy-medium";
    return "occupancy-good";
  };

  const getZoneStatusClass = (availableSpaces: number) => {
    if (availableSpaces === 0) return "zone-full";
    if (availableSpaces <= 3) return "zone-low";
    return "zone-available";
  };

  return (
    <div className="parking-zones-page">
      {/* Header */}
      <div className="zones-header">
        <div className="header-content">
          <h2 className="page-title">Monitoreo de Zonas</h2>
          <p className="page-subtitle">
            Última actualización:{" "}
            {new Date(parkingData.timestamp).toLocaleString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <button onClick={refresh} className="btn-refresh-monitoring">
          <RefreshCw className="button-icon" />
          Actualizar
        </button>
      </div>

      {/* Alerta */}
      <ParkingAlert />

      {/* Resumen General */}
      <div className="summary-card">
        <h3 className="section-title">Resumen General</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total de Espacios:</span>
            <span className="summary-value">
              {parkingData.summary.totalSpaces}
            </span>
          </div>
          <div className="summary-item success">
            <span className="summary-label">Disponibles:</span>
            <span className="summary-value">
              {parkingData.summary.availableSpaces}
            </span>
          </div>
          <div className="summary-item primary">
            <span className="summary-label">Ocupados:</span>
            <span className="summary-value">
              {parkingData.summary.occupiedSpaces}
            </span>
          </div>
          {parkingData.summary.reservedSpaces > 0 && (
            <div className="summary-item warning">
              <span className="summary-label">Reservados:</span>
              <span className="summary-value">
                {parkingData.summary.reservedSpaces}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Zonas */}
      <div className="zones-section">
        <h3 className="section-title">Zonas del Parqueadero</h3>
        <div className="zones-grid">
          {parkingData.zoneDetails.map((zone) => (
            <div
              key={zone.zoneId}
              className={`zone-card-monitoring ${getZoneStatusClass(
                zone.availableSpaces
              )}`}
            >
              {/* Header de la zona */}
              <div className="zone-header">
                <div>
                  <h4 className="zone-name">{zone.zoneName}</h4>
                  <p className="zone-type">
                    <Car className="zone-icon" />
                    {zone.vehicleType}
                  </p>
                </div>
                <div
                  className={`occupancy-badge ${getOccupancyColor(
                    zone.occupancyRate
                  )}`}
                >
                  {zone.occupancyRate}%
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getOccupancyColor(
                      zone.occupancyRate
                    )}`}
                    style={{ width: `${zone.occupancyRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="zone-stats">
                <div className="stat-row">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{zone.totalSpaces}</span>
                </div>
                <div className="stat-row success">
                  <span className="stat-label">Disponibles:</span>
                  <span className="stat-value">{zone.availableSpaces}</span>
                </div>
                <div className="stat-row primary">
                  <span className="stat-label">Ocupados:</span>
                  <span className="stat-value">{zone.occupiedSpaces}</span>
                </div>
                {zone.reservedSpaces > 0 && (
                  <div className="stat-row warning">
                    <span className="stat-label">Reservados:</span>
                    <span className="stat-value">{zone.reservedSpaces}</span>
                  </div>
                )}
              </div>

              {/* Indicador de estado */}
              <div className="zone-footer">
                <div className="status-indicator">
                  {zone.availableSpaces === 0 ? (
                    <>
                      <span className="status-dot critical"></span>
                      <span className="status-text">Zona Llena</span>
                    </>
                  ) : zone.availableSpaces <= 3 ? (
                    <>
                      <span className="status-dot warning"></span>
                      <span className="status-text">Pocos espacios</span>
                    </>
                  ) : (
                    <>
                      <span className="status-dot success"></span>
                      <span className="status-text">Disponible</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
