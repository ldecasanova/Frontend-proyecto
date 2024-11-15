// src/components/AdoptantesList.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Adoptante {
  id: number;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
}

function AdoptantesList() {
  const [adoptantes, setAdoptantes] = useState<Adoptante[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdoptantes();
  }, []);

  const fetchAdoptantes = async () => {
    try {
      const res = await api.get('/adoptantes');
      setAdoptantes(res.data);
    } catch (error) {
      console.error('Error al obtener adoptantes', error);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este adoptante?');
    if (confirmar) {
      try {
        await api.delete(`/adoptantes/${id}`);
        console.log('Adoptante eliminado exitosamente');
        // Actualizar la lista de adoptantes después de eliminar
        setAdoptantes(adoptantes.filter((adoptante) => adoptante.id !== id));
      } catch (error) {
        console.error('Error al eliminar adoptante', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Lista de Adoptantes</h1>
      <button
        className="mb-4 bg-green-500 text-white py-2 px-4 rounded"
        onClick={() => navigate('/agregar-adoptante')}
      >
        Agregar Adoptante
      </button>
      {adoptantes.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Email</th>
              <th className="py-2">Dirección</th>
              <th className="py-2">Teléfono</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {adoptantes.map((adoptante) => (
              <tr key={adoptante.id}>
                <td className="py-2">{adoptante.id}</td>
                <td className="py-2">{adoptante.nombre}</td>
                <td className="py-2">{adoptante.email}</td>
                <td className="py-2">{adoptante.direccion}</td>
                <td className="py-2">{adoptante.telefono}</td>
                <td className="py-2">
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => handleEliminar(adoptante.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay adoptantes registrados.</p>
      )}
    </div>
  );
}

export default AdoptantesList;
