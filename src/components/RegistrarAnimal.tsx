import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function RegisterAnimal() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [unidadEdad, setUnidadEdad] = useState<'meses' | 'años'>('años'); // Nuevo estado para la unidad de edad
  const [estadoSalud, setEstadoSalud] = useState('');
  const [adoptanteId, setAdoptanteId] = useState('');
  const [adoptantes, setAdoptantes] = useState<{ id: string; nombre: string }[]>([]);
  const navigate = useNavigate();

  // Obtener adoptantes al cargar el componente
  useEffect(() => {
    const fetchAdoptantes = async () => {
      try {
        const res = await api.get<{ id: string; nombre: string }[]>('/adoptantes');
        setAdoptantes(res.data);
      } catch (error) {
        console.error('Error al obtener adoptantes', error);
        toast.error('Error al obtener la lista de adoptantes. Intente nuevamente.');
      }
    };
    fetchAdoptantes();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir recarga de la página
    try {
      const animalData = {
        nombre,
        especie,
        edad,
        unidadEdad, // Enviar la unidad de edad al backend
        estadoSalud,
        adoptanteId,
      };

      const res = await api.post('/animales', animalData);
      toast.success('Animal registrado exitosamente.');
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al registrar animal', (error as any).response?.data || error.message);
        toast.error('Error al registrar el animal. Intente nuevamente.');
      } else {
        console.error('Error al registrar animal', error);
        toast.error('Ocurrió un error inesperado. Intente nuevamente.');
      }
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-6 shadow-md rounded"
    >
      <h1 className="text-xl font-bold text-center mb-4">Registrar Nuevo Animal</h1>

      {/* Nombre del animal */}
      <input
        type="text"
        placeholder="Nombre del Animal"
        className="outline rounded p-2 border border-gray-300"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      {/* Especie del animal */}
      <input
        type="text"
        placeholder="Especie"
        className="outline rounded p-2 border border-gray-300"
        value={especie}
        onChange={(e) => setEspecie(e.target.value)}
        required
      />

      {/* Edad del animal */}
      <div>
        <input
          type="number"
          placeholder="Edad"
          className="outline rounded p-2 w-full border border-gray-300"
          value={edad}
          onChange={(e) => setEdad(Number(e.target.value))}
          required
        />
        <div className="flex items-center mt-2 space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="unidadEdad"
              value="años"
              checked={unidadEdad === 'años'}
              onChange={() => setUnidadEdad('años')}
              className="mr-2"
            />
            Años
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="unidadEdad"
              value="meses"
              checked={unidadEdad === 'meses'}
              onChange={() => setUnidadEdad('meses')}
              className="mr-2"
            />
            Meses
          </label>
        </div>
      </div>

      {/* Estado de salud */}
      <select
        className="outline rounded p-2 border border-gray-300"
        value={estadoSalud}
        onChange={(e) => setEstadoSalud(e.target.value)}
        required
      >
        <option value="">Seleccione un estado de salud</option>
        <option value="SANO">Sano</option>
        <option value="EN_TRATAMIENTO">En Tratamiento</option>
        <option value="PERDIDO">Perdido</option>
        <option value="RECUPERANDOSE">Recuperándose</option>
      </select>

      {/* ID del adoptante */}
      <select
        className="outline rounded p-2 border border-gray-300"
        value={adoptanteId}
        onChange={(e) => setAdoptanteId(e.target.value)}
        required
      >
        <option value="">Seleccione un adoptante</option>
        {adoptantes.map((adoptante: any) => (
          <option key={adoptante.id} value={adoptante.id}>
            {adoptante.nombre} - {adoptante.id}
          </option>
        ))}
      </select>

      {/* Botón para registrar */}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600"
      >
        Registrar Animal
      </button>
    </form>
  );
}

export default RegisterAnimal;
