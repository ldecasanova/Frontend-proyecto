import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';

// Definición del Enumerado
enum EstadoAnimal {
  SANO = 'SANO',
  EN_TRATAMIENTO = 'EN_TRATAMIENTO',
  PERDIDO = 'PERDIDO',
  RECUPERANDOSE = 'RECUPERANDOSE',
}

function AddAnimal() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [estadoSalud, setEstadoSalud] = useState<EstadoAnimal | ''>('');
  const [adoptanteId, setAdoptanteId] = useState<number | ''>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddAnimal = async () => {
    if (!nombre || !especie || edad === '' || !estadoSalud) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      const animalData = {
        nombre,
        especie,
        edad: Number(edad),
        estadoSalud,
        adoptanteId: adoptanteId ? Number(adoptanteId) : null,
      };

      await api.post('/animales', animalData);

      // Después de añadir el animal, navegar de regreso al Dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error al añadir el animal', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al añadir el animal. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl mb-4">Agregar Nuevo Animal</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            className="outline rounded p-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Especie"
            className="outline rounded p-2"
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
          />
          <input
            type="number"
            placeholder="Edad"
            className="outline rounded p-2"
            value={edad}
            onChange={(e) => setEdad(e.target.value ? Number(e.target.value) : '')}
          />
          
          {/* Campo Estado de Salud como Select */}
          <select
            className="outline rounded p-2"
            value={estadoSalud}
            onChange={(e) => setEstadoSalud(e.target.value as EstadoAnimal)}
          >
            <option value="">Selecciona el Estado de Salud</option>
            {Object.values(EstadoAnimal).map((estado) => (
              <option key={estado} value={estado}>
                {estado.replace('_', ' ')}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Adoptante ID (opcional)"
            className="outline rounded p-2"
            value={adoptanteId}
            onChange={(e) => setAdoptanteId(e.target.value ? Number(e.target.value) : '')}
          />

          <button
            className="bg-green-500 text-white py-2 rounded"
            onClick={handleAddAnimal}
          >
            Agregar Animal
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAnimal;
