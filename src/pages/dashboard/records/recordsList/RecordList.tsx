import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  ApiResponse,
  FiltersRecord,
  ParkingRecordFiltered,
  ParkingRecordsPaginated,
} from "@/interfaces";
import { apiRequest } from "@/services";

import "./RecordList.css";
import { RecordFilters } from "./RecordFilters";
import { RecordTable } from "./RecordTable";
import { useAuth } from "@/context/AuthContext";
import { Pagination } from "@/components";

export function RecordList() {
  const API_URL = "api/vehicleRecords/filtered";
  const { user } = useAuth();

  const [records, setRecords] = useState<ParkingRecordsPaginated>({
    pagination: {
      currentPage: 0,
      pageSize: 10,
      totalPages: 1,
      totalRecords: 0,
    },
    records: [],
  });
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
    page: 1,
    pageSize: 10,
  });

  const fetchRecords = async (currentFilters: FiltersRecord) => {
    try {
      setLoading(true);
      setError("");

      const result: ApiResponse<ParkingRecordsPaginated> =
        await apiRequest<ParkingRecordsPaginated>(
          API_URL,
          "POST",
          currentFilters
        );

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
  }, [filters]);

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
      page: filters.page,
      pageSize: filters.pageSize,
    };
    setFilters(defaultFilters);
    fetchRecords(defaultFilters);
  };

  const handleRecordUpdate = (
    partialUpdate: Partial<ParkingRecordFiltered>
  ) => {
    records &&
      (records.records = records.records.map((record) => {
        if (record.id === partialUpdate.id) {
          return {
            ...record,
            ...partialUpdate,
          };
        }
        return record;
      }));
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
          <>
            <RecordTable
              records={records!.records}
              onRecordUpdatedTable={handleRecordUpdate}
            />
            <Pagination
              pagination={records!.pagination}
              setFilters={setFilters}
            />
          </>
        )}
      </div>
    </div>
  );
}
