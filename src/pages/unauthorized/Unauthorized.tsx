import { useNavigate } from "react-router-dom";
import "./Unauthorized.css";
import { useAuth } from "../../context/AuthContext";

export function Unauthorized() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-code">403</div>

        <div className="error-icon">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="var(--institutional-blue)"
              strokeWidth="3"
              fill="var(--secondary-bg)"
              opacity="0.2"
            />
            <path
              d="M35 45 L85 45 L85 75 L35 75 Z"
              stroke="var(--neutral-gray)"
              strokeWidth="2"
              fill="none"
              rx="3"
            />
            <circle cx="45" cy="55" r="3" fill="var(--neutral-gray)" />
            <circle cx="75" cy="55" r="3" fill="var(--neutral-gray)" />
            <path
              d="M40 65 L80 65"
              stroke="var(--neutral-gray)"
              strokeWidth="2"
            />
            <path
              d="M45 70 L75 70"
              stroke="var(--neutral-gray)"
              strokeWidth="1"
            />
            <text
              x="60"
              y="90"
              textAnchor="middle"
              fontSize="8"
              fill="var(--neutral-gray)"
            >
              P
            </text>
            {/* Símbolo de prohibido */}
            <circle
              cx="60"
              cy="60"
              r="35"
              stroke="var(--institutional-blue)"
              strokeWidth="4"
              fill="none"
              opacity="0.8"
            />
            <line
              x1="35"
              y1="85"
              x2="85"
              y2="35"
              stroke="var(--institutional-blue)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="error-title">Acceso no autorizado</h1>

        <p className="error-description">
          No tienes los permisos necesarios para acceder a esta sección del
          sistema de parqueaderos. Contacta con el administrador si crees que
          esto es un error.
        </p>

        <div className="error-suggestions">
          <p>Puedes intentar:</p>
          <ul>
            <li>Regresar a tu panel principal</li>
            <li>Verificar que tu cuenta tenga los permisos correctos</li>
            <li>Contactar al administrador del sistema</li>
            <li>Cerrar sesión e iniciar con otra cuenta</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={handleGoHome}>
            Ir al dashboard
          </button>
          <button className="btn-secondary" onClick={handleGoBack}>
            Volver atrás
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
