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
  adoptante?: Adoptante;
}

interface Cita {
  id: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  estado: string;
  animal?: Animal;
}

function DetallesCita() {
  const { id } = useParams<{ id: string }>();
  const [cita, setCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCita = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/citas/${id}`);
        console.log('Cita recibida:', res.data);
        setCita(res.data);
      } catch (error) {
        console.error('Error al obtener la cita:', error);
        setError('Error al obtener la cita. Por favor, intenta nuevamente.');
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
      <p><strong>Nombre:</strong> {cita.animal?.nombre || 'Sin nombre'}</p>
      <p><strong>Especie:</strong> {cita.animal?.especie || 'Desconocida'}</p>
      <p><strong>Edad:</strong> {cita.animal?.edad || 'Desconocida'}</p>
      <p><strong>Estado de Salud:</strong> {cita.animal?.estadoSalud || 'Desconocido'}</p>
      <h2 className="text-xl mt-4">Información del Adoptante</h2>
      <p><strong>Nombre:</strong> {cita.animal?.adoptante?.nombre || 'Sin nombre'}</p>
      {/* Agrega más información del adoptante si es necesario */}
    </div>
  );
}

export default DetallesCita;
