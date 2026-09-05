/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function DashboardPage() {
  const [recetas, setRecetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const cargarRecetas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("recetas")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecetas(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  const handleEliminar = async (id: string, titulo: string) => {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar "${titulo}"?`);
    if (!confirmar) return;

    const { error } = await supabase.from("recetas").delete().eq("id", id);

    if (error) {
      alert("Error al eliminar la receta");
    } else {
      setRecetas(recetas.filter((r) => r.id !== id));
      alert("Receta eliminada con éxito");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Encabezado Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-500 text-sm mt-1">Gestiona las recetas de Dulce Tentación</p>
          </div>
          <Link
            href="/dashboard/nuevo"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition shadow-sm"
          >
            + Nueva Receta
          </Link>
        </div>

        {/* Lista de Recetas */}
        {loading ? (
          <p className="text-gray-500">Cargando recetas...</p>
        ) : recetas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recetas.map((receta) => (
              <div key={receta.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between p-2">
                
                {/* Imagen */}
                <div className="h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={receta.imagen_url || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"}
                    alt={receta.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-2 flex-1">
                  <h3 className="font-bold text-2xl text-gray-900">{receta.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {receta.descripcion}
                  </p>
                </div>

                {/* Botones de Administración (Ver, Editar, Eliminar) */}
                <div className="p-2 pt-0 flex gap-2">
                  <Link
                    href={`/recetas/${receta.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-full text-center text-sm transition"
                  >
                    Ver
                  </Link>

                  <Link
                    href={`/recetas/${receta.id}/editar`}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-2.5 rounded-full text-center text-sm transition"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => handleEliminar(receta.id, receta.titulo)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2.5 rounded-full text-center text-sm transition"
                  >
                    Eliminar
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay recetas agregadas aún.</p>
        )}

      </div>
    </main>
  );
}