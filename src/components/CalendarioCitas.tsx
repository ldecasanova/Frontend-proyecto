// src/components/CalendarioCitas.tsx
import React, { useState, useEffect } from 'react';
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
        console.log('Respuesta completa:', res);
        if (Array.isArray(res.data)) {
          console.log('Citas recibidas:', res.data);

          const eventosCitas: CalendarEvent[] = res.data.map((cita: Cita) => {
            const startDate = new Date(cita.fechaCita);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Duración de 1 hora

            // Obtener el nombre del usuario (adoptante)
            const nombreUsuario = cita.animal?.adoptante?.nombre || 'Sin nombre';

            return {
              id: cita.id,
              title: `${nombreUsuario} - ${cita.motivo}`,
              start: startDate,
              end: endDate,
              resource: cita, // Adjuntamos la cita completa para usarla luego
            };
          });

          setEventos(eventosCitas);
          console.log('Eventos para el calendario:', eventosCitas);
        } else {
          console.error('La respuesta no es un array:', res.data);
          setError('Error al obtener citas: respuesta inválida del servidor.');
        }
      } catch (error) {
        console.error('Error al obtener citas:', error);
        setError('Error al obtener citas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, []);

  if (loading) {
    return <p>Cargando citas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    const citaId = (event as any).id;
    navigate(`/detalles-cita/${citaId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Calendario de Citas</h1>
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
        onSelectEvent={handleSelectEvent} // Manejar el clic en un evento
      />
    </div>
  );
}

export default CalendarioCitas;
