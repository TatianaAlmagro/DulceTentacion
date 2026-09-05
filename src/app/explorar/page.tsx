/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RecetaExterna = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
};

export default function ExplorarPage() {
  const [recetas, setRecetas] = useState<RecetaExterna[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function obtenerRecetas() {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert"
        );
        if (!res.ok) throw new Error("Error en la API");
        const data = await res.json();
        setRecetas(data.meals || []);
      } catch (err) {
        console.error("Error al conectar con la API externa:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    obtenerRecetas();
  }, []);

  // Filtro interactivo en el cliente con useState
  const recetasFiltradas = recetas.filter((receta) =>
    receta.strMeal.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-pink-600">🌐 Recetas de la Comunidad Global</h1>
          <p className="text-gray-600 text-sm mt-1">
            Catálogo dinámico traído en tiempo real desde la API externa TheMealDB.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-pink-100 text-pink-700 font-medium rounded-lg hover:bg-pink-200 transition"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Componente de búsqueda interactiva (Requisito 2.6) */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Buscar postre por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-3 border border-pink-200 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white text-gray-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-pink-600 font-semibold">
          Cargando recetas internacionales...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
          No se pudieron cargar las recetas externas en este momento. Intenta de nuevo más tarde.
        </div>
      ) : recetasFiltradas.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No se encontraron postres que coincidan con &quot;{busqueda}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recetasFiltradas.slice(0, 12).map((receta) => (
            <div
              key={receta.idMeal}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition"
            >
              <img
                src={receta.strMealThumb}
                alt={receta.strMeal}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="text-xs font-semibold uppercase tracking-wider bg-pink-100 text-pink-700 px-2.5 py-1 rounded-full">
                  Postre Internacional
                </span>
                <h3 className="font-bold text-lg text-gray-800 mt-2">{receta.strMeal}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}