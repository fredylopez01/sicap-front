import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  requiredRole?: string; // Para roles específicos si los necesitas
};

export function PrivateRoute({ children, requiredRole }: Props) {
  const { token, user } = useAuth();
  const location = useLocation();

  // Si no hay token, redirigir al login con la ubicación actual
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene

  if (requiredRole && user?.role !== requiredRole) {
    // return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Para rutas que solo usuarios no autenticados pueden acceder (como login)
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();

  // Si ya está logueado, redirigir al dashboard o página principal
  if (token) {
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
