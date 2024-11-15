// src/components/AgregarAdoptante.tsx
import React, { useState } from 'react';
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
      console.log('Adoptante agregado exitosamente');
      navigate('/adoptantes');
    } catch (error) {
      console.error('Error al agregar adoptante', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Agregar Adoptante</h1>
      <input
        type="text"
        placeholder="Nombre"
        className="outline rounded p-2 w-full mb-2"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="outline rounded p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección"
        className="outline rounded p-2 w-full mb-2"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono"
        className="outline rounded p-2 w-full mb-2"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleAgregar}
      >
        Agregar Adoptante
      </button>
    </div>
  );
}

export default AgregarAdoptante;
