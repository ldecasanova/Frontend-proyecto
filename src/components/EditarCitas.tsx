// src/components/EditarCita.tsx
import { useState } from 'react';
import api from '../api/axios'; // Asegúrate de tener una instancia configurada de Axios
import { toast } from 'react-toastify'; // Para notificaciones elegantes
import 'react-toastify/dist/ReactToastify.css';

interface Cita {
  id: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  estado: string;
  animalId: number;
}

interface EditarCitaProps {
  cita: Cita;
  onActualizar: (citaActualizada: Cita) => void;
  onCancelar: () => void;
}

function EditarCita({ cita, onActualizar, onCancelar }: EditarCitaProps) {
  // Función para formatear la fecha al formato necesario para datetime-local
  const formatFechaCita = (fecha: string | null | undefined) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const tzOffset = date.getTimezoneOffset() * 60000; // Convertir a milisegundos
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [fechaCita, setFechaCita] = useState<string>(formatFechaCita(cita.fechaCita));
  const [motivo, setMotivo] = useState<string>(cita.motivo || '');
  const [veterinario, setVeterinario] = useState<string>(cita.veterinario || '');
  const [estado, setEstado] = useState<string>(cita.estado || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleActualizar = async () => {
    // Validaciones básicas
    if (!fechaCita || !motivo || !veterinario || !estado) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Validación de fecha (ejemplo: la fecha no puede ser en el pasado)
    const selectedDate = new Date(fechaCita);
    const now = new Date();
    if (selectedDate < now) {
      setError('La fecha y hora de la cita no pueden ser en el pasado.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedCita = {
        fechaCita: new Date(fechaCita).toISOString(),
        motivo,
        veterinario,
        estado,
      };

      // Enviar la petición PUT al backend para actualizar la cita
      const res = await api.put<Cita>(`/citas/${cita.id}`, updatedCita);

      // Actualizar el estado en el componente padre
      onActualizar(res.data);

      // Notificar al usuario de manera elegante
      toast.success('Cita actualizada exitosamente.');
    } catch (err: any) {
      console.error('Error al actualizar la cita:', err);
      // Verificar si el error tiene una respuesta del servidor
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError('Error al actualizar la cita. Por favor, intenta nuevamente.');
        toast.error('Error al actualizar la cita. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded bg-gray-100">
      <h3 className="text-xl mb-4">Editar Cita</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleActualizar();
        }}
      >
        <div className="mb-4">
          <label htmlFor="fechaCita" className="block mb-1">
            Fecha y Hora:
          </label>
          <input
            id="fechaCita"
            type="datetime-local"
            value={fechaCita || ''}
            onChange={(e) => setFechaCita(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="motivo" className="block mb-1">
            Motivo:
          </label>
          <input
            id="motivo"
            type="text"
            value={motivo || ''}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="veterinario" className="block mb-1">
            Veterinario:
          </label>
          <input
            id="veterinario"
            type="text"
            value={veterinario || ''}
            onChange={(e) => setVeterinario(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="estado" className="block mb-1">
            Estado:
          </label>
          <select
            id="estado"
            value={estado || ''}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Selecciona un estado --</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="REALIZADA">REALIZADA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCita;
