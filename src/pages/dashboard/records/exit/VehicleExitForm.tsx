import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorSpan from "@/components/ui/errorSpan";
import { Spinner } from "@/components";
import { apiRequest } from "@/services/api";
import { ApiResponse } from "@/interfaces";
import { showAlert } from "@/utils/alerts";
import "./VehicleExitForm.css";

interface VehicleExitFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface ExitData {
    licensePlate: string;
    observations?: string;
}

// interface ExitResponse {
//     id: number;
//     licensePlate: string;
//     entryDate: string;
//     exitDate: string;
//     parkedHours: number;
//     appliedRate: number;
//     totalToPay: number;
//     status: string;
// }

export function VehicleExitForm({ onClose, onSuccess }: VehicleExitFormProps) {
    const [licensePlate, setLicensePlate] = useState("");
    const [observations, setObservations] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        licensePlate: "",
    });

    const validateForm = (): boolean => {
        const newErrors = {
            licensePlate: "",
        };

        // Validar placa (requerida, formato básico)
        if (!licensePlate.trim()) {
            newErrors.licensePlate = "La placa es obligatoria";
        } else if (licensePlate.trim().length < 4) {
            newErrors.licensePlate = "La placa debe tener al menos 4 caracteres";
        } else if (licensePlate.trim().length > 10) {
            newErrors.licensePlate = "La placa no puede exceder 10 caracteres";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showAlert("Por favor corrige los errores en el formulario");
            return;
        }

        setLoading(true);

        try {
            const exitData: ExitData = {
                licensePlate: licensePlate.trim().toUpperCase(),
                observations: observations.trim() || undefined,
            };

            const result: ApiResponse<any> = await apiRequest<any>(
                "/api/vehicleRecords/exit",
                "POST",
                exitData
            );

            if (result.success && result.data) {
                // Formatear información para mostrar
                const hours = Number(result.data.parkedHours).toFixed(2);
                const total = Number(result.data.totalToPay).toFixed(2);
                const rate = Number(result.data.appliedRate).toFixed(2);

                showAlert(
                    `Salida registrada exitosamente\n\nPlaca: ${result.data.licensePlate}\nTiempo: ${hours} horas\nTarifa: $${rate}/hora\nTotal a pagar: $${total}`,
                    "success"
                );

                onSuccess();
                onClose();
                window.location.reload();
            } else {
                showAlert(
                    result.message || "Error al registrar la salida del vehículo"
                );
            }
        } catch (error: any) {
            console.error("Error en registro de salida:", error);
            showAlert(
                error.message ||
                "Error de conexión. No se pudo registrar la salida del vehículo."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setLicensePlate(value);

        // Limpiar error al escribir
        if (errors.licensePlate) {
            setErrors({ ...errors, licensePlate: "" });
        }
    };

    return (
        <div className="exit-form-overlay" onClick={onClose}>
            <div className="exit-form-container" onClick={(e) => e.stopPropagation()}>
                <div className="exit-form-header">
                    <h2>Registrar Salida de Vehículo</h2>
                    <button
                        className="close-button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <form className="exit-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Información del Vehículo</h3>

                        <div className="input-field">
                            <Label htmlFor="licensePlate">
                                Placa del Vehículo <span className="required">*</span>
                            </Label>
                            <Input
                                id="licensePlate"
                                type="text"
                                placeholder="Ej: ABC123"
                                value={licensePlate}
                                onChange={handleLicensePlateChange}
                                disabled={loading}
                                maxLength={10}
                                aria-invalid={!!errors.licensePlate}
                                className={errors.licensePlate ? "input-error" : ""}
                            />
                            {errors.licensePlate && (
                                <ErrorSpan message={errors.licensePlate} />
                            )}
                            <small className="input-hint">
                                Ingrese la placa del vehículo que está saliendo
                            </small>
                        </div>

                        <div className="input-field">
                            <Label htmlFor="observations">
                                Observaciones <span className="optional">(Opcional)</span>
                            </Label>
                            <textarea
                                id="observations"
                                placeholder="Observaciones adicionales sobre la salida..."
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                disabled={loading}
                                rows={4}
                                maxLength={500}
                                className="textarea-input"
                            />
                            <small className="input-hint">
                                Máximo 500 caracteres
                            </small>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <span>Registrar Salida</span>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="form-info">
                    <p className="info-text">
                        ℹ️ El sistema calculará automáticamente el tiempo de permanencia y
                        el monto a pagar basado en la tarifa del espacio asignado.
                    </p>
                </div>
            </div>
        </div>
    );
}