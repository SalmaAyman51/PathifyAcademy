import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api'; // ملف الـ axios الموحد

export default function Login() {
    const [ssn, setSsn] = useState('');
    const [password, setPassword] = useState('');
    const [ssnError, setSsnError] = useState('');
    const [passError, setPassError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setSsnError("");
        setPassError("");
        let isValid = true;

        if (ssn.trim().length !== 14) {
            setSsnError("SSN must be exactly 14 digits");
            isValid = false;
        }

        if (!password) {
            setPassError("Please enter your password");
            isValid = false;
        }

        if (isValid) {
            setLoading(true);
            try {
                // 1. إرسال الـ SSN والـ Password للسيرفر
                const response = await API.post('/Account/login', {
                    SSN: ssn.trim(),
                    Password: password
                });

                // سلمى بتبعت { token: "...", role: "..." }
                const { token, role } = response.data;

                // 2. تخزين التوكن في الـ LocalStorage (الـ Interceptor هيستخدمه بعد كدة)
                localStorage.setItem('userToken', token);

                // 3. تحديث الـ Context ببيانات المستخدم
                if (login) {
                    login(response.data);
                }

                // 4. التوجيه بناءً على الـ Role اللي جاي من سلمى بالظبط
                // بنستخدم toLowerCase() عشان نضمن إن المقارنة صح حتى لو الحروف كبيرة
                const userRole = role ? role.toLowerCase() : "";

                if (userRole === "admin") {
                    navigate('/admin/overview');
                } else {
                    navigate('/student/dashboard');
                }

            } catch (error) {
                console.error("Login Error:", error);
                // عرض رسالة الخطأ اللي جاية من سلمى (زي "Your account is waiting for approval")
                const errorMessage = error.response?.data || "Invalid login credentials";
                setPassError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8] p-5 font-sans">
            <div className="flex h-[650px] w-full max-w-[1100px] overflow-hidden rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] animate-fadeIn">
                
                {/* Left Side (Image) */}
                <div className="hidden flex-1 items-center justify-center bg-[#f0f4f8] p-10 md:flex">
                    {/* تأكدي إن مسار الصورة صح */}
                    <img src="../../images/2f4466b5-f0d1-4143-ab93-6f23e8a5aeb8.jpg" alt="Login illustration" className="max-w-full h-auto rounded-lg shadow-sm" />
                </div>

                {/* Right Side (Form) */}
                <div className="flex flex-1 flex-col justify-center bg-[#3d6c8a] p-[60px] text-center">
                    <h2 className="mb-2.5 text-[32px] font-bold text-white">Welcome Back</h2>
                    <p className="mb-[25px] text-lg text-slate-200">Please login with your National ID</p>

                    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-[15px]">
                        
                        {/* SSN Input */}
                        <div className="flex w-full flex-col items-center">
                            <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">National ID (SSN):</label>
                            <input 
                                type="text" 
                                placeholder="Enter 14-digit SSN" 
                                value={ssn}
                                maxLength={14}
                                className={`w-4/5 rounded-full border-2 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${ssnError ? "border-red-500" : "border-transparent"}`} 
                                onChange={(e) => setSsn(e.target.value.replace(/\D/g, ''))}
                            />
                            {ssnError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{ssnError}</span>}
                        </div>

                        {/* Password Input */}
                        <div className="flex w-full flex-col items-center">
                            <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">Password:</label>
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password}
                                className={`w-4/5 rounded-full border-2 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${passError ? "border-red-500" : "border-transparent"}`}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{passError}</span>}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-1/2 mt-4 rounded-full bg-white py-3 text-base font-bold text-[#3d6c8a] shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-70"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        
                        <Link to="/forgot-password" size="sm" className="mt-2.5 text-sm text-white/80 hover:text-white hover:underline">
                            Forgot Password?
                        </Link>

                        <div className="mt-5 text-sm text-white">
                            Don’t have an account? 
                            <Link to="/signup" className="ml-1 font-bold text-[#ffe600] hover:underline">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.8s ease-in-out; }
            `}</style>
        </div>
    );
}