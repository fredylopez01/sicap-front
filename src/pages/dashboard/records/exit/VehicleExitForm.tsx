import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorSpan from "@/components/ui/errorSpan";
import { apiRequest } from "@/services/api";
import { ApiResponse } from "@/interfaces";
import { showAlert } from "@/utils/alerts";
import "./VehicleExitForm.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUp } from "lucide-react";

interface ExitData {
  licensePlate: string;
  observations?: string;
}

interface CreateExitFormProps {
  onCreate: () => void;
}

export function VehicleExitForm({ onCreate }: CreateExitFormProps) {
  const [licensePlate, setLicensePlate] = useState("");
  const [observations, setObservations] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    licensePlate: "",
  });

  const validateForm = (): boolean => {
    const newErrors = {
      licensePlate: "",
    };

    // Validar placa (requerida, formato básico)
    if (!licensePlate.trim()) {
      newErrors.licensePlate = "La placa es obligatoria";
    } else if (licensePlate.trim().length < 4) {
      newErrors.licensePlate = "La placa debe tener al menos 4 caracteres";
    } else if (licensePlate.trim().length > 10) {
      newErrors.licensePlate = "La placa no puede exceder 10 caracteres";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);

    try {
      const exitData: ExitData = {
        licensePlate: licensePlate.trim().toUpperCase(),
        observations: observations.trim() || undefined,
      };

      const result: ApiResponse<any> = await apiRequest<any>(
        "/api/vehicleRecords/exit",
        "POST",
        exitData
      );

      if (result.success && result.data) {
        // Formatear información para mostrar
        const hours = Number(result.data.parkedHours).toFixed(2);
        const total = Number(result.data.totalToPay).toFixed(2);
        const rate = Number(result.data.appliedRate).toFixed(2);

        onCreate();

        showAlert(
          `Salida registrada exitosamente\n\nPlaca: ${result.data.licensePlate}\nTiempo: ${hours} horas\nTarifa: $${rate}/hora\nTotal a pagar: $${total}`,
          "success",
          5000
        );
      } else {
        showAlert(
          result.message || "Error al registrar la salida del vehículo"
        );
      }
    } catch (error: any) {
      console.error("Error en registro de salida:", error);
      showAlert(
        error.message ||
          "Error de conexión. No se pudo registrar la salida del vehículo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setLicensePlate(value);

    // Limpiar error al escribir
    if (errors.licensePlate) {
      setErrors({ ...errors, licensePlate: "" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} className="btn-exit-modal" size={"default"}>
          <ArrowUp /> Registrar salida
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto record-datails-modal-container">
        <DialogHeader>
          <DialogTitle>Registrar salida de vehículo</DialogTitle>
          <DialogDescription>
            El sistema calculará automáticamente el tiempo de permanencia y el
            monto a pagar basado en la tarifa del espacio asignado.
          </DialogDescription>
        </DialogHeader>

        <form className="exit-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <Label htmlFor="licensePlate">
              Placa del Vehículo <span className="required">*</span>
            </Label>
            <Input
              id="licensePlate"
              type="text"
              placeholder="Ej: ABC123"
              value={licensePlate}
              onChange={handleLicensePlateChange}
              disabled={loading}
              maxLength={10}
              aria-invalid={!!errors.licensePlate}
              className={errors.licensePlate ? "input-error" : ""}
            />
            {errors.licensePlate && <ErrorSpan message={errors.licensePlate} />}
          </div>

          <div className="input-field">
            <Label htmlFor="observations">
              Observaciones <span className="optional">(Opcional)</span>
            </Label>
            <textarea
              id="observations"
              placeholder="Observaciones adicionales sobre la salida..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              disabled={loading}
              rows={4}
              maxLength={500}
              className="textarea-input"
            />
            <small className="input-hint">Máximo 500 caracteres</small>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
