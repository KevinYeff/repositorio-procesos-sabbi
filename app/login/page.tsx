"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hueso">
      <div className="w-full max-w-sm rounded-2xl border border-border-soft bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/images/sabbi-wordmark-green.png"
            alt="Sabbi"
            width={130}
            height={36}
            className="mb-3 h-9 w-auto"
          />
          <p className="text-sm text-ink-caption">
            Repositorio de procesos internos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-verde-profundo"
            >
              Correo electronico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-border-soft bg-hueso px-3 py-2.5 text-sm text-verde-profundo shadow-sm focus:border-verde-sabbi focus:outline-none focus:ring-1 focus:ring-verde-sabbi"
              placeholder="usuario@sabbi.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-verde-profundo"
            >
              Contrasena
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-xl border border-border-soft bg-hueso px-3 py-2.5 text-sm text-verde-profundo shadow-sm focus:border-verde-sabbi focus:outline-none focus:ring-1 focus:ring-verde-sabbi"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-morado px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-morado/90 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-border-soft bg-hueso p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-verde-sabbi">
            Cuentas de prueba
          </p>
          <div className="space-y-1 text-xs text-ink-body">
            <p>
              <strong className="text-verde-profundo">colaborador_a@sabbi.com</strong>{" "}
              / demo123
            </p>
            <p>
              <strong className="text-verde-profundo">aprobador@sabbi.com</strong>{" "}
              / demo123
            </p>
            <p>
              <strong className="text-verde-profundo">colaborador_b@sabbi.com</strong>{" "}
              / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
