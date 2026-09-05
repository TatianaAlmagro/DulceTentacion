/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then((res: any) => {
      if (res?.data) {
        setUser(res.data.user);
      }
    });
  }, []);

  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        Dulce Tentación
      </Link>
      <div>
        {user ? (
          <span>Hola, {user.email}</span>
        ) : (
          <Link href="/login" className="text-blue-500">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}