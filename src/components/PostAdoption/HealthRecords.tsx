import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../Common/Navbar';

interface HealthRecord {
  id: number;
  descripcion: string;
  fechaConsulta: string;
  veterinario: string;
  animalId: number;
  // Añade otros campos si es necesario
}

function HealthRecords() {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get('/registro-salud');
        setRecords(response.data);
      } catch (error) {
        console.error('Error al obtener los registros de salud', error);
      }
    };
    fetchHealthRecords();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl mb-4">Registros de Salud</h1>
        {records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="border p-4 mb-2">
              <p>Mascota ID: {record.animalId}</p>
              <p>Fecha de Consulta: {record.fechaConsulta}</p>
              <p>Descripción: {record.descripcion}</p>
              <p>Veterinario: {record.veterinario}</p>
            </div>
          ))
        ) : (
          <p>No hay registros de salud disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default HealthRecords;
