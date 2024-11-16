// src/components/VacunasAnimal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { parseISO, format } from 'date-fns';

interface Vacuna {
  id: number;
  nombre: string;
  fechaAplicacion: string; // Mantener como cadena de texto 'YYYY-MM-DD'
  animalId: number;
}

function VacunasAnimal() {
  // Obtener el parámetro 'id' de la ruta '/animales/:id/vacunas'
  const { id } = useParams<{ id: string }>();
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [nombreSeleccionado, setNombreSeleccionado] = useState('Vacuna Común'); // Estado para nombre seleccionado
  const [nombrePersonalizado, setNombrePersonalizado] = useState(''); // Estado para nombre personalizado
  const [fechaAplicacion, setFechaAplicacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [agregando, setAgregando] = useState<boolean>(false);
  const [eliminando, setEliminando] = useState<number | null>(null); // ID de la vacuna que se está eliminando

  // URL base de la API
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchVacunas = async () => {
      setLoading(true);
      try {
        // Verificar si 'id' está definido y es válido
        if (!id || isNaN(Number(id))) {
          throw new Error('ID de animal inválido.');
        }

        const res = await axios.get<Vacuna[]>(`${API_BASE_URL}/vacunas/animal/${id}`);
        setVacunas(res.data);
      } catch (error: any) {
        console.error('Error al obtener las vacunas:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          setError('Error al obtener las vacunas.');
          toast.error('Error al obtener las vacunas.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVacunas();
  }, [id]);

  useEffect(() => {
    // Establecer la fecha de aplicación por defecto a la fecha actual al cargar el componente
    const hoy = new Date().toISOString().split('T')[0];
    setFechaAplicacion(hoy);
  }, []);

  const handleAgregarVacuna = async () => {
    // Validaciones básicas
    if (
      !nombreSeleccionado ||
      (nombreSeleccionado === 'Otra' && !nombrePersonalizado.trim()) ||
      !fechaAplicacion
    ) {
      setError('Por favor, complete todos los campos.');
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    // Validar que la fecha sea hoy o una fecha pasada
    const fechaSeleccionada = new Date(fechaAplicacion);
    const ahora = new Date();
    // Establecer la hora de 'ahora' a las 00:00:00 para comparar solo la fecha
    ahora.setHours(0, 0, 0, 0);
    // Establecer la hora de 'fechaSeleccionada' a las 00:00:00 para comparar solo la fecha
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > ahora) {
      setError('La fecha de aplicación no puede ser una fecha futura.');
      toast.error('La fecha de aplicación no puede ser una fecha futura.');
      return;
    }

    setAgregando(true);
    try {
      // Verificar si 'id' está definido y es válido
      if (!id || isNaN(Number(id))) {
        throw new Error('ID de animal inválido.');
      }

      const nombreFinal = nombreSeleccionado === 'Otra' ? nombrePersonalizado.trim() : nombreSeleccionado;

      const nuevaVacuna = {
        nombre: nombreFinal,
        fechaAplicacion, // Mantener como cadena de texto 'YYYY-MM-DD'
        animalId: parseInt(id, 10),
      };

      const res = await axios.post<Vacuna>(`${API_BASE_URL}/vacunas`, nuevaVacuna);

      // Actualizar la lista de vacunas
      setVacunas([...vacunas, res.data]);

      // Limpiar los campos del formulario
      setNombreSeleccionado('Vacuna Común');
      setNombrePersonalizado('');
      const hoy = new Date().toISOString().split('T')[0];
      setFechaAplicacion(hoy); // Establecer fecha actual
      setError(null);

      toast.success('Vacuna agregada exitosamente.');
    } catch (error: any) {
      console.error('Error al agregar la vacuna:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        setError('Error al agregar la vacuna.');
        toast.error('Error al agregar la vacuna.');
      }
    } finally {
      setAgregando(false);
    }
  };

  const handleEliminarVacuna = async (idVacuna: number) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta vacuna?');
    if (!confirmar) return;

    setEliminando(idVacuna);
    try {
      await axios.delete(`${API_BASE_URL}/vacunas/${idVacuna}`);

      // Actualizar la lista de vacunas
      setVacunas(vacunas.filter((vacuna) => vacuna.id !== idVacuna));

      toast.success('Vacuna eliminada exitosamente.');
    } catch (error: any) {
      console.error('Error al eliminar la vacuna:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        setError('Error al eliminar la vacuna.');
        toast.error('Error al eliminar la vacuna.');
      }
    } finally {
      setEliminando(null);
    }
  };

  // Opciones predefinidas para el nombre de la vacuna
  const opcionesNombre = [
    'Vacuna Común',
    'Vacuna Triple Viral',
    'Vacuna Anti-Rabia',
    'Otra',
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Vacunas del Animal</h2>

      {loading ? (
        <p>Cargando vacunas...</p>
      ) : error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <>
          {/* Formulario para agregar nueva vacuna */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Agregar Nueva Vacuna</h3>
            <div className="flex flex-col space-y-4">
              {/* Nombre de la vacuna con opciones predefinidas */}
              <div>
                <label htmlFor="nombreVacuna" className="block text-gray-700 mb-2">
                  Nombre de la Vacuna
                </label>
                <select
                  id="nombreVacuna"
                  value={nombreSeleccionado}
                  onChange={(e) => setNombreSeleccionado(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  {opcionesNombre.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo para nombre personalizado cuando se selecciona "Otra" */}
              {nombreSeleccionado === 'Otra' && (
                <div>
                  <label htmlFor="nombrePersonalizado" className="block text-gray-700 mb-2">
                    Nombre Personalizado
                  </label>
                  <input
                    type="text"
                    id="nombrePersonalizado"
                    placeholder="Escribe el nombre de la vacuna"
                    value={nombrePersonalizado}
                    onChange={(e) => setNombrePersonalizado(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              )}

              {/* Fecha de Aplicación */}
              <div>
                <label htmlFor="fechaAplicacion" className="block text-gray-700 mb-2">
                  Fecha de Aplicación
                </label>
                <input
                  type="date"
                  id="fechaAplicacion"
                  value={fechaAplicacion}
                  onChange={(e) => setFechaAplicacion(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              {/* Botón para agregar vacuna */}
              <button
                onClick={handleAgregarVacuna}
                disabled={agregando}
                className={`bg-blue-500 text-white py-2 px-4 rounded ${
                  agregando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
              >
                {agregando ? 'Agregando...' : 'Agregar Vacuna'}
              </button>
            </div>
          </div>

          {/* Lista de vacunas */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Lista de Vacunas</h3>
            {vacunas.length === 0 ? (
              <p>No hay vacunas registradas para este animal.</p>
            ) : (
              <ul className="space-y-4">
                {vacunas.map((vacuna) => (
                  <li key={vacuna.id} className="border border-gray-200 p-4 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>
                          <strong>Nombre:</strong> {vacuna.nombre}
                        </p>
                        <p>
                          <strong>Fecha de Aplicación:</strong>{' '}
                          {format(parseISO(vacuna.fechaAplicacion), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {/* Botón para eliminar la vacuna */}
                        <button
                          onClick={() => handleEliminarVacuna(vacuna.id)}
                          disabled={eliminando === vacuna.id}
                          className={`bg-red-500 text-white py-1 px-3 rounded ${
                            eliminando === vacuna.id
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-red-600'
                          }`}
                        >
                          {eliminando === vacuna.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VacunasAnimal;
