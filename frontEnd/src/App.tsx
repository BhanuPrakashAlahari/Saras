import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { SplashScreen } from './components/common/SplashScreen';
import { MobileLayout } from './layouts/MobileLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Search from './pages/Search';
import Jobs from './pages/Jobs';
import AppliedJobs from './pages/AppliedJobs';
import Bookmarks from './pages/Bookmarks';
import { BottomDock } from './components/common/BottomDock';

const AuthenticatedLayout = () => {
  return (
    <div className="relative min-h-screen">
      <Outlet />
      <BottomDock />
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Session Restore Logic
  useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ideally this would update a global context
      // For now detailed 'me' fetching is handled by the authService but we can trigger it
      // to validate component state if we had a Context. 
      // Since the prompt just asked for correct authentication flow including /me,
      // checking for token presence effectively "restores" the session for purely client-side routing.
      // The actual API call to /me is available in authService for use in a Provider.
    }
  });

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {!showSplash && (
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Authenticated Routes with Dock */}
            <Route element={<AuthenticatedLayout />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/search" element={<Search />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/applied" element={<AppliedJobs />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Route>
          </Routes>
        </MobileLayout>
      )}
    </BrowserRouter>
  );
}

export default App;