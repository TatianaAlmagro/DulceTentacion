/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import Link from "next/link";

export default function RecipeCard({ receta }: { receta: any }) {
  return (
    <div className="border p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg">{receta.titulo}</h3>
      <p className="text-gray-600 text-sm">{receta.descripcion}</p>
      <Link 
        href={`/recetas/${receta.id}`} 
        className="mt-4 block rounded-md bg-pink-500 py-2 text-center text-sm text-white"
      >
        Ver receta
      </Link>
    </div>
  );
}