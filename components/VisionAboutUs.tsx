"use client";

import { useTranslations } from "@/hooks/useTranslations";

// Text lines - based on About Us description
const visionLinesLG = [
  "We are a team based in Malmö/CPH",
  "specialized in transforming spaces",
  "through light and sound. We work on",
  "turnkey projects or in collaboration",
  "with agencies, venues, and production",
  "companies. Security, timing, and clear budget."
];

const visionLinesSM = [
  "We are a team",
  "based in Malmö/CPH",
  "specialized in transforming",
  "spaces through light and sound.",
  "We work on turnkey projects",
  "or in collaboration with",
  "agencies, venues, and",
  "production companies.",
  "Security, timing, and clear budget."
];

export function VisionAboutUs() {
  const { t } = useTranslations();
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const welcomeLines = isMobile ? visionLinesSM : visionLinesLG;

  return (
    <section id="vision-about" className="vision-section w-full h-[120vh] bg-black md:px-7 px-6 flex flex-col justify-end pb-20 md:pb-32">
      <div className='flex flex-col gap-2 tracking-[-4px] leading-2'>
        <div className="w-full md:w-[86%] md:text-[64px] text-[34px] welcome-line">
          <div className="w-full welcome-text flex flex-col justify-center items-start">
            {welcomeLines.map((text, index) => (
              <span 
                key={index} 
                className="block text-white md:tracking-[-0.010em] tracking-[0.015em]"
                style={{ fontFamily: 'var(--font-teko), "Teko", sans-serif' }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
