export function Footer() {
  return (
    <footer className="w-full bg-[#173D32] text-[#EAE9DF] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/12">
          <div>
            <a
              href="#top"
              className="font-display text-xl font-extrabold tracking-tight text-white"
            >
              AROHA
            </a>
            <p className="mt-1.5 text-sm text-[#EAE9DF]/85">
              Better Care. Healthier Cattle. Stronger Rural Communities.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-sm">
            <a href="#challenges" className="hover:text-white transition-colors">
              The Problem
            </a>
            <a href="#approach" className="hover:text-white transition-colors">
              Our Approach
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              Mission
            </a>
            <a href="#partner" className="hover:text-white transition-colors">
              Partner
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#EAE9DF]/65">
          <p>© 2026 AROHA. Continuous cattle healthcare for rural India.</p>
          <p>Accessible · Preventive · Organized</p>
        </div>
      </div>
    </footer>
  );
}
