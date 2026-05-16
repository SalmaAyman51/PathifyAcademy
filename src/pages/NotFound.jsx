import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-center">
      <h1 className="mb-4 text-9xl font-black text-[#3d6c8a]/20">404</h1>
      <h2 className="mb-4 text-3xl font-bold text-[#1e293b]">Page Not Found</h2>
      <p className="mb-8 max-w-md text-[#64748b]">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 rounded-xl bg-[#3d6c8a] px-8 py-3 font-bold text-white shadow-lg shadow-[#3d6c8a]/20 transition-all hover:scale-105 active:scale-95"
      >
        <Home size={18} /> Back to Dashboard
      </Link>
    </div>
  );
}
