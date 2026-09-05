"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciales inválidas o cuenta no verificada.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">
        Iniciar Sesión
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 font-semibold transition"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-pink-600 font-semibold hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}