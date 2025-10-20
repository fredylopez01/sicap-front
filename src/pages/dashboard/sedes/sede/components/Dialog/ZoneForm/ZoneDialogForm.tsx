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
import { Zone, VehicleType } from "@/interfaces/zona";
import { InputField } from "@/components/InputField/InputField";
import { showAlert } from "@/utils/alerts";

interface CreateZoneRequest {
  branchId: number;
  name: string;
  vehicleTypeId: number;
  totalCapacity: number;
  description: string;
}

interface UpdateZoneRequest {
  name?: string;
  vehicleTypeId?: number;
  totalCapacity?: number;
  description?: string;
}

interface ZoneDialogFormProps {
  branchIdProp?: number;
  onZoneCreated?: (zone: Zone) => void;
  onZoneUpdated?: (zone: Zone) => void;
  isEditing?: boolean;
  zoneToEdit?: Zone;
}

export default function ZoneDialogForm({
  branchIdProp,
  onZoneCreated,
  onZoneUpdated,
  isEditing = false,
  zoneToEdit,
}: ZoneDialogFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Cargar datos si está en modo edición
  useEffect(() => {
    if (isEditing && zoneToEdit && open) {
      setName(zoneToEdit.name);
      setDescription(zoneToEdit.description || "");
      setVehicleTypeId(zoneToEdit.vehicleTypeId);
      setTotalCapacity(zoneToEdit.totalCapacity);
    }
  }, [isEditing, zoneToEdit, open]);

  // Obtener tipos de vehículo
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result: ApiResponse<VehicleType[]> = await apiRequest(
          "/api/vehicleTypes",
          "GET"
        );
        if (result.success && result.data) {
          setVehicleTypes(result.data);
        } else {
          setError(result.message || "Error al cargar tipos de vehículo");
        }
      } catch (err: any) {
        console.error("Error al cargar vehicleTypes:", err);
        setError(err.message || "Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleTypes();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setVehicleTypeId(0);
    setTotalCapacity(0);
    setError(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  const vehicleOptions = vehicleTypes.map((vt) => ({
    value: vt.id.toString(),
    label: vt.name,
  }));

  // Validaciones
  const validateForm = (): boolean => {
    if (!branchIdProp && !isEditing) {
      setError("No se ha especificado la sede");
      showAlert("No se ha especificado la sede", "error");
      return false;
    }

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
    if (name.trim().length > 50) {
      setError("El nombre no puede exceder 50 caracteres");
      showAlert("El nombre no puede exceder 50 caracteres", "error");
      return false;
    }

    if (vehicleTypeId <= 0) {
      setError("Debe seleccionar un tipo de vehículo");
      showAlert("Debe seleccionar un tipo de vehículo", "error");
      return false;
    }

    if (totalCapacity <= 0) {
      setError("La capacidad debe ser mayor a 0");
      showAlert("La capacidad debe ser mayor a 0", "error");
      return false;
    }
    if (totalCapacity > 10000) {
      setError("La capacidad es demasiado grande");
      showAlert("La capacidad es demasiado grande", "error");
      return false;
    }

    if (description.length > 1000) {
      setError("La descripción es demasiado larga");
      showAlert("La descripción es demasiado larga", "error");
      return false;
    }

    return true;
  };

  // Crear nueva zona
  const onCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: CreateZoneRequest = {
      branchId: branchIdProp!,
      name: name.trim(),
      vehicleTypeId,
      totalCapacity,
      description: description.trim(),
    };

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<Zone> = await apiRequest<Zone>(
        "/api/zones",
        "POST",
        payload
      );

      if (response.success && response.data) {
        showAlert("Zona creada correctamente", "success");
        if (onZoneCreated) onZoneCreated(response.data);
        resetForm();
        setOpen(false);
      } else {
        setError(response.message || "Error al crear la zona");
        showAlert("Error al crear la zona: " + response.message, "error");
      }
    } catch (err: any) {
      console.error("Error en la creación:", err);
      const errorMessage = err.message || "Error de conexión con el servidor";
      setError(errorMessage);
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar zona existente
  const onUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!zoneToEdit) {
      setError("No se ha especificado la zona a actualizar");
      showAlert("No se ha especificado la zona a actualizar", "error");
      return;
    }

    const payload: UpdateZoneRequest = {
      name: name.trim(),
      vehicleTypeId,
      totalCapacity,
      description: description.trim(),
    };

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<Zone> = await apiRequest<Zone>(
        `/api/zones/${zoneToEdit.id}`,
        "PUT",
        payload
      );

      if (response.success && response.data) {
        showAlert("Zona actualizada correctamente", "success");
        if (onZoneUpdated) onZoneUpdated(response.data);
        resetForm();
        setOpen(false);
      } else {
        setError(response.message || "Error al actualizar la zona");
        showAlert("Error al actualizar la zona: " + response.message, "error");
      }
    } catch (err: any) {
      console.error("Error en la actualización:", err);
      const errorMessage = err.message || "Error de conexión con el servidor";
      setError(errorMessage);
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    if (isEditing) {
      onUpdateZone(e);
    } else {
      onCreateZone(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? (
          <button className="w-10 p-2 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
            <MoreVertical className="w-5 h-5" />
          </button>
        ) : (
          <Button variant="default" disabled={!branchIdProp}>
            Crear Zona
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[340px] sm:w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Zona" : "Crear Zona"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica la información de la zona."
                : "Completa los datos para crear una nueva zona en tu parqueadero."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-2">
              ⚠️ {error}
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
              placeholder="Ej. Zona A"
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
              placeholder="Ej. Zona norte del parqueadero"
            />

            {/* Tipo de vehículo */}
            <InputField
              id="vehicleTypeId"
              label="Tipo de vehículo *"
              type="select"
              value={vehicleTypeId.toString()}
              onChange={(e) => {
                setVehicleTypeId(Number(e.target.value));
                setError(null);
              }}
              options={vehicleOptions}
            />

            {/* Capacidad total */}
            <div>
              <InputField
                id="totalCapacity"
                label="Capacidad total *"
                type="number"
                value={totalCapacity.toString()}
                onChange={(e) => {
                  setTotalCapacity(Number(e.target.value));
                  setError(null);
                }}
                placeholder="Número de espacios"
              />
              {totalCapacity > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {isEditing ? "Capacidad actual" : "Se crearán"}{" "}
                  {totalCapacity} espacio(s)
                </p>
              )}
            </div>
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
                : "Crear zona"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
