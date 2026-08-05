
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../../api'; // متنسيش تتأكدي إن الـ URL جوه الملف ده مظبوط على بورت سلمى

// export default function SignUp() {
//     const navigate = useNavigate();
//     const [ssnError, setSsnError] = useState("");
//     const [passwordError, setPasswordError] = useState("");
//     const [confirmPasswordError, setConfirmPasswordError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const [formData, setFormData] = useState({
//         ssn: "",
//         password: "",
//         confirmPassword: "",
//         agree: false
//     });
//     const [selectedTab, setSelectedTab] = useState('student');
//     const [professorType, setProfessorType] = useState('internal');

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData({
//             ...formData,
//             [name]: type === "checkbox" ? checked : value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSsnError("");
//         setPasswordError("");
//         setConfirmPasswordError("");
//         let isValid = true;

//         // Validations
//         if (!/^\d{14}$/.test(formData.ssn)) {
//             setSsnError("SSN must be exactly 14 digits");
//             isValid = false;
//         }

//         if (formData.password.length < 8) {
//             setPasswordError("Password must be at least 8 characters");
//             isValid = false;
//         } else if (!/[A-Z]/.test(formData.password)) {
//             setPasswordError("Password must contain at least one uppercase letter");
//             isValid = false;
//         } else if (!/[0-9]/.test(formData.password)) {
//             setPasswordError("Password must contain at least one number");
//             isValid = false;
//         }

//         if (formData.password !== formData.confirmPassword) {
//             setConfirmPasswordError("Passwords do not match");
//             isValid = false;
//         }

//         if (!formData.agree) {
//             setPasswordError("Please agree to the terms");
//             isValid = false;
//         }

//         if (isValid) {
//             setLoading(true);
//             try {
//                 const role = selectedTab === 'student'
//                     ? 'Student'
//                     : (professorType === 'internal' ? 'InternalProfessor' : 'ExternalProfessor');

//                 const registerData = {
//                     SSN: formData.ssn,
//                     Password: formData.password,
//                     ConfirmPassword: formData.confirmPassword,
//                     Role: role
//                 };

//                 await API.post('/Account/register', registerData);

//                 alert(`Registered successfully as ${role}! Waiting for admin approval.`);
//                 navigate('/login');
//             } catch (err) {
//                 const errorData = err.response?.data;

//                 if (Array.isArray(errorData)) {
//                     const code = errorData[0]?.code;
//                     const description = errorData[0]?.description;

//                     if (code === "DuplicateUserName" || code === "DuplicateEmail") {
//                         setSsnError("This account is already registered.");
//                     } else if (code === "PasswordTooShort") {
//                         setPasswordError("Password is too short.");
//                     } else if (code === "PasswordRequiresNonAlphanumeric") {
//                         setPasswordError("Password must contain at least one special character.");
//                     } else if (code === "PasswordRequiresDigit") {
//                         setPasswordError("Password must contain at least one number.");
//                     } else if (code === "PasswordRequiresUpper") {
//                         setPasswordError("Password must contain at least one uppercase letter.");
//                     } else {
//                         setPasswordError(description || "Registration failed. Please try again.");
//                     }

//                 } else if (errorData?.message) {
//                     setPasswordError(errorData.message);

//                 } else if (typeof errorData === "string") {
//                     setPasswordError(errorData);

//                 } else if (errorData && typeof errorData === "object") {
//                     const firstKey = Object.keys(errorData)[0];
//                     const firstError = Array.isArray(errorData[firstKey])
//                         ? errorData[firstKey][0]
//                         : errorData[firstKey];
//                     setPasswordError(firstError || "Registration failed. Please check your data and try again.");

//                 } else {
//                     setPasswordError("Registration failed. Please check your data and try again.");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     return (
//         <div className="page-transition flex min-h-screen items-center justify-center bg-[#f0f4f8] p-5 font-sans">
//             <div className="flex h-[690px] w-full max-w-[1120px] overflow-hidden rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] animate-fadeIn">

//                 {/* LEFT IMAGE */}
//                 <div className="hidden md:flex md:w-[45%] items-center justify-center bg-[#f0f4f8] p-6">
//                     <img src="../../images/2f4466b5-f0d1-4143-ab93-6f23e8a5aeb8.jpg" alt="Signup" className="w-full h-full object-cover rounded-l-[20px] shadow-md" />
//                 </div>

//                 {/* RIGHT SIDE */}
//                 <div className="w-full md:w-[55%] bg-gradient-to-br from-[#3d6c8a] to-[#2b556f] p-7 text-white flex flex-col justify-center overflow-hidden">
//                     <h1 className="text-3xl font-bold">Hello!</h1>
//                     <p className="mt-1 mb-6 opacity-90">you can sign up here</p>

//                     {/* (Tabs moved below social buttons for cleaner flow) */}

//                     <div className="flex gap-3 mb-4">
//                         <button type="button" className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 rounded-full flex items-center justify-center gap-2 transition border border-white/10 overflow-hidden">
//                             <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" /> Continue with Google
//                         </button>
//                         <button type="button" className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 rounded-full flex items-center justify-center gap-2 transition border border-white/10 overflow-hidden">
//                             <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="FB" className="w-4 h-4" /> Continue with Facebook
//                         </button>
//                     </div>

//                     {/* Professional Tabs (placed after social login) */}
//                     <div className="mb-4">
//                         <div className="bg-white/6 p-1 rounded-xl inline-flex gap-1">
//                             <button type="button" onClick={() => setSelectedTab('student')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedTab === 'student' ? 'bg-white text-[#0b3b48] shadow-sm' : 'text-white/90 hover:bg-white/10'}`}>
//                                 Student
//                             </button>
//                             <button type="button" onClick={() => setSelectedTab('professor')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedTab === 'professor' ? 'bg-white text-[#0b3b48] shadow-sm' : 'text-white/90 hover:bg-white/10'}`}>
//                                 Professor
//                             </button>
//                         </div>

//                         {selectedTab === 'professor' && (
//                             <div className="mt-3 flex items-center gap-3">
//                                 <div className="text-sm text-white/90">Professor type</div>
//                                 <div className="flex items-center gap-2 bg-white/6 p-1 rounded-full">
//                                     <button type="button" onClick={() => setProfessorType('internal')} className={`px-3 py-1 rounded-full text-sm font-medium transition ${professorType === 'internal' ? 'bg-white text-[#0b3b48]' : 'text-white/80 hover:bg-white/8'}`}>
//                                         Internal
//                                     </button>
//                                     <button type="button" onClick={() => setProfessorType('external')} className={`px-3 py-1 rounded-full text-sm font-medium transition ${professorType === 'external' ? 'bg-white text-[#0b3b48]' : 'text-white/80 hover:bg-white/8'}`}>
//                                         External
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <hr className="border-white/20 mb-6" />

//                     <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-[15px]">
                        
//                         {/* SSN Input */}
//                         <div className="flex w-full flex-col items-center">
//                             <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">National ID (SSN):</label>
//                             <input 
//                                 type="text" 
//                                 name="ssn"
//                                 placeholder="Enter 14-digit SSN" 
//                                 value={formData.ssn}
//                                 maxLength={14}
//                                 className={`w-4/5 rounded-full border-2 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${ssnError ? "border-red-500" : "border-transparent"}`} 
//                                 onChange={(e) => {
//                                     const numericValue = e.target.value.replace(/\D/g, '');
//                                     setFormData({...formData, ssn: numericValue});
//                                 }}
//                             />
//                             {ssnError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{ssnError}</span>}
//                         </div>

//                         {/* Password Input */}
//                         <div className="flex w-full flex-col items-center">
//                             <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">Password:</label>
//                             <div className="relative w-4/5">
//                                 <input 
//                                     type={showPassword ? "text" : "password"} 
//                                     name="password"
//                                     placeholder="Enter your password" 
//                                     value={formData.password}
//                                     className={`w-full rounded-full border-2 bg-white px-4 py-2.5 pr-12 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${passwordError ? "border-red-500" : "border-transparent"}`}
//                                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                                 />
//                                 {formData.password && (
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
//                                         aria-label={showPassword ? "Hide password" : "Show password"}
//                                     >
//                                         {showPassword ? (
//                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
//                                                 <path d="M12 5c-7 0-11 5.5-11 7s4 7 11 7 11-5.5 11-7-4-7-11-7Zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5Z" />
//                                             </svg>
//                                         ) : (
//                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
//                                                 <path d="M12 5c-7 0-11 5.5-11 7 1.09 1.7 3.32 4.26 6.29 5.74L3.64 18.4 5 20l4.75-4.75C10.57 15.32 11.28 15.5 12 15.5c2.76 0 5-2.24 5-5 0-.72-.18-1.43-.5-2.03L19 7.19 17.55 5.75l-3.64 3.63C12.3 9.1 12.15 9 12 9c-1.93 0-3.5 1.57-3.5 3.5 0 .15.02.3.05.44L7.1 12.95C7.38 11.34 8.58 10 10.22 9.62L6.97 6.37 5.53 7.81 8.7 11c-.16.38-.25.79-.25 1.2 0 2.76 2.24 5 5 5 .41 0 .82-.09 1.2-.25l3.19 3.17L18.45 18.4 15.16 15.1C16.46 14.06 17.07 12.59 17.07 11c0-3.04-2.42-5.5-5.07-6.5L16.45 2.55 15 1.11 12 4.11l-2.35-2.35L8.5 1.11 12 4.61 15.5 1.1 14.05 2.55l-2.5 2.5C10.6 4.53 9.33 4 8 4 5.79 4 4 5.79 4 8c0 .93.29 1.8.8 2.53L2.1 13.23C1.4 12.07 1 10.55 1 8c0-2.49 2.5-6 11-6 8.5 0 11 3.51 11 6 0 2.55-.4 4.07-1.1 5.23l-2.69-2.7C18.71 10.8 19 9.93 19 9c0-2.21-1.79-4-4-4-1.33 0-2.6.53-3.55 1.39L12 5Zm0 4.5c1.93 0 3.5 1.57 3.5 3.5 0 .15-.02.3-.05.44L7.56 7.05C8.58 6.1 10.13 5.5 12 5.5Z" />
//                                             </svg>
//                                         )}
//                                     </button>
//                                 )}
//                             </div>
//                             {passwordError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{passwordError}</span>}
//                         </div>

//                         {/* Confirm Password Input */}
//                         <div className="flex w-full flex-col items-center">
//                             <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">Confirm Password:</label>
//                             <div className="relative w-4/5">
//                                 <input 
//                                     type={showConfirmPassword ? "text" : "password"} 
//                                     name="confirmPassword"
//                                     placeholder="Repeat your password" 
//                                     value={formData.confirmPassword}
//                                     className={`w-full rounded-full border-2 bg-white px-4 py-2.5 pr-12 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${confirmPasswordError ? "border-red-500" : "border-transparent"}`}
//                                     onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//                                 />
//                                 {formData.confirmPassword && (
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
//                                         aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
//                                     >
//                                         {showConfirmPassword ? (
//                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
//                                                 <path d="M12 5c-7 0-11 5.5-11 7s4 7 11 7 11-5.5 11-7-4-7-11-7Zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5Z" />
//                                             </svg>
//                                         ) : (
//                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
//                                                 <path d="M12 5c-7 0-11 5.5-11 7 1.09 1.7 3.32 4.26 6.29 5.74L3.64 18.4 5 20l4.75-4.75C10.57 15.32 11.28 15.5 12 15.5c2.76 0 5-2.24 5-5 0-.72-.18-1.43-.5-2.03L19 7.19 17.55 5.75l-3.64 3.63C12.3 9.1 12.15 9 12 9c-1.93 0-3.5 1.57-3.5 3.5 0 .15.02.3.05.44L7.1 12.95C7.38 11.34 8.58 10 10.22 9.62L6.97 6.37 5.53 7.81 8.7 11c-.16.38-.25.79-.25 1.2 0 2.76 2.24 5 5 5 .41 0 .82-.09 1.2-.25l3.19 3.17L18.45 18.4 15.16 15.1C16.46 14.06 17.07 12.59 17.07 11c0-3.04-2.42-5.5-5.07-6.5L16.45 2.55 15 1.11 12 4.11l-2.35-2.35L8.5 1.11 12 4.61 15.5 1.1 14.05 2.55l-2.5 2.5C10.6 4.53 9.33 4 8 4 5.79 4 4 5.79 4 8c0 .93.29 1.8.8 2.53L2.1 13.23C1.4 12.07 1 10.55 1 8c0-2.49 2.5-6 11-6 8.5 0 11 3.51 11 6 0 2.55-.4 4.07-1.1 5.23l-2.69-2.7C18.71 10.8 19 9.93 19 9c0-2.21-1.79-4-4-4-1.33 0-2.6.53-3.55 1.39L12 5Zm0 4.5c1.93 0 3.5 1.57 3.5 3.5 0 .15-.02.3-.05.44L7.56 7.05C8.58 6.1 10.13 5.5 12 5.5Z" />
//                                             </svg>
//                                         )}
//                                     </button>
//                                 )}
//                             </div>
//                             {confirmPasswordError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{confirmPasswordError}</span>}
//                         </div>

//                         {/* Checkbox & Button Container */}
//                         <div className="mt-2 flex flex-col gap-4 w-4/5">
//                             <label className="flex items-center gap-3 text-white cursor-pointer group">
//                                 <div className="relative flex items-center justify-center w-5 h-5">
//                                     <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} className="absolute opacity-0 w-full h-full cursor-pointer z-10" />
//                                     <div className={`w-full h-full border-2 border-white rounded-full transition-all duration-300 flex items-center justify-center ${formData.agree ? "bg-white" : "bg-transparent"}`}>
//                                         {formData.agree && (
//                                             <svg className="w-3.5 h-3.5 text-[#2f5d73] animate-in zoom-in duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                             </svg>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <span className="text-[13px] select-none">
//                                     I agree to the <span className="underline font-bold">Terms</span> and <span className="underline font-bold">Privacy</span>
//                                 </span>
//                             </label>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-1/2 mx-auto rounded-full bg-white py-3 text-base font-bold text-[#3d6c8a] shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-70"
//                             >
//                                 {loading ? "Signing Up..." : "Sign Up"}
//                             </button>
//                         </div>
//                     </form>

//                     <p className="text-center text-white/70 text-[14px] mt-6">
//                         Already have an account?
//                         <button onClick={() => navigate('/login')} className="ml-1 font-bold text-[#ffe600] hover:underline cursor-pointer">Sign In</button>
//                     </p>
//                 </div>
//             </div>

//             <style>{`
//                 .page-transition {
//                     animation: fadeInUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
//                 }
//                 @keyframes fadeIn {
//                     from { opacity: 0; transform: translateY(20px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .animate-fadeIn { animation: fadeIn 0.8s ease-in-out; }
//             `}</style>
//         </div>
//     );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // متنسيش تتأكدي إن الـ URL جوه الملف ده مظبوط على بورت سلمى

export default function SignUp() {
    const navigate = useNavigate();
    const [ssnError, setSsnError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        ssn: "",
        password: "",
        confirmPassword: "",
        agree: false
    });
    const [selectedTab, setSelectedTab] = useState('student');
    const [professorType, setProfessorType] = useState('internal'); // 'internal' | 'external'

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSsnError("");
        setPasswordError("");
        setConfirmPasswordError("");
        let isValid = true;

        // Validations
        if (!/^\d{14}$/.test(formData.ssn)) {
            setSsnError("SSN must be exactly 14 digits");
            isValid = false;
        }

        if (formData.password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            isValid = false;
        } else if (!/[A-Z]/.test(formData.password)) {
            setPasswordError("Password must contain at least one uppercase letter");
            isValid = false;
        } else if (!/[0-9]/.test(formData.password)) {
            setPasswordError("Password must contain at least one number");
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            isValid = false;
        }

        if (!formData.agree) {
            setPasswordError("Please agree to the terms");
            isValid = false;
        }

        if (!isValid) return;

        setLoading(true);

        try {
            if (selectedTab === 'student') {
                // ✅ تسجيل طالب - بيستخدم Account/register زي ما كان متظبط قبل كده
                const registerData = {
                    SSN: formData.ssn,
                    Password: formData.password,
                    ConfirmPassword: formData.confirmPassword,
                    Role: "Student"
                };

                await API.post('/Account/register', registerData);
                // alert("Registered successfully as Student! Waiting for admin approval.");
            } else {
                // ✅ تسجيل دكتور - بيستخدم Professors/register-professor
               const registerData = {
    SSN: formData.ssn,
    Password: formData.password,
    ConfirmPassword: formData.confirmPassword,
    ProfessorType: professorType === 'internal' ? 'Internal' : 'External'
};

                await API.post('/Account/register-professor', registerData);
                // alert(`Registered successfully as ${professorType === 'internal' ? 'Internal' : 'External'} Professor!`);
            }

            navigate('/login');
        } catch (err) {
            const errorData = err.response?.data;

            if (Array.isArray(errorData)) {
                const code = errorData[0]?.code;
                const description = errorData[0]?.description;

                if (code === "DuplicateUserName" || code === "DuplicateEmail") {
                    setSsnError("This account is already registered.");
                } else if (code === "PasswordTooShort") {
                    setPasswordError("Password is too short.");
                } else if (code === "PasswordRequiresNonAlphanumeric") {
                    setPasswordError("Password must contain at least one special character.");
                } else if (code === "PasswordRequiresDigit") {
                    setPasswordError("Password must contain at least one number.");
                } else if (code === "PasswordRequiresUpper") {
                    setPasswordError("Password must contain at least one uppercase letter.");
                } else {
                    setPasswordError(description || "Registration failed. Please try again.");
                }

            } else if (errorData?.message) {
                setPasswordError(errorData.message);

            } else if (typeof errorData === "string") {
                // ✅ الـ backend بتاع register-professor بيرجع رسالة نصية زي
                // "SSN not found in Internal or External Professors records" أو "An account already exists for this SSN"
                setSsnError(errorData);

            } else if (errorData && typeof errorData === "object") {
                const firstKey = Object.keys(errorData)[0];
                const firstError = Array.isArray(errorData[firstKey])
                    ? errorData[firstKey][0]
                    : errorData[firstKey];
                setPasswordError(firstError || "Registration failed. Please check your data and try again.");

            } else {
                setPasswordError("Registration failed. Please check your data and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-transition flex min-h-screen items-center justify-center bg-[#f0f4f8] p-5 font-sans">
            <div className="flex h-[690px] w-full max-w-[1120px] overflow-hidden rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] animate-fadeIn">

                {/* LEFT IMAGE */}
                <div className="hidden md:flex md:w-[45%] items-center justify-center bg-[#f0f4f8] p-6">
                    <img src="../../images/2f4466b5-f0d1-4143-ab93-6f23e8a5aeb8.jpg" alt="Signup" className="w-full h-full object-cover rounded-l-[20px] shadow-md" />
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-[55%] bg-gradient-to-br from-[#3d6c8a] to-[#2b556f] p-7 text-white flex flex-col justify-center overflow-hidden">
                    <h1 className="text-3xl font-bold">Hello!</h1>
                    <p className="mt-1 mb-6 opacity-90">you can sign up here</p>

                    {/* Tabs */}
                    <div className="mb-5">
                        <div className="bg-white/6 p-1 rounded-xl inline-flex gap-1">
                            <button type="button" onClick={() => setSelectedTab('student')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedTab === 'student' ? 'bg-white text-[#0b3b48] shadow-sm' : 'text-white/90 hover:bg-white/10'}`}>
                                Student
                            </button>
                            <button type="button" onClick={() => setSelectedTab('professor')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedTab === 'professor' ? 'bg-white text-[#0b3b48] shadow-sm' : 'text-white/90 hover:bg-white/10'}`}>
                                Professor
                            </button>
                        </div>

                        {selectedTab === 'professor' && (
                            <div className="mt-3 flex items-center gap-3">
                                <div className="text-sm text-white/90">Professor type</div>
                                <div className="flex items-center gap-2 bg-white/6 p-1 rounded-full">
                                    <button type="button" onClick={() => setProfessorType('internal')} className={`px-3 py-1 rounded-full text-sm font-medium transition ${professorType === 'internal' ? 'bg-white text-[#0b3b48]' : 'text-white/80 hover:bg-white/8'}`}>
                                        Internal
                                    </button>
                                    <button type="button" onClick={() => setProfessorType('external')} className={`px-3 py-1 rounded-full text-sm font-medium transition ${professorType === 'external' ? 'bg-white text-[#0b3b48]' : 'text-white/80 hover:bg-white/8'}`}>
                                        External
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="border-white/20 mb-6" />

                    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-[15px]">

                        {/* SSN Input */}
                        <div className="flex w-full flex-col items-center">
                            <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">National ID (SSN):</label>
                            <input
                                type="text"
                                name="ssn"
                                placeholder="Enter 14-digit SSN"
                                value={formData.ssn}
                                maxLength={14}
                                className={`w-4/5 rounded-full border-2 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${ssnError ? "border-red-500" : "border-transparent"}`}
                                onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, ssn: numericValue });
                                }}
                            />
                            {ssnError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{ssnError}</span>}
                        </div>

                        {/* Password Input */}
                        <div className="flex w-full flex-col items-center">
                            <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">Password:</label>
                            <div className="relative w-4/5">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    className={`w-full rounded-full border-2 bg-white px-4 py-2.5 pr-12 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${passwordError ? "border-red-500" : "border-transparent"}`}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                {formData.password && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                                <path d="M12 5c-7 0-11 5.5-11 7s4 7 11 7 11-5.5 11-7-4-7-11-7Zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5Z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                                <path d="M12 5c-7 0-11 5.5-11 7 1.09 1.7 3.32 4.26 6.29 5.74L3.64 18.4 5 20l4.75-4.75C10.57 15.32 11.28 15.5 12 15.5c2.76 0 5-2.24 5-5 0-.72-.18-1.43-.5-2.03L19 7.19 17.55 5.75l-3.64 3.63C12.3 9.1 12.15 9 12 9c-1.93 0-3.5 1.57-3.5 3.5 0 .15.02.3.05.44L7.1 12.95C7.38 11.34 8.58 10 10.22 9.62L6.97 6.37 5.53 7.81 8.7 11c-.16.38-.25.79-.25 1.2 0 2.76 2.24 5 5 5 .41 0 .82-.09 1.2-.25l3.19 3.17L18.45 18.4 15.16 15.1C16.46 14.06 17.07 12.59 17.07 11c0-3.04-2.42-5.5-5.07-6.5L16.45 2.55 15 1.11 12 4.11l-2.35-2.35L8.5 1.11 12 4.61 15.5 1.1 14.05 2.55l-2.5 2.5C10.6 4.53 9.33 4 8 4 5.79 4 4 5.79 4 8c0 .93.29 1.8.8 2.53L2.1 13.23C1.4 12.07 1 10.55 1 8c0-2.49 2.5-6 11-6 8.5 0 11 3.51 11 6 0 2.55-.4 4.07-1.1 5.23l-2.69-2.7C18.71 10.8 19 9.93 19 9c0-2.21-1.79-4-4-4-1.33 0-2.6.53-3.55 1.39L12 5Zm0 4.5c1.93 0 3.5 1.57 3.5 3.5 0 .15-.02.3-.05.44L7.56 7.05C8.58 6.1 10.13 5.5 12 5.5Z" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                            {passwordError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{passwordError}</span>}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="flex w-full flex-col items-center">
                            <label className="w-4/5 text-left text-sm font-semibold text-white mb-1">Confirm Password:</label>
                            <div className="relative w-4/5">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Repeat your password"
                                    value={formData.confirmPassword}
                                    className={`w-full rounded-full border-2 bg-white px-4 py-2.5 pr-12 text-sm text-slate-700 outline-none transition-all focus:border-[#ffe600] ${confirmPasswordError ? "border-red-500" : "border-transparent"}`}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                {formData.confirmPassword && (
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                                <path d="M12 5c-7 0-11 5.5-11 7s4 7 11 7 11-5.5 11-7-4-7-11-7Zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5Z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                                <path d="M12 5c-7 0-11 5.5-11 7 1.09 1.7 3.32 4.26 6.29 5.74L3.64 18.4 5 20l4.75-4.75C10.57 15.32 11.28 15.5 12 15.5c2.76 0 5-2.24 5-5 0-.72-.18-1.43-.5-2.03L19 7.19 17.55 5.75l-3.64 3.63C12.3 9.1 12.15 9 12 9c-1.93 0-3.5 1.57-3.5 3.5 0 .15.02.3.05.44L7.1 12.95C7.38 11.34 8.58 10 10.22 9.62L6.97 6.37 5.53 7.81 8.7 11c-.16.38-.25.79-.25 1.2 0 2.76 2.24 5 5 5 .41 0 .82-.09 1.2-.25l3.19 3.17L18.45 18.4 15.16 15.1C16.46 14.06 17.07 12.59 17.07 11c0-3.04-2.42-5.5-5.07-6.5L16.45 2.55 15 1.11 12 4.11l-2.35-2.35L8.5 1.11 12 4.61 15.5 1.1 14.05 2.55l-2.5 2.5C10.6 4.53 9.33 4 8 4 5.79 4 4 5.79 4 8c0 .93.29 1.8.8 2.53L2.1 13.23C1.4 12.07 1 10.55 1 8c0-2.49 2.5-6 11-6 8.5 0 11 3.51 11 6 0 2.55-.4 4.07-1.1 5.23l-2.69-2.7C18.71 10.8 19 9.93 19 9c0-2.21-1.79-4-4-4-1.33 0-2.6.53-3.55 1.39L12 5Zm0 4.5c1.93 0 3.5 1.57 3.5 3.5 0 .15-.02.3-.05.44L7.56 7.05C8.58 6.1 10.13 5.5 12 5.5Z" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                            {confirmPasswordError && <span className="w-4/5 text-left text-xs font-bold text-red-400 mt-1">{confirmPasswordError}</span>}
                        </div>

                        {/* Checkbox & Button Container */}
                        <div className="mt-2 flex flex-col gap-4 w-4/5">
                            <label className="flex items-center gap-3 text-white cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} className="absolute opacity-0 w-full h-full cursor-pointer z-10" />
                                    <div className={`w-full h-full border-2 border-white rounded-full transition-all duration-300 flex items-center justify-center ${formData.agree ? "bg-white" : "bg-transparent"}`}>
                                        {formData.agree && (
                                            <svg className="w-3.5 h-3.5 text-[#2f5d73] animate-in zoom-in duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[13px] select-none">
                                    I agree to the <span className="underline font-bold">Terms</span> and <span className="underline font-bold">Privacy</span>
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-1/2 mx-auto rounded-full bg-white py-3 text-base font-bold text-[#3d6c8a] shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-70"
                            >
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-white/70 text-[14px] mt-6">
                        Already have an account?
                        <button onClick={() => navigate('/login')} className="ml-1 font-bold text-[#ffe600] hover:underline cursor-pointer">Sign In</button>
                    </p>
                </div>
            </div>

            <style>{`
                .page-transition {
                    animation: fadeInUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.8s ease-in-out; }
            `}</style>
        </div>
    );
}