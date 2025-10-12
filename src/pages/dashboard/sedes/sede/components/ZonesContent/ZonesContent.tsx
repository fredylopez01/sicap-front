import { Zone } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";

interface ZonesContentProps {
  zones: Zone[];
  loading: boolean;
  error: string | null;
  handleRedirectNewZone: () => void;
  handleRedirectZone: (zoneId: number) => void;
  getVehicleTypeName: (vehicleTypeId: number) => string;
  getVehicleTypeRate: (vehicleTypeId: number) => number;
  formatDate: (dateString: string) => string;
}



export default function ZonesContent({
  zones,
  loading,
  error,
  handleRedirectNewZone,
  handleRedirectZone,
  getVehicleTypeName,
  getVehicleTypeRate,
  formatDate
}: ZonesContentProps){
    return(
        <div className="content-wrapper">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando zonas...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {zones.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No hay zonas registradas</h3>
                <p>Crea la primera zona de parqueo para esta sede</p>
                <Button onClick={handleRedirectNewZone}>
                  Crear primera zona
                </Button>
              </div>
            ) : (
              <div className="zonas-grid">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="zona-card"
                    onClick={() => handleRedirectZone(zone.id)}
                  >
                    <div className="zona-card-header">
                      <h3 className="zona-name">{zone.name}</h3>
                      <span className="zona-capacity">
                        {zone.totalCapacity} espacios
                      </span>
                    </div>
                    
                    <p className="zona-description">
                      {zone.description}
                    </p>

                    <div className="zona-meta">
                      <div className="zona-info-item">
                        <span className="info-label">Tipo:</span>
                        <span className="info-value">
                          {getVehicleTypeName(zone.vehicleTypeId)}
                        </span>
                      </div>
                      <div className="zona-info-item">
                        <span className="info-label">Tarifa:</span>
                        <span className="info-value price">
                          ${getVehicleTypeRate(zone.vehicleTypeId).toLocaleString()}/h
                        </span>
                      </div>
                    </div>

                    <div className="zona-footer">
                      <span className="zona-date">
                        Creada: {formatDate(zone.createdAt)}
                      </span>
                      <span className="zona-arrow">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
}