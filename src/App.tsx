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
import DetallesCita from './components/DetalleCitas';
import VacunasAnimal from './components/VacunasAnimal';
import Layout from './components/Layout'; // Importamos el Layout
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas sin NavBar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas con NavBar utilizando el Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="registrar-animal" element={<RegistrarAnimal />} />
            <Route path="eliminar-animal" element={<DeleteAnimal />} />
            <Route path="historial-animal/:id" element={<HistorialAnimal />} />
            <Route path="adoptantes" element={<AdoptantesList />} />
            <Route path="agregar-adoptante" element={<AgregarAdoptante />} />
            <Route path="agendar-cita" element={<AgendarCita />} />
            <Route path="agendar-cita/:id" element={<AgendarCita />} />
            <Route path="calendario-citas" element={<CalendarioCitas />} />
            <Route path="detalles-cita/:id" element={<DetallesCita />} />
            <Route path="animales/:id/vacunas" element={<VacunasAnimal />} />
          </Route>

          {/* Ruta comodín para manejar 404 (opcional) */}
          <Route path="*" element={<h2>404: Página no encontrada</h2>} />
        </Routes>
        <ToastContainer /> {/* Contenedor de notificaciones */}
      </div>
    </Router>
  );
}

export default App;
