import { useState } from "react";
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
import "./RecordDetailsModal.css";
import { Ellipsis, Loader2 } from "lucide-react";
import { RecordInfo } from "./RecordInfo";
import { showAlert } from "@/utils/alerts";

interface props {
  record: ParkingRecordFiltered;
  onRecordUpdated: (updatedRecord: Partial<ParkingRecordFiltered>) => void;
}

export function RecordDetailsModal({ record, onRecordUpdated }: props) {
  const [loading, setLoading] = useState(false);

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

            <RecordInfo record={record} onSave={handleSave} />
          </DialogContent>
        )}
      </form>
    </Dialog>
  );
}
