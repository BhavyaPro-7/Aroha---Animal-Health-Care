import { useState } from 'react';
import { COMMUNITY_FARMER_IMAGE, SAMPLE_RECORDS } from '../data/arohaContent';
import { EditorialImage } from './EditorialImage';

export function WorkflowSection() {
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_RECORDS[0].id);
  const record =
    SAMPLE_RECORDS.find((item) => item.id === selectedId) ?? SAMPLE_RECORDS[0];

  return (
    <section
      id="workflow"
      className="w-full bg-[#EAE9DF] py-16 lg:py-24 border-b border-[#202722]/10"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left: Mission + Minimal Animal Record Preview */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div>
              <p className="text-sm font-medium text-[#2E7055] mb-3">
                03 <span aria-hidden="true" className="mx-1.5">·</span> Mission &amp; Continuity
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] tracking-tight text-[#202722]">
                Better Care. Healthier Cattle. Stronger Rural Communities.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#202722]/80 max-w-xl">
                Make accessible, preventive and organized veterinary healthcare available to
                rural cattle farmers.
              </p>
            </div>

            {/* Minimal Pitch-Ready Care Record Snapshot */}
            <div className="rounded-xl border border-[#202722]/12 bg-white overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202722]/10 bg-[#F7F7F0] px-6 py-3.5">
                <span className="text-xs font-medium text-[#202722]/75">
                  Individual Animal Care Record
                </span>

                <div
                  className="flex items-center gap-1 p-1 rounded-lg bg-[#EAE9DF]"
                  role="tablist"
                  aria-label="Select sample cattle profile"
                >
                  {SAMPLE_RECORDS.map((sample) => {
                    const active = sample.id === record.id;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedId(sample.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#173D32] text-white'
                            : 'text-[#202722]/80 hover:text-[#173D32]'
                        }`}
                      >
                        {sample.breed}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 py-5 border-b border-[#202722]/10 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#202722]">
                    {record.breed}
                  </h3>
                  <p className="text-xs font-mono text-[#2E7055] tabular-nums mt-0.5">
                    ID {record.tagId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#202722]/60">Next Follow-up</p>
                  <p className="font-mono text-sm font-medium text-[#202722] tabular-nums">
                    {record.nextFollowUp}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#202722]/8">
                {record.steps.map((step) => (
                  <div
                    key={`${record.id}-${step.label}`}
                    className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4"
                  >
                    <span className="text-sm font-semibold text-[#173D32]">
                      {step.label}
                    </span>
                    <span className="text-sm text-[#202722]/75">{step.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Editorial Rural Dairy Farmer Portrait */}
          <div className="lg:col-span-5 overflow-hidden rounded-xl border border-[#202722]/12 bg-[#F7F7F0]">
            <div className="aspect-[3/4] h-full w-full overflow-hidden">
              <EditorialImage
                src={COMMUNITY_FARMER_IMAGE}
                alt="Indian woman dairy farmer tending calmly to her cow in a rural village farmyard"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
