import { Branch } from "@/interfaces/zona";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import "./Header.css";

interface HeaderProps {
  branch: Branch | null;
  handleBack: () => void;
  handleRedirectNewZone?: () => void;
  zonasCount?: number;
}

export default function Header({
  branch,
  handleBack,
  handleRedirectNewZone,
  zonasCount = 0,
}: HeaderProps) {
  return (
    <div className="zones-header">
      <div>
        <Button size="sm" variant="outline" onClick={handleBack}>
          Volver a Sedes
        </Button>

        <h1 className="title">Zonas {branch && `- ${branch.name}`}</h1>

        <div>
          <Badge variant="secondary">{branch?.city}</Badge>
          <Badge variant="secondary">{branch?.department}</Badge>
          <Badge variant="secondary">{branch?.phone}</Badge>
          <Badge variant="secondary">{branch?.address}</Badge>
          {branch?.status == "active" ? (
            <Badge variant="outline" className="status-badge-active">
              {branch?.status}
            </Badge>
          ) : (
            <Badge variant="outline" className="status-badge-disabled">
              {branch?.status}
            </Badge>
          )}
        </div>
        <p>
          {branch
            ? `${zonasCount} zona(s) registrada(s)`
            : "Gestión de zonas de parqueo de la sede"}
        </p>
      </div>

      <div className="button-container">
        {handleRedirectNewZone && (
          <Button onClick={handleRedirectNewZone}>Crear zona</Button>
        )}
      </div>
    </div>
  );
}
