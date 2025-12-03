"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "@/hooks/useTranslations";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Componente para cada palabra con efecto de reveal
const Word = ({ word, index, totalWords, scrollYProgress }: { word: string; index: number; totalWords: number; scrollYProgress: any }) => {
  const start = index / totalWords;
  const end = start + (1 / totalWords);
  
  // Opacidad que va de 0.3 (gris) a 1 (blanco) para crear el efecto de revelado
  const opacity = useTransform(scrollYProgress, [start, end], [0.3, 1]);
  // Color que va de gris a blanco
  const color = useTransform(scrollYProgress, [start, end], ["#a3a3a3", "#ffffff"]);
  // Font weight que va de normal a bold
  const fontWeight = useTransform(scrollYProgress, [start, end], [400, 700]);
  
  return (
    <motion.span 
      style={{ 
        opacity,
        color,
        fontWeight,
        display: 'inline-block',
        marginRight: '0.5rem'
      }}
    >
      {word}
    </motion.span>
  );
};

// Componente para texto con efecto de scroll reveal continuo
const HighlightedText = ({ text, elementRef, scrollYProgress }: { text: string; elementRef: React.RefObject<HTMLParagraphElement>; scrollYProgress: any }) => {
  const words = text.split(" ");
  
  return (
    <p ref={elementRef} className="leading-relaxed">
      {words.map((word, i) => (
        <Word 
          key={i}
          word={word}
          index={i}
          totalWords={words.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
};

export function VisionAboutUs() {
  const { t, language } = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const visionText1Ref = useRef<HTMLParagraphElement>(null);
  const visionText2Ref = useRef<HTMLParagraphElement>(null);

  // Scroll progress para cada texto - el segundo comienza después del primero
  const { scrollYProgress: visionText1Progress } = useScroll({
    target: visionText1Ref,
    offset: ["start 0.9", "start 0.3"]
  });

  const { scrollYProgress: visionText2Progress } = useScroll({
    target: visionText2Ref,
    offset: ["start 0.7", "start 0.1"]
  });

  // Efecto Masked Text Reveal para el título
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scrollTrigger: ScrollTrigger | null = null;

    const setupAnimation = () => {
      if (!titleRef.current) return;

      const lineInners = titleRef.current.querySelectorAll(".line-inner") as NodeListOf<HTMLElement>;
      
      if (lineInners.length === 0) return;

      // Resetear posición inicial
      gsap.set(lineInners, { y: "100%" });

      // Crear timeline para la animación vinculada al scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 50%",
          end: "bottom 50%",
          scrub: true, // Vincula la animación directamente al scroll
        }
      });

      // Animar cada línea con stagger, vinculado al scroll
      lineInners.forEach((line, index) => {
        tl.to(line, {
          y: "0%",
          duration: 0.5,
          ease: "none"
        }, index * 0.1);
      });

      scrollTrigger = tl.scrollTrigger || null;

      ScrollTrigger.refresh();
    };

    // Esperar a que el DOM esté listo
    const timeoutId = setTimeout(setupAnimation, 500);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.trigger === titleRef.current) {
          trigger.kill();
        }
      });
    };
  }, [language]); // Reinicializar cuando cambie el idioma

  return (
    <section ref={sectionRef} id="vision-about" className="relative min-h-screen overflow-hidden bg-black">
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div ref={titleRef} className="mb-16 md:mb-24">
            <h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 uppercase leading-tight"
              style={{
                lineHeight: 1,
                letterSpacing: '-2px'
              }}
            >
              <div className="overflow-hidden" style={{ paddingBottom: '5px' }}>
                <div className="line-inner">{t.vision.title1}</div>
              </div>
            </h2>
            <h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 uppercase leading-tight"
              style={{
                lineHeight: 1,
                letterSpacing: '-2px'
              }}
            >
              <div className="overflow-hidden" style={{ paddingBottom: '5px' }}>
                <div className="line-inner">{t.vision.title2}</div>
              </div>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-magenta-500"></div>
          </div>

          {/* Content Section */}
          <div className="max-w-3xl">
            {/* Vision Section */}
            <div className="space-y-8">
              <div className="text-neutral-300 text-xl md:text-2xl lg:text-3xl">
                <HighlightedText
                  text={t.vision.text1}
                  elementRef={visionText1Ref}
                  scrollYProgress={visionText1Progress}
                />
              </div>
              <div className="text-neutral-400 text-lg md:text-xl lg:text-2xl">
                <HighlightedText
                  text={t.vision.text2}
                  elementRef={visionText2Ref}
                  scrollYProgress={visionText2Progress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



