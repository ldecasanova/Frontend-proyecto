// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  unidadEdad: string;
  estadoSalud: string;
  adoptanteId: number;
}

function Dashboard() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimales = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Animal[]>('http://localhost:8080/api/animales');
        setAnimales(res.data);
      } catch (error) {
        console.error('Error al obtener animales', error);
        toast.error('Error al obtener animales.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnimales();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Animales en Atención', 10, 10);
    autoTable(doc, {
      head: [['Nombre', 'Especie', 'Edad', 'Estado de Salud', 'ID Adoptante']],
      body: animales.map((animal) => [
        animal.nombre,
        animal.especie,
        `${animal.edad} ${animal.unidadEdad}`,
        animal.estadoSalud,
        animal.adoptanteId || 'No asignado',
      ]),
    });
    doc.save('Animales_Atencion.pdf');
    toast.success('Archivo PDF exportado exitosamente.');
  };

  const exportToExcel = () => {
    let content = 'Nombre,Especie,Edad,Estado de Salud,ID Adoptante\n';
    animales.forEach((animal) => {
      content += `${animal.nombre},${animal.especie},${animal.edad} ${animal.unidadEdad},${animal.estadoSalud},${animal.adoptanteId || 'No asignado'}\n`;
    });
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Animales_Atencion.csv');
    toast.success('Archivo Excel exportado exitosamente.');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Animales en Atención</h1>

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
      ) : (
        <>
          <div className="flex justify-end space-x-4 mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
              onClick={exportToPDF}
            >
              Exportar a PDF
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow"
              onClick={exportToExcel}
            >
              Exportar a Excel
            </button>
          </div>

          {animales.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead>
                <tr>
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
                  <th className="py-3 px-5 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    ID Adoptante
                  </th>
                  <th className="py-3 px-5 bg-gray-200 text-center text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {animales.map((animal) => (
                  <tr key={animal.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.nombre}</td>
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.especie}</td>
                    <td className="py-4 px-5 text-sm text-gray-700">
                      {animal.edad} {animal.unidadEdad}
                    </td>
                    <td className="py-4 px-5 text-sm text-gray-700">{animal.estadoSalud}</td>
                    <td className="py-4 px-5 text-sm text-gray-700">
                      {animal.adoptanteId || 'No asignado'}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex space-x-2 justify-center">
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded shadow hover:bg-blue-600"
                          onClick={() => navigate(`/animales/${animal.id}/vacunas`)}
                        >
                          Ver Vacunas
                        </button>
                        <button
                          className="bg-green-500 text-white py-1 px-3 rounded shadow hover:bg-green-600"
                          onClick={() => navigate(`/agendar-cita/${animal.id}`)}
                        >
                          Agendar Cita
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 text-lg text-center">No hay animales registrados.</p>
          )}
        </>
      )}

      <div className="mt-8 flex space-x-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={() => navigate('/registrar-animal')}
        >
          Registrar Nuevo Animal
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={() => navigate('/eliminar-animal')}
        >
          Eliminar Animales
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={() => navigate('/calendario-citas')}
        >
          Ver Calendario de Citas
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
