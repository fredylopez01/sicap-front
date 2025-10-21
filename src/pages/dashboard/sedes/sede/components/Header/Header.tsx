import { Branch } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";
import BranchSheet from "../Sheet/BranchSheet";
import "./Header.css";

interface HeaderProps {
  branch: Branch | null;
  handleBack: () => void;
  handleRedirectNewZone?: () => void;
  zonasCount?: number;
  onDeleteBranch?: (branchId: number) => void; // <-- nueva prop
}

export default function Header({
  branch,
  handleBack,
  zonasCount = 0,
  onDeleteBranch,
}: HeaderProps) {
  const handleDeleteClick = () => {
    if (!branch) return;

    if (window.confirm(`¿Deseas eliminar la sede "${branch.name}"?`)) {
      if (onDeleteBranch) {
        onDeleteBranch(branch.id);
      }
    }
  };

  return (
    <div>
      <div className="branch-top">
        <Button size="sm" variant="outline" onClick={handleBack}>
          Volver a Sedes
        </Button>
      </div>

      <div className="branch-header">
        <h2 className="branch-title">{branch?.name || "Sede principal"}</h2>

        <div className="branch-content">
          <div className="branch-column">
            <BranchSheet branch={branch}></BranchSheet>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteClick} // <-- aquí se llama
            >
              Eliminar sede
            </Button>
          </div>

          <div className="branch-column">
            <p>
              <strong>Dirección:</strong> {branch?.address || "—"}
            </p>
            <p>
              <strong>Departamento:</strong> {branch?.department || "—"}
            </p>
          </div>

          <div className="branch-column">
            <p>
              <strong>Ciudad:</strong> {branch?.city || "—"}
            </p>
            <p>
              <strong>Teléfono:</strong> {branch?.phone || "—"}
            </p>
          </div>
        </div>

        <p className="branch-summary">
          {branch
            ? `${zonasCount} zona(s) registrada(s)`
            : "Gestión de zonas de parqueo de la sede"}
        </p>
      </div>
    </div>
  );
}
