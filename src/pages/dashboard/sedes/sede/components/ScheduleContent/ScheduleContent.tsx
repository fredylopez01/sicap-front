import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiResponse } from "@/interfaces";
import { Schedule, DAY_NAMES, DayOfWeek } from "@/interfaces/Schedule";
import { apiRequest } from "@/services";
import ScheduleDialogForm from "../Dialog/Schedule/ScheduleDialogForm";
import "./ScheduleContent.css";

export default function ScheduleContent() {
  const { branchId } = useParams<{ branchId: string }>();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar horarios al montar el componente
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!branchId) {
        setError("ID de sede no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result: ApiResponse<Schedule[]> = await apiRequest<Schedule[]>(
          `/api/schedules/branch/${branchId}`,
          "GET"
        );

        if (result.success && result.data) {
          setSchedules(sortSchedulesByDay(result.data));
        } else {
          setError(result.message || "No se pudieron cargar los horarios.");
        }
      } catch (err: any) {
        console.error("Error al cargar horarios:", err);
        setError(
          err.message || "Error de conexión. Por favor, recarga la página."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [branchId]);

  // Callback cuando se crea un nuevo horario
  const handleScheduleCreated = (newSchedule: Schedule) => {
    setSchedules((prev) => sortSchedulesByDay([...prev, newSchedule]));
  };

  // Ordenar horarios por día de la semana
  const sortSchedulesByDay = (schedules: Schedule[]): Schedule[] => {
    const dayOrder: DayOfWeek[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    return [...schedules].sort((a, b) => {
      return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
    });
  };

  // Formatear hora de "HH:mm:ss" a "HH:mm"
  const formatTime = (time: string): string => {
    return time.substring(0, 5);
  };

  // Formatear rango de horario
  const formatTimeRange = (schedule: Schedule): string => {
    return `${formatTime(schedule.openingTime)} - ${formatTime(
      schedule.closingTime
    )}`;
  };

  // Obtener color del estado
  const getStatusColor = (isActive: boolean): string => {
    return isActive ? "status-active" : "status-inactive";
  };

  // Obtener texto del estado
  const getStatusText = (isActive: boolean): string => {
    return isActive ? "Activo" : "Inactivo";
  };

  return (
    <div className="schedule-wrapper">
      <div className="schedule-header">
        <div>
          <h2 className="schedule-title">Horarios</h2>
          <p className="schedule-subtitle">
            {schedules.length} de 7 días configurados
          </p>
        </div>
        <ScheduleDialogForm
          branchIdProp={branchId ? Number(branchId) : undefined}
          onScheduleCreated={handleScheduleCreated}
        />
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      )}

      {/* Estado de error */}
      {error && !loading && (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p className="error-message">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {!loading && !error && schedules.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No hay horarios configurados</h3>
          <p>Crea el primer horario para esta sede</p>
        </div>
      )}

      {/* Lista de horarios */}
      {!loading && !error && schedules.length > 0 && (
        <div className="schedule-grid">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="schedule-card">
              <div className="schedule-card-header">
                <h3 className="schedule-day">
                  {DAY_NAMES[schedule.dayOfWeek]}
                </h3>
                <span
                  className={`schedule-status ${getStatusColor(
                    schedule.isActive
                  )}`}
                >
                  {getStatusText(schedule.isActive)}
                </span>
              </div>

              <div className="schedule-info">
                <div className="info-row">
                  <span className="info-icon">🕐</span>
                  <span className="info-value time">
                    {formatTimeRange(schedule)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
