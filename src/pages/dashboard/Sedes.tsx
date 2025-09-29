import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";


export default function Sedes() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dashboard/sedes/new"); 
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
            <Button onClick={handleRedirect}>Crear sede</Button>
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
            <li className="p-2 bg-gray-100 rounded">Sede Norte</li>
            <li className="p-2 bg-gray-100 rounded">Sede Centro</li>
            <li className="p-2 bg-gray-100 rounded">Sede Sur</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
