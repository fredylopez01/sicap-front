import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UsersList.css";
import { ApiResponse, User } from "@/interfaces";
import { apiRequest } from "@/services";
import { CircleUserRound, Plus, Trash2 } from "lucide-react";
import { EditUserModal } from "./EditUserForm/EditUserModal";
import { showAlert, showConfirmAlert } from "@/utils/alerts";

export function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "/api/users/";

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

  useEffect(() => {
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

  const updatedUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      })
    );
  };

  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      const result: ApiResponse<User[]> = await apiRequest<User[]>(
        API_URL + id,
        "DELETE"
      );

      if (result.success) {
        showAlert(result.message, "success");
        fetchUsers();
      } else {
        showAlert(result.message);
      }
    } catch (err: any) {
      console.error("Error eliminando userio:", err);
      setError("Error de conexión con el servidor. Intenta recargar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    showConfirmAlert(
      "Eliminar usuario",
      "Está seguro de eliminar a este usuario, esta acción es irreversible",
      "Eliminar",
      () => deleteUser(id)
    );
  };

  return (
    <div className="users-page-container">
      {/* Header de la página */}
      <header className="page-header">
        <h1 className="header-title">Gestión de Usuarios</h1>
        <button
          className="create-button flex items-center"
          onClick={handleRedirectNewUser}
        >
          <Plus size={19} /> Crear usuario
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
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Último Acceso</th>
                    <th>Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td data-label="Email">
                        <div className="flex items-center gap-1">
                          <div className="td-user-avatar-icon">
                            <CircleUserRound size={40} strokeWidth={0.5} />
                          </div>
                          <div className="flex flex-col">
                            <div className="td-name-user">
                              {user.names + " " + user.lastNames}
                            </div>
                            <div className="td-email-user">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Phone">{user.phone}</td>
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
                        {formatDateTime(user.lastLogin || "")}
                      </td>
                      <td data-label="Registro">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td>
                        <EditUserModal
                          user={user}
                          onUserUpdated={updatedUser}
                        />
                        <button
                          type="button"
                          className="btn-delete-user"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={17} />
                        </button>
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
