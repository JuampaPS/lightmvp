"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Instagram, MessageCircle, Music2, Lightbulb, Sparkles, Globe } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

// One-page landing for "Creación y diseño de espacios Lightshow & Audio"
// Tech: React + Tailwind + shadcn/ui. Drop into Next.js (app or pages) or Vite.
// Replace placeholders (LOGO, fotos, links) and deploy on Vercel.

export default function LightshowAudioLanding() {
  const [sent, setSent] = useState(false);
  const { t, language, changeLanguage, isLoading } = useTranslations();

  if (isLoading || !t) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 mx-auto mb-4 animate-pulse" />
          <p className="text-neutral-300">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400" />
            <span className="font-semibold tracking-wide">DDS Experiences</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#servicios" className="hover:text-white">{t.nav.services}</a>
            <a href="#galeria" className="hover:text-white">{t.nav.gallery}</a>
            <a href="#contacto" className="hover:text-white">{t.nav.contact}</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeLanguage('es')}
                className={`px-2 py-1 text-xs rounded ${language === 'es' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('sv')}
                className={`px-2 py-1 text-xs rounded ${language === 'sv' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                SV
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
            <a href="#contacto" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl transition-colors">{t.nav.budget}</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.15),transparent_60%)]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase text-xs tracking-[0.2em] text-emerald-300/80">Creación & Diseño</p>
            <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">
              Espacios <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-300">Lightshow</span> & Audio
            </h1>
            <p className="mt-5 text-neutral-300 md:text-lg max-w-prose">
              Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales. Desde concepto y render previo hasta instalación, operación y soporte en sitio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contacto" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition-colors">Reserva una demo</a>
              <a href="#galeria" className="inline-flex items-center justify-center h-11 px-8 rounded-2xl border-2 border-white/50 text-white hover:bg-white/10 hover:border-white/70 transition-all duration-200 font-medium">Ver galería</a>
            </div>
          </div>
          <div className="relative aspect-video md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 ring-1 ring-white/10">
            <img src="/images/1T9B5057.jpg" alt="DDS Experiences" className="h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10"/>
            <div className="absolute bottom-4 left-4 right-4 text-sm text-neutral-200">
              Show lumínico con sincronización de audio y efectos DMX • Malmö / CPH
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">Servicios</h2>
        <p className="text-neutral-300 max-w-2xl mb-10">Pack flexibles según tu evento: diseño, render y pre‑visualización; alquiler de equipos; instalación y operador; programación de shows y soporte.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Diseño & Previsualización</h3>
            <p className="text-neutral-300">Concepto, moodboard, CAD y renders. Plan técnico (luz, audio, rigging) y rider.</p>
          </div>
          <div className="rounded-3xl bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Alquiler & Instalación</h3>
            <p className="text-neutral-300">Iluminación inteligente, LED, láser, humo, PA line array, microfonía, consolas.</p>
          </div>
          <div className="rounded-3xl bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Operación & Programación</h3>
            <p className="text-neutral-300">Operadores para show en vivo, timecode, DMX, d3/Resolume, ajuste de PA (Smaart).</p>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-4xl font-bold text-white">Galería</h2>
          <a href="#contacto" className="text-sm text-emerald-300 hover:underline">¿Quieres este look en tu evento?</a>
        </div>
        <p className="text-neutral-300 max-w-2xl mb-8">Mostrando nuestras últimas instalaciones de lightshow y audio en festivales, clubes y eventos premium. Cada proyecto demuestra nuestra experiencia creando experiencias inmersivas.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { src: "/images/1T9B5057.jpg", title: "Festival Setup" },
            { src: "/images/1T9B5319.jpg", title: "Club Installation" },
            { src: "/images/1T9B5371.jpg", title: "LED Mapping" },
            { src: "/images/1T9B5463.jpg", title: "Audio System" },
            { src: "/images/1T9B6015.jpg", title: "Light Show" },
            { src: "/images/1T9B6102.jpg", title: "Stage Design" },
            { src: "/images/1T9B6193.jpg", title: "DMX Control" },
            { src: "/images/1T9B6814.jpg", title: "Event Setup" },
            { src: "/images/1T9B7264.jpg", title: "Final Result" }
          ].map((item, i) => (
            <figure key={i} className="group relative overflow-hidden rounded-2xl border border-white/10">
              <img src={item.src} alt={item.title} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs text-neutral-200/90 bg-gradient-to-t from-black/60 via-black/10">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">Contacto</h2>
            <p className="mt-3 text-neutral-300">Cuéntanos fecha, ciudad, aforo estimado y tipo de evento. Respondemos en 24h.</p>
            <div className="mt-6 space-y-2 text-neutral-300 text-sm">
              <p className="flex items-center gap-2">📧 contact@wearedds.com</p>
              <p className="flex items-center gap-2">📱 +46 70 000 00 00</p>
              <a className="flex items-center gap-2 hover:underline" href="https://wa.me/46700000000" target="_blank" rel="noreferrer">💬 WhatsApp directo</a>
            </div>
          </div>
          <div className="rounded-3xl bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pide tu presupuesto</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required name="nombre" placeholder="Nombre" className="bg-white/10 border-white/20 px-3 py-2 rounded-lg text-white placeholder-neutral-400"/>
                <input required name="email" type="email" placeholder="Email" className="bg-white/10 border-white/20 px-3 py-2 rounded-lg text-white placeholder-neutral-400"/>
              </div>
              <input name="telefono" placeholder="Teléfono (opcional)" className="w-full bg-white/10 border-white/20 px-3 py-2 rounded-lg text-white placeholder-neutral-400"/>
              <input name="ciudad" placeholder="Ciudad / Venue" className="w-full bg-white/10 border-white/20 px-3 py-2 rounded-lg text-white placeholder-neutral-400"/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="fecha" type="date" className="bg-white/10 border-white/20 px-3 py-2 rounded-lg text-white"/>
                <input name="aforo" placeholder="Aforo estimado" className="bg-white/10 border-white/20 px-3 py-2 rounded-lg text-white placeholder-neutral-400"/>
              </div>
              <textarea required name="detalles" placeholder="Cuéntanos el tipo de show, estilo musical, necesidades (luz, audio, láser), timing, etc." className="w-full bg-white/10 border-white/20 px-3 py-2 rounded-lg text-white placeholder-neutral-400 min-h-[120px]"/>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition-colors">Enviar</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DDS Experiences. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Política de privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}