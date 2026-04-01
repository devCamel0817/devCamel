import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import LabsPage from './pages/LabsPage';
import SortingPage from './pages/SortingPage';
import PathfindingPage from './pages/PathfindingPage';
import FourierPage from './pages/FourierPage';
import BoidsPage from './pages/BoidsPage';
import ContactSection from './pages/ContactSection';

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/labs/sorting" element={<SortingPage />} />
            <Route path="/labs/pathfinding" element={<PathfindingPage />} />
            <Route path="/labs/fourier" element={<FourierPage />} />
            <Route path="/labs/boids" element={<BoidsPage />} />
            <Route path="/contact" element={<ContactSection />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
