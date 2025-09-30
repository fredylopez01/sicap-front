import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sede } from "@/interfaces/sede"; // Asume que la interfaz Sede está definida
import "./Sedes.css"; // Importamos el archivo CSS
import { ApiResponse } from "@/interfaces";
import { apiRequest } from "@/services";

export default function Sedes() {
  const navigate = useNavigate();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const result: ApiResponse<Sede[]> = await apiRequest<Sede[]>(
          "/api/branches",
          "GET"
        );

        if (result.success && result.data) {
          setSedes(result.data);
        } else {
          setError(result.message || "No se pudo cargar la lista de sedes.");
        }
      } catch (err: any) {
        console.error("Error fetching sedes:", err);
        setError(
          err.message || "Error de conexión con el servidor. Intenta recargar."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
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
          <div className="map-placeholder">
            <iframe
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15878.077209303038!2d-73.38541783477839!3d5.534271032849081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a71e619175409%3A0x8979d381b1062f6b!2sTunja%2C%20Boyac%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sus!4v1678825200000!5m2!1ses!2sus"
              width="100%" // Lo hacemos 100% para que sea responsivo dentro de su contenedor
              height="100%"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Tunja, Boyacá"
            ></iframe>
          </div>
        </section>

        {/* Panel lateral */}
        <aside className="sidebar-panel">
          <h2 className="panel-title">Lista de sedes</h2>
          {loading && <p className="status-message">Cargando sedes...</p>}
          {error && <p className="status-message error">{error}</p>}

          {!loading && !error && (
            <ul className="sede-list">
              {sedes.map((sede) => (
                <li
                  key={sede.id}
                  className="sede-list-item"
                  onClick={() => handleRedirectSede(sede.id)}
                >
                  {sede.name}
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && sedes.length === 0 && (
            <p className="status-message">No se encontraron sedes.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
