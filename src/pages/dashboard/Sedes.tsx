import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sede } from "@/interfaces/sede"; // Asume que la interfaz Sede está definida
import "./Sedes.css"; // Importamos el archivo CSS

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
    <div className="sedes-container">
      {/* Header */}
      <header className="sedes-header">
        <div className="header-info">
          <h1 className="header-title">Sedes</h1>
          <p className="header-subtitle">
            Gestión de las sedes de la organización
          </p>
        </div>

        <div className="header-actions">
          <Button onClick={handleRedirectNewSede}>Crear sede</Button>
        </div>
      </header>

      {/* Contenido dividido */}
      <div className="content-grid-wrapper">
        {/* Panel principal */}
        <section className="main-panel">
          <h2 className="panel-title">Mapa / Visualización</h2>
          <div className="map-placeholder"></div>
        </section>

        {/* Panel lateral */}
        <aside className="sidebar-panel">
          <h2 className="panel-title">Lista de sedes</h2>
          <ul className="sede-list">
            {sedes.map((sede) => (
              <li
                key={sede.id_sede}
                className="sede-list-item"
                onClick={() => handleRedirectSede(sede.id_sede)}
              >
                {sede.nombre}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
