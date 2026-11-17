import { useState } from 'react';
import { APPROACH_HERD_IMAGE, APPROACH_STAGES } from '../data/arohaContent';
import { EditorialImage } from './EditorialImage';

export function ApproachSection() {
  const [activeId, setActiveId] = useState<string>(APPROACH_STAGES[0].id);
  const activeStage =
    APPROACH_STAGES.find((stage) => stage.id === activeId) ?? APPROACH_STAGES[0];

  return (
    <section
      id="approach"
      className="w-full bg-[#173D32] text-[#F7F7F0] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-[#EAE9DF]/80 mb-3">
            02 <span aria-hidden="true" className="mx-1.5">·</span> Our Approach
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] tracking-tight text-white">
            Continuous, Preventive, and Organized Care.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: Clean 4-Step Interactive Selector */}
          <div
            className="lg:col-span-5 flex flex-col justify-between gap-3"
            role="tablist"
            aria-label="AROHA care approach stages"
          >
            {APPROACH_STAGES.map((stage) => {
              const isActive = stage.id === activeStage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(stage.id)}
                  className={`w-full text-left rounded-xl px-6 py-5 border transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? 'bg-[#2E7055] border-white/25 text-white'
                      : 'bg-[#173D32] border-white/12 text-[#EAE9DF]/85 hover:bg-[#2E7055]/40 hover:border-white/25'
                  }`}
                >
                  <span className="font-mono text-xs text-[#EAE9DF]/70 tabular-nums">
                    {stage.number}
                  </span>
                  <div className="mt-1 font-display text-lg font-bold tracking-tight">
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Clean Photo + Active Stage Summary */}
          <div className="lg:col-span-7 flex flex-col rounded-xl border border-white/15 bg-[#202722]/35 overflow-hidden">
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10">
              <EditorialImage
                src={APPROACH_HERD_IMAGE}
                alt="Healthy indigenous dairy cows and buffaloes in a clean, well-ventilated rural Indian dairy shed"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-center">
              <h3 className="font-display text-2xl font-bold text-white leading-snug">
                {activeStage.headline}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[#EAE9DF]/85 max-w-xl">
                {activeStage.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
