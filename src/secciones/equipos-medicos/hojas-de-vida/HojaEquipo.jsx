import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { toast } from "react-hot-toast";

const HojaEquipo = () => {
  const { id } = useParams();
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    fetchEquipo();
  }, [id]);

  const fetchEquipo = async () => {
    const { data, error } = await supabase.from("equipos").select("*").eq("id", id).single();
    if (error) {
      console.error(error);
      toast.error("Error al cargar la hoja de vida");
    } else {
      setEquipo(data);
    }
  };

  if (!equipo) {
    return <div className="p-4">Cargando hoja de vida...</div>;
  }

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Hoja de Vida del Equipo</h2>
      <div className="bg-white p-4 shadow-md rounded border">
        {Object.entries(equipo).map(([key, value]) => (
          <div key={key} className="flex border-b py-2">
            <div className="w-1/3 font-semibold capitalize">{key.replace(/_/g, " ")}</div>
            <div className="w-2/3">{value || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HojaEquipo;
