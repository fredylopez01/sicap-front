import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Zone, VehicleType } from "@/interfaces/zona";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MoreVertical } from "lucide-react";
import { InputField } from "@/components/InputField/InputField";
import { apiRequest } from "@/services";
import { ApiResponse } from "@/interfaces";

interface ZonaSheetProps {
  zone: Zone;
  vehicleTypeName: string;
  onUpdateZone?: (id: number) => void;
}

export default function ZonaSheet({
  zone,
  vehicleTypeName,
  onUpdateZone,
}: ZonaSheetProps) {
  const [description, setDescription] = useState(zone.description || "");
  const [vehicleType, setVehicleType] = useState(vehicleTypeName);
  const [totalCapacity, setTotalCapacity] = useState(zone.totalCapacity);

  //Nuevo estado para los tipos de vehículo
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Cargar los tipos de vehículo desde el backend
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const result: ApiResponse<VehicleType[]> = await apiRequest<
          VehicleType[]
        >("/api/vehicleTypes", "GET");

        if (result.success && result.data) {
          setVehicleTypes(result.data);
        } else {
          setError(result.message || "Error al cargar los tipos de vehículo.");
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

  //Convertir la respuesta del backend a opciones para el select
  const vehicleOptions = vehicleTypes.map((vt) => ({
    value: vt.name,
    label: vt.name,
  }));

  const handleUpdate = async () => {
    /*
    const payload = {
      description,
      vehicleType,
      totalCapacity,
    };

    try {
      const res = await fetch(`/api/zones/${zone.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Zona actualizada correctamente");
        if (onUpdateZone) await onUpdateZone(zone.id);
      } else {
        alert("Error al actualizar la zona");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
    */
  };

  return (
    <Sheet>
      <SheetTrigger className="w-10 p-2 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
        <MoreVertical className="w-5 h-5" />
      </SheetTrigger>

      {/*Aparece desde la derecha y con tamaño controlado */}
      <SheetContent side="right" className="w-[350px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Detalles de la zona</SheetTitle>
          <SheetDescription>Edita la información de la zona</SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-4 px-4 mt-4">
          <InputField
            id="description"
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <InputField
            id="vehicleType"
            label="Tipo de vehículo"
            type="select"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
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

        <SheetFooter className="mt-6 flex flex-col gap-3">
          <Button onClick={handleUpdate} className="w-full">
            Guardar
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cerrar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
