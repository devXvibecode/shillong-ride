import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-muted font-anton text-sm tracking-wider">Loading...</p>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith('/booking');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isBookingPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isBookingPage && <Footer />}
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
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
      </motion.div>
    </AnimatePresence>
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
                <AnimatedRoutes />
              </AppLayout>
            </ToastProvider>
          </ErrorBoundary>
        </BookingProvider>
      </DataProvider>
    </HashRouter>
  );
}

export default App;
