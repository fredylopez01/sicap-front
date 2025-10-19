import { useState, useEffect } from "react";
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
import { VehicleType } from "@/interfaces/zona";
import { InputField } from "@/components/InputField/InputField";
import { showAlert } from "@/utils/alerts";

interface RequestData {
  branchId: number;
  name: string;
  vehicleTypeId: number;
  totalCapacity: number;
  description: string;
}

interface ZoneDialogFormProps {
  branchIdProp?: number;
}

export default function ZoneDialogForm({ branchIdProp }: ZoneDialogFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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
        if (result.success && result.data) setVehicleTypes(result.data);
        else setError(result.message || "Error al cargar tipos de vehículo");
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
    if (!branchIdProp) {
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

  const onCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: RequestData = {
      branchId: branchIdProp!,
      name,
      vehicleTypeId,
      totalCapacity,
      description,
    };

    try {
      setLoading(true);
      const response: ApiResponse<any> = await apiRequest(
        "/api/zones",
        "POST",
        payload
      );
      if (response.success) {
        showAlert("Zona creada correctamente", "success");
        setOpen(false);
      } else {
        showAlert("Error al crear la zona: " + response.message, "error");
      }
    } catch (err) {
      console.error("Error en la creación:", err);
      showAlert("Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form onSubmit={onCreateZone}>
        <DialogTrigger asChild>
          <Button variant="default" disabled={!branchIdProp}>
            Crear Zona
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[340px] sm:w-[400px]">
          <DialogHeader>
            <DialogTitle>Crear Zona</DialogTitle>
            <DialogDescription>
              Completa los datos para crear una nueva zona en tu parqueadero.
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
              label="Nombre"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Ej. Zona A"
            />

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

            <InputField
              id="vehicleTypeId"
              label="Tipo de vehículo"
              type="select"
              value={vehicleTypeId.toString()}
              onChange={(e) => {
                setVehicleTypeId(Number(e.target.value));
                setError(null);
              }}
              options={vehicleOptions}
            />

            <InputField
              id="totalCapacity"
              label="Capacidad total"
              type="number"
              value={totalCapacity.toString()}
              onChange={(e) => {
                setTotalCapacity(Number(e.target.value));
                setError(null);
              }}
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear zona"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
