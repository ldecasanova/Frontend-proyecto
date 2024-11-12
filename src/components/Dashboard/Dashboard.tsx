import Navbar from '../Common/Navbar';
import AnimalList from './AnimalList';

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl text-center mb-4">Animales Disponibles para Adopción</h1>
        <AnimalList />
      </div>
    </div>
  );
}

export default Dashboard;
