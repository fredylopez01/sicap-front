import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "/logo.jpg";
import {
  Activity,
  BellRing,
  ChartColumnBig,
  LayoutDashboard,
  Receipt,
  SquareParking,
  UserStar,
  Zap,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Zap color="#ff9900" />,
      title: "Acceso Rápido",
      desc: "Sin filas, entrada automatizada",
    },
    {
      icon: <SquareParking color="#007bff" />,
      title: "Sin Estrés",
      desc: "Espacios asignados inteligentemente",
    },
    {
      icon: <Activity color="#28a745" />,
      title: "Tiempo Real",
      desc: "Disponibilidad actualizada",
    },
    {
      icon: <LayoutDashboard color="#6f42c1" />,
      title: "Moderno",
      desc: "Interfaz digital intuitiva",
    },
    {
      icon: <UserStar color="#17a2b8" />,
      title: "Personal Productivo",
      desc: "Automatización de tareas",
    },
    {
      icon: <ChartColumnBig color="#ffc107" />,
      title: "Datos en Vivo",
      desc: "Reportes instantáneos",
    },
    {
      icon: <BellRing color="#dc3545" />,
      title: "Alertas Smart",
      desc: "Notificaciones proactivas",
    },
    {
      icon: <Receipt color="#198754" />,
      title: "Más Ingresos",
      desc: "Optimización de ocupación",
    },
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
