import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
  adoptanteId?: number;
  // Añade otros campos necesarios
}

function AnimalDetails() {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await api.get(`/animales/${id}`);
        setAnimal(response.data);
      } catch (error) {
        console.error('Error al obtener los detalles del animal', error);
      }
    };
    fetchAnimal();
  }, [id]);

  if (!animal) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl">{animal.nombre}</h1>
      <p>Especie: {animal.especie}</p>
      <p>Edad: {animal.edad}</p>
      <p>Estado de Salud: {animal.estadoSalud}</p>
      {/* Agrega más información según sea necesario */}
      <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Adoptar
      </button>
    </div>
  );
}

export default AnimalDetails;
