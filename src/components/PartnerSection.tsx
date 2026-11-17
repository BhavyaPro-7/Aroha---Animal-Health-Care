import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PartnerFormState {
  name: string;
  role: string;
  contact: string;
  message: string;
}

const INITIAL_FORM: PartnerFormState = {
  name: '',
  role: 'Dairy Cooperative / FPO',
  contact: '',
  message: '',
};

const PARTNER_ROLES = [
  'Dairy Cooperative / FPO',
  'Veterinary Professional',
  'Rural Development / NGO',
  'Institutional / Impact Partner',
];

export function PartnerSection() {
  const [form, setForm] = useState<PartnerFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerFormState, string>>>({});
  const [submittedData, setSubmittedData] = useState<PartnerFormState | null>(null);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof PartnerFormState, string>> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name.';
    }
    const contactTrimmed = form.contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactTrimmed);
    const isPhone = /^[+\d\s()-]{8,16}$/.test(contactTrimmed);
    if (!contactTrimmed || (!isEmail && !isPhone)) {
      nextErrors.contact = 'Enter a valid email or phone number.';
    }
    if (!form.message.trim() || form.message.trim().length < 8) {
      nextErrors.message = 'Please add a short note.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmittedData({ ...form });
    setErrors({});
  };

  const handleReset = () => {
    setSubmittedData(null);
    setForm(INITIAL_FORM);
    setErrors({});
  };

  return (
    <section
      id="partner"
      className="w-full bg-[#F7F7F0] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Concise Pitch CTA Context */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#2E7055] mb-3">
              04 <span aria-hidden="true" className="mx-1.5">·</span> Collaborate
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] tracking-tight text-[#202722]">
              Partner With AROHA.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#202722]/75 max-w-md">
              Working with veterinarians, dairy cooperatives, FPOs, and rural partners to
              make continuous cattle healthcare accessible across India.
            </p>
          </div>

          {/* Right: Clean Compact Form */}
          <div className="lg:col-span-7 rounded-xl border border-[#202722]/12 bg-white p-7 sm:p-9">
            {submittedData ? (
              <div className="py-4">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#EAE9DF] text-[#173D32] mb-4">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#202722]">
                  Inquiry Received
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#202722]/75">
                  Thank you, <span className="font-semibold text-[#202722]">{submittedData.name}</span>.
                  We have recorded your inquiry for{' '}
                  <span className="font-semibold text-[#202722]">{submittedData.role}</span>.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 inline-flex items-center justify-center rounded-lg border border-[#202722]/20 bg-[#F7F7F0] px-5 py-2.5 text-sm font-semibold text-[#202722] hover:bg-[#EAE9DF] transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="partner-name"
                      className="block text-sm font-medium text-[#202722] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="partner-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Dr. Ananya Deshmukh"
                      className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] placeholder:text-[#202722]/40 focus:border-[#2E7055] focus:bg-white focus:outline-none"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs font-medium text-red-700">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="partner-role"
                      className="block text-sm font-medium text-[#202722] mb-1.5"
                    >
                      Role / Organization
                    </label>
                    <select
                      id="partner-role"
                      name="role"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:bg-white focus:outline-none"
                    >
                      {PARTNER_ROLES.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="partner-contact"
                    className="block text-sm font-medium text-[#202722] mb-1.5"
                  >
                    Email or Phone
                  </label>
                  <input
                    id="partner-contact"
                    name="contact"
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="name@organization.org or +91 98..."
                    className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] placeholder:text-[#202722]/40 focus:border-[#2E7055] focus:bg-white focus:outline-none"
                  />
                  {errors.contact && (
                    <p className="mt-1 text-xs font-medium text-red-700">{errors.contact}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="partner-message"
                    className="block text-sm font-medium text-[#202722] mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="partner-message"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How would you like to collaborate with AROHA?"
                    className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] placeholder:text-[#202722]/40 focus:border-[#2E7055] focus:bg-white focus:outline-none resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs font-medium text-red-700">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2E7055] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173D32]"
                  >
                    Send Partnership Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
