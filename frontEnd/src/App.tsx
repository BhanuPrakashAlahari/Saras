import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Saras</h1>
      </header>
      <main className="flex-1 w-full max-w-md flex flex-col items-center gap-4">
        <div className="p-6 bg-gray-50 rounded-2xl shadow-sm w-full border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>
          <p className="text-gray-600">Your mobile application is ready.</p>
        </div>
      </main>
    </div>
  );
}

export default App;