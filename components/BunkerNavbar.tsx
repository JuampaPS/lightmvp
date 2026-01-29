"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { gsap } from "gsap";

interface BunkerNavbarProps {
  scrollToSection?: (sectionId: string) => void;
}

export function BunkerNavbar({ scrollToSection }: BunkerNavbarProps) {
  const { t, language, changeLanguage } = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [footerInView, setFooterInView] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    if (scrollToSection) {
      scrollToSection(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
    setMenuOpen(false);
  };

  const handleLanguageChange = (lang: "es" | "sv" | "en") => {
    changeLanguage(lang);
    // No cerrar el menú al cambiar idioma
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Offset menu button when footer is visible (avoid covering Privacy/Terms on iOS)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const footer = document.getElementById("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setFooterInView(entry.isIntersecting);
        });
      },
      { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Animate modal entrance and exit (client-only; menu opens on interaction, after first paint)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!modalRef.current || !modalContentRef.current) return;

    const modalContent = modalContentRef.current;
    const menuItems = menuItemsRef.current.filter(Boolean) as HTMLAnchorElement[];
    const socialIcons = socialIconsRef.current.filter(Boolean) as HTMLAnchorElement[];
    const image = imageRef.current;

    // Get button position for origin (use ref; fallback to selector for menu button)
    const btn = menuButtonRef.current ?? document.querySelector<HTMLElement>('[data-bunker-menu-btn]');
    const buttonRect = btn?.getBoundingClientRect();
    const buttonCenterX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2;
    const buttonCenterY = buttonRect ? buttonRect.top + buttonRect.height / 2 : window.innerHeight - 40;

    if (menuOpen) {
      // ENTRANCE ANIMATION
      // Set initial state - modal starts from button position
      gsap.set(modalContent, {
        scale: 0,
        transformOrigin: `${buttonCenterX}px ${buttonCenterY}px`,
        opacity: 0
      });

      // Hide all child elements initially
      gsap.set([...menuItems, ...socialIcons], {
        opacity: 0,
        y: 20
      });

      if (image) {
        gsap.set(image, {
          opacity: 0,
          scale: 0.8
        });
      }

      // Create timeline
      const tl = gsap.timeline();

      // Animate modal container - expand from button
      tl.to(modalContent, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.2)"
      });

      // Animate menu items one by one
      tl.to(menuItems, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.3");

      // Animate social icons
      tl.to(socialIcons, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out"
      }, "-=0.2");

      // Animate image
      if (image) {
        tl.to(image, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.3");
      }

      return () => {
        tl.kill();
      };
    } else if (modalRef.current) {
      // EXIT ANIMATION (reverse order - smooth and coordinated)
      setIsAnimating(true);
      const reversedMenuItems = [...menuItems].reverse();
      const reversedSocialIcons = [...socialIcons].reverse();
      
      const tl = gsap.timeline({
        onComplete: () => {
          // Reset styles after animation completes
          const allElements = [modalContent, ...menuItems, ...socialIcons];
          if (image) allElements.push(image);
          gsap.set(allElements.filter(Boolean), { clearProps: "all" });
          setIsAnimating(false);
        }
      });

      // Step 1: Animate image out first (reverse of entrance)
      if (image) {
        tl.to(image, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power2.out"
        }, 0);
      }

      // Step 2: Animate social icons out (reverse order - reverse of entrance)
      tl.to(reversedSocialIcons, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out"
      }, 0.1);

      // Step 3: Animate menu items out (reverse order - reverse of entrance)
      tl.to(reversedMenuItems, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out"
      }, 0.2);

      // Step 4: Animate modal container - shrink to button (reverse of entrance)
      tl.to(modalContent, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "back.in(1.2)",
        transformOrigin: `${buttonCenterX}px ${buttonCenterY}px`
      }, 0.3);

      return () => {
        tl.kill();
      };
    }
  }, [menuOpen]);

  // Menu items
  const menuItems = [
    { id: 'home', label: t.nav.production },
    { id: 'servicios', label: t.nav.communityHub },
    { id: 'space-design', label: t.nav.spaceDesign },
    { id: 'vision-about', label: t.nav.visionAbout },
    { id: 'gallery', label: t.nav.gallery },
    { id: 'contacto', label: t.nav.contact },
  ];

  const menuButtonBottom = footerInView
    ? 'calc(2rem + 80px + env(safe-area-inset-bottom, 0px))'
    : 'calc(2rem + env(safe-area-inset-bottom, 0px))';

  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        data-bunker-menu-btn
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed left-1/2 -translate-x-1/2 w-fit min-w-[44px] min-h-[44px] p-1 pr-1 flex items-center justify-end gap-2 bg-black rounded-full z-50 cursor-pointer group transition-all duration-500 hover:shadow-lg bunker-menu-button"
        style={{ bottom: menuButtonBottom }}
      >
        <span className="text-[12px] pl-4 hover:font-bold transition-all duration-300 text-white">Menu</span>
        <span className="bg-black rounded-full p-2 transition-transform duration-500 group-hover:rotate-[360deg] block">
          <img
            src="/images/gallery/videos-hero/newcleanlogo.png"
            alt=""
            className="h-6 w-6 rounded-lg object-cover"
          />
        </span>
      </button>

      {/* Fullscreen Menu Modal */}
      {(menuOpen || isAnimating) && (
        <div ref={modalRef} className="fixed inset-0 z-[9999] bg-white/50 backdrop-blur-sm">
          <div 
            ref={modalContentRef}
            className="flex flex-col md:flex-row rounded-[32px] overflow-y-auto md:overflow-hidden shadow-2xl bunker-menu-modal bg-white" 
          >
            {/* Left Section - full width on mobile, 2/3 on desktop */}
            <div className="w-full md:w-2/3 bg-white relative flex flex-col md:justify-between">
            {/* Navigation Menu - Top Left */}
            <nav className="relative md:absolute top-0 md:top-16 left-0 md:left-16 p-8 md:p-0 flex flex-col gap-4 md:gap-6">
              {menuItems.map((item, index) => (
                <a
                  key={item.id}
                  ref={(el) => {
                    if (el) menuItemsRef.current[index] = el;
                  }}
                  href={`#${item.id}`}
                  className="text-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold transition-all duration-300 cursor-pointer hover:italic"
                  style={{ opacity: 0 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollToSection(item.id);
                  }}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Language Switcher - Below Contact */}
              <div className="flex items-center gap-3 mt-4 md:mt-6" role="group" aria-label="Language">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('es')}
                  aria-label="Switch to Spanish"
                  aria-pressed={language === 'es'}
                  className={`text-sm px-3 py-1 rounded transition-all duration-300 font-bold ${
                    language === 'es' 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('sv')}
                  aria-label="Switch to Swedish"
                  aria-pressed={language === 'sv'}
                  className={`text-sm px-3 py-1 rounded transition-all duration-300 font-bold ${
                    language === 'sv' 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  SV
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  aria-label="Switch to English"
                  aria-pressed={language === 'en'}
                  className={`text-sm px-3 py-1 rounded transition-all duration-300 font-bold ${
                    language === 'en' 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  EN
                </button>
              </div>
            </nav>

            {/* Social Icons - Below Languages on mobile, Bottom Left on desktop */}
            <div className="flex flex-row gap-4 p-8 md:p-0 md:absolute md:bottom-20 md:left-16">
              <a
                ref={(el) => {
                  if (el) socialIconsRef.current[0] = el;
                }}
                href="https://www.instagram.com/bunker.producti0ns"
                className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                style={{ opacity: 0 }}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                ref={(el) => {
                  if (el) socialIconsRef.current[1] = el;
                }}
                href="https://www.facebook.com/profile.php?id=100093145441157"
                className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                style={{ opacity: 0 }}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                ref={(el) => {
                  if (el) socialIconsRef.current[2] = el;
                }}
                href="https://www.tiktok.com/@bunker.producti0ns"
                className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                style={{ opacity: 0 }}
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="text-lg" />
              </a>
            </div>

            </div>

          {/* Right Section - full width below on mobile, 1/3 on desktop */}
          <div className="w-full md:w-1/3 relative bg-white overflow-hidden rounded-b-[32px] md:rounded-r-[32px] md:rounded-bl-none h-[40vh] md:h-auto">
            <img
              ref={imageRef}
              src="/images/1T9B5371.jpg"
              alt="Bunker Background"
              className="absolute object-cover w-full h-full md:w-[90%] md:h-[90%] md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%]"
              loading="lazy"
              decoding="async"
              style={{ 
                borderRadius: '32px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.8)',
                opacity: 0
              }}
            />
            
            {/* Large Text Overlay - Carousel */}
            <div className="absolute inset-0 flex items-center justify-center z-10 px-4 overflow-hidden">
              <div className="bunker-productions-carousel">
                <div className="bunker-productions-track">
                  <span className="bunker-productions-text">BUNKER PRODUCTIONS®</span>
                  <span className="bunker-productions-text">BUNKER PRODUCTIONS®</span>
                  <span className="bunker-productions-text">BUNKER PRODUCTIONS®</span>
                  <span className="bunker-productions-text">BUNKER PRODUCTIONS®</span>
                  <span className="bunker-productions-text">BUNKER PRODUCTIONS®</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Close Button - top-right, icon-only, overlay-level */}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 z-[10001]"
            aria-label="Close menu"
          >
            <span className="text-2xl leading-none" aria-hidden>×</span>
          </button>
        </div>
      )}
    </>
  );
}
