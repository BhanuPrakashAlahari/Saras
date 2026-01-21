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

import { Navigate } from 'react-router-dom';
import { getCookie } from './utils/cookieUtils';

const AuthenticatedLayout = () => {
  const token = getCookie('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen">
      <Outlet />
      <BottomDock />
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

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