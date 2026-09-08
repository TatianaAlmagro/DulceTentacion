"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState<"lector" | "chef">("lector");
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

    // Registro enviando la metadata del rol seleccionado ('chef' o 'lector')
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          role: rol,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-500 text-sm">Únete a Dulce Tentación</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario (Rol)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRol("lector")}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition ${
                  rol === "lector"
                    ? "bg-pink-50 border-pink-500 text-pink-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Lector (Explorar)
              </button>
              <button
                type="button"
                onClick={() => setRol("chef")}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition ${
                  rol === "chef"
                    ? "bg-pink-50 border-pink-500 text-pink-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Chef (Publicar)
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              * Los usuarios con rol Chef pueden publicar y gestionar sus propias recetas.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-pink-200"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-pink-600 font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </main>
  );
}