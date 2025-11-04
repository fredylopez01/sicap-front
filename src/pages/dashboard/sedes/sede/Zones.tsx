import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/interfaces";
import { Zone, VehicleType, Branch } from "@/interfaces/zona";
import { apiRequest } from "@/services";
import Header from "./components/Header/Header";
import ZonesContent from "./components/ZonesContent/ZonesContent";
import Schedule from "./components/ScheduleContent/ScheduleContent";
import VehicleTypesContent from "./components/VehicleTypesContent/VehicleTypesContent";
import { showAlert, showConfirmAlert } from "@/utils/alerts";

import "./Zones.css";

export default function Zonas() {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId: string }>();

  const [zones, setZonas] = useState<Zone[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      if (!branchId) {
        setError("ID de sede no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Cargar todas las sedes y filtrar la específica
        const branchesResult: ApiResponse<Branch[]> = await apiRequest<
          Branch[]
        >("/api/branches", "GET");

        if (branchesResult.success && branchesResult.data) {
          const currentBranch = branchesResult.data.find(
            (b) => b.id === Number(branchId)
          );

          if (currentBranch) {
            setBranch(currentBranch);
          } else {
            setError("Sede no encontrada");
            setLoading(false);
            return;
          }
        }

        // 2. Cargar zonas de la sede
        const zonasResult: ApiResponse<Zone[]> = await apiRequest<Zone[]>(
          `/api/zones/${branchId}`,
          "GET"
        );

        if (zonasResult.success && zonasResult.data) {
          setZonas(zonasResult.data);
        } else {
          setError(zonasResult.message || "No se pudieron cargar las zonas.");
        }

        // 3. Cargar tipos de vehículo
        const vehicleTypesResult: ApiResponse<VehicleType[]> = await apiRequest<
          VehicleType[]
        >("/api/vehicleTypes", "GET");

        if (vehicleTypesResult.success && vehicleTypesResult.data) {
          setVehicleTypes(vehicleTypesResult.data);
        }
      } catch (err: any) {
        console.error("Error al cargar datos:", err);
        setError(
          err.message || "Error de conexión. Por favor, recarga la página."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [branchId]);

  // Función para eliminar la sede
  const handleDeleteBranch = (id: number) => {
    showConfirmAlert(
      "Eliminar sede",
      "¿Deseas eliminar esta sede? Esta acción no se puede deshacer.",
      "Eliminar",
      async () => {
        try {
          setLoading(true);
          const response: ApiResponse<null> = await apiRequest(
            `/api/branches/${id}`,
            "DELETE"
          );

          if (response.success) {
            navigate("/dashboard/sedes"); // Redirige a la lista de sedes
            showAlert("Sede eliminada correctamente", "success");
          } else {
            showAlert(response.message || "Error al eliminar la sede", "error");
          }
        } catch (err: any) {
          console.error("Error al eliminar sede:", err);
          showAlert(
            err.message || "Error de conexión al eliminar la sede",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Obtener nombre del tipo de vehículo
  const getVehicleTypeName = (vehicleTypeId: number): string => {
    const type = vehicleTypes.find((vt) => vt.id === vehicleTypeId);
    return type ? type.name : "Tipo no disponible";
  };

  // Obtener tarifa del tipo de vehículo
  const getVehicleTypeRate = (vehicleTypeId: number): number => {
    const type = vehicleTypes.find((vt) => vt.id === vehicleTypeId);
    return type ? type.hourlyRate : 0;
  };

  const handleRedirectNewZone = () => {
    navigate(`/dashboard/sedes/${branchId}/zonas/new`);
  };

  const handleRedirectZone = (zoneId: number) => {
    navigate(`/dashboard/sedes/${branchId}/zonas/${zoneId}`);
  };

  const handleBack = () => {
    navigate("/dashboard/sedes");
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="main-container">
      <div className="header-container">
        {/* Header */}
        <Header
          branch={branch}
          handleBack={handleBack}
          handleRedirectNewZone={handleRedirectNewZone}
          zonasCount={zones.length}
          onDeleteBranch={handleDeleteBranch}
        />
      </div>

      <div className="vehicleTypes-container">
        <VehicleTypesContent></VehicleTypesContent>
      </div>

      <div className="content-container">
        <div className="zones-container">
          {/* Contenido */}
          <ZonesContent
            branch={branch}
            zones={zones}
            loading={loading}
            error={error}
            handleRedirectNewZone={handleRedirectNewZone}
            handleRedirectZone={handleRedirectZone}
            getVehicleTypeName={getVehicleTypeName}
            getVehicleTypeRate={getVehicleTypeRate}
            formatDate={formatDate}
          />
        </div>
        <div className="schedule-container">
          <Schedule></Schedule>
        </div>
      </div>
    </div>
  );
}
