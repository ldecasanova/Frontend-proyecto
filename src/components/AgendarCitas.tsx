// src/components/AgendarCita.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importamos axios directamente
import { useNavigate, useParams } from 'react-router-dom';

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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Agendar Nueva Cita</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <select
        className="outline rounded p-2 w-full mb-2"
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
      <input
        type="datetime-local"
        placeholder="Fecha y hora de la Cita"
        className="outline rounded p-2 w-full mb-2"
        value={fechaCita}
        onChange={(e) => setFechaCita(e.target.value)}
      />
      <input
        type="text"
        placeholder="Motivo"
        className="outline rounded p-2 w-full mb-2"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Veterinario"
        className="outline rounded p-2 w-full mb-2"
        value={veterinario}
        onChange={(e) => setVeterinario(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleRegistrar}
        disabled={!animalId || !fechaCita || !motivo || !veterinario}
      >
        Agendar Cita
      </button>
    </div>
  );
}

export default AgendarCita;
