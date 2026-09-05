"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function NuevaRecetaPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión para publicar una receta.");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("recetas").insert([
      {
        titulo,
        descripcion,
        ingredientes,
        instrucciones,
        usuario_id: user.id,
      },
    ]);

    if (error) {
      alert("Error al guardar la receta: " + error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Agregar Nueva Receta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Ej. Pastel de Chocolate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción corta</label>
          <input
            type="text"
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Delicioso pastel con cobertura de ganache"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
          <textarea
            required
            rows={3}
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Harina, huevos, chocolate, azúcar..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instrucciones</label>
          <textarea
            required
            rows={4}
            value={instrucciones}
            onChange={(e) => setInstrucciones(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Paso 1: Mezclar los secos... Paso 2: Hornear..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 disabled:opacity-50 transition"
        >
          {loading ? "Guardando..." : "Publicar Receta"}
        </button>
      </form>
    </div>
  );
}