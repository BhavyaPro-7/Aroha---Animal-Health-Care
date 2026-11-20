import { FormEvent, useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { Calendar, CheckCircle2, Clock, LogIn, LogOut, Plus, UserCheck } from 'lucide-react';
import {
  CARE_SERVICES,
  CareServiceId,
  CattleProfile,
  FarmerBooking,
  QUICK_SYMPTOM_NOTES,
  TIME_SLOTS,
  formatDateLabel,
  getUpcomingBookingDays,
} from '../data/arohaContent';

export interface BookingPrefill {
  serviceId?: CareServiceId;
  cattleId?: string;
  farmerName?: string;
  phone?: string;
  village?: string;
  district?: string;
  nonce: number;
}

interface BookingSystemProps {
  user: User | null;
  authLoading: boolean;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  cattleList: CattleProfile[];
  onAddCattle: (cattle: Omit<CattleProfile, 'id'>) => Promise<CattleProfile>;
  onCreateBooking: (
    booking: Omit<FarmerBooking, 'id' | 'referenceCode' | 'status' | 'createdAt'>
  ) => Promise<FarmerBooking>;
  prefill: BookingPrefill | null;
  onViewBookings: () => void;
}

export function BookingSystem({
  user,
  authLoading,
  onSignIn,
  onSignOut,
  cattleList,
  onAddCattle,
  onCreateBooking,
  prefill,
  onViewBookings,
}: BookingSystemProps) {
  const days = useMemo(() => getUpcomingBookingDays(7), []);

  const [serviceId, setServiceId] = useState<CareServiceId>('urgent-visit');
  const [selectedCattleId, setSelectedCattleId] = useState<string>('');
  const [dateISO, setDateISO] = useState<string>(days[0]?.iso ?? '');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [farmerName, setFarmerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Inline Add Animal state
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState<'Cow' | 'Buffalo'>('Cow');
  const [newBreed, setNewBreed] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newStage, setNewStage] = useState('Lactating');
  const [animalError, setAnimalError] = useState('');
  const [isSavingAnimal, setIsSavingAnimal] = useState(false);

  // Form submission & receipt state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<FarmerBooking | null>(null);

  useEffect(() => {
    if (user?.displayName && !farmerName) {
      setFarmerName(user.displayName);
    }
  }, [user, farmerName]);

  useEffect(() => {
    if (!prefill) return;
    setConfirmedBooking(null);
    if (prefill.serviceId) setServiceId(prefill.serviceId);
    if (prefill.cattleId) setSelectedCattleId(prefill.cattleId);
    if (prefill.farmerName) setFarmerName(prefill.farmerName);
    if (prefill.phone) setPhone(prefill.phone);
    if (prefill.village) setVillage(prefill.village);
    if (prefill.district) setDistrict(prefill.district);
  }, [prefill]);

  useEffect(() => {
    if (cattleList.length > 0 && !cattleList.some((c) => c.id === selectedCattleId)) {
      setSelectedCattleId(cattleList[0].id);
    } else if (cattleList.length === 0) {
      setSelectedCattleId('');
      if (user) {
        setShowAddAnimal(true);
      }
    }
  }, [cattleList, selectedCattleId, user]);

  const activeService =
    CARE_SERVICES.find((s) => s.id === serviceId) ?? CARE_SERVICES[0];
  const activeCattle =
    cattleList.find((c) => c.id === selectedCattleId) ?? cattleList[0];

  const handleServiceChange = (nextId: CareServiceId) => {
    setServiceId(nextId);
    const chosen = CARE_SERVICES.find((s) => s.id === nextId);
    if (chosen && !notes.trim() && chosen.defaultNote) {
      setNotes(chosen.defaultNote);
    }
  };

  const handleToggleQuickNote = (tag: string) => {
    setNotes((prev) => {
      const trimmed = prev.trim();
      if (trimmed.toLowerCase().includes(tag.toLowerCase())) return prev;
      return trimmed ? `${trimmed}; ${tag}` : tag;
    });
  };

  const handleSaveNewAnimal = async () => {
    if (!user) {
      setAnimalError('Please sign in with Google first to save your animal profile.');
      return;
    }
    if (!newName.trim() || !newBreed.trim()) {
      setAnimalError('Please enter both animal name and breed.');
      return;
    }
    setAnimalError('');
    setIsSavingAnimal(true);
    try {
      const created = await onAddCattle({
        name: newName.trim(),
        species: newSpecies,
        breed: newBreed.trim(),
        tagId: newTag.trim() || `IN-${Math.floor(100 + Math.random() * 899)}`,
        stage: newStage.trim() || 'Lactating',
      });
      setSelectedCattleId(created.id);
      setNewName('');
      setNewBreed('');
      setNewTag('');
      setShowAddAnimal(false);
    } catch (err) {
      setAnimalError(
        err instanceof Error ? err.message : 'Unable to save animal profile. Please try again.'
      );
    } finally {
      setIsSavingAnimal(false);
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!activeCattle) {
      nextErrors.cattle = 'Please register and select an animal for this booking.';
    }
    if (!farmerName.trim() || farmerName.trim().length < 2) {
      nextErrors.farmerName = 'Enter the farmer name (at least 2 characters).';
    }
    const cleanPhone = phone.replace(/[\s()-]/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!village.trim()) {
      nextErrors.village = 'Enter your village name.';
    }
    if (!district.trim()) {
      nextErrors.district = 'Enter your district or state.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    if (!user) {
      await onSignIn();
      return;
    }

    if (!validate() || !activeCattle) return;

    setIsSubmitting(true);
    try {
      const created = await onCreateBooking({
        serviceId: activeService.id,
        serviceTitle: activeService.title,
        cattleId: activeCattle.id,
        cattleLabel: `${activeCattle.name} (${activeCattle.breed} ${activeCattle.species})`,
        cattleTag: activeCattle.tagId,
        dateISO,
        dateLabel: formatDateLabel(dateISO),
        timeSlot,
        farmerName: farmerName.trim(),
        phone: phone.trim(),
        village: village.trim(),
        district: district.trim(),
        notes: notes.trim() || activeService.shortDesc,
      });

      setConfirmedBooking(created);
      setNotes('');
      setErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not save booking. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="book"
      className="w-full bg-[#F7F7F0] py-14 lg:py-20 border-b border-[#202722]/10"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#2E7055] mb-2">
              01 <span aria-hidden="true" className="mx-1.5">·</span> Farmer Booking Desk
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] tracking-tight text-[#202722]">
              Book a Veterinary Visit or Checkup.
            </h2>
          </div>

          {/* Farmer Account Status Bar */}
          <div className="flex items-center gap-3 rounded-lg border border-[#202722]/12 bg-white px-4 py-2.5">
            {authLoading ? (
              <span className="text-xs font-medium text-[#202722]/70">Checking account...</span>
            ) : user ? (
              <>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#173D32]">
                    {user.displayName || 'Signed in'}
                  </p>
                  <p className="text-[11px] text-[#202722]/65">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void onSignOut()}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#202722]/15 bg-[#F7F7F0] px-3 py-1.5 text-xs font-semibold text-[#202722] hover:bg-[#EAE9DF] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <span className="text-xs text-[#202722]/75">
                  Sign in to save bookings &amp; cattle
                </span>
                <button
                  type="button"
                  onClick={() => void onSignIn()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#173D32] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#2E7055] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign In with Google</span>
                </button>
              </>
            )}
          </div>
        </div>

        {confirmedBooking ? (
          <div className="rounded-xl border border-[#2E7055]/30 bg-white p-8 sm:p-10 max-w-3xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EAE9DF] text-[#173D32] mb-5">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <p className="font-mono text-xs font-medium text-[#2E7055] tabular-nums">
              Booking Reference · {confirmedBooking.referenceCode}
            </p>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#202722]">
              Appointment Saved to Your Account
            </h3>
            <p className="mt-2 text-base text-[#202722]/75">
              Your {confirmedBooking.serviceTitle.toLowerCase()} for{' '}
              <span className="font-semibold text-[#202722]">{confirmedBooking.cattleLabel}</span> is
              confirmed for{' '}
              <span className="font-semibold text-[#202722]">
                {confirmedBooking.dateLabel}, {confirmedBooking.timeSlot}
              </span>
              .
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg border border-[#202722]/10 bg-[#F7F7F0] p-5 text-sm">
              <div>
                <p className="text-xs text-[#202722]/60">Animal &amp; Tag</p>
                <p className="mt-0.5 font-medium text-[#202722]">{confirmedBooking.cattleLabel}</p>
                <p className="font-mono text-xs text-[#2E7055] tabular-nums">{confirmedBooking.cattleTag}</p>
              </div>
              <div>
                <p className="text-xs text-[#202722]/60">Farmer &amp; Phone</p>
                <p className="mt-0.5 font-medium text-[#202722]">{confirmedBooking.farmerName}</p>
                <p className="font-mono text-xs text-[#202722]/75 tabular-nums">{confirmedBooking.phone}</p>
              </div>
              <div>
                <p className="text-xs text-[#202722]/60">Location</p>
                <p className="mt-0.5 font-medium text-[#202722]">
                  {confirmedBooking.village}, {confirmedBooking.district}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onViewBookings}
                className="inline-flex items-center justify-center rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2E7055] transition-colors cursor-pointer whitespace-nowrap"
              >
                View My Bookings
              </button>
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="inline-flex items-center justify-center rounded-lg border border-[#202722]/20 bg-[#F7F7F0] px-6 py-3 text-sm font-semibold text-[#202722] hover:bg-[#EAE9DF] transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Another Visit
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => void handleSubmit(e)}
            noValidate
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            {/* Left 8 Cols: Interactive Step-by-Step Booking Controls */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Select Care Type */}
              <div className="rounded-xl border border-[#202722]/12 bg-white p-6 sm:p-7">
                <h3 className="font-display text-lg font-bold text-[#202722] mb-4">
                  1. What care does your cattle need?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CARE_SERVICES.map((service) => {
                    const selected = service.id === serviceId;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleServiceChange(service.id)}
                        className={`text-left rounded-lg border p-4 transition-colors duration-150 cursor-pointer ${
                          selected
                            ? 'bg-[#173D32] border-[#173D32] text-white'
                            : 'bg-[#F7F7F0]/60 border-[#202722]/12 text-[#202722] hover:border-[#2E7055]'
                        }`}
                      >
                        <div className="font-display text-base font-bold">{service.title}</div>
                        <p
                          className={`mt-1 text-xs leading-relaxed ${
                            selected ? 'text-[#EAE9DF]/90' : 'text-[#202722]/70'
                          }`}
                        >
                          {service.shortDesc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select or Add Animal */}
              <div className="rounded-xl border border-[#202722]/12 bg-white p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="font-display text-lg font-bold text-[#202722]">
                    2. Select Animal
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddAnimal((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#202722]/15 bg-[#F7F7F0] px-3.5 py-2 text-xs font-semibold text-[#173D32] hover:bg-[#EAE9DF] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{showAddAnimal ? 'Close Form' : 'Add Cow / Buffalo'}</span>
                  </button>
                </div>

                {showAddAnimal && (
                  <div className="mb-5 rounded-lg border border-[#2E7055]/30 bg-[#F7F7F0] p-4 space-y-3">
                    <p className="text-xs font-semibold text-[#173D32]">
                      Register Animal Profile
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Animal Name (e.g., Lakshmi)"
                        aria-label="Animal Name"
                        maxLength={60}
                        className="rounded-lg border border-[#202722]/20 bg-white px-3.5 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:outline-none"
                      />
                      <select
                        value={newSpecies}
                        onChange={(e) => setNewSpecies(e.target.value as 'Cow' | 'Buffalo')}
                        aria-label="Animal Species"
                        className="rounded-lg border border-[#202722]/20 bg-white px-3.5 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:outline-none"
                      >
                        <option value="Cow">Cow</option>
                        <option value="Buffalo">Buffalo</option>
                      </select>
                      <input
                        type="text"
                        value={newBreed}
                        onChange={(e) => setNewBreed(e.target.value)}
                        placeholder="Breed (e.g., Gir, Sahiwal, Murrah)"
                        aria-label="Animal Breed"
                        maxLength={60}
                        className="rounded-lg border border-[#202722]/20 bg-white px-3.5 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Ear Tag ID (e.g., IN-RJ-402)"
                        aria-label="Ear Tag ID"
                        maxLength={32}
                        className="rounded-lg border border-[#202722]/20 bg-white px-3.5 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <input
                        type="text"
                        value={newStage}
                        onChange={(e) => setNewStage(e.target.value)}
                        placeholder="Stage (e.g., Lactating, Dry, Calf)"
                        aria-label="Animal Stage"
                        maxLength={40}
                        className="flex-1 min-w-[180px] rounded-lg border border-[#202722]/20 bg-white px-3.5 py-2 text-sm text-[#202722] focus:border-[#2E7055] focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={isSavingAnimal}
                        onClick={() => void handleSaveNewAnimal()}
                        className="rounded-lg bg-[#2E7055] px-4 py-2 text-xs font-semibold text-white hover:bg-[#173D32] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {isSavingAnimal ? 'Saving...' : 'Save Animal'}
                      </button>
                    </div>
                    {animalError && (
                      <p className="text-xs font-medium text-red-700">{animalError}</p>
                    )}
                  </div>
                )}

                {!user ? (
                  <div className="rounded-lg border border-[#202722]/10 bg-[#F7F7F0] p-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-[#202722]/80">
                      Sign in with Google to load your registered cattle or add a new cow or buffalo.
                    </p>
                    <button
                      type="button"
                      onClick={() => void onSignIn()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#173D32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2E7055] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Sign In</span>
                    </button>
                  </div>
                ) : cattleList.length === 0 ? (
                  <p className="text-sm text-[#202722]/75">
                    No animals registered yet. Use the form above to add your first cow or buffalo.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cattleList.map((animal) => {
                      const selected = animal.id === selectedCattleId;
                      return (
                        <button
                          key={animal.id}
                          type="button"
                          onClick={() => setSelectedCattleId(animal.id)}
                          className={`text-left rounded-lg border p-4 transition-colors duration-150 cursor-pointer ${
                            selected
                              ? 'bg-[#EAE9DF] border-[#173D32] text-[#202722]'
                              : 'bg-[#F7F7F0]/60 border-[#202722]/12 text-[#202722] hover:border-[#2E7055]'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-display text-base font-bold text-[#202722]">
                              {animal.name}
                            </span>
                            <span className="font-mono text-xs font-medium text-[#2E7055] tabular-nums">
                              {animal.tagId}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#202722]/75">
                            {animal.breed} {animal.species} <span aria-hidden="true">·</span> {animal.stage}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {errors.cattle && (
                  <p className="mt-2 text-xs font-medium text-red-700">{errors.cattle}</p>
                )}
              </div>

              {/* Step 3: Choose Date & Visit Window */}
              <div className="rounded-xl border border-[#202722]/12 bg-white p-6 sm:p-7 space-y-5">
                <h3 className="font-display text-lg font-bold text-[#202722]">
                  3. Preferred Date &amp; Visit Window
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {days.map((d) => {
                    const active = d.iso === dateISO;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setDateISO(d.iso)}
                        className={`rounded-lg border py-2.5 px-2 text-center transition-colors duration-150 cursor-pointer ${
                          active
                            ? 'bg-[#173D32] border-[#173D32] text-white'
                            : 'bg-[#F7F7F0]/70 border-[#202722]/12 text-[#202722] hover:border-[#2E7055]'
                        }`}
                      >
                        <div
                          className={`text-[11px] font-medium ${
                            active ? 'text-[#EAE9DF]' : 'text-[#202722]/65'
                          }`}
                        >
                          {d.dayLabel}
                        </div>
                        <div className="mt-0.5 font-mono text-base font-bold tabular-nums">
                          {d.dateNum}
                        </div>
                        <div
                          className={`text-[11px] ${
                            active ? 'text-[#EAE9DF]/90' : 'text-[#202722]/65'
                          }`}
                        >
                          {d.monthLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const active = slot === timeSlot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`rounded-lg border px-4 py-3 text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer tabular-nums ${
                          active
                            ? 'bg-[#2E7055] border-[#2E7055] text-white'
                            : 'bg-[#F7F7F0]/70 border-[#202722]/12 text-[#202722] hover:border-[#2E7055]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Farmer Details & Care Notes */}
              <div className="rounded-xl border border-[#202722]/12 bg-white p-6 sm:p-7 space-y-4">
                <h3 className="font-display text-lg font-bold text-[#202722]">
                  4. Farmer &amp; Location Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="farmer-name"
                      className="block text-sm font-medium text-[#202722] mb-1.5"
                    >
                      Farmer Name
                    </label>
                    <input
                      id="farmer-name"
                      type="text"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      maxLength={100}
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:bg-white focus:outline-none"
                    />
                    {errors.farmerName && (
                      <p className="mt-1 text-xs font-medium text-red-700">{errors.farmerName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="farmer-phone"
                      className="block text-sm font-medium text-[#202722] mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="farmer-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={16}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm font-mono text-[#202722] focus:border-[#2E7055] focus:bg-white focus:outline-none"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs font-medium text-red-700">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="farmer-village"
                      className="block text-sm font-medium text-[#202722] mb-1.5"
                    >
                      Village
                    </label>
                    <input
                      id="farmer-village"
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      maxLength={80}
                      placeholder="Village name"
                      className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:bg-white focus:outline-none"
                    />
                    {errors.village && (
                      <p className="mt-1 text-xs font-medium text-red-700">{errors.village}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="farmer-district"
                      className="block text-sm font-medium text-[#202722] mb-1.5"
                    >
                      District &amp; State
                    </label>
                    <input
                      id="farmer-district"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      maxLength={80}
                      placeholder="e.g., Anand, Gujarat"
                      className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:bg-white focus:outline-none"
                    />
                    {errors.district && (
                      <p className="mt-1 text-xs font-medium text-red-700">{errors.district}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="block text-sm font-medium text-[#202722] mb-1.5"
                  >
                    Symptoms or Care Notes (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    {QUICK_SYMPTOM_NOTES.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleQuickNote(tag)}
                        className="rounded-md border border-[#202722]/15 bg-[#F7F7F0] px-3 py-1.5 text-xs font-medium text-[#202722]/85 hover:bg-[#EAE9DF] hover:border-[#2E7055]/40 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                  <textarea
                    id="booking-notes"
                    rows={2}
                    maxLength={500}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe symptoms, checkup request, or follow-up need."
                    className="w-full rounded-lg border border-[#202722]/20 bg-[#F7F7F0]/60 px-4 py-2.5 text-sm text-[#202722] focus:border-[#2E7055] focus:bg-white focus:outline-none resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Live Booking Summary & Submit */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 rounded-xl border border-[#202722]/12 bg-[#173D32] text-white p-6 sm:p-7">
              <p className="text-xs font-medium text-[#EAE9DF]/75">
                Booking Summary
              </p>
              <h3 className="mt-1.5 font-display text-2xl font-bold text-white">
                {activeService.title}
              </h3>

              <div className="mt-6 space-y-4 border-t border-white/15 pt-5 text-sm">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-4 h-4 mt-0.5 text-[#EAE9DF]/80 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#EAE9DF]/65">Animal</p>
                    <p className="font-medium text-white">
                      {activeCattle
                        ? `${activeCattle.name} (${activeCattle.breed} ${activeCattle.species})`
                        : 'Select or register an animal'}
                    </p>
                    {activeCattle && (
                      <p className="font-mono text-xs text-[#EAE9DF]/75 tabular-nums">
                        Tag {activeCattle.tagId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 mt-0.5 text-[#EAE9DF]/80 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#EAE9DF]/65">Date</p>
                    <p className="font-medium text-white">{formatDateLabel(dateISO)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 text-[#EAE9DF]/80 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#EAE9DF]/65">Visit Window</p>
                    <p className="font-mono text-sm font-medium text-white tabular-nums">
                      {timeSlot}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/15">
                {submitError && (
                  <p className="mb-3 rounded-lg bg-red-950/60 border border-red-400/40 px-3 py-2 text-xs text-red-100">
                    {submitError}
                  </p>
                )}

                <p className="text-xs leading-relaxed text-[#EAE9DF]/80 mb-5">
                  Your booking saves directly to your AROHA account and keeps this animal&apos;s
                  care history organized.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full rounded-lg bg-[#F7F7F0] px-5 py-3.5 text-sm font-bold text-[#173D32] hover:bg-white disabled:opacity-60 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {!user
                    ? 'Sign In with Google to Book'
                    : isSubmitting
                      ? 'Saving Booking...'
                      : 'Confirm Booking'}
                </button>
              </div>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}
