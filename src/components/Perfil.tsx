import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaLock, FaUser } from 'react-icons/fa';

function Perfil() {
  const [activeTab, setActiveTab] = useState('perfil'); // Tab activa
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');

  // Cargar datos del perfil
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/usuarios/perfil', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setNombre((res.data as { nombre: string }).nombre);
        setEmail((res.data as { email: string }).email);
        setDireccion((res.data as { direccion: string }).direccion);
      } catch (error) {
        if (!(error as any).response || (error as any).response.status >= 400) {
          toast.error('Error al cargar los datos del perfil.');
        }
      }
    };

    fetchPerfil();
  }, []);

  // Actualizar perfil
  const handleActualizarPerfil = async () => {
    try {
      await api.put('/usuarios/perfil', { nombre, email, direccion });
      toast.success('Perfil actualizado correctamente.');
    } catch (error) {
      toast.error('Error al actualizar el perfil.');
    }
  };

  // Cambiar contraseña
  const handleCambiarContrasena = async () => {
    try {
      await api.put('/usuarios/perfil/cambiar-contrasena', {
        contrasenaActual: passwordActual,
        nuevaContrasena: nuevaPassword,
      });
      toast.success('Contraseña cambiada correctamente.');
    } catch (error) {
      toast.error('Error al cambiar la contraseña.');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl mb-4">Perfil</h1>

      {/* Barra de navegación para las secciones */}
      <nav className="flex space-x-4 border-b mb-4 pb-2">
        <button
          className={`flex items-center space-x-2 ${
            activeTab === 'perfil' ? 'text-blue-500 font-bold' : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('perfil')}
        >
          <FaUser />
          <span>Información del Perfil</span>
        </button>
        <button
          className={`flex items-center space-x-2 ${
            activeTab === 'seguridad' ? 'text-blue-500 font-bold' : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('seguridad')}
        >
          <FaLock />
          <span>Seguridad y Contraseña</span>
        </button>
      </nav>

      {/* Contenido dinámico basado en la tab activa */}
      {activeTab === 'perfil' && (
        <div>
          <h2 className="text-xl mb-4">Información Actual</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p><strong>Nombre:</strong> {nombre}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Dirección:</strong> {direccion}</p>
          </div>

          <h2 className="text-xl mb-2">Actualizar Perfil</h2>
          <input
            type="text"
            placeholder="Nuevo Nombre"
            value={nombre}
            className="outline rounded p-2 mb-2 w-full"
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Nuevo Email"
            value={email}
            className="outline rounded p-2 mb-2 w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nueva Dirección"
            value={direccion}
            className="outline rounded p-2 mb-2 w-full"
            onChange={(e) => setDireccion(e.target.value)}
          />
          <button
            onClick={handleActualizarPerfil}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Actualizar
          </button>
        </div>
      )}

      {activeTab === 'seguridad' && (
        <div>
          <h2 className="text-xl mb-4">Seguridad y Contraseña</h2>
          <input
            type="password"
            placeholder="Contraseña Actual"
            className="outline rounded p-2 mb-2 w-full"
            onChange={(e) => setPasswordActual(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nueva Contraseña"
            className="outline rounded p-2 mb-2 w-full"
            onChange={(e) => setNuevaPassword(e.target.value)}
          />
          <button
            onClick={handleCambiarContrasena}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Cambiar Contraseña
          </button>
        </div>
      )}
    </div>
  );
}

export default Perfil;
