import React, { useState } from 'react';
import { useStore } from '../StoreContext';

export default function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Load credentials from environment variables securely
    const validEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password123';
    
    if (email === validEmail && password === validPassword) {
      login({ username: email });
    } else {
      setError('Invalid email or password');
    }
  };


  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-header">
           <h1 className="logo login-logo">KeyTrack</h1>
           <p className="login-subtitle">Sign in to your account</p>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}
