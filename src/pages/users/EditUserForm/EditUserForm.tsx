import React, { useState, useEffect } from "react";

import "./EditUserForm.css";
import { isValidEmail } from "@/utils/validations";
import { showAlert } from "@/utils/alerts";
import { ApiResponse, User } from "@/interfaces";
import { apiRequest } from "@/services";
import { InputField, Spinner } from "@/components";
import { Save } from "lucide-react";
import { Sede } from "@/interfaces/sede";

interface BranchOption {
  value: string;
  label: string;
}

interface EditUserFormProps {
  initialUserData: User;
  onUserUpdated: (updatedRecord: User) => void;
}

// Opciones de Rol y Sede (Branch)
const roleOptions = [
  { value: "ADMIN", label: "Administrador" },
  { value: "CONTROLLER", label: "Controlador" },
];

// Componente ErrorSpan
const ErrorSpan = ({ message }: { message: string }) => {
  return (
    <span
      style={{
        color: "red",
        fontSize: "0.85em",
        marginTop: "5px",
        display: "block",
      }}
    >
      {message}
    </span>
  );
};

export function EditUserForm({
  initialUserData,
  onUserUpdated,
}: EditUserFormProps) {
  const [formData, setFormData] = useState({
    names: initialUserData.names,
    lastNames: initialUserData.lastNames,
    phone: initialUserData.phone,
    email: initialUserData.email,
    branchId: String(initialUserData.branchId),
    userHash: initialUserData.userHash,
    role: initialUserData.role,
    isActive: initialUserData.isActive,
    hireDate: initialUserData.hireDate
      ? new Date(initialUserData.hireDate).toISOString().split("T")[0]
      : "",
  });
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([
    { value: "", label: "Selecciona una sede" },
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<keyof typeof formData, string>>(
    {} as any
  );

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const result: ApiResponse<Sede[]> = await apiRequest(
          `/api/branches`,
          "GET"
        );

        if (result.success && result.data) {
          setBranchOptions(
            result.data.map((zone) => ({
              value: zone.id.toString(),
              label: zone.name,
            }))
          );
        }
      } catch (err: any) {
        console.error("Error al cargar zonas:", err);
      }
    };
    fetchVehicleTypes();
  }, []);

  // useEffect para actualizar el estado si las props cambian (útil si el componente se reutiliza)
  useEffect(() => {
    setFormData({
      names: initialUserData.names,
      lastNames: initialUserData.lastNames,
      phone: initialUserData.phone,
      email: initialUserData.email,
      branchId: String(initialUserData.branchId),
      userHash: initialUserData.userHash,
      role: initialUserData.role,
      isActive: initialUserData.isActive,
      hireDate: initialUserData.hireDate
        ? new Date(initialUserData.hireDate).toISOString().split("T")[0]
        : "",
    });
  }, [initialUserData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    // Manejo especial para checkbox (isActive)
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    // Limpia el error al empezar a escribir/cambiar
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors: Record<keyof typeof formData, string> = {} as any;
    const data = formData;

    // Validación de campos obligatorios
    if (!data.names.trim()) {
      newErrors.names = "Los Nombres son obligatorios.";
      formIsValid = false;
    }
    if (!data.lastNames.trim()) {
      newErrors.lastNames = "Los Apellidos son obligatorios.";
      formIsValid = false;
    }
    if (!data.phone.trim()) {
      newErrors.phone = "El Teléfono es obligatorio.";
      formIsValid = false;
    }
    if (!data.email.trim()) {
      newErrors.email = "El Correo Electrónico es obligatorio.";
      formIsValid = false;
    }
    if (!data.branchId.trim()) {
      newErrors.branchId = "La Sede es obligatoria.";
      formIsValid = false;
    }
    if (!data.userHash.trim()) {
      newErrors.userHash = "El Nombre de Usuario es obligatorio.";
      formIsValid = false;
    }
    if (!data.role.trim()) {
      newErrors.role = "El Rol es obligatorio.";
      formIsValid = false;
    }
    if (!data.hireDate) {
      newErrors.hireDate = "La Fecha de Contratación es obligatoria.";
      formIsValid = false;
    }

    // Validación de Teléfono (Numérico y Mínimo 10 dígitos)
    if (
      data.phone.trim() &&
      (!/^\d+$/.test(data.phone.trim()) || data.phone.trim().length < 10)
    ) {
      newErrors.phone =
        "El teléfono debe ser numérico y tener al menos 10 dígitos.";
      formIsValid = false;
    }

    // Validación de Correo Electrónico
    if (data.email.trim() && !isValidEmail(data.email.trim())) {
      newErrors.email = "Introduce un formato de correo electrónico válido.";
      formIsValid = false;
    }

    // Validación de Nombre de Usuario (Mínimo 6 caracteres)
    if (data.userHash.trim() && data.userHash.trim().length < 6) {
      newErrors.userHash =
        "El nombre de usuario debe tener al menos 6 caracteres.";
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);

    try {
      // 3. Prepara la data a enviar, solo los campos editables
      const dataToSend = {
        names: formData.names.trim(),
        lastNames: formData.lastNames.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        branchId: parseInt(formData.branchId), // Convierte a número
        userHash: formData.userHash.trim(),
        role: formData.role,
        isActive: formData.isActive,
        // Envía la fecha en formato ISO, usando 'Z' para indicar UTC o un formato que el backend acepte
        hireDate: new Date(formData.hireDate).toISOString(),
      };

      // 4. Llamada al backend: PUT /api/users/{id}
      const result: ApiResponse<User> = await apiRequest<User>(
        `/api/users/${initialUserData.id}`,
        "PUT",
        dataToSend
      );

      if (result.success) {
        onUserUpdated && result.data && onUserUpdated(result.data);
        setTimeout(() => {
          showAlert(
            result.message || "¡Usuario actualizado exitosamente!",
            "success"
          );
        }, 300);
      } else {
        showAlert(result.message || "Error al actualizar el usuario.");
      }
    } catch (error: any) {
      console.error(error);
      showAlert(error.message || "Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-user-form" onSubmit={handleSubmit} noValidate>
      <div className="form-section-edit-user">
        <h3>Información Básica</h3>
        <div className="input-group-edit-user">
          <div>
            <InputField
              id="names"
              label="Nombres *"
              placeholder="Nombres completos"
              value={formData.names}
              onChange={handleChange}
            />
            {errors.names && <ErrorSpan message={errors.names} />}
          </div>
          <div>
            <InputField
              id="lastNames"
              label="Apellidos *"
              placeholder="Apellidos completos"
              value={formData.lastNames}
              onChange={handleChange}
            />
            {errors.lastNames && <ErrorSpan message={errors.lastNames} />}
          </div>
        </div>

        <div className="input-group-edit-user">
          <div>
            <InputField
              id="phone"
              label="Teléfono *"
              placeholder="Número de contacto"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <ErrorSpan message={errors.phone} />}
          </div>
          <div>
            <InputField
              id="email"
              label="Correo Electrónico *"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <ErrorSpan message={errors.email} />}
          </div>
        </div>
      </div>

      <div className="form-section-edit-user">
        <h3>Información Laboral</h3>
        <div className="input-group-edit-user">
          <div>
            <InputField
              id="branchId"
              label="ID de Sede *"
              type="select"
              value={formData.branchId}
              onChange={handleChange}
              options={branchOptions}
            />
            {errors.branchId && <ErrorSpan message={errors.branchId} />}
          </div>
          <div>
            <InputField
              id="role"
              label="Rol *"
              type="select"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
            />
            {errors.role && <ErrorSpan message={errors.role} />}
          </div>
        </div>

        <div className="input-group-edit-user">
          <div>
            <InputField
              id="userHash"
              label="Nombre de Usuario *"
              placeholder="Nombre de usuario único"
              value={formData.userHash}
              onChange={handleChange}
            />
            {errors.userHash && <ErrorSpan message={errors.userHash} />}
          </div>
          <div>
            <InputField
              id="hireDate"
              label="Fecha de Contratación *"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
            />
            {errors.hireDate && <ErrorSpan message={errors.hireDate} />}
          </div>
        </div>

        <div className="input-group-edit-user switch-field">
          <label htmlFor="isActive" className="switch-label">
            Usuario Activo
          </label>
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            className="switch-input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn-edit-user"
          disabled={loading}
        >
          {loading ? (
            <>
              <span>Guardando...</span>
              <Spinner />
            </>
          ) : (
            <>
              <Save className="pr-button-icon" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}
