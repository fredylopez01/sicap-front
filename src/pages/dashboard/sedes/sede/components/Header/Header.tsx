import { Branch } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";
import BranchSheet from "../Sheet/BranchSheet";
import "./Header.css";

interface HeaderProps {
  branch: Branch;
  handleBack: () => void;
  handleRedirectNewZone?: () => void;
  zonasCount?: number;
}

export default function Header({
  branch,
  handleBack,
  zonasCount = 0,
}: HeaderProps) {
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
          {/* Columna 1: Botones */}
          <div className="branch-column">
            <BranchSheet branch={branch}></BranchSheet>
            <Button size="sm" variant="destructive">
              Eliminar sede
            </Button>
          </div>

          {/* Columna 2: Dirección y Departamento */}
          <div className="branch-column">
            <p>
              <strong>Dirección:</strong> {branch?.address || "—"}
            </p>
            <p>
              <strong>Departamento:</strong> {branch?.department || "—"}
            </p>
          </div>

          {/* Columna 3: Ciudad y Teléfono */}
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
