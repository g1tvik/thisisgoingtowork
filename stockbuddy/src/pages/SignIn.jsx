import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

const SignIn = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign in failed");
      // Save token (localStorage, cookie, etc.)
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true); // <-- This updates the NavBar!
      // Redirect to home or dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google sign in failed");
      
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign in failed. Please try again.");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card p-4 shadow bg-dark text-light">
            <h2 className="mb-4 text-center">Sign In</h2>
            
            {/* Google Sign-In Button */}
            <div className="mb-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>
            
            <div className="text-center mb-4">
              <span className="text-muted">or</span>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button type="submit" className="btn btn-light w-100 fw-bold mb-3">Sign In</button>
              <div className="text-center">
                <small className="text-muted">
                  Don't have an account? <Link to="/signup" className="text-light">Sign up</Link>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 