import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function RegisterAnimal() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState(0);
  const [estadoSalud, setEstadoSalud] = useState(''); // Estado seleccionado
  const [adoptanteId, setAdoptanteId] = useState(''); // ID seleccionado
  const [adoptantes, setAdoptantes] = useState([]); // Lista de adoptantes
  const navigate = useNavigate();

  // Obtener adoptantes al cargar el componente
  useEffect(() => {
    const fetchAdoptantes = async () => {
      try {
        const res = await api.get('/adoptantes'); // Endpoint para obtener adoptantes
        setAdoptantes(res.data); // Guardar adoptantes en el estado
      } catch (error) {
        console.error('Error al obtener adoptantes', error);
      }
    };
    fetchAdoptantes();
  }, []);

  const handleRegister = async () => {
    try {
      const res = await api.post('/animales', {
        nombre,
        especie,
        edad,
        estadoSalud,
        adoptanteId, // Usar el ID del adoptante seleccionado
      });
      console.log('Animal registrado exitosamente', res.data);
      navigate('/dashboard'); // Redirigir al dashboard después del registro
    } catch (error) {
      console.error('Error al registrar animal', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto">
      <h1 className="text-xl text-center">Registrar Animal</h1>

      {/* Nombre del animal */}
      <input
        type="text"
        placeholder="Nombre del Animal"
        className="outline rounded p-2"
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* Especie del animal */}
      <input
        type="text"
        placeholder="Especie"
        className="outline rounded p-2"
        onChange={(e) => setEspecie(e.target.value)}
      />

      {/* Edad del animal */}
      <input
        type="number"
        placeholder="Edad"
        className="outline rounded p-2"
        onChange={(e) => setEdad(Number(e.target.value))}
      />

      {/* Estado de salud */}
      <select
        className="outline rounded p-2"
        value={estadoSalud}
        onChange={(e) => setEstadoSalud(e.target.value)}
      >
        <option value="">Seleccione un estado de salud</option>
        <option value="SANO">Sano</option>
        <option value="EN_TRATAMIENTO">En Tratamiento</option>
        <option value="PERDIDO">Perdido</option>
        <option value="RECUPERANDOSE">Recuperándose</option>
      </select>

      {/* ID del adoptante */}
      <select
        className="outline rounded p-2"
        value={adoptanteId}
        onChange={(e) => setAdoptanteId(e.target.value)}
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
        className="bg-blue-500 text-white py-2 rounded"
        onClick={handleRegister}
      >
        Registrar Animal
      </button>
    </div>
  );
}

export default RegisterAnimal;
