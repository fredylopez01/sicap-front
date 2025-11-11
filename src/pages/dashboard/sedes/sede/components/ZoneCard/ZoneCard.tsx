import { Zone } from "@/interfaces/zona";
import ZoneDialogForm from "../Dialog/ZoneForm/ZoneDialogForm";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { showConfirmAlert, showAlert } from "@/utils/alerts";
import { apiRequest } from "@/services";
import { ApiResponse } from "@/interfaces";
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
  onUpdateZone,
  onDelete,
}: ZoneCardProps) {

  const handleDeleteClick = () => {
    showConfirmAlert(
      "Eliminar zona",
      `¿Estás seguro de eliminar la zona "${zone.name}"? Esta acción eliminará también todos los espacios asociados y no se puede deshacer.`,
      "Eliminar",
      async () => {
        try {
          const response: ApiResponse<null> = await apiRequest(
            `/api/zones/${zone.id}`,
            "DELETE"
          );

          if (response.success) {
            showAlert("Zona eliminada correctamente", "success");
            if (onDelete) {
              onDelete(zone.id);
            }
          } else {
            showAlert(
              response.message || "Error al eliminar la zona",
              "error"
            );
          }
        } catch (err: any) {
          console.error("Error al eliminar zona:", err);
          showAlert(
            err.message || "Error de conexión al eliminar la zona",
            "error"
          );
        }
      }
    );
  };

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

        <div className="action-section">
          {/* Botón de edición */}
          <ZoneDialogForm
            isEditing={true}
            zoneToEdit={zone}
            onZoneUpdated={(updatedZone) =>
              onUpdateZone && onUpdateZone(updatedZone)
            }
          />

          {/* Botón de eliminación */}
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDeleteClick}
            className="flex items-center gap-2"
          >
            <Trash className="w-4 h-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}