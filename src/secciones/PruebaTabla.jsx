import { useState } from "react";

const PruebaTabla = () => {
  const [data, setData] = useState([
    { id: 1, nombre: "Equipo A", ubicacion: "Sala 1" },
    { id: 2, nombre: "Equipo B", ubicacion: "Sala 2" },
  ]);

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({});

  const handleChange = (e) => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value });
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setEditValue(row);
  };

  const handleSave = () => {
    const updated = data.map((row) =>
      row.id === editId ? { ...row, ...editValue } : row
    );
    setData(updated);
    setEditId(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Prueba de Edición de Tabla</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Ubicación</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="p-2 border">
                {editId === row.id ? (
                  <input
                    name="nombre"
                    value={editValue.nombre || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  row.nombre
                )}
              </td>
              <td className="p-2 border">
                {editId === row.id ? (
                  <input
                    name="ubicacion"
                    value={editValue.ubicacion || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  row.ubicacion
                )}
              </td>
              <td className="p-2 border">
                {editId === row.id ? (
                  <button onClick={handleSave} className="text-green-600 underline">
                    Guardar
                  </button>
                ) : (
                  <button onClick={() => handleEdit(row)} className="text-blue-600 underline">
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PruebaTabla;
