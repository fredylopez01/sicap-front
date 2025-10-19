import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { apiRequest } from "@/services";
import { ApiResponse } from "@/interfaces";
import {
  VehicleType,
  CreateVehicleTypeRequest,
} from "@/interfaces/vehicleType";
import { InputField } from "@/components/InputField/InputField";
import { showAlert } from "@/utils/alerts";

interface VehicleTypeDialogFormProps {
  branchIdProp?: number;
  onVehicleTypeCreated?: (vehicleType: VehicleType) => void;
}

export default function VehicleTypeDialogForm({
  branchIdProp,
  onVehicleTypeCreated,
}: VehicleTypeDialogFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validaciones
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("El nombre es requerido");
      showAlert("El nombre es requerido", "error");
      return false;
    }

    if (name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      showAlert("El nombre debe tener al menos 3 caracteres", "error");
      return false;
    }

    if (name.length > 50) {
      setError("El nombre no puede exceder 50 caracteres");
      showAlert("El nombre no puede exceder 50 caracteres", "error");
      return false;
    }

    if (!hourlyRate || Number(hourlyRate) <= 0) {
      setError("La tarifa debe ser mayor a 0");
      showAlert("La tarifa debe ser mayor a 0", "error");
      return false;
    }

    if (Number(hourlyRate) > 999999.99) {
      setError("La tarifa excede el máximo permitido");
      showAlert("La tarifa excede el máximo permitido", "error");
      return false;
    }

    if (description && description.length > 1000) {
      setError("La descripción es demasiado larga");
      showAlert("La descripción es demasiado larga", "error");
      return false;
    }

    if (!branchIdProp) {
      setError("No se ha especificado la sede");
      showAlert("No se ha especificado la sede", "error");
      return false;
    }

    return true;
  };

  // Limpiar formulario
  const resetForm = () => {
    setName("");
    setDescription("");
    setHourlyRate("");
    setError(null);
  };

  // Crear tipo de vehículo
  const onCreateVehicleType = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: CreateVehicleTypeRequest = {
      name: name.trim(),
      description: description.trim() || null,
      hourlyRate: Number(hourlyRate),
      branchId: branchIdProp ?? 0,
    };

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<VehicleType> = await apiRequest<VehicleType>(
        "/api/vehicleTypes",
        "POST",
        payload
      );

      if (response.success && response.data) {
        showAlert("Tipo de vehículo creado correctamente", "success");

        // Callback para actualizar la lista en el componente padre
        if (onVehicleTypeCreated) {
          onVehicleTypeCreated(response.data);
        }

        // Limpiar y cerrar
        resetForm();
        setOpen(false);
      } else {
        setError(response.message || "Error al crear el tipo de vehículo");
        showAlert(
          "Error al crear el tipo de vehículo: " + response.message,
          "error"
        );
      }
    } catch (error: any) {
      console.error("Error en la creación:", error);
      const errorMessage = error.message || "Error de conexión con el servidor";
      setError(errorMessage);
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de estado del diálogo
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">Crear Tipo de Vehículo</Button>
      </DialogTrigger>

      <DialogContent className="w-[340px] sm:w-[400px]">
        <form onSubmit={onCreateVehicleType}>
          <DialogHeader>
            <DialogTitle>Crear Tipo de Vehículo</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo tipo de vehículo.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-2">
              {error}
            </div>
          )}

          <div className="grid mt-2 gap-3">
            {/* Nombre */}
            <InputField
              id="name"
              label="Nombre *"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Ej. Automóvil, Motocicleta"
            />

            {/* Descripción */}
            <InputField
              id="description"
              label="Descripción"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
              placeholder="Ej. Vehículo liviano de 4 ruedas"
            />

            {/* Tarifa por hora */}
            <div>
              <InputField
                id="hourlyRate"
                label="Tarifa por hora (COP) *"
                type="number"
                value={hourlyRate}
                onChange={(e) => {
                  setHourlyRate(e.target.value);
                  setError(null);
                }}
                placeholder="Ej. 3000"
              />
              {hourlyRate && Number(hourlyRate) > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Tarifa: $
                  {Number(hourlyRate).toLocaleString("es-CO", {
                    minimumFractionDigits: 0,
                  })}{" "}
                  COP/hora
                </p>
              )}
            </div>

            {/* Estado */}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear tipo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
