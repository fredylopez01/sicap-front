import React, { useEffect, useState } from "react";
import { InputField, Spinner } from "../../components/index";
import { apiRequest } from "../../services/index";
import { showAlert } from "../../utils/alerts";
import { ApiResponse } from "../../interfaces";
import "./Login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showAlert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const result: ApiResponse<string> = await apiRequest<string>(
        "/api/auth/login",
        "POST",
        {
          email: username,
          password,
        }
      );

      if (result.success && result.data) {
        localStorage.setItem("authToken", result.data);
        showAlert(result.message || "¡Login exitoso!", "success");

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        showAlert(result.message || "Error al iniciar sesión.");
      }
    } catch {
      showAlert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setUsername("admin");
        setPassword("admin123");
      } else if (e.key === "F2") {
        e.preventDefault();
        setUsername("nicolas");
        setPassword("nicolas123");
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
        <div className="input-group">
          <InputField
            id="username"
            label="Usuario o Email"
            placeholder="Ingrese su usuario o email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <InputField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
          <a href="/forgot-password">¿Olvidó su contraseña?</a>
        </div>
      </form>
    </div>
  );
}
