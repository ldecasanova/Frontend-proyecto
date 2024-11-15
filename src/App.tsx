// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import RegistrarAnimal from './components/RegistrarAnimal';
import HistorialAnimal from './components/HistorialAnimal';
import DeleteAnimal from './components/DeleteAnimal';
import AdoptantesList from './components/AdoptantesList';
import AgregarAdoptante from './components/AgregarAdoptante';
import AgendarCita from './components/AgendarCitas';
import CalendarioCitas from './components/CalendarioCitas';
import DetallesCita from './components/DetalleCitas'; // Importamos DetallesCita
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin NavBar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas con NavBar */}
        <Route
          path="/*"
          element={
            <>
              <NavBar />
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="registrar-animal" element={<RegistrarAnimal />} />
                <Route path="eliminar-animal" element={<DeleteAnimal />} />
                <Route path="historial-animal/:id" element={<HistorialAnimal />} />
                <Route path="adoptantes" element={<AdoptantesList />} />
                <Route path="agregar-adoptante" element={<AgregarAdoptante />} />
                <Route path="agendar-cita" element={<AgendarCita />} />
                <Route path="agendar-cita/:id" element={<AgendarCita />} />
                <Route path="calendario-citas" element={<CalendarioCitas />} />
                <Route path="detalles-cita/:id" element={<DetallesCita />} /> {/* Nueva ruta */}
                {/* Añade más rutas aquí */}
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
