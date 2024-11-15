// src/components/DeleteAnimal.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
  adoptanteId: number;
}

function DeleteAnimal() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnimales();
  }, []);

  const fetchAnimales = async () => {
    try {
      const res = await api.get('/animales');
      setAnimales(res.data);
    } catch (error) {
      console.error('Error al obtener animales', error);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este animal?');
    if (confirmar) {
      try {
        await api.delete(`/animales/${id}`);
        console.log('Animal eliminado exitosamente');
        // Actualizar la lista de animales después de eliminar
        setAnimales(animales.filter((animal) => animal.id !== id));
      } catch (error) {
        console.error('Error al eliminar animal', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Eliminar Animales</h1>
      {animales.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Especie</th>
              <th className="py-2">Edad</th>
              <th className="py-2">Estado de Salud</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {animales.map((animal) => (
              <tr key={animal.id}>
                <td className="py-2">{animal.id}</td>
                <td className="py-2">{animal.nombre}</td>
                <td className="py-2">{animal.especie}</td>
                <td className="py-2">{animal.edad}</td>
                <td className="py-2">{animal.estadoSalud}</td>
                <td className="py-2">
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => handleEliminar(animal.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay animales registrados.</p>
      )}
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => navigate('/dashboard')}
      >
        Volver al Dashboard
      </button>
    </div>
  );
}

export default DeleteAnimal;
