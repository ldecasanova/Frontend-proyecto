// src/components/DetallesCita.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import EditarCita from './EditarCitas';

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
  const navigate = useNavigate();
  const [cita, setCita] = useState<Cita | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [adoptante, setAdoptante] = useState<Adoptante | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchCita = async () => {
      try {
        const resCita = await axios.get(`http://localhost:8080/api/citas/${id}`);
        const citaData: Cita = resCita.data as Cita;
        setCita(citaData);

        // Obtener información del animal
        const resAnimal = await axios.get(`http://localhost:8080/api/animales/${citaData.animalId}`);
        const animalData: Animal = resAnimal.data as Animal;
        setAnimal(animalData);

        // Obtener información del adoptante
        if (animalData.adoptanteId) {
          const resAdoptante = await axios.get(`http://localhost:8080/api/adoptantes/${animalData.adoptanteId}`);
          const adoptanteData: Adoptante = resAdoptante.data as Adoptante;
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

  const handleEliminarCita = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/citas/${id}`);
      alert('Cita eliminada exitosamente.');
      navigate('/dashboard'); // Redirigir al dashboard o a otra página
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      setError('Error al eliminar la cita. Por favor, intenta nuevamente.');
    }
  };

  const handleEditarCita = () => {
    setIsEditing(true);
  };

  const handleActualizarCita = (citaActualizada: Cita) => {
    setCita(citaActualizada);
    setIsEditing(false);
  };

  const handleCancelarEdicion = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <p>Cargando detalles de la cita...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
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

      <div className="mt-6 flex space-x-4">
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded"
          onClick={handleEditarCita}
        >
          Editar Cita
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={handleEliminarCita}
        >
          Eliminar Cita
        </button>
      </div>

      {isEditing && (
        <EditarCita
          cita={cita}
          onActualizar={handleActualizarCita}
          onCancelar={handleCancelarEdicion}
        />
      )}
    </div>
  );
}

export default DetallesCita;
