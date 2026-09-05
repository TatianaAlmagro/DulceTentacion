"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function EditarRecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function cargarReceta() {
      const { data, error } = await supabase
        .from("recetas")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("No se pudo cargar la receta.");
        router.push("/dashboard");
        return;
      }

      setTitulo(data.titulo || "");
      setDescripcion(data.descripcion || "");
      setIngredientes(Array.isArray(data.ingredientes) ? data.ingredientes.join("\n") : (data.ingredientes || ""));
      setInstrucciones(data.instrucciones || "");
      setLoading(false);
    }

    cargarReceta();
  }, [id, supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const { error } = await supabase
      .from("recetas")
      .update({
        titulo,
        descripcion,
        ingredientes,
        instrucciones,
      })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar la receta: " + error.message);
      setGuardando(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-pink-600 font-semibold">
        Cargando datos de la receta...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-pink-600 mb-6">✏️ Editar Receta</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Receta
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breve Descripción
            </label>
            <input
              type="text"
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredientes
            </label>
            <textarea
              rows={4}
              required
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrucciones / Preparación
            </label>
            <textarea
              rows={5}
              required
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-3">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 transition disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-5 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}