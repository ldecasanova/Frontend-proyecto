// src/components/AgregarAdoptante.tsx
import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function AgregarAdoptante() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  const handleAgregar = async () => {
    try {
      await api.post('/adoptantes', {
        nombre,
        email,
        direccion,
        telefono,
      });
      console.log('Cliente agregado exitosamente');
      navigate('/adoptantes');
    } catch (error) {
      console.error('Error al agregar Cliente', error);
    }
  };

  return (
    <div className="flex flex-col space-y-6 max-w-md mx-auto mt-8 bg-white p-8 shadow-md rounded-lg">
      {/* Título del formulario */}
      <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
        <span>Agregar Adoptante</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-8 h-8 text-gray-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </h1>

      {/* Campo: Nombre */}
      <input
        type="text"
        placeholder="Nombre"
        className="outline-none rounded p-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* Campo: Email */}
      <input
        type="email"
        placeholder="Email"
        className="outline-none rounded p-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Campo: Dirección */}
      <input
        type="text"
        placeholder="Dirección"
        className="outline-none rounded p-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />

      {/* Campo: Teléfono */}
      <input
        type="text"
        placeholder="Teléfono"
        className="outline-none rounded p-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      {/* Botón para agregar */}
      <button
        className="bg-blue-500 text-white py-3 px-4 rounded shadow-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        onClick={handleAgregar}
      >
        Agregar Adoptante
      </button>
    </div>
  );
}

export default AgregarAdoptante;
