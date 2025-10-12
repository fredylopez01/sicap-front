import { useState } from "react";
import { Button } from "@/components/ui/button";
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

interface Zone {
  id: number;
  name: string;
  vehicleType: string;
  totalCapacity: number;
  description?: string;
}

interface ZonaSheetProps {
  zone: Zone;
  onUpdate?: () => void; // callback para refrescar la lista de zonas
}

export default function ZonaSheet({ zone, onUpdate }: ZonaSheetProps) {
  const [description, setDescription] = useState(zone.description || "");
  const [vehicleType, setVehicleType] = useState(zone.vehicleType);
  const [totalCapacity, setTotalCapacity] = useState(zone.totalCapacity);

  const vehicleOptions = [
    { value: "Motorcycle", label: "Moto" },
    { value: "Car", label: "Automóvil" },
    { value: "Truck", label: "Camión" },
  ];

  const handleUpdate = async () => {
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
        if (onUpdate) await onUpdate();
      } else {
        alert("Error al actualizar la zona");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="p-2 rounded-md !bg-gray-200 hover:!bg-gray-300 flex items-center justify-center">
        <MoreVertical className="w-5 h-5" />
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalles de la zona</SheetTitle>
          <SheetDescription>Edita la información de la zona</SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 gap-6 px-4 mt-4">
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
            value={totalCapacity}
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
