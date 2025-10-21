export interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  department: string;
  phone: string | null;
  status: BranchStatus;
}

/**
 * Estado de la sede
 * Corresponde al enum BranchStatus en Prisma
 */
export type BranchStatus = "active" | "inactive";

/**
 * CreateBranchRequest - Datos para crear una sede
 * Usado en: POST /api/branches
 */
export interface CreateBranchRequest {
  name: string;
  address: string;
  city: string;
  department: string;
  phone?: string | null;
  status?: BranchStatus; // Opcional, default 'active'
}

/**
 * UpdateBranchRequest - Datos para actualizar una sede
 * Usado en: PUT /api/branches/:id
 */
export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  city?: string;
  department?: string;
  phone?: string | null;
  status?: BranchStatus;
}
