import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sede } from "@/interfaces/sede"; // Asume que la interfaz Sede está definida
import "./Sedes.css"; // Importamos el archivo CSS
import { ApiResponse } from "@/interfaces";
import { apiRequest } from "@/services";
import { ChevronRight, MapPinned, MapPinPlus } from "lucide-react";

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
          <Button onClick={handleRedirectNewSede}>
            <MapPinPlus />
            Crear sede
          </Button>
        </div>
      </header>

      {/* Contenido dividido */}
      <div className="content-grid-wrapper">
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
                  <div className="sede-card-content">
                    <h3 className="sede-card-title"><MapPinned size={20} />{sede.name}</h3>
                    <div className="sede-card-address">
                      <span>{sede.address}</span>
                    </div>
                  </div>
                  <ChevronRight className="sede-card-icon" size={20} />
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && sedes.length === 0 && (
            <p className="status-message">No se encontraron sedes.</p>
          )}
      </div>
    </div>
  );
}
