// src/components/parking/ParkingNotificationBell.tsx
import { useParkingStatus } from "@/context/ParkingContext";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

interface ParkingNotificationBellProps {
  showLabel?: boolean; // Opcional: mostrar texto junto al icono
  size?: "sm" | "md" | "lg"; // Tamaño del componente
}

export const ParkingNotificationBell = ({
  showLabel = false,
  size = "md",
}: ParkingNotificationBellProps) => {
  const { parkingData, loading } = useParkingStatus();
  const navigate = useNavigate();

  const hasNotification = parkingData?.alert?.shouldNotify || false;

  const handleClick = () => {
    navigate("/dashboard/parqueadero");
  };

  if (loading) {
    return null;
  }

  const sizeClasses = {
    sm: "bell-container-sm",
    md: "bell-container-md",
    lg: "bell-container-lg",
  };

  return (
    <button
      onClick={handleClick}
      className={`parking-bell-button ${sizeClasses[size]}`}
      title={
        hasNotification
          ? parkingData?.alert?.message
          : "Ver estado del parqueadero"
      }
    >
      <div className="bell-icon-wrapper">
        <Bell className="bell-icon" />
        {hasNotification && (
          <span className="notification-badge">
            <span className="badge-pulse"></span>
          </span>
        )}
      </div>

      {showLabel && (
        <span className="bell-label">
          {hasNotification ? "¡Alerta!" : "Parqueadero"}
        </span>
      )}
    </button>
  );
};
