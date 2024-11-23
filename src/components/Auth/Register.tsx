import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importar Toastify
import 'react-toastify/dist/ReactToastify.css'; // Estilos de Toastify

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validaciones iniciales
    if (!validateEmail(email)) {
      toast.error('Por favor ingresa un correo válido.', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    try {
      await api.post('/auth/register', {
        nombre,
        email,
        direccion,
        password,
        confirmPassword,
      });

      // Notificación de éxito
      toast.success('Registro exitoso. Por favor inicia sesión.', {
        position: "top-center",
        autoClose: 3000,
      });

      // Redirigir al login
      navigate('');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error('El correo ya está registrado.', {
          position: "top-center",
          autoClose: 4000,
        });
      } else {
        toast.error('Hubo un problema al registrar. Inténtalo nuevamente.', {
          position: "top-center",
          autoClose: 4000,
        });
      }
      console.error('Error al registrar:', error);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-6 shadow-md rounded mt-8">
      <h1 className="text-2xl text-center font-bold">Registrarse</h1>

      <input
        type="text"
        placeholder="Nombre"
        className="outline rounded p-2 border border-gray-300"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="outline rounded p-2 border border-gray-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Dirección"
        className="outline rounded p-2 border border-gray-300"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="outline rounded p-2 border border-gray-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar Contraseña"
        className="outline rounded p-2 border border-gray-300"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        onClick={handleRegister}
      >
        Registrarse
      </button>
    </div>
  );
}

export default Register;
