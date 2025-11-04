import { useState } from "react";
import {
  FileText,
  TrendingUp,
  MapPin,
  Users,
  Calendar,
  Download,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/services";
import "./Reports.css";

// Types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ActivityReport {
  type: "activity";
  branchId: string;
  summary: {
    total: number;
    active: number;
    finished: number;
    cancelled: number;
  };
}

interface IncomeReport {
  type: "income";
  branchId: string;
  startDate?: string;
  endDate?: string;
  totalIncome: number;
  totalRecords: number;
}

interface UsageReport {
  type: "usage";
  branchId: string;
  usage: Array<{
    zone: string;
    totalSpaces: number;
    occupied: number;
    percentage: number;
  }>;
}

interface ControllersReport {
  controller: string;
  entries: number;
  exits: number;
  total: number;
}

type ReportData =
  | ActivityReport
  | IncomeReport
  | UsageReport
  | ControllersReport[];

type ReportType = "activity" | "income" | "usage" | "controllers";

export function Reports() {
  const [reportType, setReportType] = useState<ReportType>("activity");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Mock user - replace with your actual user context
  const user = { branchId: "1" };

  const fetchReport = async () => {
    const API_URL = "/api/reports";

    try {
      setLoading(true);
      setReportData(null);

      const body: any = {
        branchId: user.branchId,
        type: reportType,
      };

      if (reportType === "income" && (startDate || endDate)) {
        body.startDate = startDate || undefined;
        body.endDate = endDate || undefined;
      }

      const result: ApiResponse<ReportData> = await apiRequest<ReportData>(
        API_URL,
        "POST",
        body
      );

      if (result.success && result.data) {
        setReportData(result.data);
      } else {
        alert(result.message || "No se pudo generar el reporte.");
      }
    } catch (err: any) {
      alert("Error de conexión con el servidor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    if (Array.isArray(reportData)) {
      // Controllers report
      return (
        <div className="report-content">
          <h3 className="report-title">
            <Users size={24} />
            Actividad por Controlador
          </h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Controlador</th>
                  <th>Entradas</th>
                  <th>Salidas</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((controller, idx) => (
                  <tr key={idx}>
                    <td>{controller.controller}</td>
                    <td>{controller.entries}</td>
                    <td>{controller.exits}</td>
                    <td>
                      <strong>{controller.total}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    switch (reportData.type) {
      case "activity":
        return (
          <div className="report-content">
            <h3 className="report-title">
              <FileText size={24} />
              Reporte de Actividad General
            </h3>
            <div className="stats-grid">
              <div className="stat-card-report">
                <div className="stat-label-report">Total de Registros</div>
                <div className="stat-value-report">
                  {reportData.summary.total}
                </div>
              </div>
              <div className="stat-card-report active">
                <div className="stat-label-report">Activos</div>
                <div className="stat-value-report">
                  {reportData.summary.active}
                </div>
              </div>
              <div className="stat-card-report finished">
                <div className="stat-label-report">Finalizados</div>
                <div className="stat-value-report">
                  {reportData.summary.finished}
                </div>
              </div>
              <div className="stat-card-report cancelled">
                <div className="stat-label-report">Cancelados</div>
                <div className="stat-value-report">
                  {reportData.summary.cancelled}
                </div>
              </div>
            </div>
          </div>
        );

      case "income":
        return (
          <div className="report-content">
            <h3 className="report-title">
              <TrendingUp size={24} />
              Reporte de Ingresos
            </h3>
            <div className="income-summary">
              <div className="income-card">
                <div className="income-label">Total de Ingresos</div>
                <div className="income-value">
                  ${reportData.totalIncome.toLocaleString("es-CO")}
                </div>
              </div>
              <div className="income-details">
                <div className="detail-row">
                  <span>Registros procesados:</span>
                  <strong>{reportData.totalRecords}</strong>
                </div>
                {reportData.startDate && (
                  <div className="detail-row">
                    <span>Desde:</span>
                    <strong>
                      {new Date(reportData.startDate).toLocaleDateString(
                        "es-CO"
                      )}
                    </strong>
                  </div>
                )}
                {reportData.endDate && (
                  <div className="detail-row">
                    <span>Hasta:</span>
                    <strong>
                      {new Date(reportData.endDate).toLocaleDateString("es-CO")}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "usage":
        return (
          <div className="report-content">
            <h3 className="report-title">
              <MapPin size={24} />
              Uso de Espacios por Zona
            </h3>
            <div className="usage-list">
              {reportData.usage.map((zone, idx) => (
                <div key={idx} className="zone-card">
                  <div className="zone-header">
                    <h4>{zone.zone}</h4>
                    <span className="zone-percentage">{zone.percentage}%</span>
                  </div>
                  <div className="zone-stats">
                    <span>Ocupados: {zone.occupied}</span>
                    <span>Total: {zone.totalSpaces}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${zone.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="parking-reports">
      <div className="container">
        <div className="header">
          <h1>Sistema de Reportes</h1>
          <p>Genera y visualiza reportes del parqueadero</p>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Tipo de Reporte</label>
            <div className="select-wrapper">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                disabled={loading}
              >
                <option value="activity">Actividad General</option>
                <option value="income">Ingresos</option>
                <option value="usage">Uso de Espacios</option>
                <option value="controllers">Actividad por Controlador</option>
              </select>
            </div>
          </div>

          <div
            className={`form-group ${
              reportType !== "income" ? "date-range-disabled" : ""
            }`}
          >
            <label>
              <Calendar
                size={16}
                style={{ display: "inline", marginRight: "4px" }}
              />
              Rango de Fechas{" "}
              {reportType !== "income" && "(Solo para reportes de ingresos)"}
            </label>
            <div className="date-range">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
                placeholder="Fecha inicio"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
                placeholder="Fecha final"
              />
            </div>
          </div>

          <button className="button" onClick={fetchReport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Generando Reporte...
              </>
            ) : (
              <>
                <Download size={20} />
                Generar Reporte
              </>
            )}
          </button>
        </div>

        {renderReportContent()}
      </div>
    </div>
  );
}
