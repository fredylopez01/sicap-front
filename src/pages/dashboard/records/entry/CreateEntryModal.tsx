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
import { Space, Zone } from "@/interfaces/zona";
import { InputField } from "@/components/InputField/InputField";
import { showAlert } from "@/utils/alerts";
import "./CreateEntryModal.css";
import { ArrowDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RequestData {
  licensePlate: string;
  spaceId: number;
}

export function CreateEntryModal() {
  const { user } = useAuth();
  const [licensePlate, setLicensePlate] = useState("");
  const [zoneId, setZoneId] = useState(0);
  const [spaceId, setSpaceId] = useState(0);

  const [zones, setZones] = useState<Zone[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Obtener zonas
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const result: ApiResponse<Zone[]> = await apiRequest(
          `/api/zones/${user?.branchId}`,
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
        setLoading(false);
      }
    };

    fetchVehicleTypes();
  }, []);

  //Obtener zonas
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result: ApiResponse<Space[]> = await apiRequest(
          `/api/spaces/${zoneId}`,
          "GET"
        );

        if (result.success && result.data) {
          setSpaces(result.data);
          if (result.data.length > 0) {
            setSpaceId(result.data[0].id);
          } else {
            setSpaceId(0);
          }
        } else {
          setError(result.message || "Error al cargar zonas");
        }
      } catch (err: any) {
        console.error("Error al cargar zonas:", err);
        setError(err.message || "Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleTypes();
  }, [zoneId, zones]);

  //Opciones para el select
  const zonesOptions = zones.map((zone) => ({
    value: zone.id.toString(),
    label: zone.name,
  }));

  const spaceOptions = spaces.map((space) => ({
    value: space.id.toString(),
    label:
      space.spaceNumber +
      "  " +
      (space.physicalStatus === "available" ? "Disponible" : "No disponible"),
  }));

  //Crear zona
  const onCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (licensePlate.trim().length >= 4 && licensePlate.trim().length <= 8) {
      showAlert(
        "La placa es obligatoria y debe tener una longitud de entre 4 y 8 dígitos"
      );
    } else {
      const payload: RequestData = {
        licensePlate,
        spaceId,
      };

      try {
        const response: ApiResponse<any> = await apiRequest(
          "/api/vehicleRecords/entry",
          "POST",
          payload
        );

        if (response.success) {
          showAlert("Entrada registrada correctamente", "success");
        } else {
          showAlert("Error al registrar entrada: " + response.message, "error");
        }
      } catch (error) {
        console.error("Error en la creación:", error);
        showAlert("Error de conexión con el servidor", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog>
      <form onSubmit={onCreateZone}>
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="records-button-header btn-create-entry"
            size={"default"}
          >
            <ArrowDown /> Registrar entrada
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[340px] sm:w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrar entrada</DialogTitle>{" "}
            <DialogDescription>
              Completa los datos para registrar la entrada.
            </DialogDescription>
          </DialogHeader>

          <div className="grid mt-2">
            <InputField
              id="licensePlate"
              label="Placa"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="Ej. ABC123"
            />

            <InputField
              id="zoneId"
              label="Zona"
              type="select"
              value={zoneId.toString()}
              onChange={(e) => setZoneId(Number(e.target.value))}
              options={zonesOptions}
            />

            <InputField
              id="spaceId"
              label="Espacio"
              type="select"
              value={spaceId.toString()}
              onChange={(e) => setSpaceId(Number(e.target.value))}
              options={spaceOptions}
            />
            <span>{error}</span>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading} onClick={onCreateZone}>
              {loading ? "Creando..." : "Registrar entrada"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
