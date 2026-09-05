/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

type Receta = {
  id: string;
  titulo: string;
  descripcion: string;
  created_at: string;
};

export default function DashboardPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUserEmail(user.email ?? null);

    const { data, error } = await supabase
      .from("recetas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al cargar recetas:", error.message);
    } else {
      setRecetas(data || []);
    }
    setLoading(false);
  };

  const eliminarReceta = async (id: string) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta receta?");
    if (!confirmacion) return;

    const { error } = await supabase
      .from("recetas")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar la receta: " + error.message);
    } else {
      setRecetas((prev) => prev.filter((r) => r.id !== id));
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-pink-600 font-semibold">Cargando recetas...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50/30 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
            {userEmail && <p className="text-sm text-gray-600">Sesión iniciada como: {userEmail}</p>}
          </div>

          <Link
            href="/dashboard/nuevo"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            + Nueva Receta
          </Link>
        </header>

        {recetas.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">No hay recetas registradas todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recetas.map((receta) => (
              <div key={receta.id} className="bg-white p-5 rounded-xl shadow-sm border border-pink-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{receta.titulo}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{receta.descripcion}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                  <Link
                    href={`/recetas/${receta.id}`}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold py-2 rounded text-center transition"
                  >
                    Ver
                  </Link>

                  <Link
                    href={`/recetas/${receta.id}/editar`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 rounded text-center transition"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => eliminarReceta(receta.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded text-center transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}