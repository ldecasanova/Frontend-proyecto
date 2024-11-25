// src/components/Layout.tsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaPaw, FaCalendarAlt, FaUsers, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout'); // Navegar a la ruta de logout
  };

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Opciones de navegación */}
            <div className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FaPaw className="mr-2" />
                Animales
              </Link>
              <Link
                to="/adoptantes"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FaUsers className="mr-2" />
                Clientes
              </Link>
              <Link
                to="/agendar-cita"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FaCalendarAlt className="mr-2" />
                Agendar Cita
              </Link>
              <Link
                to="/calendario-citas"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FaCalendarAlt className="mr-2" />
                Calendario
              </Link>
            </div>

            {/* Botones de perfil y cerrar sesión */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/perfil')}
                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition-colors duration-200"
              >
                <FaUserCircle className="mr-2" />
                Perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido de la página */}
      <main className="p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
