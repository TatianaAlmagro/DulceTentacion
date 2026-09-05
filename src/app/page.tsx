/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
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

  // Validar si el usuario está autenticado
  const { data: { user } } = await supabase.auth.getUser();

  // Si no ha iniciado sesión, redirigir a la pantalla de login
  if (!user) {
    redirect("/login");
  }

  // Cargar recetas desde Supabase
  const { data: recetas } = await supabase
    .from("recetas")
    .select("*")
    .order("created_at", { ascending: false });

  // Cargar recetas de la API
  let postresAPI = [];
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert", { cache: "no-store" });
    const data = await res.json();
    postresAPI = data.meals ? data.meals.slice(0, 3) : [];
  } catch (error) {
    console.error("Error al cargar la API:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Encabezado */}
        <header className="text-center space-y-2">
          <span className="text-xs font-bold tracking-widest text-pink-500 uppercase">✨ Recetas hechas con amor ✨</span>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Bienvenido a <span className="text-pink-600">Dulce Tentación</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Descubre deliciosas recetas de postres, aprende nuevas preparaciones y encuentra tu próxima dulce tentación.
          </p>
        </header>

        {/* Sección Comunidad */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Recetas de la Comunidad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recetas && recetas.length > 0 ? (
              recetas.map((receta) => (
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

                  {/* Botón Ver Receta */}
                  <div className="p-2 pt-0">
                    <Link
                      href={`/recetas/${receta.id}`}
                      className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 rounded-full text-center text-sm transition"
                    >
                      Ver receta
                    </Link>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay recetas agregadas aún.</p>
            )}
          </div>
        </section>

        {/* Sección Recomendados */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Postres Recomendados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {postresAPI.map((postre: any) => (
              <div key={postre.idMeal} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-2">
                <div className="h-48 w-full overflow-hidden rounded-2xl">
                  <img src={postre.strMealThumb} alt={postre.strMeal} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl text-gray-900">{postre.strMeal}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}