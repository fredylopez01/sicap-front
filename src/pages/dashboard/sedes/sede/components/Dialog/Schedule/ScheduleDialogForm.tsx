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
  Schedule,
  CreateScheduleRequest,
  DayOfWeek,
  DAY_OPTIONS,
} from "@/interfaces/Schedule";
import { InputField } from "@/components/InputField/InputField";
import { showAlert } from "@/utils/alerts";

interface ScheduleDialogFormProps {
  branchIdProp?: number;
  onScheduleCreated?: (schedule: Schedule) => void;
}

export default function ScheduleDialogForm({
  branchIdProp,
  onScheduleCreated,
}: ScheduleDialogFormProps) {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | "">("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opciones para el select de día
  const dayOptions = DAY_OPTIONS.map((day) => ({
    value: day.value,
    label: day.label,
  }));

  // Opciones para el select de estado
  const statusOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  // Validaciones
  const validateForm = (): boolean => {
    if (!dayOfWeek) {
      setError("El día de la semana es requerido");
      showAlert("El día de la semana es requerido", "error");
      return false;
    }

    if (!openingTime) {
      setError("La hora de apertura es requerida");
      showAlert("La hora de apertura es requerida", "error");
      return false;
    }

    if (!closingTime) {
      setError("La hora de cierre es requerida");
      showAlert("La hora de cierre es requerida", "error");
      return false;
    }

    // Validar que la hora de cierre sea mayor que la de apertura
    if (closingTime <= openingTime) {
      setError("La hora de cierre debe ser posterior a la hora de apertura");
      showAlert(
        "La hora de cierre debe ser posterior a la hora de apertura",
        "error"
      );
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
    setDayOfWeek("");
    setOpeningTime("");
    setClosingTime("");
    setIsActive(true);
    setError(null);
  };

  // Crear horario
  const onCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: CreateScheduleRequest = {
      branchId: branchIdProp ?? 0,
      dayOfWeek: dayOfWeek as DayOfWeek,
      openingTime: `${openingTime}:00`, // Convertir "HH:mm" a "HH:mm:ss"
      closingTime: `${closingTime}:00`,
    };

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<Schedule> = await apiRequest<Schedule>(
        "/api/schedules",
        "POST",
        payload
      );

      if (response.success && response.data) {
        showAlert("Horario creado correctamente", "success");

        // Callback para actualizar la lista en el componente padre
        if (onScheduleCreated) {
          onScheduleCreated(response.data);
        }

        // Limpiar y cerrar
        resetForm();
        setOpen(false);
      } else {
        setError(response.message || "Error al crear el horario");
        showAlert("Error al crear el horario: " + response.message, "error");
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
        <Button variant="default">Crear Horario</Button>
      </DialogTrigger>

      <DialogContent className="w-[340px] sm:w-[400px]">
        <form onSubmit={onCreateSchedule}>
          <DialogHeader>
            <DialogTitle>Crear Horario</DialogTitle>
            <DialogDescription>
              Configura el horario de atención para un día de la semana.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-2">
              ⚠️ {error}
            </div>
          )}

          <div className="grid mt-2 gap-3">
            {/* Día de la semana */}
            <InputField
              id="dayOfWeek"
              label="Día de la semana *"
              type="select"
              value={dayOfWeek}
              onChange={(e) => {
                setDayOfWeek(e.target.value as DayOfWeek);
                setError(null);
              }}
              options={dayOptions}
            />

            {/* Hora de apertura */}
            <InputField
              id="openingTime"
              label="Hora de apertura *"
              type="time"
              value={openingTime}
              onChange={(e) => {
                setOpeningTime(e.target.value);
                setError(null);
              }}
            />

            {/* Hora de cierre */}
            <InputField
              id="closingTime"
              label="Hora de cierre *"
              type="time"
              value={closingTime}
              onChange={(e) => {
                setClosingTime(e.target.value);
                setError(null);
              }}
            />

            {/* Preview del horario */}
            {openingTime && closingTime && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-sm">
                📅 Horario: {openingTime} - {closingTime}
              </div>
            )}

            {/* Estado */}
            <InputField
              id="isActive"
              label="Estado"
              type="select"
              value={isActive.toString()}
              onChange={(e) => {
                setIsActive(e.target.value === "true");
                setError(null);
              }}
              options={statusOptions}
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear horario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
