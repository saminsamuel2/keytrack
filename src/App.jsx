import React, { useState } from 'react';
import { StoreProvider, useStore } from './StoreContext';
import { isSupabaseConfigured } from './supabaseClient';
import Login from './components/Login';
import StudentsTab from './components/StudentsTab';
import AttendanceTab from './components/AttendanceTab';
import FeesTab from './components/FeesTab';
import MonthlyReviewTab from './components/MonthlyReviewTab';
import { Users, CalendarCheck, CreditCard, BarChart } from 'lucide-react';

function AppLayout() {
  const { user, logout } = useStore();
  const [activeTab, setActiveTab] = useState('students');

  if (!user) {
    return <Login />;
  }

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="logo">KeyTrack</h1>
          <div className="profile-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{user.username}</span>
            <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={logout}>Sign Out</button>
          </div>
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users size={20} />
              <span>Students</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <CalendarCheck size={20} />
              <span>Attendance</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('fees')}
            >
              <CreditCard size={20} />
              <span>Fees</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'monthlyReview' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthlyReview')}
            >
              <BarChart size={20} />
              <span>Monthly Review</span>
            </button>
          </nav>
        </aside>

        <main className="content-area">
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'attendance' && <AttendanceTab />}
          {activeTab === 'fees' && <FeesTab />}
          {activeTab === 'monthlyReview' && <MonthlyReviewTab />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Action Required: Supabase Variables Missing</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
          Your Vercel deployment is missing the required environment variables to connect to your database.
        </p>
        <div style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '1.5rem', borderRadius: '8px', textAlign: 'left', marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
          <h3 style={{ marginTop: 0 }}>How to fix:</h3>
          <ol style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
            <li style={{ marginBottom: '0.8rem' }}>Go to your Vercel Dashboard for this project.</li>
            <li style={{ marginBottom: '0.8rem' }}>Go to <b>Settings &gt; Environment Variables</b>.</li>
            <li style={{ marginBottom: '0.8rem' }}>Add <code>VITE_SUPABASE_URL</code> and paste your Supabase URL.</li>
            <li style={{ marginBottom: '0.8rem' }}>Add <code>VITE_SUPABASE_ANON_KEY</code> and paste your Supabase Anon Key.</li>
            <li>Go to the Deployments tab and click <b>Redeploy</b>.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
}
