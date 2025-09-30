import { useForm } from "react-hook-form";
import { showAlert } from "../../../utils/alerts";
import ErrorSpan from "@/components/ui/errorSpan";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "./SedeForm.css";

export default function SedeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dashboard/sedes");
  };

  const onSubmit = handleSubmit((data) => {
    showAlert("Nueva sede creada", "success");
    handleRedirect();
    console.log(data);
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

            {/* Horario apertura */}
            <div className="input-field">
              <label htmlFor="horario_apertura" className="input-label">
                Horario de apertura
              </label>
              <input
                type="time"
                id="horario_apertura"
                {...register("horario_apertura", { required: true })}
                className="input-base"
              />
              {errors.horario_apertura?.type === "required" && (
                <ErrorSpan message="El horario de apertura es obligatorio" />
              )}
            </div>

            {/* Horario cierre */}
            <div className="input-field">
              <label htmlFor="horario_cierre" className="input-label">
                Horario de cierre
              </label>
              <input
                type="time"
                id="horario_cierre"
                {...register("horario_cierre", { required: true })}
                className="input-base"
              />
              {errors.horario_cierre?.type === "required" && (
                <ErrorSpan message="El horario de cierre es obligatorio" />
              )}
            </div>

            {/* Botón ocupa toda la fila */}
            <div className="form-actions-container">
              <Button
                type="submit"
                className="submit-button" // Usamos una clase simple para el botón
              >
                Crear sede
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
