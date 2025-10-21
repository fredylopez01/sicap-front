export interface Sede {
  id: number;
  name: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  state: "activo" | "inactivo"; // ENUM
}
