import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
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
  UpdateVehicleTypeRequest,
} from "@/interfaces/vehicleType";
import { InputField } from "@/components/InputField/InputField";
import { showAlert } from "@/utils/alerts";

interface VehicleTypeDialogFormProps {
  branchIdProp?: number;
  onVehicleTypeCreated?: (vehicleType: VehicleType) => void;
  onVehicleTypeUpdated?: (vehicleType: VehicleType) => void;
  isEditing?: boolean;
  vehicleTypeToEdit?: VehicleType;
}

export default function VehicleTypeDialogForm({
  branchIdProp,
  onVehicleTypeCreated,
  onVehicleTypeUpdated,
  isEditing = false,
  vehicleTypeToEdit,
}: VehicleTypeDialogFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos si está en modo edición
  useEffect(() => {
    if (isEditing && vehicleTypeToEdit && open) {
      setName(vehicleTypeToEdit.name);
      setDescription(vehicleTypeToEdit.description || "");
      setHourlyRate(vehicleTypeToEdit.hourlyRate.toString());
    }
  }, [isEditing, vehicleTypeToEdit, open]);

  // Validaciones
  const validateForm = (): boolean => {
    if (!name.trim()) {
      showAlert("El nombre es requerido", "error");
      return false;
    }

    if (name.trim().length < 3) {
      showAlert("El nombre debe tener al menos 3 caracteres", "error");
      return false;
    }

    if (name.length > 50) {
      showAlert("El nombre no puede exceder 50 caracteres", "error");
      return false;
    }

    if (!hourlyRate || Number(hourlyRate) <= 0) {
      showAlert("La tarifa debe ser mayor a 0", "error");
      return false;
    }

    if (Number(hourlyRate) > 999999.99) {
      showAlert("La tarifa excede el máximo permitido", "error");
      return false;
    }

    if (description && description.length > 1000) {
      showAlert("La descripción es demasiado larga", "error");
      return false;
    }

    if (!branchIdProp && !isEditing) {
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
    setIsActive(true);
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
      const response: ApiResponse<VehicleType> = await apiRequest<VehicleType>(
        "/api/vehicleTypes",
        "POST",
        payload
      );

      if (response.success && response.data) {
        showAlert("Tipo de vehículo creado correctamente", "success");
        onVehicleTypeCreated?.(response.data);
        resetForm();
        setOpen(false);
      } else {
        showAlert(
          response.message || "Error al crear el tipo de vehículo",
          "error"
        );
      }
    } catch (error: any) {
      console.error(error);
      showAlert(error.message || "Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar tipo de vehículo
  const onUpdateVehicleType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !vehicleTypeToEdit) return;

    const payload: UpdateVehicleTypeRequest = {
      name: name.trim(),
      description: description.trim() || null,
      hourlyRate: Number(hourlyRate),
    };

    try {
      setLoading(true);
      const response: ApiResponse<VehicleType> = await apiRequest<VehicleType>(
        `/api/vehicleTypes/${vehicleTypeToEdit.id}`,
        "PUT",
        payload
      );

      if (response.success && response.data) {
        showAlert("Tipo de vehículo actualizado correctamente", "success");
        onVehicleTypeUpdated?.(response.data);
        resetForm();
        setOpen(false);
      } else {
        showAlert(
          response.message || "Error al actualizar el tipo de vehículo",
          "error"
        );
      }
    } catch (error: any) {
      console.error(error);
      showAlert(error.message || "Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  // Manejar envío
  const handleSubmit = (e: React.FormEvent) => {
    if (isEditing) onUpdateVehicleType(e);
    else onCreateVehicleType(e);
  };

  // Manejar apertura/cierre del diálogo
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? (
          <button className="w-10 p-2 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
            <MoreVertical className="w-5 h-5" />
          </button>
        ) : (
          <Button variant="default">Crear Tipo de Vehículo</Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[340px] sm:w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Tipo de Vehículo" : "Crear Tipo de Vehículo"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los datos del tipo de vehículo."
                : "Completa los datos para crear un nuevo tipo de vehículo."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-2">
              ⚠️ {error}
            </div>
          )}

          <div className="grid mt-2 gap-3">
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
                ✓ Tarifa: ${Number(hourlyRate).toLocaleString("es-CO")} COP/hora
              </p>
            )}

            {isEditing && (
              <InputField
                id="isActive"
                label="Estado"
                type="select"
                value={isActive.toString()}
                onChange={(e) => setIsActive(e.target.value === "true")}
                options={[
                  { value: "true", label: "Activo" },
                  { value: "false", label: "Inactivo" },
                ]}
              />
            )}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Guardando..."
                  : "Creando..."
                : isEditing
                ? "Guardar cambios"
                : "Crear tipo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
