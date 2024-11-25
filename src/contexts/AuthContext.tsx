import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import axios from "axios";
import { UsuarioResponseDto } from "../types/UsuarioResponseDto";

interface AuthContextType {
  userId: number | null;
  setUserId: (userId: number | null) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
  logout: () => {},
  fetchProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null
  );

  // Método para obtener el perfil del usuario desde el backend
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtenemos el token JWT del almacenamiento
      if (!token) return;

      const response = await axios.get<UsuarioResponseDto>("/usuarios/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user: UsuarioResponseDto = response.data;
      setUserId(user.id); // Actualizamos el estado con el ID del usuario
      localStorage.setItem("userId", user.id.toString()); // Sincronizamos con localStorage (opcional)
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
    }
  };

  // Método para cerrar sesión
  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("token"); // Limpia el token del almacenamiento
  };

  // Sincronización del localStorage con el userId
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId.toString());
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userId, setUserId, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
