/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Receta {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url?: string;
  user_id: string;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtener solo las recetas del usuario autenticado
  const { data: recetasData } = await supabase
    .from("recetas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const recetas: Receta[] = recetasData || [];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Encabezado del Dashboard */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-500 text-sm mt-1">
              Sesión iniciada como: <span className="font-semibold text-pink-600">{user.email}</span>
            </p>
          </div>
          
          {/* BOTÓN CONECTADO A LA RUTA /recetas/nueva */}
          <Link
            href="/recetas/nueva"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full text-sm transition shadow-md shadow-pink-200"
          >
            + Nueva Receta
          </Link>
        </div>

        {/* Listado de Recetas */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Mis Recetas</h2>

          {recetas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recetas.map((receta) => (
                <div key={receta.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between p-2">
                  <div className="h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={receta.imagen_url || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"}
                      alt={receta.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2 flex-1">
                    <h3 className="font-bold text-xl text-gray-900">{receta.titulo}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{receta.descripcion}</p>
                  </div>
                  <div className="p-2 pt-0 flex gap-2">
                    <Link
                      href={`/recetas/${receta.id}`}
                      className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-2 rounded-xl text-center text-xs transition"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/recetas/${receta.id}/editar`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl text-center text-xs transition"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 text-gray-500">
              No has creado ninguna receta todavía. Haz clic en &quot;+ Nueva Receta&quot; para empezar.
            </div>
          )}
        </section>

      </div>
    </main>
  );
}