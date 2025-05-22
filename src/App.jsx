import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import EquiposMedicos from "./secciones/equipos-medicos/catastro/Catastro";
import HojasDeVida from "./secciones/equipos-medicos/hojas-de-vida/HojasDeVida";
import HojaEquipo from "./secciones/equipos-medicos/hojas-de-vida/HojaEquipo"; // 👈 NUEVO IMPORT
import EquiposIndustriales from "./secciones/EquiposIndustriales";
import Movilizacion from "./secciones/Movilizacion";
import Infraestructura from "./secciones/Infraestructura";

const ContenidoPlaceholder = ({ titulo }) => (
  <div className="p-6 text-lg font-semibold">Contenido en desarrollo: {titulo}</div>
);

function EquiposMedicosLayout() {
  return <Outlet />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState("");

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/equipos-medicos/catastro" />} />

            <Route path="/equipos-medicos" element={<EquiposMedicosLayout />}>
              <Route path="catastro" element={<EquiposMedicos />} />
              <Route path="hojas-de-vida" element={<HojasDeVida />} />
              <Route path="hojas-de-vida/:id" element={<HojaEquipo />} /> {/* 👈 NUEVA RUTA */}
              <Route path="convenios" element={<ContenidoPlaceholder titulo="Convenios Vigentes e Históricos" />} />
              <Route path="planificacion" element={<ContenidoPlaceholder titulo="Planificación Anual" />} />
              <Route path="seguimiento-gasto" element={<ContenidoPlaceholder titulo="Seguimiento de Gasto Anual" />} />
              <Route path="reportes" element={<ContenidoPlaceholder titulo="Reportes" />} />
            </Route>

            <Route path="/equipos-industriales" element={<EquiposIndustriales />} />
            <Route path="/movilizacion" element={<Movilizacion />} />
            <Route path="/infraestructura" element={<Infraestructura />} />
            <Route path="/convenios" element={<ContenidoPlaceholder titulo="Convenios" />} />
            <Route path="/suministros" element={<ContenidoPlaceholder titulo="Suministros" />} />
            <Route path="/fondo-fijo" element={<ContenidoPlaceholder titulo="Fondo Fijo" />} />
            <Route path="*" element={<div className="p-6 text-red-600">Ruta no encontrada</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
