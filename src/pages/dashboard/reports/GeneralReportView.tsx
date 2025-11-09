import { StatCard } from "@/components/ui/StatCard";
import { GeneralReport } from "@/interfaces";
import { formatPeriod } from "@/utils/reports";
import { FileText } from "lucide-react";

export function GeneralReportView({ data }: { data: GeneralReport }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={28} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reporte General
            </h2>
            <p className="text-sm text-gray-600">{formatPeriod(data.period)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Registros"
            value={data.summary.totalRecords}
            color="blue"
          />
          <StatCard label="Activos" value={data.summary.active} color="green" />
          <StatCard
            label="Finalizados"
            value={data.summary.finished}
            color="purple"
          />
          <StatCard
            label="Cancelados"
            value={data.summary.cancelled}
            color="red"
          />
          <StatCard
            label="Estadía Promedio"
            value={`${data.summary.averageStayHours}h`}
            color="yellow"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Horas Pico
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {data.peakHours.map((peak, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {peak.hour}:00
                </div>
                <div className="text-sm text-gray-600">
                  {peak.count} vehículos
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas por Tipo de Vehículo
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vehículos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Porcentaje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.vehicleTypeStats.map((stat, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {stat.vehicleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {stat.totalVehicles}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      ${stat.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {stat.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
