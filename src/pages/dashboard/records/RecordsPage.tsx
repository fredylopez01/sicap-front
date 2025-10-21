import "./RecordsPage.css";
import { RecordList } from "./recordsList/RecordList";
import { CreateEntryModal } from "./entry/CreateEntryModal";
import { VehicleExitForm } from "./exit/VehicleExitForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RecordsPage() {
  const [showExitForm, setShowExitForm] = useState(false);

  const handleExitSuccess = () => {
    // Aquí puedes recargar la lista de vehículos activos o actualizar el estado
    console.log("Salida registrada exitosamente");
    // Ejemplo: refetch() o updateRecords()
  };

  return (
    <div>
      {/* Header de la página */}
      <header className="records-page-header">
        <h1 className="records-header-title">Registros</h1>
        <div className="records-actions-header">
          <CreateEntryModal />
          {/* Botón para registrar salida */}
          <Button onClick={() => setShowExitForm(true)}>
            ↑ Registrar salida
          </Button>
        </div>
      </header>
      <main>
        <RecordList />
      </main>
      {/* Modal de registro de salida */}
      {showExitForm && (
        <VehicleExitForm
          onClose={() => setShowExitForm(false)}
          onSuccess={handleExitSuccess}
        />
      )}
    </div>
  );
}