// src/components/Layout.tsx 
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout'); // Navegar a la ruta de logout
  };

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="text-white hover:underline">
              Animales
            </Link>
          </li>
          <li>
            <Link to="/adoptantes" className="text-white hover:underline">
              Clientes
            </Link>
          </li>
          <li>
            <Link to="/agendar-cita" className="text-white hover:underline">
              Agendar Cita
            </Link>
          </li>
          <li>
            <Link to="/calendario-citas" className="text-white hover:underline">
              Calendario
            </Link>
          </li>
        </ul>

        {/* Botones de Perfil y Cerrar Sesión */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/perfil')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
          >
            Perfil
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido de la página */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
