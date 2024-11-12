import Navbar from '../Common/Navbar';
import AnimalList from './AnimalList';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl">Animales Disponibles para Adopción</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate('/add-animal')}
          >
            Agregar Animal
          </button>
        </div>
        <AnimalList />
      </div>
    </div>
  );
}

export default Dashboard;

