import { Zone } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";
import ZoneDialogForm from "../Dialog/ZoneForm/ZoneDialogForm";
import "./ZoneCard.css";

interface ZoneCardProps {
  zone: Zone;
  vehicleTypeName: string;
  vehicleTypeRate: number;
  onUpdateZone?: (updatedZone: Zone) => void;
  onDelete?: (id: number) => void;
  onRedirect?: (id: number) => void;
}

export default function ZoneCard({
  zone,
  vehicleTypeName,
  vehicleTypeRate,
  onRedirect,
  onUpdateZone,
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
        <div>
          {/* Botón de edición (usa el formulario en modo edición) */}
          <ZoneDialogForm
            isEditing={true}
            zoneToEdit={zone}
            onZoneUpdated={(updatedZone) =>
              onUpdateZone && onUpdateZone(updatedZone)
            }
          />
        </div>
        <div>
          {/* Botón de redirección */}
          <Button onClick={() => onRedirect && onRedirect(zone.id)}>
            Ir a la zona
          </Button>
        </div>
      </div>
    </div>
  );
}
