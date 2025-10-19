import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/services";
import { ApiResponse, ParkingRecordFiltered } from "@/interfaces";
import { Space, Zone } from "@/interfaces/zona";
import "./RecordDetailsModal.css";
import { Ellipsis, Loader2 } from "lucide-react";
import { RecordInfo } from "./RecordInfo";
import { showAlert } from "@/utils/alerts";

interface props {
  record: ParkingRecordFiltered;
  onRecordUpdated: (updatedRecord: Partial<ParkingRecordFiltered>) => void;
}

export function RecordDetailsModal({ record, onRecordUpdated }: props) {
  const [zoneId, setZoneId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [error, setError] = useState<string | null>(null);

  //Obtener zonas
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setError(null);

        const result: ApiResponse<Zone[]> = await apiRequest(
          `/api/zones/${record.branchId}`,
          "GET"
        );

        if (result.success && result.data) {
          setZones(result.data);
          if (result.data.length > 0) {
            setZoneId(result.data[0].id);
          } else {
            setZoneId(0);
          }
        } else {
          setError(result.message || "Error al cargar zonas");
        }
      } catch (err: any) {
        console.error("Error al cargar vehicleTypes:", err);
        setError(err.message || "Error de conexión con el servidor");
      } finally {
      }
    };

    fetchVehicleTypes();
  }, []);

  //Obtener espacios
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setError(null);
        const result: ApiResponse<Space[]> = await apiRequest(
          `/api/spaces/${zoneId}`,
          "GET"
        );

        if (result.success && result.data) {
          setSpaces(result.data);
        } else {
          setError(result.message || "Error al cargar zonas");
        }
      } catch (err: any) {
        console.error("Error al cargar zonas:", err);
        setError(err.message || "Error de conexión con el servidor");
      }
    };

    fetchVehicleTypes();
  }, [zoneId, zones]);

  const spaceOptions = spaces.map((space) => ({
    id: space.id,
    spaceNumber:
      space.spaceNumber +
      "  " +
      (space.physicalStatus === "available" ? "Disponible" : "No disponible"),
  }));

  const handleSave = async (
    id: number,
    updatedRecordData: Partial<ParkingRecordFiltered>
  ) => {
    setLoading(true);
    try {
      const result: ApiResponse<any> = await apiRequest<any>(
        `/api/vehicleRecords/${id}`,
        "PUT",
        updatedRecordData
      );

      if (result.success && result.data) {
        const apiResponseData = result.data;

        const partialUpdate: Partial<ParkingRecordFiltered> = {
          id: apiResponseData.id,
          licensePlate: apiResponseData.licensePlate,
          appliedRate: apiResponseData.appliedRate,
          parkedHours: apiResponseData.parkedHours,
          observations: apiResponseData.observations,
          spaceId: apiResponseData.spaceId,
          space: apiResponseData.space,
        };

        onRecordUpdated(partialUpdate);
        showAlert(
          result.message || "¡Registro actualizado exitosamente!",
          "success"
        );
      } else {
        showAlert(result.message || "Error al actualizar el registro.");
      }
    } catch (error: any) {
      console.log(error);
      showAlert(error.message || "Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="btn-record-details"
            size={"default"}
          >
            <Ellipsis />
          </Button>
        </DialogTrigger>

        {loading ? (
          <div className="loadingContainer-update-record">
            <div className="loadingContent">
              <Loader2 className="spinner-records" />
              <p className="loadingText">Actualizando registro...</p>
            </div>
          </div>
        ) : (
          <DialogContent className="w-auto record-datails-modal-container">
            <DialogHeader>
              <DialogTitle>Información del registro</DialogTitle>
              <DialogDescription>
                Los campos de placa, espacio, horas de estacionamiento, tarifa y
                observaciones pueden ser editadas.
              </DialogDescription>
            </DialogHeader>

            <RecordInfo
              record={record}
              spaces={spaceOptions}
              onSave={handleSave}
            />
            <span>{error}</span>
          </DialogContent>
        )}
      </form>
    </Dialog>
  );
}
