// src/components/DetallesCita.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import EditarCita from './EditarCitas';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

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

const DetallesCita = () => {
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
        toast.error('Error al obtener los detalles. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchCita();
  }, [id]);

  const handleEliminarCita = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/citas/${id}`);
      toast.success('Cita eliminada exitosamente.');
      navigate('/dashboard'); // Redirigir al dashboard o a otra página
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      setError('Error al eliminar la cita. Por favor, intenta nuevamente.');
      toast.error('Error al eliminar la cita. Por favor, intenta nuevamente.');
    }
  };

  const handleEditarCita = () => {
    setIsEditing(true);
  };

  const handleActualizarCita = (citaActualizada: Cita) => {
    setCita(citaActualizada);
    setIsEditing(false);
    toast.success('Cita actualizada correctamente.');
  };

  const handleCancelarEdicion = () => {
    setIsEditing(false);
  };

  const handleConfirmarEliminar = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.')) {
      handleEliminarCita();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        <p className="text-gray-700 text-xl ml-4">Cargando detalles de la cita...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-xl">No se encontró la cita.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Detalles de la Cita</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de la Cita */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Información de la Cita</h2>
          <p className="mb-2"><span className="font-medium">ID de la Cita:</span> {cita.id}</p>
          <p className="mb-2"><span className="font-medium">Fecha y Hora:</span> {new Date(cita.fechaCita).toLocaleString()}</p>
          <p className="mb-2"><span className="font-medium">Motivo:</span> {cita.motivo}</p>
          <p className="mb-2"><span className="font-medium">Veterinario:</span> {cita.veterinario}</p>
          <p className="mb-2"><span className="font-medium">Estado:</span> {cita.estado}</p>
        </div>

        {/* Información del Animal */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Información del Animal</h2>
          <p className="mb-2"><span className="font-medium">Nombre:</span> {animal?.nombre || 'Sin nombre'}</p>
          <p className="mb-2"><span className="font-medium">Especie:</span> {animal?.especie || 'Desconocida'}</p>
          <p className="mb-2"><span className="font-medium">Edad:</span> {animal?.edad || 'Desconocida'} años</p>
          <p className="mb-2"><span className="font-medium">Estado de Salud:</span> {animal?.estadoSalud || 'Desconocido'}</p>
        </div>

        {/* Información del Adoptante */}
        <div className="bg-gray-50 p-6 rounded-md md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Información del Cliente</h2>
          {adoptante ? (
            <>
              <p className="mb-2"><span className="font-medium">Nombre:</span> {adoptante.nombre}</p>
              {/* Agrega más información del adoptante si es necesario */}
            </>
          ) : (
            <p className="text-gray-600">Este animal aún no ha sido adoptado.</p>
          )}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="mt-6 flex space-x-4">
        <button
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
          onClick={handleEditarCita}
        >
          <FaEdit className="mr-2" />
          Editar Cita
        </button>
        <button
          className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          onClick={handleConfirmarEliminar}
        >
          <FaTrash className="mr-2" />
          Eliminar Cita
        </button>
      </div>

      {/* Componente EditarCita */}
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



