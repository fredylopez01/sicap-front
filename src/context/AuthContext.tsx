import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

export type Person = {
  username: string;
  password: string;
  role: string;
};

interface AuthContextType {
  user: Person | null;
  token: string | null;
  isValidToken: boolean;
  login: (userData: Person, token: string) => void;
  logout: () => void;
  updateUser: (userData: Person) => void;
  checkTokenValidity: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Person | null>(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("userData");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );

  const [isValidToken, setIsValidToken] = useState(false);

  // Función para verificar si el token es válido
  const checkTokenValidity = async (): Promise<boolean> => {
    if (!token) {
      setIsValidToken(false);
      return false;
    }

    try {
      // Aquí harías una petición a tu backend para validar el token
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsValidToken(true);
        return true;
      } else {
        // Token inválido, limpiar datos
        logout();
        return false;
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsValidToken(false);
      return false;
    }
  };

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        await checkTokenValidity();
      } else {
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  // Verificar periódicamente si el token sigue siendo válido
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      checkTokenValidity();
    }, 120 * 60 * 1000); // Verificar cada 2 horas

    return () => clearInterval(interval);
  }, [token]);

  const login = (userData: Person, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    setIsValidToken(true);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsValidToken(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  const updateUser = (userData: Person) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    isValidToken,
    login,
    logout,
    updateUser,
    checkTokenValidity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
