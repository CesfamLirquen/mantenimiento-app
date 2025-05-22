import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom"; // 👈 IMPORTANTE
import { supabase } from "../../../supabaseClient";
import { toast } from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

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
  "tipo_mantenimiento"
];

const columnasConFiltro = ["nombre_equipo", "marca", "modelo"];

const HojasDeVida = () => {
  const [datos, setDatos] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    const { data, error } = await supabase.from("equipos").select("*");
    if (error) {
      toast.error("Error al cargar hojas de vida");
    } else {
      const datosMayuscula = data.map((item) => {
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

  const formatearNombre = (col) => {
    return col.replace(/anio/g, "año").replace(/_/g, " ").toUpperCase();
  };

  const columnasTabla = useMemo(
    () => [
      ...columnas.map((col) => ({
        accessorKey: col,
        header: formatearNombre(col),
        cell: ({ row }) => {
          if (col === "nombre_equipo") {
            return (
              <Link
                to={`/equipos-medicos/hojas-de-vida/${row.original.id}`} // 👈 AQUÍ
                className="text-blue-600 underline"
              >
                {row.original[col]}
              </Link>
            );
          }
          return row.original[col];
        },
        filterFn: "includesString",
        enableColumnFilter: columnasConFiltro.includes(col),
      })),
    ],
    []
  );

  const table = useReactTable({
    data: datos,
    columns: columnasTabla,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4 min-h-screen">
      <div className="sticky top-0 bg-white z-10 p-4">
        <h2 className="text-xl font-bold">Hojas de Vida de Equipos</h2>
      </div>
      <div className="w-max p-4">
        <table className="min-w-full border border-blue-200 text-sm">
          <thead className="bg-blue-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border p-2 whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
            <tr className="bg-blue-100 text-black">
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th key={header.id} className="border p-2">
                  {header.column.getCanFilter() ? (
                    <input
                      type="text"
                      value={header.column.getFilterValue() ?? ""}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
                      className="w-full px-1 rounded border border-blue-300"
                      placeholder="Filtrar..."
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-2 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HojasDeVida;