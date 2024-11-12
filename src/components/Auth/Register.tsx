import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/register', {
        nombre,
        email,
        direccion,
        password,
        confirmPassword,
      });
      console.log('Registro exitoso', res.data);
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto">
      <h1 className="text-xl text-center">Registrarse</h1>

      <input
        type="text"
        placeholder="Nombre"
        className="outline rounded p-2"
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="outline rounded p-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección"
        className="outline rounded p-2"
        onChange={(e) => setDireccion(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="outline rounded p-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmar Contraseña"
        className="outline rounded p-2"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white py-2 rounded"
        onClick={handleRegister}
      >
        Registrarse
      </button>
    </div>
  );
}

export default Register;
