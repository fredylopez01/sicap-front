import { ParkingRecordFiltered } from "@/interfaces";
import { ArrowDown, ArrowUp } from "lucide-react";

interface RecordTableProps {
  records: ParkingRecordFiltered[];
}

export function RecordTable({ records }: RecordTableProps) {
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

  return (
    <div className="tableCard">
      <div className="tableWrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Placa</th>
              <th className="th">Espacio</th>
              <th className="th">
                <div className="flex items-center">
                  <ArrowDown size={15} />
                  Entrada
                </div>
              </th>
              <th className="th">
                <div className="flex items-center">
                  <ArrowUp size={15} />
                  Salida
                </div>
              </th>
              <th className="th">Horas</th>
              <th className="th">Total</th>
              <th className="th">Estado</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {records.map((record) => (
              <tr key={record.id} className="tr">
                <td className="td">
                  <div className="plateText">{record.licensePlate}</div>
                </td>
                <td className="td">
                  <div className="normalText">{record.space.spaceNumber}</div>
                </td>
                <td className="td">
                  <div className="dateCell">
                    <div className="greenDot"></div>
                    <div className="dateText">
                      {formatDate(record.entryDate)}
                    </div>
                  </div>
                </td>
                <td className="td">
                  {record.exitDate ? (
                    <div className="dateCell">
                      <div className="redDot"></div>
                      <div className="dateText">
                        {formatDate(record.exitDate)}
                      </div>
                    </div>
                  ) : (
                    <span className="emptyText">-</span>
                  )}
                </td>
                <td className="td">
                  <div className="normalText">
                    {record.parkedHours ? `${record.parkedHours} hrs` : "-"}
                  </div>
                </td>
                <td className="td">
                  <div className="priceText">
                    {record.totalToPay
                      ? formatCurrency(record.totalToPay)
                      : "-"}
                  </div>
                </td>
                <td className="td">
                  <span
                    className={
                      record.status === "active"
                        ? "badgeActive"
                        : "badgeFinished"
                    }
                  >
                    {record.status === "active" ? "Activo" : "Finalizado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {records.length === 0 && (
        <div className="emptyState">
          <p className="emptyText">No se encontraron registros</p>
        </div>
      )}
    </div>
  );
}
