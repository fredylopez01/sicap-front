import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiResponse } from "@/interfaces";
import { VehicleType } from "@/interfaces/vehicleType";
import { apiRequest } from "@/services";
import VehicleTypeDialogForm from "../Dialog/VehicleType/VehicleTypeDialogForm";
import { showConfirmAlert, showAlert } from "@/utils/alerts";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./VechicleTypesContent.css";

export default function VehicleTypesContent() {
  const { branchId } = useParams<{ branchId: string }>();
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tipos de vehículo al montar el componente
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const result: ApiResponse<VehicleType[]> = await apiRequest<
          VehicleType[]
        >("/api/vehicleTypes", "GET");

        if (result.success && result.data) {
          const filteredTypes = branchId
            ? result.data.filter((vt) => vt.branchId === Number(branchId))
            : result.data;

          setVehicleTypes(filteredTypes);
        } else {
          setError(
            result.message || "No se pudieron cargar los tipos de vehículo."
          );
        }
      } catch (err: any) {
        console.error("Error al cargar tipos de vehículo:", err);
        setError(
          err.message || "Error de conexión. Por favor, recarga la página."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleTypes();
  }, [branchId]);

  const handleDeleteClick = (vehicleType: VehicleType) => {
    showConfirmAlert(
      "Eliminar tipo de vehículo",
      `¿Está seguro de eliminar el tipo de vehículo "${vehicleType.name}"? Esta acción no se puede deshacer.`,
      "Eliminar",
      async () => {
        try {
          setLoading(true);
          setError(null);

          const result: ApiResponse<null> = await apiRequest(
            `/api/vehicleTypes/${vehicleType.id}`,
            "DELETE"
          );

          if (result.success) {
            setVehicleTypes((prev) =>
              prev.filter((vt) => vt.id !== vehicleType.id)
            );
            showAlert("Tipo de vehículo eliminado exitosamente", "success");
          } else {
            setError(
              result.message || "No se pudo eliminar el tipo de vehículo."
            );
            showAlert(
              result.message || "Error al eliminar el tipo de vehículo"
            );
          }
        } catch (err: any) {
          console.error("Error al eliminar tipo de vehículo:", err);
          setError(
            err.message || "Error de conexión. Por favor, intente de nuevo."
          );
          showAlert(err.message || "Error de conexión", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Callback cuando se crea un nuevo tipo de vehículo
  const handleVehicleTypeCreated = (newType: VehicleType) => {
    setVehicleTypes((prev) => [...prev, newType]);
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Formatear precio
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="vehicle-types-wrapper">
      <div className="vehicle-types-header">
        <div>
          <h2 className="vehicle-types-title">Tipos de Vehículo</h2>
          <p className="vehicle-types-subtitle">
            {vehicleTypes.length} tipo(s) registrado(s)
          </p>
        </div>
        <VehicleTypeDialogForm
          branchIdProp={branchId ? Number(branchId) : undefined}
          onVehicleTypeCreated={handleVehicleTypeCreated}
        />
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="loading-state">
          <div className="spinner-vehicle-type "></div>
          <p>Cargando tipos de vehículo...</p>
        </div>
      )}

      {/* Estado de error */}
      {error && !loading && (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p className="error-message">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {!loading && !error && vehicleTypes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No hay tipos de vehículo</h3>
          <p>Crea el primer tipo de vehículo para esta sede</p>
        </div>
      )}

      {/* Lista de tipos de vehículo */}
      {!loading && !error && vehicleTypes.length > 0 && (
        <div className="vehicle-types-grid">
          {vehicleTypes.map((vehicleType) => (
            <div key={vehicleType.id} className="vehicle-type-card">
              <div className="vehicle-type-header">
                <h3 className="vehicle-type-name">{vehicleType.name}</h3>
                <VehicleTypeDialogForm
                  isEditing={true}
                  vehicleTypeToEdit={vehicleType}
                  onVehicleTypeUpdated={(updatedType) => {
                    setVehicleTypes((prev) =>
                      prev.map((vt) =>
                        vt.id === updatedType.id ? updatedType : vt
                      )
                    );
                  }}
                  branchIdProp={branchId ? Number(branchId) : undefined}
                />
                <Button
                  onClick={() => handleDeleteClick(vehicleType)}
                  className="small-icon-button"
                  variant={"default"}
                >
                  <Trash />
                </Button>
              </div>

              <p className="vehicle-type-description">
                {vehicleType.description || "Sin descripción"}
              </p>

              <div className="vehicle-type-info">
                <div className="info-row">
                  <span className="info-label">Tarifa por hora:</span>
                  <span className="info-value price">
                    {formatPrice(vehicleType.hourlyRate)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Creado:</span>
                  <span className="info-value">
                    {formatDate(vehicleType.creationDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
