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
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecetas(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleEliminar = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
      const { error } = await supabase.from("recetas").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar la receta: " + error.message);
      } else {
        setRecetas(recetas.filter((r) => r.id !== id));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Encabezado del Dashboard */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border mb-8">
        <div>
          <h1 className="text-3xl font-bold text-pink-600">Panel Principal</h1>
          <p className="text-gray-600 text-sm mt-1">
            Sesión iniciada como: <span className="font-semibold">{userEmail}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Sección principal de Recetas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-pink-50/50 p-6 rounded-xl border border-pink-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-pink-700">🍰 Tus Recetas</h2>
              <span className="bg-pink-200 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Rol: Chef
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Aquí podrás crear, editar y gestionar tus publicaciones de repostería.
            </p>
          </div>
          <Link
            href="/recetas/nueva"
            className="inline-block text-center bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition"
          >
            + Crear Nueva Receta
          </Link>
        </div>

        <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-amber-700 mb-2">⭐ Recetas Favoritas</h2>
            <p className="text-gray-600 text-sm mb-4">
              Explora las recetas internacionales traídas directamente desde la API externa.
            </p>
          </div>
          <Link
            href="/explorar"
            className="inline-block text-center bg-amber-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-600 transition"
          >
            Explorar Recetas Globales
          </Link>
        </div>
      </div>

      {/* Lista de Recetas Creadas */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tus Publicaciones</h3>

        {loading ? (
          <p className="text-gray-500">Cargando recetas...</p>
        ) : recetas.length === 0 ? (
          <p className="text-gray-500">Aún no has creado ninguna receta.</p>
        ) : (
          <div className="space-y-4">
            {recetas.map((receta) => (
              <div
                key={receta.id}
                className="p-4 border rounded-lg hover:bg-pink-50/50 hover:border-pink-300 transition flex justify-between items-center"
              >
                <Link href={`/recetas/${receta.id}`} className="flex-1 cursor-pointer">
                  <h4 className="font-bold text-lg text-pink-600">{receta.titulo}</h4>
                  <p className="text-gray-600 text-sm mt-1">{receta.descripcion}</p>
                </Link>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/recetas/${receta.id}/editar`}
                    className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded hover:bg-amber-200 transition"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={(e) => handleEliminar(receta.id, e)}
                    className="px-3 py-1 bg-gray-100 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}