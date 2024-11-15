// src/components/HistorialAnimal.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Animal {
  id: number;
  nombre: string;
  // Puedes agregar otros campos si es necesario
}

interface RegistroHistorial {
  id: number;
  fechaConsulta: string;
  descripcion: string;
}

function HistorialAnimal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await api.get(`/historial/${id}`);
        setHistorial(res.data);
      } catch (error) {
        console.error('Error al obtener historial', error);
      }
    };

    const fetchAnimal = async () => {
      try {
        const res = await api.get(`/animales/${id}`);
        setAnimal(res.data);
      } catch (error) {
        console.error('Error al obtener datos del animal', error);
      }
    };

    if (id) {
      fetchHistorial();
      fetchAnimal();
    }
  }, [id]);

  return (
    <div className="p-4">
      {animal ? (
        <>
          <h1 className="text-2xl mb-4">Historial de {animal.nombre}</h1>
          <button
            className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => navigate(`/agendar-cita/${animal.id}`)}
          >
            Agendar Cita para {animal.nombre}
          </button>
        </>
      ) : (
        <p>Cargando datos del animal...</p>
      )}

      {historial.length > 0 ? (
        <ul>
          {historial.map((registro) => (
            <li key={registro.id}>
              {registro.fechaConsulta}: {registro.descripcion}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay registros en el historial.</p>
      )}
    </div>
  );
}

export default HistorialAnimal;
