"use client";

import { useTranslations } from "@/hooks/useTranslations";

export function VisionAboutUs() {
  const { t } = useTranslations();

  return (
    <section id="vision-about" className="relative min-h-screen overflow-hidden bg-black">
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
              {t.nav.visionAbout}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-magenta-500"></div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Vision Section */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Vision
              </h3>
              <p className="text-neutral-300 text-lg leading-relaxed">
                We believe in transforming spaces through immersive light and sound experiences. 
                Our vision is to push the boundaries of what's possible in event production, 
                creating unforgettable moments that resonate with audiences long after the lights dim.
              </p>
              <p className="text-neutral-400 text-base leading-relaxed">
                Every project is an opportunity to blend technical expertise with creative innovation, 
                delivering experiences that elevate events from ordinary to extraordinary.
              </p>
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t.about.title}
              </h3>
              <p className="text-neutral-300 text-lg leading-relaxed">
                {t.about.description}
              </p>
              
              {/* Features List */}
              <ul className="space-y-4 mt-8">
                {t.about.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">▸</span>
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image Section */}
          <div className="mt-16 md:mt-24">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <img
                src="/images/1T9B5371.jpg"
                alt="Bunker Productions"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-xl md:text-2xl font-bold">
                  BUNKER PRODUCTIONS
                </p>
                <p className="text-neutral-300 text-sm md:text-base mt-2">
                  Creating immersive experiences since day one
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



