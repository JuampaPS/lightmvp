"use client";

import { useState, useEffect } from 'react';

type Language = 'es' | 'sv' | 'en';

interface Translations {
  nav: {
    services: string;
    gallery: string;
    about: string;
    contact: string;
    budget: string;
  };
  hero: {
    subtitle: string;
    title: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    demoButton: string;
    galleryButton: string;
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

export function useTranslations() {
  const [language, setLanguage] = useState<Language>('es');
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/messages/${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to Spanish if loading fails
        const fallbackResponse = await fetch('/messages/es.json');
        const fallbackData = await fallbackResponse.json();
        setTranslations(fallbackData);
      }
    };

    loadTranslations();
  }, [language]);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['es', 'sv', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  return {
    t: translations,
    language,
    changeLanguage,
    isLoading: !translations
  };
}

