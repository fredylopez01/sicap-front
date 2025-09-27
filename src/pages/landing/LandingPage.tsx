import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "/logo.png";

export function LandingPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: "⚡",
      title: "Acceso Rápido",
      desc: "Sin filas, entrada automatizada",
    },
    {
      icon: "🅿️",
      title: "Sin Estrés",
      desc: "Espacios asignados inteligentemente",
    },
    { icon: "👀", title: "Tiempo Real", desc: "Disponibilidad actualizada" },
    { icon: "🤖", title: "Moderno", desc: "Interfaz digital intuitiva" },
    {
      icon: "👩‍💼",
      title: "Personal Productivo",
      desc: "Automatización de tareas",
    },
    { icon: "📊", title: "Datos en Vivo", desc: "Reportes instantáneos" },
    { icon: "🔔", title: "Alertas Smart", desc: "Notificaciones proactivas" },
    { icon: "💰", title: "Más Ingresos", desc: "Optimización de ocupación" },
  ];

  return (
    <div className="landing-container">
      <header className="header">
        <div className="logo">
          <img src={logo} />
          SICAP
        </div>
        <button
          className="login-btn-landing"
          onClick={() => navigate("/login")}
        >
          Acceder
        </button>
      </header>

      <main className="main-content-landing">
        <div className="text-content">
          <h1 className="main-title">
            Sistema Inteligente
            <br />
            de Acceso a <span className="highlight">Parqueaderos</span>
          </h1>

          <p className="description">
            Revoluciona la gestión de parqueaderos con nuestra plataforma
            inteligente. Experiencia sin estrés para clientes y máxima
            eficiencia operacional.
          </p>
        </div>

        <div className="benefits-panel">
          <h2>Beneficios</h2>
          <div className="benefits-mini-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-mini-card">
                <span className="mini-icon">{benefit.icon}</span>
                <div>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="footer-bottom">
          <p>&copy; 2025 SICAP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
