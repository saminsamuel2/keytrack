import React, { useState } from 'react';
import { useStore } from '../StoreContext';

export default function Login() {
  const { login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'samin' && password === 'samin123') {
      login({ username: 'Samin' });
    } else {
      setError('Invalid credentials');
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
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
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
