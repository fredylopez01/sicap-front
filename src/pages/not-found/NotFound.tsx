import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-header">
          <div className="error-code">404</div>
          <h1 className="error-title">Página no encontrada</h1>

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
                stroke="var(--institutional-blue)"
                strokeWidth="2"
                fill="none"
                rx="3"
              />
              <circle cx="45" cy="55" r="3" fill="var(--green-stand)" />
              <circle cx="75" cy="55" r="3" fill="var(--green-stand)" />
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
                fill="var(--institutional-blue)"
              >
                P
              </text>
            </svg>
          </div>
        </div>

        <p className="error-description">
          Lo sentimos, la página que buscas no está disponible. Es posible que
          haya sido movida o que la URL sea incorrecta.
        </p>

        <div className="error-suggestions">
          <p>Puedes intentar:</p>
          <ul>
            <li>Verificar la URL en la barra de direcciones</li>
            <li>Regresar a la página principal</li>
            <li>Usar el menú de navegación</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={handleGoHome}>
            Ir al inicio
          </button>
          <button
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}
