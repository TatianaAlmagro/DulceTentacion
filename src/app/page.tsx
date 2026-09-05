import RecipeCard from "@/components/RecipeCard";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getRecetasExternas } from "@/lib/themealdb";

export default async function Home() {
  // 1. Obtener recetas de Supabase
  const supabase = await createServerSupabaseClient();
  const { data: recetasLocales } = await supabase
    .from("recetas")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. Obtener recetas externas de TheMealDB
  const recetasExternas = await getRecetasExternas();

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-12">
      <section className="text-center py-8">
        <span className="text-sm font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
          ✨ Recetas hechas con amor ✨
        </span>
        <h1 className="text-4xl font-extrabold mt-4">
          Bienvenido a <span className="text-pink-600">Dulce Tentación</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Descubre deliciosas recetas de postres, aprende nuevas preparaciones y encuentra tu próxima dulce tentación.
        </p>
      </section>

      {/* Sección Supabase */}
      <section>
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Recetas de la Comunidad (Supabase)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recetasLocales && recetasLocales.length > 0 ? (
            recetasLocales.map((receta: any) => (
              <RecipeCard key={receta.id} receta={receta} />
            ))
          ) : (
            <p className="text-gray-500">No hay recetas registradas en Supabase aún.</p>
          )}
        </div>
      </section>

      {/* Sección API Externa */}
      <section>
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Postres Recomendados (TheMealDB API)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recetasExternas?.slice(0, 6).map((meal: any) => (
            <div key={meal.idMeal} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{meal.strMeal}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}