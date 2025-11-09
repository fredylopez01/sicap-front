import { StatCard } from "@/components/ui/StatCard";
import { PerformanceReport } from "@/interfaces";
import { formatPeriod } from "@/utils/reports";
import { Users } from "lucide-react";

export function PerformanceReportView({ data }: { data: PerformanceReport }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users size={28} className="text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reporte de Rendimiento
            </h2>
            <p className="text-sm text-gray-600">{formatPeriod(data.period)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Controladores"
            value={data.operationalEfficiency.totalControllers}
            color="blue"
          />
          <StatCard
            label="Controladores Activos"
            value={data.operationalEfficiency.activeControllers}
            color="green"
          />
          <StatCard
            label="Ops/Controlador"
            value={Math.round(
              data.operationalEfficiency.averageOperationsPerController
            )}
            color="purple"
          />
          <StatCard
            label="Tasa Cancelación"
            value={`${data.operationalEfficiency.cancellationRate}%`}
            color="red"
          />
          <StatCard
            label="Tiempo Proc. Prom."
            value={`${data.operationalEfficiency.averageProcessingTimeHours}h`}
            color="yellow"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Mejores Controladores
          </h3>
          <div className="space-y-3">
            {data.topPerformers.map((performer, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-yellow-900">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {performer.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {performer.totalOperations} operaciones
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    ${performer.revenueGenerated.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">generados</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Todos los Controladores
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Controlador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entradas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Salidas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Ops
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ingresos Gen.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Prom/Salida
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.controllerStats.map((controller) => (
                  <tr key={controller.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {controller.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {controller.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {controller.totalEntries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {controller.totalExits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      {controller.totalOperations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                      ${controller.revenueGenerated.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      ${controller.averageRevenuePerExit.toLocaleString()}
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
