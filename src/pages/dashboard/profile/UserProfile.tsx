import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  Clock,
  Hash,
} from "lucide-react";
import "./UserProfile.css";
import { useAuth } from "@/context/AuthContext";
import { EditUserProfileModal } from "./editUserProfile/EditUserProfile";

export function UserProfile() {
  const { user } = useAuth();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-wrapper">
        <div className="user-profile-card">
          <div className="profile-header">
            <div className="header-content-profile">
              <div className="user-avatar-section">
                <div className="user-avatar">
                  <User className="avatar-icon" />
                </div>
                <div className="user-info">
                  <h1 className="user-name">
                    {user!.names} {user!.lastNames}
                  </h1>
                  <div className="user-badges">
                    <span className={`badge badge-${user!.role.toLowerCase()}`}>
                      {user!.role}
                    </span>
                    <span
                      className={`badge badge-${
                        user!.isActive ? "active" : "inactive"
                      }`}
                    >
                      {user!.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>
              <EditUserProfileModal />
            </div>
          </div>

          <div className="profile-content">
            <div className="info-grid">
              <div className="info-section">
                <h2 className="section-title">Información Personal</h2>

                <div className="info-item">
                  <User className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Cédula</p>
                    <p className="item-value">{user!.cedula}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Mail className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Email</p>
                    <p className="item-value">{user!.email}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Phone className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Teléfono</p>
                    <p className="item-value">{user!.phone}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Hash className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Username</p>
                    <p className="item-value">{user!.userHash}</p>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h2 className="section-title">Información Laboral</h2>

                <div className="info-item">
                  <Building2 className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Sucursal</p>
                    {user!.branch ? (
                      <div>
                        <p className="item-value">{user!.branch!.name}</p>
                        {user!.branch!.address && (
                          <p className="item-detail">
                            {user!.branch!.address}, {user!.branch!.city}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="item-value">No disponible</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <Calendar className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Fecha de Contratación</p>
                    <p className="item-value">{formatDate(user!.hireDate)}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Shield className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Intentos de Login</p>
                    <p className="item-value">{user!.loginAttempts}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Clock className="item-icon" />
                  <div className="item-content">
                    <p className="item-label">Último Acceso</p>
                    <p className="item-value">
                      {formatDateTime(user!.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="system-info">
              <h2 className="section-title">Información del Sistema</h2>
              <div className="timestamp-grid">
                <div className="timestamp-item">
                  <p className="item-label">Fecha de Creación</p>
                  <p className="item-value">
                    {formatDateTime(user!.createdAt)}
                  </p>
                </div>
                <div className="timestamp-item">
                  <p className="item-label">Última Actualización</p>
                  <p className="item-value">
                    {formatDateTime(user!.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
