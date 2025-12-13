import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CrearRutina from './pages/CrearRutina';
import EditarRutina from './pages/EditarRutina';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear" element={<CrearRutina />} />
        <Route path="/editar/:id" element={<EditarRutina />} />
      </Routes>
    </>
  );
}

export default App;