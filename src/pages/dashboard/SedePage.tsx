import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sede } from "@/interfaces/sede";

// Simulación de datos (puedes reemplazar con fetch al backend)
const mockSedes: Sede[] = [
  {
    id_sede: 1,
    nombre: "Sede Principal",
    direccion: "Calle 123 #45-67",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    telefono: "3101234567",
    horario_apertura: "08:00:00",
    horario_cierre: "18:00:00",
    estado: "activo",
  },
  {
    id_sede: 2,
    nombre: "Sede Norte",
    direccion: "Carrera 10 #20-30",
    ciudad: "Medellín",
    departamento: "Antioquia",
    telefono: "6041234567",
    horario_apertura: "09:00:00",
    horario_cierre: "17:00:00",
    estado: "inactivo",
  },
];

export default function SedePage() {
  const { id } = useParams<{ id: string }>(); // id viene como string
  const [sede, setSede] = useState<Sede | null>(null);

  useEffect(() => {
    if (id) {
      const found = mockSedes.find((s) => s.id_sede === Number(id));
      setSede(found || null);
    }
  }, [id]);

  if (!sede) {
    return <p className="text-center text-gray-600">Sede no encontrada</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {sede.nombre}
      </h1>
      <ul className="space-y-2 text-gray-700">
        <li><strong>Dirección:</strong> {sede.direccion}</li>
        <li><strong>Ciudad:</strong> {sede.ciudad}</li>
        <li><strong>Departamento:</strong> {sede.departamento}</li>
        <li><strong>Teléfono:</strong> {sede.telefono}</li>
        <li><strong>Horario Apertura:</strong> {sede.horario_apertura}</li>
        <li><strong>Horario Cierre:</strong> {sede.horario_cierre}</li>
        <li><strong>Estado:</strong> {sede.estado}</li>
      </ul>
    </div>
  );
}
