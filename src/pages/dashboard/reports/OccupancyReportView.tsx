import { StatCard } from "@/components/ui/StatCard";
import { OccupancyReport } from "@/interfaces";
import { formatPeriod } from "@/utils/reports";
import { MapPin } from "lucide-react";

export function OccupancyReportView({ data }: { data: OccupancyReport }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin size={28} className="text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reporte de Ocupación
            </h2>
            <p className="text-sm text-gray-600">{formatPeriod(data.period)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Capacidad Total"
            value={data.summary.totalCapacity}
            color="blue"
          />
          <StatCard
            label="Ocupados"
            value={data.summary.currentOccupied}
            color="red"
          />
          <StatCard
            label="Disponibles"
            value={data.summary.currentAvailable}
            color="green"
          />
          <StatCard
            label="% Ocupación"
            value={`${data.summary.overallOccupancyRate}%`}
            color="purple"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ocupación por Zona
          </h3>
          <div className="space-y-4">
            {data.currentOccupancy.map((zone, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{zone.zone}</h4>
                    <p className="text-sm text-gray-600">{zone.vehicleType}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {zone.occupancyRate}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {zone.occupied}/{zone.totalSpaces}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${zone.occupancyRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Espacios con Mayor Rotación
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {data.topRotatingSpaces.slice(0, 10).map((space, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg text-center"
              >
                <div className="text-xs text-gray-600 mb-1">{space.zone}</div>
                <div className="text-lg font-bold text-indigo-600">
                  #{space.spaceNumber}
                </div>
                <div className="text-sm text-gray-600">
                  {space.totalUsages} usos
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
