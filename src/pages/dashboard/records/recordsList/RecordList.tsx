import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  ApiResponse,
  FiltersRecord,
  ParkingRecordFiltered,
} from "@/interfaces";
import { apiRequest } from "@/services";

import "./RecordList.css";
import { RecordFilters } from "./RecordFilters";
import { RecordTable } from "./RecordTable";
import { useAuth } from "@/context/AuthContext";

export function RecordList() {
  const API_URL = "api/vehicleRecords/filtered";
  const { user } = useAuth();

  const [records, setRecords] = useState<ParkingRecordFiltered[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<FiltersRecord>({
    branchId: user!.branchId,
    licensePlate: "",
    entryControllerId: "",
    exitControllerId: "",
    status: "",
    entryStartDate: "",
    entryEndDate: "",
    exitStartDate: "",
    exitEndDate: "",
  });

  const fetchRecords = async (currentFilters: FiltersRecord) => {
    try {
      setLoading(true);
      setError("");

      const result: ApiResponse<ParkingRecordFiltered[]> = await apiRequest<
        ParkingRecordFiltered[]
      >(API_URL, "POST", currentFilters);

      if (result.success && result.data) {
        setRecords(result.data);
      } else {
        setError(result.message || "No se pudo cargar la lista de registros.");
      }
    } catch (err: any) {
      setError("Error de conexión con el servidor. Intenta recargar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(filters);
  }, []);

  const handleApplyFilters = () => {
    console.log(filters);

    fetchRecords(filters);
  };

  const handleClearFilters = () => {
    const defaultFilters: FiltersRecord = {
      branchId: user!.branchId,
      licensePlate: "",
      entryControllerId: "",
      exitControllerId: "",
      status: "",
      entryStartDate: "",
      entryEndDate: "",
      exitStartDate: "",
      exitEndDate: "",
    };
    setFilters(defaultFilters);
    fetchRecords(defaultFilters);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <RecordFilters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <div className="loadingContainer">
            <div className="loadingContent">
              <Loader2 className="spinner-records" />
              <p className="loadingText">Cargando registros...</p>
            </div>
          </div>
        ) : error ? (
          <div className="errorContainer">
            <div className="errorBox">
              <p className="errorText">{error}</p>
            </div>
          </div>
        ) : (
          <RecordTable records={records} />
        )}

        <div className="summary">Mostrando {records.length} registros</div>
      </div>
    </div>
  );
}
