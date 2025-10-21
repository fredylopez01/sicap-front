// src/components/parking/ParkingAlert.tsx
import { useParkingStatus } from "@/context/ParkingContext";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import "./ParkingAlert.css";

export const ParkingAlert = () => {
  const { parkingData, loading } = useParkingStatus();

  if (loading || !parkingData?.alert?.shouldNotify) return null;

  const { alert, summary } = parkingData;

  const alertConfig = {
    critical: {
      icon: <AlertCircle className="alert-icon" />,
      className: "parking-alert critical",
    },
    warning: {
      icon: <AlertCircle className="alert-icon" />,
      className: "parking-alert warning",
    },
    info: {
      icon: <Info className="alert-icon" />,
      className: "parking-alert info",
    },
    normal: {
      icon: <CheckCircle className="alert-icon" />,
      className: "parking-alert normal",
    },
  };

  const config = alertConfig[alert.level];

  return (
    <div className={config.className}>
      {config.icon}
      <div className="alert-content">
        <p className="alert-message">{alert.message}</p>
        <p className="alert-details">
          {summary.occupiedSpaces} de {summary.totalSpaces} espacios ocupados
        </p>
      </div>
    </div>
  );
};
