import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UsersList.css";
import { ApiResponse } from "@/interfaces";
import { apiRequest } from "@/services";

// Interfaz para un solo usuario, basándose en los datos proporcionados
interface User {
  id: number;
  email: string;
  role: "ADMIN" | "USER" | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "/api/users/";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result: ApiResponse<User[]> = await apiRequest<User[]>(
          API_URL,
          "GET"
        );

        if (result.success && result.data) {
          setUsers(result.data);
        } else {
          setError(result.message || "No se pudo cargar la lista de usuarios.");
        }
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Error de conexión con el servidor. Intenta recargar.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRedirectNewUser = () => {
    navigate("/dashboard/usuarios/new");
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    // Formato simple: YYYY-MM-DD HH:MM
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="users-page-container">
      {/* Header de la página */}
      <header className="page-header">
        <h1 className="header-title">Gestión de Usuarios</h1>
        <button className="create-button" onClick={handleRedirectNewUser}>
          Crear usuario
        </button>
      </header>

      {/* Contenido principal: Lista de Usuarios */}
      <div className="content-area">
        <div className="card-container">
          {loading && <p className="status-message">Cargando usuarios...</p>}
          {error && <p className="status-message error">{error}</p>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Último Acceso</th>
                    <th>Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td data-label="ID">{user.id}</td>
                      <td data-label="Email">{user.email}</td>
                      <td
                        data-label="Rol"
                        className={`role-${user.role.toLowerCase()}`}
                      >
                        {user.role}
                      </td>
                      <td
                        data-label="Estado"
                        className={
                          user.isActive ? "status-active" : "status-inactive"
                        }
                      >
                        {user.isActive ? "Activo" : "Inactivo"}
                      </td>
                      <td data-label="Último Acceso">
                        {formatDateTime(user.lastLogin)}
                      </td>
                      <td data-label="Registro">
                        {formatDateTime(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="status-message">No se encontraron usuarios.</p>
          )}
        </div>
      </div>
    </div>
  );
}
