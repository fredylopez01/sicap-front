export interface Sede {
  id_sede: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  telefono: string;
  horario_apertura: string; // formato HH:MM:SS
  horario_cierre: string;   // formato HH:MM:SS
  estado: "activo" | "inactivo"; // ENUM
}
