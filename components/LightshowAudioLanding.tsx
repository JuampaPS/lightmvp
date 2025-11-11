"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { LunDevSlider } from "@/components/LunDevSlider";
import { Facebook, Instagram, Linkedin } from "lucide-react";

// One-page landing for "Creación y diseño de espacios Lightshow & Audio"
// Tech: React + Tailwind + shadcn/ui. Drop into Next.js (app or pages) or Vite.
// Replace placeholders (LOGO, fotos, links) and deploy on Vercel.

export default function LightshowAudioLanding() {
  const { t, language, changeLanguage } = useTranslations();
  const servicesLabel = t?.nav?.services ?? "Servicios";
  const communityLabel = t?.nav?.community ?? "Comunidad";
  const hubLabel = t?.nav?.hub ?? "Hub";
  const contactLabel = t?.nav?.contact ?? "Contactos";
  const contactTitle = t?.contact?.title ?? "Contacto";
  const contactSubtitle =
    t?.contact?.subtitle ??
    "Cuéntanos fecha, ciudad, aforo estimado y tipo de evento. Respondemos en 24h.";

  const contactLocations = [
    { city: "Malmö", label: "HQ / Suecia" },
    { city: "Copenhague", label: "Dinamarca" },
    { city: "Lisboa", label: "Portugal" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Instagram, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <video
              src="/images/gallery/videologo.mp4"
              className="h-8 w-8 rounded-lg object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            <span className="font-semibold tracking-wide rotate-brand">Bunker Productions</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#servicios" className="nav-link neon-hover">{servicesLabel}</a>
            <a href="#servicios" className="nav-link neon-hover">{communityLabel}</a>
            <a href="#servicios" className="nav-link neon-hover">{hubLabel}</a>
            <a href="#contacto" className="nav-link neon-hover">{contactLabel}</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeLanguage('es')}
                className={`px-2 py-1 text-xs rounded language-toggle ${language === 'es' ? 'language-toggle-active' : ''}`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('sv')}
                className={`px-2 py-1 text-xs rounded language-toggle ${language === 'sv' ? 'language-toggle-active' : ''}`}
              >
                SV
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs rounded language-toggle ${language === 'en' ? 'language-toggle-active' : ''}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <LunDevSlider />

      <section id="servicios" className="relative min-h-screen overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/gallery/soonbunker.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/55" />
      </section>

      <section
        id="contacto"
        className="contact-neon-section border-t border-sky-500/20 text-sky-100"
      >
        <div className="contact-grid-lines" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.8fr,1fr]">
            <div className="flex flex-col justify-between gap-12">
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-[0.6em] text-sky-400">
                  Bunker Productions
                </span>
                <div className="space-y-4">
                  <h2 className="text-4xl font-semibold text-sky-100 md:text-5xl">
                    {contactTitle}
                  </h2>
                  <p className="max-w-xl text-sky-200/80">{contactSubtitle}</p>
                </div>
                <div className="flex flex-wrap gap-6 text-sky-300/80 text-sm">
                  <a href="mailto:contact@wearedds.com" className="neon-link">
                    contact@wearedds.com
                  </a>
                  <a href="tel:+46700000000" className="neon-link">
                    +46 70 000 00 00
                  </a>
                  <span className="neon-link">WhatsApp directo</span>
                </div>
              </div>

              <div className="relative h-44 md:h-56 lg:h-64">
                <span className="contact-outline-text">BUNKER LAB</span>
              </div>
            </div>

            <div className="relative">
              <div className="contact-card-shell">
                <div className="grid divide-y divide-sky-500/20">
                  {contactLocations.map((location) => (
                    <div
                      key={location.city}
                      className="contact-card flex items-center justify-between gap-4 px-6 py-6"
                    >
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
                          {location.label}
                        </p>
                        <p className="text-2xl font-semibold text-sky-100">
                          {location.city}
                        </p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.4em] text-sky-300/70">
                        Office
                      </span>
                    </div>
                  ))}
                  <div className="contact-card flex flex-col gap-4 px-6 py-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
                      Social
                    </p>
                    <div className="flex items-center gap-4">
                      {socialLinks.map(({ icon: Icon, href }) => (
                        <a
                          key={href}
                          href={href}
                          className="contact-social-icon"
                          aria-label="Social link"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                    <a href="#" className="text-xs uppercase tracking-[0.4em] text-sky-300/70">
                      PRIVACIDAD & POLÍTICA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Bunker Productions. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Política de privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}