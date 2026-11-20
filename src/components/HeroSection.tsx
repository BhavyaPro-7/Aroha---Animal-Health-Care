import { ArrowDown } from 'lucide-react';
import { HERO_IMAGE } from '../data/arohaContent';
import { EditorialImage } from './EditorialImage';

interface HeroSectionProps {
  onBookClick: () => void;
  onBookingsClick: () => void;
  upcomingCount: number;
}

export function HeroSection({
  onBookClick,
  onBookingsClick,
  upcomingCount,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative w-full bg-[#173D32] text-white overflow-hidden"
    >
      <div className="relative min-h-[460px] lg:min-h-[520px] w-full flex items-center">
        <EditorialImage
          src={HERO_IMAGE}
          alt="Indian rural dairy farmer standing calmly beside his indigenous cow in warm morning light"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Measured contrast scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#173D32]/94 via-[#173D32]/78 to-[#173D32]/30"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#EAE9DF]/90 mb-4">
              AROHA Farmer Portal <span aria-hidden="true" className="mx-2">·</span> Rural India
            </p>

            <h1 className="font-display text-[clamp(2.15rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-white mb-5">
              Book Continuous Cattle Care With AROHA.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-[#F7F7F0]/90 max-w-xl mb-8">
              Schedule veterinary visits, preventive checkups, and post-treatment follow-ups
              for your cattle—with every animal&apos;s care record kept in one place.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center gap-2.5 rounded-lg bg-[#F7F7F0] px-6 py-3.5 text-sm font-semibold text-[#173D32] hover:bg-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Book Veterinary Care</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onBookingsClick}
                className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-[#173D32]/45 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#173D32]/75 hover:border-white/70 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                My Bookings ({upcomingCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
