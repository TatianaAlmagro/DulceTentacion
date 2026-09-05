export default function Recetas() {
  const recetas = [
    {
      nombre: "Tarta de Fresas",
      categoria: "Tartas",
      tiempo: "45 minutos",
      dificultad: "Fácil",
      emoji: "🍓",
      descripcion:
        "Una deliciosa tarta con fresas frescas y una crema suave.",
    },
    {
      nombre: "Brownie de Chocolate",
      categoria: "Chocolate",
      tiempo: "35 minutos",
      dificultad: "Fácil",
      emoji: "🍫",
      descripcion:
        "Brownie casero de chocolate, perfecto para cualquier ocasión.",
    },
    {
      nombre: "Cheesecake",
      categoria: "Postres",
      tiempo: "60 minutos",
      dificultad: "Media",
      emoji: "🍰",
      descripcion:
        "Cremoso cheesecake con una deliciosa base de galletas.",
    },
    {
      nombre: "Galletas con Chispas",
      categoria: "Galletas",
      tiempo: "30 minutos",
      dificultad: "Fácil",
      emoji: "🍪",
      descripcion:
        "Crujientes galletas caseras con deliciosas chispas de chocolate.",
    },
    {
      nombre: "Cupcakes de Vainilla",
      categoria: "Cupcakes",
      tiempo: "40 minutos",
      dificultad: "Fácil",
      emoji: "🧁",
      descripcion:
        "Suaves cupcakes de vainilla decorados con una deliciosa crema.",
    },
    {
      nombre: "Flan de Caramelo",
      categoria: "Postres",
      tiempo: "50 minutos",
      dificultad: "Media",
      emoji: "🍮",
      descripcion:
        "Clásico flan casero con una deliciosa capa de caramelo.",
    },
  ];

  return (
    <main className="min-h-screen bg-pink-50">
      {/* ENCABEZADO */}
      <header className="bg-white px-8 py-6 shadow-sm">
        <div className="mx-auto max-w-6xl">
          <a
            href="/"
            className="text-2xl font-bold text-pink-600"
          >
            🍰 Dulce Tentación
          </a>

          <h1 className="mt-8 text-4xl font-bold text-gray-800">
            🍓 Nuestras Recetas
          </h1>

          <p className="mt-3 text-gray-600">
            Descubre deliciosos postres para preparar en casa.
          </p>
        </div>
      </header>

      {/* BUSCADOR */}
      <section className="mx-auto max-w-6xl px-8 py-8">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <input
            type="text"
            placeholder="🔎 Buscar una receta..."
            className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
          />
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto max-w-6xl px-8">
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-pink-500 px-5 py-2 text-white">
            Todas
          </button>

          <button className="rounded-full bg-white px-5 py-2 hover:bg-pink-100">
            🍫 Chocolate
          </button>

          <button className="rounded-full bg-white px-5 py-2 hover:bg-pink-100">
            🍓 Frutas
          </button>

          <button className="rounded-full bg-white px-5 py-2 hover:bg-pink-100">
            🍰 Tartas
          </button>

          <button className="rounded-full bg-white px-5 py-2 hover:bg-pink-100">
            🍪 Galletas
          </button>
        </div>
      </section>

      {/* LISTA DE RECETAS */}
      <section className="mx-auto max-w-6xl px-8 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recetas.map((receta) => (
            <article
              key={receta.nombre}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* IMAGEN TEMPORAL */}
              <div className="flex h-52 items-center justify-center bg-pink-100 text-8xl">
                {receta.emoji}
              </div>

              <div className="p-6">
                <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-600">
                  {receta.categoria}
                </span>

                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  {receta.nombre}
                </h2>

                <p className="mt-3 text-gray-600">
                  {receta.descripcion}
                </p>

                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>⏱️ {receta.tiempo}</span>
                  <span>📊 {receta.dificultad}</span>
                </div>

                <button className="mt-5 w-full rounded-lg bg-pink-500 py-3 font-semibold text-white hover:bg-pink-600">
                  Ver receta
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* VOLVER */}
      <footer className="px-8 pb-10 text-center">
        <a
          href="/"
          className="font-medium text-pink-600 hover:underline"
        >
          ← Volver al inicio
        </a>
      </footer>
    </main>
  );
}