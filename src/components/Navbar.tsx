import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onPartnerClick: () => void;
}

const NAV_LINKS = [
  { label: 'The Problem', href: '#challenges' },
  { label: 'Our Approach', href: '#approach' },
  { label: 'Mission', href: '#workflow' },
  { label: 'Partner', href: '#partner' },
];

export function Navbar({ onPartnerClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileNav = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F7F0]/95 backdrop-blur-md border-b border-[#202722]/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3.5 lg:px-10">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-extrabold tracking-tight text-[#173D32] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E7055]"
        >
          AROHA
        </a>

        {/* Zone 2: 4 Clean Single-Line Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#202722]/80 hover:text-[#173D32] underline-offset-4 hover:underline transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E7055]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onPartnerClick}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#173D32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2E7055] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173D32]"
          >
            Partner With AROHA
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center w-11 h-11 rounded-lg border border-[#202722]/15 text-[#202722] hover:bg-[#EAE9DF] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#202722]/10 bg-[#F7F7F0] px-6 py-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleMobileNav(link.href)}
                className="flex items-center w-full text-left py-3 text-base font-medium text-[#202722] hover:text-[#2E7055] border-b border-[#202722]/8 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onPartnerClick();
              }}
              className="mt-3 w-full rounded-lg bg-[#173D32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2E7055] transition-colors cursor-pointer"
            >
              Partner With AROHA
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
