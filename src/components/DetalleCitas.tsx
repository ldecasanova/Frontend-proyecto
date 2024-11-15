// src/components/DetallesCita.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Adoptante {
  id: number;
  nombre: string;
  // Otros campos si es necesario
}

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
  adoptanteId?: number;
}

interface Cita {
  id: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  estado: string;
  animalId: number;
}

function DetallesCita() {
  const { id } = useParams<{ id: string }>();
  const [cita, setCita] = useState<Cita | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [adoptante, setAdoptante] = useState<Adoptante | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCita = async () => {
      try {
        const resCita = await axios.get(`http://localhost:8080/api/citas/${id}`);
        const citaData: Cita = resCita.data;
        setCita(citaData);

        // Obtener información del animal
        const resAnimal = await axios.get(`http://localhost:8080/api/animales/${citaData.animalId}`);
        const animalData: Animal = resAnimal.data;
        setAnimal(animalData);

        // Obtener información del adoptante
        if (animalData.adoptanteId) {
          const resAdoptante = await axios.get(`http://localhost:8080/api/usuarios/${animalData.adoptanteId}`);
          const adoptanteData: Adoptante = resAdoptante.data;
          setAdoptante(adoptanteData);
        }
      } catch (error) {
        console.error('Error al obtener los detalles:', error);
        setError('Error al obtener los detalles. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchCita();
  }, [id]);

  if (loading) {
    return <p>Cargando detalles de la cita...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!cita) {
    return <p>No se encontró la cita.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Detalles de la Cita</h1>
      <p><strong>ID de la Cita:</strong> {cita.id}</p>
      <p><strong>Fecha y Hora:</strong> {new Date(cita.fechaCita).toLocaleString()}</p>
      <p><strong>Motivo:</strong> {cita.motivo}</p>
      <p><strong>Veterinario:</strong> {cita.veterinario}</p>
      <p><strong>Estado:</strong> {cita.estado}</p>
      <h2 className="text-xl mt-4">Información del Animal</h2>
      <p><strong>Nombre:</strong> {animal?.nombre || 'Sin nombre'}</p>
      <p><strong>Especie:</strong> {animal?.especie || 'Desconocida'}</p>
      <p><strong>Edad:</strong> {animal?.edad || 'Desconocida'}</p>
      <p><strong>Estado de Salud:</strong> {animal?.estadoSalud || 'Desconocido'}</p>
      <h2 className="text-xl mt-4">Información del Adoptante</h2>
      <p><strong>Nombre:</strong> {adoptante?.nombre || 'Sin nombre'}</p>
      {/* Agrega más información del adoptante si es necesario */}
    </div>
  );
}

export default DetallesCita;
