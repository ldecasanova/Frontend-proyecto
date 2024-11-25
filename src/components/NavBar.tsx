// src/components/NavBar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    navigate('/logout'); // Navegar a la ruta de logout
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Links de navegación */}
      <div className="flex space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Animales
        </Link>
        <Link to="/adoptantes" className="hover:underline">
          Clientes
        </Link>
        <Link to="/calendario-citas" className="hover:underline">
          Citas
        </Link>
        <Link to="/agendar-cita" className="hover:underline">
          Agendar Cita
        </Link>
      </div>

      {/* Botón de perfil y logout */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/perfil')}
          className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-400"
        >
          Perfil
        </button>
        <button
          onClick={handleLogoutClick}
          className="bg-red-500 py-2 px-4 rounded hover:bg-red-400"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
