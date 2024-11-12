import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AnimalDetails from './components/Dashboard/AnimalDetails';
import AddAnimal from './components/Dashboard/AddAnimal';
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
          <Route path="/add-animal" element={<AddAnimal />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/health-records" element={<HealthRecords />} />
          {/* Agrega más rutas públicas según necesites */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
