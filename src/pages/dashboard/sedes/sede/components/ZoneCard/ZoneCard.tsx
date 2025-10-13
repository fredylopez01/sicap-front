import { Zone } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";
import ZonaSheet from "../Sheet/ZonaSheet";
import "./ZoneCard.css";

interface ZoneCardProps {
  zone: Zone;
  vehicleTypeName: string;
  vehicleTypeRate: number;
  onUpdateZone?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRedirect?: (id: number) => void;
}
export default function ZoneCard({
  zone,
  vehicleTypeName,
  vehicleTypeRate,
  onUpdateZone,
  onDelete,
  onRedirect,
}: ZoneCardProps) {
  return (
    <div className="zone-card">
      <div className="content-section">
        <div className="top-section">
          <h3 className="zone-title">{zone.name}</h3>
        </div>
        <p className="zone-description">{zone.description}</p>
        <p className="zone-atribute">Tipo: {vehicleTypeName}</p>
        <p className="zone-atribute">Tarifa: ${vehicleTypeRate} por hora</p>
        <p className="zone-atribute">Capacidad: {zone.totalCapacity}</p>
      </div>

      <div className="action-section">
        <div className="sheet-container">
          <ZonaSheet
            zone={zone}
            vehicleTypeName={vehicleTypeName}
            onUpdateZone={onUpdateZone}
          ></ZonaSheet>
        </div>

        <Button onClick={() => onRedirect && onRedirect(zone.id)}>
          Ir a la zona
        </Button>
      </div>
    </div>
  );
}
