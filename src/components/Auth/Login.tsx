// src/components/Login.tsx (simplificado)
import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AutenticacionResponseDto {
  userId: number;
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<AutenticacionResponseDto>('/usuarios/autenticar', {
        nombre: username,
        email,
        contrasena: password,
      });

      const { userId } = res.data;

      if (!userId) {
        throw new Error('ID de usuario no recibido.');
      }

      // Guardar el ID del usuario en localStorage
      localStorage.setItem('userId', userId.toString());

      // Opcional: Guardar otros datos si los tienes
      // localStorage.setItem('nombre', 'Juan Pérez');
      // localStorage.setItem('email', 'juan.perez@example.com');
      // localStorage.setItem('direccion', 'Calle Falsa 123');

      toast.success('Inicio de sesión exitoso', {
        position: 'top-center',
        autoClose: 3000,
      });

      navigate('/dashboard');
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'Error al iniciar sesión.', {
          position: 'top-center',
          autoClose: 4000,
        });
      } else {
        toast.error('Error al iniciar sesión.', {
          position: 'top-center',
          autoClose: 4000,
        });
      }
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto mt-8 bg-white p-6 shadow-md rounded">
      <h1 className="text-2xl text-center mb-4 font-bold">Iniciar Sesión</h1>

      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        {/* Campo de nombre de usuario */}
        <input
          type="text"
          placeholder="Nombre de usuario"
          className="outline rounded p-2 border border-gray-300"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />

        {/* Campo de correo */}
        <input
          type="email"
          placeholder="Email"
          className="outline rounded p-2 border border-gray-300"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        {/* Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="outline rounded p-2 border border-gray-300"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        {/* Botón para iniciar sesión */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Iniciar Sesión
        </button>
      </form>

      <p className="text-center mt-4">
        ¿No tienes una cuenta?{' '}
        <button
          className="text-blue-500 hover:text-blue-400"
          onClick={() => navigate('/register')}
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  );
}

export default Login;
