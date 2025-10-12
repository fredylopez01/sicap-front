// src/interfaces/zona.ts

/**
 * Zona - Representa una zona de parqueo en una sede
 * Retornada por: GET /api/zones/:branchId, POST /api/zones
 */
export interface Zone {
  id: number;
  branchId: number;
  name: string;
  vehicleTypeId: number;
  totalCapacity: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * VehicleType - Tipo de vehículo con tarifa
 * Retornado por: GET /api/vehicleTypes
 */
export interface VehicleType {
  id: number;
  name: string;
  description: string;
  hourlyRate: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * CreateZoneRequest - Datos para crear una zona
 * Usado en: POST /api/zones (requiere autenticación)
 */
export interface CreateZoneRequest {
  branchId: number;
  name: string;
  vehicleTypeId: number;
  totalCapacity: number;
  description: string;
}

/**
 * UpdateZoneRequest - Datos para actualizar una zona
 * (Endpoints de actualización aún no implementados en backend)
 */
export interface UpdateZoneRequest {
  name?: string;
  vehicleTypeId?: number;
  totalCapacity?: number;
  description?: string;
}

/**
 * ZonaDetallada - Zona con información extendida
 * Útil para vistas detalladas con información relacionada
 */
export interface ZonaDetailed extends Zone {
  vehicleType?: VehicleType;
  occupiedSpaces?: number;
  availableSpaces?: number;
  spaces?: Space[];
}

/**
 * Space - Espacio de parqueo individual
 * Retornado por: GET /api/spaces/:zoneId
 */
export interface Space {
  id: number;
  zoneId: number;
  spaceNumber: string; // Formato: Z{zoneId}-E{número}
  physicalStatus: 'available' | 'occupied' | 'maintenance' | 'reserved';
  createdAt: string;
  updatedAt: string;
}

/**
 * Branch - Información de sede
 * Retornada por: GET /api/branches/:id
 */
export interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}