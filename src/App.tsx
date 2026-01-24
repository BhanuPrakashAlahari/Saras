import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { SplashScreen } from './components/common/SplashScreen';
import { MobileLayout } from './layouts/MobileLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

import Jobs from './pages/Jobs';
import AppliedJobs from './pages/AppliedJobs';
import Bookmarks from './pages/Bookmarks';
import Matches from './pages/Matches';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import { BottomDock } from './components/common/BottomDock';
import { useAuthStore } from './store/useAuthStore';
import { authService } from './services/auth';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { UpgradeModal } from './components/common/UpgradeModal';
import { PrivacyPolicy, TermsAndConditions, RefundPolicy, ShippingPolicy, Contact } from './pages/Legal';

// Guard for routes that require the user to be fully onboarded
const ProtectedLayout = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.onboarding) return <Navigate to="/onboarding" replace />;

  return (
    <div className="relative min-h-screen pb-20">
      <Outlet />
      <BottomDock />
    </div>
  );
};

// Guard for the onboarding route (requires auth, but expects onboarding=true usually)
const OnboardingGuard = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // If onboarding is already false, redirect to main feed
  if (!user?.onboarding) return <Navigate to="/jobs" replace />;

  return <Outlet />;
};

const App = () => {
  // Force update
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, updateUser, logout, showUpgradeModal, setShowUpgradeModal } = useAuthStore();

  // Session Check on Mount to handle existing 'auth-storage'
  useEffect(() => {
    const verifySession = async () => {
      // Only verify if we think we are authenticated
      if (isAuthenticated) {
        try {
          const user = await authService.getMe();
          // Update store with fresh user data (onboarding status, connections, etc.)
          updateUser(user);
        } catch (error: any) {
          console.error("Session sync failed:", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.clear();
            logout();
          }
        }
      }
    };

    verifySession();
  }, [isAuthenticated, updateUser, logout]);

  // Clear tech feed cache on app mount (refresh/reopen)
  useEffect(() => {
    sessionStorage.removeItem('tech_feed_cache');
  }, []);

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {!showSplash && (
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<Login />} />

            {/* Legal / Compliance Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/contact" element={<Contact />} />

            {/* Onboarding Route */}
            <Route element={<OnboardingGuard />}>
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>

            {/* Main App Routes */}
            <Route element={<ProtectedLayout />}>
              {/* Make Jobs the default 'feed' for candidates as per prompt emphasis on discovery */}
              <Route path="/feed" element={<Feed />} />

              <Route path="/jobs" element={<Jobs />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/applied" element={<AppliedJobs />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </MobileLayout>
      )}

      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[99999]" style={{ pointerEvents: 'auto' }}>
            <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
          </div>
        )}
      </AnimatePresence>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#121212',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
            zIndex: 10000,
          }
        }}
      />
    </BrowserRouter>
  );
}

export default App;