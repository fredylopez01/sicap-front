import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
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
  UpdateScheduleRequest,
  DayOfWeek,
  DAY_OPTIONS,
} from "@/interfaces/Schedule";
import { InputField } from "@/components/InputField/InputField";
import { showAlert } from "@/utils/alerts";

interface ScheduleDialogFormProps {
  branchIdProp: number;
  onScheduleCreated?: (schedule: Schedule) => void;
  onScheduleUpdated?: (schedule: Schedule) => void;
  isEditing?: boolean;
  scheduleToEdit?: Schedule; // Schedule existente para editar
}

export default function ScheduleDialogForm({
  branchIdProp,
  onScheduleCreated,
  onScheduleUpdated,
  isEditing = false,
  scheduleToEdit,
}: ScheduleDialogFormProps) {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | "">("monday");
  const [openingTime, setOpeningTime] = useState<string>("");
  const [closingTime, setClosingTime] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos si está en modo edición
  useEffect(() => {
    if (isEditing && scheduleToEdit && open) {
      setDayOfWeek(scheduleToEdit.dayOfWeek);
      setIsActive(scheduleToEdit.isActive);
    }
  }, [isEditing, scheduleToEdit, open]);

  const dayOptions = DAY_OPTIONS.map((day) => ({
    value: day.value,
    label: day.label,
  }));

  const statusOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  // Validaciones
  const validateForm = (): boolean => {
    if (!isEditing && !dayOfWeek) {
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
    if (closingTime <= openingTime) {
      setError("La hora de cierre debe ser posterior a la hora de apertura");
      showAlert(
        "La hora de cierre debe ser posterior a la hora de apertura",
        "error"
      );
      return false;
    }
    if (!branchIdProp && !isEditing) {
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

  // Crear nuevo horario
  const onCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: CreateScheduleRequest = {
      branchId: branchIdProp,
      dayOfWeek: dayOfWeek as DayOfWeek,
      openingTime: openingTime,
      closingTime: closingTime,
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
        if (onScheduleCreated) onScheduleCreated(response.data);
        resetForm();
        setOpen(false);
      } else {
        setError(response.message || "Error al crear el horario");
        showAlert("Error al crear el horario: " + response.message, "error");
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

  // Actualizar horario existente
  const onUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!scheduleToEdit) {
      setError("No se ha especificado el horario a actualizar");
      showAlert("No se ha especificado el horario a actualizar", "error");
      return;
    }

    const payload: UpdateScheduleRequest = {
      openingTime: openingTime,
      closingTime: closingTime,
      isActive: isActive,
    };

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<Schedule> = await apiRequest<Schedule>(
        `/api/schedules/${scheduleToEdit.id}`,
        "PUT",
        payload
      );

      if (response.success && response.data) {
        showAlert("Horario actualizado correctamente", "success");
        if (onScheduleUpdated) onScheduleUpdated(response.data);
        resetForm();
        setOpen(false);
      } else {
        setError(response.message || "Error al actualizar el horario");
        showAlert(
          "Error al actualizar el horario: " + response.message,
          "error"
        );
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
      onUpdateSchedule(e);
    } else {
      onCreateSchedule(e);
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
        {isEditing ? (
          <button className="w-10 p-1 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
            <Ellipsis className="w-4 h-4" />
          </button>
        ) : (
          <Button variant="default">Crear Horario</Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[340px] sm:w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Horario" : "Crear Horario"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica el horario de atención."
                : "Configura el horario de atención para un día de la semana."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-2">
              ⚠️ {error}
            </div>
          )}

          <div className="grid mt-2 gap-3">
            {/* Día de la semana - Solo en modo crear */}
            {!isEditing && (
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
            )}

            {/* Mostrar día en modo edición (no editable) */}
            {isEditing && scheduleToEdit && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Día de la semana
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-gray-700 font-medium">
                  {DAY_OPTIONS.find((d) => d.value === scheduleToEdit.dayOfWeek)
                    ?.label || scheduleToEdit.dayOfWeek}
                </div>
                <p className="text-xs text-gray-500">
                  El día no se puede modificar
                </p>
              </div>
            )}

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
            {isEditing && (
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
                : "Crear horario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
