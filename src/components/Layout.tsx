// src/components/Layout.tsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="text-white hover:underline">Dashboard</Link>
          </li>
          <li>
            <Link to="/adoptantes" className="text-white hover:underline">Adoptantes</Link>
          </li>
          <li>
            <Link to="/registrar-animal" className="text-white hover:underline">Registrar Animal</Link>
          </li>
          <li>
            <Link to="/agendar-cita" className="text-white hover:underline">Agendar Cita</Link>
          </li>
        </ul>
        {/* Botón de perfil */}
        <button
          onClick={() => navigate('/perfil')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
        >
          Perfil
        </button>
      </nav>

      {/* Contenido de la página */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
