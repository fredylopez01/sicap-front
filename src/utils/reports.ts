import { ReportData, ReportType } from "@/interfaces";

export function formatPeriod(period: {
  startDate: string | null;
  endDate: string | null;
}) {
  if (!period.startDate && !period.endDate) {
    return "Todos los registros";
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (period.startDate && period.endDate) {
    return `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`;
  }

  if (period.startDate) {
    return `Desde ${formatDate(period.startDate)}`;
  }

  return `Hasta ${formatDate(period.endDate)}`;
}

export function getReportTitle(type: ReportType): string {
  const titles = {
    general: "Reporte General",
    financial: "Reporte Financiero",
    occupancy: "Reporte de Ocupación",
    performance: "Reporte de Rendimiento",
  };
  return titles[type];
}

export function generatePDFContent(data: ReportData): string {
  const title = getReportTitle(data.type);
  const period = formatPeriod(data.period);
  const date = new Date().toLocaleString("es-CO");

  let content = `
    <div class="title-pdf">
      <img src="/logo.jpg" alt="Logo" class="logo-pdf">
      <h1>${title}</h1>
    </div>
    <div class="period">Período: ${period}</div>
    <div class="period">Generado: ${date}</div>
  `;

  switch (data.type) {
    case "general":
      content += `
        <div class="summary">
          <h2>Resumen General</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-label">Total de Registros</div>
              <div class="stat-value">${data.summary.totalRecords}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Activos</div>
              <div class="stat-value">${data.summary.active}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Finalizados</div>
              <div class="stat-value">${data.summary.finished}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Cancelados</div>
              <div class="stat-value">${data.summary.cancelled}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Estadía Promedio</div>
              <div class="stat-value">${
                data.summary.averageStayHours
              } horas</div>
            </div>
          </div>
        </div>

        <h2>Horas Pico</h2>
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cantidad de Vehículos</th>
            </tr>
          </thead>
          <tbody>
            ${data.peakHours
              .map(
                (peak) => `
              <tr>
                <td>${peak.hour}:00</td>
                <td>${peak.count}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>Estadísticas por Tipo de Vehículo</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Total Vehículos</th>
              <th>Ingresos</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            ${data.vehicleTypeStats
              .map(
                (stat) => `
              <tr>
                <td>${stat.vehicleType}</td>
                <td>${stat.totalVehicles}</td>
                <td>${stat.totalRevenue.toLocaleString()}</td>
                <td>${stat.percentage}%</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
      break;

    case "financial":
      content += `
        <div class="summary">
          <h2>Resumen Financiero</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-label">Ingresos Totales</div>
              <div class="stat-value">${data.summary.totalRevenue.toLocaleString()}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Transacciones</div>
              <div class="stat-value">${data.summary.totalTransactions}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Ticket Promedio</div>
              <div class="stat-value">${data.summary.averageTicket.toLocaleString()}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Ingreso por Hora</div>
              <div class="stat-value">${data.summary.revenuePerHour.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <h2>Ingresos por Tipo de Vehículo</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Ingresos</th>
              <th>Transacciones</th>
              <th>Horas Totales</th>
              <th>Tarifa/Hora</th>
              <th>% del Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.vehicleTypeRevenue
              .map(
                (item) => `
              <tr>
                <td>${item.vehicleType}</td>
                <td>${item.revenue.toLocaleString()}</td>
                <td>${item.transactions}</td>
                <td>${item.totalHours}h</td>
                <td>${item.hourlyRate}</td>
                <td>${item.percentageOfTotal}%</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>Ingresos por Zona</h2>
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Ingresos</th>
              <th>Transacciones</th>
              <th>Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            ${data.zoneRevenue
              .map(
                (zone) => `
              <tr>
                <td>${zone.zone}</td>
                <td>${zone.revenue.toLocaleString()}</td>
                <td>${zone.transactions}</td>
                <td>${zone.averageTicket.toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
      break;

    case "occupancy":
      content += `
        <div class="summary">
          <h2>Resumen de Ocupación</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-label">Capacidad Total</div>
              <div class="stat-value">${data.summary.totalCapacity}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Espacios Ocupados</div>
              <div class="stat-value">${data.summary.currentOccupied}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Espacios Disponibles</div>
              <div class="stat-value">${data.summary.currentAvailable}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Tasa de Ocupación</div>
              <div class="stat-value">${
                data.summary.overallOccupancyRate
              }%</div>
            </div>
          </div>
        </div>

        <h2>Ocupación por Zona</h2>
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Tipo de Vehículo</th>
              <th>Total</th>
              <th>Ocupados</th>
              <th>Disponibles</th>
              <th>% Ocupación</th>
            </tr>
          </thead>
          <tbody>
            ${data.currentOccupancy
              .map(
                (zone) => `
              <tr>
                <td>${zone.zone}</td>
                <td>${zone.vehicleType}</td>
                <td>${zone.totalSpaces}</td>
                <td>${zone.occupied}</td>
                <td>${zone.available}</td>
                <td>${zone.occupancyRate}%</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>Espacios con Mayor Rotación (Top 10)</h2>
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Espacio</th>
              <th>Total de Usos</th>
            </tr>
          </thead>
          <tbody>
            ${data.topRotatingSpaces
              .slice(0, 10)
              .map(
                (space) => `
              <tr>
                <td>${space.zone}</td>
                <td>#${space.spaceNumber}</td>
                <td>${space.totalUsages}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
      break;

    case "performance":
      content += `
        <div class="summary">
          <h2>Eficiencia Operacional</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-label">Total Controladores</div>
              <div class="stat-value">${
                data.operationalEfficiency.totalControllers
              }</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Controladores Activos</div>
              <div class="stat-value">${
                data.operationalEfficiency.activeControllers
              }</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Ops/Controlador</div>
              <div class="stat-value">${Math.round(
                data.operationalEfficiency.averageOperationsPerController
              )}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Tasa de Cancelación</div>
              <div class="stat-value">${
                data.operationalEfficiency.cancellationRate
              }%</div>
            </div>
          </div>
        </div>

        <h2>Top 5 Mejores Controladores</h2>
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Controlador</th>
              <th>Total Operaciones</th>
              <th>Ingresos Generados</th>
            </tr>
          </thead>
          <tbody>
            ${data.topPerformers
              .map(
                (performer, idx) => `
              <tr>
                <td>#${idx + 1}</td>
                <td>${performer.name}</td>
                <td>${performer.totalOperations}</td>
                <td>${performer.revenueGenerated.toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>Todos los Controladores</h2>
        <table>
          <thead>
            <tr>
              <th>Controlador</th>
              <th>Entradas</th>
              <th>Salidas</th>
              <th>Total Ops</th>
              <th>Ingresos Gen.</th>
              <th>Prom/Salida</th>
            </tr>
          </thead>
          <tbody>
            ${data.controllerStats
              .map(
                (controller) => `
              <tr>
                <td>${controller.name}</td>
                <td>${controller.totalEntries}</td>
                <td>${controller.totalExits}</td>
                <td>${controller.totalOperations}</td>
                <td>${controller.revenueGenerated.toLocaleString()}</td>
                <td>${controller.averageRevenuePerExit.toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
      break;
  }

  return content;
}
