import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { UserRoundPen } from "lucide-react";
import { useState } from "react";
import "./EditUserProfile.css";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components";
import ErrorSpan from "@/components/ui/errorSpan";
import { showAlert } from "@/utils/alerts";
import { isValidEmail } from "@/utils/validations";
import { ApiResponse, User } from "@/interfaces";
import { apiRequest } from "@/services";

export function EditUserProfileModal() {
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    names: user?.names || "",
    lastNames: user?.lastNames || "",
    phone: user?.phone || "",
    email: user?.email || "",
    userHash: user?.userHash || "",
  });
  const [errors, setErrors] = useState<Record<keyof typeof formData, string>>(
    {} as any
  );

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
    if (!data.userHash.trim()) {
      newErrors.userHash = "El Nombre de Usuario es obligatorio.";
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

  const onEditProfile = async (e: React.FormEvent) => {
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
        userHash: formData.userHash.trim(),
      };

      // 4. Llamada al backend: PUT /api/users/{id}
      const result: ApiResponse<User> = await apiRequest<User>(
        `/api/users/${user!.id}`,
        "PUT",
        dataToSend
      );

      if (result.success && result.data) {
        const response: Partial<User> = result.data;
        const branch = user!.branch;
        // const updatedUser = { branch: user!.branch, ...response };
        // updateUser(updateUser);
        // showAlert(
        //   result.message || "¡Usuario actualizado exitosamente!",
        //   "success"
        // );
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="edit-button-trigger-profile">
          <UserRoundPen className="edit-icon" />
          <span>Editar</span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-auto record-datails-modal-container">
        <form className="edit-user-form" onSubmit={onEditProfile} noValidate>
          <DialogHeader>
            <DialogTitle>Editar datos de usuario</DialogTitle>
            <DialogDescription>
              {user?.names + " " + user?.lastNames}
            </DialogDescription>
          </DialogHeader>

          <main>
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
          </main>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Editando..." : "Editar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
