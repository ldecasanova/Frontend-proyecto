// src/components/Layout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div>
      {/* Barra de navegación */}
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="text-white">Dashboard</Link>
          </li>
          <li>
            <Link to="/adoptantes" className="text-white">Adoptantes</Link>
          </li>
          <li>
            <Link to="/registrar-animal" className="text-white">Registrar Animal</Link>
          </li>
          <li>
            <Link to="/agendar-cita" className="text-white">Agendar Cita</Link>
          </li>
          {/* Agrega más enlaces según tus necesidades */}
        </ul>
      </nav>

      {/* Contenido de la página */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
