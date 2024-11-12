import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../Common/Navbar';

interface Appointment {
  id: number;
  animalId: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  // Añade otros campos si es necesario
}

function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/citas');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error al obtener las citas', error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl mb-4">Mis Citas</h1>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="border p-4 mb-2">
              <p>Mascota ID: {appointment.animalId}</p>
              <p>Fecha: {appointment.fechaCita}</p>
              <p>Motivo: {appointment.motivo}</p>
              <p>Veterinario: {appointment.veterinario}</p>
            </div>
          ))
        ) : (
          <p>No tienes citas programadas.</p>
        )}
      </div>
    </div>
  );
}

export default Appointments;
