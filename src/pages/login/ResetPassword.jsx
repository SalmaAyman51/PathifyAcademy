// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Lock, CheckCircle, Sparkles } from 'lucide-react';

// export default function ResetPassword() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (password.length < 8) {
//       setError('Password must be at least 8 characters');
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
    
//     setSuccess(true);
//     setTimeout(() => {
//       navigate('/login');
//     }, 2000);
//   };

//   if (success) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
//         <div className="w-full max-w-[450px] rounded-[30px] bg-white p-10 text-center shadow-2xl">
//           <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#dcfce7] text-[#166534]">
//             <CheckCircle size={40} />
//           </div>
//           <h1 className="text-2xl font-[900] text-[#1e293b]">Password Reset!</h1>
//           <p className="mt-4 text-[#64748b]">Your password has been updated successfully. Redirecting you to login...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
//       <div className="w-full max-w-[450px] rounded-[30px] border border-white/50 bg-white/80 p-10 shadow-2xl backdrop-blur-xl">
//         <div className="mb-8 text-center">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d6c8a] text-white">
//             <Sparkles size={30} />
//           </div>
//           <h1 className="text-2xl font-[900] tracking-tight text-[#1e293b]">New Password</h1>
//           <p className="mt-2 text-sm text-[#64748b]">Create a strong password to secure your account.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//           <div className="flex flex-col gap-1.5">
//             <label className="text-[12px] font-[800] tracking-wider text-[#475569] uppercase pl-1">New Password</label>
//             <div className="relative flex items-center">
//               <span className="absolute left-4 text-[#3d6c8a]">
//                 <Lock size={18} />
//               </span>
//               <input 
//                 type="password"
//                 value={password}
//                 onChange={(e) => { setPassword(e.target.value); setError(''); }}
//                 className={`w-full rounded-[16px] border-2 bg-white py-4 pr-4 pl-12 text-sm font-medium transition-all focus:outline-none ${error ? 'border-red-500' : 'border-[#e2e8f0] focus:border-[#3d6c8a]'}`}
//               />
//             </div>
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-[12px] font-[800] tracking-wider text-[#475569] uppercase pl-1">Confirm New Password</label>
//             <div className="relative flex items-center">
//               <span className="absolute left-4 text-[#3d6c8a]">
//                 <Lock size={18} />
//               </span>
//               <input 
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
//                 className={`w-full rounded-[16px] border-2 bg-white py-4 pr-4 pl-12 text-sm font-medium transition-all focus:outline-none ${error ? 'border-red-500' : 'border-[#e2e8f0] focus:border-[#3d6c8a]'}`}
//               />
//             </div>
//             {error && <span className="text-[11px] font-bold text-red-500 pl-1">{error}</span>}
//           </div>

//           <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3d6c8a] py-4 text-[15px] font-[800] text-white shadow-xl shadow-[#3d6c8a]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
//             Update Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle, Sparkles } from 'lucide-react';
import API from '../../api'; // ملف الـ axios الموحد الخاص بمشروعكم

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // إضافة حالة التحميل لتثبيت الزرار
  
  const navigate = useNavigate();
  const location = useLocation();

  // استقبال الـ Email والـ Code الممررين من صفحة الـ VerifyCode
  const email = location.state?.email || "";
  const code = location.state?.code || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. التحقق من المدخلات في الفرونت إند
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // 2. إرسال البيانات الـ 3 المطلوبة في الـ ResetPasswordDTO لسيرفر
      const response = await API.post('/Account/reset-password', {
        Email: email,
        Code: code,
        NewPassword: password
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }

    } catch (error) {
      console.error("Reset Password Error:", error);
      
      // 3. عرض رسالة الخطأ لو الكود منتهي أو الإيميل مش موجود
      const errorMessage = error.response?.data || "Failed to reset password. Please try again.";
      // لو السيرفر رجع مصفوفة أخطاء (Identity Errors)، بنعرض أول خطأ فيها
      if (Array.isArray(errorMessage)) {
        setError(errorMessage[0]?.description || "Password update failed.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
        <div className="w-full max-w-[450px] rounded-[30px] bg-white p-10 text-center shadow-2xl animate-fadeIn">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#dcfce7] text-[#166534]">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-[900] text-[#1e293b]">Password Reset!</h1>
          <p className="mt-4 text-[#64748b]">Your password has been updated successfully. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-[450px] rounded-[30px] border border-white/50 bg-white/80 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d6c8a] text-white">
            <Sparkles size={30} />
          </div>
          <h1 className="text-2xl font-[900] tracking-tight text-[#1e293b]">New Password</h1>
          <p className="mt-2 text-sm text-[#64748b]">Create a strong password to secure your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[800] tracking-wider text-[#475569] uppercase pl-1">New Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#3d6c8a]">
                <Lock size={18} />
              </span>
              <input 
                type="password"
                disabled={loading}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className={`w-full rounded-[16px] border-2 bg-white py-4 pr-4 pl-12 text-sm font-medium transition-all focus:outline-none ${error ? 'border-red-500' : 'border-[#e2e8f0] focus:border-[#3d6c8a]'}`}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[800] tracking-wider text-[#475569] uppercase pl-1">Confirm New Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#3d6c8a]">
                <Lock size={18} />
              </span>
              <input 
                type="password"
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
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
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}