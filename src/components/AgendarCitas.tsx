import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importamos axios directamente
import { useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa'; // Ícono de calendario

interface Animal {
  id: number;
  nombre: string;
}

function AgendarCita() {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID del animal si está en la URL
  const [animalId, setAnimalId] = useState('');
  const [fechaCita, setFechaCita] = useState('');
  const [motivo, setMotivo] = useState('');
  const [veterinario, setVeterinario] = useState('');
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const res = await axios.get<Animal[]>('http://localhost:8080/api/animales');
        setAnimales(res.data);
        if (id) {
          setAnimalId(id); // Preseleccionamos el animal si se proporcionó el ID
        }
      } catch (error) {
        console.error('Error al obtener animales', error);
        setError('Error al obtener la lista de animales.');
      }
    };
    fetchAnimales();
  }, [id]);

  const handleRegistrar = async () => {
    try {
      // Ajustamos el formato de la fecha para incluir segundos
      let fechaCitaISO = fechaCita;
      if (fechaCita && fechaCita.length === 16) {
        fechaCitaISO = `${fechaCita}:00`;
      }

      // Validamos que todos los campos estén completos
      if (!animalId || !fechaCitaISO || !motivo || !veterinario) {
        setError('Por favor, complete todos los campos.');
        return;
      }

      // Enviamos la petición al backend
      await axios.post('http://localhost:8080/api/citas', {
        animalId: parseInt(animalId),
        fechaCita: fechaCitaISO,
        motivo,
        veterinario,
      });

      console.log('Cita registrada exitosamente');
      navigate('/calendario-citas');
    } catch (error) {
      console.error('Error al registrar cita', error);
      setError('Error al registrar la cita. Por favor, inténtelo nuevamente.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <FaCalendarAlt className="text-blue-500 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-800">Agendar Nueva Cita</h1>
      </div>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="flex flex-col space-y-4">
        {/* Selección del animal */}
        <div>
          <label htmlFor="animal" className="block text-gray-700 font-semibold mb-2">
            Seleccione un animal
          </label>
          <select
            id="animal"
            className="outline-none rounded p-3 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={animalId}
            onChange={(e) => setAnimalId(e.target.value)}
          >
            <option value="">Seleccione un animal</option>
            {animales.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.nombre} - ID: {animal.id}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha y hora de la cita */}
        <div>
          <label htmlFor="fechaCita" className="block text-gray-700 font-semibold mb-2">
            Fecha y hora de la cita
          </label>
          <input
            id="fechaCita"
            type="datetime-local"
            className="outline-none rounded p-3 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={fechaCita}
            onChange={(e) => setFechaCita(e.target.value)}
          />
        </div>

        {/* Motivo de la cita */}
        <div>
          <label htmlFor="motivo" className="block text-gray-700 font-semibold mb-2">
            Motivo
          </label>
          <input
            id="motivo"
            type="text"
            placeholder="Motivo de la cita"
            className="outline-none rounded p-3 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        {/* Veterinario */}
        <div>
          <label htmlFor="veterinario" className="block text-gray-700 font-semibold mb-2">
            Veterinario
          </label>
          <input
            id="veterinario"
            type="text"
            placeholder="Nombre del veterinario"
            className="outline-none rounded p-3 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={veterinario}
            onChange={(e) => setVeterinario(e.target.value)}
          />
        </div>

        {/* Botón para agendar la cita */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded shadow-lg transition duration-300 disabled:opacity-50"
          onClick={handleRegistrar}
          disabled={!animalId || !fechaCita || !motivo || !veterinario}
        >
          Agendar Cita
        </button>
      </div>
    </div>
  );
}

export default AgendarCita;
