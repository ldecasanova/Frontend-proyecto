// src/components/Perfil.tsx

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
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para manejar la foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string>('');

  // Obtener el ID del usuario desde localStorage (o cualquier otra fuente de autenticación)
  const userId = localStorage.getItem('userId');
  // const token = localStorage.getItem('token'); // No se utilizará el token

  // Cargar los datos del perfil al montar el componente
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        if (!userId) {
          toast.error('No se pudo encontrar el ID del usuario.');
          return;
        }

        const res = await api.get<UsuarioResponseDto>(`/usuarios/${userId}`);
        const data = res.data;

        // Guardar datos actuales en el estado
        setProfile(data);

        // Inicializar el formulario con los valores actuales del perfil
        setFormValues({
          nombre: data.nombre,
          email: data.email,
          direccion: data.direccion,
        });

        // Si el backend devuelve la URL de la foto de perfil, úsala para previsualizar
        if (data.fotoPerfilUrl) {
          setFotoPerfilUrl(data.fotoPerfilUrl as unknown as string);
        }
      } catch (error: any) {
        console.error('Error al cargar los datos del perfil:', error);
        toast.error(
          error.response?.data?.message || 'Error al cargar los datos del perfil.'
        );
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
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Solo se permiten imágenes en formato JPEG, PNG o GIF.');
        return;
      }

      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        toast.error('El tamaño de la imagen excede el límite permitido de 10MB.');
        return;
      }

      setFotoPerfil(file);

      // Previsualizar la imagen
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFotoPerfilUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Actualizar perfil
  const handleActualizarPerfil = async () => {
    try {
      if (!userId) {
        toast.error('No se pudo encontrar el ID del usuario.');
        return;
      }

      // Validaciones del formulario
      if (!formValues.nombre || !formValues.email || !formValues.direccion) {
        toast.error('Por favor, completa todos los campos.');
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email)) {
        toast.error('Por favor, ingresa un email válido.');
        return;
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('nombre', formValues.nombre);
      formData.append('email', formValues.email);
      formData.append('direccion', formValues.direccion);
      if (fotoPerfil) {
        formData.append('fotoPerfil', fotoPerfil);
      }

      // Enviar solicitud PUT para actualizar el perfil con userId como query parameter

      // Re-fetchar el perfil actualizado para asegurar la sincronización
      const updatedProfileRes = await api.get<UsuarioResponseDto>(`/usuarios/${userId}`);
      const updatedProfile = updatedProfileRes.data;
      setProfile(updatedProfile);

      // Actualizar los valores del formulario con los nuevos datos
      setFormValues({
        nombre: updatedProfile.nombre,
        email: updatedProfile.email,
        direccion: updatedProfile.direccion,
      });

      // Si el backend devuelve la URL de la foto de perfil, úsala para previsualizar
      if (updatedProfile.fotoPerfilUrl) {
        setFotoPerfilUrl(updatedProfile.fotoPerfilUrl as unknown as string);
      }

      toast.success('Perfil actualizado correctamente.');
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast.error(
        error.response?.data?.message || 'Error al actualizar el perfil.'
      );
    }
  };

  // Cambiar contraseña
  const handleCambiarContrasena = async () => {
    try {
      if (!userId) {
        toast.error('No se pudo encontrar el ID del usuario.');
        return;
      }

      // Validaciones de contraseña
      if (!passwordActual || !nuevaPassword || !confirmPassword) {
        toast.error('Por favor, completa todos los campos de contraseña.');
        return;
      }

      if (nuevaPassword !== confirmPassword) {
        toast.error('La nueva contraseña y su confirmación no coinciden.');
        return;
      }

      // Opcional: Validar la fuerza de la nueva contraseña

      // Enviar solicitud PUT para cambiar la contraseña
      await api.put(
        `/usuarios/perfil/cambiar-contrasena`,
        {
          contrasenaActual: passwordActual,
          nuevaContrasena: nuevaPassword,
          usuarioId: Number(userId), // Asegúrate de enviar el userId
        },
        {
          headers: {
            // No enviar Authorization header
          },
        }
      );

      toast.success('Contraseña cambiada correctamente.');
      // Limpiar los campos de contraseña
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);
      toast.error(
        error.response?.data?.message || 'Error al cambiar la contraseña.'
      );
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
          {fotoPerfilUrl ? (
            <img
              src={fotoPerfilUrl}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full mb-4 object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <FaUser size={32} color="#6B7280" />
            </div>
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
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="nombre"
              placeholder="Nuevo Nombre"
              value={formValues.nombre}
              className="outline rounded p-2 border"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Nuevo Email"
              value={formValues.email}
              className="outline rounded p-2 border"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Nueva Dirección"
              value={formValues.direccion}
              className="outline rounded p-2 border"
              onChange={handleInputChange}
            />
            <button
              onClick={handleActualizarPerfil}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Actualizar
            </button>
          </div>
        </div>
      )}

      {activeTab === 'seguridad' && (
        <div>
          <h2 className="text-xl mb-4">Seguridad y Contraseña</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="password"
              placeholder="Contraseña Actual"
              className="outline rounded p-2 border"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nueva Contraseña"
              className="outline rounded p-2 border"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              className="outline rounded p-2 border"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleCambiarContrasena}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
