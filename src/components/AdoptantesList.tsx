import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface Adoptante {
  id: number;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
}

function AdoptantesList() {
  const [adoptantes, setAdoptantes] = useState<Adoptante[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAdoptantes();
  }, []);

  const fetchAdoptantes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/adoptantes`);
      setAdoptantes(res.data as Adoptante[]);
    } catch (error) {
      console.error('Error al obtener adoptantes', error);
      toast.error('Error al obtener los adoptantes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este adoptante?');
    if (!confirmar) return;

    setEliminandoId(id);
    try {
      await axios.delete(`${API_BASE_URL}/adoptantes/${id}`);
      setAdoptantes(adoptantes.filter((adoptante) => adoptante.id !== id));
      toast.success('Adoptante eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar adoptante', error);
      toast.error('Error al eliminar el adoptante. Por favor, intenta nuevamente.');
    } finally {
      setEliminandoId(null);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Adoptantes', 10, 10);
    autoTable(doc, {
      head: [['ID', 'Nombre', 'Email', 'Dirección', 'Teléfono']],
      body: adoptantes.map((adoptante) => [
        adoptante.id,
        adoptante.nombre,
        adoptante.email,
        adoptante.direccion,
        adoptante.telefono,
      ]),
      startY: 20,
    });
    doc.save('Lista_Adoptantes.pdf');
    toast.success('Archivo PDF exportado exitosamente.');
  };

  const exportToExcel = () => {
    let content = 'ID,Nombre,Email,Dirección,Teléfono\n';
    adoptantes.forEach((adoptante) => {
      content += `${adoptante.id},${adoptante.nombre},${adoptante.email},${adoptante.direccion},${adoptante.telefono}\n`;
    });

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Lista_Adoptantes.csv');
    toast.success('Archivo Excel exportado exitosamente.');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Lista de Clientes</h1>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300"
            onClick={exportToPDF}
          >
            Exportar a PDF
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300"
            onClick={exportToExcel}
          >
            Exportar a Excel
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300"
            onClick={() => navigate('/agregar-adoptante')}
          >
            Agregar Cliente
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-10 w-10 text-green-500"
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
      ) : adoptantes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 rounded-lg shadow-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-4 px-6 text-left font-semibold">ID</th>
                <th className="py-4 px-6 text-left font-semibold">Nombre</th>
                <th className="py-4 px-6 text-left font-semibold">Email</th>
                <th className="py-4 px-6 text-left font-semibold">Dirección</th>
                <th className="py-4 px-6 text-left font-semibold">Teléfono</th>
                <th className="py-4 px-6 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {adoptantes.map((adoptante, index) => (
                <tr
                  key={adoptante.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100`}
                >
                  <td className="py-4 px-6">{adoptante.id}</td>
                  <td className="py-4 px-6">{adoptante.nombre}</td>
                  <td className="py-4 px-6">{adoptante.email}</td>
                  <td className="py-4 px-6">{adoptante.direccion}</td>
                  <td className="py-4 px-6">{adoptante.telefono}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      className={`${
                        eliminandoId === adoptante.id
                          ? 'bg-red-300 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600'
                      } text-white font-semibold py-2 px-4 rounded shadow transition duration-300`}
                      onClick={() => handleEliminar(adoptante.id)}
                      disabled={eliminandoId === adoptante.id}
                    >
                      {eliminandoId === adoptante.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">No hay Clientes registrados.</p>
        </div>
      )}
    </div>
  );
}

export default AdoptantesList;
