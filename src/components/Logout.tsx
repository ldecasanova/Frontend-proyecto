// src/components/Logout.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Opcional: Notificar al backend para invalidar la sesión/token
        // Si tu backend soporta un endpoint para cerrar sesión, puedes llamarlo aquí.
        /*
        const token = localStorage.getItem('token');
        if (token) {
          await api.post('/usuarios/logout', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        */

        // 2. Borrar datos del cache (localStorage)
        localStorage.removeItem('userId');
        localStorage.removeItem('token'); // Si estás almacenando un token JWT
        localStorage.removeItem('nombre');
        localStorage.removeItem('email');
        localStorage.removeItem('direccion');
        // Añade aquí cualquier otro dato que estés almacenando en localStorage

        // 3. Mostrar una notificación de éxito
        toast.success('Has cerrado sesión exitosamente.', {
          position: 'top-center',
          autoClose: 3000,
        });

        // 4. Redirigir al usuario a la página de inicio de sesión
        navigate('/');
      } catch (error: any) {
        console.error('Error al cerrar sesión:', error);
        toast.error('Ocurrió un error al cerrar sesión.', {
          position: 'top-center',
          autoClose: 3000,
        });
        // Redirigir al usuario de todas formas
        navigate('');
      }
    };

    performLogout();
  }, [navigate]);

  return null; // Este componente no necesita renderizar nada
}

export default Logout;
