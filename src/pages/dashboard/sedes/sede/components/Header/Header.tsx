import { Branch } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";
import BranchSheet from "../Sheet/BranchSheet";
import "./Header.css";
import { ArrowLeft, Trash2 } from "lucide-react";

interface HeaderProps {
  branch: Branch | null;
  handleBack: () => void;
  handleRedirectNewZone?: () => void;
  zonasCount?: number;
  onDeleteBranch?: (branchId: number) => void;
}

export default function Header({
  branch,
  handleBack,
  zonasCount = 0,
  onDeleteBranch,
}: HeaderProps) {
  const handleDeleteClick = () => {
    if (!branch || !onDeleteBranch) return;

    onDeleteBranch(branch.id);
  };

  return (
    <div>
      <div className="branch-header">
        <div className="flex items-center gap-3">
          <div className="cancel-btn-container">
            <button type="button" className="cancel-btn" onClick={handleBack}>
              <ArrowLeft />
            </button>
          </div>
          <h2 className="branch-title">{branch?.name || "Sede principal"}</h2>
        </div>

        <div className="branch-content">
          <div className="branch-column">
            <BranchSheet branch={branch} />
            <Button
              className="btn-exit-modal"
              size="sm"
              variant="outline"
              onClick={handleDeleteClick}
            >
              <Trash2 />
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
