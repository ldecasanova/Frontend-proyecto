// src/components/CalendarioCitas.tsx
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import api from '../api/axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Cita {
  id: number;
  animalId: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  animal: {
    nombre: string;
  };
}

function CalendarioCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await api.get<Cita[]>('/citas');
        setCitas(res.data);
      } catch (error) {
        console.error('Error al obtener citas', error);
      }
    };
    fetchCitas();
  }, []);

  const eventos: CalendarEvent[] = citas.map((cita) => ({
    title: `${cita.animal.nombre} - ${cita.motivo}`,
    start: new Date(cita.fechaCita),
    end: new Date(new Date(cita.fechaCita).getTime() + 60 * 60 * 1000), // Duración de 1 hora
  }));

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
          showMore: total => `+ Ver más (${total})`
        }}
      />
    </div>
  );
}

export default CalendarioCitas;
