// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex space-x-4">
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
    </nav>
  );
}

export default NavBar;
