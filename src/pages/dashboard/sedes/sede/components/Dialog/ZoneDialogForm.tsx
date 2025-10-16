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

export default function ZoneDialogForm({
  branchIdProp,
}: {
  branchIdProp?: number;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Obtener tipos de vehículo
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

  //Opciones para el select
  const vehicleOptions = vehicleTypes.map((vt) => ({
    value: vt.id.toString(),
    label: vt.name,
  }));

  //Crear zona
  const onCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: RequestData = {
      branchId: branchIdProp ?? 0,
      name,
      vehicleTypeId,
      totalCapacity,
      description,
    };

    try {
      const response: ApiResponse<any> = await apiRequest(
        "/api/zones",
        "POST",
        payload
      );

      if (response.success) {
        showAlert("Zona creada correctamente", "success");
      } else {
        showAlert("Error al crear la zona: " + response.message, "error");
      }
    } catch (error) {
      console.error("Error en la creación:", error);
      showAlert("Error de conexión con el servidor", "error");
    }
  };

  return (
    <Dialog>
      <form onSubmit={onCreateZone}>
        <DialogTrigger asChild>
          <Button variant="default">Crear Zona</Button>
        </DialogTrigger>

        <DialogContent className="w-[340px] sm:w-[400px]">
          <DialogHeader>
            <DialogTitle>Crear Zona</DialogTitle>
            <DialogDescription>
              Completa los datos para crear una nueva zona en tu parqueadero.
            </DialogDescription>
          </DialogHeader>

          <div className="grid mt-2">
            <InputField
              id="name"
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Zona A"
            />

            <InputField
              id="description"
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Zona norte del parqueadero"
            />

            <InputField
              id="vehicleTypeId"
              label="Tipo de vehículo"
              type="select"
              value={vehicleTypeId.toString()}
              onChange={(e) => setVehicleTypeId(Number(e.target.value))}
              options={vehicleOptions}
            />

            <InputField
              id="totalCapacity"
              label="Capacidad total"
              type="number"
              value={totalCapacity.toString()}
              onChange={(e) => setTotalCapacity(Number(e.target.value))}
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading} onClick={onCreateZone}>
              {loading ? "Creando..." : "Crear zona"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
