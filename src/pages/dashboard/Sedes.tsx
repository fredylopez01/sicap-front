import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sede } from "@/interfaces/sede";
import "./Sedes.css";
import { ApiResponse } from "@/interfaces";
import { apiRequest } from "@/services";
import { ChevronRight, Building2, MapPin, MapPinPlus } from "lucide-react";

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
            Gestión y administración de las sedes de la organización
          </p>
        </div>

        <div className="header-actions">
          <Button onClick={handleRedirectNewSede}>
            <MapPinPlus size={18} />
            Crear sede
          </Button>
        </div>
      </header>

      {/* Content */}
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
                  <div className="sede-card-header">
                    <div className="sede-icon-wrapper">
                      <Building2 size={24} />
                    </div>
                    <div className="sede-card-info">
                      <h3 className="sede-card-title">{sede.name}</h3>
                      {sede.city && (
                        <span className="sede-card-city">
                          📍 {sede.city}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sede-card-address">
                    <MapPin size={16} />
                    <span>{sede.address}</span>
                  </div>
                </div>

                <div className="sede-card-footer">
                  <div className="sede-card-action">
                    <span>Ver detalles</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
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
