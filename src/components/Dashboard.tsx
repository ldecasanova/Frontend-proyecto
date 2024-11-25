import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

// Paleta de colores
const colors = {
  primary: '#2563EB', // Azul
  secondary: '#16A34A', // Verde
  danger: '#DC2626', // Rojo
  warning: '#F59E0B', // Amarillo
  neutral: '#F3F4F6', // Gris claro
  textDark: '#374151', // Gris oscuro
  textLight: '#FFFFFF', // Blanco
};

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  unidadEdad: string;
  estadoSalud: string;
  genero?: string; // Campo para el género
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
      head: [['Nombre', 'Especie', 'Edad', 'Género', 'Estado de Salud', 'ID Cliente']],
      body: animales.map((animal) => [
        animal.nombre,
        animal.especie,
        `${animal.edad} ${animal.unidadEdad}`,
        animal.genero || 'No especificado',
        animal.estadoSalud,
        animal.adoptanteId || 'No asignado',
      ]),
    });
    doc.save('Animales_Atencion.pdf');
    toast.success('Archivo PDF exportado exitosamente.');
  };

  const exportToExcel = () => {
    let content = 'Nombre,Especie,Edad,Género,Estado de Salud,ID Cliente\n';
    animales.forEach((animal) => {
      content += `${animal.nombre},${animal.especie},${animal.edad} ${animal.unidadEdad},${animal.genero || 'No especificado'},${animal.estadoSalud},${animal.adoptanteId || 'No asignado'}\n`;
    });
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Animales_Atencion.csv');
    toast.success('Archivo Excel exportado exitosamente.');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Animales en Atención
      </h1>

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
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <button
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300"
                onClick={exportToPDF}
              >
                <FaFilePdf className="mr-2" />
                Exportar a PDF
              </button>
              <button
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300"
                onClick={exportToExcel}
              >
                <FaFileExcel className="mr-2" />
                Exportar a Excel
              </button>
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300"
              onClick={() => navigate('/registrar-animal')}
            >
              Registrar Nuevo Animal
            </button>
          </div>

          {animales.length > 0 ? (
            <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Nombre</th>
                  <th className="py-4 px-6 text-left font-semibold">Especie</th>
                  <th className="py-4 px-6 text-left font-semibold">Edad</th>
                  <th className="py-4 px-6 text-left font-semibold">Género</th>
                  <th className="py-4 px-6 text-left font-semibold">Estado de Salud</th>
                  <th className="py-4 px-6 text-left font-semibold">ID Cliente</th>
                  <th className="py-4 px-6 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {animales.map((animal, index) => (
                  <tr
                    key={animal.id}
                    className={`border-b ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100`}
                  >
                    <td className="py-4 px-6">{animal.nombre}</td>
                    <td className="py-4 px-6">{animal.especie}</td>
                    <td className="py-4 px-6">{`${animal.edad} ${animal.unidadEdad}`}</td>
                    <td className="py-4 px-6">{animal.genero || 'No especificado'}</td>
                    <td className="py-4 px-6">{animal.estadoSalud}</td>
                    <td className="py-4 px-6">{animal.adoptanteId || 'No asignado'}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded shadow transition duration-300"
                          onClick={() => navigate(`/animales/${animal.id}/vacunas`)}
                        >
                          Vacunas
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded shadow transition duration-300"
                          onClick={() => navigate(`/agendar-cita/${animal.id}`)}
                        >
                          Cita
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded shadow transition duration-300"
                          onClick={() => navigate(`/editar-animal/${animal.id}`)}
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 text-center text-lg mt-4">
              No hay animales registrados.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
