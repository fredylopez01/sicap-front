import { useState } from "react";
import { Calendar, Download, Loader2, BarChart3 } from "lucide-react";
import { ApiResponse, ReportData, ReportType } from "@/interfaces";
import { apiRequest } from "@/services";
import { GeneralReportView } from "./GeneralReportView";
import { FinancialReportView } from "./FinancialReportView";
import { OccupancyReportView } from "./OccupancyReportView";
import { PerformanceReportView } from "./PerformanceReportView";
import { generatePDFContent } from "@/utils/reports";

export function Reports() {
  const [reportType, setReportType] = useState<ReportType>("general");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const user = { branchId: 1 };

  const fetchReport = async () => {
    const API_URL = "/api/reports";

    try {
      setLoading(true);
      setReportData(null);

      const body: any = {
        branchId: user.branchId,
        type: reportType,
      };

      if (startDate) body.startDate = new Date(startDate).toISOString();
      if (endDate) body.endDate = new Date(endDate).toISOString();

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
      alert("Error al generar el reporte. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!reportData) return;

    const htmlContent = generatePDFContent(reportData);
    const fileName = `reporte_${reportType}_${new Date().getTime()}.pdf`;

    // Crear un iframe oculto
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
          .title-pdf {display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #2563eb; margin-bottom: 10px; padding-bottom: 0px;}
          .logo-pdf {width: 40px; height: 40px; border-radius: 50%;}
          h1 { color: #2563eb; padding-bottom: 0px;}
          h2 { color: #1e40af; margin-top: 20px; }
          .summary { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 10px 0; }
          .stat-card { background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; }
          .stat-label { color: #6b7280; font-size: 14px; }
          .stat-value { color: #111827; font-size: 24px; font-weight: bold; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-weight: 600; color: #374151; }
          .period { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
          @page { size: A4; margin: 10mm; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
    iframeDoc.close();

    // Esperar a que cargue el contenido
    setTimeout(() => {
      iframe.contentWindow?.print();

      // Remover el iframe después de imprimir
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    }, 250);
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (reportData.type) {
      case "general":
        return <GeneralReportView data={reportData} />;
      case "financial":
        return <FinancialReportView data={reportData} />;
      case "occupancy":
        return <OccupancyReportView data={reportData} />;
      case "performance":
        return <PerformanceReportView data={reportData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Reportes
          </h1>
          <p className="text-gray-600">
            Genera y visualiza reportes avanzados del parqueadero
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Reporte
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="general">Reporte General</option>
                <option value="financial">Reporte Financiero</option>
                <option value="occupancy">Reporte de Ocupación</option>
                <option value="performance">Reporte de Rendimiento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generando Reporte...
                </>
              ) : (
                <>
                  <BarChart3 size={20} />
                  Generar Reporte
                </>
              )}
            </button>

            {reportData && (
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Download size={20} />
                Descargar PDF
              </button>
            )}
          </div>
        </div>

        {renderReportContent()}
      </div>
    </div>
  );
}
