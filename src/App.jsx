import React, { useState } from 'react';
import { StoreProvider, useStore } from './StoreContext';
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
  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
}
