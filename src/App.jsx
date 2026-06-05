import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DataProvider } from './context/DataContext';
import { BookingProvider } from './context/BookingContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AnimatedRoutes() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={window.location.hash || '/'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
