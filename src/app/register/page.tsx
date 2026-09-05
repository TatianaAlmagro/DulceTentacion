"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("lector");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nombre,
          role: rol,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          nombre,
          rol,
        },
      ]);

      if (profileError) {
        console.error("Error al crear perfil:", profileError.message);
      }
    }

    setLoading(false);
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">
        Crear cuenta en Dulce Tentación
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Usuario (Rol)</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 bg-white"
          >
            <option value="lector">Lector (Explorar y comentar)</option>
            <option value="chef">Chef (Publicar y gestionar recetas)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 font-semibold transition"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-pink-600 font-semibold hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}