"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

type Receta = {
  id: string;
  titulo: string;
  descripcion: string;
  ingredientes: string;
  instrucciones: string;
  created_at: string;
};

export default function DetalleRecetaPage() {
  const params = useParams();
  const router = useRouter();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function obtenerReceta() {
      const { data, error } = await supabase
        .from("recetas")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        console.error("Error al obtener la receta:", error);
      } else {
        setReceta(data);
      }
      setLoading(false);
    }

    if (params.id) {
      obtenerReceta();
    }
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-pink-600 font-semibold">Cargando receta...</p>
      </div>
    );
  }

  if (!receta) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800">Receta no encontrada</h2>
        <Link href="/dashboard" className="mt-4 inline-block text-pink-600 underline">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md border">
      <Link href="/dashboard" className="text-sm text-pink-600 hover:underline mb-4 inline-block">
        ← Volver al Dashboard
      </Link>
      
      <h1 className="text-3xl font-bold text-pink-600 mb-2">{receta.titulo}</h1>
      <p className="text-gray-600 text-lg mb-6 italic">{receta.descripcion}</p>

      <div className="space-y-6">
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
          <h2 className="text-xl font-bold text-pink-700 mb-2">🥕 Ingredientes</h2>
          <p className="text-gray-700 whitespace-pre-line">{receta.ingredientes}</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h2 className="text-xl font-bold text-amber-700 mb-2">👩‍🍳 Instrucciones</h2>
          <p className="text-gray-700 whitespace-pre-line">{receta.instrucciones}</p>
        </div>
      </div>
    </div>
  );
}