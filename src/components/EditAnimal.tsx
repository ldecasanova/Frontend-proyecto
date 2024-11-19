import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EditAnimal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [unidadEdad, setUnidadEdad] = useState<'meses' | 'años'>('años');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [adoptanteId, setAdoptanteId] = useState('');
  const [adoptantes, setAdoptantes] = useState<{ id: string; nombre: string }[]>([]);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const res = await axios.get<{ 
          nombre: string; 
          especie: string; 
          edad: number; 
          unidadEdad: 'meses' | 'años'; 
          estadoSalud: string; 
          adoptanteId?: string; 
        }>(`${API_BASE_URL}/animales/${id}`);
        const animal = res.data;

        setNombre(animal.nombre);
        setEspecie(animal.especie);
        setEdad(animal.edad);
        setUnidadEdad(animal.unidadEdad);
        setEstadoSalud(animal.estadoSalud);
        setAdoptanteId(animal.adoptanteId || '');
      } catch (error) {
        console.error('Error al cargar datos del animal:', error);
        toast.error('Error al cargar datos del animal.');
      }
    };

    const fetchAdoptantes = async () => {
      try {
        const res = await axios.get<{ id: string; nombre: string }[]>(`${API_BASE_URL}/adoptantes`);
        setAdoptantes(res.data);
      } catch (error) {
        console.error('Error al cargar adoptantes:', error);
        toast.error('Error al cargar adoptantes.');
      }
    };

    if (id) {
      fetchAnimalData();
      fetchAdoptantes();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedAnimal = {
        nombre,
        especie,
        edad,
        unidadEdad,
        estadoSalud,
        adoptanteId,
      };

      await axios.put(`${API_BASE_URL}/animales/${id}`, updatedAnimal);
      toast.success('Animal actualizado exitosamente.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al actualizar el animal:', error);
      toast.error('Error al actualizar el animal. Por favor, intente nuevamente.');
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-6 shadow-md rounded"
    >
      <h1 className="text-xl font-bold text-center mb-4">Editar Animal</h1>

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

      {/* Adoptante */}
      <select
        className="outline rounded p-2 border border-gray-300"
        value={adoptanteId}
        onChange={(e) => setAdoptanteId(e.target.value)}
      >
        <option value="">Seleccione un adoptante</option>
        {adoptantes.map((adoptante) => (
          <option key={adoptante.id} value={adoptante.id}>
            {adoptante.nombre} - {adoptante.id}
          </option>
        ))}
      </select>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600"
        >
          Actualizar
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white py-2 px-4 rounded shadow hover:bg-gray-600"
          onClick={() => navigate('/dashboard')}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EditAnimal;
