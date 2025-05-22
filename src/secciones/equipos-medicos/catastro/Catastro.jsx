import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

const columnas = [
  "servicio_clinico",
  "recinto",
  "clase",
  "subclase",
  "nombre_equipo",
  "marca",
  "modelo",
  "serie",
  "inventario",
  "anio_adquisicion",
  "vida_util",
  "vida_util_residual",
  "compra",
  "estado",
  "tipo",
  "garantia",
  "anio_vencimiento_garantia",
  "bajo_plan_de_mantenimiento",
  "anio_ingreso_mantenimiento",
  "tipo_mantenimiento",
];

const EquiposMedicos = () => {
  const [datos, setDatos] = useState([]);
  const [nuevoEquipo, setNuevoEquipo] = useState(() =>
    columnas.reduce((acc, col) => ({ ...acc, [col]: "" }), {})
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [seleccionados, setSeleccionados] = useState([]);
  const [filtros, setFiltros] = useState({ nombre_equipo: "", marca: "", modelo: "" });
  const [orden, setOrden] = useState({ columna: null, asc: true });

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    const { data, error } = await supabase.from("equipos").select("*");
    if (error) {
      toast.error("Error al cargar equipos");
    } else {
      const datosMayuscula = data
        .filter((item) => item.estado?.toUpperCase() !== "BAJA")
        .map((item) => {
          const transformado = {};
          columnas.forEach((col) => {
            transformado[col] = item[col]?.toString().toUpperCase() || "";
          });
          transformado.id = item.id;
          return transformado;
        });
      setDatos(datosMayuscula);
    }
  };

  const datosFiltradosYOrdenados = () => {
    let filtrados = [...datos].filter((fila) =>
      Object.entries(filtros).every(
        ([col, val]) => fila[col]?.includes(val.toUpperCase())
      )
    );

    if (orden.columna) {
      filtrados.sort((a, b) => {
        const valorA = a[orden.columna] || "";
        const valorB = b[orden.columna] || "";
        return orden.asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
      });
    }

    return filtrados;
  };

  const cambiarOrden = (col) => {
    setOrden((prev) => ({
      columna: col,
      asc: prev.columna === col ? !prev.asc : true,
    }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const comenzarEdicion = (fila) => {
    setEditingId(fila.id);
    setEditData({ ...fila });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setEditData({});
  };

  const guardarCambios = async () => {
    const datosValidos = columnas.reduce((acc, col) => {
      const valor = editData[col];
      acc[col] = valor !== undefined && valor !== null ? valor.toString().toUpperCase() : "";
      return acc;
    }, {});

    const { error } = await supabase.from("equipos").update(datosValidos).eq("id", editingId);
    if (error) {
      toast.error("Error al guardar cambios: " + error.message);
    } else {
      toast.success("Cambios guardados correctamente");
      cancelarEdicion();
      fetchEquipos();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEquipo({ ...nuevoEquipo, [name]: value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("equipos").insert([nuevoEquipo]);
    if (error) {
      toast.error("Error al agregar equipo");
    } else {
      toast.success("Equipo agregado correctamente");
      setShowForm(false);
      setNuevoEquipo(columnas.reduce((acc, col) => ({ ...acc, [col]: "" }), {}));
      fetchEquipos();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);

    const datosFiltrados = json.map((fila) => {
      const limpio = {};
      columnas.forEach((col) => {
        limpio[col] = fila[col]?.toString().toUpperCase() || "";
      });
      return limpio;
    });

    const { error } = await supabase.from("equipos").insert(datosFiltrados);
    if (error) {
      toast.error("Error al importar archivo");
    } else {
      toast.success("Equipos importados correctamente");
      fetchEquipos();
    }
  };

  const eliminarEquipo = async (id) => {
    if (!window.confirm("¿Estás seguro de dar de baja este equipo?")) return;
    const { error } = await supabase.from("equipos").update({ estado: "BAJA" }).eq("id", id);
    if (error) {
      toast.error("Error al dar de baja el equipo");
    } else {
      toast.success("Equipo dado de baja");
      fetchEquipos();
    }
  };

  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    if (!window.confirm("¿Estás seguro de dar de baja los equipos seleccionados?")) return;
    const { error } = await supabase.from("equipos").update({ estado: "BAJA" }).in("id", seleccionados);
    if (error) {
      toast.error("Error al dar de baja los equipos");
    } else {
      toast.success("Equipos dados de baja");
      setSeleccionados([]);
      fetchEquipos();
    }
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((sel) => sel !== id) : [...prev, id]
    );
  };

  const formatearNombre = (col) => {
    return col.replace(/anio/g, "año").replace(/_/g, " ").toUpperCase();
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Equipos Médicos</h2>
        <div className="space-x-2">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">
            {showForm ? "Cancelar" : "Agregar equipo"}
          </button>
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
            Agregar desde Excel
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
          </label>
          {seleccionados.length > 0 && (
            <button onClick={eliminarSeleccionados} className="bg-red-600 text-white px-4 py-2 rounded">
              Dar de baja seleccionados
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
          {columnas.map((col) => (
            <div key={col}>
              <label className="block text-sm font-semibold mb-1">{formatearNombre(col)}</label>
              <input
                type="text"
                name={col}
                value={nuevoEquipo[col] || ""}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded p-2"
              />
            </div>
          ))}
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
              Guardar equipo
            </button>
          </div>
        </form>
      )}

      <table className="w-full border border-blue-200 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border p-2"></th>
            {columnas.map((col) => (
              <th key={col} className="border p-2 cursor-pointer" onClick={() => cambiarOrden(col)}>
                {formatearNombre(col)} {orden.columna === col && (orden.asc ? "🔼" : "🔽")}
              </th>
            ))}
            <th className="border p-2">ACCIONES</th>
          </tr>
          <tr className="bg-blue-100">
            <td className="border p-2"></td>
            {columnas.map((col) => (
              <td key={col} className="border p-2">
                {filtros[col] !== undefined ? (
                  <input
                    name={col}
                    value={filtros[col] || ""}
                    onChange={handleFiltroChange}
                    className="w-full px-1 rounded border border-blue-300"
                    placeholder="Filtrar..."
                  />
                ) : null}
              </td>
            ))}
            <td className="border p-2"></td>
          </tr>
        </thead>
        <tbody>
          {datosFiltradosYOrdenados().map((fila) => (
            <tr key={fila.id} className="bg-white">
              <td className="border p-2 text-center">
                <input type="checkbox" checked={seleccionados.includes(fila.id)} onChange={() => toggleSeleccion(fila.id)} />
              </td>
              {columnas.map((col) => (
                <td key={col} className="border p-2">
                  {editingId === fila.id ? (
                    <input
                      name={col}
                      value={editData[col] || ""}
                      onChange={handleEditChange}
                      className="w-full border border-blue-300 p-1 rounded"
                    />
                  ) : (
                    fila[col]
                  )}
                </td>
              ))}
              <td className="border p-2 space-x-2">
                {editingId === fila.id ? (
                  <>
                    <button onClick={guardarCambios} className="text-green-600 hover:underline">
                      Guardar
                    </button>
                    <button onClick={cancelarEdicion} className="text-red-600 hover:underline">
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => comenzarEdicion(fila)} className="text-blue-600 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => eliminarEquipo(fila.id)} className="text-red-600 hover:underline">
                      Dar de baja
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquiposMedicos;
