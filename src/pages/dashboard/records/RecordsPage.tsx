import { ArrowUp } from "lucide-react";
import "./RecordsPage.css";
import { RecordList } from "./recordsList/RecordList";
import { CreateEntryModal } from "./entry/CreateEntryModal";

export function RecordsPage() {
  const handleCreateExit = () => {};
  return (
    <div>
      {/* Header de la página */}
      <header className="records-page-header">
        <h1 className="records-header-title">Registros</h1>
        <div className="records-actions-header">
          <CreateEntryModal />
          <button
            className="records-button-header btn-create-exit"
            onClick={handleCreateExit}
          >
            <ArrowUp />
            Registrar salida
          </button>
        </div>
      </header>
      <main>
        <RecordList />
      </main>
    </div>
  );
}
