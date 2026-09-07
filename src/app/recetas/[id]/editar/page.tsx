/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function EditarRecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [autorizado, setAutorizado] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const verificarYObtenerReceta = async () => {
      // 1. Obtener usuario actual de la sesión
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Debes iniciar sesión para editar recetas.");
        router.push("/login");
        return;
      }

      // 2. Obtener la receta de Supabase
      const { data: receta, error } = await supabase
        .from("recetas")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !receta) {
        alert("Receta no encontrada.");
        router.push("/dashboard");
        return;
      }

      // 3. Validar que la receta le pertenezca al usuario logueado
      if (receta.user_id !== user.id) {
        alert("No tienes permiso para editar esta receta porque no eres su autor.");
        router.push("/dashboard");
        return;
      }

      // Cargar datos en los inputs del formulario
      setTitulo(receta.titulo || "");
      setDescripcion(receta.descripcion || "");
      setIngredientes(receta.ingredientes || "");
      setInstrucciones(receta.instrucciones || "");
      setImagenUrl(receta.imagen_url || "");
      setAutorizado(true);
      setLoading(false);
    };

    verificarYObtenerReceta();
  }, [id, router, supabase]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const { error } = await supabase
      .from("recetas")
      .update({
        titulo,
        descripcion,
        ingredientes,
        instrucciones,
        imagen_url: imagenUrl,
      })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar la receta: " + error.message);
      setGuardando(false);
    } else {
      alert("Receta actualizada con éxito.");
      router.push("/dashboard");
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando receta...</div>;
  if (!autorizado) return null;

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Receta</h1>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows={3}
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
            <textarea
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              rows={3}
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instrucciones</label>
            <textarea
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              rows={3}
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
            <input
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition"
          >
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </main>
  );
}