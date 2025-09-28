import { useState } from "react";
import { InputField } from "../../components";
import { showAlert } from "../../utils/alerts";
import { apiRequest } from "../../services/api";
import { ApiResponse } from "../../interfaces";
import "./AddUserForm.css";

export function AddUserForm() {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!cedula.trim() || !names.trim() || !lastNames.trim() || !phone.trim() || !email.trim()) {
            showAlert("Por favor, completa todos los campos requeridos.");
            return;
        }

        if (phone.length < 10) {
            showAlert("El número de teléfono debe tener al menos 10 dígitos.");
            return;
        }

        if (!userHash.trim() || !password.trim()) {
            showAlert("El nombre de usuario y la contraseña son requeridos.");
            return;
        }

        if (!hireDate) {
            showAlert("Por favor, establece la fecha de contratación.");
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
                hireDate: hireDate
            };

            // Llamada al backend
            const result: ApiResponse<any> = await apiRequest<any>(
                "/api/users",
                "POST",
                userData
            );

            if (result.success) {
                showAlert(result.message || "¡Usuario creado exitosamente!", "success");

                // Limpiar formulario
                resetForm();

                // Redirigir después de un momento
                setTimeout(() => {
                    window.location.href = "/users";
                }, 1500);
            } else {
                showAlert(result.message || "Error al crear el usuario.");
            }
        } catch {
            showAlert("Error de conexión. Intenta de nuevo.");
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
    };

    const handleCancel = () => {
        window.location.href = "/";
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
                        Volver
                    </button>
                </div>

                <h1>Crear usuario</h1>
            </div>

            <form className="add-user-form" onSubmit={handleSubmit}>
                <div className="form-columns">
                    <div className="form-section">
                        <h3>Información Personal</h3>
                        <div className="input-group">
                            <InputField
                                id="cedula"
                                label="Número de Cédula *"
                                placeholder="Ej: 1234567890"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                            />
                            <InputField
                                id="names"
                                label="Nombres *"
                                placeholder="Nombres completos"
                                value={names}
                                onChange={(e) => setNames(e.target.value)}
                            />
                            <InputField
                                id="lastNames"
                                label="Apellidos *"
                                placeholder="Apellidos completos"
                                value={lastNames}
                                onChange={(e) => setLastNames(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Contacto</h3>
                        <div className="input-group">
                            <InputField
                                id="phone"
                                label="Teléfono *"
                                placeholder="Número de contacto"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <InputField
                                id="email"
                                label="Correo Electrónico *"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Información Laboral</h3>
                        <div className="input-group">
                            <InputField
                                id="branchId"
                                label="ID de Sede *"
                                type="number"
                                placeholder="ID de la sede asignada"
                                value={branchId}
                                onChange={(e) => setBranchId(e.target.value)}
                            />
                            <InputField
                                id="role"
                                label="Rol *"
                                type="select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                options={[
                                    { value: "ADMIN", label: "Administrador" },
                                    { value: "EMPLOYEE", label: "Empleado" }
                                ]}
                            />
                            <InputField
                                id="hireDate"
                                label="Fecha de Contratación *"
                                type="date"
                                value={hireDate}
                                onChange={(e) => setHireDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Credenciales</h3>
                        <div className="input-group">
                            <InputField
                                id="userHash"
                                label="Nombre de Usuario *"
                                placeholder="Nombre de usuario único"
                                value={userHash}
                                onChange={(e) => setUserHash(e.target.value)}
                            />
                            <InputField
                                id="password"
                                label="Contraseña *"
                                type="password"
                                placeholder="Contraseña segura"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Creando..." : "Crear usuario"}
                    </button>
                </div>
            </form>
        </div>
    );
}