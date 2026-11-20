import { useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { Calendar, CheckCircle2, Clock, LogIn, RotateCcw, XCircle } from 'lucide-react';
import {
  BookingStatus,
  CattleProfile,
  FarmerBooking,
  TIME_SLOTS,
  formatDateLabel,
  getUpcomingBookingDays,
} from '../data/arohaContent';

interface BookingsManagerProps {
  user: User | null;
  loadingData: boolean;
  onSignIn: () => Promise<void>;
  bookings: FarmerBooking[];
  cattleList: CattleProfile[];
  onRescheduleBooking: (bookingId: string, dateISO: string, timeSlot: string) => Promise<void>;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  onBookFollowUp: (booking: FarmerBooking) => void;
  onBookForAnimal: (cattleId: string) => void;
}

type StatusFilter = 'All' | BookingStatus;

export function BookingsManager({
  user,
  loadingData,
  onSignIn,
  bookings,
  cattleList,
  onRescheduleBooking,
  onUpdateStatus,
  onBookFollowUp,
  onBookForAnimal,
}: BookingsManagerProps) {
  const [filter, setFilter] = useState<StatusFilter>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const days = useMemo(() => getUpcomingBookingDays(7), []);
  const [editDate, setEditDate] = useState<string>(days[0]?.iso ?? '');
  const [editSlot, setEditSlot] = useState<string>(TIME_SLOTS[0]);

  const counts = useMemo(() => {
    return {
      All: bookings.length,
      Scheduled: bookings.filter((b) => b.status === 'Scheduled').length,
      Completed: bookings.filter((b) => b.status === 'Completed').length,
      Cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (filter === 'All') return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const openReschedule = (booking: FarmerBooking) => {
    setEditingId(booking.id);
    setEditDate(days.some((d) => d.iso === booking.dateISO) ? booking.dateISO : days[0].iso);
    setEditSlot(booking.timeSlot);
  };

  const saveReschedule = async (bookingId: string) => {
    setBusyId(bookingId);
    try {
      await onRescheduleBooking(bookingId, editDate, editSlot);
      setEditingId(null);
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    setBusyId(bookingId);
    try {
      await onUpdateStatus(bookingId, status);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section
      id="bookings"
      className="w-full bg-[#EAE9DF] py-14 lg:py-20 border-b border-[#202722]/10"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-medium text-[#2E7055] mb-2">
              02 <span aria-hidden="true" className="mx-1.5">·</span> Farmer Dashboard
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] tracking-tight text-[#202722]">
              My Bookings &amp; Cattle Records.
            </h2>
          </div>

          {user && (
            <div
              className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F7F7F0] border border-[#202722]/10"
              role="tablist"
              aria-label="Filter bookings by status"
            >
              {(['All', 'Scheduled', 'Completed', 'Cancelled'] as StatusFilter[]).map((tab) => {
                const active = filter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(tab)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      active
                        ? 'bg-[#173D32] text-white'
                        : 'text-[#202722]/75 hover:text-[#173D32]'
                    }`}
                  >
                    {tab} ({counts[tab]})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {!user ? (
          <div className="rounded-xl border border-[#202722]/12 bg-white p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-[#202722]">
                Sign In to Access Your Saved Bookings
              </h3>
              <p className="mt-1.5 text-sm text-[#202722]/75 max-w-xl">
                Your appointments and cattle health records are securely stored in Firebase and
                private to your account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void onSignIn()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#173D32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2E7055] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>Sign In with Google</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Bookings List */}
            <div className="lg:col-span-8 space-y-4">
              {loadingData ? (
                <div className="rounded-xl border border-[#202722]/12 bg-white p-10 text-center text-sm text-[#202722]/70">
                  Loading your bookings...
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="rounded-xl border border-[#202722]/12 bg-white p-10 text-center">
                  <p className="font-display text-lg font-bold text-[#202722]">
                    No {filter === 'All' ? '' : filter.toLowerCase() + ' '}bookings yet
                  </p>
                  <p className="mt-1.5 text-sm text-[#202722]/70">
                    Use the booking desk above to schedule a veterinary visit or checkup.
                  </p>
                </div>
              ) : (
                filteredBookings.map((booking) => {
                  const isEditing = editingId === booking.id;
                  const isBusy = busyId === booking.id;
                  return (
                    <article
                      key={booking.id}
                      className="rounded-xl border border-[#202722]/12 bg-white p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#202722]/8">
                        <div>
                          <p className="text-xs text-[#202722]/65 font-mono tabular-nums">
                            {booking.referenceCode} <span aria-hidden="true">·</span> {booking.cattleTag}
                          </p>
                          <h3 className="mt-1 font-display text-xl font-bold text-[#202722]">
                            {booking.serviceTitle} — {booking.cattleLabel}
                          </h3>
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173D32]">
                          {booking.status === 'Scheduled' && (
                            <Clock className="w-4 h-4 text-[#2E7055]" aria-hidden="true" />
                          )}
                          {booking.status === 'Completed' && (
                            <CheckCircle2 className="w-4 h-4 text-[#2E7055]" aria-hidden="true" />
                          )}
                          {booking.status === 'Cancelled' && (
                            <XCircle className="w-4 h-4 text-[#202722]/55" aria-hidden="true" />
                          )}
                          <span
                            className={
                              booking.status === 'Cancelled' ? 'text-[#202722]/60' : 'text-[#173D32]'
                            }
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-[#202722]/60">Date &amp; Window</p>
                          <p className="mt-0.5 font-medium text-[#202722] tabular-nums">
                            {booking.dateLabel} · {booking.timeSlot}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#202722]/60">Village</p>
                          <p className="mt-0.5 font-medium text-[#202722]">
                            {booking.village}, {booking.district}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#202722]/60">Notes</p>
                          <p className="mt-0.5 text-[#202722]/80">{booking.notes}</p>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-5 rounded-lg border border-[#2E7055]/30 bg-[#F7F7F0] p-4 space-y-3">
                          <p className="text-xs font-semibold text-[#173D32]">
                            Choose New Date &amp; Time Window
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <select
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              aria-label="New date"
                              className="rounded-lg border border-[#202722]/20 bg-white px-3 py-2 text-sm text-[#202722]"
                            >
                              {days.map((d) => (
                                <option key={d.iso} value={d.iso}>
                                  {d.dayLabel} ({formatDateLabel(d.iso)})
                                </option>
                              ))}
                            </select>
                            <select
                              value={editSlot}
                              onChange={(e) => setEditSlot(e.target.value)}
                              aria-label="New time window"
                              className="rounded-lg border border-[#202722]/20 bg-white px-3 py-2 text-sm text-[#202722]"
                            >
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void saveReschedule(booking.id)}
                              className="rounded-lg bg-[#173D32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2E7055] disabled:opacity-60 transition-colors cursor-pointer"
                            >
                              {isBusy ? 'Saving...' : 'Save New Slot'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border border-[#202722]/20 bg-white px-4 py-2 text-xs font-semibold text-[#202722] hover:bg-[#EAE9DF] transition-colors cursor-pointer"
                            >
                              Keep Current
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-5 pt-4 border-t border-[#202722]/8 flex flex-wrap items-center gap-2.5">
                        {booking.status === 'Scheduled' && (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => openReschedule(booking)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#202722]/15 bg-[#F7F7F0] px-3.5 py-2 text-xs font-semibold text-[#202722] hover:bg-[#EAE9DF] transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Reschedule</span>
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleStatusChange(booking.id, 'Completed')}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E7055] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#173D32] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Mark Completed</span>
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleStatusChange(booking.id, 'Cancelled')}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#202722]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#202722]/75 hover:text-red-700 hover:border-red-300 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <span>Cancel</span>
                            </button>
                          </>
                        )}

                        {booking.status === 'Completed' && (
                          <button
                            type="button"
                            onClick={() => onBookFollowUp(booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#173D32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2E7055] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Book Follow-up</span>
                          </button>
                        )}

                        {booking.status === 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => onBookFollowUp(booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#202722]/15 bg-[#F7F7F0] px-3.5 py-2 text-xs font-semibold text-[#202722] hover:bg-[#EAE9DF] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <span>Rebook Visit</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Right 4 Cols: Registered Cattle Herd */}
            <aside className="lg:col-span-4 rounded-xl border border-[#202722]/12 bg-white p-6">
              <h3 className="font-display text-lg font-bold text-[#202722]">
                Registered Cattle ({cattleList.length})
              </h3>
              <p className="mt-1 text-xs text-[#202722]/70">
                Individual health profiles linked to your bookings.
              </p>

              {cattleList.length === 0 ? (
                <p className="mt-4 text-sm text-[#202722]/70">
                  Register a cow or buffalo in the Booking Desk above to start tracking care visits.
                </p>
              ) : (
                <div className="mt-5 divide-y divide-[#202722]/10">
                  {cattleList.map((animal) => {
                    const animalBookings = bookings.filter((b) => b.cattleId === animal.id).length;
                    return (
                      <div key={animal.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-base font-bold text-[#202722]">
                            {animal.name}
                          </span>
                          <span className="font-mono text-xs text-[#2E7055] tabular-nums">
                            {animal.tagId}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#202722]/75">
                          {animal.breed} {animal.species} <span aria-hidden="true">·</span> {animal.stage}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-xs font-mono text-[#202722]/60 tabular-nums">
                            {animalBookings} {animalBookings === 1 ? 'visit logged' : 'visits logged'}
                          </span>
                          <button
                            type="button"
                            onClick={() => onBookForAnimal(animal.id)}
                            className="rounded-md border border-[#202722]/15 bg-[#F7F7F0] px-3 py-1.5 text-xs font-semibold text-[#173D32] hover:bg-[#EAE9DF] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Book Care
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
