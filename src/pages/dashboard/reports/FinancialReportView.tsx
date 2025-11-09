import { StatCard } from "@/components/ui/StatCard";
import { FinancialReport } from "@/interfaces";
import { formatPeriod } from "@/utils/reports";
import { DollarSign } from "lucide-react";

export function FinancialReportView({ data }: { data: FinancialReport }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign size={28} className="text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reporte Financiero
            </h2>
            <p className="text-sm text-gray-600">{formatPeriod(data.period)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Ingresos Totales"
            value={`$${data.summary.totalRevenue.toLocaleString()}`}
            color="green"
          />
          <StatCard
            label="Transacciones"
            value={data.summary.totalTransactions}
            color="blue"
          />
          <StatCard
            label="Ticket Promedio"
            value={`$${data.summary.averageTicket.toLocaleString()}`}
            color="purple"
          />
          <StatCard
            label="Horas Totales"
            value={`${data.summary.totalHours}h`}
            color="yellow"
          />
          <StatCard
            label="Ingreso/Hora"
            value={`$${data.summary.revenuePerHour.toLocaleString()}`}
            color="indigo"
          />
          <StatCard
            label="Hrs. Promedio"
            value={`${data.summary.averageHoursParked}h`}
            color="pink"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ingresos por Tipo de Vehículo
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trans.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hrs. Totales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tarifa/Hr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    % Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.vehicleTypeRevenue.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {item.vehicleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.transactions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.totalHours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.hourlyRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.percentageOfTotal}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ingresos por Zona
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.zoneRevenue.map((zone, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {zone.zone}
                </h4>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ${zone.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {zone.transactions} trans. • Ticket prom: $
                  {zone.averageTicket.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
