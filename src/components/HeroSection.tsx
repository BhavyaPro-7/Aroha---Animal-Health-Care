import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/arohaContent';
import { EditorialImage } from './EditorialImage';

interface HeroSectionProps {
  onExploreClick: () => void;
  onPartnerClick: () => void;
}

export function HeroSection({ onExploreClick, onPartnerClick }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative w-full bg-[#173D32] text-white overflow-hidden"
    >
      {/* Full-width background editorial photograph */}
      <div className="relative min-h-[600px] lg:min-h-[700px] w-full flex items-center">
        <EditorialImage
          src={HERO_IMAGE}
          alt="Indian rural dairy farmer standing calmly beside his indigenous cow in warm morning light"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Measured contrast scrim ensuring > 4.5:1 text legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#173D32]/92 via-[#173D32]/72 to-[#173D32]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#173D32]/65 via-transparent to-transparent"
        />

        {/* Hero Editorial Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-[#EAE9DF]/90 mb-5">
              Continuous Cattle Healthcare <span aria-hidden="true" className="mx-2">·</span> Rural India
            </p>

            <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.85rem)] font-bold leading-[1.08] tracking-tight text-white mb-6">
              Healthcare That Goes Beyond the Emergency.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-[#F7F7F0]/90 max-w-xl mb-9">
              Bringing accessible veterinary care, preventive monitoring and continuous health
              management to cattle farmers across rural India.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 rounded-lg bg-[#F7F7F0] px-6 py-3.5 text-sm font-semibold text-[#173D32] hover:bg-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Explore Our Approach</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onPartnerClick}
                className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-[#173D32]/40 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#173D32]/70 hover:border-white/70 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Partner With AROHA
              </button>
            </div>
          </div>

          {/* Subtle floating information element */}
          <div className="mt-12 lg:mt-0 lg:absolute lg:bottom-8 lg:right-10 max-w-xs sm:max-w-sm rounded-xl bg-[#F7F7F0]/95 backdrop-blur-md text-[#202722] px-5 py-4 border border-[#202722]/10">
            <p className="text-xs font-medium text-[#2E7055] mb-1">
              AROHA Vision
            </p>
            <p className="text-sm font-medium leading-snug text-[#202722]">
              Building a more connected future for cattle healthcare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
