"use client";

import { useState, useEffect } from 'react';

type Language = 'es' | 'sv' | 'en';

interface Translations {
  nav: {
    services: string;
    gallery: string;
    about: string;
    community: string;
    hub: string;
    contact: string;
    budget: string;
    portfolio: string;
    production: string;
    communityHub: string;
    spaceDesign: string;
    visionAbout: string;
  };
  hero: {
    subtitle: string;
    title: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    demoButton: string;
    galleryButton: string;
    introTitle: string;
    introTopic: string;
    introDescription: string;
    features: {
      pixelMapping: string;
      paSystems: string;
      dmxDesign: string;
      timecode: string;
    };
    imageCaption: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
    technologies: string[];
  };
  gallery: {
    title: string;
    subtitle: string;
    description: string;
    items: string[];
  };
  vision: {
    title1: string;
    title2: string;
    text1: string;
    text2: string;
    imageTitle: string;
    imageSubtitle: string;
  };
  about: {
    title: string;
    description: string;
    features: string[];
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      name: string;
      email: string;
      phone: string;
      city: string;
      date: string;
      capacity: string;
      details: string;
      submit: string;
      success: string;
    };
    info: {
      email: string;
      phone: string;
      whatsapp: string;
    };
  };
  footer: {
    copyright: string;
    privacy: string;
    terms: string;
  };
}

// Default translations to avoid hydration issues
const defaultTranslations: Translations = {
  nav: {
    services: "Servicios",
    gallery: "Galería",
    about: "Nosotros",
    community: "Comunidad",
    hub: "Hub",
    contact: "Contacto",
    budget: "Pedir presupuesto",
    portfolio: "Portafolio",
    production: "Production",
    communityHub: "Community Hub",
    spaceDesign: "Our journey",
    visionAbout: "Vision/About Us"
  },
  hero: {
    subtitle: "Creación & Diseño",
    title: "DDS",
    titleHighlight: "Experiences",
    titleSuffix: "",
    description: "Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales. Desde concepto y render previo hasta instalación, operación y soporte en sitio.",
    demoButton: "Reserva una demo",
    galleryButton: "Ver galería",
    introTitle: "BUNKER PRODUCTIONS",
    introTopic: "Creación & Diseño",
    introDescription: "Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales. Desde concepto y render previo hasta instalación, operación y soporte en sitio.",
    features: {
      pixelMapping: "Pixel mapping LED",
      paSystems: "Sistemas PA & tuning",
      dmxDesign: "Diseño lumínico DMX",
      timecode: "Timecode & shows"
    },
    imageCaption: "Show lumínico con sincronización de audio y efectos DMX • Malmö / CPH"
  },
  services: {
    title: "Servicios",
    subtitle: "Pack flexibles según tu evento: diseño, render y pre‑visualización; alquiler de equipos; instalación y operador; programación de shows y soporte.",
    items: [],
    technologies: []
  },
  gallery: {
    title: "Galería",
    subtitle: "¿Quieres este look en tu evento?",
    description: "",
    items: []
  },
  vision: {
    title1: "Se parte de nuestra Vision",
    title2: "y conoce mas sobre Nosotros",
    text1: "Creemos en transformar espacios a través de experiencias inmersivas de luz y sonido. Nuestra visión es empujar los límites de lo posible en la producción de eventos, creando momentos inolvidables que resuenen con las audiencias mucho después de que las luces se apaguen.",
    text2: "Cada proyecto es una oportunidad de combinar experiencia técnica con innovación creativa, entregando experiencias que elevan los eventos de lo ordinario a lo extraordinario.",
    imageTitle: "BUNKER PRODUCTIONS",
    imageSubtitle: "Creando experiencias inmersivas desde el primer día"
  },
  about: {
    title: "Nosotros",
    description: "",
    features: []
  },
  contact: {
    title: "Contacto",
    subtitle: "",
    form: {
      title: "",
      name: "",
      email: "",
      phone: "",
      city: "",
      date: "",
      capacity: "",
      details: "",
      submit: "",
      success: ""
    },
    info: {
      email: "",
      phone: "",
      whatsapp: ""
    }
  },
  footer: {
    copyright: "",
    privacy: "",
    terms: ""
  }
};

export function useTranslations() {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted flag to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load language from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isMounted) return;
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['es', 'sv', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Default to English if no saved language
      setLanguage('en');
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/messages/${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to Spanish if loading fails
        try {
          const fallbackResponse = await fetch('/messages/es.json');
          const fallbackData = await fallbackResponse.json();
          setTranslations(fallbackData);
        } catch (fallbackError) {
          // Use default translations if all fails
          setTranslations(defaultTranslations);
        }
      }
    };

    loadTranslations();
  }, [language, isMounted]);

  const changeLanguage = (newLanguage: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
    setLanguage(newLanguage);
  };

  return {
    t: translations,
    language,
    changeLanguage,
    isLoading: false,
    isMounted
  };
}

