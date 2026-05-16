import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const VerifyCode = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]); 
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        
        // Update the OTP array
        const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
        setOtp(newOtp);
        setError(false);

        // Move focus to next input if value is entered
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move focus to previous input on backspace if current field is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        const code = otp.join("");
        
        if (code.length < 6) {
            setError(true);
            return;
        }

        setLoading(true);

        // Mock API Call
        setTimeout(() => {
            if (code === "123456") { // Example Success Code
                navigate("/reset-password");
            } else {
                setError(true);
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="verify-page">
            <style>{`
                .verify-page {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(-45deg, #f8fafc, #dbeafe, #f1f5f9, #e2e8f0);
                    background-size: 400% 400%;
                    animation: gradient 10s ease infinite;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .verify-card {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    width: 400px;
                    text-align: center;
                }
                .otp-box {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin: 20px 0;
                }
                .otp-box input {
                    width: 45px;
                    height: 55px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    outline: none;
                    transition: 0.3s;
                }
                .otp-box input:focus { 
                    border-color: #3d6c8a; 
                    box-shadow: 0 0 10px rgba(61,108,138,0.2); 
                }
                .input-error { 
                    border-color: #ef4444 !important; 
                    background: #fef2f2; 
                }
                .error-msg { 
                    color: #ef4444; 
                    font-size: 13px; 
                    font-weight: bold; 
                    margin-bottom: 15px; 
                    display: block; 
                }
                .v-btn {
                    width: 100%;
                    padding: 12px;
                    background: #3d6c8a;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: opacity 0.3s;
                }
                .v-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>

            <div className="verify-card">
                <h2>Check your email</h2>
                <p style={{color: '#64748b', fontSize: '14px'}}>We've sent a code to your email</p>
                
                <form onSubmit={handleVerify}>
                    <div className="otp-box">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={error ? "input-error" : ""}
                            />
                        ))}
                    </div>

                    {error && <span className="error-msg">⚠️ Invalid code. Try again.</span>}

                    <button type="submit" className="v-btn" disabled={loading}>
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>

                <Link to="/" style={{display: 'block', marginTop: '20px', color: '#3d6c8a', textDecoration: 'none'}}>
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default VerifyCode;