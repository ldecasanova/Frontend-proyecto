// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
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

function Dashboard() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const res = await api.get('/animales');
        setAnimales(res.data);
      } catch (error) {
        console.error('Error al obtener animales', error);
      }
    };
    fetchAnimales();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Animales en Atención</h1>
      {animales.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Nombre</th>
              <th className="py-2">Especie</th>
              <th className="py-2">Edad</th>
              <th className="py-2">Estado de Salud</th>
              <th className="py-2">ID Adoptante</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {animales.map((animal) => (
              <tr key={animal.id}>
                <td className="py-2">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => navigate(`/historial-animal/${animal.id}`)}
                  >
                    {animal.nombre}
                  </button>
                </td>
                <td className="py-2">{animal.especie}</td>
                <td className="py-2">{animal.edad}</td>
                <td className="py-2">{animal.estadoSalud}</td>
                <td className="py-2">{animal.adoptanteId}</td>
                <td className="py-2 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                    onClick={() => navigate(`/animales/${animal.id}/vacunas`)}
                  >
                    Ver Vacunas
                  </button>
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded"
                    onClick={() => navigate(`/agendar-cita/${animal.id}`)}
                  >
                    Agendar Cita
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay animales registrados.</p>
      )}
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          onClick={() => navigate('/registrar-animal')}
        >
          Registrar Nuevo Animal
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={() => navigate('/eliminar-animal')}
        >
          Eliminar Animales
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => navigate('/calendario-citas')}
        >
          Ver Calendario de Citas
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
