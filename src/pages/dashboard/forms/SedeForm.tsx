import { useForm } from "react-hook-form";
import { showAlert } from "../../../utils/alerts";
import ErrorSpan from "@/components/ui/errorSpan";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react"; // Importado para el estado de carga
import "./SedeForm.css";
import { ApiResponse } from "@/interfaces";
import { apiRequest } from "@/services/api";

interface FormData {
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  telefono: string;
  horario_apertura: string;
  horario_cierre: string;
}

export default function SedeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado de carga para el botón

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    // Mapeo y preparación de la data (opcional, dependiendo de tu backend)
    const sedeData = {
      name: data.nombre,
      address: data.direccion,
      city: data.ciudad,
      department: data.departamento,
      phone: data.telefono,
    };

    console.log(sedeData);

    try {
      // Llamada al backend para crear la sede
      const result: ApiResponse<any> = await apiRequest<any>(
        "/api/branches/",
        "POST",
        sedeData
      );

      console.log("Respuesta de la API:", result);

      if (result.success) {
        showAlert(
          result.message || "¡Nueva sede creada exitosamente!",
          "success"
        );

        // Limpiar formulario y redirigir
        reset();
        navigate("/dashboard/sedes");
      } else {
        // Muestra el mensaje de error que venga del backend
        showAlert(
          result.message || "Error al crear la sede. Intenta de nuevo."
        );
      }
    } catch (error: any) {
      showAlert(error.message || "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="sede-form-page">
      <header className="sede-header">
        <div className="header-content">
          <h1 className="header-title">Creando una nueva sede</h1>
          <p className="header-subtitle">
            Completa el siguiente formulario con la informacion de la nueva sede
          </p>
        </div>
      </header>

      <div className="form-container-wrapper">
        <div className="form-card">
          <h2 className="card-title">Agregar nueva sede</h2>

          <form className="sede-form-grid" onSubmit={onSubmit}>
            {/* Nombre */}
            <div className="input-field">
              <label htmlFor="nombre" className="input-label">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                {...register("nombre", { required: true, maxLength: 100 })}
                className="input-base"
              />
              {errors.nombre?.type === "required" && (
                <ErrorSpan message="El nombre es obligatorio" />
              )}
              {errors.nombre?.type === "maxLength" && (
                <ErrorSpan message="El nombre no puede tener más de 100 caracteres" />
              )}
            </div>

            {/* Dirección */}
            <div className="input-field">
              <label htmlFor="direccion" className="input-label">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                {...register("direccion", { required: true, maxLength: 255 })}
                className="input-base"
              />
              {errors.direccion?.type === "required" && (
                <ErrorSpan message="La dirección es obligatoria" />
              )}
              {errors.direccion?.type === "maxLength" && (
                <ErrorSpan message="La dirección no puede tener más de 255 caracteres" />
              )}
            </div>

            {/* Ciudad */}
            <div className="input-field">
              <label htmlFor="ciudad" className="input-label">
                Ciudad
              </label>
              <input
                type="text"
                id="ciudad"
                {...register("ciudad", { required: true, maxLength: 50 })}
                className="input-base"
              />
              {errors.ciudad?.type === "required" && (
                <ErrorSpan message="La ciudad es obligatoria" />
              )}
              {errors.ciudad?.type === "maxLength" && (
                <ErrorSpan message="La ciudad no puede tener más de 50 caracteres" />
              )}
            </div>

            {/* Departamento */}
            <div className="input-field">
              <label htmlFor="departamento" className="input-label">
                Departamento
              </label>
              <input
                type="text"
                id="departamento"
                {...register("departamento", { required: true, maxLength: 50 })}
                className="input-base"
              />
              {errors.departamento?.type === "required" && (
                <ErrorSpan message="El departamento es obligatorio" />
              )}
              {errors.departamento?.type === "maxLength" && (
                <ErrorSpan message="El departamento no puede tener más de 50 caracteres" />
              )}
            </div>

            {/* Teléfono */}
            <div className="input-field">
              <label htmlFor="telefono" className="input-label">
                Teléfono
              </label>
              <input
                type="number"
                id="telefono"
                {...register("telefono", {
                  required: true,
                  minLength: 8,
                  maxLength: 20,
                })}
                className="input-base"
              />
              {errors.telefono?.type === "required" && (
                <ErrorSpan message="El teléfono es obligatorio" />
              )}
              {errors.telefono?.type === "minLength" && (
                <ErrorSpan message="El teléfono debe tener al menos 8 caracteres" />
              )}
              {errors.telefono?.type === "maxLength" && (
                <ErrorSpan message="El teléfono no puede tener más de 20 caracteres" />
              )}
            </div>

            {/* Botón */}
            <div className="form-actions-container">
              <Button
                type="submit"
                className="submit-button"
                disabled={loading} // Se deshabilita al enviar
              >
                {loading ? "Creando sede..." : "Crear sede"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
