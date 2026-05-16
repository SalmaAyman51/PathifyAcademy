import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // متنسيش تتأكدي إن الـ URL جوه الملف ده مظبوط على بورت سلمى

export default function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // الـ State الأصلية بتاعتك
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        phone1: "", 
        gender: "",
        birthDay: "",
        birthMonth: "",
        birthYear: "",
        ssn: "",
        enrollmentYear: "",
        gpa: "",
        academicLevel: "",
        studentId: "",
        levelId: "", 
        agree: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // التحققات (Validations) بتاعتك
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return setError("Enter a valid email address");
        if (formData.email !== formData.confirmEmail) return setError("Emails do not match");
        if (formData.password.length < 8) return setError("Password must be at least 8 characters");
        if (!/[A-Z]/.test(formData.password)) return setError("Password must contain at least one uppercase letter");
        if (!/[0-9]/.test(formData.password)) return setError("Password must contain at least one number");
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
        
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test(formData.phone1)) return setError("Enter a valid Egyptian phone number");
        if (!/^\d{14}$/.test(formData.ssn)) return setError("SSN must be exactly 14 digits");

        const gpaValue = parseFloat(formData.gpa);
        if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) return setError("GPA must be between 0 and 4");
        if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) return setError("Please enter your full birthdate");
        if (!formData.firstName || !formData.lastName) return setError("Enter your full name");
        if (!formData.enrollmentYear) return setError("Please complete academic data");
        if (!formData.agree) return setError("Please agree to the terms");

        setLoading(true);

        try {
            // التعديل هنا: تحويل البيانات للـ Data Types اللي في الـ DTO بالظبط
            const registerData = {
                ssn: formData.ssn, // string
                studentId: parseInt(formData.studentId) || 0, // تم تحويله لـ int
                firstName: formData.firstName, // string
                lastName: formData.lastName, // string
                email: formData.email, // string
                password: formData.password, // string
                phoneNumber: formData.phone1, // string
                // تجميع الـ DateOnly بالتنسيق المطلوب YYYY-MM-DD
                birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`, 
                gender: formData.gender === "male" ? "Male" : "Female", // الحرف الأول Capital ليتطابق مع الـ Regular Expression
                enrollmentYear: formData.enrollmentYear ? parseInt(formData.enrollmentYear) : null, // تم تحويله لـ int
                gpa: formData.gpa ? parseFloat(formData.gpa) : null, // تم تحويله لـ decimal/float
                academicLevel: formData.academicLevel || null, // string
                levelId: formData.levelId ? parseInt(formData.levelId) : null, // تم تحويله لـ int
                role: "Student", // ثابت
                currentSemester: "first semester" // ضفناه احتياطي بناءً على الـ DTO
            };

            // الإرسال الفعلي
            await API.post('/Account/register', registerData);

            alert("Registered successfully! Data saved to Database.");
            navigate('/login');
        } catch (err) {
    const errorData = err.response?.data;

    // لو الـ backend بعت array من الـ errors زي Identity errors
    if (Array.isArray(errorData)) {
        const code = errorData[0]?.code;
        const description = errorData[0]?.description;

        if (code === "DuplicateUserName" || code === "DuplicateEmail") {
            setError("This email is already registered. Please use a different email.");
        } else if (code === "PasswordTooShort") {
            setError("Password is too short.");
        } else if (code === "PasswordRequiresNonAlphanumeric") {
            setError("Password must contain at least one special character.");
        } else if (code === "PasswordRequiresDigit") {
            setError("Password must contain at least one number.");
        } else if (code === "PasswordRequiresUpper") {
            setError("Password must contain at least one uppercase letter.");
        } else {
            setError(description || "Registration failed. Please try again.");
        }

    // لو الـ backend بعت object فيه message
    } else if (errorData?.message) {
        setError(errorData.message);

    // لو string عادي
    } else if (typeof errorData === "string") {
        setError(errorData);

    // أي حاجة تانية
    } else {
        setError("Registration failed. Please check your data and try again.");
    }
} finally {
    setLoading(false);
}
    };

    return (
        <div className="page-transition flex min-h-screen items-center justify-center bg-[#f0f4f8] p-5 font-sans">
            <div className="flex h-[650px] w-full max-w-[1100px] overflow-hidden rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] animate-fadeIn">

                {/* LEFT IMAGE */}
                <div className="hidden flex-1 items-center justify-center bg-[#f0f4f8] p-10 md:flex">
                    <img src="../../images/2f4466b5-f0d1-4143-ab93-6f23e8a5aeb8.jpg" alt="Signup" className="max-w-full h-auto rounded-lg shadow-md" />
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-3/5 bg-[#3d6c8a] p-7 text-white overflow-hidden">
                    <h1 className="text-3xl font-bold">Hello!</h1>
                    <p className="mt-1 mb-6 opacity-90">you can sign up here</p>

                    <div className="flex gap-3 mb-4">
                        <button type="button" className="flex-1 cursor-pointer bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 rounded-full flex items-center justify-center gap-2 transition">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" /> Google
                        </button>
                        <button type="button" className="flex-1 cursor-pointer bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 rounded-full flex items-center justify-center gap-2 transition">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="FB" className="w-4 h-4" /> Facebook
                        </button>
                    </div>

                    <hr className="border-white/20 mb-6" />

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-3 gap-4">
                            <input name="firstName" placeholder="First Name" className="input" onChange={handleChange} />
                            <input name="lastName" placeholder="Last Name" className="input" onChange={handleChange} />
                            <input name="email" placeholder="Email Address" className="input" onChange={handleChange} />
                            <input name="confirmEmail" placeholder="Confirm Email" className="input" onChange={handleChange} />
                            <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} />
                            <input type="password" name="confirmPassword" placeholder="Repeat Password" className="input" onChange={handleChange} />
                            <input name="phone1" placeholder="Phone Number" className="input" onChange={handleChange} />
                            <input name="ssn" placeholder="SSN (14 digits)" className="input" maxLength={14} onChange={handleChange} />
                            <input name="studentId" placeholder="Student ID" className="input" onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <input name="gpa" placeholder="GPA" className="input" onChange={handleChange} />
                            <input name="levelId" placeholder="Level ID" className="input" onChange={handleChange} />
                            <select name="academicLevel" className="input text-xs w-full text-black" onChange={handleChange}>
                                <option value="">Academic Level</option>
                                <option>Level 1</option>
                                <option>Level 2</option>
                                <option>Level 3</option>
                                <option>Level 4</option>
                            </select>
                        </div>

                        {/* Birthdate */}
                        <div className="grid grid-cols-[auto_1.1fr_1.1fr_1.1fr_2.8fr] gap-9 items-center">
                            <p className="text-sm font-bold whitespace-nowrap">Birthdate:</p>
                            <input name="birthDay" placeholder="Day" className="input text-xs" onChange={handleChange} />
                            <input name="birthMonth" placeholder="Month" className="input text-xs" onChange={handleChange} />
                            <input name="birthYear" placeholder="Year" className="input text-xs" onChange={handleChange} />
                            <input name="enrollmentYear" placeholder="Enrollment Year" className="input" onChange={handleChange} />
                        </div>

                        {/* Gender */}
                        <div className="mt-4 flex items-center gap-15 text-white">
                            <span className="text-sm font-bold whitespace-nowrap opacity-90">Gender:</span>
                            <div className="flex bg-white/10 p-1 rounded-full border border-white/20 backdrop-blur-sm gap-1">
                                <label className={`flex items-center gap-2 px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300 ${formData.gender === "male" ? "bg-white text-[#2f5d73] shadow-lg" : "hover:bg-white/5"}`}>
                                    <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} className="hidden" />
                                    <i className={`fas fa-mars text-xs ${formData.gender === "male" ? "text-[#2f5d73]" : "text-blue-300"}`}></i>
                                    <span className="text-xs font-bold uppercase tracking-wider">Male</span>
                                </label>
                                <label className={`flex items-center gap-2 px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300 ${formData.gender === "female" ? "bg-white text-[#2f5d73] shadow-lg" : "hover:bg-white/5"}`}>
                                    <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} className="hidden" />
                                    <i className={`fas fa-venus text-xs ${formData.gender === "female" ? "text-[#2f5d73]" : "text-blue-300"}`}></i>
                                    <span className="text-xs font-bold uppercase tracking-wider">Female</span>
                                </label>
                            </div>
                        </div>

                        {/* Checkbox */}
                        <div className="mt-2">
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
                                className="w-1/2 mx-auto py-3 text-base w-fit px-12 mx-auto block mt-3 mb-0 bg-white text-[#2f5d73] py-2 rounded-full font-bold text-sm transition-all duration-300 ease-in-out hover:bg-[#2f5d73] hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 cursor-pointer border border-transparent hover:border-white/50"
                            >
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                        </div>

                        {error && (
                            <p className="text-[12px] text-red-300 font-medium mt-1 text-center">
                                {error}
                            </p>
                        )}
                    </form>
                    
                    <p className="text-center text-white/70 text-[14px] mt-3">
                        Already have an account?
                        <button onClick={() => navigate('/login')} className="ml-1 font-bold text-[#ffe600] hover:underline cursor-pointer">Sign In</button>
                    </p>
                </div>
            </div>

            <style>{`
                .input {
                    width: 100%;
                    padding: 7px 15px;
                    border-radius: 9999px;
                    border: none;
                    outline: none;
                    background-color: white;
                    color: #374151;
                    font-size: 0.875rem;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 0 0 2px #1f6f8b;
                }
                .input:focus {
                    box-shadow: 0 0 0 2px white;
                }
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