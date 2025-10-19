import { useState } from "react";
import {
  Car,
  Clock,
  DollarSign,
  User,
  AlertCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import "./RecordInfo.css";
import { ParkingRecordFiltered } from "@/interfaces";

interface ParkingInfoProps {
  record: ParkingRecordFiltered;
  spaces?: Array<{ id: number; spaceNumber: string }>;
  onSave?: (id: number, updatedRecord: Partial<ParkingRecordFiltered>) => void;
  onCancel?: () => void;
}

export function RecordInfo({
  record,
  spaces = [],
  onSave,
  onCancel,
}: ParkingInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    licensePlate: record.licensePlate,
    spaceId: record.spaceId,
    appliedRate: record.appliedRate,
    parkedHours: record.parkedHours || "",
    observations: record.observations,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      const currentSpaceId = Number(editedData.spaceId);

      const updatedRecord: Partial<ParkingRecordFiltered> = {
        licensePlate: editedData.licensePlate,
        appliedRate: editedData.appliedRate,
        parkedHours: editedData.parkedHours || null,
        observations: editedData.observations,
      };

      if (currentSpaceId !== record.spaceId) {
        updatedRecord.spaceId = currentSpaceId;
      }

      onSave(record.id, updatedRecord);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      licensePlate: record.licensePlate,
      spaceId: record.spaceId,
      appliedRate: record.appliedRate,
      parkedHours: record.parkedHours || "",
      observations: record.observations,
    });
    setIsEditing(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="pr-container">
      <div className="pr-card card-details-record">
        <div className="pr-header">
          <div className="pr-header-left">
            <Car className="pr-car-icon" />
            <div className="flex gap-3 items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.licensePlate}
                  onChange={(e) =>
                    handleInputChange("licensePlate", e.target.value)
                  }
                  className="pr-input-title"
                  placeholder="Placa"
                />
              ) : (
                <h2 className="pr-title">{record.licensePlate}</h2>
              )}
              <span
                className={
                  record.status === "active"
                    ? "pr-badge-active"
                    : "pr-badge-finished"
                }
              >
                {record.status === "active" ? "Activo" : "Finalizado"}
              </span>
            </div>
          </div>
          <div className="pr-header-right">
            <div className="pr-space-info flex gap-3 items-center">
              <p className="pr-space-label">Espacio</p>
              {isEditing ? (
                <select
                  value={editedData.spaceId}
                  onChange={(e) => handleInputChange("spaceId", e.target.value)}
                  className="pr-select-space"
                >
                  <option value={record.spaceId}>
                    {record.space.spaceNumber}
                  </option>
                  {spaces.map((space) => (
                    <option key={space.id} value={space.id}>
                      {space.spaceNumber}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="pr-space-number">{record.space.spaceNumber}</p>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="pr-edit-button"
              >
                <Edit2 className="pr-button-icon" />
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="pr-section">
          <div className="pr-grid">
            <div className="pr-info-block">
              <h3 className="pr-section-title">
                <Clock className="pr-section-icon" />
                Entrada
              </h3>
              <p className="pr-date-text">{formatDate(record.entryDate)}</p>
              <p className="pr-controller-text">
                <User className="pr-user-icon" />
                {record.entryController.names}{" "}
                {record.entryController.lastNames}
              </p>
            </div>

            <div className="pr-info-block">
              <h3 className="pr-section-title">
                <Clock className="pr-section-icon" />
                Salida
              </h3>
              {record.exitDate ? (
                <>
                  <p className="pr-date-text">{formatDate(record.exitDate)}</p>
                  {record.exitController && (
                    <p className="pr-controller-text">
                      <User className="pr-user-icon" />
                      {record.exitController.names}{" "}
                      {record.exitController.lastNames}
                    </p>
                  )}
                </>
              ) : (
                <p className="pr-empty-text">En parqueadero</p>
              )}
            </div>
          </div>
        </div>

        <div className="pr-payment-section">
          <div className="pr-payment-grid">
            <div className="pr-payment-item">
              <p className="pr-payment-label">Horas estacionado</p>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editedData.parkedHours}
                  onChange={(e) =>
                    handleInputChange("parkedHours", e.target.value)
                  }
                  className="pr-input-small"
                  placeholder="0.00"
                />
              ) : (
                <p className="pr-payment-value">
                  {record.parkedHours ? `${record.parkedHours} hrs` : "-"}
                </p>
              )}
            </div>

            <div className="pr-payment-item">
              <p className="pr-payment-label">Tarifa aplicada</p>
              {isEditing ? (
                <div className="pr-currency-input">
                  <span className="pr-currency-symbol">$</span>
                  <input
                    type="number"
                    value={editedData.appliedRate}
                    onChange={(e) =>
                      handleInputChange("appliedRate", e.target.value)
                    }
                    className="pr-input-small"
                    placeholder="10000"
                  />
                  <span className="pr-currency-unit">/hora</span>
                </div>
              ) : (
                <p className="pr-payment-value">
                  {formatCurrency(record.appliedRate)}/hora
                </p>
              )}
            </div>

            <div className="pr-payment-item">
              <p className="pr-payment-label">Total a pagar</p>
              <p className="pr-total-value">
                <DollarSign className="pr-dollar-icon" />
                {record.totalToPay ? formatCurrency(record.totalToPay) : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="pr-observations-section">
          <div className="pr-observations-header">
            <AlertCircle className="pr-alert-icon" />
            <h3 className="pr-observations-title">Observaciones</h3>
          </div>
          {isEditing ? (
            <textarea
              value={editedData.observations || ""}
              onChange={(e) =>
                handleInputChange("observations", e.target.value)
              }
              className="pr-textarea"
              placeholder="Ingrese observaciones sobre el vehículo..."
              rows={1}
            />
          ) : (
            <p
              className={
                record.observations
                  ? "pr-observations-text"
                  : "pr-empty-observations"
              }
            >
              {record.observations || "Sin observaciones"}
            </p>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="pr-action-buttons">
          <button onClick={handleCancel} className="pr-cancel-button">
            <X className="pr-button-icon" />
            Cancelar
          </button>
          <button onClick={handleSave} className="pr-save-button">
            <Save className="pr-button-icon" />
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}
