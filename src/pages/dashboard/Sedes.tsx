import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import dataExample from "./sedesExample.json";
import { useEffect, useState } from "react";
import { Sede } from "@/interfaces/sede";


export default function Sedes() {
  const navigate = useNavigate();
  const [sedes, setSedes] = useState<Sede[]>([]);


  useEffect(() => {
    // Simulación de respuesta del backend
    const response: Sede[] = [
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

    setSedes(response);
  }, []);

  const handleRedirectNewSede = () => {
    navigate("/dashboard/sedes/new"); 
  };

  const handleRedirectSede = (id: number) => {
    navigate(`/dashboard/sedes/${id}`); 
  };



  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Sedes</h1>
            <p className="text-gray-600">Gestión de las sedes de la organización</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button onClick={handleRedirectNewSede}>Crear sede</Button>
        </div>
       </header>


      {/* Contenido dividido */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Panel principal */}
        <section className="col-span-2 bg-white rounded-xl shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Mapa / Visualización</h2>
          <div className="flex-1 bg-gray-100 rounded-lg"></div>
        </section>

        {/* Panel lateral */}
        <aside className="bg-white rounded-xl shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Lista de sedes</h2>
          <ul className="space-y-2 flex-1 overflow-y-auto">
            {sedes.map((sede) => (
                <li
                key={sede.id_sede}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                onClick={() => handleRedirectSede(sede.id_sede)}
                >
                {sede.nombre}
                </li>
            ))}
          </ul>

        </aside>
      </div>
    </div>
  )
}
