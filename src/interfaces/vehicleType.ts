// src/interfaces/vehicleType.ts
import { Zone } from "./zona";
import { Branch } from "./zona";
/**
 * VehicleType - Tipo de vehículo con tarifas
 * Tabla: tipos_vehiculos
 */
export interface VehicleType {
  id: number;
  name: string;
  description: string | null;
  hourlyRate: number;
  status: VehicleTypeStatus;
  creationDate: string;
  branchId: number;
}

/**
 * Estado del tipo de vehículo
 * Corresponde al enum GenericStatus en Prisma
 */
export type VehicleTypeStatus = "active" | "inactive";

/**
 * CreateVehicleTypeRequest - Datos para crear un tipo de vehículo
 * Usado en: POST /api/vehicleTypes
 */
export interface CreateVehicleTypeRequest {
  name: string;
  description?: string | null;
  hourlyRate: number;
  branchId: number;
  status?: VehicleTypeStatus;
}

/**
 * UpdateVehicleTypeRequest - Datos para actualizar un tipo de vehículo
 * Usado en: PUT /api/vehicleTypes/:id
 */
export interface UpdateVehicleTypeRequest {
  name?: string;
  description?: string | null;
  hourlyRate?: number;
  status?: VehicleTypeStatus;
}

/**
 * VehicleTypeWithRelations - Tipo de vehículo con relaciones incluidas
 * Útil para vistas detalladas
 */
export interface VehicleTypeWithRelations extends VehicleType {
  zones?: Zone[];
  branch?: Branch;
  _count?: {
    zones: number;
  };
}

/**
 * VehicleTypeFormData - Datos del formulario
 * Para uso interno en componentes
 */
export interface VehicleTypeFormData {
  name: string;
  description: string;
  hourlyRate: string | number;
  branchId: number;
  status: VehicleTypeStatus;
}
