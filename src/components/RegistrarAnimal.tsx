import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPaw } from 'react-icons/fa'; // Ícono de patita

function RegisterAnimal() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState<number | ''>(''); // Manejar números o cadenas vacías
  const [unidadEdad, setUnidadEdad] = useState<'meses' | 'años'>('años');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [genero, setGenero] = useState<'MACHO' | 'HEMBRA' | ''>(''); // Género del animal
  const [adoptanteId, setAdoptanteId] = useState('');
  const [adoptantes, setAdoptantes] = useState<{ id: string; nombre: string }[]>([]);

  const navigate = useNavigate();

  // Obtener la lista de adoptantes cuando el componente se monta
  useEffect(() => {
    const fetchAdoptantes = async () => {
      try {
        const res = await api.get<{ id: string; nombre: string }[]>('/adoptantes');
        setAdoptantes(res.data); // Guardar la lista de adoptantes en el estado
      } catch (error) {
        console.error('Error al obtener Clientes', error);
        toast.error('Error al obtener la lista de Clientes. Intente nuevamente.');
      }
    };

    fetchAdoptantes();
  }, []);

  // Manejar el envío del formulario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar recarga de la página

    try {
      // Datos que se enviarán al backend
      const animalData = {
        nombre,
        especie,
        edad,
        unidadEdad,
        estadoSalud,
        genero, // Incluimos el género en la solicitud
        adoptanteId,
      };

      // Enviar los datos al backend
      await api.post('/animales', animalData);
      toast.success('Animal registrado exitosamente.');
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (error: any) {
      console.error('Error al registrar animal', error.response?.data || error.message);
      toast.error('Error al registrar el animal. Intente nuevamente.');
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col space-y-6 max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg border border-gray-200"
    >
      <div className="flex items-center justify-center space-x-3 mb-6">
        <FaPaw className="text-green-600 text-2xl" />
        <h1 className="text-3xl font-bold text-gray-800">Registrar Nuevo Animal</h1>
      </div>

      {/* Nombre del animal */}
      <div className="flex flex-col">
        <label htmlFor="nombre" className="text-gray-700 font-semibold mb-2">
          Nombre del Animal
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Nombre del Animal"
          className="outline-none rounded p-3 border border-gray-300 focus:ring-2 focus:ring-green-500"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      {/* Especie del animal */}
      <div className="flex flex-col">
        <label htmlFor="especie" className="text-gray-700 font-semibold mb-2">
          Especie
        </label>
        <input
          id="especie"
          type="text"
          placeholder="Especie"
          className="outline-none rounded p-3 border border-gray-300 focus:ring-2 focus:ring-green-500"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          required
        />
      </div>

      {/* Edad del animal */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2">Edad</label>
        <div className="flex items-center">
          <input
            type="number"
            placeholder="Edad"
            className="outline-none rounded p-3 border border-gray-300 w-full focus:ring-2 focus:ring-green-500"
            value={edad}
            onChange={(e) => setEdad(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex items-center mt-2 space-x-4">
          <label className="flex items-center text-gray-600">
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
          <label className="flex items-center text-gray-600">
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

      {/* Género del animal */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2">Género</label>
        <div className="flex items-center space-x-6">
          <label className="flex items-center text-gray-600">
            <input
              type="radio"
              name="genero"
              value="MACHO"
              checked={genero === 'MACHO'}
              onChange={() => setGenero('MACHO')}
              className="mr-2"
              required
            />
            Macho
          </label>
          <label className="flex items-center text-gray-600">
            <input
              type="radio"
              name="genero"
              value="HEMBRA"
              checked={genero === 'HEMBRA'}
              onChange={() => setGenero('HEMBRA')}
              className="mr-2"
              required
            />
            Hembra
          </label>
        </div>
      </div>

      {/* Estado de salud */}
      <div className="flex flex-col">
        <label htmlFor="estadoSalud" className="text-gray-700 font-semibold mb-2">
          Estado de Salud
        </label>
        <select
          id="estadoSalud"
          className="outline-none rounded p-3 border border-gray-300 focus:ring-2 focus:ring-green-500"
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
      </div>

      {/* ID del adoptante */}
      <div className="flex flex-col">
        <label htmlFor="adoptante" className="text-gray-700 font-semibold mb-2">
          Cliente
        </label>
        <select
          id="adoptante"
          className="outline-none rounded p-3 border border-gray-300 focus:ring-2 focus:ring-green-500"
          value={adoptanteId}
          onChange={(e) => setAdoptanteId(e.target.value)}
          required
        >
          <option value="">Seleccione un Cliente</option>
          {adoptantes.map((adoptante) => (
            <option key={adoptante.id} value={adoptante.id}>
              {adoptante.nombre} - {adoptante.id}
            </option>
          ))}
        </select>
      </div>

      {/* Botón para registrar */}
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded shadow-lg transition duration-300"
      >
        Registrar Animal
      </button>
    </form>
  );
}

export default RegisterAnimal;
