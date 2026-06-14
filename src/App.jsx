import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { DataProvider } from './context/DataContext';
import { BookingProvider } from './context/BookingContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const BookingType = lazy(() => import('./pages/booking/BookingType'));
const GroupType = lazy(() => import('./pages/booking/GroupType'));
const Circuit = lazy(() => import('./pages/booking/Circuit'));
const Spots = lazy(() => import('./pages/booking/Spots'));
const Stay = lazy(() => import('./pages/booking/Stay'));
const Vehicle = lazy(() => import('./pages/booking/Vehicle'));
const Homestay = lazy(() => import('./pages/booking/Homestay'));
const Pickup = lazy(() => import('./pages/booking/Pickup'));
const Time = lazy(() => import('./pages/booking/Time'));
const ConfirmNormal = lazy(() => import('./pages/booking/ConfirmNormal'));
const ConfirmPremium = lazy(() => import('./pages/booking/ConfirmPremium'));
const Confirmed = lazy(() => import('./pages/booking/Confirmed'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LoadingFallback() {
  return (
    <div className="booking-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="retro-spinner" style={{ margin: '0 auto 12px', width: 32, height: 32 }} />
        <div style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>Loading...</div>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith('/booking');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isBookingPage && <Navbar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      {!isBookingPage && <Footer />}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookingType />} />
        <Route path="/booking/group" element={<GroupType />} />
        <Route path="/booking/circuit" element={<Circuit />} />
        <Route path="/booking/spots" element={<Spots />} />
        <Route path="/booking/stay" element={<Stay />} />
        <Route path="/booking/vehicle" element={<Vehicle />} />
        <Route path="/booking/homestay" element={<Homestay />} />
        <Route path="/booking/pickup" element={<Pickup />} />
        <Route path="/booking/time" element={<Time />} />
        <Route path="/booking/confirm-normal" element={<ConfirmNormal />} />
        <Route path="/booking/confirm-premium" element={<ConfirmPremium />} />
        <Route path="/booking/confirmed" element={<Confirmed />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <HashRouter>
      <DataProvider>
        <BookingProvider>
          <ErrorBoundary>
            <ToastProvider>
              <ScrollToTop />
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </ToastProvider>
          </ErrorBoundary>
        </BookingProvider>
      </DataProvider>
    </HashRouter>
  );
}

export default App;
