import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { ApproachSection } from './components/ApproachSection';
import { BookingPrefill, BookingSystem } from './components/BookingSystem';
import { BookingsManager } from './components/BookingsManager';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProblemSection } from './components/ProblemSection';
import {
  BookingStatus,
  CattleProfile,
  FarmerBooking,
  formatDateLabel,
} from './data/arohaContent';
import {
  createCattleProfile,
  createFarmerBooking,
  ensureFarmerProfile,
  rescheduleFarmerBooking,
  subscribeFarmerBookings,
  subscribeFarmerCattle,
  updateFarmerBookingStatus,
} from './lib/farmerStore';
import { auth, googleProvider } from './lib/firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [firestoreError, setFirestoreError] = useState<Error | null>(null);

  const [cattleList, setCattleList] = useState<CattleProfile[]>([]);
  const [bookings, setBookings] = useState<FarmerBooking[]>([]);
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
      if (!nextUser) {
        setCattleList([]);
        setBookings([]);
        setLoadingData(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    let active = true;
    setLoadingData(true);

    void ensureFarmerProfile(user.uid, user.displayName || 'AROHA Farmer').catch((err) => {
      if (active) {
        setFirestoreError(err instanceof Error ? err : new Error(String(err)));
      }
    });

    const unsubCattle = subscribeFarmerCattle(
      user.uid,
      (items) => {
        if (!active) return;
        setCattleList(items);
      },
      (err) => {
        if (active) setFirestoreError(err);
      }
    );

    const unsubBookings = subscribeFarmerBookings(
      user.uid,
      (items) => {
        if (!active) return;
        setBookings(items);
        setLoadingData(false);
      },
      (err) => {
        if (active) {
          setLoadingData(false);
          setFirestoreError(err);
        }
      }
    );

    return () => {
      active = false;
      unsubCattle();
      unsubBookings();
    };
  }, [user]);

  if (firestoreError) {
    throw firestoreError;
  }

  const handleSignIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const scrollToSection = (id: string, focusSelector?: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (focusSelector) {
        window.setTimeout(() => {
          const input = document.querySelector<HTMLElement>(focusSelector);
          input?.focus({ preventScroll: true });
        }, 400);
      }
    }
  };

  const handleAddCattle = async (draft: Omit<CattleProfile, 'id'>): Promise<CattleProfile> => {
    if (!user) throw new Error('Sign in required to save animal profile.');
    return createCattleProfile(user.uid, user.displayName || 'AROHA Farmer', draft);
  };

  const handleCreateBooking = async (
    draft: Omit<FarmerBooking, 'id' | 'referenceCode' | 'status' | 'createdAt'>
  ): Promise<FarmerBooking> => {
    if (!user) throw new Error('Sign in required to create booking.');
    return createFarmerBooking(user.uid, user.displayName || 'AROHA Farmer', draft);
  };

  const handleRescheduleBooking = async (
    bookingId: string,
    dateISO: string,
    timeSlot: string
  ): Promise<void> => {
    if (!user) throw new Error('Sign in required to reschedule booking.');
    await rescheduleFarmerBooking(
      user.uid,
      bookingId,
      dateISO,
      formatDateLabel(dateISO),
      timeSlot
    );
  };

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
    if (!user) throw new Error('Sign in required to update booking status.');
    await updateFarmerBookingStatus(user.uid, bookingId, status);
  };

  const handleBookFollowUp = (booking: FarmerBooking) => {
    setPrefill({
      serviceId: booking.status === 'Completed' ? 'follow-up' : 'urgent-visit',
      cattleId: booking.cattleId,
      farmerName: booking.farmerName,
      phone: booking.phone,
      village: booking.village,
      district: booking.district,
      nonce: Date.now(),
    });
    scrollToSection('book');
  };

  const handleBookForAnimal = (cattleId: string) => {
    setPrefill({
      serviceId: 'preventive-checkup',
      cattleId,
      nonce: Date.now(),
    });
    scrollToSection('book');
  };

  const upcomingCount = bookings.filter((b) => b.status === 'Scheduled').length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#F7F7F0] text-[#202722]">
        <Navbar onBookClick={() => scrollToSection('book', '#farmer-name')} />

        <main className="flex-1">
          <HeroSection
            onBookClick={() => scrollToSection('book')}
            onBookingsClick={() => scrollToSection('bookings')}
            upcomingCount={upcomingCount}
          />
          <BookingSystem
            user={user}
            authLoading={authLoading}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            cattleList={cattleList}
            onAddCattle={handleAddCattle}
            onCreateBooking={handleCreateBooking}
            prefill={prefill}
            onViewBookings={() => scrollToSection('bookings')}
          />
          <BookingsManager
            user={user}
            loadingData={loadingData}
            onSignIn={handleSignIn}
            bookings={bookings}
            cattleList={cattleList}
            onRescheduleBooking={handleRescheduleBooking}
            onUpdateStatus={handleUpdateStatus}
            onBookFollowUp={handleBookFollowUp}
            onBookForAnimal={handleBookForAnimal}
          />
          <ProblemSection />
          <ApproachSection onBookClick={() => scrollToSection('book')} />
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
