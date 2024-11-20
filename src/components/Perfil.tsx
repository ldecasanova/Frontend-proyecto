// src/components/Perfil.tsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaLock, FaUser } from 'react-icons/fa';
import { UsuarioResponseDto } from '../types/UsuarioResponseDto';

function Perfil() {
  const [activeTab, setActiveTab] = useState('perfil'); // Tab activa
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');

  // Estados para manejar la foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string>('');

  // Obtener el ID del usuario desde localStorage (o cualquier otra fuente de autenticación)
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        if (!userId) {
          toast.error('No se pudo encontrar el ID del usuario.');
          return;
        }

        const res = await api.get<UsuarioResponseDto>(`/usuarios/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = res.data;

        setNombre(data.nombre);
        setEmail(data.email);
        setDireccion(data.direccion);
        // Guardar datos en localStorage para usar en el caché
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('email', data.email);
        localStorage.setItem('direccion', data.direccion);
      } catch (error: any) {
        console.error('Error al cargar los datos del perfil:', error);
        toast.error(error.response?.data?.message || 'Error al cargar los datos del perfil.');
      }
    };

    // Intentar cargar desde el caché primero
    const cachedNombre = localStorage.getItem('nombre');
    const cachedEmail = localStorage.getItem('email');
    const cachedDireccion = localStorage.getItem('direccion');
    const cachedFotoPerfilUrl = localStorage.getItem('fotoPerfilUrl');

    if (cachedNombre && cachedEmail && cachedDireccion) {
      setNombre(cachedNombre);
      setEmail(cachedEmail);
      setDireccion(cachedDireccion);
      setFotoPerfilUrl(cachedFotoPerfilUrl || '');
    } else {
      fetchPerfil();
    }
  }, [userId]);

  // Función para manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoPerfil(e.target.files[0]);

      // Previsualizar la imagen
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFotoPerfilUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Actualizar perfil
  const handleActualizarPerfil = async () => {
    try {
      if (!userId) {
        toast.error('No se pudo encontrar el ID del usuario.');
        return;
      }

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('email', email);
      formData.append('direccion', direccion);
      if (fotoPerfil) {
        formData.append('fotoPerfil', fotoPerfil);
      }

      await api.put(`/usuarios/perfil`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Actualizar el caché en localStorage
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('email', email);
      localStorage.setItem('direccion', direccion);
      localStorage.setItem('fotoPerfilUrl', fotoPerfilUrl);

      toast.success('Perfil actualizado correctamente.');
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil.');
    }
  };

  // Cambiar contraseña
  const handleCambiarContrasena = async () => {
    try {
      if (!userId) {
        toast.error('No se pudo encontrar el ID del usuario.');
        return;
      }

      await api.put(
        `/usuarios/perfil/cambiar-contrasena`,
        {
          contrasenaActual: passwordActual,
          nuevaContrasena: nuevaPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Contraseña cambiada correctamente.');
      // Limpiar los campos de contraseña
      setPasswordActual('');
      setNuevaPassword('');
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña.');
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
          <h2 className="text-xl mb-4">Foto de Perfil</h2>
          {fotoPerfilUrl && (
            <img
              src={fotoPerfilUrl}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full mb-4 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="mb-4"
            onChange={handleFileChange}
          />

          <h2 className="text-xl mb-4">Información Actual</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p>
              <strong>Nombre:</strong> {nombre}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Dirección:</strong> {direccion}
            </p>
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
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nueva Contraseña"
            className="outline rounded p-2 mb-2 w-full"
            value={nuevaPassword}
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
