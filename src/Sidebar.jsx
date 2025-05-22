import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ menuOpen, setMenuOpen }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-blue-800 text-white h-full p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-6">Menú</h1>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() =>
              setMenuOpen(menuOpen === "equipos-medicos" ? "" : "equipos-medicos")
            }
            className="font-semibold w-full text-left"
          >
            Equipos Médicos
          </button>
          {menuOpen === "equipos-medicos" && (
            <ul className="ml-4 mt-1 space-y-1 text-sm">
              <li>
                <Link
                  to="/equipos-medicos/catastro"
                  className={`hover:underline ${
                    location.pathname.includes("/equipos-medicos/catastro") ? "font-bold" : ""
                  }`}
                >
                  Catastro
                </Link>
              </li>
              <li>
                <Link
                  to="/equipos-medicos/hojas-de-vida"
                  className={`hover:underline ${
                    location.pathname.includes("/equipos-medicos/hojas-de-vida") ? "font-bold" : ""
                  }`}
                >
                  Hojas de Vida
                </Link>
              </li>
              <li>
                <Link
                  to="/equipos-medicos/convenios"
                  className={`hover:underline ${
                    location.pathname.includes("/equipos-medicos/convenios") ? "font-bold" : ""
                  }`}
                >
                  Convenios Vigentes e Históricos
                </Link>
              </li>
              <li>
                <Link
                  to="/equipos-medicos/planificacion"
                  className={`hover:underline ${
                    location.pathname.includes("/equipos-medicos/planificacion") ? "font-bold" : ""
                  }`}
                >
                  Planificación Anual
                </Link>
              </li>
              <li>
                <Link
                  to="/equipos-medicos/seguimiento-gasto"
                  className={`hover:underline ${
                    location.pathname.includes("/equipos-medicos/seguimiento-gasto") ? "font-bold" : ""
                  }`}
                >
                  Seguimiento de Gasto Anual
                </Link>
              </li>
              <li>
                <Link
                  to="/equipos-medicos/reportes"
                  className={`hover:underline ${
                    location.pathname.includes("/equipos-medicos/reportes") ? "font-bold" : ""
                  }`}
                >
                  Reportes
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/equipos-industriales" className="hover:underline">
            Equipos Industriales
          </Link>
        </li>
        <li>
          <Link to="/movilizacion" className="hover:underline">
            Movilización
          </Link>
        </li>
        <li>
          <Link to="/infraestructura" className="hover:underline">
            Infraestructura
          </Link>
        </li>
        <li>
          <Link to="/convenios" className="hover:underline">
            Convenios
          </Link>
        </li>
        <li>
          <Link to="/suministros" className="hover:underline">
            Suministros
          </Link>
        </li>
        <li>
          <Link to="/fondo-fijo" className="hover:underline">
            Fondo Fijo
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
