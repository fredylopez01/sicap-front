import { useEffect, useState } from "react";
import { InputField, Spinner } from "../../components";
import { showAlert } from "../../utils/alerts";
import { apiRequest } from "../../services/api";
import { ApiResponse } from "../../interfaces";
import "./AddUserForm.css";
import { isStrongPassword, isValidEmail } from "../../utils/validations";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Sede } from "@/interfaces/sede";

interface BranchOption {
  value: string;
  label: string;
}

export function AddUserForm() {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState("");
  const [names, setNames] = useState("");
  const [lastNames, setLastNames] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branchId, setBranchId] = useState("");
  const [userHash, setUserHash] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [hireDate, setHireDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para los mensajes de error
  const [errors, setErrors] = useState({
    cedula: "",
    names: "",
    lastNames: "",
    phone: "",
    email: "",
    branchId: "",
    userHash: "",
    password: "",
    hireDate: "",
  });

  // Placeholder para las opciones de sede.
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([
    { value: "", label: "Selecciona una sede" },
  ]);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleTypes();
  }, []);

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {
      cedula: "",
      names: "",
      lastNames: "",
      phone: "",
      email: "",
      branchId: "",
      userHash: "",
      password: "",
      hireDate: "",
    };

    // Validación de campos vacíos
    if (!cedula.trim()) {
      newErrors.cedula = "La Cédula es obligatoria.";
      formIsValid = false;
    }
    if (!names.trim()) {
      newErrors.names = "Los Nombres son obligatorios.";
      formIsValid = false;
    }
    if (!lastNames.trim()) {
      newErrors.lastNames = "Los Apellidos son obligatorios.";
      formIsValid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = "El Teléfono es obligatorio.";
      formIsValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "El Correo Electrónico es obligatorio.";
      formIsValid = false;
    }
    if (!branchId.trim()) {
      newErrors.branchId = "La Sede es obligatoria.";
      formIsValid = false;
    }
    if (!userHash.trim()) {
      newErrors.userHash = "El Nombre de Usuario es obligatorio.";
      formIsValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "La Contraseña es obligatoria.";
      formIsValid = false;
    }
    if (!hireDate) {
      newErrors.hireDate = "La Fecha de Contratación es obligatoria.";
      formIsValid = false;
    }

    // Validación de Cédula
    if (cedula.trim() && !/^\d+$/.test(cedula.trim())) {
      newErrors.cedula =
        "El número de cédula solo puede contener dígitos numéricos.";
      formIsValid = false;
    } else if (cedula.trim() && cedula.trim().length < 8) {
      newErrors.cedula = "El número de cédula debe tener al menos 8 dígitos.";
      formIsValid = false;
    }

    // Validación de Teléfono
    if (phone.trim() && !/^\d+$/.test(phone.trim())) {
      newErrors.phone =
        "El número de teléfono solo puede contener dígitos numéricos.";
      formIsValid = false;
    } else if (phone.trim() && phone.trim().length < 10) {
      newErrors.phone = "El número de teléfono debe tener al menos 10 dígitos.";
      formIsValid = false;
    }

    // Validación de Correo Electrónico
    if (email.trim() && !isValidEmail(email.trim())) {
      newErrors.email =
        "Por favor, introduce un formato de correo electrónico válido.";
      formIsValid = false;
    }

    // Validación de Nombre de Usuario
    if (userHash.trim() && userHash.trim().length < 6) {
      newErrors.userHash =
        "El nombre de usuario debe tener al menos 6 caracteres.";
      formIsValid = false;
    }

    // Validación de Contraseña Segura
    if (password.trim() && !isStrongPassword(password.trim())) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres, e incluir: una mayúscula, una minúscula, un número y un carácter especial (ej: !@#$%).";
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Soluciona los errores");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        cedula: cedula.trim(),
        names: names.trim(),
        lastNames: lastNames.trim(),
        phone: phone.trim(),
        email: email.trim(),
        branchId: parseInt(branchId),
        userHash: userHash.trim(),
        password: password.trim(),
        role: role,
        hireDate: hireDate,
      };

      const result: ApiResponse<any> = await apiRequest<any>(
        "/api/users",
        "POST",
        userData
      );

      if (result.success) {
        showAlert(result.message || "¡Usuario creado exitosamente!", "success");
        resetForm();
        navigate("/dashboard/usuarios");
      } else {
        showAlert(result.message || "Error al crear el usuario.");
      }
    } catch (error: any) {
      console.log(error);
      showAlert(error.message || "Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCedula("");
    setNames("");
    setLastNames("");
    setPhone("");
    setEmail("");
    setBranchId("");
    setUserHash("");
    setPassword("");
    setRole("ADMIN");
    setHireDate("");
    setErrors({
      cedula: "",
      names: "",
      lastNames: "",
      phone: "",
      email: "",
      branchId: "",
      userHash: "",
      password: "",
      hireDate: "",
    });
  };

  const handleCancel = () => {
    navigate("/dashboard/usuarios");
  };

  const ErrorSpan = ({ message }: { message: string }) => {
    return (
      <span
        style={{
          color: "red",
          fontSize: "0.85em",
          marginTop: "1px",
          marginBottom: "10px",
          display: "block",
        }}
      >
        {message}
      </span>
    );
  };

  return (
    <div className="add-user-container">
      <div className="add-user-header">
        <div className="cancel-btn-container">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            <ArrowLeft />
          </button>
        </div>

        <h1>Crear usuario</h1>
      </div>

      <form className="add-user-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <h3>Información Personal</h3>
          <div className="input-group-new-user">
            <div>
              <InputField
                id="cedula"
                label="Número de Cédula *"
                placeholder="Ej: 1234567890"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
              {errors.cedula && <ErrorSpan message={errors.cedula} />}
            </div>
            <div>
              <InputField
                id="names"
                label="Nombres *"
                placeholder="Nombres completos"
                value={names}
                onChange={(e) => setNames(e.target.value)}
              />
              {errors.names && <ErrorSpan message={errors.names} />}
            </div>
            <div>
              <InputField
                id="lastNames"
                label="Apellidos *"
                placeholder="Apellidos completos"
                value={lastNames}
                onChange={(e) => setLastNames(e.target.value)}
              />
              {errors.lastNames && <ErrorSpan message={errors.lastNames} />}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Contacto</h3>
          <div className="input-group-new-user">
            <div>
              <InputField
                id="phone"
                label="Teléfono *"
                placeholder="Número de contacto"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <ErrorSpan message={errors.phone} />}
            </div>
            <div>
              <InputField
                id="email"
                label="Correo Electrónico *"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <ErrorSpan message={errors.email} />}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Información Laboral</h3>
          <div className="input-group-new-user">
            <div>
              <InputField
                id="branchId"
                label="ID de Sede *"
                type="select"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                options={[
                  ...[
                    { value: "", label: "Selecciona una sede" },
                    ...branchOptions,
                  ],
                ]}
              />
              {errors.branchId && <ErrorSpan message={errors.branchId} />}
            </div>
            <InputField
              id="role"
              label="Rol *"
              type="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: "ADMIN", label: "Administrador" },
                { value: "CONTROLLER", label: "Controlador" },
              ]}
            />
            <div>
              <InputField
                id="hireDate"
                label="Fecha de Contratación *"
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
              />
              {errors.hireDate && <ErrorSpan message={errors.hireDate} />}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Credenciales</h3>
          <div className="input-group-new-user">
            <div>
              <InputField
                id="userHash"
                label="Nombre de Usuario *"
                placeholder="Nombre de usuario único"
                value={userHash}
                onChange={(e) => setUserHash(e.target.value)}
              />
              {errors.userHash && <ErrorSpan message={errors.userHash} />}
            </div>
            <div>
              <InputField
                id="password"
                label="Contraseña *"
                type="password"
                placeholder="Contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <ErrorSpan message={errors.password} />}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span>Creando...</span>
                <Spinner />
              </>
            ) : (
              <span>Crear usuario</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
