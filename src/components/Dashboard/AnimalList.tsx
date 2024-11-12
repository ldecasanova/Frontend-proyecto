import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
}

function AnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await api.get('/animales');
        setAnimals(response.data);
      } catch (error) {
        console.error('Error al obtener animales', error);
      }
    };
    fetchAnimals();
  }, [location]); // Se vuelve a ejecutar cuando cambia la ubicación

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {animals.map((animal) => (
        <div key={animal.id} className="border p-4">
          <h2>{animal.nombre}</h2>
          <p>Especie: {animal.especie}</p>
          <p>Edad: {animal.edad}</p>
          <p>Estado de Salud: {animal.estadoSalud}</p>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded mt-2"
            onClick={() => navigate(`/animal/${animal.id}`)}
          >
            Ver Detalles
          </button>
        </div>
      ))}
    </div>
  );
}

export default AnimalList;
