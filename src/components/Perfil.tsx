import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaLock, FaUser } from 'react-icons/fa';
import { UsuarioResponseDto } from '../types/UsuarioResponseDto';

function Perfil() {
  const [activeTab, setActiveTab] = useState('perfil'); // Tab activa
  const [profile, setProfile] = useState<UsuarioResponseDto | null>(null); // Información actual
  const [formValues, setFormValues] = useState({
    nombre: '',
    email: '',
    direccion: '',
  }); // Valores del formulario
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');

  // Estados para manejar la foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string>('');

  // Obtener el ID del usuario desde localStorage (o cualquier otra fuente de autenticación)
  const userId = localStorage.getItem('userId');

  // Cargar los datos del perfil al montar el componente
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

        // Guardar datos actuales en el estado
        setProfile(data);

        // Inicializar el formulario con los valores actuales del perfil
        setFormValues({
          nombre: data.nombre,
          email: data.email,
          direccion: data.direccion,
        });

        // Guardar datos en localStorage para usar como caché
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('email', data.email);
        localStorage.setItem('direccion', data.direccion);
      } catch (error: any) {
        console.error('Error al cargar los datos del perfil:', error);
        toast.error(error.response?.data?.message || 'Error al cargar los datos del perfil.');
      }
    };

    fetchPerfil();
  }, [userId]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

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
      formData.append('nombre', formValues.nombre);
      formData.append('email', formValues.email);
      formData.append('direccion', formValues.direccion);
      if (fotoPerfil) {
        formData.append('fotoPerfil', fotoPerfil);
      }

      await api.put(`/usuarios/perfil`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Actualizar el estado del perfil después de actualizar
      setProfile((prev) => prev ? { ...prev, ...formValues } : null);

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

  if (!profile) return <p>Cargando perfil...</p>;

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
              <strong>Nombre:</strong> {profile.nombre}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Dirección:</strong> {profile.direccion}
            </p>
          </div>

          <h2 className="text-xl mb-2">Actualizar Perfil</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nuevo Nombre"
            value={formValues.nombre}
            className="outline rounded p-2 mb-2 w-full"
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Nuevo Email"
            value={formValues.email}
            className="outline rounded p-2 mb-2 w-full"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Nueva Dirección"
            value={formValues.direccion}
            className="outline rounded p-2 mb-2 w-full"
            onChange={handleInputChange}
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
