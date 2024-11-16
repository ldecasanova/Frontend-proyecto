// src/components/VacunasAnimal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Vacuna {
  id: number;
  nombre: string;
  fechaAplicacion: string;
  animalId: number;
}

function VacunasAnimal() {
  const { animalId } = useParams<{ animalId: string }>();
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [nombreVacuna, setNombreVacuna] = useState('');
  const [fechaAplicacion, setFechaAplicacion] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacunas = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/vacunas/${animalId}`);
        setVacunas(res.data);
      } catch (error) {
        console.error('Error al obtener las vacunas:', error);
        setError('Error al obtener las vacunas.');
      }
    };

    fetchVacunas();
  }, [animalId]);

  const handleAgregarVacuna = async () => {
    if (!nombreVacuna || !fechaAplicacion) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const nuevaVacuna = {
        animalId: parseInt(animalId || '0'),
        nombre: nombreVacuna,
        fechaAplicacion,
      };

      const res = await axios.post('http://localhost:8080/api/vacunas', nuevaVacuna);

      // Actualizar la lista de vacunas
      setVacunas([...vacunas, res.data]);

      // Limpiar los campos del formulario
      setNombreVacuna('');
      setFechaAplicacion('');
      setError(null);
    } catch (error) {
      console.error('Error al agregar la vacuna:', error);
      setError('Error al agregar la vacuna.');
    }
  };

  const handleEliminarVacuna = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/vacunas/${id}`);

      // Actualizar la lista de vacunas
      setVacunas(vacunas.filter((vacuna) => vacuna.id !== id));
    } catch (error) {
      console.error('Error al eliminar la vacuna:', error);
      setError('Error al eliminar la vacuna.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Vacunas del Animal</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <h3 className="text-xl mt-4">Agregar Nueva Vacuna</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre de la vacuna"
          value={nombreVacuna}
          onChange={(e) => setNombreVacuna(e.target.value)}
          className="outline rounded p-2 w-full mb-2"
        />
        <input
          type="date"
          placeholder="Fecha de aplicación"
          value={fechaAplicacion}
          onChange={(e) => setFechaAplicacion(e.target.value)}
          className="outline rounded p-2 w-full mb-2"
        />
        <button
          onClick={handleAgregarVacuna}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Agregar Vacuna
        </button>
      </div>

      <h3 className="text-xl mt-4">Lista de Vacunas</h3>
      {vacunas.length === 0 ? (
        <p>No hay vacunas registradas para este animal.</p>
      ) : (
        <ul>
          {vacunas.map((vacuna) => (
            <li key={vacuna.id} className="mb-4">
              <p>
                <strong>Nombre:</strong> {vacuna.nombre}
              </p>
              <p>
                <strong>Fecha de Aplicación:</strong>{' '}
                {new Date(vacuna.fechaAplicacion).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleEliminarVacuna(vacuna.id)}
                className="bg-red-500 text-white py-1 px-3 rounded mt-2"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VacunasAnimal;
