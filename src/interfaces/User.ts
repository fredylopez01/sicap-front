export interface User {
  id: number;
  cedula: string;
  names: string;
  lastNames: string;
  phone: string;
  email: string;
  branchId: number;
  userHash: string;
  role: "ADMIN" | "CONTROLLER";
  isActive: boolean;
  hireDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lockUntil: string | null;
  loginAttempts: number;
  lastLogin: string | null;
}
