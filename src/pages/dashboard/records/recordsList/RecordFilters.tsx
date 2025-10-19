import { useState } from "react";
import { Search, Filter, ChevronDown, Calendar, User } from "lucide-react";
import { FiltersRecord } from "@/interfaces";
import "./RecordFilters.css";

interface RecordFiltersProps {
  filters: FiltersRecord;
  setFilters: React.Dispatch<React.SetStateAction<FiltersRecord>>;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function RecordFilters({
  filters,
  setFilters,
  onApplyFilters,
  onClearFilters,
}: RecordFiltersProps) {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleFilterChange = (key: keyof FiltersRecord, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filterCard">
      <div className="filterHeader">
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filterToggle"
          >
            <Filter className="filterIcon" />
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            <ChevronDown
              className="chevron"
              style={{
                transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
          <div className="inputGroup">
            <div className="inputWrapper">
              <Search className="inputIcon" />
              <input
                type="text"
                placeholder="Buscar por placa..."
                value={filters.licensePlate}
                onChange={(e) =>
                  handleFilterChange("licensePlate", e.target.value)
                }
                className="input"
              />
            </div>
          </div>
          <div className="inputGroup">
            <div className="inputWrapper">
              <Filter className="inputIcon" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="select"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="finished">Finalizados</option>
              </select>
            </div>
          </div>
        </div>
        <div className="filterActions">
          <button onClick={onClearFilters} className="clearButton">
            Limpiar filtros
          </button>
          <button onClick={onApplyFilters} className="applyButton">
            Aplicar filtros
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filtersContent">
          <div className="filtersGrid">
            <div className="inputGroup">
              <label className="label">ID Controlador Entrada</label>
              <div className="inputWrapper">
                <User className="inputIcon" />
                <input
                  type="number"
                  placeholder="ID del controlador..."
                  value={filters.entryControllerId}
                  onChange={(e) =>
                    handleFilterChange("entryControllerId", e.target.value)
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="label">ID Controlador Salida</label>
              <div className="inputWrapper">
                <User className="inputIcon" />
                <input
                  type="number"
                  placeholder="ID del controlador..."
                  value={filters.exitControllerId}
                  onChange={(e) =>
                    handleFilterChange("exitControllerId", e.target.value)
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="label">Entrada desde</label>
              <div className="inputWrapper">
                <Calendar className="inputIcon" />
                <input
                  type="datetime-local"
                  value={filters.entryStartDate}
                  onChange={(e) =>
                    handleFilterChange("entryStartDate", e.target.value)
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="label">Entrada hasta</label>
              <div className="inputWrapper">
                <Calendar className="inputIcon" />
                <input
                  type="datetime-local"
                  value={filters.entryEndDate}
                  onChange={(e) =>
                    handleFilterChange("entryEndDate", e.target.value)
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="label">Salida desde</label>
              <div className="inputWrapper">
                <Calendar className="inputIcon" />
                <input
                  type="datetime-local"
                  value={filters.exitStartDate}
                  onChange={(e) =>
                    handleFilterChange("exitStartDate", e.target.value)
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="label">Salida hasta</label>
              <div className="inputWrapper">
                <Calendar className="inputIcon" />
                <input
                  type="datetime-local"
                  value={filters.exitEndDate}
                  onChange={(e) =>
                    handleFilterChange("exitEndDate", e.target.value)
                  }
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
