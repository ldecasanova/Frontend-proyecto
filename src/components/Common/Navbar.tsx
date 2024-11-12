import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4 items-center">
        <li>
          <Link to="/dashboard">Inicio</Link>
        </li>
        <li>
          <Link to="/appointments">Citas</Link>
        </li>
        <li>
          <Link to="/health-records">Registros de Salud</Link>
        </li>
        <li>
          <Link to="/add-animal">Agregar Animal</Link>
        </li>
        <li className="ml-auto">
          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-2 py-1 rounded"
            >
              Cerrar Sesión
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
