export interface Schedule {
  id: number;
  branchId: number;
  scheduleType?: "DIURNO" | "NOCTURNO";
  dayOfWeek?: DayOfWeek;
  openingTime: string; // Formato: "HH:mm:ss"
  closingTime: string; // Formato: "HH:mm:ss"
  nightRate?: number | string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Día de la semana
 * Corresponde al enum DayOfWeek en Prisma
 */
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/**
 * CreateScheduleRequest - Crear un horario individual
 * Usado en: POST /api/schedules
 */
export interface CreateScheduleRequest {
  branchId: number;
  dayOfWeek: DayOfWeek;
  openingTime: string; // "HH:mm" o "HH:mm:ss"
  closingTime: string; // "HH:mm" o "HH:mm:ss"
  isActive?: boolean;
}

/**
 * CreateMultipleSchedulesRequest - Crear múltiples horarios
 * Usado en: POST /api/schedules/batch
 */
export interface CreateMultipleSchedulesRequest {
  branchId: number;
  schedules: Array<{
    dayOfWeek: DayOfWeek;
    openingTime: string;
    closingTime: string;
    isActive?: boolean;
  }>;
}

/**
 * UpdateScheduleRequest - Actualizar un horario
 * Usado en: PUT /api/schedules/:scheduleId
 */
export interface UpdateScheduleRequest {
  openingTime?: string;
  closingTime?: string;
  isActive?: boolean;
}

/**
 * ScheduleFormData - Datos del formulario
 * Para uso interno en componentes
 */
export interface ScheduleFormData {
  dayOfWeek: DayOfWeek | "";
  openingTime: string; // "HH:mm"
  closingTime: string; // "HH:mm"
  isActive: boolean;
}

/**
 * Mapa de traducción de días
 */
export const DAY_NAMES: Record<DayOfWeek, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

/**
 * Opciones de días para selects
 */
export const DAY_OPTIONS = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
] as const;
