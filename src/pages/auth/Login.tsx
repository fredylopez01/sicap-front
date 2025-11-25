import React, { useEffect, useState } from "react";
import { InputField, Spinner } from "../../components/index";
import { apiRequest } from "../../services/index";
import { showAlert } from "../../utils/alerts";
import { ApiResponse } from "../../interfaces";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisiblePassowrd, setIsVisblePassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showAlert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const result: ApiResponse<any> = await apiRequest<any>(
        "/api/auth/login",
        "POST",
        {
          email: username,
          password,
        }
      );

      if (result.success && result.data) {
        login(result.data.user, result.data.token);
        showAlert(result.message || "¡Login exitoso!", "success");

        navigate("/dashboard");
      } else {
        showAlert(result.message || "Error al iniciar sesión.");
      }
    } catch (error: any) {
      console.log(error);
      showAlert(error.message || "Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setUsername("carlos.perez@parking.com");
        setPassword("admin123");
      } else if (e.key === "F2") {
        e.preventDefault();
        setUsername("maria.mejia@parking.com");
        setPassword("@Maria123");
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Inciar Sesión</h1>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group login-input-group">
          <InputField
            id="username"
            label="Usuario o Email"
            placeholder="Ingrese su usuario o email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="form-group">
            <label htmlFor="password-login">Contraseña</label>
            <div className="flex items-center gap-2 border border-[var(--border-color)] rounded-[10px] bg-white transition duration-200 focus-within:border-[var(--blue-medium-light)] focus-within:shadow-[0_0_0_3px_var(--blue-light)]">
              <input
                className="flex-1 px-4 py-2 text-[0.85rem] text-[var(--black)] placeholder-[var(--neutral-gray)] bg-transparent focus:outline-none"
                id="password-login"
                type={isVisiblePassowrd ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="password"
              />

              <button
                type="button"
                onClick={() => setIsVisblePassword(!isVisiblePassowrd)}
                className="px-2 text-[var(--neutral-gray)] hover:text-[var(--blue-medium-light)] transition"
              >
                {isVisiblePassowrd ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? (
            <>
              <span>Iniciando...</span>
              <Spinner />
            </>
          ) : (
            <span>Iniciar Sesión</span>
          )}
        </button>

        <div className="forgot-password">
          <a href="/">Volver página de inicio</a>
        </div>
      </form>
    </div>
  );
}
