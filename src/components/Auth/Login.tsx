import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto mt-8">
      <h1 className="text-2xl text-center mb-4">Iniciar Sesión</h1>

      <input
        type="text"
        placeholder="Nombre de usuario"
        className="outline rounded p-2"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="outline rounded p-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="outline rounded p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white py-2 rounded"
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
