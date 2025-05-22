import React, { useState } from "react";

const PruebaTabla = () => {
  const [datos, setDatos] = useState([
    { id: 1, nombre: "Equipo A", modelo: "X123" },
    { id: 2, nombre: "Equipo B", modelo: "Y456" },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const comenzarEdicion = (fila) => {
    setEditingId(fila.id);
    setEditData({ ...fila });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = () => {
    const nuevosDatos = datos.map((item) =>
      item.id === editingId ? editData : item
    );
    setDatos(nuevosDatos);
    setEditingId(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Prueba de edición en tabla</h2>
      <table className="border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Modelo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => (
            <tr key={fila.id}>
              <td className="border p-2">
                {editingId === fila.id ? (
                  <input
                    name="nombre"
                    value={editData.nombre}
                    onChange={handleEditChange}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  fila.nombre
                )}
              </td>
              <td className="border p-2">
                {editingId === fila.id ? (
                  <input
                    name="modelo"
                    value={editData.modelo}
                    onChange={handleEditChange}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  fila.modelo
                )}
              </td>
              <td className="border p-2">
                {editingId === fila.id ? (
                  <button onClick={guardarCambios} className="text-green-600">
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => comenzarEdicion(fila)}
                    className="text-blue-600"
                  >
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
