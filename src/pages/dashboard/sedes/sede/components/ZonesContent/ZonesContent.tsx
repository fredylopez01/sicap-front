import React from "react";
import { Zone } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import ZoneCard from "../ZoneCard/ZoneCard";
import "./ZonesContent.css";

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

const onUpdateZone = () => {};

const onDeleteZone = () => {};

export default function ZonesContent({
  zones,
  loading,
  error,
  handleRedirectNewZone,
  handleRedirectZone,
  getVehicleTypeName,
  getVehicleTypeRate,
  formatDate,
}: ZonesContentProps) {
  return (
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
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {zones.length === 0 ? (
            <div className="empty-state">
              <h3>No hay zonas registradas</h3>
              <p>Crea la primera zona de parqueo para esta sede</p>
              <Button onClick={handleRedirectNewZone}>
                Crear primera zona
              </Button>
            </div>
          ) : (
            <div className="zonas-grid">
              {zones.map((zone) => (
                <React.Fragment key={zone.id}>
                  <ZoneCard
                    zone={zone}
                    vehicleTypeName={getVehicleTypeName(zone.vehicleTypeId)}
                    vehicleTypeRate={getVehicleTypeRate(zone.vehicleTypeId)}
                    onUpdateZone={onUpdateZone}
                    onDelete={onDeleteZone}
                    onRedirect={handleRedirectZone}
                  />
                  <Separator />
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
