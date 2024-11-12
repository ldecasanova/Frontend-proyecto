import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AnimalDetails from './components/Dashboard/AnimalDetails';
import Appointments from './components/PostAdoption/Appointments';
import HealthRecords from './components/PostAdoption/HealthRecords';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/animal/:id" element={<AnimalDetails />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/health-records" element={<HealthRecords />} />
          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
