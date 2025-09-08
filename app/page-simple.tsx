export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400" />
            <span className="font-semibold tracking-wide">DDS Experiences</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#servicios" className="hover:text-white">Servicios</a>
            <a href="#galeria" className="hover:text-white">Galería</a>
            <a href="#nosotros" className="hover:text-white">Nosotros</a>
            <a href="#contacto" className="hover:text-white">Contacto</a>
          </nav>
        </div>
      </header>
      
      <main className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Espacios <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-300">Lightshow</span> & Audio
        </h1>
        <p className="mt-5 text-neutral-300 md:text-lg max-w-prose">
          Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales.
        </p>
      </main>
    </div>
  );
}
