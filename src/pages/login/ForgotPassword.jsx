
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import API from '../../api'; // استخدام ملف الـ axios الموحد الخاص بمشروعكم

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // تعديل اسم الحالة لـ loading لتطابق الـ Login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // تصفية الأخطاء قبل البدء

    // 1. التحقق من صحة الإيميل في الفرونت إند
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid institutional email');
      return;
    }

    setLoading(true);
    
    try {
      // 2. إرسال الطلب للسيرفر باستخدام الـ API الموحد والـ Route الصحيح
      // بما إن الـ Route في الـ Backend هو [HttpPost("forgot-password")]، فغالباً مساره هيكون كالتالي:
      const response = await API.post('/Account/forgot-password', {
        email: email.trim()
      });

      // 3. إذا نجح الطلب، بننقل المستخدم لصفحة التأكيد ونمرر الإيميل في الـ state
      if (response.status === 200) {
        navigate('/verify-code', { state: { email: email.trim() } });
      }

    } catch (error) {
      console.error("Forgot Password Error:", error);
      
      // 4. عرض رسالة الخطأ اللي جاية من السيرفر (زي "Email not found")
      const errorMessage = error.response?.data || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
          
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[800] tracking-wider text-[#475569] uppercase pl-1">Your Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#3d6c8a]">
                <Mail size={18} />
              </span>
              <input 
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="student@gmail.com"
                className={`w-full rounded-[16px] border-2 bg-white py-4 pr-4 pl-12 text-sm font-medium transition-all focus:outline-none ${error ? 'border-red-500' : 'border-[#e2e8f0] focus:border-[#3d6c8a]'}`}
              />
            </div>
            {error && <span className="text-[11px] font-bold text-red-500 pl-1">{error}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3d6c8a] py-4 text-[15px] font-[800] text-white shadow-xl shadow-[#3d6c8a]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? "Sending..." : "Send Code"} <ArrowRight size={18} />
          </button>

        </form>
      </div>
    </div>
  );
}