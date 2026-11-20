import { CHALLENGES, PROBLEM_VET_IMAGE } from '../data/arohaContent';
import { EditorialImage } from './EditorialImage';

export function ProblemSection() {
  return (
    <section
      id="challenges"
      className="w-full bg-[#F7F7F0] py-16 lg:py-24 border-b border-[#202722]/10"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Headline & Photograph */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-[#2E7055] mb-3">
                03 <span aria-hidden="true" className="mx-1.5">·</span> Why AROHA
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] tracking-tight text-[#202722]">
                Cattle Healthcare Shouldn&apos;t Begin Only When Something Goes Wrong.
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#202722]/10 bg-[#EAE9DF]">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <EditorialImage
                  src={PROBLEM_VET_IMAGE}
                  alt="Veterinarian conducting a stethoscope examination on a cow in a rural Indian courtyard alongside the farmer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Concise 2x2 Challenges */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CHALLENGES.map((challenge) => (
              <article
                key={challenge.number}
                className="rounded-xl border border-[#202722]/10 bg-white p-7 transition-colors duration-150 hover:border-[#2E7055]/40"
              >
                <span className="font-mono text-xs font-medium tracking-wider text-[#2E7055] tabular-nums">
                  {challenge.number}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-[#202722]">
                  {challenge.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#202722]/75">
                  {challenge.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
