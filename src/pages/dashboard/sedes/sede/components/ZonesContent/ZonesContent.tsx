import React, { useState } from "react";
import { Zone } from "@/interfaces/zona";
import { Branch } from "@/interfaces/Branch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ZoneDialogForm from "../Dialog/ZoneForm/ZoneDialogForm";
import ZoneCard from "../ZoneCard/ZoneCard";
import "./ZonesContent.css";

interface ZonesContentProps {
  branch: Branch | null;
  zones: Zone[];
  loading: boolean;
  error: string | null;
  handleRedirectNewZone: () => void;
  handleRedirectZone: (zoneId: number) => void;
  getVehicleTypeName: (vehicleTypeId: number) => string;
  getVehicleTypeRate: (vehicleTypeId: number) => number;
  formatDate: (dateString: string) => string;
  onZoneCreated?: (newZone: Zone) => void;
}

export default function ZonesContent({
  branch,
  zones: initialZones,
  loading,
  error,
  handleRedirectZone,
  getVehicleTypeName,
  getVehicleTypeRate,
  onZoneCreated,
}: ZonesContentProps) {
  const [zones, setZones] = useState<Zone[]>(initialZones);

  // Sincronizar con el prop cuando cambie
  React.useEffect(() => {
    setZones(initialZones);
  }, [initialZones]);

  const handleZoneCreated = (newZone: Zone) => {
    setZones(prev => [...prev, newZone]);
    if (onZoneCreated) onZoneCreated(newZone);
  };

  const handleZoneUpdated = (updatedZone: Zone) => {
    setZones(prev =>
      prev.map(zone => (zone.id === updatedZone.id ? updatedZone : zone))
    );
  };

  const handleZoneDeleted = (zoneId: number) => {
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  return (
    <div className="content-wrapper">
      <div className="zones-content-header">
        <div>
          <h2 className="zones-content-title">Zonas</h2>
          <p className="zones-content-subtitle">
            {zones.length} zona(s) registrada(s)
          </p>
        </div>

        {branch ? (
          <ZoneDialogForm
            branchIdProp={Number(branch.id)}
            onZoneCreated={handleZoneCreated}
          />
        ) : (
          <Button disabled variant="outline">
            Cargando sede...
          </Button>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner-vehicle-type"></div>
          <p>Cargando zonas...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p className="error-message">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      )}

      {!loading && !error && branch && (
        <>
          {zones.length === 0 ? (
            <div className="empty-state">
              <h3>No hay zonas registradas</h3>
              <p>Crea la primera zona de parqueo para esta sede</p>
              {branch ? (
                <ZoneDialogForm
                  branchIdProp={branch.id}
                  onZoneCreated={handleZoneCreated}
                />
              ) : (
                <Button disabled variant="outline">
                  Cargando sede...
                </Button>
              )}
            </div>
          ) : (
            <div className="zonas-grid">
              {zones.map((zone) => (
                <React.Fragment key={zone.id}>
                  <ZoneCard
                    zone={zone}
                    vehicleTypeName={getVehicleTypeName(zone.vehicleTypeId)}
                    vehicleTypeRate={getVehicleTypeRate(zone.vehicleTypeId)}
                    onUpdateZone={handleZoneUpdated}
                    onDelete={handleZoneDeleted}
                    onRedirect={handleRedirectZone}
                  />
                  <Separator />
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && !branch && (
        <div className="empty-state">
          <h3>No se ha seleccionado ninguna sede</h3>
          <p>Selecciona una sede para ver sus zonas</p>
        </div>
      )}
    </div>
  );
}