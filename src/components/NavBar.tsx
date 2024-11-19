// src/components/NavBar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Links de navegación */}
      <div className="flex space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Animales
        </Link>
        <Link to="/adoptantes" className="hover:underline">
          Adoptantes
        </Link>
        <Link to="/calendario-citas" className="hover:underline">
          Citas
        </Link>
        <Link to="/agendar-cita" className="hover:underline">
          Agendar Cita
        </Link>
      </div>

      {/* Botón de perfil */}
      <button
        onClick={() => navigate('/perfil')}
        className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-400"
      >
        Perfil
      </button>
    </nav>
  );
}

export default NavBar;
