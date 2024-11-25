// src/components/Perfil.tsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaLock, FaUser } from 'react-icons/fa';
import { UsuarioResponseDto } from '../types/UsuarioResponseDto';

function Perfil() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [profile, setProfile] = useState<UsuarioResponseDto | null>(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    email: '',
    direccion: '',
  });
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string>('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        if (!userId) {
          toast.error('No se pudo encontrar el ID del usuario.');
          return;
        }
        const res = await api.get<UsuarioResponseDto>(`/usuarios/${userId}`);
        const data = res.data;
        setProfile(data);
        setFormValues({
          nombre: data.nombre,
          email: data.email,
          direccion: data.direccion,
        });
        if (data.fotoPerfilUrl) {
          setFotoPerfilUrl(data.fotoPerfilUrl as unknown as string);
        }
      } catch (error) {
        toast.error('Error al cargar los datos del perfil.');
      }
    };
    fetchPerfil();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleActualizarPerfil = async () => {
    // Lógica para actualizar perfil
  };

  const handleCambiarContrasena = async () => {
    // Lógica para cambiar contraseña
  };

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

  if (!profile) return <p className="text-gray-700 text-center mt-4">Cargando perfil...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <FaUser className="text-blue-500" />
        <span>Mi Perfil</span>
      </h1>

      <nav className="flex space-x-4 border-b mb-6 pb-2">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'perfil' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('perfil')}
        >
          <div className="flex items-center space-x-2">
            <FaUser />
            <span>Información del Perfil</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'seguridad' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('seguridad')}
        >
          <div className="flex items-center space-x-2">
            <FaLock />
            <span>Seguridad y Contraseña</span>
          </div>
        </button>
      </nav>

      {activeTab === 'perfil' && (
        <div>
          <div className="flex flex-col items-center mb-6">
            {fotoPerfilUrl ? (
              <img
                src={fotoPerfilUrl}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaUser className="text-gray-400 text-4xl" />
              </div>
            )}
            <label htmlFor="fileInput" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">
              Seleccionar Archivo
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <h2 className="text-xl font-bold mb-4">Actualizar Información</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nuevo Nombre"
              className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={formValues.nombre}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Nuevo Email"
              className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={formValues.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Nueva Dirección"
              className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={formValues.direccion}
              onChange={handleInputChange}
            />
            <button
              onClick={handleActualizarPerfil}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
            >
              Actualizar Perfil
            </button>
          </div>
        </div>
      )}

      {activeTab === 'seguridad' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña Actual"
              className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nueva Contraseña"
              className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              className="w-full p-3 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleCambiarContrasena}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
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
