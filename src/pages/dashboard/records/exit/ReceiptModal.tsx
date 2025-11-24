import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Download, Calendar, Clock, Car, CreditCard, MapPin, Hash } from "lucide-react";
import { apiRequest } from "../../../../services/api";
import { ApiResponse } from "../../../../interfaces";
import logo from "/logo.jpg";
import "./ReceiptModal.css";
import { Branch } from "../../../../interfaces/Branch";

interface ReceiptData {
  id: number;
  licensePlate: string;
  spaceId: number;
  entryControllerId: number;
  exitControllerId: number;
  entryDate: string;
  exitDate: string;
  parkedHours: string;
  appliedRate: string;
  totalToPay: string;
  observations: string | null;
  status: string;
  branchId: number;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData;
}

export function ReceiptModal({ isOpen, onClose, receiptData }: ReceiptModalProps) {
  const [branchInfo, setBranchInfo] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && receiptData.branchId) {
      fetchBranchInfo();
    }
  }, [isOpen, receiptData.branchId]);

  const fetchBranchInfo = async () => {
    try {
      setLoading(true);
      const result: ApiResponse<any> = await apiRequest<any>(
        `/api/branches/${receiptData.branchId}`,
        "GET"
      );

      if (result.success && result.data) {
        console.log(result.data);
        
        setBranchInfo(result.data);
      }
    } catch (error) {
      console.error("Error al cargar información de la sede:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatHours = (hours: string) => {
    const totalHours = parseFloat(hours);
    const wholeHours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}min`;
  };

  const handleDownload = () => {
    if (!receiptRef.current) return;

    // Crear un elemento temporal para imprimir
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const receiptHTML = receiptRef.current.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recibo #${receiptData.id}</title>
          <style>
            ${styles}
            body { margin: 0; padding: 20px; background: white; }
            .receipt-container { max-width: 400px; margin: 0 auto; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">${receiptHTML}</div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="receipt-modal-content">
        <DialogHeader className="receipt-modal-header">
          <DialogTitle>Recibo de Parqueadero</DialogTitle>
        </DialogHeader>

        <div className="receipt-wrapper">
          <div ref={receiptRef} className="receipt-content">
            {/* Header del recibo */}
            <div className="receipt-header">
              <div className="receipt-logo">
                <img
                  src={logo}
                  alt="Logo"
                  className="rounded-full w-[60px] h-[60px] my-[2px]"
                />
              </div>
              <div>
                <h1 className="receipt-title">
                  {loading ? "Cargando..." : branchInfo?.name || "Parqueadero"}
                </h1>
                <div className="flex gap-6">
                  {branchInfo?.address && (
                    <p className="receipt-address">{branchInfo.address}</p>
                  )}
                  {branchInfo?.phone && (
                    <p className="receipt-phone">Tel: {branchInfo.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="receipt-divider" />

            {/* Información del recibo */}
            <div className="receipt-info">
              <div className="info-row">
                <span className="info-label">
                  <Hash className="info-icon" />
                  No. Recibo
                </span>
                <span className="info-value">#{receiptData.id.toString().padStart(6, "0")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">
                  <Calendar className="info-icon" />
                  Fecha
                </span>
                <span className="info-value">{formatDate(receiptData.exitDate)}</span>
              </div>
            </div>

            <div className="receipt-divider" />

            {/* Detalles del vehículo */}
            <div className="receipt-section">
              <h3 className="section-title">Información del Vehículo</h3>
              <div className="detail-row">
                <span className="detail-label">
                  <Car className="detail-icon" />
                  Placa
                </span>
                <span className="detail-value highlight">{receiptData.licensePlate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  <MapPin className="detail-icon" />
                  Espacio
                </span>
                <span className="detail-value">#{receiptData.spaceId}</span>
              </div>
            </div>

            {/* Tiempo de permanencia */}
            <div className="receipt-section">
              <h3 className="section-title">Tiempo de Permanencia</h3>
              <div className="detail-row">
                <span className="detail-label">
                  <Clock className="detail-icon" />
                  Entrada
                </span>
                <span className="detail-value">
                  {formatDate(receiptData.entryDate)} - {formatTime(receiptData.entryDate)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  <Clock className="detail-icon" />
                  Salida
                </span>
                <span className="detail-value">
                  {formatDate(receiptData.exitDate)} - {formatTime(receiptData.exitDate)}
                </span>
              </div>
              <div className="detail-row total-time">
                <span className="detail-label">Tiempo Total</span>
                <span className="detail-value">{formatHours(receiptData.parkedHours)}</span>
              </div>
            </div>

            <div className="receipt-divider" />

            {/* Cálculo del pago */}
            <div className="receipt-section">
              <h3 className="section-title">Detalle de Pago</h3>
              <div className="detail-row">
                <span className="detail-label">Tarifa por hora</span>
                <span className="detail-value">{formatCurrency(receiptData.appliedRate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Horas parqueadas</span>
                <span className="detail-value">{parseFloat(receiptData.parkedHours).toFixed(2)}</span>
              </div>
            </div>

            <div className="receipt-divider bold" />

            {/* Total a pagar */}
            <div className="receipt-total">
              <div className="total-row">
                <span className="total-label">
                  <CreditCard className="total-icon" />
                  TOTAL A PAGAR
                </span>
                <span className="total-value">{formatCurrency(receiptData.totalToPay)}</span>
              </div>
            </div>

            {/* Observaciones */}
            {receiptData.observations && (
              <>
                <div className="receipt-divider" />
                <div className="receipt-observations">
                  <p className="observations-title">Observaciones:</p>
                  <p className="observations-text">{receiptData.observations}</p>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="receipt-footer">
              <p className="footer-text">¡Gracias por usar nuestro servicio!</p>
              <p className="footer-date">
                Impreso el {formatDate(new Date().toISOString())} a las {formatTime(new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="receipt-actions">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar / Imprimir
          </Button>
          <Button variant="outline" onClick={onClose}>
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}