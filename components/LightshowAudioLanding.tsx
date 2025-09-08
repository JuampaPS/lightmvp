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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
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
            <a href="#nosotros" className="hover:text-white">{t.nav.about}</a>
            <a href="#contacto" className="hover:text-white">{t.nav.contact}</a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Instagram className="h-4 w-4"/>IG</a>
          </nav>
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
                <Globe className="h-4 w-4" />
                {language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-20 bg-neutral-800 border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  onClick={() => changeLanguage('es')} 
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-700 first:rounded-t-lg ${language === 'es' ? 'bg-emerald-600' : ''}`}
                >
                  ES
                </button>
                <button 
                  onClick={() => changeLanguage('sv')} 
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-700 ${language === 'sv' ? 'bg-emerald-600' : ''}`}
                >
                  SV
                </button>
                <button 
                  onClick={() => changeLanguage('en')} 
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-700 last:rounded-b-lg ${language === 'en' ? 'bg-emerald-600' : ''}`}
                >
                  EN
                </button>
              </div>
            </div>
            <a href="#contacto"><Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white">{t.nav.budget}</Button></a>
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
            <p className="uppercase text-xs tracking-[0.2em] text-emerald-300/80">{t.hero.subtitle}</p>
            <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">
              {t.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-300">{t.hero.titleHighlight}</span> {t.hero.titleSuffix}
            </h1>
            <p className="mt-5 text-neutral-300 md:text-lg max-w-prose">
              {t.hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contacto"><Button size="lg" className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white">{t.hero.demoButton}</Button></a>
              <a href="#galeria" className="inline-flex items-center justify-center h-11 px-8 rounded-2xl border-2 border-white/50 text-white hover:bg-white/10 hover:border-white/70 transition-all duration-200 font-medium">{t.hero.galleryButton}</a>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-4 text-sm text-neutral-300">
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-400"/> {t.hero.features.pixelMapping}</li>
              <li className="flex items-center gap-2"><Music2 className="h-4 w-4 text-cyan-300"/> {t.hero.features.paSystems}</li>
              <li className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-emerald-400"/> {t.hero.features.dmxDesign}</li>
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-300"/> {t.hero.features.timecode}</li>
            </ul>
          </div>
          <div className="relative aspect-video md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 ring-1 ring-white/10">
            {/* Replace with real video or hero image */}
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop" alt="DDS Experiences" className="h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10"/>
            <div className="absolute bottom-4 left-4 right-4 text-sm text-neutral-200">{t.hero.imageCaption}</div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-4xl font-bold mb-6">{t.services.title}</h2>
        <p className="text-neutral-300 max-w-2xl mb-10">{t.services.subtitle}</p>

        <div className="grid md:grid-cols-3 gap-6">
          {t.services.items.map((s, i) => (
            <Card key={i} className="rounded-3xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-300">{s.description}</CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {t.services.technologies.map((tech, i) => (
            <Badge key={i}>{tech}</Badge>
          ))}
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-4xl font-bold">{t.gallery.title}</h2>
          <a href="#contacto" className="text-sm text-emerald-300 hover:underline">{t.gallery.subtitle}</a>
        </div>
        <p className="text-neutral-300 max-w-2xl mb-8">{t.gallery.description}</p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              src: "/images/1T9B5057.jpg",
              title: "Festival Lightshow Experience",
              description: "Outdoor festival with dynamic laser and LED effects"
            },
            {
              src: "/images/1T9B5319.jpg", 
              title: "Club Night Immersion",
              description: "Intimate club setting with atmospheric lighting"
            },
            {
              src: "/images/1T9B5371.jpg",
              title: "Dynamic Stage Lighting",
              description: "Advanced stage design with interactive light elements"
            },
            {
              src: "/images/1T9B5463.jpg",
              title: "Concert Stage Design", 
              description: "Large scale stage with geometric light structures"
            },
            {
              src: "/images/1T9B6015.jpg",
              title: "DJ Performance Setup",
              description: "Professional DJ booth with custom lighting rig"
            },
            {
              src: "/images/1T9B6102.jpg",
              title: "Immersive Light Show",
              description: "Multi-layered lighting with atmospheric effects"
            },
            {
              src: "/images/1T9B6193.jpg",
              title: "Premium Event Atmosphere",
              description: "Sophisticated lighting design for exclusive events"
            },
            {
              src: "/images/1T9B6814.jpg",
              title: "Urban Event Lighting",
              description: "City venue with advanced light installations"
            },
            {
              src: "/images/1T9B7264.jpg",
              title: "Premium Event Experience",
              description: "High-end event with sophisticated lighting design"
            }
          ].map((item, i) => (
            <figure key={i} className="group relative overflow-hidden rounded-2xl border border-white/10">
              <img src={item.src} alt={item.title} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs text-neutral-200/90 bg-gradient-to-t from-black/60 via-black/10">
                <div className="font-medium text-white mb-1">{item.title}</div>
                <div className="text-neutral-300/80">{item.description}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-4xl font-bold mb-6">{t.about.title}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <p className="text-neutral-300 leading-relaxed">
            {t.about.description}
          </p>
          <ul className="text-neutral-300 space-y-2 text-sm">
            {t.about.features.map((feature, i) => (
              <li key={i}>• {feature}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold">{t.contact.title}</h2>
            <p className="mt-3 text-neutral-300">{t.contact.subtitle}</p>
            <div className="mt-6 space-y-2 text-neutral-300 text-sm">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4"/> {t.contact.info.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {t.contact.info.phone}</p>
              <a className="flex items-center gap-2 hover:underline" href="https://wa.me/46700000000" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4"/> {t.contact.info.whatsapp}</a>
            </div>
          </div>

          <Card className="rounded-3xl bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">{t.contact.form.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Replace action with your Formspree/Resend/Server Action */}
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input required name="nombre" placeholder={t.contact.form.name} className="bg-white/10 border-white/20"/>
                  <Input required name="email" type="email" placeholder={t.contact.form.email} className="bg-white/10 border-white/20"/>
                </div>
                <Input name="telefono" placeholder={t.contact.form.phone} className="bg-white/10 border-white/20"/>
                <Input name="ciudad" placeholder={t.contact.form.city} className="bg-white/10 border-white/20"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input name="fecha" type="date" className="bg-white/10 border-white/20"/>
                  <Input name="aforo" placeholder={t.contact.form.capacity} className="bg-white/10 border-white/20"/>
                </div>
                <Textarea required name="detalles" placeholder={t.contact.form.details} className="bg-white/10 border-white/20 min-h-[120px]"/>
                <div className="flex items-center gap-3">
                  <Button type="submit" className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white">{t.contact.form.submit}</Button>
                  {sent && <span className="text-sm text-emerald-300">{t.contact.form.success}</span>}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DDS Experiences. {t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white">{t.footer.terms}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple badge component styled with Tailwind only
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white">
      {children}
    </span>
  );
}
