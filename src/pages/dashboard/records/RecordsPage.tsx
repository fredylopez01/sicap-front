import "./RecordsPage.css";
import { RecordList } from "./recordsList/RecordList";
import { CreateEntryModal } from "./entry/CreateEntryModal";
import { VehicleExitForm } from "./exit/VehicleExitForm";

export function RecordsPage() {
  return (
    <div>
      <header className="records-page-header">
        <h1 className="records-header-title">Registros</h1>
        <div className="records-actions-header">
          <CreateEntryModal />
          <VehicleExitForm />
        </div>
      </header>
      <main>
        <RecordList />
      </main>
    </div>
  );
}
