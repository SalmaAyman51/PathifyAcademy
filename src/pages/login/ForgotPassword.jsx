import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid institutional email');
      return;
    }
    // Simulate sending code
    navigate('/verify-code', { state: { email } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-[450px] rounded-[30px] border border-white/50 bg-white/80 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
            <Link to="/login" className="mb-6 flex items-center gap-2 text-sm font-bold text-[#64748b] hover:text-[#3d6c8a]">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d6c8a] text-white">
            <Sparkles size={30} />
          </div>
          <h1 className="text-2xl font-[900] tracking-tight text-[#1e293b]">Reset Password</h1>
          <p className="mt-2 text-sm text-[#64748b]">Enter your email and we'll send you a verification code.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[800] tracking-wider text-[#475569] uppercase pl-1">Institutional Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#3d6c8a]">
                <Mail size={18} />
              </span>
              <input 
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="student@uni.edu"
                className={`w-full rounded-[16px] border-2 bg-white py-4 pr-4 pl-12 text-sm font-medium transition-all focus:outline-none ${error ? 'border-red-500' : 'border-[#e2e8f0] focus:border-[#3d6c8a]'}`}
              />
            </div>
            {error && <span className="text-[11px] font-bold text-red-500 pl-1">{error}</span>}
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3d6c8a] py-4 text-[15px] font-[800] text-white shadow-xl shadow-[#3d6c8a]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Send Code <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
