import { ReactNode } from "react";
import "./AnimatedBackground.css";

interface AnimatedBackgroundProps {
  children: ReactNode;
}

export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <div className="animated-background">
      {/* Partículas flotantes */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Ondas de fondo */}
      <div className="waves-container">
        <svg className="wave-svg" viewBox="0 0 1200 320" fill="none">
          <path
            className="wave-path"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,138.7C672,149,768,203,864,202.7C960,203,1056,149,1152,128C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="rgba(0, 123, 255, 0.1)"
          />
        </svg>
        <svg className="wave-svg" viewBox="0 0 1200 320" fill="none">
          <path
            className="wave-path-delayed"
            d="M0,160L48,138.7C96,117,192,75,288,85.3C384,96,480,160,576,186.7C672,213,768,203,864,192C960,181,1056,171,1152,165.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="rgba(40, 167, 69, 0.1)"
          />
        </svg>
      </div>

      {/* Círculos geométricos flotantes */}
      <div className="geometric-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Grid pattern */}
      <div className="grid-pattern"></div>

      {/* Rayos de luz */}
      <div className="light-rays">
        <div className="light-ray ray-1"></div>
        <div className="light-ray ray-2"></div>
        <div className="light-ray ray-3"></div>
      </div>

      {/* Contenido principal */}
      <div className="main-content">{children}</div>
    </div>
  );
}
