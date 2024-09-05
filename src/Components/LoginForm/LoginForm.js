import React, { useState, useEffect } from "react";
import './LoginForm.css';
import { FaLock } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300);  // 5 minutes for OTP validity
  const [loading, setLoading] = useState(false); // For loading animation
  const navigate = useNavigate();

  useEffect(() => {
    if (showOtpPage && timer > 0) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [showOtpPage, timer]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (validateEmail(email)) {
      try {
        const response = await axios.post("http://localhost:8080/apii/login.php", {
          email,
          password,
        });

        if (response.data.success) {
          setShowOtpPage(true);
          setRole(response.data.role);
          setError('');
        } else {
          setError(response.data.message || "Invalid credentials");
          setShowOtpPage(false);
        }
      } catch (error) {
        console.error(error);
        setError("Error during login");
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a valid email address.');
      setLoading(false);
    }
  };

  const handleOtpVerification = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/apii/verifyOtp.php", {
        email,
        otp,
      });

      if (response.data.success) {
        if (role === "admin") {
          navigate("/admin-page");
        } else if (role === "user") {
          navigate("/user-page");
        }
      } else {
        setError(response.data.message || "Invalid OTP");
        // Refresh the OTP field or reset the form
        setOtp('');
      }
    } catch (error) {
      console.error(error);
      setError("Error during OTP verification");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div className="login-page"> 
    <div className='wrapper'>
      <form onSubmit={showOtpPage ? handleOtpVerification : handleLogin}>
        <h1>{showOtpPage ? 'Enter OTP' : 'Login'}</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder='E-mail ID'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={showOtpPage}  // Disable when OTP page is shown
          />
          <CgMail />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={showOtpPage}  // Disable when OTP page is shown
          />
          <FaLock />
        </div>
        {showOtpPage && (
          <div className="input-box">
            <input
              type="text"
              placeholder='OTP'
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btnn" disabled={loading}>
          {loading ? 'Loading...' : (showOtpPage ? 'Verify OTP' : 'Login')}
        </button>
        {showOtpPage && <p>OTP will expire in: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</p>}
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
