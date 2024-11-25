// src/components/CalendarioCitas.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface Adoptante {
  id: number;
  nombre: string;
}

interface Animal {
  id: number;
  nombre: string;
  adoptante: Adoptante;
}

interface Cita {
  id: number;
  animalId: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  animal: Animal;
}

function CalendarioCitas() {
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/citas');
        if (Array.isArray(res.data)) {
          const eventosCitas: CalendarEvent[] = res.data.map((cita: Cita) => {
            const startDate = new Date(cita.fechaCita);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Duración de 1 hora
            const nombreUsuario = cita.animal?.adoptante?.nombre || 'Cita';
            return {
              id: cita.id,
              title: `${nombreUsuario} - ${cita.motivo}`,
              start: startDate,
              end: endDate,
              resource: cita,
            };
          });
          setEventos(eventosCitas);
        } else {
          setError('Error al obtener citas: respuesta inválida del servidor.');
        }
      } catch (error) {
        setError('Error al obtener citas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, []);

  const handleSelectEvent = (event: CalendarEvent) => {
    const citaId = (event as any).id;
    navigate(`/detalles-cita/${citaId}`);
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-8">Cargando citas...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <span>Calendario de Citas</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8 text-gray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10m2 4.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zm-2 4h.01M3 7h18M4 21h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </h1>
        </div>

        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          messages={{
            next: 'Sig.',
            previous: 'Ant.',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            showMore: (total) => `+ Ver más (${total})`,
          }}
          onSelectEvent={handleSelectEvent}
          className="bg-white shadow-lg rounded-lg p-4"
        />
      </div>
    </div>
  );
}

export default CalendarioCitas;
