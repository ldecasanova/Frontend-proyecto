// src/components/VacunasAnimal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { parseISO, format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

interface Vacuna {
  id: number;
  nombre: string;
  fechaAplicacion: string;
  animalId: number;
}

function VacunasAnimal() {
  const { id } = useParams<{ id: string }>();
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [nombreSeleccionado, setNombreSeleccionado] = useState('Vacuna Común');
  const [nombrePersonalizado, setNombrePersonalizado] = useState('');
  const [fechaAplicacion, setFechaAplicacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [agregando, setAgregando] = useState<boolean>(false);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchVacunas = async () => {
      setLoading(true);
      try {
        if (!id || isNaN(Number(id))) throw new Error('ID de animal inválido.');
        const res = await axios.get<Vacuna[]>(`${API_BASE_URL}/vacunas/animal/${id}`);
        setVacunas(res.data);
      } catch (error) {
        toast.error('Error al obtener las vacunas.');
      } finally {
        setLoading(false);
      }
    };
    fetchVacunas();
  }, [id]);

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    setFechaAplicacion(hoy);
  }, []);

  const handleAgregarVacuna = async () => {
    if (
      !nombreSeleccionado ||
      (nombreSeleccionado === 'Otra' && !nombrePersonalizado.trim()) ||
      !fechaAplicacion
    ) {
      setError('Por favor, complete todos los campos.');
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    const fechaSeleccionada = new Date(fechaAplicacion);
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > ahora) {
      setError('La fecha de aplicación no puede ser una fecha futura.');
      toast.error('La fecha de aplicación no puede ser una fecha futura.');
      return;
    }

    setAgregando(true);
    try {
      const nombreFinal = nombreSeleccionado === 'Otra' ? nombrePersonalizado.trim() : nombreSeleccionado;

      const nuevaVacuna = {
        nombre: nombreFinal,
        fechaAplicacion,
        animalId: parseInt(id!, 10),
      };

      const res = await axios.post<Vacuna>(`${API_BASE_URL}/vacunas`, nuevaVacuna);
      setVacunas([...vacunas, res.data]);
      setNombreSeleccionado('Vacuna Común');
      setNombrePersonalizado('');
      setFechaAplicacion(new Date().toISOString().split('T')[0]);
      toast.success('Vacuna agregada exitosamente.');
    } catch {
      toast.error('Error al agregar la vacuna.');
    } finally {
      setAgregando(false);
    }
  };

  const handleEliminarVacuna = async (idVacuna: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta vacuna?')) return;
    setEliminando(idVacuna);
    try {
      await axios.delete(`${API_BASE_URL}/vacunas/${idVacuna}`);
      setVacunas(vacunas.filter((vacuna) => vacuna.id !== idVacuna));
      toast.success('Vacuna eliminada exitosamente.');
    } catch {
      toast.error('Error al eliminar la vacuna.');
    } finally {
      setEliminando(null);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Vacunas', 10, 10);
    autoTable(doc, {
      head: [['Fecha de Aplicación', 'Nombre']],
      body: vacunas.map((vacuna) => [
        format(parseISO(vacuna.fechaAplicacion), 'dd/MM/yyyy'),
        vacuna.nombre,
      ]),
    });
    doc.save('Vacunas_Animal.pdf');
  };

  const exportToExcel = () => {
    let content = 'Fecha de Aplicación,Nombre\n';
    vacunas.forEach((vacuna) => {
      content += `${format(parseISO(vacuna.fechaAplicacion), 'dd/MM/yyyy')},${vacuna.nombre}\n`;
    });
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Vacunas_Animal.csv');
  };

  const opcionesNombre = ['Vacuna Común', 'Vacuna Triple Viral', 'Vacuna Anti-Rabia', 'Otra'];

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Vacunas del Animal
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Cargando vacunas...</p>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-500">Agregar Nueva Vacuna</h3>
            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="nombreVacuna" className="block text-gray-700 font-semibold mb-2">
                  Nombre de la Vacuna
                </label>
                <select
                  id="nombreVacuna"
                  value={nombreSeleccionado}
                  onChange={(e) => setNombreSeleccionado(e.target.value)}
                  className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  {opcionesNombre.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
              {nombreSeleccionado === 'Otra' && (
                <div>
                  <label htmlFor="nombrePersonalizado" className="block text-gray-700 font-semibold mb-2">
                    Nombre Personalizado
                  </label>
                  <input
                    type="text"
                    id="nombrePersonalizado"
                    placeholder="Escribe el nombre de la vacuna"
                    value={nombrePersonalizado}
                    onChange={(e) => setNombrePersonalizado(e.target.value)}
                    className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
              )}
              <div>
                <label htmlFor="fechaAplicacion" className="block text-gray-700 font-semibold mb-2">
                  Fecha de Aplicación
                </label>
                <input
                  type="date"
                  id="fechaAplicacion"
                  value={fechaAplicacion}
                  onChange={(e) => setFechaAplicacion(e.target.value)}
                  className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <button
                onClick={handleAgregarVacuna}
                disabled={agregando}
                className={`bg-blue-500 text-white py-2 px-4 rounded ${
                  agregando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                } focus:ring focus:ring-blue-300`}
              >
                {agregando ? 'Agregando...' : 'Agregar Vacuna'}
              </button>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow"
              onClick={exportToPDF}
            >
              Exportar a PDF
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded shadow"
              onClick={exportToExcel}
            >
              Exportar a Excel
            </button>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-500">Lista de Vacunas</h3>
            {vacunas.length === 0 ? (
              <p className="text-center text-gray-600">No hay vacunas registradas para este animal.</p>
            ) : (
              <ul className="space-y-4">
                {vacunas.map((vacuna) => (
                  <li key={vacuna.id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>
                          <strong>Nombre:</strong> {vacuna.nombre}
                        </p>
                        <p>
                          <strong>Fecha de Aplicación:</strong>{' '}
                          {format(parseISO(vacuna.fechaAplicacion), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEliminarVacuna(vacuna.id)}
                        disabled={eliminando === vacuna.id}
                        className={`bg-red-500 text-white py-2 px-3 rounded ${
                          eliminando === vacuna.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                        }`}
                      >
                        {eliminando === vacuna.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VacunasAnimal;
