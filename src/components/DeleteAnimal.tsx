import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
  adoptanteId: number;
}

function DeleteAnimal() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnimales();
  }, []);

  const fetchAnimales = async () => {
    setLoading(true);
    try {
      const res = await api.get('/animales');
      setAnimales(res.data as Animal[]);
    } catch (error) {
      console.error('Error al obtener animales', error);
      toast.error('Error al obtener la lista de animales. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este animal?');
    if (!confirmar) return;

    setEliminandoId(id);
    try {
      await api.delete(`/animales/${id}`);
      setAnimales(animales.filter((animal) => animal.id !== id));
      toast.success('Animal eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar animal', error);
      toast.error('Error al eliminar el animal. Por favor, intente nuevamente.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Eliminar Animales</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
            onClick={() => navigate('/dashboard')}
          >
            Volver al Dashboard
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-10 w-10 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : animales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead>
                <tr>
                  <th className="py-3 px-5 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="py-3 px-5 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="py-3 px-5 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Especie
                  </th>
                  <th className="py-3 px-5 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Edad
                  </th>
                  <th className="py-3 px-5 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Estado de Salud
                  </th>
                  <th className="py-3 px-5 bg-gray-200 text-center text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {animales.map((animal) => (
                  <tr key={animal.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.id}</td>
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.nombre}</td>
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.especie}</td>
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.edad}</td>
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.estadoSalud}</td>
                    <td className="py-4 px-5 text-center">
                      <button
                        className={`${
                          eliminandoId === animal.id
                            ? 'bg-red-300 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white font-semibold py-2 px-4 rounded shadow`}
                        onClick={() => handleEliminar(animal.id)}
                        disabled={eliminandoId === animal.id}
                      >
                        {eliminandoId === animal.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg">No hay animales registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeleteAnimal;
