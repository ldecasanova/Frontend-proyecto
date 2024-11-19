import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify'; // Importa Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa el estilo de Toastify

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', {
        username,
        password,
        email,
      });

      // Asignar el token recibido
      setToken((res.data as { token: string }).token);

      // Mostrar notificación de éxito
      toast.success('Inicio de sesión exitoso', {
        position: 'top-center',
        autoClose: 3000, // Cierra el mensaje automáticamente después de 3 segundos
      });

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error: any) {
      // Manejo de errores
      if (error.response && error.response.status === 401) {
        toast.error('Usuario, correo o contraseña incorrectos.', {
          position: 'top-center',
          autoClose: 4000, // Cierra el mensaje automáticamente después de 4 segundos
        });
      } else {
        toast.error('Hubo un problema al iniciar sesión. Inténtalo nuevamente.', {
          position: 'top-center',
          autoClose: 4000,
        });
      }
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto mt-8 bg-white p-6 shadow-md rounded">
      <h1 className="text-2xl text-center mb-4 font-bold">Iniciar Sesión</h1>

      {/* Campo de usuario */}
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
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        onClick={handleLogin}
      >
        Iniciar Sesión
      </button>

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
